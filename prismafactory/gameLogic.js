// gameLogic.js
// ============

import { ExtractorLogic, ProcessorLogic, isBuilding, oppositeDir, getNextCellCoords } from './structures.js';
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
            if (!this.hasAnyItem(nextCell) && this.canAcceptFrom(nextCell, oppositeDir(cell.outputDir))) {
              // move the item
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
    if (cell.item) return true;
    if (cell.buildingState?.item) return true;
    return false;
  }

  canAcceptFrom(cell, fromDir) {
    // A building can accept if it has no item and fromDir != outputDir
    if (isBuilding(cell)) {
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
