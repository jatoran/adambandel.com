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
})({"ui.js":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var GameUI = /*#__PURE__*/function () {
  function GameUI(eventManager, gameManager, gameStateManager) {
    var _this = this;
    _classCallCheck(this, GameUI);
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
    this.achievementsCol1 = document.getElementById("achievements-col1");
    this.numberSettings = document.getElementById("numberSettings");
    this.multSettings = document.getElementById("multSettings");
    this.multiplierString = multSettings.value;
    this.gameManager.multiplierString = this.multSettings.value;
    this.updateNumberNotationHandler = function () {
      return _this.updateNumberNotation();
    };
    this.updateMultiplierHandler = function () {
      return _this.updateMultiplierIndex();
    };
    this.numberSettings.addEventListener('change', this.updateNumberNotationHandler);
    this.multiplierValues = ["1", "5", "10", "100", "nextMilestone", "max"];
    this.multiplierIndex = 0;
    this.multSettings = document.getElementById("multSettings");
    this.multSettings.addEventListener('click', this.updateMultiplierHandler.bind(this));
    this.currentTab = 'power'; //set default tab
    this.currentButton = document.getElementById(this.currentTab + 'Tab'); // Set default button

    this.isExplorationTabPopulated = false;
    this.populateSaveLoadButtons();
    this.populateUI();
    // Initialize the multiplier
    this.updateMultiplier();
    this.createTabEventListeners();
  }
  _createClass(GameUI, [{
    key: "createTabEventListeners",
    value: function createTabEventListeners() {
      var _this2 = this;
      var tabButtons = document.getElementById('tab-buttons').getElementsByTagName('button');

      // Loop through each button and add a click event listener
      var _iterator = _createForOfIteratorHelper(tabButtons),
        _step;
      try {
        var _loop = function _loop() {
          var button = _step.value;
          button.addEventListener('click', function () {
            // The button's id should correspond to the tab's id
            var tabId = button.id.slice(0, -3);
            _this2.changeTab(tabId);
          });
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "changeTab",
    value: function changeTab(tab) {
      // Hide the current tab
      var currentTabElement = document.getElementById(this.currentTab);
      if (currentTabElement) {
        currentTabElement.style.display = "none";
      }

      // Show the new tab
      if (tab) {
        this.currentTab = tab;
      }
      var newTabElement = document.getElementById(tab);
      if (newTabElement) {
        newTabElement.style.display = "block";
      }
      if (this.currentButton) {
        this.currentButton.classList.remove('active-tab');
      }
      this.currentButton = document.getElementById(this.currentTab + 'Tab');
      if (this.currentButton) {
        this.currentButton.classList.add('active-tab');
      }
    }
  }, {
    key: "populateUI",
    value: function () {
      var _populateUI = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.updateUI();
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function populateUI() {
        return _populateUI.apply(this, arguments);
      }
      return populateUI;
    }()
  }, {
    key: "updateUI",
    value: function updateUI() {
      this.populateStatsDisplay();
      this.populatePowerTab();
      this.populateSpiritTab();
      this.populateSkillsTab();
      this.populateEssenceTab();
      this.populateAchievementsTab();
      this.populateExplorationTab();
    }
  }, {
    key: "clear",
    value: function clear() {
      this.clearListeners();
      this.clearDynamicElements();
    }
  }, {
    key: "clearDynamicElements",
    value: function clearDynamicElements() {
      this.clearPowerTab();
      this.clearSpiritTab();
      this.clearTournamentTab();
      this.clearSkillTab();
    }
  }, {
    key: "clearListeners",
    value: function clearListeners() {
      var saveButton = document.getElementById('save');
      var loadButton = document.getElementById('load');
      var resetButton = document.getElementById('reset');
      var rebirth1Button = document.getElementById('rebirth1');
      var rebirth2Button = document.getElementById('rebirth2');
      var rebirth3Button = document.getElementById('rebirth3');
      saveButton.removeEventListener('click', this.saveButtonHandler);
      loadButton.removeEventListener('click', this.loadButtonHandler);
      resetButton.removeEventListener('click', this.resetButtonHandler);
      rebirth1Button.removeEventListener('click', this.rebirth1ButtonHandler);
      rebirth2Button.removeEventListener('click', this.rebirth2ButtonHandler);
      rebirth3Button.removeEventListener('click', this.rebirth3ButtonHandler);
      this.numberSettings.removeEventListener('change', this.updateNumberNotationHandler);
      this.multSettings.removeEventListener('click', this.updateMultiplierHandler);
    }
  }, {
    key: "clearPowerTab",
    value: function clearPowerTab() {
      this.removeAllChildren(this.powerCol1);
    }
  }, {
    key: "clearSpiritTab",
    value: function clearSpiritTab() {
      this.removeAllChildren(this.spiritCol1);
    }
  }, {
    key: "clearTournamentTab",
    value: function clearTournamentTab() {
      this.removeAllChildren(this.tournamentCol1);
    }
  }, {
    key: "clearSkillTab",
    value: function clearSkillTab() {
      var skillGrid = this.skillsCol1.querySelector('.skill-grid');
      if (skillGrid) {
        skillGrid.remove();
      }
    }
  }, {
    key: "removeAllChildren",
    value: function removeAllChildren(parent) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
    }
  }, {
    key: "isAffordable",
    value: function isAffordable(feature) {
      var currentResource = this.gameManager.queryPlayerResource(feature.costType);
      if (feature.featureType === "fighter") {
        if (currentResource.gte(feature.costBase)) {
          return true;
        }
        return false;
      }
      if (currentResource.gt(feature.costNext)) {
        return true;
      }
      return false;
    }
  }, {
    key: "updateNumberNotation",
    value: function updateNumberNotation() {
      this.numberNotation = this.numberSettings.value;
      this.updateUI();
    }
  }, {
    key: "updateMultiplierIndex",
    value: function updateMultiplierIndex() {
      this.multiplierIndex = (this.multiplierIndex + 1) % this.multiplierValues.length;
      this.updateMultiplier();
    }
  }, {
    key: "updateMultiplier",
    value: function updateMultiplier() {
      var newValue = this.multiplierValues[this.multiplierIndex];
      this.multSettings.textContent = newValue === "1" ? "x1" : newValue;
      this.multiplierString = newValue;
      this.gameManager.onMultiplierChange(newValue);
    }
  }, {
    key: "populateStatsDisplay",
    value: function () {
      var _populateStatsDisplay = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var powerStat, powerIncomeStat, spiritStat, spiritIncomeStat, essenceStat, essenceMultiplier, skillpointStat, lifetimePower, powerLevelStat, lifetimeSpirit, spiritLevelStat, lifetimeEssence, crystal, placeHolder1, placeHolder2, rebirth1PseudoObject;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              // Create and add the elements only once
              if (!this.statsRow.querySelector('.power-stat')) {
                //row 1
                powerStat = document.createElement('div');
                powerStat.className = 'power-stat';
                this.statsRow.appendChild(powerStat);
                powerIncomeStat = document.createElement('div');
                powerIncomeStat.className = 'power-income-stat';
                this.statsRow.appendChild(powerIncomeStat);
                spiritStat = document.createElement('div');
                spiritStat.className = 'spirit-stat';
                this.statsRow.appendChild(spiritStat);
                spiritIncomeStat = document.createElement('div');
                spiritIncomeStat.className = 'spirit-income-stat';
                this.statsRow.appendChild(spiritIncomeStat);
                essenceStat = document.createElement('div');
                essenceStat.className = 'essence-stat';
                this.statsRow.appendChild(essenceStat);
                essenceMultiplier = document.createElement('div');
                essenceMultiplier.className = 'essence-multiplier';
                this.statsRow.appendChild(essenceMultiplier);
                skillpointStat = document.createElement('div');
                skillpointStat.className = 'skillpoint-stat';
                this.statsRow.appendChild(skillpointStat);

                //row 2
                lifetimePower = document.createElement('div');
                lifetimePower.className = 'lifetime-power';
                this.statsRow2.appendChild(lifetimePower);
                powerLevelStat = document.createElement('div');
                powerLevelStat.className = 'power-level-stat';
                this.statsRow2.appendChild(powerLevelStat);
                lifetimeSpirit = document.createElement('div');
                lifetimeSpirit.className = 'lifetime-spirit';
                this.statsRow2.appendChild(lifetimeSpirit);
                spiritLevelStat = document.createElement('div');
                spiritLevelStat.className = 'spirit-level-stat';
                this.statsRow2.appendChild(spiritLevelStat);
                lifetimeEssence = document.createElement('div');
                lifetimeEssence.className = 'lifetime-essence';
                this.statsRow2.appendChild(lifetimeEssence);
                crystal = document.createElement('div');
                crystal.className = 'crystal';
                this.statsRow2.appendChild(crystal);
                placeHolder1 = document.createElement('div');
                placeHolder1.className = '';
                this.statsRow2.appendChild(placeHolder1);
                placeHolder2 = document.createElement('div');
                placeHolder2.className = '';
                this.statsRow2.appendChild(placeHolder2);
              }

              // Update the text of the elements without replacing their content

              //row 1
              this.statsRow.querySelector('.power-stat').textContent = "Power\n".concat(this.formatNumber(this.gameManager.gameContent.player.power));
              this.statsRow.querySelector('.power-income-stat').textContent = "powerIncome\n ".concat(this.formatNumber(this.gameManager.gameContent.player.powerIncome));
              this.statsRow.querySelector('.spirit-stat').textContent = "Spirit\n".concat(this.formatNumber(this.gameManager.gameContent.player.spirit));
              this.statsRow.querySelector('.spirit-income-stat').textContent = "spiritIncome\n".concat(this.formatNumber(this.gameManager.gameContent.player.spiritIncome));
              this.statsRow.querySelector('.essence-stat').textContent = "Essence\n".concat(this.formatNumber(this.gameManager.gameContent.player.essence));
              this.statsRow.querySelector('.skillpoint-stat').textContent = "Skillpoint\n".concat(this.formatNumber(this.gameManager.gameContent.player.skillpoint));

              //row 2
              this.statsRow2.querySelector('.lifetime-power').textContent = "LifetimePower\n".concat(this.formatNumber(this.gameManager.gameContent.player.lifetimePowerEarned));
              this.statsRow2.querySelector('.power-level-stat').textContent = "PowerLevel\n".concat(this.formatNumber(this.gameManager.gameContent.player.powerLevel));
              this.statsRow2.querySelector('.lifetime-spirit').textContent = "LifetimeSpirit\n".concat(this.formatNumber(this.gameManager.gameContent.player.lifetimeSpiritEarned));
              this.statsRow2.querySelector('.spirit-level-stat').textContent = "SpiritLevel\n".concat(this.formatNumber(this.gameManager.gameContent.player.spiritLevel));
              this.statsRow2.querySelector('.lifetime-essence').textContent = "LifetimeEssence\n".concat(this.formatNumber(this.gameManager.gameContent.player.lifetimeEssenceEarned));
              this.statsRow2.querySelector('.crystal').textContent = "Crystal\n".concat(this.formatNumber(this.gameManager.gameContent.player.crystal));
              rebirth1PseudoObject = this.gameManager.findObjectById(60000);
              this.statsRow.querySelector('.essence-multiplier').textContent = "EssenceMultiplier\n".concat(this.formatNumber(rebirth1PseudoObject.level));
            case 15:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function populateStatsDisplay() {
        return _populateStatsDisplay.apply(this, arguments);
      }
      return populateStatsDisplay;
    }()
  }, {
    key: "populateSaveLoadButtons",
    value: function populateSaveLoadButtons() {
      var _this3 = this;
      // Get the save and load divs
      var saveButton = document.getElementById('save');
      var loadButton = document.getElementById('load');
      var resetButton = document.getElementById('reset');
      var rebirth1Button = document.getElementById('rebirth1');
      var rebirth2Button = document.getElementById('rebirth2');
      var rebirth3Button = document.getElementById('rebirth3');
      saveButton.disabled = true;
      loadButton.disabled = true;
      resetButton.disabled = true;
      rebirth1Button.disabled = true;
      rebirth2Button.disabled = true;
      rebirth3Button.disabled = true;
      this.saveButtonHandler = function () {
        _this3.gameStateManager.saveGameState(0);
        saveButton.innerHTML = "Game Saved!";
        saveButton.classList.add('fade');
        setTimeout(function () {
          saveButton.classList.remove('fade');
          saveButton.innerHTML = "Save";
        }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
      };

      this.loadButtonHandler = function () {
        _this3.gameStateManager.loadGameState(0);
        loadButton.innerHTML = "Game Loaded!";
        loadButton.classList.add('fade');
        setTimeout(function () {
          loadButton.classList.remove('fade');
          loadButton.innerHTML = "Load";
        }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
      };

      this.resetButtonHandler = function () {
        _this3.gameStateManager.loadGameState(-1);
        resetButton.innerHTML = "Game Reset!";
        resetButton.classList.add('fade');
        setTimeout(function () {
          resetButton.classList.remove('fade');
          resetButton.innerHTML = "Reset";
        }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
      };

      this.rebirth1ButtonHandler = function () {
        _this3.gameStateManager.saveGameState(1);
        rebirth1Button.innerHTML = "Rebirth1!";
        rebirth1Button.classList.add('fade');
        setTimeout(function () {
          rebirth1Button.classList.remove('fade');
          rebirth1Button.innerHTML = "Rebirth 1";
        }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
      };

      this.rebirth2ButtonHandler = function () {
        _this3.gameStateManager.saveGameState(2);
        rebirth2Button.innerHTML = "Rebirth2!";
        rebirth2Button.classList.add('fade');
        setTimeout(function () {
          rebirth2Button.classList.remove('fade');
          rebirth2Button.innerHTML = "Rebirth 2";
        }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
      };

      this.rebirth3ButtonHandler = function () {
        _this3.gameStateManager.saveGameState(3);
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
  }, {
    key: "populateExplorationTab",
    value: function populateExplorationTab() {
      var _this4 = this;
      if (!this.isExplorationTabPopulated) {
        var targetParent = document.getElementById('exploration');
        var tabButtonsContainer = document.getElementById("exploration-tab-buttons");
        var tabButtons = Array.from(tabButtonsContainer.children);
        tabButtons.forEach(function (button, index) {
          button.addEventListener('click', function () {
            return _this4.changeExplorationSubTab(button.id);
          });
          var tabContent = document.getElementById("tab-content-".concat(button.id));
          var col1, col2;
          if (!tabContent) {
            tabContent = document.createElement('div');
            tabContent.id = "tab-content-".concat(button.id);
            tabContent.className = "tab-content";
            tabContent.style.display = index === 0 ? 'flex' : 'none'; // Only display the first tab by default

            col1 = document.createElement('div');
            col1.id = "tab-col1-".concat(button.id);
            col1.className = 'testing-content-tab-col';
            col2 = document.createElement('div');
            col2.id = "tab-col2-".concat(button.id);
            col2.className = 'testing-content-tab-col';
            tabContent.appendChild(col1);
            tabContent.appendChild(col2);
            targetParent.appendChild(tabContent);
          } else {
            col1 = document.getElementById("tab-col1-".concat(button.id));
            col2 = document.getElementById("tab-col2-".concat(button.id));
          }
        });

        // If it's the first tab, add 'active-tab' class
        if (tabButtons.length > 0) {
          tabButtons[0].classList.add('active-tab');
        }
        this.isExplorationTabPopulated = true;
      }
      this.populateExplorationSubTab();
      //this.populateTournamentSubTab();
      this.populateGearSubTab();
      this.populateWorkersSubTab();
      this.populateCrystalUpgradesSubTab();
    }
  }, {
    key: "populateExplorationSubTab",
    value: function populateExplorationSubTab() {
      var _this5 = this;
      var targetCol1 = document.getElementById("tab-col1-explorationSubTab");
      var targetCol2 = document.getElementById("tab-col2-explorationSubTab");
      var worlds = this.gameManager.gameContent.worlds;
      worlds.forEach(function (world) {
        var worldID = "world-".concat(world.id);
        var worldName = targetCol1.querySelector("#".concat(worldID));
        if (!worldName) {
          worldName = document.createElement('div');
          worldName.id = worldID;
          worldName.setAttribute('style', 'font-size:20px; font-weight: bold; margin-top:20px; margin-bottom:10px; border-bottom: 2px dashed white;');
          targetCol1.appendChild(worldName);
        }
        worldName.textContent = "".concat(world.name);
        world.regions.forEach(function (region) {
          var regionId = "region-".concat(region.id);
          var regionCell = targetCol1.querySelector("#".concat(regionId));
          if (!regionCell) {
            regionCell = document.createElement('div');
            regionCell.id = regionId;
            regionCell.classList.add('region-cell');
            targetCol1.appendChild(regionCell);
          }
          var regionName = regionCell.querySelector('.region-name') || document.createElement('div');
          if (!regionCell.contains(regionName)) {
            regionName.className = 'region-name';
            regionName.setAttribute('style', 'font-size:18px; font-weight: bold; margin-top:10px; margin-bottom:8px; border-bottom: 1px dashed white;');
            regionCell.appendChild(regionName);
          }
          regionName.textContent = "".concat(region.name);
          if (region.workers) {
            region.workers.forEach(function (worker) {
              var workerID = "worker-".concat(worker.id);
              var workerCell = targetCol2.querySelector("#".concat(workerID));
              if (!workerCell) {
                workerCell = document.createElement('div');
                workerCell.id = workerID;
                workerCell.classList.add('worker-cell');
                targetCol2.appendChild(workerCell);
              }
              var workerName = workerCell.querySelector('.worker-name') || document.createElement('div');
              if (!workerCell.contains(workerName)) {
                workerName.className = 'worker-name';
                workerCell.appendChild(workerName);
              }
              workerName.textContent = "".concat(worker.name);
            });
          }
          if (region.tournament) {
            var tournamentName = regionCell.querySelector('.tournament-name') || document.createElement('div');
            if (!regionCell.contains(tournamentName)) {
              tournamentName.className = 'tournament-name';
              tournamentName.setAttribute('style', 'font-size:15px; margin-top:10px; margin-bottom:8px; border-bottom: 1px dashed white;');
              regionCell.appendChild(tournamentName);
            }
            tournamentName.textContent = "".concat(region.tournament.name);
            region.tournament.fighters.forEach(function (fighter) {
              var fighterId = "fighter-".concat(fighter.id);
              var fighterCell = targetCol1.querySelector("#".concat(fighterId));
              if (!fighterCell) {
                fighterCell = document.createElement('div');
                fighterCell.id = fighterId;
                fighterCell.classList.add('fighter-cell');
                targetCol1.appendChild(fighterCell);
              }
              var fighterName = fighterCell.querySelector('.fighter-name') || document.createElement('div');
              if (!fighterCell.contains(fighterName)) {
                fighterName.className = 'fighter-name';
                fighterCell.appendChild(fighterName);
              }
              fighterName.textContent = "".concat(fighter.name);
              var button = document.querySelector("#fight-button-".concat(fighter.id)) || document.createElement('button');
              if (!fighterCell.contains(button)) {
                button.setAttribute('style', 'white-space:pre;');
                button.id = "fight-button-".concat(fighter.id);
                button.addEventListener('click', function () {
                  region.tournament.handleFight(fighter.id);
                });
                fighterCell.appendChild(button);
              }
              button.textContent = "Fight \r\n";
              button.textContent += "".concat(fighter.costType, " ").concat(_this5.formatNumber(fighter.costNext), "\r\n");
              button.textContent += "+ ".concat(_this5.formatNumber(fighter.prodNext), " ").concat(fighter.prodType);
              if (!fighter.active || !_this5.isAffordable(fighter)) {
                button.disabled = true;
                button.style.opacity = 0.7;
              } else if (fighter.isDefeated) {
                button.disabled = true;
                button.style.opacity = 1;
                button.setAttribute('style', 'white-space:pre; background-color:green; color:white');
                button.textContent = "Defeated";
              } else {
                button.disabled = false;
                button.style.opacity = 1;
              }
            });
          }
        });
      });
    }
  }, {
    key: "populateTournamentSubTab",
    value: function populateTournamentSubTab() {
      var targetCol1 = document.getElementById("tab-col1-tournamentSubTab");
    }
  }, {
    key: "populateGearSubTab",
    value: function populateGearSubTab() {
      var targetCol1 = document.getElementById("tab-col1-gearSubTab");
      //let targetCol2 = document.getElementById(`tab-col2-gearSubTab`);
    }
  }, {
    key: "populateWorkersSubTab",
    value: function populateWorkersSubTab() {
      var targetCol1 = document.getElementById("tab-col1-workersSubTab");
      //let targetCol2 = document.getElementById(`tab-col2-workersSubTab`);
    }
  }, {
    key: "populateCrystalUpgradesSubTab",
    value: function populateCrystalUpgradesSubTab() {
      var targetCol1 = document.getElementById("tab-col1-crystalUpgradesSubTab");
      //let targetCol2 = document.getElementById(`tab-col2-crystalUpgradesSubTab`);
    }
  }, {
    key: "changeExplorationSubTab",
    value: function changeExplorationSubTab(tabId) {
      // Get the parent container
      var tabButtonsContainer = document.getElementById("exploration-tab-buttons");
      var tabButtons = Array.from(tabButtonsContainer.children);

      // Remove 'active-tab' class from all tab buttons
      tabButtons.forEach(function (button) {
        button.classList.remove('active-tab');
      });

      // Add 'active-tab' class to the clicked button
      var targetTab = document.getElementById(tabId);
      targetTab.classList.add('active-tab');

      // Get the parent container for the tabs
      var targetParent = document.getElementById('exploration');

      // Hide all tab contents
      var tabContents = Array.from(targetParent.children);
      tabContents.forEach(function (content) {
        if (content.id.includes('tab-content')) {
          content.style.display = 'none';
        }
      });

      // Show the content of the clicked tab
      document.getElementById("tab-content-".concat(tabId)).style.display = 'flex';
    }
  }, {
    key: "populatePowerTab",
    value: function populatePowerTab() {
      var _this6 = this;
      var targetParent = document.getElementById('power');
      var realmButtonsContainer = document.getElementById('power-realm-buttons');
      this.gameManager.gameContent.powerRealms.forEach(function (realm, index) {
        var realmId = "realm-".concat(realm.name);
        var realmButton = document.getElementById(realmId);
        var realmContent = document.getElementById("realm-content-".concat(realm.name));
        var col1, col2;
        if (!realmButton) {
          realmButton = document.createElement('button');
          realmButton.id = realmId;
          realmButton.textContent = realm.name;
          realmButton.className = "realm-button";
          realmButton.addEventListener('click', function () {
            return _this6.changeRealm(realmId, "power");
          });

          // If it's the first realm, add 'active-tab' class
          if (index === 0) {
            realmButton.classList.add('active-tab');
          }
          realmButtonsContainer.appendChild(realmButton);
        }
        if (!realmContent) {
          realmContent = document.createElement('div');
          realmContent.id = "realm-content-".concat(realm.name);
          realmContent.className = "realm-content";
          realmContent.style.display = index === 0 ? 'flex' : 'none'; // Only display the first realm by default

          col1 = document.createElement('div');
          col1.id = "power-col1-".concat(realm.name);
          col1.className = 'testing-content-tab-col';
          col2 = document.createElement('div');
          col2.id = "power-col2-".concat(realm.name);
          col2.className = 'testing-content-tab-col';
          realmContent.appendChild(col1);
          realmContent.appendChild(col2);
          targetParent.appendChild(realmContent);
        } else {
          col1 = document.getElementById("power-col1-".concat(realm.name));
          col2 = document.getElementById("power-col2-".concat(realm.name));
        }
        _this6.populatePowerRealm(col1, col2, realm);
      });
    }
  }, {
    key: "populatePowerRealm",
    value: function populatePowerRealm(targetCol1, targetCol2, realm) {
      var _this7 = this;
      realm.trainings.forEach(function (training) {
        var trainingId = "training-".concat(training.id);
        var trainingCell = targetCol1.querySelector("#".concat(trainingId));
        if (!trainingCell) {
          trainingCell = document.createElement('div');
          trainingCell.id = trainingId;
          trainingCell.classList.add('training-cell');
          var _trainingName = document.createElement('div');
          _trainingName.className = 'training-name';
          _trainingName.textContent = training.name + " lvl " + training.level + "\n" + training.description;
          trainingCell.appendChild(_trainingName);
          var buttonContainer = document.createElement('div');
          var _button = document.createElement('button');
          _button.id = "button-".concat(training.id);
          _button.addEventListener('click', function () {
            _this7.buyFeature(training.id);
          });
          buttonContainer.appendChild(_button);
          trainingCell.appendChild(buttonContainer);
          targetCol1.appendChild(trainingCell);
        }

        // Update training level text
        var trainingName = trainingCell.querySelector('.training-name');
        trainingName.textContent = training.name + " lvl " + training.level;

        // Create and update the current value and prodType element
        var currentValueElement = trainingCell.querySelector('.training-current-value');
        if (!currentValueElement) {
          currentValueElement = document.createElement('div');
          currentValueElement.className = 'training-current-value';
          currentValueElement.setAttribute('style', 'font-size:10px;');
          trainingCell.appendChild(currentValueElement);
        }
        currentValueElement.setAttribute('style', 'white-space:pre; font-size: 10px;');
        currentValueElement.textContent = "".concat(_this7.formatNumber(training.prodCurrent), " ").concat(training.prodType, "\r\n");
        currentValueElement.textContent += "prodMult ".concat(_this7.formatNumber(training.prodMult), "\r\n");
        currentValueElement.textContent += "prodRate ".concat(_this7.formatNumber(training.prodGrowthRate), "\r\n");
        currentValueElement.textContent += "costMult ".concat(_this7.formatNumber(training.costMult), "\r\n");
        currentValueElement.textContent += "costRate ".concat(_this7.formatNumber(training.costGrowthRate));

        // Update button text, style, and clickability based on training.active
        var button = trainingCell.querySelector("#button-".concat(training.id));
        button.setAttribute('style', 'white-space:pre;');
        button.textContent = "x ".concat(training.nextLevelIncrement, "\r\n");
        button.textContent += "-".concat(_this7.formatNumber(training.costNext), " ").concat(training.costType, "\r\n");
        button.textContent += "+".concat(_this7.formatNumber(training.prodCurrent.plus(training.prodNext.minus(training.prodCurrent))), " ").concat(training.prodType);
        if (training.active && training.level !== training.maxLevel && _this7.isAffordable(training) && training.nextLevelIncrement.gt(0)) {
          button.disabled = false;
          button.style.opacity = 1;
        } else if (training.level === training.maxLevel) {
          button.disabled = true;
          button.style.opacity = 0.6;
          button.innerHTML = "max";
        } else {
          button.disabled = true;
          button.style.opacity = 0.6;
        }
      });
      realm.upgrades.forEach(function (upgrade) {
        var upgradeId = "upgrade-".concat(upgrade.id);
        var upgradeCell = targetCol2.querySelector("#".concat(upgradeId));
        if (!upgradeCell) {
          upgradeCell = document.createElement('div');
          upgradeCell.id = upgradeId;
          upgradeCell.classList.add('upgrade-cell');
          var _upgradeName = document.createElement('div');
          _upgradeName.className = 'upgrade-name';
          _upgradeName.textContent = upgrade.name + " lvl " + upgrade.level + "\n" + upgrade.description;
          upgradeCell.appendChild(_upgradeName);
          var buttonContainer = document.createElement('div');
          var _button2 = document.createElement('button');
          _button2.id = "button-".concat(upgrade.id);
          _button2.addEventListener('click', function () {
            _this7.buyFeature(upgrade.id);
          });
          buttonContainer.appendChild(_button2);
          upgradeCell.appendChild(buttonContainer);
          targetCol2.appendChild(upgradeCell);
        }

        // Update upgrade level text
        var upgradeName = upgradeCell.querySelector('.upgrade-name');
        upgradeName.textContent = upgrade.name + " lvl " + upgrade.level;

        // Update upgrade description text
        var upgradeDescription = upgradeCell.querySelector('.upgrade-description');
        if (!upgradeDescription) {
          upgradeDescription = document.createElement('div');
          upgradeDescription.className = 'upgrade-description';
          upgradeDescription.setAttribute('style', 'font-size:10px; max-width: 150px;');
          upgradeCell.appendChild(upgradeDescription);
        }
        upgradeDescription.textContent = "\n" + upgrade.description;

        // Update button text, style, and clickability based on upgrade.active
        var button = upgradeCell.querySelector("#button-".concat(upgrade.id));
        button.setAttribute('style', 'white-space:pre;');
        if (upgrade.maxLevel.eq(upgrade.level.plus(upgrade.nextLevelIncrement))) {
          button.textContent = "x".concat(upgrade.nextLevelIncrement, "(max)\r\n");
        } else {
          button.textContent = "x".concat(upgrade.nextLevelIncrement, "\r\n");
        }
        var nextUpgradeCost = upgrade.costNext;
        button.textContent += "-".concat(_this7.formatNumber(nextUpgradeCost), " ").concat(upgrade.costType, "\r\n");
        if (upgrade.active && upgrade.level.neq(upgrade.maxLevel) && _this7.isAffordable(upgrade) && upgrade.nextLevelIncrement.gt(0)) {
          button.disabled = false;
          button.style.opacity = 1;
        } else if (upgrade.level.eq(upgrade.maxLevel)) {
          button.disabled = true;
          button.style.opacity = 0.6;
          button.innerHTML = "max";
        } else {
          button.disabled = true;
          button.style.opacity = 0.6;
        }
      });
    }
  }, {
    key: "populateSpiritRealm",
    value: function populateSpiritRealm(targetCol1, targetCol2, realm) {
      var _this8 = this;
      realm.generatorChains[0].generators.forEach(function (generator) {
        var generatorId = "generator-".concat(generator.id);
        var generatorCell = targetCol1.querySelector("#".concat(generatorId));
        if (!generatorCell) {
          generatorCell = document.createElement('div');
          generatorCell.id = generatorId;
          generatorCell.classList.add('generator-cell');
          var _generatorName = document.createElement('div');
          _generatorName.className = 'generator-name';
          _generatorName.textContent = generator.name + " # " + _this8.formatNumber(generator.level) + "\n" + generator.description;
          generatorCell.appendChild(_generatorName);
          var buttonContainer = document.createElement('div');
          var _button3 = document.createElement('button');
          _button3.id = "button-".concat(generator.id);
          _button3.addEventListener('click', function () {
            _this8.buyFeature(generator.id);
          });
          buttonContainer.appendChild(_button3);
          generatorCell.appendChild(buttonContainer);
          targetCol1.appendChild(generatorCell);
        }

        // Update generator level text
        var generatorName = generatorCell.querySelector('.generator-name');
        generatorName.textContent = generator.name + " lvl " + _this8.formatNumber(generator.level);

        // Create and update the current value and prodType element
        var currentValueElement = generatorCell.querySelector('.generator-current-value');
        if (!currentValueElement) {
          currentValueElement = document.createElement('div');
          currentValueElement.className = 'generator-current-value';
          currentValueElement.setAttribute('style', 'font-size:10px;');
          generatorCell.appendChild(currentValueElement);
        }
        currentValueElement.setAttribute('style', 'white-space:pre; font-size: 10px;');
        currentValueElement.textContent = "".concat(_this8.formatNumber(generator.prodCurrent), " ").concat(generator.prodType, "\r\n");
        currentValueElement.textContent += "prodMult ".concat(_this8.formatNumber(generator.prodMult), "\r\n");
        currentValueElement.textContent += "prodRate ".concat(_this8.formatNumber(generator.prodGrowthRate), "\r\n");
        currentValueElement.textContent += "purchased: ".concat(_this8.formatNumber(generator.manualLevel), "\r\n");
        currentValueElement.textContent += "generated: ".concat(_this8.formatNumber(generator.autoLevel));

        // Update button text, style, and clickability based on generator.active
        var button = generatorCell.querySelector("#button-".concat(generator.id));
        button.setAttribute('style', 'white-space:pre;');
        button.textContent = "x ".concat(generator.nextLevelIncrement, "\r\n");
        button.textContent += "-".concat(_this8.formatNumber(generator.costNext), " ").concat(generator.costType, "\r\n");
        button.textContent += "+".concat(_this8.formatNumber(generator.prodCurrent.plus(generator.prodNext.minus(generator.prodCurrent))), " ").concat(generator.prodType);
        if (generator.active && generator.level !== generator.maxLevel && _this8.isAffordable(generator) && generator.nextLevelIncrement.gt(0)) {
          button.disabled = false;
          button.style.opacity = 1;
        } else if (generator.level === generator.maxLevel) {
          button.disabled = true;
          button.style.opacity = 0.6;
          button.innerHTML = "max";
        } else {
          button.disabled = true;
          button.style.opacity = 0.6;
        }
      });
      realm.upgrades.forEach(function (upgrade) {
        var upgradeId = "upgrade-".concat(upgrade.id);
        var upgradeCell = targetCol2.querySelector("#".concat(upgradeId));
        if (!upgradeCell) {
          upgradeCell = document.createElement('div');
          upgradeCell.id = upgradeId;
          upgradeCell.classList.add('upgrade-cell');
          var _upgradeName2 = document.createElement('div');
          _upgradeName2.className = 'upgrade-name';
          _upgradeName2.textContent = upgrade.name + " lvl " + upgrade.level + "\n" + upgrade.description;
          upgradeCell.appendChild(_upgradeName2);
          var buttonContainer = document.createElement('div');
          var _button4 = document.createElement('button');
          _button4.id = "button-".concat(upgrade.id);
          _button4.addEventListener('click', function () {
            _this8.buyFeature(upgrade.id);
          });
          buttonContainer.appendChild(_button4);
          upgradeCell.appendChild(buttonContainer);
          targetCol2.appendChild(upgradeCell);
        }

        // Update upgrade level text
        var upgradeName = upgradeCell.querySelector('.upgrade-name');
        upgradeName.textContent = upgrade.name + " lvl " + upgrade.level;

        // Update upgrade description text
        var upgradeDescription = upgradeCell.querySelector('.upgrade-description');
        if (!upgradeDescription) {
          upgradeDescription = document.createElement('div');
          upgradeDescription.className = 'upgrade-description';
          upgradeDescription.setAttribute('style', 'font-size:10px; max-width: 150px;');
          upgradeCell.appendChild(upgradeDescription);
        }
        upgradeDescription.textContent = "\n" + upgrade.description;

        // Update button text, style, and clickability based on upgrade.active
        var button = upgradeCell.querySelector("#button-".concat(upgrade.id));
        button.setAttribute('style', 'white-space:pre;');
        if (upgrade.maxLevel.eq(upgrade.level.plus(upgrade.nextLevelIncrement))) {
          button.textContent = "x".concat(upgrade.nextLevelIncrement, "(max)\r\n");
        } else {
          button.textContent = "x".concat(upgrade.nextLevelIncrement, "\r\n");
        }
        var nextUpgradeCost = upgrade.costNext;
        button.textContent += "-".concat(_this8.formatNumber(nextUpgradeCost), " ").concat(upgrade.costType, "\r\n");
        if (upgrade.active && upgrade.level.neq(upgrade.maxLevel) && _this8.isAffordable(upgrade) && upgrade.nextLevelIncrement.gt(0)) {
          button.disabled = false;
          button.style.opacity = 1;
        } else if (upgrade.level.eq(upgrade.maxLevel)) {
          button.disabled = true;
          button.style.opacity = 0.6;
          button.innerHTML = "max";
        } else {
          button.disabled = true;
          button.style.opacity = 0.6;
        }
      });
    }
  }, {
    key: "changeRealm",
    value: function changeRealm(realmId, realmType) {
      // Get the parent container
      var realmButtonsContainer = document.getElementById("".concat(realmType, "-realm-buttons"));

      // Get the children of the parent container
      var realmButtons = realmButtonsContainer.children;
      realmButtons = document.getElementById("".concat(realmType, "-realm-buttons")).children;

      // Remove 'active-tab' class from all realm buttons
      for (var i = 0; i < realmButtons.length; i++) {
        realmButtons[i].classList.remove('active-tab');
      }

      // Add 'active-tab' class to the clicked button
      document.getElementById(realmId).classList.add('active-tab');

      // Hide all realm contents
      var realmContents = document.getElementById("".concat(realmType)).children;
      for (var _i = 0; _i < realmContents.length; _i++) {
        if (realmContents[_i].id.includes('realm-content')) {
          realmContents[_i].style.display = 'none';
        }
      }

      // Show the content of the clicked realm
      document.getElementById("realm-content-".concat(realmId.split('-')[1])).style.display = 'flex';
    }
  }, {
    key: "populateSpiritTab",
    value: function populateSpiritTab() {
      var _this9 = this;
      var targetParent = document.getElementById('spirit');
      var realmButtonsContainer = document.getElementById('spirit-realm-buttons');
      this.gameManager.gameContent.spiritRealms.forEach(function (realm, index) {
        var realmId = "realm-".concat(realm.name);
        var realmButton = document.getElementById(realmId);
        var realmContent = document.getElementById("realm-content-".concat(realm.name));
        var col1, col2;
        if (!realmButton) {
          realmButton = document.createElement('button');
          realmButton.id = realmId;
          realmButton.textContent = realm.name;
          realmButton.className = "realm-button";
          realmButton.addEventListener('click', function () {
            return _this9.changeRealm(realmId, "spirit");
          });

          // If it's the first realm, add 'active-tab' class
          if (index === 0) {
            realmButton.classList.add('active-tab');
          }
          realmButtonsContainer.appendChild(realmButton);
        }
        if (!realmContent) {
          realmContent = document.createElement('div');
          realmContent.id = "realm-content-".concat(realm.name);
          realmContent.className = "realm-content";
          realmContent.style.display = index === 0 ? 'flex' : 'none'; // Only display the first realm by default

          col1 = document.createElement('div');
          col1.id = "spirit-col1-".concat(realm.name);
          col1.className = 'testing-content-tab-col';
          col2 = document.createElement('div');
          col2.id = "spirit-col2-".concat(realm.name);
          col2.className = 'testing-content-tab-col';
          realmContent.appendChild(col1);
          realmContent.appendChild(col2);
          targetParent.appendChild(realmContent);
        } else {
          col1 = document.getElementById("spirit-col1-".concat(realm.name));
          col2 = document.getElementById("spirit-col2-".concat(realm.name));
        }
        _this9.populateSpiritRealm(col1, col2, realm);
      });
    }
  }, {
    key: "populateAchievementsTab",
    value: function populateAchievementsTab() {
      var _this10 = this;
      var achievements = this.gameManager.gameContent.achievementsGrid.achievements;
      achievements.forEach(function (achievement) {
        var achievementID = "achievement-".concat(achievement.id);
        var achievementCell = _this10.achievementsCol1.querySelector("#".concat(achievementID));
        if (!achievementCell) {
          achievementCell = document.createElement('div');
          achievementCell.id = achievementID;
          achievementCell.classList.add('achievement-cell');
          var achievementTitle = document.createElement('div');
          achievementTitle.className = 'achievement-title';
          achievementTitle.textContent = "".concat(achievement.name);
          achievementCell.appendChild(achievementTitle);
          var _button5 = document.createElement('button');
          _button5.id = "claim-button-".concat(achievement.id);
          _button5.textContent = "Claim";
          _button5.addEventListener('click', function () {
            _this10.claimAchievement(achievement);
          });
          achievementCell.appendChild(_button5);
          var achievementDescription = document.createElement('div');
          achievementDescription.className = 'achievement-description';
          achievementDescription.textContent = "".concat(achievement.description);
          achievementCell.appendChild(achievementDescription);
          _this10.achievementsCol1.appendChild(achievementCell);
        }

        // Update button appearance based on achievement.isClaimable
        var button = document.querySelector("#claim-button-".concat(achievement.id));
        if (achievement.isClaimed) {
          button.disabled = true;
          button.setAttribute('style', 'white-space:pre; background-color:green;color:white');
          button.textContent = "Claimed";
        } else if (achievement.isClaimable) {
          button.disabled = false;
          button.style.opacity = 1;
        } else {
          button.disabled = true;
          button.style.opacity = 0.7;
        }
      });
    }
  }, {
    key: "populateSkillsTab",
    value: function populateSkillsTab() {
      var _this11 = this;
      var skills = this.gameManager.gameContent.skillTree.skills;

      // Create a container for the skill grid if it doesn't exist
      var skillGrid = this.skillsCol1.querySelector('.skill-grid');
      if (!skillGrid) {
        skillGrid = document.createElement('div');
        skillGrid.classList.add('skill-grid');
        this.skillsCol1.appendChild(skillGrid);
      }
      skills.forEach(function (skill) {
        var skillId = "skill-".concat(skill.id);

        // Create a skill node element and position it based on its connections
        var skillNode = skillGrid.querySelector("#".concat(skillId));
        if (!skillNode) {
          skillNode = document.createElement('button');
          skillNode.id = skillId;
          skillNode.classList.add('skill-node');

          // Create the level text element
          var _levelText = document.createElement('span');
          _levelText.classList.add('skill-level');
          skillNode.appendChild(_levelText);

          // Create a line element to connect the skill nodes
          var connections = skill.node.connections;
          for (var direction in connections) {
            if (connections[direction]) {
              // Check if there is a connection in this direction
              var line = document.createElement('div');
              line.classList.add('skill-line', direction);
              skillNode.appendChild(line);
            }
          }

          // Add click event to upgrade the skill
          skillNode.addEventListener('click', function () {
            _this11.buyFeature(skill.id);
          });

          // Add the tooltip div
          //const tooltip = document.createElement('div');
          //tooltip.classList.add('tooltip');
          //tooltip.textContent = `${skill.name}\nLevel: ${skill.level}/${skill.maxLevel}\nCost: ${skill.costNext}\n${skill.description}`;
          //skillNode.appendChild(tooltip);

          // Add the skill node to the skill grid
          skillGrid.appendChild(skillNode);
        }

        // Update skill node properties
        if (skill.level.eq(skill.maxLevel)) {
          skillNode.disabled = true;
          skillNode.setAttribute('style', 'color: white; background-color:green; font-weight:bold;');
        } else if (!skill.active || !skill.level.lt(skill.maxLevel) || !_this11.isAffordable(skill) || skill.costNext.eq(0)) {
          skillNode.disabled = true;
          skillNode.setAttribute('style', 'color: white; background-color:grey; font-weight:bold;');
        } else {
          skillNode.disabled = false;
          skillNode.setAttribute('style', 'opacity:1;');
          skillNode.setAttribute('style', 'color: white; font-weight:bold;background-color:darkblue;');
        }
        skillNode.style.left = "".concat(skill.node.x, "px");
        skillNode.style.top = "".concat(skill.node.y, "px");

        // Update skill node title and level text
        //const tooltip = skillNode.querySelector('.tooltip');
        //tooltip.textContent = `${skill.name}\nLevel: ${skill.level}/${skill.maxLevel}\nCost: ${skill.costNext}\n${skill.description}`;
        var levelText = skillNode.querySelector('.skill-level');
        levelText.textContent = "".concat(skill.level, "/").concat(skill.maxLevel);
        levelText.textContent = "".concat(skill.name, "\nCost: ").concat(skill.costNext, "\n").concat(skill.description);
      });
    }
  }, {
    key: "populateEssenceTab",
    value: function populateEssenceTab() {
      var _this12 = this;
      var essenceUpgrades = this.gameManager.gameContent.essenceUpgrades;
      var targetCol = this.essenceCol1;
      essenceUpgrades.forEach(function (upgrade) {
        var upgradeId = "upgrade-".concat(upgrade.id);
        var upgradeCell = targetCol.querySelector("#".concat(upgradeId));
        if (!upgradeCell) {
          upgradeCell = document.createElement('div');
          upgradeCell.id = upgradeId;
          upgradeCell.classList.add('upgrade-cell');
          var _upgradeName3 = document.createElement('div');
          _upgradeName3.className = 'upgrade-name';
          _upgradeName3.textContent = upgrade.name + " lvl " + upgrade.level + "\n" + upgrade.description;
          upgradeCell.appendChild(_upgradeName3);
          var buttonContainer = document.createElement('div');
          var _button6 = document.createElement('button');
          _button6.id = "button-".concat(upgrade.id);
          _button6.addEventListener('click', function () {
            _this12.buyFeature(upgrade.id);
          });
          buttonContainer.appendChild(_button6);
          upgradeCell.appendChild(buttonContainer);
          targetCol.appendChild(upgradeCell);
        }

        // Update upgrade level text
        var upgradeName = upgradeCell.querySelector('.upgrade-name');
        upgradeName.textContent = upgrade.name + " lvl " + upgrade.level;

        // Update upgrade description text
        var upgradeDescription = upgradeCell.querySelector('.upgrade-description');
        if (!upgradeDescription) {
          upgradeDescription = document.createElement('div');
          upgradeDescription.className = 'upgrade-description';
          upgradeDescription.setAttribute('style', 'font-size:10px; max-width: 150px;');
          upgradeCell.appendChild(upgradeDescription);
        }
        upgradeDescription.textContent = "\n" + upgrade.description;

        // Update button text, style, and clickability based on upgrade.active
        var button = upgradeCell.querySelector("#button-".concat(upgrade.id));
        button.setAttribute('style', 'white-space:pre;');
        button.textContent = "x".concat(upgrade.nextLevelIncrement, "\r\n");
        button.textContent += "-".concat(_this12.formatNumber(upgrade.costNext), " ").concat(upgrade.costType, "\r\n");
        if (upgrade.active && upgrade.level.neq(upgrade.maxLevel) && _this12.isAffordable(upgrade) && upgrade.nextLevelIncrement.gt(0)) {
          button.disabled = false;
          button.style.opacity = 1;
        } else if (upgrade.level.eq(upgrade.maxLevel)) {
          button.disabled = true;
          button.style.opacity = 0.6;
          button.innerHTML = "max";
        } else {
          button.disabled = true;
          button.style.opacity = 0.6;
        }
      });
    }
  }, {
    key: "formatNumber",
    value: function formatNumber(num) {
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
  }, {
    key: "claimAchievement",
    value: function claimAchievement(achievement) {
      achievement.claim(this.gameManager);
    }

    //dispatch to gameManager
  }, {
    key: "buyFeature",
    value: function buyFeature(id) {
      this.eventManager.dispatchEvent('handlePurchase', {
        id: id
      });
      this.eventManager.dispatchEvent('check-unlocks');
    }
  }]);
  return GameUI;
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49473" + '/');
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
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","ui.js"], null)
//# sourceMappingURL=/ui.69528adb.js.map