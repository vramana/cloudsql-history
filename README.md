# Cloud SQL Query History

A Chrome extension to capture and save SQL queries from Google Cloud SQL Studio.

## Features

- **Automatic capture** - Queries are saved automatically when you click the Run button
- Manual capture option via the extension popup
- Store query history locally in Chrome storage
- Copy queries to clipboard
- Delete individual queries or clear all history
- Keeps the last 100 queries

## Installation (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`

2. Enable **Developer mode** by toggling the switch in the top right corner

3. Click **Load unpacked**

4. Select this folder (`cloudsql-history`)

5. The extension icon should appear in your Chrome toolbar

## Usage

1. Navigate to [Cloud SQL Studio](https://console.cloud.google.com/sql) in Google Cloud Console

2. Open the SQL editor and write or paste your query

3. Click the **Run** button - your query is automatically captured

4. To view history, click the extension icon in the Chrome toolbar

5. Your query history will appear with options to:
   - **Copy** - Copy the query to clipboard
   - **Delete** - Remove a specific query from history
   - **Capture Query** - Manually capture the current query

## Testing

### Basic Test

1. Load the extension in developer mode (see Installation above)

2. Go to https://console.cloud.google.com/sql and open any Cloud SQL instance

3. Navigate to **SQL Studio** or **Query editor**

4. Type a test query like:
   ```sql
   SELECT * FROM users LIMIT 10;
   ```

5. Click the extension icon and click **Capture Query**

6. Verify the query appears in the history list

### Test Cases

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Auto capture | Type query, click Run button | Query automatically saved |
| Manual capture | Click extension, click Capture | Query saved to history |
| Copy query | Click Copy button | Query copied to clipboard |
| Delete query | Click Delete button | Query removed from list |
| Clear history | Click Clear History | All queries removed |

## Files

```
cloudsql-history/
├── manifest.json     # Extension configuration
├── content.js        # Auto-capture on Run button click
├── popup.html        # Extension popup UI
├── popup.css         # Popup styles
├── popup.js          # Popup logic
├── background.js     # Service worker (handles saving)
├── icons/            # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Troubleshooting

### "No query found in editor"
- Make sure you're on the Cloud SQL Studio page with the query editor visible
- The editor must have a `textarea[role="textbox"]` element

### Extension not working after Chrome update
- Go to `chrome://extensions/`
- Click the refresh icon on the extension card
- Or remove and re-load the extension

### Queries not persisting
- Chrome storage is used; clearing browser data may remove history
- Check if the extension has storage permission in `chrome://extensions/`

## Development

To modify the extension:

1. Edit the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card to reload
