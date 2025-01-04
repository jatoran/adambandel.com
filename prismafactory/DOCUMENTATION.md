GameState – all core data: grid, player info, inventory, etc.
GameUI – all DOM-related logic: rendering, click handling, movement events.
GameLogic – the main game loops (extractor spawns, processor conversions, conveyor movement, etc.).
structures.js – building-specific logic (extractor, processor) and shared utility functions (oppositeDir, getNextCellCoords, etc.).


# **Prismactory: Design Document**

## **1\. Overview**

**Name:** Prismactory  
**Platform:** HTML5 Browser  
**Tech:** vanilla js  
**Genre:** Factory Building, Incremental Game  
**Aesthetic:** Neon ASCII  
**Core Gameplay Loop:** Extract resources, build automated production lines, expand to new areas, and ascend through tiers of complexity  
**Storage:** localstorage for simple save/load \- autosave (every 30 seconds, reduced by 5 seconds whenever player places something) plus a manual save button

## **2\. Game Design**

### 2.1. Story

The player awakens as an ASCII character in a mysterious room with no memory of their past. They are driven by an innate sense of purpose that evolves as they progress through the game. The ultimate goal is to build increasingly complex factories, eventually unlocking the secrets of their identity and the nature of the world.

### 2.2. Player Interaction

* **Movement:** WASD keys control player movement.  
* **Interaction Radius:** A nearly transparent overlay indicates the player's build/interaction radius.  
* **Building/Interaction:** Players interact with the world by moving within range and clicking.  
* **Controls**  
  * B \- Building menu  
  * C/I \- Crafting and Inventory menu  
  * Building hotkeys 1-0  
    * summons hologram at cursor, left click to place  
  * Left click  
    * Resource node \- Harvest resource to inventory  
    * Structure \- Open structure menu  
  * Mouse Hover  
    * Structure \- glow to indicate it’s clickable  
  * Ctrl click \- destroy  
  * Shift click \- chain build

### 2.3. Building Menu

* List of buildings with descriptions  
  * Hover over any and it highlights \- hit number to set it at that hotkey  
  * Conveyor, Merger, Splitter, Storage, Extractor, Processor, Assembler

### 2.4. Crafting and Inventory Menu

* Inventory \- List of current resources player has, with counts  
  * Inventory persists between tiers, but stuff irrelevant to current tier is greyed out and cant be used  
* Limit: 100 for each resource  
* Crafting  
  * Select from available recipes, crafts item  
  * Crafting is purely so u can process raw resources into the materials solely for structure building  
  * No crafting time

### 2.5. Structure Menu

* Inventory  
* Loot button (loots all contents to player inventory)  
* Flush Contents Button  
* Recipe selection  
  * Set the desired output.  Structure will now only accept valid inputs  
* Placement \- Players can place items into any structure that can receive that item  
* Structures with accepted inputs will have a \+ \- (or arrows) next to their inventory, so player can add or remove resources  
* The player’s inventory will also have \+ \- (or arrows) next to all items in their inventory, so they can add it to the structure they are interacting with (if it accepts it. Also storages accept anything)

### 2.6. Conveyor/Power Line Placement:

* Click on a source (e.g., extractor, accumulator, pole) and drag the mouse to create a preview.  
* Conveyors can be dragged horizontally or vertically, snapping to the axis closest to the cursor (if no collision).  
* Conveyors are autonomous agnostic units  
  * conveyors aren’t really technically connected to each other. they look like they are because a resource gets moved in the direction the conveyor is moving in, but that just drops it on that side. if that side happens to also be a conveyor, then so be it.  
  * since conveyors are autonomous agnostic units, dragging them out in lines during building means the engine needs to understand that what’s really happening is a linear sequence of these “unit” conveyors are being placed with matching direction.  
  * Conveyors will always run a “can i push my item off” check to their output cell, verifying that a structure can accept that material or not, or that a belt in that receiving cell isn’t running in the direct opposite direction  
    * This can either be a cell-level check that has rules for different types of shit in that cell, or it can be an entity-level check, where if cell contains an entity, that entity has its own code for responding to the check, or a combo  
  * This means that a conveyor can push onto an adjacent conveyor as long as it is not opposite direction, which eliminates most use cases for mergers  
    * So fine \- we just say we don’t need mergers  
  * Conveyors have an output direction only, no input direction  
* Power lines are dragged similarly, connecting to power draws or poles when dragged onto them.

### 2.7. Manual Resource Collection: 

* Players can mouse over any resource node in their build radius and click to harvest resources to inventory.

### 2.8. Manual Resource Crafting

* In player inventory/craft menu, players can craft products if they have the materials.

### 2.9. Structure Inputs and Outputs

* Structures have designated input and output ports.  Designated by arrows.    
* Outputs will push one item onto the ground and then be blocked

## 3\. Progression (New)

The game is structured around three tiers of worlds, each with increasing scale and complexity:

**Tier 1: Initial Room:**

**Setting:** A small, non-scrolling rectangular area. The player learns the basic mechanics and builds their first factory.

**Resource Nodes:** Raw T1 Resources

**Objective:** Produce and connect T1 end products into portals that unlock corresponding resource nodes in Tier 2\.

**Tier 2: Expanded World:**

**Setting**: A large, scrolling rectangular area. 

**Resource Nodes:** Raw T2 Resources, T1 Product Resources

**Objective:**  Produce and connect T2 end products into portals that unlock corresponding resource nodes in Tier 3\.

**Tier 3: Ringworld (Hub):**

**Setting:** A massive, scrolling area that wraps around vertically (ringworld) and is bounded horizontally. 

**Resource Nodes:** Raw T3 Resources, T2 Product Resources

**Objective:** ??

## 4\. World Elements

* **Resource Patches:** Areas with varying concentrations of resources (indicated by ASCII cell vibrancy). Extractors can only be placed on these patches.  
* **Energy Regions:** Areas with varying energy potential (indicated by ASCII cell vibrancy). Accumulators can only be placed on these patches.

## 5\. Basic Structures

#### **5.5.1. Logistics**

* **Extractors:** Pull resources from resource patches. Require power.  
* **Conveyors:** Transport resources, materials, or products along a path. (players can walk right over them and/or ride them)  
* **Mergers:** Combine up to three input conveyors into one output.  
* **Splitters:** Divide one input conveyor into up to three outputs.  
* **Storage Units:** 2 inputs, 2 outputs.

#### **5.5.2. Power**

* **Accumulators:** Generate power from energy regions.  
* **Power Poles:** Act as an AOE power supplier. Mousing over them will show a radius of effect and probably laser lines between powered and powering elements

#### **5.5.3. Production**

* **Processors:** Convert resources into materials (2 inputs, 1 output). Require power.  
* **Assemblers:** Convert materials and/or resources into products (2 or 3 inputs, 1 output). Require power.

## 6\. End-Game Products

The ultimate goal of the game is to produce the following complex products, categorized into three types of matter:

#### **6.6.1. Red Matter (Quarks)**

* **Top Quark**  
  * Strong Nuclear Force Charge  
  * Heavy Mass Anomaly  
  * Color Charge \- Red  
* **Bottom Quark**  
  * Strong Nuclear Force Charge  
  * Heavy Mass Anomaly  
  * Color Charge \- Blue  
* **Charm Quark**  
  * Strong Nuclear Force Charge  
  * Medium Mass Anomaly  
  * Color Charge \- Green  
* **Strange Quark**  
  * Strong Nuclear Force Charge  
  * Medium Mass Anomaly  
  * Color Charge \- Red  
* **Up Quark**  
  * Strong Nuclear Force Charge  
  * Light Mass Anomaly  
  * Color Charge \- Blue  
* **Down Quark**  
  * Strong Nuclear Force Charge  
  * Light Mass Anomaly  
  * Color Charge \- Green

#### **6.6.2. Green Matter (Leptons)**

* **Electron**  
  * Electromagnetic Charge  
  * Weak Nuclear Force Charge  
  * Lepton Spin Resonance  
* **Electron Neutrino**  
  * Weak Nuclear Force Charge  
  * Neutrino Oscillation  
* **Muon**  
  * Electromagnetic Charge  
  * Weak Nuclear Force Charge  
  * Muon Decay Particle  
* **Muon Neutrino**  
  * Weak Nuclear Force Charge  
  * Neutrino Oscillation  
* **Tau**  
  * Electromagnetic Charge  
  * Weak Nuclear Force Charge  
  * Tau Decay Particle  
* **Tau Neutrino**  
  * Weak Nuclear Force Charge  
  * Neutrino Oscillation

#### **6.6.3. Blue Matter (Bosons)**

* **Photon**  
  * Electromagnetic Fluctuation  
  * Spacetime Curvature  
* **Gluon**  
  * Strong Nuclear Force Charge  
  * Color Charge \- Red/Anti-Green  
* **Z Boson**  
  * Weak Nuclear Force Charge  
  * Neutral Current Fluctuation  
* **W Boson**  
  * Weak Nuclear Force Charge  
  * Charged Current Fluctuation  
* **Higgs Boson**  
  * Higgs Field Excitation  
  * Scalar Energy Condensation  
* **Graviton**  
  * Gravitational Wave  
  * Spacetime Curvature

## 7\. Automation

* The player will manually collect, craft and build at first.  
* The scale of production required for end-game products necessitates automation.  
* Players must design and build efficient factories using the provided structures to achieve the necessary production rates.

## 8\. Optional Stuff

* Consider adding sound effects for interactions, building, and factory processes to enhance immersion.  
* A retro-inspired soundtrack/ambient-track could complement the neon ASCII aesthetic.  
* **Research Tree:** Introduce a research system to unlock new structures, upgrades, and tiers.  
* **Challenges/Achievements:** Add specific challenges or achievements to provide additional goals for players.  
* Some tier 3 products maybe have a use in tier 1 or 2, some sorts of boosts or something that can be used down there  
* our credits should list us as like  
  * co-developers  
  * but like  
  * the credits thing should be inconsistent  
  * like there will b ea part of the credits i obviously made and i put myself as senior co-developer  
  * and another that you obviously made where u do the same  
  * and then some legalese like a lawyer got involved   
  * then after that it’s consistent. one is “day to day items” one is “big picture stuff”