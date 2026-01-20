// Content script for Cloud SQL Query History
// Automatically captures queries when Run button is clicked

(function() {
  console.log('[CloudSQL History] Content script loaded');

  // Listen for clicks on the Run button
  document.addEventListener('click', async (event) => {
    const runButton = event.target.closest('fr-database-studio-query-button');

    if (runButton) {
      console.log('[CloudSQL History] Run button clicked');

      // Small delay to ensure query is finalized
      setTimeout(() => captureQuery(), 100);
    }
  }, true);

  function captureQuery() {
    const editorTextarea = document.querySelector('textarea[role="textbox"]');
    const query = editorTextarea ? editorTextarea.value : null;

    if (query && query.trim()) {
      console.log('[CloudSQL History] Captured query:', query.substring(0, 50) + '...');

      // Send to background script to save
      chrome.runtime.sendMessage({
        type: 'SAVE_QUERY',
        query: query
      });
    }
  }
})();
