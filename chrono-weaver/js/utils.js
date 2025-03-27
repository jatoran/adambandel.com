// js/utils.js
// Utility functions shared across modules
import { gameState, setInputLocked } from './gameState.js';
import { getElement } from './ui.js'; // Use a getter from ui.js

// *** RENAMED PARAMETER: 'type' is now 'logClass' ***
export function typeWriterLog(message, logClass = 'narrative', delay = 30, callback = null) {
    const mainDisplay = getElement('mainDisplay');
    const commandInput = getElement('commandInput');
    if (!mainDisplay || !commandInput) {
        console.error("typeWriterLog: Missing mainDisplay or commandInput element.");
        // Optionally try to recover or just return
        if (callback) { // Ensure callback still fires eventually if needed, maybe after a delay
             setTimeout(() => {
                 setInputLocked(false); // Still need to unlock
                 if (callback) callback();
             }, delay);
        }
        return;
    }

    setInputLocked(true);
    const entry = document.createElement('div');
    // *** USE RENAMED PARAMETER HERE ***
    entry.classList.add('log-entry', logClass); // Use logClass instead of type
    mainDisplay.appendChild(entry);

    // Ensure scrolling happens even if display was previously scrolled up
    const isScrolledToBottom = mainDisplay.scrollHeight - mainDisplay.clientHeight <= mainDisplay.scrollTop + 1;

    if (isScrolledToBottom) {
      mainDisplay.scrollTop = mainDisplay.scrollHeight;
    }


    let i = 0;
    // Inner function name 'type' is okay, as it's scoped locally
    function type() {
        if (i < message.length) {
            entry.textContent += message.charAt(i);
            i++;
             // Auto-scroll during typing only if already near bottom
             if (mainDisplay.scrollHeight - mainDisplay.clientHeight <= mainDisplay.scrollTop + entry.offsetHeight + 10) { // Check if near bottom during type
               mainDisplay.scrollTop = mainDisplay.scrollHeight;
             }
            setTimeout(type, delay);
             // [SOUND PLACEHOLDER: Subtle keypress sound]
        } else {
            // Ensure final scroll after message completion if needed
            if (mainDisplay.scrollHeight - mainDisplay.clientHeight <= mainDisplay.scrollTop + 10) {
               mainDisplay.scrollTop = mainDisplay.scrollHeight;
            }
            setInputLocked(false);
            if (callback) callback();
            // Check if element exists and is not already focused
            if (commandInput && document.activeElement !== commandInput && !commandInput.disabled) {
                commandInput.focus(); // Refocus input after typing
            }
        }
    }
    type(); // Initial call to INNER 'type'
}

// Add other utilities here if needed, e.g., random number generation, string formatting