// Injected into page's main world to intercept XHR and fetch
(function() {
  console.log('[CloudSQL History] Installing interceptors...');

  // Intercept XMLHttpRequest
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(body) {
    if (this._url && this._url.includes('SqlEntityService') && body) {
      try {
        const parsed = JSON.parse(body);
        const sql = parsed?.variables?.request?.sqlStatement;
        if (sql && sql.trim()) {
          console.log('[CloudSQL History] Captured from XHR');
          window.postMessage({ type: 'CLOUDSQL_QUERY_CAPTURED', query: sql }, '*');
        }
      } catch (e) {}
    }
    return origSend.apply(this, arguments);
  };

  // Intercept fetch
  const origFetch = window.fetch;
  window.fetch = function(url, options) {
    if (url && url.includes && url.includes('SqlEntityService') && options?.body) {
      try {
        const parsed = JSON.parse(options.body);
        const sql = parsed?.variables?.request?.sqlStatement;
        if (sql && sql.trim()) {
          console.log('[CloudSQL History] Captured from fetch');
          window.postMessage({ type: 'CLOUDSQL_QUERY_CAPTURED', query: sql }, '*');
        }
      } catch (e) {}
    }
    return origFetch.apply(this, arguments);
  };

  console.log('[CloudSQL History] Interceptors active');
})();
