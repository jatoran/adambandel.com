// buildingUI.js
// =============
//
// Updated to show a building's info in a "popup modal" over the grid.
// Clicking outside the modal or pressing the X will hide it.
// Also implements a real-time update loop so that the panel refreshes
// while it is open.
//
// Additionally, removing the inline recipe <select> and using a separate
// "RecipeSelectionUI" that can show more in-depth recipe details.

import { ItemDefinitions } from './itemDefinitions.js';
import { RecipeSelectionUI } from './recipeSelectionUI.js';
// If you choose to keep recipe selection logic in the same file, 
// import it if needed: import { RecipeSelectionUI } from './recipeSelectionUI.js';

export class BuildingUI {
  constructor(state) {
    this.state = state;

    // Instead of a simple panel, we'll treat it like a modal with an overlay.
    this.modalOverlay = document.getElementById('buildingModalOverlay');
    this.modalContent = document.getElementById('buildingModalContent');
    this.closeButton  = document.getElementById('buildingModalClose');
    this.recipeModal = new RecipeSelectionUI(state, this);

    // If you have a separate recipe modal instance:
    // this.recipeModal = new RecipeSelectionUI(state, this);

    this.activeCell = null;

    // Hide on init
    this.hide();

    // Real-time refresh: check every 300ms if the modal is open, then re-render.
    // (Alternatively, you could place this logic in GameLogic or GameUI’s main loop.)
    setInterval(() => {
      if (this.isOpen()) {
        this.render();
      }
    }, 300);

    // Listen for close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => {
        this.hide();
      });
    }

    // Listen for clicks on overlay (clicking off the modal):
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        // If user clicked directly on the dark overlay (not on the child .modal-content)
        if (e.target === this.modalOverlay) {
          this.hide();
        }
      });
    }
  }

  isOpen() {
    return (this.modalOverlay && this.modalOverlay.style.display === 'block');
  }

  showBuilding(cell) {
    this.activeCell = cell;
    this.render();

    // Show the modal
    this.modalOverlay.style.display = 'block';
  }

  hide() {
    // Hide the modal
    if (this.modalOverlay) {
      this.modalOverlay.style.display = 'none';
    }
    this.activeCell = null;

    // Clear content
    if (this.modalContent) {
      this.modalContent.innerHTML = '';
    }
  }

  /**
   * Renders the building info into the modal’s content area.
   * Called automatically every 300ms while open, so user sees real-time changes.
   */
  render() {
    if (!this.activeCell || !this.modalContent) {
      return;
    }

    const cell = this.activeCell;
    const contentEl = this.modalContent;
    contentEl.innerHTML = ''; // clear

    // ─── Header ─────────────────────────
    const heading = document.createElement('div');
    heading.innerHTML = `<strong>Type: </strong> ${cell.type}`;
    heading.style.marginBottom = '4px';
    contentEl.appendChild(heading);

    const powerStatus = document.createElement('div');
    powerStatus.textContent = `Powered: ${cell.powered ? 'YES' : 'NO'}`;
    contentEl.appendChild(powerStatus);

    // ─── Extractor ─────────────────────
    if (cell.type === 'extractor') {
      const resType = cell.buildingState?.underlyingResourceType;
      if (resType) {
        const resDef = ItemDefinitions[resType];
        const name = resDef ? resDef.displayName : resType;
        const rDiv = document.createElement('div');
        rDiv.textContent = `Extracting: ${name}`;
        contentEl.appendChild(rDiv);
      }

      // "Inventory:"
      const invDiv = document.createElement('div');
      invDiv.textContent = 'Inventory: ';
      if (cell.buildingState?.item) {
        const label = this.getItemLabel(cell.buildingState.item);
        invDiv.textContent += label + ' (1/1)';
      } else {
        invDiv.textContent += 'empty';
      }
      contentEl.appendChild(invDiv);
      return; // end
    }

    // ─── Storage/Portal ────────────────
    if (cell.type === 'storage' || cell.type === 'portal') {
      // Summarize the items
      const storedItems = [...(cell.buildingState.storedItems || [])];
      if (cell.buildingState.item) {
        storedItems.push(cell.buildingState.item);
      }
      const totalCount = storedItems.length;
      const itemsDiv = document.createElement('div');
      itemsDiv.textContent = `Inventory: ${totalCount}`;
      if (totalCount > 0) {
        const summaryMap = {};
        storedItems.forEach(stItem => {
          const key = stItem.resourceType || '??';
          if (!summaryMap[key]) summaryMap[key] = 0;
          summaryMap[key]++;
        });
        const ul = document.createElement('ul');
        for (const [resKey, amt] of Object.entries(summaryMap)) {
          const li = document.createElement('li');
          const def = ItemDefinitions[resKey];
          const label = def?.displayName || resKey;
          li.textContent = `${label}: x${amt}`;
          ul.appendChild(li);
        }
        itemsDiv.appendChild(ul);
      }
      contentEl.appendChild(itemsDiv);
      return; // end
    }
// ─── Processor/Assembler ───────────
if (cell.type === 'processor' || cell.type === 'assembler') {
  const recipeKey = cell.buildingState.recipe;
  // Show current recipe
  const recipeDiv = document.createElement('div');
  recipeDiv.style.marginTop = '8px';
  recipeDiv.innerHTML = `<strong>Current Recipe:</strong> ${recipeKey || '(none)'}`;
  contentEl.appendChild(recipeDiv);

  // If there's an output item waiting
  if (cell.buildingState?.item) {
    const outDiv = document.createElement('div');
    outDiv.style.marginTop = '4px';
    outDiv.textContent = `Output Item: ${this.getItemLabel(cell.buildingState.item)}`;
    contentEl.appendChild(outDiv);
  }

  // ── Show input buffers ──
  if (cell.type === 'processor') {
    // PROCESSOR uses cell.buildingState.inputBuffer (single array)
    const buf = cell.buildingState.inputBuffer || [];
    const bufDiv = document.createElement('div');
    bufDiv.style.marginTop = '4px';
    if (buf.length === 0) {
      bufDiv.textContent = `Input Buffer: (empty)`;
    } else {
      const summaryMap = {};
      buf.forEach(item => {
        const k = item.resourceType || '??';
        if (!summaryMap[k]) summaryMap[k] = 0;
        summaryMap[k]++;
      });
      const summaryStr = Object.entries(summaryMap)
        .map(([k, v]) => {
          const def = ItemDefinitions[k];
          const label = def?.displayName || k;
          return `${label} x${v}`;
        })
        .join(', ');
      bufDiv.textContent = `Input Buffer: ${summaryStr}`;
    }
    contentEl.appendChild(bufDiv);

  } else if (cell.type === 'assembler') {
    // ASSEMBLER uses cell.buildingState.inputBuffers { resourceKey -> array of items }
    const inputBuffers = cell.buildingState.inputBuffers || {};
    const asmDiv = document.createElement('div');
    asmDiv.style.marginTop = '4px';

    if (Object.keys(inputBuffers).length === 0) {
      asmDiv.textContent = `Input Buffers: (none)`;
    } else {
      // Build a summary of each resource key and its count
      const parts = [];
      for (const [resKey, itemsArr] of Object.entries(inputBuffers)) {
        if (!itemsArr || itemsArr.length === 0) continue;
        const def = ItemDefinitions[resKey];
        const label = def?.displayName || resKey;
        parts.push(`${label} x${itemsArr.length}`);
      }
      if (parts.length === 0) {
        asmDiv.textContent = `Input Buffers: (empty)`;
      } else {
        asmDiv.textContent = `Input Buffers: ${parts.join(', ')}`;
      }
    }
    contentEl.appendChild(asmDiv);
  }

  // ── Show output buffer summary ──
  if (Array.isArray(cell.buildingState.outputBuffer)) {
    const outBuf = cell.buildingState.outputBuffer;
    const outBufDiv = document.createElement('div');
    outBufDiv.style.marginTop = '4px';
    
    if (outBuf.length === 0) {
      outBufDiv.textContent = 'Output Buffer: (empty)';
    } else {
      // Summarize items
      const summaryMap = {};
      outBuf.forEach(item => {
        const k = item.resourceType || '??';
        if (!summaryMap[k]) summaryMap[k] = 0;
        summaryMap[k]++;
      });
      const summaryStr = Object.entries(summaryMap)
          .map(([k, v]) => {
          const def = ItemDefinitions[k];
          const label = def?.displayName || k;
          return `${label} x${v}`;
          })
          .join(', ');
      outBufDiv.textContent = `Output Buffer: ${summaryStr}`;
    }
    contentEl.appendChild(outBufDiv);
  }

  // Instead of dropdown, let's have a button to open a separate recipe selection modal:
  const recipeBtn = document.createElement('button');
  recipeBtn.textContent = 'Change Recipe';
  recipeBtn.style.marginTop = '6px';
  recipeBtn.addEventListener('click', () => {
    this.openRecipeSelection(cell);
  });
  contentEl.appendChild(recipeBtn);

  return;
}


    // ─── Other (e.g. conveyor, merger, splitter, etc.) ─────────
    if (cell.buildingState?.item) {
      const outDiv = document.createElement('div');
      outDiv.style.marginTop = '4px';
      outDiv.textContent = `Held Item: ${this.getItemLabel(cell.buildingState.item)}`;
      contentEl.appendChild(outDiv);
    }
  }

  /**
   * Opens a separate modal where the user can see a list of possible recipes 
   * (for either processor or assembler) with full item info and requirements.
   *
   * Here, we just show an example method. You could delegate to a separate 
   * "RecipeSelectionUI" class instead.
   */
  openRecipeSelection(cell) {
    
  if (!this.recipeModal) return;
  this.recipeModal.show(cell);
  }

  setRecipe(cell, recipeKey) {
    cell.buildingState.recipe = recipeKey;
  
    // flush input buffer
    cell.buildingState.inputBuffer = [];
  
    // flush output buffer
    cell.buildingState.outputBuffer = [];
  
    // If you used to store cell.buildingState.item, also reset it:
    cell.buildingState.item = null;
  
    this.render();
  }

  getItemLabel(item) {
    if (!item) return '(no item)';
    let base = item.resourceType || item.type;
    const def = item.resourceType ? ItemDefinitions[item.resourceType] : null;
    if (def && def.displayName) base = def.displayName;
    if (item.type && item.type !== 'raw') {
      return `${base} (${item.type})`;
    }
    return base;
  }
}
