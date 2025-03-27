// js/nodes.js
// Node definitions and logic
import {
    gameState,
    spendEnergy,
    addResidue,
    setNodeActive,
    markNodeResolved,
    updateStealthProfile,
    increaseWardenAttention,
    decreaseWardenAttention,
    calculateObserveCost,
    calculateWeaveCost,
    setFlag // Import flag setting
} from './gameState.js';
import * as ui from './ui.js';
import { typeWriterLog } from './utils.js';

// --- Resonance Node Definitions ---
export const nodesData = {
    "alexandria_01": {
        id: "alexandria_01",
        name: "Alexandria: Pre-Fire Echo",
        baseObserveCost: 10, // Define base costs per node
        description: "Resonance detected: Library of Alexandria, ~48 BCE. High probability of significant data loss event. Multiple contributing factors. Primary decision point: actions of librarians and disposition of key scrolls.",
        actors: ["Theon (Head Librarian)", "Marcus (Roman Centurion)", "Civilian Populace"],
        scanLevel: 0,
        details: [
            "Detail: Scrolls of Archimedes located in vulnerable wing.",
            "Detail: Political tension high; minor scuffle near harbor reported.",
            "Detail: Theon debating prioritizing evacuation vs. securing specific archives."
        ],
        probabilities: { "library_destroyed": 0.65, "library_damaged": 0.30, "library_saved": 0.05 },
        weaveOptions: {
            "theon_prioritize_scrolls": {
                baseCost: 15, // Use baseCost
                effectText: "Nudging Theon's focus towards securing high-value scrolls.",
                probabilityShift: { "library_destroyed": -0.1, "library_damaged": +0.15, "library_saved": +0.05 }
            },
            "centurion_distraction": {
                baseCost: 20,
                effectText: "Amplifying minor harbor distractions to draw Marcus's patrol briefly.",
                probabilityShift: { "library_destroyed": -0.05, "library_damaged": +0.05 }
            },
            "inspire_clerk_archimedes": {
                baseCost: 25,
                effectText: "Subtly highlighting the importance of the Archimedes scrolls to a nearby clerk.",
                requiresScanLevel: 1,
                probabilityShift: { "library_damaged": -0.1, "library_saved": +0.1 }
            }
        },
        outcomes: {
            "library_destroyed": { text: "Catastrophe. Flames engulf the Great Library. Resonance confirms near-total loss of knowledge. A dark day echoed through time.", residueReward: 5, attentionChange: 0 },
            "library_damaged": { text: "Significant damage sustained. Sections of the library burn, but quick action saved many core archives. The loss is felt, but not absolute.", residueReward: 15, attentionChange: 1 },
            "library_saved": { text: "Against the odds! Focused efforts and perhaps external factors led to the fire being contained quickly. The bulk of the Library survives. A major temporal deviation noted. Warden attention slightly increased.", residueReward: 30, attentionChange: 2, flagsSet: ["alexandriaSaved"] } // Set flag on this outcome
        },
        resolved: false
    },
    "turing_enigma_01": {
        id: "turing_enigma_01",
        name: "Bletchley Park: Insight",
        baseObserveCost: 12,
        description: "Resonance detected: Bletchley Park, UK, ~1941. Critical phase in Enigma decryption. Alan Turing faces a conceptual block regarding rotor settings permutation.",
        actors: ["Alan Turing", "Joan Clarke", "Codebreaking Team"],
        scanLevel: 0,
        details: [
            "Detail: Pressure mounting from High Command for faster intercepts.",
            "Detail: Turing considering statistical 'Banburismus' technique.",
            "Detail: A faulty wiring report on Bombe machine causing minor delays."
        ],
        probabilities: { "breakthrough_delayed": 0.50, "standard_breakthrough": 0.40, "accelerated_insight": 0.10 },
        weaveOptions: {
            "amplify_statistical_focus": {
                baseCost: 20,
                effectText: "Subtly reinforcing Turing's thoughts on statistical analysis.",
                probabilityShift: { "breakthrough_delayed": -0.15, "standard_breakthrough": +0.10, "accelerated_insight": +0.05 }
            },
            "highlight_wiring_fault": {
                baseCost: 15,
                effectText: "Drawing attention to the intermittent Bombe wiring fault.",
                requiresScanLevel: 1,
                probabilityShift: { "breakthrough_delayed": +0.10, "standard_breakthrough": -0.10 } // Might cause delay fixing it
            },
             "subtle_pattern_hint": {
                baseCost: 30,
                effectText: "Injecting a near-subliminal pattern recognition echo related to rotor behavior.",
                 requiresScanLevel: 1,
                 probabilityShift: { "standard_breakthrough": -0.1, "accelerated_insight": +0.15 }
            }
        },
        outcomes: {
            "breakthrough_delayed": { text: "Decryption efforts stall for several crucial weeks. Historical impact noted as prolonged conflict.", residueReward: 10, attentionChange: 0 },
            "standard_breakthrough": { text: "Turing achieves the expected breakthrough. Enigma yields its secrets, following the established timeline.", residueReward: 20, attentionChange: 0 },
            "accelerated_insight": { text: "A sudden flash of insight! Turing overcomes the block significantly faster. Potential for shortened conflict noted, a moderate deviation. Warden attention tick up.", residueReward: 35, attentionChange: 1, flagsSet: ["turingInsightGained"] }
        },
        resolved: false
    },
    "mars_colony_01": {
        id: "mars_colony_01",
        name: "Valles Marineris: Artifact",
        baseObserveCost: 15,
        description: "Resonance detected: Ares Colony, Mars, ~2077. Deep survey team uncovers anomalous object buried beneath Valles Marineris. Object exhibits non-terrestrial energy signatures.",
        actors: ["Dr. Aris Thorne (Lead Scientist)", "Cmdr. Eva Rostova (Colony Security)", "Survey Team Delta"],
        scanLevel: 0,
        details: [
            "Detail: Object pulsates with low-frequency energy; composition unknown.",
            "Detail: Dr. Thorne advocates immediate, cautious study. Cmdr. Rostova urges quarantine.",
            "Detail: Faint subspace echo detected near object - possible origin signature?",
        ],
        probabilities: { "quarantine_coverup": 0.40, "cautious_study": 0.50, "reckless_activation": 0.10 },
        weaveOptions: {
            "reinforce_rostova_caution": {
                baseCost: 18,
                effectText: "Amplifying Cmdr. Rostova's concerns about containment protocols.",
                probabilityShift: { "quarantine_coverup": +0.15, "cautious_study": -0.10, "reckless_activation": -0.05 }
            },
             "boost_thorne_curiosity": {
                baseCost: 22,
                effectText: "Subtly encouraging Dr. Thorne's drive for immediate analysis.",
                 requiresScanLevel: 1,
                 probabilityShift: { "quarantine_coverup": -0.05, "cautious_study": +0.1, "reckless_activation": +0.05 }
            },
            "stabilize_energy_signature": {
                baseCost: 35,
                effectText: "Attempting to gently dampen the artifact's energy pulses.",
                 requiresScanLevel: 1,
                probabilityShift: { "cautious_study": +0.1, "reckless_activation": -0.1 } // Makes reckless activation less likely if stable
            }
        },
        outcomes: {
            "quarantine_coverup": { text: "Security prevails. The artifact is sealed, its existence classified 'Ares Gamma'. Knowledge suppressed.", residueReward: 10, attentionChange: -1, flagsSet: ["marsArtifactContained"] }, // Reduced attention
            "cautious_study": { text: "A balanced approach. The artifact is studied under strict protocols. Slow, incremental discoveries follow. Timeline remains relatively stable.", residueReward: 25, attentionChange: 0 },
            "reckless_activation": { text: "Driven by curiosity or accident, an energy surge erupts from the artifact! Colony systems disrupted. Significant temporal instability detected. HIGH WARDEN ATTENTION.", residueReward: 40, attentionChange: 3 } // High attention
        },
        resolved: false
    },
};

// --- Action Handlers ---

export function handleObserveAction(nodeId) {
    const nodeToObserve = gameState.nodes[nodeId];
    if (!nodeToObserve || nodeToObserve.resolved) {
        ui.logToDisplay(`Error: Node ${nodeId} not found or already resolved.`, 'error-message');
        return false;
    }
    const observeCost = calculateObserveCost(nodeToObserve.baseObserveCost); // Use calculated cost
    if (gameState.chronoEnergy < observeCost) {
        ui.logToDisplay(`Insufficient Chrono-Energy. Required: ${observeCost} CE.`, 'warning');
        return false;
    }

    ui.logToDisplay(`Focusing scanners on ${nodeId}... (Cost: ${observeCost} CE)`, 'system-message');
    if(spendEnergy(observeCost)) {
        setNodeActive(nodeId);
        // [SOUND PLACEHOLDER: Focusing/data stream sound]
         setTimeout(() => {
             if (nodeToObserve.scanLevel < 1) {
                 nodeToObserve.scanLevel = 1;
                 ui.logToDisplay("Observation successful. Deeper details revealed.", 'system-message');
             } else {
                 ui.logToDisplay("Node already observed. Displaying known information.", 'system-message');
             }
             ui.displayNodeInfo(nodeId); // Calls ui function to show details
             ui.updateStatusUI();
             // Async operation completed, command handler will manage lock
         }, 1500 + Math.random() * 1000); // Add slight variance to scan time
         return true; // Indicate command is processing (async)
    }
     return false;
}

export function handleWeaveAction(nodeId, weaveKey) {
    const nodeToWeave = gameState.nodes[nodeId];

    if (!nodeToWeave || nodeToWeave.resolved) {
        ui.logToDisplay(`Error: Node ${nodeId} not found or already resolved.`, 'error-message');
        return false;
    }
    if (nodeId !== gameState.activeNodeId) {
        ui.logToDisplay(`Error: Node ${nodeId} is not the currently focused node. Observe it first.`, 'error-message');
        return false;
    }
    const weaveAction = nodeToWeave.weaveOptions[weaveKey];
    if (!weaveAction) {
        ui.logToDisplay(`Error: Weave key '${weaveKey}' is not valid for node ${nodeId}.`, 'error-message');
        return false;
    }
     if (weaveAction.requiresScanLevel && weaveAction.requiresScanLevel > nodeToWeave.scanLevel) {
        ui.logToDisplay(`Error: Requires scan level ${weaveAction.requiresScanLevel} to attempt this weave. Observe the node further.`, 'error-message');
        return false;
    }

    const weaveCost = calculateWeaveCost(weaveAction.baseCost); // Use calculated cost
    if (gameState.chronoEnergy < weaveCost) {
        ui.logToDisplay(`Insufficient Chrono-Energy. Required: ${weaveCost} CE.`, 'warning');
        return false;
    }

    ui.logToDisplay(`Attempting to weave causal thread: ${weaveAction.effectText} (Cost: ${weaveCost} CE)`, 'system-message');

    if (spendEnergy(weaveCost)) {
        // [SOUND PLACEHOLDER: Ethereal weaving/tuning sound]
        setTimeout(() => {
            ui.logToDisplay("Weaving in progress...", 'system-message');
            // Apply probability shifts
            for (const outcome in weaveAction.probabilityShift) {
                if (nodeToWeave.probabilities[outcome] !== undefined) {
                    nodeToWeave.probabilities[outcome] += weaveAction.probabilityShift[outcome];
                    nodeToWeave.probabilities[outcome] = Math.max(0.01, Math.min(0.99, nodeToWeave.probabilities[outcome]));
                }
            }
             // Normalize probabilities
             let currentSum = 0;
             Object.values(nodeToWeave.probabilities).forEach(prob => currentSum += prob);

             if (Math.abs(1 - currentSum) > 0.001) {
                 const scaleFactor = 1 / currentSum;
                 for (const outcome in nodeToWeave.probabilities) {
                     nodeToWeave.probabilities[outcome] *= scaleFactor;
                 }
             }

            setTimeout(() => {
                ui.logToDisplay("Influence registered. Probabilities shifted.", 'system-message');
                ui.displayNodeInfo(weaveNodeId); // Show updated probabilities
                ui.updateStatusUI();
                 // [SOUND PLACEHOLDER: Confirmation chime/ripple]
                // Async operation completed, command handler will manage lock
            }, 1200 + Math.random() * 600);
        }, 1000 + Math.random() * 500);
        return true; // Indicate command is processing (async)
    }
    return false;
}

export function handleResolveAction(nodeId) {
    const nodeToResolve = gameState.nodes[nodeId];

    if (!nodeToResolve || nodeToResolve.resolved) {
        ui.logToDisplay(`Error: Node ${nodeId} not found or already resolved.`, 'error-message');
        return false;
    }
     if (nodeId !== gameState.activeNodeId) {
        ui.logToDisplay(`Error: Node ${nodeId} is not the currently focused node. Observe it first.`, 'error-message');
        return false;
    }

    ui.logToDisplay(`Allowing temporal event at ${nodeId} to stabilize... This may attract attention...`, 'system-message');
    increaseWardenAttention(1); // Base attention increase for resolving *any* node
    ui.updateStatusUI(); // Show immediate attention increase

    // [SOUND PLACEHOLDER: Building tension sound, then resolution sound]
    setTimeout(() => {
         const rand = Math.random();
         let cumulativeProb = 0;
         let finalOutcome = null;
         const outcomeKeys = Object.keys(nodeToResolve.probabilities).sort(); // Ensure consistent order

         for (const outcome of outcomeKeys) {
             cumulativeProb += nodeToResolve.probabilities[outcome];
             if (rand <= cumulativeProb) {
                 finalOutcome = outcome;
                 break;
             }
         }
         // Fallback
         if (!finalOutcome) finalOutcome = outcomeKeys[outcomeKeys.length - 1];

         const outcomeDetails = nodeToResolve.outcomes[finalOutcome];
         ui.logToDisplay(`--- Outcome: ${finalOutcome.replace(/_/g,' ').toUpperCase()} ---`, 'node-title');

         // Apply outcome effects before logging text
         addResidue(outcomeDetails.residueReward);
         if (outcomeDetails.attentionChange > 0) {
             increaseWardenAttention(outcomeDetails.attentionChange);
         } else if (outcomeDetails.attentionChange < 0) {
              decreaseWardenAttention(Math.abs(outcomeDetails.attentionChange));
         }
         // Set flags associated with the outcome
         if (outcomeDetails.flagsSet) {
             outcomeDetails.flagsSet.forEach(flag => setFlag(flag, true));
         }

         // Mark resolved *before* typewriter to prevent race conditions if user types fast
          markNodeResolved(nodeId);
          setNodeActive(null); // Clear active node

         // Now use typewriter for the narrative outcome
         typeWriterLog(outcomeDetails.text, 'narrative', 40, () => {
             ui.logToDisplay(`Temporal Residue acquired: ${outcomeDetails.residueReward} TR`, 'system-message');
             if (outcomeDetails.attentionChange !== 0) {
                 ui.logToDisplay(`Warden attention shift: ${outcomeDetails.attentionChange > 0 ? '+' : ''}${outcomeDetails.attentionChange}`, outcomeDetails.attentionChange > 0 ? 'warning' : 'system-message');
             }
              // Update UI fully after all effects applied and text written
             ui.updateStatusUI();
             ui.updateScannerUI();
             // Win condition check is handled within markNodeResolved in gameState.js
             // Input lock is handled by typewriter callback in utils.js
         });

    }, 2500 + Math.random() * 1000);
    return true; // Indicate command is processing (async)
}