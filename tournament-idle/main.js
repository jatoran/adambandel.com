import Decimal from './break_eternity.min.js';

import trainingData from './assets/gameData/trainingData.json';
import generatorData from './assets/gameData/generatorData.json';
import realmUpgradeData from './assets/gameData/realmUpgradeData.json';
import forgeUpgradeData from './assets/gameData/forgeUpgradeData.json';
import essenceUpgradeData from './assets/gameData/essenceUpgradeData.json';
import radianceUpgradeData from './assets/gameData/radianceUpgradeData.json';
import fighterData from './assets/gameData/fighterData.json';
import skillData from './assets/gameData/skillData.json';
import zoneData from './assets/gameData/zoneData.json';
import regionData from './assets/gameData/regionData.json';
import worldData from './assets/gameData/worldData.json';
import artifactData from './assets/gameData/artifactData.json';
import achievementData from './assets/gameData/achievementData.json';
import interfaceElementData from './assets/gameData/interfaceElementData.json';
import tabData from './assets/gameData/tabData.json';

import infoIconSource from './assets/icons/info-icon.png';

document.addEventListener('DOMContentLoaded', () => {
	window.game = new Game();
});

//process game when tab loses and regains focus
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        window.lastHidden = Date.now();
    } else {
        let elapsedTime = Date.now() - window.lastHidden;
		window.game.processOffline(elapsedTime);
		// console.error(elapsedTime,"ms since lost focus");
    }
});

class Game {
	constructor() {
		this.eventManager = new EventManager();
		this.settings = new GameSettings();

		this.lastIncomeUpdate = performance.now();
		this.incomeUpdateInterval = 100; // miliseconds
		this.uiUpdateInterval = 100; // miliseconds
		this.lastUnlockCheck = performance.now();
		this.unlockCheckInterval = 200;

		this.gameStartTime = new Date().getTime();
		this.totalGameTime = 0;

		this.hotkeyButtons = [];
		this.letterHotkeyButtons = [];

		this.lastSaveTime = null;
		this.lastSaveTimeConverted = null;

		this.running = false;

		this.init(0);
		
		this.eventManager.addListener('restart', (state) => this.restart(state));
		this.eventManager.addListener('updateHotkeyButtons', () => this.updateHotkeyButtons());

		this.initHotkeys();

		this.gameLoop();
	}

	init(state) {
		this.running = false;

		//initial game load state
		if (state === 0){
		}

		//reset game state
		else if (state === -1){
		}

		//run on all game state loads
		if (!this.eventManager){
			this.eventManager = new EventManager();
		}	
		this.gameManager = new GameManager(this.eventManager);
		this.builder = new Builder(this.eventManager, this.gameManager);
		this.gameStateManager = new GameStateManager(this.eventManager, this.gameManager);
		this.rewardManager = new RewardManager(this.eventManager, this.gameManager);
		this.ui = new GameUI(this.eventManager, this.gameManager, this.gameStateManager, this.rewardManager);
		
		this.gameStateManager.loadGameState(state);

		//if game loaded naturally, and a save file exists, process offline income
		if (state === 0 && localStorage.getItem('saveGame')){
			this.processOffline();
		}

		this.gameManager.updateNewMultiplierValues(this.gameManager.multiplierString);
		this.updateHotkeyButtons();

		//empty builder once it has initialized and built everything
		this.builder = null;

		this.running = true;
	}
	
	restart(state) {
		this.running = false;
		this.clearRunningIntervals();
		this.clearUI();
		this.eventManager.clearAllListeners();
		this.clearGameObjects();

		this.init(state);

		this.restartRunningIntervals();
		
		//re-attach listeners
		this.eventManager.addListener('restart', (state) => this.restart(state));
		this.eventManager.addListener('updateHotkeyButtons', () => this.updateHotkeyButtons());

		this.lastIncomeUpdate = performance.now();
		this.lastUnlockCheck = performance.now();

		//if rebirth triggered restart, immediately perform a regular full save after game reloads
		if (state > 0){
			this.gameStateManager.autosave();
		}

		this.running = true;
	}

	processOffline(){
		let lastSaveTime = this.gameManager.gameContent.player.lastSave;
		let currentTime = Date.now();
		let timeDifference = (currentTime - lastSaveTime) / 1000; //in seconds
	
		//calculate income and automations in 10 second steps if offline more than 10 seconds
		if (timeDifference > 10) {
			let totalTime = timeDifference;
			let remainder = totalTime % 10;
			console.log(new Date(currentTime).toLocaleString(),": Window focus regained.",timeDifference,"seconds have passed since the last save, (",new Date(lastSaveTime).toLocaleString(),"). Processing offline gains");
	
			// let beforeOfflineData = this.createOfflineGainsComparisonObject();
	
			let processCount = 0;
			while(totalTime >= 10){
				this.gameManager.calculateIncome(10);
				totalTime -= 10;
				processCount++;
			}
			
			if (remainder > 0) {
				this.gameManager.calculateIncome(remainder);
				totalTime -= remainder;
				processCount++;
			}
			
			console.log(processCount,"income and autobuy intervals completed");
			// this.displayOfflineGainsModal(beforeOfflineData);
		} 
		else {
			console.log(new Date(currentTime).toLocaleString(),": Window focus regained. Less than 10 seconds have passed since the last save, (",new Date(lastSaveTime).toLocaleString(),"). No offline process");
		}
	}
	
	displayOfflineGainsModal(beforeOfflineData){
		let afterOfflineData = this.createOfflineGainsComparisonObject();
	
		var span = document.getElementsByClassName("close")[0];
		var modal = document.getElementById("myModal");
		span.onclick = function() {
			modal.style.display = "none";
		  }
		modal.style.display = "block";
		var modalContent = document.getElementById("modal-message");
		let textContent = '';
		for (let key in beforeOfflineData) {
			if(key !== 'trainingLevels') {
				let gain = afterOfflineData[key].minus(beforeOfflineData[key]);
				textContent += `${key} gained: ${gain.toString()}\n`;
			} else {
				// Handle trainingLevels separately
				for(let trainingId in beforeOfflineData.trainingLevels) {
					let beforeTrainingLevel = beforeOfflineData.trainingLevels[trainingId];
					let afterTrainingLevel = afterOfflineData.trainingLevels[trainingId];
					let trainingGain = afterTrainingLevel.minus(beforeTrainingLevel);
					textContent += `Training Level (${trainingId}) gained: ${trainingGain.toString()}\n`;
				}
			}
		}
		modalContent.textContent = textContent;
	}

	createOfflineGainsComparisonObject() {
		let player = this.gameManager.gameContent.player;
		let comparisonObject = {
			powerLevel: player.powerLevel,
			forceIncome: player.forceIncome,
			wisdomIncome: player.wisdomIncome,
			trainingLevels: {}
		};
	
		this.gameManager.gameContent.trainings.forEach(training => {
			comparisonObject.trainingLevels[training.id] = training.level;
		});
	
		return comparisonObject;
	}
	

	clearGameObjects() {
        // Clear object references
        this.gameManager = null;
        // this.builder = null;
        this.gameStateManager = null;
        this.rewardManager = null;
        this.ui = null;
		this.eventManager = null;
    }

	clearRunningIntervals(){
		for (const zone of this.gameManager.gameContent.zones){
			zone.stopConquest();
		}

		if (this.ui.renderIntervalId) {
			clearInterval(this.ui.renderIntervalId);
			this.ui.renderIntervalId = null;
		}
	}

	restartRunningIntervals(){
		for (const zone of this.gameManager.gameContent.zones){
			if (zone.active && zone.isDefeated && zone.autoUnlocked){
				zone.startConquest();
			}
		}
	}

	clearUI() {
		const rootElement = document.getElementById('root');
		while (rootElement.firstChild) {
			rootElement.removeChild(rootElement.firstChild);
		}
	}
	

	gameLoop() {
		if (!this.running) {
			return;
		}

		this.checkUnlocks();
		this.updateUI();
		this.updateIncome();

		const now = Date.now();
		if (!this.lastSaveTime || now - this.lastSaveTime >= 10000) {  // milliseconds
			this.gameStateManager.autosave();
			this.lastSaveTime = now;
		}
		
        this.rewardManager.checkRewards();

		this.totalGameTime = Date.now() - this.gameStartTime;
		this.gameManager.gameContent.player.totalPlaytime = this.totalGameTime;
	}

	updateIncome() {
		const currentTime = performance.now();

		if (currentTime - this.lastIncomeUpdate >= this.incomeUpdateInterval) {
			// Calculate deltaTime in seconds
			let deltaTime = (currentTime - this.lastIncomeUpdate) / 1000;

			//increase deltatime by player timeModifierUpgrade
			deltaTime *= this.gameManager.gameContent.player.timeModifierUpgrade;

			this.gameManager.calculateIncome(deltaTime);
			this.gameManager.updateNewMultiplierValues(this.gameManager.multiplierString);
			this.lastIncomeUpdate = currentTime;
		}
	}

	checkUnlocks() {
		const currentTime = performance.now();
		// Check unlocks every 100 ms
		if (currentTime - this.lastUnlockCheck >= this.unlockCheckInterval) {
			this.gameManager.gameContent.unlockManager.checkUnlocks();
			this.lastUnlockCheck = currentTime;
		}
	}

	updateUI() {
		// Throttle the UI updates to every 100ms
		const throttledUpdateUI = this.throttle(() => this.ui.updateUI(), this.uiUpdateInterval);

		throttledUpdateUI();

		// Call the gameLoop again using requestAnimationFrame
		requestAnimationFrame(() => this.gameLoop());
	}

	throttle(func, wait) {
		let context, args, prevArgs, argsChanged, result;
		let previous = 0;

		return function () {
			let now, remaining;
			if (wait) {
				now = Date.now();
				remaining = wait - (now - previous);
			}
			context = this;
			args = arguments;
			argsChanged = JSON.stringify(args) !== JSON.stringify(prevArgs);
			prevArgs = Object.assign({}, args);

			if (argsChanged || (wait && (remaining <= 0 || remaining > wait))) {
				if (wait) {
					previous = now;
				}
				result = func.apply(context, args);
				context = args = null;
			}

			return result;
		};
	}

	initHotkeys(){
		setTimeout(() => {
			const hotkeyLetters = ['q', 'w', 'e', 'r', 't', 'y'];
			
			document.addEventListener('keydown', (event) => {
				if (event.key === 'Tab') {
					event.preventDefault(); // prevent the default action (scroll / move caret)
				
					// Get the list of active tabs
				 	let activeTabs = this.ui.getActiveTabs();

					if (activeTabs.length > 1){
						let currentTabName = this.ui.currentTab;

						// Get the index of the current active tab in the active tabs list
						let currentIndex = activeTabs.findIndex(tab => tab.name === currentTabName);

						let nextIndex;
						// If shift is held down, move to the previous tab; otherwise move to the next tab
						if (event.shiftKey) {
						  // If we're at the first tab wrap around to the end, otherwise just subtract one
						  nextIndex = currentIndex === 0 ? activeTabs.length - 1 : currentIndex - 1;
						} else {
						  // Otherwise, change to the next tab, wrapping around to the start of the list if necessary
						  nextIndex = (currentIndex + 1) % activeTabs.length;
						}

						let newTab = activeTabs[nextIndex];
						if (newTab.subTabs.length > 0){
							if (!newTab.currentSubTab){
								newTab.currentSubTab = newTab.subTabs[0].name;
							}
							
							this.ui.currentSubTab = newTab.currentSubTab.name;
						}
						else{
							this.ui.currentSubTab = null;
						}

						this.ui.changeTab(activeTabs[nextIndex].name);
					}
				}
				else if (event.key >= '0' && event.key <= '9') {
					let num = parseInt(event.key);
					num = num === 0 ? 9 : num - 1; // mapping 0 to 9 and 1-9 to 0-8
					if (num >= 0 && num < 10 && this.hotkeyButtons[num] && !this.hotkeyButtons[num].disabled && !this.hotkeyButtons[num].classList.contains('disabled')) {
						this.hotkeyButtons[num].click();
					}
				}
				else if (['q', 'w', 'e', 'r', 't', 'y'].includes(event.key.toLowerCase())) {
					let letterIndex = hotkeyLetters.indexOf(event.key);
					if (letterIndex >= 0 && letterIndex < this.letterHotkeyButtons.length && !this.letterHotkeyButtons[letterIndex].disabled & !this.letterHotkeyButtons[letterIndex].classList.contains('disabled')) {
						this.letterHotkeyButtons[letterIndex].click();
					}
				}
				else if (event.key.toLowerCase() === 'm') {
					// Code for 'm' key
					let multSettingsButton = document.getElementById('multSettings');
					if (multSettingsButton) {
						multSettingsButton.click();
					}
				}
			});
		
			this.updateHotkeyButtons();
		}, 100); // Wait 100 milliseconds before initializing hotkeys
	}
	  
	updateHotkeyButtons(){
		this.hotkeyButtons = []; // reset the hotkeyButtons array
		let numberButtons;
		let tabContentID;
		if (this.ui.currentSubTab){
			
			tabContentID = this.ui.currentSubTab;

			if (this.ui.currentTab.includes('training')){
				tabContentID = "realm-content-" + tabContentID;
			}
			else if (this.ui.currentTab.includes('exploration')){
				this.currentSubTab = tabContentID;
				//first letter uppercase
				tabContentID = tabContentID.charAt(0).toUpperCase() + tabContentID.slice(1);

				tabContentID = "tab-content-" + tabContentID + "SubTab";
			}
			numberButtons = this.ui.returnHotkeyNumberButtons(tabContentID);
		}
		else{
			numberButtons = this.ui.returnHotkeyNumberButtons(this.ui.currentTab);
		}
		
		for(let i = 0; i < 10 && i < numberButtons.length; i++) {
			this.hotkeyButtons.push(numberButtons[i]);
		}
	
		this.letterHotkeyButtons = []; // reset the letterHotkeyButtons array
		let subTabButtons = this.ui.returnSubTabButtons();
		for(let i = 0; i < subTabButtons.length; i++) {
			this.letterHotkeyButtons.push(subTabButtons[i]);
		}
	}
}

class Builder {
	constructor(eventManager, gameManager) {
		this.eventManager = eventManager;
		this.gameManager = gameManager;

		//storage
		this.trainings = [];
		this.upgrades = [];
		this.essenceUpgrades = [];
		this.forgeUpgrades = [];
		this.radianceUpgrades = [];
		this.realms = [];
		this.skills = [];
		this.achievements = [];
		this.achievementSets = [];
		this.generatorChains = [];
		this.generators = [];
		this.worlds = [];
		this.regions = [];
		this.regions = [];
		this.zones = [];
		this.artifacts = [];

		this.tournament;
		this.fighterTiers = [];
		this.fighters = [];

		this.modsWaiting = [];
		this.mods = [];
		this.unlocks = new Map();
		this.calcTrees = [];

		this.build();
		
		//testing
		//this.printTrainingInfo();
		//this.printUpgradeInfo();
		//this.printZoneInfo();
		//this.printUnlockInfo();
		// this.printWorldRegionZoneHeirarchy();
	}

	build(){
		this.initializeGameFeatures();
		this.populateFeatures();
		this.distributeModsAndReferences();
	}

	initializeGameFeatures() {
		this.initTrainings();
		this.initGenerators();
		this.initUpgrades();
		this.initArtifacts();
		this.initRealms();
		this.initWorlds();
		this.initRegions();
		this.initZones();
		this.initTournament();
		this.initFighters();
		this.initFighterTiers();
		this.initSkills();
		this.initUnlocks();
		this.initAchievements();
	}

	populateFeatures(){
		this.pushRegionsToWorlds();
		this.pushZonesToRegions();
		this.pushTrainingsToRealms();
		this.pushUpgradesToRealms();
		this.pushGeneratorsToRealms();
		this.populateMilestones();
		this.createRebirthModAndPseudoObject();
		this.initHeadbandModsAndPseudoObject();
	}

	distributeModsAndReferences(){
		this.createModObjects();
		this.assignModPriorities();
		this.assignModReferences();
		this.assignUnlockReferences();
		this.assignFighterTierWorldRefernces();
		this.assignEssenceUpgradeReferences();
		this.registerModsToSources();
		this.registerModObserversAndTrees();
		this.initCalcTrees();
	}

	initAchievements() {
		this.initAchievementObjects();
		this.initAchievementSets();
		this.assignAchievementsToSets();
		this.initAchievementSetMods();
	}

	initUnlocks() {
		this.initForceTrainUnlocks();
		this.initEnergyTrainUnlocks();
		this.initGeneratorUnlocks();
		this.initForgeUpgradeUnlocks();

		this.initEssenceUpgradeUnlocks();
		this.initWorldUnlocks();
		this.initRegionUnlocks();
		this.initZoneUnlocks();
		this.initHeadbandModUnlocks();

		//artifact related unlocks
		this.initArtifactBaseItemUnlocks();
		this.initArtifactZoneUnlocks();
		this.initArtifactZoneRepeatUnlocks();

		this.initTabUnlocks();

		//skillconnections last so that locked paths are not auto-added (this checks for existing unlocks)
		this.initSkillConnectionUnlocks();
	}

	initUpgrades() {
		this.initRealmUpgrades();
		this.initforgeUpgrades();
		this.initEssenceUpgrades();
		this.initRadianceUpgrades();
	}

	initGeneratorUnlocks() {
		this.initWisdomGeneratorUnlocks();
		this.initDivineGeneratorUnlocks();
	}

	initAchievementObjects() {
		let achievementUnlockData = [];
		let unlockID = 6501;

		achievementData.forEach(data => {
			const { id, name, description, unlockCategory, conditionType, dependentID, radianceReward, triggerType, triggerCategory, conditionValue, setID, mods } = data;
			const achievement = new Achievement(this.eventManager, id, name, description, unlockCategory,conditionType, dependentID, radianceReward, triggerType, triggerCategory, conditionValue, setID );
			if (achievement.targetID) {
				achievement.target = this.findObjectById(achievement.targetID);
			}

			//grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
			if (mods){
				mods.forEach(modData => {
					this.modsWaiting.push(modData);
				});
			}

			//populate unlocks for each achievement, to be processed after loop
			achievementUnlockData.push({
				id: unlockID,
				category: achievement.unlockCategory,
				type: null,
				dependentID: achievement.dependentID,
				targetID: achievement.id,
				conditionType: achievement.conditionType,
				conditionValue: achievement.conditionValue,
				triggerType: achievement.triggerType,
				triggerValue: achievement.triggerValue
			});
	
			unlockID++;

			this.achievements.push(achievement);
			this.gameManager.gameContent.achievements.push(achievement);
			this.gameManager.gameContent.achievementsGrid.achievements.push(achievement);
			this.gameManager.gameContent.idToObjectMap.set(id, achievement);
		});

		this.createUnlocks(achievementUnlockData);
	}

	initAchievementSets(){
		const achievementSetData = [
			{ id:6401, name: "achieveSet1", description: "forceTrain * 2", color: 'var(--color-7)', bonusType: "mod", bonusValue: null}, 
			{ id:6402, name: "achieveSet2", description: "wisdomTrain * 2", color: 'var(--color-2)', bonusType: "mod", bonusValue: null}, 
			{ id:6403, name: "achieveSet3", description: "1 skillpoint", color: 'var(--color-3)', bonusType: "skillpoint", bonusValue: new Decimal(1)}, 
			{ id:6404, name: "achieveSet2", description: "wisdomTrain * 2", color: 'var(--color-4)', bonusType: "mod", bonusValue: null}, 
		];

		achievementSetData.forEach(data => {
			const { id, name, description, color, bonusType, bonusValue } = data;
			const achievementSet = new AchievementSet(this.eventManager, id, name, description, color, bonusType, bonusValue );
			this.achievementSets.push(achievementSet);
			this.gameManager.gameContent.achievementSets.push(achievementSet);
			this.gameManager.gameContent.achievementsGrid.achievementSets.push(achievementSet);
			this.gameManager.gameContent.idToObjectMap.set(id, achievementSet);
		});
	}

	initAchievementSetMods(){
		this.createMods([
			{ id: 6451, name: "achieveSetMod1", type: "prodBase", priority: null, sourceID: 6401, sourceCalcType: "mult", targetType: "forceTrain", targetID: null, runningCalcType: "mult", baseValue: 2, value: 2, active: false },
			{ id: 6452, name: "achieveSetMod2", type: "prodBase", priority: null, sourceID: 6402, sourceCalcType: "mult", targetType: "wisdomTrain", targetID: null, runningCalcType: "mult", baseValue: 2, value: 2, active: false },
		]);
	}

	assignAchievementsToSets(){
		for (const achievement of this.achievements){
			let achievementSet = this.findObjectById(achievement.setID);
			achievement.set = achievementSet;
			achievementSet.achievements.push(achievement);
		}
	}

	createGenerators(generatorData) {
		generatorData.forEach(data => {
			const { id, genChainID, evolutionTier, name, description, level, maxLevel = new Decimal(Infinity), costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, evolutions } = data;
			const generator = new Generator(this.eventManager, id, genChainID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, evolutions);
			this.generators.push(generator);
			this.gameManager.gameContent.generators.push(generator);
			this.gameManager.gameContent.idToObjectMap.set(id, generator);

			if (evolutions){
				evolutions.forEach(evolveData => {
					generator.evolutions.push(evolveData);
				});
			}

			//push generators to generatorchains
			const genChain = this.generatorChains.find(genChain => genChain.id === generator.genChainID);
			if (genChain) {
				genChain.generators.push(generator);
				generator.parentGenChain = genChain;
			}
		});
	}

	pushGeneratorsToRealms() {
		this.generatorChains.forEach(chain => {
			const realm = this.realms.find(realm => realm.id === chain.realmID);
			if (realm) {
				realm.generatorChains.push(chain);
				chain.realm = realm; // Assign the realm reference to the generator's realm value
			} else {
				console.error(`No realm found with id ${chain.realmID} for generatorChain ${chain.name}`);
			}
		});
	}

	initWorldUnlocks() {
	}

	initRegionUnlocks() {
	}

	initZoneUnlocks() {
	}

	initTabUnlocks(){
		this.createUnlocks([
			//training tab and force realm - default enabled 
			//settings tab - default enabled


			// wisdom tab
			{ id: 251, category: "id", type: null, dependentID: 851, targetID: 112, conditionType: "isCompleted", conditionValue: true, triggerType: "tabEnable", triggerValue: null },
			//energy tab
			// { id: 252, category: "id", type: null, dependentID: 611,  targetID: 113, conditionType: "level", conditionValue: 5, triggerType: "tabEnable", triggerValue: null },
			//divine tab
			// { id: 253, category: "id", type: null, dependentID: 2001, targetID: 114, conditionType: "level", conditionValue: 5, triggerType: "tabEnable", triggerValue: null },

			// specific training realm objects (so they can add their starting resource basically)
			//wisdom realm
			{ id: 271, category: "id", type: null, dependentID: 851, targetID: 20, conditionType: "isCompleted", conditionValue: true, triggerType: "setActive", triggerValue: null },
			//energy realm
			// { id: 272, category: "id", type: null, dependentID: 611,  targetID: 30, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null },
			//divine realm
			// { id: 273, category: "id", type: null, dependentID: 2001, targetID: 40, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null },


			//exploration tab 
			{ id: 256, category: "id", type: null, dependentID: 1001, targetID: 140, conditionType: "level", conditionValue: 7, triggerType: "tabEnable", triggerValue: null },
			//odyssey
			{ id: 281, category: "id", type: null, dependentID: 1003, targetID: 141, conditionType: "level", conditionValue: 10, triggerType: "tabEnable", triggerValue: null },
			//tournament
			{ id: 282, category: "id", type: null, dependentID: 9004, targetID: 142, conditionType: "isDefeated", conditionValue: true, triggerType: "tabEnable", triggerValue: null },
			//artifact
			{ id: 283, category: "id", type: null, dependentID: 1000001, targetID: 143, conditionType: "isProgressed", conditionValue: true, triggerType: "tabEnable", triggerValue: null },


			//forge
			{ id: 254, category: "id", type: null, dependentID: 1101, targetID: 120, conditionType: "level", conditionValue: 10, triggerType: "tabEnable", triggerValue: null },
			//skills
			{ id: 255, category: "id", type: null, dependentID: 9009, targetID: 130, conditionType: "isDefeated", conditionValue: true, triggerType: "tabEnable", triggerValue: null },
			//essence
			{ id: 257, category: "stat", type: null, dependentID: 1001, targetID: 150, conditionType: "powerLevel", conditionValue: 1000000, triggerType: "tabEnable", triggerValue: null },
			//achievements
			{ id: 258, category: "id", type: null, dependentID: 1001, targetID: 160, conditionType: "level", conditionValue: 15, triggerType: "tabEnable", triggerValue: null },
			//radiance
			{ id: 259, category: "id", type: null, dependentID: 6001, targetID: 180, conditionType: "isClaimed", conditionValue: true, triggerType: "tabEnable", triggerValue: null },

		]);
	}

	initForceTrainUnlocks() {
		this.createUnlocks([
			//trainings unlocking trainings
			{ id: 1201, category: "id", type: null, dependentID: 1001, targetID: 1002, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			{ id: 1202, category: "id", type: null, dependentID: 1002, targetID: 1003, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			{ id: 1203, category: "id", type: null, dependentID: 1003, targetID: 1004, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			{ id: 1204, category: "id", type: null, dependentID: 1004, targetID: 1005, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			//trainings unlocking upgrades
			{ id: 1205, category: "id", type: null, dependentID: 1001, targetID: 1101, conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
			{ id: 1206, category: "id", type: null, dependentID: 1001, targetID: 1102, conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
			{ id: 1207, category: "id", type: null, dependentID: 1002, targetID: 1103, conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
			{ id: 1208, category: "id", type: null, dependentID: 1003, targetID: 1104, conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
			{ id: 1209, category: "id", type: null, dependentID: 1004, targetID: 1105, conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
		]);
	}

	initForgeUpgradeUnlocks(){
		this.createUnlocks([
			//row 1 forge upgrades unlocked by default when forge tab unlocks
			//row 2 forge upgrades
			{ id: 11001, category: "id", type: null, dependentID: 10005, targetID: [10006,10007,10008,10009,10010], conditionType: "level", conditionValue: 1, triggerType: "setActive", triggerValue: null},
			//row 1 wisdom upgrades
			{ id: 11002, category: "id", type: null, dependentID: 851, targetID: [10101,10102,10103,10104,10105], conditionType: "isCompleted", conditionValue: true, triggerType: "setActive", triggerValue: null},
			//row 2 wisdom upgrades
			{ id: 11003, category: "id", type: null, dependentID: 10105, targetID: [10106,10107,10108,10109,10110], conditionType: "level", conditionValue: 1, triggerType: "setActive", triggerValue: null},
			//row 1 crystal upgrades
			{ id: 11004, category: "id", type: null, dependentID: 9004, targetID: [10401,10402,10403,10404,10405], conditionType: "isDefeated", conditionValue: true, triggerType: "setActive", triggerValue: null},
			//row 2 crystal upgrades
			{ id: 11005, category: "id", type: null, dependentID: 852, targetID: [10406,10407,10408,10409,10410], conditionType: "isCompleted", conditionValue: true, triggerType: "setActive", triggerValue: null},
			//row 3 crystal upgrades
			{ id: 11006, category: "id", type: null, dependentID: 853, targetID: [10411,10412,10413,10414,10415], conditionType: "isCompleted", conditionValue: true, triggerType: "setActive", triggerValue: null},

		]);
	}

	initWisdomGeneratorUnlocks() {
		this.createUnlocks([
			//gens unlock gens
			{ id: 621, category: "id", type: null, dependentID: 611, targetID: 612, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			{ id: 622, category: "id", type: null, dependentID: 612, targetID: 613, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			{ id: 623, category: "id", type: null, dependentID: 613, targetID: 614, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			{ id: 624, category: "id", type: null, dependentID: 614, targetID: 615, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			//gens unlock gen upgrades
			{ id: 625, category: "id", type: null, dependentID: 611, targetID: 631, conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
			{ id: 626, category: "id", type: null, dependentID: 611, targetID: 632, conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
			{ id: 627, category: "id", type: null, dependentID: 612, targetID: 633, conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
			{ id: 628, category: "id", type: null, dependentID: 613, targetID: 634, conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
			{ id: 629, category: "id", type: null, dependentID: 614, targetID: 635, conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
		]);
	}

	initEnergyTrainUnlocks() {
		this.createUnlocks([
			//trainings unlocking trainings
			{ id: 2201, category: "id", type: null,dependentID: 2001, targetID: 2002,conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null },
			{ id: 2202, category: "id", type: null,dependentID: 2002, targetID: 2003,conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null },
			{ id: 2203, category: "id", type: null,dependentID: 2003, targetID: 2004,conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null },
			{ id: 2204, category: "id", type: null,dependentID: 2004, targetID: 2005,conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null },

			//trainings unlocking upgrades
			{ id: 2205, category: "id", type: null,dependentID: 2001, targetID: 2101,conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null },
			{ id: 2206, category: "id", type: null,dependentID: 2001, targetID: 2102,conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null },
			{ id: 2207, category: "id", type: null,dependentID: 2002, targetID: 2103,conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null },
			{ id: 2208, category: "id", type: null,dependentID: 2003, targetID: 2104,conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null },
			{ id: 2209, category: "id", type: null,dependentID: 2004, targetID: 2105,conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null },
		]);
	}

	initDivineGeneratorUnlocks() {
		this.createUnlocks([
			//gens unlock gens
			{ id: 721, category: "id", type: null, dependentID: 711, targetID: 712 ,conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			{ id: 722, category: "id", type: null, dependentID: 712, targetID: 713 ,conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			{ id: 723, category: "id", type: null, dependentID: 713, targetID: 714 ,conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			{ id: 724, category: "id", type: null, dependentID: 714, targetID: 715 ,conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null},
			//gens unlock gen upgrades
			{ id: 725, category: "id", type: null, dependentID: 711, targetID: 731 , conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
			{ id: 726, category: "id", type: null, dependentID: 712, targetID: 732 , conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
			{ id: 727, category: "id", type: null, dependentID: 713, targetID: 733 , conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null},
			{ id: 728, category: "id", type: null, dependentID: 714, targetID: 734 , conditionType: "level", conditionValue: 10, triggerType: "setActive", triggerValue: null}
		]);
	}

	initArtifactBaseItemUnlocks(){
		this.createUnlocks([
			//zone completions that unlock artifacts
			{ id: 5901, category: "id", type: null, dependentID: 1000001, targetID: 5010, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
			{ id: 5902, category: "id", type: null, dependentID: 1000002, targetID: 5020, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
			{ id: 5903, category: "id", type: null, dependentID: 1000003, targetID: 5030, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
			{ id: 5904, category: "id", type: null, dependentID: 1000004, targetID: 5040, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
			{ id: 5905, category: "id", type: null, dependentID: 1000005, targetID: 5050, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
			{ id: 5906, category: "id", type: null, dependentID: 1000006, targetID: 5060, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
			{ id: 5907, category: "id", type: null, dependentID: 1000007, targetID: 5070, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
			{ id: 5908, category: "id", type: null, dependentID: 1000008, targetID: 5080, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
			{ id: 5909, category: "id", type: null, dependentID: 1000009, targetID: 5090, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
			{ id: 5910, category: "id", type: null, dependentID: 1000010, targetID: 5100, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
			{ id: 5911, category: "id", type: null, dependentID: 1000010, targetID: 5110, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
			{ id: 5912, category: "id", type: null, dependentID: 1000010, targetID: 5120, conditionType: "isProgressed", conditionValue: true, triggerType: "setActive", triggerValue: null },
		]);
	}

	initArtifactZoneUnlocks(){
		//artifact possessions that unlock zones (when artifact is built at lvl 1)
		this.createUnlocks([
			{ id: 5951, category: "id", type: null, dependentID: 5010, targetID: 9007, conditionType: "level", conditionValue: new Decimal(1), triggerType: "setActive", triggerValue: null },
		]);
	}

	initArtifactZoneRepeatUnlocks(){
		// Unlocks to the repeatUnlocked property of groups of zones based on an artifact being purchased
		this.createUnlocks([
			{ id: 5981, category: "id", type: null, dependentID: 5010, targetID: 1000001, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
			{ id: 5982, category: "id", type: null, dependentID: 5020, targetID: 1000002, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
			{ id: 5983, category: "id", type: null, dependentID: 5030, targetID: 1000003, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
			{ id: 5984, category: "id", type: null, dependentID: 5040, targetID: 1000004, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
			{ id: 5985, category: "id", type: null, dependentID: 5050, targetID: 1000005, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
			{ id: 5986, category: "id", type: null, dependentID: 5060, targetID: 1000006, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
			{ id: 5987, category: "id", type: null, dependentID: 5070, targetID: 1000007, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
			{ id: 5988, category: "id", type: null, dependentID: 5080, targetID: 1000008, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
			{ id: 5989, category: "id", type: null, dependentID: 5090, targetID: 1000009, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
			{ id: 5990, category: "id", type: null, dependentID: 5100, targetID: 1000010, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
			{ id: 5991, category: "id", type: null, dependentID: 5110, targetID: 1000011, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
			// { id: 5992, category: "id", type: null, dependentID: 5120, targetID: 1000012, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
		]);
	}

	initEssenceUpgradeUnlocks() {
		this.createUnlocks([
			{ id: 3071, category: "id", type: null, dependentID: 100003, targetID: 4016, conditionType: "level",conditionValue: 1,triggerType: "setActive", triggerValue: null }
		]);
	}
 
	createUnlocks(unlockData) {
		unlockData.forEach(data => {
			const { id, category, type, dependentID, targetID, conditionType, conditionValue, triggerType, triggerValue } = data;
	
			// check if conditionvalue is a digit, and if so, convert to Decimal
			// json cannot store a decimal value, but conditionvalue can be a digit or bool
			const decimalConditionValue = typeof conditionValue === 'number' ? new Decimal(conditionValue) : conditionValue;
			const decimalTriggerValue = typeof triggerValue === 'number' ? new Decimal(triggerValue) : triggerValue;
	
			const unlock = new Unlock( id, category, type, dependentID, targetID, conditionType, decimalConditionValue, triggerType, decimalTriggerValue);
			
			this.gameManager.gameContent.unlockManager.unlocks.set(id, unlock);
			this.unlocks.set(id, unlock);
			this.gameManager.gameContent.unlocks.set(id, unlock);
			this.gameManager.gameContent.idToObjectMap.set(id, unlock);
		});
	}

	initTrainings() {
		trainingData.forEach(data => {
			const { id, realmID, evolutionTier, name, description, level, maxLevel = new Decimal(Infinity), costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, evolutions } = data;
			const training = new Training(this.eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, evolutions);

			if (evolutions){
				evolutions.forEach(evolveData => {
					training.evolutions.push(evolveData);
				});
			}

			this.trainings.push(training);
			this.gameManager.gameContent.trainings.push(training);
			this.gameManager.gameContent.idToObjectMap.set(id, training);
		});
	}

	initRealmUpgrades(){
		realmUpgradeData.forEach(data => {
			const { id, realmID, evolutionTier, name, description, level, maxLevel = new Decimal(Infinity), costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, mods, evolutions } = data;
			const upgrade = new Upgrade(this.eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, evolutions);

			//grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
			if (mods){
				mods.forEach(modData => {
					this.modsWaiting.push(modData);
				});
			}

			if (evolutions){
				evolutions.forEach(evolveData => {
					upgrade.evolutions.push(evolveData);
				});
			}

			
			this.upgrades.push(upgrade);
			this.gameManager.gameContent.upgrades.push(upgrade);
			this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
		});
	}

	initGeneratorChains(){
		const generatorChain1 = new GeneratorChain(this.eventManager, 601, "wGenChain1", 20, true);
		this.generatorChains.push(generatorChain1);
		this.gameManager.gameContent.generatorChains.push(generatorChain1);
		this.gameManager.gameContent.idToObjectMap.set(generatorChain1.id, generatorChain1);

		const generatorChain2 = new GeneratorChain(this.eventManager, 701, "dGenChain1", 40, true);
		this.generatorChains.push(generatorChain2);
		this.gameManager.gameContent.generatorChains.push(generatorChain2);
		this.gameManager.gameContent.idToObjectMap.set(generatorChain2.id, generatorChain2);
	}

	initGenerators() {
		this.initGeneratorChains();

		this.createGenerators(generatorData);
	}

	initEssenceUpgrades() {
		essenceUpgradeData.forEach(data => {
			const { id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active = false, specialTargetID, parentID, angleFromParent,distanceFromParent, isUnlockedByParent = true, mods } = data;
			const upgrade = new EssenceUpgrade(this.eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialTargetID, parentID, angleFromParent, distanceFromParent,isUnlockedByParent);

			//grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
			if (mods){
				mods.forEach(modData => {
					this.modsWaiting.push(modData);
				});
			}

			this.essenceUpgrades.push(upgrade);
			this.gameManager.gameContent.essenceUpgrades.push(upgrade);
			this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
		});

		this.buildEssenceUpgradeConnections();
	}

	buildEssenceUpgradeConnections(){
		for(const upgrade of this.essenceUpgrades){
			if (upgrade.parentID){
				upgrade.parent = this.findObjectById(upgrade.parentID);
				upgrade.parent.children.push(upgrade);
			}
		}
	}

	initforgeUpgrades(){
		forgeUpgradeData.forEach(data => {
			const { id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialVar1 = null, specialVar2 = null, specialVar3 = null, mods } = data;
			const upgrade = new ForgeUpgrade(this.eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialVar1, specialVar2, specialVar3);

			//grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
			if (mods){
				mods.forEach(modData => {
					this.modsWaiting.push(modData);
				});
			}

			this.forgeUpgrades.push(upgrade);
			this.gameManager.gameContent.forgeUpgrades.push(upgrade);
			this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
		});
	}

	initRadianceUpgrades() {
		radianceUpgradeData.forEach(data => {
			const { id, name, description, level, maxLevel = new Decimal(Infinity), costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialTargetID, mods } = data;

			const upgrade = new RadianceUpgrade(this.eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialTargetID);

			//grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
			if (mods){
				mods.forEach(modData => {
					this.modsWaiting.push(modData);
				});
			}

			this.radianceUpgrades.push(upgrade);
			this.gameManager.gameContent.radianceUpgrades.push(upgrade);
			this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
		});
	}

	initArtifacts() {
		artifactData.forEach(data => {
			let { id, name, evolutionTier, gearType, description, level = 0, maxLevel, costType, costBase, costGrowthRate, prodType = null, prodBase = null, prodGrowthRate = null, nextEvolveID = null, active = false, visible = false, mods } = data;
			
			const artifact = new Artifact(this.eventManager, id, name, evolutionTier, gearType, description, level, new Decimal(maxLevel), costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, nextEvolveID, active, visible);

			//grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
			if (mods){
				mods.forEach(modData => {
					this.modsWaiting.push(modData);
				});
			}
	
			this.artifacts.push(artifact);
			this.gameManager.gameContent.artifacts.push(artifact);
			this.gameManager.gameContent.idToObjectMap.set(id, artifact);
		});

		this.assignArtifactEvolutionReferences();
	}

	assignArtifactEvolutionReferences(){
		for (const artifact of this.artifacts){
			if (artifact.nextEvolveID){
				artifact.nextEvolveRef = this.findObjectById(artifact.nextEvolveID);
				artifact.nextEvolveRef.previousEvolution = artifact;
			}
		}
	}

	assignEssenceUpgradeReferences() {
		for (const upgrade of this.essenceUpgrades) {
			if (upgrade.specialTargetID) {
				upgrade.target = this.findObjectById(upgrade.specialTargetID);
			}
		}
	}

	initRealms() {
		const realmData = [
			//force realms
			{ id: 10, type: "force", name: "force", description: "", active: true },
			{ id: 20, type: "wisdom", name: "wisdom", description: "", active: true, startingResource: 2000 },
			{ id: 30, type: "energy", name: "energy", description: "", active: true, startingResource: 2000 },
			{ id: 40, type: "divine", name: "divine", description: "", active: true, startingResource: 2000 },
		];

		realmData.forEach(data => {
			const { id, type, name, description, active , startingResource} = data;
			const realm = new Realm(this.eventManager, id, type, name, description, active, startingResource);
			this.realms.push(realm);
			this.gameManager.gameContent.realms.push(realm);
			this.gameManager.gameContent.idToObjectMap.set(id, realm);
		});
	}

	initWorlds() {
		worldData.forEach(data => {
			const { id, name, active = false} = data;
			const world = new World(this.eventManager, this.gameManager.gameContent.worldManager ,id, name, active);
			this.worlds.push(world);
			this.gameManager.gameContent.worldManager.worlds.push(world);
			this.gameManager.gameContent.idToObjectMap.set(id, world);
			this.gameManager.gameContent.worlds.push(world);
		});
	}
	
	initRegions() {
		regionData.forEach(data => {
			const { id, worldID, name, shardType, active = false} = data;
			const region = new Region(this.eventManager, id, worldID, name, shardType, active);
			this.regions.push(region);
			this.gameManager.gameContent.idToObjectMap.set(id, region);
			this.gameManager.gameContent.regions.push(region);
		});
	}

	pushRegionsToWorlds() {
		this.regions.forEach(region => {
			let world = this.worlds.find(world => world.id === region.worldID);
			if (world) {
				world.regions.push(region);
				region.world = world;
			}
		});
	}

	initZones() {
		zoneData.forEach(data => {
			const { id, regionID, name, description, level = new Decimal(0), maxLevel = new Decimal(1), costType, costBase, costGrowthRate = new Decimal(2), prodType, prodBase, prodGrowthRate = new Decimal(1.01), baseConquestTime, active = false, zoneType = "standard", parentID, angleFromParent,distanceFromParent, isUnlockedByParent = true } = data;
			const zone = new Zone(
				this.eventManager, id, regionID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate,baseConquestTime, active, zoneType, parentID, angleFromParent,distanceFromParent, isUnlockedByParent
			);
			this.zones.push(zone);
			this.gameManager.gameContent.zones.push(zone);
			this.gameManager.gameContent.idToObjectMap.set(id, zone);
		});

		this.buildZoneConnections();
	}

	buildZoneConnections(){
		for(const zone of this.zones){
			if (zone.parentID){
				zone.parent = this.findObjectById(zone.parentID);
				zone.parent.children.push(zone);
			}
		}
	}

	pushZonesToRegions() {
		this.zones.forEach(zone => {
			let region = this.regions.find(region => region.id === zone.regionID);
			if (region) {
				region.zones.push(zone);
				zone.region = region;
			}
		});
	}

	initFighters() {
		let fighterID = 901;
		fighterData.forEach(data => {
			const { id = fighterID, name, description, tier, level = new Decimal(0), maxLevel = new Decimal(1), costType = "powerLevel", costBase, costGrowthRate = new Decimal(2), prodType = "crystal", prodBase, prodGrowthRate = new Decimal(1.01), baseFightTime, active = false, visible } = data;
			const fighter = new Fighter(
				this.eventManager, id, name, description, tier,level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate,baseFightTime, active, visible
			);
			this.fighters.push(fighter);
			this.gameManager.gameContent.fighters.push(fighter);
			this.gameManager.gameContent.tournament.fighters.push(fighter);
			this.gameManager.gameContent.idToObjectMap.set(id, fighter);
			fighterID++;
		});
	}

	initFighterTiers(){
		// creates fighter tiers based on fighters' fighterTier property, and assigns corresponding fighters
		let fighterTierID = 851;
		let worldID = 1000001;
		for (const fighter of this.fighters){
			let added = false;
			for (const fighterTier of this.fighterTiers){
				if (fighterTier.tier === fighter.tier){
					fighterTier.fighters.push(fighter);
					fighter.fighterTier = fighterTier;
					added = true;
					if (fighterTier.id === 851){
						fighterTier.setActive();
					}
				}
			}
			if (!added){
				let newTier = new FighterTier(this.eventManager, fighterTierID, fighter.tier, worldID);
				newTier.fighters.push(fighter);
				fighterTierID++;
				worldID++;
				this.fighterTiers.push(newTier);
				this.gameManager.gameContent.fighterTiers.push(newTier);
				this.gameManager.gameContent.tournament.fighterTiers.push(newTier);
				this.gameManager.gameContent.idToObjectMap.set(newTier.id, newTier);
				fighter.fighterTier = newTier;

				if (newTier.id === 851){
					newTier.setActive();
				}
			}
		}
	}

	assignFighterTierWorldRefernces(){
		//assign tiers to worlds
		//assign worlds to tiers
		for (let fighterTier of this.fighterTiers){
			let world = this.findObjectById(fighterTier.worldID);
			fighterTier.world = world;
			world.fighterTier = fighterTier;
		}
	}
	

	initTournament(){
		let tournament = new Tournament(this.eventManager, 799);
		this.tournament = tournament;
		
		this.gameManager.gameContent.tournament = tournament;
		this.gameManager.gameContent.idToObjectMap.set(tournament.id, tournament);
	}

	initSkills() {
		skillData.forEach(data => {
			const { id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate,active, connections, mods } = data;
			const skill = new Skill(
				this.eventManager,
				id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, connections
			);

			//grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
			if (mods){
				mods.forEach(modData => {
					this.modsWaiting.push(modData);
				});
			}

			this.skills.push(skill);
			this.gameManager.gameContent.skillTree.skills.push(skill);
			this.gameManager.gameContent.skills.push(skill);
			this.gameManager.gameContent.idToObjectMap.set(id, skill);
		});
		
		this.buildSkillTree();
	}

	initSkillConnectionUnlocks() {
		let unlockID = 42000;
		let unlocksDone = [];
		this.skills.forEach(skill => {
			for (const direction in skill.connections) {
				const unlock = new Unlock(unlockID, "id", null,  skill.id, skill.connections[direction], "level", 1, "setActive", null);
	
				//don't push unlock if a target skill is already unlocked (to handle bidirectional unlock directions) - also don't create any unlock for sk1
				if (!unlocksDone.some(existingUnlock => existingUnlock.targetID === unlock.targetID) && unlock.targetID !== 4001) {
	
					//don't auto-create unlocks for otherwise unlocked skill paths
					if (!Array.from(this.unlocks.values()).find(u => u.targetID === skill.connections[direction])) {

						//save reference to unlock on the unlocked skill for refunding skill and re-engaging unlock
						let targetSkill = this.gameManager.findObjectById(skill.connections[direction]);
						targetSkill.unlockingID = unlockID;
						skill.unlockedConnections.push(targetSkill);

						this.unlocks.set(unlockID, unlock);
						this.gameManager.gameContent.unlockManager.unlocks.set(unlockID, unlock);
						this.gameManager.gameContent.unlocks.set(unlockID, unlock);
						this.gameManager.gameContent.idToObjectMap.set(unlockID, unlock);
						unlockID++;
					}
				}
			}
		});
	}

	createRebirthModAndPseudoObject() {
		//hidden upgrade object to act as source of rebirth mod
		const sourceUpgrade =
			{ id: 60000, realmID: null, evolutionTier: null, name: "hidden rebirth1 upgrade source", description: "hidden rebirth1 upgrade source", level: new Decimal(1), maxLevel: Infinity, costType: "force", costBase: 1, costGrowthRate: 2, prodType: null, prodBase: null, prodGrowthRate: null, active: false };
		const { id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active } = sourceUpgrade;
		const upgrade = new Upgrade(this.eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
		this.upgrades.push(upgrade);
		this.gameManager.gameContent.idToObjectMap.set(id, upgrade);


		let modID = 60001;
		const mod = new Mod(this.eventManager, modID, "rebirth1EssenceMod", "production", null, 60000, "add", "allTrain", null, "mult", new Decimal(1), new Decimal(1), false);
		this.mods.push(mod);
		this.gameManager.gameContent.idToObjectMap.set(modID, mod);
	}

	initHeadbandModsAndPseudoObject(){
		//hidden upgrade object to act as source of rebirth mod
		const sourceUpgrade =
			{ id: 800, realmID: null, evolutionTier: null, name: "hidden headband upgrade source", description: "", level: new Decimal(0), maxLevel: Infinity, costType: "force", costBase: 1, costGrowthRate: 2, prodType: null, prodBase: null, prodGrowthRate: null, active: false };

		const { id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active } = sourceUpgrade;
		const upgrade = new Upgrade(this.eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);

		this.upgrades.push(upgrade);
		this.gameManager.gameContent.idToObjectMap.set(id, upgrade);

		let modData = [
			{ id: 801, name: "headbandMod1", type: "production", priority: null, sourceID: 800, sourceCalcType: "add", targetType: "forceTrain", targetID: null, runningCalcType: "mult", baseValue: 2, value: 2, active: false },
			{ id: 802, name: "headbandMod2", type: "production", priority: null, sourceID: 800, sourceCalcType: "add", targetType: "wisdomTrain", targetID: null, runningCalcType: "mult", baseValue: 2, value: 2, active: false },
		];

		this.createMods(modData);
	}

	initHeadbandModUnlocks(){
		this.createUnlocks([
			//trainings unlocking trainings
			{ id: 821, category: "id", type: null,  dependentID: 851, targetID: 801, conditionType: "isCompleted", conditionValue: true, triggerType: "headbandLevelActivate", triggerValue: null},
			{ id: 822, category: "id", type: null,  dependentID: 852, targetID: 802, conditionType: "isCompleted", conditionValue: true, triggerType: "headbandLevelActivate", triggerValue: null},
		]);
	}

	populateMilestones(){
		//initForceTrainMilestones
		this.initMilestones(30000, 30001, 31000, this.trainings);

		//initWisdomGenMilestones
		this.initMilestones(32000, 32001, 33200, this.generators);

		//initArtifactMilestones
		this.initMilestones(34000, 34001, 35200, this.artifacts);
	}

	initMilestones(sourceUpgradeID, modStartID, unlockStartID, features) {
		const MILESTONE_TIERS = [new Decimal(10), new Decimal(25), new Decimal(50), new Decimal(100), new Decimal(250), new Decimal(500), new Decimal(1000), new Decimal(2500), new Decimal(5000), new Decimal(10000), new Decimal(25000), new Decimal(50000), new Decimal(100000), new Decimal(250000), new Decimal(500000), new Decimal(1000000)];
	
		// Hidden upgrade object to act as source of milestone mods
		const sourceUpgrade =
			{ id: sourceUpgradeID, realmID: null, name: "hidden milestone upgrade source", description: "hidden milestone upgrade source", level: new Decimal(1), maxLevel: new Decimal(1), costType: "force", costBase: 1, costGrowthRate: 1, prodType: null, prodBase: null, prodGrowthRate: null, active: false };
		const { id, realmID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active } = sourceUpgrade;
		const upgrade = new Upgrade(this.eventManager, id, realmID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
		this.upgrades.push(upgrade);
		this.gameManager.gameContent.idToObjectMap.set(id, upgrade);

		let unlockID = unlockStartID;
		let modID = modStartID;
		let milestoneLevel = new Decimal(0);
		for (const feature of features) {
			let modValue = new Decimal(2);

			//set feature initial nextMilestoneLevel info
			feature.nextMilestoneLevel = MILESTONE_TIERS[0];
			feature.nextMilestoneMult = modValue;

			for (let i = 0; i < MILESTONE_TIERS.length; i++) {
				milestoneLevel = MILESTONE_TIERS[i];

				const mod = new Mod(this.eventManager, modID, feature.id + "milestone" + milestoneLevel.toString(), "production", null, sourceUpgradeID, "mult", null, feature.id, "mult", modValue, modValue, false);
				
				this.mods.push(mod);
				this.gameManager.gameContent.mods.push(mod);
				this.gameManager.gameContent.idToObjectMap.set(modID, mod);

				const unlock = new Unlock(unlockID, "id", null, feature.id, mod.id, "manualLevel", milestoneLevel, "setActive", null);

				this.unlocks.set(unlockID, unlock);
				this.gameManager.gameContent.unlockManager.unlocks.set(unlockID, unlock);
				this.gameManager.gameContent.unlocks.set(unlockID, unlock);
				this.gameManager.gameContent.idToObjectMap.set(unlockID, unlock);

				unlockID++;
				modID++;
				modValue = modValue.plus(2);
			}
		}

	
		// Populate all features with milestone tiers
		for (const feature of features) {
			feature.milestoneTiers = MILESTONE_TIERS;
			feature.setNextAffordableMilestoneLevel();
		}
	}
	

	buildSkillTree() {
		const baseSkill = this.gameManager.gameContent.skillTree.skills.find(s => s.id === 4001);
		const baseSkillNode = new SkillNode(baseSkill, 100, 0);
		baseSkill.node = baseSkillNode;

		const processConnectedNodes = (skill) => {
			for (const direction in skill.connections) {
				const connectedSkillId = skill.connections[direction];
				const connectedSkill = this.gameManager.gameContent.skillTree.skills.find(s => s.id === connectedSkillId);

				if (connectedSkill && !connectedSkill.node) {
					const position = this.calculateNodePosition(skill.node, direction);
					const skillNode = new SkillNode(connectedSkill, position.x, position.y);
					connectedSkill.node = skillNode;

					processConnectedNodes(connectedSkill);
				}
			}
		};

		processConnectedNodes(baseSkill);

		this.gameManager.gameContent.skillTree.skills.forEach(skill => {
			for (const direction in skill.connections) {
				const targetSkillId = skill.connections[direction];
				const targetSkill = this.gameManager.gameContent.skillTree.skills.find(
					s => s.id === targetSkillId
				);
				if (targetSkill) {
					skill.node.connections[direction] = targetSkill.node;
					targetSkill.node.connections[this.oppositeDirection(direction)] = skill.node;
				}
			}
		});
	}

	calculateNodePosition(skillNode, direction) {
		const fixedLineLength = 90;

		let x, y;
		switch (direction) {
			case 'north':
				x = skillNode.x;
				y = skillNode.y - fixedLineLength;
				break;
			case 'south':
				x = skillNode.x;
				y = skillNode.y + fixedLineLength;
				break;
			case 'east':
				x = skillNode.x + fixedLineLength;
				y = skillNode.y;
				break;
			case 'west':
				x = skillNode.x - fixedLineLength;
				y = skillNode.y;
				break;
		}

		return { x, y };
	}

	// Helper function to get the opposite direction
	oppositeDirection(direction) {
		switch (direction) {
			case 'north': return 'south';
			case 'south': return 'north';
			case 'east': return 'west';
			case 'west': return 'east';
			default: return null;
		}
	}

	createModObjects(){
		this.createMods(this.modsWaiting);
	}

	assignModPriorities() {
		const typeValues = {
			"prodInit":1,
			"prodBase": 100,
			"production": 1000,
			"costInit":1,
			"costBase": 100,
			"cost": 1000,
		};

		const calcTypeValues = {
			"add": 100,
			"sub": 150,
			"mult": 200,
			"div": 250,
			"exp": 300,
			"log": 350,
			"tetra":400,
			"addPercent":900,
			"subPercent":900,
		};

		this.mods.forEach(mod => {
			//set priority unless manually assigned
			if (!mod.priority) {
				mod.priority = typeValues[mod.type] + calcTypeValues[mod.runningCalcType];
			}
		});
	}

	assignModReferences() {
		this.mods.forEach(mod => {
			if (mod.sourceID) {
				mod.source = this.findObjectById(mod.sourceID);
			}

			if (mod.targetID) {
				mod.target = this.findObjectById(mod.targetID);
			}
		});
	}

	registerModsToSources() {
		this.mods.forEach(mod => {
			this.registerModObserver(mod.source, mod);
			
			if (mod.specialActivator){
				this.registerModObserver(mod.specialActivator, mod);
			}
		});
	}

	//register mod observers and push to calculation trees
	registerModObserversAndTrees() {
		let typeMods = [];

		this.mods.forEach(mod => {
		   if (mod.targetType) {
				typeMods.push(mod);
			}

			else if (mod.target) {
				this.addModToObjectCalcTree(mod.target, mod);
			}
		 
			else {
				console.error("mod",mod.name ,"is not initialized properly - missing: target type or target ID");
			}
		});

		this.typeModHandler(typeMods);
	}

	typeModHandler(typeMods) {
		typeMods.forEach(typeMod => {
			let featureLoop = null;

			//grab array of relevant targeted features
			if (typeMod.targetType === "forceTrain") {
				featureLoop = this.trainings.filter(training => training.realmID === 10);
			}
			else if (typeMod.targetType === "wisdomTrain") {
				featureLoop = this.generators.filter(generator => generator.parentGenChain.realmID === 20);
			}
			if (typeMod.targetType === "energyTrain") {
				featureLoop = this.trainings.filter(training => training.realmID === 30);
			}
			else if (typeMod.targetType === "divineTrain") {
				featureLoop = this.generators.filter(generator => generator.parentGenChain.realmID === 40);
			}
			else if (typeMod.targetType === "zones") {
				featureLoop = this.zones;
			}
			else if (typeMod.targetType === "allTrain") {
				featureLoop = this.trainings.concat(this.generators);
			}

			//add type mod to relevant feature
			for (const feature of featureLoop) {
				//make sure typemod does not apply to itself (upgrade that buffs upgrades)
				if (typeMod.source !== feature) {
					this.addModToObjectCalcTree(feature, typeMod);
				}
			}
		});
	}

	addModToObjectCalcTree(targetObject,mod) {
		let tree = null;

		switch (mod.type) {
			case 'costInit':
			case 'costBase':
			case 'cost':
				if (targetObject.calcTreesMap.get("cost")) {
					targetObject.calcTreesMap.get("cost").addNode(mod);
					mod.calcTreeReferences.push(targetObject.calcTreesMap.get("cost"));
				}
				else {
					tree = new CalculationTree(targetObject, "cost");
					targetObject.calcTreesMap.set("cost", tree);
					tree.addNode(mod);
					mod.calcTreeReferences.push(targetObject.calcTreesMap.get("cost"));
					this.calcTrees.push(tree);
				}
				break;
			case 'prodInit':
			case 'prodBase':
			case 'production':
				if (targetObject.calcTreesMap.get("production")) {
					targetObject.calcTreesMap.get("production").addNode(mod);
					mod.calcTreeReferences.push(targetObject.calcTreesMap.get("production"));
				}
				else {
					tree = new CalculationTree(targetObject, "production");
					targetObject.calcTreesMap.set("production", tree);
					tree.addNode(mod);
					mod.calcTreeReferences.push(targetObject.calcTreesMap.get("production"));
					this.calcTrees.push(tree);
				}
				break;

			default:
				console.error(targetObject, mod, "addModtocalctree error");
		}
	}

	initCalcTrees() {
		this.calcTrees.forEach(tree => {
			tree.buildTree();
		});
	}

	registerModObserver(sourceObject, mod) {
		if (sourceObject) {
			sourceObject.registerObserver(mod);
		}
	}

	pushTrainingsToRealms() {
		this.trainings.forEach(training => {
			const realm = this.realms.find(realm => realm.id === training.realmID);
			if (realm) {
				realm.trainings.push(training);
				training.realm = realm; // Assign the realm reference to the training's realm value
			} else {
				console.error(`No realm found with id ${training.realmID} for training ${training.name}`);
			}
		});
	}

	pushUpgradesToRealms() {
		this.upgrades.forEach(upgrade => {
			const realm = this.realms.find(realm => realm.id === upgrade.realmID);
			if (realm) {
				realm.upgrades.push(upgrade);
				upgrade.realm = realm; // Assign the realm reference to the training's realm value
			} else {
				console.error(`No realm found with id ${upgrade.realmID} for training ${upgrade.name}`);
			}
		});
	}

	assignUnlockReferences() {
		this.unlocks.forEach(unlock => {
			if (Array.isArray(unlock.targetID)) {
				unlock.target = unlock.targetID.map(id => this.findObjectById(id));
			} else if (unlock.targetID) {
				unlock.target = this.findObjectById(unlock.targetID);
			}
	
			if (Array.isArray(unlock.dependentID)) {
				unlock.dependent = unlock.dependentID.map(id => this.findObjectById(id));
			} else if (unlock.dependentID) {
				unlock.dependent = this.findObjectById(unlock.dependentID);
			}
		});
	}
	

	// assignUnlockReferences() {
	// 	this.unlocks.forEach(unlock => {
	// 		if (unlock.targetID) {
	// 			unlock.target = this.findObjectById(unlock.targetID);
	// 		}

	// 		if (unlock.dependentID) {
	// 			unlock.dependent = this.findObjectById(unlock.dependentID);
	// 		}
	// 	});
	// }
	
	createMods(modData) {
		modData.forEach(data => {
			const { id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active, specialActivatorID = null } = data;
			const mod = new Mod(this.eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active, specialActivatorID);
			this.mods.push(mod);
			this.gameManager.gameContent.mods.push(mod);
			this.gameManager.gameContent.idToObjectMap.set(id, mod);
			if (mod.specialActivatorID){
				mod.specialActivator = this.gameManager.findObjectById(specialActivatorID);
			}
		});
	}

	findObjectById(id) {
		let object = this.gameManager.gameContent.idToObjectMap.get(id);
	   
		return object;
	}

	printTrainingInfo() {
		console.error("::::::::::::::::::::::::::");
		console.error(":::::   TRAININGS   :::::");
		console.error("::::::::::::::::::::::::::");
		this.trainings.forEach(training => {
			console.error(`Training ${training.id} - ${training.name}`);
			console.error(" Observers:");
			training.observers.forEach((observer, index) => {
				console.error(`  Observer ${index + 1}: ${observer.id} ${observer.name}`);
			});
			console.error(" Calc Trees:");
			training.calcTreesMap.forEach((calcTree, key) => {
				console.error(`  Calculation tree: ${key}`);
				calcTree.nodes.forEach((node, index) => {
					console.error(`   Node ${index + 1}: ${node.ref.id} ${node.ref.name} value: ${node.ref.value} srcCalc: ${node.ref.sourceCalcType} runCalc: ${node.ref.runningCalcType} previousNode: ${node.previousNode ? node.previousNode.ref.name : null} nextNode: ${node.nextNode ? node.nextNode.ref.name : null} active:${node.ref.active}`);

				});
			});
		});
	}

	printUpgradeInfo() {
		console.error("::::::::::::::::::::::::::");
		console.error("::::::   UPGRADES   ::::::");
		console.error("::::::::::::::::::::::::::");
		this.upgrades.forEach(upgrade => {
			console.error(`Upgrade ${upgrade.id} - ${upgrade.name}`);
			console.error(" Observers:");
			upgrade.observers.forEach((observer, index) => {
				console.error(`  Observer ${index + 1}: ${observer.id} ${observer.name}`);
			});
			console.error(" Calc Trees:");
			upgrade.calcTreesMap.forEach((calcTree, key) => {
				console.error(`  Calculation tree: ${key}`);
				calcTree.nodes.forEach((node, index) => {
					console.error(`   Node ${index + 1}: ${node.ref.id} ${node.ref.name} value: ${node.ref.value} srcCalc: ${node.ref.sourceCalcType} runCalc: ${node.ref.runningCalcType} previousNode: ${node.previousNode ? node.previousNode.ref.name : null} nextNode: ${node.nextNode ? node.nextNode.ref.name : null}`);

				});
			});
		});
	}

	printZoneInfo() {
		console.error("::::::::::::::::::::::::::");
		console.error("::::::   ZONES   ::::::");
		console.error("::::::::::::::::::::::::::");
		this.zones.forEach(zone => {
			console.error(`Zone ${zone.id} - ${zone.name}`);
			console.error(" Observers:");
			zone.observers.forEach((observer, index) => {
				console.error(`  Observer ${index + 1}: ${observer.id} ${observer.name}`);
			});
			console.error(" Calc Trees:");
			zone.calcTreesMap.forEach((calcTree, key) => {
				console.error(`  Calculation tree: ${key}`);
				calcTree.nodes.forEach((node, index) => {
					console.error(`   Node ${index + 1}: ${node.ref.id} ${node.ref.name} value: ${node.ref.value} srcCalc: ${node.ref.sourceCalcType} runCalc: ${node.ref.runningCalcType} previousNode: ${node.previousNode ? node.previousNode.ref.name : null} nextNode: ${node.nextNode ? node.nextNode.ref.name : null}`);
				});
			});
		});
	}

	printUnlockInfo() {
		this.unlocksDiv = document.getElementById("unlocksList");
		this.unlocksDiv.innerHTML = `LIST OF UNLOCKS:<br>`;
		for (const unlock of this.gameManager.gameContent.unlocks) {
			this.unlocksDiv.innerHTML += `${unlock.dependent.name} unlocks ${unlock.target.name} via ${unlock.conditionType} ${unlock.conditionValue}<br>`;
		}
	}

	printWorldRegionZoneHeirarchy(){
		let str = "";
		let worldNum = 1;
		let zoneNames = [];
		for (const world of this.worlds){
			let regionNum = 1;
			str += `World ${worldNum}: ${world.name} \n`;
			for (const region of world.regions){
				let zoneNum = 1;
				str += `   Region ${regionNum}: ${region.name} \n`;
				for (const zone of region.zones){
					zoneNames.push(zone.name);
					if (zone.zoneType === "sideBoss"){
						str += `     Zone ${zoneNum}: Side Boss: ${zone.name} \n`;
					}
					else if (zone.zoneType === "boss"){
						str += `     Zone ${zoneNum}: Regional Boss: ${zone.name} \n`;
					}
					else {
						str += `     Zone ${zoneNum}: ${zone.name} \n`;
					}

					zoneNum++;
				}
				regionNum++;
			}
			str += '\n';
			worldNum++;
		}
		console.error(str);
		
		let duplicates = zoneNames.filter((value, index, self) => {
			return self.indexOf(value) !== index;
		});

		console.log("Duplicates:",duplicates); 
	}
}

class GameUI {
	constructor(eventManager, gameManager, gameStateManager, rewardManager) {
		this.isUiPopulated = false;

		this.eventManager = eventManager;
		this.gameManager = gameManager;
		this.gameStateManager = gameStateManager;
		this.rewardManager = rewardManager;
		window.gameUI = this;

		this.elements = [];

		this.setupElements();
		
		this.setupEventListeners();
		
		this.updateUI();
		
		this.setupTabs();
		// Set start tab
		this.changeTab('training');
		
		this.zoneUpdates = new Map(); // Store the progress updates here
        this.renderIntervalId = setInterval(() => this.renderZoneUpdates(), 10); // Adjust interval as necessary
		this.zoneButtons = {};
	}

	updateUI() {
		if (!this.isUiPopulated){	
			this.populateStatsRow();
			this.populateTrainingTab();
			this.populateForgeUpgradesTab();
			this.populateSkillsTab();
			this.populateEssenceTab();
			this.populateAchievementsTab();
			this.populateExplorationTab();
			this.populateSettingsTab();
			this.populateRadianceTab();
			this.populateTabInfo();
			this.isUiPopulated = true;
		}
		else {
			switch (this.currentTab) {
				case "training":
					this.populateTrainingTab();
					break;
				case "forge":
					this.populateForgeUpgradesTab();
					break;
				case "skills":
					this.populateSkillsTab();
					break;
				case "essence":
					this.populateEssenceTab();
					break;
				case "achievements":
					this.populateAchievementsTab();
					break;
				case "exploration":
					this.populateExplorationTab();
					break;
				case "settings":
					this.populateSettingsTab();
					break;
				case "radiance":
					this.populateRadianceTab();
					break;
				default:
					console.warn(`Unknown tab: ${this.activeTab}`);
			}
		
			this.populateStatsRow();
			this.updateTabs();
		}
	}

	setupElements() {
		this.rootElement = document.getElementById("root");
	
		this.buildUiSkeleton();
	
		this.multiplierString = multSettings.value;
		this.gameManager.multiplierString = this.multSettings.value;
		this.multiplierValues = ["1", "5", "10", "100", "nextMilestone", "max"];
		this.multiplierIndex = 0;
		this.multSettings = document.getElementById("multSettings");

		// this.boostButton.addEventListener('click', this.rewardManager.processBoost.bind(this));

		this.currentButton = document.getElementById(this.currentTab + 'Tab'); // Set default button
	}

	getActiveTabs() {
		let activeTabs = [];
	  
		// Iterate over the tab objects to check if the tab is active
		for (const tab of this.tabs) {
		  	if (tab.active && !tab.parentTab) {
				activeTabs.push(tab);
		  	}
		}
		return activeTabs;
	}

	setupTabs() {
		this.initTabData();

		this.assignButtonsToTabObjects();
		
		this.currentTab = 'training'; //set default tab
		this.currentSubTab = 'force';
		this.currentTabHotkeys = null;

		this.isExplorationTabPopulated = false;
		this.populateStateChangeButtons();
		this.updateMultiplier();
		this.createTabEventListeners();
	
		this.tabIDs = ['training','forge','skills','exploration','essence','achievements','radiance','settings'];
	}

	initTabData() {
		this.tabs = [];
		tabData.forEach(data => {
			const { id, name, visible, active, initialUnlockedFeatureIDs, subTabs = [] } = data;
			const newTab = new Tab(this.eventManager, id, name, visible, active, initialUnlockedFeatureIDs);
			
			// set initial feature references
			if (newTab.initialUnlockedFeatureIDs) {
				for (const id of newTab.initialUnlockedFeatureIDs){
					newTab.initialUnlockedFeatureRefs.push(this.gameManager.findObjectById(id));
				}
			}
			
			// create sub tabs if they exist
			subTabs.forEach(subTabData => {
				const { id, name, visible, active, initialUnlockedFeatureIDs } = subTabData;
				const newSubTab = new Tab(this.eventManager, id, name, visible, active, initialUnlockedFeatureIDs, null, newTab);
	
				// set initial feature references for subTab
				if (newSubTab.initialUnlockedFeatureIDs) {
					for (const id of newSubTab.initialUnlockedFeatureIDs) {
						newSubTab.initialUnlockedFeatureRefs.push(this.gameManager.findObjectById(id));
					}
				}
	
				// Add sub tab to id to object map and parent tab's subTab list
				this.gameManager.gameContent.idToObjectMap.set(id, newSubTab);
				newTab.subTabs.push(newSubTab);
				if (newTab.subTabs.length === 1){
					newTab.currentSubTab = newSubTab.name;
				}
				this.tabs.push(newSubTab);
				this.gameManager.gameContent.tabs.push(newSubTab);
			});
	
			// Add the tab to tabs list and id to object map
			this.tabs.push(newTab);
			this.gameManager.gameContent.tabs.push(newTab);
			this.gameManager.gameContent.idToObjectMap.set(id, newTab);
		});
	}
	
	assignButtonsToTabObjects(){
		let primaryTabButtons = Array.from(document.getElementsByClassName('tabButton'));

		let explorationSubTabButtons = Array.from(document.getElementsByClassName('exploration-tab-button'));
		let realmSubTabButtons = Array.from(document.getElementsByClassName('realm-button'));
		let allTabButtons = primaryTabButtons.concat(explorationSubTabButtons).concat(realmSubTabButtons);

		for (const tabButton of allTabButtons) {
			let tabButtonIdWithoutTab = tabButton.id.replace('Tab', '').replace('realm-','').replace('Sub','').toLowerCase();

			for (const tab of this.tabs){
				if (tab.name === tabButtonIdWithoutTab) {
					tab.button = tabButton;
					break;  // Breaks the inner loop if the matching button is found
				}
			}
		}
	}

	updateTabs(){
		for (const tab of this.tabs){
			this.updateVisibility(tab.button, tab.active);
		}
	}

	setupEventListeners() {
		this.numberSettings.addEventListener('change', this.updateNumberNotation.bind(this));
	
		this.multSettings = document.getElementById("multSettings");
		this.multSettings.addEventListener('click', this.updateMultiplierIndex.bind(this));

		this.eventManager.addListener('startFight', (fighterID) => {
			this.startFight(fighterID);
		});

		
		this.eventManager.addListener('zoneConquestProgress', this.handleZoneConquestProgress.bind(this));
        this.eventManager.addListener('zoneConquestComplete', this.handleZoneConquestComplete.bind(this));
        this.eventManager.addListener('zoneConquestStopped', this.handleZoneConquestStopped.bind(this));
	}
	
	buildUiSkeleton() {
		interfaceElementData.forEach(element => {
			if (!this[element.variableName]) {
				let newElement = document.createElement(element.tag);
	
				if (element.tag === "select") {
					element.options.forEach(optionValue => {
						let option = document.createElement('option');
						option.value = optionValue;
						option.text = optionValue;
						newElement.appendChild(option);
					});
				}
	
				newElement.id = element.id;
	
				// Assigning button text as id
				if (element.tag === "button") {
					let name = element.id;
					if (name.includes("SubTab")){
						name = name.replace("SubTab", "");
					}
					else if (name.includes("Tab")){
						name = name.replace("Tab", "");
					}

					// Making the first letter uppercase
					name = name.charAt(0).toUpperCase() + name.slice(1);

					newElement.textContent = name;
				}

				if (element.className) {
					newElement.className = element.className;
				}
	
				let parentElement = document.getElementById(element.parent);
				parentElement.appendChild(newElement);
	
				this[element.variableName] = newElement;
			}
		});
	}
	
	createTabEventListeners() {
		const tabButtons = document.getElementById('tab-buttons').getElementsByTagName('button');
	
		// Loop through each button and add a click event listener
		for (let button of tabButtons) {
			button.addEventListener('click', () => {
				// The button's id should correspond to the tab's id
				const tabId = button.id.slice(0, -3);
				this.changeTab(tabId);
			});
		}
	}
	
	changeTab(tabName) {
		// Hide the current tab
		let currentTabElement = document.getElementById(this.currentTab);
		if (currentTabElement) {
			currentTabElement.style.display = "none";
		}
	
		//set new current tab
		if (tabName) {
			this.currentTab = tabName;
		}

		// manual clicking rather than hotkeys caused issue with assigning subtabs
		// but nwo this breaks subtabs being remembered for hotkeys...
		let tabObject = this.tabs.find(tab => tab.name === tabName);
		
		if (!tabObject.subTabs.length > 0){
			this.currentSubTab = null;
		}
		else {
			this.currentSubTab = tabObject.currentSubTab;
		}

		// Show the new tab
		const newTabElement = document.getElementById(tabName);
		if (newTabElement) {
			newTabElement.style.display = "flex";
		}
	
		if (this.currentButton) {
			this.currentButton.classList.remove('active-tab');
		}
	
		this.currentButton = document.getElementById(this.currentTab + 'Tab');
		if (this.currentButton) {
			this.currentButton.classList.add('active-tab');
		}

		this.eventManager.dispatchEvent('updateHotkeyButtons');
	}

	returnHotkeyNumberButtons(tabID){
		let currentTabElement = document.getElementById(tabID);

		let thisTab = this.tabs.find(tab => tab.name === this.currentTab);
		let allButtons = Array.from(currentTabElement.querySelectorAll('button'));
	
		let filteredButtons = allButtons.filter(button => {
			return !(button.id.includes('realm') || button.id.includes('tab') || button.id.includes('refund') || button.id.includes('Tab')) 
				&& getComputedStyle(button).opacity !== '0';
		});
	
		return filteredButtons;
	}
	  
	returnSubTabButtons(){
		let currentTabElement = document.getElementById(this.currentTab);
		let allButtons = Array.from(currentTabElement.querySelectorAll('button'));
	
		let filteredButtons = allButtons.filter(button => {
			return (button.id.includes('SubTab')) 
				&& getComputedStyle(button).opacity !== '0';
		});
	
		if (filteredButtons.length === 0){
			this.currentSubTab = null;
		}
	
		return filteredButtons;
	}

	isAffordable(feature) {
		let currentResource = this.gameManager.queryPlayerValue(feature.costType);

		if (feature.featureType === "zone") {
			if (currentResource.gte(feature.costBase)) {
				return true;
			}
			return false;
		}
		if (currentResource.gte(feature.costNext)) {
			return true;
		}
		return false;
	}

	updateNumberNotation() {
		this.numberNotation = this.numberSettings.value;
	}

	updateMultiplierIndex() {
		this.multiplierIndex = (this.multiplierIndex + 1) % this.multiplierValues.length;
		this.updateMultiplier();
	}

	updateMultiplier() {
		let newValue = this.multiplierValues[this.multiplierIndex];
	
		if (["1", "5", "10", "100"].includes(newValue)) {
			this.multSettings.textContent = `x${newValue}`;
		} else {
			this.multSettings.textContent = newValue;
		}
		
		this.multiplierString = newValue;
		this.gameManager.onMultiplierChange(newValue);
	}
	
	async populateStatsRow() {
		const statList = ['force', 'wisdom', 'energy', 'divine', 'crystal', 'essence', 'radiance', 'powerLevel'];
	
		// Create and add the elements only once
		if (!this.statsRow.querySelector('.force-stat')) {
			let column = null;
	
			for(let i = 0; i < statList.length; i++){
				// Check for 'powerLevel' or new column every 2 items
				if(statList[i] === 'powerLevel' || i % 2 === 0){
					column = this.createElement('div',null,'stats-column');
					this.statsRow.appendChild(column);
				}

				const statDiv = document.createElement('div');
				statDiv.className = statList[i] === 'powerLevel' ? statList[i] : `${statList[i]}-stat ${statList[i]}-color`;
				statDiv.classList.add(`stats-container`);

				const statNameDiv = this.createElement('div',null,'stat-name',`${statList[i].charAt(0).toUpperCase() + statList[i].slice(1)}`);

				const statValueDiv = this.createElement('div',null,'stat-value');
				statDiv.appendChild(statNameDiv);
				statDiv.appendChild(statValueDiv);
				
				column.appendChild(statDiv);
			}
		}
	
		// Update Stats elements
		statList.forEach(stat => {
			let statDiv = this.statsRow.querySelector(`.${stat}-stat`) || this.statsRow.querySelector(`.${stat}`);
			if (statDiv) {
				if (stat === 'powerLevel') {
					this.updateElementTextContent(statDiv,`Power Level: ${this.formatNumber(this.gameManager.gameContent.player.powerLevel)}`);
				} else {
					let statValueDiv = this.statsRow.querySelector(`.${stat}-stat .stat-value`) || this.statsRow.querySelector(`.${stat} .stat-value`);
					if (statValueDiv) {
						this.updateElementTextContent(statValueDiv,`${this.formatNumber(this.gameManager.gameContent.player[stat])}`);
					}
				}
				// Update the opacity of the statDiv based on the stat value
				statDiv.style.opacity = this.gameManager.gameContent.player[stat] == 0 ? 0 : 1;
			}
		});
	}
	
	populateStateChangeButtons() {
		// Get the save and load divs
		const saveButton = document.getElementById('save');
		const loadButton = document.getElementById('load');
		const resetButton = document.getElementById('reset');
		const completeUnlocksButton = document.getElementById('complete-unlocks');
		// const exportButton = document.getElementById('export');
		const rebirth1Button = document.getElementById('rebirth1');
		const rebirth2Button = document.getElementById('rebirth2');
		const rebirth3Button = document.getElementById('rebirth3');
		saveButton.disabled = false;
		loadButton.disabled = false;
		resetButton.disabled = false;
		// exportButton.disabled = false;
		rebirth1Button.disabled = false;
		rebirth2Button.disabled = true;
		rebirth3Button.disabled = true;

		this.saveButtonHandler = () => {
			this.gameStateManager.saveGameState(0);
			saveButton.innerHTML = "Game Saved!";
			saveButton.classList.add('fade');
			setTimeout(function () {
				saveButton.classList.remove('fade');
				saveButton.innerHTML = "Save";
			}, 1000); // Set timeout to 2 seconds (2000 milliseconds)
		};

		this.loadButtonHandler = () => {
			this.eventManager.dispatchEvent('restart', 0);
			loadButton.innerHTML = "Game Loaded!";
			loadButton.classList.add('fade');
			setTimeout(function () {
				loadButton.classList.remove('fade');
				loadButton.innerHTML = "Load";
			}, 1000); // Set timeout to 2 seconds (2000 milliseconds)
		};

		this.resetButtonHandler = () => {
			this.eventManager.dispatchEvent('restart', -1);
			
			resetButton.innerHTML = "Game Reset!";
			resetButton.classList.add('fade');
			setTimeout(function () {
				resetButton.classList.remove('fade');
				resetButton.innerHTML = "Reset";
			}, 1000); // Set timeout to 2 seconds (2000 milliseconds)
		};

		this.completeUnlocksButtonHandler = () => {
			this.eventManager.dispatchEvent('complete-all-unlocks');
		};

		this.rebirth1ButtonHandler = () => {
			this.gameStateManager.saveGameState(1);
			rebirth1Button.innerHTML = "Rebirth1!";
			rebirth1Button.classList.add('fade');
			setTimeout(function () {
				rebirth1Button.classList.remove('fade');
				rebirth1Button.innerHTML = "Rebirth 1";
			}, 1000); // Set timeout to 2 seconds (2000 milliseconds)
		};

		this.rebirth2ButtonHandler = () => {
			this.gameStateManager.saveGameState(2);
			rebirth2Button.innerHTML = "Rebirth2!";
			rebirth2Button.classList.add('fade');
			setTimeout(function () {
				rebirth2Button.classList.remove('fade');
				rebirth2Button.innerHTML = "Rebirth 2";
			}, 1000); // Set timeout to 2 seconds (2000 milliseconds)
		};

		this.rebirth3ButtonHandler = () => {
			this.gameStateManager.saveGameState(3);
			rebirth3Button.innerHTML = "Rebirth3!";
			rebirth3Button.classList.add('fade');
			setTimeout(function () {
				rebirth3Button.classList.remove('fade');
				rebirth3Button.innerHTML = "Rebirth 3";
			}, 1000); // Set timeout to 2 seconds (2000 milliseconds)
		};

		saveButton.addEventListener('click', this.saveButtonHandler);
		loadButton.addEventListener('click', this.loadButtonHandler);
		resetButton.addEventListener('click', this.resetButtonHandler);
		completeUnlocksButton.addEventListener('click', this.completeUnlocksButtonHandler);
		rebirth1Button.addEventListener('click', this.rebirth1ButtonHandler);
		rebirth2Button.addEventListener('click', this.rebirth2ButtonHandler);
		rebirth3Button.addEventListener('click', this.rebirth3ButtonHandler);
	}

	populateExplorationTab() {
		this.populateExplorationTabSubTabButtons();

		this.populateOdysseySubTab();
		this.populateTournamentSubTab();
		this.populateArtifactsSubTab();
	}
	
	populateExplorationTabSubTabButtons(){
		if (!this.isExplorationTabPopulated) {
			let targetParent = document.getElementById('exploration');
			const tabButtonsContainer = document.getElementById(`exploration-tab-buttons`);
			let subTabButtons = Array.from(tabButtonsContainer.children);
			let subTabNames = subTabButtons.map(button => button.id.replace('SubTab', '').toLowerCase());


			subTabButtons.forEach((button, index) => {
				button.addEventListener('click', () => this.changeExplorationSubTab(button.id, subTabNames[index]));
			

				let tabContent = document.getElementById(`tab-content-${button.id}`);
				let col1, col2;

				if (!tabContent) {
					tabContent = this.createElement('div',`tab-content-${button.id}`);
					tabContent.style.display = (index === 0 ? 'flex' : 'none'); // Only display the first tab by default

					col1 = this.createElement('div',`tab-col1-${button.id}`,'content-tab-col');

					col2 = this.createElement('div',`tab-col2-${button.id}`,'content-tab-col');

					tabContent.appendChild(col1);
					tabContent.appendChild(col2);

					targetParent.appendChild(tabContent);
				} else {
					col1 = document.getElementById(`tab-col1-${button.id}`);
					col2 = document.getElementById(`tab-col2-${button.id}`);
				}

				//universal event listener for the tournament subtab
				if (button.id === "TournamentSubTab" && !this.tournamentEventListenerAdded){
					col1.addEventListener('click', (event) => {
						let target = event.target;
						// If clicked element is not a button, find the closest button ancestor
						if (target.tagName.toLowerCase() !== 'button') target = target.closest('button');
						if (target && target.tagName.toLowerCase() === 'button') {
							let fighterId = Number(target.id.replace('fight-button-',''));
							if (fighterId && !target.disabled) {
								this.startFight(fighterId);
							}
						}
					});
					this.tournamentEventListenerAdded = true;
				}
			});

			// If it's the first tab, add 'active-tab' class
			if (subTabButtons.length > 0) {
				subTabButtons[0].classList.add('active-tab');
			}
		}
		this.isExplorationTabPopulated = true;
	}

	changeExplorationSubTab(tabId, subTabName) {
		// Get the parent container
		const tabButtonsContainer = document.getElementById(`exploration-tab-buttons`);
		let tabButtons = Array.from(tabButtonsContainer.children);

		// Remove 'active-tab' class from all tab buttons
		tabButtons.forEach(button => {
			button.classList.remove('active-tab');
		});

		// Add 'active-tab' class to the clicked button
		let targetTab = document.getElementById(tabId);
		targetTab.classList.add('active-tab');

		// Get the parent container for the tabs
		const targetParent = document.getElementById('exploration');

		// Hide all tab contents
		let tabContents = Array.from(targetParent.children);
		tabContents.forEach(content => {
			if (content.id.includes('tab-content')) {
				content.style.display = 'none';
			}
		});

		let thisTab = this.tabs.find(tab => tab.name === this.currentTab);
		thisTab.currentSubTab = subTabName;
		
		// this.currentSubTab = `tab-content-${tabId}`;
		
		this.currentSubTab = subTabName;
		this.eventManager.dispatchEvent('updateHotkeyButtons');

		// Show the content of the clicked tab
		document.getElementById(`tab-content-${tabId}`).style.display = 'flex';
	}

	changeOdysseySubTab(worldId) {
		// Get the parent container
		const tabButtonsContainer = document.getElementById(`Odyssey-tab-buttons`);
		let tabButtons = Array.from(tabButtonsContainer.children);
	
		// Remove 'active-tab' class from all tab buttons
		tabButtons.forEach(button => {
			button.classList.remove('active-tab');
		});
	
		// Add 'active-tab' class to the clicked button
		let targetTab = document.getElementById(`worldTabButton-${worldId}`);
		targetTab.classList.add('active-tab');
	
		// Get the parent container for the tab contents
		const targetParent = document.getElementById('tab-col2-OdysseySubTab');
	
		// Hide all tab contents
		let tabContents = Array.from(targetParent.children);
		tabContents.forEach(content => {
			if (content.id.includes('tab-content')) {
				content.style.display = 'none';
			}
		});
	
		// Show the content of the clicked tab
		document.getElementById(`tab-content-world-${worldId}`).style.display = 'flex';
	}
	
	
	populateOdysseySubTab() {
		let subTabContainer = document.getElementById(`tab-col1-OdysseySubTab`);
		let worldsContainer = document.getElementById(`tab-col2-OdysseySubTab`);
		const worlds = this.gameManager.gameContent.worlds;
	
		let worldsTabButtonsContainer = document.getElementById(`Odyssey-tab-buttons`);
		if (!worldsTabButtonsContainer){
			worldsTabButtonsContainer = this.createElement('div',`Odyssey-tab-buttons`);
			subTabContainer.appendChild(worldsTabButtonsContainer);
		}
	
		worlds.forEach((world, index) => {
			let worldTabButton = document.getElementById(`worldTabButton-${world.id}`);

			if (!worldTabButton){
				worldTabButton = this.createElement('button',`worldTabButton-${world.id}`,'world-tab-button',`${world.name}`);
				worldTabButton.addEventListener('click', () => this.changeOdysseySubTab(world.id));
				worldsTabButtonsContainer.appendChild(worldTabButton);

				// If it's the first tab, add 'active-tab' class
				if (worldsTabButtonsContainer.children.length > 0) {
					worldsTabButtonsContainer.children[0].classList.add('active-tab');
				}
			}
			
			this.updateVisibility(worldTabButton, world.active);
			
			let worldTabContent = document.getElementById(`tab-content-world-${world.id}`);
			if (!worldTabContent){
				worldTabContent = this.createElement('div',`tab-content-world-${world.id}`);
				worldTabContent.style.display = (index === 0 ? 'flex' : 'none'); // Only display the first tab by default
	
				worldsContainer.appendChild(worldTabContent);
			}

			this.populateWorld(worldTabContent, world);

			if (worldTabButton.classList.contains("active-tab")) {
				this.updateWorld(worldTabContent, world);
			}
		});
	}

	populateWorld(worldContainer, world) {
		let worldCell = worldContainer.querySelector(`#world-${world.id}`);
		if (!worldCell) {
			worldCell = this.createElement('div',`world-${world.id}`,'world-cell');

			const worldName = this.createElement('div',`world-name-${world.id}`,'world-name',`${world.name}`);
			worldCell.appendChild(worldName);

			const regionsContainer = this.createElement('div',null,'regions-container');
			worldCell.appendChild(regionsContainer);

			worldContainer.appendChild(worldCell);

			if (world.regions) {
				this.populateRegions(regionsContainer, world.regions);
			}
		}
	}

	updateWorld(worldContainer,world){
		if (world.regions) {
			let regionsContainer = worldContainer.querySelector(`.regions-container`);
			this.updateRegions(regionsContainer, world.regions);
		}
	}

	populateRegions(regionsContainer, regions) {
		regions.forEach(region => {
			let regionCell = regionsContainer.querySelector(`#region-${region.id}`);
			if (!regionCell) {
				
				regionCell = this.createElement('div',`region-${region.id}`,'region-cell');

				const regionName = this.createElement('div',null,'region-name',`${region.name}`);
				regionCell.appendChild(regionName);

				const zonesCol = this.createElement('div',null,'zones-col');
				regionCell.appendChild(zonesCol);

				regionsContainer.appendChild(regionCell);

				// let zonesCol = regionCell.querySelector(`.zones-col`);
				if (region.zones) {
					this.populateZones(zonesCol, region.zones);
				}
			}
		});
	}

	updateRegions(regionsContainer, regions){
		regions.forEach(region => {
			
			if (region.zones) {
				let regionCell = regionsContainer.querySelector(`#region-${region.id}`);
				
				this.updateVisibility(regionCell, region.active);
				let zonesCol = regionCell.querySelector(`.zones-col`);
				this.updateZones(zonesCol, region.zones);
			}
		});
	}

	populateZones(zonesCol, zones){
		let initialX = 400;
		let initialY = 0;
	
		zones.forEach(zone => {
			//create initial elements
			let zoneCell = zonesCol.querySelector(`#zone-${zone.id}`);
			if (!zoneCell) {
				zoneCell = this.createElement('div',`zone-${zone.id}`,'zone-cell');
				
				let topPosition = initialY;
				let leftPosition = initialX;
				// calculate the position of the zoneCell
				if (zone.parent){
					let angleInRadians = zone.angleFromParent * (Math.PI / 180);
					topPosition = zone.parent.y + zone.distanceFromParent * Math.sin(angleInRadians);
					leftPosition = zone.parent.x + zone.distanceFromParent * Math.cos(angleInRadians);
				}
	
				zoneCell.style.position = 'absolute';
				zoneCell.style.top = `${topPosition}px`;
				zoneCell.style.left = `${leftPosition}px`;
	
				zone.y = topPosition;
				zone.x = leftPosition;
	
				//Add connecting lines
				if (zone.parent) {
					// Calculate the line's width (the distance between the cells) and angle
					let dx = zone.x - zone.parent.x;
					let dy = zone.y - zone.parent.y;
					let lineLength = Math.sqrt(dx*dx + dy*dy);
					let angle = Math.atan2(dy, dx) * 180 / Math.PI - 180;
					
					// Create line div and apply the calculated width and angle
					let line = this.createElement('div',null,'zone-line');
					line.style.width = lineLength + 'px';
					line.style.transform = `rotate(${angle}deg)`;
			
					// Append the line to the zone cell
					zoneCell.appendChild(line);
				}

				
				
				let button = this.createElement('button',`conquest-button-${zone.id}`,'zone-button');
				button.setAttribute('style', 'white-space:pre;');
				button.addEventListener('click', () => {
					if (!button.disabled && !zone.isConquesting) {
						zone.startConquest();
					}
				});
				
				let zoneData = this.createElement('div',`zone-data-${zone.id}`,null,`${zone.name}`);
				button.appendChild(zoneData);

				this.populateTooltip(zone,button);

				zoneCell.appendChild(button);


				zonesCol.appendChild(zoneCell);

				zone.elements.cell = zoneCell;
				zone.elements.button = button;
				zone.elements.data = zoneData;
			}
		});
	}

	updateZones(zonesCol,zones){
		zones.forEach(zone => {
			let zoneCell = zone.elements.cell;
			let button = zone.elements.button;
			let zoneData = zone.elements.data;

			// zoneData.textContent = `${zone.name}`;

			
			this.updateTooltip(zone);

			if (zone.zoneType === "boss"){
				button.style.border = '2px solid orange';
			}
			else if (zone.zoneType === "sideBoss"){
				button.style.border = '2px solid cyan';
			}

			if (zone.isDefeated && !zone.autoToggle){
				button.style.border = '2px solid green';
			}

			if (!zone.active || !this.isAffordable(zone) || zone.isConquesting) {
				button.disabled = true;
				button.classList.remove('enabled');
			} 
			else {
				button.disabled = false;
				button.classList.add('enabled');
			}
		});
	}

	handleZoneConquestProgress(data) {
		this.zoneUpdates.set(data.zoneID, data.progress); 
	}

	handleZoneConquestComplete(data) {
        let zone = this.gameManager.findObjectById(data.zoneID);
        let button = this.getZoneButton(zone.id);
    
        button.disabled = false; 
        button.classList.add('enabled');
        
        if (zone.repeatUnlocked) {
            button.click();
        }
    }
    
    handleZoneConquestStopped(data) {
        let zone = this.gameManager.findObjectById(data.zoneID);
        let button = this.getZoneButton(zone.id);

        button.style.background = '';
        button.disabled = false;
        button.classList.remove('enabled');
    }
    
    getZoneButton(id) {
        if (!this.zoneButtons[id]) {
            this.zoneButtons[id] = document.querySelector(`#conquest-button-${id}`);
        }
        return this.zoneButtons[id];
    }

	renderZoneUpdates() {
		for (let [zoneID, progress] of this.zoneUpdates) { // Use Map's iteration syntax
			let zone = this.gameManager.findObjectById(zoneID);
			let button = this.getZoneButton(zone.id);

            if (progress === 1) {
                button.style.backgroundColor = "rgb(21, 97, 122)";
                button.style.backgroundImage = "";
            } else {
                button.style.backgroundColor = "rgb(21, 97, 122)";
                button.style.backgroundImage = `linear-gradient(to right, #90ee90 0%, #90ee90 ${progress*100}%, transparent ${progress*100}%, transparent 100%)`;
            }
        }
		this.zoneUpdates.clear();
    }
	
	populateTournamentSubTab() {
		let tournamentCol = document.getElementById(`tab-col1-TournamentSubTab`);
		let tournament = this.gameManager.gameContent.tournament;
		let fighters = tournament.fighters;
	
		let tournamentData = this.findOrCreateElement(tournamentCol, 'div', 'tournament-data', ['tournament-color']);
	
		let rankData = this.findOrCreateElement(tournamentData, 'div', 'tournament-rank');
		let headbandData = this.findOrCreateElement(tournamentData, 'div', 'tournament-headband');
	
		let headbandPseudoObject = this.gameManager.findObjectById(800);
		
		let newHeadbandText = [`Headband Data:\n`];
		for (let obs of headbandPseudoObject.observers){
			if (obs.active){
				let str = `Modifiers: ${obs.targetType} ${obs.runningCalcType} (${obs.value} ${obs.sourceCalcType} ${obs.source.level}) \n`;
				newHeadbandText.push(str);
			}
		}
	
		let newRankText = `Overall Rank: ${tournament.rank}`;
		
		this.updateElementTextContent(headbandData, newHeadbandText.join('\r'));
		this.updateElementTextContent(rankData, newRankText);
	
		fighters.forEach(fighter => {
			let fighterCell = this.findOrCreateElement(tournamentCol, 'div', `fighter-${fighter.id}`, ['fighter-cell', `color-${fighter.tier}`]);
	
			this.updateVisibility(fighterCell, fighter.visible);
	
			let button = this.findOrCreateElement(fighterCell, 'button', `fight-button-${fighter.id}`, ['fight-button']);
			let newButtonText = `${fighter.name}\r\nUnlock:${fighter.costType} ${this.formatNumber(fighter.costNext)}\r\nReward:${this.formatNumber(fighter.prodNext)} ${fighter.prodType}\r\n`
			

			button.disabled = !fighter.active || !this.isAffordable(fighter) || fighter.isFighting;
			if (fighter.isDefeated){
				button.style.background = `var(--color-${fighter.tier})`;
				button.style.color = 'white';
				button.style.border = '1px solid blue';
			} 
			else {
				button.classList.remove('enabled');
			}

			this.updateElementTextContent(button,newButtonText);
		});
	}

	startFight(id) {
		let tournament = this.gameManager.gameContent.tournament;
		let fighter = this.gameManager.findObjectById(id);
		
		let button = document.querySelector(`#fight-button-${id}`);
		fighter.isFighting = true;
		
		// let elapsedMs = 0;
		// let totalFightTimeMs = fighter.fightTime * 1000;
	
		let increment = 1 / (fighter.fightTime * 1000 / 10); // This gives you the increment size every 10 ms.
	
		let width = 0;
		let intervalId = setInterval(() => {
			width += increment;
			if (width >= 1) {
				clearInterval(intervalId);
				fighter.isFighting = false;
				tournament.handleFight(fighter.id);
				width = 0;  // cap progress at 1
			}
			button.style.background = `linear-gradient(to right, #90ee90 0%, #90ee90 ${width*100}%, #fff ${width*100}%, #fff 100%)`;
		}, 10); // Update every 10 milliseconds
	
		button.disabled = true; 
		button.classList.remove('enabled');
	}
	
	populateArtifactsSubTab() {
		let targetCol1 = document.getElementById(`tab-col1-ArtifactsSubTab`);
		let targetCol2 = document.getElementById(`tab-col2-ArtifactsSubTab`);
		let shardsMap = this.gameManager.gameContent.player.shards;
		let artifacts = this.gameManager.gameContent.artifacts;
	
		targetCol1.classList.add('artifacts-color');
		targetCol2.classList.add('artifacts-color');
	
		if (!this.artifactSubTabPopulated){
			this.initialArtifactsSubTabPopulation(shardsMap, artifacts, targetCol1, targetCol2);
		}
		
		this.updateArtifactsSubTab(shardsMap, targetCol1, artifacts, targetCol2);
	}

	updateArtifactsSubTab(shardsMap, targetCol1, artifacts, targetCol2) {
		if (this.artifactEvolving){
			return;
		}
		// Update shard column
		shardsMap.forEach((amount, shardType) => {
			const shardId = `shard-${shardType}`;
			let shardCell = targetCol1.querySelector(`#${shardId}`);
			const shardName = shardCell.querySelector('.shard-name');
			shardName.textContent = `${shardType}: ${this.formatNumber(new Decimal(amount))}`;
			shardCell.style.opacity = amount == 0 ? 0 : 1;
		});
		
		// Update Artifact Column
		for (const artifact of artifacts) {
			let artifactId = `artifact-${artifact.id}`;
			let artifactCell = targetCol2.querySelector(`#${artifactId}`);

			// If an artifact cell exists for an evolved artifact, trigger evolution replacement
			if (artifactCell && artifact.evolved) {
				let newEvolvedArtifact = artifact.nextEvolveRef;
				let newArtifactCell = this.populateNewEvolvedArtifact(newEvolvedArtifact, artifactCell, targetCol2);
				this.updateFeatureCell(newEvolvedArtifact, newArtifactCell);
				this.updateAutobuyCheckbox(newEvolvedArtifact, newArtifactCell);
			}

			if (artifact.active) {
				this.updateFeatureCell(artifact, artifactCell);
				this.updateAutobuyCheckbox(artifact, artifactCell);
			}
		}
	}

	populateNewEvolvedArtifact(newArtifact, artifactCell, container) {
		this.artifactEvolving = true;
		let position = Array.prototype.indexOf.call(container.children, artifactCell);

		let zIndex = artifactCell.style.zIndex;

		let artifactId = `artifact-${newArtifact.id}`;
		let newArtifactCell = this.populateFeatureCell(newArtifact, container, artifactId, zIndex);

		this.populateAutobuyCheckbox(newArtifact, newArtifactCell, null);

		this.printArtifactEvolutionMessage(newArtifactCell);

		// Insert the new artifact cell at the position of the old one
		container.insertBefore(newArtifactCell, container.children[position]);

		if (newArtifact.autoUnlocked){
			newArtifact.autoToggle = true;
			this.gameManager.artifactAutobuys.push(newArtifact);
		}

		// Remove the old artifact cell
		artifactCell.remove();
		this.artifactEvolving = false;
		return newArtifactCell;
	}

	initialArtifactsSubTabPopulation(shardsMap, artifacts, targetCol1,  targetCol2) {
		shardsMap.forEach((amount, shardType) => {
			const shardId = `shard-${shardType}`;
			let shardCell = targetCol1.querySelector(`#${shardId}`);

			if (!shardCell) {
				shardCell = this.createElement('div', shardId, 'shard-cell');

				const shardName = this.createElement('div', null, 'shard-name');
				shardCell.appendChild(shardName);

				targetCol1.appendChild(shardCell);
			}
		});

		// z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
		let zIndexCounter = 1000;

		// populate initial base item artifact cells and hide inactive ones
		for (const artifact of artifacts) {
			let currArtifactEvo = artifact;
			let artifactId = `artifact-${currArtifactEvo.id}`;
			let artifactCell = targetCol2.querySelector(`#${artifactId}`);

			if (!currArtifactEvo.previousEvolution && !artifactCell) {
				artifactCell = this.populateFeatureCell(currArtifactEvo, targetCol2, artifactId, zIndexCounter);
				zIndexCounter--;
				this.populateAutobuyCheckbox(currArtifactEvo, artifactCell, null);
				this.updateVisibility(artifactCell,currArtifactEvo.visible);
			}
		}
		
		this.artifactSubTabPopulated = true;
	}

	printArtifactEvolutionMessage(artifactCell) {
		const evolvedMessage = this.createElement('div',null,'fadeout');
		evolvedMessage.textContent = 'Artifact evolved!';
		artifactCell.appendChild(evolvedMessage);
	  
		// Remove the message after 2 seconds and apply fadeout class.
		setTimeout(() => {
		//   evolvedMessage.classList.add('fadeout');
		  evolvedMessage.remove();
		}, 2000);
	}

	populateTrainingTab() {
		let targetParent = document.getElementById('training');
		// let realmButtonsContainer = document.getElementById('training-realm-buttons');

		this.gameManager.gameContent.realms.forEach((realm, index) => {
			const realmId = `${realm.name}SubTab`;
			let realmButton = document.getElementById(realmId);
			let realmContent = document.getElementById(`realm-content-${realm.name}`);
			let col1, col2;

			if (!realmContent) {
				realmButton.addEventListener('click', () => this.changeRealmSubTab(realmId,realm.name));
				// If it's the first realm, add 'active-tab' class
				if (index === 0) {
					realmButton.classList.add('active-tab');
				}

				realmContent = this.createElement('div',`realm-content-${realm.name}`,`realm-content`);
				realmContent.style.display = (index === 0 ? 'flex' : 'none'); // Only display the first realm by default

				col1 = this.createElement('div',`${realm.type}-col1-${realm.name}`,'content-tab-col');
				col2 = this.createElement('div',`${realm.type}-col2-${realm.name}`,'content-tab-col');

				realmContent.appendChild(col1);
				realmContent.appendChild(col2);

				targetParent.appendChild(realmContent);
			} else {
				col1 = document.getElementById(`${realm.type}-col1-${realm.name}`);
				col2 = document.getElementById(`${realm.type}-col2-${realm.name}`);
			}

			this.populateRealm(col1,col2,realm);
		});
	}

	populateAutobuyCheckbox(feature, container, heap){
		let checkbox = container.querySelector(`#checkbox-${feature.id}`);
		let label = container.querySelector(`#label-${feature.id}`);
		if (!checkbox) {
			checkbox = this.createElement('input',`checkbox-${feature.id}`);
			checkbox.type = 'checkbox';
			checkbox.style.display = 'none';

			
			checkbox.addEventListener('change', () => {
				feature.autoToggle = checkbox.checked;
				if (feature.featureType === "artifact"){
					if (checkbox.checked) {
						this.gameManager.artifactAutobuys.push(feature);
					} 
					else {
						this.gameManager.artifactAutobuys = this.gameManager.artifactAutobuys.filter(item => item !== feature);
					}
				}
				else {
					if (checkbox.checked) {
						heap.add(feature);
						feature.currentAutoHeap = heap;
					} else {
						heap.remove(feature);
						feature.currentAutoHeap = null;
					}
				}
			});
			label = this.createElement('label',`label-${feature.id}`,null,"Auto");
			label.htmlFor = checkbox.id;
			label.style.fontSize = 'small';

			container.appendChild(checkbox);
			container.appendChild(label);
		}
	}

	updateAutobuyCheckbox(feature, container) {
		// Update checkbox visibility based on feature.autoUnlocked
		let checkbox = container.querySelector(`#checkbox-${feature.id}`);
		let label = container.querySelector(`#label-${feature.id}`);
	
		if (feature.autoUnlocked) {
			//changed to opacity vs display so the UI space is already taken and doesnt shift elements on enable
			label.style.opacity = 1;
			label.style.pointerEvents = 'auto';
		} else {
			label.style.opacity = 0;
			label.style.pointerEvents = 'none';
		}
		
		// Update checkbox checked state based on feature.autoToggle
		if (feature.maxLevel.eq(feature.level)){
			checkbox.checked = false;
			checkbox.disabled = true;
		}
		else {
			checkbox.checked = feature.autoToggle;
			checkbox.disabled = !feature.active; 
		}
	}

	populateTooltip(feature, element){
		const tooltip = this.createElement('span',`tooltip-${feature.id}`,'tooltip-text',"Tooltip content here");
		element.appendChild(tooltip);
	}

	updateTooltip(feature){
		let tooltipText = [`${feature.description}`, '------'];
		
		if (feature.featureType === "forgeUpgrade"){
			tooltipText.push(`${feature.costBase} ${feature.costType}`);
		}
		else if (feature.featureType === "zone"){
			if (feature.zoneType === "boss"){
				tooltipText.push(`Region Boss1 skillpoint on first kill`);
			}
			tooltipText.push(`Unlock: ${this.formatNumber(feature.costNext)} ${feature.costType}`);
			tooltipText.push(`${this.formatNumber(feature.prodNext)} ${feature.prodType} / ${Math.round(feature.conquestTime *100)/100} sec`);
		}
		else if (feature.featureType === "skill"){
		}
		else if (feature.featureType === "artifact"){
			tooltipText.push(`Unlocks zone repeating (if upgrade purchased) for zones that unlocked it\n`);
			tooltipText.push(`Evolution Tier: ${feature.evolutionTier}`);
			tooltipText.push(`Artifact evolves at level ${feature.maxLevel}`);
		}
		else if (feature.featureType === "essenceUpgrade"){
		}
		else if (feature.featureType === "achievement"){
			tooltipText.push(`Radiance Bonus: ${feature.radianceReward}`);
			let achievementText = 'Set Bonus: ' + feature.set.description;
			if (feature.set.completed){
			  achievementText = `<span style = "color:${feature.set.color}; font-weight:bold;">${achievementText} <br>(Active)</span>`;
			}
			tooltipText.push(achievementText);
		}
		else if (feature.featureType === "upgrade") {
			for (let obs of feature.observers) {
				// Check if 'obs' has a 'targetType' property
				if (obs.targetType) {
					tooltipText.push('type targetting - not handled yet ');
					continue; // Skip to the next iteration of the loop
				}
		
				let tree = obs.target.calcTreesMap.get("production");
				let targetNode = tree.nodes.find(node => node.ref.id === obs.id);
				let treeType = "prod";
			
				// Check if targetNode wasn't found in 'production'. If not, look for it in 'cost'
				if (!targetNode) {
					tree = obs.target.calcTreesMap.get("cost");
					targetNode = tree.nodes.find(node => node.ref.id === obs.id);
					treeType = "cost";
				}
			
				if (targetNode) {
					let result = tree.calcNodeResult(targetNode, obs.source.level);
					tooltipText.push(`Current Contribution: ${obs.target.name} ${treeType} ${obs.runningCalcType} ${result.toFixed(3)} `);
				}
			}
		}
		
		else if (feature.featureType === "training" || feature.featureType === "generator"){
			tooltipText.push(`prodMult ${feature.prodMult.toPrecision(2)} | prodGrowthRate ${feature.prodGrowthRate.toPrecision(2)}`);
			tooltipText.push(`costMult ${feature.costMult.toPrecision(2)} | costGrowthRate ${feature.costGrowthRate.toPrecision(2)}`);
			tooltipText.push(`Evolution Tier: ${feature.evolutionTier}`);

			//dont display prodNext value on upgrades or features who dont have prodNext
			if (feature.prodNext.gt(0)){
				
				//incorporate milestone multipliers into next calculations where applicable
				let milestoneMult = new Decimal(1);
				if (feature.milestoneTiers && feature.featureType !== "artifact"){
					if (feature.nextLevelIncrement.plus(feature.manualLevel).gte(feature.nextMilestoneLevel)){
						milestoneMult = feature.nextMilestoneMult;
					}

					tooltipText.push(`Next Milestone:${feature.nextMilestoneLevel}\nNext Milestone Mult:${feature.nextMilestoneMult}`);
				}
			}
		}

		let newContent = tooltipText.join('\n');
		let tooltipElement = document.getElementById(`tooltip-${feature.id}`);
		this.updateElementHTML(tooltipElement,newContent);
	}

	createElement(type, id = null, classes = [], textContent) {
		let element = document.createElement(type);
	
		if (id){
			element.id = id;
		}
	
		if (typeof classes === 'string') {
			element.classList.add(classes);
		} else if (Array.isArray(classes)) {
			for (let cls of classes) {
				element.classList.add(cls);
			}
		}

		if (textContent){
			element.textContent = textContent;
		}
	
		return element;
	}
	
	findOrCreateElement(parent, type, id, classes = []) {
		let element = parent.querySelector(`#${id}`);
		if (!element) {
			element = this.createElement(type, id, classes);
			parent.appendChild(element);
		}
		return element;
	}

	updateVisibility(element, condition) {
		// element.style.display = condition ? 'block' : 'none';
		element.style.opacity = condition ? 1 : 0;
		element.style.pointerEvents = condition ? 'auto' : 'none';
	}

	updateElementTextContent(element, newContent) {
		if (element.textContent !== newContent) {
			element.textContent = newContent;
		}
	}

	updateElementHTML(element, newContent) {
		if (element.innerHTML !== newContent) {
			element.innerHTML = newContent;
		}
	}

	clearElement(element) {
		while (element.firstChild) {
			element.removeChild(element.firstChild);
		}
	}
	
	populateTabInfo() {
		let checker = document.querySelector(`.tab-info-container`);
		if (!checker){
				
			const tabs = [
				{id: 'training', infoText: 'INFOnHotkeys'},
				{id: 'forge', infoText: 'INFOnHotkeys'},
				{id: 'tab-content-OdysseySubTab', infoText: 'INFOnHotkeys'},
				{id: 'tab-content-TournamentSubTab', infoText: 'INFOnHotkeys'},
				{id: 'tab-content-ArtifactsSubTab', infoText: 'INFOnHotkeys'},
				{id: 'essence', infoText: 'INFOnHotkeys'},
				{id: 'skills', infoText: 'INFOnHotkeys'},
				{id: 'achievements', infoText: 'INFOnHotkeys'},
				{id: 'radiance', infoText: 'INFOnHotkeys'},
			];
			
			for (let tab of tabs) {
				let targetElement = document.getElementById(tab.id);
				if (targetElement) {
					let tabInfoContainer = this.createElement('div',`${tab.id}-tab-info`,`tab-info-container`);
		
					const infoIcon = this.createElement('img',null,`info-icon`);
					infoIcon.src = infoIconSource;
					infoIcon.alt = 'Info';
		
					const infoTextContainer = this.createElement('div',`${tab.id}-info-text`,'info-text-container',tab.infoText);
					infoTextContainer.style.display = "none";  // initially hidden
		
					infoIcon.addEventListener('click', () => {
						// Check if infoTextContainer is currently visible
						if (infoTextContainer.style.display === "none") {
							// If it's not visible, show it
							infoTextContainer.style.display = "block";
						} else {
							// If it's visible, hide it
							infoTextContainer.style.display = "none";
						}
					});
		
					tabInfoContainer.appendChild(infoIcon);
					tabInfoContainer.appendChild(infoTextContainer);
					targetElement.prepend(tabInfoContainer);
				}
			}
		}
	}
	
	populateFeatureCell(feature, targetCol, featureId,zIndex){
		let realmTypeForColor = targetCol.id.split("-")[0]; 
		let cell = this.createElement('div',featureId,[`feature-cell`, `${feature.featureType}-cell`,`${realmTypeForColor}-color`]);
		cell.style.zIndex = zIndex;
	
		const trainingName = this.createElement('div',null,[`feature-name`, feature.featureType + '-name'],feature.name + " lvl " + feature.level + "\n" + feature.description);
		cell.appendChild(trainingName);
		
		const button = this.createElement('button',`button-${feature.id}`);
	
		// Create a span to hold the button's text
		const buttonText = this.createElement('span',`buttonText-${feature.id}`);
		button.style.zIndex = zIndex;
		button.appendChild(buttonText);
	
		this.populateTooltip(feature,button);
	
		button.addEventListener('click', () => {
			this.buyFeature(feature.id);
		});

		cell.appendChild(button);
	
		targetCol.appendChild(cell);
	
		return cell;
	}

	updateFeatureCell(feature,featureCell){
		this.updateVisibility(featureCell, feature.active);
		const featureNameElement = featureCell.querySelector('.' + feature.featureType + '-name');
		let featureNameText = feature.name + " lvl " + this.formatNumber(feature.level.floor());
		this.updateElementTextContent(featureNameElement,featureNameText);
	
		// Update button text, style, and clickability based on feature.active
		const buttonTextElement = featureCell.querySelector(`#buttonText-${feature.id}`);
		let newButtonText = [];
	
		newButtonText.push(`+${feature.nextLevelIncrement} level\r\n`);
		newButtonText.push(`-${this.formatNumber(feature.costNext)} ${feature.costType}\r\n`);
	
		
		//dont display prodNext value on upgrades or features who dont have prodNext
		if (feature.prodNext.gt(0)){
			
			//incorporate milestone multipliers into next calculations where applicable
			let milestoneMult = new Decimal(1);
			if (feature.milestoneTiers && feature.featureType !== "artifact"){
				if (feature.nextLevelIncrement.plus(feature.manualLevel).gte(feature.nextMilestoneLevel)){
					milestoneMult = feature.nextMilestoneMult;
	
					newButtonText.push(`+${this.formatNumber((feature.prodNext.plus(feature.prodCurrent).times(milestoneMult)).minus(feature.prodCurrent))} ${feature.prodType.replace("Income", "")}/sec`);
				}
				else {
					newButtonText.push(`+${this.formatNumber(feature.prodNext)} ${feature.prodType.replace("Income", "")}/sec`);
				}
			}
			else {
				newButtonText.push(`+${this.formatNumber(feature.prodNext)} ${feature.prodType.replace("Income", "")}/sec`);
			}
		}
	
		const button = featureCell.querySelector(`#button-${feature.id}`);
	
		if (feature.active && (feature.level.neq(feature.maxLevel)) && this.isAffordable(feature) && feature.nextLevelIncrement.gt(0)) {
			button.disabled = false;
			button.classList.add('enabled');
			button.classList.remove('disabled');
		}
		else if (feature.level.eq(feature.maxLevel)) {
			button.disabled = true; 
			button.classList.remove('enabled');
			button.classList.add('disabled','complete');
			newButtonText = ["max"];
		}
		else {
			button.disabled = true;
			button.classList.remove('enabled');
			button.classList.add('disabled');
		}

		
		this.updateTooltip(feature);
		this.updateElementTextContent(buttonTextElement,newButtonText.join(`\r`));
	}
	
	populateCurrentValueElement(feature,featureCell){
		let currentValueElement = this.createElement('div',null,[`feature-current-value`,`${feature.featureType}-current-value`]);
		featureCell.appendChild(currentValueElement);
		return currentValueElement;
	}
	
	populateFeatureDescription(feature,featureCell){
		let featureDescription = this.createElement('div',null,`${feature.featureType}-description`);
		featureDescription.setAttribute('style', 'font-size:10px; max-width: 150px;');
		featureCell.appendChild(featureDescription);
	
		featureDescription.textContent = "\n" + feature.description;
		return featureDescription;
	}

	populateRealm(targetCol1,targetCol2,realm){
		let realmFeatures;
		if (realm.type === "force" || realm.type === "energy"){
			realmFeatures = realm.trainings;
		}
		else if (realm.type === "wisdom" || realm.type === "divine"){
			realmFeatures = realm.generatorChains[0].generators;
		}

		// z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
		let zIndexCounter = 1000;

		realmFeatures.forEach(feature => {
			let featureId = `feature-${feature.id}`;
			let featureCell = targetCol1.querySelector(`#${featureId}`);
			let currentValueElement;
			if (!featureCell) {
				featureCell = this.populateFeatureCell(feature,targetCol1,featureId,zIndexCounter);
				zIndexCounter--;
				this.populateAutobuyCheckbox(feature, featureCell, this.gameManager[realm.type + 'Heap']);
				currentValueElement = this.populateCurrentValueElement(feature,featureCell);
			} 
			else {
				currentValueElement = featureCell.querySelector(`.${feature.featureType}-current-value`);
			}
	
			this.updateAutobuyCheckbox(feature, featureCell);

			if (feature.prodCurrent.gt(0)){
				let newCurrentValueText = `${this.formatNumber(feature.prodCurrent)} ${feature.prodType.replace("Income", "")}/sec\r\n`;
				this.updateElementTextContent(currentValueElement,newCurrentValueText);
			}
			this.updateFeatureCell(feature, featureCell);
		});

		realm.upgrades.forEach(upgrade => {
			let upgradeId = `upgrade-${upgrade.id}`;
			let upgradeCell = targetCol2.querySelector(`#${upgradeId}`);
			if (!upgradeCell) {
				upgradeCell = this.populateFeatureCell(upgrade,targetCol2,upgradeId, zIndexCounter);
				zIndexCounter--;

				this.populateAutobuyCheckbox(upgrade, upgradeCell, this.gameManager[realm.type + 'Heap']);
				
				targetCol2.appendChild(upgradeCell);
			}

			this.updateAutobuyCheckbox(upgrade, upgradeCell);
			this.updateFeatureCell(upgrade, upgradeCell);
		});
	}

	changeRealmSubTab(realmId, realmType) {
		// Get the parent container
		const realmButtonsContainer = document.getElementById(`training-realm-buttons`);

		// Get the children of the parent container
		let realmButtons = realmButtonsContainer.children;

		// Remove 'active-tab' class from all realm buttons
		for (let i = 0; i < realmButtons.length; i++) {
			realmButtons[i].classList.remove('active-tab');
		}

		// Add 'active-tab' class to the clicked button
		let newRealmButton = document.getElementById(realmId);
		newRealmButton.classList.add('active-tab');

		// Hide all realm contents
		let realmContents = document.getElementById(`training`).children;
		for (let i = 0; i < realmContents.length; i++) {
			if (realmContents[i].id.includes('realm-content')) {
				realmContents[i].style.display = 'none';
			}
		}

		let thisTab = this.tabs.find(tab => tab.name === this.currentTab);
		thisTab.currentSubTab = realmType;

		this.currentSubTab = realmType;
		this.eventManager.dispatchEvent('updateHotkeyButtons');

		// Show the content of the clicked realm
		let newRealm = document.getElementById(`realm-content-${realmType}`);
		newRealm.style.display = 'flex';
	}

	populateForgeUpgradesTab(){
		let targetParent = document.getElementById('forge-upgrades-columns');
		let upgradeSectionNames = [ 'force', 'wisdom', 'energy', 'divine', 'crystal'];

		let allforgeUpgrades = {};
		upgradeSectionNames.forEach(section => {
			allforgeUpgrades[section] = this.gameManager.gameContent.forgeUpgrades.filter(upgrade => upgrade.costType === section);
		});

		
		upgradeSectionNames.forEach(sectionName => {
			let upgrades = allforgeUpgrades[sectionName];

			let colID = 'forgeUpgrades-' + sectionName;
			let col = document.getElementById(colID);

			//create initial elements
			if (!col){
				col = this.createElement('div', colID, ['content-tab-col', `${sectionName}-color`]);

				let colContent = this.createElement('div',null,'forge-upgrade-col');              

				let colTitle = this.createElement('div',null,null,sectionName.charAt(0).toUpperCase() + sectionName.slice(1));
				col.appendChild(colTitle);

				// z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
				let zIndexCounter = 1000;

				upgrades.forEach(upgrade => {
					let upgradeID = colID + '-' + upgrade.id;
					let upgradeCell = this.createElement('div',upgradeID,'forge-upgrade-cell');
				
					const button = this.createElement('button',`button-${upgrade.id}`,'forge-upgrade-button');
					button.style.zIndex = zIndexCounter;
				
					const upgradeContent = this.createElement('div',`upgrade-content-${upgrade.id}`);
					button.appendChild(upgradeContent);
				
					button.addEventListener('click', () => {
						this.buyFeature(upgrade.id);
					});

					this.populateTooltip(upgrade, button);

					upgradeCell.appendChild(button);
					
					colContent.appendChild(upgradeCell);
					zIndexCounter--;
				});

				col.appendChild(colContent);
				targetParent.appendChild(col)
			}

			//populate/update existing elements
			upgrades.forEach(upgrade => {
				const button = col.querySelector(`#button-${upgrade.id}`);
				const upgradeContent = document.getElementById(`upgrade-content-${upgrade.id}`);
			
				this.updateElementTextContent(upgradeContent,upgrade.name);
				
				this.updateTooltip(upgrade);
				
				this.updateVisibility(button, upgrade.active);
			
				if (upgrade.level.eq(upgrade.maxLevel)) {
					button.disabled = true;
					button.classList.remove('enabled');
					button.classList.add('complete');
					button.style.backgroundColor = `var(--${sectionName}-color)`;
					button.children[0].style.color = `white`;
				}
				else if (upgrade.active && (upgrade.level !== upgrade.maxLevel) && this.isAffordable(upgrade) && upgrade.nextLevelIncrement.gt(0)) {
					button.disabled = false;
					button.classList.add('enabled');
					// button.classList.remove('disabled');
				}
				else {
					button.disabled = true;
					// button.classList.add('disabled');
					button.classList.remove('enabled');
				}
			});
		});
	}
	
	populateSettingsTab(){
		let player = this.gameManager.gameContent.player;
		let settingsTabContent = document.getElementById('settings');
		let settingsTabContainer = document.getElementById('settings-tab-container');
		let settingsHotkeyList = document.getElementById('settings-hotkeys');
		let settingsPlayerStats = document.getElementById('settings-stats');
		let rewardContainer = document.getElementById('reward-container');

		if (!settingsTabContainer){
			let col1 = this.createElement('div',null,'content-tab-col');
			let col2 = this.createElement('div',null,'content-tab-col');

			settingsTabContainer = this.createElement('div','settings-tab-container');

			settingsHotkeyList = this.createElement('div',"settings-hotkeys");
			settingsHotkeyList.innerHTML = `
			<b>Hotkeys:</b>
			Next Tab:           Tab
			Previous Tab:    Shift+Tab`;
			settingsPlayerStats = this.createElement('div',"settings-stats");

			// Add a new container for the rewards
			rewardContainer = this.createElement('div', 'reward-container');

			// Create elements for daily reward
			let dailyRewardContainer = this.createElement('div', 'dailyRewardContainer');
			let dailyRewardTitle = this.createElement('div', null, null, 'Daily Reward');
			let dailyRewardTimer = this.createElement('div', 'dailyRewardTimer');
			let dailyRewardButton = this.createElement('button', 'dailyRewardButton', null, 'Claim Daily Reward');
			dailyRewardButton.onclick = () => this.rewardManager.giveDailyReward();
			
			// Create elements for hourly reward
			let hourlyRewardContainer = this.createElement('div', 'hourlyRewardContainer');
			let hourlyRewardTitle = this.createElement('div', 'hourlyRewardTitle', null, 'Hourly Reward');
			let hourlyRewardTimer = this.createElement('div', 'hourlyRewardTimer');
			let hourlyRewardButton = this.createElement('button', 'hourlyRewardButton', null, 'Claim Hourly Reward');
			hourlyRewardButton.onclick = () => this.rewardManager.giveHourlyReward();
		 

			let gameInfo = this.createElement('div',null,null,`version ${this.gameStateManager.version}`);

			


			//SETTINGS
			//tooltips
			let tooltipContainer = settingsTabContent.querySelector(`#tooltips-settings-container`);
			let checkbox = settingsTabContent.querySelector(`#checkbox-tooltips`);
			let label = settingsTabContent.querySelector(`#label-tooltips`);
			if (!tooltipContainer) {
				tooltipContainer = this.createElement('div','tooltips-settings-container');

				let tooltipTitle = this.createElement('div',null,null,"Toggle Tooltips");

				let tooltipCheckBox = document.createElement('div');
				checkbox = this.createElement('input',`checkbox-tooltips`);
				checkbox.type = 'checkbox';
				checkbox.style.display = 'none';
				checkbox.checked = true; 
				checkbox.addEventListener('change', () => {
					if (checkbox.checked) {
						document.querySelector('#root').classList.remove('tooltips-off');
					} 
					else {
						document.querySelector('#root').classList.add('tooltips-off');
					}
					
				});
				label = this.createElement('label',`label-tooltips`);
				label.htmlFor = checkbox.id;

				tooltipCheckBox.appendChild(checkbox);
				tooltipCheckBox.appendChild(label);
				tooltipContainer.appendChild(tooltipTitle);
				tooltipContainer.appendChild(tooltipCheckBox);
				settingsTabContent.appendChild(tooltipContainer);
			}

			
			// Append all elements to the DOM
			


			dailyRewardContainer.appendChild(dailyRewardTitle);
			dailyRewardContainer.appendChild(dailyRewardTimer);
			dailyRewardContainer.appendChild(dailyRewardButton);
			hourlyRewardContainer.appendChild(hourlyRewardTitle);
			hourlyRewardContainer.appendChild(hourlyRewardTimer);
			hourlyRewardContainer.appendChild(hourlyRewardButton);
			rewardContainer.appendChild(dailyRewardContainer);
			rewardContainer.appendChild(hourlyRewardContainer);

			col1.appendChild(rewardContainer);
			col1.appendChild(settingsHotkeyList);
			col2.appendChild(settingsPlayerStats);
			
			settingsTabContainer.appendChild(col1);
			settingsTabContainer.appendChild(col2);
			settingsTabContent.appendChild(settingsTabContainer);
			settingsTabContent.appendChild(gameInfo);
		}

		settingsPlayerStats.innerHTML = `
		<b>Lifetime Stats:</b>
		\r\nMax PowerLevel Achieved: ${this.formatNumber(player.maxPowerLevelAchieved)}
		\r\nLifetime Force Earned: ${this.formatNumber(player.lifetimeForceEarned)}
		\rLifetime Wisdom Earned: ${this.formatNumber(player.lifetimeWisdomEarned)}
		\nLifetime Energy Earned: ${this.formatNumber(player.lifetimeEnergyEarned)}
		\nLifetime Divine Earned: ${this.formatNumber(player.lifetimeDivineEarned)}
		\nLifetime Essence Earned: ${this.formatNumber(player.lifetimeEssenceEarned)}
		\nLifetime Crystal Earned: ${this.formatNumber(player.lifetimeCrystalEarned)}
		\nMax World Achieved: ${this.formatNumber(player.maxProgressionWorld)}
		\nMax Region Achieved: ${this.formatNumber(player.maxProgressionRegion)}
		\nLifetime Zone Completions: ${this.formatNumber(player.lifetimeZoneCompletions)}
		\nLifetime Region Progressions: ${this.formatNumber(player.lifetimeRegionProgressions)}
		\nLifetime World Progressions: ${this.formatNumber(player.lifetimeWorldProgressions)}
		\nMax Tournament Rank Achieved:${this.formatNumber(player.maxTournamentRank)}
		\nLifetime Kills: ${this.formatNumber(player.lifetimeKills)}
		\nTotal Playtime: ${Math.round(player.totalPlaytime / 60000)} minutes
		\nStarted Playing: ${player.originalStartDateTime.toLocaleString()}
		\nLast Save: ${player.lastSave.toLocaleString()}`;

		// Check and display the time until the next daily reward
		let dailyRewardTimeLeft = this.rewardManager.checkDailyReward();
		let dailyRewardTimer = document.getElementById('dailyRewardTimer');
		dailyRewardTimer.innerText = this.formatTime(dailyRewardTimeLeft);
		let dailyRewardButton = document.getElementById('dailyRewardButton');
		//disable button if not claimable
		dailyRewardButton.disabled = !this.rewardManager.dailyRewardClaimable;
	
		// hourly reward info
		let hourlyRewardTitle = document.getElementById(`hourlyRewardTitle`);
		hourlyRewardTitle.innerText = `Hourly Reward (${this.rewardManager.currentHourlyRewardsClaimable}/${this.rewardManager.hourlyRewardCap})`;
		hourlyRewardTitle.id = "hourlyRewardTitle";

		// Check and display the time until the next hourly reward
		let hourlyRewardTimeLeft = this.rewardManager.checkHourlyReward();
		let hourlyRewardTimer = document.getElementById('hourlyRewardTimer');
		hourlyRewardTimer.innerText = this.formatTime(hourlyRewardTimeLeft);
		let hourlyRewardButton = document.getElementById('hourlyRewardButton');
		//disable button if not claimable
		hourlyRewardButton.disabled = !this.rewardManager.hourlyRewardClaimable;
	
		// Display the current amount of hourly rewards that are claimable on the claim button
		let currentHourlyRewards = this.rewardManager.currentHourlyRewardsClaimable;
		if (currentHourlyRewards.gt(0)) {
			hourlyRewardButton.innerText = `Claim Hourly Reward (${currentHourlyRewards.toString()})`;
		} else {
			hourlyRewardButton.innerText = 'Claim Hourly Reward';
		}
	}

	populateRadianceTab() {
		let targetCol = document.getElementById(`radiance-col1`);
		const radianceUpgrades = this.gameManager.gameContent.radianceUpgrades;
		targetCol.classList.add('radiance-color');

		// z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
		let zIndexCounter = 1000;

		radianceUpgrades.forEach(upgrade => {
			const upgradeId = `upgrade-${upgrade.id}`;
			let upgradeCell = targetCol.querySelector(`#${upgradeId}`);
			if (!upgradeCell) {
				upgradeCell = this.populateFeatureCell(upgrade,targetCol,upgradeId, zIndexCounter);
				zIndexCounter--;
				targetCol.appendChild(upgradeCell);
			}

			this.updateFeatureCell(upgrade, upgradeCell);
		});
	}

	formatTime(milliseconds) {
		let totalSeconds = Math.floor(milliseconds / 1000);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds % 60;
	
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	populateAchievementsTab() {
		let targetCol = this.achievementsCol1;
		const achievementSets = this.gameManager.gameContent.achievementsGrid.achievementSets;
		let achievementsChecker = document.getElementById('achieve-checker');
		if (!achievementsChecker){
			achievementsChecker = this.createElement('div','achieve-checker');

			// z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
			let zIndexCounter = 1000;

			for (const achievementSet of achievementSets){			
				achievementSet.achievements.forEach(achievement => {
					const achievementID = `achievement-${achievement.id}`;
					let achievementCell = targetCol.querySelector(`#${achievementID}`);
					if (!achievementCell) {
						achievementCell = this.createElement('button',achievementID,'achievement-cell');
						achievementCell.style.color = `${achievement.set.color}`;
						achievementCell.style.border = `2px solid ${achievement.set.color}`;

						let achievementContent = this.createElement('div',null,null,`${achievement.name}`);
						achievementCell.appendChild(achievementContent);
						

						achievementCell.addEventListener('click', () => {
							this.claimAchievement(achievement);
						});

						this.populateTooltip(achievement,achievementCell);
						achievementCell.style.zIndex = zIndexCounter;
						zIndexCounter--;
			
						targetCol.appendChild(achievementCell);
					}

					this.updateTooltip(achievement);

					// Update button appearance based on achievement.isClaimable
					if (achievement.isClaimed) {
						achievementCell.disabled = true;
						achievementCell.classList.add('complete');
						achievementCell.classList.remove('enabled');
						achievementCell.classList.remove('disabled');
						achievementCell.style.backgroundColor = `${achievement.set.color}`;
						achievementCell.style.color = `white`;
					}
					else if (achievement.isClaimable) {
						achievementCell.disabled = false;
						achievementCell.classList.add('enabled');
						achievementCell.classList.remove('disabled');
						achievementCell.style.fontWeight = 'bold';
						achievementCell.style.color = `${achievement.set.color}`;
					}
					else {
						achievementCell.disabled = true;
						achievementCell.classList.add('disabled');
						achievementCell.classList.remove('enabled');
					}
				});
			}
		}
	}

	populateSkillsTab() {
		//update skills tab button unspent points
		const skillsTabButton = document.querySelector('#skillsTab');
		let name = skillsTabButton.id;
		name = name.replace("Tab", "");
		name = name.charAt(0).toUpperCase() + name.slice(1);;

		this.updateElementTextContent(skillsTabButton,`${name} (${this.gameManager.gameContent.player.skillpoint})`);

		const skills = this.gameManager.gameContent.skillTree.skills;

		let skillData = this.skillsCol1.querySelector('#skill-data');
		let skillGrid, skillPointsTotal;

		// Populate Initial Elements
		if (!skillData){
			//assign skillsCol1 color
			this.skillsCol1.classList.add('skills-color');

			skillData = this.createElement('div','skill-data');
			skillData.setAttribute('style', 'margin-bottom:30px;');
			this.skillsCol1.appendChild(skillData);

			let skillPointsTotal = this.createElement('div','skillpoints',null,`Skill Points: ${this.formatNumber(this.gameManager.gameContent.player.skillpoint)}`);
			skillData.appendChild(skillPointsTotal);

			let refundSkillsButton = this.createElement('button',`refund-skills-button`, null, "Refund All");

			refundSkillsButton.addEventListener('click', () => {
				this.gameManager.gameContent.skillTree.refundAllSkills();
			});

			skillData.appendChild(refundSkillsButton);

			skillGrid = this.createElement('div',null,'skill-grid');
			this.skillsCol1.appendChild(skillGrid);

			// z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
			let zIndexCounter = 1000;

			skills.forEach(skill => {
				// Create a skill node element and position it based on its connections
				let skillNode = skillGrid.querySelector(`#skill-${skill.id}`);
				if (!skillNode) {
					skillNode = this.createElement('button',`skill-${skill.id}`,'skill-node');

					// Create the level text element
					const levelText = this.createElement('span',null,'skill-level');
					skillNode.appendChild(levelText);

					// Create a line element to connect the skill nodes
					const connections = skill.node.connections;
					for (const direction in connections) {
						if (connections[direction]) { // Check if there is a connection in this direction
							const line = this.createElement('div',null,['skill-line', direction]);
							skillNode.appendChild(line);
						}
					}

					// Add click event to upgrade the skill
					skillNode.addEventListener('click', () => {
						if (skill.level.eq(0)) {
							this.buyFeature(skill.id);
						} else {
							for (const connection of skill.unlockedConnections){
								if (connection.level.eq(1)){
									return;
								}
							}
							skill.refundSkill();
						}
					});

					this.populateTooltip(skill,skillNode);
					skillNode.style.zIndex = zIndexCounter;
					zIndexCounter--;

					// Add the skill node to the skill grid
					skillGrid.appendChild(skillNode);
				}
			});
		}

		// Update Elements
		skillPointsTotal = document.querySelector('#skillpoints');
		this.updateElementTextContent(skillPointsTotal,`Skill Points: ${this.formatNumber(this.gameManager.gameContent.player.skillpoint)}`);

		skillGrid = this.skillsCol1.querySelector('.skill-grid');
		
		skills.forEach(skill => {
			let skillNode = skillGrid.querySelector(`#skill-${skill.id}`);

			// Update skill node title and level text
			const levelTextElement = skillNode.querySelector('.skill-level');
			let newLevelText = [`${skill.name}\n`,`${skill.level}/${skill.maxLevel}`];
			if (!skill.level.eq(skill.maxLevel)){
				newLevelText.push(`\nCost: ${skill.costNext}`);
			}

			this.updateElementTextContent(levelTextElement,newLevelText.join('\r'));

			this.updateTooltip(skill);

			// Skill is purchased
			if (skill.level.eq(skill.maxLevel)) {
				skillNode.disabled = false;
				skillNode.classList.add('enabled','skill-complete');
				skillNode.classList.remove('disabled');
			}
			// Skill is not active or not affordable
			else if (!skill.active || !this.isAffordable(skill) ) {
				skillNode.disabled = true;
				skillNode.classList.remove('enabled','skill-complete');
				skillNode.classList.add('disabled');
			}
			// skill is affordable and active but not purchased
			else {
				skillNode.disabled = false;
				skillNode.classList.add('enabled');
				skillNode.classList.remove('disabled','skill-complete');
			}
			skillNode.style.left = `${skill.node.x}px`;
			skillNode.style.top = `${skill.node.y}px`;
		});
	}

	calculateNextRebirth1Gain(){
		//calculate essence/rebirth mult changes
		//CODE mostly copied from gameStateManager calculateRebirth1()
		let rebirth1PseudoObject = this.gameManager.findObjectById(60000);

		let powerLevel = this.gameManager.gameContent.player.powerLevel;
	
		//gain essence based on log10 power level
		let essenceGain = powerLevel.div(1000).plus(1).log(10);
	
		let newRebirthTime = Date.now();
		let timeSinceLastRebirth = newRebirthTime - this.gameManager.gameContent.player.lastRebirth1;
			
		// Convert timeSinceLastRebirth from milliseconds to hours
		let timeSinceLastRebirthHours = timeSinceLastRebirth / 3600000;  // 1 hour = 3600000 milliseconds
	
		// Increase essenceGain by 5% for each hour since the last rebirth
		essenceGain = essenceGain.times(1 + 0.05 * timeSinceLastRebirthHours); 
		return essenceGain;
	}

	populateEssenceTab() {
		let targetCol = this.essenceCol1;
		const essenceUpgrades = this.gameManager.gameContent.essenceUpgrades;

		let initialX = 700;
		let initialY = 500;

		
		//set overall essence stats/multiplier
		let essenceStats = document.querySelector('.essence-stats');
		if (!essenceStats){
			essenceStats = this.createElement('div',null,'essence-stats');
			essenceStats.setAttribute('style', 'margin-bottom:10px; white-space: pre;');
			targetCol.appendChild(essenceStats);
		}

		//init essence cells container
		let essenceGrid = targetCol.querySelector(`#essence-grid`);
		if (!essenceGrid){
			
			//assign tab color
			targetCol.classList.add('essence-color');

			essenceGrid = this.createElement('div',`essence-grid`);
			targetCol.appendChild(essenceGrid);
		}

		
		//update overall essence stats/multiplier
		let essenceGain = this.calculateNextRebirth1Gain();
		let rebirthMultGain = essenceGain;

		let essencePseudoObject = this.gameManager.findObjectById(60000);

		//update essence stats

		let newEssenceStatsText =  `
		Total Essence Earned: ${this.formatNumber(this.gameManager.gameContent.player.lifetimeEssenceEarned)}
		EssenceMultiplier: ${this.formatNumber(essencePseudoObject.level)}
		Current Essence: ${this.formatNumber(this.gameManager.gameContent.player.essence)}
		Essence Gain on next Rebirth: ${this.formatNumber(essenceGain)}
		Multiplier after rebirth: ${this.formatNumber(rebirthMultGain.plus(essencePseudoObject.level))}`;

		this.updateElementTextContent(essenceStats,newEssenceStatsText);

		essenceUpgrades.forEach(upgrade => {
			const upgradeID = `eUpgrade-${upgrade.id}`;
			let essenceCell = targetCol.querySelector(`#${upgradeID}`);

			//set essence cells
			if (!essenceCell) {
				essenceCell = this.createElement('button',upgradeID,'essence-cell');
				essenceCell.addEventListener('click', () => {
					this.buyFeature(upgrade.id);
					upgrade.activateChildren();
				});

				let topPosition = initialY;
				let leftPosition = initialX;
				// calculate the position of the upgradeCell
				if (upgrade.parent){
					let angleInRadians = upgrade.angleFromParent * (Math.PI / 180);
					topPosition = upgrade.parent.y + upgrade.distanceFromParent * Math.sin(angleInRadians);
					leftPosition = upgrade.parent.x + upgrade.distanceFromParent * Math.cos(angleInRadians);
				}
	
				essenceCell.style.position = 'absolute';
				essenceCell.style.top = `${topPosition}px`;
				essenceCell.style.left = `${leftPosition}px`;
	
				upgrade.y = topPosition;
				upgrade.x = leftPosition;

				//Add connecting lines
				if (upgrade.parent) {
					// Calculate the line's width (the distance between the cells) and angle
					let dx = upgrade.x - upgrade.parent.x;
					let dy = upgrade.y - upgrade.parent.y;
					let lineLength = Math.sqrt(dx*dx + dy*dy);
					let angle = Math.atan2(dy, dx) * 180 / Math.PI - 180;
					
					// Create line div and apply the calculated width and angle
					let line = this.createElement('div',null,'essence-line');
					line.style.width = lineLength + 'px';
					line.style.transform = `rotate(${angle}deg)`;
			
					// Append the line to the upgrade cell
					essenceCell.appendChild(line);
				}
				
				let essenceData = this.createElement('div',`essence-data-${upgradeID}`);
				essenceCell.appendChild(essenceData);

				this.populateTooltip(upgrade,essenceCell);
	
				essenceGrid.appendChild(essenceCell);
			}

			//update essence cells/button statii
			let essenceData = essenceCell.querySelector(`#essence-data-${upgradeID}`);
			
			
			this.updateTooltip(upgrade);

			let newEssenceDataText = `${upgrade.name}\nlvl ${upgrade.level}/${upgrade.maxLevel}\nCost: ${this.formatNumber(upgrade.costNext)}`;
			this.updateElementTextContent(essenceData,newEssenceDataText);

			if (upgrade.active && upgrade.level.neq(upgrade.maxLevel) && this.isAffordable(upgrade) && upgrade.nextLevelIncrement.gt(0)) {
				essenceCell.disabled = false;
				essenceCell.classList.add('enabled');
				essenceCell.classList.remove('disabled');
			}
			else if (upgrade.level.eq(upgrade.maxLevel)) {
				essenceCell.disabled = true;
				essenceCell.classList.add('complete'); 
				essenceCell.classList.remove('enabled'); 
				// essenceCell.style.border = '2px solid cyan';
			}
			else {
				essenceCell.disabled = true;
				essenceCell.classList.add('disabled'); 
				essenceCell.classList.remove('enabled'); 
			}
		});
	}

	generateVerboseNotationUnits() {
		const units = ['','K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
		const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
		
		for (let i = 0; i < alphabet.length; i++) {
			for (let j = 0; j < alphabet.length; j++) {
				units.push(alphabet[i] + alphabet[j]);
			}
		}
		
		return units;
	}
	
	formatNumberVerbose(num) {
		const units = this.generateVerboseNotationUnits();
		let unitIndex = Math.floor(num.log10() / 3);
		let value = num.div(Decimal.pow(10, unitIndex * 3));
	
		let prefix = '';
		if (unitIndex >= 1000) {
			unitIndex -= 1000;
			prefix = 'Y';
		}
		if (unitIndex >= 1000) {
			unitIndex -= 1000;
			prefix = 'Z';
		}
		if (unitIndex >= 1000) {
			unitIndex -= 1000;
			prefix = 'E';
		}
	
		// Ensure the unit index does not exceed the length of the units array
		if (unitIndex >= units.length) {
			// Fallback to scientific notation if the number is too large
			return num.toExponential(3);
		}
	
		return `${value.toFixed(2)} ${prefix}${units[unitIndex]}`;
	}
	
	toEngineeringNotation(decimal) {
		let exponent = decimal.e;
		let mantissa = decimal.mantissa;
	
		if (exponent < 3) {
			return mantissa * Math.pow(10, exponent);
		}
	
		let engExponent = Math.floor(exponent / 3);
		let remainder = exponent % 3;
		let engMantissa = mantissa * Math.pow(10, remainder);
	
		return `${engMantissa.toFixed(2)}e${engExponent * 3}`;
	}

	formatNumber(num) {
		if (num.lte(9999)) {
			return num.toFixed(0);
		}
		else{
			switch (this.numberNotation) {
				case "scientific":
					return num.toExponential(3);
				case "engineering":
					// return `${num.mantissaWithDecimalPlaces(0)}e${num.magnitudeWithDecimalPlaces(1)}`;
					return this.toEngineeringNotation(num);
				case "log10":
					return num.log10().toFixed(0);
				case "toStringWithDecimalPlaces":
					return num.floor().toStringWithDecimalPlaces(3);
				case "toJSON":
					return num.floor().toJSON();
				case "toPrecision":
					return num.floor().toPrecision(3);
				case "toNumber":
					return num.floor().toNumber(2);
				case "string":
					return num.floor().toString(2);
				case "toFixed":
					return num.floor().toFixed(2);
				case "verbose":
					return this.formatNumberVerbose(num);
				case "standard":
					let [mantissa, exponent] = num.toExponential(3).split('e');
					return `${mantissa} * 10^${exponent}`;
				case "abbreviated":
					// need to generate an array with more than 3333 suffixes to handle numbers up to 10^9999
					const suffixes = this.generateSuffixes(); 
					const suffixNum = Math.max(0, Math.floor(num.log10() / 3));
					if (suffixNum >= suffixes.length) {
						return num.toExponential(3); // fallback to scientific notation if the number is too large
					}
					const shortValue = num.div(Decimal.pow(10, suffixNum * 3));
					return `${shortValue.toFixed(2)}${suffixes[suffixNum]}`;
					
					
				default:
					return num.toExponential(3);
			}
		}
	}

	claimAchievement(achievement) {
		achievement.claim();
	}

	//dispatch to gameManager
	buyFeature(id) {
		this.eventManager.dispatchEvent('handlePurchase', { id });
		// this.eventManager.dispatchEvent('check-unlocks');
	}
}

class GameStateManager {
	constructor(eventManager, gameManager) {
		this.eventManager = eventManager;
		this.gameManager = gameManager;
		this.gameStateSaver = new GameStateSaver(eventManager,gameManager, this);
		this.gameStateLoader = new GameStateLoader(eventManager,gameManager, this);

		this.version = "0.0.1 (alpha)";
		
		this.definePropertyArrays();
		this.defineStateValuesAndTypes();
	}

	defineStateValuesAndTypes(){
		this.universalStateValuesAndTypes();
		this.fullStateValuesAndTypes();
		this.rebirth1StateValuesAndTypes();
	}

	definePropertyArrays(){
		//Property arrays for use with featureType population/loading
		this.fullFeatureProperties = ['level', 'manualLevel', 'autoLevel',
		'active','visible',
		'prodCurrent','prodPrevious','prodNext','prodNextSingle','prodMult',
		'costNext','costNextSingle','costMult',
		'nextMilestoneMult','nextMilestoneLevel','nextAffordableMilestoneLevel','maxAffLvl'];
		this.autoFeatureProperties = ['autoUnlocked','autoToggle'];
		this.baseFeatureProperties = ['baseLevel', 'costBase', 'prodBase'];
	}

	universalStateValuesAndTypes(){
		this.universalStateValues = [
			//lifetime stats
			'lifetimeForceEarned',
			'lifetimeWisdomEarned',
			'lifetimeEnergyEarned',
			'lifetimeDivineEarned',
			'lifetimeEssenceEarned',
			'lifetimeCrystalEarned',

			'maxPowerLevelAchieved',
			'lifetimeZoneCompletions',
			'lifetimeRegionProgressions',
			'lifetimeWorldProgressions',
			'maxProgressionWorld',
			'maxProgressionRegion',
			'maxTournamentRank',
			'lifetimeKills',
			'totalPlaytime',
	
			//base stats
			'baseForce',
			'baseWisdom',
			'baseEnergy',
			'baseDivine',
			'baseSkillpoint',
			'baseCrystal',
			'baseEssence',
			'baseForcePowerLevelMultiplier',
			'baseWisdomPowerLevelMultiplier',
			'baseEnergyPowerLevelMultiplier',
			'baseDivinePowerLevelMultiplier',
	
			//other
			'radiance',
			'timeModifierUpgrade',
			'lastRebirth1',
		];

		// all game feature base values
		this.universalFeatureTypes = [
			{type: 'trainings', properties: [...this.baseFeatureProperties]},
			{type: 'generators', properties: [...this.baseFeatureProperties]},
			{type: 'upgrades', properties: [...this.baseFeatureProperties]},
			{type: 'fighters', properties: [...this.baseFeatureProperties]},
			{type: 'artifacts', properties: [...this.baseFeatureProperties]},
			{type: 'zones', properties: [...this.baseFeatureProperties]},
			{type: 'essenceUpgrades', properties: [...this.baseFeatureProperties]},
			{type: 'forgeUpgrades', properties: [...this.baseFeatureProperties]},
			{type: 'radianceUpgrades', properties: [...this.fullFeatureProperties]},
			{type: 'achievements', properties: [...this.fullFeatureProperties,'isClaimable','isClaimed']},
			{type: 'achievementSets', properties: ['completed']},
		];
	}
	
	fullStateValuesAndTypes(){
		this.fullStateValues = ['powerLevel','force', 'wisdom', 'energy', 'divine', 'crystal', 'essence', 'skillpoint','forceIncome','wisdomIncome','energyIncome','divineIncome','forcePowerLevelMultiplier','powerLevelFromForce','wisdomPowerLevelMultiplier','powerLevelFromWisdom','energyPowerLevelMultiplier','powerLevelFromEnergy','divinePowerLevelMultiplier','powerLevelFromDivine'];
		
		this.fullFeatureTypes = [
			{ type: 'trainings', properties: [...this.fullFeatureProperties, ...this.autoFeatureProperties, 'evolutionTier']},
			{ type: 'generators', properties: [...this.fullFeatureProperties, ...this.autoFeatureProperties, 'evolutionTier']},
			{ type: 'upgrades', properties: [...this.fullFeatureProperties, ...this.autoFeatureProperties] },
			{ type: 'artifacts', properties: [...this.fullFeatureProperties, ...this.autoFeatureProperties, 'unlocked','evolved','evolutionTier'] },

			{ type: 'skills', properties: [...this.fullFeatureProperties] },
			{ type: 'forgeUpgrades', properties: [...this.fullFeatureProperties]},
			{ type: 'essenceUpgrades', properties: [...this.fullFeatureProperties]},
			{ type: 'radianceUpgrades', properties: [...this.fullFeatureProperties]},

			{ type: 'fighters', properties: [...this.fullFeatureProperties,'isDefeated','defeatCount','baseFightTime']},
			{ type: 'fighterTiers', properties: ['isCompleted','active','visible']},
			{ type: 'zones', properties: [...this.fullFeatureProperties, ...this.autoFeatureProperties,'isDefeated','defeatCount','baseConquestTime','repeatUnlocked']},
			{ type: 'regions', properties: ['isProgressed','isCompleted','active','visible']},
			{ type: 'worlds', properties: ['isProgressed','isCompleted','active','visible']},
			
			{ type: 'mods', properties: ['active']},
			{ type: 'realms', properties: ['active']},
			{ type: 'generatorChains', properties: ['active']},

			{ type: 'tabs', properties: ['active','visible']},
		];
	}

	rebirth1StateValuesAndTypes(){
		this.rebirth1StateValues = ['essence','lifetimeEssenceEarned'];
		this.rebirth1StateFeatureTypes = [
			{ type: 'essenceUpgrades', properties: [...this.fullFeatureProperties]},
			{ type: 'radianceUpgrades', properties: [...this.fullFeatureProperties]},
		];
	}

	autosave(){
		this.saveGameState(0);
	}
	
	saveGameState(state) {
		this.gameStateSaver.saveGameState(state);
	}

	loadGameState(state) {
		this.gameStateLoader.loadGameState(state);
	}
}

class GameStateSaver {
	constructor(eventManager, gameManager, gameStateManager) {
		this.eventManager = eventManager;
		this.gameManager = gameManager;
		this.gameStateManager = gameStateManager;
	}

	saveGameState(state){
		this.gameManager.gameContent.player.lastSave = new Date();
		const gameData = this.populateSaveUniversalData();

		switch (state) {
			case 0:
				this.populateSaveFullData(gameData);
				break;
			case 1:
				this.populateSaveRebirthState1(gameData);
				break;
			case 2:
				this.populateSaveRebirthState2(gameData);
				break;
			case 3:
				this.populateSaveRebirthState3(gameData);
				break;
		}

		const gameDataJson = JSON.stringify(gameData);
		localStorage.setItem('saveGame', gameDataJson);

		//if rebirth (state > 0), immediately load rebirth state
		if (state > 0) {
			this.eventManager.dispatchEvent('restart', state);
		}
	}

	populateSaveUniversalData() {
		const gameData = {
			version: this.gameStateManager.version,
			playerData: {},
			saveTimeStamp: Date.now()
		};

		this.savePlayerData(this.gameStateManager.universalStateValues, gameData);

		this.saveFeatureData(this.gameStateManager.universalFeatureTypes, gameData);

		// save time variables
		gameData.lastSave = this.gameManager.gameContent.player.lastSave.toString();
		gameData.originalStartDateTime = this.gameManager.gameContent.player.originalStartDateTime.toString();

		// Save specific Tabs
		gameData.radianceTab = this.saveTabData('radiance');
		gameData.achievementsTab = this.saveTabData('achievements');

		return gameData;
	}

	populateSaveFullData(gameData) {
		this.saveFeatureData(this.gameStateManager.fullFeatureTypes, gameData);
	
		//SPECIAL CASES
		// Special serialization for levelsAddLevelsTargets if the property exists
		this.gameManager.gameContent.trainings.forEach(item => {
			const data = this.getOrUpdateFeatureData(item, gameData, 'trainings');
	
			if ('levelsAddLevelsTargets' in item && item.levelsAddLevelsTargets.length > 0) {
				data.levelsAddLevelsTargets = item.levelsAddLevelsTargets.map(target => ({
					target: target.target.id,
					calcType: target.calcType,
					calcValue: target.calcValue,
					amountPurchased: target.amountPurchased?.toString() ?? "0"
				}));
			}
		});
	
		// Save unlock data
		gameData.incompleteUnlocks = this.mapAndSaveIds(Array.from(this.gameManager.gameContent.unlockManager.unlocks.values()));
		gameData.completedUnlocks = this.mapAndSaveIds(Array.from(this.gameManager.gameContent.unlockManager.completedUnlocks.values()));

	
		// Save player data
		this.savePlayerData(this.gameStateManager.fullStateValues, gameData);
	
		// save tournament and worldmanager autounlock
		gameData.tournamentAuto = this.gameManager.gameContent.tournament.autoUnlocked;
		gameData.conquestAuto = this.gameManager.gameContent.worldManager.autoUnlocked;
	
		// Save synergyUpgrades
		gameData.playerData.synergyUpgrades = this.stringifyObjectArrays(this.gameManager.gameContent.player.synergyUpgrades);
	
		// Save shards
		gameData.playerData.shards = this.stringifyObjectArrays(this.gameManager.gameContent.player.shards);
	
		// Save heap data
		gameData.forceHeap = this.mapAndSaveIds(this.gameManager.forceHeap.heap);
		gameData.wisdomHeap = this.mapAndSaveIds(this.gameManager.wisdomHeap.heap);
		gameData.energyHeap = this.mapAndSaveIds(this.gameManager.energyHeap.heap);
		gameData.divineHeap = this.mapAndSaveIds(this.gameManager.divineHeap.heap);
	
		// save artifact autobuy array
		gameData.artifactAutobuys = this.mapAndSaveIds(this.gameManager.artifactAutobuys);

		// save headband pseudo object
		let headbandPseudoObject = this.gameManager.findObjectById(800);
		gameData.headbandPseudoObject = {
			id: headbandPseudoObject.id,
			level: headbandPseudoObject.level.toString(),
			active: headbandPseudoObject.active
		}
	}

	populateSaveRebirthState1(gameData) {
		this.isRebirthing = true;
		this.calculateRebirth1();

		// Iterate over each feature type and add/update to gameData
		this.gameStateManager.rebirth1StateFeatureTypes.forEach(featureTypeObj => {
			this.gameManager.gameContent[featureTypeObj.type].forEach(item => {
				const data = this.getOrUpdateFeatureData(item, gameData, featureTypeObj.type);

				// Extract the data properties
				featureTypeObj.properties.forEach(property => {
					if (item[property] instanceof Decimal) {
						// Convert Decimals to string
						data[property] = item[property].toString();
					} 
					else if (item[property] === null || typeof item[property] === 'number' || typeof item[property] === 'boolean' || typeof item[property] === 'string') {
						// Handle null values, ints, strings, and bools
						data[property] = item[property];
					} else {
						console.warn(`Unsupported property type for property "${property}"`);
					}
				});
			});
		});

		// Save player data
		this.gameStateManager.rebirth1StateValues.forEach(stat => {
			gameData.playerData[stat] = this.gameManager.gameContent.player[stat]?.toString();
		});

		// save rebirth pseudo object for essence multiplier
		let rebirth1PseudoObject = this.gameManager.findObjectById(60000);
		gameData.rebirth1PseudoObject = {
			id: rebirth1PseudoObject.id,
			level: rebirth1PseudoObject.level.toString(),
			active: rebirth1PseudoObject.active
		}

		//save specific tabs
		gameData.essenceTab = this.saveTabData('essence');
	}

	calculateRebirth1() {
		let rebirth1PseudoObject = this.gameManager.findObjectById(60000);
		if (!rebirth1PseudoObject.active){
			rebirth1PseudoObject.setActive();
		}
		let powerLevel = this.gameManager.gameContent.player.powerLevel;
	
		//gain essence based on log10 power level
		let essenceGain = powerLevel.div(1000).plus(1).log(10);
	
		let newRebirthTime = Date.now();
		let timeSinceLastRebirth = newRebirthTime - this.gameManager.gameContent.player.lastRebirth1;
			
		// Convert timeSinceLastRebirth from milliseconds to hours
		let timeSinceLastRebirthHours = timeSinceLastRebirth / 3600000;  // 1 hour = 3600000 milliseconds
	
		// Increase essenceGain by 5% for each hour since the last rebirth
		essenceGain = essenceGain.times(1 + 0.05 * timeSinceLastRebirthHours); 
	
		//set player essence currency values
		this.gameManager.gameContent.player.essence = this.gameManager.gameContent.player.essence.plus(essenceGain);
		this.gameManager.gameContent.player.lifetimeEssenceEarned = this.gameManager.gameContent.player.lifetimeEssenceEarned.plus(essenceGain);
	
		//set rebirth pseudo-object level which controls the game rebirth multiplier
		rebirth1PseudoObject.level = rebirth1PseudoObject.level.plus(essenceGain).round();
	}
	
	populateSaveRebirthState2(gameData) {
		this.isRebirthing = true;
	}

	populateSaveRebirthState3(gameData) {
		this.isRebirthing = true;
	}

	saveFeatureData(featureTypes, gameData){
		featureTypes.forEach(featureTypeObj => {
			this.gameManager.gameContent[featureTypeObj.type].forEach(item => {
				const data = this.getOrUpdateFeatureData(item, gameData, featureTypeObj.type);

				// Extract the data properties
				featureTypeObj.properties.forEach(property => {
					// console.error(item.name,property,item[property]);
					this.processFeatureSaveProperties(item, data, property);
				});
			});
		});
	}

	
	//SAVE HELPER FUNCTIONS

	

	saveTabData(tabName) {
		let tab = this.gameManager.gameContent.tabs.find(tab => tab.name === tabName);
		if (tab) {
			return { 
				active: tab.active, 
				visible: tab.visible 
			};
		}
		return null;
	}

	getOrUpdateFeatureData(feature, gameData, featureType) {
		// Access the correct array in gameData directly using featureType
		let featureDataArray = gameData[featureType];
	
		// If the array doesn't exist yet, create it
		if (!featureDataArray) {
			featureDataArray = [];
			gameData[featureType] = featureDataArray;
		}

		// Find the existing data in the gameData object, if it exists
		let featureData = featureDataArray.find(t => t.id === feature.id);
	
		// If the data doesn't exist yet, create it
		if (!featureData) {
			featureData = { id: feature.id };
			featureDataArray.push(featureData);
		}
	
		return featureData;
	}

	savePlayerData(playerData,gameData){
		playerData.forEach(stat => {
			gameData.playerData[stat] = this.gameManager.gameContent.player[stat]?.toString();
		});
	}
	
	processFeatureSaveProperties(item, data, property) {
		if (item[property] instanceof Decimal) {
			// Convert Decimals to string
			data[property] = item[property].toString();
		} 
		else if (item[property] === null || typeof item[property] === 'number' || typeof item[property] === 'boolean' || typeof item[property] === 'string') {
			// Handle null values, ints, strings, and bools
			data[property] = item[property];
		} else {
			console.warn(`Unsupported property type for property "${property}"`);
		}
	}
	
	createIdObject(item) {
		return { id: item.id };
	}
	
	mapAndSaveIds(collection) {
		return collection.map(item => this.createIdObject(item));
	}
	
	stringifyObjectArrays(obj) {
		let result = {};
		for (const [key, value] of Object.entries(obj)) {
			result[key] = value.toString();
		}
		return result;
	}
}

class GameStateLoader {
	constructor(eventManager, gameManager, gameStateManager) {
		this.eventManager = eventManager;
		this.gameManager = gameManager;
		this.gameStateManager = gameStateManager;
	}

	loadGameState(state) {
		//reset - load default state and clear local storage save
		if (state === -1) {
			localStorage.clear();
			return;
		}

		const gameDataJson = localStorage.getItem('saveGame');
		if (!gameDataJson) {
			console.error("No save game file located");
			return;
		}
		
		const gameData = JSON.parse(gameDataJson);
	
		this.applyLoadUniversalData(gameData);
		
		if (state === 0) {
			this.applyLoadFullData(gameData);
		}
		else if (state > 0) {
			this.applyLoadRebirthStateData(state,gameData);
		}
	}

	applyLoadUniversalData(gameData) {
		this.version = gameData.version;
		// player stats
		this.gameStateManager.universalStateValues.forEach(stat => this.loadDecimalData(gameData, 'playerData', this.gameManager.gameContent.player, stat));
		
		// Iterate over each feature type and add/update to gameManager
		this.applyLoadData(gameData, this.gameStateManager.universalFeatureTypes);
	
		// load time variables
		this.gameManager.gameContent.player.lastSave = new Date(gameData.lastSave);
		this.gameManager.gameContent.player.originalStartDateTime = new Date(gameData.originalStartDateTime);
	
		// re-apply achievements
		for (const achievement of this.gameManager.gameContent.achievements){
			if (achievement.isClaimed){
				achievement.setActive();
				achievement.updateObservers();
				achievement.set.checkCompletion();

				//not doing anything? hmmmmm
				for (const unlock of this.gameManager.gameContent.unlocks){
					if (unlock.target === achievement){
						this.gameManager.gameContent.unlockManager.transferUnlockToCompleted(unlock);
					}
				}
			}
		}

		// re-apply radiance upgrades
		gameData.radianceUpgrades.forEach(data => {
			for (const radianceUpgrade of this.gameManager.gameContent.radianceUpgrades )
			if (data.id === radianceUpgrade.id) {
				if (data.active){
					radianceUpgrade.setActive();
					radianceUpgrade.updateObservers();
				}
			}
		});

		

		// re-apply essence upgrades
		gameData.essenceUpgrades.forEach(data => {
			for (const essenceUpgrade of this.gameManager.gameContent.essenceUpgrades )
			if (data.id === essenceUpgrade.id) {
				if (data.active){
					essenceUpgrade.setActive();
					essenceUpgrade.updateObservers();
				}
			}
		});

		//load specific tabs
		this.loadTabData('radiance', gameData.radianceTab);
		this.loadTabData('achievements', gameData.achievementsTab);
	}
	
	applyLoadFullData(gameData) {
		// Iterate over each feature type and add/update to gameManager
		this.applyLoadData(gameData, this.gameStateManager.fullFeatureTypes);
	
		// Load player data
		this.gameStateManager.fullStateValues.forEach(stat => this.loadDecimalData(gameData, 'playerData', this.gameManager.gameContent.player, stat));
	
		// Load synergyUpgrades
		for (const [key, value] of Object.entries(gameData.playerData.synergyUpgrades || {})) {
			this.gameManager.gameContent.player.synergyUpgrades[key] = new Decimal(value);
		}
	
		//load tournament and worldmanager autounlock
		this.gameManager.gameContent.tournament.autoUnlocked = gameData.tournamentAuto;
		this.gameManager.gameContent.worldManager.autoUnlocked = gameData.conquestAuto;
	
		// Load shards
		for (const [key, value] of Object.entries(gameData.playerData.shards || {})) {
			this.gameManager.gameContent.player.shards.set(key, new Decimal(value));
		}
		
	
		// load unlocks
		gameData.completedUnlocks.forEach(data => {
			if (this.gameManager.gameContent.unlockManager.unlocks.has(data.id)) {
				const completedUnlock = this.gameManager.gameContent.unlockManager.unlocks.get(data.id);
				this.gameManager.gameContent.unlockManager.unlocks.delete(data.id);
				this.gameManager.gameContent.unlockManager.completedUnlocks.set(data.id, completedUnlock);
			}
		});


		// Load heap data
		['forceHeap', 'wisdomHeap', 'energyHeap', 'divineHeap'].forEach(heapName => this.loadAutobuyHeapData(gameData, heapName));
	
		// load artifact autobuy array
		this.loadAutobuyArtifactData(gameData, 'artifactAutobuys');

		// load headband pseudo object
		let headbandPseudoObject = this.gameManager.findObjectById(800);
		headbandPseudoObject.level = new Decimal(gameData.headbandPseudoObject.level);
		if (gameData.headbandPseudoObject.active){
			headbandPseudoObject.setActive();
			headbandPseudoObject.updateObservers();
		}
	}

	applyLoadRebirthStateData(state, gameData) {
		switch (state) {
			case 1:
				this.applyLoadRebirthState1(gameData);
				break;
			case 2:
				this.applyLoadRebirthState2(gameData);
				break;
			case 3:
				this.applyLoadRebirthState3(gameData);
				break;
		}
		
		this.isRebirthing = false;
	}

	applyLoadRebirthState1(gameData) {
		//load rebirth 1 features
		this.gameStateManager.rebirth1StateFeatureTypes.forEach(featureTypeObj => {
			gameData[featureTypeObj.type]?.forEach(data => {
				const item = this.gameManager.gameContent[featureTypeObj.type].find(t => t.id === data.id);
				if (!item) {
					console.error("load error-data does not exist for:", data.id);
					return;
				}
	
				// Apply the data properties
				featureTypeObj.properties.forEach(property => {
					if (data[property]) {
						item[property] = typeof data[property] === 'string' ? new Decimal(data[property]) : data[property];
					}
				});
			});
		});

		//load rebirth 1 player data
		this.gameStateManager.rebirth1StateValues.forEach(stat => {
			if (gameData.playerData[stat]) {
				this.gameManager.gameContent.player[stat] = new Decimal(gameData.playerData[stat]);
			}
		});

		// load rebirth pseudo object for essence multiplier
		let rebirth1PseudoObject = this.gameManager.findObjectById(60000);
		const { id, level, active } = gameData.rebirth1PseudoObject;
		rebirth1PseudoObject.level = new Decimal(level);
		rebirth1PseudoObject.setActive();
		rebirth1PseudoObject.updateObservers();

		//apply base skillpoint override
		this.gameManager.gameContent.player.skillpoint = this.gameManager.gameContent.player.baseSkillpoint;

		//load essence tab
		this.loadTabData('essence', gameData.essenceTab);
	}

	applyLoadRebirthState2(gameData) {
	}

	applyLoadRebirthState3(gameData) {
	}


	//LOAD HELPER FUNCTIONS

	loadTabData(tabName, tabData) {
		let tab = this.gameManager.gameContent.tabs.find(tab => tab.name === tabName);
		if (tab && tabData) {
			tab.active = tabData.active;
			tab.visible = tabData.visible;
		}
	}

	// Helper to load Decimal data into the game content
	loadDecimalData(gameData, dataPath, target, stat) {
		if (gameData[dataPath][stat]) {
			target[stat] = new Decimal(gameData[dataPath][stat]);
		} else {
			console.error("load error-data does not exist for:", stat);
		}
	}

	// Helper to apply load data
	applyLoadData(gameData, featureTypes) {
		featureTypes.forEach(featureTypeObj => {
			gameData[featureTypeObj.type]?.forEach(data => {
				const item = this.gameManager.gameContent[featureTypeObj.type].find(t => t.id === data.id);
				if (!item) {
					console.error("load error-data does not exist for:", data.id);
					return;
				}

				// Apply the data properties
				featureTypeObj.properties.forEach(property => {
					if (data[property]) {
						item[property] = typeof data[property] === 'string' ? new Decimal(data[property]) : data[property];
					}
				});
			});
		});
	}

	// Helper to load heap data
	loadAutobuyHeapData(gameData, heapName) {
		if (gameData[heapName]) {
			for (const item of gameData[heapName]) {
				const feature = this.gameManager.findObjectById(item.id);
				this.gameManager[heapName].add(feature);
			}
		}
	}

	// Helper to load autoubuys
	loadAutobuyArtifactData(gameData, autoBuyName) {
		for (const item of gameData[autoBuyName]) {
			const artifact = this.gameManager.findObjectById(item.id);
			this.gameManager[autoBuyName].push(artifact);
		}
	}
}

class Unlock {
	constructor(id, category, type, dependentID, targetID, conditionType, conditionValue, triggerType, triggerValue) {
		this.id = id;
		
		this.dependentID = dependentID;
		this.dependent = null;
		this.targetID = targetID;
		this.target = null;

		this.category = category;
		this.type = type;

		this.conditionType = conditionType;
		this.conditionValue = conditionValue;

		this.triggerType = triggerType;
		this.triggerValue = triggerValue;
	}
}

class UnlockManager {
	constructor(eventManager,gameManager) {
		this.eventManager = eventManager;
		this.gameManager = gameManager;
		this.unlocks = new Map(); // Map to store unlock conditions
		this.completedUnlocks = new Map();

		this.isChecking = false;
		this.checkLock = Promise.resolve();

		this.eventManager.addListener('reEngage-unlock', this.reEngageUnlock.bind(this));
		this.eventManager.addListener('check-unlocks', this.checkUnlocks.bind(this));
		this.eventManager.addListener('complete-all-unlocks', this.completeAllUnlocks.bind(this));
	}

	completeAllUnlocks(){
		let tempCompletedUnlocks = new Map();
		for (let [id, unlock] of this.unlocks) {
			if (unlock.triggerType === "tabEnable" || (unlock.id <= 11010 && unlock.id >= 11000)){

			tempCompletedUnlocks.set(id, unlock);
			this.unlocks.delete(id);
			}
		}
		this.processTriggers(tempCompletedUnlocks);

		let tempUnlocks2 = new Map();
		for (let [id, unlock] of this.unlocks) {
			// if (unlock.triggerType === "tabEnable" || (unlock.id <= 11010 && unlock.id >= 11000)){

				tempUnlocks2.set(id, unlock);
			this.unlocks.delete(id);
			// }
		}
		
		this.processTriggers(tempUnlocks2);

		
		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: "powerLevel",
			value: new Decimal(100000),
			operation: 'add'
		});

		
		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: "wisdom",
			value: new Decimal(100000),
			operation: 'add'
		});

		
		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: "energy",
			value: new Decimal(100000),
			operation: 'add'
		});
		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: "divine",
			value: new Decimal(100000),
			operation: 'add'
		});
		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: "crystal",
			value: new Decimal(100000),
			operation: 'add'
		});
		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: "radiance",
			value: new Decimal(100000),
			operation: 'add'
		});
	}

	async checkUnlocks(){
		if (this.isChecking){
			return;
		}
		this.isChecking = true;
		this.checkLock = new Promise((resolve) => {
			let tempCompletedUnlocks = this.processConditions();
			if (tempCompletedUnlocks.size > 0){
				this.processTriggers(tempCompletedUnlocks);
			}

			resolve();
		});
		await this.checkLock;
		this.isChecking = false;
	}

	processConditions(){
		let tempCompletedArray = new Map();
		const allResources = this.gameManager.queryPlayerValue("all");

		for (let [id, unlock] of this.unlocks) {
			let isCompleted = false;
			if (unlock.category === "id") {
				switch (unlock.conditionType) {
					
					case 'maxLevel':
						if (unlock.dependent.level.gte(unlock.dependent.maxLevel)){
							isCompleted = true;
						}
						break;
					case 'level':
					case 'manualLevel':
						if (unlock.dependent[unlock.conditionType].gte(unlock.conditionValue)) {
							isCompleted = true;
						}
						break;
					case 'isCompleted':
					case 'isDefeated':
					case 'isProgressed':
					case 'isClaimed':
						if (unlock.dependent[unlock.conditionType] === unlock.conditionValue) {
							isCompleted = true;
						}
						break;
				}
			}
			else if (unlock.category === "stat") {
				let matchingResource = allResources.find(resource => resource.type === unlock.conditionType);

				if (unlock.conditionValue.lte(matchingResource.value)) {
					isCompleted = true;
				}
			}

			if (isCompleted) {
				tempCompletedArray.set(id, unlock);
				this.unlocks.delete(id);
			}
		}

		return tempCompletedArray;
	}

	processTriggers(tempCompletedArray){
		for (let [id, unlock] of tempCompletedArray){
			if(this[unlock.triggerType]) {
				this[unlock.triggerType](unlock);
			}
		}

		//add completed and processed unlocks to the primary completed unlocks array
		for(let [id, unlock] of tempCompletedArray) {
			this.completedUnlocks.set(id, unlock);
		}
	}

	tabEnable(unlock){
		//need to set tab targets at this stage for now, since not accessible on init
		unlock.target = this.gameManager.findObjectById(unlock.targetID);
		unlock.target.setActive();
	}

	transferUnlockToCompleted(unlock){
		this.completedUnlocks.push(unlock);
		this.unlocks.delete(unlock.id);
		console.error(unlock.target);
	}

	setActive(unlock) {
    if (Array.isArray(unlock.target)) {
        unlock.target.forEach(target => {
            if (target && typeof target.setActive === 'function') {
                target.setActive();
            }
        });
    } else if (unlock.target && typeof unlock.target.setActive === 'function') {
        unlock.target.setActive();
    }
}



	evolve(unlock) {
		unlock.target.evolve();
	}

	zoneRepeatEnable(unlock) {
		let world = unlock.target;
		//set gruop of zones to repeatUnlocked = true
		for (const region of world.regions){
			for (const zone of region.zones){
				zone.repeatUnlocked = true;
				if (zone.active && zone.isDefeated){
					zone.startConquest();
				}
			}
		}
	}

	headbandLevelActivate(unlock) {
		//set headband mod active
		unlock.target.setActive();
		//level up headband pseudo object
		let pseudoObject = this.gameManager.findObjectById(800);
		pseudoObject.active = true;
		pseudoObject.level = pseudoObject.level.plus(1);
	}

	async reEngageUnlock(event) {
		await this.checkLock;
	
		if (event.detail.type === "milestone"){
			for (const unlock of this.completedUnlocks.values()){
				if (unlock.dependentID === event.detail.id && unlock.target.name.includes("milestone")){
					//set milestone mod inactive
					unlock.target.active = false;
	
					//rebuild milestone object's buildtree to remove mod's mult
					unlock.dependent.calcTreesMap.get("production").buildTree();
	
					// Remove the unlock from the completedUnlocks map and re-add to the unlocks map
					this.completedUnlocks.delete(unlock.id);
					this.unlocks.set(unlock.id, unlock);
				}
			}
		}
	
		else if (event.detail.type === "realm-feature-unlock"){
			for (const unlock of this.completedUnlocks.values()){
				if (unlock.id >= 1200 && unlock.id <= 1210){
					unlock.target.active = false;
					unlock.target.visible = false;
	
					// Remove the unlock from the completedUnlocks map and re-add to the unlocks map
					this.completedUnlocks.delete(unlock.id);
					this.unlocks.set(unlock.id, unlock);
				}
			}
		}
	
		else{
			// Find the unlock with the given targetID in the completedUnlocks map
			for (const [id, unlock] of this.completedUnlocks.entries()) {
				if (unlock.targetID === event.detail.id) {
					// Remove the unlock from the completedUnlocks map
					this.completedUnlocks.delete(id);
						
					// Re-add the unlock to the unlocks map
					this.unlocks.set(id, unlock);
					
					// Optionally break the loop after finding and processing the first matching unlock
					// break;
				}
			}
		}
	}
}

class GameSettings {
	constructor() {
	}
}

class MinHeap {
    constructor() {
        this.heap = [];
    }

    getLeftChildIndex(parentIndex) { return 2 * parentIndex + 1; }
    getRightChildIndex(parentIndex) { return 2 * parentIndex + 2; }
    getParentIndex(childIndex) { return Math.floor((childIndex - 1) / 2); }

    hasLeftChild(index) { return this.getLeftChildIndex(index) < this.heap.length; }
    hasRightChild(index) { return this.getRightChildIndex(index) < this.heap.length; }
    hasParent(index) { return this.getParentIndex(index) >= 0; }

    leftChild(index) { return this.heap[this.getLeftChildIndex(index)]; }
    rightChild(index) { return this.heap[this.getRightChildIndex(index)]; }
    parent(index) { return this.heap[this.getParentIndex(index)]; }

    swap(indexOne, indexTwo) {
        let temp = this.heap[indexOne];
        this.heap[indexOne] = this.heap[indexTwo];
        this.heap[indexTwo] = temp;
    }

    peek() {
        if (this.heap.length === 0) throw "Heap is empty";
        return this.heap[0];
    }

    poll() {
        if (this.heap.length === 0) throw "Heap is empty";
        let item = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return item;
    }

    add(item) {
		if (!this.contains(item)) {
			this.heap.push(item);
			this.heapifyUp();
		}
	}
	
    heapifyUp() {
        let index = this.heap.length - 1;
        while (this.hasParent(index) && this.parent(index).costNextSingle.gt(this.heap[index].costNextSingle)) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    heapifyDown() {
        let index = 0;
        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (this.hasRightChild(index) && this.rightChild(index).costNextSingle.lt(this.leftChild(index).costNextSingle)) {
                smallerChildIndex = this.getRightChildIndex(index);
            }

            if (this.heap[index].costNextSingle.lt(this.heap[smallerChildIndex].costNextSingle)) {
                break;
            } else {
                this.swap(index, smallerChildIndex);
            }

            index = smallerChildIndex;
        }
    }

	remove(item) {
        const index = this.heap.findIndex(element => element.id === item.id);
        if (index === -1) {
            throw new Error('Item not found in heap');
        }

        // Swap the found item with the last item in the heap
        this.swap(index, this.heap.length - 1);

        // Remove the last item in the heap (which is now the item we want to remove)
        this.heap.pop();

        // Re-heapify to maintain heap property
        this.heapifyDown(index);
        this.heapifyUp(index);
    }

	contains(item) {
		return this.heap.some(element => element.id === item.id);
	}

	refresh() {
		let startIdx = Math.floor((this.heap.length - 2) / 2);
		for (let i = startIdx; i >= 0; i--) {
			this.heapifyDown(i);
		}
	}
}

class GameManager {
	constructor(eventManager) {
		this.eventManager = eventManager;
		this.gameContent = new GameContent(eventManager);
		this.gameContent.unlockManager = new UnlockManager(eventManager,this);
		this.multiplierString = "1";

		this.forceHeap = new MinHeap();
        this.wisdomHeap = new MinHeap();
		this.energyHeap = new MinHeap();
        this.divineHeap = new MinHeap();
		this.artifactAutobuys = [];
		
		this.eventManager.addListener('queryPlayerValue', (data, respond) => {
			const result = this.queryPlayerValue(data);
			if (respond) {
				respond(result);
			}
		});

		this.eventManager.addListener('handlePurchase', (data) => {
			this.handlePurchase(data.id);
		});

		this.eventManager.addListener('updateFeatureValues', (data) => {
			this.updateFeatureValues(data.target, data.isNewLvl);
		});

		this.eventManager.addListener('updateNewMultiplierValues', (data = this.multiplierString) => {
			this.updateNewMultiplierValues(data.multiplierString);
		});
	}

	autobuyArtifacts() {
		for (const artifact of this.artifactAutobuys){
			if (!artifact.autoUnlocked){
				break;
			}
	
			const allResources = this.queryPlayerValue("all");
			let tempResource = new Decimal(allResources.find(resource => resource.type === artifact.costType).value);
	
			let purchased = true;
			while (purchased) {
				
				if (artifact.costNextSingle.lte(tempResource) && artifact.level.lt(artifact.maxLevel)) {
					let ratio = tempResource.dividedBy(artifact.costNextSingle);
					let purchaseCount = Decimal.max(1, ratio.plus(1).log(2)).floor();
	
					if (ratio.gte(10)){
						while (purchaseCount.greaterThan(1) && artifact.calculateCostN(purchaseCount).gt(tempResource)) {
							purchaseCount = purchaseCount.minus(1);
						}
					}
	
					// if the purchase count would increase level beyond maxLevel, adjust purchaseCount
					if(artifact.level.plus(purchaseCount).gt(artifact.maxLevel)) {
						purchaseCount = artifact.maxLevel.minus(artifact.level);
					}
	
					artifact.costNext = artifact.calculateCostN(purchaseCount);
					artifact.prodNext = artifact.calculateProdN(purchaseCount);
					artifact.nextLevelIncrement = purchaseCount;
	
					tempResource = tempResource.minus(artifact.costNext);
					this.handlePurchase(artifact.id, purchaseCount);
					if (artifact.level.neq(artifact.maxLevel)){
						
					}
				}
				else {
					purchased = false;
				}
	
				// break the loop if maxLevel has been reached
				if(artifact.level.gte(artifact.maxLevel)) {
					break;
				}
			}
		}
	}

	
	// autobuyArtifacts(){
	// 	for (const artifact of this.artifactAutobuys){
	// 		if (!artifact.autoUnlocked){
	// 			break;
	// 		}

	// 		const allResources = this.queryPlayerValue("all");
	// 		let tempResource = new Decimal(allResources.find(resource => resource.type === artifact.costType).value);

	// 		let purchased = true;
	// 		while (purchased) {
				
	// 			if (artifact.costNextSingle.lte(tempResource)){
	// 				let ratio = tempResource.dividedBy(artifact.costNextSingle);
	// 				let purchaseCount = Decimal.max(1, ratio.plus(1).log(2)).floor();
	
	// 				if (ratio.gte(10)){
	// 					while (purchaseCount.greaterThan(1) && artifact.calculateCostN(purchaseCount).gt(tempResource)) {
	// 						purchaseCount = purchaseCount.minus(1);
	// 					}
	// 				}
	
	// 				artifact.costNext = artifact.calculateCostN(purchaseCount);
	// 				artifact.prodNext = artifact.calculateProdN(purchaseCount);
	// 				artifact.nextLevelIncrement = purchaseCount;
	
	// 				// let purchaseCount = new Decimal(1);
	
	// 				tempResource = tempResource.minus(artifact.costNext);
	// 				this.handlePurchase(artifact.id, purchaseCount);
	// 				if (artifact.level.neq(artifact.maxLevel)){
						
	// 				}
	// 			}
	// 			else {
	// 				purchased = false;
	// 			}
	// 		}
	// 	}
	// }

	onMultiplierChange(newMultiplierString) {
		this.multiplierString = newMultiplierString;
		this.updateNewMultiplierValues(newMultiplierString);
	}

	updateNewMultiplierValues(newMultiplierString = this.multiplierString, feature = null) {
		let multipliableFeatures;

		if (!feature){
		multipliableFeatures = this.gameContent.trainings.concat(this.gameContent.upgrades)
			.concat(this.gameContent.skillTree.skills)
			.concat(this.gameContent.generators)
			.concat(this.gameContent.essenceUpgrades)
			.concat(this.gameContent.zones)
			.concat(this.gameContent.fighters)
			.concat(this.gameContent.artifacts)
			.concat(this.gameContent.radianceUpgrades)
			.concat(this.gameContent.forgeUpgrades)
			.filter(feature => !feature.level.equals(feature.maxLevel));
		}
		else{
			multipliableFeatures = [feature];
		}

		//nextMilestone
		if (newMultiplierString === "nextMilestone") {
			for (const feature of multipliableFeatures) {
				if (feature.featureType === "training" || feature.featureType === "generator" || feature.featureType === "artifact") {
					feature.updateValuesMilestone();
				}
				else {
					feature.updateValuesDigit(new Decimal(1));
				}
			}
		}

		//max
		else if (newMultiplierString === "max") {
			for (const feature of multipliableFeatures) {
				const allResources = this.queryPlayerValue("all");
				let matchingResource = allResources.find(resource => resource.type === feature.costType);
				feature.updateValuesMax(matchingResource.value);
			}
		}

		//1,5,10,100
		else {
			let n = new Decimal(newMultiplierString);
			for (const feature of multipliableFeatures) {
				feature.updateValuesDigit(n);
			}
		}
	}

	handlePurchase(featureID, purchaseCount = null) {
		const feature = this.findObjectById(featureID);

		this.deductFeatureCost(feature,purchaseCount);
		this.updateFeatureValues(feature,true);

		let count = null;
		if (purchaseCount){
			count = new Decimal(purchaseCount);
		}
		feature.levelUp("manual", count);

		feature.costNextSingle = feature.calcCostNextSingle();

		this.updateNewMultiplierValues(this.multiplierString, feature);

		// this.eventManager.dispatchEvent('check-unlocks');
	}

	updateFeatureValues(feature, isNewLvl) {
		//handle if an active feature's multiplier is being updated but not its level
		//also handles evolutions
		if (feature.active && !isNewLvl) {
			feature.prodPrevious = feature.prodCurrent;
			feature.prodCurrent = feature.calculateProdN(feature.level, 0);
			feature.costNext = feature.calculateCostN(feature.manualLevel.plus(1), 0);
		}

		//dont update values if inactive || (level 0 & not being levelled up)
		else if (!feature.active || (feature.level.eq(0) && !isNewLvl)) {
			return;
		}
		//handle features that are being levelled manually or generator autopurchase
		else {
			if (feature.featureType === "generator"){
				feature.prodPrevious = feature.prodCurrent;
				feature.prodCurrent = feature.prodCurrent.plus(feature.prodNext);
			}
			else {
				feature.prodPrevious = feature.prodCurrent;
				feature.prodCurrent = feature.prodCurrent.plus(feature.prodNext);
			}
		}

		let dif = feature.prodCurrent.minus(feature.prodPrevious);

		if (feature.prodType === "forceIncome") {
			this.gameContent.player.forceIncome = this.gameContent.player.forceIncome.plus(dif);
		}
		else if (feature.prodType === "wisdomIncome") {
			this.gameContent.player.wisdomIncome = this.gameContent.player.wisdomIncome.plus(dif);
		}
		else if (feature.prodType === "energyIncome") {
			this.gameContent.player.energyIncome = this.gameContent.player.energyIncome.plus(dif);
		}
		else if (feature.prodType === "divineIncome") {
			this.gameContent.player.divineIncome = this.gameContent.player.divineIncome.plus(dif);
		}

		if (feature.featureType === "essenceUpgrade") {
			switch (feature.prodType) {
				case 'skillpoint':
					this.gameContent.player.skillpoint = this.gameContent.player.skillpoint.plus(feature.prodBase);

					this.gameContent.player.baseSkillpoint = this.gameContent.player.baseSkillpoint.plus(feature.prodBase);
					break;
				case 'baseFeatureLevel':
					feature.target.baseLevel = feature.target.baseLevel.plus(feature.prodBase);
					feature.target.updateValuesDigit(feature.prodBase);
					feature.target.levelUp("manual", feature.prodBase);
					this.updateFeatureValues(feature.target, true);
					break;
				case 'zoneSkillpoint':
					//handle retroactive defeated zone skillpoint upgrades
					//also updated in stage.handleConquestComplete part of this solution
					for (const zone of this.gameContent.zones) {
						if (zone.active && zone.isDefeated) {
							zone.prodCurrent = zone.prodPrevious;
							zone.prodNext = zone.prodCurrent.times(zone.prodMult);
							let skillpointstoadd = zone.prodNext;
							this.gameContent.player.skillpoint = this.gameContent.player.skillpoint.plus(skillpointstoadd);
						}
					}
					break;
			}
			return;
		}

		if (feature.featureType === "radianceUpgrade") {
			switch (feature.prodType) {
				case 'timeMult':
					this.gameContent.player.timeModifierUpgrade = feature.prodBase.plus(feature.level.times(feature.prodGrowthRate)).toNumber();
					break;
			}
		}

		if (feature.featureType === "forgeUpgrade") {
			switch (feature.prodType) {
				//AUTOMATION UPGRADE HANDLING
				//Exploration Automation
				case 'autoConquestRepeat':
					for (const zone of this.gameContent.zones){
						zone.autoUnlocked = true;
						if (zone.active && zone.repeatUnlocked && zone.isDefeated){
							zone.startConquest();
						}
					}
					break;
				case 'autoConquestProgression':
					this.gameContent.worldManager.autoUnlocked = true;
					break;
				case 'autoArtifact':
					for (const artifact of this.gameContent.artifacts){
						artifact.autoUnlocked = true;
						if (artifact.active){
							artifact.autoToggle = true;
							this.artifactAutobuys.push(artifact);
						}
					}
					break;
				case 'autoTournamentProgression':
					this.gameContent.tournament.autoUnlocked = true;
					break;
				
				//Training Automation
				case 'autoForceTrain':
					for (const training of this.gameContent.trainings.filter(training => training.realmID === 10)){
						training.autoUnlocked = true;
						this.forceHeap.add(training);
						training.autoToggle = true;
					}
					break;
				case 'autoWisdomTrain':
					for (const generator of this.gameContent.generators.filter(generator => generator.parentGenChain.realmID === 20)){
						generator.autoUnlocked = true;
						this.wisdomHeap.add(generator);
						generator.autoToggle = true;
					}
					break;
				case 'autoEnergyTrain':
					for (const training of this.gameContent.trainings.filter(training => training.realmID === 30)){
						training.autoUnlocked = true;
						this.energyHeap.add(training);
						training.autoToggle = true;
					}
					break;
				case 'autoDivineTrain':
					for (const generator of this.gameContent.generators.filter(generator => generator.parentGenChain.realmID === 40)){
						generator.autoUnlocked = true;
						this.divineHeap.add(generator);
						generator.autoToggle = true;
					}
					break;
				
				// Training Upgrade Automation
				case 'autoForceUpgrade':
					for (const upgrade of this.gameContent.upgrades.filter(upgrade => upgrade.realmID === 10)){
						upgrade.autoUnlocked = true;
						this.forceHeap.add(upgrade);
						upgrade.autoToggle = true;
					}
					break;
				case 'autoWisdomUpgrade':
					for (const upgrade of this.gameContent.upgrades.filter(upgrade => upgrade.realmID === 20)){
						upgrade.autoUnlocked = true;
						this.wisdomHeap.add(upgrade);
						upgrade.autoToggle = true;
					}
					break;
				case 'autoEnergyUpgrade':
					for (const upgrade of this.gameContent.upgrades.filter(upgrade => upgrade.realmID === 30)){
						upgrade.autoUnlocked = true;
						this.energyHeap.add(upgrade);
						upgrade.autoToggle = true;
					}
					break;
				case 'autoDivineUpgrade':
					for (const upgrade of this.gameContent.upgrades.filter(upgrade => upgrade.realmID === 40)){
						upgrade.autoUnlocked = true;
						this.divineHeap.add(upgrade);
						upgrade.autoToggle = true;
					}
					break;

				//NON-AUTOMATION SUPER UPGRADE HANDLING
				case 'modifyPlayerValue':
					this.eventManager.dispatchEvent('updatePlayerCurrencyMult', { valueType: feature.specialVar1, valueAmount: feature.specialVar2 });
					break;
				case 'unspentCurrency':
					this.gameContent.player.synergyUpgrades[feature.specialVar1] = new Decimal(feature.specialVar2);
					break;
				case 'levelsAddLevels':
					let target = this.findObjectById(feature.specialVar2);
					let targetsTarget = this.findObjectById(feature.specialVar1);
					let calcType = feature.specialVar3;
					let calcValue = feature.prodBase;
					target.addLevelsAddLevelsTarget(targetsTarget,calcType,calcValue);
					break;
				case 'evolveRealm':
					let targetRealm = this.findObjectById(feature.specialVar1);
					targetRealm.evolve();
					break;
				default:
					// console.error("Error - forgeUpgrade prodType not found");
			}
		}
	}

	deductFeatureCost(feature,purchaseCount = null) {
		let cost = feature.costNext;
		if (purchaseCount){
			cost = feature.calculateCostN(purchaseCount);
		}
		
		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: feature.costType,
			value: cost,
			operation: 'subtract'
		});
	}

	calculateIncome(deltaTime) {
		for (const chain of this.gameContent.generatorChains) {
			if (chain.active) {
				chain.calculateChain(this, deltaTime);
			}
		}
		this.gameContent.player.updateCurrencySynergyMultipliers();

		this.gameContent.player.addIncomes(deltaTime);
		
		this.gameContent.player.calculatePowerLevel(deltaTime);

		this.gameContent.player.updateLifetimeValues(deltaTime);
		
		this.processAutobuying();


		//reduce zone and fight time based on power level and timeModifier upgrades
		const powerFactor = new Decimal(1).plus(this.gameContent.player.powerLevel.plus(1).ln().times(0.001));
		const timeModifier = this.gameContent.player.timeModifierUpgrade;

		for(const zone of this.gameContent.zones){
			zone.conquestTime = zone.baseConquestTime.div(powerFactor).div(timeModifier);
		}

		//reduce fighter conquest time based on power level
		for(const fighter of this.gameContent.fighters){
			fighter.fightTime = fighter.baseFightTime.div(powerFactor).div(timeModifier);
		}
	}

	processAutobuying(){
		let force = this.queryPlayerValue('force');
		let wisdom = this.queryPlayerValue('wisdom');
		let energy = this.queryPlayerValue('energy');
		let divine = this.queryPlayerValue('divine');

		this.autoTournamentProgression();
		this.autoConquestProgression();
		this.autobuyArtifacts();
		this.autobuy(force, "force");
		this.autobuy(wisdom, "wisdom");
		this.autobuy(energy, "energy");
		this.autobuy(divine, "divine");
	}

	autoConquestProgression(){
		if (!this.gameContent.worldManager.autoUnlocked){
			return;
		}
		for (const zone of this.gameContent.zones){
			if (zone.isConquesting || !zone.active || zone.isDefeated){
				continue;
			}
			else {
				let currentResource = this.queryPlayerValue(zone.costType);

				if (currentResource.gte(zone.costNext)) {
					zone.startConquest();
				}
			}
		}
	}

	autoTournamentProgression(){
		if (!this.gameContent.tournament.autoUnlocked){
			return;
		}

		for (const fighter of this.gameContent.tournament.fighters){
			if (fighter.isDefeated || fighter.isFighting || !fighter.active){
				continue;
			}
			else {
				let currentResource = this.queryPlayerValue(fighter.costType);

				if (currentResource.gte(fighter.costNext)) {
					this.eventManager.dispatchEvent('startFight', (fighter.id));
				}
			}
		}
	}

	autobuy(resource, resourceType) {
		let minHeap;
		switch(resourceType){
			case 'force':
				minHeap = this.forceHeap;
				break;
			case 'wisdom':
				minHeap = this.wisdomHeap;
				break;
			case 'energy':
				minHeap = this.energyHeap;
				break;
			case 'divine':
				minHeap = this.divineHeap;
				break;
		}

		if (minHeap.heap.length === 0){
			return;
		}

		//accomodate constantly fluctuating costs
		minHeap.refresh();
		// Print Tree in supposedly cost order
		// let str = "";
		// for (const item of minHeap.heap){
		// 	str += item.costNext + ", ";
		// }
		// console.error(str);

		let tempResource = new Decimal(resource);
		let purchased = true;

		while (purchased) {
			let feature = minHeap.peek();
			
			//continue if can afford one
			if (feature.costNextSingle.lte(tempResource)){
				let ratio = tempResource.div(feature.costNextSingle);
				let purchaseCount = Decimal.max(1, ratio.plus(1).log(2)).floor();
				if (ratio.gte(10)){
					while (purchaseCount.gt(1) && feature.calculateCostN(purchaseCount).gt(tempResource)) {
						purchaseCount = purchaseCount.minus(1);
					}
				}
				
				//reduce purchase level if will push feature to max
				if (purchaseCount.gt(feature.maxLevel.minus(feature.level))){
					purchaseCount = feature.maxLevel.minus(feature.level);
					feature.costNext = feature.calculateCostN(purchaseCount);
					feature.prodNext = feature.calculateProdN(purchaseCount);
					feature.nextLevelIncrement = purchaseCount;

					tempResource = tempResource.minus(feature.costNext);
					this.handlePurchase(feature.id, purchaseCount);

					//removed maxed feature from heap
					minHeap.poll();
					break;
				}

				//set feature levels before purchasing
				feature.costNext = feature.calculateCostN(purchaseCount);
				feature.prodNext = feature.calculateProdN(purchaseCount);

				//troubleshooting autobuying to negative
				if (feature.costNext.gt(tempResource)){
					// console.error(feature.name,feature.costNext,tempResource);
					break;
				}

				feature.nextLevelIncrement = purchaseCount;
				tempResource = tempResource.minus(feature.costNext);
				this.handlePurchase(feature.id, purchaseCount);

				minHeap.poll();
				if (feature.level.neq(feature.maxLevel)){
					minHeap.add(feature);
				}
			}
			else {
				purchased = false;
			}
		}
	}

	queryPlayerValue(type) {
		const properties = [
			// currencies
			'force', 'wisdom', 'energy', 'divine', 'essence', 'skillpoint', 'crystal', 'radiance', 'powerLevel', 
		
			// lifetime stats
			'lifetimeForceEarned', 'lifetimeWisdomEarned', 'lifetimeEnergyEarned', 'lifetimeDivineEarned', 'lifetimeCrystalEarned', 'lifetimeEssenceEarned','totalPlaytime',
			
			//exploration stats
			'maxProgressionWorld','maxProgressionRegion','lifetimeZoneCompletions','lifetimeRegionProgressions',
			
			//tournament stats
			'maxTournamentRank','lifetimeKills'
		];

		if (type === 'all') {
			let allResources = [];
			properties.forEach(prop => {
				if (prop in this.gameContent.player) {
					allResources.push({ 'type': prop, 'value': this.gameContent.player[prop] });
				}
			});
			this.gameContent.player.shards.forEach((value, key) => allResources.push({ 'type': key, 'value': value }));
			return allResources;
		} 
		else if (properties.includes(type) && type in this.gameContent.player) {
			return this.gameContent.player[type];
		} 
		else if (this.gameContent.player.shards.has(type)) {
			return this.gameContent.player.shards.get(type);
		}
	}

	findObjectById(id) {
		let object = this.gameContent.idToObjectMap.get(id);
		return object;
	}
}

class EventManager {
	constructor() {
		this.listeners = {};
	}

	// Register an event listener
	addListener(eventType, callback) {
		if (!this.listeners[eventType]) {
			this.listeners[eventType] = [];
		}
		this.listeners[eventType].push(callback);
	}

	// Remove an event listener
	removeListener(eventType, callback) {
		if (this.listeners[eventType]) {
			const index = this.listeners[eventType].indexOf(callback);
			if (index > -1) {
				this.listeners[eventType].splice(index, 1);
			}
		}
	}

	// Dispatch an event to all registered listeners
	dispatchEvent(eventType, eventData, handleResult) {
		if (this.listeners[eventType]) {
			this.listeners[eventType].forEach(callback => {
				if (typeof handleResult === 'function') {
					callback(eventData, handleResult);
				} else {
					callback(eventData);
				}
			});
		}
	}

	dispatchQuery(eventType, eventData) {
		return new Promise((resolve) => {
			this.dispatchEvent(eventType, eventData, resolve);
		});
	}

	clearAllListeners() {
		for (let eventType in this.listeners) {
			delete this.listeners[eventType];
			// this.listeners[eventType] = [];
		}
	}
	
}

class GameContent {
	constructor(eventManager) {
		this.idToObjectMap = new Map();

		this.realms = [];
		this.trainings = [];
		this.upgrades = [];
		this.generators = [];
		this.generatorChains = [];
		this.eventManager = eventManager;
		this.player = new Player(eventManager);
		this.skillTree = new SkillTree(eventManager);
		this.skills = [];
		this.unlocks = new Map();
		this.essenceUpgrades = [];
		this.forgeUpgrades = [];
		this.radianceUpgrades = [];

		this.achievementsGrid = new AchievementGrid(eventManager);
		this.achievementSets = [];
		this.achievements = [];

		this.unlockManager;

		this.worldManager = new WorldManager(eventManager);
		this.worlds = [];
		this.regions = [];
		this.zones = [];
		
		this.artifacts = [];

		this.tournament;
		this.fighters = [];
		this.fighterTiers = [];

		this.mods = [];

		this.tabs = [];
	}
}

class Player {
	constructor(eventManager) {
		this.eventManager = eventManager;
		this.powerLevel = new Decimal(5);

		this.baseForce = new Decimal(20000);
		this.force = this.baseForce;
		this.forceIncome = new Decimal(0);
		this.forceSynergyMult = new Decimal(1);
		this.baseForcePowerLevelMultiplier = new Decimal(1);
		this.forcePowerLevelMultiplier = this.baseForcePowerLevelMultiplier;
		this.powerLevelFromForce = new Decimal(0);

		this.baseWisdom = new Decimal(0);
		this.wisdom = this.baseWisdom;
		this.wisdomIncome = new Decimal(0);
		this.wisdomSynergyMult = new Decimal(1);
		this.baseWisdomPowerLevelMultiplier = new Decimal(10);
		this.wisdomPowerLevelMultiplier = this.baseWisdomPowerLevelMultiplier;
		this.powerLevelFromWisdom = new Decimal(0);

		this.baseEnergy = new Decimal(0);
		this.energy = this.baseEnergy;
		this.energyIncome = new Decimal(0);
		this.energySynergyMult = new Decimal(1);
		this.baseEnergyPowerLevelMultiplier = new Decimal(100);
		this.energyPowerLevelMultiplier = this.baseEnergyPowerLevelMultiplier;
		this.powerLevelFromEnergy = new Decimal(0);

		this.baseDivine = new Decimal(0);
		this.divine = this.baseDivine;
		this.divineIncome = new Decimal(0);
		this.divineSynergyMult = new Decimal(1);
		this.baseDivinePowerLevelMultiplier = new Decimal(1000);
		this.divinePowerLevelMultiplier = this.baseDivinePowerLevelMultiplier;
		this.powerLevelFromDivine = new Decimal(0);
		
		this.forceIncomeDisplay = new Decimal(0);
		this.wisdomIncomeDisplay = new Decimal(0);
		this.energyIncomeDisplay = new Decimal(0);
		this.divineIncomeDisplay = new Decimal(0);
		

		this.timeModifierUpgrade = 1;
		
		this.synergyUpgrades = {
			unspentForceToWisdom: new Decimal(0),
			unspentForceToEnergy: new Decimal(0),
			unspentForceToDivine: new Decimal(0),
			unspentWisdomToForce: new Decimal(0),
			unspentWisdomToEnergy: new Decimal(0),
			unspentWisdomToDivine: new Decimal(0),
			unspentEnergyToForce: new Decimal(0),
			unspentEnergyToWisdom: new Decimal(0),
			unspentEnergyToDivine: new Decimal(0),
			unspentDivineToForce: new Decimal(0),
			unspentDivineToWisdom: new Decimal(0),
			unspentDivineToEnergy: new Decimal(0)
		};

		this.baseCrystal = new Decimal(0);
		this.crystal = this.baseCrystal;

		this.radiance = new Decimal(0);

		this.shards = new Map();
		this.shards.set("alphaShard", new Decimal(0));
		this.shards.set("betaShard", new Decimal(0));
		this.shards.set("gammaShard", new Decimal(0));
		this.shards.set("deltaShard", new Decimal(0));
		this.shards.set("epsilonShard", new Decimal(0));
		this.shards.set("zetaShard", new Decimal(0));
		this.shards.set("etaShard", new Decimal(0));
		this.shards.set("thetaShard", new Decimal(0));
		this.shards.set("iotaShard", new Decimal(0));
		this.shards.set("kappaShard", new Decimal(0));
		this.shards.set("lambdaShard", new Decimal(0));
		this.shards.set("muShard", new Decimal(0));
		this.shards.set("nuShard", new Decimal(0));


		this.baseEssence = new Decimal(0);
		this.essence = this.baseEssence;
		this.essenceIncome = new Decimal(0);

		this.baseSkillpoint = new Decimal(20);
		this.skillpoint = this.baseSkillpoint;


		this.lifetimeForceEarned = new Decimal(0);
		this.lifetimeWisdomEarned = new Decimal(0);
		this.lifetimeEnergyEarned = new Decimal(0);
		this.lifetimeDivineEarned = new Decimal(0);
		this.lifetimeEssenceEarned = new Decimal(0);
		this.lifetimeCrystalEarned = new Decimal(0);
		this.maxPowerLevelAchieved = new Decimal(0);
		
		this.lifetimeZoneCompletions = new Decimal(0);
		this.lifetimeRegionProgressions = new Decimal(0);
		this.lifetimeWorldProgressions = new Decimal(0);
		
		this.maxProgressionWorld = new Decimal(0);
		this.maxProgressionRegion = new Decimal(0);
		
		this.maxTournamentRank = new Decimal(101); //top rank within max stage
		this.lifetimeKills = new Decimal(0);

		this.lastRebirth1 = Date.now();
		this.lastSave = new Date();
		this.originalStartDateTime = new Date();
		
		this.totalPlaytime = new Decimal(0);

		this.eventManager.addListener('updatePlayerCurrencyMult', (data) => {
			this.updatePlayerCurrencyMult(data);
		});

		this.eventManager.addListener('updatePlayerProperty', data => {
			this.updatePlayerProperty(data.property, data.value, data.operation);
		});
	}
	
	addIncomes(deltaTime){
		this.calculateIncomeAndMultiplier('force', deltaTime);
		this.calculateIncomeAndMultiplier('wisdom', deltaTime);
		this.calculateIncomeAndMultiplier('energy', deltaTime);
		this.calculateIncomeAndMultiplier('divine', deltaTime);
	}

	calculateIncomeAndMultiplier(currency, deltaTime){
		let income = this[currency + 'Income'];
		let synergyMult = this[currency + 'SynergyMult'];
		
		let calculatedIncome = income.times(synergyMult).times(deltaTime);
		this[currency] = this[currency].plus(calculatedIncome);
		this[currency + 'IncomeDisplay'] = income.times(synergyMult);
	
		// also update lifetime values
		this['lifetime' + currency.charAt(0).toUpperCase() + currency.slice(1) + 'Earned'] = this['lifetime' + currency.charAt(0).toUpperCase() + currency.slice(1) + 'Earned'].plus(calculatedIncome);
	}

	updateCurrencySynergyMultipliers() {
		// Reset the multipliers to 1
		this.forceSynergyMult = new Decimal(1);
		this.wisdomSynergyMult = new Decimal(1);
		this.energySynergyMult = new Decimal(1);
		this.divineSynergyMult = new Decimal(1);
	
		const synergyMap = {
			'unspentForceToWisdom': { currency: 'wisdom', source: 'force' },
			'unspentForceToEnergy': { currency: 'energy', source: 'force' },
			'unspentForceToDivine': { currency: 'divine', source: 'force' },
			'unspentWisdomToForce': { currency: 'force', source: 'wisdom' },
			'unspentWisdomToEnergy': { currency: 'energy', source: 'wisdom' },
			'unspentWisdomToDivine': { currency: 'divine', source: 'wisdom' },
			'unspentEnergyToForce': { currency: 'force', source: 'energy' },
			'unspentEnergyToWisdom': { currency: 'wisdom', source: 'energy' },
			'unspentEnergyToDivine': { currency: 'divine', source: 'energy' },
			'unspentDivineToForce': { currency: 'force', source: 'divine' },
			'unspentDivineToWisdom': { currency: 'wisdom', source: 'divine' },
			'unspentDivineToEnergy': { currency: 'energy', source: 'divine' },
		};
	
		for (let synergy in this.synergyUpgrades) {
			let multiplier = this.synergyUpgrades[synergy];
	
			if (multiplier.gt(0)) {
				let { currency, source } = synergyMap[synergy];
				this[currency + 'SynergyMult'] = this[currency + 'SynergyMult'].times(this[source].times(multiplier));
			}
		}
	}
	
	calculatePowerLevel(deltaTime){
		let powerLevelAddedFromForce = this.forceIncome.times(this.forceSynergyMult).times(this.forcePowerLevelMultiplier).times(deltaTime);
		let powerLevelAddedFromWisdom = this.wisdomIncome.times(this.wisdomSynergyMult).times(this.wisdomPowerLevelMultiplier).times(deltaTime);
		let powerLevelAddedFromEnergy = this.energyIncome.times(this.energySynergyMult).times(this.energyPowerLevelMultiplier).times(deltaTime);
		let powerLevelAddedFromDivine = this.divineIncome.times(this.divineSynergyMult).times(this.divinePowerLevelMultiplier).times(deltaTime);
		
		this.powerLevel = this.powerLevel.plus(powerLevelAddedFromForce).plus(powerLevelAddedFromWisdom).plus(powerLevelAddedFromEnergy).plus(powerLevelAddedFromDivine);

		if (this.powerLevel.gt(this.maxPowerLevelAchieved)){
			this.maxPowerLevelAchieved = this.powerLevel;
		}
		
		this.powerLevelFromForce = this.powerLevelFromForce.plus(powerLevelAddedFromForce);
		this.powerLevelFromWisdom = this.powerLevelFromWisdom.plus(powerLevelAddedFromWisdom);
		this.powerLevelFromEnergy = this.powerLevelFromEnergy.plus(powerLevelAddedFromEnergy);
		this.powerLevelFromDivine = this.powerLevelFromDivine.plus(powerLevelAddedFromDivine);
	}

	updateLifetimeValues(deltaTime){
		this.lifetimeForceEarned = this.lifetimeForceEarned.plus(this.forceIncome.times(deltaTime));
		this.lifetimeWisdomEarned = this.lifetimeWisdomEarned.plus(this.wisdomIncome.times(deltaTime));
		this.lifetimeEnergyEarned = this.lifetimeEnergyEarned.plus(this.energyIncome.times(deltaTime));
		this.lifetimeDivineEarned = this.lifetimeDivineEarned.plus(this.divineIncome.times(deltaTime));
	}

	updatePlayerCurrencyMult(data){
		let valueType = data.valueType;
		let valueAmount = data.valueAmount;
	
		const valueTypeMap = {
			'forcePowerLevelMultiplier': { 'powerLevelFrom': 'powerLevelFromForce', 'multiplier': 'forcePowerLevelMultiplier' },
			'wisdomPowerLevelMultiplier': { 'powerLevelFrom': 'powerLevelFromWisdom', 'multiplier': 'wisdomPowerLevelMultiplier' },
			'energyPowerLevelMultiplier': { 'powerLevelFrom': 'powerLevelFromEnergy', 'multiplier': 'energyPowerLevelMultiplier' },
			'divinePowerLevelMultiplier': { 'powerLevelFrom': 'powerLevelFromDivine', 'multiplier': 'divinePowerLevelMultiplier' }
		};
	
		let mappedValues = valueTypeMap[valueType];
	
		if(mappedValues){
			//set power level from source to base level with no multiplier
			let newPowerLevelFromSource = this[mappedValues.powerLevelFrom].div(this[mappedValues.multiplier]);
	
			//update new multiplier
			this[mappedValues.multiplier] = this[mappedValues.multiplier].times(valueAmount);
	
			//calculate new power level contribution from source
			newPowerLevelFromSource = newPowerLevelFromSource.times(this[mappedValues.multiplier]);
	
			//subtract the old powerLevelFromSource value from overall powerLevel
			let newPowerLevel = this.powerLevel.minus(this[mappedValues.powerLevelFrom]);
	
			//add the new powerLevelFromSourceValue to power level
			newPowerLevel = newPowerLevel.plus(newPowerLevelFromSource);
	
			//update powerLevelFromSource and powerLevel with new values
			this[mappedValues.powerLevelFrom] = newPowerLevelFromSource;
			this.powerLevel = newPowerLevel;
		}
	}

	updatePlayerProperty(property, value, operation) {
		// Check if property is a shard
		if (this.shards.has(property)) {
			let currentShardValue = this.shards.get(property);
	
			if (operation === "add") {
				this.shards.set(property, currentShardValue.plus(value));
			} 
			else if (operation === "subtract") {
				if (currentShardValue.lt(value)) {
					console.error(`Not enough ${property} to subtract.`);
					return;
				}
				this.shards.set(property, currentShardValue.minus(value));
			}
		} 
		// If not a shard, check if it's a valid property
		else if (this.hasOwnProperty(property)) {
			let currentProperty = this[property];
			if (!(currentProperty instanceof Decimal)) {
				console.error(`Property ${property} is not a valid Decimal property.`);
				return;
			}
			if (operation === "add") {
				this[property] = currentProperty.plus(value);
			} 
			else if (operation === "subtract") {
				if (currentProperty.lt(value)) {
					console.error(`Not enough ${property} to subtract.`);
					return;
				}
				this[property] = currentProperty.minus(value);
			}
			else if (operation === "replaceIfGreater"){
				if (value.gt(currentProperty)) {
					this[property] = value;
				}
			}
			else if (operation === "replaceIfLesser"){
				if (value.lt(currentProperty)) {
					this[property] = value;
				}
			}
		} 
		// If it's not a valid property or shard, throw error
		else {
			console.error(`Property ${property} does not exist.`);
			return;
		}
	}
}

class Observable {
	constructor() {
		this.observers = [];
	}

	registerObserver(observer) {
		this.observers.push(observer);
	}

	unregisterObserver(observer) {
		const index = this.observers.indexOf(observer);
		if (index > -1) {
			this.observers.splice(index, 1);
		}
	}

	notifyObservers(data) {
		this.observers.forEach(observer => {
			if (observer.active) {
				observer.update(data);
			}
		});
	}

	unlockObserver(observerID) {
		this.observers.find(observer => observer.id === observerID).active = true;
	}
}

class Mod extends Observable {
	constructor(eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active, specialActivatorID) {
		super();
		this.eventManager = eventManager;
		this.id = id;
		this.name = name;
		this.type = type;
		this.priority = priority;

		this.source = null;

		this.sourceID = sourceID;
		this.sourceCalcType = sourceCalcType;

		this.target = null;
		this.targetID = targetID;
		this.runningCalcType = runningCalcType;
		this.targetType = targetType;

		this.baseValue = new Decimal(baseValue);
		this.value = new Decimal(baseValue);

		this.calcTreeReferences = [];

		this.active = active;

		this.specialActivatorID = specialActivatorID;
		this.specialActivator = null;
	}

	setActive() {
		this.active = true;
		this.source.updateObservers();
	}
}

class CalculationTreeNode {
	constructor(ref, parentTree) {
		this.ref = ref;
		this.priority = ref.priority;
		this.result = new Decimal(0);
		this.runningResult = new Decimal(0);

		this.parentTree = parentTree;

		this.previousNode = null;
		this.nextNode = null;
	}

}

class CalculationTree {
	constructor(parent, type) {
		this.nodes = [];
		this.parent = parent;
		this.type = type;
		this.currentRunningResult = new Decimal(0);
	}

	buildTree() {
		let firstActiveNode = this.setFirstActiveNode();
		if (!firstActiveNode) {
			if (this.type === "cost") {
				this.parent.costMult = this.parent.costMultBase;
			}
			else if (this.type === "production") {
				this.parent.prodMult = this.parent.prodMultBase;
			}
			return;
		}
		else {
			this.updateDownstreamNodes(firstActiveNode);
		}

		if (this.type === "cost") {
			this.parent.costMult = this.currentRunningResult;
		}
		else if (this.type === "production") {
			this.parent.prodMult = this.currentRunningResult;
		}
	}

	setFirstActiveNode() {
		let currentNode = this.nodes[0];

		let baseMult = new Decimal(0);
		if (this.type === "cost") {
			baseMult = this.parent.costMultBase;
		}
		else if (this.type === "production") {
			baseMult = this.parent.prodMultBase;
		}

		while (currentNode) {
			if (currentNode.ref.active && currentNode.ref.source.level.gt(0)) {
				currentNode.result = this.calcNodeResult(currentNode, currentNode.ref.source.level);
				currentNode.runningResult = this.calcNodeRunningResult(currentNode, baseMult);

				return currentNode;
			}

			currentNode = currentNode.nextNode;
		}
		return null;
	}

	updateDownstreamNodes(firstActiveNode) {
		let currentNode = firstActiveNode.nextNode;
		let lastActiveNode = firstActiveNode;
		while (currentNode) {
			if (currentNode.ref.active && currentNode.ref.source.level.gt(0)) {
				currentNode.result = this.calcNodeResult(currentNode, currentNode.ref.source.level);

				currentNode.runningResult = this.calcNodeRunningResult(currentNode, lastActiveNode.runningResult);

				lastActiveNode = currentNode;
			}
			currentNode = currentNode.nextNode;
		}
		this.currentRunningResult = lastActiveNode.runningResult;
	}

	calcNodeResult(node, sourceValue) {
		let val = new Decimal(node.ref.value);
		let srcVal = new Decimal(sourceValue);
		let calcType = node.ref.sourceCalcType;

		if (this.parent.featureType === "zone" && node.ref.sourceCalcType === 'mult') {
			return this.performCalculation(node.ref.sourceCalcType, val, srcVal);
		}

		if (node.ref.sourceCalcType === 'add' && this.type === "production") {
			srcVal = srcVal.minus(1);
		}

		if (node.ref.sourceCalcType === 'add' && this.type === "cost") {
			srcVal = srcVal.minus(1);
		}

		if (srcVal.eq(0)) {
			if (node.ref.sourceCalcType === 'sub') {
				srcVal = new Decimal(0);
			}
			else if (node.ref.sourceCalcType === 'exp') {
				srcVal = new Decimal(1);
			}
		}

		return this.performCalculation(calcType, val, srcVal);
	}

	calcNodeRunningResult(node, prevRunningResult) {
		let res = new Decimal(node.result);
		let prevRes = new Decimal(prevRunningResult);

		return this.performCalculation(node.ref.runningCalcType, res, prevRes);
	}

	performCalculation(type, val1, val2) {
		const CALCULATION_TYPES = {
			'add': (val1, val2) => val1.plus(val2),
			'sub': (val1, val2) => val2.minus(val1),
			'mult': (val1, val2) => val1.times(val2),
			'addPercent': (val1, val2) => (val1.div(100).plus(1)).times(val2),
			'subPercent': (val1, val2) => (new Decimal(1).minus(val1.div(100))).times(val2),
			'div': (val1, val2) => val2.dividedBy(val1),
			'exp': (val1, val2) => val2.pow(val1),
			'tetra': (val1, val2) => val2.tetrate(val1),
			'log': (val1, val2) => val2.eq(0) ? new Decimal(0) : val2.log(new Decimal(val1))
		}
		const calculation = CALCULATION_TYPES[type];

		if (!calculation) {
			throw new Error('Unknown calculation type: ' + type);
		}

		return calculation(val1, val2);
	}

	addNode(mod) {
		let newNode = new CalculationTreeNode(mod, this);
		let insertIndex = this.nodes.length;

		for (let i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].priority > newNode.priority) {
				insertIndex = i;
				break;
			}
		}

		this.nodes.splice(insertIndex, 0, newNode);

		if (insertIndex > 0) {
			newNode.previousNode = this.nodes[insertIndex - 1];
			this.nodes[insertIndex - 1].nextNode = newNode;
		}
		if (insertIndex < this.nodes.length - 1) {
			newNode.nextNode = this.nodes[insertIndex + 1];
			this.nodes[insertIndex + 1].previousNode = newNode;
		}
	}
}

class GameFeature extends Observable {
	constructor(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active = false, visible = false) {
		super();

		this.eventManager = eventManager;
		this.id = id;
		this.featureType = null;
		this.name = name;
		this.description = description;

		this.maxLevel = new Decimal(maxLevel);
		this.autoLevel = new Decimal(0);
		this.manualLevel = new Decimal(0);
		this.baseLevel = new Decimal(0);
		this.level = new Decimal(level);

		this.maxAffLvl = new Decimal(0);
		this.nextAffordableMilestoneLevel = new Decimal(0);
		this.nextMilestoneLevel = new Decimal(0);
		this.nextMilestoneMult = new Decimal(0);

		this.nextLevelIncrement = new Decimal(0);

		this.costType = costType;
		this.costGrowthRate = new Decimal(costGrowthRate);
		this.costMultBase = new Decimal(1);
		this.costMult = new Decimal(1);
		this.costBase = new Decimal(costBase);
		this.costNext = new Decimal(0);
		this.costNextSingle = this.calcCostNextSingle();

		this.prodType = prodType;
		this.prodGrowthRate = new Decimal(prodGrowthRate);
		this.prodMultBase = new Decimal(1);
		this.prodMult = new Decimal(1);
		this.prodPrevious = new Decimal(0);
		this.prodBase = new Decimal(prodBase);
		this.prodCurrent = new Decimal(0);
		this.prodNext = new Decimal(0);
		this.prodNextSingle = new Decimal(0);

		this.calcTreesMap = new Map();
		this.active = active;

		this.autoUnlocked = false;
		this.autoToggle = false;
		this.currentAutoHeap = null;

		this.levelsAddLevelsTargets = [];

		this.visible = visible;

	}

	calcGeometricSum(a, r, n) {
		var a_dec = new Decimal(a);
		var r_dec = new Decimal(r);
		var n_dec = new Decimal(n);

		var numerator = Decimal.sub(1, Decimal.pow(r_dec, n_dec));
		var denominator = Decimal.sub(1, r_dec);

		var n = Decimal.div(Decimal.mul(a_dec, numerator), denominator);
		return n;
	}

	calcCostNextSingle(){
		return new Decimal(this.costBase).mul(this.costMult).mul(Decimal.pow(this.costGrowthRate, this.manualLevel));
	}

	calculateMaxAffordable(resource, nextPurchaseCost) {
		var S_dec = new Decimal(resource);
		var a_dec = nextPurchaseCost; // pass the next purchase cost directly
		var r_dec = new Decimal(this.costGrowthRate);

		if (!r_dec.gt(1) || !S_dec.gte(a_dec)) {
			//console.error(this.name, 'Invalid inputs:', S_dec.toString(), a_dec.toString(), r_dec.toString());
			return new Decimal(0);
		}

		var inner = Decimal.mul(S_dec, Decimal.sub(r_dec, 1));
		inner = Decimal.div(inner, a_dec);
		inner = Decimal.add(inner, 1);

		if (inner.lt(0)) {
			//console.error(this.name, 'Negative inner:', inner.toString());
			return new Decimal(0);
		}

		var n = Decimal.log(inner, r_dec).floor();

		if (n.gt(this.maxLevel)) {
			n = this.maxLevel.minus(this.level);
		}

		return n;
	}

	calculateCostN(n, startLevel = this.manualLevel) {
		// var nextPurchaseCost = new Decimal(this.costBase).mul(this.costMult).mul(Decimal.pow(this.costGrowthRate, startLevel));
		var nextPurchaseCost = this.calcCostNextSingle();
		return this.calcGeometricSum(nextPurchaseCost, this.costGrowthRate, n);
	}

	calculateProdN(n, startLevel = this.level) {
		if (this.featureType === "generator") {
			return this.prodBase.times(this.level.plus(1)).times(this.prodGrowthRate).times(this.prodMult).times(n);
		}
		else {
			var nextPurchaseProduction = new Decimal(this.prodBase).mul(this.prodMult).mul(Decimal.pow(this.prodGrowthRate, startLevel));
			return this.calcGeometricSum(nextPurchaseProduction, this.prodGrowthRate, n);
		}
	}

	updateValuesMilestone() {
		this.setNextAffordableMilestoneLevel();
		if (this.nextAffordableMilestoneLevel) {
			let levelDif = this.nextAffordableMilestoneLevel.minus(this.level);
			this.costNext = this.calculateCostN(levelDif);
			this.prodNext = this.calculateProdN(levelDif);
			this.nextLevelIncrement = levelDif;
		}
		else {
			this.nextLevelIncrement = new Decimal(1);
			this.costNext = this.calculateCostN(1);
			this.prodNext = this.calculateProdN(1);
		}
	}

	updateValuesMax(resource) {
		// var nextPurchaseCost = new Decimal(this.costBase).mul(this.costMult).mul(Decimal.pow(this.costGrowthRate, this.manualLevel));
		var nextPurchaseCost = this.calcCostNextSingle();
		

		if (resource.lt(nextPurchaseCost)) {
			this.nextLevelIncrement = new Decimal(1);
			this.costNext = nextPurchaseCost;
			this.prodNext = this.calculateProdN(1);
			this.maxAffLvl = new Decimal(0);
			return;
		}
		this.maxAffLvl = this.calculateMaxAffordable(resource, nextPurchaseCost);
		this.nextLevelIncrement = this.maxAffLvl;
		this.costNext = this.calculateCostN(this.maxAffLvl);
		this.prodNext = this.calculateProdN(this.maxAffLvl);
	}

	updateValuesDigit(n) {
		// Adjust n if it would take the level above the max
		if ((n.plus(this.level)).gt(this.maxLevel)) {
			n = this.maxLevel.minus(this.level);
		}
		this.costNext = this.calculateCostN(n);
		if (this.prodType) {
			this.prodNext = this.calculateProdN(n);
		}
		this.nextLevelIncrement = n;
	}

	setActive() {
		this.active = true;
		this.visible = true;

		//this was here because skill unlocks would set connections to active, which would set their observesr to active and fuck up calc trees. now i have updateDownstreamNodes check if source level is gt(0) instead
		// if (this.level.gt(0)) {
			for (const observer of this.observers) {
				if (!observer.specialActivatorID){
					observer.active = true;
				}
				else if (observer.specialActivator === this){
					observer.active = true;
				}
			}
		// }
	}

	setInactive(){
		this.active = false;
	}

	deactivateObservers(){
		for (const observer of this.observers) {
			if (observer.active) {
				observer.active = false;
				for (const targetTree of observer.calcTreeReferences){
					targetTree.buildTree();
					this.eventManager.dispatchEvent('updateFeatureValues', { target: targetTree.parent, isNewLvl: false });
					
					this.eventManager.dispatchEvent('updateNewMultiplierValues', { feature: targetTree.parent });
				}
			}
		}
	}

	addLevelsAddLevelsTarget(target,calcType,calcValue){
		this.levelsAddLevelsTargets.push({target,calcType,calcValue,amountPurchased:new Decimal(0)});
		this.processLevelsAddLevelsTargets();
	}

	processLevelsAddLevelsTargets(){
		let amountToPurchase = new Decimal(0);
		for(const target of this.levelsAddLevelsTargets){
			if (target.calcType === "log"){
				amountToPurchase = this.level.log(target.calcValue);
				amountToPurchase = amountToPurchase.minus(target.amountPurchased);
				if (amountToPurchase.gt(0)){
					target.target.levelUp("auto",amountToPurchase);
					target.amountPurchased = target.amountPurchased.plus(amountToPurchase);
				}
			}
		}
	}

	levelUp(auto, count = null) {
		// if (this.level.gte(0)) {
		if (this.level.eq(0)) {
			// for (const observer of this.observers) {
			// 	observer.active = true;
			// }
			this.setActive();
		}

		if (auto === "manual") {
			let levelUpCount = this.nextLevelIncrement;
			if (count){
				levelUpCount = new Decimal(count);
			}
			this.manualLevel = this.manualLevel.plus(levelUpCount);
			this.level = this.level.plus(levelUpCount);
			this.costNextSingle = this.calcCostNextSingle();
		}
		else if (auto === "auto") {
			this.autoLevel = this.autoLevel.plus(count);
			this.level = this.level.plus(count);
		}

		// this.eventManager.dispatchEvent('check-unlocks');

		this.updateObservers();

		if (this.levelsAddLevelsTargets.length > 0){
			this.processLevelsAddLevelsTargets();
		}

		if (this.milestoneTiers && this.level.gte(this.nextMilestoneLevel)){
			this.setNextMilestoneLevel();
		}

		if (this.featureType === "artifact" && this.level.gte(this.maxLevel)){
			this.evolve();
		}

	}
	
	updateObservers() {
		for (const observer of this.observers) {
			if (!observer.active) continue;

			// Handle single target mods
			if (observer.source && observer.target && observer.target !== observer.source) {
				// ^ third condition is for essence upgrades to work
				observer.target.calcTreesMap.forEach((targetCalcTree) => {
					targetCalcTree.buildTree();
					if (targetCalcTree.parent.active) {
						this.eventManager.dispatchEvent('updateFeatureValues', { target: targetCalcTree.parent, isNewLvl: false });

						// this.eventManager.dispatchEvent('updateNewMultiplierValues', { feature: targetCalcTree.parent });

					}
				});
			}

			// Handle Type Target Mods
			else if (observer.targetType) {
				for (const targetCalcTree of observer.calcTreeReferences) {
					targetCalcTree.buildTree();
					if (targetCalcTree.parent.active) {
						this.eventManager.dispatchEvent('updateFeatureValues', { target: targetCalcTree.parent, isNewLvl: false });

						// this.eventManager.dispatchEvent('updateNewMultiplierValues', { feature: targetCalcTree.parent });
					}
				}
			}
		}
	}
	
	setNextMilestoneLevel(){
		// console.error(this.name);
		this.nextMilestoneLevel = this.milestoneTiers.find(tier => tier.gt(this.manualLevel));
		this.nextMilestoneMult = this.calcTreesMap.get("production").nodes.find(t => t.ref.name === this.id + "milestone" + this.nextMilestoneLevel.toString()).ref.value;
	}

	setNextAffordableMilestoneLevel() {
		for (let i = 0; i < this.milestoneTiers.length; i++) {
			let milestone = this.milestoneTiers[i];
			if (this.manualLevel.lt(milestone)) {
				this.nextAffordableMilestoneLevel = new Decimal(milestone);
				return;
			}
		}
		this.nextAffordableMilestoneLevel = null;
	}
}

class Generator extends GameFeature {
	constructor(eventManager, id, genChainID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active) {
		super(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
		this.featureType = "generator";
		this.genChainID = genChainID;
		this.parentGenChain = null;

		this.timeAdjustedPurchaseAmount = new Decimal(0);

		this.milestoneTiers = [];
		this.evolutionTier = evolutionTier;
		this.evolutions = [];
	}
	
	evolve() {
		// Find the evolution object with the next evolution tier
		const nextEvolution = this.evolutions.find(evo => evo.evolutionTier === this.evolutionTier + 1);
		
		if (nextEvolution) {
			this.evolutionTier = nextEvolution.evolutionTier;
			this.name = nextEvolution.name;
			this.description = nextEvolution.description;
			this.level = new Decimal(this.baseLevel);
			this.manualLevel = new Decimal(this.baseLevel);
			this.autoLevel = new Decimal(0);
			this.costBase = new Decimal(nextEvolution.costBase);
			this.costGrowthRate = new Decimal(nextEvolution.costGrowthRate);
			this.prodBase = new Decimal(nextEvolution.prodBase);
			this.prodGrowthRate = new Decimal(nextEvolution.prodGrowthRate);

			this.costNextSingle = this.calcCostNextSingle();

			this.nextMilestoneLevel = new Decimal(0);
			
			this.resetMilestoneUnlocks();
			
			this.resetRealmFeatureUnlocks();
			
			this.eventManager.dispatchEvent('updateFeatureValues', { target: this, isNewLvl: false });
		}
		else {
			console.log("Next evolution tier not found!");
		}
	}

	resetMilestoneUnlocks(){
		this.eventManager.dispatchEvent('reEngage-unlock', { detail: { id: this.id, type: "milestone" } });
	}
	
	resetRealmFeatureUnlocks(){
		this.eventManager.dispatchEvent('reEngage-unlock', { detail: { id: this.id, type: "realm-feature-unlock" } });
	}
}

class GeneratorChain {
	constructor(eventManager, id, name, realmID,active) {
		this.eventManager = eventManager;
		this.id = id;
		this.name = name;
		this.generators = [];
		this.realmID = realmID;
		this.realm = null;
		this.active = active;
	}

	//start at top node and work down auto-buying generators
	calculateChain(gameManager, deltaTime) {
		for (let i = this.generators.length - 2; i >= 0; i--) {
			const currentGen = this.generators[i];
			const nextGen = this.generators[i + 1];
	
			if (currentGen.active && nextGen.active && currentGen.level.gt(0)) {
				const deltaTimeAdjustedProduction = nextGen.prodCurrent.times(deltaTime);
	
				nextGen.timeAdjustedPurchaseAmount = nextGen.timeAdjustedPurchaseAmount.plus(deltaTimeAdjustedProduction);
	
				if (nextGen.timeAdjustedPurchaseAmount.floor().gte(1)) {
					currentGen.levelUp("auto", nextGen.timeAdjustedPurchaseAmount.floor());
					gameManager.updateFeatureValues(currentGen, true);
	
					nextGen.timeAdjustedPurchaseAmount = nextGen.timeAdjustedPurchaseAmount.minus(nextGen.timeAdjustedPurchaseAmount.floor());
				}
			}
		}
	}
}


class Training extends GameFeature {
	constructor(eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active) {
		super(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
		this.featureType = "training";
		this.realmID = realmID;
		this.realm = null;

		this.milestoneTiers = [];
		this.evolutionTier = evolutionTier;
		this.evolutions = [];
	}

	evolve() {
		// Find the evolution object with the next evolution tier
		const nextEvolution = this.evolutions.find(evo => evo.evolutionTier === this.evolutionTier + 1);
		
		if (nextEvolution) {
			this.evolutionTier = nextEvolution.evolutionTier;
			this.name = nextEvolution.name;
			this.description = nextEvolution.description;
			this.level = new Decimal(this.baseLevel);
			this.manualLevel = new Decimal(this.baseLevel);
			this.autoLevel = new Decimal(0);
			this.costBase = new Decimal(nextEvolution.costBase);
			this.costGrowthRate = new Decimal(nextEvolution.costGrowthRate);
			this.prodBase = new Decimal(nextEvolution.prodBase);
			this.prodGrowthRate = new Decimal(nextEvolution.prodGrowthRate);

			this.costNextSingle = this.calcCostNextSingle();

			this.nextMilestoneLevel = new Decimal(0);
			
			this.resetMilestoneUnlocks();
			
			this.resetRealmFeatureUnlocks();
			
			this.eventManager.dispatchEvent('updateFeatureValues', { target: this, isNewLvl: false });
		}
		else {
			console.log("Next evolution tier not found!");
		}
	}

	resetMilestoneUnlocks(){
		this.eventManager.dispatchEvent('reEngage-unlock', { detail: { id: this.id, type: "milestone" } });
	}
	
	resetRealmFeatureUnlocks(){
		this.eventManager.dispatchEvent('reEngage-unlock', { detail: { id: this.id, type: "realm-feature-unlock" } });
	}
	
}

class Upgrade extends GameFeature {
	constructor(eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active) {
		super(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
		this.featureType = "upgrade";
		this.realmID = realmID;

		
		this.evolutionTier = evolutionTier;
		this.evolutions = [];
	}

	evolve() {
		// Find the evolution object with the next evolution tier
		const nextEvolution = this.evolutions.find(evo => evo.evolutionTier === this.evolutionTier + 1);
		
		if (nextEvolution) {
			this.evolutionTier = nextEvolution.evolutionTier;
			this.name = nextEvolution.name;
			this.description = nextEvolution.description;
			this.level = new Decimal(this.baseLevel);
			this.manualLevel = new Decimal(this.baseLevel);
			this.autoLevel = new Decimal(0);
			this.costBase = new Decimal(nextEvolution.costBase);
			this.costGrowthRate = new Decimal(nextEvolution.costGrowthRate);
			this.prodBase = new Decimal(nextEvolution.prodBase);
			this.prodGrowthRate = new Decimal(nextEvolution.prodGrowthRate);
			
			this.costNextSingle = this.calcCostNextSingle();

			this.eventManager.dispatchEvent('updateFeatureValues', { target: this, isNewLvl: false });
		}
		else {
			console.log("Next evolution tier not found!");
		}
	}
}

class ForgeUpgrade extends GameFeature {
	constructor(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialVar1,specialVar2,specialVar3) {
		super(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
		this.featureType = "forgeUpgrade";
		this.specialVar1 = specialVar1;
		this.specialVar2 = specialVar2;
		this.specialVar3 = specialVar3;
	}
}

class EssenceUpgrade extends GameFeature {
	constructor(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialTargetID, parentID, angleFromParent,distanceFromParent, isUnlockedByParent) {
		super(
			eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active
		);
		this.specialTargetID = specialTargetID;
		this.target = null;
		this.featureType = "essenceUpgrade";

		this.isUnlockedByParent = isUnlockedByParent;
		//graphical and connection properties
		this.parentID = parentID;
		this.parent = null;
		this.angleFromParent = angleFromParent; // in degrees
		this.distanceFromParent = distanceFromParent; // distance from parent node in pixels
		this.children = [];
		this.x;
		this.y;
	}

	activateChildren(){
		if (this.children.length > 0){
			for (const child of this.children){
				if (child.isUnlockedByParent){
					child.setActive();
				}
			}
		}
	}
}

class RadianceUpgrade extends GameFeature {
	constructor(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialTargetID) {
		super(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
		this.specialTargetID = specialTargetID;
		this.target = null;
		this.featureType = "radianceUpgrade";
	}
}

class Realm {
	constructor(eventManager, id, type, name, description, active, startingResource) {
		this.eventManager = eventManager;
		this.id = id;
		this.type = type;
		this.name = name;
		this.description = description;
		this.active = active;
		this.trainings = [];
		this.upgrades = [];
		this.generatorChains = [];
		this.evolutionTier = new Decimal(0);

		this.startingResource = startingResource;
	}

	setActive() {
		this.active = true;
		// this.trainings.forEach(training => {
		// 	training.active = true;
		// });
		// this.upgrades.forEach(upgrade => {
		// 	upgrade.active = true;
		// });

		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: this.type,
			value: this.startingResource,
			operation: 'add'
		});
	}

	evolve(){
		this.evolutionTier = this.evolutionTier.plus(1);
		if (this.type === "force" || this.type === "energy"){
			for (const feature of this.trainings.concat(this.upgrades)){
				feature.evolve();
			}
		}
		else if (this.type === "wisdom" || this.type === "divine"){

			for (const feature of this.generatorChains[0].generators.concat(this.upgrades)){
				feature.evolve();
			}
		}
	}
}

class Skill extends GameFeature {
	constructor(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate,active, connections) {
		super(
			eventManager,
			id,
			name,
			description, // description
			level, // level
			maxLevel, // maxLevel
			costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate,
			active
		);
		this.featureType = "skill";
		this.connections = connections;
		this.unlockingID;
		this.unlockedConnections = [];
	}

	refundSkill(){
		this.level = new Decimal(0);
		this.manualLevel = new Decimal(0);
		this.costNextSingle = this.costBase;
		// this.active = false;

		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: this.costType,
			value: this.costBase,
			operation: 'add'
		});

		for (const connection of this.unlockedConnections) {
			this.eventManager.dispatchEvent('reEngage-unlock', { detail: { id: connection.id } });
			connection.active = false;
		}

		this.deactivateObservers();
	}
}

class SkillNode {
	constructor(skill, x, y) {
		this.skill = skill;
		this.x = x;
		this.y = y;
		this.connections = {
			north: null,
			east: null,
			south: null,
			west: null,
		};
	}
}

class SkillTree {
	constructor(eventManager) {
		this.eventManager = eventManager;
		this.skills = [];
	}

	refundAllSkills(){
		for(const skill of this.skills){
			if (skill.level.gt(0)){
			skill.refundSkill();
			}
		}
	}
}

class Achievement extends GameFeature {
	constructor(eventManager, id, name, description, unlockCategory, conditionType, dependentID, radianceReward, triggerType, triggerValue, conditionValue, setID) {
		super(eventManager, id, name, description, new Decimal(0), new Decimal(1), null, null, null, null, null, null, false);
		this.featureType = "achievement";

		this.unlockCategory = unlockCategory;
		this.conditionType = conditionType;
		this.conditionValue = conditionValue;
		this.triggerType = triggerType;
		this.triggerValue = triggerValue;
		
		this.dependentID = dependentID;
		this.dependent = null;

		this.radianceReward = new Decimal(radianceReward);

		this.isClaimable = false;
		this.isClaimed = false;

		this.setID = setID;
		this.set = null;
	}

	
	setActive(){
		this.isClaimable = true;
		super.setActive();
	}

	claim() {
		this.level = this.level.plus(1);
		this.isClaimed = true;
		this.active = true;

		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: 'radiance',
			value: this.radianceReward,
			operation: 'add'
		});

		this.set.checkCompletion();

		for (const observer of this.observers) {
			observer.active = true;
		}
		this.updateObservers();
	}
}

class AchievementSet extends GameFeature{
	constructor(eventManager,id, name, description, color, bonusType, bonusValue) {
		super(eventManager, id, name, description, new Decimal(0), new Decimal(1), null, null, null, null, null, null, false);
		this.eventManager = eventManager;
		this.id = id;
		this.name = name;
		this.color = color;
		this.achievements = [];
		this.bonusType = bonusType;
		this.bonusValue = bonusValue;

		this.completed = false;
	}
  
	checkCompletion() {
		// check if all achievements are claimed
		if (this.achievements.every(a => a.isClaimed)) {
			this.completed = true;
			this.applyBonus();
		}
	}
  
	applyBonus() {
		if (this.completed) {
			if (this.bonusType !== "mod"){
				this.eventManager.dispatchEvent('updatePlayerProperty', {
					property: this.bonusType,
					value: this.bonusValue,
					operation: 'add'
				});
			}
			else {
				this.levelUp("manual",new Decimal(1));
				this.updateObservers();
			}
		}
	}
}

class AchievementGrid {
	constructor(eventManager) {
		this.eventManager = eventManager;
		this.achievements = [];
		
		this.achievementSets = [];
	}
}

class WorldManager {
	constructor(eventManager) {
		this.eventManager = eventManager;

		this.worlds = [];
		this.isCompleted = false;
		this.isProgressed = false;
		this.autoUnlocked = false;
		this.currentWorld;
		this.currentRegion;
		this.worldsProgressed = new Decimal(0);
		this.regionsProgressed = new Decimal(0);
	}

	worldProgressed(){
		//check if all worlds are progressed, or set next world active
		const allWorldsProgressed = this.worlds.every(world => world.isProgressed);

		if (allWorldsProgressed) {
			this.setProgressed();
		}
		else {
			const nextWorld = this.worlds.find(world => !world.active);
			if (nextWorld) {
				nextWorld.setActive();
			}
		}

		
		this.worldsProgressed = this.worldsProgressed.plus(1);

		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: 'maxProgressionWorld',
			value: this.worldsProgressed,
			operation: 'replaceIfGreater'
		});
	}

	worldCompleted() {
		const allWorldsCompleted = this.worlds.every(world => world.isCompleted);

		if (allWorldsCompleted) {
			this.setCompleted();
		}
	}

	regionProgressed(){
		this.regionsProgressed = this.regionsProgressed.plus(1);

		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: 'maxProgressionRegion',
			value: this.regionsProgressed,
			operation: 'replaceIfGreater'
		});
	}

	setProgressed(){
		this.isProgressed = true;
	}

	setCompleted() {
		this.isCompleted = true;
	}
}

class World {
	constructor(eventManager, worldManager, id, name, active) {
		this.eventManager = eventManager;
		this.id = id;
		this.name = name;
		this.worldManager = worldManager;

		this.regions = [];
		this.fighterTier = null;

		this.active = active;
		this.visible = true;
		this.isCompleted = false;
		this.isProgressed = false;

		this.regionsProgressedCount = new Decimal(0);
		this.zonesProgressedCount = new Decimal(0);
		this.worldsProgressedCount = new Decimal(0);
	}

	setCompleted() {
		this.isCompleted = true;
		this.worldManager.worldCompleted();
	}

	setProgressed(){
		this.isProgressed = true;

		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: "lifetimeWorldProgressions",
			value: new Decimal(1),
			operation: 'add'
		});

		this.worldManager.worldProgressed();
	}

	setActive() {
		this.active = true;
		this.regions[0].setActive();
		if (this.fighterTier){
			this.fighterTier.worldSetActive();
		}
	}

	regionCompleted() {
		const allRegionsCompleted = this.regions.every(region => region.isCompleted);

		if (allRegionsCompleted) {
			this.setCompleted();
		}
	}

	regionProgressed(){
		//check if world is progressed or set next region active
		const allRegionsProgressed = this.regions.every(region => region.isProgressed);

		if (allRegionsProgressed) {
			this.setProgressed();
		}
		else {
			const nextRegion = this.regions.find(region => !region.active);
			if (nextRegion) {
				nextRegion.setActive();
			}
		}

		this.worldManager.regionProgressed();
	}
}

class Region {
	constructor(eventManager,id,worldID,name, shardType, active) {
		this.eventManager = eventManager;
		this.id = id;
		this.worldID = worldID;
		this.world = null;
		this.name = name;

		this.shardType = shardType;

		this.zones = [];

		this.active = active;
		this.isProgressed = false;
		this.isCompleted = false;
		this.visible = true;
	}

	setCompleted() {
		this.isCompleted = true;
		this.world.regionCompleted();
	}

	setProgressed(){
		this.isProgressed = true;
		
		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: "lifetimeRegionProgressions",
			value: new Decimal(1),
			operation: 'add'
		});

		this.world.regionProgressed();
	}

	setActive() {
		this.active = true;
		if (this.zones[0]){
			this.zones[0].setActive();
		}
	}

	checkAllZonesCompleted() {
		const allZonesDefeated = this.zones.every(zone => zone.isDefeated);
		if (allZonesDefeated) {
			this.setCompleted();
		}
	}
	
	zoneCompleted(zone){
		if (zone.zoneType === "boss" && !this.isProgressed){
			this.setProgressed();
		}
		
		if (!this.isCompleted){
			this.checkAllZonesCompleted();
		}
	}
}

class Zone extends GameFeature {
	constructor(eventManager, id, regionID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, baseConquestTime, active, zoneType, parentID, angleFromParent,distanceFromParent, isUnlockedByParent) {
		super(
			eventManager,
			id,
			name,
			description,
			level, maxLevel,
			costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate,
			active
		);
		this.featureType = "zone";
		this.regionID = regionID;
		this.region = null;
		this.isDefeated = false;
		this.defeatCount = new Decimal(0);
		this.baseConquestTime = new Decimal(baseConquestTime);
		this.conquestTime = new Decimal(baseConquestTime);
		this.isConquesting = false;
		this.zoneType = zoneType;

		this.repeatUnlocked = false;


		
		
		//graphical and connection properties
		this.isUnlockedByParent = isUnlockedByParent;
		// this.node = null;
		this.parentID = parentID;
		this.parent = null;
		this.angleFromParent = angleFromParent; // in degrees
		this.distanceFromParent = distanceFromParent; // distance from parent node in pixels
		this.children = [];
		this.x;
		this.y;

		
        this.elements = {
            cell: null,
            button: null,
            data: null
        };
	}

	setActive() {
		this.active = true;
	}

	startConquest() {
		if (this.isConquesting) {
			return;
		}
		if (this.defeatCount.eq(0)){
			this.eventManager.dispatchEvent('updatePlayerProperty', {
				property: this.costType,
				value: this.costNext,
				operation: 'subtract'
			});
		}
        this.isConquesting = true;

        let increment = 1 / (this.conquestTime * 1000 / 10); // This gives you the increment size every 10 ms.

        this.progress = 0;
        this.intervalId = setInterval(() => {
            this.progress += increment;
            if (this.progress >= 1) {
                this.progress = 0;
                clearInterval(this.intervalId); 
                this.isConquesting = false;
                this.handleConquestComplete();
            }
			this.eventManager.dispatchEvent('zoneConquestProgress', { zoneID: this.id, progress: this.progress });
        }, 10); // Update every 10 milliseconds
    }

	stopConquest() {
        this.eventManager.dispatchEvent('zoneConquestStopped', { zoneID: this.id });
        this.progress = 0;
        this.isConquesting = false;
        clearInterval(this.intervalId);
    }

	handleConquestComplete() {
		this.processRewards();
		if (!this.isDefeated){
			this.isDefeated = true;
			this.activateChildren();
		}
		this.defeatCount = this.defeatCount.plus(1);

		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: "lifetimeZoneCompletions",
			value: new Decimal(1),
			operation: 'add'
		});

	
		this.region.zoneCompleted(this);
		// this.eventManager.dispatchEvent('check-unlocks');
		this.eventManager.dispatchEvent('zoneConquestComplete', { zoneID: this.id });
	}

	processRewards() {
		if (this.defeatCount.eq(0)){
			
			if (this.zoneType === "boss"){
				this.eventManager.dispatchEvent('updatePlayerProperty', {
					property: 'skillpoint',
					value: new Decimal(1),
					operation: 'add'
				});
			}
			else if (this.zoneType === "sideBoss"){
			}

		}
		
		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: this.prodType,
			value: this.prodNext,
			operation: 'add'
		});

		this.prodPrevious = this.prodCurrent = this.prodNext;
	}

	activateChildren(){
		if (this.children.length > 0){
			for (const child of this.children){
				if (child.isUnlockedByParent){
					child.setActive();
				}
			}
		}
	}
}

class Tournament {
	constructor(eventManager, id) {
		this.eventManager = eventManager;
		this.id = id;
		this.fighterTiers = [];
		this.fighters = [];
		this.autoUnlocked = false;
		this.rank = 101;
	}

	handleFight(fighterId) {
		let fighterIndex = this.fighters.findIndex(fighter => fighter.id === fighterId);
		if (fighterIndex === -1) {
			console.error("fighter not found. no fight processed");
			return;
		}
	
		let fighter = this.fighters[fighterIndex];
		if(!fighter.isDefeated){
			fighter.setDefeated();
			this.rank = this.fighters.length - (fighter.id - 901);

			this.eventManager.dispatchEvent('updatePlayerProperty', {
				property: 'maxTournamentRank',
				value: new Decimal(this.rank),
				operation: 'replaceIfLesser'
			});
		}
	
		// Check that the next fighter index is within the bounds of the fighters array
		if (fighterIndex + 1 < this.fighters.length) {
			// if next fighter is in next tier
			if (this.fighters[fighterIndex + 1].tier !== fighter.tier){
				let tierIndex = this.fighterTiers.findIndex(fighterTier => fighterTier.tier === fighter.tier);
				if (this.fighterTiers.length > tierIndex + 1){
					this.fighterTiers[tierIndex].setComplete();
					this.fighterTiers[tierIndex + 1].setPrevTierComplete();
				}
			}
			else {
				// If the next fighter isn't active yet, activate it
				if (!this.fighters[fighterIndex + 1].active) {
					this.fighters[fighterIndex + 1].active = true;
				}
			}
		}
	
		// this.eventManager.dispatchEvent('check-unlocks');
	}
}

class FighterTier {
	constructor(eventManager, id, tier, worldID){
		this.eventManager = eventManager;
		this.id = id;
		this.worldID = worldID;

		this.fighters = [];

		this.world = null;

		this.tier = tier;

		this.isCompleted = false;

		this.worldActive = false;
		this.prevTierComplete = false;
		this.active = false;

		this.visible = false;
	}

	setComplete(){
		this.isCompleted = true;
		//award / improve headband
	}

	worldSetActive(){
		this.worldActive = true;
		this.checkActive();
	}

	setPrevTierComplete(){
		this.prevTierComplete = true;
		this.checkActive();
	}

	checkActive(){
		if (this.worldActive && this.prevTierComplete){
			this.setActive();
		}
	}

	setActive(){
		this.visible = true;
		this.active = true;
		this.fighters[0].active = true;
		for (const fighter of this.fighters){
			fighter.visible = true;
		}
	}
}

class Fighter extends GameFeature {
	constructor(eventManager, id, name, description, tier, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, baseFightTime, active, visible) {
		super(
			eventManager,
			id,
			name,
			description,
			level, maxLevel,
			costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate,
			active,
			visible
		);
		this.featureType = "fighter";
		this.tier = tier;
		this.fighterTier = null;
		this.isDefeated = false;
		this.defeatCount = new Decimal(0);
		this.baseFightTime = new Decimal(baseFightTime);
		this.fightTime = new Decimal(baseFightTime);
		this.isFighting = false;
	}

	setDefeated() {
		this.isDefeated = true;
		this.active = false;
		
		this.defeatCount = this.defeatCount.plus(1);
		
		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: this.prodType,
			value: this.prodNext,
			operation: 'add'
		});

		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: 'lifetimeCrystalEarned',
			value: this.prodNext,
			operation: 'add'
		});

		
		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: "lifetimeKills",
			value: new Decimal(1),
			operation: 'add'
		});

		this.prodPrevious = this.prodCurrent = this.prodNext;
	}
}

class Artifact extends GameFeature {
	constructor(eventManager, id, name, evolutionTier, gearType, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, nextEvolveID, active, visible) {
		super(
			eventManager,
			id,
			name,
			description,
			level, maxLevel,
			costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate,
			active,
			visible
		);
		this.featureType = "artifact";
		this.unlocked = false;
		this.gearType = gearType;
		this.evolutionTier = evolutionTier;
		
		this.milestoneTiers = [];

		this.evolved = false;
		this.previousEvolution = null;
		this.nextEvolveID = nextEvolveID;
		this.nextEvolveRef;
	}

	evolve(){
		if (this.nextEvolveID){
			this.active = false;
			this.visible = false;
			this.setInactive();
			this.deactivateObservers();

			this.nextEvolveRef.setActive();

			this.evolved = true;
		}
	}
}

class RewardManager {
	constructor(eventManager, gameManager) {
		this.eventManager = eventManager;
		this.gameManager = gameManager;
		
		// Initialize last reward times to current time
		this.lastHourlyRewardTime = new Date().getTime();
		this.lastDailyRewardTime = new Date().getTime();

		this.oneHourInMilliseconds = 3600 * 1000;
		this.oneDayInMilliseconds = 24 * this.oneHourInMilliseconds;

		this.baseDailyRewardValue = new Decimal(100);
		this.dailyRewardValue = this.baseDailyRewardValue;
		this.dailyRewardType = "radiance";

		this.dailyRewardClaimable = false;
		this.hourlyRewardClaimable = false;

		this.baseHourlyRewardValue = new Decimal(10);
		this.hourlyRewardValue = this.baseHourlyRewardValue;
		this.hourlyRewardType = "radiance";

		this.currentHourlyRewardsClaimable = new Decimal(0);
		this.baseHourlyRewardCap = new Decimal(4);
		this.hourlyRewardCap = this.baseHourlyRewardCap;
	}

	processBoost(){
		console.error("boost");
	}

	checkRewards() {
		let currentTime = Date.now();
		
		//check hourly reward
		if (currentTime - this.lastHourlyRewardTime >= this.oneHourInMilliseconds && this.currentHourlyRewardsClaimable.lt(this.hourlyRewardCap)) {

			this.currentHourlyRewardsClaimable = this.currentHourlyRewardsClaimable.plus(1);

			this.hourlyRewardClaimable = true;	
			
			// Update last hourly reward time
			this.lastHourlyRewardTime = currentTime;
		}

		//check daily reward
		if (currentTime - this.lastDailyRewardTime >= this.oneDayInMilliseconds) {
			this.dailyRewardClaimable = true;
			
			// Update last daily reward time
			this.lastDailyRewardTime = currentTime;
		}
	}

	giveHourlyReward() {
		//reset time if rewards were capped
		if (this.currentHourlyRewardsClaimable.eq(this.hourlyRewardCap)){
			this.lastHourlyRewardTime = Date.now();
		}

		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: this.hourlyRewardType,
			value: this.hourlyRewardValue,
			operation: 'add'
		});

		this.currentHourlyRewardsClaimable = this.currentHourlyRewardsClaimable.minus(1);

		if (this.currentHourlyRewardsClaimable.eq(0)){
			this.hourlyRewardClaimable = false;
		}
	}

	giveDailyReward() {
		this.lastDailyRewardTime = Date.now();

		this.eventManager.dispatchEvent('updatePlayerProperty', {
			property: this.dailyRewardType,
			value: this.dailyRewardValue,
			operation: 'add'
		});
		this.dailyRewardClaimable = false;
	}

	checkHourlyReward() {
		//do not increment time if capped claimable
		if (this.currentHourlyRewardsClaimable.eq(this.hourlyRewardCap)){
			return this.oneHourInMilliseconds;
		}
        let currentTime = Date.now();
        
        let timeSinceLastReward = currentTime - this.lastHourlyRewardTime;
        if (timeSinceLastReward >= this.oneHourInMilliseconds) {
            return 0;  // The reward is ready to claim
        } else {
            return this.oneHourInMilliseconds - timeSinceLastReward;  // Return time left until next reward
        }
    }

    checkDailyReward() {
		//do not increment time if claimable
		if (this.dailyRewardClaimable === true){
			return this.oneDayInMilliseconds;
		}

        let currentTime = Date.now();
        
        let timeSinceLastReward = currentTime - this.lastDailyRewardTime;
        if (timeSinceLastReward >= this.oneDayInMilliseconds) {
            return 0;  // The reward is ready to claim
        } else {
            return this.oneDayInMilliseconds - timeSinceLastReward;  // Return time left until next reward
        }
    }
}

// class Benchmark {
//     constructor() {
//         this.timings = {};
//         this.startTime = {};
//         this.reportTimeouts = {};
//         this.reportIntervals = {};
//     }

//     start(label, reportInterval) {
//         this.startTime[label] = performance.now();

//         if (reportInterval) {
//             this.reportIntervals[label] = reportInterval;
//             if (!this.reportTimeouts[label]) {
//                 this.scheduleReport(label);
//             }
//         }
//     }

//     stop(label) {
//         if (!this.startTime[label]) {
//             console.warn(`No start time for label: ${label}`);
//             return;
//         }

//         const endTime = performance.now();

//         if (!this.timings[label]) {
//             this.timings[label] = [];
//         }

//         this.timings[label].push(endTime - this.startTime[label]);
//     }

//     average(label) {
//         if (!this.timings[label] || this.timings[label].length < 1) {
//             return null;
//         }

//         const sum = this.timings[label].reduce((acc, curr) => acc + curr, 0);
//         return sum / this.timings[label].length;
//     }

//     report(label) {
//         if (!this.timings[label]) {
//             console.warn(`No timings for label: ${label}`);
//             return;
//         }

//         console.log(`Average time for ${label}: ${this.average(label)} ms`);
//         this.scheduleReport(label);
//     }

//     scheduleReport(label) {
//         clearTimeout(this.reportTimeouts[label]);
//         this.reportTimeouts[label] = setTimeout(() => {
//             this.report(label);
//         }, this.reportIntervals[label]);
//     }
// }

class Tab {
	constructor(eventManager, id, name, visible, active, initialUnlockedFeatureIDs, initialUnlockedSubTabs = null, parentTab = null){
		this.eventManager = eventManager;
		this.id = id;
		this.name = name;
		this.visible = visible;
		this.active = active;
		this.initialUnlockedFeatureIDs = initialUnlockedFeatureIDs;
		this.initialUnlockedFeatureRefs = [];
		this.initialUnlockedSubTabs = initialUnlockedSubTabs;
		this.button = null;
		this.subTabs = [];
		this.parentTab = parentTab;

		this.currentSubTab = null;
	}

	setActive(){
		this.active = true;
		this.visible = true;
		if (this.initialUnlockedFeatureRefs){
			for (const feature of this.initialUnlockedFeatureRefs){
				feature.setActive();
				feature.visible = true;
			}
		}

		//slight delay so that css properties have time to update when checking for visible tabs
		setTimeout(() => {
			this.eventManager.dispatchEvent('updateHotkeyButtons');
		}, 100);
	}
}