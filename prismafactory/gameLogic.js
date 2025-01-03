// gameLogic.js
// ============

import { 
    ExtractorLogic, 
    ProcessorLogic, 
    AssemblerLogic, 
    isBuilding, 
    oppositeDir, 
    getNextCellCoords,
    StorageLogic
  } from './structures.js';
import { PowerLogic } from './powerLogic.js';
export class GameLogic {
  /**
   * @param {GameState} state - The shared game state
   * @param {GameUI} ui - The UI, so we can call ui.render() as needed
   */
  constructor(state, ui) {
    this.state = state;
    this.ui = ui;
    this.powerLogic = new PowerLogic(state);
  }

  init() {
    // Start the intervals
    // 1) Source logic
    setInterval(() => this.updateSource(), 1000);

    // 2) Building & item flow updates
    setInterval(() => {
      // 2a) Recompute which cells are powered
      this.powerLogic.updatePowerCoverage();
      this.updateExtractors();
      this.updateProcessors();
      this.updateAssemblers();
      this.updateStorages();
      this.moveItems();
      this.ui.render();
    }, 300);
  }

  updateSource() {
    const { grid } = this.state;
    const sourceCell = grid[0][0];
    const targetRow = 0;
    const targetCol = 1;

    if (targetCol < this.state.gridSize) {
      const targetCell = grid[targetRow][targetCol];
      if (!this.hasAnyItem(targetCell)) {
        // place a raw item
        if (isBuilding(targetCell)) {
          if (!targetCell.buildingState.item) {
            targetCell.buildingState.item = { type: 'raw', id: Date.now() };
          }
        } else {
          if (!targetCell.item) {
            targetCell.item = { type: 'raw', id: Date.now() };
          }
        }
      }
    }
  }

  updateStorages() {
    const { gridSize, grid } = this.state;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = grid[r][c];
        if (cell.type === 'storage') {
          // If you want to do anything special in the future
          StorageLogic.update(cell);
        }
      }
    }
  }


  updateExtractors() {
    const now = Date.now();
    const { gridSize, grid } = this.state;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = grid[r][c];
        if (cell.type === 'extractor') {
            if (cell.powered) {
                ExtractorLogic.update(cell, now);
            }
        }
      }
    }
  }

  updateProcessors() {
    const { gridSize, grid } = this.state;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = grid[r][c];
        if (cell.type === 'processor') {
          if (cell.powered) {
           ProcessorLogic.update(cell);
          }
        }
      }
    }
  }

  updateAssemblers() {
    const { gridSize, grid } = this.state;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = grid[r][c];
        if (cell.type === 'assembler') {
          if (cell.powered) {
            AssemblerLogic.update(cell);
          }
        }
      }
    }
  }

  moveItems() {
    // We'll build a snapshot so each item only moves once per tick
    const { gridSize, grid } = this.state;
    const nextGrid = structuredClone(grid);

    // 1) Move items out of buildingState
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const cell = grid[r][c];
            if (isBuilding(cell) && cell.buildingState.item) {
            const buildingItem = cell.buildingState.item;
            const [nr, nc] = getNextCellCoords(r, c, cell.outputDir);
        
            if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
                const nextCell = grid[nr][nc];
                // Check if next cell can accept from this direction
                if (
                !this.hasAnyItem(nextCell) ||
                // For storage, hasAnyItem(nextCell) might be true if it has some items,
                // so let's refine that check. We can skip !this.hasAnyItem(...) if it's storage
                (nextCell.type === 'storage' && this.canAcceptFrom(nextCell, oppositeDir(cell.outputDir)))
                ) {
                // If next cell is storage, store the item
                if (nextCell.type === 'storage') {
                    // Attempt to store
                    const success = StorageLogic.tryStoreItem(nextGrid[nr][nc], buildingItem);
                    if (success) {
                    // remove from source building
                    nextGrid[r][c].buildingState.item = null;
                    }
                } else {
                    // old logic
                    if (this.canAcceptFrom(nextCell, oppositeDir(cell.outputDir))) {
                    // move the item to buildingState.item or cell.item
                    nextGrid[r][c].buildingState.item = null;
        
                    if (isBuilding(nextCell)) {
                        nextGrid[nr][nc].buildingState.item = structuredClone(buildingItem);
                    } else {
                        nextGrid[nr][nc].item = structuredClone(buildingItem);
                    }
                    }
                }
                }
            }
            }
        }
        }

    // 2) Conveyors might "pull" items if cell.item is on them
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = grid[r][c];
        if (cell.type === 'conveyor' && !cell.buildingState.item && cell.item) {
          nextGrid[r][c].item = null;
          nextGrid[r][c].buildingState.item = structuredClone(cell.item);
        }
      }
    }

    // Copy nextGrid back
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        grid[r][c].item = nextGrid[r][c].item;
        grid[r][c].buildingState = structuredClone(nextGrid[r][c].buildingState);
      }
    }
  }

  hasAnyItem(cell) {
    // If it's storage, check storedItems length
    if (cell.type === 'storage') {
      return cell.buildingState?.storedItems?.length > 0;
    }
    // Fallback for other buildings
    if (cell.item) return true;
    if (cell.buildingState?.item) return true;
    return false;
  }
  

  canAcceptFrom(cell, fromDir) {
    // If building, check logic. Otherwise, check if cell is empty
    if (isBuilding(cell)) {
      // If it's a storage, we don't need to worry about 'outputDir !== fromDir'
      // as strictly, but you might want to keep that rule for consistency
      if (cell.type === 'storage') {
        // Storage can accept an item if it has space
        return StorageLogic.hasSpace(cell);
      }
      // For other buildings, we keep the existing logic
      if (!cell.buildingState.item && cell.outputDir !== fromDir) {
        return true;
      }
      return false;
    } else {
      // empty or resource-node can store item on the cell
      if (!cell.item) {
        return true;
      }
      return false;
    }
  }
}
