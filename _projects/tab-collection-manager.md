---
title: Tab Collection Manager
summary: Chrome extension that replaces New Tab with a powerful session manager for saving, organizing, and restoring tab groups
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

Tab Collection Manager (TCM) is a Chrome/Edge browser extension that transforms the new tab page into a comprehensive session management system. It enables users to save groups of browser tabs as "collections" organized within hierarchical "libraries," making it easy to preserve research sessions, project contexts, or frequently-used tab groups for later restoration.

Built with vanilla JavaScript and modern Manifest V3 architecture, TCM prioritizes performance and simplicity. The extension uses IndexedDB for scalable local storage and implements a message-passing architecture between the service worker and UI components for data consistency across all open new tab instances.

## Screenshots

<!-- SCREENSHOT: New Tab page showing the main interface with left sidebar (libraries), center grid (collections with tabs), and right sidebar (active browser windows) -->
![Main Interface](/images/projects/tab-collection-manager/screenshot-1.png)

<!-- SCREENSHOT: Drag-and-drop action - dragging a tab from the active windows sidebar into a collection card -->
![Drag and Drop](/images/projects/tab-collection-manager/screenshot-2.png)

<!-- SCREENSHOT: Browser action popup showing quick-save options for current tab or all window tabs -->
![Popup Quick Actions](/images/projects/tab-collection-manager/screenshot-3.png)

## Problem

Modern browsing often involves dozens of open tabs representing different research sessions, projects, or contexts. Browsers offer basic bookmarking but lack intuitive ways to save and restore entire tab sessions. Users either lose important tab groups when closing windows or resort to keeping windows perpetually open, consuming memory and creating clutter.

Existing session managers often feel clunky, require too many clicks, or don't integrate naturally with the browsing workflow. There was a need for a solution that makes saving tabs as effortless as drag-and-drop while providing quick visual access to all saved sessions.

## Approach

### Stack

- **Vanilla JavaScript (ES6 Modules)** - No framework overhead; native module system keeps code organized while maintaining fast load times for the new tab page
- **IndexedDB** - Scalable client-side storage with relational indexing, essential for handling potentially thousands of saved tabs without hitting chrome.storage quotas
- **Chrome Extension APIs** - Manifest V3 service worker pattern for modern extension architecture with proper tab/window lifecycle management
- **SortableJS** - Battle-tested drag-and-drop library enabling intuitive reordering and cross-list tab movement

### Challenges

- **Real-time synchronization across tabs** - When users have multiple new tab pages open, data changes must reflect everywhere. Solved with a tab registration pattern where the service worker maintains a Set of active new tab IDs and broadcasts `dataUpdated` messages after every data mutation.

- **Manifest V3 service worker constraints** - Unlike MV2's persistent background pages, service workers are stateless and can terminate at any time. Solved by using IndexedDB as the single source of truth and keeping the service worker purely event-driven, avoiding any reliance on in-memory state.

- **Drag-and-drop from active browser tabs** - Enabling users to drag tabs from the active windows sidebar into collections required careful coordination between SortableJS groups. Implemented using `pull: 'clone'` for the source group and custom `onAdd` handlers that create new tab entries and optionally close the original browser tabs.

## Outcomes

The extension successfully provides a frictionless way to manage browser sessions. Key achievements include:

- **Zero-config new tab replacement** that loads instantly with cached data
- **Three-pane interface** giving users simultaneous visibility of saved collections and active browser windows
- **Hierarchical organization** with libraries containing collections containing tabs
- **Full import/export** capability for data portability and backup
- **Smooth animations** for tab additions/removals creating a polished user experience

The project demonstrated that modern browser extensions can be built effectively without build tools or frameworks, leveraging native ES6 modules and Chrome's extension APIs directly.

## Implementation Notes

### Data Model

The hierarchical structure uses order arrays for user-defined sequencing:

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

All data mutations flow through the service worker to ensure consistency:

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

For performance, the UI uses targeted updates when possible:

- **Collection collapse state** - Direct DOM manipulation, persisted to sync storage
- **Data changes** - Full cache clear and re-render to ensure consistency

This balances responsiveness for frequent UI interactions with correctness for data mutations.
