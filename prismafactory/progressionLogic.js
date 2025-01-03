// progressionLogic.js
// ===================

import { StorageLogic } from './structures.js';

/**
 * Manages progression across tiers (T1 -> T2 -> T3, etc.).
 */
export class ProgressionLogic {
  /**
   * @param {GameState} state - The shared game state
   * @param {GameUI}    ui    - The UI (for rerender or notifications)
   */
  constructor(state, ui) {
    this.state = state;
    this.ui = ui;
  }

  /**
   * Called periodically by GameLogic (or once per tick) to check if
   * we've met conditions to advance from Tier 1 to Tier 2, etc.
   */
  updateTierProgression() {
    // Only do Tier 1 → Tier 2 checks if we are currently in Tier 1
    if (this.state.currentTier === 1) {
      // Check if any 'portal' building has enough final items
      if (this.isPortalReadyForTier2()) {
        this.unlockTier2();
      }
    }

    // Similarly, you can add Tier 2 → Tier 3 checks here, and so on
    // if (this.state.currentTier === 2 && someCondition) { ... }
  }

  /**
   * Returns true if there's a portal on the grid that has enough
   * Tier 1 final items to unlock Tier 2.
   */
  isPortalReadyForTier2() {
    const { gridSize, grid } = this.state;
    // Example: we require 10 final items
    const requiredCount = 10;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = grid[r][c];
        if (cell.type === 'portal') {
          // We'll assume portal also uses "storedItems" in buildingState
          const items = cell.buildingState.storedItems || [];
          // Count how many are 'final' T1 items
          const finalCount = items.filter(it => it.type === 'final').length;
          if (finalCount >= requiredCount) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Called once the portal is loaded with enough T1 final items.
   */
  unlockTier2() {
    // 1) Update the game’s current tier
    this.state.currentTier = 2;
    this.ui.showFeedback("Tier 2 Unlocked!");

    // 2) Example approach: place new resource nodes for Tier 2 
    //    (This is just one possible approach.)
    //    We put some T2 resource nodes out on the grid
    this.addTier2ResourceNodes();

    // 3) Possibly remove the T1 final items from the portal or just keep them
    //    We can drain them or leave them at your discretion.
    this.drainPortalItems();

    // 4) Provide some UI feedback
    this.ui.showFeedback("Tier 2 has been unlocked! New resources are now available.");
    this.ui.render();
  }

  /**
   * Example function that spawns Tier 2 resource nodes in the grid.
   */
  addTier2ResourceNodes() {
    // Create some T2 resource nodes at random or fixed positions
    const { grid } = this.state;
    if (grid[7][7]) {
      grid[7][7].type = 'resource-node';
      grid[7][7].resourceType = 'silver';  // for example
    }
    if (grid[8][2]) {
      grid[8][2].type = 'resource-node';
      grid[8][2].resourceType = 'copper';  // for example
    }
  }

  /**
   * Optionally drain or reduce the final items from any portal after unlocking T2.
   */
  drainPortalItems() {
    const { gridSize, grid } = this.state;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = grid[r][c];
        if (cell.type === 'portal') {
          // Wipe or reduce stored items
          cell.buildingState.storedItems = [];
        }
      }
    }
  }
}
