// craftingLogic.js
// =================

export const RECIPES = [
    {
      name: 'ironPlate',
      label: 'Iron Plate',
      input: { ironOre: 2 },   // must match the resource you collect: "ironOre"
      output: { ironPlate: 1 },
    },
    {
      name: 'ironGear',
      label: 'Iron Gear',
      input: { ironPlate: 2 },
      output: { ironGear: 1 },
    },
  ];
  
  export class CraftingLogic {
    /**
     * Checks if the player has enough resources to craft the given recipe.
     */
    static canCraft(recipeName, playerInventory) {
      const recipe = RECIPES.find(r => r.name === recipeName);
      if (!recipe) return false;
  
      // Ensure for every input resource, we have enough in inventory
      for (let resourceKey of Object.keys(recipe.input)) {
        if (!playerInventory[resourceKey] || playerInventory[resourceKey] < recipe.input[resourceKey]) {
          return false;
        }
      }
      return true;
    }
  
    /**
     * Consumes the required input and adds the output items to inventory.
     */
    static craft(recipeName, playerInventory) {
      const recipe = RECIPES.find(r => r.name === recipeName);
      if (!recipe) return false;
      if (!this.canCraft(recipeName, playerInventory)) return false;
  
      // Subtract input
      for (let resourceKey of Object.keys(recipe.input)) {
        playerInventory[resourceKey] -= recipe.input[resourceKey];
      }
      // Add output
      for (let resourceKey of Object.keys(recipe.output)) {
        if (!playerInventory[resourceKey]) {
          playerInventory[resourceKey] = 0;
        }
        playerInventory[resourceKey] += recipe.output[resourceKey];
      }
      return true;
    }
  }
  