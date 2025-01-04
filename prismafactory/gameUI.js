// gameUI.js
// =========

import { isBuilding } from './structures.js';
import { ItemDefinitions } from './itemDefinitions.js';

export class GameUI {
  constructor(state) {
    this.state = state;
    this.gridContainer = document.getElementById('grid');
    this.cellElements = [];
    this.messageHideTimer = null;
  }

  init() {
    const { numRows, numCols } = this.state;
  
    // Rebuild cell elements
    for (let r = 0; r < numRows; r++) {
      this.cellElements[r] = [];
      for (let c = 0; c < numCols; c++) {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        this.gridContainer.appendChild(cellDiv);
        this.cellElements[r][c] = cellDiv;
      }
    }
  
    // Adjust the grid layout to numCols wide by numRows tall:
    this.gridContainer.style.gridTemplateColumns = `repeat(${numCols}, var(--cell-size))`;
    this.gridContainer.style.gridTemplateRows = `repeat(${numRows}, var(--cell-size))`;
  
    this.render();
  }
  

  /**
 * Renders a 10×10 "camera" (viewport) around the player if Tier 3 is large.
 * For Tiers 1 & 2 (smaller grids), if numRows/numCols <= 10, it will just show the entire grid anyway.
 *
 * Modify constants VIEW_ROWS, VIEW_COLS as desired.
 */
  render() {
    const { grid, numRows, numCols, playerPos, currentTier } = this.state;
    const controls = this.state.controls;
    const hoveredR = controls?.hoveredRow ?? null;
    const hoveredC = controls?.hoveredCol ?? null;
    const action   = controls?.currentAction ?? null;
    const dir      = controls?.currentDirection ?? null;
  
    const VIEW_ROWS = 10;
    const VIEW_COLS = 10;
  
    // 1) Compute camera top-left
    let topLeftRow, topLeftCol;
  
    if (currentTier < 3) {
      // Tiers 1 & 2: clamp to keep camera within the grid
      topLeftRow = playerPos.row - Math.floor(VIEW_ROWS / 2);
      topLeftRow = Math.max(0, Math.min(topLeftRow, numRows - VIEW_ROWS));
  
      topLeftCol = playerPos.col - Math.floor(VIEW_COLS / 2);
      topLeftCol = Math.max(0, Math.min(topLeftCol, numCols - VIEW_COLS));
    } else {
      // Tier 3: infinite vertical, but horizontally clamp
      // topLeftRow is unbounded:
      topLeftRow = playerPos.row - Math.floor(VIEW_ROWS / 2);
  
      // topLeftCol is clamped so we don't go beyond the grid horizontally
      topLeftCol = playerPos.col - Math.floor(VIEW_COLS / 2);
      topLeftCol = Math.max(0, Math.min(topLeftCol, numCols - VIEW_COLS));
    }
  
    // 2) Prepare to wrap the player's row/col for highlight check
    const { row: pRow, col: pCol } = playerPos;
    let wrappedPlayerRow = pRow;
    let wrappedPlayerCol = pCol;
    if (currentTier === 3) {
      // ring wrap vertically
      wrappedPlayerRow = (pRow % numRows + numRows) % numRows;
      // clamp horizontally
      wrappedPlayerCol = Math.max(0, Math.min(pCol, numCols - 1));
    }
  
    // 3) Clear existing DOM
    this.gridContainer.innerHTML = '';
    this.cellElements = [];
  
    // Build the 10×10 viewport
    for (let vr = 0; vr < VIEW_ROWS; vr++) {
      this.cellElements[vr] = [];
      for (let vc = 0; vc < VIEW_COLS; vc++) {
  
        // "Global" coords in camera space
        const globalR = topLeftRow + vr;
        const globalC = topLeftCol + vc;
  
        // Now we wrap row if tier=3, clamp col
        let wrappedRow, wrappedCol;
        if (currentTier === 3) {
          wrappedRow = (globalR % numRows + numRows) % numRows;
          wrappedCol = Math.max(0, Math.min(globalC, numCols - 1));
        } else {
          wrappedRow = globalR;
          wrappedCol = globalC;
        }
  
        if (wrappedCol < 0 || wrappedCol >= numCols) {
          // out of bounds horizontally => skip or show placeholder
          wrappedCol = 0;
        }
  
        // Access the cell
        const cell = grid[wrappedRow][wrappedCol];
  
        // Create DOM
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        this.cellElements[vr][vc] = cellDiv;
        this.gridContainer.appendChild(cellDiv);

      // Reset the cell’s HTML/class
      cellDiv.innerHTML = '';
      cellDiv.classList.add(cell.type);

      // ──────────────────────────────────
      // Extractor styling & resource icon
      // ──────────────────────────────────
      if (cell.type === 'extractor') {
        const resType = cell.buildingState?.underlyingResourceType;
        const resDef  = ItemDefinitions[resType];
        if (resType && resDef && resDef.extractorStyle) {
          // Inline style for the cell
          for (const [prop, val] of Object.entries(resDef.extractorStyle)) {
            cellDiv.style[prop] = val;
          }
          // Resource icon
          const iconEl = document.createElement('div');
          iconEl.classList.add('extractor-resource-icon');
          iconEl.style.backgroundColor = resDef.itemColor;
          iconEl.classList.add(`shape-${resDef.itemShape}`);
          cellDiv.appendChild(iconEl);
        }
      }

      // ──────────────────────────────────
      // Conveyor direction + animation
      // ──────────────────────────────────
      if (cell.type === 'conveyor' && cell.outputDir) {
        cellDiv.classList.add('dir-' + cell.outputDir);
        const conveyorAnim = document.createElement('div');
        conveyorAnim.classList.add('conveyor-anim');
        cellDiv.appendChild(conveyorAnim);
      }

      // Powered highlight
      if (cell.powered) {
        cellDiv.classList.add('powered-cell');
      }

      // Building label (except conveyor)
      if (isBuilding(cell) && cell.type !== 'conveyor') {
        const labelEl = document.createElement('div');
        labelEl.classList.add('building-label');
        labelEl.textContent = this.getBuildingLabel(cell.type);
        cellDiv.appendChild(labelEl);
      }

      // ──────────────────────────────────
      // Resource node
      // ──────────────────────────────────
      if (cell.type === 'resource-node') {
        const resType = cell.resourceType;
        const resDef  = ItemDefinitions[resType];
        const label = document.createElement('div');
        label.classList.add('resource-label');
        if (resDef) {
          label.textContent = resDef.displayName;
          label.style.color = resDef.itemColor;
        } else {
          label.textContent = resType || "???";
        }
        cellDiv.appendChild(label);
      }
      else if (cell.type === 'energy-region') {
        const energyLabel = document.createElement('div');
        energyLabel.classList.add('energy-label');
        energyLabel.textContent = 'ENERGY';
        energyLabel.style.color = '#00ffff';
        cellDiv.appendChild(energyLabel);
      }

      // ──────────────────────────────────
      // Ground item
      // ──────────────────────────────────
      if (cell.item) {
        const itemEl = document.createElement('div');
        itemEl.classList.add('item-indicator');

        if (cell.item.type === 'raw') {
          const itemRes = cell.item.resourceType;
          if (itemRes && ItemDefinitions[itemRes]) {
            itemEl.style.backgroundColor = ItemDefinitions[itemRes].itemColor;
            const shapeName = ItemDefinitions[itemRes].itemShape;
            if (shapeName) {
              itemEl.classList.add(`shape-${shapeName}`);
            }
          } else {
            itemEl.classList.add('item-raw');
          }
        }
        else if (cell.item.type === 'processed') {
          itemEl.classList.add('item-processed');
        }
        else if (cell.item.type === 'final') {
          itemEl.classList.add('item-final');
        }
        cellDiv.appendChild(itemEl);
      }

      // ──────────────────────────────────
      // Storage contents
      // ──────────────────────────────────
      if (cell.type === 'storage' && cell.buildingState?.storedItems) {
        const container = document.createElement('div');
        container.classList.add('storage-items');
        for (const stItem of cell.buildingState.storedItems) {
          const stEl = document.createElement('div');
          stEl.classList.add('item-indicator');
          if (stItem.type === 'raw' && stItem.resourceType && ItemDefinitions[stItem.resourceType]) {
            const def = ItemDefinitions[stItem.resourceType];
            stEl.style.backgroundColor = def.itemColor;
            stEl.classList.add(`shape-${def.itemShape}`);
          }
          else if (stItem.type === 'processed') {
            stEl.classList.add('item-processed');
          }
          else if (stItem.type === 'final') {
            stEl.classList.add('item-final');
          }
          container.appendChild(stEl);
        }
        cellDiv.appendChild(container);
      }

      // ──────────────────────────────────
      // Processor / Assembler product icon
      // ──────────────────────────────────
      if (cell.type === 'processor' || cell.type === 'assembler') {
        const recipeKey = cell.buildingState.recipe;
        if (recipeKey) {
          const outDef = ItemDefinitions[recipeKey];
          if (outDef) {
            const iconEl = document.createElement('div');
            iconEl.classList.add('structure-product-icon');
            iconEl.style.backgroundColor = outDef.itemColor;
            iconEl.classList.add(`shape-${outDef.itemShape}`);
            cellDiv.appendChild(iconEl);
          }
        }
      }

      // If building is holding an item
      if (isBuilding(cell) && cell.buildingState.item) {
        const bItem = cell.buildingState.item;
        const itemEl = document.createElement('div');
        itemEl.classList.add('item-indicator');
        if (bItem.type === 'raw' && bItem.resourceType && ItemDefinitions[bItem.resourceType]) {
          const def = ItemDefinitions[bItem.resourceType];
          itemEl.style.backgroundColor = def.itemColor;
          itemEl.classList.add(`shape-${def.itemShape}`);
        }
        else if (bItem.type === 'processed') {
          itemEl.classList.add('item-processed');
        }
        else if (bItem.type === 'final') {
          itemEl.classList.add('item-final');
        }
        cellDiv.appendChild(itemEl);
      }

      // Output arrow
      if (cell.outputDir && isBuilding(cell)) {
        const arrowEl = document.createElement('div');
        arrowEl.classList.add('arrow', cell.outputDir);
        arrowEl.textContent = this.getArrowSymbol(cell.outputDir);
        cellDiv.appendChild(arrowEl);
      }

      // Check "in-range" highlighting. 
      // We must pass the real global coords (r,c) to isInInteractionRange.
      if (this.isInInteractionRange(globalR, globalC)) {
        cellDiv.classList.add('in-range');
      }

      // Player highlight:
      if (wrappedRow === wrappedPlayerRow && wrappedCol === wrappedPlayerCol) {
        cellDiv.classList.add('player-cell');
      }

      // Blueprint preview if hovered
      if (globalR === hoveredR && globalC === hoveredC) {
        if (action && this.isPlaceableBuilding(action)) {
          const previewDiv = document.createElement('div');
          previewDiv.classList.add('blueprint-preview', action);
          if (this.isDirectionNeeded(action) && dir) {
            const arrow = document.createElement('div');
            arrow.classList.add('arrow', dir);
            arrow.textContent = this.getArrowSymbol(dir);
            previewDiv.appendChild(arrow);
          }
          cellDiv.appendChild(previewDiv);
        }
      }
    }

  // Set up the container for the 10×10 cells
  this.gridContainer.style.gridTemplateRows = `repeat(${VIEW_ROWS}, var(--cell-size))`;
  this.gridContainer.style.gridTemplateColumns = `repeat(${VIEW_COLS}, var(--cell-size))`;

  // Store camera info if needed by other code
  this.cameraTopLeftRow = topLeftRow;
  this.cameraTopLeftCol = topLeftCol;
  this.cameraRows = VIEW_ROWS;
  this.cameraCols = VIEW_COLS;

  // Tier Indicator
  const tierIndicatorEl = document.getElementById('tierIndicator');
    if (tierIndicatorEl) {
      tierIndicatorEl.textContent = `Current Tier: ${this.state.currentTier}`;
    }
  }
}


  handleResourceCollection(cell) {
    if (!cell.resourceType) return;
    const rType = cell.resourceType;
    const { playerInventory, maxResourceCount } = this.state;

    if (playerInventory[rType] == null) {
      playerInventory[rType] = 0;
    }
    if (playerInventory[rType] < maxResourceCount) {
      playerInventory[rType]++;
    }

    if (this.state.controls?.ui?.inventoryUI) {
      this.state.controls.ui.inventoryUI.render();
    }
  }

  isInInteractionRange(row, col) {
    const { currentTier, numRows, interactionRange } = this.state;
    const playerRow = this.state.playerPos.row;
    const playerCol = this.state.playerPos.col;
  
    // Horizontal distance is the same for all tiers
    const dx = Math.abs(col - playerCol);
  
    let dy;
    if (currentTier === 3) {
      // Use ring-based vertical distance
      const rawDiff = Math.abs(row - playerRow);
      dy = Math.min(rawDiff, numRows - rawDiff);
    } else {
      // Normal vertical distance
      dy = Math.abs(row - playerRow);
    }
  
    // Manhattan distance
    const dist = dx + dy;
    return dist <= interactionRange;
  }

  getArrowSymbol(dir) {
    switch (dir) {
      case 'up':    return '^';
      case 'down':  return 'v';
      case 'left':  return '<';
      case 'right': return '>';
      default:      return '?';
    }
  }

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
    const overlayEl = document.getElementById('messageOverlay');
    if (!overlayEl) return;

    // Clear any existing timeout so we don't prematurely hide a new message
    if (this.messageHideTimer) {
      clearTimeout(this.messageHideTimer);
      this.messageHideTimer = null;
    }

    // Show message
    overlayEl.textContent = msg;
    overlayEl.style.display = 'block';

    // Hide after ~2 seconds
    this.messageHideTimer = setTimeout(() => {
      overlayEl.style.display = 'none';
      overlayEl.textContent = '';
      this.messageHideTimer = null;
    }, 2000);
  }
}