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

    // No longer do we build action buttons or bind keyboard events here
    // That's all in gameControls

    // Initial render
    this.render();
  }

  /** Show the current state of the grid + player's inventory */
  render() {
    const { grid, playerPos, gridSize } = this.state;
    // We'll also read hovered cell + selected building from controls
    // So let's do a quick "if" check for that data
    // We'll do so by referencing a global or passing them in. Typically you'd pass them in or store them in state, but let's assume we have:
    //   this.state.controls  => an instance of GameControls
    // Or you can have a direct reference if you pass it in. We'll assume the simplest approach:

    const controls = this.state.controls; // if you store it in main.js
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
            case 'raw':       itemEl.classList.add('item-raw'); break;
            case 'processed': itemEl.classList.add('item-processed'); break;
            case 'final':     itemEl.classList.add('item-final'); break;
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
              case 'raw':       itemEl.classList.add('item-raw'); break;
              case 'processed': itemEl.classList.add('item-processed'); break;
              case 'final':     itemEl.classList.add('item-final'); break;
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
            case 'raw':       storedItemEl.classList.add('item-raw');       break;
            case 'processed': storedItemEl.classList.add('item-processed'); break;
            case 'final':     storedItemEl.classList.add('item-final');     break;
          }
          cellDiv.appendChild(storedItemEl);
        }

        // If there's an output direction
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

        // ------------- BUILDING PREVIEW (BLUEPRINT) -------------
        // If this cell is the hovered cell, and the current action is a building
        // We want to draw a translucent preview
        if (r === hoveredR && c === hoveredC) {
          if (action && this.isPlaceableBuilding(action)) {
            // We'll add an overlay to show the blueprint
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

  handleResourceCollection(cell) {
    if (!cell.resourceType) return;
    const { playerInventory, maxResourceCount } = this.state;
    if (playerInventory[cell.resourceType] < maxResourceCount) {
      playerInventory[cell.resourceType]++;
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

  isPlaceableBuilding(action) {
    // If it's not 'mine' or 'remove', we consider it placeable
    return !(['mine','remove'].includes(action));
  }

  isDirectionNeeded(action) {
    return ['conveyor','extractor','processor','assembler'].includes(action);
  }
}
