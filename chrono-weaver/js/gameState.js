// js/gameState.js
// Stores and manages the core game state

export const gameState = {
    // Core Resources & Status
    chronoEnergy: 15, // Start with a bit more
    maxChronoEnergy: 50,
    loomIntegrity: 35,
    temporalResidue: 0,

    // Loom Performance & Modules
    coreMatrixStable: false,
    energyPerTickBase: 0.1, // Base rate
    energyPerTickBonus: 0,  // Bonus from upgrades
    weaveCostModifier: 1.0, // Multiplier for weave costs (lower is better)
    observeCostModifier: 1.0, // Multiplier for observe costs
    modules: ["Basic Scan", "Fragile Weave"],

    // Progression & External Factors
    activeNodeId: null,
    nodes: {}, // Holds all node data loaded from nodes.js
    resolvedNodes: new Set(),
    wardenAttentionLevel: 0, // 0-10 scale, affects events/alerts
    stealthProfile: "Minimal", // Minimal, Low, Moderate, High

    // Flags for tracking specific outcomes (example)
    flags: {
        alexandriaSaved: false,
        turingInsightGained: false,
        marsArtifactContained: false,
    },

    // Control Flow
    inputLocked: false, // Prevent input during processing
    introComplete: false,
    gameOver: false,
    gameWon: false,
};

// --- State Modifiers ---

// Resources
export function addResidue(amount) {
    gameState.temporalResidue += amount;
}

export function spendResidue(amount) {
    if (gameState.temporalResidue >= amount) {
        gameState.temporalResidue -= amount;
        return true;
    }
    return false;
}

export function calculateEnergyGain() {
    let baseGain = gameState.energyPerTickBase + gameState.energyPerTickBonus;
    if (!gameState.coreMatrixStable) {
        // Unstable matrix provides erratic energy
        baseGain *= (0.4 + Math.random() * 0.7); // Fluctuate between 40% and 110%
    }
    return baseGain;
}

export function addEnergy(amount) {
    gameState.chronoEnergy = Math.min(gameState.maxChronoEnergy, gameState.chronoEnergy + amount);
}

export function spendEnergy(amount) {
     const actualCost = Math.ceil(amount); // Costs are integers
     if (gameState.chronoEnergy >= actualCost) {
        gameState.chronoEnergy -= actualCost;
        return true;
    }
    return false;
}

export function calculateObserveCost(baseCost = 10) {
    return Math.ceil(baseCost * gameState.observeCostModifier);
}

export function calculateWeaveCost(baseCost) {
     return Math.ceil(baseCost * gameState.weaveCostModifier);
}


// Loom Status
export function degradeIntegrity(amount = 1) {
    gameState.loomIntegrity -= amount;
    gameState.loomIntegrity = Math.max(0, gameState.loomIntegrity);
    if (gameState.loomIntegrity === 0 && !gameState.gameOver) {
        triggerGameOver("Loom integrity failure.");
    }
}

export function improveIntegrity(amount) {
    gameState.loomIntegrity += amount;
    gameState.loomIntegrity = Math.min(100, gameState.loomIntegrity);
}

export function setCoreMatrixStable(stable) {
    gameState.coreMatrixStable = stable;
}

export function addModule(moduleName) {
    if (!gameState.modules.includes(moduleName)) {
        gameState.modules.push(moduleName);
    }
}

export function increaseMaxEnergy(amount) {
    gameState.maxChronoEnergy += amount;
}

export function increaseEnergyRegen(bonus) {
    gameState.energyPerTickBonus += bonus;
}

export function reduceWeaveCostModifier(reduction) {
    gameState.weaveCostModifier = Math.max(0.1, gameState.weaveCostModifier - reduction); // Don't go below 10% cost
}

export function reduceObserveCostModifier(reduction) {
    gameState.observeCostModifier = Math.max(0.1, gameState.observeCostModifier - reduction);
}

// Progression & World State
export function setInputLocked(locked) {
    // Don't allow locking if game is over/won
    if (gameState.gameOver || gameState.gameWon) return;
    gameState.inputLocked = locked;
}

export function setNodeActive(nodeId) {
    gameState.activeNodeId = nodeId;
}

export function markNodeResolved(nodeId) {
    gameState.resolvedNodes.add(nodeId);
    if(gameState.nodes[nodeId]) {
        gameState.nodes[nodeId].resolved = true;
    }
    // Potentially check for win condition here
    checkWinCondition();
}

export function setIntroComplete(complete) {
    gameState.introComplete = complete;
}

export function updateStealthProfile(profile) {
    gameState.stealthProfile = profile;
}

export function increaseWardenAttention(amount) {
    gameState.wardenAttentionLevel += amount;
    gameState.wardenAttentionLevel = Math.min(10, gameState.wardenAttentionLevel); // Cap at 10
}

export function decreaseWardenAttention(amount) {
    gameState.wardenAttentionLevel -= amount;
    gameState.wardenAttentionLevel = Math.max(0, gameState.wardenAttentionLevel); // Floor at 0
}

export function setFlag(flagName, value = true) {
    if (gameState.flags.hasOwnProperty(flagName)) {
        gameState.flags[flagName] = value;
    } else {
        console.warn(`Attempted to set unknown flag: ${flagName}`);
    }
}

export function loadNodesData(nodesData) {
    gameState.nodes = nodesData; // Load initial node definitions
}

// Game Over / Win State
export function triggerGameOver(reason) {
    if (!gameState.gameOver) { // Prevent multiple triggers
        gameState.gameOver = true;
        gameState.inputLocked = true; // Permanently lock input
        // Import dynamically to avoid circular dependencies if ui imports gameState
        import('./ui.js').then(ui => {
            ui.logToDisplay(` G A M E   O V E R `, 'error-message');
            ui.logToDisplay(`=====================`, 'error-message');
            ui.logToDisplay(`Reason: ${reason}`, 'error-message');
            ui.logToDisplay(`Attempt log archived. Signal lost.`, 'system-message');
            ui.setCommandInputDisabled(true);
        });
        import('./gameLoop.js').then(loop => loop.stopGameLoop());
    }
}

export function triggerGameWin() {
     if (!gameState.gameWon) { // Prevent multiple triggers
        gameState.gameWon = true;
        gameState.inputLocked = true; // Permanently lock input
        import('./ui.js').then(ui => {
            ui.logToDisplay(` S T A B I L I Z A T I O N   A C H I E V E D `, 'win-message'); // Needs CSS class
            ui.logToDisplay(`=====================================`, 'win-message');
            ui.logToDisplay(`Prototype Loom functional. Key temporal anchors secured.`, 'win-message');
            ui.logToDisplay(`You have woven a stable thread... for now.`, 'narrative');
            ui.logToDisplay(`Further exploration possible... [End of Prototype]`, 'system-message');
            ui.setCommandInputDisabled(true);
        });
        import('./gameLoop.js').then(loop => loop.stopGameLoop());
     }
}

// Simple win condition: Resolve all initially loaded nodes
function checkWinCondition() {
    if (gameState.gameOver || gameState.gameWon) return; // Don't check if already ended

    const totalNodes = Object.keys(gameState.nodes).length;
    if (totalNodes > 0 && gameState.resolvedNodes.size === totalNodes) {
        triggerGameWin();
    }
}