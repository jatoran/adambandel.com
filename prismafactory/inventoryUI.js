// inventoryUI.js
// ==============

import { RECIPES, CraftingLogic } from './craftingLogic.js';

export class InventoryUI {
  constructor(state, ui) {
    this.state = state;
    this.ui = ui;  

    // Instead of a panelEl, we now have a modal overlay approach
    this.modalOverlay = document.getElementById('inventoryModalOverlay');
    this.modalContent = document.getElementById('inventoryModalContent');
    this.closeBtn     = document.getElementById('inventoryModalClose');

    // We'll create containers on the fly in render()
    this.playerInventoryListEl = null;
    this.recipesContainerEl    = null;

    // Hide on init
    this.hide();

    // Listen for close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        this.hide();
      });
    }

    // Listen for clicks on overlay (clicking off the modal):
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        // If user clicked directly on the dark overlay (not on the child content)
        if (e.target === this.modalOverlay) {
          this.hide();
        }
      });
    }

    // Build the recipe list initially (static UI)
    // Then re-render the inventory counts whenever we open the modal
    this.buildRecipeList();
  }

  /**
   * Build out the recipe UI elements once (they rarely change),
   * but we won't attach them to the DOM until we render (show).
   */
  buildRecipeList() {
    // We'll create an off-DOM container to hold recipe items
    this.recipesContainerEl = document.createElement('div');

    const heading = document.createElement('h3');
    heading.textContent = 'Recipes';
    this.recipesContainerEl.appendChild(heading);

    RECIPES.forEach(recipe => {
      const div = document.createElement('div');
      div.style.margin = '4px 0';
      div.style.padding = '4px';
      div.style.border = '1px dashed #666';

      const label = document.createElement('span');
      label.textContent = recipe.label + ' ';
      div.appendChild(label);

      const craftBtn = document.createElement('button');
      craftBtn.textContent = 'Craft';
      craftBtn.style.marginLeft = '8px';
      craftBtn.addEventListener('click', () => {
        const success = CraftingLogic.craft(recipe.name, this.state.playerInventory);
        if (success) {
          this.render(); // re-render to show updated inventory
          this.ui.showFeedback(`Crafted: ${recipe.label}`);
        } else {
          this.ui.showFeedback('Not enough resources!');
        }
      });

      div.appendChild(craftBtn);
      this.recipesContainerEl.appendChild(div);
    });
  }

  /**
   * Renders the inventory & recipes into the modal content.
   */
  render() {
    if (!this.modalContent) return;

    // Clear existing content
    this.modalContent.innerHTML = '';

    // Title
    const title = document.createElement('h2');
    title.textContent = 'Inventory & Crafting';
    this.modalContent.appendChild(title);

    // Inventory list
    this.playerInventoryListEl = document.createElement('ul');
    this.playerInventoryListEl.style.listStyleType = 'none';
    this.playerInventoryListEl.style.paddingLeft  = '0';
    for (let resourceKey in this.state.playerInventory) {
      const amount = this.state.playerInventory[resourceKey];
      const li = document.createElement('li');
      li.textContent = `${resourceKey}: ${amount}`;
      this.playerInventoryListEl.appendChild(li);
    }
    this.modalContent.appendChild(this.playerInventoryListEl);

    // Separator
    const hr = document.createElement('hr');
    this.modalContent.appendChild(hr);

    // Append the recipes section
    this.modalContent.appendChild(this.recipesContainerEl);
  }

  show() {
    if (!this.modalOverlay) return;
    // Render fresh each time we show
    this.render();

    this.modalOverlay.style.display = 'block';
  }

  hide() {
    if (this.modalOverlay) {
      this.modalOverlay.style.display = 'none';
    }
  }
}
