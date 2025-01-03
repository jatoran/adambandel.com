// gameUI.js
// =========

import { isBuilding } from './structures.js';

export class GameUI {
  /**
   * @param {GameState} state - The shared game state
   */
  constructor(state) {
    this.state = state;

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

    // Initial render
    this.render();
  }

  /** Show the current state of the grid + player's inventory */
  render() {
    const { grid, playerPos, gridSize } = this.state;

    // Controls reference
    const controls = this.state.controls; // if stored in state
    const hoveredR = controls ? controls.hoveredRow : null;
    const hoveredC = controls ? controls.hoveredCol : null;
    const action   = controls ? controls.currentAction : null;
    const dir      = controls ? controls.currentDirection : null;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = grid[r][c];
        const cellDiv = this.cellElements[r][c];
        cellDiv.className = 'cell';
        cellDiv.innerHTML = '';

        // Base class
        cellDiv.classList.add(cell.type);

        // Powered cell highlight
        if (cell.powered) {
          cellDiv.classList.add('powered-cell');
        }

        // If there's an item on ground
        if (cell.item) {
          const itemEl = document.createElement('div');
          itemEl.classList.add('item-indicator');
          switch (cell.item.type) {
            case 'raw':
              itemEl.classList.add('item-raw');
              break;
            case 'processed':
              itemEl.classList.add('item-processed');
              break;
            case 'final':
              itemEl.classList.add('item-final');
              break;
          }
          cellDiv.appendChild(itemEl);
        }

        // If building is storage, show stored items
        if (cell.type === 'storage' && cell.buildingState?.storedItems) {
          const container = document.createElement('div');
          container.classList.add('storage-items');
          for (const stItem of cell.buildingState.storedItems) {
            const itemEl = document.createElement('div');
            itemEl.classList.add('item-indicator');
            switch (stItem.type) {
              case 'raw':
                itemEl.classList.add('item-raw');
                break;
              case 'processed':
                itemEl.classList.add('item-processed');
                break;
              case 'final':
                itemEl.classList.add('item-final');
                break;
            }
            container.appendChild(itemEl);
          }
          cellDiv.appendChild(container);
        }

        // If building has an internal item
        if (isBuilding(cell) && cell.buildingState?.item) {
          const buildingItem = cell.buildingState.item;
          const storedItemEl = document.createElement('div');
          storedItemEl.classList.add('item-indicator');
          switch (buildingItem.type) {
            case 'raw':
              storedItemEl.classList.add('item-raw');
              break;
            case 'processed':
              storedItemEl.classList.add('item-processed');
              break;
            case 'final':
              storedItemEl.classList.add('item-final');
              break;
          }
          cellDiv.appendChild(storedItemEl);
        }

        // If there's an output direction
        if (cell.outputDir && (cell.type === 'merger' || cell.type === 'splitter' || isBuilding(cell))) {
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

        // ------------- BUILDING PREVIEW (BLUEPRINT) -------------
        // If this cell is the hovered cell, and the current action is a building
        if (r === hoveredR && c === hoveredC) {
          if (action && this.isPlaceableBuilding(action)) {
            const previewDiv = document.createElement('div');
            previewDiv.classList.add('blueprint-preview');
            previewDiv.classList.add(action); // so it looks like that building's color

            // Possibly show direction arrow too
            if (this.isDirectionNeeded(action) && dir) {
              const arrowEl = document.createElement('div');
              arrowEl.classList.add('arrow');
              arrowEl.textContent = this.getArrowSymbol(dir);
              previewDiv.appendChild(arrowEl);
            }

            cellDiv.appendChild(previewDiv);
          }
        }
      }
    }

    this.updateUI();
  }

  /**
   * Collect resource from a resource-node cell (e.g. ironOre).
   * We check maxResourceCount and increment the correct inventory key.
   */
  handleResourceCollection(cell) {
    if (!cell.resourceType) return;
    const rType = cell.resourceType; // e.g. "ironOre"
    const { playerInventory, maxResourceCount } = this.state;

    // Make sure inventory for this rType exists
    if (playerInventory[rType] == null) {
      playerInventory[rType] = 0;
    }

    if (playerInventory[rType] < maxResourceCount) {
      playerInventory[rType]++;
      // Optionally remove the resource node or reduce the node's durability, etc.
      // For now, it's infinite.
    }

    // Update the UI + inventory panel
    this.updateUI();
    // If we have an inventoryUI, refresh it too:
    if (this.state.controls && this.state.controls.ui && this.state.controls.ui.inventoryUI) {
      this.state.controls.ui.inventoryUI.render();
    }
  }

  // Update the simple top-left inventory display (currently showing just ironOre capacity)
  updateUI() {
    // If you want to show only ironOre, do:
    const { ironOre, ironPlate, ironGear } = this.state.playerInventory;
    this.inventoryDisplay.textContent =
      `Ore: ${ironOre}/${this.state.maxResourceCount} | ` +
      `Plates: ${ironPlate} | Gears: ${ironGear}`;
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

  isPlaceableBuilding(action) {
    return !(['mine','remove'].includes(action));
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

  showFeedback(msg) {
    const messageLog = document.getElementById('messageLog');
    if (!messageLog) return;

    // Clear existing messages
    messageLog.innerHTML = '';

    // Create a single new line
    const line = document.createElement('div');
    line.textContent = msg;
    messageLog.appendChild(line);
  }

}
