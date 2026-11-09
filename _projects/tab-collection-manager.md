---
title: Tab Collection Manager
summary: A Chrome extension that replaces the new tab page with a place to save groups of tabs and open them again later
started: 2025-04-01
updated: 2025-04-12
type: browser-extension
stack:
  - JavaScript
  - Chrome Extension APIs
  - IndexedDB
  - SortableJS
tags:
  - developer-tools
  - productivity
  - automation
loc: 6400
files: 30
architecture:
  auth: none
  database: IndexedDB
  api: none
  realtime: none
  background: none
  cache: in-memory
  search: none
---

## Overview

Tab Collection Manager (TCM) is a Chrome and Edge extension that replaces the new tab page with a place to save groups of tabs and open them again later.
Saved tabs go into collections, and collections into libraries.
It's on the Chrome Web Store.

It's plain JavaScript on Manifest V3, with no framework and no build step.
The data lives in IndexedDB, and every change goes through the service worker, which then tells every open new tab page to reload its data, so they all show the same thing.

## Screenshots

<!-- SCREENSHOT: New Tab page showing the main interface with left sidebar (libraries), center grid (collections with tabs), and right sidebar (active browser windows) -->
![Main Interface](/images/projects/tab-collection-manager/screenshot-1.png)

<!-- SCREENSHOT: Drag-and-drop action - dragging a tab from the active windows sidebar into a collection card -->
![Drag and Drop](/images/projects/tab-collection-manager/screenshot-2.png)

<!-- SCREENSHOT: Browser action popup showing quick-save options for current tab or all window tabs -->
![Popup Quick Actions](/images/projects/tab-collection-manager/screenshot-3.png)

## Problem

I always end up with lots of tabs open when I'm deep in a topic or working with some set of tools, and moving from one topic to the next leaves a pile of them.
Sometimes I want to close them and get back to them later, or save a group of related links for a project.
Browsers have bookmarks, but no good way to save a whole set of tabs and bring it back, so the fallback is leaving windows open.

I used the Toby Tabs extension for this for years, and it was free.
Sometime in 2024 Toby started deprecating features to push people onto its paid Pro plan.
I'm not having it, and Chrome extensions are a joke to create, so I made my own.
It took me one day.
It has every feature Toby does except sync, and it's snappier than Toby.
The other tab collection extensions I've seen all get bloated with features.

## Approach

### Stack

- Plain JavaScript with ES modules, no framework.
- IndexedDB for the saved data, with indexes for collections by library and tabs by collection. It can hold thousands of saved tabs without running into chrome.storage quotas.
- Chrome extension APIs on Manifest V3. A service worker handles every data change, and the tabs and windows APIs keep track of what's open.
- SortableJS for drag and drop, both for reordering and for moving tabs between collections.

### Challenges

- Several new tab pages can be open at once, and a change made in one has to show up in all of them. Each new tab page registers its tab ID with the service worker, which keeps the IDs in a Set and sends a `dataUpdated` message to each one after every change.
- A Manifest V3 service worker isn't a persistent background page. It can be shut down at any time, and anything in its memory goes with it. So IndexedDB is the only source of truth, and the service worker just reacts to events without holding state of its own.
- Dragging a tab from the open-windows pane into a collection needed two SortableJS groups to cooperate. The source group uses `pull: 'clone'`, and a custom `onAdd` handler creates the saved tab and can close the original browser tab.

## Outcomes

There's nothing to set up: installing it replaces the new tab page.
The page has three panes, with libraries on the left, the current library's collections and tabs in the middle, and the open browser windows and their tabs on the right.
Libraries hold collections, and collections hold tabs.
Tabs are animated as they're added and removed.

Everything can be imported and exported as JSON.
One of the export buttons doesn't work, but you can still export everything.

There's no sync.
Saved collections stay in the browser that saved them.
I could build it, but there were trade-offs I didn't care about enough.

## Implementation Notes

### Data Model

Each level keeps an array of its children's IDs, which holds the order the user arranged them in:

```javascript
Library {
  id, name, color, createdAt,
  collectionOrder: [collectionId, ...]  // User-defined order
}

Collection {
  id, libraryId, name, color, createdAt, lastModifiedAt,
  tabOrder: [tabId, ...]  // User-defined order
}

Tab {
  id, collectionId, title, url, faviconUrl, createdAt
}
```

### Message-Passing Architecture

Every data change goes through the service worker, which then notifies each open new tab page:

```javascript
// UI sends action request
chrome.runtime.sendMessage({ 
  action: 'addTabToCollection', 
  collectionId, tab 
});

// Service Worker processes and broadcasts
export const activeNewTabIds = new Set();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Process action...
  // Then notify all active new tab pages
  for (const tabId of activeNewTabIds) {
    chrome.tabs.sendMessage(tabId, { action: 'dataUpdated' });
  }
});
```

### Dual Update Strategy

The new tab page updates in two ways:

- Collapsing or expanding a collection changes the DOM directly and saves the state to `chrome.storage.sync`.
- Any data change clears the cache and re-renders from the stored data.

Collapsing happens often and changes no saved data, so it skips the reload.
Data changes always reload, so every page matches what's stored.
