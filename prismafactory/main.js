// main.js
import { GameState } from './gameState.js';
import { GameUI } from './gameUI.js';
import { GameLogic } from './gameLogic.js';
import { GameControls } from './gameControls.js';
import { InventoryUI } from './inventoryUI.js';
import { BuildingUI } from './buildingUI.js';
import { saveToLocalStorage, loadFromLocalStorage, initAutoSave } from './saveLoad.js';
import { Worlds } from './worlds.js';

const state = new GameState();
window._gameState = state; 

// 1) Attempt to load from localStorage
const success = loadFromLocalStorage(state);

// 2) If no save found, set currentTier=1 explicitly and load Tier 1 fresh
if (!success) {
  state.currentTier = 1;
  Worlds.loadWorld(1, state);
} else {
  // Otherwise, load whichever tier was saved
  Worlds.loadWorld(state.currentTier, state);
}

// 3) Create main UI
const ui = new GameUI(state);
ui.init(); // builds DOM for state.numRows × state.numCols

// 4) Create the Inventory UI
const inventoryUI = new InventoryUI(state, ui);
ui.inventoryUI = inventoryUI;

// 5) Building UI
const buildingUI = new BuildingUI(state);
ui.buildingUI = buildingUI;

// 6) Create logic
const logic = new GameLogic(state, ui);

// 7) Controls
const controls = new GameControls(state, ui, logic);
controls.init();
state.controls = controls;

// 8) Start logic & autosave
logic.init();
initAutoSave(state);

// 9) Manual save button
const saveBtn = document.getElementById('saveButton');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    // Ensure current tier’s latest data is stored before saving
    Worlds._storeCurrentTierState(state);
    saveToLocalStorage(state);
  });
}

// 10) Reset
const resetBtn = document.getElementById('resetGameBtn');
resetBtn.addEventListener('click', () => {
  localStorage.removeItem('prismactorySave');
  location.reload();
});

// 11) Tier nav
const prevTierBtn = document.getElementById('prevTierBtn');
if (prevTierBtn) {
  prevTierBtn.addEventListener('click', () => {
    if (state.currentTier > 1) {
      Worlds.loadWorld(state.currentTier - 1, state);
      ui.gridContainer.innerHTML = '';
      ui.cellElements = [];
      ui.init();
      ui.render();
    } else {
      ui.showFeedback("You're already at Tier 1!");
    }
  });
}

const nextTierBtn = document.getElementById('nextTierBtn');
if (nextTierBtn) {
  nextTierBtn.addEventListener('click', () => {
    if (state.currentTier < 3) {
      Worlds.loadWorld(state.currentTier + 1, state);
      ui.gridContainer.innerHTML = '';
      ui.cellElements = [];
      ui.init();
      ui.render();
    } else {
      ui.showFeedback("Tier 3 is the highest tier for now!");
    }
  });
}
