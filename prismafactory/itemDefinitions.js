// itemDefinitions.js
// ==================
//
// Unified definitions for all items in the game: raw resources, 
// processor outputs, assembler outputs, etc.
//
// Each item can have properties like:
//   displayName
//   itemColor
//   itemShape
//   tier          -> integer: 1,2, or 3
//   category      -> 'raw', 'processed', 'final', etc.
//   extractorStyle -> styling for an extractor that extracts this resource
//   inputs        -> for processed/final items, a dict { resourceKey: number, ... }

export const ItemDefinitions = {
  // ──────────────────────────────────────────
  // TIER 1 RAW (already present)
  // ──────────────────────────────────────────
  T1R01: {
    tier: 1,
    category: 'raw',
    displayName: "T1R01",
    itemColor:   "#ffff00",
    itemShape:   "circle",
    extractorStyle: {
      backgroundColor: "rgba(255, 255, 0, 0.15)"
    }
  },
  T1R02: {
    tier: 1,
    category: 'raw',
    displayName: "T1R02",
    itemColor:   "#ff9900",
    itemShape:   "diamond",
    extractorStyle: {
      backgroundColor: "rgba(255, 150, 0, 0.15)",
    }
  },
  T1R03: {
    tier: 1,
    category: 'raw',
    displayName: "T1R03",
    itemColor:   "#00ff00",
    itemShape:   "star",
    extractorStyle: {
      backgroundColor: "rgba(0, 255, 0, 0.15)",
    }
  },

  // ──────────────────────────────────────────
  // TIER 1 Processor product(s)
  // e.g. T1P01 requires 2 units of T1R01
  // ──────────────────────────────────────────
  T1P01: {
    tier: 1,
    category: 'processed', 
    displayName: "T1P01",
    itemColor: "#00c0ff",
    itemShape: "diamond",
    inputs: {
      T1R01: 2
    }
  },

  // TIER 1 Assembler product(s)
  // e.g. T1A01 requires 2 units of T1P01
  T1A01: {
    tier: 1,
    category: 'final', 
    displayName: "T1A01",
    itemColor: "#ff00ff",
    itemShape: "star",
    inputs: {
      T1P01: 2,
      T1R02: 1
    }
  },

  // ──────────────────────────────────────────
  // TIER 2 RAW
  // ──────────────────────────────────────────
  T2R01: {
    tier: 2,
    category: 'raw',
    displayName: "T2R01",
    itemColor:   "#00ffff",
    itemShape:   "circle",
    extractorStyle: {
      backgroundColor: "rgba(0, 255, 255, 0.15)"
    }
  },
  T2R02: {
    tier: 2,
    category: 'raw',
    displayName: "T2R02",
    itemColor:   "#ff6666",
    itemShape:   "diamond",
    extractorStyle: {
      backgroundColor: "rgba(255, 100, 100, 0.15)",
    }
  },
  T2R03: {
    tier: 2,
    category: 'raw',
    displayName: "T2R03",
    itemColor:   "#ffff66",
    itemShape:   "star",
    extractorStyle: {
      backgroundColor: "rgba(255, 255, 100, 0.15)",
    }
  },

  // TIER 2 Processor products
  // (example: T2P01 requires 2x T2R01)
  T2P01: {
    tier: 2,
    category: 'processed', 
    displayName: "T2P01",
    itemColor: "#99ccff",
    itemShape: "diamond",
    inputs: {
      T2R01: 2
    }
  },

  // TIER 2 Assembler products
  // (example: T2A01 requires T2P01 x2 + T2R02 x1)
  T2A01: {
    tier: 2,
    category: 'final', 
    displayName: "T2A01",
    itemColor: "#ff99ff",
    itemShape: "star",
    inputs: {
      T2P01: 2,
      T2R02: 1
    }
  },

  // ──────────────────────────────────────────
  // TIER 3 RAW
  // ──────────────────────────────────────────
  T3R01: {
    tier: 3,
    category: 'raw',
    displayName: "T3R01",
    itemColor:   "#ccffcc",
    itemShape:   "circle",
    extractorStyle: {
      backgroundColor: "rgba(200, 255, 200, 0.15)"
    }
  },
  T3R02: {
    tier: 3,
    category: 'raw',
    displayName: "T3R02",
    itemColor:   "#66ff00",
    itemShape:   "diamond",
    extractorStyle: {
      backgroundColor: "rgba(100, 255, 0, 0.15)",
    }
  },
  T3R03: {
    tier: 3,
    category: 'raw',
    displayName: "T3R03",
    itemColor:   "#ff66ff",
    itemShape:   "star",
    extractorStyle: {
      backgroundColor: "rgba(255, 100, 255, 0.15)",
    }
  },

  // TIER 3 Processor product
  T3P01: {
    tier: 3,
    category: 'processed',
    displayName: "T3P01",
    itemColor: "#ccccff",
    itemShape: "diamond",
    inputs: {
      T3R01: 2
    }
  },

  // TIER 3 Assembler product
  T3A01: {
    tier: 3,
    category: 'final',
    displayName: "T3A01",
    itemColor: "#ffccff",
    itemShape: "star",
    inputs: {
      T3P01: 2,
      T3R02: 1
    }
  }
};
