// craftingLogic.js
// =================

export const RECIPES = [
  // ─── Tier 1 Recipes ──────────────────────────
  {
    name: 'T1P01',
    label: 'T1P01',
    tier: 1,
    input: { T1R01: 2 },
    output: { T1P01: 1 },
  },
  {
    name: 'T1A01',
    label: 'T1A01',
    tier: 1,
    input: { T1P01: 2, T1R02: 1 },
    output: { T1A01: 1 },
  },

  // ─── Tier 2 Recipes ──────────────────────────
  {
    name: 'T2P01',
    label: 'T2P01',
    tier: 2,
    input: { T2R01: 2 },
    output: { T2P01: 1 },
  },
  {
    name: 'T2A01',
    label: 'T2A01',
    tier: 2,
    input: { T2P01: 2, T2R02: 1 },
    output: { T2A01: 1 },
  },

  // ─── Tier 3 Recipes ──────────────────────────
  {
    name: 'T3P01',
    label: 'T3P01',
    tier: 3,
    input: { T3R01: 2 },
    output: { T3P01: 1 },
  },
  {
    name: 'T3A01',
    label: 'T3A01',
    tier: 3,
    input: { T3P01: 2, T3R02: 1 },
    output: { T3A01: 1 },
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
      if (
        !playerInventory[resourceKey] || 
        playerInventory[resourceKey] < recipe.input[resourceKey]
      ) {
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
