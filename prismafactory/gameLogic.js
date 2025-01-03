// gameLogic.js
// ============

import { 
    ExtractorLogic, 
    ProcessorLogic, 
    AssemblerLogic, 
    isBuilding, 
    oppositeDir, 
    getNextCellCoords,
    StorageLogic,
    PortalLogic
  } from './structures.js';
  import { PowerLogic } from './powerLogic.js';
  import { ProgressionLogic } from './progressionLogic.js';

  /**
   * GameLogic coordinates the “brains” of the game:
   * - Periodic updates for each building type
   * - Power coverage (via PowerLogic)
   * - Item movement (including Mergers/Splitters)
   */
  export class GameLogic {
    /**
     * @param {GameState} state - The shared game state
     * @param {GameUI}    ui    - The UI, so we can call ui.render() as needed
     */
    constructor(state, ui) {
      this.state = state;
      this.ui = ui;
      this.powerLogic = new PowerLogic(state);
      this.progressionLogic = new ProgressionLogic(state, ui);
    }
  
    /**
     * Initialize periodic update loops.
     */
    init() {
      // 1) Example “source” spawner update (every 1 second)
      setInterval(() => this.updateSource(), 1000);
  
      // 2) Main factory logic loop (power checks, building logic, item movement)
      setInterval(() => {
        // Recompute power coverage
        this.powerLogic.updatePowerCoverage();
  
        // Update each building type
        this.updateExtractors();
        this.updateProcessors();
        this.updateAssemblers();
        this.updateStorages();
        this.updatePortals();
  
        // Move items (includes conveyors, mergers, splitters, etc.)
        this.moveItems();

        // TIER PROGRESSION CHECK
        this.progressionLogic.updateTierProgression();
  
        // Re-render
        this.ui.render();
      }, 300);
    }
  
    /**
     * Example spawner: places a “raw” item at [0,1] if empty, purely for testing.
     */
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
  
    updatePortals() {
        const { gridSize, grid } = this.state;
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
            const cell = grid[r][c];
            if (cell.type === 'portal') {
                // If you only want to run if it's "powered," you could do that check
                PortalLogic.update(cell);
            }
            }
        }
    }

        
    /**
     * Update logic for all storage cells (if needed).
     */
    updateStorages() {
      const { gridSize, grid } = this.state;
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const cell = grid[r][c];
          if (cell.type === 'storage') {
            // Currently, there's no special “storage tick” logic
            // but you could expand it if you like.
            StorageLogic.update(cell);
          }
        }
      }
    }
  
    /**
     * Update logic for all extractors.
     */
    updateExtractors() {
      const now = Date.now();
      const { gridSize, grid } = this.state;
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const cell = grid[r][c];
          if (cell.type === 'extractor') {
            // Only run if powered
            if (cell.powered) {
              ExtractorLogic.update(cell, now);
            }
          }
        }
      }
    }
  
    /**
     * Update logic for all processors.
     */
    updateProcessors() {
      const { gridSize, grid } = this.state;
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const cell = grid[r][c];
          if (cell.type === 'processor') {
            // Only run if powered
            if (cell.powered) {
              ProcessorLogic.update(cell);
            }
          }
        }
      }
    }
  
    /**
     * Update logic for all assemblers.
     */
    updateAssemblers() {
      const { gridSize, grid } = this.state;
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const cell = grid[r][c];
          if (cell.type === 'assembler') {
            // Only run if powered
            if (cell.powered) {
              AssemblerLogic.update(cell);
            }
          }
        }
      }
    }
  
    /**
     * Master item flow function: moves items across conveyors, into/out of storages,
     * merges, splits, etc. Runs every tick.
     */
    moveItems() {
      const { gridSize, grid } = this.state;
      // Make a copy of the current grid to ensure each item only moves once per tick
      const nextGrid = structuredClone(grid);
  
      // 1) For each building, handle item output logic (merger, splitter, or standard)
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const cell = grid[r][c];
          if (!isBuilding(cell)) continue; // skip non-building cells
  
          if (cell.type === 'merger') {
            this.handleMergerOutput(r, c, nextGrid);
          }
          else if (cell.type === 'splitter') {
            this.handleSplitterOutput(r, c, nextGrid);
          }
          else {
            // conveyors, extractors, processors, assemblers, storage
            this.handleStandardBuildingOutput(r, c, nextGrid);
          }
        }
      }
  
      // 2) Conveyors might “pull” items from the cell floor if not already holding one
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const cell = grid[r][c];
          if (cell.type === 'conveyor' && !cell.buildingState.item && cell.item) {
            // Move the ground item into the conveyor’s buildingState
            nextGrid[r][c].item = null;
            nextGrid[r][c].buildingState.item = structuredClone(cell.item);
          }
        }
      }
  
      // 3) Commit nextGrid changes back to the real grid
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          grid[r][c].item = nextGrid[r][c].item;
          grid[r][c].buildingState = structuredClone(nextGrid[r][c].buildingState);
        }
      }
    }
  
    /**
     * Mergers combine up to 3 inputs into one output direction.
     */
    handleMergerOutput(r, c, nextGrid) {
      const cell = this.state.grid[r][c];
  
      // 1) If the merger is empty, try to pull from up to 3 directions
      if (!cell.buildingState.item) {
        const inputs = this.getMergerInputDirs(cell.outputDir);
        for (const inDir of inputs) {
          const [sr, sc] = getNextCellCoords(r, c, inDir);
          if (!this.isValidCell(sr, sc)) continue;
  
          const source = this.state.grid[sr][sc];
          // If source is a building with an item, and it’s outputDir is pointing to us:
          if (isBuilding(source) && source.buildingState.item && source.outputDir === oppositeDir(inDir)) {
            // Pull one item
            nextGrid[r][c].buildingState.item = structuredClone(source.buildingState.item);
            nextGrid[sr][sc].buildingState.item = null;
            break; // only pull one item this tick
          }
        }
      }
  
      // 2) If the merger has an item, push it out in its single outputDir
      const storedItem = cell.buildingState.item;
      if (storedItem) {
        const [nr, nc] = getNextCellCoords(r, c, cell.outputDir);
        if (this.isValidCell(nr, nc)) {
          const nextCell = this.state.grid[nr][nc];
          if (!this.hasAnyItem(nextCell) && this.canAcceptFrom(nextCell, oppositeDir(cell.outputDir))) {
            // Move item from the merger to the next cell
            nextGrid[r][c].buildingState.item = null;
            if (isBuilding(nextCell)) {
              nextGrid[nr][nc].buildingState.item = structuredClone(storedItem);
            } else {
              nextGrid[nr][nc].item = structuredClone(storedItem);
            }
          }
        }
      }
    }
  
    /**
     * Splitters take one input item and distribute it to up to 3 outputs.
     */
    handleSplitterOutput(r, c, nextGrid) {
        const cell = this.state.grid[r][c];
      
        // 1) Initialize splitterOutputs if not present in nextGrid
        //    We do it in nextGrid so it persists properly after copying.
        if (!nextGrid[r][c].buildingState.splitterOutputs) {
          nextGrid[r][c].buildingState.splitterOutputs = this.getSplitterOutputDirs(cell.outputDir);
          nextGrid[r][c].buildingState.currentOutputIndex = 0;
        }
      
        // 2) If splitter is empty, pull from the single “input” side
        if (!cell.buildingState.item) {
          // (We do the "pull" check on the current cell; that part is fine.)
          const inDir = oppositeDir(cell.outputDir);
          const [sr, sc] = getNextCellCoords(r, c, inDir);
          if (this.isValidCell(sr, sc)) {
            const source = this.state.grid[sr][sc];
            // If source is a building with an item whose outputDir points our way
            if (
              isBuilding(source) &&
              source.buildingState.item &&
              source.outputDir === inDir
            ) {
              // Move item into the splitter on nextGrid
              nextGrid[r][c].buildingState.item = structuredClone(source.buildingState.item);
              // Remove item from the source building in nextGrid
              nextGrid[sr][sc].buildingState.item = null;
            }
          }
        }
      
        // 3) If splitter has an item, attempt round-robin placement
        //    IMPORTANT: read from `cell`, write to `nextGrid`.
        const storedItem = cell.buildingState.item;
        if (storedItem) {
          const outputs = nextGrid[r][c].buildingState.splitterOutputs;
          const currentIndex = nextGrid[r][c].buildingState.currentOutputIndex ?? 0;
          let placed = false;
      
          // We'll try up to outputs.length times, starting from currentIndex
          for (let i = 0; i < outputs.length; i++) {
            const index = (currentIndex + i) % outputs.length;
            const outDir = outputs[index];
            const [nr, nc] = getNextCellCoords(r, c, outDir);
      
            if (!this.isValidCell(nr, nc)) continue; // out of bounds
            const nextCell = this.state.grid[nr][nc]; // read from current grid
      
            // Check if nextCell is free to accept from 'outDir'
            if (!this.hasAnyItem(nextCell) && this.canAcceptFrom(nextCell, oppositeDir(outDir))) {
              // Remove item from splitter in nextGrid
              nextGrid[r][c].buildingState.item = null;
      
              // Place item in nextCell on nextGrid
              if (isBuilding(nextCell)) {
                nextGrid[nr][nc].buildingState.item = structuredClone(storedItem);
              } else {
                nextGrid[nr][nc].item = structuredClone(storedItem);
              }
      
              // Advance the round-robin index on nextGrid
              nextGrid[r][c].buildingState.currentOutputIndex = (index + 1) % outputs.length;
      
              placed = true;
              break; // we placed the item, so stop
            }
          }
          // If we never place the item, we do NOT advance currentOutputIndex,
          // so next tick we try from the same index again.
        }
      }
      
  
    /**
     * Default handling for conveyors, extractors, processors, assemblers, storage
     * that push items forward in a single outputDir.
     */
    handleStandardBuildingOutput(r, c, nextGrid) {
      const cell = this.state.grid[r][c];
      if (!cell.buildingState.item) return; // no item to move
  
      const buildingItem = cell.buildingState.item;
      const [nr, nc] = getNextCellCoords(r, c, cell.outputDir);
  
      if (this.isValidCell(nr, nc)) {
        const nextCell = this.state.grid[nr][nc];
        // Check if next cell can accept
        if (
          !this.hasAnyItem(nextCell) ||
          (nextCell.type === 'storage' && this.canAcceptFrom(nextCell, oppositeDir(cell.outputDir)))
        ) {
          if (nextCell.type === 'storage') {
            // Try storing
            const success = StorageLogic.tryStoreItem(nextGrid[nr][nc], buildingItem);
            if (success) {
              nextGrid[r][c].buildingState.item = null;
            }
          } else {
            // Non-storage building or empty ground
            if (this.canAcceptFrom(nextCell, oppositeDir(cell.outputDir))) {
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
  
    // ──────────────────────────────
    //          HELPER METHODS
    // ──────────────────────────────
  
    /**
     * Returns true if the cell already has any item (in buildingState or on ground).
     */
    hasAnyItem(cell) {
      // Storage: check stored items
      if (cell.type === 'storage') {
        return cell.buildingState?.storedItems?.length > 0;
      }
      // Otherwise check cell.item or buildingState.item
      if (cell.item) return true;
      if (cell.buildingState?.item) return true;
      return false;
    }
  
    /**
     * Checks if a cell can accept an item from a given direction.
     * (Prevents pushing items into a building's output side, etc.)
     */
    canAcceptFrom(cell, fromDir) {
      if (isBuilding(cell)) {
        // Storage can accept if it has space
        if (cell.type === 'storage') {
          return StorageLogic.hasSpace(cell);
        }
        // Other buildings: must be empty & not blocked by output direction
        if (!cell.buildingState.item && cell.outputDir !== fromDir) {
          return true;
        }
        return false;
      } else {
        // For empty ground or resource-node, just check if no item present
        if (!cell.item) {
          return true;
        }
        return false;
      }
    }
  
    /**
     * For mergers: we define up to 3 potential input directions
     * based on the building’s single outputDir.
     */
    getMergerInputDirs(outputDir) {
      // E.g. if outputDir is "down", inputs = [ 'up', 'left', 'right' ]
      switch (outputDir) {
        case 'up':    return ['down','left','right'];
        case 'down':  return ['up','left','right'];
        case 'left':  return ['right','up','down'];
        case 'right': return ['left','up','down'];
        default:      return [];
      }
    }
  
    /**
     * For splitters: we define up to 3 potential output directions
     * from a single input side. This can be customized heavily.
     */
    getSplitterOutputDirs(outputDir) {
      switch (outputDir) {
        case 'up':    return ['up','left','right'];
        case 'down':  return ['down','left','right'];
        case 'left':  return ['left','up','down'];
        case 'right': return ['right','up','down'];
        default:      return [];
      }
    }
  
    /**
     * Validates grid boundaries.
     */
    isValidCell(r, c) {
      const { gridSize } = this.state;
      return (r >= 0 && r < gridSize && c >= 0 && c < gridSize);
    }
  }
  