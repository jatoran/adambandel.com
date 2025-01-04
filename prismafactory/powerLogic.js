// powerLogic.js
// =============

/**
 * Handles power generation and distribution across the grid.
 * 
 * - Accumulators (on 'energy-region') generate power.
 * - Power Poles distribute power in an AOE.
 * - Buildings that require power (extractors/processors) only operate if powered.
 */
export class PowerLogic {
    /**
     * @param {GameState} state 
     */
    constructor(state) {
      this.state = state;
    }
  
    /**
     * Called periodically by GameLogic to recalculate which cells are powered.
     */
    updatePowerCoverage() {
      const { numRows, numCols, grid } = this.state;
  
      // First, clear any existing powered flags on the grid
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          grid[r][c].powered = false;
        }
      }
  
      // 1) Mark cells with accumulators as powered (they produce power)
      //    BUT only if they are placed on an energy region (per design doc)
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = grid[r][c];
          if (cell.type === 'accumulator' && cell.energyRegion) {
            cell.powered = true;
          }
        }
      }
  
      // 2) For each Power Pole, mark cells in range as powered if
      //    there is a chain of power from an accumulator or another powered pole.
      //    For simplicity, we’ll do a BFS from each power pole that is connected
      //    (directly or indirectly) to a powered cell. 
      //    But here, we’ll do a simpler approach: 
      //    - If a power pole is in range of a powered cell, that pole is powered.
      //    - Then the pole powers everything in its radius. 
      //    This is a “one-step” approach but is enough for a small prototype.
      //    For bigger networks, you might do multi-step BFS or a union-find approach.
  
      // First pass: identify all powered cells, see if any power poles are in range -> they become powered
      const powerPoleRadius = 2;
      let changed = true;
      while (changed) {
        changed = false;
        for (let r = 0; r < numRows; r++) {
          for (let c = 0; c < numCols; c++) {
            const cell = grid[r][c];
            if (cell.type === 'powerPole' && !cell.powered) {
              if (this.isNearPoweredCell(r, c, powerPoleRadius)) {
                cell.powered = true;
                changed = true;
              }
            }
          }
        }
      }
  
      // Second pass: any power pole that’s powered will power all cells in radius
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = grid[r][c];
          if (cell.type === 'powerPole' && cell.powered) {
            this.markCellsPowered(r, c, powerPoleRadius);
          }
        }
      }
    }
    
  
    /**
     * Checks if there is any powered cell within `radius` of (r, c).
     */
    isNearPoweredCell(r, c, radius) {
      const { numRows, numCols, grid } = this.state;
      for (let rr = r - radius; rr <= r + radius; rr++) {
        for (let cc = c - radius; cc <= c + radius; cc++) {
          if (
            rr >= 0 && rr < numRows &&
            cc >= 0 && cc < numCols
          ) {
            const dist = Math.abs(rr - r) + Math.abs(cc - c);
            if (dist <= radius && grid[rr][cc].powered) {
              return true;
            }
          }
        }
      }
      return false;
    }
  
    /**
     * Marks all cells within `radius` of (r, c) as powered.
     */
    markCellsPowered(r, c, radius) {
      const { numRows, numCols, grid } = this.state;
      for (let rr = r - radius; rr <= r + radius; rr++) {
        for (let cc = c - radius; cc <= c + radius; cc++) {
          if (
            rr >= 0 && rr < numRows &&
            cc >= 0 && cc < numCols
          ) {
            const dist = Math.abs(rr - r) + Math.abs(cc - c);
            if (dist <= radius) {
              grid[rr][cc].powered = true;
            }
          }
        }
      }
    }
  
    /**
     * Helper for checking if a cell is powered. 
     * (You might use this from GameLogic if needed.)
     */
    isCellPowered(r, c) {
      return this.state.grid[r][c].powered;
    }
  }
  
  