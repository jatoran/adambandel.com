// gameControls.js
// ===============

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
  
      // Highlight the default selection
      this.updateActionButtonHighlight();
    }
  
    setCurrentAction(value) {
      this.currentAction = value;
      this.updateActionButtonHighlight();
      // Optionally reset direction to a default whenever we switch actions
      // (comment out if you prefer direction to remain)
      // this.currentDirectionIndex = 1; // right
      // this.currentDirection = this.directions[this.currentDirectionIndex];
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
  
    bindEventListeners() {
      // Keyboard
      window.addEventListener('keydown', (e) => {
        // Movement (WASD) remains in GameUI or can be here, but let's keep it here for separation:
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
        // figure out which cell is hovered
        // each cell is 32px wide (from style.css), plus 2px gap, etc.
        // simpler approach: loop over cell elements to see which matches e.target
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
        // find clicked cell
        for (let r = 0; r < this.state.gridSize; r++) {
          for (let c = 0; c < this.state.gridSize; c++) {
            const cellDiv = this.ui.cellElements[r][c];
            if (cellDiv === e.target || cellDiv.contains(e.target)) {
              this.handleCellClick(r, c);
              return;
            }
          }
        }
      });
  
      // Mouse wheel for rotating direction
      // We'll do it only if the current action is a building that needs direction
      window.addEventListener('wheel', (e) => {
        if (!this.isDirectionNeeded(this.currentAction)) return;
        e.preventDefault();
  
        // For "wheelDeltaY > 0" or "deltaY < 0", we can do one direction vs. the other
        if (e.deltaY < 0) {
          // wheel up => rotate left
          this.currentDirectionIndex = (this.currentDirectionIndex - 1 + this.directions.length) % this.directions.length;
        } else {
          // wheel down => rotate right
          this.currentDirectionIndex = (this.currentDirectionIndex + 1) % this.directions.length;
        }
        this.currentDirection = this.directions[this.currentDirectionIndex];
  
        this.ui.render(); // update the preview arrow
      }, { passive: false });
    }
  
    isDirectionNeeded(action) {
      // Any building whose final type uses an outputDir (conveyor, extractor, processor, assembler)
      // might vary for your actual logic
      return ['conveyor', 'extractor', 'processor', 'assembler'].includes(action);
    }
  
    handleCellClick(row, col) {
      // If out of range, block
      if (!this.ui.isInInteractionRange(row, col)) {
        console.log("Out of range! Move closer to interact.");
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
        if (['conveyor','extractor','processor','assembler','accumulator','powerPole','storage']
            .includes(cell.type)) {
          cell.type = 'empty';
          cell.item = null;
          cell.outputDir = null;
          cell.buildingState = {};
          this.ui.render();
        }
        return;
      }
  
      // Building placement
      // If cell not empty, block
      if (cell.type !== 'empty' && cell.type !== 'resource-node' && cell.type !== 'energy-region') {
        console.log("Cell is not empty or suitable for building placement!");
        return;
      }
      // remove item on ground
      if (cell.item) cell.item = null;
  
      switch (action) {
        case 'conveyor':
          cell.type = 'conveyor';
          cell.outputDir = this.currentDirection;
          cell.buildingState = { item: null };
          break;
        case 'extractor':
          if (cell.type !== 'resource-node') {
            console.log("Extractors must be placed on resource nodes!");
            return;
          }
          cell.type = 'extractor';
          cell.outputDir = this.currentDirection;
          cell.buildingState = {
            item: null,
            lastSpawnTime: Date.now(),
          };
          break;
        case 'processor':
          cell.type = 'processor';
          cell.outputDir = this.currentDirection;
          cell.buildingState = { item: null };
          break;
        case 'assembler':
          cell.type = 'assembler';
          cell.outputDir = this.currentDirection;
          cell.buildingState = { item: null };
          break;
        case 'accumulator':
          // must be on energy-region
          if (!cell.energyRegion) {
            console.log("Accumulators must be placed on an energy region!");
            return;
          }
          cell.type = 'accumulator';
          cell.buildingState = {};
          break;
        case 'powerPole':
          cell.type = 'powerPole';
          cell.buildingState = {};
          break;
        case 'storage':
          cell.type = 'storage';
          cell.buildingState = {
            storedItems: [],
            capacity: 3
          };
          break;
        default:
          console.log("Unknown action: ", action);
          return;
      }
  
      this.ui.render();
    }
  }
  