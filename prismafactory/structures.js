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
      cell.type === 'conveyor' ||
      cell.type === 'extractor' ||
      cell.type === 'processor'
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
  