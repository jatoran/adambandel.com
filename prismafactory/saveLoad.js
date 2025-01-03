// saveLoad.js
// ===========

export function saveToLocalStorage(state, ui) {
    // Convert relevant parts of state to JSON
    const saveData = {
      gridSize: state.gridSize,
      grid: state.grid,
      playerPos: state.playerPos,
      playerInventory: state.playerInventory,
      currentTier: state.currentTier,
    };
  
    localStorage.setItem('prismactorySave', JSON.stringify(saveData));
  
    // Display feedback in the UI
    if (ui && ui.showFeedback) {
      ui.showFeedback('Game saved!');
    }
  }
  
  export function loadFromLocalStorage(state, ui) {
    const dataStr = localStorage.getItem('prismactorySave');
    if (!dataStr) {
      // No save found
      if (ui && ui.showFeedback) {
        ui.showFeedback('No saved game found. Starting a new game...');
      }
      return false;
    }
  
    const loaded = JSON.parse(dataStr);
  
    // Copy fields back into `state`
    state.gridSize = loaded.gridSize;
    state.playerPos = loaded.playerPos;
    state.playerInventory = loaded.playerInventory;
    state.currentTier = loaded.currentTier;
    // Rebuild the grid (or clone it) - watch for references
    state.grid = loaded.grid;
  
    if (ui && ui.showFeedback) {
      ui.showFeedback('Game loaded!');
    }
    return true;
  }
  
  let autosaveInterval = 30000; // 30 seconds default
  let autosaveTimer = null;
  
  /**
   * Initialize the autosave routine.
   */
  export function initAutoSave(state, ui) {
    if (autosaveTimer) clearInterval(autosaveTimer);
  
    autosaveTimer = setInterval(() => {
      saveToLocalStorage(state, ui);
    }, autosaveInterval);
  
    // Optional: if you want a message when autosave starts:
    if (ui && ui.showFeedback) {
      ui.showFeedback(`Autosave started (every ${autosaveInterval / 1000} s).`);
    }
  }
  
  /**
   * Adjust autosave frequency by subtracting 5s each time 
   * the player places something.
   */
  export function reduceAutosaveInterval(state, ui) {
    autosaveInterval = Math.max(5000, autosaveInterval - 5000); // never go below 5s
  
    // Clear existing timer
    if (autosaveTimer) clearInterval(autosaveTimer);
  
    // Start a new timer with the updated interval
    autosaveTimer = setInterval(() => {
      saveToLocalStorage(state, ui);
    }, autosaveInterval);
  
    if (ui && ui.showFeedback) {
      ui.showFeedback(`Autosave interval changed to ${autosaveInterval / 1000} seconds.`);
    }
  }
  