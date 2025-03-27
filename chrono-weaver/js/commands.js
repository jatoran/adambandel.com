// js/commands.js
// Parses and executes player commands
import { gameState, setInputLocked, loadNodesData } from './gameState.js';
import * as ui from './ui.js';
import * as nodeLogic from './nodes.js';
import * as P_upgrades from './upgrades.js'; // Renamed import to avoid conflict
import { nodesData as initialNodes } from './nodes.js'; // Import initial node data directly for scan

// Main function to process command input
export function handleCommandInput(command) {
    if (gameState.inputLocked || gameState.gameOver || gameState.gameWon) return; // Check game end states too

    const trimmedCommand = command.trim();
    if (!trimmedCommand) return; // Ignore empty input

    ui.logToDisplay(`> ${trimmedCommand}`, 'command-echo'); // Echo command
    ui.clearCommandInput(); // Clear input field

    setInputLocked(true); // Lock input during processing

    const parts = trimmedCommand.toLowerCase().match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const action = parts[0];
    const args = parts.slice(1).map(arg => arg.replace(/"/g, ''));

    // Use a promise to handle async unlocking naturally
    let commandPromise = new Promise(resolve => {
        // Short delay for processing feel
        setTimeout(() => {
             resolve(processAction(action, args));
         }, 50); // Reduced delay
    });

    commandPromise.then(requiresAsyncUnlock => {
         if (!requiresAsyncUnlock) {
             setInputLocked(false);
             ui.focusCommandInput();
         }
         // If true, the async handler (timeout, typewriter) is responsible for unlocking
    }).catch(error => {
        console.error("Command processing error:", error);
        ui.logToDisplay("Internal error processing command.", 'error-message');
        setInputLocked(false); // Unlock on error
        ui.focusCommandInput();
    });
}

// Separated action processing logic
function processAction(action, args) {
    let requiresAsyncUnlock = false;

    switch (action) {
        case 'help':
            displayHelp();
            break;

        case 'status':
            displayStatus();
            break;

        case 'scan':
             requiresAsyncUnlock = handleScanAction();
             break;

        case 'observe':
            if (args.length < 1) { ui.logToDisplay("Usage: OBSERVE <nodeId>", 'error-message'); }
            else { requiresAsyncUnlock = nodeLogic.handleObserveAction(args[0]); }
            break;

        case 'weave':
            if (args.length < 2) { ui.logToDisplay("Usage: WEAVE <nodeId> <weaveKey>", 'error-message'); }
            else { requiresAsyncUnlock = nodeLogic.handleWeaveAction(args[0], args[1]); }
            break;

        case 'resolve':
             if (args.length < 1) { ui.logToDisplay("Usage: RESOLVE <nodeId>", 'error-message'); }
             else { requiresAsyncUnlock = nodeLogic.handleResolveAction(args[0]); }
             break;

        case 'repair':
        case 'upgrade':
        case 'install': // Allow 'install' alias
             if (args.length < 1) { ui.logToDisplay(`Usage: ${action.toUpperCase()} <upgradeId>`, 'error-message'); }
             else { requiresAsyncUnlock = P_upgrades.handleUpgradeAction(args[0].toLowerCase()); }
             break;

         case 'clear':
            ui.clearDisplay();
            break;

        case 'goal':
        case 'objective':
             displayObjective();
             break;

        // Default case for unknown commands
        default:
            ui.logToDisplay(`Error: Unknown command '${action}'. Type 'HELP' for commands.`, 'error-message');
            // [SOUND PLACEHOLDER: Error buzz/blip]
            break;
    }
    // Return whether an async operation is pending (which will handle unlocking)
    return requiresAsyncUnlock;
}


// --- Helper functions for specific commands ---

function displayHelp() {
    ui.logToDisplay("--- Available Commands ---", "system-message");
    ui.logToDisplay("HELP         - Show this list", "narrative");
    ui.logToDisplay("STATUS       - Display Loom status and resources", "narrative");
    ui.logToDisplay("GOAL         - Display current objective", "narrative");
    ui.logToDisplay("SCAN         - Scan for unresolved temporal resonance nodes", "narrative");
    ui.logToDisplay("OBSERVE <id> - Focus on and gather details about a node (costs CE)", "narrative");
    ui.logToDisplay("WEAVE <id> <key> - Attempt to influence a node (costs CE)", "narrative");
    ui.logToDisplay("RESOLVE <id> - Allow the focused node's event to conclude (may raise attention)", "narrative");
    ui.logToDisplay("UPGRADE <id> - Purchase an upgrade from the Repair Bay (costs TR)", "narrative");
    ui.logToDisplay("REPAIR <id>  - Repair a damaged system (costs TR)", "narrative");
    ui.logToDisplay("INSTALL <id> - Install new protocols (costs TR)", "narrative");
    ui.logToDisplay("CLEAR        - Clear the main display log", "narrative");
}

function displayStatus() {
    ui.logToDisplay(`--- Loom Status ---`, 'system-message');
    ui.logToDisplay(`Chrono-Energy : ${Math.floor(gameState.chronoEnergy)}/${gameState.maxChronoEnergy} CE`, 'narrative');
    ui.logToDisplay(`Integrity     : ${gameState.loomIntegrity}%`, gameState.loomIntegrity <= 20 ? 'error' : gameState.loomIntegrity <= 50 ? 'warning' : 'narrative');
    ui.logToDisplay(`Residue Cache : ${gameState.temporalResidue} TR`, 'narrative');
    ui.logToDisplay(`Core Matrix   : ${gameState.coreMatrixStable ? 'Stable' : 'Unstable'}`, gameState.coreMatrixStable ? 'stable' : 'warning');
    ui.logToDisplay(`Stealth       : ${gameState.stealthProfile}`, 'narrative');
    ui.logToDisplay(`Warden Signal : ${elements.wardenAttentionEl.textContent}`, elements.wardenAttentionEl.className); // Use formatted text/class from UI
    ui.logToDisplay(`Modules       : ${gameState.modules.join(', ') || 'None'}`, 'narrative');
    // Display calculated costs?
    // ui.logToDisplay(`Observe Mod   : ${gameState.observeCostModifier.toFixed(2)}x`, 'narrative');
    // ui.logToDisplay(`Weave Mod     : ${gameState.weaveCostModifier.toFixed(2)}x`, 'narrative');

}

function displayObjective() {
     ui.logToDisplay("--- Current Objective ---", "system-message");
      if (gameState.gameWon) {
         ui.logToDisplay("Stabilization achieved. Prototype phase complete.", "win-message");
         return;
     }
     if (gameState.gameOver) {
          ui.logToDisplay("Loom offline. Objective failed.", "error-message");
          return;
     }

     const totalNodes = Object.keys(gameState.nodes).length;
     const resolvedCount = gameState.resolvedNodes.size;

     if (!gameState.coreMatrixStable) {
         ui.logToDisplay("Primary: Stabilize the Loom Core Matrix via REPAIR.", 'warning');
         ui.logToDisplay("Secondary: Investigate and resolve detected resonance nodes.", 'narrative');
     } else if (totalNodes === 0) {
          ui.logToDisplay("Primary: SCAN for temporal resonance nodes.", 'narrative');
     }
     else if (resolvedCount < totalNodes) {
         ui.logToDisplay(`Primary: Resolve remaining temporal nodes (${resolvedCount}/${totalNodes}). Use SCAN, OBSERVE, WEAVE, RESOLVE.`, 'narrative');
         ui.logToDisplay("Secondary: Improve Loom capabilities via UPGRADE.", 'narrative');
     } else {
          ui.logToDisplay("All detected nodes resolved. Loom stabilized.", 'narrative');
           // This state should trigger the win condition, but just in case:
           ui.logToDisplay("[Proceed to next phase - End of Prototype]", 'system-message');
     }
      ui.logToDisplay("Tertiary: Avoid excessive Warden attention.", 'narrative');
}


function handleScanAction() {
     ui.logToDisplay("Initiating resonance scan...", "system-message");
     // [SOUND PLACEHOLDER: Scanner ping/sweep sound]
     setTimeout(() => {
         if (!gameState.introComplete) {
            ui.logToDisplay("Scan blocked. Complete introductory sequence.", 'warning');
         } else if (Object.keys(gameState.nodes).length === 0) {
            ui.logToDisplay("Scanning local temporal medium...", 'system-message');
            // Load initial nodes directly here on first scan after intro
             loadNodesData({ ...initialNodes }); // Load node data into state
             ui.updateScannerUI();
             if (Object.keys(gameState.nodes).length > 0) {
                ui.logToDisplay(`Resonance detected. ${Object.keys(gameState.nodes).length} node(s) added to scanner.`, 'system-message');
             } else {
                 ui.logToDisplay("Scan complete. No significant resonance detected currently.", 'system-message');
             }

         } else {
            ui.updateScannerUI(); // Just refresh the list display
            ui.logToDisplay("Scanner refreshed. Check node list for unresolved echoes.", 'system-message');
         }
         setInputLocked(false); // Unlock after scan completes
         ui.focusCommandInput();
     }, 1500);
     return true; // Indicates async unlock is needed
}