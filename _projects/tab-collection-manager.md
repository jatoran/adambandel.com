---
title: TCM - Tab Collection Manager
summary: Chrome extension replacing the New Tab page with a hierarchical tab organization system using drag-and-drop collections
date: 2026-01-15
---

## Overview

TCM (Tab Collection Manager) is a Chrome extension that transforms the browser's New Tab page into a powerful tab organization workspace. It provides a hierarchical system for saving, categorizing, and restoring groups of browser tabs through an intuitive three-panel interface with drag-and-drop functionality.

The extension addresses the common problem of browser tab overload by letting users preserve their browsing sessions without keeping hundreds of tabs open. Unlike Chrome's built-in tab groups, TCM persists collections permanently with IndexedDB storage, supports nested organization through libraries, and syncs state across all open New Tab instances in real-time.

## Screenshots

<!-- SCREENSHOT: Main interface showing the three-panel layout - left sidebar with library list, center with collection cards containing tab thumbnails, right sidebar with active browser windows -->
![Main Interface](/images/projects/tab-collection-manager/screenshot-1.png)

<!-- SCREENSHOT: Drag-and-drop in action - dragging a tab card from an active window in the right sidebar into a collection in the center panel -->
![Drag and Drop](/images/projects/tab-collection-manager/screenshot-2.png)

<!-- SCREENSHOT: Popup interface showing quick-save options with library selector dropdown and collection list -->
![Popup Quick Actions](/images/projects/tab-collection-manager/screenshot-3.png)

## Problem

Modern web browsing often leads to "tab hoarding" - keeping dozens of tabs open as reminders or for later reading. This creates performance issues, cluttered browser interfaces, and anxiety about losing important pages. Chrome's native solutions (bookmarks, tab groups, reading lists) each have limitations:

- **Bookmarks** lack visual organization and require manual folder management
- **Tab groups** disappear when the browser closes
- **Reading lists** are flat and don't support categorization

TCM solves these problems by providing:
- Persistent storage that survives browser restarts
- Visual card-based interface for quick scanning
- Hierarchical organization (Libraries > Collections > Tabs)
- One-click saving of entire browser windows
- Drag-and-drop reorganization between collections

## Approach

### Stack

- **Chrome Extension APIs (MV3)** - Built on Manifest V3 architecture with ES modules, using service workers for background processing and `chrome_url_overrides` for NTP replacement
- **IndexedDB** - Primary data store for scalable, structured storage with `unlimitedStorage` permission, featuring indexed queries for efficient retrieval
- **SortableJS** - Handles all drag-and-drop interactions with support for cross-list transfers and ghost element previews
- **Vanilla JavaScript** - No framework dependencies; uses a modular architecture with clear separation between UI components, data management, and interaction handlers
- **CSS Custom Properties** - Full light/dark theme support through CSS variables with smooth transitions

### Architecture

```
service-worker/
  background.js       # Message router and event broker
  dataActions.js      # CRUD operations handler
  importExport.js     # JSON data serialization

newtab/
  newtab.js           # Main orchestrator
  data/
    dataLoader.js     # Data fetching with caching
    state.js          # UI state management (collapse, expansion)
  ui/
    sidebar.js        # Library navigation panel
    libraryView.js    # Main collection grid
    activeWindowsSidebar.js  # Live browser tabs panel
  interaction/
    dragDrop.js       # SortableJS configuration
    searchFilter.js   # Real-time tab filtering

lib/
  storageManager.js   # Facade over IndexedDB
  indexedDbManager.js # Low-level DB operations
```

### Challenges

- **Real-time sync across NTP instances** - Multiple New Tab pages need to reflect the same data. Solved by having each NTP register its tab ID with the service worker, which broadcasts `dataUpdated` messages to all registered instances. The NTP message listener then triggers selective or full UI refreshes based on the change type.

- **Drag-and-drop between different sources** - Tabs can be dragged from saved collections OR from the live browser windows sidebar. SortableJS's `onAdd` handler distinguishes sources by checking `data-source` attributes, applying different logic for cloning active tabs versus moving saved ones.

- **IndexedDB cascading deletes** - Deleting a library must remove all its collections and tabs. The `storageManager` implements cascading delete logic that maintains referential integrity by cleaning up order arrays in parent objects.

- **State persistence granularity** - Different state needs different sync strategies. Collection collapse state uses `chrome.storage.sync` for cross-device consistency, while the active library uses `chrome.storage.local` since it's session-specific.

## Outcomes

The extension successfully replaces the default New Tab page with a functional tab management workspace. Key achievements:

- **Zero-dependency UI** - The entire interface is built with vanilla JavaScript, keeping the extension lightweight (under 100KB unpacked)
- **Instant load times** - Aggressive caching in `dataLoader.js` ensures the NTP renders in under 100ms on repeat visits
- **Keyboard accessibility** - Full keyboard navigation with visible focus states for power users
- **Robust data model** - The `*Order` arrays pattern (e.g., `collectionOrder`, `tabOrder`) ensures user-defined sequences survive all CRUD operations

## Implementation Notes

### Message-Based Architecture

The extension uses a decoupled message-passing architecture where UI components never access storage directly:

```javascript
// UI component sends action to service worker
chrome.runtime.sendMessage({
  action: 'moveTab',
  payload: {
    movedTabId,
    fromCollectionId,
    toCollectionId,
    newToOrder
  }
}, (response) => {
  if (!response?.success) {
    // Handle error, revert optimistic UI
  }
});
```

### Hierarchical Data Model

```javascript
// Library -> Collections -> Tabs with order arrays
{
  id: 'lib-uuid',
  name: 'Work Research',
  collectionOrder: ['coll-1', 'coll-2'], // Maintains display order
  createdAt: 1706234567890
}

{
  id: 'coll-1',
  libraryId: 'lib-uuid',
  name: 'API Documentation',
  tabOrder: ['tab-a', 'tab-b', 'tab-c'],
  lastModifiedAt: 1706234567890
}
```

### Storage Facade Pattern

All storage operations go through `storageManager.js`, which enforces business rules:

```javascript
export async function deleteCollection(collectionId) {
  // 1. Find parent library for order array update
  const collection = await IDB.getCollection(collectionId);
  const libraryId = collection.libraryId;
  
  // 2. Cascading delete in IndexedDB
  await IDB.deleteCollectionAndContents(collectionId);
  
  // 3. Remove from library's collectionOrder
  const lib = await IDB.getLibrary(libraryId);
  lib.collectionOrder = lib.collectionOrder.filter(id => id !== collectionId);
  await IDB.putLibrary(lib);
}
```
