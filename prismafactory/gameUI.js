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
        if (cell.type === 'conveyor') {
          // Add a direction-specific class for styling
          if (cell.outputDir) {
            cellDiv.classList.add('dir-' + cell.outputDir);
          }
        
          // Create an inner div for the animation
          const conveyorAnim = document.createElement('div');
          conveyorAnim.classList.add('conveyor-anim');
          cellDiv.appendChild(conveyorAnim);
        }

        // Powered cell highlight
        if (cell.powered) {
          cellDiv.classList.add('powered-cell');
        }

        // If building, add a small label (e.g. [CV] for Conveyor)
        if (isBuilding(cell) && cell.type !== 'conveyor') {
          const labelEl = document.createElement('div');
          labelEl.classList.add('building-label');
          labelEl.textContent = this.getBuildingLabel(cell.type);
          cellDiv.appendChild(labelEl);
        }

        // If there's an item on ground
        if (cell.item) {
          const itemEl = document.createElement('div');
          itemEl.classList.add('item-indicator');
          
          // Show distinct ASCII text for each item type
          switch (cell.item.type) {
            case 'raw':
              itemEl.classList.add('item-raw');
              // itemEl.textContent = 'RAW';
              break;
            case 'processed':
              itemEl.classList.add('item-processed');
              // itemEl.textContent = 'PRC';
              break;
            case 'final':
              itemEl.classList.add('item-final');
              // itemEl.textContent = 'FIN';
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
            // Again, distinct text for each item type
            switch (stItem.type) {
              case 'raw':
                itemEl.classList.add('item-raw');
                // itemEl.textContent = 'RAW';
                break;
              case 'processed':
                itemEl.classList.add('item-processed');
                // itemEl.textContent = 'PRC';
                break;
              case 'final':
                itemEl.classList.add('item-final');
                // itemEl.textContent = 'FIN';
                break;
            }
            container.appendChild(itemEl);
          }
          cellDiv.appendChild(container);
        }

        // If building has an internal item
        // if (isBuilding(cell) && cell.buildingState?.item) {
        //   const buildingItem = cell.buildingState.item;
        //   const storedItemEl = document.createElement('div');
        //   storedItemEl.classList.add('item-indicator');
        //   switch (buildingItem.type) {
        //     case 'raw':
        //       storedItemEl.classList.add('item-raw');
        //       // storedItemEl.textContent = 'RAW';
        //       break;
        //     case 'processed':
        //       storedItemEl.classList.add('item-processed');
        //       // storedItemEl.textContent = 'PRC';
        //       break;
        //     case 'final':
        //       storedItemEl.classList.add('item-final');
        //       // storedItemEl.textContent = 'FIN';
        //       break;
        //   }
        //   cellDiv.appendChild(storedItemEl);
        // }

        // If there's an output direction
        if (cell.outputDir && isBuilding(cell)) {
          const arrowEl = document.createElement('div');
          arrowEl.classList.add('arrow');
          arrowEl.textContent = this.getArrowSymbol(cell.outputDir);
          arrowEl.classList.add(cell.outputDir);
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
            previewDiv.classList.add(action); // so it uses that building's color

            // Show arrow for blueprint direction
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
  }

  /**
   * Collect resource from a resource-node cell (e.g. ironOre).
   * We check maxResourceCount and increment the correct inventory key.
   */
  handleResourceCollection(cell) {
    if (!cell.resourceType) return;
    const rType = cell.resourceType; // e.g. "ironOre"
    const { playerInventory, maxResourceCount } = this.state;

    // Ensure inventory for this rType exists
    if (playerInventory[rType] == null) {
      playerInventory[rType] = 0;
    }

    if (playerInventory[rType] < maxResourceCount) {
      playerInventory[rType]++;
      // (infinite node for now)
    }

    // Update inventory panel
    if (this.state.controls && this.state.controls.ui && this.state.controls.ui.inventoryUI) {
      this.state.controls.ui.inventoryUI.render();
    }
  }


  isInInteractionRange(row, col) {
    const { row: pr, col: pc } = this.state.playerPos;
    const dist = Math.abs(row - pr) + Math.abs(col - pc);
    return dist <= this.state.interactionRange;
  }

  /* ASCII arrow symbols for a retro vibe */
  getArrowSymbol(dir) {
    switch (dir) {
      case 'up':    return '^';
      case 'down':  return 'v';
      case 'left':  return '<';
      case 'right': return '>';
      default:      return '?';
    }
  }

  /* Return an ASCII label for each building type. */
  getBuildingLabel(type) {
    switch (type) {
      case 'conveyor':    return '[CV]';
      case 'extractor':   return '[EX]';
      case 'processor':   return '[PR]';
      case 'assembler':   return '[AS]';
      case 'storage':     return '[ST]';
      case 'merger':      return '[MG]';
      case 'splitter':    return '[SP]';
      case 'portal':      return '[PO]';
      case 'accumulator': return '[AC]';
      case 'powerPole':   return '[PW]';
      default:            return '[??]';
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
