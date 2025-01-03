// gameState.js
// ============

export class GameState {
    constructor() {
      this.gridSize = 10;
      this.interactionRange = 4;
  
      this.grid = []; // 2D array
  
      // Updated player inventory with multiple resources
      this.playerInventory = {
        ironOre: 0,
        ironPlate: 0,
        ironGear: 0,
      };
      this.maxResourceCount = 100;
  
      // Player starts near center
      this.playerPos = { row: 5, col: 5 };
      this.currentTier = 1;
    }
  
    initGrid() {
      // Create empty grid
      for (let r = 0; r < this.gridSize; r++) {
        const rowArr = [];
        for (let c = 0; c < this.gridSize; c++) {
          rowArr.push({
            type: 'empty',
            item: null,
            outputDir: null,
            resourceType: null,
            buildingState: {},
            powered: false,     // track if this cell is powered
            energyRegion: false // track if this cell is an energy region
          });
        }
        this.grid.push(rowArr);
      }
  
      // Place source
      this.grid[0][0].type = 'source';
  
      // Place resource nodes (renamed to ironOre)
      this.grid[2][2].type = 'resource-node';
      this.grid[2][2].resourceType = 'ironOre';
  
      this.grid[4][5].type = 'resource-node';
      this.grid[4][5].resourceType = 'ironOre';
  
      // Let's place an "energy region" for accumulators
      this.grid[2][7].type = 'energy-region';
      this.grid[2][7].energyRegion = true;
      // Another example energy region
      this.grid[6][1].type = 'energy-region';
      this.grid[6][1].energyRegion = true;
    }
  }
  