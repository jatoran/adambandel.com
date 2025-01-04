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
  import { ItemDefinitions } from './itemDefinitions.js';

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
      // setInterval(() => this.updateSource(), 1000);
  
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
  
  
    updatePortals() {
      const { numRows, numCols, grid } = this.state;
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = grid[r][c];
          if (cell.type === 'portal') {
            PortalLogic.update(cell);
          }
        }
      }
    }
    
    updateStorages() {
      const { numRows, numCols, grid } = this.state;
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = grid[r][c];
          if (cell.type === 'storage') {
            StorageLogic.update(cell);
          }
        }
      }
    }
    
    updateExtractors() {
      const now = Date.now();
      const { numRows, numCols, grid } = this.state;
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = grid[r][c];
          if (cell.type === 'extractor' && cell.powered) {
            ExtractorLogic.update(cell, now);
          }
        }
      }
    }
    
    updateProcessors() {
      const { numRows, numCols, grid } = this.state;
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = grid[r][c];
          if (cell.type === 'processor' && cell.powered) {
            ProcessorLogic.update(cell);
          }
        }
      }
    }
    
    updateAssemblers() {
      const { numRows, numCols, grid } = this.state;
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = grid[r][c];
          if (cell.type === 'assembler' && cell.powered) {
            AssemblerLogic.update(cell);
          }
        }
      }
    }
    
    moveItems() {
      const { numRows, numCols } = this.state;
      const nextGrid = structuredClone(this.state.grid);
    
      // (A) Building outputs
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = this.getCell(r, c);
          if (!cell) continue;  // T1/T2: out of bounds
          if (!isBuilding(cell)) continue;
    
          if (cell.type === 'merger') {
            this.handleMergerOutput(r, c, nextGrid);
          } else if (cell.type === 'splitter') {
            this.handleSplitterOutput(r, c, nextGrid);
          } else {
            this.handleStandardBuildingOutput(r, c, nextGrid);
          }
        }
      }
    
      // (B) Conveyors might pull ground items
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const cell = this.getCell(r, c);
          if (!cell) continue;
          if (cell.type === 'conveyor' && !cell.buildingState.item && cell.item) {
            // Move ground item into conveyor
            // We'll do the same structuredClone approach
            nextGrid[r][c].buildingState.item = structuredClone(cell.item);
            nextGrid[r][c].item = null;
          }
        }
      }
    
      // (C) Commit changes back to the real state.grid
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          if (!this.isValidCell(r, c)) continue;
          this.state.grid[r][c].item = nextGrid[r][c].item;
          this.state.grid[r][c].buildingState = structuredClone(nextGrid[r][c].buildingState);
        }
      }
    }
    
  
    /**
 * Mergers combine up to 3 inputs into one output direction.
 */
    handleMergerOutput(r, c, nextGrid) {
      const cell = this.getCell(r, c);
      if (!cell) return;
    
      // 1) If the merger is empty, pull from up to 3 inputs
      if (!cell.buildingState.item) {
        const inputs = this.getMergerInputDirs(cell.outputDir);
        for (const inDir of inputs) {
          // We get the neighbor cell
          let [sr, sc] = getNextCellCoords(r, c, inDir); 
          // Now wrap or clamp for Tier 3
          if (this.state.currentTier === 3) {
            sr = (sr % this.state.numRows + this.state.numRows) % this.state.numRows;
            sc = Math.max(0, Math.min(sc, this.state.numCols - 1));
          }
          if (!this.isValidCell(sr, sc)) continue;
    
          const source = this.getCell(sr, sc);
          if (source && isBuilding(source) && source.buildingState.item &&
              source.outputDir === oppositeDir(inDir)) {
            // ...
            // same logic as your existing code, just referencing source correctly
            const incomingItem = source.buildingState.item;
            if (this.canAcceptFrom(cell, oppositeDir(inDir), incomingItem)) {
              // Pull one item
              nextGrid[r][c].buildingState.item = structuredClone(incomingItem);
              nextGrid[sr][sc].buildingState.item = null;
              break; // only pull one
            }
          }
        }
      }
    
      // 2) If the merger has an item, push it out
      const storedItem = cell.buildingState.item;
      if (storedItem) {
        let [nr, nc] = getNextCellCoords(r, c, cell.outputDir);
        // Wrap/clamp for Tier 3
        if (this.state.currentTier === 3) {
          nr = (nr % this.state.numRows + this.state.numRows) % this.state.numRows;
          nc = Math.max(0, Math.min(nc, this.state.numCols - 1));
        }
        if (!this.isValidCell(nr, nc)) return;
    
        const nextCell = this.getCell(nr, nc);
        if (nextCell && !this.hasAnyItem(nextCell) &&
            this.canAcceptFrom(nextCell, oppositeDir(cell.outputDir), storedItem)) {
          nextGrid[r][c].buildingState.item = null;
          if (isBuilding(nextCell)) {
            nextGrid[nr][nc].buildingState.item = structuredClone(storedItem);
          } else {
            nextGrid[nr][nc].item = structuredClone(storedItem);
          }
        }
      }
    }

/**
 * Splitters take one input item and distribute it to up to 3 outputs.
 */
handleSplitterOutput(r, c, nextGrid) {
  const cell = this.getCell(r, c);
  if (!cell) return;

  // Ensure splitterOutputs is ready
  if (!nextGrid[r][c].buildingState.splitterOutputs) {
    nextGrid[r][c].buildingState.splitterOutputs = this.getSplitterOutputDirs(cell.outputDir);
    nextGrid[r][c].buildingState.currentOutputIndex = 0;
  }

  // 1) If splitter empty, pull from input side
  if (!cell.buildingState.item) {
    const inDir = oppositeDir(cell.outputDir);
    let [sr, sc] = getNextCellCoords(r, c, inDir);
    if (this.state.currentTier === 3) {
      sr = (sr % this.state.numRows + this.state.numRows) % this.state.numRows;
      sc = Math.max(0, Math.min(sc, this.state.numCols - 1));
    }
    const source = this.getCell(sr, sc);
    if (source && isBuilding(source) && source.buildingState.item && 
        source.outputDir === inDir) {
      const incomingItem = source.buildingState.item;
      if (this.canAcceptFrom(cell, oppositeDir(inDir), incomingItem)) {
        nextGrid[r][c].buildingState.item = structuredClone(incomingItem);
        nextGrid[sr][sc].buildingState.item = null;
      }
    }
  }

  // 2) If splitter has item, attempt to place in outputs
  const storedItem = cell.buildingState.item;
  if (storedItem) {
    const outputs = nextGrid[r][c].buildingState.splitterOutputs;
    const currentIndex = nextGrid[r][c].buildingState.currentOutputIndex ?? 0;
    let placed = false;

    for (let i = 0; i < outputs.length; i++) {
      const index = (currentIndex + i) % outputs.length;
      const outDir = outputs[index];

      let [nr, nc] = getNextCellCoords(r, c, outDir);
      if (this.state.currentTier === 3) {
        nr = (nr % this.state.numRows + this.state.numRows) % this.state.numRows;
        nc = Math.max(0, Math.min(nc, this.state.numCols - 1));
      }
      const nextCell = this.getCell(nr, nc);
      if (nextCell && !this.hasAnyItem(nextCell) &&
          this.canAcceptFrom(nextCell, oppositeDir(cell.outputDir), storedItem)) {
        // Place item
        nextGrid[r][c].buildingState.item = null;
        if (isBuilding(nextCell)) {
          nextGrid[nr][nc].buildingState.item = structuredClone(storedItem);
        } else {
          nextGrid[nr][nc].item = structuredClone(storedItem);
        }
        nextGrid[r][c].buildingState.currentOutputIndex = (index + 1) % outputs.length;
        placed = true;
        break;
      }
    }
  }
}
  
  /**
 * Default handling for conveyors, extractors, processors, assemblers, storage
 * that push items forward in a single outputDir.
 */
handleStandardBuildingOutput(r, c, nextGrid) {
  const cell = this.getCell(r, c);
  if (!cell || !cell.buildingState) return;

  // If processor/assembler with outputBuffer:
  if ((cell.type === 'processor' || cell.type === 'assembler') && cell.buildingState.outputBuffer) {
    const bs = cell.buildingState;
    if (bs.outputBuffer.length === 0) return;

    // Look at the first item in the buffer
    const itemToMove = bs.outputBuffer[0];
    let [nr, nc] = getNextCellCoords(r, c, cell.outputDir);

    // Wrap/clamp for Tier 3
    if (this.state.currentTier === 3) {
      nr = (nr % this.state.numRows + this.state.numRows) % this.state.numRows;
      nc = Math.max(0, Math.min(nc, this.state.numCols - 1));
    }
    if (!this.isValidCell(nr, nc)) return;

    const nextCell = this.getCell(nr, nc);
    if (!nextCell) return;

    // Attempt to place item
    if (!this.hasAnyItem(nextCell) && this.canAcceptFrom(nextCell, oppositeDir(cell.outputDir), itemToMove)) {
      // Remove from output buffer
      nextGrid[r][c].buildingState.outputBuffer.shift();

      // If nextCell is a building, do the specialized inputBuffer logic
      if (isBuilding(nextCell)) {
        if (nextCell.type === 'processor') {
          // push to inputBuffer
          if (!nextGrid[nr][nc].buildingState.inputBuffer) {
            nextGrid[nr][nc].buildingState.inputBuffer = [];
          }
          nextGrid[nr][nc].buildingState.inputBuffer.push(structuredClone(itemToMove));
        } else if (nextCell.type === 'assembler') {
          // push to inputBuffers
          const resourceKey = itemToMove.resourceType || 'unknown';
          if (!nextGrid[nr][nc].buildingState.inputBuffers) {
            nextGrid[nr][nc].buildingState.inputBuffers = {};
          }
          if (!nextGrid[nr][nc].buildingState.inputBuffers[resourceKey]) {
            nextGrid[nr][nc].buildingState.inputBuffers[resourceKey] = [];
          }
          nextGrid[nr][nc].buildingState.inputBuffers[resourceKey].push(structuredClone(itemToMove));
        } else {
          // e.g. conveyor, storage, powerPole, etc.
          if (!nextGrid[nr][nc].buildingState.item) {
            nextGrid[nr][nc].buildingState.item = structuredClone(itemToMove);
          }
        }
      } else {
        // Not a building => place on ground
        nextGrid[nr][nc].item = structuredClone(itemToMove);
      }
    }
    return;
  }

  // Otherwise (conveyor, etc.)
  if (!cell.buildingState.item) return;
  const buildingItem = cell.buildingState.item;
  let [nr, nc] = getNextCellCoords(r, c, cell.outputDir);

  if (this.state.currentTier === 3) {
    nr = (nr % this.state.numRows + this.state.numRows) % this.state.numRows;
    nc = Math.max(0, Math.min(nc, this.state.numCols - 1));
  }
  if (!this.isValidCell(nr, nc)) return;

  const nextCell = this.getCell(nr, nc);
  if (!nextCell) return;

  // If nextCell is storage and has space...
  if (nextCell.type === 'storage' && StorageLogic.hasSpace(nextCell)) {
    if (this.canAcceptFrom(nextCell, oppositeDir(cell.outputDir), buildingItem)) {
      nextGrid[r][c].buildingState.item = null;
      StorageLogic.tryStoreItem(nextGrid[nr][nc], structuredClone(buildingItem));
    }
    return;
  }

  // Otherwise normal check
  if (!this.hasAnyItem(nextCell) && this.canAcceptFrom(nextCell, oppositeDir(cell.outputDir), buildingItem)) {
    // remove from source
    nextGrid[r][c].buildingState.item = null;

    // If nextCell is processor -> push to inputBuffer, etc.
    if (isBuilding(nextCell)) {
      if (nextCell.type === 'processor') {
        if (!nextGrid[nr][nc].buildingState.inputBuffer) {
          nextGrid[nr][nc].buildingState.inputBuffer = [];
        }
        nextGrid[nr][nc].buildingState.inputBuffer.push(structuredClone(buildingItem));
      } else if (nextCell.type === 'assembler') {
        // push to inputBuffers
        const resourceKey = buildingItem.resourceType || 'unknown';
        if (!nextGrid[nr][nc].buildingState.inputBuffers) {
          nextGrid[nr][nc].buildingState.inputBuffers = {};
        }
        if (!nextGrid[nr][nc].buildingState.inputBuffers[resourceKey]) {
          nextGrid[nr][nc].buildingState.inputBuffers[resourceKey] = [];
        }
        nextGrid[nr][nc].buildingState.inputBuffers[resourceKey].push(structuredClone(buildingItem));
      } else {
        // e.g. conveyor
        nextGrid[nr][nc].buildingState.item = structuredClone(buildingItem);
      }
    } else {
      // Place on ground
      nextGrid[nr][nc].item = structuredClone(buildingItem);
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
     * Also prevents non-recipe items being accepted by structures
     */
    /**
 * Checks if a cell can accept an item from a given direction.
 * (Prevents pushing items into a building's output side, etc.)
 * Also prevents non-recipe items being accepted by structures.
 */
canAcceptFrom(cell, fromDir, incomingItem) {
  if (isBuilding(cell)) {
    // 1) If storage, just check capacity
    if (cell.type === 'storage') {
      return StorageLogic.hasSpace(cell);
    }

    // 2) If processor:
    if (cell.type === 'processor') {
      // Must not be blocked by output direction
      if (cell.outputDir === fromDir) {
        return false;
      }
      // Must have a recipe
      const recipeKey = cell.buildingState.recipe;
      if (!recipeKey) {
        return false;
      }
      // Check if incoming item is required by the recipe
      const resourceKey = incomingItem?.resourceType;
      const neededInputs = ItemDefinitions[recipeKey].inputs || {};
      if (!resourceKey || !neededInputs[resourceKey]) {
        return false;
      }
      // Check inputBuffer capacity
      if (!cell.buildingState.inputBuffer) {
        cell.buildingState.inputBuffer = [];
      }
      const maxBuffer = cell.buildingState.inputBufferMax ?? 5;
      if (cell.buildingState.inputBuffer.length >= maxBuffer) {
        return false; 
      }
      return true;
    }

    // 3) If assembler (NEW separate per-resource buffers):
    if (cell.type === 'assembler') {
      // Must not be blocked by output direction
      if (cell.outputDir === fromDir) {
        return false;
      }
      // Must have a recipe
      const recipeKey = cell.buildingState.recipe;
      if (!recipeKey) {
        return false;
      }
      // Check if incoming item is required by the recipe
      const resourceKey = incomingItem?.resourceType;
      const neededInputs = ItemDefinitions[recipeKey].inputs || {};
      if (!resourceKey || !neededInputs[resourceKey]) {
        return false;
      }
      // Separate buffer for this specific resource
      if (!cell.buildingState.inputBuffers) {
        cell.buildingState.inputBuffers = {};
      }
      if (!cell.buildingState.inputBuffers[resourceKey]) {
        cell.buildingState.inputBuffers[resourceKey] = [];
      }
      const maxPerResource = cell.buildingState.perResourceBufferMax ?? 5;
      if (cell.buildingState.inputBuffers[resourceKey].length >= maxPerResource) {
        return false; // This resource's buffer is full
      }
      return true;
    }

    // 4) For other buildings (conveyor, merger, splitter, etc.)
    if (!cell.buildingState.item && cell.outputDir !== fromDir) {
      return true;
    }
    return false;
  } else {
    // For empty ground or resource-node
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
    getCell(r, c) {
      // For Tier 3, wrap row, clamp col
      if (this.state.currentTier === 3) {
        const wrappedR = (r % this.state.numRows + this.state.numRows) % this.state.numRows;
        const wrappedC = Math.max(0, Math.min(c, this.state.numCols - 1));
        return this.state.grid[wrappedR][wrappedC];
      } else {
        // For T1 & T2, clamp both row and col
        if (r < 0 || r >= this.state.numRows || c < 0 || c >= this.state.numCols) {
          return null; // out of bounds
        }
        return this.state.grid[r][c];
      }
    }
    
    isValidCell(r, c) {
      // For Tier 3, any row is valid (we wrap it), but col must be 0..numCols-1
      if (this.state.currentTier === 3) {
        return c >= 0 && c < this.state.numCols;
      }
      // For T1/T2, must be within the normal grid
      return (
        r >= 0 && r < this.state.numRows &&
        c >= 0 && c < this.state.numCols
      );
    }
  }
