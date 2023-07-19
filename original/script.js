/* global Decimal */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game object when the DOM is fully loaded
    const game = new Game();
});

class Game {
    constructor() {
        this.eventManager = new EventManager();
        this.eventManager.addListener('loadGameState', this.restart.bind(this));

        this.init(-1);

        this.lastIncomeUpdate = performance.now();
        this.incomeUpdateInterval = 1000; // 1 second
        this.uiUpdateInterval = 100; // 100ms
        this.lastUnlockCheck = performance.now();
        this.unlockCheckInterval = 200;

        this.running = true;
        this.gameLoop();
    }

    init(state) {
        this.settings = new GameSettings();
        this.gameManager = new GameManager(this.eventManager);
        this.unlockManager = new UnlockManager(this.gameManager, this.eventManager);
        this.builder = new Builder(this.eventManager, this.gameManager, this.unlockManager);
        this.gameStateManager = new GameStateManager(this.eventManager, this.gameManager, this.builder);
        this.ui = new GameUI(this.eventManager, this.gameManager, this.gameStateManager);

        this.gameStateManager.gameStateLoader(state);
        
        this.running = true;
    }

    restart(reset) {
        this.running = false;
        this.ui.clear();
        this.init(reset);
        this.lastIncomeUpdate = performance.now();
        this.lastUnlockCheck = performance.now();
    }

    gameLoop() {
        if (!this.running) {
            return;
        }
        this.updateIncome();
        this.checkUnlockConditions();
        this.updateUI();
    }

    updateIncome() {
        const currentTime = performance.now();

        // Update Stat Incomes every 1 second
        if (currentTime - this.lastIncomeUpdate >= this.incomeUpdateInterval) {
            this.gameManager.calculatePlayerIncome();
            this.gameManager.updateAllMaxCaches();
            this.lastIncomeUpdate = currentTime;
        }
    }

    checkUnlockConditions() {
        const currentTime = performance.now();
        // Check unlocks every 100 ms
        if (currentTime - this.lastUnlockCheck >= this.unlockCheckInterval) {
            this.unlockManager.checkUnlockConditions();
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
}

class GameStateManager {
    constructor(eventManager, gameManager, builder) {
        this.eventManager = eventManager;
        this.gameManager = gameManager;
        this.builder = builder;
    }

    loadGameState(num) {
        this.eventManager.dispatchEvent('loadGameState', num);
    }

    saveGameState(num) {
        const gameData = {};

        gameData.saveTimeStamp = Date.now();

        if (!gameData.playerData) {
            gameData.playerData = {};
        }
        switch (num) {
            case 0:
                this.saveFullGameState(gameData);
                break;
            case 1:
                this.saveRebirthState1(gameData);
                break;
            case 2:
                this.saveRebirthState3(gameData);
                break;
            case 2:
                this.saveRebirthState3(gameData);
                break;
        }


        //populate items that are APPLICABLE TO ALL SAVE STATES (inluding regular save)
        //player lifetime data
        //achievements and their associated unlocks/perks/mods
        //settings
        gameData.playerData.lifetimeEssenceEarned = this.gameManager.gameContent.player.lifetimeEssenceEarned.toString();
        gameData.playerData.lifetimePowerEarned = this.gameManager.gameContent.player.lifetimePowerEarned.toString();
        gameData.playerData.lifetimeSpiritEarned = this.gameManager.gameContent.player.lifetimeSpiritEarned.toString();


        const gameDataJson = JSON.stringify(gameData);
        localStorage.setItem('saveGame', gameDataJson);

        if (num > 0) {
            this.loadGameState(num);
        }
    }

    saveFullGameState(gameData) {
        gameData.trainings = this.builder.trainings.map(training => ({
            id: training.id,
            level: training.level.toString(),
            active: training.active
        }));

        gameData.upgrades = this.builder.upgrades.map(upgrade => ({
            id: upgrade.id,
            level: upgrade.level.toString(),
            active: upgrade.active
        }));

        gameData.skills = this.builder.skills.map(skill => ({
            id: skill.id,
            level: skill.level.toString(),
            active: skill.active
        }));

        gameData.mods = this.builder.mods.map(mod => ({
            id: mod.id,
            active: mod.active,
        }));

        gameData.fighters = this.builder.fighters.map(fighter => ({
            id: fighter.id,
            active: fighter.active,
            isDefeated: fighter.isDefeated,
        }));

        gameData.stages = this.builder.stages.map(stage => ({
            id: stage.id,
            active: stage.active,
            isCompleted: stage.isCompleted,
        }));

        gameData.realms = this.builder.realms.map(realm => ({
            id: realm.id,
            active: realm.active,
        }));

        gameData.incompleteUnlocks = this.builder.unlockManager.unlocks.map(unlock => ({
            id: unlock.id,
        }));
        gameData.completedUnlocks = this.builder.unlockManager.completedUnlocks.map(unlock => ({
            id: unlock.id,
        }));

        gameData.playerData = {
            power: this.gameManager.gameContent.player.power.toString(),
            spirit: this.gameManager.gameContent.player.spirit.toString(),
            essence: this.gameManager.gameContent.player.essence.toString(),
            skillpoint: this.gameManager.gameContent.player.skillpoint.toString()
        };
    }

    saveRebirthState1(gameData) {
        this.calculateRebirth1();

        if (this.gameManager.gameContent.player.essence.gt(0)) {
            gameData.playerData.essence = this.gameManager.gameContent.player.essence.toString();
        }

        let rebirth1PseudoObject = this.gameManager.findObjectById(60000);

        gameData.rebirth1PseudoObject = {
            id: rebirth1PseudoObject.id,
            level: rebirth1PseudoObject.level.toString(),
            active: rebirth1PseudoObject.active
        }
        //essence purchases
        //esesnce perks/etc.

    }

    calculateRebirth1() {
        let rebirth1PseudoObject = this.gameManager.findObjectById(60000);
        let powerLevel = this.gameManager.gameContent.player.powerLevel;
        //for every 1000 powerlevel, give 1 essence
        let essenceGain = new Decimal(powerLevel.div(1000));

        this.gameManager.gameContent.player.essence = this.gameManager.gameContent.player.essence.plus(essenceGain);


        this.gameManager.gameContent.player.lifetimeEssenceEarned = this.gameManager.gameContent.player.lifetimeEssenceEarned.plus(essenceGain);

        rebirth1PseudoObject.level = rebirth1PseudoObject.level.plus(this.gameManager.gameContent.player.essence).round();
    }

    saveRebirthState2(gameData) {

    }

    saveRebirthState3(gameData) {

    }

    gameStateLoader(num) {
        //load basic state on reset command
        if (num === -1) {
            return;
        }

        const gameDataJson = localStorage.getItem('saveGame');
        if (!gameDataJson) {
            console.error("No save game file located");
            return;
        }
        const gameData = JSON.parse(gameDataJson);



        //load items that apply to ALL state loads:
            //player lifetime data
            //achievements
            //settings
        const { lifetimeEssenceEarned, lifetimePowerEarned, lifetimeSpiritEarned } = gameData.playerData;
        this.gameManager.gameContent.player.lifetimeEssenceEarned = new Decimal(lifetimeEssenceEarned);
        this.gameManager.gameContent.player.lifetimePowerEarned = new Decimal(lifetimePowerEarned);
        this.gameManager.gameContent.player.lifetimeSpiritEarned = new Decimal(lifetimeSpiritEarned);


        if (num > 0) {
            this.applyRebirthState(num,gameData);
        }
        else {
            this.applyStandardSaveState(gameData);
        }

        //process offline earnings
        const timeDifference = Date.now() - gameData.saveTimestamp;
    }

    applyRebirthState(num, gameData) {
        switch (num) {
            case 1:
                this.applyRebirthState1(gameData);
                break;
            case 2:
                this.applyRebirthState2(gameData);
                break;
            case 3:
                this.applyRebirthState3(gameData);
                break;
        }
    }

    applyRebirthState1(gameData) {
        if (gameData.playerData && gameData.playerData.essence) {
            this.gameManager.gameContent.player.essence = new Decimal(gameData.playerData.essence);
        }

        let rebirth1PseudoObject = this.gameManager.findObjectById(60000);

        const { id, level, active } = gameData.rebirth1PseudoObject;
        rebirth1PseudoObject.level = new Decimal(level);
        rebirth1PseudoObject.active = active;
    }

    applyRebirthState2(gameData) {
        //populate game data from gameData object
    }

    applyRebirthState3(gameData) {
        //populate game data from gameData object
    }

    applyStandardSaveState(gameData) {
        gameData.trainings.forEach(data => {
            const { id, level, active } = data;

            let training = this.builder.trainings.find(training => training.id === id);

            if (training) {
                training.level = new Decimal(level);
                training.active = active;
            } else {
                console.error(`No training found with id: ${id}`);
            }
        });

        gameData.upgrades.forEach(data => {
            const { id, level, active } = data;

            let upgrade = this.builder.upgrades.find(upgrade => upgrade.id === id);

            if (upgrade) {
                upgrade.level = new Decimal(level);
                upgrade.active = active;
            } else {
                console.error(`No upgrade found with id: ${id}`);
            }
        });

        gameData.skills.forEach(data => {
            const { id, level, active } = data;

            let skill = this.builder.skills.find(skill => skill.id === id);

            if (skill) {
                skill.level = new Decimal(level);
                skill.active = active;
            } else {
                console.error(`No skill found with id: ${id}`);
            }
        });

        gameData.mods.forEach(data => {
            const { id, active } = data;

            let mod = this.builder.mods.find(mod => mod.id === id);

            if (mod) {
                mod.active = active;
            } else {
                console.error(`No mod found with id: ${id}`);
            }
        });

        gameData.fighters.forEach(data => {
            const { id, active, isDefeated } = data;

            let fighter = this.builder.fighters.find(fighter => fighter.id === id);

            if (fighter) {
                fighter.active = active;
                fighter.isDefeated = isDefeated;
            } else {
                console.error(`No fighter found with id: ${id}`);
            }
        });

        gameData.stages.forEach(data => {
            const { id, active, isCompleted } = data;

            let stage = this.builder.stages.find(stage => stage.id === id);

            if (stage) {
                stage.active = active;
                stage.isCompleted = isCompleted;
            } else {
                console.error(`No stage found with id: ${id}`);
            }
        });

        gameData.realms.forEach(data => {
            const { id, active } = data;

            let realm = this.builder.realms.find(realm => realm.id === id);

            if (realm) {
                realm.active = active;
            } else {
                console.error(`No realm found with id: ${id}`);
            }
        });

        gameData.completedUnlocks.forEach(data => {
            const unlockIndex = this.builder.unlockManager.unlocks.findIndex(unlock => unlock.id === data.id);

            if (unlockIndex !== -1) {
                const completedUnlock = this.builder.unlockManager.unlocks.splice(unlockIndex, 1)[0];
                this.builder.unlockManager.completedUnlocks.push(completedUnlock);
            }
        });

        const { power, spirit, essence, skillpoint } = gameData.playerData;
        this.gameManager.gameContent.player.power = new Decimal(power);
        this.gameManager.gameContent.player.spirit = new Decimal(spirit);
        this.gameManager.gameContent.player.essence = new Decimal(essence);
        this.gameManager.gameContent.player.skillpoint = new Decimal(skillpoint);

        this.builder.initCalcTreesAndCaches();
        for (const training of this.builder.trainings) {
            this.gameManager.updateValues(training.calcTreesMap.get("value"));
        }
    }
}

class Builder {
    constructor(eventManager, gameManager, unlockManager) {
        this.eventManager = eventManager;
        this.gameManager = gameManager;
        this.unlockManager = unlockManager;

        //storage
        this.mods = [];
        this.trainings = [];
        this.upgrades = [];
        this.essenceUpgrades = [];
        this.realms = [];
        this.stages = [];
        this.fighters = [];
        this.skills = [];

        this.unlocks = [];

        this.calcTrees = [];

        //initialize, push to gameContent data arrays, assign to gameManager ID map
        this.initMods();
        this.initTrainings();
        this.initUpgrades();
        this.initEssenceUpgrades();
        this.initRealms();
        this.initStages();
        this.initFighters();
        this.initSkills();
        this.initializeUnlocks();

        this.pushTrainingsToRealms();
        this.pushUpgradesToRealms();
        this.pushFightersToStages();

        this.buildSkillTree();
        this.createSkillConnectionUnlocks();
        this.createMilestoneUnlocksAndMods();
        this.createRebirthModAndPseudoObject();

        //assignments phase 1 - assign references  - THESE MUST BE BEFORE NEXT SECTION OF ASSIGNMENTS
        this.assignModPriorities();
        this.assignModReferences();
        this.assignUnlockReferences();

        //assignments phase 2 - assignments to initialized objects
        this.registerModsToSources();
        this.registerModObserversAndTrees();
        this.initCalcTreesAndCaches();

        //testing
        //this.printTrainingInfo();
        //this.printUpgradeInfo();
        //this.printFighterInfo();
        //this.printUnlockInfo();
    }

    initializeUnlocks() {
        const unlockData = [

            //POWER UNLOCKS
            //power training unlocks
            { id: 3002, conditionValue: 3, conditionType: "level", dependentID: 1002, targetID: 1003 },
            { id: 3003, conditionValue: 3, conditionType: "level", dependentID: 1003, targetID: 1004 },
            { id: 3004, conditionValue: 3, conditionType: "level", dependentID: 1004, targetID: 1005 },
            { id: 3005, conditionValue: 3, conditionType: "level", dependentID: 1005, targetID: 1006 },
            { id: 3006, conditionValue: 3, conditionType: "level", dependentID: 1006, targetID: 1007 },
            { id: 3007, conditionValue: 3, conditionType: "level", dependentID: 1007, targetID: 1008 },
            { id: 3008, conditionValue: 3, conditionType: "level", dependentID: 1008, targetID: 1009 },
            { id: 3009, conditionValue: 3, conditionType: "level", dependentID: 1009, targetID: 1010 },

            //power mod unlocks - train base cost mods
            { id: 3010, conditionValue: 3, conditionType: "level", dependentID: 1002, targetID: 105 },
            { id: 3011, conditionValue: 3, conditionType: "level", dependentID: 1003, targetID: 107 },
            { id: 3012, conditionValue: 3, conditionType: "level", dependentID: 1004, targetID: 109 },
            { id: 3013, conditionValue: 3, conditionType: "level", dependentID: 1005, targetID: 111 },
            { id: 3014, conditionValue: 3, conditionType: "level", dependentID: 1006, targetID: 113 },
            { id: 3015, conditionValue: 3, conditionType: "level", dependentID: 1007, targetID: 115 },
            { id: 3016, conditionValue: 3, conditionType: "level", dependentID: 1008, targetID: 117 },
            { id: 3017, conditionValue: 3, conditionType: "level", dependentID: 1009, targetID: 119 },

            //power mod unlocks - train base cost mods
            { id: 3018, conditionValue: 3, conditionType: "level", dependentID: 1002, targetID: 106 },
            { id: 3019, conditionValue: 3, conditionType: "level", dependentID: 1003, targetID: 108 },
            { id: 3020, conditionValue: 3, conditionType: "level", dependentID: 1004, targetID: 110 },
            { id: 3021, conditionValue: 3, conditionType: "level", dependentID: 1005, targetID: 112 },
            { id: 3022, conditionValue: 3, conditionType: "level", dependentID: 1006, targetID: 114 },
            { id: 3023, conditionValue: 3, conditionType: "level", dependentID: 1007, targetID: 116 },
            { id: 3024, conditionValue: 3, conditionType: "level", dependentID: 1008, targetID: 118 },
            { id: 3025, conditionValue: 3, conditionType: "level", dependentID: 1009, targetID: 120 },


            //SPIRIT UNLOCKS
            //spirit training unlocks
            { id: 3027, conditionValue: 3, conditionType: "level", dependentID: 5002, targetID: 5003 },
            { id: 3028, conditionValue: 3, conditionType: "level", dependentID: 5003, targetID: 5004 },
            { id: 3029, conditionValue: 3, conditionType: "level", dependentID: 5004, targetID: 5005 },
            { id: 3030, conditionValue: 3, conditionType: "level", dependentID: 5005, targetID: 5006 },
            { id: 3031, conditionValue: 3, conditionType: "level", dependentID: 5006, targetID: 5007 },
            { id: 3032, conditionValue: 3, conditionType: "level", dependentID: 5007, targetID: 5008 },
            { id: 3033, conditionValue: 3, conditionType: "level", dependentID: 5008, targetID: 5009 },
            { id: 3034, conditionValue: 3, conditionType: "level", dependentID: 5009, targetID: 5010 },

            //spirit mod unlocks - train base cost mods
            { id: 3035, conditionValue: 3, conditionType: "level", dependentID: 5002, targetID: 505 },
            { id: 3036, conditionValue: 3, conditionType: "level", dependentID: 5003, targetID: 507 },
            { id: 3037, conditionValue: 3, conditionType: "level", dependentID: 5004, targetID: 509 },
            { id: 3038, conditionValue: 3, conditionType: "level", dependentID: 5005, targetID: 511 },
            { id: 3039, conditionValue: 3, conditionType: "level", dependentID: 5006, targetID: 513 },
            { id: 3040, conditionValue: 3, conditionType: "level", dependentID: 5007, targetID: 515 },
            { id: 3041, conditionValue: 3, conditionType: "level", dependentID: 5008, targetID: 517 },
            { id: 3042, conditionValue: 3, conditionType: "level", dependentID: 5009, targetID: 519 },

            //spirit mod unlocks - train base value mods
            { id: 3043, conditionValue: 3, conditionType: "level", dependentID: 5002, targetID: 506 },
            { id: 3044, conditionValue: 3, conditionType: "level", dependentID: 5003, targetID: 508 },
            { id: 3045, conditionValue: 3, conditionType: "level", dependentID: 5004, targetID: 510 },
            { id: 3046, conditionValue: 3, conditionType: "level", dependentID: 5005, targetID: 512 },
            { id: 3047, conditionValue: 3, conditionType: "level", dependentID: 5006, targetID: 514 },
            { id: 3048, conditionValue: 3, conditionType: "level", dependentID: 5007, targetID: 516 },
            { id: 3049, conditionValue: 3, conditionType: "level", dependentID: 5008, targetID: 518 },
            { id: 3050, conditionValue: 3, conditionType: "level", dependentID: 5009, targetID: 520 },


            //stage unlocks
            { id: 3051, conditionValue: true, conditionType: "isCompleted", dependentID: 901, targetID: 902 },
            { id: 3052, conditionValue: true, conditionType: "isCompleted", dependentID: 902, targetID: 903 },
            { id: 3053, conditionValue: true, conditionType: "isCompleted", dependentID: 903, targetID: 904 },
            { id: 3054, conditionValue: true, conditionType: "isCompleted", dependentID: 904, targetID: 905 }
        ];

        unlockData.forEach(data => {
            const { id, conditionValue, conditionType, dependentID, targetID } = data;
            const unlock = new Unlock(id, conditionValue, conditionType, dependentID, targetID);
            this.unlockManager.unlocks.push(unlock);
            this.unlocks.push(unlock);
            this.gameManager.gameContent.unlocks.push(unlock);
            this.gameManager.gameContent.idToObjectMap.set(id, unlock);
        });
    }

    initMods() {
        this.initEssenceMods();
        this.initSkillMods();
        this.initPowerUpgradeMods();
        this.initPowerTrainMods();
        this.initSpiritTrainMods();
        this.initSpiritUpgradeMods();
        this.initFighterMods();
    }

    initTrainings() {
        this.initPowerTrainings();
        this.initSpiritTrainings();
    }

    initPowerTrainings() {
        const trainingData = [
            { id: 1001, realmID: 11, name: "pTrain1", description: "description", level: 0, maxLevel: 999999, costType: "power", valueType: "powerIncome", active: true },
            { id: 1002, realmID: 11, name: "pTrain2", description: "description", level: 0, maxLevel: 999999, costType: "power", valueType: "powerIncome", active: true },
            { id: 1003, realmID: 11, name: "pTrain3", description: "description", level: 0, maxLevel: 999999, costType: "power", valueType: "powerIncome", active: false },
            { id: 1004, realmID: 11, name: "pTrain4", description: "description", level: 0, maxLevel: 999999, costType: "power", valueType: "powerIncome", active: false },
            { id: 1005, realmID: 11, name: "pTrain5", description: "description", level: 0, maxLevel: 999999, costType: "power", valueType: "powerIncome", active: false },
            { id: 1006, realmID: 12, name: "pTrain6", description: "description", level: 0, maxLevel: 999999, costType: "power", valueType: "powerIncome", active: false },
            { id: 1007, realmID: 12, name: "pTrain7", description: "description", level: 0, maxLevel: 999999, costType: "power", valueType: "powerIncome", active: false },
            { id: 1008, realmID: 12, name: "pTrain8", description: "description", level: 0, maxLevel: 999999, costType: "power", valueType: "powerIncome", active: false },
            { id: 1009, realmID: 12, name: "pTrain9", description: "description", level: 0, maxLevel: 999999, costType: "power", valueType: "powerIncome", active: false },
            { id: 1010, realmID: 12, name: "pTrain10", description: "description", level: 0, maxLevel: 999999, costType: "power", valueType: "powerIncome", active: false },
        ];

        trainingData.forEach(data => {
            const { id, realmID, name, description, level, maxLevel, costType, valueType, active } = data;
            const training = new Training(this.eventManager, id, realmID, name, description, level, maxLevel, costType, valueType, active);
            this.trainings.push(training);
            this.gameManager.gameContent.idToObjectMap.set(id, training);
        });
    }

    initSpiritTrainings() {
        const trainingData = [
            { id: 5001, realmID: 51, name: "sTrain1", description: "description", level: 0, maxLevel: 999999, costType: "spirit", valueType: "spiritIncome", active: true },
            { id: 5002, realmID: 51, name: "sTrain2", description: "description", level: 0, maxLevel: 999999, costType: "spirit", valueType: "spiritIncome", active: true },
            { id: 5003, realmID: 51, name: "sTrain3", description: "description", level: 0, maxLevel: 999999, costType: "spirit", valueType: "spiritIncome", active: false },
            { id: 5004, realmID: 51, name: "sTrain4", description: "description", level: 0, maxLevel: 999999, costType: "spirit", valueType: "spiritIncome", active: false },
            { id: 5005, realmID: 51, name: "sTrain5", description: "description", level: 0, maxLevel: 999999, costType: "spirit", valueType: "spiritIncome", active: false },
            { id: 5006, realmID: 52, name: "sTrain6", description: "description", level: 0, maxLevel: 999999, costType: "spirit", valueType: "spiritIncome", active: false },
            { id: 5007, realmID: 52, name: "sTrain7", description: "description", level: 0, maxLevel: 999999, costType: "spirit", valueType: "spiritIncome", active: false },
            { id: 5008, realmID: 52, name: "sTrain8", description: "description", level: 0, maxLevel: 999999, costType: "spirit", valueType: "spiritIncome", active: false },
            { id: 5009, realmID: 52, name: "sTrain9", description: "description", level: 0, maxLevel: 999999, costType: "spirit", valueType: "spiritIncome", active: false },
            { id: 5010, realmID: 52, name: "sTrain10", description: "description", level: 0, maxLevel: 999999, costType: "spirit", valueType: "spiritIncome", active: false },
        ];

        trainingData.forEach(data => {
            const { id, realmID, name, description, level, maxLevel, costType, valueType, active } = data;
            const training = new Training(this.eventManager, id, realmID, name, description, level, maxLevel, costType, valueType, active);
            this.trainings.push(training);
            this.gameManager.gameContent.idToObjectMap.set(id, training);
        });
    }

    initUpgrades() {
        this.initPowerUpgrades();
        this.initSpiritUpgrades();
    }

    initPowerUpgrades() {
        const upgradeData = [
            { id: 10001, realmID: 11, name: "pUpgrade1", description: "train 1 income *= (this level + 1)", level: 0, maxLevel: 999, costType: "power", valueType: null, active: true },
            { id: 10002, realmID: 11, name: "pUpgrade2", description: "train 1 income ^ (this level + 1)", level: 0, maxLevel: 1, costType: "power", valueType: null, active: true },
            { id: 10003, realmID: 11, name: "pUpgrade3", description: "train 1 cost /= (this level + 1)", level: 0, maxLevel: 999, costType: "power", valueType: null, active: true },
            { id: 10004, realmID: 11, name: "pUpgrade4", description: "train 1 income += (10 * this level)", level: 0, maxLevel: 999, costType: "power", valueType: null, active: true },
            { id: 10005, realmID: 11, name: "pUpgrade5", description: "all train value * (this.level * 2)", level: 0, maxLevel: 999, costType: "power", valueType: null, active: true },
            { id: 10006, realmID: 11, name: "pUpgrade6", description: "all pTrain value * (this.level *10)", level: 0, maxLevel: 999, costType: "power", valueType: null, active: true },
        ];

        upgradeData.forEach(data => {
            const { id, realmID, name, description, level, maxLevel, costType, valueType, active } = data;
            const upgrade = new Upgrade(this.eventManager, id, realmID, name, description, level, maxLevel, costType, valueType, active);
            this.upgrades.push(upgrade);
            this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
        });
    }

    initSpiritUpgrades() {
        const upgradeData = [
            { id: 50001, realmID: 51, name: "sUpgrade1", description: "fighter powerLevel / (this.level)", level: 0, maxLevel: 999, costType: "spirit", valueType: null, active: true },

            { id: 50002, realmID: 51, name: "sUpgrade2", description: "fighter power level - (this.level * 10)", level: 0, maxLevel: 999, costType: "spirit", valueType: null, active: true },

            { id: 50003, realmID: 51, name: "sUpgrade3", description: "all fighter skillpoint * 2", level: 0, maxLevel: 1, costType: "spirit", valueType: null, active: true },

            { id: 50004, realmID: 51, name: "sUpgrade4", description: "all sTrain ^ (this.level)", level: 0, maxLevel: 999, costType: "spirit", valueType: null, active: true },

        ];

        upgradeData.forEach(data => {
            const { id, realmID, name, description, level, maxLevel, costType, valueType, active } = data;
            const upgrade = new Upgrade(this.eventManager, id, realmID, name, description, level, maxLevel, costType, valueType, active);
            this.upgrades.push(upgrade);
            this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
        });
    }

    initEssenceUpgrades() {
        const upgradeData = [
        //essence upgrades
        { id: 100001, name: "eUpgrade1", description: "all pTrain + 1 basevalue", level: 0, maxLevel: 10, costType: "essence", valueType: null, active: true },
        ];

        upgradeData.forEach(data => {
            const { id,  name, description, level, maxLevel, costType, valueType, active } = data;
            const upgrade = new EssenceUpgrade(this.eventManager, id, name, description, level, maxLevel, costType, valueType, active);
            this.essenceUpgrades.push(upgrade);
            //this.upgrades.push(upgrade);
            this.gameManager.gameContent.essenceUpgrades.push(upgrade);
            this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
        });
    }

    initEssenceMods() {
        const modData = [
            { id: 101001, name: "essenceTarMod1", type: "baseValue", priority: null, sourceID: 100001, sourceCalcType: "add", targetType: "powerTrain", targetID: null, runningCalcType: "add", baseValue: 1, value: 1, active: false },

            { id: 101001, name: "essenceCostMod1", type: "baseCost", priority: null, sourceID: 100001, sourceCalcType: "add", targetType: null, targetID: 100001, runningCalcType: "add", baseValue: 1, value: 1, active: false },
        ];

        modData.forEach(data => {
            const { id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active } = data;
            const mod = new Mod(this.eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active);
            this.mods.push(mod);
            this.gameManager.gameContent.idToObjectMap.set(id, mod);
        });
    }



    initPowerUpgradeMods() {
        const modData = [
            { id: 11001, name: "pTarMod1", type: "value", priority: null, sourceID: 10001, sourceCalcType: "add", targetType: null, targetID: 1001, runningCalcType: "mult", baseValue: 2, value: 2, active: false },
            { id: 11002, name: "pUpCostMod1", type: "baseCost", priority: null, sourceID: 10001, sourceCalcType: "mult", targetType: null, targetID: 10001, runningCalcType: "mult", baseValue: 10, value: 10, active: false },

            { id: 11004, name: "pTarMod2", type: "value", priority: null, sourceID: 10002, sourceCalcType: "add", targetType: null, targetID: 1001, runningCalcType: "exp", baseValue: 2, value: 2, active: false },
            { id: 11005, name: "pUpCostMod2", type: "baseCost", priority: null, sourceID: 10002, sourceCalcType: "mult", targetType: null, targetID: 10002, runningCalcType: "mult", baseValue: 10, value: 10, active: false },

            { id: 11007, name: "pTarMod3", type: "cost", priority: null, sourceID: 10003, sourceCalcType: "add", targetType: null, targetID: 1001, runningCalcType: "div", baseValue: 2, value: 2, active: false },
            { id: 11008, name: "pUpCostMod3", type: "baseCost", priority: null, sourceID: 10003, sourceCalcType: "mult", targetType: null, targetID: 10003, runningCalcType: "mult", baseValue: 10, value: 10, active: false },

            { id: 11010, name: "pTarMod4", type: "value", priority: null, sourceID: 10004, sourceCalcType: "mult", targetType: null, targetID: 1001, runningCalcType: "add", baseValue: 10, value: 10, active: false },
            { id: 11011, name: "pUpCostMod4", type: "baseCost", priority: null, sourceID: 10004, sourceCalcType: "mult", targetType: null, targetID: 10004, runningCalcType: "mult", baseValue: 10, value: 10, active: false },

            { id: 11013, name: "pTarMod5", type: "value", priority: null, sourceID: 10005, sourceCalcType: "mult", targetType: "allTrain", targetID: null, runningCalcType: "mult", baseValue: 2, value: 2, active: false },
            { id: 11014, name: "pUpCostMod5", type: "baseCost", priority: null, sourceID: 10005, sourceCalcType: "mult", targetType: null, targetID: 10005, runningCalcType: "mult", baseValue: 10, value: 10, active: false },

            { id: 11016, name: "pTarMod6", type: "value", priority: null, sourceID: 10006, sourceCalcType: "mult", targetType: "powerTrain", targetID: null, runningCalcType: "mult", baseValue: 10, value: 10, active: false },
            { id: 11017, name: "pUpCostMod6", type: "baseCost", priority: null, sourceID: 10006, sourceCalcType: "mult", targetType: null, targetID: 10006, runningCalcType: "mult", baseValue: 10, value: 10, active: false },
        ];

        modData.forEach(data => {
            const { id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active } = data;
            const mod = new Mod(this.eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active);
            this.mods.push(mod);
            this.gameManager.gameContent.idToObjectMap.set(id, mod);
        });
    }



    initPowerTrainMods() {
        const modData = [
            { id: 101, name: "pMod1", type: "baseCost", priority: 1, sourceID: 1001, sourceCalcType: "add", targetType: null, targetID: 1001, runningCalcType: "add", baseValue: 1, value: 1, active: true },
            { id: 102, name: "pMod2", type: "baseValue", priority: 1, sourceID: 1001, sourceCalcType: "add", targetType: null, targetID: 1001, runningCalcType: "add", baseValue: 1, value: 1, active: true },
            { id: 103, name: "pMod3", type: "baseCost", priority: 1, sourceID: 1002, sourceCalcType: "mult", targetType: null, targetID: 1002, runningCalcType: "mult", baseValue: 10, value: 10, active: true },
            { id: 104, name: "pMod4", type: "baseValue", priority: 1, sourceID: 1002, sourceCalcType: "mult", targetType: null, targetID: 1002, runningCalcType: "mult", baseValue: 10, value: 10, active: true },
            { id: 105, name: "pMod5", type: "baseCost", priority: 1, sourceID: 1003, sourceCalcType: "add", targetType: null, targetID: 1003, runningCalcType: "add", baseValue: 100, value: 100, active: false },
            { id: 106, name: "pMod6", type: "baseValue", priority: 1, sourceID: 1003, sourceCalcType: "mult", targetType: null, targetID: 1003, runningCalcType: "add", baseValue: 100, value: 100, active: false },
            { id: 107, name: "pMod7", type: "baseCost", priority: 1, sourceID: 1004, sourceCalcType: "mult", targetType: null, targetID: 1004, runningCalcType: "mult", baseValue: 1000, value: 1000, active: false },
            { id: 108, name: "pMod8", type: "baseValue", priority: 1, sourceID: 1004, sourceCalcType: "mult", targetType: null, targetID: 1004, runningCalcType: "mult", baseValue: 1000, value: 1000, active: false },
            { id: 109, name: "pMod9", type: "baseCost", priority: 1, sourceID: 1005, sourceCalcType: "add", targetType: null, targetID: 1005, runningCalcType: "add", baseValue: 10000, value: 10000, active: false },
            { id: 110, name: "pMod10", type: "baseValue", priority: 1, sourceID: 1005, sourceCalcType: "add", targetType: null, targetID: 1005, runningCalcType: "add", baseValue: 10000, value: 10000, active: false },
            { id: 111, name: "pMod11", type: "baseCost", priority: 1, sourceID: 1006, sourceCalcType: "mult", targetType: null, targetID: 1006, runningCalcType: "mult", baseValue: 100000, value: 100000, active: false },
            { id: 112, name: "pMod12", type: "baseValue", priority: 1, sourceID: 1006, sourceCalcType: "mult", targetType: null, targetID: 1006, runningCalcType: "mult", baseValue: 100000, value: 100000, active: false },
            { id: 113, name: "pMod13", type: "baseCost", priority: 1, sourceID: 1007, sourceCalcType: "add", targetType: null, targetID: 1007, runningCalcType: "add", baseValue: 1000000, value: 1000000, active: false },
            { id: 114, name: "pMod14", type: "baseValue", priority: 1, sourceID: 1007, sourceCalcType: "add", targetType: null, targetID: 1007, runningCalcType: "add", baseValue: 1000000, value: 1000000, active: false },
            { id: 115, name: "pMod15", type: "baseCost", priority: 1, sourceID: 1008, sourceCalcType: "mult", targetType: null, targetID: 1008, runningCalcType: "mult", baseValue: 10000000, value: 10000000, active: false },
            { id: 116, name: "pMod16", type: "baseValue", priority: 1, sourceID: 1008, sourceCalcType: "mult", targetType: null, targetID: 1008, runningCalcType: "mult", baseValue: 10000000, value: 10000000, active: false },
            { id: 117, name: "pMod17", type: "baseCost", priority: 1, sourceID: 1009, sourceCalcType: "add", targetType: null, targetID: 1009, runningCalcType: "add", baseValue: 100000000, value: 100000000, active: false },
            { id: 118, name: "pMod18", type: "baseValue", priority: 1, sourceID: 1009, sourceCalcType: "add", targetType: null, targetID: 1009, runningCalcType: "add", baseValue: 100000000, value: 100000000, active: false },
            { id: 119, name: "pMod19", type: "baseCost", priority: 1, sourceID: 1010, sourceCalcType: "mult", targetType: null, targetID: 1010, runningCalcType: "mult", baseValue: 1000000000, value: 1000000000, active: false },
            { id: 120, name: "pMod20", type: "baseValue", priority: 1, sourceID: 1010, sourceCalcType: "mult", targetType: null, targetID: 1010, runningCalcType: "mult", baseValue: 1000000000, value: 1000000000, active: false },

        ];

        modData.forEach(data => {
            const { id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active } = data;
            const mod = new Mod(this.eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active);
            this.mods.push(mod);
            this.gameManager.gameContent.idToObjectMap.set(id, mod);
        });
    }


    initSpiritTrainMods() {
        const modData = [
            { id: 501, name: "sMod1", type: "baseCost", priority: 1, sourceID: 5001, sourceCalcType: "add", targetType: null, targetID: 5001, runningCalcType: "add", baseValue: 1, value: 1, active: true },
            { id: 502, name: "sMod2", type: "baseValue", priority: 1, sourceID: 5001, sourceCalcType: "add", targetType: null, targetID: 5001, runningCalcType: "add", baseValue: 1, value: 1, active: true },
            { id: 503, name: "sMod3", type: "baseCost", priority: 1, sourceID: 5002, sourceCalcType: "mult", targetType: null, targetID: 5002, runningCalcType: "mult", baseValue: 10, value: 10, active: true },
            { id: 504, name: "sMod4", type: "baseValue", priority: 1, sourceID: 5002, sourceCalcType: "mult", targetType: null, targetID: 5002, runningCalcType: "mult", baseValue: 10, value: 10, active: true },
            { id: 505, name: "sMod5", type: "baseCost", priority: 1, sourceID: 5003, sourceCalcType: "add", targetType: null, targetID: 5003, runningCalcType: "add", baseValue: 100, value: 100, active: false },
            { id: 506, name: "sMod6", type: "baseValue", priority: 1, sourceID: 5003, sourceCalcType: "add", targetType: null, targetID: 5003, runningCalcType: "add", baseValue: 100, value: 100, active: false },
            { id: 507, name: "sMod7", type: "baseCost", priority: 1, sourceID: 5004, sourceCalcType: "mult", targetType: null, targetID: 5004, runningCalcType: "mult", baseValue: 1000, value: 1000, active: false },
            { id: 508, name: "sMod8", type: "baseValue", priority: 1, sourceID: 5004, sourceCalcType: "mult", targetType: null, targetID: 5004, runningCalcType: "mult", baseValue: 1000, value: 1000, active: false },
            { id: 509, name: "sMod9", type: "baseCost", priority: 1, sourceID: 5005, sourceCalcType: "add", targetType: null, targetID: 5005, runningCalcType: "add", baseValue: 10000, value: 10000, active: false },
            { id: 510, name: "sMod10", type: "baseValue", priority: 1, sourceID: 5005, sourceCalcType: "add", targetType: null, targetID: 5005, runningCalcType: "add", baseValue: 10000, value: 10000, active: false },
            { id: 511, name: "sMod11", type: "baseCost", priority: 1, sourceID: 5006, sourceCalcType: "mult", targetType: null, targetID: 5006, runningCalcType: "mult", baseValue: 100000, value: 100000, active: false },
            { id: 512, name: "sMod12", type: "baseValue", priority: 1, sourceID: 5006, sourceCalcType: "mult", targetType: null, targetID: 5006, runningCalcType: "mult", baseValue: 100000, value: 100000, active: false },
            { id: 513, name: "sMod13", type: "baseCost", priority: 1, sourceID: 5007, sourceCalcType: "add", targetType: null, targetID: 5007, runningCalcType: "add", baseValue: 1000000, value: 1000000, active: false },
            { id: 514, name: "sMod14", type: "baseValue", priority: 1, sourceID: 5007, sourceCalcType: "add", targetType: null, targetID: 5007, runningCalcType: "add", baseValue: 1000000, value: 1000000, active: false },
            { id: 515, name: "sMod15", type: "baseCost", priority: 1, sourceID: 5008, sourceCalcType: "mult", targetType: null, targetID: 5008, runningCalcType: "mult", baseValue: 10000000, value: 10000000, active: false },
            { id: 516, name: "sMod16", type: "baseValue", priority: 1, sourceID: 5008, sourceCalcType: "mult", targetType: null, targetID: 5008, runningCalcType: "mult", baseValue: 10000000, value: 10000000, active: false },
            { id: 517, name: "sMod17", type: "baseCost", priority: 1, sourceID: 5009, sourceCalcType: "add", targetType: null, targetID: 5009, runningCalcType: "add", baseValue: 100000000, value: 100000000, active: false },
            { id: 518, name: "sMod18", type: "baseValue", priority: 1, sourceID: 5009, sourceCalcType: "add", targetType: null, targetID: 5009, runningCalcType: "add", baseValue: 100000000, value: 100000000, active: false },
            { id: 519, name: "sMod19", type: "baseCost", priority: 1, sourceID: 5010, sourceCalcType: "mult", targetType: null, targetID: 5010, runningCalcType: "mult", baseValue: 1000000000, value: 1000000000, active: false },
            { id: 520, name: "sMod20", type: "baseValue", priority: 1, sourceID: 5010, sourceCalcType: "mult", targetType: null, targetID: 5010, runningCalcType: "mult", baseValue: 1000000000, value: 1000000000, active: false },
        ];

        modData.forEach(data => {
            const { id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active } = data;
            const mod = new Mod(this.eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active);
            this.mods.push(mod);
            this.gameManager.gameContent.idToObjectMap.set(id, mod);
        });
    }


    initSpiritUpgradeMods() {
        const modData = [
            { id: 51001, name: "sTarMod1", type: "baseCost", priority: null, sourceID: 50001, sourceCalcType: "add", targetType: "fighters", targetID: null, runningCalcType: "div", baseValue: 2, value: 2, active: false },
            { id: 51002, name: "sUpCostMod1", type: "baseCost", priority: null, sourceID: 50001, sourceCalcType: "mult", targetType: null, targetID: 50001, runningCalcType: "mult", baseValue: 10, value: 10, active: false },
            { id: 51003, name: "sUpValueMod1", type: "baseValue", priority: null, sourceID: 50001, sourceCalcType: "add", targetType: null, targetID: 50001, runningCalcType: "add", baseValue: 1, value: 1, active: false },

            { id: 51004, name: "sTarMod2", type: "baseCost", priority: null, sourceID: 50002, sourceCalcType: "mult", targetType: "fighters", targetID: null, runningCalcType: "sub", baseValue: 10, value: 10, active: false },
            { id: 51005, name: "sUpCostMod2", type: "baseCost", priority: null, sourceID: 50002, sourceCalcType: "mult", targetType: null, targetID: 50002, runningCalcType: "mult", baseValue: 10, value: 10, active: false },
            { id: 51006, name: "sUpValueMod2", type: "baseValue", priority: null, sourceID: 50002, sourceCalcType: "add", targetType: null, targetID: 50002, runningCalcType: "add", baseValue: 1, value: 1, active: false },

            { id: 51007, name: "sTarMod3", type: "value", priority: null, sourceID: 50003, sourceCalcType: "mult", targetType: "fighters", targetID: null, runningCalcType: "mult", baseValue: 2, value: 2, active: false },
            { id: 51008, name: "sUpCostMod3", type: "baseCost", priority: null, sourceID: 50003, sourceCalcType: "mult", targetType: null, targetID: 50003, runningCalcType: "mult", baseValue: 100, value: 100, active: false },
            { id: 51009, name: "sUpValueMod3", type: "baseValue", priority: null, sourceID: 50003, sourceCalcType: "add", targetType: null, targetID: 50003, runningCalcType: "add", baseValue: 2, value: 2, active: false },


            { id: 51010, name: "sTarMod4", type: "value", priority: null, sourceID: 50004, sourceCalcType: "add", targetType: "allTrain", targetID: null, runningCalcType: "exp", baseValue: 2, value: 2, active: false },
            { id: 51011, name: "sUpCostMod4", type: "baseCost", priority: null, sourceID: 50004, sourceCalcType: "mult", targetType: null, targetID: 50004, runningCalcType: "mult", baseValue: 10, value: 10, active: false },
            { id: 51012, name: "sUpValueMod4", type: "baseValue", priority: null, sourceID: 50004, sourceCalcType: "add", targetType: null, targetID: 50004, runningCalcType: "add", baseValue: 1, value: 1, active: false },
        ];

        modData.forEach(data => {
            const { id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active } = data;
            const mod = new Mod(this.eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active);
            this.mods.push(mod);
            this.gameManager.gameContent.idToObjectMap.set(id, mod);
        });
    }


    initFighterMods() {
        const modData = [
            { id: 901, name: "fMod1", type: "baseCost", priority: null, sourceID: 9001, sourceCalcType: "add", targetType: null, targetID: 9001, runningCalcType: "add", baseValue: 100, value: 100, active: true },
            { id: 902, name: "fMod2", type: "baseValue", priority: null, sourceID: 9001, sourceCalcType: "add", targetType: null, targetID: 9001, runningCalcType: "add", baseValue: 1, value: 1, active: true },
            { id: 903, name: "fMod3", type: "baseCost", priority: null, sourceID: 9002, sourceCalcType: "add", targetType: null, targetID: 9002, runningCalcType: "add", baseValue: 500, value: 500, active: true },
            { id: 904, name: "fMod4", type: "baseValue", priority: null, sourceID: 9002, sourceCalcType: "add", targetType: null, targetID: 9002, runningCalcType: "add", baseValue: 2, value: 2, active: true },
            { id: 905, name: "fMod5", type: "baseCost", priority: null, sourceID: 9003, sourceCalcType: "add", targetType: null, targetID: 9003, runningCalcType: "add", baseValue: 1000, value: 1000, active: true },
            { id: 906, name: "fMod6", type: "baseValue", priority: null, sourceID: 9003, sourceCalcType: "add", targetType: null, targetID: 9003, runningCalcType: "add", baseValue: 5, value: 5, active: true },
            { id: 907, name: "fMod7", type: "baseCost", priority: null, sourceID: 9004, sourceCalcType: "add", targetType: null, targetID: 9004, runningCalcType: "add", baseValue: 5000, value: 5000, active: true },
            { id: 908, name: "fMod8", type: "baseValue", priority: null, sourceID: 9004, sourceCalcType: "add", targetType: null, targetID: 9004, runningCalcType: "add", baseValue: 5, value: 5, active: true },
            { id: 909, name: "fMod9", type: "baseCost", priority: null, sourceID: 9005, sourceCalcType: "add", targetType: null, targetID: 9005, runningCalcType: "add", baseValue: 10000, value: 10000, active: true },
            { id: 910, name: "fMod10", type: "baseValue", priority: null, sourceID: 9005, sourceCalcType: "add", targetType: null, targetID: 9005, runningCalcType: "add", baseValue: 5, value: 5, active: true },
            { id: 911, name: "fMod11", type: "baseCost", priority: null, sourceID: 9006, sourceCalcType: "add", targetType: null, targetID: 9006, runningCalcType: "add", baseValue: 50000, value: 50000, active: true },
            { id: 912, name: "fMod12", type: "baseValue", priority: null, sourceID: 9006, sourceCalcType: "add", targetType: null, targetID: 9006, runningCalcType: "add", baseValue: 10, value: 10, active: true },
            { id: 913, name: "fMod13", type: "baseCost", priority: null, sourceID: 9007, sourceCalcType: "add", targetType: null, targetID: 9007, runningCalcType: "add", baseValue: 100000, value: 100000, active: true },
            { id: 914, name: "fMod14", type: "baseValue", priority: null, sourceID: 9007, sourceCalcType: "add", targetType: null, targetID: 9007, runningCalcType: "add", baseValue: 10, value: 10, active: true },
            { id: 915, name: "fMod15", type: "baseCost", priority: null, sourceID: 9008, sourceCalcType: "add", targetType: null, targetID: 9008, runningCalcType: "add", baseValue: 500000, value: 500000, active: true },
            { id: 916, name: "fMod16", type: "baseValue", priority: null, sourceID: 9008, sourceCalcType: "add", targetType: null, targetID: 9008, runningCalcType: "add", baseValue: 10, value: 10, active: true },
            { id: 917, name: "fMod17", type: "baseCost", priority: null, sourceID: 9009, sourceCalcType: "add", targetType: null, targetID: 9009, runningCalcType: "add", baseValue: 1000000, value: 1000000, active: true },
            { id: 918, name: "fMod18", type: "baseValue", priority: null, sourceID: 9009, sourceCalcType: "add", targetType: null, targetID: 9009, runningCalcType: "add", baseValue: 15, value: 15, active: true },
            { id: 919, name: "fMod19", type: "baseCost", priority: null, sourceID: 9010, sourceCalcType: "add", targetType: null, targetID: 9010, runningCalcType: "add", baseValue: 5000000, value: 5000000, active: true },
            { id: 920, name: "fMod20", type: "baseValue", priority: null, sourceID: 9010, sourceCalcType: "add", targetType: null, targetID: 9010, runningCalcType: "add", baseValue: 15, value: 15, active: true },
            { id: 921, name: "fMod21", type: "baseCost", priority: null, sourceID: 9011, sourceCalcType: "add", targetType: null, targetID: 9011, runningCalcType: "add", baseValue: 10000000, value: 10000000, active: true },
            { id: 922, name: "fMod22", type: "baseValue", priority: null, sourceID: 9011, sourceCalcType: "add", targetType: null, targetID: 9011, runningCalcType: "add", baseValue: 20, value: 20, active: true },
            { id: 923, name: "fMod23", type: "baseCost", priority: null, sourceID: 9012, sourceCalcType: "add", targetType: null, targetID: 9012, runningCalcType: "add", baseValue: 50000000, value: 50000000, active: true },
            { id: 924, name: "fMod24", type: "baseValue", priority: null, sourceID: 9012, sourceCalcType: "add", targetType: null, targetID: 9012, runningCalcType: "add", baseValue: 20, value: 20, active: true },
            { id: 925, name: "fMod25", type: "baseCost", priority: null, sourceID: 9013, sourceCalcType: "add", targetType: null, targetID: 9013, runningCalcType: "add", baseValue: 100000000, value: 100000000, active: true },
            { id: 926, name: "fMod26", type: "baseValue", priority: null, sourceID: 9013, sourceCalcType: "add", targetType: null, targetID: 9013, runningCalcType: "add", baseValue: 30, value: 30, active: true },
            { id: 927, name: "fMod27", type: "baseCost", priority: null, sourceID: 9014, sourceCalcType: "add", targetType: null, targetID: 9014, runningCalcType: "add", baseValue: 500000000, value: 500000000, active: true },
            { id: 928, name: "fMod28", type: "baseValue", priority: null, sourceID: 9014, sourceCalcType: "add", targetType: null, targetID: 9014, runningCalcType: "add", baseValue: 30, value: 30, active: true },
            { id: 929, name: "fMod29", type: "baseCost", priority: null, sourceID: 9015, sourceCalcType: "add", targetType: null, targetID: 9015, runningCalcType: "add", baseValue: 1000000000, value: 1000000000000, active: true },
            { id: 930, name: "fMod30", type: "baseValue", priority: null, sourceID: 9015, sourceCalcType: "add", targetType: null, targetID: 9015, runningCalcType: "add", baseValue: 30, value: 30, active: true },
        ];

        modData.forEach(data => {
            const { id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active } = data;
            const mod = new Mod(this.eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active);
            this.mods.push(mod);
            this.gameManager.gameContent.idToObjectMap.set(id, mod);
        });
    }

    initSkillMods() {
        const modData = [
            //skill base cost/value mods
            { id: 40001, name: "skillCostMod1", type: "baseCost", priority: null, sourceID: 4001, sourceCalcType: "add", targetType: null, targetID: 4001, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40003, name: "skillCostMod2", type: "baseCost", priority: null, sourceID: 4002, sourceCalcType: "add", targetType: null, targetID: 4002, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40005, name: "skillCostMod3", type: "baseCost", priority: null, sourceID: 4003, sourceCalcType: "add", targetType: null, targetID: 4003, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40007, name: "skillCostMod4", type: "baseCost", priority: null, sourceID: 4004, sourceCalcType: "add", targetType: null, targetID: 4004, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40009, name: "skillCostMod5", type: "baseCost", priority: null, sourceID: 4005, sourceCalcType: "add", targetType: null, targetID: 4005, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40011, name: "skillCostMod7", type: "baseCost", priority: null, sourceID: 4006, sourceCalcType: "add", targetType: null, targetID: 4006, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40013, name: "skillCostMod8", type: "baseCost", priority: null, sourceID: 4007, sourceCalcType: "add", targetType: null, targetID: 4007, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40015, name: "skillCostMod9", type: "baseCost", priority: null, sourceID: 4008, sourceCalcType: "add", targetType: null, targetID: 4008, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40017, name: "skillCostMod10", type: "baseCost", priority: null, sourceID: 4009, sourceCalcType: "add", targetType: null, targetID: 4009, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40019, name: "skillCostMod11", type: "baseCost", priority: null, sourceID: 4010, sourceCalcType: "add", targetType: null, targetID: 4010, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40021, name: "skillCostMod12", type: "baseCost", priority: null, sourceID: 4011, sourceCalcType: "add", targetType: null, targetID: 4011, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40023, name: "skillCostMod13", type: "baseCost", priority: null, sourceID: 4012, sourceCalcType: "add", targetType: null, targetID: 4012, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40025, name: "skillCostMod14", type: "baseCost", priority: null, sourceID: 4013, sourceCalcType: "add", targetType: null, targetID: 4013, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40027, name: "skillCostMod15", type: "baseCost", priority: null, sourceID: 4014, sourceCalcType: "add", targetType: null, targetID: 4014, runningCalcType: "add", baseValue: 1, value: 1, active: false },
            { id: 40029, name: "skillCostMod6", type: "baseCost", priority: null, sourceID: 4015, sourceCalcType: "add", targetType: null, targetID: 4015, runningCalcType: "add", baseValue: 1, value: 1, active: false },

            //skill typemods
            { id: 41011, name: "skUpMod1", type: "value", priority: null, sourceID: 4001, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 2, value: 2, active: false },
            { id: 41012, name: "skUpMod2", type: "value", priority: null, sourceID: 4002, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 3, value: 3, active: false },
            { id: 41013, name: "skUpMod3", type: "value", priority: null, sourceID: 4003, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 4, value: 4, active: false },
            { id: 41014, name: "skUpMod4", type: "value", priority: null, sourceID: 4004, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 5, value: 5, active: false },
            { id: 41015, name: "skUpMod5", type: "value", priority: null, sourceID: 4005, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 6, value: 6, active: false },
            { id: 41016, name: "skUpMod6", type: "value", priority: null, sourceID: 4006, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 7, value: 7, active: false },
            { id: 41017, name: "skUpMod7", type: "value", priority: null, sourceID: 4007, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 8, value: 8, active: false },
            { id: 41018, name: "skUpMod8", type: "value", priority: null, sourceID: 4008, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 9, value: 9, active: false },
            { id: 41019, name: "skUpMod9", type: "value", priority: null, sourceID: 4009, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 10, value: 10, active: false },
            { id: 41020, name: "skUpMod10", type: "value", priority: null, sourceID: 4010, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 11, value: 11, active: false },
            { id: 41021, name: "skUpMod11", type: "value", priority: null, sourceID: 4011, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 12, value: 12, active: false },
            { id: 41022, name: "skUpMod12", type: "value", priority: null, sourceID: 4012, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 13, value: 13, active: false },
            { id: 41023, name: "skUpMod13", type: "value", priority: null, sourceID: 4013, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 14, value: 14, active: false },
            { id: 41024, name: "skUpMod14", type: "value", priority: null, sourceID: 4014, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 15, value: 15, active: false },
            { id: 41025, name: "skUpMod15", type: "value", priority: null, sourceID: 4015, sourceCalcType: "mult", targetType: "trains&upgrades", targetID: null, runningCalcType: "mult", baseValue: 16, value: 16, active: false },
        ];

        modData.forEach(data => {
            const { id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active } = data;
            const mod = new Mod(this.eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active);
            this.mods.push(mod);
            this.gameManager.gameContent.idToObjectMap.set(id, mod);
        });
    }

    initRealms() {
        const realmData = [
            //power realms
            { id: 11, type: "power", name: "pRealm1", active: true },
            { id: 12, type: "power", name: "pRealm2", active: true },
            { id: 13, type: "power", name: "pRealm3", active: true },

            //spirit realms
            { id: 51, type: "spirit", name: "sRealm1", active: true },
            { id: 52, type: "spirit", name: "sRealm2", active: true },
            { id: 53, type: "spirit", name: "sRealm3", active: true },
        ];

        realmData.forEach(data => {
            const { id, type, name, active } = data;
            const realm = new Realm(this.eventManager, id, type, name, active);
            this.realms.push(realm);
            this.gameManager.gameContent.idToObjectMap.set(id, realm);

            if (realm.type === "power") {
                this.gameManager.gameContent.powerRealms.push(realm);
            }
            else if (realm.type === "spirit") {
                this.gameManager.gameContent.spiritRealms.push(realm);
            }
        });
    }

    initStages() {
        const stageData = [
            { id: 901, name: "stage1", active: true },
            { id: 902, name: "stage2", active: false },
            { id: 903, name: "stage3", active: false },
            { id: 904, name: "stage4", active: false },
            { id: 905, name: "stage5", active: false },
        ];

        stageData.forEach(data => {
            const { id, name, active } = data;
            const stage = new Stage(this.eventManager, id, name, active);
            this.stages.push(stage);
            this.gameManager.gameContent.idToObjectMap.set(id, stage);

            this.gameManager.gameContent.tournament.stages.push(stage);
        });
    }

    initFighters() {
        const fighterData = [
            { id: 9001, stageID: 901, name: "fighter1", active: true },
            { id: 9002, stageID: 901, name: "fighter2", active: true },
            { id: 9003, stageID: 901, name: "fighter3", active: true },
            { id: 9004, stageID: 902, name: "fighter4", active: false },
            { id: 9005, stageID: 902, name: "fighter5", active: false },
            { id: 9006, stageID: 902, name: "fighter6", active: false },
            { id: 9007, stageID: 903, name: "fighter7", active: false },
            { id: 9008, stageID: 903, name: "fighter8", active: false },
            { id: 9009, stageID: 903, name: "fighter9", active: false },
            { id: 9010, stageID: 904, name: "fighter10", active: false },
            { id: 9011, stageID: 904, name: "fighter11", active: false },
            { id: 9012, stageID: 904, name: "fighter12", active: false },
            { id: 9013, stageID: 905, name: "fighter13", active: false },
            { id: 9014, stageID: 905, name: "fighter14", active: false },
            { id: 9015, stageID: 905, name: "fighter15", active: false },
        ];

        fighterData.forEach(data => {
            const { id, stageID, name, active } = data;
            const fighter = new Fighter(
                this.eventManager,
                id,
                stageID,
                name,
                active
            );
            this.fighters.push(fighter);
            this.gameManager.gameContent.idToObjectMap.set(id, fighter);
        });
    }

    initSkills() {
        const skillData = [
            { id: 4001, name: "sk1", description: "all values * (this.level * 2)", level: 0, maxLevel: 10, active: true, connections: { east: 4002, south: 4003, west: 4004 } },
            { id: 4002, name: "sk2", description: "all values * (this.level * 3)", level: 0, maxLevel: 10, active: false, connections: { east:4011} },
            { id: 4003, name: "sk3", description: "all values * (this.level * 4)", level: 0, maxLevel: 10, active: false, connections: { south: 4005 } },
            { id: 4004, name: "sk4", description: "all values * (this.level * 5)", level: 0, maxLevel: 10, active: false, connections: { east: 4001 } },
            { id: 4005, name: "sk5", description: "all values * (this.level * 6)", level: 0, maxLevel: 10, active: false, connections: {  south:4006 } },
            { id: 4006, name: "sk6", description: "all values * (this.level * 7)", level: 0, maxLevel: 10, active: false, connections: { east: 4007, south: 4008, west: 4013 } },
            { id: 4007, name: "sk7", description: "all values * (this.level * 8)", level: 0, maxLevel: 10, active: false, connections: { south:4009,  } },
            { id: 4008, name: "sk8", description: "all values * (this.level * 9)", level: 0, maxLevel: 10, active: false, connections: { } },
            { id: 4009, name: "sk9", description: "all values * (this.level * 10)", level: 0, maxLevel: 10, active: false, connections: {south:4010 } },
            { id: 4010, name: "sk10", description: "all values * (this.level * 11)", level: 0, maxLevel: 10, active: false, connections: {} },
            { id: 4011, name: "sk11", description: "all values * (this.level * 12)", level: 0, maxLevel: 10, active: false, connections: {east:4012} },
            { id: 4012, name: "sk12", description: "all values * (this.level * 13)", level: 0, maxLevel: 10, active: false, connections: {south:4014} },
            { id: 4013, name: "sk13", description: "all values * (this.level * 14)", level: 0, maxLevel: 10, active: false, connections: {} },
            { id: 4014, name: "sk14", description: "all values * (this.level * 15)", level: 0, maxLevel: 10, active: false, connections: { south:4015} },
            { id: 4015, name: "sk15", description: "all values * (this.level * 16)", level: 0, maxLevel: 10, active: false, connections: {} },

        ];

        skillData.forEach(data => {
            const { id, name, description,level, maxLevel, active, connections } = data;
            const skill = new Skill(
                this.eventManager,
                id,
                name,
                description,
                level,
                maxLevel,
                active,
                connections
            );
            this.skills.push(skill);
            this.gameManager.gameContent.skillTree.skills.push(skill);
            this.gameManager.gameContent.idToObjectMap.set(id, skill);
        });
    }

    createSkillConnectionUnlocks() {
        let unlockID = 35000;
        let unlocksDone = [];
        this.gameManager.gameContent.skillTree.skills.forEach(skill => {
            for (const direction in skill.connections) {
                const unlock = new Unlock(unlockID, 1, "level", skill.id, skill.connections[direction]);
                //dont push unlock if a target skill is already unlocked (to handle bidirectional unlock directions)
                if (!unlocksDone.some(existingUnlock => existingUnlock.targetID === unlock.targetID)) {

                    this.unlocks.push(unlock);
                    this.unlockManager.unlocks.push(unlock);
                    this.gameManager.gameContent.unlocks.push(unlock);
                    this.gameManager.gameContent.idToObjectMap.set(unlockID, unlock);
                    unlockID++;
                }
            }
        });
    }

    createRebirthModAndPseudoObject() {
        //hidden upgrade object to act as source of rebirth mod
        const sourceUpgrade =
            { id: 60000, realmID: null, name: "hidden rebirth1 upgrade source", description: "hidden rebirth1 upgrade source", level: new Decimal(1), maxLevel: new Decimal(999999), costType: "power", valueType: null, active: true };
        const { id, realmID, name, description, level, maxLevel, costType, valueType, active } = sourceUpgrade;
        const upgrade = new Upgrade(this.eventManager, id, realmID, name, description, level, maxLevel, costType, valueType, active);
        this.upgrades.push(upgrade);
        this.gameManager.gameContent.idToObjectMap.set(id, upgrade);


        let modID = 60001;
        const mod = new Mod(this.eventManager, modID, "rebirth1EssenceMod", "value", null, 60000, "add", "powerTrain", null, "mult", new Decimal(1), new Decimal(1), true);
        this.mods.push(mod);
        this.gameManager.gameContent.idToObjectMap.set(modID, mod);
    }

    createMilestoneUnlocksAndMods() {
        const MILESTONE_TIERS = [new Decimal(10), new Decimal(25), new Decimal(50), new Decimal(100), new Decimal(250), new Decimal(500), new Decimal(1000), new Decimal(2500), new Decimal(5000), new Decimal(10000), new Decimal(25000), new Decimal(50000),new Decimal(100000)];

        //hidden upgrade object to act as source of milestone mods
        const sourceUpgrade =
            { id: 30000, realmID: null, name: "hidden milestone upgrade source", description: "hidden milestone upgrade source", level: new Decimal(1), maxLevel: new Decimal(1), costType: "power", valueType: null, active: true };
            const { id, realmID, name, description, level, maxLevel, costType, valueType, active } = sourceUpgrade;
            const upgrade = new Upgrade(this.eventManager, id, realmID, name, description, level, maxLevel, costType, valueType, active);
            //this.upgrades.push(upgrade);
            this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
        


        let unlockID = 37500;
        let modID = 30001;
        let milestoneLevel = new Decimal(0);
        for (const feature of this.trainings) {
            for (let i = 0; i < MILESTONE_TIERS.length; i++) {
                milestoneLevel = MILESTONE_TIERS[i];

                let modValue = new Decimal(2);

                const mod = new Mod(this.eventManager, modID, feature.name + "milestone" + milestoneLevel.toString(), "value", null, 30000, "mult", null, feature.id, "mult", modValue, modValue, false);
                this.mods.push(mod);
                this.gameManager.gameContent.idToObjectMap.set(modID, mod);


                const unlock = new Unlock(unlockID, milestoneLevel, "level", feature.id, mod.id);

                this.unlocks.push(unlock);
                this.unlockManager.unlocks.push(unlock);
                this.gameManager.gameContent.unlocks.push(unlock);
                this.gameManager.gameContent.idToObjectMap.set(unlockID, unlock);

                unlockID++;
                modID++;
                modValue.plus(2);
            }
        }

        //populate all trainings with milestone tiers
        for (const training of this.trainings) {
            training.milestoneTiers = MILESTONE_TIERS;
            training.setNewMilestoneLevel();
        }
    }


    buildSkillTree() {
        const baseSkill = this.gameManager.gameContent.skillTree.skills.find(s => s.id === 4001);
        const baseSkillNode = new SkillNode(baseSkill, 50, 100);
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
        const fixedLineLength = 50;

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


    assignModPriorities() {
        const typeValues = {
            "baseValue": 100,
            "value": 1000,
            "baseCost": 100,
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
        });
    }

    //register mod observers and push to calculation trees
    registerModObserversAndTrees() {
        let typeMods = [];
        this.mods.forEach(mod => {
 
            //store type mods for assignment after other mods have been allocated to their trees
            if (mod.targetType) {
                typeMods.push(mod);
            }
            else if (mod.target) {
                this.addModToObjectCalcTree(mod.target, mod);
            }
         
            else {
                console.error("pushModsToTargets: mod",mod.name ,"is not initialized properly - missing: target type or target ID");
            }
        });

        this.typeModHandler(typeMods);
    }

    typeModHandler(typeMods) {
        typeMods.forEach(typeMod => {
            let featureLoop = null;

            //grab array of relevant targeted features
            if (typeMod.targetType === "powerTrain") {
                featureLoop = this.trainings.filter(training => training.realmID < 50);
            }
            else if (typeMod.targetType === "spiritTrain") {
                featureLoop = this.trainings.filter(training => training.realmID > 50);
            }
            else if (typeMod.targetType === "fighters") {
                featureLoop = this.fighters;
            }
            else if (typeMod.targetType === "allTrain") {
                featureLoop = this.trainings;
            }
            else if (typeMod.targetType === "trains&upgrades") {
                featureLoop = this.trainings;
            }
            else if (typeMod.targetType === "allTrainUpgrades") {
                featureLoop = this.upgrades;
            }

            //add type mod to relevant feature
            for (const feature of featureLoop) {
                if (typeMod.source !== feature) {
                    this.addModToObjectCalcTree(feature, typeMod);
                }
            }

        });
    }

    addModToObjectCalcTree(targetObject,mod) {
        let tree = null;

        switch (mod.type) {
            case 'baseCost':
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
            case 'baseValue':
            case 'value':
                if (targetObject.calcTreesMap.get("value")) {
                    targetObject.calcTreesMap.get("value").addNode(mod);
                    mod.calcTreeReferences.push(targetObject.calcTreesMap.get("value"));
                }
                else {
                    tree = new CalculationTree(targetObject, "value");
                    targetObject.calcTreesMap.set("value", tree);
                    tree.addNode(mod);
                    mod.calcTreeReferences.push(targetObject.calcTreesMap.get("value"));
                    this.calcTrees.push(tree);
                }
                break;

            default:
                console.error(targetObject, mod, "addModtocalctree error");
        }
    }

    initCalcTreesAndCaches() {
        this.calcTrees.forEach(tree => {
            tree.buildCache(tree.parent.level);
        });
        this.gameManager.updateAllMaxCaches();

        for (const training of this.trainings) {
            training.setNewMilestoneLevel();
            for (const [key, calcTree] of training.calcTreesMap) {
                calcTree.setNextMilestoneCachePoint();
            }
        }
        
    }

    registerModObserver(sourceObject, mod) {
        if (sourceObject) {
            sourceObject.registerObserver(mod);
            //console.error(mod.name, "subscribed to", sourceObject.name);
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

    pushFightersToStages() {
        this.fighters.forEach(fighter => {
            this.stages.find(stage => stage.id === fighter.stageID).fighters.push(fighter);
        });
    }

    assignUnlockReferences() {
        this.unlocks.forEach(unlock => {
            if (unlock.targetID) {
                unlock.target = this.findObjectById(unlock.targetID);
            }

            if (unlock.dependentID) {
                unlock.dependent = this.findObjectById(unlock.dependentID);
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

    printFighterInfo() {
        console.error("::::::::::::::::::::::::::");
        console.error("::::::   FIGHTERS   ::::::");
        console.error("::::::::::::::::::::::::::");
        this.fighters.forEach(fighter => {
            console.error(`Fighter ${fighter.id} - ${fighter.name}`);
            console.error(" Observers:");
            fighter.observers.forEach((observer, index) => {
                console.error(`  Observer ${index + 1}: ${observer.id} ${observer.name}`);
            });
            console.error(" Calc Trees:");
            fighter.calcTreesMap.forEach((calcTree, key) => {
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
}

class Unlock {
    constructor(id, conditionValue, conditionType, dependentID, targetID) {
        this.id = id;
        this.conditionValue = conditionValue;
        this.conditionType = conditionType;
        this.dependentID = dependentID;
        this.dependent = null;
        this.targetID = targetID;
        this.target = null;
    }
}

class UnlockManager {
    constructor(gameManager, eventManager) {
        this.gameManager = gameManager;
        this.eventManager = eventManager;
        this.unlocks = []; // Array to store unlock conditions
        this.completedUnlocks = [];

        // Register the check-unlocks event listener
        this.eventManager.addListener('check-unlocks', this.checkUnlockConditions.bind(this));
    }

    checkUnlockConditions() {
        let completedUnlocks = [];

        this.unlocks = this.unlocks.filter(unlock => {
            let isCompleted = false;

            switch (unlock.conditionType) {
                case 'level':
                    if (unlock.dependent.level.gte(unlock.conditionValue)) {
                        unlock.target.setActive();
                        isCompleted = true;
                    }
                    break;
                case 'isCompleted':
                    if (unlock.dependent.isCompleted === unlock.conditionValue) {
                        unlock.target.setActive();
                        isCompleted = true;
                    }
                    break;
            }

            if (isCompleted) {
                completedUnlocks.push(unlock);
            }

            return !isCompleted; // Keep the unlock in the array if it is not completed
        });

        // Append the completed unlocks to the completedUnlocks array
        this.completedUnlocks = this.completedUnlocks.concat(completedUnlocks);
    }
}

class GameSettings {
    constructor() {
    }
}

class GameUI {
    constructor(eventManager, gameManager, gameStateManager) {
        this.eventManager = eventManager;
        this.gameManager = gameManager;
        this.gameStateManager = gameStateManager;
        window.gameUI = this;
        this.statsRow = document.getElementById("row-stats");
        this.statsRow2 = document.getElementById("row-stats2");

        this.powerCol1 = document.getElementById("power-col1");
        this.powerCol2 = document.getElementById("power-col2");

        this.spiritCol1 = document.getElementById("spirit-col1");
        this.spiritCol2 = document.getElementById("spirit-col2");

        this.tournamentCol1 = document.getElementById("tournament-col1");
        this.tournamentCol2 = document.getElementById("tournament-col2");

        this.skillsCol1 = document.getElementById("skills-col1");
        this.skillsCol2 = document.getElementById("skills-col2");

        this.essenceCol1 = document.getElementById("essence-col1");

        this.numberSettings = document.getElementById("numberSettings");
        this.multSettings = document.getElementById("multSettings");

        this.multiplierString = multSettings.value;
        this.gameManager.multiplierString = this.multSettings.value;

        this.updateNumberNotationHandler = () => this.updateNumberNotation();
        this.updateMultiplierHandler = () => this.updateMultiplier();

        this.numberSettings.addEventListener('change', this.updateNumberNotationHandler);
        this.multSettings.addEventListener('change', this.updateMultiplierHandler);


        this.populateSaveLoadButtons();
        this.populateUI();
    }

    clear() {
        this.clearListeners();
        this.clearDynamicElements();
    }

    clearDynamicElements() {
        this.clearPowerTab();
        this.clearSpiritTab();
        this.clearTournamentTab();
        this.clearSkillTab();
    }

    clearListeners() {
        const saveButton = document.getElementById('save');
        const loadButton = document.getElementById('load');
        const resetButton = document.getElementById('reset');
        const rebirth1Button = document.getElementById('rebirth1');
        const rebirth2Button = document.getElementById('rebirth2');
        const rebirth3Button = document.getElementById('rebirth3');
        saveButton.removeEventListener('click', this.saveButtonHandler);
        loadButton.removeEventListener('click', this.loadButtonHandler);
        resetButton.removeEventListener('click', this.resetButtonHandler);
        rebirth1Button.removeEventListener('click', this.rebirth1ButtonHandler);
        rebirth2Button.removeEventListener('click', this.rebirth2ButtonHandler);
        rebirth3Button.removeEventListener('click', this.rebirth3ButtonHandler);

        this.numberSettings.removeEventListener('change', this.updateNumberNotationHandler);
        this.multSettings.removeEventListener('change', this.updateMultiplierHandler);
    }

    clearPowerTab() {
        this.removeAllChildren(this.powerCol1);
    }

    clearSpiritTab() {
        this.removeAllChildren(this.spiritCol1);
    }

    clearTournamentTab() {
        this.removeAllChildren(this.tournamentCol1);
    }

    clearSkillTab() {
        let skillGrid = this.skillsCol1.querySelector('.skill-grid');
        if (skillGrid) {
            skillGrid.remove();
        }
    }

    removeAllChildren(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    isAffordable(feature) {
        let featureType = feature.featureType;
        let cacheKey = null;
        let resourceType = feature.costType;

        if (featureType === "fighter") {
            cacheKey = "1";
        }
        else {
            cacheKey = this.multSettings.value;
            //console.error(cacheKey);
        }

        let currentCost = feature.calcTreesMap.get("cost").cacheMap.get(cacheKey.toString());

        let currentResource = this.gameManager.queryPlayerResource(resourceType);

        //console.error(feature.name,currentResource, currentCost);
        if (currentResource.gt(currentCost)) {
            return true;
        }

        return false;
    }

    updateNumberNotation() {
        this.numberNotation = this.numberSettings.value;
        this.updateUI();
    }

    updateMultiplier() {
        this.multiplierString = this.multSettings.value;
        //this.gameManager.onMultiplierChange(this.multiplier);

        this.gameManager.multiplierString = this.multiplierString;
    }

    async populateUI() {
        this.updateUI();
    }

    updateUI() {
        this.populateStatsDisplay();
        this.populatePowerTab();
        this.populateSpiritTab();
        this.populateTournamentTab();
        this.populateSkillsTab();
        this.populateEssenceTab();
    }

    async populateStatsDisplay() {

        // Create and add the elements only once
        if (!this.statsRow.querySelector('.power-stat')) {
            //row 1
            const powerStat = document.createElement('div');
            powerStat.className = 'power-stat';
            this.statsRow.appendChild(powerStat);

            const powerIncomeStat = document.createElement('div');
            powerIncomeStat.className = 'power-income-stat';
            this.statsRow.appendChild(powerIncomeStat);

            const spiritStat = document.createElement('div');
            spiritStat.className = 'spirit-stat';
            this.statsRow.appendChild(spiritStat);

            const spiritIncomeStat = document.createElement('div');
            spiritIncomeStat.className = 'spirit-income-stat';
            this.statsRow.appendChild(spiritIncomeStat);

            const powerLevelStat = document.createElement('div');
            powerLevelStat.className = 'power-level-stat';
            this.statsRow.appendChild(powerLevelStat);

            const essenceStat = document.createElement('div');
            essenceStat.className = 'essence-stat';
            this.statsRow.appendChild(essenceStat);

            const skillpointStat = document.createElement('div');
            skillpointStat.className = 'skillpoint-stat';
            this.statsRow.appendChild(skillpointStat);

            //row 2
            const lifetimePower = document.createElement('div');
            lifetimePower.className = 'lifetime-power';
            this.statsRow2.appendChild(lifetimePower);

            const placeHolder1 = document.createElement('div');
            placeHolder1.className = '';
            this.statsRow2.appendChild(placeHolder1);

            const lifetimeSpirit = document.createElement('div');
            lifetimeSpirit.className = 'lifetime-spirit';
            this.statsRow2.appendChild(lifetimeSpirit);

            const placeHolder2 = document.createElement('div');
            placeHolder2.className = '';
            this.statsRow2.appendChild(placeHolder2);

            const lifetimeEssence = document.createElement('div');
            lifetimeEssence.className = 'lifetime-essence';
            this.statsRow2.appendChild(lifetimeEssence);

            const essenceMultiplier = document.createElement('div');
            essenceMultiplier.className = 'essence-multiplier';
            this.statsRow2.appendChild(essenceMultiplier);

        }

        // Update the text of the elements without replacing their content

        //row 1
        this.statsRow.querySelector('.power-stat').textContent = `Power\n${this.formatNumber(this.gameManager.gameContent.player.power)}`;
        this.statsRow.querySelector('.power-income-stat').textContent = `powerIncome\n ${this.formatNumber(this.gameManager.gameContent.player.powerIncome)}`;
        this.statsRow.querySelector('.spirit-stat').textContent = `Spirit\n${this.formatNumber(this.gameManager.gameContent.player.spirit)}`;
        this.statsRow.querySelector('.spirit-income-stat').textContent = `spiritIncome\n${this.formatNumber(this.gameManager.gameContent.player.spiritIncome)}`;
        this.statsRow.querySelector('.power-level-stat').textContent = `PowerLevel\n${this.formatNumber(this.gameManager.gameContent.player.powerLevel)}`;
        this.statsRow.querySelector('.essence-stat').textContent = `Essence\n${this.formatNumber(this.gameManager.gameContent.player.essence)}`;
        this.statsRow.querySelector('.skillpoint-stat').textContent = `Skillpoint\n${this.formatNumber(this.gameManager.gameContent.player.skillpoint)}`;

        //row 2
        this.statsRow2.querySelector('.lifetime-power').textContent = `LifetimePower\n${this.formatNumber(this.gameManager.gameContent.player.lifetimePowerEarned)}`;
        this.statsRow2.querySelector('.lifetime-spirit').textContent = `LifetimeSpirit\n${this.formatNumber(this.gameManager.gameContent.player.lifetimeSpiritEarned)}`;
        this.statsRow2.querySelector('.lifetime-essence').textContent = `LifetimeEssence\n${this.formatNumber(this.gameManager.gameContent.player.lifetimeEssenceEarned)}`;

        let rebirth1PseudoObject = this.gameManager.findObjectById(60000);
        this.statsRow2.querySelector('.essence-multiplier').textContent = `EssenceMultiplier\n${this.formatNumber(rebirth1PseudoObject.level)}`;
    }
    
    populateSaveLoadButtons() {
        // Get the save and load divs
        const saveButton = document.getElementById('save');
        const loadButton = document.getElementById('load');
        const resetButton = document.getElementById('reset');
        const rebirth1Button = document.getElementById('rebirth1');
        const rebirth2Button = document.getElementById('rebirth2');
        const rebirth3Button = document.getElementById('rebirth3');

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
            this.gameStateManager.loadGameState(0);
            loadButton.innerHTML = "Game Loaded!";
            loadButton.classList.add('fade');
            setTimeout(function () {
                loadButton.classList.remove('fade');
                loadButton.innerHTML = "Load";
            }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
        };

        this.resetButtonHandler = () => {
            this.gameStateManager.loadGameState(-1);
            resetButton.innerHTML = "Game Reset!";
            resetButton.classList.add('fade');
            setTimeout(function () {
                resetButton.classList.remove('fade');
                resetButton.innerHTML = "Reset";
            }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
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
        rebirth1Button.addEventListener('click', this.rebirth1ButtonHandler);
        rebirth2Button.addEventListener('click', this.rebirth2ButtonHandler);
        rebirth3Button.addEventListener('click', this.rebirth3ButtonHandler);
    }


    populatePowerTab() {
        this.populateRealms(this.powerCol1, this.gameManager.gameContent.powerRealms);
    }

    populateSpiritTab() {
        this.populateRealms(this.spiritCol1, this.gameManager.gameContent.spiritRealms);
    }

    populateRealms(targetCol, realms) {
        realms.forEach(realm => {
            const realmId = `realm-${realm.name}`;
            let realmName = targetCol.querySelector(`#${realmId}`);
            if (!realmName) {
                realmName = document.createElement('div');
                realmName.id = realmId;
                realmName.textContent = `${realm.name}`;
                realmName.setAttribute('style', 'font-size:16px; font-weight: bold; margin-top:20px; margin-bottom:10px; border-bottom: 1px dashed white;');
                targetCol.appendChild(realmName);
            }

            realm.trainings.forEach(training => {
                const trainingId = `training-${training.id}`;
                let trainingCell = targetCol.querySelector(`#${trainingId}`);
                if (!trainingCell) {
                    trainingCell = document.createElement('div');
                    trainingCell.id = trainingId;
                    trainingCell.classList.add('training-cell');
                    
                    const trainingName = document.createElement('div');
                    trainingName.className = 'training-name';
                    trainingName.textContent = training.name + " lvl " + training.level + "\n" + training.description;
                    trainingCell.appendChild(trainingName);

                    const buttonContainer = document.createElement('div');
                    const button = document.createElement('button');
                    button.id = `button-${training.id}`;
                    button.addEventListener('click', () => {
                        this.buyFeature(training.id);
                    });
                    buttonContainer.appendChild(button);
                    trainingCell.appendChild(buttonContainer);

                    targetCol.appendChild(trainingCell);
                }

                // Update training level text
                const trainingName = trainingCell.querySelector('.training-name');
                trainingName.textContent = training.name + " lvl " + training.level;

                // Create and update the current value and valueType element
                let currentValueElement = trainingCell.querySelector('.training-current-value');
                if (!currentValueElement) {
                    currentValueElement = document.createElement('div');
                    currentValueElement.className = 'training-current-value';
                    currentValueElement.setAttribute('style', 'font-size:10px;');
                    trainingCell.appendChild(currentValueElement);
                }

                // Update training description text
                let trainingDescription = trainingCell.querySelector('.training-description');
                if (!trainingDescription) {
                    trainingDescription = document.createElement('div');
                    trainingDescription.className = 'training-description';
                    trainingDescription.setAttribute('style', 'font-size:10px; max-width: 150px;');
                    trainingCell.appendChild(trainingDescription);
                }
                trainingDescription.textContent = "\n" + training.description;

                // Display 0 for the value if the training level is 0
                currentValueElement.textContent = `${this.formatNumber(training.value)} ${training.valueType}`;
                
                // Update button text, style, and clickability based on training.active
                const button = trainingCell.querySelector(`#button-${training.id}`);
                button.setAttribute('style', 'white-space:pre;');
                if (this.multiplierString === "-1") {
                    button.textContent = `x ${training.maxAffordableLevel}\r\n`;
                }
                else if (this.multiplierString === "-2") {
                    button.textContent = `x ${training.nextMilestoneLevel.minus(training.level)}\r\n`;
                }
                else {
                button.textContent = `x${this.multiplierString}\r\n`;    
                }

                let nextTrainingValue = new Decimal(training.calcTreesMap.get("value").getCacheValue(this.multiplierString));

                let nextTrainingCost = new Decimal(training.calcTreesMap.get("cost").getCacheValue(this.multiplierString));
                button.textContent += `-${this.formatNumber(nextTrainingCost)} ${training.costType}\r\n`;
                //button.textContent += `-${this.formatNumber((training.calcTreesMap.get("cost").cacheMap.get(this.multiplierString)))} ${training.costType}\r\n`;
                button.textContent += `+${this.formatNumber(nextTrainingValue.minus(training.value))} ${training.valueType}`;

                if (training.active && (training.level !== training.maxLevel) && this.isAffordable(training)) {
                    button.disabled = false;
                    button.style.opacity = 1;
                }
                else if (training.level === training.maxLevel) {
                    button.disabled = true;
                    button.style.opacity = 0.6;
                    button.innerHTML = "max";
                }
                else {
                    button.disabled = true;
                    button.style.opacity = 0.6;
                }
            });


            realm.upgrades.forEach(upgrade => {
                const upgradeId = `upgrade-${upgrade.id}`;
                let upgradeCell = targetCol.querySelector(`#${upgradeId}`);
                if (!upgradeCell) {
                    upgradeCell = document.createElement('div');
                    upgradeCell.id = upgradeId;
                    upgradeCell.classList.add('upgrade-cell');

                    const upgradeName = document.createElement('div');
                    upgradeName.className = 'upgrade-name';
                    upgradeName.textContent = upgrade.name + " lvl " + upgrade.level + "\n" + upgrade.description;
                    upgradeCell.appendChild(upgradeName);

                    const buttonContainer = document.createElement('div');
                    const button = document.createElement('button');
                    button.id = `button-${upgrade.id}`;
                    button.addEventListener('click', () => {
                        this.buyFeature(upgrade.id);
                    });
                    buttonContainer.appendChild(button);
                    upgradeCell.appendChild(buttonContainer);

                    targetCol.appendChild(upgradeCell);
                }

                // Update upgrade level text
                const upgradeName = upgradeCell.querySelector('.upgrade-name');
                upgradeName.textContent = upgrade.name + " lvl " + upgrade.level;


                // Update upgrade description text
                let upgradeDescription = upgradeCell.querySelector('.upgrade-description');
                if (!upgradeDescription) {
                    upgradeDescription = document.createElement('div');
                    upgradeDescription.className = 'upgrade-description';
                    upgradeDescription.setAttribute('style', 'font-size:10px; max-width: 150px;');
                    upgradeCell.appendChild(upgradeDescription);
                }
                upgradeDescription.textContent = "\n" + upgrade.description;

                // Update button text, style, and clickability based on upgrade.active
                const button = upgradeCell.querySelector(`#button-${upgrade.id}`);
                button.setAttribute('style', 'white-space:pre;');
                if (this.multiplierString === "-1") {
                    button.textContent = `x${upgrade.maxAffordableLevel}\r\n`;
                }

                else if (this.multiplierString === "-2") {
                    button.textContent = `x1\r\n`;
                }

                //if cache does not contain value that multiplier has set
                else if (upgrade.calcTreesMap.get("cost").cacheMap.size < (new Decimal(this.multiplierString)).toNumber() + 2) {
                    button.textContent = `x${upgrade.maxAffordableLevel}\r\n`;
                }
                else {
                    button.textContent = `x${this.multiplierString}\r\n`;
                }
                let nextUpgradeCost = new Decimal(upgrade.calcTreesMap.get("cost").getCacheValue(this.multiplierString).toNumber());
                button.textContent += `-${this.formatNumber(nextUpgradeCost)} ${upgrade.costType}\r\n`;

                
                if (upgrade.active && upgrade.level.neq(upgrade.maxLevel) && this.isAffordable(upgrade)) {
                    button.disabled = false;
                    button.style.opacity = 1;
                }
                else if (upgrade.level.eq(upgrade.maxLevel)) {
                    button.disabled = true;
                    button.style.opacity = 0.6;
                    button.innerHTML = "max";
                }
                else {
                    button.disabled = true;
                    button.style.opacity = 0.6;
                }
            });
        });
    }


    populateTournamentTab() {
        const stages = this.gameManager.gameContent.tournament.stages;
        stages.forEach(stage => {
            const stageID = `stage-${stage.id}`;
            let stageName = this.tournamentCol1.querySelector(`#${stageID}`);
            if (!stageName) {
                stageName = document.createElement('div');
                stageName.id = stageID;
                stageName.textContent = `${stage.name}`;
                stageName.setAttribute('style', 'font-size:16px; font-weight: bold; margin-top:20px; margin-bottom:10px; border-bottom: 1px dashed white;');
                this.tournamentCol1.appendChild(stageName);
            }

            stage.fighters.forEach(fighter => {
                const fighterId = `fighter-${fighter.id}`;
                let fighterCell = this.tournamentCol1.querySelector(`#${fighterId}`);
                if (!fighterCell) {
                    fighterCell = document.createElement('div');
                    fighterCell.id = fighterId;
                    fighterCell.classList.add('fighter-cell');

                    const fighterName = document.createElement('div');
                    fighterName.className = 'fighter-name';
                    fighterName.textContent = `${fighter.name}`;
                    fighterCell.appendChild(fighterName);


                    const button = document.createElement('button');
                    button.setAttribute('style', 'white-space:pre;');
                    button.id = `fight-button-${fighter.id}`;
                    button.addEventListener('click', () => {
                        this.fight(stage.id, fighter.id, this.gameManager.gameContent.player.powerLevel);
                    });

                    fighterCell.appendChild(button);

                    this.tournamentCol1.appendChild(fighterCell);
                }

                // Create and update the power level text
                const fighterName = fighterCell.querySelector('.fighter-name');
                fighterName.textContent = `${fighter.name}`;

                // Update button appearance based on fighter.active
                const button = document.querySelector(`#fight-button-${fighter.id}`);
                button.textContent = `Fight \r\n`;
                button.textContent += `PwrLvl: ${this.formatNumber(fighter.calcTreesMap.get("cost").cacheMap.get("1"))}\r\n`;
                button.textContent += `+ ${this.formatNumber(fighter.calcTreesMap.get("value").cacheMap.get("1"))} skillpoint`;
                if (!fighter.active || !this.isAffordable(fighter)) {
                    button.disabled = true;
                    button.style.opacity = 0.5;
                }
                else if (fighter.isDefeated) {
                    button.disabled = true;
                    button.style.opacity = 0.2;
                    button.setAttribute('style', 'white-space:pre; background-color:green;');
                }

                else {
                    button.disabled = false;
                    button.style.opacity = 1;
                }
            });
        });
    }

    populateSkillsTab() {
        const skills = this.gameManager.gameContent.skillTree.skills;

        // Create a container for the skill grid if it doesn't exist
        let skillGrid = this.skillsCol1.querySelector('.skill-grid');
        if (!skillGrid) {
            skillGrid = document.createElement('div');
            skillGrid.classList.add('skill-grid');
            this.skillsCol1.appendChild(skillGrid);
        }

        skills.forEach(skill => {
            const skillId = `skill-${skill.id}`;

            // Create a skill node element and position it based on its connections
            let skillNode = skillGrid.querySelector(`#${skillId}`);
            if (!skillNode) {
                skillNode = document.createElement('div');
                skillNode.id = skillId;
                skillNode.classList.add('skill-node');

                // Create the level text element
                const levelText = document.createElement('span');
                levelText.classList.add('skill-level');
                skillNode.appendChild(levelText);

                // Create a line element to connect the skill nodes
                const connections = skill.node.connections;
                for (const direction in connections) {
                    if (connections[direction]) { // Check if there is a connection in this direction
                        const line = document.createElement('div');
                        line.classList.add('skill-line', direction);
                        skillNode.appendChild(line);
                    }
                }

                // Add click event to upgrade the skill
                skillNode.addEventListener('click', () => {
                    if (!skillNode.getAttribute('disabled')) {
                        this.buyFeature(skill.id);
                    }
                });

                // Add the skill node to the skill grid
                skillGrid.appendChild(skillNode);
            }

            // Update skill node properties
            if (!skill.active || !skill.level.lt(skill.maxLevel) || !this.isAffordable(skill)) {
                skillNode.setAttribute('disabled', true);
                skillNode.setAttribute('style', 'opacity: 0.3;');
            } else {
                skillNode.removeAttribute('disabled');
                skillNode.setAttribute('style', 'opacity:1;');
            }
            skillNode.style.left = `${skill.node.x}px`;
            skillNode.style.top = `${skill.node.y}px`;

            // Update skill node title and level text
            skillNode.title = `${skill.name}\nLevel: ${skill.level}/${skill.maxLevel}\nCost: ${new Decimal(skill.calcTreesMap.get("cost").getCacheValue(this.multiplierString).toNumber())}\n${skill.description}`;
            const levelText = skillNode.querySelector('.skill-level');
            levelText.textContent = `${skill.level}/${skill.maxLevel}`;
        });
    }

    populateEssenceTab() {
        const essenceUpgrades = this.gameManager.gameContent.essenceUpgrades;
        let targetCol = this.essenceCol1;
        essenceUpgrades.forEach(upgrade => {
            const upgradeId = `upgrade-${upgrade.id}`;
            let upgradeCell = targetCol.querySelector(`#${upgradeId}`);
            if (!upgradeCell) {
                upgradeCell = document.createElement('div');
                upgradeCell.id = upgradeId;
                upgradeCell.classList.add('upgrade-cell');

                const upgradeName = document.createElement('div');
                upgradeName.className = 'upgrade-name';
                upgradeName.textContent = upgrade.name + " lvl " + upgrade.level + "\n" + upgrade.description;
                upgradeCell.appendChild(upgradeName);

                const buttonContainer = document.createElement('div');
                const button = document.createElement('button');
                button.id = `button-${upgrade.id}`;
                button.addEventListener('click', () => {
                    this.buyFeature(upgrade.id);
                });
                buttonContainer.appendChild(button);
                upgradeCell.appendChild(buttonContainer);

                targetCol.appendChild(upgradeCell);
            }

            // Update upgrade level text
            const upgradeName = upgradeCell.querySelector('.upgrade-name');
            upgradeName.textContent = upgrade.name + " lvl " + upgrade.level;


            // Update upgrade description text
            let upgradeDescription = upgradeCell.querySelector('.upgrade-description');
            if (!upgradeDescription) {
                upgradeDescription = document.createElement('div');
                upgradeDescription.className = 'upgrade-description';
                upgradeDescription.setAttribute('style', 'font-size:10px; max-width: 150px;');
                upgradeCell.appendChild(upgradeDescription);
            }
            upgradeDescription.textContent = "\n" + upgrade.description;

            // Update button text, style, and clickability based on upgrade.active
            const button = upgradeCell.querySelector(`#button-${upgrade.id}`);
            button.setAttribute('style', 'white-space:pre;');
            if (this.multiplierString === "-1") {
                button.textContent = `x${upgrade.maxAffordableLevel}\r\n`;
            }

            else if (this.multiplierString === "-2") {
                button.textContent = `x1\r\n`;
            }

            //if cache does not contain value that multiplier has set
            else if (upgrade.calcTreesMap.get("cost").cacheMap.size < (new Decimal(this.multiplierString)).toNumber() + 2) {
                button.textContent = `x${upgrade.maxAffordableLevel}\r\n`;
            }
            else {
                button.textContent = `x${this.multiplierString}\r\n`;
            }
            let nextUpgradeCost = new Decimal(upgrade.calcTreesMap.get("cost").getCacheValue(this.multiplierString).toNumber());
            button.textContent += `-${this.formatNumber(nextUpgradeCost)} ${upgrade.costType}\r\n`;


            if (upgrade.active && upgrade.level.neq(upgrade.maxLevel) && this.isAffordable(upgrade)) {
                button.disabled = false;
                button.style.opacity = 1;
            }
            else if (upgrade.level.eq(upgrade.maxLevel)) {
                button.disabled = true;
                button.style.opacity = 0.6;
                button.innerHTML = "max";
            }
            else {
                button.disabled = true;
                button.style.opacity = 0.6;
            }
        });
    }

    formatNumber(num) {
        switch (this.numberNotation) {
            case "toStringWithDecimalPlaces":
                return num.toStringWithDecimalPlaces(3);
            case "toExponential":
                return num.toExponential(3);
            case "toJSON":
                return num.toJSON();
            case "toPrecision":
                return num.toPrecision(3);
            case "toNumber":
                return num.toNumber(2);
            case "toString":
                return num.toString(2);
            case "toFixed":
                return num.toFixed(2);
            case "magnitudeWithDecimalPlaces":
                return num.magnitudeWithDecimalPlaces(2);
            case "mantissaWithDecimalPlaces":
                return num.mantissaWithDecimalPlaces(2);
            default:
                return num.toPrecision(3);
        }
    }

    // Add this fight method to handle the button click and dispatch the event
    fight(stageId, fighterId, playerPowerLevel) {
        this.eventManager.dispatchEvent('fight', { stageId, fighterId, playerPowerLevel });
    }

    //dispatch buy feature event to gamemanager
    buyFeature(id) {
        this.eventManager.dispatchEvent('handlePurchase', { id });

        this.eventManager.dispatchEvent('check-unlocks');
    }
}

class GameManager {
    constructor(eventManager) {
        this.eventManager = eventManager;
        this.gameContent = new GameContent(eventManager);

        this.calcCycle = 0;

        this.multiplierString = "";

        this.eventManager.addListener('queryPlayerResource', (data, respond) => {
            const result = this.queryPlayerResource(data);
            if (respond) {
                respond(result);
            }
        });

        this.eventManager.addListener('handlePurchase', (data) => {
            this.handlePurchase(data.id);
        });
    }

    handlePurchase(featureID) {
        const feature = this.findObjectById(featureID);

        //console.error("::::::::::::::::::", feature.name, "HANDLE PURCHASE", "::::::::::::::::::");

        const levelUpCount = this.convertMultiplierString(feature);

        this.calcCycle++;

        this.deductFeatureCost(feature, feature.costType, levelUpCount);

        this.setFeatureValue(feature, this.multiplierString, true);

        feature.levelUp(this, levelUpCount);

        this.updateAllMaxCaches();

        this.eventManager.dispatchEvent('check-unlocks');
    }

    convertMultiplierString(feature) {
        if (this.multiplierString === "-1") {
            return feature.maxAffordableLevel;;
        }
        else if (this.multiplierString === "-2") {
            if (feature.featureType === "training") {
                return feature.nextMilestoneLevel.minus(feature.level);
            }
            else {
                return new Decimal(1);
            }
        }
        else {
            return new Decimal(this.multiplierString);
        }

    }

    updateValues(targetTree) {
        this.setFeatureValue(targetTree.parent, this.multiplierString, false);
        this.updatePlayerResources(targetTree.parent);
    }

    deductFeatureCost(feature, costType, multiplier) {
        let cost = feature.calcTreesMap.get("cost").cacheMap.get(multiplier.toString());
        switch (costType) {
            case 'power':
                this.gameContent.player.power = this.gameContent.player.power.minus(cost);
                break;
            case 'spirit':
                this.gameContent.player.spirit = this.gameContent.player.spirit.minus(cost);
                break;
            case 'skillpoint':
                this.gameContent.player.skillpoint = this.gameContent.player.skillpoint.minus(cost);
                break;
            case 'essence':
                this.gameContent.player.essence = this.gameContent.player.essence.minus(cost);
                break;
            case 'powerLevel':
                //do not deduct anything
                break;
            default:
                console.error('Invalid subtractcost');
        }
    }

    setFeatureValue(feature, multiplier, isNewLevel) {
        if (!isNewLevel) {
            multiplier = "0";
        }
        if (feature.featureType === "training" && feature.level.gt(0)) {
            feature.value = feature.calcTreesMap.get("value").cacheMap.get(multiplier);
        }
    }

    updatePlayerResources(feature) {
        if (feature.featureType === "training" && feature.active) {
            const incomeMap = this.gameContent.player.incomeMap;

            let newValue = feature.value;

            let valueToAdd = new Decimal(0);

            if (incomeMap.get(feature.id)) {
                valueToAdd = newValue.minus(incomeMap.get(feature.id));
            }
            else {
                valueToAdd = newValue;
            }

            incomeMap.set(feature.id, newValue);

            switch (feature.valueType) {
                case 'powerIncome':
                    this.gameContent.player.powerIncome = this.gameContent.player.powerIncome.plus(valueToAdd);
                    break;
                case 'spiritIncome':
                    this.gameContent.player.spiritIncome = this.gameContent.player.spiritIncome.plus(valueToAdd);
                    break;
                default:
                    console.error('updatePlayerResources error');
            }
        }
    }

    calculatePlayerIncome() {
        this.gameContent.player.power = this.gameContent.player.power.plus(this.gameContent.player.powerIncome);
        this.gameContent.player.spirit = this.gameContent.player.spirit.plus(this.gameContent.player.spiritIncome);
        this.gameContent.player.powerLevel = this.gameContent.player.powerLevel.plus(this.gameContent.player.powerIncome).plus(this.gameContent.player.spiritIncome);


        this.gameContent.player.lifetimePowerEarned = this.gameContent.player.lifetimePowerEarned.plus(this.gameContent.player.powerIncome);
        this.gameContent.player.lifetimeSpiritEarned = this.gameContent.player.lifetimeSpiritEarned.plus(this.gameContent.player.spiritIncome);
    }

    queryPlayerResource(type) {
        switch (type) {
            case 'power':
                return this.gameContent.player.power;
            case 'spirit':
                return this.gameContent.player.spirit;
            case 'essence':
                return this.gameContent.player.essence;
            case 'skillpoint':
                return this.gameContent.player.skillpoint;
            case 'powerLevel':
                return this.gameContent.player.powerLevel;
            case 'all':
                return [
                    { 'type': 'power', 'value': this.gameContent.player.power },
                    { 'type': 'spirit', 'value': this.gameContent.player.spirit },
                    { 'type': 'essence', 'value': this.gameContent.player.essence },
                    { 'type': 'skillpoint', 'value': this.gameContent.player.skillpoint },
                    { 'type': 'powerLevel', 'value': this.gameContent.player.powerLevel }
                ];
            default:
                console.error('Invalid stat:', type);
        }
    }

    findObjectById(id) {
        let object = this.gameContent.idToObjectMap.get(id);
        return object;
    }

    findTrainingById(trainingId) {
        // Search for the training object in the powerRealms array
        for (const realm of this.gameContent.powerRealms) {
            const training = realm.trainings.find(t => t.id === trainingId);
            if (training) return training;
        }

        // Search for the training object in the spiritRealms array
        for (const realm of this.gameContent.spiritRealms) {
            const training = realm.trainings.find(t => t.id === trainingId);
            if (training) return training;
        }

        // If the training object is not found in either array, return undefined
        return undefined;
    }

    updateAllMaxCaches() {
        this.isCacheBuilding = true;
        let allObjects = Array.from(this.gameContent.idToObjectMap.values());

        let maxableObjects = this.filterMaxableObjects(allObjects);

        const allResources = this.queryPlayerResource("all");

        this.buildMaxCachesForFeatures(maxableObjects, allResources);
        this.isCacheBuilding = false;
    }

    filterMaxableObjects(objects) {
        let filterTypes = ["training", "upgrade", "skill"];
        return objects.filter(object => filterTypes.includes(object.featureType));
    }

    buildMaxCachesForFeatures(features, resources) {
        for (const feature of features) {
            let matchingResource = resources.find(resource => resource.type === feature.costType);

            if (matchingResource) {
                feature.buildMaxCache(new Decimal(matchingResource.value));
            } else {
                console.error(`No resource found for costType: ${feature.costType}`);
            }
        }
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
}

class GameContent {
    constructor(eventManager) {
        this.idToObjectMap = new Map();
        this.powerRealms = [];
        this.spiritRealms = [];
        this.eventManager = eventManager;
        this.player = new Player(eventManager);
        //this.achievements = new Achievements(eventManager);
        //this.ascensionTree = new AscensionTree(eventManager);
        this.skillTree = new SkillTree(eventManager);
        this.tournament = new Tournament(eventManager);
        this.unlocks = [];
        this.essenceUpgrades = [];
    }
}

class Player {
    constructor(eventManager) {
        this.eventManager = eventManager;
        this.powerLevel = new Decimal(5);
        this.power = new Decimal(2000);
        this.powerIncome = new Decimal(0);
        this.spirit = new Decimal(200);
        this.spiritIncome = new Decimal(0);
        this.essence = new Decimal(5);
        this.skillpoint = new Decimal(305);

        this.lifetimePowerEarned = new Decimal(0);
        this.lifetimeSpiritEarned = new Decimal(0);
        this.lifetimeEssenceEarned = new Decimal(0);
        this.maxProgressionStage = new Decimal(0);
        this.maxProgressionRank = new Decimal(0); //top rank within max stage
        this.lifetimeKills = new Decimal(0);

        this.incomeMap = new Map();

        this.eventManager.addListener('addPlayerResource', (data) => {
            this.addPlayerResource(data);
        });
    }

    addPlayerResource(data) {
        let resourceType = data.rewardType;
        let resourceValue = data.rewardValue;
        switch (resourceType) {
            case 'skillpoint':
                this.skillpoint = this.skillpoint.plus(resourceValue);
        }
    }
}

class Observable {
    constructor() {
        this.observers = [];
    }

    registerObserver(observer) {
        this.observers.push(observer);
        //console.error(observer.name, "registered to:", this.name);
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
    constructor(eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active) {
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
        this.value = new Decimal(value);

        this.calcTreeReferences = [];

        this.active = active;
        
        this.lastCalcCycle = 0;
    }

    setActive() {
        this.active = true;
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
    constructor(parent, valueType) {
        this.nodes = [];
        this.parent = parent;
        this.valueType = valueType;
        this.currentRunningResult = new Decimal(0);
        this.cacheMap = new Map();

        this.maxKeyInCache = null;
        this.maxCacheLevel = new Decimal(0);

        this.isCacheBuilding = false;
    }

    getCacheValue(value) {
        value = new Decimal(value);  // ensure level is a Decimal
        let cacheValue = null;

        // check if the cacheMap has the level
        if (this.cacheMap.has(value.toString())) {
            cacheValue = this.cacheMap.get(value.toString());
        } else {
            // if the cache value doesn't exist, use the maximum available value
            
            cacheValue = this.cacheMap.get("1");
        }

        return cacheValue;
    }

    buildCache(sourceLevel) {
        this.isCacheBuilding = true;

        this.clearCache();

        let levelCap = null;
        if (this.parent.maxLevel) {
            levelCap = new Decimal(this.parent.maxLevel.minus(this.parent.level));
        }

        let cachePoints = this.assignCachePoints();

        if (this.valueType === "cost") {
            this.buildTree("cost", sourceLevel, cachePoints, levelCap);
        }
        else if (this.valueType === "value") {
            this.buildTree("value", sourceLevel, cachePoints, levelCap);
        }
        this.isCacheBuilding = false;
    }

    buildTree(type, sourceLevel, cachePoints, levelCap) {
        let minCacheLevel = new Decimal(cachePoints[0]);
        let maxCacheLevel = new Decimal(cachePoints[cachePoints.length - 1]);
        let cumulativeResult = new Decimal(0);

        for (let j = minCacheLevel; j.lte(maxCacheLevel); j = j.plus(1)) {
            if (levelCap && j.gte(levelCap)) {
                if (type === "cost") {
                    cumulativeResult = cumulativeResult.plus(this.currentRunningResult);
                } else if (type === "value") {
                    cumulativeResult = this.currentRunningResult;
                }

                this.cacheMap.set(j.toString(), cumulativeResult);
                break;
            }
            let newLevel = sourceLevel.plus(new Decimal(j));
            this.updateBaseNode(newLevel);
            this.updateDownstreamNodes();

            if (type === "cost") {
                cumulativeResult = cumulativeResult.plus(this.currentRunningResult);
            } else if (type === "value") {
                cumulativeResult = this.currentRunningResult;
            }

            this.cacheMap.set(j.toString(), cumulativeResult);
        } 
    }

    setNextMilestoneCachePoint() {
        let milestoneCacheLevel = this.parent.nextMilestoneLevel.minus(this.parent.level);
        let valueAtNextMilestone = this.cacheMap.get(milestoneCacheLevel.toString());
        this.cacheMap.set("-2", valueAtNextMilestone);
    }

    assignCachePoints() {
        let cachePoints;

        if (this.parent.featureType === "fighter") {
            cachePoints = [new Decimal(1)];
        }
        else if (this.parent.featureType === "skill") {

            cachePoints = [new Decimal(1), new Decimal(5), new Decimal(10)];
        }
        else if (this.valueType === "cost") {
            cachePoints = [new Decimal(1), new Decimal(5), new Decimal(10), new Decimal(100)];
        }
        else if (this.valueType === "value") {
            cachePoints = [new Decimal(0), new Decimal(1), new Decimal(5), new Decimal(10), new Decimal(100)];
        }

        if (this.parent.featureType === "training") {
            this.assignNextMilestoneCachePoint(cachePoints);
        }

        return cachePoints;
    }

    assignNextMilestoneCachePoint(cachePoints) {
        let maxMilestoneLevel = this.parent.milestoneTiers[this.parent.milestoneTiers.length - 1];

        //return 1 if above the max milestone level
        if (this.parent.level.gte(maxMilestoneLevel)) {
            this.parent.nextMilestoneLevel = this.parent.level.plus(1);
            return;
        }
        let nextMilestoneLevel = this.parent.findNextMilestoneLevel();

        if (this.parent.level.lte(nextMilestoneLevel)) {
            let maxCachePoint = cachePoints[cachePoints.length - 1];
            let nextMilestoneCachePoint = nextMilestoneLevel.minus(this.parent.level);

            //only add if not already within cache range
            if (nextMilestoneCachePoint.gte(maxCachePoint)) {
                cachePoints.push(nextMilestoneCachePoint);
            }
        }
    }

    buildMaxCostCache(levelCap, resource) {
        let maxCacheSize = new Decimal(1000);

        //size of cache minus max(-1) and next(-2)
        let currentCacheSize = new Decimal(this.cacheMap.size - 2);

        let maxAffordableLevel = new Decimal(currentCacheSize);

        //don't proceed if cache is already at max size
        if (currentCacheSize.eq(maxCacheSize)) {
            return;
        }

        //check if can afford a single level
        if (resource.lt(this.cacheMap.get("1"))) {
            this.cacheMap.set("-1", this.cacheMap.get("1"));
            this.parent.maxAffordableLevel = new Decimal(0);
            return;
        }

        //check if cache already contains affordable level
        if (resource.lte(this.cacheMap.get(currentCacheSize.toString()))) {
            let i = currentCacheSize;
            while (i.gte(1)) {
                if (resource.gte(this.cacheMap.get(i.toString()))) {
                    maxAffordableLevel = i;
                    break;
                }
                i = i.minus(1);
            }

            this.cacheMap.set("-1", this.cacheMap.get(maxAffordableLevel.toString()));
            this.parent.maxAffordableLevel = maxAffordableLevel;
            return;
        }

        //iterate upwards from current tree top until find max affordable level
        let costMax = new Decimal(this.cacheMap.get(currentCacheSize.toString()));
        let currentParentLevel = this.parent.level;

        while (maxAffordableLevel.lt(maxCacheSize)) {
            if (levelCap && maxAffordableLevel.gte(levelCap)) {
                break;
            }
            maxAffordableLevel = maxAffordableLevel.plus(1);
            this.updateBaseNode(maxAffordableLevel.plus(currentParentLevel));
            this.updateDownstreamNodes();
            if (resource.gte(this.currentRunningResult)) {
                costMax = costMax.plus(this.currentRunningResult);
                this.cacheMap.set(maxAffordableLevel.toString(), costMax);
            }
            if (resource.lt(costMax)) {
                maxAffordableLevel = maxAffordableLevel.minus(1);
                costMax = costMax.minus(this.currentRunningResult);
                break;
            }
        }

        this.cacheMap.set("-1", costMax);
        this.parent.maxAffordableLevel = maxAffordableLevel;
    }

    buildMaxValueCache(levelCap, maxAffordableLevel) {
        let maxCacheSize = new Decimal(1000);

        //size of cache minus max(-1), next(-2) and 0(current value)
        let currentCacheSize = new Decimal(this.cacheMap.size - 3);

        //don't proceed if cache is already at max size
        if (currentCacheSize.eq(maxCacheSize)) {
            return;
        }

        //check if can afford a single level
        if (maxAffordableLevel.eq(0)) {
            this.cacheMap.set("-1", this.cacheMap.get("1"));
            return;
        }

        //check if cache already contains affordable level
        if (maxAffordableLevel.lte(currentCacheSize)){
            this.cacheMap.set("-1", this.cacheMap.get(maxAffordableLevel.toString()));
            return;
        }
        
        //iterate upwards from current tree top until find max affordable level
        let valueAtMax = this.cacheMap.get(currentCacheSize.toString());
        let currCacheLevel = new Decimal(currentCacheSize);
        let currentParentLevel = this.parent.level;

        while (currCacheLevel.lt(maxAffordableLevel)) {
            if (levelCap && currCacheLevel.gte(levelCap)) {
                break;
            }
            currCacheLevel = currCacheLevel.plus(1);
            this.updateBaseNode(currCacheLevel.plus(currentParentLevel));
            this.updateDownstreamNodes();

            valueAtMax = this.currentRunningResult;
            this.cacheMap.set(currCacheLevel.toString(), valueAtMax);
        }
        this.cacheMap.set("-1", valueAtMax);
    }

    clearCache() {
        this.cacheMap.clear();
    }

    updateBaseNode(newSourceLevel) {
        this.nodes[0].result = this.calcNodeResult(this.nodes[0], newSourceLevel);
        this.nodes[0].runningResult = this.nodes[0].result;
    }

    updateDownstreamNodes() {
        let currentNode = this.nodes[0].nextNode;
        let lastActiveNode = this.nodes[0];

        while (currentNode) {
            if (currentNode.ref.active) {
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

        if (this.parent.featureType === "fighter" && node.ref.sourceCalcType === 'mult') {
            return this.performCalculation(node.ref.sourceCalcType, val, srcVal);
        }

        if (node.ref.sourceCalcType === 'add' && this.valueType === "value") {
            srcVal = srcVal.minus(1);
        }

        if (node.ref.sourceCalcType === 'add' && this.valueType === "cost") {
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

    performCalculation(type, val1, val2, base = 2) {
        //console.error(type, val1.mag, val2.mag);
        const CALCULATION_TYPES = {
            'add': (val1, val2) => val1.plus(val2),
            'sub': (val1, val2) => val2.minus(val1),
            'mult': (val1, val2) => val1.times(val2),
            'div': (val1, val2) => val2.dividedBy(val1),
            'exp': (val1, val2) => val2.pow(val1),
            'tetra': (val1, val2) => val2.tetrate(val1),
            'log': (val1, val2, base) => val2.log(base),
        }
        const calculation = CALCULATION_TYPES[type];

        if (!calculation) {
            throw new Error('Unknown calculation type: ' + type);
        }

        return calculation(val1, val2, base);
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
    constructor(eventManager, id, name, description, level, maxLevel, costType, valueType, active) {
        super();
        this.eventManager = eventManager;
        this.id = id;
        this.featureType = null;
        this.name = name;
        this.description = description;

        this.level = new Decimal(level);
        this.maxLevel = new Decimal(maxLevel);

        this.costType = costType;

        this.value = new Decimal();
        this.valueType = valueType;

        this.calcTreesMap = new Map();

        this.active = active;

        this.maxAffordableLevel = new Decimal(0);
        this.nextMilestoneLevel = new Decimal(0);

        this.isCacheBuilding = false;
    }

    buildMaxCache(resource) {
        //all features have a cost tree. not all have a value tree.
        this.isCacheBuilding = true;
        //builds the cost tree and sets this.maxAffLvl for value tree to use
        this.buildCacheByType("cost", resource);
        this.buildCacheByType("value");
        this.isCacheBuilding = false;
    }

    buildCacheByType(type, resource = null) {
        let tree = this.calcTreesMap.get(type);
        let treeExists = tree ? tree.cacheMap : undefined;

        let levelCap = this.maxLevel ? new Decimal(this.maxLevel.minus(this.level)) : null;

        if (treeExists) {
            if (type === "cost") {
                tree.buildMaxCostCache(levelCap, resource);
            }
            else if (type === "value") {
                tree.buildMaxValueCache(levelCap, this.maxAffordableLevel);
            }
        } 
    }


    setActive() {
        this.active = true;
        //console.error(this.name, "activated");
    }

    levelUp(gameManager, count) {
        let newCount = count;

        if (this.level.eq(0)) {
            for (const observer of this.observers) {
                observer.active = true;
            }
        }

        if ( (this.maxLevel.minus(this.level)).lt(count) ) {
            newCount = this.maxLevel.minus(this.level);
        }

        this.level = this.level.plus(newCount);

        this.eventManager.dispatchEvent('check-unlocks');
        this.updateObservers(gameManager);
        if (this.featureType === "training") {
            this.setNewMilestoneLevel();
            for (const [key, calcTree] of this.calcTreesMap) {
                calcTree.setNextMilestoneCachePoint();
            }
        }
    }

    updateObservers(gameManager) {
        for (const observer of this.observers) {
            if (observer.active) {

                //Handle self-targeting mods
                if (!observer.targetType && (observer.target === observer.source)) {
                    for (const targetCalcTree of observer.calcTreeReferences) {
                        if (targetCalcTree.parent.active) {
                            targetCalcTree.buildCache(observer.source.level);

                            gameManager.updateValues(targetCalcTree);
                        }
                    }
                }

                //handle non-self single target mods
                else if ((observer.source && observer.target) && (observer.target != observer.source)) {
                    observer.target.calcTreesMap.forEach((targetCalcTree) => {
                        if (targetCalcTree.parent.active){

                            //console.error("  single-target mod:", observer.name, "updating", targetCalcTree.parent.name, targetCalcTree.valueType, "tree");

                            targetCalcTree.buildCache(observer.target.level);

                            gameManager.updateValues(targetCalcTree);
                        }
                    });
                }

                //Handle Type Target Mods
                else if (observer.targetType) {
                    for (const targetCalcTree of observer.calcTreeReferences) {
                        if (targetCalcTree.parent.active){

                            //console.error("  TypeMod:", observer.name, "updating tree:", targetCalcTree.parent.name, targetCalcTree.valueType);

                            targetCalcTree.buildCache(targetCalcTree.parent.level);

                            gameManager.updateValues(targetCalcTree);
                        }
                    }
                }
            }
        }
    }
}

class Training extends GameFeature {
    constructor(eventManager, id, realmID, name, description, level, maxLevel, costType, valueType, active) {
        super(eventManager, id, name, description, level, maxLevel, costType, valueType, active);
        this.featureType = "training";
        this.realmID = realmID;

        this.milestoneTiers = [];
    }

    setNewMilestoneLevel() {
        for (let i = 0; i < this.milestoneTiers.length; i++) {
            let milestone = this.milestoneTiers[i];
            if (this.level.lt(milestone)) {
                this.nextMilestoneLevel = new Decimal(milestone);
                break;
            }
        }
    }

    findNextMilestoneLevel() {
        for (let i = 0; i < this.milestoneTiers.length; i++) {
            let milestone = this.milestoneTiers[i];
            if (this.level.lt(milestone)) {
                return new Decimal(milestone);
                break;
            }
        }
    }
}

class Upgrade extends GameFeature {
    constructor(eventManager, id, realmID, name, description, level, maxLevel, costType, valueType, active) {
        super(eventManager, id, name, description, level, maxLevel, costType, valueType, active);
        this.featureType = "upgrade";
        this.realmID = realmID;
    }
}

class EssenceUpgrade extends GameFeature {
    constructor(eventManager, id, name, description, level, maxLevel, costType, valueType, active) {
        super(eventManager, id, name, description, level, maxLevel, costType, valueType, active);
        this.featureType = "essenceUpgrade";
    }
}

class Fighter extends GameFeature {
    constructor(eventManager, id, stageID, name, active) {
        super(
            eventManager,
            id,
            name,
            "", //description
            0, // level
            2, // maxLevel - set at 2 to work with buildCache properly. gross for now
            "powerLevel", // costType
            "skillpoint", // valueType
            active
        );
        this.featureType = "fighter";
        this.stageID = stageID;
        this.isDefeated = false;
    }
}

class Realm {
    constructor(eventManager, id, type, name, active) {
        this.eventManager = eventManager;
        this.id = id;
        this.type = type;
        this.name = name;
        this.active = active;
        this.trainings = [];
        this.upgrades = [];
    }


    setActive() {
        this.active = true;
        this.trainings.forEach(training => {
            training.active = true;
        });
        this.upgrades.forEach(upgrade => {
            upgrade.active = true;
        });
    }
}

class Tournament {
    constructor(eventManager) {
        this.eventManager = eventManager;
        this.stages = [];

        this.eventManager.addListener('fight', (data) => {
            this.handleFight(data);
        });
    }

    addStage(stage) {
        this.stages.push(stage);
    }

    handleFight(data) {
        // Pass the data to the appropriate stage's handleFight method
        const stage = this.stages.find(stage => stage.id === data.stageId);
        if (stage) {
            stage.handleFight(data);
        }
    }
}

class Stage {
    constructor(eventManager, id, name, active) {
        this.eventManager = eventManager;
        this.id = id;
        this.name = name;
        this.active = active;
        this.isCompleted = false;
        this.fighters = [];
    }

    handleFight(data) {
        const fighterId = data.fighterId;
        const playerPowerLevel = data.playerPowerLevel;

        // Find the fighter by its ID in this stage's fighters
        let fighter = this.fighters.find(fighter => fighter.id === fighterId);

        if (!fighter) {
            // If the fighter is not in this stage, do not process the event
            console.error("fighter not found in stage. no fight processed");
            return;
        }

        if (playerPowerLevel.gt(fighter.cost)) { // Changed from fighter.powerLevel to fighter.cost
            fighter.isDefeated = true;
            let fighterValue = fighter.calcTreesMap.get("value").cacheMap.get("1");
            this.eventManager.dispatchEvent('addPlayerResource', { rewardType: fighter.valueType, rewardValue: fighterValue });


            // Check if all fighters in the stage are defeated
            const allFightersDefeated = this.fighters.every(fighter => fighter.isDefeated);

            if (allFightersDefeated) {
                this.isCompleted = true;
            }

            this.eventManager.dispatchEvent('check-unlocks');
        }
    }

    setActive() {
        this.active = true;
        this.fighters.forEach(fighter => {
            fighter.active = true;
        });
    }
}

class Skill extends GameFeature {
    constructor(eventManager, id, name, description, level, maxLevel, active, connections) {
        super(
            eventManager,
            id,
            name,
            description, // description
            level, // level
            maxLevel, // maxLevel
            "skillpoint", // costType
            null, // valueType
            active
        );
        this.featureType = "skill";
        this.skillSet = "01";
        this.connections = connections;
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
}

//class Reward {
//    constructor(eventManager) {
//        this.eventManager = eventManager;
//    }
//}
//class Achievements {
//    constructor(eventManager) {
//        this.eventManager = eventManager;
//    }
//}
//class AchievementSet {
//    constructor(eventManager) {
//        this.eventManager = eventManager;
//    }
//}
//class Achievement {
//    constructor(eventManager) {
//        this.eventManager = eventManager;
//    }
//}
//class AscensionTree {
//    constructor(eventManager) {
//        this.eventManager = eventManager;
//    }
//}
//class AscensionNode {
//    constructor(eventManager) {
//        this.eventManager = eventManager;
//    }
//}
