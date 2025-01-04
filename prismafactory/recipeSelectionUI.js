// recipeSelectionUI.js
// =======================

import { ItemDefinitions } from './itemDefinitions.js';

export class RecipeSelectionUI {
  constructor(state, buildingUI) {
    this.state = state;
    this.buildingUI = buildingUI; // so we can call buildingUI.setRecipe etc.

    this.overlayEl  = document.getElementById('recipeModalOverlay');
    this.contentEl  = document.getElementById('recipeModalContent');
    this.closeBtn   = document.getElementById('recipeModalClose');

    if (this.closeBtn) {
      this.closeBtn.onclick = () => { this.hide(); };
    }
    if (this.overlayEl) {
      this.overlayEl.onclick = (e) => {
        if (e.target === this.overlayEl) {
          this.hide();
        }
      };
    }
  }

  

  show(cell) {
    if (!this.overlayEl || !this.contentEl) return;
    this.contentEl.innerHTML = ''; // clear old
    const title = document.createElement('h3');
    title.textContent = 'Select Recipe';
    this.contentEl.appendChild(title);
  
    // Desired category is 'processed' for processor, 'final' for assembler
    let desiredCategory = null;
    if (cell.type === 'processor')  desiredCategory = 'processed';
    if (cell.type === 'assembler')  desiredCategory = 'final';
  
    // We also want to match the current tier
    const currentTier = this.state.currentTier;
  
    // Filter itemDefinitions by category & tier
    const validKeys = Object.keys(ItemDefinitions).filter(k => {
      const def = ItemDefinitions[k];
      return (
        def.category === desiredCategory &&
        def.tier === currentTier
      );
    });
  
    if (validKeys.length === 0) {
      const msg = document.createElement('div');
      msg.textContent = "No recipes available at this tier.";
      this.contentEl.appendChild(msg);
    }
  
    validKeys.forEach(itemKey => {
      const itemDef = ItemDefinitions[itemKey];
      const recipeEl = document.createElement('div');
      recipeEl.style.border = '1px dashed #999';
      recipeEl.style.margin = '4px 0';
      recipeEl.style.padding = '4px';
  
      const recipeTitle = document.createElement('div');
      recipeTitle.innerHTML = `<strong>${itemDef.displayName}</strong>`;
      recipeEl.appendChild(recipeTitle);
  
      // produce line
      const produceLine = document.createElement('div');
      produceLine.textContent = `Produces: ${itemDef.displayName}`;
      recipeEl.appendChild(produceLine);
  
      // requires line
      const reqDiv = document.createElement('div');
      const req = itemDef.inputs || {};
      let reqStr = 'Requires: ' + Object.entries(req).map(([k,v]) => {
        const def2 = ItemDefinitions[k];
        const label2 = def2?.displayName || k;
        return `${label2} x${v}`;
      }).join(', ');
      reqDiv.textContent = reqStr;
      recipeEl.appendChild(reqDiv);
  
      // set recipe button
      const btn = document.createElement('button');
      btn.textContent = 'Set This Recipe';
      btn.onclick = () => {
        this.buildingUI.setRecipe(cell, itemKey);
        this.hide();
      };
      recipeEl.appendChild(btn);
  
      this.contentEl.appendChild(recipeEl);
    });
  
    this.overlayEl.style.display = 'block';
  }

  hide() {
    if (this.overlayEl) {
      this.overlayEl.style.display = 'none';
    }
  }
}
