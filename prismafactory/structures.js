// structures.js
// =============

// We'll define some optional helper classes or building logic
export class ExtractorLogic {
    static update(cell, now) {
      const timeSinceSpawn = now - (cell.buildingState.lastSpawnTime || 0);
      if (!cell.buildingState.item && timeSinceSpawn > 2000) {
        // Only spawn if on a resource node
        if (cell.resourceType) {
          cell.buildingState.item = { type: 'raw', id: now };
          cell.buildingState.lastSpawnTime = now;
        }
      }
    }
  }
  
  export class ProcessorLogic {
    static update(cell) {
      if (cell.buildingState.item && cell.buildingState.item.type === 'raw') {
        cell.buildingState.item.type = 'processed';
      }
    }
  }
  
  export function isBuilding(cell) {
    return (
      cell.type === 'conveyor'  ||
      cell.type === 'extractor' ||
      cell.type === 'processor' ||
      cell.type === 'assembler' ||
      cell.type === 'storage'  
    );
  }
  
  export function oppositeDir(dir) {
    switch (dir) {
      case 'up': return 'down';
      case 'down': return 'up';
      case 'left': return 'right';
      case 'right': return 'left';
      default: return null;
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
  
  export class AssemblerLogic {
    static update(cell) {
      // Basic example: if there's a 'processed' item, make it 'final'
      // Real version: check if multiple inputs are present, combine them into a product.
      if (cell.buildingState.item && cell.buildingState.item.type === 'processed') {
        cell.buildingState.item.type = 'final';
      }
    }
}

export class StorageLogic {
    /**
     * Updates the storage building each tick.
     * For now, this might not need any “processing” logic,
     * but we could expand later to do e.g. special behaviors.
     */
    static update(cell) {
      // For now, storage doesn't transform items, so we do nothing.
    }
  
    /**
     * Attempt to add an item to storage if there's capacity.
     * Returns a boolean indicating success or failure.
     */
    static tryStoreItem(cell, item) {
      if (!cell.buildingState.storedItems) {
        cell.buildingState.storedItems = [];
      }
  
      const capacity = cell.buildingState.capacity || 3; // example capacity of 3
      if (cell.buildingState.storedItems.length < capacity) {
        cell.buildingState.storedItems.push(item);
        return true;
      }
      return false;
    }
  
    /**
     * Check if storage has space for a new item
     */
    static hasSpace(cell) {
      if (!cell.buildingState.storedItems) {
        cell.buildingState.storedItems = [];
      }
      const capacity = cell.buildingState.capacity || 3;
      return cell.buildingState.storedItems.length < capacity;
    }
  
    /**
     * Removes and returns the oldest stored item (FIFO) or the last one (LIFO),
     * depending on the design you prefer. We'll do FIFO for example.
     */
    static popItem(cell) {
      if (cell.buildingState.storedItems?.length > 0) {
        return cell.buildingState.storedItems.shift(); 
      }
      return null;
    }
  }