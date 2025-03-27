// js/main.js
// Main entry point, initialization, event listeners
import { gameState, setInputLocked, setIntroComplete } from './gameState.js';
import * as ui from './ui.js';
import { typeWriterLog } from './utils.js'; // Imports the updated function
import { handleCommandInput } from './commands.js';
import { startGameLoop, stopGameLoop } from './gameLoop.js';
import * as P_upgrades from './upgrades.js'; // Import to ensure upgradesData is available for UI

// --- Initialization ---
function startIntro() {
    setInputLocked(true);
    ui.setCommandInputDisabled(true); // Disable until intro done

    // These calls pass the *value* for the 'logClass' parameter
    typeWriterLog("SYSTEM BOOT :: CHRONO-WEAVER INTERFACE v0.8 [DAMAGED]", 'system-message', 50, () =>
    typeWriterLog("...", 'system-message', 300, () =>
    typeWriterLog("Emergency power online. Core matrix unstable. External sensors... minimal.", 'narrative', 40, () =>
    typeWriterLog("Location unknown. Temporal displacement evident. Marooned.", 'narrative', 40, () =>
    typeWriterLog("The Time Wardens... they almost had me. Confiscated everything but this prototype Loom.", 'narrative', 40, () =>
    typeWriterLog("Damaged, barely functional... but it responds. It senses the echoes.", 'narrative', 40, () =>
    typeWriterLog("Objective: Repair the Loom. Stabilize the local Temporal Tapestry by resolving resonance points.", 'system-message', 40, () =>
    typeWriterLog("Survival depends on understanding and influencing causality... carefully.", 'narrative', 40, () =>
    typeWriterLog("First step: Assess Loom status and scan for resonance points.", 'system-message', 40, () => {
        ui.logToDisplay("--- Input Enabled ---", 'system-message');
        ui.logToDisplay("Type 'HELP' for available commands.", 'system-message');
        setIntroComplete(true);
        setInputLocked(false);
        ui.setCommandInputDisabled(false);
        ui.focusCommandInput();
        ui.updateScannerUI();
        ui.updateStatusUI(); // Ensure initial state is shown correctly
        startGameLoop(); // Start the game tick loop
    })))))))));
}


// --- Event Listeners ---
function setupEventListeners() {
    const commandInput = ui.getElement('commandInput');
    if(commandInput) {
        commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !gameState.inputLocked && !gameState.gameOver && !gameState.gameWon) { // Check locks and game end
                const command = commandInput.value.trim();
                if (command) {
                    handleCommandInput(command);
                }
            }
        });
    }

    // Query buttons *after* DOMContentLoaded guarantees they exist if HTML is correct
    const upgradeButtons = document.querySelectorAll('.upgrade-button');
    if (upgradeButtons) {
         upgradeButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (!button.disabled && !gameState.inputLocked && !gameState.gameOver && !gameState.gameWon) {
                    const upgradeId = button.dataset.upgrade;
                    const action = button.dataset.action || 'upgrade'; // Get action verb
                    handleCommandInput(`${action} ${upgradeId}`);
                }
            });
        });
     } else {
         console.error("Could not find upgrade buttons!");
     }
}

// --- Document Ready ---
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    startIntro();
});

// Optional: Handle window closing or errors
window.addEventListener('beforeunload', () => {
    stopGameLoop(); // Clean up the interval timer
});

// Add simple CSS for win message and dim system messages
// (Keep this style injection as it was)
const style = document.createElement('style');
style.textContent = `
 .win-message-style {
    color: #80ffb0; /* Lighter green/cyan */
    font-weight: bold;
    text-shadow: 0 0 5px #80ffb0;
 }
 .system-message-dim {
    color: #777;
    font-style: italic;
 }
 .log-entry.notice { /* For moderate warden attention etc */
    color: var(--accent-color); /* Blueish */
 }
 .log-entry.stable { /* For stable matrix status */
    color: var(--text-color); /* Normal text */
 }
`;
document.head.appendChild(style);