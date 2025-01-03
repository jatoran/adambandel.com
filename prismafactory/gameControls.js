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
      { key: '1', value: 'mine',       label: 'Mine'             },
      { key: '2', value: 'remove',     label: 'Remove Building'  },
      { key: '3', value: 'conveyor',   label: 'Conveyor'         },
      { key: '4', value: 'extractor',  label: 'Extractor'        },
      { key: '5', value: 'processor',  label: 'Processor'        },
      { key: '6', value: 'assembler',  label: 'Assembler'        },
      { key: '7', value: 'accumulator',label: 'Accumulator'      },
      { key: '8', value: 'powerPole',  label: 'Power Pole'       },
      { key: '9', value: 'storage',    label: 'Storage'          },
      { key: '0', value: 'mine',       label: '(Alt) Mine'       },
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
        Mouse Wheel = rotate direction, 
        <strong>Ctrl+Click</strong> = remove, 
        <strong>i,c</strong> = inventory/crafting,
        <strong>Shift+Click</strong> = chain build (pointless rn)
      </small>
    `;
    actionsContainer.appendChild(helpText);

    // Highlight the default selection
    this.updateActionButtonHighlight();
  }

  setCurrentAction(value) {
    this.currentAction = value;
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
    if ([
      'conveyor','extractor','processor','assembler','accumulator',
      'powerPole','storage','merger','splitter','portal'
    ].includes(cell.type)) {
      cell.type = 'empty';
      cell.item = null;
      cell.outputDir = null;
      cell.buildingState = {};
      this.ui.render();
    }
  }

  bindEventListeners() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      // Movement (WASD):
      if (e.key === 'w' || e.key === 'W') {
        this.state.playerPos.row = Math.max(0, this.state.playerPos.row - 1);
        e.preventDefault();
        this.ui.render();
        return;
      }
      if (e.key === 's' || e.key === 'S') {
        this.state.playerPos.row = Math.min(this.state.gridSize - 1, this.state.playerPos.row + 1);
        e.preventDefault();
        this.ui.render();
        return;
      }
      if (e.key === 'a' || e.key === 'A') {
        this.state.playerPos.col = Math.max(0, this.state.playerPos.col - 1);
        e.preventDefault();
        this.ui.render();
        return;
      }
      if (e.key === 'd' || e.key === 'D') {
        this.state.playerPos.col = Math.min(this.state.gridSize - 1, this.state.playerPos.col + 1);
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

      // Toggle crafting panel
      if (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'i') {
        if (this.ui.inventoryUI.panelEl.style.display === 'none') {
          this.ui.inventoryUI.show();
        } else {
          this.ui.inventoryUI.hide();
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
      for (let r = 0; r < this.state.gridSize; r++) {
        for (let c = 0; c < this.state.gridSize; c++) {
          const cellDiv = this.ui.cellElements[r][c];
          if (cellDiv === e.target || cellDiv.contains(e.target)) {
            this.hoveredRow = r;
            this.hoveredCol = c;
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
    gridContainer.addEventListener('click', (e) => {
      for (let r = 0; r < this.state.gridSize; r++) {
        for (let c = 0; c < this.state.gridSize; c++) {
          const cellDiv = this.ui.cellElements[r][c];
          if (cellDiv === e.target || cellDiv.contains(e.target)) {
            const isCtrl = e.ctrlKey || e.metaKey; // on Mac, metaKey = cmd
            const isShift = e.shiftKey;

            if (isCtrl) {
              this.handleRemoveBuilding(r, c);
              return;
            }
            this.handleCellClick(r, c, isShift);
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
        this.currentDirectionIndex = (this.currentDirectionIndex - 1 + this.directions.length) % this.directions.length;
      } else {
        // wheel down => rotate right
        this.currentDirectionIndex = (this.currentDirectionIndex + 1) % this.directions.length;
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

  handleCellClick(row, col, isShift) {
    if (!this.ui.isInInteractionRange(row, col)) {
      this.ui.showFeedback("Out of range! Move closer to interact.");
      return;
    }

    const cell = this.state.grid[row][col];
    const action = this.currentAction;

    if (action === 'mine') {
      // Mine from resource node
      if (cell.type === 'resource-node') {
        this.ui.handleResourceCollection(cell);
      }
      this.ui.render();
      return;
    }

    if (action === 'remove') {
      // Remove building
      if ([
        'conveyor','extractor','processor','assembler','accumulator',
        'powerPole','storage','merger','splitter'
      ].includes(cell.type)) {
        cell.type = 'empty';
        cell.item = null;
        cell.outputDir = null;
        cell.buildingState = {};
        this.ui.render();
      }
      return;
    }

    // Building placement
    if (cell.type !== 'empty' && cell.type !== 'resource-node' && cell.type !== 'energy-region') {
      this.ui.showFeedback("Cell is not empty or suitable for building placement!");
      return;
    }
    // remove item on ground
    if (cell.item) cell.item = null;

    switch (action) {
      case 'conveyor':
        cell.type = 'conveyor';
        cell.outputDir = this.currentDirection;
        cell.buildingState = { item: null };
        reduceAutosaveInterval(); // trigger autosave frequency change
        break;
      case 'extractor':
        if (cell.type !== 'resource-node') {
          this.ui.showFeedback("Extractors must be placed on resource nodes!");
          return;
        }
        cell.type = 'extractor';
        cell.outputDir = this.currentDirection;
        cell.buildingState = {
          item: null,
          lastSpawnTime: Date.now(),
        };
        reduceAutosaveInterval();
        break;
      case 'processor':
        cell.type = 'processor';
        cell.outputDir = this.currentDirection;
        cell.buildingState = { item: null };
        reduceAutosaveInterval();
        break;
      case 'assembler':
        cell.type = 'assembler';
        cell.outputDir = this.currentDirection;
        cell.buildingState = { item: null };
        reduceAutosaveInterval();
        break;
      case 'accumulator':
        if (!cell.energyRegion) {
          this.ui.showFeedback("Accumulators must be placed on an energy region!");
          return;
        }
        cell.type = 'accumulator';
        cell.buildingState = {};
        reduceAutosaveInterval();
        break;
      case 'powerPole':
        cell.type = 'powerPole';
        cell.buildingState = {};
        reduceAutosaveInterval();
        break;
      case 'storage':
        cell.type = 'storage';
        cell.buildingState = {
          storedItems: [],
          capacity: 3
        };
        reduceAutosaveInterval();
        break;
      case 'merger':
        cell.type = 'merger';
        cell.outputDir = this.currentDirection;
        cell.buildingState = {
          inputs: [],
          output: null,
        };
        reduceAutosaveInterval();
        break;
      case 'splitter':
        cell.type = 'splitter';
        cell.outputDir = this.currentDirection;
        cell.buildingState = {
          splitterOutputs: null,
          currentOutputIndex: 0,
          input: null
        };
        reduceAutosaveInterval();
        break;
      case 'portal':
        cell.type = 'portal';
        cell.buildingState = {
          storedItems: [],
          capacity: 999
        };
        reduceAutosaveInterval();
        break;
      default:
        this.ui.showFeedback("Unknown action: ", action);
        return;
    }

    // If shift is not held, you could revert to mine or do nothing
    if (!isShift) {
      // e.g. this.setCurrentAction('mine');
    }

    this.ui.render();
  }
}
