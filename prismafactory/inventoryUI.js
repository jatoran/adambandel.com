// inventoryUI.js
// ==============

import { RECIPES, CraftingLogic } from './craftingLogic.js';

export class InventoryUI {
  constructor(state, ui) {
    this.state = state;
    this.ui = ui;  
    this.panelEl = document.getElementById('craftingPanel');
    this.recipesContainer = document.getElementById('recipesList');
    this.inventoryListEl = document.getElementById('playerInventoryList');
  }

  init() {
    // Build recipe buttons
    RECIPES.forEach(recipe => {
      const div = document.createElement('div');
      div.textContent = recipe.label + ' ';

      const craftBtn = document.createElement('button');
      craftBtn.textContent = 'Craft';
      craftBtn.addEventListener('click', () => {
        const success = CraftingLogic.craft(recipe.name, this.state.playerInventory);
        if (success) {
          // Re-render UI
          this.render();

          // Also update the top-left inventory display
          // (since we used some resources and produced new ones)
          if (this.state.controls && this.state.controls.ui) {
            this.state.controls.ui.updateUI();
          }
        } else {
            this.ui.showFeedback('Not enough resources!');
        }
      });

      div.appendChild(craftBtn);
      this.recipesContainer.appendChild(div);
    });

    this.render();
  }

  render() {
    // Update inventory list in the crafting panel
    this.inventoryListEl.innerHTML = '';
    for (let resourceKey in this.state.playerInventory) {
      const amount = this.state.playerInventory[resourceKey];
      const li = document.createElement('li');
      li.textContent = `${resourceKey}: ${amount}`;
      this.inventoryListEl.appendChild(li);
    }
  }

  show() {
    this.panelEl.style.display = 'block';
  }

  hide() {
    this.panelEl.style.display = 'none';
  }
}
