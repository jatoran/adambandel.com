// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"builder.js":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Builder = /*#__PURE__*/function () {
  function Builder(eventManager, gameManager, unlockManager) {
    _classCallCheck(this, Builder);
    this.eventManager = eventManager;
    this.gameManager = gameManager;
    this.unlockManager = unlockManager;

    //storage
    this.trainings = [];
    this.upgrades = [];
    this.essenceUpgrades = [];
    this.realms = [];
    this.skills = [];
    this.achievements = [];
    this.generatorChains = [];
    this.generators = [];
    this.worlds = [];
    this.regions = [];
    this.tournaments = [];
    this.fighters = [];
    this.workers = [];
    this.gladiators = [];
    this.trainers = [];
    this.archaeologists = [];
    this.scholars = [];
    this.mods = [];
    this.unlocks = [];
    this.calcTrees = [];

    //initialize, push to gameContent/builder data arrays, assign to gameManager ID map
    this.initMods();
    this.initTrainings();
    this.initGenerators();
    this.initUpgrades();
    this.initEssenceUpgrades();
    this.initRealms();
    this.initWorlds();
    this.initRegions();
    this.initWorkers();
    this.initTournaments();
    this.initFighters();
    this.pushRegionsToWorlds();
    this.pushTournamentsToRegions();
    this.pushFightersToTournaments();
    this.pushWorkerstoRegions();
    this.initSkills();
    this.initUnlocks();
    this.initAchievements();
    this.pushTrainingsToRealms();
    this.pushUpgradesToRealms();
    this.pushGeneratorsToRealms();
    this.buildSkillTree();
    this.createSkillConnectionUnlocks();
    this.createMilestoneUnlocksAndMods();
    this.createRebirthModAndPseudoObject();

    //assignments phase 1 - assign references  - THESE MUST BE BEFORE NEXT SECTION OF ASSIGNMENTS
    this.assignModPriorities();
    this.assignModReferences();
    this.assignUnlockReferences();
    this.assignEssenceUpgradeReferences();
    this.assignAchievementReferences();

    //assignments phase 2 - assignments to initialized objects
    this.registerModsToSources();
    this.registerModObserversAndTrees();
    this.initCalcTrees();

    //testing
    //this.printTrainingInfo();
    //this.printUpgradeInfo();
    //this.printFighterInfo();
    //this.printUnlockInfo();
  }
  _createClass(Builder, [{
    key: "initAchievements",
    value: function initAchievements() {
      this.initAchievementObjects();
      this.initAchievementMods();
      this.initAchievementUnlocks();
    }
  }, {
    key: "initAchievementObjects",
    value: function initAchievementObjects() {
      var _this = this;
      var achievementData = [{
        id: 70001,
        name: "achieve1",
        description: "10k powerlevel = pTrain prodMult * 2",
        conditionType: "powerLevel",
        conditionValue: new Decimal(10000),
        targetType: null,
        targetID: null
      }];
      achievementData.forEach(function (data) {
        var id = data.id,
          name = data.name,
          description = data.description,
          conditionType = data.conditionType,
          conditionValue = data.conditionValue,
          targetType = data.targetType,
          targetID = data.targetID;
        var achievement = new Achievement(_this.eventManager, id, name, description, conditionType, conditionValue, targetType, targetID);
        _this.achievements.push(achievement);
        _this.gameManager.gameContent.achievementsGrid.achievements.push(achievement);
        _this.gameManager.gameContent.idToObjectMap.set(id, achievement);
      });
    }
  }, {
    key: "initAchievementMods",
    value: function initAchievementMods() {
      this.createMods([{
        id: 7001,
        name: "achieveMod1",
        type: "prodBase",
        priority: null,
        sourceID: 70001,
        sourceCalcType: "mult",
        targetType: "powerTrain",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 2,
        value: 2,
        active: false
      }]);
    }
  }, {
    key: "initAchievementUnlocks",
    value: function initAchievementUnlocks() {
      var unlockID = 701;
      //make achievement claimable
      var _iterator = _createForOfIteratorHelper(this.achievements),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var achievement = _step.value;
          var unlock = new Unlock(unlockID, achievement.conditionValue, "level", achievement.id, achievement.id, "stat");
          this.unlocks.push(unlock);
          this.unlockManager.unlocks.push(unlock);
          this.gameManager.gameContent.unlocks.push(unlock);
          this.gameManager.gameContent.idToObjectMap.set(unlockID, unlock);
          unlockID++;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "assignAchievementReferences",
    value: function assignAchievementReferences() {
      var _this2 = this;
      this.achievements.forEach(function (achievement) {
        if (achievement.targetID) {
          achievement.target = _this2.findObjectById(achievement.targetID);
        }
      });
    }
  }, {
    key: "initUnlocks",
    value: function initUnlocks() {
      this.initPowerTrainUnlocks();
      this.initEssenceUpgradeUnlocks();
      this.initGeneratorUnlocks();
      this.initWorldUnlocks();
    }
  }, {
    key: "initMods",
    value: function initMods() {
      this.initEssenceMods();
      this.initSkillMods();
      this.initPowerUpgradeMods();
      this.initSpiritUpgradeMods();
    }
  }, {
    key: "initTrainings",
    value: function initTrainings() {
      this.initPowerTrainings();
    }
  }, {
    key: "initUpgrades",
    value: function initUpgrades() {
      this.initPowerUpgrades();
      this.initSpiritUpgrades();
    }
  }, {
    key: "initGenerators",
    value: function initGenerators() {
      //init generator chains first
      var generatorChain1 = new GeneratorChain(this.eventManager, 601, "genChain1", 51, true);
      this.generatorChains.push(generatorChain1);
      this.gameManager.gameContent.generatorChains.push(generatorChain1);
      this.gameManager.gameContent.idToObjectMap.set(generatorChain1.id, generatorChain1);
      var generatorChain2 = new GeneratorChain(this.eventManager, 602, "genChain2", 52, true);
      this.generatorChains.push(generatorChain2);
      this.gameManager.gameContent.generatorChains.push(generatorChain2);
      this.gameManager.gameContent.idToObjectMap.set(generatorChain1.id, generatorChain2);
      this.createGenerators([{
        id: 6001,
        genChainID: 601,
        name: "gen1",
        description: "",
        level: 0,
        costType: "spirit",
        costBase: 1,
        costGrowthRate: 1.3,
        prodType: "spiritIncome",
        prodBase: 1,
        prodGrowthRate: 1,
        active: true
      }, {
        id: 6002,
        genChainID: 601,
        name: "gen2",
        description: "",
        level: 0,
        costType: "spirit",
        costBase: 10,
        costGrowthRate: 1.4,
        prodType: "gen1",
        prodBase: 1,
        prodGrowthRate: 1,
        active: false
      }, {
        id: 6003,
        genChainID: 601,
        name: "gen3",
        description: "",
        level: 0,
        costType: "spirit",
        costBase: 100,
        costGrowthRate: 1.4,
        prodType: "gen2",
        prodBase: 1,
        prodGrowthRate: 1,
        active: false
      }, {
        id: 6004,
        genChainID: 601,
        name: "gen4",
        description: "",
        level: 0,
        costType: "spirit",
        costBase: 1000,
        costGrowthRate: 1.4,
        prodType: "gen3",
        prodBase: 1,
        prodGrowthRate: 1,
        active: false
      }, {
        id: 6005,
        genChainID: 601,
        name: "gen5",
        description: "",
        level: 0,
        costType: "spirit",
        costBase: 10000,
        costGrowthRate: 1.5,
        prodType: "gen4",
        prodBase: 1,
        prodGrowthRate: 1,
        active: false
      }, {
        id: 6006,
        genChainID: 602,
        name: "gen6",
        description: "",
        level: 0,
        costType: "spirit",
        costBase: 1000,
        costGrowthRate: 1.3,
        prodType: "spiritIncome",
        prodBase: 100,
        prodGrowthRate: 1.2,
        active: true
      }, {
        id: 6007,
        genChainID: 602,
        name: "gen7",
        description: "",
        level: 0,
        costType: "spirit",
        costBase: 10000,
        costGrowthRate: 1.4,
        prodType: "gen1",
        prodBase: 1,
        prodGrowthRate: 1.0,
        active: false
      }, {
        id: 6008,
        genChainID: 602,
        name: "gen8",
        description: "",
        level: 0,
        costType: "spirit",
        costBase: 100000,
        costGrowthRate: 1.4,
        prodType: "gen2",
        prodBase: 1,
        prodGrowthRate: 1.0,
        active: false
      }, {
        id: 6009,
        genChainID: 602,
        name: "gen9",
        description: "",
        level: 0,
        costType: "spirit",
        costBase: 1000000,
        costGrowthRate: 1.4,
        prodType: "gen3",
        prodBase: 1,
        prodGrowthRate: 1.0,
        active: false
      }, {
        id: 6010,
        genChainID: 602,
        name: "gen10",
        description: "",
        level: 0,
        costType: "spirit",
        costBase: 10000000,
        costGrowthRate: 1.5,
        prodType: "gen4",
        prodBase: 1,
        prodGrowthRate: 1.0,
        active: false
      }]);
    }
  }, {
    key: "createGenerators",
    value: function createGenerators(generatorData) {
      var _this3 = this;
      generatorData.forEach(function (data) {
        var id = data.id,
          genChainID = data.genChainID,
          name = data.name,
          description = data.description,
          level = data.level,
          _data$maxLevel = data.maxLevel,
          maxLevel = _data$maxLevel === void 0 ? new Decimal(Infinity) : _data$maxLevel,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active;
        var generator = new Generator(_this3.eventManager, id, genChainID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
        _this3.generators.push(generator);
        _this3.gameManager.gameContent.generators.push(generator);
        _this3.gameManager.gameContent.idToObjectMap.set(id, generator);

        //push generators to generatorchains
        var genChain = _this3.generatorChains.find(function (genChain) {
          return genChain.id === generator.genChainID;
        });
        if (genChain) {
          genChain.generators.push(generator);
        }
      });
    }
  }, {
    key: "initGeneratorUnlocks",
    value: function initGeneratorUnlocks() {
      this.createUnlocks([{
        id: 621,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 6001,
        targetID: 6002
      }, {
        id: 622,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 6002,
        targetID: 6003
      }, {
        id: 623,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 6003,
        targetID: 6004
      }, {
        id: 624,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 6004,
        targetID: 6005
      }, {
        id: 625,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 6006,
        targetID: 6007
      }, {
        id: 626,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 6007,
        targetID: 6008
      }, {
        id: 627,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 6008,
        targetID: 6009
      }, {
        id: 628,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 6009,
        targetID: 6010
      }]);
    }
  }, {
    key: "pushGeneratorsToRealms",
    value: function pushGeneratorsToRealms() {
      var _this4 = this;
      this.generatorChains.forEach(function (chain) {
        var realm = _this4.realms.find(function (realm) {
          return realm.id === chain.realmID;
        });
        if (realm) {
          realm.generatorChains.push(chain);
          chain.realm = realm; // Assign the realm reference to the generator's realm value
        } else {
          console.error("No realm found with id ".concat(chain.realmID, " for generatorChain ").concat(chain.name));
        }
      });
    }
  }, {
    key: "initWorldUnlocks",
    value: function initWorldUnlocks() {
      this.createUnlocks([{
        id: 36000,
        conditionValue: true,
        conditionType: "isCompleted",
        dependentID: 1000001,
        targetID: 1000002
      }, {
        id: 36001,
        conditionValue: true,
        conditionType: "isCompleted",
        dependentID: 1000002,
        targetID: 1000003
      }, {
        id: 36002,
        conditionValue: true,
        conditionType: "isCompleted",
        dependentID: 1000003,
        targetID: 1000004
      }, {
        id: 36003,
        conditionValue: true,
        conditionType: "isCompleted",
        dependentID: 1000004,
        targetID: 1000005
      }]);
    }
  }, {
    key: "initPowerTrainUnlocks",
    value: function initPowerTrainUnlocks() {
      this.createUnlocks([{
        id: 3002,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 1002,
        targetID: 1003
      }, {
        id: 3003,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 1003,
        targetID: 1004
      }, {
        id: 3004,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 1004,
        targetID: 1005
      }, {
        id: 3005,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 1005,
        targetID: 1006
      }, {
        id: 3006,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 1006,
        targetID: 1007
      }, {
        id: 3007,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 1007,
        targetID: 1008
      }, {
        id: 3008,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 1008,
        targetID: 1009
      }, {
        id: 3009,
        conditionValue: 3,
        conditionType: "level",
        dependentID: 1009,
        targetID: 1010
      }]);
    }
  }, {
    key: "initEssenceUpgradeUnlocks",
    value: function initEssenceUpgradeUnlocks() {
      this.createUnlocks([{
        id: 3071,
        conditionValue: 1,
        conditionType: "level",
        dependentID: 100003,
        targetID: 4016,
        dependentType: "id"
      }]);
    }
  }, {
    key: "createUnlocks",
    value: function createUnlocks(unlockData) {
      var _this5 = this;
      unlockData.forEach(function (data) {
        var id = data.id,
          conditionValue = data.conditionValue,
          conditionType = data.conditionType,
          dependentID = data.dependentID,
          targetID = data.targetID,
          _data$dependentType = data.dependentType,
          dependentType = _data$dependentType === void 0 ? "id" : _data$dependentType;
        var unlock = new Unlock(id, conditionValue, conditionType, dependentID, targetID, dependentType);
        _this5.unlockManager.unlocks.push(unlock);
        _this5.unlocks.push(unlock);
        _this5.gameManager.gameContent.unlocks.push(unlock);
        _this5.gameManager.gameContent.idToObjectMap.set(id, unlock);
      });
    }
  }, {
    key: "initPowerTrainings",
    value: function initPowerTrainings() {
      var _this6 = this;
      var trainingData = [{
        id: 1001,
        realmID: 11,
        name: "pTrain1",
        description: "description",
        level: 0,
        costType: "power",
        costBase: 1,
        costGrowthRate: 1.3,
        prodType: "powerIncome",
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: true
      }, {
        id: 1002,
        realmID: 11,
        name: "pTrain2",
        description: "description",
        level: 0,
        costType: "power",
        costBase: 10,
        costGrowthRate: 1.35,
        prodType: "powerIncome",
        prodBase: 10,
        prodGrowthRate: 1.1,
        active: true
      }, {
        id: 1003,
        realmID: 11,
        name: "pTrain3",
        description: "description",
        level: 0,
        costType: "power",
        costBase: 100,
        costGrowthRate: 1.4,
        prodType: "powerIncome",
        prodBase: 100,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 1004,
        realmID: 11,
        name: "pTrain4",
        description: "description",
        level: 0,
        costType: "power",
        costBase: 10000,
        costGrowthRate: 1.45,
        prodType: "powerIncome",
        prodBase: 10000,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 1005,
        realmID: 11,
        name: "pTrain5",
        description: "description",
        level: 0,
        costType: "power",
        costBase: 100000,
        costGrowthRate: 1.5,
        prodType: "powerIncome",
        prodBase: 100000,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 1006,
        realmID: 12,
        name: "pTrain6",
        description: "description",
        level: 0,
        costType: "power",
        costBase: 1000000,
        costGrowthRate: 1.55,
        prodType: "powerIncome",
        prodBase: 1000000,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 1007,
        realmID: 12,
        name: "pTrain7",
        description: "description",
        level: 0,
        costType: "power",
        costBase: 1000000,
        costGrowthRate: 1.6,
        prodType: "powerIncome",
        prodBase: 1000000,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 1008,
        realmID: 12,
        name: "pTrain8",
        description: "description",
        level: 0,
        costType: "power",
        costBase: 10000000,
        costGrowthRate: 1.65,
        prodType: "powerIncome",
        prodBase: 10000000,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 1009,
        realmID: 12,
        name: "pTrain9",
        description: "description",
        level: 0,
        costType: "power",
        costBase: 100000000,
        costGrowthRate: 1.7,
        prodType: "powerIncome",
        prodBase: 100000000,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 1010,
        realmID: 12,
        name: "pTrain10",
        description: "description",
        level: 0,
        costType: "power",
        costBase: 1000000000,
        costGrowthRate: 1.75,
        prodType: "powerIncome",
        prodBase: 1000000000,
        prodGrowthRate: 1.1,
        active: false
      }];
      trainingData.forEach(function (data) {
        var id = data.id,
          realmID = data.realmID,
          name = data.name,
          description = data.description,
          level = data.level,
          _data$maxLevel2 = data.maxLevel,
          maxLevel = _data$maxLevel2 === void 0 ? new Decimal(Infinity) : _data$maxLevel2,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active;
        var training = new Training(_this6.eventManager, id, realmID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
        _this6.trainings.push(training);
        _this6.gameManager.gameContent.trainings.push(training);
        _this6.gameManager.gameContent.idToObjectMap.set(id, training);
      });
    }
  }, {
    key: "initPowerUpgrades",
    value: function initPowerUpgrades() {
      var _this7 = this;
      var upgradeData = [{
        id: 10001,
        realmID: 11,
        name: "pUpgrade1",
        description: "all pTrain prodMult *= (this level + 1)",
        level: 0,
        maxLevel: Infinity,
        costType: "power",
        costBase: 10,
        costGrowthRate: 1.3,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: true
      }, {
        id: 10002,
        realmID: 11,
        name: "pUpgrade2",
        description: "all pTrain prodMult ^ (this level + 1)",
        level: 0,
        maxLevel: 1,
        costType: "power",
        costBase: 100,
        costGrowthRate: 1.1,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: true
      }, {
        id: 10003,
        realmID: 11,
        name: "pUpgrade3",
        description: "all pTrain costMult /= (this level + 1.05)",
        level: 0,
        maxLevel: Infinity,
        costType: "power",
        costBase: 1000,
        costGrowthRate: 1.4,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: true
      }, {
        id: 10004,
        realmID: 11,
        name: "pUpgrade4",
        description: "all pTrain prodMult += (10 * this level)",
        level: 0,
        maxLevel: Infinity,
        costType: "power",
        costBase: 5000,
        costGrowthRate: 1.5,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: true
      }, {
        id: 10005,
        realmID: 11,
        name: "pUpgrade5",
        description: "all pTrain prodMult * (this.level * 2)",
        level: 0,
        maxLevel: Infinity,
        costType: "power",
        costBase: 10000,
        costGrowthRate: 1.6,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: true
      }, {
        id: 10006,
        realmID: 11,
        name: "pUpgrade6",
        description: "all pTrain prodMult * (this.level *10)",
        level: 0,
        maxLevel: Infinity,
        costType: "power",
        costBase: 100000,
        costGrowthRate: 1.7,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: true
      }];
      upgradeData.forEach(function (data) {
        var id = data.id,
          realmID = data.realmID,
          name = data.name,
          description = data.description,
          level = data.level,
          maxLevel = data.maxLevel,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active;
        var upgrade = new Upgrade(_this7.eventManager, id, realmID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
        _this7.upgrades.push(upgrade);
        _this7.gameManager.gameContent.upgrades.push(upgrade);
        _this7.gameManager.gameContent.idToObjectMap.set(id, upgrade);
      });
    }
  }, {
    key: "initSpiritUpgrades",
    value: function initSpiritUpgrades() {
      var _this8 = this;
      var upgradeData = [{
        id: 50001,
        realmID: 51,
        name: "sUpgrade1",
        description: "all fighter skillpoint * 2",
        level: 0,
        maxLevel: 1,
        costType: "spirit",
        costBase: 10,
        costGrowthRate: 1.1,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: true
      }];
      upgradeData.forEach(function (data) {
        var id = data.id,
          realmID = data.realmID,
          name = data.name,
          description = data.description,
          level = data.level,
          maxLevel = data.maxLevel,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active;
        var upgrade = new Upgrade(_this8.eventManager, id, realmID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
        _this8.upgrades.push(upgrade);
        _this8.gameManager.gameContent.upgrades.push(upgrade);
        _this8.gameManager.gameContent.idToObjectMap.set(id, upgrade);
      });
    }
  }, {
    key: "initEssenceUpgrades",
    value: function initEssenceUpgrades() {
      var _this9 = this;
      var upgradeData = [
      //essence upgrades
      {
        id: 100001,
        name: "eUpgrade1",
        description: "all pTrain + 1 prodBase",
        level: 0,
        maxLevel: 10,
        costType: "essence",
        costBase: 1,
        costGrowthRate: 2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: true
      }, {
        id: 100002,
        name: "eUpgrade2",
        description: "all fighter sp * (2 * lvl)",
        level: 0,
        maxLevel: 10,
        costType: "essence",
        costBase: 1,
        costGrowthRate: 2,
        prodType: "fighterSkillpoint",
        prodBase: null,
        prodGrowthRate: null,
        active: true
      }, {
        id: 100003,
        name: "eUpgrade3",
        description: "unlock skilltree path 1",
        level: 0,
        maxLevel: 1,
        costType: "essence",
        costBase: 1,
        costGrowthRate: 2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: true
      }, {
        id: 100004,
        name: "eUpgrade4",
        description: "start with +10sp * lvl",
        level: 0,
        maxLevel: 10,
        costType: "essence",
        costBase: 1,
        costGrowthRate: 2,
        prodType: "skillpoint",
        prodBase: 10,
        prodGrowthRate: 1.1,
        active: true
      }, {
        id: 100005,
        name: "eUpgrade5",
        description: "start with ptrain1 lvl 10 * lvl",
        level: 0,
        maxLevel: 10,
        costType: "essence",
        costBase: 1,
        costGrowthRate: 2,
        prodType: "baseFeatureLevel",
        prodBase: 10,
        prodGrowthRate: 1.1,
        active: true,
        specialTargetID: 1001
      }];
      upgradeData.forEach(function (data) {
        var id = data.id,
          name = data.name,
          description = data.description,
          level = data.level,
          maxLevel = data.maxLevel,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active,
          specialTargetID = data.specialTargetID;
        var upgrade = new EssenceUpgrade(_this9.eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialTargetID);
        _this9.essenceUpgrades.push(upgrade);
        _this9.gameManager.gameContent.essenceUpgrades.push(upgrade);
        _this9.gameManager.gameContent.idToObjectMap.set(id, upgrade);
      });
    }
  }, {
    key: "assignEssenceUpgradeReferences",
    value: function assignEssenceUpgradeReferences() {
      var _iterator2 = _createForOfIteratorHelper(this.essenceUpgrades),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var upgrade = _step2.value;
          if (upgrade.specialTargetID) {
            upgrade.target = this.findObjectById(upgrade.specialTargetID);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "initEssenceMods",
    value: function initEssenceMods() {
      this.createMods([{
        id: 101001,
        name: "essenceTarMod1",
        type: "production",
        priority: null,
        sourceID: 100001,
        sourceCalcType: "add",
        targetType: "powerTrain",
        targetID: null,
        runningCalcType: "add",
        baseValue: 1,
        value: 1,
        active: false
      }, {
        id: 101003,
        name: "essenceTarMod2",
        type: "production",
        priority: null,
        sourceID: 100002,
        sourceCalcType: "mult",
        targetType: "fighters",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 2,
        value: 2,
        active: false
      }, {
        id: 101007,
        name: "essenceValueMod4",
        type: "prodBase",
        priority: null,
        sourceID: 100004,
        sourceCalcType: "mult",
        targetType: null,
        targetID: 100004,
        runningCalcType: "add",
        baseValue: 10,
        value: 10,
        active: false
      }, {
        id: 101010,
        name: "essenceValueMod5",
        type: "prodBase",
        priority: null,
        sourceID: 100005,
        sourceCalcType: "mult",
        targetType: null,
        targetID: 100005,
        runningCalcType: "add",
        baseValue: 10,
        value: 10,
        active: false
      }]);
    }
  }, {
    key: "initPowerUpgradeMods",
    value: function initPowerUpgradeMods() {
      this.createMods([{
        id: 11001,
        name: "pTarMod1",
        type: "production",
        priority: null,
        sourceID: 10001,
        sourceCalcType: "add",
        targetType: "allTrain",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 2,
        value: 2,
        active: false
      }, {
        id: 11004,
        name: "pTarMod2",
        type: "production",
        priority: null,
        sourceID: 10002,
        sourceCalcType: "add",
        targetType: "allTrain",
        targetID: null,
        runningCalcType: "exp",
        baseValue: 2,
        value: 2,
        active: false
      }, {
        id: 11007,
        name: "pTarMod3",
        type: "cost",
        priority: null,
        sourceID: 10003,
        sourceCalcType: "add",
        targetType: "allTrain",
        targetID: null,
        runningCalcType: "div",
        baseValue: 1.05,
        value: 1.05,
        active: false
      }, {
        id: 11010,
        name: "pTarMod4",
        type: "production",
        priority: null,
        sourceID: 10004,
        sourceCalcType: "mult",
        targetType: "allTrain",
        targetID: null,
        runningCalcType: "add",
        baseValue: 10,
        value: 10,
        active: false
      }, {
        id: 11013,
        name: "pTarMod5",
        type: "production",
        priority: null,
        sourceID: 10005,
        sourceCalcType: "mult",
        targetType: "allTrain",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 2,
        value: 2,
        active: false
      }, {
        id: 11016,
        name: "pTarMod6",
        type: "production",
        priority: null,
        sourceID: 10006,
        sourceCalcType: "mult",
        targetType: "powerTrain",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 10,
        value: 10,
        active: false
      }]);
    }
  }, {
    key: "initSpiritUpgradeMods",
    value: function initSpiritUpgradeMods() {
      this.createMods([{
        id: 51001,
        name: "sTarMod3",
        type: "production",
        priority: null,
        sourceID: 50001,
        sourceCalcType: "add",
        targetType: "fighters",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 2,
        value: 2,
        active: false
      }]);
    }
  }, {
    key: "initSkillMods",
    value: function initSkillMods() {
      this.createMods([
      //skill typemods
      {
        id: 41011,
        name: "skUpMod1",
        type: "production",
        priority: null,
        sourceID: 4001,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 2,
        value: 2,
        active: false
      }, {
        id: 41012,
        name: "skUpMod2",
        type: "production",
        priority: null,
        sourceID: 4002,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 3,
        value: 3,
        active: false
      }, {
        id: 41013,
        name: "skUpMod3",
        type: "production",
        priority: null,
        sourceID: 4003,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 4,
        value: 4,
        active: false
      }, {
        id: 41014,
        name: "skUpMod4",
        type: "production",
        priority: null,
        sourceID: 4004,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 5,
        value: 5,
        active: false
      }, {
        id: 41015,
        name: "skUpMod5",
        type: "production",
        priority: null,
        sourceID: 4005,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 6,
        value: 6,
        active: false
      }, {
        id: 41016,
        name: "skUpMod6",
        type: "production",
        priority: null,
        sourceID: 4006,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 7,
        value: 7,
        active: false
      }, {
        id: 41017,
        name: "skUpMod7",
        type: "production",
        priority: null,
        sourceID: 4007,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 8,
        value: 8,
        active: false
      }, {
        id: 41018,
        name: "skUpMod8",
        type: "production",
        priority: null,
        sourceID: 4008,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 9,
        value: 9,
        active: false
      }, {
        id: 41019,
        name: "skUpMod9",
        type: "production",
        priority: null,
        sourceID: 4009,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 10,
        value: 10,
        active: false
      }, {
        id: 41020,
        name: "skUpMod10",
        type: "production",
        priority: null,
        sourceID: 4010,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 11,
        value: 11,
        active: false
      }, {
        id: 41021,
        name: "skUpMod11",
        type: "production",
        priority: null,
        sourceID: 4011,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 12,
        value: 12,
        active: false
      }, {
        id: 41022,
        name: "skUpMod12",
        type: "production",
        priority: null,
        sourceID: 4012,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 13,
        value: 13,
        active: false
      }, {
        id: 41023,
        name: "skUpMod13",
        type: "production",
        priority: null,
        sourceID: 4013,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 14,
        value: 14,
        active: false
      }, {
        id: 41024,
        name: "skUpMod14",
        type: "production",
        priority: null,
        sourceID: 4014,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 15,
        value: 15,
        active: false
      }, {
        id: 41025,
        name: "skUpMod15",
        type: "production",
        priority: null,
        sourceID: 4015,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 16,
        value: 16,
        active: false
      }, {
        id: 41026,
        name: "skUpMod15",
        type: "production",
        priority: null,
        sourceID: 4016,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 30,
        value: 30,
        active: false
      }, {
        id: 41027,
        name: "skUpMod15",
        type: "production",
        priority: null,
        sourceID: 4017,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 31,
        value: 31,
        active: false
      }, {
        id: 41028,
        name: "skUpMod15",
        type: "production",
        priority: null,
        sourceID: 4018,
        sourceCalcType: "mult",
        targetType: "trains&upgrades",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 32,
        value: 32,
        active: false
      }]);
    }
  }, {
    key: "createMods",
    value: function createMods(modData) {
      var _this10 = this;
      modData.forEach(function (data) {
        var id = data.id,
          name = data.name,
          type = data.type,
          priority = data.priority,
          sourceID = data.sourceID,
          sourceCalcType = data.sourceCalcType,
          targetType = data.targetType,
          targetID = data.targetID,
          runningCalcType = data.runningCalcType,
          baseValue = data.baseValue,
          value = data.value,
          active = data.active,
          _data$specialType = data.specialType,
          specialType = _data$specialType === void 0 ? null : _data$specialType;
        var mod = new Mod(_this10.eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active, specialType);
        _this10.mods.push(mod);
        _this10.gameManager.gameContent.idToObjectMap.set(id, mod);
      });
    }
  }, {
    key: "initRealms",
    value: function initRealms() {
      var _this11 = this;
      var realmData = [
      //power realms
      {
        id: 11,
        type: "power",
        name: "pRealm1",
        active: true
      }, {
        id: 12,
        type: "power",
        name: "pRealm2",
        active: true
      }, {
        id: 13,
        type: "power",
        name: "pRealm3",
        active: true
      },
      //spirit realms
      {
        id: 51,
        type: "spirit",
        name: "sRealm1",
        active: true
      }, {
        id: 52,
        type: "spirit",
        name: "sRealm2",
        active: true
      }
      //{ id: 53, type: "spirit", name: "sRealm3", active: true },
      ];

      realmData.forEach(function (data) {
        var id = data.id,
          type = data.type,
          name = data.name,
          active = data.active;
        var realm = new Realm(_this11.eventManager, id, type, name, active);
        _this11.realms.push(realm);
        _this11.gameManager.gameContent.idToObjectMap.set(id, realm);
        if (realm.type === "power") {
          _this11.gameManager.gameContent.powerRealms.push(realm);
        } else if (realm.type === "spirit") {
          _this11.gameManager.gameContent.spiritRealms.push(realm);
        }
      });
    }
  }, {
    key: "initWorlds",
    value: function initWorlds() {
      var _this12 = this;
      var worldData = [{
        id: 1000001,
        name: "world1",
        active: true
      }, {
        id: 1000002,
        name: "world2",
        active: false
      }, {
        id: 1000003,
        name: "world3",
        active: false
      }, {
        id: 1000004,
        name: "world4",
        active: false
      }, {
        id: 1000005,
        name: "world5",
        active: false
      }];
      worldData.forEach(function (data) {
        var id = data.id,
          name = data.name,
          active = data.active;
        var world = new World(_this12.eventManager, id, name, active);
        _this12.worlds.push(world);
        _this12.gameManager.gameContent.worldManager.worlds.push(world);
        _this12.gameManager.gameContent.idToObjectMap.set(id, world);
        _this12.gameManager.gameContent.worlds.push(world);
      });
    }
  }, {
    key: "initRegions",
    value: function initRegions() {
      var _this13 = this;
      var regionData = [{
        id: 1010001,
        worldID: 1000001,
        name: "region1",
        shardType: "alpha",
        active: true
      }, {
        id: 1010001,
        worldID: 1000001,
        name: "region1",
        shardType: "alpha",
        active: true
      }, {
        id: 1010001,
        worldID: 1000001,
        name: "region1",
        shardType: "alpha",
        active: true
      }, {
        id: 1010002,
        worldID: 1000001,
        name: "region2",
        shardType: "beta",
        active: false
      }, {
        id: 1010003,
        worldID: 1000001,
        name: "region3",
        shardType: "beta",
        active: false
      }, {
        id: 1010004,
        worldID: 1000002,
        name: "region4",
        shardType: "beta",
        active: false
      }, {
        id: 1010005,
        worldID: 1000002,
        name: "region5",
        shardType: "gamma",
        active: false
      }, {
        id: 1010006,
        worldID: 1000002,
        name: "region6",
        shardType: "gamma",
        active: false
      }, {
        id: 1010007,
        worldID: 1000003,
        name: "region7",
        shardType: "gamma",
        active: false
      }, {
        id: 1010008,
        worldID: 1000003,
        name: "region8",
        shardType: "delta",
        active: false
      }, {
        id: 1010009,
        worldID: 1000003,
        name: "region9",
        shardType: "delta",
        active: false
      }, {
        id: 1010010,
        worldID: 1000004,
        name: "region10",
        shardType: "delta",
        active: false
      }, {
        id: 1010011,
        worldID: 1000004,
        name: "region11",
        shardType: "epsilon",
        active: false
      }, {
        id: 1010012,
        worldID: 1000004,
        name: "region12",
        shardType: "epsilon",
        active: false
      }, {
        id: 1010013,
        worldID: 1000005,
        name: "region13",
        shardType: "epsilon",
        active: false
      }, {
        id: 1010014,
        worldID: 1000005,
        name: "region14",
        shardType: "zeta",
        active: false
      }, {
        id: 1010015,
        worldID: 1000005,
        name: "region15",
        shardType: "zeta",
        active: false
      }];
      regionData.forEach(function (data) {
        var id = data.id,
          worldID = data.worldID,
          name = data.name,
          shardType = data.shardType,
          active = data.active;
        var region = new Region(_this13.eventManager, id, worldID, name, shardType, active);
        _this13.regions.push(region);
        _this13.gameManager.gameContent.idToObjectMap.set(id, region);
        _this13.gameManager.gameContent.regions.push(region);
      });
    }
  }, {
    key: "pushRegionsToWorlds",
    value: function pushRegionsToWorlds() {
      var _this14 = this;
      this.regions.forEach(function (region) {
        var world = _this14.worlds.find(function (world) {
          return world.id === region.worldID;
        });
        if (world) {
          world.regions.push(region);
          region.world = world;
        }
      });
    }
  }, {
    key: "initWorkers",
    value: function initWorkers() {
      var _this15 = this;
      var workerData = [
      // Gladiator data
      {
        id: 8101,
        regionID: 1010001,
        name: "Gladiator1",
        description: "Gladiator Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 10,
        costGrowthRate: 1.3,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8102,
        regionID: 1010002,
        name: "Gladiator2",
        description: "Gladiator Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 20,
        costGrowthRate: 1.3,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8103,
        regionID: 1010003,
        name: "Gladiator3",
        description: "Gladiator Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 30,
        costGrowthRate: 1.3,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8104,
        regionID: 1010004,
        name: "Gladiator4",
        description: "Gladiator Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 40,
        costGrowthRate: 1.3,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8105,
        regionID: 1010005,
        name: "Gladiator5",
        description: "Gladiator Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 50,
        costGrowthRate: 1.3,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      },
      // Archaeologist data
      {
        id: 8201,
        regionID: 1010001,
        name: "Archaeologist1",
        description: "Archaeologist Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 20,
        costGrowthRate: 1.5,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8202,
        regionID: 1010002,
        name: "Archaeologist2",
        description: "Archaeologist Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 40,
        costGrowthRate: 1.5,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8203,
        regionID: 1010003,
        name: "Archaeologist3",
        description: "Archaeologist Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 60,
        costGrowthRate: 1.5,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8204,
        regionID: 1010004,
        name: "Archaeologist4",
        description: "Archaeologist Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 80,
        costGrowthRate: 1.5,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8205,
        regionID: 1010005,
        name: "Archaeologist5",
        description: "Archaeologist Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 100,
        costGrowthRate: 1.5,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      },
      // Trainer data
      {
        id: 8301,
        regionID: 1010001,
        name: "Trainer1",
        description: "Trainer Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 30,
        costGrowthRate: 1.7,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8302,
        regionID: 1010002,
        name: "Trainer2",
        description: "Trainer Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 60,
        costGrowthRate: 1.7,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8303,
        regionID: 1010003,
        name: "Trainer3",
        description: "Trainer Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 60,
        costGrowthRate: 1.7,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8304,
        regionID: 1010004,
        name: "Trainer4",
        description: "Trainer Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 120,
        costGrowthRate: 1.7,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8305,
        regionID: 1010005,
        name: "Trainer5",
        description: "Trainer Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 150,
        costGrowthRate: 1.7,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      },
      // Scholar data
      {
        id: 8401,
        regionID: 1010001,
        name: "Scholar1",
        description: "Scholar Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 40,
        costGrowthRate: 1.9,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8402,
        regionID: 1010002,
        name: "Scholar2",
        description: "Scholar Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 80,
        costGrowthRate: 1.9,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8403,
        regionID: 1010003,
        name: "Scholar3",
        description: "Scholar Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 120,
        costGrowthRate: 1.9,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8404,
        regionID: 1010004,
        name: "Scholar4",
        description: "Scholar Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 160,
        costGrowthRate: 1.9,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }, {
        id: 8405,
        regionID: 1010005,
        name: "Scholar5",
        description: "Scholar Description",
        level: 0,
        maxLevel: Infinity,
        costType: null,
        costBase: 200,
        costGrowthRate: 1.9,
        prodType: null,
        prodBase: 1,
        prodGrowthRate: 1.1,
        active: false
      }];
      workerData.forEach(function (data) {
        var id = data.id,
          regionID = data.regionID,
          name = data.name,
          description = data.description,
          level = data.level,
          maxLevel = data.maxLevel,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active;
        var worker;
        if (id >= 8101 && id < 8200) {
          worker = new Gladiator(_this15.eventManager, id, regionID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
          _this15.gladiators.push(worker);
          _this15.gameManager.gameContent.gladiators.push(worker);
        } else if (id >= 8201 && id < 8300) {
          worker = new Archaeologist(_this15.eventManager, id, regionID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
          _this15.archaeologists.push(worker);
          _this15.gameManager.gameContent.archaeologists.push(worker);
        } else if (id >= 8301 && id < 8400) {
          worker = new Trainer(_this15.eventManager, id, regionID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
          _this15.trainers.push(worker);
          _this15.gameManager.gameContent.trainers.push(worker);
        } else if (id >= 8401 && id < 8500) {
          worker = new Scholar(_this15.eventManager, id, regionID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
          _this15.scholars.push(worker);
          _this15.gameManager.gameContent.scholars.push(worker);
        }
        _this15.workers.push(worker);
        _this15.gameManager.gameContent.workers.push(worker);
        _this15.gameManager.gameContent.idToObjectMap.set(id, worker);
      });
    }
  }, {
    key: "pushWorkerstoRegions",
    value: function pushWorkerstoRegions() {
      var _this16 = this;
      this.workers.forEach(function (worker) {
        var region = _this16.regions.find(function (region) {
          return region.id === worker.regionID;
        });
        if (region) {
          region.workers.push(worker);
          worker.region = region;
        }
      });
    }
  }, {
    key: "initTournaments",
    value: function initTournaments() {
      var _this17 = this;
      var tournamentData = [{
        id: 901,
        regionID: 1010001,
        name: "tournament1",
        active: true
      }, {
        id: 902,
        regionID: 1010002,
        name: "tournament2",
        active: false
      }, {
        id: 903,
        regionID: 1010003,
        name: "tournament3",
        active: false
      }, {
        id: 904,
        regionID: 1010004,
        name: "tournament4",
        active: false
      }, {
        id: 905,
        regionID: 1010005,
        name: "tournament5",
        active: false
      }, {
        id: 906,
        regionID: 1010006,
        name: "tournament6",
        active: false
      }, {
        id: 907,
        regionID: 1010007,
        name: "tournament7",
        active: false
      }, {
        id: 908,
        regionID: 1010008,
        name: "tournament8",
        active: false
      }, {
        id: 909,
        regionID: 1010009,
        name: "tournament9",
        active: false
      }, {
        id: 910,
        regionID: 1010010,
        name: "tournament10",
        active: false
      }, {
        id: 911,
        regionID: 1010011,
        name: "tournament11",
        active: false
      }, {
        id: 912,
        regionID: 1010012,
        name: "tournament12",
        active: false
      }, {
        id: 913,
        regionID: 1010013,
        name: "tournament13",
        active: false
      }, {
        id: 914,
        regionID: 1010014,
        name: "tournament14",
        active: false
      }, {
        id: 915,
        regionID: 1010015,
        name: "tournament15",
        active: false
      }];
      tournamentData.forEach(function (data) {
        var id = data.id,
          regionID = data.regionID,
          name = data.name,
          active = data.active;
        var tournament = new Tournament(_this17.eventManager, id, regionID, name, active);
        _this17.tournaments.push(tournament);
        _this17.gameManager.gameContent.idToObjectMap.set(id, tournament);
        _this17.gameManager.gameContent.tournaments.push(tournament);
      });
    }
  }, {
    key: "pushTournamentsToRegions",
    value: function pushTournamentsToRegions() {
      var _this18 = this;
      this.tournaments.forEach(function (tournament) {
        var region = _this18.regions.find(function (region) {
          return region.id === tournament.regionID;
        });
        if (region) {
          region.tournament = tournament;
          tournament.region = region;
        }
      });
    }
  }, {
    key: "initFighters",
    value: function initFighters() {
      var _this19 = this;
      var fighterData = [{
        id: 9001,
        tournamentID: 901,
        name: "fighter1",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "powerLevel",
        costBase: 100,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: true
      }, {
        id: 9002,
        tournamentID: 901,
        name: "fighter2",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "spiritLevel",
        costBase: 500,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: true
      }, {
        id: 9003,
        tournamentID: 901,
        name: "fighter3",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "powerLevel",
        costBase: 1000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: true
      }, {
        id: 9004,
        tournamentID: 902,
        name: "fighter4",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "spiritLevel",
        costBase: 5000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }, {
        id: 9005,
        tournamentID: 902,
        name: "fighter5",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "powerLevel",
        costBase: 10000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }, {
        id: 9006,
        tournamentID: 902,
        name: "fighter6",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "spiritLevel",
        costBase: 50000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }, {
        id: 9007,
        tournamentID: 903,
        name: "fighter7",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "powerLevel",
        costBase: 100000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }, {
        id: 9008,
        tournamentID: 903,
        name: "fighter8",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "spiritLevel",
        costBase: 500000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }, {
        id: 9009,
        tournamentID: 903,
        name: "fighter9",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "powerLevel",
        costBase: 1000000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }, {
        id: 9010,
        tournamentID: 904,
        name: "fighter10",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "spiritLevel",
        costBase: 5000000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }, {
        id: 9011,
        tournamentID: 904,
        name: "fighter11",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "powerLevel",
        costBase: 10000000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }, {
        id: 9012,
        tournamentID: 904,
        name: "fighter12",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "spiritLevel",
        costBase: 50000000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }, {
        id: 9013,
        tournamentID: 905,
        name: "fighter13",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "powerLevel",
        costBase: 100000000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }, {
        id: 9014,
        tournamentID: 905,
        name: "fighter14",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "spiritLevel",
        costBase: 500000000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }, {
        id: 9015,
        tournamentID: 905,
        name: "fighter15",
        description: "",
        level: 0,
        maxLevel: 1,
        costType: "powerLevel",
        costBase: 1000000000,
        costGrowthRate: 2,
        prodType: "crystal",
        prodBase: 100,
        prodGrowthRate: 1.01,
        active: false
      }];
      fighterData.forEach(function (data) {
        var id = data.id,
          tournamentID = data.tournamentID,
          name = data.name,
          description = data.description,
          level = data.level,
          maxLevel = data.maxLevel,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active;
        var fighter = new Fighter(_this19.eventManager, id, tournamentID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
        _this19.fighters.push(fighter);
        _this19.gameManager.gameContent.fighters.push(fighter);
        _this19.gameManager.gameContent.idToObjectMap.set(id, fighter);
      });
    }
  }, {
    key: "pushFightersToTournaments",
    value: function pushFightersToTournaments() {
      var _this20 = this;
      this.fighters.forEach(function (fighter) {
        var tournament = _this20.tournaments.find(function (tournament) {
          return tournament.id === fighter.tournamentID;
        });
        if (tournament) {
          tournament.fighters.push(fighter);
          fighter.tournament = tournament;
        }
      });
    }
  }, {
    key: "initSkills",
    value: function initSkills() {
      var _this21 = this;
      var skillData = [{
        id: 4001,
        name: "sk1",
        description: "pTrainProd*2",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 1,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: true,
        connections: {
          east: 4002,
          south: 4003,
          west: 4004
        }
      }, {
        id: 4002,
        name: "sk2",
        description: "pTrainProd*3",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 1,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          east: 4011
        }
      }, {
        id: 4003,
        name: "sk3",
        description: "pTrainProd*4",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 1,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          south: 4005
        }
      }, {
        id: 4004,
        name: "sk4",
        description: "pTrainProd*5",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 1,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          east: 4001,
          west: 4016
        }
      }, {
        id: 4005,
        name: "sk5",
        description: "pTrainProd*6",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 2,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          south: 4006
        }
      }, {
        id: 4006,
        name: "sk6",
        description: "pTrainProd*7",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 2,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          east: 4007,
          south: 4008,
          west: 4013
        }
      }, {
        id: 4007,
        name: "sk7",
        description: "pTrainProd*8",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 2,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          south: 4009
        }
      }, {
        id: 4008,
        name: "sk8",
        description: "pTrainProd*9",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 2,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {}
      }, {
        id: 4009,
        name: "sk9",
        description: "pTrainProd*10",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 2,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          south: 4010
        }
      }, {
        id: 4010,
        name: "sk10",
        description: "pTrainProd*11",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 3,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {}
      }, {
        id: 4011,
        name: "sk11",
        description: "pTrainProd*12",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 3,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          east: 4012
        }
      }, {
        id: 4012,
        name: "sk12",
        description: "pTrainProd*13",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 3,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          south: 4014
        }
      }, {
        id: 4013,
        name: "sk13",
        description: "pTrainProd*14",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 3,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {}
      }, {
        id: 4014,
        name: "sk14",
        description: "pTrainProd*15",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 3,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          south: 4015
        }
      }, {
        id: 4015,
        name: "sk15",
        description: "pTrainProd*16",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 4,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {}
      }, {
        id: 4016,
        name: "sk16",
        description: "pTrainProd*30",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 4,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          west: 4017
        }
      }, {
        id: 4017,
        name: "sk17",
        description: "pTrainProd*31",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 4,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {
          south: 4018
        }
      }, {
        id: 4018,
        name: "sk18",
        description: "pTrainProd*32",
        level: 0,
        maxLevel: 1,
        costType: "skillpoint",
        costBase: 4,
        costGrowthRate: 1.2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false,
        connections: {}
      }];
      skillData.forEach(function (data) {
        var id = data.id,
          name = data.name,
          description = data.description,
          level = data.level,
          maxLevel = data.maxLevel,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active,
          connections = data.connections;
        var skill = new Skill(_this21.eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, connections);
        _this21.skills.push(skill);
        _this21.gameManager.gameContent.skillTree.skills.push(skill);
        _this21.gameManager.gameContent.idToObjectMap.set(id, skill);
      });
    }
  }, {
    key: "createSkillConnectionUnlocks",
    value: function createSkillConnectionUnlocks() {
      var _this22 = this;
      var unlockID = 35000;
      var unlocksDone = [];
      this.skills.forEach(function (skill) {
        var _loop = function _loop(direction) {
          var unlock = new Unlock(unlockID, 1, "level", skill.id, skill.connections[direction], "id");
          //dont push unlock if a target skill is already unlocked (to handle bidirectional unlock directions)
          if (!unlocksDone.some(function (existingUnlock) {
            return existingUnlock.targetID === unlock.targetID;
          })) {
            //dont auto-create unlocks for otherwise unlocked skill paths
            if (!_this22.unlocks.find(function (u) {
              return u.targetID === skill.connections[direction];
            })) {
              _this22.unlocks.push(unlock);
              _this22.unlockManager.unlocks.push(unlock);
              _this22.gameManager.gameContent.unlocks.push(unlock);
              _this22.gameManager.gameContent.idToObjectMap.set(unlockID, unlock);
              unlockID++;
            }
          }
        };
        for (var direction in skill.connections) {
          _loop(direction);
        }
      });
    }
  }, {
    key: "createRebirthModAndPseudoObject",
    value: function createRebirthModAndPseudoObject() {
      //hidden upgrade object to act as source of rebirth mod
      var sourceUpgrade = {
        id: 60000,
        realmID: null,
        name: "hidden rebirth1 upgrade source",
        description: "hidden rebirth1 upgrade source",
        level: new Decimal(1),
        maxLevel: Infinity,
        costType: "power",
        costBase: 1,
        costGrowthRate: 2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: true
      };
      var id = sourceUpgrade.id,
        realmID = sourceUpgrade.realmID,
        name = sourceUpgrade.name,
        description = sourceUpgrade.description,
        level = sourceUpgrade.level,
        maxLevel = sourceUpgrade.maxLevel,
        costType = sourceUpgrade.costType,
        costBase = sourceUpgrade.costBase,
        costGrowthRate = sourceUpgrade.costGrowthRate,
        prodType = sourceUpgrade.prodType,
        prodBase = sourceUpgrade.prodBase,
        prodGrowthRate = sourceUpgrade.prodGrowthRate,
        active = sourceUpgrade.active;
      var upgrade = new Upgrade(this.eventManager, id, realmID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
      this.upgrades.push(upgrade);
      this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
      var modID = 60001;
      var mod = new Mod(this.eventManager, modID, "rebirth1EssenceMod", "production", null, 60000, "add", "powerTrain", null, "mult", new Decimal(1), new Decimal(1), true);
      this.mods.push(mod);
      this.gameManager.gameContent.idToObjectMap.set(modID, mod);
    }
  }, {
    key: "createMilestoneUnlocksAndMods",
    value: function createMilestoneUnlocksAndMods() {
      var MILESTONE_TIERS = [new Decimal(10), new Decimal(25), new Decimal(50), new Decimal(100), new Decimal(250), new Decimal(500), new Decimal(1000), new Decimal(2500), new Decimal(5000), new Decimal(10000), new Decimal(25000), new Decimal(50000), new Decimal(100000)];

      //hidden upgrade object to act as source of milestone mods
      var sourceUpgrade = {
        id: 30000,
        realmID: null,
        name: "hidden milestone upgrade source",
        description: "hidden milestone upgrade source",
        level: new Decimal(1),
        maxLevel: new Decimal(1),
        costType: "power",
        costBase: 1,
        costGrowthRate: 2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false
      };
      var id = sourceUpgrade.id,
        realmID = sourceUpgrade.realmID,
        name = sourceUpgrade.name,
        description = sourceUpgrade.description,
        level = sourceUpgrade.level,
        maxLevel = sourceUpgrade.maxLevel,
        costType = sourceUpgrade.costType,
        costBase = sourceUpgrade.costBase,
        costGrowthRate = sourceUpgrade.costGrowthRate,
        prodType = sourceUpgrade.prodType,
        prodBase = sourceUpgrade.prodBase,
        prodGrowthRate = sourceUpgrade.prodGrowthRate,
        active = sourceUpgrade.active;
      var upgrade = new Upgrade(this.eventManager, id, realmID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
      this.upgrades.push(upgrade);
      this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
      var unlockID = 37500;
      var modID = 30001;
      var milestoneLevel = new Decimal(0);
      var _iterator3 = _createForOfIteratorHelper(this.trainings),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var feature = _step3.value;
          var modValue = new Decimal(2);
          for (var i = 0; i < MILESTONE_TIERS.length; i++) {
            milestoneLevel = MILESTONE_TIERS[i];
            var mod = new Mod(this.eventManager, modID, feature.name + "milestone" + milestoneLevel.toString(), "production", null, 30000, "mult", null, feature.id, "mult", modValue, modValue, false);
            this.mods.push(mod);
            this.gameManager.gameContent.idToObjectMap.set(modID, mod);
            var unlock = new Unlock(unlockID, milestoneLevel, "manualLevel", feature.id, mod.id, "id");
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
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var _iterator4 = _createForOfIteratorHelper(this.trainings),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var training = _step4.value;
          training.milestoneTiers = MILESTONE_TIERS;
          training.setNewMilestoneLevel();
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "buildSkillTree",
    value: function buildSkillTree() {
      var _this23 = this;
      var baseSkill = this.gameManager.gameContent.skillTree.skills.find(function (s) {
        return s.id === 4001;
      });
      var baseSkillNode = new SkillNode(baseSkill, 100, 0);
      baseSkill.node = baseSkillNode;
      var processConnectedNodes = function processConnectedNodes(skill) {
        var _loop2 = function _loop2() {
          var connectedSkillId = skill.connections[direction];
          var connectedSkill = _this23.gameManager.gameContent.skillTree.skills.find(function (s) {
            return s.id === connectedSkillId;
          });
          if (connectedSkill && !connectedSkill.node) {
            var position = _this23.calculateNodePosition(skill.node, direction);
            var skillNode = new SkillNode(connectedSkill, position.x, position.y);
            connectedSkill.node = skillNode;
            processConnectedNodes(connectedSkill);
          }
        };
        for (var direction in skill.connections) {
          _loop2();
        }
      };
      processConnectedNodes(baseSkill);
      this.gameManager.gameContent.skillTree.skills.forEach(function (skill) {
        var _loop3 = function _loop3() {
          var targetSkillId = skill.connections[direction];
          var targetSkill = _this23.gameManager.gameContent.skillTree.skills.find(function (s) {
            return s.id === targetSkillId;
          });
          if (targetSkill) {
            skill.node.connections[direction] = targetSkill.node;
            targetSkill.node.connections[_this23.oppositeDirection(direction)] = skill.node;
          }
        };
        for (var direction in skill.connections) {
          _loop3();
        }
      });
    }
  }, {
    key: "calculateNodePosition",
    value: function calculateNodePosition(skillNode, direction) {
      var fixedLineLength = 120;
      var x, y;
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
      return {
        x: x,
        y: y
      };
    }

    // Helper function to get the opposite direction
  }, {
    key: "oppositeDirection",
    value: function oppositeDirection(direction) {
      switch (direction) {
        case 'north':
          return 'south';
        case 'south':
          return 'north';
        case 'east':
          return 'west';
        case 'west':
          return 'east';
        default:
          return null;
      }
    }
  }, {
    key: "assignModPriorities",
    value: function assignModPriorities() {
      var typeValues = {
        "prodBase": 100,
        "production": 1000,
        "costBase": 100,
        "cost": 1000
      };
      var calcTypeValues = {
        "add": 100,
        "sub": 150,
        "mult": 200,
        "div": 250,
        "exp": 300,
        "log": 350,
        "tetra": 400
      };
      this.mods.forEach(function (mod) {
        //set priority unless manually assigned
        if (!mod.priority) {
          mod.priority = typeValues[mod.type] + calcTypeValues[mod.runningCalcType];
        }
      });
    }
  }, {
    key: "assignModReferences",
    value: function assignModReferences() {
      var _this24 = this;
      this.mods.forEach(function (mod) {
        if (mod.sourceID) {
          mod.source = _this24.findObjectById(mod.sourceID);
        }
        if (mod.targetID) {
          mod.target = _this24.findObjectById(mod.targetID);
        }
      });
    }
  }, {
    key: "registerModsToSources",
    value: function registerModsToSources() {
      var _this25 = this;
      this.mods.forEach(function (mod) {
        _this25.registerModObserver(mod.source, mod);
      });
    }

    //register mod observers and push to calculation trees
  }, {
    key: "registerModObserversAndTrees",
    value: function registerModObserversAndTrees() {
      var _this26 = this;
      var typeMods = [];
      //let specialMods = [];

      this.mods.forEach(function (mod) {
        //store special/type mods for assignment after other mods have been allocated to their trees
        //if (mod.specialType) {
        //    specialMods.push(mod);
        //}
        if (mod.targetType) {
          typeMods.push(mod);
        } else if (mod.target) {
          _this26.addModToObjectCalcTree(mod.target, mod);
        } else {
          console.error("mod", mod.name, "is not initialized properly - missing: target type or target ID");
        }
      });

      //this.specialModHandler(specialMods);
      this.typeModHandler(typeMods);
    }

    //specialModHandler(specialMods) {
    //    specialMods.forEach(mod => {
    //        if (mod.specialType === "baseFeatureLevel") {
    //            //add 10 to base level of feature, persists on rebirth
    //            let featureID = mod.targetID;
    //            const feature = this.gameManager.findObjectById(featureID);
    //            //feature.level = feature.level.plus(10);
    //            feature.levelUp(this.gameManager, new Decimal(10));
    //        }
    //    });
    //}
  }, {
    key: "typeModHandler",
    value: function typeModHandler(typeMods) {
      var _this27 = this;
      typeMods.forEach(function (typeMod) {
        var featureLoop = null;

        //grab array of relevant targeted features
        if (typeMod.targetType === "powerTrain") {
          featureLoop = _this27.trainings.filter(function (training) {
            return training.realmID < 50;
          });
        } else if (typeMod.targetType === "spiritTrain") {
          featureLoop = _this27.trainings.filter(function (training) {
            return training.realmID > 50;
          });
        } else if (typeMod.targetType === "fighters") {
          featureLoop = _this27.fighters;
        } else if (typeMod.targetType === "allTrain") {
          featureLoop = _this27.trainings;
        } else if (typeMod.targetType === "trains&upgrades") {
          featureLoop = _this27.trainings;
        }

        //add type mod to relevant feature
        var _iterator5 = _createForOfIteratorHelper(featureLoop),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var feature = _step5.value;
            if (typeMod.source !== feature) {
              _this27.addModToObjectCalcTree(feature, typeMod);
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      });
    }
  }, {
    key: "addModToObjectCalcTree",
    value: function addModToObjectCalcTree(targetObject, mod) {
      var tree = null;
      switch (mod.type) {
        case 'costBase':
        case 'cost':
          if (targetObject.calcTreesMap.get("cost")) {
            targetObject.calcTreesMap.get("cost").addNode(mod);
            mod.calcTreeReferences.push(targetObject.calcTreesMap.get("cost"));
          } else {
            tree = new CalculationTree(targetObject, "cost");
            targetObject.calcTreesMap.set("cost", tree);
            tree.addNode(mod);
            mod.calcTreeReferences.push(targetObject.calcTreesMap.get("cost"));
            this.calcTrees.push(tree);
          }
          break;
        case 'prodBase':
        case 'production':
          if (targetObject.calcTreesMap.get("production")) {
            targetObject.calcTreesMap.get("production").addNode(mod);
            mod.calcTreeReferences.push(targetObject.calcTreesMap.get("production"));
          } else {
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
  }, {
    key: "initCalcTrees",
    value: function initCalcTrees() {
      this.calcTrees.forEach(function (tree) {
        tree.buildTree();
      });
    }
  }, {
    key: "registerModObserver",
    value: function registerModObserver(sourceObject, mod) {
      if (sourceObject) {
        sourceObject.registerObserver(mod);
      }
    }
  }, {
    key: "pushTrainingsToRealms",
    value: function pushTrainingsToRealms() {
      var _this28 = this;
      this.trainings.forEach(function (training) {
        var realm = _this28.realms.find(function (realm) {
          return realm.id === training.realmID;
        });
        if (realm) {
          realm.trainings.push(training);
          training.realm = realm; // Assign the realm reference to the training's realm value
        } else {
          console.error("No realm found with id ".concat(training.realmID, " for training ").concat(training.name));
        }
      });
    }
  }, {
    key: "pushUpgradesToRealms",
    value: function pushUpgradesToRealms() {
      var _this29 = this;
      this.upgrades.forEach(function (upgrade) {
        var realm = _this29.realms.find(function (realm) {
          return realm.id === upgrade.realmID;
        });
        if (realm) {
          realm.upgrades.push(upgrade);
          upgrade.realm = realm; // Assign the realm reference to the training's realm value
        } else {
          console.error("No realm found with id ".concat(upgrade.realmID, " for training ").concat(upgrade.name));
        }
      });
    }
  }, {
    key: "assignUnlockReferences",
    value: function assignUnlockReferences() {
      var _this30 = this;
      this.unlocks.forEach(function (unlock) {
        if (unlock.targetID) {
          unlock.target = _this30.findObjectById(unlock.targetID);
        }
        if (unlock.dependentID) {
          unlock.dependent = _this30.findObjectById(unlock.dependentID);
        }
      });
    }
  }, {
    key: "findObjectById",
    value: function findObjectById(id) {
      var object = this.gameManager.gameContent.idToObjectMap.get(id);
      return object;
    }
  }, {
    key: "printTrainingInfo",
    value: function printTrainingInfo() {
      console.error("::::::::::::::::::::::::::");
      console.error(":::::   TRAININGS   :::::");
      console.error("::::::::::::::::::::::::::");
      this.trainings.forEach(function (training) {
        console.error("Training ".concat(training.id, " - ").concat(training.name));
        console.error(" Observers:");
        training.observers.forEach(function (observer, index) {
          console.error("  Observer ".concat(index + 1, ": ").concat(observer.id, " ").concat(observer.name));
        });
        console.error(" Calc Trees:");
        training.calcTreesMap.forEach(function (calcTree, key) {
          console.error("  Calculation tree: ".concat(key));
          calcTree.nodes.forEach(function (node, index) {
            console.error("   Node ".concat(index + 1, ": ").concat(node.ref.id, " ").concat(node.ref.name, " value: ").concat(node.ref.value, " srcCalc: ").concat(node.ref.sourceCalcType, " runCalc: ").concat(node.ref.runningCalcType, " previousNode: ").concat(node.previousNode ? node.previousNode.ref.name : null, " nextNode: ").concat(node.nextNode ? node.nextNode.ref.name : null, " active:").concat(node.ref.active));
          });
        });
      });
    }
  }, {
    key: "printUpgradeInfo",
    value: function printUpgradeInfo() {
      console.error("::::::::::::::::::::::::::");
      console.error("::::::   UPGRADES   ::::::");
      console.error("::::::::::::::::::::::::::");
      this.upgrades.forEach(function (upgrade) {
        console.error("Upgrade ".concat(upgrade.id, " - ").concat(upgrade.name));
        console.error(" Observers:");
        upgrade.observers.forEach(function (observer, index) {
          console.error("  Observer ".concat(index + 1, ": ").concat(observer.id, " ").concat(observer.name));
        });
        console.error(" Calc Trees:");
        upgrade.calcTreesMap.forEach(function (calcTree, key) {
          console.error("  Calculation tree: ".concat(key));
          calcTree.nodes.forEach(function (node, index) {
            console.error("   Node ".concat(index + 1, ": ").concat(node.ref.id, " ").concat(node.ref.name, " value: ").concat(node.ref.value, " srcCalc: ").concat(node.ref.sourceCalcType, " runCalc: ").concat(node.ref.runningCalcType, " previousNode: ").concat(node.previousNode ? node.previousNode.ref.name : null, " nextNode: ").concat(node.nextNode ? node.nextNode.ref.name : null));
          });
        });
      });
    }
  }, {
    key: "printFighterInfo",
    value: function printFighterInfo() {
      console.error("::::::::::::::::::::::::::");
      console.error("::::::   FIGHTERS   ::::::");
      console.error("::::::::::::::::::::::::::");
      this.fighters.forEach(function (fighter) {
        console.error("Fighter ".concat(fighter.id, " - ").concat(fighter.name));
        console.error(" Observers:");
        fighter.observers.forEach(function (observer, index) {
          console.error("  Observer ".concat(index + 1, ": ").concat(observer.id, " ").concat(observer.name));
        });
        console.error(" Calc Trees:");
        fighter.calcTreesMap.forEach(function (calcTree, key) {
          console.error("  Calculation tree: ".concat(key));
          calcTree.nodes.forEach(function (node, index) {
            console.error("   Node ".concat(index + 1, ": ").concat(node.ref.id, " ").concat(node.ref.name, " value: ").concat(node.ref.value, " srcCalc: ").concat(node.ref.sourceCalcType, " runCalc: ").concat(node.ref.runningCalcType, " previousNode: ").concat(node.previousNode ? node.previousNode.ref.name : null, " nextNode: ").concat(node.nextNode ? node.nextNode.ref.name : null));
          });
        });
      });
    }
  }, {
    key: "printUnlockInfo",
    value: function printUnlockInfo() {
      this.unlocksDiv = document.getElementById("unlocksList");
      this.unlocksDiv.innerHTML = "LIST OF UNLOCKS:<br>";
      var _iterator6 = _createForOfIteratorHelper(this.gameManager.gameContent.unlocks),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var unlock = _step6.value;
          this.unlocksDiv.innerHTML += "".concat(unlock.dependent.name, " unlocks ").concat(unlock.target.name, " via ").concat(unlock.conditionType, " ").concat(unlock.conditionValue, "<br>");
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }]);
  return Builder;
}();
},{}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56034" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","builder.js"], null)
//# sourceMappingURL=/builder.d3c9156e.js.map