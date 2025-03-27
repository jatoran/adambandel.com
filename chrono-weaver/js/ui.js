// js/ui.js
// Handles all DOM manipulation and UI updates
import { gameState } from './gameState.js';
import { handleCommandInput } from './commands.js';
import { upgradesData } from './upgrades.js'; // Import upgrade definitions for UI updates

// Cache elements on load
const elements = {};
document.addEventListener('DOMContentLoaded', () => {
    elements.mainDisplay = document.getElementById('main-display');
    elements.commandInput = document.getElementById('command-input');
    elements.chronoEnergyEl = document.getElementById('chrono-energy');
    elements.maxChronoEnergyEl = document.getElementById('max-chrono-energy');
    elements.loomIntegrityEl = document.getElementById('loom-integrity');
    elements.temporalResidueEl = document.getElementById('temporal-residue');
    elements.stealthProfileEl = document.getElementById('stealth-profile');
    elements.coreMatrixStatusEl = document.getElementById('core-matrix-status');
    elements.availableModulesEl = document.getElementById('available-modules');
    elements.energyBar = document.getElementById('energy-bar');
    elements.nodeListEl = document.getElementById('node-list');
    elements.currentFocusEl = document.getElementById('current-focus');
    elements.upgradeButtons = document.querySelectorAll('.upgrade-button');
    elements.systemAlerts = document.getElementById('system-alerts'); // Cache alerts
    elements.wardenAttentionEl = document.getElementById('warden-attention'); // Cache warden level
    elements.resolvedCountEl = document.getElementById('resolved-count'); // Cache resolved count
});


// Function to safely get an element reference
export function getElement(id) {
    return elements[id]; // Assume elements are cached by DOMContentLoaded
}

// Log message directly to the display
export function logToDisplay(message, type = 'system-message') {
    if (!elements.mainDisplay) return;
    const entry = document.createElement('div');
    entry.classList.add('log-entry', type);

    // Add specific class for win message styling
    if (type === 'win-message') {
        entry.classList.add('win-message-style'); // Add a distinct class
    }

    entry.textContent = message;
    elements.mainDisplay.appendChild(entry);
    // Only auto-scroll if the user isn't trying to scroll up
    const shouldScroll = elements.mainDisplay.scrollHeight - elements.mainDisplay.clientHeight <= elements.mainDisplay.scrollTop + entry.offsetHeight + 10; // Check if near bottom
     if (shouldScroll) {
       elements.mainDisplay.scrollTop = elements.mainDisplay.scrollHeight;
     }
}

// Clear the main display
export function clearDisplay() {
     if (!elements.mainDisplay) return;
     elements.mainDisplay.innerHTML = '';
     logToDisplay("Display log cleared.", 'system-message');
}

// Update the overall status UI elements
export function updateStatusUI() {
    if (!elements.chronoEnergyEl || !elements.wardenAttentionEl) return; // Check if key elements exist

    // Resources
    elements.chronoEnergyEl.textContent = Math.floor(gameState.chronoEnergy);
    elements.maxChronoEnergyEl.textContent = gameState.maxChronoEnergy;
    elements.temporalResidueEl.textContent = gameState.temporalResidue;

    // Loom State
    elements.loomIntegrityEl.textContent = `${gameState.loomIntegrity}%`;
    elements.loomIntegrityEl.className = gameState.loomIntegrity <= 20 ? 'error' : gameState.loomIntegrity <= 50 ? 'warning' : 'normal';

    elements.coreMatrixStatusEl.textContent = gameState.coreMatrixStable ? "Stable" : "Unstable";
    elements.coreMatrixStatusEl.className = gameState.coreMatrixStable ? "stable" : "warning"; // Add 'stable' class if needed

    elements.availableModulesEl.textContent = gameState.modules.join(', ') || 'None';

    // World State
    elements.stealthProfileEl.textContent = gameState.stealthProfile;
    updateWardenAttentionUI(); // Call dedicated function for attention

     // Resolved Count
    if (elements.resolvedCountEl) {
        elements.resolvedCountEl.textContent = gameState.resolvedNodes.size;
    }

    // Energy Bar
    const energyPercent = gameState.maxChronoEnergy > 0 ? (gameState.chronoEnergy / gameState.maxChronoEnergy) * 100 : 0;
    elements.energyBar.style.width = `${energyPercent}%`;

    // Update Alerts (Example)
    if (elements.systemAlerts) {
        let alertText = "";
        if (!gameState.coreMatrixStable) alertText += "ALERT: Core Matrix Instability Detected | ";
        if (gameState.wardenAttentionLevel >= 7) alertText += "ALERT: High Warden Signature Detected | ";
        if (gameState.loomIntegrity <= 20) alertText += "ALERT: Critical Integrity Warning | ";
        elements.systemAlerts.textContent = alertText.slice(0,-3); // Remove trailing separator
        elements.systemAlerts.style.display = alertText ? 'block' : 'none'; // Show/hide
    }


    // Update upgrade button states
    updateUpgradeButtonsUI();
}

// Dedicated function to update warden attention UI
function updateWardenAttentionUI() {
    if (!elements.wardenAttentionEl) return;
    const level = gameState.wardenAttentionLevel;
    let text = "Negligible";
    let className = "normal";

    if (level >= 8) { text = "CRITICAL"; className = "error"; }
    else if (level >= 5) { text = "High"; className = "warning"; }
    else if (level >= 2) { text = "Moderate"; className = "notice"; } // Added 'notice' class possibility
    else if (level >= 1) { text = "Low"; className = "normal"; }

    elements.wardenAttentionEl.textContent = `${text} (${level}/10)`;
    elements.wardenAttentionEl.className = className;
}


// Dedicated function to update upgrade buttons
function updateUpgradeButtonsUI() {
     if (!elements.upgradeButtons) return;
     elements.upgradeButtons.forEach(button => {
        const upgradeId = button.dataset.upgrade;
        const upgrade = upgradesData[upgradeId]; // Use imported data

        if (upgrade) {
            let disabled = false;
            let title = `${upgrade.name} (${upgrade.cost} TR)`; // Default title

            if (upgrade.purchased) {
                disabled = true;
                button.textContent = "INSTALLED";
                title += " - Already Installed";
            } else if (gameState.temporalResidue < upgrade.cost) {
                disabled = true;
                button.textContent = (upgrade.action || 'UPGRADE').toUpperCase();
                title += " - Insufficient Residue";
            } else if (upgrade.prereq) {
                 // Check prerequisite
                 const prereqUpgrade = upgradesData[upgrade.prereq];
                 if (!prereqUpgrade || !prereqUpgrade.purchased) {
                     disabled = true;
                     button.textContent = (upgrade.action || 'UPGRADE').toUpperCase();
                     title += ` - Requires '${prereqUpgrade?.name || upgrade.prereq}'`;
                 } else {
                      button.textContent = (upgrade.action || 'UPGRADE').toUpperCase(); // Ready to buy
                 }
            }
             else {
                 button.textContent = (upgrade.action || 'UPGRADE').toUpperCase(); // Ready to buy
            }

            button.disabled = disabled;
            button.title = title; // Add tooltip

        } else {
             button.disabled = true; // Disable if upgrade data not found
             button.textContent = "N/A";
             button.title = "Upgrade definition missing";
        }
    });
}

// Update the node scanner list
export function updateScannerUI() {
    if (!elements.nodeListEl) return;
    elements.nodeListEl.innerHTML = ''; // Clear current list
    let hasNodes = false;

    // Sort nodes for consistent display order? Optional.
    const nodeIds = Object.keys(gameState.nodes).sort();

    for (const id of nodeIds) {
        const node = gameState.nodes[id];
        if (!node.resolved) { // Only show unresolved nodes
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
                   handleCommandInput(`observe ${id}`); // Trigger observe command
                }
            });
            elements.nodeListEl.appendChild(li);
        }
    }
    if (!hasNodes && gameState.introComplete) { // Only show "no resonance" after intro/scan
        const li = document.createElement('li');
        li.classList.add('placeholder');
         if(gameState.gameWon) {
             li.textContent = "All detected echoes stabilized.";
         } else {
             li.textContent = "No unresolved resonance detected.";
         }

        elements.nodeListEl.appendChild(li);
    } else if (!hasNodes && !gameState.introComplete) {
         const li = document.createElement('li');
         li.classList.add('placeholder');
         li.textContent = "Scanning...";
         elements.nodeListEl.appendChild(li);
    }
}

// Display detailed information about a specific node
// (Uses calculated costs now)
export function displayNodeInfo(nodeId) {
    const node = gameState.nodes[nodeId];
    if (!node || !elements.currentFocusEl) {
        logToDisplay(`Error displaying node info for ${nodeId}.`, 'error-message');
        return;
    }

    elements.currentFocusEl.textContent = `${node.id}: ${node.name}`;
    updateScannerUI(); // Highlight active node in list

    logToDisplay(`--- Node Focus: ${node.id} ---`, 'node-title');
    logToDisplay(node.description, 'narrative');
    logToDisplay(`Actors: ${node.actors.join(', ')}`, 'narrative');

    const observeCost = calculateObserveCost(node.baseObserveCost);

    if (node.scanLevel > 0) {
        logToDisplay("--- Observed Details ---", "system-message");
        node.details.forEach(detail => logToDisplay(`* ${detail}`, 'narrative')); // Add bullet point
    } else {
         logToDisplay(`Use 'OBSERVE ${nodeId}' (Cost: ${observeCost} CE) for more details.`, "system-message");
    }

    logToDisplay("--- Current Probabilities ---", "system-message");
    for (const outcome in node.probabilities) {
        logToDisplay(`${outcome.replace(/_/g,' ')}: ${(node.probabilities[outcome] * 100).toFixed(1)}%`, 'probability');
    }
     logToDisplay("--- Available Weave Options ---", "system-message");
     let weaveInfoDisplayed = false;
     for (const weaveKey in node.weaveOptions) {
         const weave = node.weaveOptions[weaveKey];
         const weaveCost = calculateWeaveCost(weave.baseCost); // Calculate actual cost
         if (!weave.requiresScanLevel || weave.requiresScanLevel <= node.scanLevel) {
             logToDisplay(`WEAVE ${nodeId} ${weaveKey} (Cost: ${weaveCost} CE)`, 'narrative');
             weaveInfoDisplayed = true;
         } else if (node.scanLevel === 0) {
             // Only hint if base scan level
              logToDisplay(`(Potential weave: Requires Observation)`, 'system-message-dim'); // Use a dimmer class
         }
     }
      if (!weaveInfoDisplayed && node.scanLevel < 1) {
             logToDisplay("(Observe node for potential weave options)", "system-message");
      } else if (!weaveInfoDisplayed && node.scanLevel >=1){
            logToDisplay("(No further weave options currently available)", "system-message");
      }
     logToDisplay("Use 'RESOLVE <nodeId>' to allow the event to conclude.", "system-message");
}


// Enable/disable command input
export function setCommandInputDisabled(disabled) {
    if(elements.commandInput) {
        elements.commandInput.disabled = disabled;
        elements.commandInput.placeholder = disabled ? 'Input locked...' : '';
    }
}

// Focus command input
export function focusCommandInput() {
    if(elements.commandInput && !elements.commandInput.disabled) {
         // Only focus if not disabled (prevents focusing on game over)
        elements.commandInput.focus();
    }
}

// Clear command input
export function clearCommandInput() {
    if(elements.commandInput) {
        elements.commandInput.value = '';
    }
}