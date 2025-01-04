// structures.js
// =============


import { ItemDefinitions } from './itemDefinitions.js';


// We'll define some optional helper classes or building logic
export class ExtractorLogic {
  static update(cell, now) {
    const timeSinceSpawn = now - (cell.buildingState.lastSpawnTime || 0);
    if (!cell.buildingState.item && timeSinceSpawn > 2000) {
      // Only spawn if on a resource node
      if (cell.resourceType) {
        // Attach resourceType so the UI knows which resource this raw item is.
        cell.buildingState.item = {
          type: 'raw',
          resourceType: cell.resourceType,
          id: now
        };
        cell.buildingState.lastSpawnTime = now;
      }
    }
  }
}


// ProcessorLogic
export class ProcessorLogic {
  static update(cell) {
    const bs = cell.buildingState;

    // Must have a recipe
    const recipeKey = bs.recipe;
    if (!recipeKey) return;  

    // Must have space in output buffer (if it exists)
    if (!bs.outputBuffer) bs.outputBuffer = [];
    const outputBufferMax = bs.outputBufferMax ?? 1; // default to 1 if not set

    // If output buffer is full, do not process
    if (bs.outputBuffer.length >= outputBufferMax) {
      return;
    }

    // We accumulate items in inputBuffer
    if (!bs.inputBuffer) bs.inputBuffer = [];
    const neededInputs = ItemDefinitions[recipeKey].inputs || {};

    // Check if we have enough inputs
    if (hasAllInputs(bs.inputBuffer, neededInputs)) {
      // consume the required amounts
      consumeInputs(bs.inputBuffer, neededInputs);

      // produce 1 item, store in outputBuffer
      bs.outputBuffer.push({
        type: 'processed',    
        resourceType: recipeKey
      });
    }
  }
}

// AssemblerLogic
export class AssemblerLogic {
  static update(cell) {
    const bs = cell.buildingState;
    if (!bs.recipe) return;

    if (!bs.outputBuffer) bs.outputBuffer = [];
    const outputBufferMax = bs.outputBufferMax ?? 1;
    if (bs.outputBuffer.length >= outputBufferMax) {
      return; // blocked if no space in output buffer
    }

    // We have separate buffers for each resource type
    if (!bs.inputBuffers) bs.inputBuffers = {};

    // Which resources are needed by this recipe?
    const neededInputs = ItemDefinitions[bs.recipe].inputs || {};
    
    // Check if we have enough of each required resource
    for (const [resKey, amountNeeded] of Object.entries(neededInputs)) {
      const arr = bs.inputBuffers[resKey] || [];
      if (arr.length < amountNeeded) {
        return; // Not enough of this resource, can't assemble yet
      }
    }

    // If we get here, we have enough of every required resource
    // => consume them from each relevant buffer
    for (const [resKey, amountNeeded] of Object.entries(neededInputs)) {
      const arr = bs.inputBuffers[resKey]; 
      // remove that many items from the front
      for (let i = 0; i < amountNeeded; i++) {
        arr.shift(); // remove 1 item
      }
    }

    // produce 1 final item
    bs.outputBuffer.push({
      type: 'final', 
      resourceType: bs.recipe
    });
  }
}


/**
 * Check if inputBuffer has at least the required amounts for each key in neededInputs
 */
function hasAllInputs(inputBuffer, neededInputs) {
  // We'll tally them
  const tally = {};
  for (let i = 0; i < inputBuffer.length; i++) {
    const rt = inputBuffer[i].resourceType;
    if (!tally[rt]) tally[rt] = 0;
    tally[rt]++;
  }
  for (const k of Object.keys(neededInputs)) {
    if (!tally[k] || tally[k] < neededInputs[k]) {
      return false;
    }
  }
  return true;
}

/**
 * Remove the required amounts from the inputBuffer
 */
function consumeInputs(inputBuffer, neededInputs) {
  // For each item type, remove the needed quantity from the buffer
  for (const [resKey, amountNeeded] of Object.entries(neededInputs)) {
    let toRemove = amountNeeded;
    // Remove items from inputBuffer
    for (let i = 0; i < inputBuffer.length && toRemove > 0; i++) {
      if (inputBuffer[i].resourceType === resKey) {
        // remove this item
        inputBuffer.splice(i, 1);
        i--;
        toRemove--;
      }
    }
  }
}


export class PortalLogic {
  static update(cell) {
    // For now, portal is just an infinite storage concept; no special logic
  }
}

export function isBuilding(cell) {
  return (
    cell.type === 'conveyor'   ||
    cell.type === 'extractor'  ||
    cell.type === 'processor'  ||
    cell.type === 'assembler'  ||
    cell.type === 'storage'    ||
    cell.type === 'merger'     ||
    cell.type === 'splitter'   ||
    cell.type === 'portal'     ||
    cell.type === 'accumulator'||
    cell.type === 'powerPole'
  );
}

export function oppositeDir(dir) {
  switch (dir) {
    case 'up':    return 'down';
    case 'down':  return 'up';
    case 'left':  return 'right';
    case 'right': return 'left';
    default:      return null;
  }
}

export function getNextCellCoords(r, c, dir) {
  switch (dir) {
    case 'up':    return [r - 1, c];
    case 'down':  return [r + 1, c];
    case 'left':  return [r, c - 1];
    case 'right': return [r, c + 1];
    default:      return [r, c];
  }
}

export class StorageLogic {
  static update(cell) {
    // For now, storage doesn't transform items, so do nothing.
  }

  static tryStoreItem(cell, item) {
    if (!cell.buildingState.storedItems) {
      cell.buildingState.storedItems = [];
    }
    const capacity = cell.buildingState.capacity || 3;
    if (cell.buildingState.storedItems.length < capacity) {
      cell.buildingState.storedItems.push(item);
      return true;
    }
    return false;
  }

  static hasSpace(cell) {
    if (!cell.buildingState.storedItems) {
      cell.buildingState.storedItems = [];
    }
    const capacity = cell.buildingState.capacity || 3;
    return cell.buildingState.storedItems.length < capacity;
  }

  static popItem(cell) {
    if (cell.buildingState.storedItems?.length > 0) {
      return cell.buildingState.storedItems.shift(); 
    }
    return null;
  }
}
