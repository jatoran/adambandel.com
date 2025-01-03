// main.js
import { GameState } from './gameState.js';
import { GameUI } from './gameUI.js';
import { GameLogic } from './gameLogic.js';
import { GameControls } from './gameControls.js';
import { InventoryUI } from './inventoryUI.js';
import { saveToLocalStorage, loadFromLocalStorage, initAutoSave } from './saveLoad.js';

const state = new GameState();

// Attempt to load
const success = loadFromLocalStorage(state);
if (!success) {
  state.initGrid();
}

// Create the main UI
const ui = new GameUI(state);
ui.init();   // builds the grid DOM

// Create the Inventory UI
const inventoryUI = new InventoryUI(state);
inventoryUI.init();
ui.inventoryUI = inventoryUI;  // link them

// Create the logic
const logic = new GameLogic(state, ui);

// Create the controls
const controls = new GameControls(state, ui, logic);
controls.init();

// Link references
state.controls = controls;  // so UI can find controls if needed

// Start logic
logic.init();

// Start autosave
initAutoSave(state);

// If you want a manual save button, ensure you have <button id="saveButton"> in HTML
const saveBtn = document.getElementById('saveButton');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    saveToLocalStorage(state);
  });
}


const resetBtn = document.getElementById('resetGameBtn');

// 2) Attach a click event
resetBtn.addEventListener('click', () => {
    localStorage.removeItem('prismactorySave');
    location.reload();
  });