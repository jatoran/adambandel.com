// js/gameLoop.js
// Contains the main game tick logic
import { gameState, addEnergy, degradeIntegrity, calculateEnergyGain, triggerGameOver } from './gameState.js';
import { updateStatusUI, logToDisplay } from './ui.js';

let gameLoopIntervalId = null;

export function gameTick() {
    // Check if game is over before processing tick
    if (gameState.gameOver || gameState.gameWon) {
        stopGameLoop();
        return;
    }

    // --- Energy Generation ---
    if (gameState.chronoEnergy < gameState.maxChronoEnergy) {
        const energyGain = calculateEnergyGain(); // Use the function from gameState
        addEnergy(energyGain);
    }

    // --- Integrity Degradation ---
     if (!gameState.coreMatrixStable && gameState.loomIntegrity > 0) {
         // Higher chance or slightly higher degradation when unstable
         if (Math.random() < 0.015) { // Increased chance
             const degradationAmount = Math.random() < 0.1 ? 2 : 1; // Small chance for double damage
             degradeIntegrity(degradationAmount);
             if (degradationAmount > 1) {
                  logToDisplay("ALERT: Significant integrity flux detected!", 'warning');
             }
             // Game Over check is now inside degradeIntegrity

             if (gameState.loomIntegrity < 20 && gameState.loomIntegrity > 0 && Math.random() < 0.1) { // Reduced alert spam
                 logToDisplay("ALERT: Critical integrity failure imminent!", 'error-message');
                 // [SOUND PLACEHOLDER: Klaxon/Alarm]
             }
         }
     }

    // --- Warden Attention Effects (Simple Example) ---
    if (gameState.wardenAttentionLevel >= 8 && Math.random() < 0.05) {
        logToDisplay("ALERT: High energy signature detected! Possible Time Warden scan incoming!", 'error-message');
        // Could trigger a negative event or make next action cost more later
    } else if (gameState.wardenAttentionLevel >= 5 && Math.random() < 0.02) {
        logToDisplay("System Alert: Elevated temporal interference detected nearby.", 'warning');
    }


    // --- UI Update ---
    updateStatusUI(); // Update the UI every tick
}

export function startGameLoop() {
    if (!gameLoopIntervalId) {
        gameLoopIntervalId = setInterval(gameTick, 1000); // Keep 1 second interval
        console.log("Game loop started.");
    }
}

export function stopGameLoop() {
     if (gameLoopIntervalId) {
        clearInterval(gameLoopIntervalId);
        gameLoopIntervalId = null;
        console.log("Game loop stopped.");
    }
}