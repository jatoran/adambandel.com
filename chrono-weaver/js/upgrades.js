// js/upgrades.js
// Upgrade definitions and logic
import {
    gameState,
    spendResidue,
    setCoreMatrixStable,
    improveIntegrity,
    increaseMaxEnergy,
    addModule,
    increaseEnergyRegen,
    reduceWeaveCostModifier,
    reduceObserveCostModifier, // Added
    updateStealthProfile // Added
} from './gameState.js';
import * as ui from './ui.js';

// Store upgrade definitions and state together
export const upgradesData = {
    // Existing
    stabilize_matrix: { cost: 50, purchased: false, name: "Stabilize Matrix", action: "REPAIR" },
    energy_cap_1: { cost: 30, purchased: false, name: "Energy Capacitor Mk1", action: "UPGRADE" },
    weave_intensifier_1: { cost: 75, purchased: false, name: "Weave Intensifier", action: "UPGRADE", prereq: "stabilize_matrix" }, // Example Prereq
    // New
    energy_regen_1: { cost: 40, purchased: false, name: "Energy Regen Mk1", action: "UPGRADE"},
    scan_enhancer_1: { cost: 60, purchased: false, name: "Scan Enhancer Mk1", action: "UPGRADE"},
    weave_stabilizer_1: { cost: 55, purchased: false, name: "Weave Stabilizer Mk1", action: "UPGRADE", prereq: "stabilize_matrix"},
    stealth_protocol_1: { cost: 100, purchased: false, name: "Stealth Protocol Mk1", action: "INSTALL", prereq: "stabilize_matrix"},
};

// Function to handle REPAIR/UPGRADE/INSTALL actions
export function handleUpgradeAction(upgradeId) {
    const upgrade = upgradesData[upgradeId];

    if (!upgrade) {
        ui.logToDisplay(`Error: Upgrade ID '${upgradeId}' not recognized. Check Repair Bay list.`, 'error-message');
        return false;
    }

    const action = upgrade.action || "UPGRADE"; // Get specific action verb

     if (upgrade.purchased) {
        ui.logToDisplay(`Notice: '${upgrade.name}' already installed.`, 'system-message'); // Less harsh than error
        return false;
    }
    if (gameState.temporalResidue < upgrade.cost) {
        ui.logToDisplay(`Insufficient Temporal Residue. Required: ${upgrade.cost} TR for ${upgrade.name}.`, 'warning');
        return false;
    }

    // Check prerequisites
    if (upgrade.prereq) {
        const prereqUpgrade = upgradesData[upgrade.prereq];
        if (!prereqUpgrade || !prereqUpgrade.purchased) {
             ui.logToDisplay(`Error: Prerequisite '${prereqUpgrade?.name || upgrade.prereq}' must be installed first.`, 'error-message');
             return false;
        }
    }


    ui.logToDisplay(`Initiating ${action}... Applying ${upgrade.name}. (Cost: ${upgrade.cost} TR)`, 'system-message');

    if (spendResidue(upgrade.cost)) {
        // [SOUND PLACEHOLDER: Repair/upgrade sound effect]
        setTimeout(() => {
            upgrade.purchased = true; // Mark as purchased
            let effectMsg = "";
            switch (upgradeId) {
                // Existing
                case 'stabilize_matrix':
                    setCoreMatrixStable(true);
                    improveIntegrity(25); // Slightly more bonus
                    effectMsg = "Core Matrix stabilized. Base integrity restored. Enables advanced modules.";
                    break;
                case 'energy_cap_1':
                    increaseMaxEnergy(50);
                    effectMsg = "Maximum Chrono-Energy capacity increased to " + gameState.maxChronoEnergy + ".";
                    break;
                case 'weave_intensifier_1':
                    // Now directly reduces cost modifier
                    reduceWeaveCostModifier(0.15); // 15% reduction
                    addModule("Weave Intensifier Mk1");
                    effectMsg = "Weave cost modifier reduced by 15%.";
                    break;
                // New
                case 'energy_regen_1':
                    increaseEnergyRegen(0.05); // Add +0.05 CE/tick
                    addModule("Energy Regen Mk1");
                    effectMsg = "Base Chrono-Energy regeneration rate increased.";
                    break;
                case 'scan_enhancer_1':
                    // Reduces observe cost
                    reduceObserveCostModifier(0.20); // 20% reduction
                    addModule("Scan Enhancer Mk1");
                    effectMsg = "Observe cost modifier reduced by 20%. Scan resolution slightly improved.";
                    // Could add passive detail reveal later
                    break;
                case 'weave_stabilizer_1':
                     // Reduces cost modifier further
                     reduceWeaveCostModifier(0.10); // Another 10% reduction
                     addModule("Weave Stabilizer Mk1");
                     effectMsg = "Weave cost modifier reduced by an additional 10%.";
                     break;
                 case 'stealth_protocol_1':
                     addModule("Stealth Protocol Mk1");
                     updateStealthProfile("Low"); // Improve base stealth
                     // Add passive reduction to attention gain later?
                     effectMsg = "Basic stealth protocols installed. Base signature reduced. Warden detection threshold increased.";
                     break;
            }
             ui.logToDisplay(`${action.charAt(0).toUpperCase() + action.slice(1)} complete. ${effectMsg}`, 'system-message');
             ui.updateStatusUI(); // Update UI after changes
             // Async completion, command handler manages lock
        }, 1800 + Math.random() * 700);
        return true; // Indicate command is processing (async)
    }
    return false;
}