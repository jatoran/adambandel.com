// main.js
// =======

import { GameState } from './gameState.js';
import { GameUI } from './gameUI.js';
import { GameLogic } from './gameLogic.js';

// 1) Create game state
const state = new GameState();
state.initGrid(); // set up the grid, place source, resource nodes, etc.

// 2) Create UI + Logic
const ui = new GameUI(state);
const logic = new GameLogic(state, ui);

// 3) Initialize
ui.init();
logic.init();

// The game is now running!
