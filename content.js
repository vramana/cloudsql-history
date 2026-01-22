// Content script for Cloud SQL Query History
// Injects interceptor into page's main world to capture SQL queries

(function() {
  console.log('[CloudSQL History] Content script loaded');

  // Save query directly to storage
  async function saveQuery(query) {
    const { history = [] } = await chrome.storage.local.get('history');
    const entry = {
      id: Date.now(),
      query: query,
      timestamp: new Date().toISOString()
    };
    history.unshift(entry);
    if (history.length > 30000) history.pop();
    await chrome.storage.local.set({ history });
    console.log('[CloudSQL History] Saved query (' + query.length + ' chars):', query.substring(0, 50) + '...');
  }

  // Listen for messages from the injected script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data?.type === 'CLOUDSQL_QUERY_CAPTURED') {
      saveQuery(event.data.query);
    }
  });

  // Inject script into page's main world via src
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js');
  script.onload = () => script.remove();
  document.documentElement.appendChild(script);
})();
