// gameUI.js
// =========

import { isBuilding } from './structures.js';

export class GameUI {
  /**
   * @param {GameState} state - The shared game state
   * @param {GameLogic} logic - The game logic instance (for flows, updates)
   */
  constructor(state, logic) {
    this.state = state;
    this.logic = logic;

    this.gridContainer = document.getElementById('grid');
    this.inventoryDisplay = document.getElementById('inventoryDisplay');

    // We'll store the DOM elements for each cell
    this.cellElements = [];
  }

  /** Called once at startup */
  init() {
    // Create the DOM for the grid
    for (let r = 0; r < this.state.gridSize; r++) {
      this.cellElements[r] = [];
      for (let c = 0; c < this.state.gridSize; c++) {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        this.gridContainer.appendChild(cellDiv);
        this.cellElements[r][c] = cellDiv;
      }
    }

    // Bind event listeners
    this.bindEventListeners();

    // Initial render
    this.render();
  }

  bindEventListeners() {
    // Global click on the grid
    this.gridContainer.addEventListener('click', (e) => {
      for (let r = 0; r < this.state.gridSize; r++) {
        for (let c = 0; c < this.state.gridSize; c++) {
          const cellDiv = this.cellElements[r][c];
          if (cellDiv === e.target || cellDiv.contains(e.target)) {
            this.onCellClicked(r, c);
            return;
          }
        }
      }
    });

    // WASD movement
    window.addEventListener('keydown', (e) => {
      const oldPos = { ...this.state.playerPos };
      const { gridSize } = this.state;

      if (e.key === 'w' || e.key === 'W') {
        this.state.playerPos.row = Math.max(0, this.state.playerPos.row - 1);
        e.preventDefault();
      } else if (e.key === 's' || e.key === 'S') {
        this.state.playerPos.row = Math.min(gridSize - 1, this.state.playerPos.row + 1);
        e.preventDefault();
      } else if (e.key === 'a' || e.key === 'A') {
        this.state.playerPos.col = Math.max(0, this.state.playerPos.col - 1);
        e.preventDefault();
      } else if (e.key === 'd' || e.key === 'D') {
        this.state.playerPos.col = Math.min(gridSize - 1, this.state.playerPos.col + 1);
        e.preventDefault();
      }
      if (oldPos.row !== this.state.playerPos.row || oldPos.col !== this.state.playerPos.col) {
        this.render();
      }
    });
  }

  onCellClicked(row, col) {
    // Check range
    if (!this.isInInteractionRange(row, col)) {
      console.log("Out of range! Move closer to interact.");
      return;
    }

    const action = document.querySelector('input[name="action"]:checked')?.value;
    if (!action) return;

    const cell = this.state.grid[row][col];

    if (action === 'mine') {
      // Harvest from resource node
      if (cell.type === 'resource-node') {
        this.handleResourceCollection(cell);
        this.render();
      }
      return;
    }

    if (action === 'remove') {
      // Remove building
      if (cell.type === 'conveyor' || cell.type === 'extractor' || cell.type === 'processor') {
        cell.type = 'empty';
        cell.item = null;
        cell.outputDir = null;
        cell.buildingState = {};
        this.render();
      }
      return;
    }

    // If placing a building: conveyor/extractor/processor
    if (cell.type !== 'empty' && cell.type !== 'resource-node' && cell.type !== 'energy-region') {
      console.log("Cell is not empty! Remove building first or place on resource node if it's an extractor.");
      return;
    }

    // Destroy any item on the ground before placing our new building
    if (cell.item) {
        cell.item = null;
    }

    const dir = document.querySelector('input[name="direction"]:checked')?.value || 'right';

    if (action === 'accumulator') {
      // Must be on an energy region
      if (!cell.energyRegion) {
        console.log("Accumulators must be placed on an energy region!");
        return;
      }
      cell.type = 'accumulator';
      // accumulators don’t transport items, so no outputDir needed
      // but we’ll keep buildingState for potential future expansions
      cell.buildingState = { };
    } else if (action === 'powerPole') {
      cell.type = 'powerPole';
      // power poles also do not push items, but we keep buildingState if needed
      cell.buildingState = { };
    } else if (action === 'conveyor') {
    cell.type = 'conveyor';
      cell.outputDir = dir;
      cell.buildingState = { item: null };
    } else if (action === 'extractor') {
      cell.type = 'extractor';
      cell.outputDir = dir;
      cell.buildingState = {
        item: null,
        lastSpawnTime: Date.now(),
      };
    } else if (action === 'processor') {
      cell.type = 'processor';
      cell.outputDir = dir;
      cell.buildingState = { item: null };
    }

    this.render();
  }

  handleResourceCollection(cell) {
    if (!cell.resourceType) return;
    const { playerInventory, maxResourceCount } = this.state;
    if (playerInventory[cell.resourceType] < maxResourceCount) {
      playerInventory[cell.resourceType]++;
      this.updateUI();
    }
  }

  /** Redraws the entire grid + UI */
  render() {
    const { grid, playerPos, gridSize } = this.state;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = grid[r][c];
        const cellDiv = this.cellElements[r][c];
        cellDiv.className = 'cell';
        cellDiv.innerHTML = '';

        // Base class
        cellDiv.classList.add(cell.type);

        // If the cell is powered, we can visually indicate that
        // (Optional) Example: add a 'powered-cell' class with a subtle glow
        if (cell.powered) {
          cellDiv.classList.add('powered-cell');
        }

        // If cell has an item on the cell itself
        if (cell.item) {
          const itemEl = document.createElement('div');
          itemEl.classList.add('item-indicator');
          itemEl.classList.add(cell.item.type === 'raw' ? 'item-raw' : 'item-processed');
          cellDiv.appendChild(itemEl);
        }

        // If building has an internal item
        if (isBuilding(cell) && cell.buildingState?.item) {
          const buildingItem = cell.buildingState.item;
          const storedItemEl = document.createElement('div');
          storedItemEl.classList.add('item-indicator');
          storedItemEl.classList.add(
            buildingItem.type === 'raw' ? 'item-raw' : 'item-processed'
          );
          cellDiv.appendChild(storedItemEl);
        }

        // Output arrow
        if (cell.outputDir && isBuilding(cell)) {
          const arrowEl = document.createElement('div');
          arrowEl.classList.add('arrow');
          arrowEl.textContent = this.getArrowSymbol(cell.outputDir);
          cellDiv.appendChild(arrowEl);
        }

        // In-range highlight
        if (this.isInInteractionRange(r, c)) {
          cellDiv.classList.add('in-range');
        }

        // Player cell
        if (r === playerPos.row && c === playerPos.col) {
          cellDiv.classList.add('player-cell');
        }
      }
    }
    this.updateUI();
  }

  updateUI() {
    const { iron } = this.state.playerInventory;
    this.inventoryDisplay.textContent = `Iron: ${iron}/${this.state.maxResourceCount}`;
  }

  // Helpers
  isInInteractionRange(row, col) {
    const { row: pr, col: pc } = this.state.playerPos;
    const dist = Math.abs(row - pr) + Math.abs(col - pc);
    return dist <= this.state.interactionRange;
  }

  getArrowSymbol(dir) {
    switch (dir) {
      case 'up':    return '↑';
      case 'down':  return '↓';
      case 'left':  return '←';
      case 'right': return '→';
      default:      return '?';
    }
  }
}
