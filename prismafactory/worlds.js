// worlds.js
// =========
// Manages loading different world tiers into the GameState.
// Preserves previously visited tiers using `state.perTierData`.

export class Worlds {
  /**
   * Loads the specified tier's world data into the given GameState.
   * This checks if we have an existing saved state for that tier.
   * If so, we restore it. Otherwise, we generate a new grid, etc.
   */
  static loadWorld(tier, state) {
    // 1) Store the old tier’s data so we can come back to it later
    Worlds._storeCurrentTierState(state);

    // 2) Attempt to restore an existing snapshot for this tier
    const existing = state.perTierData[tier];
    if (existing && existing.grid && existing.grid.length > 0) {
      // Found a valid saved snapshot with a non-empty grid, so restore it
      state.grid = structuredClone(existing.grid);
      state.numRows = existing.numRows;
      state.numCols = existing.numCols;
      state.playerPos = { ...existing.playerPos };
      state.currentTier = tier;
      return;
    }

    // 3) If we have no (valid) existing data for the requested tier, generate a new world
    if (tier === 1) {
      state.numRows = 10;
      state.numCols = 10;
    } else if (tier === 2) {
      state.numRows = 10;
      state.numCols = 20;
    } else if (tier === 3) {
      state.numRows = 50;
      state.numCols = 10;
    }

    // Rebuild empty grid
    state.grid = [];
    for (let r = 0; r < state.numRows; r++) {
      const rowArr = [];
      for (let c = 0; c < state.numCols; c++) {
        rowArr.push({
          type: 'empty',
          item: null,
          outputDir: null,
          resourceType: null,
          buildingState: {},
          powered: false,
          energyRegion: false
        });
      }
      state.grid.push(rowArr);
    }

    // Spawn tier-specific resources or features
    if (tier === 1) {
      spawnTier1Resources(state);
      state.playerPos = {
        row: Math.floor(state.numRows / 2),
        col: Math.floor(state.numCols / 2)
      };
    } else if (tier === 2) {
      spawnTier2Resources(state);
      state.playerPos = {
        row: Math.floor(state.numRows / 2),
        col: Math.floor(state.numCols / 2)
      };
    } else if (tier === 3) {
      spawnTier3Ringworld(state);
      state.playerPos = {
        row: Math.floor(state.numRows / 2),
        col: Math.floor(state.numCols / 2)
      };
    }

    // 4) Update currentTier
    state.currentTier = tier;
  }

  /**
   * Internal helper: stores the current tier's grid, rows, cols, and playerPos
   * into state.perTierData[state.currentTier].
   */
  static _storeCurrentTierState(state) {
    const tier = state.currentTier;
    if (!tier) return; // in case not initialized

    const snapshot = {
      grid: structuredClone(state.grid),
      numRows: state.numRows,
      numCols: state.numCols,
      playerPos: { ...state.playerPos }
    };
    state.perTierData[tier] = snapshot;
  }
}

// ─────────────────────────────────────────────
// TIER 1: random T1R01, T1R02, T1R03 + random energy
// ─────────────────────────────────────────────
function spawnTier1Resources(state) {
  state.defaultResourceSpawns = {
    T1R01: 3,
    T1R02: 2,
    T1R03: 2
  };
  spawnMultipleResourceNodes(state);
  spawnMultipleEnergyNodes(state, /*count=*/2);
}

// ─────────────────────────────────────────────
// TIER 2: random T2R01, T2R02, T2R03 + random energy
// ─────────────────────────────────────────────
function spawnTier2Resources(state) {
  console.log('DEBUG: spawnTier2Resources called for Tier 2');
  state.defaultResourceSpawns = {
    T2R01: 3,
    T2R02: 2,
    T2R03: 2
  };
  spawnMultipleResourceNodes(state);
  spawnMultipleEnergyNodes(state, /*count=*/2);
}

// ─────────────────────────────────────────────
// TIER 3: random T3R01, T3R02, T3R03 + random energy
// ─────────────────────────────────────────────
function spawnTier3Ringworld(state) {
  state.defaultResourceSpawns = {
    T3R01: 3,
    T3R02: 2,
    T3R03: 2
  };
  spawnMultipleResourceNodes(state);
  spawnMultipleEnergyNodes(state, /*count=*/3);
}

// ─────────────────────────────────────────────
// Generic random spawner for resource nodes
// ─────────────────────────────────────────────
function spawnMultipleResourceNodes(state) {
  for (const [resourceType, count] of Object.entries(state.defaultResourceSpawns)) {
    let attempts = 0;
    let spawned = 0;
    const maxAttempts = 500;

    while (spawned < count && attempts < maxAttempts) {
      attempts++;
      const randRow = Math.floor(Math.random() * state.numRows);
      const randCol = Math.floor(Math.random() * state.numCols);
      const cell = state.grid[randRow][randCol];

      if (cell.type === 'empty') {
        cell.type = 'resource-node';
        cell.resourceType = resourceType;
        spawned++;
      }
    }
  }
}

// ─────────────────────────────────────────────
// Randomly place 'energy-region' cells
// ─────────────────────────────────────────────
function spawnMultipleEnergyNodes(state, count = 2) {
  let attempts = 0;
  let spawned = 0;
  const maxAttempts = 500;

  while (spawned < count && attempts < maxAttempts) {
    attempts++;
    const randRow = Math.floor(Math.random() * state.numRows);
    const randCol = Math.floor(Math.random() * state.numCols);
    const cell = state.grid[randRow][randCol];

    if (cell.type === 'empty') {
      cell.type = 'energy-region';
      cell.energyRegion = true;
      spawned++;
    }
  }
}
