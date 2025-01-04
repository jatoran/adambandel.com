// saveLoad.js
// ===========

/**
 * Saves ALL relevant game data, including:
 * - currentTier
 * - top-level grid (for convenience, though not strictly needed if we always rely on perTierData)
 * - numRows, numCols, playerPos, playerInventory
 * - perTierData (which holds each tier’s separate grid, dimension, and playerPos)
 */
export function saveToLocalStorage(state) {
  // Build a comprehensive save object
  const saveData = {
    // Basic fields
    currentTier: state.currentTier,
    numRows: state.numRows,
    numCols: state.numCols,
    playerPos: state.playerPos,
    playerInventory: state.playerInventory,

    // Full per-tier data
    perTierData: {}
  };

  // Copy over each tier's snapshot
  for (let tier = 1; tier <= 3; tier++) {
    const tierData = state.perTierData[tier];
    if (tierData) {
      saveData.perTierData[tier] = {
        // Make sure to do a structuredClone so we don't reference the same array
        grid: structuredClone(tierData.grid),
        numRows: tierData.numRows,
        numCols: tierData.numCols,
        playerPos: { ...tierData.playerPos }
      };
    } else {
      saveData.perTierData[tier] = null;
    }
  }

  // Also copy the current grid, in case your code expects to restore that quickly
  // (Optional, since we also store it in perTierData)
  saveData.grid = structuredClone(state.grid);

  localStorage.setItem('prismactorySave', JSON.stringify(saveData));
  console.log('Game saved with all tiers!');
}

export function loadFromLocalStorage(state) {
  const dataStr = localStorage.getItem('prismactorySave');
  if (!dataStr) return false; // no save found

  const loaded = JSON.parse(dataStr);

  // Restore top-level
  state.currentTier = loaded.currentTier;
  state.numRows = loaded.numRows;
  state.numCols = loaded.numCols;
  state.playerPos = loaded.playerPos;
  state.playerInventory = loaded.playerInventory;

  // Restore perTierData
  state.perTierData = loaded.perTierData || { 1: null, 2: null, 3: null };

  // Restore the top-level grid for the current tier
  // (If your code doesn’t rely on a top-level grid separate from perTierData,
  // you can remove these lines.)
  state.grid = loaded.grid || [];

  // Alternatively, if you always want to rebuild from the tier data:
  // If there's a snapshot for the current tier, load it
  if (state.perTierData[state.currentTier]) {
    const snapshot = state.perTierData[state.currentTier];
    state.grid = structuredClone(snapshot.grid);
    state.numRows = snapshot.numRows;
    state.numCols = snapshot.numCols;
    state.playerPos = { ...snapshot.playerPos };
  }

  console.log('Game loaded from localStorage, with all tiers included!');
  return true;
}

/** 
 * Autosave logic (unchanged) 
 */
let autosaveInterval = 30000; // 30 seconds
let autosaveTimer = null;

export function initAutoSave(state) {
  if (autosaveTimer) clearInterval(autosaveTimer);

  autosaveTimer = setInterval(() => {
    saveToLocalStorage(state);
  }, autosaveInterval);
}

export function reduceAutosaveInterval(state) {
  autosaveInterval = Math.max(5000, autosaveInterval - 5000);
  if (autosaveTimer) clearInterval(autosaveTimer);

  autosaveTimer = setInterval(() => {
    saveToLocalStorage(state);
  }, autosaveInterval);
}
