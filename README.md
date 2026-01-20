# Cloud SQL Query History

A Chrome extension to capture and save SQL queries from Google Cloud SQL Studio. Displays query history in a side panel beside your page.

## Features

- **Automatic capture** - Queries are saved automatically when you click the Run button
- **Side panel UI** - View history in a panel beside your page (no popups)
- **Live updates** - Side panel updates automatically when queries are captured
- Query history grouped by day (Today, Yesterday, or date)
- Copy queries to clipboard
- Delete individual queries or clear all history
- Stores up to 30,000 queries

## Installation (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`

2. Enable **Developer mode** by toggling the switch in the top right corner

3. Click **Load unpacked**

4. Select this folder (`cloudsql-history`)

5. The extension icon should appear in your Chrome toolbar

## Usage

1. Navigate to [Cloud SQL Studio](https://console.cloud.google.com/sql) in Google Cloud Console

2. Click the extension icon to open the side panel

3. Write and run queries - they are automatically captured

4. The side panel shows your query history grouped by day:
   - **Copy** - Copy a query to clipboard
   - **Delete** - Remove a specific query
   - **Capture** - Manually capture the current query
   - **Clear** - Remove all history

## Testing

### Basic Test

1. Load the extension in developer mode (see Installation above)

2. Go to https://console.cloud.google.com/sql and open any Cloud SQL instance

3. Click the extension icon to open the side panel

4. Navigate to **SQL Studio** or **Query editor**

5. Type and run a query - it should appear in the side panel automatically

### Test Cases

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Open side panel | Click extension icon | Side panel opens beside page |
| Auto capture | Type query, click Run button | Query appears in side panel |
| Manual capture | Click Capture in side panel | Query saved to history |
| Copy query | Click Copy button | Query copied to clipboard |
| Delete query | Click Delete button | Query removed from list |
| Clear history | Click Clear button | All queries removed |

## Files

```
cloudsql-history/
├── manifest.json     # Extension configuration
├── content.js        # Auto-capture on Run button click
├── sidepanel.html    # Side panel UI
├── sidepanel.css     # Side panel styles
├── sidepanel.js      # Side panel logic
├── background.js     # Service worker (handles saving & side panel)
├── icons/            # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Troubleshooting

### Side panel not opening
- Make sure you're using Chrome 114 or later (side panel API required)
- Try reloading the extension at `chrome://extensions/`

### "No query found in editor"
- Make sure you're on the Cloud SQL Studio page with the query editor visible
- The editor must have a `textarea[role="textbox"]` element

### Queries not auto-capturing
- Check the browser console for errors
- Reload the Cloud SQL Studio page after installing the extension

### Queries not persisting
- Chrome storage is used; clearing browser data may remove history
- Check if the extension has storage permission in `chrome://extensions/`

## Development

To modify the extension:

1. Edit the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card to reload
