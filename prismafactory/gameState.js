// gameState.js
export class GameState {
  constructor() {

    this.numRows = 10;   // default for Tier 1
    this.numCols = 10;   // default for Tier 1
    this.interactionRange = 4;

    this.grid = [];
    this.playerPos = { row: 5, col: 5 };

    this.playerInventory = {
      T1R01: 0,
      T1R02: 0,
      T1R03: 0,
      T1P01: 0,
      T1A01: 0,
    };
    this.maxResourceCount = 100;

    this.perTierData = { 1: null, 2: null, 3: null };
    this.currentTier = 1;

    this.defaultResourceSpawns = {
      T1R01: 3,
      T1R02: 2,
      T1R03: 2
    };
  }

}
