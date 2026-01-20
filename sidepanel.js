document.addEventListener('DOMContentLoaded', () => {
  const captureBtn = document.getElementById('captureBtn');
  const clearBtn = document.getElementById('clearBtn');
  const statusEl = document.getElementById('status');
  const historyList = document.getElementById('historyList');

  loadHistory();

  // Reload history when storage changes (auto-capture from content script)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.history) {
      loadHistory();
    }
  });

  captureBtn.addEventListener('click', captureQuery);
  clearBtn.addEventListener('click', clearHistory);

  async function captureQuery() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.url.includes('console.cloud.google.com')) {
        showStatus('Navigate to Cloud SQL Studio first', 'error');
        return;
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractQuery
      });

      const query = results[0]?.result;

      if (query && query.trim()) {
        await saveQuery(query);
        showStatus('Query captured!', 'success');
        loadHistory();
      } else {
        showStatus('No query found in editor', 'error');
      }
    } catch (err) {
      showStatus('Error: ' + err.message, 'error');
    }
  }

  function extractQuery() {
    const editorTextarea = document.querySelector('textarea[role="textbox"]');
    return editorTextarea ? editorTextarea.value : null;
  }

  async function saveQuery(query) {
    const { history = [] } = await chrome.storage.local.get('history');

    const entry = {
      id: Date.now(),
      query: query,
      timestamp: new Date().toISOString()
    };

    history.unshift(entry);

    if (history.length > 100) {
      history.pop();
    }

    await chrome.storage.local.set({ history });
  }

  async function loadHistory() {
    const { history = [] } = await chrome.storage.local.get('history');

    if (history.length === 0) {
      historyList.innerHTML = '<div class="empty-state">No queries captured yet.<br><br>Run a query in Cloud SQL Studio and it will appear here.</div>';
      return;
    }

    const grouped = groupByDay(history);

    let html = '';
    for (const [dayKey, entries] of Object.entries(grouped)) {
      html += `<div class="day-group">`;
      html += `<div class="day-header">${formatDayHeader(dayKey)}</div>`;
      html += `<div class="day-queries">`;

      for (const entry of entries) {
        html += `
          <div class="history-item" data-id="${entry.id}">
            <div class="history-item-header">
              <span class="history-item-time">${formatTime(entry.timestamp)}</span>
              <div class="history-item-actions">
                <button class="copy-btn" data-query="${encodeURIComponent(entry.query)}">Copy</button>
                <button class="delete-btn" data-id="${entry.id}">Delete</button>
              </div>
            </div>
            <div class="history-item-query">${escapeHtml(entry.query)}</div>
          </div>
        `;
      }

      html += `</div></div>`;
    }

    historyList.innerHTML = html;

    historyList.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = decodeURIComponent(btn.dataset.query);
        navigator.clipboard.writeText(query);
        showStatus('Copied!', 'success');
      });
    });

    historyList.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteEntry(parseInt(btn.dataset.id)));
    });
  }

  function groupByDay(history) {
    const groups = {};

    for (const entry of history) {
      const date = new Date(entry.timestamp);
      const dayKey = date.toISOString().split('T')[0];

      if (!groups[dayKey]) {
        groups[dayKey] = [];
      }
      groups[dayKey].push(entry);
    }

    return groups;
  }

  function formatDayHeader(dayKey) {
    const date = new Date(dayKey + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayKey = today.toISOString().split('T')[0];
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    if (dayKey === todayKey) {
      return 'Today';
    } else if (dayKey === yesterdayKey) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  async function deleteEntry(id) {
    const { history = [] } = await chrome.storage.local.get('history');
    const filtered = history.filter(e => e.id !== id);
    await chrome.storage.local.set({ history: filtered });
    loadHistory();
  }

  async function clearHistory() {
    await chrome.storage.local.set({ history: [] });
    loadHistory();
    showStatus('History cleared', 'success');
  }

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;
    setTimeout(() => {
      statusEl.className = 'status';
    }, 2000);
  }

  function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
