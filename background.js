// Background service worker for Cloud SQL Query History extension

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Cloud SQL Query History extension installed');
});

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'SAVE_QUERY') {
    saveQuery(message.query);
  }
});

async function saveQuery(query) {
  const { history = [] } = await chrome.storage.local.get('history');

  const entry = {
    id: Date.now(),
    query: query,
    timestamp: new Date().toISOString()
  };

  history.unshift(entry);

  // Keep only last 30k queries
  if (history.length > 30000) {
    history.pop();
  }

  await chrome.storage.local.set({ history });
  console.log('[CloudSQL History] Query saved');
}
