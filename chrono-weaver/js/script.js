document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const mainDisplay = document.getElementById('main-display');
    const commandInput = document.getElementById('command-input');
    const chronoEnergyEl = document.getElementById('chrono-energy');
    const maxChronoEnergyEl = document.getElementById('max-chrono-energy');
    const loomIntegrityEl = document.getElementById('loom-integrity');
    const temporalResidueEl = document.getElementById('temporal-residue');
    const stealthProfileEl = document.getElementById('stealth-profile');
    const coreMatrixStatusEl = document.getElementById('core-matrix-status');
    const availableModulesEl = document.getElementById('available-modules');
    const energyBar = document.getElementById('energy-bar');
    const nodeListEl = document.getElementById('node-list');
    const currentFocusEl = document.getElementById('current-focus');
    const upgradeButtons = document.querySelectorAll('.upgrade-button');

    // --- Game State ---
    let gameState = {
        chronoEnergy: 10,
        maxChronoEnergy: 50,
        loomIntegrity: 35,
        temporalResidue: 0,
        stealthProfile: "Minimal",
        coreMatrixStable: false,
        modules: ["Basic Scan", "Fragile Weave"],
        energyPerTick: 0.1, // Energy generated per interval
        activeNodeId: null,
        nodes: {}, // Holds all node data
        resolvedNodes: new Set(),
        inputLocked: false, // Prevent input during processing
        introComplete: false,
        upgrades: {
            stabilize_matrix: { cost: 50, purchased: false, name: "Stabilize Matrix" },
            energy_cap_1: { cost: 30, purchased: false, name: "Energy Capacitor Mk1" },
            weave_intensifier_1: { cost: 75, purchased: false, name: "Weave Intensifier" },
        }
    };

    // --- Resonance Node Definitions ---
    const nodesData = {
        "alexandria_01": {
            id: "alexandria_01",
            name: "Alexandria: Pre-Fire Echo",
            description: "Resonance detected: Library of Alexandria, ~48 BCE. High probability of significant data loss event. Multiple contributing factors. Primary decision point: actions of librarians and disposition of key scrolls.",
            actors: ["Theon (Head Librarian)", "Marcus (Roman Centurion)", "Civilian Populace"],
            scanLevel: 0, // 0: Base, 1: Observed
            details: [ // Revealed by OBSERVE
                "Detail: Scrolls of Archimedes located in vulnerable wing.",
                "Detail: Political tension high; minor scuffle near harbor reported.",
                "Detail: Theon debating prioritizing evacuation vs. securing specific archives."
            ],
            probabilities: { // Base probabilities
                "library_destroyed": 0.65,
                "library_damaged": 0.30,
                "library_saved": 0.05
            },
            weaveOptions: {
                "theon_prioritize_scrolls": {
                    cost: 15,
                    effectText: "Nudging Theon's focus towards securing high-value scrolls.",
                    probabilityShift: { "library_destroyed": -0.1, "library_damaged": +0.15, "library_saved": +0.05 }
                },
                "centurion_distraction": {
                    cost: 20,
                    effectText: "Amplifying minor harbor distractions to draw Marcus's patrol briefly.",
                    probabilityShift: { "library_destroyed": -0.05, "library_damaged": +0.05 } // Less direct impact
                },
                 "inspire_clerk_archimedes": {
                    cost: 25, // Higher cost for specific target
                    effectText: "Subtly highlighting the importance of the Archimedes scrolls to a nearby clerk.",
                    requiresScanLevel: 1, // Need observation first
                    probabilityShift: { "library_damaged": -0.1, "library_saved": +0.1 }
                }
            },
            outcomes: {
                "library_destroyed": { text: "Catastrophe. Flames engulf the Great Library. Resonance confirms near-total loss of knowledge. A dark day echoed through time.", residueReward: 5 },
                "library_damaged": { text: "Significant damage sustained. Sections of the library burn, but quick action saved many core archives. The loss is felt, but not absolute.", residueReward: 15 },
                "library_saved": { text: "Against the odds! Focused efforts and perhaps external factors led to the fire being contained quickly. The bulk of the Library survives. A major temporal deviation.", residueReward: 30 }
            },
            resolved: false
        }
        // Add more nodes here later
    };

    // --- Core Functions ---

    function logToDisplay(message, type = 'system-message') {
        const entry = document.createElement('div');
        entry.classList.add('log-entry', type);
        entry.textContent = message;
        mainDisplay.appendChild(entry);
        mainDisplay.scrollTop = mainDisplay.scrollHeight; // Auto-scroll
    }

    function typeWriterLog(message, type = 'narrative', delay = 30, callback = null) {
        gameState.inputLocked = true;
        const entry = document.createElement('div');
        entry.classList.add('log-entry', type);
        mainDisplay.appendChild(entry);
        mainDisplay.scrollTop = mainDisplay.scrollHeight;

        let i = 0;
        function type() {
            if (i < message.length) {
                entry.textContent += message.charAt(i);
                i++;
                mainDisplay.scrollTop = mainDisplay.scrollHeight;
                setTimeout(type, delay);
                 // [SOUND PLACEHOLDER: Subtle keypress sound]
            } else {
                gameState.inputLocked = false;
                if (callback) callback();
                commandInput.focus(); // Refocus input after typing
            }
        }
        type();
    }

    function updateStatusUI() {
        chronoEnergyEl.textContent = Math.floor(gameState.chronoEnergy);
        maxChronoEnergyEl.textContent = gameState.maxChronoEnergy;
        loomIntegrityEl.textContent = `${gameState.loomIntegrity}%`;
        temporalResidueEl.textContent = gameState.temporalResidue;
        stealthProfileEl.textContent = gameState.stealthProfile;
        coreMatrixStatusEl.textContent = gameState.coreMatrixStable ? "Stable" : "Unstable";
        coreMatrixStatusEl.className = gameState.coreMatrixStable ? "stable" : "warning"; // Add 'stable' class if needed in CSS
        availableModulesEl.textContent = gameState.modules.join(', ');

        const energyPercent = (gameState.chronoEnergy / gameState.maxChronoEnergy) * 100;
        energyBar.style.width = `${energyPercent}%`;

        // Update upgrade button states
        upgradeButtons.forEach(button => {
            const upgradeId = button.dataset.upgrade;
            const upgrade = gameState.upgrades[upgradeId];
            if (upgrade) {
                button.disabled = upgrade.purchased || gameState.temporalResidue < upgrade.cost;
                if (upgrade.purchased) {
                    button.textContent = "INSTALLED";
                }
            }
        });
    }

    function updateScannerUI() {
        nodeListEl.innerHTML = ''; // Clear current list
        let hasNodes = false;
        for (const id in gameState.nodes) {
            const node = gameState.nodes[id];
            if (!node.resolved) {
                hasNodes = true;
                const li = document.createElement('li');
                li.textContent = `${node.id}: ${node.name}`;
                li.dataset.nodeId = id;
                li.classList.add('node-item');
                if (id === gameState.activeNodeId) {
                    li.classList.add('active');
                }
                li.addEventListener('click', () => {
                    if (!gameState.inputLocked) {
                       handleCommand(`observe ${id}`); // Allow clicking to observe
                    }
                });
                nodeListEl.appendChild(li);
            }
        }
        if (!hasNodes) {
            const li = document.createElement('li');
            li.classList.add('placeholder');
            li.textContent = "No resonance detected.";
            nodeListEl.appendChild(li);
        }
    }

    function displayNodeInfo(nodeId) {
        const node = gameState.nodes[nodeId];
        if (!node) {
            logToDisplay(`Error: Node ${nodeId} not found.`, 'error-message');
            return;
        }

        gameState.activeNodeId = nodeId;
        currentFocusEl.textContent = `${node.id}: ${node.name}`;
        updateScannerUI(); // Highlight active node

        logToDisplay(`--- Node Focus: ${node.id} ---`, 'node-title');
        logToDisplay(node.description, 'narrative');
        logToDisplay(`Actors: ${node.actors.join(', ')}`, 'narrative');

        if (node.scanLevel > 0) {
            logToDisplay("--- Observed Details ---", "system-message");
            node.details.forEach(detail => logToDisplay(detail, 'narrative'));
        } else {
             logToDisplay("Use 'OBSERVE <nodeId>' for more details.", "system-message");
        }


        logToDisplay("--- Current Probabilities ---", "system-message");
        for (const outcome in node.probabilities) {
            logToDisplay(`${outcome.replace(/_/g,' ')}: ${(node.probabilities[outcome] * 100).toFixed(1)}%`, 'probability');
        }
         logToDisplay("--- Available Weave Options ---", "system-message");
         let weaveInfoDisplayed = false;
         for (const weaveKey in node.weaveOptions) {
             const weave = node.weaveOptions[weaveKey];
             if (!weave.requiresScanLevel || weave.requiresScanLevel <= node.scanLevel) {
                 logToDisplay(`WEAVE ${nodeId} ${weaveKey} (Cost: ${weave.cost} CE)`, 'narrative');
                 weaveInfoDisplayed = true;
             }
         }
         if (!weaveInfoDisplayed && node.scanLevel < 1) {
             logToDisplay("(Observe node for potential weave options)", "system-message");
         }
         logToDisplay("Use 'RESOLVE <nodeId>' to attempt outcome.", "system-message");
    }

     function processCommand(command) {
        if (gameState.inputLocked) return; // Don't process if locked

        logToDisplay(`> ${command}`, 'command-echo'); // Echo command
        commandInput.value = ''; // Clear input
        gameState.inputLocked = true; // Lock input during processing

        const parts = command.toLowerCase().match(/(?:[^\s"]+|"[^"]*")+/g) || []; // Split by space, respecting quotes
        const action = parts[0];
        const args = parts.slice(1).map(arg => arg.replace(/"/g, '')); // Remove quotes from args


        // Simulate processing delay
        setTimeout(() => {
            let processed = false; // Flag to check if any command matched

            switch (action) {
                case 'help':
                    logToDisplay("--- Available Commands ---", "system-message");
                    logToDisplay("HELP - Show this list", "narrative");
                    logToDisplay("STATUS - Display Loom status", "narrative");
                    logToDisplay("SCAN - Refresh resonance scanner", "narrative");
                    logToDisplay("OBSERVE <nodeId> - Focus on and gather details about a node (costs CE)", "narrative");
                    logToDisplay("WEAVE <nodeId> <weaveKey> - Attempt to influence a node (costs CE)", "narrative");
                    logToDisplay("RESOLVE <nodeId> - Allow the focused node's event to conclude", "narrative");
                    logToDisplay("REPAIR <upgradeId> | UPGRADE <upgradeId> - Use Temporal Residue (TR) for improvements", "narrative");
                    logToDisplay("CLEAR - Clear the main display log", "narrative");
                    processed = true;
                    break;

                case 'status':
                    logToDisplay(`--- Loom Status ---`, 'system-message');
                    logToDisplay(`Chrono-Energy: ${Math.floor(gameState.chronoEnergy)}/${gameState.maxChronoEnergy} CE`, 'narrative');
                    logToDisplay(`Integrity: ${gameState.loomIntegrity}%`, 'narrative');
                    logToDisplay(`Temporal Residue: ${gameState.temporalResidue} TR`, 'narrative');
                    logToDisplay(`Core Matrix: ${gameState.coreMatrixStable ? 'Stable' : 'Unstable'}`, gameState.coreMatrixStable ? 'narrative' : 'warning');
                    logToDisplay(`Modules: ${gameState.modules.join(', ')}`, 'narrative');
                    processed = true;
                    break;

                case 'scan':
                    logToDisplay("Initiating resonance scan...", "system-message");
                     // [SOUND PLACEHOLDER: Scanner ping/sweep sound]
                    setTimeout(() => { // Simulate scan time
                         if (!gameState.introComplete) {
                            logToDisplay("Scan blocked. Complete introductory sequence.", 'warning');
                         } else if (Object.keys(gameState.nodes).length === 0) {
                            logToDisplay("Initial scan reveals first node...", 'system-message');
                            gameState.nodes = { ...nodesData }; // Load initial nodes
                            updateScannerUI();
                            logToDisplay("Resonance detected. Node(s) added to scanner.", 'system-message');
                         } else {
                            updateScannerUI();
                            logToDisplay("Scanner refreshed. Check node list.", 'system-message');
                         }
                         gameState.inputLocked = false;
                         commandInput.focus();
                    }, 1500);
                    processed = true; // Command is being processed async
                    return; // Don't unlock input immediately

                case 'observe':
                    if (args.length < 1) {
                        logToDisplay("Usage: OBSERVE <nodeId>", 'error-message');
                        break;
                    }
                    const observeNodeId = args[0];
                    const nodeToObserve = gameState.nodes[observeNodeId];
                    if (!nodeToObserve || nodeToObserve.resolved) {
                        logToDisplay(`Error: Node ${observeNodeId} not found or already resolved.`, 'error-message');
                        break;
                    }
                    const observeCost = 10; // Base cost to observe
                    if (gameState.chronoEnergy < observeCost) {
                        logToDisplay(`Insufficient Chrono-Energy. Required: ${observeCost} CE.`, 'warning');
                        break;
                    }

                    logToDisplay(`Focusing scanners on ${observeNodeId}... (Cost: ${observeCost} CE)`, 'system-message');
                    gameState.chronoEnergy -= observeCost;
                    // [SOUND PLACEHOLDER: Focusing/data stream sound]
                     setTimeout(() => {
                         if (nodeToObserve.scanLevel < 1) {
                             nodeToObserve.scanLevel = 1;
                             logToDisplay("Observation successful. Deeper details revealed.", 'system-message');
                         } else {
                             logToDisplay("Node already observed. Displaying known information.", 'system-message');
                         }
                         displayNodeInfo(observeNodeId);
                         updateStatusUI();
                         gameState.inputLocked = false;
                         commandInput.focus();
                     }, 2000);
                     processed = true;
                     return; // Async

                case 'weave':
                    if (args.length < 2) {
                        logToDisplay("Usage: WEAVE <nodeId> <weaveKey>", 'error-message');
                        break;
                    }
                    const weaveNodeId = args[0];
                    const weaveKey = args[1];
                    const nodeToWeave = gameState.nodes[weaveNodeId];

                    if (!nodeToWeave || nodeToWeave.resolved) {
                        logToDisplay(`Error: Node ${weaveNodeId} not found or already resolved.`, 'error-message');
                        break;
                    }
                    if (weaveNodeId !== gameState.activeNodeId) {
                        logToDisplay(`Error: Node ${weaveNodeId} is not the currently focused node. Observe it first.`, 'error-message');
                        break;
                    }
                    const weaveAction = nodeToWeave.weaveOptions[weaveKey];
                    if (!weaveAction) {
                        logToDisplay(`Error: Weave key '${weaveKey}' is not valid for node ${weaveNodeId}.`, 'error-message');
                        break;
                    }
                     if (weaveAction.requiresScanLevel && weaveAction.requiresScanLevel > nodeToWeave.scanLevel) {
                        logToDisplay(`Error: Requires scan level ${weaveAction.requiresScanLevel} to attempt this weave. Observe the node further.`, 'error-message');
                        break;
                    }

                    const weaveCost = weaveAction.cost;
                    if (gameState.chronoEnergy < weaveCost) {
                        logToDisplay(`Insufficient Chrono-Energy. Required: ${weaveCost} CE.`, 'warning');
                        break;
                    }

                    logToDisplay(`Attempting to weave causal thread: ${weaveAction.effectText} (Cost: ${weaveCost} CE)`, 'system-message');
                    gameState.chronoEnergy -= weaveCost;
                    // [SOUND PLACEHOLDER: Ethereal weaving/tuning sound]

                    setTimeout(() => {
                        logToDisplay("Weaving in progress...", 'system-message');
                        // Apply probability shifts
                        let probabilitySum = 0;
                        for (const outcome in weaveAction.probabilityShift) {
                            if (nodeToWeave.probabilities[outcome] !== undefined) {
                                nodeToWeave.probabilities[outcome] += weaveAction.probabilityShift[outcome];
                                // Clamp probabilities between 0.01 and 0.99 to avoid absolutes? Or allow extremes? Let's clamp gently.
                                nodeToWeave.probabilities[outcome] = Math.max(0.01, Math.min(0.99, nodeToWeave.probabilities[outcome]));
                            }
                        }
                         // Normalize probabilities (make sure they add up to 1)
                         let currentSum = 0;
                         for (const outcome in nodeToWeave.probabilities) {
                             currentSum += nodeToWeave.probabilities[outcome];
                         }
                         if (currentSum !== 1) {
                             const scaleFactor = 1 / currentSum;
                             for (const outcome in nodeToWeave.probabilities) {
                                 nodeToWeave.probabilities[outcome] *= scaleFactor;
                             }
                         }


                        setTimeout(() => {
                            logToDisplay("Influence registered. Probabilities shifted.", 'system-message');
                            displayNodeInfo(weaveNodeId); // Show updated probabilities
                            updateStatusUI();
                            gameState.inputLocked = false;
                            commandInput.focus();
                             // [SOUND PLACEHOLDER: Confirmation chime/ripple]
                        }, 1500);
                    }, 1500);
                    processed = true;
                    return; // Async

                case 'resolve':
                     if (args.length < 1) {
                        logToDisplay("Usage: RESOLVE <nodeId>", 'error-message');
                        break;
                    }
                    const resolveNodeId = args[0];
                    const nodeToResolve = gameState.nodes[resolveNodeId];

                    if (!nodeToResolve || nodeToResolve.resolved) {
                        logToDisplay(`Error: Node ${resolveNodeId} not found or already resolved.`, 'error-message');
                        break;
                    }
                     if (resolveNodeId !== gameState.activeNodeId) {
                        logToDisplay(`Error: Node ${resolveNodeId} is not the currently focused node. Observe it first.`, 'error-message');
                        break;
                    }

                    logToDisplay(`Allowing temporal event at ${resolveNodeId} to stabilize...`, 'system-message');
                     // [SOUND PLACEHOLDER: Building tension sound, then resolution sound]
                    setTimeout(() => {
                         // Determine outcome based on probabilities
                         const rand = Math.random();
                         let cumulativeProb = 0;
                         let finalOutcome = null;
                         for (const outcome in nodeToResolve.probabilities) {
                             cumulativeProb += nodeToResolve.probabilities[outcome];
                             if (rand <= cumulativeProb) {
                                 finalOutcome = outcome;
                                 break;
                             }
                         }

                         // Fallback if something goes wrong
                         if (!finalOutcome) {
                             finalOutcome = Object.keys(nodeToResolve.probabilities)[0];
                             logToDisplay("Warning: Probability calculation error, defaulting outcome.", 'warning');
                         }

                         const outcomeDetails = nodeToResolve.outcomes[finalOutcome];
                         logToDisplay(`--- Outcome: ${finalOutcome.replace(/_/g,' ')} ---`, 'node-title');
                         typeWriterLog(outcomeDetails.text, 'narrative', 40, () => {
                             logToDisplay(`Temporal Residue acquired: ${outcomeDetails.residueReward} TR`, 'system-message');
                             gameState.temporalResidue += outcomeDetails.residueReward;
                             nodeToResolve.resolved = true;
                             gameState.resolvedNodes.add(resolveNodeId);
                             gameState.activeNodeId = null;
                             currentFocusEl.textContent = "None";

                             updateStatusUI();
                             updateScannerUI();
                             gameState.inputLocked = false;
                             commandInput.focus();

                              // Check for game progression triggers?
                              if(resolveNodeId === 'alexandria_01') {
                                 typeWriterLog("The Loom shudders. Stabilizing this echo has drawn minor attention. Time Warden signature intensity increased slightly.", 'warning', 40);
                                 gameState.stealthProfile = "Low";
                                 updateStatusUI();
                              }
                         });


                    }, 2500);
                     processed = true;
                     return; // Async

                case 'repair':
                case 'upgrade':
                     if (args.length < 1) {
                        logToDisplay(`Usage: ${action.toUpperCase()} <upgradeId>`, 'error-message');
                        break;
                    }
                    const upgradeId = args[0].toLowerCase();
                    const upgrade = gameState.upgrades[upgradeId];

                    if (!upgrade) {
                        logToDisplay(`Error: Upgrade ID '${upgradeId}' not recognized. Check Repair Bay list.`, 'error-message');
                        break;
                    }
                     if (upgrade.purchased) {
                        logToDisplay(`Error: Upgrade '${upgrade.name}' already installed.`, 'warning');
                        break;
                    }
                    if (gameState.temporalResidue < upgrade.cost) {
                        logToDisplay(`Insufficient Temporal Residue. Required: ${upgrade.cost} TR for ${upgrade.name}.`, 'warning');
                        break;
                    }

                    logToDisplay(`Initiating ${action}... Applying ${upgrade.name}. (Cost: ${upgrade.cost} TR)`, 'system-message');
                    // [SOUND PLACEHOLDER: Repair/upgrade sound effect]
                    gameState.temporalResidue -= upgrade.cost;
                    upgrade.purchased = true;

                    // Apply upgrade effects
                    setTimeout(() => {
                        let effectMsg = "";
                        switch (upgradeId) {
                            case 'stabilize_matrix':
                                gameState.coreMatrixStable = true;
                                gameState.loomIntegrity += 15; // Bonus integrity
                                gameState.loomIntegrity = Math.min(100, gameState.loomIntegrity);
                                effectMsg = "Core Matrix stabilized. Loom integrity increased.";
                                // Could unlock new features here later
                                break;
                            case 'energy_cap_1':
                                gameState.maxChronoEnergy += 50;
                                effectMsg = "Maximum Chrono-Energy capacity increased.";
                                break;
                            case 'weave_intensifier_1':
                                // Placeholder: Could make weaves cheaper or more effective later
                                gameState.modules.push("Weave Intensifier Mk1");
                                effectMsg = "Weave Intensifier installed. Influence potential moderately increased.";
                                break;
                        }
                         logToDisplay(`${action.charAt(0).toUpperCase() + action.slice(1)} complete. ${effectMsg}`, 'system-message');
                         updateStatusUI();
                         gameState.inputLocked = false;
                         commandInput.focus();
                    }, 2000);
                     processed = true;
                     return; // Async

                 case 'clear':
                    mainDisplay.innerHTML = '';
                    logToDisplay("Display log cleared.", 'system-message');
                    processed = true;
                    break;

            }

            if (!processed && command.trim() !== '') {
                logToDisplay(`Error: Unknown command '${action}'. Type 'HELP' for commands.`, 'error-message');
                 // [SOUND PLACEHOLDER: Error buzz/blip]
            }

            gameState.inputLocked = false;
            if (!processed) commandInput.focus(); // Refocus only if not handled by async

        }, 200); // Short delay for command processing feel
    }


    // --- Event Listeners ---
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !gameState.inputLocked) {
            const command = commandInput.value.trim();
            if (command) {
                processCommand(command);
            }
        }
    });

     upgradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!button.disabled && !gameState.inputLocked) {
                const upgradeId = button.dataset.upgrade;
                handleCommand(`upgrade ${upgradeId}`); // Use handleCommand for consistency
            }
        });
    });

    // --- Game Loop / Initialization ---
    function gameTick() {
        // Generate Chrono-Energy
        if (gameState.chronoEnergy < gameState.maxChronoEnergy) {
            // Malfunction effect due to unstable matrix
            const energyGain = gameState.coreMatrixStable ? gameState.energyPerTick : gameState.energyPerTick * (0.5 + Math.random() * 0.5);
            gameState.chronoEnergy += energyGain;
            gameState.chronoEnergy = Math.min(gameState.chronoEnergy, gameState.maxChronoEnergy);
        }

        // Degrade integrity slowly if unstable?
         if (!gameState.coreMatrixStable && Math.random() < 0.01) { // Small chance per tick
             gameState.loomIntegrity -= 1;
             gameState.loomIntegrity = Math.max(0, gameState.loomIntegrity);
             if(gameState.loomIntegrity < 20 && Math.random() < 0.2) {
                 logToDisplay("ALERT: Critical integrity failure imminent!", 'error-message');
                 // [SOUND PLACEHOLDER: Klaxon/Alarm]
             }
             // Add game over condition if integrity hits 0?
         }


        updateStatusUI();
    }

    function startIntro() {
        gameState.inputLocked = true;
        commandInput.disabled = true; // Disable until intro done

        typeWriterLog("SYSTEM BOOT :: CHRONO-WEAVER INTERFACE v0.7 [DAMAGED]", 'system-message', 50, () =>
        typeWriterLog("...", 'system-message', 300, () =>
        typeWriterLog("Emergency power online. Core matrix unstable. External sensors... minimal.", 'narrative', 40, () =>
        typeWriterLog("Location unknown. Temporal displacement evident. Marooned.", 'narrative', 40, () =>
        typeWriterLog("The Time Wardens... they almost had me. Confiscated everything but this prototype Loom.", 'narrative', 40, () =>
        typeWriterLog("Damaged, barely functional... but maybe enough.", 'narrative', 40, () =>
        typeWriterLog("It detected Resonance nearby even in this state. Echoes of decisions... the Tapestry.", 'narrative', 40, () =>
        typeWriterLog("Objective: Stabilize Loom. Understand surroundings. Survive.", 'system-message', 40, () =>
        typeWriterLog("First step: Assess Loom status and scan for resonance points.", 'system-message', 40, () => {
            logToDisplay("--- Input Enabled ---", 'system-message');
            logToDisplay("Type 'HELP' for available commands.", 'system-message');
            gameState.inputLocked = false;
            commandInput.disabled = false;
            commandInput.focus();
            updateScannerUI(); // Show initial 'Scanning...'
            updateStatusUI(); // Show initial state
            gameState.introComplete = true;
             // Start game tick loop
             setInterval(gameTick, 1000); // Update energy etc every second
        })))))))));
    }

    // --- Initialize ---
    startIntro();

});