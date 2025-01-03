// saveLoad.js
// ===========

export function saveToLocalStorage(state) {
    // Convert relevant parts of state to JSON
    const saveData = {
      gridSize: state.gridSize,
      grid: state.grid,
      playerPos: state.playerPos,
      playerInventory: state.playerInventory,
      currentTier: state.currentTier,
    };
    localStorage.setItem('prismactorySave', JSON.stringify(saveData));
    console.log('Game saved!');
  }
  
  export function loadFromLocalStorage(state) {
    const dataStr = localStorage.getItem('prismactorySave');
    if (!dataStr) return false; // no save found
  
    const loaded = JSON.parse(dataStr);
    // Copy fields back into `state`
    state.gridSize = loaded.gridSize;
    state.playerPos = loaded.playerPos;
    state.playerInventory = loaded.playerInventory;
    state.currentTier = loaded.currentTier;
    // Rebuild the grid (or clone it) - watch for references
    state.grid = loaded.grid;
    console.log('Game loaded!');
    return true;
  }
  
  let autosaveInterval = 30000; // 30 seconds default
  let autosaveTimer = null;
  
  export function initAutoSave(state) {
    if (autosaveTimer) clearInterval(autosaveTimer);
  
    autosaveTimer = setInterval(() => {
      saveToLocalStorage(state);
    }, autosaveInterval);
  }
  
  /**
   * Adjust autosave frequency by subtracting 5s each time 
   * the player places something.
   */
  export function reduceAutosaveInterval(state) {
    autosaveInterval = Math.max(5000, autosaveInterval - 5000);
    if (autosaveTimer) clearInterval(autosaveTimer);
  
    autosaveTimer = setInterval(() => {
      saveToLocalStorage(state);  // use the passed-in state, not window._gameState
    }, autosaveInterval);
  }