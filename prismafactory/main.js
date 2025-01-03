// main.js
// =======

import { GameState } from './gameState.js';
import { GameUI } from './gameUI.js';
import { GameLogic } from './gameLogic.js';
import { GameControls } from './gameControls.js';

// 1) Create game state
const state = new GameState();
state.initGrid();

// 2) Create UI + Logic
const ui = new GameUI(state);
const logic = new GameLogic(state, ui);

// 3) Create Controls
const controls = new GameControls(state, ui, logic);
state.controls = controls; // so UI can read from `state.controls`

// 4) Initialize
ui.init();
logic.init();
controls.init();   // after UI is ready

// The game is now running with new modular controls + building previews
