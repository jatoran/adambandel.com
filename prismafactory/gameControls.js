// gameControls.js
// ===============

import { reduceAutosaveInterval } from './saveLoad.js';

export class GameControls {
  /**
   * @param {GameState} state   - Shared game state
   * @param {GameUI}     ui     - The GameUI instance (for rendering, etc.)
   * @param {GameLogic}  logic  - The GameLogic instance (if needed)
   */
  constructor(state, ui, logic) {
    this.state = state;
    this.ui = ui;
    this.logic = logic;

    // The list of possible building directions in clockwise order
    this.directions = ['up', 'right', 'down', 'left'];
    this.currentDirectionIndex = 1; // default = 'right'
    this.currentDirection = this.directions[this.currentDirectionIndex];

    // The available actions
    this.availableActions = [
      { key: '1', value: 'mine',       label: 'Interact/Mine'             },
      { key: '2', value: 'conveyor',   label: 'Conveyor'         },
      { key: '3', value: 'extractor',  label: 'Extractor'        },
      { key: '4', value: 'processor',  label: 'Processor'        },
      { key: '5', value: 'assembler',  label: 'Assembler'        },
      { key: '6', value: 'accumulator',label: 'Accumulator'      },
      { key: '7', value: 'powerPole',  label: 'Power Pole'       },
      { key: '8', value: 'storage',    label: 'Storage'          },
      { key: 'm', value: 'merger',     label: 'Merger' },
      { key: 'p', value: 'splitter',   label: 'Splitter' },
      { key: 'o', value: 'portal',     label: 'Portal'           },
    ];

    // Action + direction
    this.currentAction = 'mine';

    // Track hovered cell for blueprint previews
    this.hoveredRow = null;
    this.hoveredCol = null;
  }

  init() {
    this.createActionButtons();
    this.bindEventListeners();
  }

  createActionButtons() {
    // Clear the container
    const actionsContainer = document.getElementById('actionsContainer');
    actionsContainer.innerHTML = '';

    // Create buttons
    this.availableActions.forEach(action => {
      const btn = document.createElement('button');
      btn.textContent = `${action.key} - ${action.label}`;
      btn.addEventListener('click', () => {
        this.setCurrentAction(action.value);
      });
      actionsContainer.appendChild(btn);
    });

    // Help text below the action buttons
    const helpText = document.createElement('div');
    helpText.style.marginTop = '8px';
    helpText.innerHTML = `
      <small>
       <strong>I,C</strong> = inventory/crafting,
        <strong>Mouse Wheel</strong> = rotate direction, 
        <strong>Ctrl+Click</strong> = remove, 
        <strong>Shift+Click</strong> = chain build,
        <strong>Click Structure</strong> = show Structure Info
      </small>
    `;
    actionsContainer.appendChild(helpText);

    // Highlight the default selection
    this.updateActionButtonHighlight();
  }

  /**
     * Sets the current action. 
     * We slightly enhance this to store a flag that it was "manually set by hotkey"
     * so we can know whether to revert after one placement.
     */
  setCurrentAction(value) {
    this.currentAction = value;

    // We store a small flag to indicate that we "just used a building hotkey"
    // so the next non-shift placement can revert us back to 'mine' automatically.
    this._oneTimeBuildingAction = ([
      'conveyor','extractor','processor','assembler',
      'accumulator','powerPole','storage','merger','splitter','portal'
    ].includes(value));

    this.updateActionButtonHighlight();
    this.ui.render(); // so we see updated blueprint preview
  }

  updateActionButtonHighlight() {
    const actionsContainer = document.getElementById('actionsContainer');
    const buttons = actionsContainer.querySelectorAll('button');
    buttons.forEach((btn) => {
      const labelText = btn.textContent.split(' - ')[1];
      const actionObj = this.availableActions.find(a => a.label === labelText);
      if (actionObj && actionObj.value === this.currentAction) {
        btn.classList.add('selected-action');
      } else {
        btn.classList.remove('selected-action');
      }
    });
  }

  handleRemoveBuilding(row, col) {
    const cell = this.state.grid[row][col];
  
    // Only remove if it's a valid building
    if ([
      'conveyor','extractor','processor','assembler',
      'accumulator','powerPole','storage','merger','splitter','portal'
    ].includes(cell.type)) {
      
      // Check if we saved the underlying cell type
      if (cell.buildingState.underlyingType) {
        cell.type = cell.buildingState.underlyingType; 
        cell.resourceType = cell.buildingState.underlyingResourceType || null;
        cell.energyRegion = cell.buildingState.underlyingEnergyRegion || false;
      } else {
        // Otherwise, default to empty
        cell.type = 'empty';
        cell.resourceType = null;
        cell.energyRegion = false;
      }
  
      // Clear everything else
      cell.item = null;
      cell.outputDir = null;
      cell.buildingState = {};
  
      this.ui.render();
    }
  }
  

  bindEventListeners() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      if (e.key === 'w' || e.key === 'W') {
        this.movePlayer(-1, 0); // up
        e.preventDefault();
        this.ui.render();
        return;
      }
      if (e.key === 's' || e.key === 'S') {
        this.movePlayer(1, 0); // down
        e.preventDefault();
        this.ui.render();
        return;
      }
      if (e.key === 'a' || e.key === 'A') {
        this.movePlayer(0, -1); // left
        e.preventDefault();
        this.ui.render();
        return;
      }
      if (e.key === 'd' || e.key === 'D') {
        this.movePlayer(0, 1); // right
        e.preventDefault();
        this.ui.render();
        return;
      }
      if (e.key.toLowerCase() === 'm') {
        this.setCurrentAction('merger');
      }
      if (e.key.toLowerCase() === 'p') {
        this.setCurrentAction('splitter');
      }
      if (e.key.toLowerCase() === 'o') {
        this.setCurrentAction('portal');
      }

      // Toggle crafting panel
      if (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'i') {
        const isOpen = (this.ui.inventoryUI.modalOverlay.style.display === 'block');
        if (isOpen) {
          this.ui.inventoryUI.hide();
        } else {
          this.ui.inventoryUI.show();
        }
      }

      // Hotkeys for actions (digits)
      if (/^[0-9]$/.test(e.key)) {
        const actionObj = this.availableActions.find(a => a.key === e.key);
        if (actionObj) {
          this.setCurrentAction(actionObj.value);
        }
      }
    });

    // Mousemove to track hovered cell
    const gridContainer = document.getElementById('grid');
    gridContainer.addEventListener('mousemove', (e) => {
      // Instead of looping over numRows x numCols,
      // we loop over the camera dimension: e.g. 10 x 10.
      const cameraRows = this.ui.cameraRows;  // e.g. 10
      const cameraCols = this.ui.cameraCols;  // e.g. 10
    
      for (let vr = 0; vr < cameraRows; vr++) {
        for (let vc = 0; vc < cameraCols; vc++) {
          // The actual DOM element:
          const cellDiv = this.ui.cellElements[vr][vc];
          if (!cellDiv) continue;
    
          if (cellDiv === e.target || cellDiv.contains(e.target)) {
            // Convert from viewport coords (vr,vc) to global (gr,gc)
            const gr = this.ui.cameraTopLeftRow + vr;
            const gc = this.ui.cameraTopLeftCol + vc;
    
            // Now we know the user is hovering over (gr,gc) in the real grid
            this.hoveredRow = gr;
            this.hoveredCol = gc;
            this.ui.render(); // show preview
            return;
          }
        }
      }
    
      // If no cell found, reset hovered
      this.hoveredRow = null;
      this.hoveredCol = null;
      this.ui.render();
    });

    // Click to place or remove
    // New snippet that loops over the viewport (10×10) only
    gridContainer.addEventListener('click', (e) => {
      const cameraRows = this.ui.cameraRows;    // e.g. 10
      const cameraCols = this.ui.cameraCols;    // e.g. 10
      const topLeftRow = this.ui.cameraTopLeftRow;
      const topLeftCol = this.ui.cameraTopLeftCol;

      for (let vr = 0; vr < cameraRows; vr++) {
        for (let vc = 0; vc < cameraCols; vc++) {
          const cellDiv = this.ui.cellElements[vr][vc];
          if (!cellDiv) continue; // safeguard

          if (cellDiv === e.target || cellDiv.contains(e.target)) {
            // Convert (vr,vc) to real global coords (row,col)
            const row = topLeftRow + vr;
            const col = topLeftCol + vc;

            // If user is holding Ctrl => remove
            const isCtrl = e.ctrlKey || e.metaKey;
            const isShift = e.shiftKey;

            if (isCtrl) {
              this.handleRemoveBuilding(row, col);
              return;
            }
            this.handleCellClick(row, col, isShift);
            return;
          }
        }
      }
    });


    // Mouse wheel for rotating direction
    window.addEventListener('wheel', (e) => {
      if (!this.isDirectionNeeded(this.currentAction)) return;
      e.preventDefault();

      if (e.deltaY < 0) {
        // wheel up => rotate left
        this.currentDirectionIndex = (this.currentDirectionIndex + 1) % this.directions.length;
      } else {
        // wheel down => rotate right
        this.currentDirectionIndex = (this.currentDirectionIndex - 1 + this.directions.length) % this.directions.length;
      }
      this.currentDirection = this.directions[this.currentDirectionIndex];

      this.ui.render();
    }, { passive: false });
  }

  isDirectionNeeded(action) {
    return [
      'conveyor',
      'extractor',
      'processor',
      'assembler',
      'merger',
      'splitter'
    ].includes(action);
  }


  movePlayer(dRow, dCol) {
    const { currentTier, numRows, numCols } = this.state;
    let { row, col } = this.state.playerPos;
  
    if (currentTier !== 3) {
      // T1/T2 => clamp both row & col
      row = Math.max(0, Math.min(row + dRow, numRows - 1));
      col = Math.max(0, Math.min(col + dCol, numCols - 1));
    } else {
      // T3 => infinite vertical, clamp horizontal
      row += dRow;  // no vertical limit
      col += dCol;  // but clamp horizontally
      col = Math.max(0, Math.min(col, numCols - 1));
    }
  
    // Update
    this.state.playerPos.row = row;
    this.state.playerPos.col = col;
  }

/**
 * This function is called whenever the player clicks on a cell.
 * If SHIFT is *not* held and we had a "one-time" building action set,
 * we revert to 'mine' after building one structure.
 */
handleCellClick(row, col, isShift) {
  // If Tier 3 => ring vertical, col is already clamped so let's keep it safe
  if (this.state.currentTier === 3) {
    row = (row % this.state.numRows + this.state.numRows) % this.state.numRows;
    col = Math.max(0, Math.min(col, this.state.numCols - 1));
  }
  if (row < 0 || row >= this.state.numRows) return; // just to be sure

  const cell = this.state.grid[row][col];
  if (!cell) return;

  if (!this.ui.isInInteractionRange(row, col)) {
    this.ui.showFeedback("Out of range! Move closer to interact.");
    return;
  }

  const action = this.currentAction;

  // If the current action is 'mine' => attempt to interact or open building UI
  if (action === 'mine') {
    if (cell.type === 'resource-node') {
      this.ui.handleResourceCollection(cell);
      this.ui.render();
      return;
    }
    if ([
      'conveyor','extractor','processor','assembler','accumulator',
      'powerPole','storage','merger','splitter','portal'
    ].includes(cell.type)) {
      this.ui.inventoryUI.hide();
      this.ui.buildingUI.showBuilding(cell);
      return;
    }
    return; 
  }

  // If user is holding Ctrl, we remove a building:
  const isCtrl = window.event?.ctrlKey || window.event?.metaKey;
  if (isCtrl) {
    this.handleRemoveBuilding(row, col);
    return;
  }

  // Now handle building placements
  if ([
    'conveyor','extractor','processor','assembler','accumulator',
    'powerPole','storage','merger','splitter','portal'
  ].includes(action)) {

    // --- NEW LINES: Strictly enforce extractor/accumulator placement ---
    if (action === 'extractor' && cell.type !== 'resource-node') {
      this.ui.showFeedback("Extractors can only be placed on resource nodes!");
      return;
    }
    if (action === 'accumulator' && cell.type !== 'energy-region') {
      this.ui.showFeedback("Accumulators can only be placed on energy regions!");
      return;
    }
    // --- END NEW LINES ---

    /**
     * Check cell type constraints
     *  - If the cell is a 'resource-node', only 'extractor' is allowed
     *  - If the cell is an 'energy-region', only 'accumulator' is allowed
     *  - Otherwise the cell must be 'empty'
     */
    if (cell.type === 'resource-node') {
      // Only extractor is allowed on a resource-node
      if (action !== 'extractor') {
        this.ui.showFeedback("Only an Extractor can be placed on a resource node!");
        return;
      }
    }
    else if (cell.type === 'energy-region') {
      // Only accumulator is allowed on an energy region
      if (action !== 'accumulator') {
        this.ui.showFeedback("Only an Accumulator can be placed on an energy region!");
        return;
      }
    }
    else {
      // Otherwise, the cell must be empty
      if (cell.type !== 'empty') {
        this.ui.showFeedback("Cell is not empty!");
        return;
      }
    }

    // Remove any ground item
    if (cell.item) cell.item = null;

    // Perform the actual building placement
    switch (action) {
      case 'conveyor':
        cell.type = 'conveyor';
        cell.outputDir = this.currentDirection;
        cell.buildingState = { item: null };
        reduceAutosaveInterval(this.state);
        break;
      case 'extractor':
        // The cell was confirmed to be resource-node above
        cell.buildingState.underlyingType = 'resource-node';
        cell.buildingState.underlyingResourceType = cell.resourceType;
        cell.type = 'extractor';
        cell.outputDir = this.currentDirection;
        cell.buildingState.lastSpawnTime = Date.now();
        reduceAutosaveInterval(this.state);
        break;
      case 'processor':
        cell.type = 'processor';
        cell.outputDir = this.currentDirection;
        cell.buildingState = { 
          recipe: null,
          inputBuffer: [],
          inputBufferMax: 5,
          outputBuffer: [],
          outputBufferMax: 2,
        };
        reduceAutosaveInterval(this.state);
        break;
      case 'assembler':
        cell.type = 'assembler';
        cell.outputDir = this.currentDirection;
        cell.buildingState = {
          recipe: null,
          inputBuffers: {},
          perResourceBufferMax: 5,
          outputBuffer: [],
          outputBufferMax: 2,
        };
        reduceAutosaveInterval(this.state);
        break;
      case 'accumulator':
        // The cell was confirmed to be energy-region above
        cell.buildingState.underlyingType = 'energy-region';
        cell.buildingState.underlyingEnergyRegion = true;
        cell.type = 'accumulator';
        reduceAutosaveInterval(this.state);
        break;
      case 'powerPole':
        cell.type = 'powerPole';
        cell.buildingState = {};
        reduceAutosaveInterval(this.state);
        break;
      case 'storage':
        cell.type = 'storage';
        cell.buildingState = {
          storedItems: [],
          capacity: 3
        };
        reduceAutosaveInterval(this.state);
        break;
      case 'merger':
        cell.type = 'merger';
        cell.outputDir = this.currentDirection;
        cell.buildingState = {
          inputs: [],
          output: null,
        };
        reduceAutosaveInterval(this.state);
        break;
      case 'splitter':
        cell.type = 'splitter';
        cell.outputDir = this.currentDirection;
        cell.buildingState = {
          splitterOutputs: null,
          currentOutputIndex: 0,
          input: null
        };
        reduceAutosaveInterval(this.state);
        break;
      case 'portal':
        cell.type = 'portal';
        cell.buildingState = {
          storedItems: [],
          capacity: 999
        };
        reduceAutosaveInterval(this.state);
        break;
      default:
        this.ui.showFeedback("Unknown action: " + action);
        return;
    }

    // If SHIFT not held and this was a "one-time" building action, revert to 'mine'
    if (!isShift && this._oneTimeBuildingAction) {
      this._oneTimeBuildingAction = false;
      this.setCurrentAction('mine');
    }

    this.ui.render();
  }
}


}