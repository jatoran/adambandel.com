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
})({"break_eternity.min.js":[function(require,module,exports) {
var define;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
!function (t, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).Decimal = e();
}(this, function () {
  "use strict";

  function t(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
  }
  function e(t, e) {
    for (var i = 0; i < e.length; i++) {
      var r = e[i];
      r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r);
    }
  }
  function i(t, i, r) {
    return i && e(t.prototype, i), r && e(t, r), Object.defineProperty(t, "prototype", {
      writable: !1
    }), t;
  }
  var r = function () {
      function e(i) {
        t(this, e), this.map = new Map(), this.first = void 0, this.last = void 0, this.maxSize = i;
      }
      return i(e, [{
        key: "size",
        get: function get() {
          return this.map.size;
        }
      }, {
        key: "get",
        value: function value(t) {
          var e = this.map.get(t);
          if (void 0 !== e) return e !== this.first && (e === this.last ? (this.last = e.prev, this.last.next = void 0) : (e.prev.next = e.next, e.next.prev = e.prev), e.next = this.first, this.first.prev = e, this.first = e), e.value;
        }
      }, {
        key: "set",
        value: function value(t, e) {
          if (!(this.maxSize < 1)) {
            if (this.map.has(t)) throw new Error("Cannot update existing keys in the cache");
            var i = new n(t, e);
            for (void 0 === this.first ? (this.first = i, this.last = i) : (i.next = this.first, this.first.prev = i, this.first = i), this.map.set(t, i); this.map.size > this.maxSize;) {
              var r = this.last;
              this.map.delete(r.key), this.last = r.prev, this.last.next = void 0;
            }
          }
        }
      }]), e;
    }(),
    n = i(function e(i, r) {
      t(this, e), this.next = void 0, this.prev = void 0, this.key = i, this.value = r;
    }),
    a = Math.log10(9e15),
    s = function () {
      for (var t = [], e = -323; e <= 308; e++) t.push(Number("1e" + e));
      return function (e) {
        return t[e + 323];
      };
    }(),
    u = [2, Math.E, 3, 4, 5, 6, 7, 8, 9, 10],
    h = [[1, 1.0891180521811203, 1.1789767925673957, 1.2701455431742086, 1.3632090180450092, 1.4587818160364217, 1.5575237916251419, 1.6601571006859253, 1.767485818836978, 1.8804192098842727, 2], [1, 1.1121114330934079, 1.231038924931609, 1.3583836963111375, 1.4960519303993531, 1.6463542337511945, 1.8121385357018724, 1.996971324618307, 2.2053895545527546, 2.4432574483385254, Math.E], [1, 1.1187738849693603, 1.2464963939368214, 1.38527004705667, 1.5376664685821402, 1.7068895236551784, 1.897001227148399, 2.1132403089001035, 2.362480153784171, 2.6539010333870774, 3], [1, 1.1367350847096405, 1.2889510672956703, 1.4606478703324786, 1.6570295196661111, 1.8850062585672889, 2.1539465047453485, 2.476829779693097, 2.872061932789197, 3.3664204535587183, 4], [1, 1.1494592900767588, 1.319708228183931, 1.5166291280087583, 1.748171114438024, 2.0253263297298045, 2.3636668498288547, 2.7858359149579424, 3.3257226212448145, 4.035730287722532, 5], [1, 1.159225940787673, 1.343712473580932, 1.5611293155111927, 1.8221199554561318, 2.14183924486326, 2.542468319282638, 3.0574682501653316, 3.7390572020926873, 4.6719550537360774, 6], [1, 1.1670905356972596, 1.3632807444991446, 1.5979222279405536, 1.8842640123816674, 2.2416069644878687, 2.69893426559423, 3.3012632110403577, 4.121250340630164, 5.281493033448316, 7], [1, 1.1736630594087796, 1.379783782386201, 1.6292821855668218, 1.9378971836180754, 2.3289975651071977, 2.8384347394720835, 3.5232708454565906, 4.478242031114584, 5.868592169644505, 8], [1, 1.1793017514670474, 1.394054150657457, 1.65664127441059, 1.985170999970283, 2.4069682290577457, 2.9647310119960752, 3.7278665320924946, 4.814462547283592, 6.436522247411611, 9], [1, 1.1840100246247336, 1.4061375836156955, 1.6802272208863964, 2.026757028388619, 2.4770056063449646, 3.080525271755482, 3.9191964192627284, 5.135152840833187, 6.989961179534715, 10]],
    o = [[-1, -.9194161097107025, -.8335625019330468, -.7425599821143978, -.6466611521029437, -.5462617907227869, -.4419033816638769, -.3342645487554494, -.224140440909962, -.11241087890006762, 0], [-1, -.90603157029014, -.80786507256596, -.7064666939634, -.60294836853664, -.49849837513117, -.39430303318768, -.29147201034755, -.19097820800866, -.09361896280296, 0], [-1, -.9021579584316141, -.8005762598234203, -.6964780623319391, -.5911906810998454, -.486050182576545, -.3823089430815083, -.28106046722897615, -.1831906535795894, -.08935809204418144, 0], [-1, -.8917227442365535, -.781258746326964, -.6705130326902455, -.5612813129406509, -.4551067709033134, -.35319256652135966, -.2563741554088552, -.1651412821106526, -.0796919581982668, 0], [-1, -.8843387974366064, -.7678744063886243, -.6529563724510552, -.5415870994657841, -.4352842206588936, -.33504449124791424, -.24138853420685147, -.15445285440944467, -.07409659641336663, 0], [-1, -.8786709358426346, -.7577735191184886, -.6399546189952064, -.527284921869926, -.4211627631006314, -.3223479611761232, -.23107655627789858, -.1472057700818259, -.07035171210706326, 0], [-1, -.8740862815291583, -.7497032990976209, -.6297119746181752, -.5161838335958787, -.41036238255751956, -.31277212146489963, -.2233976621705518, -.1418697367979619, -.06762117662323441, 0], [-1, -.8702632331800649, -.7430366914122081, -.6213373075161548, -.5072025698095242, -.40171437727184167, -.30517930701410456, -.21736343968190863, -.137710238299109, -.06550774483471955, 0], [-1, -.8670016295947213, -.7373984232432306, -.6143173985094293, -.49973884395492807, -.394584953527678, -.2989649949848695, -.21245647317021688, -.13434688362382652, -.0638072667348083, 0], [-1, -.8641642839543857, -.732534623168535, -.6083127477059322, -.4934049257184696, -.3885773075899922, -.29376029055315767, -.2083678561173622, -.13155653399373268, -.062401588652553186, 0]],
    l = function l(t) {
      return k.fromValue_noAlloc(t);
    },
    m = function m(t, e, i) {
      return k.fromComponents(t, e, i);
    },
    g = function g(t, e, i) {
      return k.fromComponents_noNormalize(t, e, i);
    },
    f = function f(t, e) {
      var i = e + 1,
        r = Math.ceil(Math.log10(Math.abs(t))),
        n = Math.round(t * Math.pow(10, i - r)) * Math.pow(10, r - i);
      return parseFloat(n.toFixed(Math.max(i - r, 0)));
    },
    c = function c(t) {
      return Math.sign(t) * Math.log10(Math.abs(t));
    },
    y = .5671432904097838,
    v = function v(t) {
      var e,
        i,
        r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1e-10;
      if (!Number.isFinite(t)) return t;
      if (0 === t) return t;
      if (1 === t) return y;
      e = t < 10 ? 0 : Math.log(t) - Math.log(Math.log(t));
      for (var n = 0; n < 100; ++n) {
        if (i = (t * Math.exp(-e) + e * e) / (e + 1), Math.abs(i - e) < r * Math.abs(i)) return i;
        e = i;
      }
      throw Error("Iteration failed to converge: ".concat(t.toString()));
    };
  function d(t) {
    var e,
      i,
      r,
      n,
      a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1e-10;
    if (!Number.isFinite(t.mag)) return t;
    if (t.eq(k.dZero)) return t;
    if (t.eq(k.dOne)) return k.fromNumber(y);
    e = k.ln(t);
    for (var s = 0; s < 100; ++s) {
      if (i = e.neg().exp(), r = e.sub(t.mul(i)), n = e.sub(r.div(e.add(1).sub(e.add(2).mul(r).div(k.mul(2, e).add(2))))), k.abs(n.sub(e)).lt(k.abs(n).mul(a))) return n;
      e = n;
    }
    throw Error("Iteration failed to converge: ".concat(t.toString()));
  }
  var k = function () {
    function e(i) {
      t(this, e), this.sign = 0, this.mag = 0, this.layer = 0, i instanceof e ? this.fromDecimal(i) : "number" == typeof i ? this.fromNumber(i) : "string" == typeof i && this.fromString(i);
    }
    return i(e, [{
      key: "m",
      get: function get() {
        if (0 === this.sign) return 0;
        if (0 === this.layer) {
          var t,
            e = Math.floor(Math.log10(this.mag));
          return t = 5e-324 === this.mag ? 5 : this.mag / s(e), this.sign * t;
        }
        if (1 === this.layer) {
          var i = this.mag - Math.floor(this.mag);
          return this.sign * Math.pow(10, i);
        }
        return this.sign;
      },
      set: function set(t) {
        this.layer <= 2 ? this.fromMantissaExponent(t, this.e) : (this.sign = Math.sign(t), 0 === this.sign && (this.layer = 0, this.exponent = 0));
      }
    }, {
      key: "e",
      get: function get() {
        return 0 === this.sign ? 0 : 0 === this.layer ? Math.floor(Math.log10(this.mag)) : 1 === this.layer ? Math.floor(this.mag) : 2 === this.layer ? Math.floor(Math.sign(this.mag) * Math.pow(10, Math.abs(this.mag))) : this.mag * Number.POSITIVE_INFINITY;
      },
      set: function set(t) {
        this.fromMantissaExponent(this.m, t);
      }
    }, {
      key: "s",
      get: function get() {
        return this.sign;
      },
      set: function set(t) {
        0 === t ? (this.sign = 0, this.layer = 0, this.mag = 0) : this.sign = t;
      }
    }, {
      key: "mantissa",
      get: function get() {
        return this.m;
      },
      set: function set(t) {
        this.m = t;
      }
    }, {
      key: "exponent",
      get: function get() {
        return this.e;
      },
      set: function set(t) {
        this.e = t;
      }
    }, {
      key: "normalize",
      value: function value() {
        if (0 === this.sign || 0 === this.mag && 0 === this.layer) return this.sign = 0, this.mag = 0, this.layer = 0, this;
        if (0 === this.layer && this.mag < 0 && (this.mag = -this.mag, this.sign = -this.sign), 0 === this.layer && this.mag < 1 / 9e15) return this.layer += 1, this.mag = Math.log10(this.mag), this;
        var t = Math.abs(this.mag),
          e = Math.sign(this.mag);
        if (t >= 9e15) return this.layer += 1, this.mag = e * Math.log10(t), this;
        for (; t < a && this.layer > 0;) this.layer -= 1, 0 === this.layer ? this.mag = Math.pow(10, this.mag) : (this.mag = e * Math.pow(10, t), t = Math.abs(this.mag), e = Math.sign(this.mag));
        return 0 === this.layer && (this.mag < 0 ? (this.mag = -this.mag, this.sign = -this.sign) : 0 === this.mag && (this.sign = 0)), this;
      }
    }, {
      key: "fromComponents",
      value: function value(t, e, i) {
        return this.sign = t, this.layer = e, this.mag = i, this.normalize(), this;
      }
    }, {
      key: "fromComponents_noNormalize",
      value: function value(t, e, i) {
        return this.sign = t, this.layer = e, this.mag = i, this;
      }
    }, {
      key: "fromMantissaExponent",
      value: function value(t, e) {
        return this.layer = 1, this.sign = Math.sign(t), t = Math.abs(t), this.mag = e + Math.log10(t), this.normalize(), this;
      }
    }, {
      key: "fromMantissaExponent_noNormalize",
      value: function value(t, e) {
        return this.fromMantissaExponent(t, e), this;
      }
    }, {
      key: "fromDecimal",
      value: function value(t) {
        return this.sign = t.sign, this.layer = t.layer, this.mag = t.mag, this;
      }
    }, {
      key: "fromNumber",
      value: function value(t) {
        return this.mag = Math.abs(t), this.sign = Math.sign(t), this.layer = 0, this.normalize(), this;
      }
    }, {
      key: "fromString",
      value: function value(t) {
        var i = t,
          r = e.fromStringCache.get(i);
        if (void 0 !== r) return this.fromDecimal(r);
        var n = (t = t.replace(",", "")).split("^^^");
        if (2 === n.length) {
          var a = parseFloat(n[0]),
            s = parseFloat(n[1]),
            u = n[1].split(";"),
            h = 1;
          if (2 === u.length && (h = parseFloat(u[1]), isFinite(h) || (h = 1)), isFinite(a) && isFinite(s)) {
            var o = e.pentate(a, s, h);
            return this.sign = o.sign, this.layer = o.layer, this.mag = o.mag, e.fromStringCache.maxSize >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
          }
        }
        var g = t.split("^^");
        if (2 === g.length) {
          var f = parseFloat(g[0]),
            y = parseFloat(g[1]),
            v = g[1].split(";"),
            d = 1;
          if (2 === v.length && (d = parseFloat(v[1]), isFinite(d) || (d = 1)), isFinite(f) && isFinite(y)) {
            var k = e.tetrate(f, y, d);
            return this.sign = k.sign, this.layer = k.layer, this.mag = k.mag, e.fromStringCache.maxSize >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
          }
        }
        var p,
          N,
          b = t.split("^");
        if (2 === b.length) {
          var M = parseFloat(b[0]),
            _ = parseFloat(b[1]);
          if (isFinite(M) && isFinite(_)) {
            var x = e.pow(M, _);
            return this.sign = x.sign, this.layer = x.layer, this.mag = x.mag, e.fromStringCache.maxSize >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
          }
        }
        var F = (t = t.trim().toLowerCase()).split("pt");
        if (2 === F.length) {
          p = 10, N = parseFloat(F[0]), F[1] = F[1].replace("(", ""), F[1] = F[1].replace(")", "");
          var S = parseFloat(F[1]);
          if (isFinite(S) || (S = 1), isFinite(p) && isFinite(N)) {
            var w = e.tetrate(p, N, S);
            return this.sign = w.sign, this.layer = w.layer, this.mag = w.mag, e.fromStringCache.maxSize >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
          }
        }
        if (2 === (F = t.split("p")).length) {
          p = 10, N = parseFloat(F[0]), F[1] = F[1].replace("(", ""), F[1] = F[1].replace(")", "");
          var q = parseFloat(F[1]);
          if (isFinite(q) || (q = 1), isFinite(p) && isFinite(N)) {
            var I = e.tetrate(p, N, q);
            return this.sign = I.sign, this.layer = I.layer, this.mag = I.mag, e.fromStringCache.maxSize >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
          }
        }
        var E = t.split("e"),
          C = E.length - 1;
        if (0 === C) {
          var z = parseFloat(t);
          if (isFinite(z)) return this.fromNumber(z), e.fromStringCache.size >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
        } else if (1 === C) {
          var T = parseFloat(t);
          if (isFinite(T) && 0 !== T) return this.fromNumber(T), e.fromStringCache.maxSize >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
        }
        var O = t.split("e^");
        if (2 === O.length) {
          this.sign = 1, "-" == O[0].charAt(0) && (this.sign = -1);
          for (var D = "", V = 0; V < O[1].length; ++V) {
            var A = O[1].charCodeAt(V);
            if (!(A >= 43 && A <= 57 || 101 === A)) return this.layer = parseFloat(D), this.mag = parseFloat(O[1].substr(V + 1)), this.normalize(), e.fromStringCache.maxSize >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
            D += O[1].charAt(V);
          }
        }
        if (C < 1) return this.sign = 0, this.layer = 0, this.mag = 0, e.fromStringCache.maxSize >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
        var P = parseFloat(E[0]);
        if (0 === P) return this.sign = 0, this.layer = 0, this.mag = 0, e.fromStringCache.maxSize >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
        var Z = parseFloat(E[E.length - 1]);
        if (C >= 2) {
          var Y = parseFloat(E[E.length - 2]);
          isFinite(Y) && (Z *= Math.sign(Y), Z += c(Y));
        }
        if (isFinite(P)) {
          if (1 === C) this.sign = Math.sign(P), this.layer = 1, this.mag = Z + Math.log10(Math.abs(P));else {
            if (this.sign = Math.sign(P), this.layer = C, 2 === C) {
              var G = e.mul(m(1, 2, Z), l(P));
              return this.sign = G.sign, this.layer = G.layer, this.mag = G.mag, e.fromStringCache.maxSize >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
            }
            this.mag = Z;
          }
        } else this.sign = "-" === E[0] ? -1 : 1, this.layer = C, this.mag = Z;
        return this.normalize(), e.fromStringCache.maxSize >= 1 && e.fromStringCache.set(i, e.fromDecimal(this)), this;
      }
    }, {
      key: "fromValue",
      value: function value(t) {
        return t instanceof e ? this.fromDecimal(t) : "number" == typeof t ? this.fromNumber(t) : "string" == typeof t ? this.fromString(t) : (this.sign = 0, this.layer = 0, this.mag = 0, this);
      }
    }, {
      key: "toNumber",
      value: function value() {
        return Number.isFinite(this.layer) ? 0 === this.layer ? this.sign * this.mag : 1 === this.layer ? this.sign * Math.pow(10, this.mag) : this.mag > 0 ? this.sign > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : 0 : Number.NaN;
      }
    }, {
      key: "mantissaWithDecimalPlaces",
      value: function value(t) {
        return isNaN(this.m) ? Number.NaN : 0 === this.m ? 0 : f(this.m, t);
      }
    }, {
      key: "magnitudeWithDecimalPlaces",
      value: function value(t) {
        return isNaN(this.mag) ? Number.NaN : 0 === this.mag ? 0 : f(this.mag, t);
      }
    }, {
      key: "toString",
      value: function value() {
        return isNaN(this.layer) || isNaN(this.sign) || isNaN(this.mag) ? "NaN" : this.mag === Number.POSITIVE_INFINITY || this.layer === Number.POSITIVE_INFINITY ? 1 === this.sign ? "Infinity" : "-Infinity" : 0 === this.layer ? this.mag < 1e21 && this.mag > 1e-7 || 0 === this.mag ? (this.sign * this.mag).toString() : this.m + "e" + this.e : 1 === this.layer ? this.m + "e" + this.e : this.layer <= 5 ? (-1 === this.sign ? "-" : "") + "e".repeat(this.layer) + this.mag : (-1 === this.sign ? "-" : "") + "(e^" + this.layer + ")" + this.mag;
      }
    }, {
      key: "toExponential",
      value: function value(t) {
        return 0 === this.layer ? (this.sign * this.mag).toExponential(t) : this.toStringWithDecimalPlaces(t);
      }
    }, {
      key: "toFixed",
      value: function value(t) {
        return 0 === this.layer ? (this.sign * this.mag).toFixed(t) : this.toStringWithDecimalPlaces(t);
      }
    }, {
      key: "toPrecision",
      value: function value(t) {
        return this.e <= -7 ? this.toExponential(t - 1) : t > this.e ? this.toFixed(t - this.exponent - 1) : this.toExponential(t - 1);
      }
    }, {
      key: "valueOf",
      value: function value() {
        return this.toString();
      }
    }, {
      key: "toJSON",
      value: function value() {
        return this.toString();
      }
    }, {
      key: "toStringWithDecimalPlaces",
      value: function value(t) {
        return 0 === this.layer ? this.mag < 1e21 && this.mag > 1e-7 || 0 === this.mag ? (this.sign * this.mag).toFixed(t) : f(this.m, t) + "e" + f(this.e, t) : 1 === this.layer ? f(this.m, t) + "e" + f(this.e, t) : this.layer <= 5 ? (-1 === this.sign ? "-" : "") + "e".repeat(this.layer) + f(this.mag, t) : (-1 === this.sign ? "-" : "") + "(e^" + this.layer + ")" + f(this.mag, t);
      }
    }, {
      key: "abs",
      value: function value() {
        return g(0 === this.sign ? 0 : 1, this.layer, this.mag);
      }
    }, {
      key: "neg",
      value: function value() {
        return g(-this.sign, this.layer, this.mag);
      }
    }, {
      key: "negate",
      value: function value() {
        return this.neg();
      }
    }, {
      key: "negated",
      value: function value() {
        return this.neg();
      }
    }, {
      key: "sgn",
      value: function value() {
        return this.sign;
      }
    }, {
      key: "round",
      value: function value() {
        return this.mag < 0 ? e.dZero : 0 === this.layer ? m(this.sign, 0, Math.round(this.mag)) : this;
      }
    }, {
      key: "floor",
      value: function value() {
        return this.mag < 0 ? e.dZero : 0 === this.layer ? m(this.sign, 0, Math.floor(this.mag)) : this;
      }
    }, {
      key: "ceil",
      value: function value() {
        return this.mag < 0 ? e.dZero : 0 === this.layer ? m(this.sign, 0, Math.ceil(this.mag)) : this;
      }
    }, {
      key: "trunc",
      value: function value() {
        return this.mag < 0 ? e.dZero : 0 === this.layer ? m(this.sign, 0, Math.trunc(this.mag)) : this;
      }
    }, {
      key: "add",
      value: function value(t) {
        var i,
          r,
          n = l(t);
        if (!Number.isFinite(this.layer)) return this;
        if (!Number.isFinite(n.layer)) return n;
        if (0 === this.sign) return n;
        if (0 === n.sign) return this;
        if (this.sign === -n.sign && this.layer === n.layer && this.mag === n.mag) return g(0, 0, 0);
        if (this.layer >= 2 || n.layer >= 2) return this.maxabs(n);
        if (e.cmpabs(this, n) > 0 ? (i = this, r = n) : (i = n, r = this), 0 === i.layer && 0 === r.layer) return e.fromNumber(i.sign * i.mag + r.sign * r.mag);
        var a = i.layer * Math.sign(i.mag),
          s = r.layer * Math.sign(r.mag);
        if (a - s >= 2) return i;
        if (0 === a && -1 === s) {
          if (Math.abs(r.mag - Math.log10(i.mag)) > 17) return i;
          var u = Math.pow(10, Math.log10(i.mag) - r.mag),
            h = r.sign + i.sign * u;
          return m(Math.sign(h), 1, r.mag + Math.log10(Math.abs(h)));
        }
        if (1 === a && 0 === s) {
          if (Math.abs(i.mag - Math.log10(r.mag)) > 17) return i;
          var o = Math.pow(10, i.mag - Math.log10(r.mag)),
            f = r.sign + i.sign * o;
          return m(Math.sign(f), 1, Math.log10(r.mag) + Math.log10(Math.abs(f)));
        }
        if (Math.abs(i.mag - r.mag) > 17) return i;
        var c = Math.pow(10, i.mag - r.mag),
          y = r.sign + i.sign * c;
        return m(Math.sign(y), 1, r.mag + Math.log10(Math.abs(y)));
      }
    }, {
      key: "plus",
      value: function value(t) {
        return this.add(t);
      }
    }, {
      key: "sub",
      value: function value(t) {
        return this.add(l(t).neg());
      }
    }, {
      key: "subtract",
      value: function value(t) {
        return this.sub(t);
      }
    }, {
      key: "minus",
      value: function value(t) {
        return this.sub(t);
      }
    }, {
      key: "mul",
      value: function value(t) {
        var i,
          r,
          n = l(t);
        if (!Number.isFinite(this.layer)) return this;
        if (!Number.isFinite(n.layer)) return n;
        if (0 === this.sign || 0 === n.sign) return g(0, 0, 0);
        if (this.layer === n.layer && this.mag === -n.mag) return g(this.sign * n.sign, 0, 1);
        if (this.layer > n.layer || this.layer == n.layer && Math.abs(this.mag) > Math.abs(n.mag) ? (i = this, r = n) : (i = n, r = this), 0 === i.layer && 0 === r.layer) return e.fromNumber(i.sign * r.sign * i.mag * r.mag);
        if (i.layer >= 3 || i.layer - r.layer >= 2) return m(i.sign * r.sign, i.layer, i.mag);
        if (1 === i.layer && 0 === r.layer) return m(i.sign * r.sign, 1, i.mag + Math.log10(r.mag));
        if (1 === i.layer && 1 === r.layer) return m(i.sign * r.sign, 1, i.mag + r.mag);
        if (2 === i.layer && 1 === r.layer) {
          var a = m(Math.sign(i.mag), i.layer - 1, Math.abs(i.mag)).add(m(Math.sign(r.mag), r.layer - 1, Math.abs(r.mag)));
          return m(i.sign * r.sign, a.layer + 1, a.sign * a.mag);
        }
        if (2 === i.layer && 2 === r.layer) {
          var s = m(Math.sign(i.mag), i.layer - 1, Math.abs(i.mag)).add(m(Math.sign(r.mag), r.layer - 1, Math.abs(r.mag)));
          return m(i.sign * r.sign, s.layer + 1, s.sign * s.mag);
        }
        throw Error("Bad arguments to mul: " + this + ", " + t);
      }
    }, {
      key: "multiply",
      value: function value(t) {
        return this.mul(t);
      }
    }, {
      key: "times",
      value: function value(t) {
        return this.mul(t);
      }
    }, {
      key: "div",
      value: function value(t) {
        var e = l(t);
        return this.mul(e.recip());
      }
    }, {
      key: "divide",
      value: function value(t) {
        return this.div(t);
      }
    }, {
      key: "divideBy",
      value: function value(t) {
        return this.div(t);
      }
    }, {
      key: "dividedBy",
      value: function value(t) {
        return this.div(t);
      }
    }, {
      key: "recip",
      value: function value() {
        return 0 === this.mag ? e.dNaN : 0 === this.layer ? m(this.sign, 0, 1 / this.mag) : m(this.sign, this.layer, -this.mag);
      }
    }, {
      key: "reciprocal",
      value: function value() {
        return this.recip();
      }
    }, {
      key: "reciprocate",
      value: function value() {
        return this.recip();
      }
    }, {
      key: "cmp",
      value: function value(t) {
        var e = l(t);
        return this.sign > e.sign ? 1 : this.sign < e.sign ? -1 : this.sign * this.cmpabs(t);
      }
    }, {
      key: "cmpabs",
      value: function value(t) {
        var e = l(t),
          i = this.mag > 0 ? this.layer : -this.layer,
          r = e.mag > 0 ? e.layer : -e.layer;
        return i > r ? 1 : i < r ? -1 : this.mag > e.mag ? 1 : this.mag < e.mag ? -1 : 0;
      }
    }, {
      key: "compare",
      value: function value(t) {
        return this.cmp(t);
      }
    }, {
      key: "isNan",
      value: function value() {
        return isNaN(this.sign) || isNaN(this.layer) || isNaN(this.mag);
      }
    }, {
      key: "isFinite",
      value: function (t) {
        function e() {
          return t.apply(this, arguments);
        }
        return e.toString = function () {
          return t.toString();
        }, e;
      }(function () {
        return isFinite(this.sign) && isFinite(this.layer) && isFinite(this.mag);
      })
    }, {
      key: "eq",
      value: function value(t) {
        var e = l(t);
        return this.sign === e.sign && this.layer === e.layer && this.mag === e.mag;
      }
    }, {
      key: "equals",
      value: function value(t) {
        return this.eq(t);
      }
    }, {
      key: "neq",
      value: function value(t) {
        return !this.eq(t);
      }
    }, {
      key: "notEquals",
      value: function value(t) {
        return this.neq(t);
      }
    }, {
      key: "lt",
      value: function value(t) {
        return -1 === this.cmp(t);
      }
    }, {
      key: "lte",
      value: function value(t) {
        return !this.gt(t);
      }
    }, {
      key: "gt",
      value: function value(t) {
        return 1 === this.cmp(t);
      }
    }, {
      key: "gte",
      value: function value(t) {
        return !this.lt(t);
      }
    }, {
      key: "max",
      value: function value(t) {
        var e = l(t);
        return this.lt(e) ? e : this;
      }
    }, {
      key: "min",
      value: function value(t) {
        var e = l(t);
        return this.gt(e) ? e : this;
      }
    }, {
      key: "maxabs",
      value: function value(t) {
        var e = l(t);
        return this.cmpabs(e) < 0 ? e : this;
      }
    }, {
      key: "minabs",
      value: function value(t) {
        var e = l(t);
        return this.cmpabs(e) > 0 ? e : this;
      }
    }, {
      key: "clamp",
      value: function value(t, e) {
        return this.max(t).min(e);
      }
    }, {
      key: "clampMin",
      value: function value(t) {
        return this.max(t);
      }
    }, {
      key: "clampMax",
      value: function value(t) {
        return this.min(t);
      }
    }, {
      key: "cmp_tolerance",
      value: function value(t, e) {
        var i = l(t);
        return this.eq_tolerance(i, e) ? 0 : this.cmp(i);
      }
    }, {
      key: "compare_tolerance",
      value: function value(t, e) {
        return this.cmp_tolerance(t, e);
      }
    }, {
      key: "eq_tolerance",
      value: function value(t, e) {
        var i = l(t);
        if (null == e && (e = 1e-7), this.sign !== i.sign) return !1;
        if (Math.abs(this.layer - i.layer) > 1) return !1;
        var r = this.mag,
          n = i.mag;
        return this.layer > i.layer && (n = c(n)), this.layer < i.layer && (r = c(r)), Math.abs(r - n) <= e * Math.max(Math.abs(r), Math.abs(n));
      }
    }, {
      key: "equals_tolerance",
      value: function value(t, e) {
        return this.eq_tolerance(t, e);
      }
    }, {
      key: "neq_tolerance",
      value: function value(t, e) {
        return !this.eq_tolerance(t, e);
      }
    }, {
      key: "notEquals_tolerance",
      value: function value(t, e) {
        return this.neq_tolerance(t, e);
      }
    }, {
      key: "lt_tolerance",
      value: function value(t, e) {
        var i = l(t);
        return !this.eq_tolerance(i, e) && this.lt(i);
      }
    }, {
      key: "lte_tolerance",
      value: function value(t, e) {
        var i = l(t);
        return this.eq_tolerance(i, e) || this.lt(i);
      }
    }, {
      key: "gt_tolerance",
      value: function value(t, e) {
        var i = l(t);
        return !this.eq_tolerance(i, e) && this.gt(i);
      }
    }, {
      key: "gte_tolerance",
      value: function value(t, e) {
        var i = l(t);
        return this.eq_tolerance(i, e) || this.gt(i);
      }
    }, {
      key: "pLog10",
      value: function value() {
        return this.lt(e.dZero) ? e.dZero : this.log10();
      }
    }, {
      key: "absLog10",
      value: function value() {
        return 0 === this.sign ? e.dNaN : this.layer > 0 ? m(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag)) : m(1, 0, Math.log10(this.mag));
      }
    }, {
      key: "log10",
      value: function value() {
        return this.sign <= 0 ? e.dNaN : this.layer > 0 ? m(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag)) : m(this.sign, 0, Math.log10(this.mag));
      }
    }, {
      key: "log",
      value: function value(t) {
        return t = l(t), this.sign <= 0 || t.sign <= 0 || 1 === t.sign && 0 === t.layer && 1 === t.mag ? e.dNaN : 0 === this.layer && 0 === t.layer ? m(this.sign, 0, Math.log(this.mag) / Math.log(t.mag)) : e.div(this.log10(), t.log10());
      }
    }, {
      key: "log2",
      value: function value() {
        return this.sign <= 0 ? e.dNaN : 0 === this.layer ? m(this.sign, 0, Math.log2(this.mag)) : 1 === this.layer ? m(Math.sign(this.mag), 0, 3.321928094887362 * Math.abs(this.mag)) : 2 === this.layer ? m(Math.sign(this.mag), 1, Math.abs(this.mag) + .5213902276543247) : m(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
      }
    }, {
      key: "ln",
      value: function value() {
        return this.sign <= 0 ? e.dNaN : 0 === this.layer ? m(this.sign, 0, Math.log(this.mag)) : 1 === this.layer ? m(Math.sign(this.mag), 0, 2.302585092994046 * Math.abs(this.mag)) : 2 === this.layer ? m(Math.sign(this.mag), 1, Math.abs(this.mag) + .36221568869946325) : m(Math.sign(this.mag), this.layer - 1, Math.abs(this.mag));
      }
    }, {
      key: "logarithm",
      value: function value(t) {
        return this.log(t);
      }
    }, {
      key: "pow",
      value: function value(t) {
        var i = this,
          r = l(t);
        if (0 === i.sign) return r.eq(0) ? g(1, 0, 1) : i;
        if (1 === i.sign && 0 === i.layer && 1 === i.mag) return i;
        if (0 === r.sign) return g(1, 0, 1);
        if (1 === r.sign && 0 === r.layer && 1 === r.mag) return i;
        var n = i.absLog10().mul(r).pow10();
        return -1 === this.sign ? Math.abs(r.toNumber() % 2) % 2 == 1 ? n.neg() : Math.abs(r.toNumber() % 2) % 2 == 0 ? n : e.dNaN : n;
      }
    }, {
      key: "pow10",
      value: function value() {
        if (!Number.isFinite(this.layer) || !Number.isFinite(this.mag)) return e.dNaN;
        var t = this;
        if (0 === t.layer) {
          var i = Math.pow(10, t.sign * t.mag);
          if (Number.isFinite(i) && Math.abs(i) >= .1) return m(1, 0, i);
          if (0 === t.sign) return e.dOne;
          t = g(t.sign, t.layer + 1, Math.log10(t.mag));
        }
        return t.sign > 0 && t.mag >= 0 ? m(t.sign, t.layer + 1, t.mag) : t.sign < 0 && t.mag >= 0 ? m(-t.sign, t.layer + 1, -t.mag) : e.dOne;
      }
    }, {
      key: "pow_base",
      value: function value(t) {
        return l(t).pow(this);
      }
    }, {
      key: "root",
      value: function value(t) {
        var e = l(t);
        return this.pow(e.recip());
      }
    }, {
      key: "factorial",
      value: function value() {
        return this.mag < 0 || 0 === this.layer ? this.add(1).gamma() : 1 === this.layer ? e.exp(e.mul(this, e.ln(this).sub(1))) : e.exp(this);
      }
    }, {
      key: "gamma",
      value: function value() {
        if (this.mag < 0) return this.recip();
        if (0 === this.layer) {
          if (this.lt(g(1, 0, 24))) return e.fromNumber(function (t) {
            if (!isFinite(t)) return t;
            if (t < -50) return t === Math.trunc(t) ? Number.NEGATIVE_INFINITY : 0;
            for (var e = 1; t < 10;) e *= t, ++t;
            var i = .9189385332046727;
            i += ((t -= 1) + .5) * Math.log(t), i -= t;
            var r = t * t,
              n = t;
            return i += 1 / (12 * n), i += 1 / (360 * (n *= r)), i += 1 / (1260 * (n *= r)), i += 1 / (1680 * (n *= r)), i += 1 / (1188 * (n *= r)), i += 691 / (360360 * (n *= r)), i += 7 / (1092 * (n *= r)), i += 3617 / (122400 * (n *= r)), Math.exp(i) / e;
          }(this.sign * this.mag));
          var t = this.mag - 1,
            i = .9189385332046727;
          i += (t + .5) * Math.log(t);
          var r = t * t,
            n = t,
            a = 12 * n,
            s = 1 / a,
            u = (i -= t) + s;
          if (u === i) return e.exp(i);
          if ((u = (i = u) - (s = 1 / (a = 360 * (n *= r)))) === i) return e.exp(i);
          i = u;
          var h = 1 / (a = 1260 * (n *= r));
          return i += h, i -= h = 1 / (a = 1680 * (n *= r)), e.exp(i);
        }
        return 1 === this.layer ? e.exp(e.mul(this, e.ln(this).sub(1))) : e.exp(this);
      }
    }, {
      key: "lngamma",
      value: function value() {
        return this.gamma().ln();
      }
    }, {
      key: "exp",
      value: function value() {
        return this.mag < 0 ? e.dOne : 0 === this.layer && this.mag <= 709.7 ? e.fromNumber(Math.exp(this.sign * this.mag)) : 0 === this.layer ? m(1, 1, this.sign * Math.log10(Math.E) * this.mag) : 1 === this.layer ? m(1, 2, this.sign * (Math.log10(.4342944819032518) + this.mag)) : m(1, this.layer + 1, this.sign * this.mag);
      }
    }, {
      key: "sqr",
      value: function value() {
        return this.pow(2);
      }
    }, {
      key: "sqrt",
      value: function value() {
        if (0 === this.layer) return e.fromNumber(Math.sqrt(this.sign * this.mag));
        if (1 === this.layer) return m(1, 2, Math.log10(this.mag) - .3010299956639812);
        var t = e.div(g(this.sign, this.layer - 1, this.mag), g(1, 0, 2));
        return t.layer += 1, t.normalize(), t;
      }
    }, {
      key: "cube",
      value: function value() {
        return this.pow(3);
      }
    }, {
      key: "cbrt",
      value: function value() {
        return this.pow(1 / 3);
      }
    }, {
      key: "tetrate",
      value: function value() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 2,
          i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : g(1, 0, 1);
        if (1 === t) return e.pow(this, i);
        if (0 === t) return new e(i);
        if (this.eq(e.dOne)) return e.dOne;
        if (this.eq(-1)) return e.pow(this, i);
        if (t === Number.POSITIVE_INFINITY) {
          var r = this.toNumber();
          if (r <= 1.444667861009766 && r >= .06598803584531254) {
            if (r > 1.444667861009099) return e.fromNumber(Math.E);
            var n = e.ln(this).neg();
            return n.lambertw().div(n);
          }
          return r > 1.444667861009766 ? e.fromNumber(Number.POSITIVE_INFINITY) : e.dNaN;
        }
        if (this.eq(e.dZero)) {
          var a = Math.abs((t + 1) % 2);
          return a > 1 && (a = 2 - a), e.fromNumber(a);
        }
        if (t < 0) return e.iteratedlog(i, this, -t);
        i = l(i);
        var s = t,
          u = s - (t = Math.trunc(t));
        if (this.gt(e.dZero) && this.lte(1.444667861009766)) {
          t = Math.min(1e4, t);
          for (var h = 0; h < t; ++h) {
            var o = i;
            if (i = this.pow(i), o.eq(i)) return i;
          }
          if (0 != u) {
            var m = this.pow(i);
            return i.mul(1 - u).add(m.mul(u));
          }
          return i;
        }
        0 !== u && (i.eq(e.dOne) ? this.gt(10) ? i = this.pow(u) : (i = e.fromNumber(e.tetrate_critical(this.toNumber(), u)), this.lt(2) && (i = i.sub(1).mul(this.minus(1)).plus(1))) : i = this.eq(10) ? i.layeradd10(u) : i.layeradd(u, this));
        for (var f = 0; f < t; ++f) {
          if (i = this.pow(i), !isFinite(i.layer) || !isFinite(i.mag)) return i.normalize();
          if (i.layer - this.layer > 3) return g(i.sign, i.layer + (t - f - 1), i.mag);
          if (f > 1e4) return i;
        }
        return i;
      }
    }, {
      key: "iteratedexp",
      value: function value() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 2,
          e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : g(1, 0, 1);
        return this.tetrate(t, e);
      }
    }, {
      key: "iteratedlog",
      value: function value() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 10,
          i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
        if (i < 0) return e.tetrate(t, -i, this);
        t = l(t);
        var r = e.fromDecimal(this),
          n = i,
          a = n - (i = Math.trunc(i));
        if (r.layer - t.layer > 3) {
          var s = Math.min(i, r.layer - t.layer - 3);
          i -= s, r.layer -= s;
        }
        for (var u = 0; u < i; ++u) {
          if (r = r.log(t), !isFinite(r.layer) || !isFinite(r.mag)) return r.normalize();
          if (u > 1e4) return r;
        }
        return a > 0 && a < 1 && (r = t.eq(10) ? r.layeradd10(-a) : r.layeradd(-a, t)), r;
      }
    }, {
      key: "slog",
      value: function value() {
        for (var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 10, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 100, r = .001, n = !1, a = !1, s = this.slog_internal(t).toNumber(), u = 1; u < i; ++u) {
          var h = new e(t).tetrate(s),
            o = h.gt(this);
          if (u > 1 && a != o && (n = !0), a = o, n ? r /= 2 : r *= 2, s += r = Math.abs(r) * (o ? -1 : 1), 0 === r) break;
        }
        return e.fromNumber(s);
      }
    }, {
      key: "slog_internal",
      value: function value() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 10;
        if ((t = l(t)).lte(e.dZero)) return e.dNaN;
        if (t.eq(e.dOne)) return e.dNaN;
        if (t.lt(e.dOne)) return this.eq(e.dOne) ? e.dZero : this.eq(e.dZero) ? e.dNegOne : e.dNaN;
        if (this.mag < 0 || this.eq(e.dZero)) return e.dNegOne;
        var i = 0,
          r = e.fromDecimal(this);
        if (r.layer - t.layer > 3) {
          var n = r.layer - t.layer - 3;
          i += n, r.layer -= n;
        }
        for (var a = 0; a < 100; ++a) if (r.lt(e.dZero)) r = e.pow(t, r), i -= 1;else {
          if (r.lte(e.dOne)) return e.fromNumber(i + e.slog_critical(t.toNumber(), r.toNumber()));
          i += 1, r = e.log(r, t);
        }
        return e.fromNumber(i);
      }
    }, {
      key: "layeradd10",
      value: function value(t) {
        t = e.fromValue_noAlloc(t).toNumber();
        var i = e.fromDecimal(this);
        if (t >= 1) {
          i.mag < 0 && i.layer > 0 ? (i.sign = 0, i.mag = 0, i.layer = 0) : -1 === i.sign && 0 == i.layer && (i.sign = 1, i.mag = -i.mag);
          var r = Math.trunc(t);
          t -= r, i.layer += r;
        }
        if (t <= -1) {
          var n = Math.trunc(t);
          if (t -= n, i.layer += n, i.layer < 0) for (var a = 0; a < 100; ++a) {
            if (i.layer++, i.mag = Math.log10(i.mag), !isFinite(i.mag)) return 0 === i.sign && (i.sign = 1), i.layer < 0 && (i.layer = 0), i.normalize();
            if (i.layer >= 0) break;
          }
        }
        for (; i.layer < 0;) i.layer++, i.mag = Math.log10(i.mag);
        return 0 === i.sign && (i.sign = 1, 0 === i.mag && i.layer >= 1 && (i.layer -= 1, i.mag = 1)), i.normalize(), 0 !== t ? i.layeradd(t, 10) : i;
      }
    }, {
      key: "layeradd",
      value: function value(t, i) {
        var r = this.slog(i).toNumber() + t;
        return r >= 0 ? e.tetrate(i, r) : Number.isFinite(r) ? r >= -1 ? e.log(e.tetrate(i, r + 1), i) : e.log(e.log(e.tetrate(i, r + 2), i), i) : e.dNaN;
      }
    }, {
      key: "lambertw",
      value: function value() {
        if (this.lt(-.3678794411710499)) throw Error("lambertw is unimplemented for results less than -1, sorry!");
        if (this.mag < 0) return e.fromNumber(v(this.toNumber()));
        if (0 === this.layer) return e.fromNumber(v(this.sign * this.mag));
        if (1 === this.layer) return d(this);
        if (2 === this.layer) return d(this);
        if (this.layer >= 3) return g(this.sign, this.layer - 1, this.mag);
        throw "Unhandled behavior in lambertw()";
      }
    }, {
      key: "ssqrt",
      value: function value() {
        if (1 == this.sign && this.layer >= 3) return g(this.sign, this.layer - 1, this.mag);
        var t = this.ln();
        return t.div(t.lambertw());
      }
    }, {
      key: "pentate",
      value: function value() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 2,
          i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : g(1, 0, 1);
        i = l(i);
        var r = t,
          n = r - (t = Math.trunc(t));
        0 !== n && (i.eq(e.dOne) ? (++t, i = e.fromNumber(n)) : i = this.eq(10) ? i.layeradd10(n) : i.layeradd(n, this));
        for (var a = 0; a < t; ++a) {
          if (i = this.tetrate(i.toNumber()), !isFinite(i.layer) || !isFinite(i.mag)) return i.normalize();
          if (a > 10) return i;
        }
        return i;
      }
    }, {
      key: "sin",
      value: function value() {
        return this.mag < 0 ? this : 0 === this.layer ? e.fromNumber(Math.sin(this.sign * this.mag)) : g(0, 0, 0);
      }
    }, {
      key: "cos",
      value: function value() {
        return this.mag < 0 ? e.dOne : 0 === this.layer ? e.fromNumber(Math.cos(this.sign * this.mag)) : g(0, 0, 0);
      }
    }, {
      key: "tan",
      value: function value() {
        return this.mag < 0 ? this : 0 === this.layer ? e.fromNumber(Math.tan(this.sign * this.mag)) : g(0, 0, 0);
      }
    }, {
      key: "asin",
      value: function value() {
        return this.mag < 0 ? this : 0 === this.layer ? e.fromNumber(Math.asin(this.sign * this.mag)) : g(Number.NaN, Number.NaN, Number.NaN);
      }
    }, {
      key: "acos",
      value: function value() {
        return this.mag < 0 ? e.fromNumber(Math.acos(this.toNumber())) : 0 === this.layer ? e.fromNumber(Math.acos(this.sign * this.mag)) : g(Number.NaN, Number.NaN, Number.NaN);
      }
    }, {
      key: "atan",
      value: function value() {
        return this.mag < 0 ? this : 0 === this.layer ? e.fromNumber(Math.atan(this.sign * this.mag)) : e.fromNumber(Math.atan(Infinity * this.sign));
      }
    }, {
      key: "sinh",
      value: function value() {
        return this.exp().sub(this.negate().exp()).div(2);
      }
    }, {
      key: "cosh",
      value: function value() {
        return this.exp().add(this.negate().exp()).div(2);
      }
    }, {
      key: "tanh",
      value: function value() {
        return this.sinh().div(this.cosh());
      }
    }, {
      key: "asinh",
      value: function value() {
        return e.ln(this.add(this.sqr().add(1).sqrt()));
      }
    }, {
      key: "acosh",
      value: function value() {
        return e.ln(this.add(this.sqr().sub(1).sqrt()));
      }
    }, {
      key: "atanh",
      value: function value() {
        return this.abs().gte(1) ? g(Number.NaN, Number.NaN, Number.NaN) : e.ln(this.add(1).div(e.fromNumber(1).sub(this))).div(2);
      }
    }, {
      key: "ascensionPenalty",
      value: function value(t) {
        return 0 === t ? this : this.root(e.pow(10, t));
      }
    }, {
      key: "egg",
      value: function value() {
        return this.add(9);
      }
    }, {
      key: "lessThanOrEqualTo",
      value: function value(t) {
        return this.cmp(t) < 1;
      }
    }, {
      key: "lessThan",
      value: function value(t) {
        return this.cmp(t) < 0;
      }
    }, {
      key: "greaterThanOrEqualTo",
      value: function value(t) {
        return this.cmp(t) > -1;
      }
    }, {
      key: "greaterThan",
      value: function value(t) {
        return this.cmp(t) > 0;
      }
    }], [{
      key: "fromComponents",
      value: function value(t, i, r) {
        return new e().fromComponents(t, i, r);
      }
    }, {
      key: "fromComponents_noNormalize",
      value: function value(t, i, r) {
        return new e().fromComponents_noNormalize(t, i, r);
      }
    }, {
      key: "fromMantissaExponent",
      value: function value(t, i) {
        return new e().fromMantissaExponent(t, i);
      }
    }, {
      key: "fromMantissaExponent_noNormalize",
      value: function value(t, i) {
        return new e().fromMantissaExponent_noNormalize(t, i);
      }
    }, {
      key: "fromDecimal",
      value: function value(t) {
        return new e().fromDecimal(t);
      }
    }, {
      key: "fromNumber",
      value: function value(t) {
        return new e().fromNumber(t);
      }
    }, {
      key: "fromString",
      value: function value(t) {
        return new e().fromString(t);
      }
    }, {
      key: "fromValue",
      value: function value(t) {
        return new e().fromValue(t);
      }
    }, {
      key: "fromValue_noAlloc",
      value: function value(t) {
        if (t instanceof e) return t;
        if ("string" == typeof t) {
          var i = e.fromStringCache.get(t);
          return void 0 !== i ? i : e.fromString(t);
        }
        return "number" == typeof t ? e.fromNumber(t) : e.dZero;
      }
    }, {
      key: "abs",
      value: function value(t) {
        return l(t).abs();
      }
    }, {
      key: "neg",
      value: function value(t) {
        return l(t).neg();
      }
    }, {
      key: "negate",
      value: function value(t) {
        return l(t).neg();
      }
    }, {
      key: "negated",
      value: function value(t) {
        return l(t).neg();
      }
    }, {
      key: "sign",
      value: function value(t) {
        return l(t).sign;
      }
    }, {
      key: "sgn",
      value: function value(t) {
        return l(t).sign;
      }
    }, {
      key: "round",
      value: function value(t) {
        return l(t).round();
      }
    }, {
      key: "floor",
      value: function value(t) {
        return l(t).floor();
      }
    }, {
      key: "ceil",
      value: function value(t) {
        return l(t).ceil();
      }
    }, {
      key: "trunc",
      value: function value(t) {
        return l(t).trunc();
      }
    }, {
      key: "add",
      value: function value(t, e) {
        return l(t).add(e);
      }
    }, {
      key: "plus",
      value: function value(t, e) {
        return l(t).add(e);
      }
    }, {
      key: "sub",
      value: function value(t, e) {
        return l(t).sub(e);
      }
    }, {
      key: "subtract",
      value: function value(t, e) {
        return l(t).sub(e);
      }
    }, {
      key: "minus",
      value: function value(t, e) {
        return l(t).sub(e);
      }
    }, {
      key: "mul",
      value: function value(t, e) {
        return l(t).mul(e);
      }
    }, {
      key: "multiply",
      value: function value(t, e) {
        return l(t).mul(e);
      }
    }, {
      key: "times",
      value: function value(t, e) {
        return l(t).mul(e);
      }
    }, {
      key: "div",
      value: function value(t, e) {
        return l(t).div(e);
      }
    }, {
      key: "divide",
      value: function value(t, e) {
        return l(t).div(e);
      }
    }, {
      key: "recip",
      value: function value(t) {
        return l(t).recip();
      }
    }, {
      key: "reciprocal",
      value: function value(t) {
        return l(t).recip();
      }
    }, {
      key: "reciprocate",
      value: function value(t) {
        return l(t).reciprocate();
      }
    }, {
      key: "cmp",
      value: function value(t, e) {
        return l(t).cmp(e);
      }
    }, {
      key: "cmpabs",
      value: function value(t, e) {
        return l(t).cmpabs(e);
      }
    }, {
      key: "compare",
      value: function value(t, e) {
        return l(t).cmp(e);
      }
    }, {
      key: "isNaN",
      value: function (t) {
        function e(e) {
          return t.apply(this, arguments);
        }
        return e.toString = function () {
          return t.toString();
        }, e;
      }(function (t) {
        return t = l(t), isNaN(t.sign) || isNaN(t.layer) || isNaN(t.mag);
      })
    }, {
      key: "isFinite",
      value: function (t) {
        function e(e) {
          return t.apply(this, arguments);
        }
        return e.toString = function () {
          return t.toString();
        }, e;
      }(function (t) {
        return t = l(t), isFinite(t.sign) && isFinite(t.layer) && isFinite(t.mag);
      })
    }, {
      key: "eq",
      value: function value(t, e) {
        return l(t).eq(e);
      }
    }, {
      key: "equals",
      value: function value(t, e) {
        return l(t).eq(e);
      }
    }, {
      key: "neq",
      value: function value(t, e) {
        return l(t).neq(e);
      }
    }, {
      key: "notEquals",
      value: function value(t, e) {
        return l(t).notEquals(e);
      }
    }, {
      key: "lt",
      value: function value(t, e) {
        return l(t).lt(e);
      }
    }, {
      key: "lte",
      value: function value(t, e) {
        return l(t).lte(e);
      }
    }, {
      key: "gt",
      value: function value(t, e) {
        return l(t).gt(e);
      }
    }, {
      key: "gte",
      value: function value(t, e) {
        return l(t).gte(e);
      }
    }, {
      key: "max",
      value: function value(t, e) {
        return l(t).max(e);
      }
    }, {
      key: "min",
      value: function value(t, e) {
        return l(t).min(e);
      }
    }, {
      key: "minabs",
      value: function value(t, e) {
        return l(t).minabs(e);
      }
    }, {
      key: "maxabs",
      value: function value(t, e) {
        return l(t).maxabs(e);
      }
    }, {
      key: "clamp",
      value: function value(t, e, i) {
        return l(t).clamp(e, i);
      }
    }, {
      key: "clampMin",
      value: function value(t, e) {
        return l(t).clampMin(e);
      }
    }, {
      key: "clampMax",
      value: function value(t, e) {
        return l(t).clampMax(e);
      }
    }, {
      key: "cmp_tolerance",
      value: function value(t, e, i) {
        return l(t).cmp_tolerance(e, i);
      }
    }, {
      key: "compare_tolerance",
      value: function value(t, e, i) {
        return l(t).cmp_tolerance(e, i);
      }
    }, {
      key: "eq_tolerance",
      value: function value(t, e, i) {
        return l(t).eq_tolerance(e, i);
      }
    }, {
      key: "equals_tolerance",
      value: function value(t, e, i) {
        return l(t).eq_tolerance(e, i);
      }
    }, {
      key: "neq_tolerance",
      value: function value(t, e, i) {
        return l(t).neq_tolerance(e, i);
      }
    }, {
      key: "notEquals_tolerance",
      value: function value(t, e, i) {
        return l(t).notEquals_tolerance(e, i);
      }
    }, {
      key: "lt_tolerance",
      value: function value(t, e, i) {
        return l(t).lt_tolerance(e, i);
      }
    }, {
      key: "lte_tolerance",
      value: function value(t, e, i) {
        return l(t).lte_tolerance(e, i);
      }
    }, {
      key: "gt_tolerance",
      value: function value(t, e, i) {
        return l(t).gt_tolerance(e, i);
      }
    }, {
      key: "gte_tolerance",
      value: function value(t, e, i) {
        return l(t).gte_tolerance(e, i);
      }
    }, {
      key: "pLog10",
      value: function value(t) {
        return l(t).pLog10();
      }
    }, {
      key: "absLog10",
      value: function value(t) {
        return l(t).absLog10();
      }
    }, {
      key: "log10",
      value: function value(t) {
        return l(t).log10();
      }
    }, {
      key: "log",
      value: function value(t, e) {
        return l(t).log(e);
      }
    }, {
      key: "log2",
      value: function value(t) {
        return l(t).log2();
      }
    }, {
      key: "ln",
      value: function value(t) {
        return l(t).ln();
      }
    }, {
      key: "logarithm",
      value: function value(t, e) {
        return l(t).logarithm(e);
      }
    }, {
      key: "pow",
      value: function value(t, e) {
        return l(t).pow(e);
      }
    }, {
      key: "pow10",
      value: function value(t) {
        return l(t).pow10();
      }
    }, {
      key: "root",
      value: function value(t, e) {
        return l(t).root(e);
      }
    }, {
      key: "factorial",
      value: function value(t, e) {
        return l(t).factorial();
      }
    }, {
      key: "gamma",
      value: function value(t, e) {
        return l(t).gamma();
      }
    }, {
      key: "lngamma",
      value: function value(t, e) {
        return l(t).lngamma();
      }
    }, {
      key: "exp",
      value: function value(t) {
        return l(t).exp();
      }
    }, {
      key: "sqr",
      value: function value(t) {
        return l(t).sqr();
      }
    }, {
      key: "sqrt",
      value: function value(t) {
        return l(t).sqrt();
      }
    }, {
      key: "cube",
      value: function value(t) {
        return l(t).cube();
      }
    }, {
      key: "cbrt",
      value: function value(t) {
        return l(t).cbrt();
      }
    }, {
      key: "tetrate",
      value: function value(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
          i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : g(1, 0, 1);
        return l(t).tetrate(e, i);
      }
    }, {
      key: "iteratedexp",
      value: function value(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
          i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : g(1, 0, 1);
        return l(t).iteratedexp(e, i);
      }
    }, {
      key: "iteratedlog",
      value: function value(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10,
          i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
        return l(t).iteratedlog(e, i);
      }
    }, {
      key: "layeradd10",
      value: function value(t, e) {
        return l(t).layeradd10(e);
      }
    }, {
      key: "layeradd",
      value: function value(t, e) {
        var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 10;
        return l(t).layeradd(e, i);
      }
    }, {
      key: "slog",
      value: function value(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10;
        return l(t).slog(e);
      }
    }, {
      key: "lambertw",
      value: function value(t) {
        return l(t).lambertw();
      }
    }, {
      key: "ssqrt",
      value: function value(t) {
        return l(t).ssqrt();
      }
    }, {
      key: "pentate",
      value: function value(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2,
          i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : g(1, 0, 1);
        return l(t).pentate(e, i);
      }
    }, {
      key: "affordGeometricSeries",
      value: function value(t, e, i, r) {
        return this.affordGeometricSeries_core(l(t), l(e), l(i), r);
      }
    }, {
      key: "sumGeometricSeries",
      value: function value(t, e, i, r) {
        return this.sumGeometricSeries_core(t, l(e), l(i), r);
      }
    }, {
      key: "affordArithmeticSeries",
      value: function value(t, e, i, r) {
        return this.affordArithmeticSeries_core(l(t), l(e), l(i), l(r));
      }
    }, {
      key: "sumArithmeticSeries",
      value: function value(t, e, i, r) {
        return this.sumArithmeticSeries_core(l(t), l(e), l(i), l(r));
      }
    }, {
      key: "efficiencyOfPurchase",
      value: function value(t, e, i) {
        return this.efficiencyOfPurchase_core(l(t), l(e), l(i));
      }
    }, {
      key: "randomDecimalForTesting",
      value: function value(t) {
        if (20 * Math.random() < 1) return g(0, 0, 0);
        var e = Math.random() > .5 ? 1 : -1;
        if (20 * Math.random() < 1) return g(e, 0, 1);
        var i = Math.floor(Math.random() * (t + 1)),
          r = 0 === i ? 616 * Math.random() - 308 : 16 * Math.random();
        Math.random() > .9 && (r = Math.trunc(r));
        var n = Math.pow(10, r);
        return Math.random() > .9 && (n = Math.trunc(n)), m(e, i, n);
      }
    }, {
      key: "affordGeometricSeries_core",
      value: function value(t, i, r, n) {
        var a = i.mul(r.pow(n));
        return e.floor(t.div(a).mul(r.sub(1)).add(1).log10().div(r.log10()));
      }
    }, {
      key: "sumGeometricSeries_core",
      value: function value(t, i, r, n) {
        return i.mul(r.pow(n)).mul(e.sub(1, r.pow(t))).div(e.sub(1, r));
      }
    }, {
      key: "affordArithmeticSeries_core",
      value: function value(t, e, i, r) {
        var n = e.add(r.mul(i)).sub(i.div(2)),
          a = n.pow(2);
        return n.neg().add(a.add(i.mul(t).mul(2)).sqrt()).div(i).floor();
      }
    }, {
      key: "sumArithmeticSeries_core",
      value: function value(t, e, i, r) {
        var n = e.add(r.mul(i));
        return t.div(2).mul(n.mul(2).plus(t.sub(1).mul(i)));
      }
    }, {
      key: "efficiencyOfPurchase_core",
      value: function value(t, e, i) {
        return t.div(e).add(t.div(i));
      }
    }, {
      key: "slog_critical",
      value: function value(t, i) {
        return t > 10 ? i - 1 : e.critical_section(t, i, o);
      }
    }, {
      key: "tetrate_critical",
      value: function value(t, i) {
        return e.critical_section(t, i, h);
      }
    }, {
      key: "critical_section",
      value: function value(t, e, i) {
        (e *= 10) < 0 && (e = 0), e > 10 && (e = 10), t < 2 && (t = 2), t > 10 && (t = 10);
        for (var r = 0, n = 0, a = 0; a < u.length; ++a) {
          if (u[a] == t) {
            r = i[a][Math.floor(e)], n = i[a][Math.ceil(e)];
            break;
          }
          if (u[a] < t && u[a + 1] > t) {
            var s = (t - u[a]) / (u[a + 1] - u[a]);
            r = i[a][Math.floor(e)] * (1 - s) + i[a + 1][Math.floor(e)] * s, n = i[a][Math.ceil(e)] * (1 - s) + i[a + 1][Math.ceil(e)] * s;
            break;
          }
        }
        var h = e - Math.floor(e);
        return r <= 0 || n <= 0 ? r * (1 - h) + n * h : Math.pow(t, Math.log(r) / Math.log(t) * (1 - h) + Math.log(n) / Math.log(t) * h);
      }
    }]), e;
  }();
  return k.dZero = g(0, 0, 0), k.dOne = g(1, 0, 1), k.dNegOne = g(-1, 0, 1), k.dTwo = g(1, 0, 2), k.dTen = g(1, 0, 10), k.dNaN = g(Number.NaN, Number.NaN, Number.NaN), k.dInf = g(1, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), k.dNegInf = g(-1, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY), k.dNumberMax = m(1, 0, Number.MAX_VALUE), k.dNumberMin = m(1, 0, Number.MIN_VALUE), k.fromStringCache = new r(1023), l = k.fromValue_noAlloc, m = k.fromComponents, g = k.fromComponents_noNormalize, k.fromMantissaExponent, k.fromMantissaExponent_noNormalize, k;
});
},{}],"assets/gameData/trainingData.json":[function(require,module,exports) {
module.exports = [{
  "id": 1001,
  "realmID": 10,
  "evolutionTier": 1,
  "name": "Running",
  "description": "It doesn't have to make sense. RUN.",
  "level": 0,
  "costType": "force",
  "costBase": 1,
  "costGrowthRate": 1.3,
  "prodType": "forceIncome",
  "prodBase": 1,
  "prodGrowthRate": 1.1,
  "active": true,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Running2",
    "description": "It doesn't have to make sense. RUN2.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Running3",
    "description": "It doesn't have to make sense. RUN3.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 1002,
  "realmID": 10,
  "evolutionTier": 1,
  "name": "Pullups",
  "description": "",
  "level": 0,
  "costType": "force",
  "costBase": 10,
  "costGrowthRate": 1.35,
  "prodType": "forceIncome",
  "prodBase": 10,
  "prodGrowthRate": 1.1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Advanced Pullups",
    "description": "Grasp the bar with all your might and push your limits to the next level.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Master Pullups",
    "description": "Perfect form, relentless drive. You're a pull-up machine.",
    "level": 0,
    "costBase": 1000,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 1003,
  "realmID": 10,
  "evolutionTier": 1,
  "name": "Wing-Chun Dummy Training",
  "description": "While it stands stoic and strong, it also stands idle and foolish, never knowing the joy of victory or the wisdom of failure.",
  "level": 0,
  "costType": "force",
  "costBase": 100,
  "costGrowthRate": 1.4,
  "prodType": "forceIncome",
  "prodBase": 100,
  "prodGrowthRate": 1.1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Wing-Chun Dummy Mastery",
    "description": "The dummy stands no chance against your fluid movements and strong strikes.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Wing-Chun Dummy Grandmaster",
    "description": "You've transcended beyond the basics, embodying the spirit of Wing-Chun.",
    "level": 0,
    "costBase": 1000,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 1004,
  "realmID": 10,
  "evolutionTier": 1,
  "name": "Squat",
  "description": "",
  "level": 0,
  "costType": "force",
  "costBase": 10000,
  "costGrowthRate": 1.45,
  "prodType": "forceIncome",
  "prodBase": 10000,
  "prodGrowthRate": 1.1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Heavy Squats",
    "description": "Lift more, grow stronger. The weight is but a number.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Squat God",
    "description": "You squat with such power and grace that the gods would be envious.",
    "level": 0,
    "costBase": 1000,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 1005,
  "realmID": 10,
  "evolutionTier": 1,
  "name": "Deadlift",
  "description": "",
  "level": 0,
  "costType": "force",
  "costBase": 100000,
  "costGrowthRate": 1.5,
  "prodType": "forceIncome",
  "prodBase": 100000,
  "prodGrowthRate": 1.1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Deadlift Powerhouse",
    "description": "You've graduated from novice to powerhouse, deadlifting weights that would make others quake.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Deadlift Titan",
    "description": "You are a titan among mortals, lifting weights others can only dream of.",
    "level": 0,
    "costBase": 1000,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 2001,
  "realmID": 30,
  "evolutionTier": 1,
  "name": "Concentrate energy ball",
  "description": "Harness your energy into a concentrated sphere.",
  "level": 0,
  "costType": "energy",
  "costBase": 1,
  "costGrowthRate": 1.3,
  "prodType": "energyIncome",
  "prodBase": 1,
  "prodGrowthRate": 1.1,
  "active": true,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Energize",
    "description": "Your control over your energy balls grows, turning them into devastating weapons.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 10,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Energize Master",
    "description": "You've mastered energy manipulation, allowing you to create incredibly powerful energy balls.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 2002,
  "realmID": 30,
  "evolutionTier": 1,
  "name": "Fly 10 feet",
  "description": "Take to the skies and learn to fly.",
  "level": 0,
  "costType": "energy",
  "costBase": 10,
  "costGrowthRate": 1.35,
  "prodType": "energyIncome",
  "prodBase": 10,
  "prodGrowthRate": 1.1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Soar",
    "description": "You've begun to master flight, allowing you to fly faster and higher.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Soar Master",
    "description": "You're now a master of flight, able to fly as freely as a bird.",
    "level": 0,
    "costBase": 1000,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 2003,
  "realmID": 30,
  "evolutionTier": 1,
  "name": "Manipulate energy aura",
  "description": "Learn to manipulate your aura, the energy that surrounds you.",
  "level": 0,
  "costType": "energy",
  "costBase": 100,
  "costGrowthRate": 1.4,
  "prodType": "energyIncome",
  "prodBase": 100,
  "prodGrowthRate": 1.1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Aura Mastery",
    "description": "Your mastery over your aura is growing, making it stronger and more resilient.",
    "level": 0,
    "costBase": 1000,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Aura Grandmaster",
    "description": "You are now a grandmaster, with complete control over your aura.",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.3,
    "prodBase": 10000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 2004,
  "realmID": 30,
  "evolutionTier": 1,
  "name": "Force shielding",
  "description": "Create an invisible shield to protect you from attacks.",
  "level": 0,
  "costType": "energy",
  "costBase": 10000,
  "costGrowthRate": 1.45,
  "prodType": "energyIncome",
  "prodBase": 10000,
  "prodGrowthRate": 1.1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Shield Reinforcement",
    "description": "Strengthen your shield, making it nearly impervious to attacks.",
    "level": 0,
    "costBase": 100000,
    "costGrowthRate": 1.3,
    "prodBase": 100000,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Shield Perfection",
    "description": "Your shield is now perfect, able to withstand any attack.",
    "level": 0,
    "costBase": 1000000,
    "costGrowthRate": 1.3,
    "prodBase": 1000000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 2005,
  "realmID": 30,
  "evolutionTier": 1,
  "name": "Projected energy blasting",
  "description": "Learn to project your energy as a powerful blast.",
  "level": 0,
  "costType": "energy",
  "costBase": 100000,
  "costGrowthRate": 1.5,
  "prodType": "energyIncome",
  "prodBase": 100000,
  "prodGrowthRate": 1.1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Blast Mastery",
    "description": "Your energy blasts are now more powerful and accurate.",
    "level": 0,
    "costBase": 1000000,
    "costGrowthRate": 1.3,
    "prodBase": 1000000,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Blast Grandmaster",
    "description": "As a grandmaster, your energy blasts are now unstoppable forces of destruction.",
    "level": 0,
    "costBase": 10000000,
    "costGrowthRate": 1.3,
    "prodBase": 1000000,
    "prodGrowthRate": 1.1
  }]
}];
},{}],"assets/gameData/generatorData.json":[function(require,module,exports) {
module.exports = [{
  "id": 611,
  "genChainID": 601,
  "evolutionTier": 1,
  "name": "Students",
  "description": "",
  "level": 0,
  "costType": "wisdom",
  "costBase": 1,
  "costGrowthRate": 1.3,
  "prodType": "wisdomIncome",
  "prodBase": 1,
  "prodGrowthRate": 1,
  "active": true,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Scholars",
    "description": "The students have become scholars. Their thirst for knowledge is unstoppable.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Savants",
    "description": "Now savants, they've transcended normal scholarly pursuits. Every thought is a fountain of wisdom.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 612,
  "genChainID": 601,
  "evolutionTier": 1,
  "name": "Trainers",
  "description": "",
  "level": 0,
  "costType": "wisdom",
  "costBase": 10,
  "costGrowthRate": 1.4,
  "prodType": "sGen1",
  "prodBase": 1,
  "prodGrowthRate": 1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Coaches",
    "description": "The trainers have evolved into coaches, guiding their students with expertise and patience.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Mentors",
    "description": "Now mentors, they've reached a pinnacle of guidance. Their wisdom shapes the future.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 613,
  "genChainID": 601,
  "evolutionTier": 1,
  "name": "Academies",
  "description": "",
  "level": 0,
  "costType": "wisdom",
  "costBase": 100,
  "costGrowthRate": 1.4,
  "prodType": "sGen2",
  "prodBase": 1,
  "prodGrowthRate": 1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Universities",
    "description": "The academies have grown into universities, havens of learning and innovation.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Centers of Excellence",
    "description": "They've become Centers of Excellence, pioneering the frontier of knowledge.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 614,
  "genChainID": 601,
  "evolutionTier": 1,
  "name": "Masters",
  "description": "",
  "level": 0,
  "costType": "wisdom",
  "costBase": 1000,
  "costGrowthRate": 1.4,
  "prodType": "sGen3",
  "prodBase": 1,
  "prodGrowthRate": 1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Grandmasters",
    "description": "The masters have evolved into grandmasters, embodying the pinnacle of their discipline.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Legends",
    "description": "Now legends, their skills and wisdom are unparalleled in history.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 615,
  "genChainID": 601,
  "evolutionTier": 1,
  "name": "Grandmasters",
  "description": "",
  "level": 0,
  "costType": "wisdom",
  "costBase": 10000,
  "costGrowthRate": 1.5,
  "prodType": "sGen4",
  "prodBase": 1,
  "prodGrowthRate": 1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Pioneers",
    "description": "The grandmasters have become pioneers, charting new territories in their fields.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "Visionaries",
    "description": "Now visionaries, they are creating the future with their groundbreaking insights.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 711,
  "genChainID": 701,
  "evolutionTier": 1,
  "name": "dGen1",
  "description": "",
  "level": 0,
  "costType": "divine",
  "costBase": 1,
  "costGrowthRate": 1.3,
  "prodType": "divineIncome",
  "prodBase": 1,
  "prodGrowthRate": 1,
  "active": true,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "dGenPrime",
    "description": "The divine generator has evolved into dGenPrime, producing even greater divine energy.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "dGenUltra",
    "description": "Now dGenUltra, it emanates an astounding amount of divine power.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 712,
  "genChainID": 701,
  "evolutionTier": 1,
  "name": "dGen2",
  "description": "",
  "level": 0,
  "costType": "divine",
  "costBase": 10,
  "costGrowthRate": 1.4,
  "prodType": "dGen1",
  "prodBase": 1,
  "prodGrowthRate": 1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "dGen2Advanced",
    "description": "dGen2 has evolved into dGen2Advanced, multiplying its divine power generation.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "dGen2Superior",
    "description": "Now dGen2Superior, it's an epitome of divine energy generation.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 713,
  "genChainID": 701,
  "evolutionTier": 1,
  "name": "dGen3",
  "description": "",
  "level": 0,
  "costType": "divine",
  "costBase": 100,
  "costGrowthRate": 1.4,
  "prodType": "dGen2",
  "prodBase": 1,
  "prodGrowthRate": 1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "dGen3Pro",
    "description": "dGen3 has become dGen3Pro, radiating divine power more effectively.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "dGen3Ultra",
    "description": "Now dGen3Ultra, it's the ultimate divine generator.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 714,
  "genChainID": 701,
  "evolutionTier": 1,
  "name": "dGen4",
  "description": "",
  "level": 0,
  "costType": "divine",
  "costBase": 1000,
  "costGrowthRate": 1.4,
  "prodType": "dGen3",
  "prodBase": 1,
  "prodGrowthRate": 1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "dGen4Max",
    "description": "dGen4 has evolved into dGen4Max, reaching a new level of divine power generation.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "dGen4Supreme",
    "description": "Now dGen4Supreme, it's the apex of divine energy creation.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}, {
  "id": 715,
  "genChainID": 701,
  "evolutionTier": 1,
  "name": "dGen5",
  "description": "",
  "level": 0,
  "costType": "divine",
  "costBase": 10000,
  "costGrowthRate": 1.5,
  "prodType": "dGen4",
  "prodBase": 1,
  "prodGrowthRate": 1,
  "active": false,
  "evolutions": [{
    "evolutionTier": 2,
    "name": "dGen5Ultimate",
    "description": "dGen5 has become dGen5Ultimate, epitomizing divine energy production.",
    "level": 0,
    "costBase": 10,
    "costGrowthRate": 1.3,
    "prodBase": 100,
    "prodGrowthRate": 1.1
  }, {
    "evolutionTier": 3,
    "name": "dGen5Omega",
    "description": "Now dGen5Omega, it's the final word in divine generator evolution.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": 1000,
    "prodGrowthRate": 1.1
  }]
}];
},{}],"assets/gameData/realmUpgradeData.json":[function(require,module,exports) {
module.exports = [{
  "id": 1101,
  "realmID": 10,
  "evolutionTier": 1,
  "name": "Increase Run Distance",
  "description": "prodMult *= (this level + 1)",
  "level": 0,
  "costType": "force",
  "costBase": 10,
  "costGrowthRate": 1.3,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 1151,
    "name": "pTarMod1",
    "type": "production",
    "priority": null,
    "sourceID": 1101,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 1001,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Marathon Training",
    "description": "prodMult *= (this level + 2), Your strides have doubled in strength and length.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.3,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "Ultramarathon Training",
    "description": "prodMult *= (this level + 3), You've entered a realm few dare to tread.",
    "level": 0,
    "costBase": 1000,
    "costGrowthRate": 1.3,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 1102,
  "realmID": 10,
  "evolutionTier": 1,
  "name": "Increase Pullup weight",
  "description": "prodMult *= (this level + 1)",
  "level": 0,
  "costType": "force",
  "costBase": 100,
  "costGrowthRate": 1.1,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 1152,
    "name": "pTarMod2",
    "type": "production",
    "priority": null,
    "sourceID": 1102,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 1002,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Weighted Pullups",
    "description": "prodMult *= (this level + 2), Add weight, build strength.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.1,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "One-Arm Pullups",
    "description": "prodMult *= (this level + 3), Only the truly dedicated can master this feat of strength.",
    "level": 0,
    "costBase": 1000,
    "costGrowthRate": 1.1,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 1103,
  "realmID": 10,
  "evolutionTier": 1,
  "name": "Add more wooden arms",
  "description": "costMult /= (this level + 1.05)",
  "level": 0,
  "costType": "force",
  "costBase": 1000,
  "costGrowthRate": 1.4,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 1153,
    "name": "pTarMod3",
    "type": "cost",
    "priority": null,
    "sourceID": 1103,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 1003,
    "runningCalcType": "div",
    "baseValue": 1.05,
    "value": 1.05,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Enhanced Dummy",
    "description": "costMult /= (this level + 2), The dummy is no longer just a wooden block, but a complex training tool.",
    "level": 0,
    "costBase": 100,
    "costGrowthRate": 1.4,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "Ultimate Training Dummy",
    "description": "costMult /= (this level + 3), Your dummy is a true masterpiece of martial arts engineering.",
    "level": 0,
    "costBase": 1000,
    "costGrowthRate": 1.4,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 1104,
  "realmID": 10,
  "evolutionTier": 1,
  "name": "Increase Squat Weight",
  "description": "prodMult += (10 * this level)",
  "level": 0,
  "costType": "force",
  "costBase": 5000,
  "costGrowthRate": 1.5,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 1154,
    "name": "pTarMod4",
    "type": "production",
    "priority": null,
    "sourceID": 1104,
    "sourceCalcType": "mult",
    "targetType": null,
    "targetID": 1004,
    "runningCalcType": "add",
    "baseValue": 10,
    "value": 10,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Atlas Squats",
    "description": "prodMult += (20 * this level), Carry the weight of the world on your shoulders.",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "Titan Squats",
    "description": "prodMult += (30 * this level), Not even a Titan could match your strength.",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 1105,
  "realmID": 10,
  "evolutionTier": 1,
  "name": "Increase Deadlift weight",
  "description": "prodMult * (this.level * 2)",
  "level": 0,
  "costType": "force",
  "costBase": 10000,
  "costGrowthRate": 1.6,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 1155,
    "name": "pTarMod5",
    "type": "production",
    "priority": null,
    "sourceID": 1105,
    "sourceCalcType": "mult",
    "targetType": null,
    "targetID": 1005,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "Olympic Deadlift",
    "description": "prodMult * (this.level * 3), Your power is now on par with Olympian strength.",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.6,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "World Record Deadlift",
    "description": "prodMult * (this.level * 4), Records were made to be broken.",
    "level": 0,
    "costBase": 20000,
    "costGrowthRate": 1.6,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 631,
  "realmID": 20,
  "evolutionTier": 1,
  "name": "Better candidates",
  "description": "prodMult *= (this level + 1)",
  "level": 0,
  "costType": "wisdom",
  "costBase": 10,
  "costGrowthRate": 1.3,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 641,
    "name": "sTarMod1",
    "type": "production",
    "priority": null,
    "sourceID": 631,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 611,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 632,
  "realmID": 20,
  "evolutionTier": 1,
  "name": "Trainers study more",
  "description": "prodMult *= (this level + 1)",
  "level": 0,
  "costType": "wisdom",
  "costBase": 100,
  "costGrowthRate": 1.1,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 642,
    "name": "sTarMod2",
    "type": "production",
    "priority": null,
    "sourceID": 632,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 612,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 633,
  "realmID": 20,
  "evolutionTier": 1,
  "name": "Expand Academy Squarefootage",
  "description": "costMult /= (this level + 1.05)",
  "level": 0,
  "costType": "wisdom",
  "costBase": 1000,
  "costGrowthRate": 1.4,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 643,
    "name": "sTarMod3",
    "type": "cost",
    "priority": null,
    "sourceID": 633,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 613,
    "runningCalcType": "div",
    "baseValue": 1.05,
    "value": 1.05,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 634,
  "realmID": 20,
  "evolutionTier": 1,
  "name": "Masters access historical texts",
  "description": "prodMult += (10 * this level)",
  "level": 0,
  "costType": "wisdom",
  "costBase": 5000,
  "costGrowthRate": 1.5,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 644,
    "name": "sTarMod4",
    "type": "production",
    "priority": null,
    "sourceID": 634,
    "sourceCalcType": "mult",
    "targetType": null,
    "targetID": 614,
    "runningCalcType": "add",
    "baseValue": 10,
    "value": 10,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 635,
  "realmID": 20,
  "evolutionTier": 1,
  "name": "Give grandmasters concubines",
  "description": "prodMult * (this.level * 2)",
  "level": 0,
  "costType": "wisdom",
  "costBase": 10000,
  "costGrowthRate": 1.6,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 645,
    "name": "sTarMod5",
    "type": "production",
    "priority": null,
    "sourceID": 635,
    "sourceCalcType": "mult",
    "targetType": null,
    "targetID": 615,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 2101,
  "realmID": 30,
  "evolutionTier": 1,
  "name": "Higher density energy ball",
  "description": "prodMult *= (this level + 1)",
  "level": 0,
  "costType": "energy",
  "costBase": 10,
  "costGrowthRate": 1.3,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 2151,
    "name": "eTarMod1",
    "type": "production",
    "priority": null,
    "sourceID": 2101,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 2001,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 2102,
  "realmID": 30,
  "evolutionTier": 1,
  "name": "Maintain longer flight",
  "description": "prodMult *= (this level + 1)",
  "level": 0,
  "costType": "energy",
  "costBase": 100,
  "costGrowthRate": 1.1,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 2152,
    "name": "eTarMod2",
    "type": "production",
    "priority": null,
    "sourceID": 2102,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 2002,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 2103,
  "realmID": 30,
  "evolutionTier": 1,
  "name": "Extend aura",
  "description": "costMult /= (this level + 1.05)",
  "level": 0,
  "costType": "energy",
  "costBase": 1000,
  "costGrowthRate": 1.4,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 2153,
    "name": "eTarMod3",
    "type": "cost",
    "priority": null,
    "sourceID": 2103,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 2003,
    "runningCalcType": "div",
    "baseValue": 1.05,
    "value": 1.05,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 2104,
  "realmID": 30,
  "evolutionTier": 1,
  "name": "Strengthen shield",
  "description": "prodMult += (10 * this level)",
  "level": 0,
  "costType": "energy",
  "costBase": 5000,
  "costGrowthRate": 1.5,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 2154,
    "name": "eTarMod4",
    "type": "production",
    "priority": null,
    "sourceID": 2104,
    "sourceCalcType": "mult",
    "targetType": null,
    "targetID": 2004,
    "runningCalcType": "add",
    "baseValue": 10,
    "value": 10,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 2105,
  "realmID": 30,
  "evolutionTier": 1,
  "name": "Increase blast power",
  "description": "prodMult * (this.level * 2)",
  "level": 0,
  "costType": "energy",
  "costBase": 10000,
  "costGrowthRate": 1.6,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 2155,
    "name": "eTarMod5",
    "type": "production",
    "priority": null,
    "sourceID": 2105,
    "sourceCalcType": "mult",
    "targetType": null,
    "targetID": 2005,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 731,
  "realmID": 40,
  "evolutionTier": 1,
  "name": "desc",
  "description": "prodMult *= (this level + 1)",
  "level": 0,
  "costType": "divine",
  "costBase": 10,
  "costGrowthRate": 1.3,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 741,
    "name": "dTarMod1",
    "type": "production",
    "priority": null,
    "sourceID": 731,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 711,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 732,
  "realmID": 40,
  "evolutionTier": 1,
  "name": "desc",
  "description": "prodMult *= (this level + 1)",
  "level": 0,
  "costType": "divine",
  "costBase": 100,
  "costGrowthRate": 1.1,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 742,
    "name": "dTarMod2",
    "type": "production",
    "priority": null,
    "sourceID": 732,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 712,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 733,
  "realmID": 40,
  "evolutionTier": 1,
  "name": "desc",
  "description": "costMult /= (this level + 1.05)",
  "level": 0,
  "costType": "divine",
  "costBase": 1000,
  "costGrowthRate": 1.4,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 743,
    "name": "dTarMod3",
    "type": "cost",
    "priority": null,
    "sourceID": 733,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 713,
    "runningCalcType": "div",
    "baseValue": 1.05,
    "value": 1.05,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}, {
  "id": 734,
  "realmID": 40,
  "evolutionTier": 1,
  "name": "desc",
  "description": "prodMult += (10 * this level)",
  "level": 0,
  "costType": "divine",
  "costBase": 5000,
  "costGrowthRate": 1.5,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 744,
    "name": "dTarMod4",
    "type": "production",
    "priority": null,
    "sourceID": 734,
    "sourceCalcType": "mult",
    "targetType": null,
    "targetID": 714,
    "runningCalcType": "add",
    "baseValue": 10,
    "value": 10,
    "active": false
  }],
  "evolutions": [{
    "evolutionTier": 2,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 5000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }, {
    "evolutionTier": 3,
    "name": "asdfasdf",
    "description": "asdfasdf",
    "level": 0,
    "costBase": 10000,
    "costGrowthRate": 1.5,
    "prodBase": null,
    "prodGrowthRate": null
  }]
}];
},{}],"assets/gameData/forgeUpgradeData.json":[function(require,module,exports) {
module.exports = [{
  "id": 10001,
  "name": "forceTrain multiply",
  "description": "forceTrain mult",
  "level": 0,
  "maxLevel": 1,
  "costType": "force",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 10051,
    "name": "superForceUpMod1",
    "type": "production",
    "priority": null,
    "sourceID": 10001,
    "sourceCalcType": "add",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "add",
    "baseValue": 1,
    "value": 1,
    "active": false
  }]
}, {
  "id": 10002,
  "name": "fTrain2 boosts fTrain1",
  "description": "increase multiplier of fTrain1 by * fTrain2 level",
  "level": 0,
  "maxLevel": 1,
  "costType": "force",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 10052,
    "name": "superForceUpMod2",
    "type": "production",
    "priority": null,
    "sourceID": 1002,
    "sourceCalcType": "add",
    "targetType": null,
    "targetID": 1001,
    "runningCalcType": "add",
    "baseValue": 1,
    "value": 1,
    "active": false,
    "specialActivatorID": 10002
  }]
}, {
  "id": 10003,
  "name": "Force -> powerlevel boost",
  "description": "increase force contribution to powerLevel by 10x",
  "level": 0,
  "maxLevel": 1,
  "costType": "force",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": "modifyPlayerValue",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "specialVar1": "forcePowerLevelMultiplier",
  "specialVar2": 10,
  "mods": []
}, {
  "id": 10004,
  "name": "Wisdom -> powerlevel boost",
  "description": "increase wisdom contribution to powerLevel by 10x",
  "level": 0,
  "maxLevel": 1,
  "costType": "force",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": "modifyPlayerValue",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "specialVar1": "wisdomPowerLevelMultiplier",
  "specialVar2": 10,
  "mods": []
}, {
  "id": 10005,
  "name": "evolve force realm",
  "description": "reset force realm into a higher stage. bigger bonuses. bigger upgrades. papa odyssos",
  "level": 0,
  "maxLevel": 1,
  "costType": "force",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": "evolveRealm",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "specialVar1": 10,
  "mods": []
}, {
  "id": 10006,
  "name": "energy -> powerlevel boost",
  "description": "increase energy contribution to powerLevel by 10x",
  "level": 0,
  "maxLevel": 1,
  "costType": "force",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": "modifyPlayerValue",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "specialVar1": "energyPowerLevelMultiplier",
  "specialVar2": 10,
  "mods": []
}, {
  "id": 10007,
  "name": "divine -> powerlevel boost",
  "description": "increase divine contribution to powerLevel by 10x",
  "level": 0,
  "maxLevel": 1,
  "costType": "force",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": "modifyPlayerValue",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "specialVar1": "divinePowerLevelMultiplier",
  "specialVar2": 10,
  "mods": []
}, {
  "id": 10008,
  "name": "fTrain2 increases fTrain1 mult",
  "description": "fTrain1 production multiplier + log10(fTrain2)",
  "level": 0,
  "maxLevel": 1,
  "costType": "force",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 10057,
    "name": "superForceUpMod7",
    "type": "production",
    "priority": null,
    "sourceID": 1002,
    "sourceCalcType": "log",
    "targetType": null,
    "targetID": 1001,
    "runningCalcType": "add",
    "baseValue": 10,
    "value": 10,
    "active": false,
    "specialActivatorID": 10008
  }]
}, {
  "id": 10009,
  "name": "gain fTrain1 based on fTrain 2",
  "description": "gain fTrain1 equal to log10(fTrain2)",
  "level": 0,
  "maxLevel": 1,
  "costType": "force",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": "levelsAddLevels",
  "prodBase": 10,
  "prodGrowthRate": null,
  "active": false,
  "specialVar1": 1001,
  "specialVar2": 1002,
  "specialVar3": "log",
  "mods": []
}, {
  "id": 10101,
  "name": "wisdomTrain mult",
  "description": "wisdomTrain mult",
  "level": 0,
  "maxLevel": 1,
  "costType": "wisdom",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 10151,
    "name": "superWisdomUpMod1",
    "type": "production",
    "priority": null,
    "sourceID": 10101,
    "sourceCalcType": "add",
    "targetType": "wisdomTrain",
    "targetID": null,
    "runningCalcType": "add",
    "baseValue": 1,
    "value": 1,
    "active": false
  }]
}, {
  "id": 10102,
  "name": "Unspent Wisdom = Force income",
  "description": "increase force production by 1.1* current unspent wisdom",
  "level": 0,
  "maxLevel": 1,
  "costType": "wisdom",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": "unspentCurrency",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "specialVar1": "unspentWisdomToForce",
  "specialVar2": 1.1,
  "mods": []
}, {
  "id": 10103,
  "name": "Wisdom Production increase",
  "description": "increase all wisdom production by 10%",
  "level": 0,
  "maxLevel": 1,
  "costType": "wisdom",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 10153,
    "name": "superWisdomUpMod3",
    "type": "production",
    "priority": null,
    "sourceID": 10103,
    "sourceCalcType": "add",
    "targetType": "wisdomTrain",
    "targetID": null,
    "runningCalcType": "addPercent",
    "baseValue": 10,
    "value": 10,
    "active": false
  }]
}, {
  "id": 10104,
  "name": "Wisdom train cost decrease",
  "description": "decrease all wisdom cost by 10%",
  "level": 0,
  "maxLevel": 1,
  "costType": "wisdom",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 10154,
    "name": "superWisdomUpMod4",
    "type": "cost",
    "priority": null,
    "sourceID": 10104,
    "sourceCalcType": "add",
    "targetType": "wisdomTrain",
    "targetID": null,
    "runningCalcType": "subPercent",
    "baseValue": 10,
    "value": 10,
    "active": false
  }]
}, {
  "id": 10105,
  "name": "evolve wisdom realm",
  "description": "reset wisdom realm into a higher stage. bigger bonuses. bigger upgrades. papa odyssos",
  "level": 0,
  "maxLevel": 1,
  "costType": "wisdom",
  "costBase": 100,
  "costGrowthRate": 2,
  "prodType": "evolveRealm",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "specialVar1": 20,
  "mods": []
}, {
  "id": 10201,
  "name": "energyTrain mult",
  "description": "energyTrain mult",
  "level": 0,
  "maxLevel": 1,
  "costType": "energy",
  "costBase": 1000,
  "costGrowthRate": 2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 10251,
    "name": "superEnergyUpMod1",
    "type": "production",
    "priority": null,
    "sourceID": 10201,
    "sourceCalcType": "add",
    "targetType": "energyTrain",
    "targetID": null,
    "runningCalcType": "add",
    "baseValue": 1,
    "value": 1,
    "active": false
  }]
}, {
  "id": 10301,
  "name": "divineTrain mult",
  "description": "divineTrain mult",
  "level": 0,
  "maxLevel": 1,
  "costType": "divine",
  "costBase": 1000,
  "costGrowthRate": 2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": [{
    "id": 10351,
    "name": "superDivineUpMod1",
    "type": "production",
    "priority": null,
    "sourceID": 10301,
    "sourceCalcType": "add",
    "targetType": "divineTrain",
    "targetID": null,
    "runningCalcType": "add",
    "baseValue": 1,
    "value": 1,
    "active": false
  }]
}, {
  "id": 10401,
  "name": "Auto Conquest Repeat",
  "description": "autoConquestRepeat enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoConquestRepeat",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": []
}, {
  "id": 10402,
  "name": "Auto Conquest Progression",
  "description": "autoConquestProgression enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoConquestProgression",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false
}, {
  "id": 10403,
  "name": "Auto Tournament",
  "description": "autoTournamentProgression enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoTournamentProgression",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": []
}, {
  "id": 10404,
  "name": "Auto ForceTrain",
  "description": "autoForceTrain enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoForceTrain",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": []
}, {
  "id": 10405,
  "name": "Auto WisdomTrain",
  "description": "autoWisdomTrain enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoWisdomTrain",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": []
}, {
  "id": 10406,
  "name": "Auto EnergyTrain",
  "description": "autoEnergyTrain enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoEnergyTrain",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": []
}, {
  "id": 10407,
  "name": "Auto DivineTrain",
  "description": "autoDivineTrain enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoDivineTrain",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": []
}, {
  "id": 10408,
  "name": "Auto ForceUpgrades",
  "description": "autoForceUpgrade enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoForceUpgrade",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": []
}, {
  "id": 10409,
  "name": "Auto WisdomUpgrades",
  "description": "autoWisdomUpgrade enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoWisdomUpgrade",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": []
}, {
  "id": 10410,
  "name": "Auto EnergyUpgrades",
  "description": "autoEnergyUpgrade enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoEnergyUpgrade",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": []
}, {
  "id": 10411,
  "name": "Auto DivineUpgrades",
  "description": "autoDivineUpgrade enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoDivineUpgrade",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": []
}, {
  "id": 10412,
  "name": "Auto Artifacts",
  "description": "autoArtifact enable",
  "level": 0,
  "maxLevel": 1,
  "costType": "crystal",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "autoArtifact",
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "mods": []
}];
},{}],"assets/gameData/essenceUpgradeData.json":[function(require,module,exports) {
module.exports = [{
  "id": 100001,
  "name": "eUpgrade1",
  "description": "all fTrain + 1 prodBase",
  "level": 0,
  "maxLevel": 10,
  "costType": "essence",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": true,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null,
  "mods": [{
    "id": 101001,
    "name": "essenceTarMod1",
    "type": "production",
    "priority": null,
    "sourceID": 100001,
    "sourceCalcType": "add",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "add",
    "baseValue": 1,
    "value": 1,
    "active": false
  }]
}, {
  "id": 100002,
  "name": "eUpgrade2",
  "description": "all zone prodMult * (2 * lvl)",
  "level": 0,
  "maxLevel": 10,
  "costType": "essence",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "parentID": 100001,
  "angleFromParent": 360,
  "distanceFromParent": 100,
  "mods": [{
    "id": 101003,
    "name": "essenceTarMod2",
    "type": "production",
    "priority": null,
    "sourceID": 100002,
    "sourceCalcType": "mult",
    "targetType": "zones",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }]
}, {
  "id": 100003,
  "name": "eUpgrade3",
  "description": "unlock skilltree path 1",
  "level": 0,
  "maxLevel": 1,
  "costType": "essence",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "parentID": 100001,
  "angleFromParent": 180,
  "distanceFromParent": 100,
  "mods": []
}, {
  "id": 100004,
  "name": "eUpgrade4",
  "description": "start with +10sp * lvl",
  "level": 0,
  "maxLevel": 10,
  "costType": "essence",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "skillpoint",
  "prodBase": 10,
  "prodGrowthRate": 1.1,
  "parentID": 100001,
  "angleFromParent": 270,
  "distanceFromParent": 100,
  "mods": []
}, {
  "id": 100005,
  "name": "eUpgrade5",
  "description": "start with ptrain1 lvl 10 * lvl",
  "level": 0,
  "maxLevel": 10,
  "costType": "essence",
  "costBase": 1,
  "costGrowthRate": 2,
  "prodType": "baseFeatureLevel",
  "prodBase": 10,
  "prodGrowthRate": 1.1,
  "parentID": 100001,
  "angleFromParent": 90,
  "distanceFromParent": 100,
  "specialTargetID": 1001,
  "mods": []
}];
},{}],"assets/gameData/radianceUpgradeData.json":[function(require,module,exports) {
module.exports = [{
  "id": 120001,
  "name": "Time Radiance",
  "description": "game speed multiplier = 1 + (level * .1)",
  "level": 0,
  "costType": "radiance",
  "costBase": 1,
  "costGrowthRate": 1.3,
  "prodType": "timeMult",
  "prodBase": 1,
  "prodGrowthRate": 0.1,
  "active": true
}, {
  "id": 120002,
  "name": "Income Radiance",
  "description": "all income ^ (level + 1)",
  "level": 0,
  "costType": "radiance",
  "costBase": 1,
  "costGrowthRate": 1.3,
  "prodType": "timeMult",
  "prodBase": 1,
  "prodGrowthRate": 2,
  "active": true,
  "mods": [{
    "id": 121002,
    "name": "rTarMod2",
    "type": "production",
    "priority": null,
    "sourceID": 120002,
    "sourceCalcType": "add",
    "targetType": "allTrain",
    "targetID": null,
    "runningCalcType": "exp",
    "baseValue": 1,
    "value": 1,
    "active": false
  }]
}];
},{}],"assets/gameData/fighterData.json":[function(require,module,exports) {
module.exports = [{
  "name": "Sparrow's Fist Simon",
  "description": "",
  "costBase": 100,
  "tier": 1,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": true,
  "visible": false
}, {
  "name": "Grasshopper's Leap Gareth",
  "description": "",
  "costBase": 100,
  "tier": 1,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Iron Fist Isaac",
  "description": "",
  "costBase": 100,
  "tier": 1,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Steel Arm Stanley",
  "description": "",
  "costBase": 100,
  "tier": 1,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Boulder Bash Bradley",
  "description": "",
  "costBase": 100,
  "tier": 1,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Granite Grip Grant",
  "description": "",
  "costBase": 100,
  "tier": 1,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Titanium Terry",
  "description": "",
  "costBase": 100,
  "tier": 1,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Cheetah's Speed Chester",
  "description": "",
  "costBase": 100,
  "tier": 1,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Python's Coil Patrick",
  "description": "",
  "costBase": 100,
  "tier": 1,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Cobra's Strike Clifford",
  "description": "",
  "costBase": 100,
  "tier": 1,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Ironclad Ian",
  "description": "",
  "costBase": 100,
  "tier": 2,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Quick Draw Quentin",
  "description": "",
  "costBase": 100,
  "tier": 2,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Brass Knuckle Brandon",
  "description": "",
  "costBase": 100,
  "tier": 2,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Viper's Venom Vincent",
  "description": "",
  "costBase": 100,
  "tier": 2,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Raging Bull Roland",
  "description": "",
  "costBase": 100,
  "tier": 2,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Savage Wolf Seymour",
  "description": "",
  "costBase": 100,
  "tier": 2,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Brutal Bear Bernard",
  "description": "",
  "costBase": 100,
  "tier": 2,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Grizzly's Grasp Graham",
  "description": "",
  "costBase": 100,
  "tier": 2,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Puma's Pounce Palmer",
  "description": "",
  "costBase": 100,
  "tier": 2,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Thunder Kick Tyson",
  "description": "",
  "costBase": 100,
  "tier": 2,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Tornado's Twirl Trevor",
  "description": "",
  "costBase": 100,
  "tier": 3,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Hurricane's Fury Hugh",
  "description": "",
  "costBase": 100,
  "tier": 3,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Avalanche Alex",
  "description": "",
  "costBase": 100,
  "tier": 3,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Maelstrom Max",
  "description": "",
  "costBase": 100,
  "tier": 3,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Cyclone's Strike Cyrus",
  "description": "",
  "costBase": 100,
  "tier": 3,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Inferno's Fist Ivan",
  "description": "",
  "costBase": 100,
  "tier": 3,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Volcanic Vance",
  "description": "",
  "costBase": 100,
  "tier": 3,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Meteor Strike Michael",
  "description": "",
  "costBase": 100,
  "tier": 3,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Comet's Tail Calvin",
  "description": "",
  "costBase": 100,
  "tier": 3,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Supernova Sam",
  "description": "",
  "costBase": 100,
  "tier": 3,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Pulsar Punch Peter",
  "description": "",
  "costBase": 100,
  "tier": 4,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Nebula's Wrath Neil",
  "description": "",
  "costBase": 100,
  "tier": 4,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Quasar Quick Quentin",
  "description": "",
  "costBase": 100,
  "tier": 4,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Galactic Gary",
  "description": "",
  "costBase": 100,
  "tier": 4,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Big Bang Barry",
  "description": "",
  "costBase": 100,
  "tier": 4,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Singularity Simon",
  "description": "",
  "costBase": 100,
  "tier": 4,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Dark Matter Darren",
  "description": "",
  "costBase": 100,
  "tier": 4,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Quantum Quake Quincy",
  "description": "",
  "costBase": 100,
  "tier": 4,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Wormhole Walter",
  "description": "",
  "costBase": 100,
  "tier": 4,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Timebender Timothy",
  "description": "",
  "costBase": 100,
  "tier": 4,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Reality Ripper Randall",
  "description": "",
  "costBase": 100,
  "tier": 5,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Dimensional Daryl",
  "description": "",
  "costBase": 100,
  "tier": 5,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Multiverse Morris",
  "description": "",
  "costBase": 100,
  "tier": 5,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Astral Fist Alfred",
  "description": "",
  "costBase": 100,
  "tier": 5,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Cosmic Carl",
  "description": "",
  "costBase": 100,
  "tier": 5,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Star Slayer Stanley",
  "description": "",
  "costBase": 100,
  "tier": 5,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Galactic Goliath Greg",
  "description": "",
  "costBase": 100,
  "tier": 5,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Nebula Nightmare Norman",
  "description": "",
  "costBase": 100,
  "tier": 5,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Cosmic Crusher Curtis",
  "description": "",
  "costBase": 100,
  "tier": 5,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Starcrusher Steve",
  "description": "",
  "costBase": 100,
  "tier": 5,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Solar Sledge Seth",
  "description": "",
  "costBase": 100,
  "tier": 6,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Lunar Lancer Luke",
  "description": "",
  "costBase": 100,
  "tier": 6,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Stellar Striker Stuart",
  "description": "",
  "costBase": 100,
  "tier": 6,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Constellation Crusher Connor",
  "description": "",
  "costBase": 100,
  "tier": 6,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Galactic Grappler Graham",
  "description": "",
  "costBase": 100,
  "tier": 6,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Asteroid Annihilator Aaron",
  "description": "",
  "costBase": 100,
  "tier": 6,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Nova Nuker Nathaniel",
  "description": "",
  "costBase": 100,
  "tier": 6,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Comet Crusher Cameron",
  "description": "",
  "costBase": 100,
  "tier": 6,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Solar Smasher Sherman",
  "description": "",
  "costBase": 100,
  "tier": 6,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Galaxy Gasher Gilbert",
  "description": "",
  "costBase": 100,
  "tier": 6,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Dark Hole Derek",
  "description": "",
  "costBase": 100,
  "tier": 7,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Pulsar Pummeler Paul",
  "description": "",
  "costBase": 100,
  "tier": 7,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Cosmic Cataclysm Collin",
  "description": "",
  "costBase": 100,
  "tier": 7,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Black Hole Buster Benjamin",
  "description": "",
  "costBase": 100,
  "tier": 7,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Universe Unraveler Ulysses",
  "description": "",
  "costBase": 100,
  "tier": 7,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Time Torrent Thomas",
  "description": "",
  "costBase": 100,
  "tier": 7,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Dimensional Devastator Dexter",
  "description": "",
  "costBase": 100,
  "tier": 7,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Wormhole Warrior Warren",
  "description": "",
  "costBase": 100,
  "tier": 7,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Quantum Quake Quincy",
  "description": "",
  "costBase": 100,
  "tier": 7,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Reality Ripper Roger",
  "description": "",
  "costBase": 100,
  "tier": 7,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Space-time Slicer Silas",
  "description": "",
  "costBase": 100,
  "tier": 8,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Multiverse Mauler Marcus",
  "description": "",
  "costBase": 100,
  "tier": 8,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Infinity Igniter Irving",
  "description": "",
  "costBase": 100,
  "tier": 8,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Eternal Eradicator Elijah",
  "description": "",
  "costBase": 100,
  "tier": 8,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Omnipotent Owen",
  "description": "",
  "costBase": 100,
  "tier": 8,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Transcendent Travis",
  "description": "",
  "costBase": 100,
  "tier": 8,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Celestial Slayer Cecil",
  "description": "",
  "costBase": 100,
  "tier": 8,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Divine Destructor Daniel",
  "description": "",
  "costBase": 100,
  "tier": 8,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Godly Grappler Gordon",
  "description": "",
  "costBase": 100,
  "tier": 8,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Heavenly Havoc Hector",
  "description": "",
  "costBase": 100,
  "tier": 8,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Pantheon Puncher Patrick",
  "description": "",
  "costBase": 100,
  "tier": 9,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Immortal Impactor Ivan",
  "description": "",
  "costBase": 100,
  "tier": 9,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Eternal Eclipse Evan",
  "description": "",
  "costBase": 100,
  "tier": 9,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Cosmic Catastrophe Casey",
  "description": "",
  "costBase": 100,
  "tier": 9,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Divine Devastation Dennis",
  "description": "",
  "costBase": 100,
  "tier": 9,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Universal Uppercut Uri",
  "description": "",
  "costBase": 100,
  "tier": 9,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Celestial Cataclysm Carter",
  "description": "",
  "costBase": 100,
  "tier": 9,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Divine Desolation Douglas",
  "description": "",
  "costBase": 100,
  "tier": 9,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Ultimate Unmaker Ulysses",
  "description": "",
  "costBase": 100,
  "tier": 9,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Infinite Inferno Isaac",
  "description": "",
  "costBase": 100,
  "tier": 9,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Lightning Punch Lionel",
  "description": "",
  "costBase": 100,
  "tier": 10,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Primeval Powerhouse Preston",
  "description": "",
  "costBase": 100,
  "tier": 10,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Ultimate Obliterator Oliver",
  "description": "",
  "costBase": 100,
  "tier": 10,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Apex Annihilator Andy",
  "description": "",
  "costBase": 100,
  "tier": 10,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Omega Overthrower Orson",
  "description": "",
  "costBase": 100,
  "tier": 10,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Alpha Assailant Anthony",
  "description": "",
  "costBase": 100,
  "tier": 10,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Supreme Slayer Sean",
  "description": "",
  "costBase": 100,
  "tier": 10,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Prime Powerhouse Peter",
  "description": "",
  "costBase": 100,
  "tier": 10,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Godlike Goliath George",
  "description": "",
  "costBase": 100,
  "tier": 10,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}, {
  "name": "Universal Unmaker Uriel",
  "description": "",
  "costBase": 100,
  "tier": 10,
  "prodBase": 100,
  "baseFightTime": 0.1,
  "active": false,
  "visible": false
}];
},{}],"assets/gameData/skillData.json":[function(require,module,exports) {
module.exports = [{
  "id": 4001,
  "name": "Skill 1",
  "description": "fTrainProd*2",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 1,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": true,
  "connections": {
    "east": 4002,
    "south": 4003,
    "west": 4004
  },
  "mods": [{
    "id": 41011,
    "name": "skUpMod1",
    "type": "production",
    "priority": null,
    "sourceID": 4001,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }]
}, {
  "id": 4002,
  "name": "Skill 2",
  "description": "fTrainProd*3",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 1,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "east": 4011
  },
  "mods": [{
    "id": 41012,
    "name": "skUpMod2",
    "type": "production",
    "priority": null,
    "sourceID": 4002,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 3,
    "value": 3,
    "active": false
  }]
}, {
  "id": 4003,
  "name": "Skill 3",
  "description": "fTrainProd*4",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 1,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "south": 4005
  },
  "mods": [{
    "id": 41013,
    "name": "skUpMod3",
    "type": "production",
    "priority": null,
    "sourceID": 4003,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 4,
    "value": 4,
    "active": false
  }]
}, {
  "id": 4004,
  "name": "Skill 4",
  "description": "fTrainProd*5",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 1,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "east": 4001,
    "west": 4016
  },
  "mods": [{
    "id": 41014,
    "name": "skUpMod4",
    "type": "production",
    "priority": null,
    "sourceID": 4004,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 5,
    "value": 5,
    "active": false
  }]
}, {
  "id": 4005,
  "name": "Skill 5",
  "description": "fTrainProd*6",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 2,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "south": 4006
  },
  "mods": [{
    "id": 41015,
    "name": "skUpMod5",
    "type": "production",
    "priority": null,
    "sourceID": 4005,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 6,
    "value": 6,
    "active": false
  }]
}, {
  "id": 4006,
  "name": "Skill 6",
  "description": "fTrainProd*7",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 2,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "east": 4007,
    "south": 4008,
    "west": 4013
  },
  "mods": [{
    "id": 41016,
    "name": "skUpMod6",
    "type": "production",
    "priority": null,
    "sourceID": 4006,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 7,
    "value": 7,
    "active": false
  }]
}, {
  "id": 4007,
  "name": "Skill 7",
  "description": "fTrainProd*8",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 2,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "south": 4009
  },
  "mods": [{
    "id": 41017,
    "name": "skUpMod7",
    "type": "production",
    "priority": null,
    "sourceID": 4007,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 8,
    "value": 8,
    "active": false
  }]
}, {
  "id": 4008,
  "name": "Skill 8",
  "description": "fTrainProd*9",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 2,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {},
  "mods": [{
    "id": 41018,
    "name": "skUpMod8",
    "type": "production",
    "priority": null,
    "sourceID": 4008,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 9,
    "value": 9,
    "active": false
  }]
}, {
  "id": 4009,
  "name": "Skill 9",
  "description": "fTrainProd*10",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 2,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "south": 4010
  },
  "mods": [{
    "id": 41019,
    "name": "skUpMod9",
    "type": "production",
    "priority": null,
    "sourceID": 4009,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 10,
    "value": 10,
    "active": false
  }]
}, {
  "id": 4010,
  "name": "Skill 10",
  "description": "fTrainProd*11",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 3,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {},
  "mods": [{
    "id": 41020,
    "name": "skUpMod10",
    "type": "production",
    "priority": null,
    "sourceID": 4010,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 11,
    "value": 11,
    "active": false
  }]
}, {
  "id": 4011,
  "name": "Skill 11",
  "description": "fTrainProd*12",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 3,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "east": 4012
  },
  "mods": [{
    "id": 41021,
    "name": "skUpMod11",
    "type": "production",
    "priority": null,
    "sourceID": 4011,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 12,
    "value": 12,
    "active": false
  }]
}, {
  "id": 4012,
  "name": "Skill 12",
  "description": "fTrainProd*13",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 3,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "south": 4014
  },
  "mods": [{
    "id": 41022,
    "name": "skUpMod12",
    "type": "production",
    "priority": null,
    "sourceID": 4012,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 13,
    "value": 13,
    "active": false
  }]
}, {
  "id": 4013,
  "name": "Skill 13",
  "description": "fTrainProd*14",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 3,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {},
  "mods": [{
    "id": 41023,
    "name": "skUpMod13",
    "type": "production",
    "priority": null,
    "sourceID": 4013,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 14,
    "value": 14,
    "active": false
  }]
}, {
  "id": 4014,
  "name": "Skill 14",
  "description": "fTrainProd*15",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 3,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "south": 4015
  },
  "mods": [{
    "id": 41024,
    "name": "skUpMod14",
    "type": "production",
    "priority": null,
    "sourceID": 4014,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 15,
    "value": 15,
    "active": false
  }]
}, {
  "id": 4015,
  "name": "Skill 15",
  "description": "fTrainProd*16",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 4,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {},
  "mods": [{
    "id": 41025,
    "name": "skUpMod15",
    "type": "production",
    "priority": null,
    "sourceID": 4015,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 16,
    "value": 16,
    "active": false
  }]
}, {
  "id": 4016,
  "name": "Skill 16",
  "description": "fTrainProd*30",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 4,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "west": 4017
  },
  "mods": [{
    "id": 41026,
    "name": "skUpMod15",
    "type": "production",
    "priority": null,
    "sourceID": 4016,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 30,
    "value": 30,
    "active": false
  }]
}, {
  "id": 4017,
  "name": "Skill 17",
  "description": "fTrainProd*31",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 4,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {
    "south": 4018
  },
  "mods": [{
    "id": 41027,
    "name": "skUpMod15",
    "type": "production",
    "priority": null,
    "sourceID": 4017,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 31,
    "value": 31,
    "active": false
  }]
}, {
  "id": 4018,
  "name": "Skill 18",
  "description": "fTrainProd*32",
  "level": 0,
  "maxLevel": 1,
  "costType": "skillpoint",
  "costBase": 4,
  "costGrowthRate": 1.2,
  "prodType": null,
  "prodBase": null,
  "prodGrowthRate": null,
  "active": false,
  "connections": {},
  "mods": [{
    "id": 41028,
    "name": "skUpMod15",
    "type": "production",
    "priority": null,
    "sourceID": 4018,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 32,
    "value": 32,
    "active": false
  }]
}];
},{}],"assets/gameData/zoneData.json":[function(require,module,exports) {
module.exports = [{
  "id": 9001,
  "regionID": 1010001,
  "name": "Turtle Hatchling",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 1,
  "active": true,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9002,
  "regionID": 1010001,
  "name": "Beach Chicken",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9001,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9003,
  "regionID": 1010001,
  "name": "Adult Turtle",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9002,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9004,
  "regionID": 1010001,
  "name": "Seagull",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9003,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9005,
  "regionID": 1010001,
  "name": "Wild Boar",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9004,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9006,
  "regionID": 1010001,
  "name": "Stingray",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9005,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9007,
  "regionID": 1010001,
  "name": "Emerald Fox",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9006,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9008,
  "regionID": 1010001,
  "name": "Baby Eel",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9006,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9009,
  "regionID": 1010001,
  "name": "Adolescent Shark",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9008,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9021,
  "regionID": 1010002,
  "name": "Giant Eagle",
  "description": "df",
  "costType": "force",
  "costBase": 100,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9022,
  "regionID": 1010002,
  "name": "Wolf",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9021,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9023,
  "regionID": 1010002,
  "name": "Black Bear",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9022,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9024,
  "regionID": 1010002,
  "name": "Chimpanzee",
  "description": "description",
  "costType": "wisdom",
  "costBase": 1000,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9023,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9025,
  "regionID": 1010002,
  "name": "Silverback",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9024,
  "angleFromParent": 160,
  "distanceFromParent": 150
}, {
  "id": 9027,
  "regionID": 1010002,
  "name": "Polar Bear",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9025,
  "angleFromParent": 90,
  "distanceFromParent": 90
}, {
  "id": 9026,
  "regionID": 1010002,
  "name": "Ruby Tiger",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9023,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9041,
  "regionID": 1010003,
  "name": "Goat Demon",
  "description": "df",
  "costType": "force",
  "costBase": 100,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9042,
  "regionID": 1010003,
  "name": "Gargoyle",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9041,
  "angleFromParent": 180,
  "distanceFromParent": 130
}, {
  "id": 9043,
  "regionID": 1010003,
  "name": "Pterodactyl Hatchling",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9042,
  "angleFromParent": 180,
  "distanceFromParent": 130
}, {
  "id": 9044,
  "regionID": 1010003,
  "name": "Griffon",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9043,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9045,
  "regionID": 1010003,
  "name": "Dragon Hatchling",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9044,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9046,
  "regionID": 1010003,
  "name": "Wyvern",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9045,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9047,
  "regionID": 1010003,
  "name": "Topaz Panther",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9044,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9048,
  "regionID": 1010003,
  "name": "Elder Pterodactyl",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "alphaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9046,
  "angleFromParent": 160,
  "distanceFromParent": 150
}, {
  "id": 9061,
  "regionID": 1010004,
  "name": "Jungle Troll",
  "description": "df",
  "costType": "force",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9062,
  "regionID": 1010004,
  "name": "Basilisk",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9061,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9063,
  "regionID": 1010004,
  "name": "Chimaera",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9062,
  "angleFromParent": 180,
  "distanceFromParent": 150
}, {
  "id": 9064,
  "regionID": 1010004,
  "name": "Mantis Warrior",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9063,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9065,
  "regionID": 1010004,
  "name": "Poison Wyrm",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9064,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9066,
  "regionID": 1010004,
  "name": "Jungle Hydra",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9065,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9067,
  "regionID": 1010004,
  "name": "Forest Spirit",
  "description": "description",
  "costType": "wisdom",
  "costBase": 500,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9066,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9068,
  "regionID": 1010004,
  "name": "Treant Elder",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9067,
  "angleFromParent": 180,
  "distanceFromParent": 150
}, {
  "id": 9069,
  "regionID": 1010004,
  "name": "Diamond Fox",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9067,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9081,
  "regionID": 1010005,
  "name": "Giant Scorpion",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9082,
  "regionID": 1010005,
  "name": "Sphynx",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9081,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9083,
  "regionID": 1010005,
  "name": "Sandworm",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9082,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9084,
  "regionID": 1010005,
  "name": "Desert Chimera",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9083,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9085,
  "regionID": 1010005,
  "name": "Anubian Jackal Warrior",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9084,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9086,
  "regionID": 1010005,
  "name": "Solar Serpent",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9085,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9087,
  "regionID": 1010005,
  "name": "Sapphire Jaguar",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9086,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9088,
  "regionID": 1010005,
  "name": "Desert Spirit",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9086,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9089,
  "regionID": 1010005,
  "name": "Ancient Mummy",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9088,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9101,
  "regionID": 1010006,
  "name": "Stone Elemental",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9102,
  "regionID": 1010006,
  "name": "Yeti",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9101,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9103,
  "regionID": 1010006,
  "name": "Frost Giant",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9102,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9104,
  "regionID": 1010006,
  "name": "White Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9103,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9105,
  "regionID": 1010006,
  "name": "Ice Spirit",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9104,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9106,
  "regionID": 1010006,
  "name": "Snow Beast",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9105,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9107,
  "regionID": 1010006,
  "name": "Obsidian Puma",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9106,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9108,
  "regionID": 1010006,
  "name": "Mountain Titan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9106,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9109,
  "regionID": 1010006,
  "name": "Frost Phoenix",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "betaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9108,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9121,
  "regionID": 1010007,
  "name": "Giant Squid",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9122,
  "regionID": 1010007,
  "name": "Killer Whale",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9121,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9123,
  "regionID": 1010007,
  "name": "Colossal Eel",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9122,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9124,
  "regionID": 1010007,
  "name": "Titan Ray",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9123,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9125,
  "regionID": 1010007,
  "name": "Island Turtle",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9124,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9126,
  "regionID": 1010007,
  "name": "Megalodon",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9125,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9127,
  "regionID": 1010007,
  "name": "Pearl Seahorse",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9126,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9128,
  "regionID": 1010007,
  "name": "Kraken",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9126,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9129,
  "regionID": 1010007,
  "name": "Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9128,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9141,
  "regionID": 1010008,
  "name": "Volcanic Dragon Hatchling",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9142,
  "regionID": 1010008,
  "name": "Magma Spider",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9141,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9143,
  "regionID": 1010008,
  "name": "Ember Bat",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9142,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9144,
  "regionID": 1010008,
  "name": "Lava Golem",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9143,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9145,
  "regionID": 1010008,
  "name": "Flame Wraith",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9144,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9146,
  "regionID": 1010008,
  "name": "Volcanic Dragon Adult",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9145,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9147,
  "regionID": 1010008,
  "name": "Opal Firetail",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9146,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9148,
  "regionID": 1010008,
  "name": "Phoenix",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9146,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9149,
  "regionID": 1010008,
  "name": "Volcanic Titan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9148,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9161,
  "regionID": 1010009,
  "name": "Velociraptor",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9162,
  "regionID": 1010009,
  "name": "Allosaurus",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9161,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9163,
  "regionID": 1010009,
  "name": "Triceratops",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9162,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9164,
  "regionID": 1010009,
  "name": "Ankylosaurus",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9163,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9165,
  "regionID": 1010009,
  "name": "Argentinosaurus",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9164,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9166,
  "regionID": 1010009,
  "name": "Carcharodontosaurus",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9165,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9167,
  "regionID": 1010009,
  "name": "Amber Raptor",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9166,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9168,
  "regionID": 1010009,
  "name": "Gigantosaurus",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9166,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9169,
  "regionID": 1010009,
  "name": "Spinosaurus",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "gammaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9168,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9181,
  "regionID": 1010010,
  "name": "Photon Specter",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9182,
  "regionID": 1010010,
  "name": "Magnetar Wyrm",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9181,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9183,
  "regionID": 1010010,
  "name": "Neutron Beast",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9182,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9184,
  "regionID": 1010010,
  "name": "Pulsar Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9183,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9185,
  "regionID": 1010010,
  "name": "delta Ray Gargoyle",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9184,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9186,
  "regionID": 1010010,
  "name": "Stellar Wraith",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9185,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9187,
  "regionID": 1010010,
  "name": "Quantum Tiger",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9186,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9188,
  "regionID": 1010010,
  "name": "Black Hole Serpent",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9186,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9189,
  "regionID": 1010010,
  "name": "Quasar Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9188,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9201,
  "regionID": 1010011,
  "name": "Gas Giant Elemental",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9202,
  "regionID": 1010011,
  "name": "Nebula Phantom",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9201,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9203,
  "regionID": 1010011,
  "name": "Cosmic Jellyfish",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9202,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9204,
  "regionID": 1010011,
  "name": "Star Cloud Beast",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9203,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9205,
  "regionID": 1010011,
  "name": "Astral Wyrm",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9204,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9206,
  "regionID": 1010011,
  "name": "Nebula Titan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9205,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9207,
  "regionID": 1010011,
  "name": "delta Beast",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9206,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9208,
  "regionID": 1010011,
  "name": "Star Cluster Entity",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9206,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9209,
  "regionID": 1010011,
  "name": "Nebula Serpent",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9208,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9221,
  "regionID": 1010012,
  "name": "Void Beast",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9222,
  "regionID": 1010012,
  "name": "Dark Matter Entity",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9221,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9223,
  "regionID": 1010012,
  "name": "Quantum Horror",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9222,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9224,
  "regionID": 1010012,
  "name": "Cosmic Anomaly",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9223,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9225,
  "regionID": 1010012,
  "name": "Temporal Wraith",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9224,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9226,
  "regionID": 1010012,
  "name": "Singularity Beast",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9225,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9227,
  "regionID": 1010012,
  "name": "Baryon Presence",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9226,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9228,
  "regionID": 1010012,
  "name": "Dimension Sightseer",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9226,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9229,
  "regionID": 1010012,
  "name": "Cosmic Horror",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "deltaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9228,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9241,
  "regionID": 1010013,
  "name": "Galactic Kraken",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9242,
  "regionID": 1010013,
  "name": "Cosmic Cyclone",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9241,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9243,
  "regionID": 1010013,
  "name": "Quantum Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9242,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9244,
  "regionID": 1010013,
  "name": "Celestial Phoenix",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9243,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9245,
  "regionID": 1010013,
  "name": "Star Forge Golem",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9244,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9246,
  "regionID": 1010013,
  "name": "Nebula Golem",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9245,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9247,
  "regionID": 1010013,
  "name": "Quark Plasma",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9246,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9248,
  "regionID": 1010013,
  "name": "Nebula Hydra",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9246,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9249,
  "regionID": 1010013,
  "name": "Stellar Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9248,
  "angleFromParent": 360,
  "distanceFromParent": 200
}, {
  "id": 9250,
  "regionID": 1010013,
  "name": "Black Hole Beast",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9249,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9251,
  "regionID": 1010013,
  "name": "Astral Wraith",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9250,
  "angleFromParent": 180,
  "distanceFromParent": 150
}, {
  "id": 9252,
  "regionID": 1010013,
  "name": "Cosmic Sphynx",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9251,
  "angleFromParent": 180,
  "distanceFromParent": 150
}, {
  "id": 9253,
  "regionID": 1010013,
  "name": "Dimensional Drake",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9252,
  "angleFromParent": 270,
  "distanceFromParent": 70
}, {
  "id": 9254,
  "regionID": 1010013,
  "name": "Galaxy Beast",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9253,
  "angleFromParent": 170,
  "distanceFromParent": 200
}, {
  "id": 9261,
  "regionID": 1010014,
  "name": "Core Titan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9262,
  "regionID": 1010014,
  "name": "Black Hole Entity",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9261,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9263,
  "regionID": 1010014,
  "name": "Neutron Star Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9262,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9264,
  "regionID": 1010014,
  "name": "Gravity Elemental",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9263,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9265,
  "regionID": 1010014,
  "name": "Space-Time Anomaly",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9264,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9266,
  "regionID": 1010014,
  "name": "Core Devourer",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9265,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9267,
  "regionID": 1010014,
  "name": "Cosmic Vortex",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9266,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9268,
  "regionID": 1010014,
  "name": "Quantum Mall-Walker",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9267,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9269,
  "regionID": 1010014,
  "name": "Stellar Golem",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9268,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9270,
  "regionID": 1010014,
  "name": "Photonic Fool",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9269,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9271,
  "regionID": 1010014,
  "name": "Galaxy Hydra",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9269,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9272,
  "regionID": 1010014,
  "name": "Cosmic Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9271,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9273,
  "regionID": 1010014,
  "name": "Galactic Entity",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "epsilonShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9272,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9281,
  "regionID": 1010015,
  "name": "Dark Matter Wraith",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9282,
  "regionID": 1010015,
  "name": "Quantum Entanglement Entity",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9281,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9283,
  "regionID": 1010015,
  "name": "Space-Time Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9282,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9284,
  "regionID": 1010015,
  "name": "Reality Shifter",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9283,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9285,
  "regionID": 1010015,
  "name": "Constellation Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9284,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9286,
  "regionID": 1010015,
  "name": "Multiverse Beast",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9285,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9287,
  "regionID": 1010015,
  "name": "Subspace Phenomenon",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9286,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9288,
  "regionID": 1010015,
  "name": "Universal Serpent",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9286,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9289,
  "regionID": 1010015,
  "name": "Star Serpent",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9288,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9290,
  "regionID": 1010015,
  "name": "Cosmic Kraken",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9289,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9291,
  "regionID": 1010015,
  "name": "Reality Warper",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9290,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9292,
  "regionID": 1010015,
  "name": "Cosmic Golem's Toe",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9291,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9293,
  "regionID": 1010015,
  "name": "Universal Entity Fragment",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9292,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9294,
  "regionID": 1010015,
  "name": "Nebula Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9293,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9295,
  "regionID": 1010015,
  "name": "Gas Cloud Beast",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9294,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9296,
  "regionID": 1010015,
  "name": "Space-Time Elemental",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9295,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9297,
  "regionID": 1010015,
  "name": "Cosmic Behemoth",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9296,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9298,
  "regionID": 1010015,
  "name": "Dark Matter Phoenix",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9297,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9299,
  "regionID": 1010015,
  "name": "Cosmic Serial Killer",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "zetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9298,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9311,
  "regionID": 1010016,
  "name": "Supernova Specter",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9312,
  "regionID": 1010016,
  "name": "Nebula Consumer",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9311,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9313,
  "regionID": 1010016,
  "name": "Celestial Pulsar",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9312,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9314,
  "regionID": 1010016,
  "name": "Galactic Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9313,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9315,
  "regionID": 1010016,
  "name": "Stellar Drifter",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9314,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9316,
  "regionID": 1010016,
  "name": "Quasar Hydra",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9315,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9317,
  "regionID": 1010016,
  "name": "Cosmic Nebula",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9316,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9318,
  "regionID": 1010016,
  "name": "Astral Titan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9316,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9319,
  "regionID": 1010016,
  "name": "Binary Star Beast",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9318,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9320,
  "regionID": 1010016,
  "name": "Nebula Phoenix",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9319,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9341,
  "regionID": 1010017,
  "name": "Dark Matter Anomaly",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9342,
  "regionID": 1010017,
  "name": "Intergalactic Specter",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9341,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9343,
  "regionID": 1010017,
  "name": "Void Serpent",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9342,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9344,
  "regionID": 1010017,
  "name": "Galactic Rift",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9343,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9345,
  "regionID": 1010017,
  "name": "Cosmic Singularity",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9344,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9346,
  "regionID": 1010017,
  "name": "Interstellar Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9345,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9347,
  "regionID": 1010017,
  "name": "Quasar Elemental",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9346,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9348,
  "regionID": 1010017,
  "name": "Dark Energy Beast",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9346,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9349,
  "regionID": 1010017,
  "name": "Celestial Serpent",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9348,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9350,
  "regionID": 1010017,
  "name": "Astral Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "etaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9349,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9371,
  "regionID": 1010018,
  "name": "Galactic Wanderer",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9372,
  "regionID": 1010018,
  "name": "Supermassive Serpent",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9371,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9373,
  "regionID": 1010018,
  "name": "Cosmic Core Guardian",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9372,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9374,
  "regionID": 1010018,
  "name": "Phase Dancer",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9373,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9375,
  "regionID": 1010018,
  "name": "Supercluster Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9374,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9376,
  "regionID": 1010018,
  "name": "Hypernova Wraith",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9375,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9377,
  "regionID": 1010018,
  "name": "Quantum Specter",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9376,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9378,
  "regionID": 1010018,
  "name": "Interdimensional Behemoth",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9376,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9379,
  "regionID": 1010018,
  "name": "Multiversal Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9378,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9380,
  "regionID": 1010018,
  "name": "Singularity Hydra",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9379,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9401,
  "regionID": 1010019,
  "name": "Extragalactic Anomaly",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9402,
  "regionID": 1010019,
  "name": "Intergalactic Rift",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9401,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9403,
  "regionID": 1010019,
  "name": "Dark Matter Hydra",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9402,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9404,
  "regionID": 1010019,
  "name": "Extragalactic Core",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9403,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9405,
  "regionID": 1010019,
  "name": "Hypernova Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9404,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9406,
  "regionID": 1010019,
  "name": "Quantum Behemoth",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9405,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9407,
  "regionID": 1010019,
  "name": "Celestial Nexus",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9406,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9408,
  "regionID": 1010019,
  "name": "Multiverse Serpent",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9406,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9409,
  "regionID": 1010019,
  "name": "Galactic Nexus",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9408,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9410,
  "regionID": 1010019,
  "name": "Extragalactic Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "thetaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9409,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9431,
  "regionID": 1010020,
  "name": "Cosmic Filament Guardian",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9432,
  "regionID": 1010020,
  "name": "Interdimensional Serpent",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9431,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9433,
  "regionID": 1010020,
  "name": "Quantum Nexus",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9432,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9434,
  "regionID": 1010020,
  "name": "Filament Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9433,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9435,
  "regionID": 1010020,
  "name": "Celestial Behemoth",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9434,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9436,
  "regionID": 1010020,
  "name": "Multiverse Nexus",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9435,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9437,
  "regionID": 1010020,
  "name": "Dimensional Hydra",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9436,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9438,
  "regionID": 1010020,
  "name": "Cosmic Filament Wraith",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9436,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9439,
  "regionID": 1010020,
  "name": "Universal Nexus",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9438,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9440,
  "regionID": 1010020,
  "name": "Filament Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9439,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9461,
  "regionID": 1010021,
  "name": "Void Nexus",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9462,
  "regionID": 1010021,
  "name": "Event Horizon Surfer",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9461,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9463,
  "regionID": 1010021,
  "name": "Interdimensional Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9462,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9464,
  "regionID": 1010021,
  "name": "Quartic Anomaly",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9463,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9465,
  "regionID": 1010021,
  "name": "Multiversal Serpent",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9464,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9466,
  "regionID": 1010021,
  "name": "Dimensional Nexus",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9465,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9467,
  "regionID": 1010021,
  "name": "Celestial Hydra",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9466,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9468,
  "regionID": 1010021,
  "name": "Filamentary Wraith",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9466,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9469,
  "regionID": 1010021,
  "name": "Quantum Ant",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "iotaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9468,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9470,
  "regionID": 1010021,
  "name": "Interfilament Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "iotaShard",
  "zoneType": "boss",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9469,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9501,
  "regionID": 1010022,
  "name": "Void Elemental",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": null,
  "angleFromParent": null,
  "distanceFromParent": null
}, {
  "id": 9502,
  "regionID": 1010022,
  "name": "Reality Beast",
  "description": "description",
  "costType": "force",
  "costBase": 500,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9501,
  "angleFromParent": 360,
  "distanceFromParent": 130
}, {
  "id": 9503,
  "regionID": 1010022,
  "name": "Temporal Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9502,
  "angleFromParent": 120,
  "distanceFromParent": 80
}, {
  "id": 9504,
  "regionID": 1010022,
  "name": "Multiverse Titan",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9503,
  "angleFromParent": 150,
  "distanceFromParent": 120
}, {
  "id": 9505,
  "regionID": 1010022,
  "name": "Quantum Phoenix",
  "description": "description",
  "costType": "force",
  "costBase": 1000,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9504,
  "angleFromParent": 360,
  "distanceFromParent": 140
}, {
  "id": 9506,
  "regionID": 1010022,
  "name": "Cosmic Golem",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9505,
  "angleFromParent": 0,
  "distanceFromParent": 150
}, {
  "id": 9507,
  "regionID": 1010022,
  "name": "Universal Entity",
  "description": "description",
  "costType": "energy",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9506,
  "angleFromParent": 0,
  "distanceFromParent": 150,
  "isUnlockedByParent": false,
  "zoneType": "sideBoss"
}, {
  "id": 9508,
  "regionID": 1010022,
  "name": "Reality Wraith",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9506,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9509,
  "regionID": 1010022,
  "name": "Temporal Wyrm",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9508,
  "angleFromParent": 180,
  "distanceFromParent": 130
}, {
  "id": 9510,
  "regionID": 1010022,
  "name": "Quantum Kraken",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9509,
  "angleFromParent": 180,
  "distanceFromParent": 130
}, {
  "id": 9511,
  "regionID": 1010022,
  "name": "Universal Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9510,
  "angleFromParent": 180,
  "distanceFromParent": 130
}, {
  "id": 9512,
  "regionID": 1010022,
  "name": "Cosmic Hydra",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9511,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9513,
  "regionID": 1010022,
  "name": "Dimension Shifter",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9512,
  "angleFromParent": 360,
  "distanceFromParent": 130
}, {
  "id": 9514,
  "regionID": 1010022,
  "name": "Temporal Titan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9513,
  "angleFromParent": 360,
  "distanceFromParent": 130
}, {
  "id": 9515,
  "regionID": 1010022,
  "name": "Quantum Sphinx",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9514,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9516,
  "regionID": 1010022,
  "name": "Universal Griffin",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9515,
  "angleFromParent": 180,
  "distanceFromParent": 130
}, {
  "id": 9517,
  "regionID": 1010022,
  "name": "Dimension Drake",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9516,
  "angleFromParent": 180,
  "distanceFromParent": 130
}, {
  "id": 9518,
  "regionID": 1010022,
  "name": "Cosmic Chimera",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9517,
  "angleFromParent": 180,
  "distanceFromParent": 130
}, {
  "id": 9519,
  "regionID": 1010022,
  "name": "Universsal Phoenix",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9518,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9520,
  "regionID": 1010022,
  "name": "Multiversal Wyrm",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9519,
  "angleFromParent": 360,
  "distanceFromParent": 130
}, {
  "id": 9521,
  "regionID": 1010022,
  "name": "Dimension Leviathan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9520,
  "angleFromParent": 360,
  "distanceFromParent": 130
}, {
  "id": 9522,
  "regionID": 1010022,
  "name": "Multiverse Behemoth",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9521,
  "angleFromParent": 360,
  "distanceFromParent": 130
}, {
  "id": 9523,
  "regionID": 1010022,
  "name": "Cosmic Titan",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9522,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9524,
  "regionID": 1010022,
  "name": "Universal Dragon",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9523,
  "angleFromParent": 150,
  "distanceFromParent": 80
}, {
  "id": 9525,
  "regionID": 1010022,
  "name": "Multiverse Golem",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "parentID": 9524,
  "angleFromParent": 90,
  "distanceFromParent": 80
}, {
  "id": 9526,
  "regionID": 1010022,
  "name": "Celestial God",
  "description": "description",
  "costType": "force",
  "costBase": 100,
  "prodType": "kappaShard",
  "prodBase": 1,
  "baseConquestTime": 0.1,
  "zoneType": "boss",
  "parentID": 9525,
  "angleFromParent": 0,
  "distanceFromParent": 150
}];
},{}],"assets/gameData/regionData.json":[function(require,module,exports) {
module.exports = [{
  "id": 1010001,
  "worldID": 1000001,
  "name": "Beach Paradise",
  "shardType": "alphaShard",
  "active": true
}, {
  "id": 1010002,
  "worldID": 1000001,
  "name": "Upper Grasslands",
  "shardType": "alphaShard"
}, {
  "id": 1010003,
  "worldID": 1000001,
  "name": "Coastal Cliffs",
  "shardType": "alphaShard"
}, {
  "id": 1010004,
  "worldID": 1000002,
  "name": "Dense Jungle",
  "shardType": "betaShard"
}, {
  "id": 1010005,
  "worldID": 1000002,
  "name": "Massive Desert",
  "shardType": "betaShard"
}, {
  "id": 1010006,
  "worldID": 1000002,
  "name": "Grand Mountain",
  "shardType": "betaShard"
}, {
  "id": 1010007,
  "worldID": 1000003,
  "name": "Oceanic Depths",
  "shardType": "gammaShard"
}, {
  "id": 1010008,
  "worldID": 1000003,
  "name": "Volcanic Range",
  "shardType": "gammaShard"
}, {
  "id": 1010009,
  "worldID": 1000003,
  "name": "Primordial Jungle",
  "shardType": "gammaShard"
}, {
  "id": 1010010,
  "worldID": 1000004,
  "name": "Pulsar Fields",
  "shardType": "deltaShard"
}, {
  "id": 1010011,
  "worldID": 1000004,
  "name": "Nebula Clouds",
  "shardType": "deltaShard"
}, {
  "id": 1010012,
  "worldID": 1000004,
  "name": "Interstellar Void",
  "shardType": "deltaShard"
}, {
  "id": 1010013,
  "worldID": 1000005,
  "name": "Outer Rim",
  "shardType": "epsilonShard"
}, {
  "id": 1010014,
  "worldID": 1000005,
  "name": "Galactic Core",
  "shardType": "epsilonShard"
}, {
  "id": 1010015,
  "worldID": 1000006,
  "name": "Local Group Region",
  "shardType": "epsilonShard"
}, {
  "id": 1010016,
  "worldID": 1000007,
  "name": "Stellar Expanse",
  "shardType": "zetaShard"
}, {
  "id": 1010017,
  "worldID": 1000007,
  "name": "Intercluster Void",
  "shardType": "zetaShard"
}, {
  "id": 1010018,
  "worldID": 1000008,
  "name": "Supercluster Core",
  "shardType": "zetaShard"
}, {
  "id": 1010019,
  "worldID": 1000008,
  "name": "Extragalactic Halo",
  "shardType": "zetaShard"
}, {
  "id": 1010020,
  "worldID": 1000009,
  "name": "Filament Nexus",
  "shardType": "zetaShard"
}, {
  "id": 1010021,
  "worldID": 1000009,
  "name": "Interfilament Void",
  "shardType": "zetaShard"
}, {
  "id": 1010022,
  "worldID": 1000010,
  "name": "Universal Region",
  "shardType": "zetaShard"
}, {
  "id": 1010023,
  "worldID": 1000011,
  "name": "Divine Realm",
  "shardType": "zetaShard"
}, {
  "id": 1010024,
  "worldID": 1000011,
  "name": "Multiverse",
  "shardType": "zetaShard"
}, {
  "id": 1010025,
  "worldID": 1000011,
  "name": "Dimensions Unknown",
  "shardType": "zetaShard"
}];
},{}],"assets/gameData/worldData.json":[function(require,module,exports) {
module.exports = [{
  "id": 1000001,
  "name": "Peninsula",
  "active": true
}, {
  "id": 1000002,
  "name": "Continent"
}, {
  "id": 1000003,
  "name": "Planet"
}, {
  "id": 1000004,
  "name": "Spiral Arm"
}, {
  "id": 1000005,
  "name": "Galaxy"
}, {
  "id": 1000006,
  "name": "Galaxy Group"
}, {
  "id": 1000007,
  "name": "Galaxy Cluster"
}, {
  "id": 1000008,
  "name": "Supercluster"
}, {
  "id": 1000009,
  "name": "Cosmic Filament"
}, {
  "id": 1000010,
  "name": "Universe"
}, {
  "id": 1000011,
  "name": "Beyond"
}];
},{}],"assets/gameData/artifactData.json":[function(require,module,exports) {
module.exports = [{
  "id": 5010,
  "name": "Garden Gnome Hat",
  "evolutionTier": 1,
  "gearType": "Helm",
  "description": "description",
  "costType": "alphaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5011,
  "active": false,
  "visible": false,
  "mods": [{
    "id": 5510,
    "name": "aTarMod1",
    "type": "production",
    "priority": null,
    "sourceID": 5010,
    "sourceCalcType": "add",
    "targetType": "allTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }]
}, {
  "id": 5011,
  "name": "Bronze Colander Crown",
  "evolutionTier": 2,
  "gearType": "Helm",
  "description": "description",
  "costType": "alphaShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5012,
  "active": false,
  "visible": false,
  "mods": [{
    "id": 5511,
    "name": "aTarMod1",
    "type": "production",
    "priority": null,
    "sourceID": 5011,
    "sourceCalcType": "add",
    "targetType": "allTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 22,
    "value": 22,
    "active": false
  }]
}, {
  "id": 5012,
  "name": "Wi-Fi Enabled Toaster Helmet",
  "evolutionTier": 3,
  "gearType": "Helm",
  "description": "description",
  "costType": "alphaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5013
}, {
  "id": 5013,
  "name": "The Ultimate Tin Foil Hat",
  "evolutionTier": 4,
  "gearType": "Helm",
  "description": "description",
  "costType": "alphaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}, {
  "id": 5020,
  "name": "String Cheese Necklace",
  "evolutionTier": 1,
  "gearType": "Amulet",
  "description": "description",
  "costType": "betaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.1,
  "nextEvolveID": 5021,
  "active": false,
  "visible": false,
  "mods": [{
    "id": 5520,
    "name": "aTarMod2",
    "type": "production",
    "priority": null,
    "sourceID": 5020,
    "sourceCalcType": "add",
    "targetType": "allTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }]
}, {
  "id": 5021,
  "name": "Bling Bling Pendant",
  "evolutionTier": 2,
  "gearType": "Amulet",
  "description": "description",
  "costType": "betaShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5022
}, {
  "id": 5022,
  "name": "Zip-Tie Tie",
  "evolutionTier": 3,
  "gearType": "Amulet",
  "description": "description",
  "costType": "alphaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5023
}, {
  "id": 5023,
  "name": "Glowing LED Scarf",
  "evolutionTier": 4,
  "gearType": "Amulet",
  "description": "description",
  "costType": "betaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}, {
  "id": 5030,
  "name": "Bottle Cap Stud",
  "evolutionTier": 1,
  "gearType": "LeftEarring",
  "description": "description",
  "costType": "gammaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.1,
  "nextEvolveID": 5031,
  "active": false,
  "visible": false,
  "mods": [{
    "id": 5530,
    "name": "aTarMod3",
    "type": "production",
    "priority": null,
    "sourceID": 5030,
    "sourceCalcType": "add",
    "targetType": "allTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }]
}, {
  "id": 5031,
  "name": "Swirly Aluminum Earring",
  "evolutionTier": 2,
  "gearType": "LeftEarring",
  "description": "description",
  "costType": "gammaShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5032
}, {
  "id": 5032,
  "name": "Bluetooth Earbud",
  "evolutionTier": 3,
  "gearType": "LeftEarring",
  "description": "description",
  "costType": "gammaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5033
}, {
  "id": 5033,
  "name": "Intergalactic Walkie-Talkie Stud",
  "evolutionTier": 4,
  "gearType": "LeftEarring",
  "description": "description",
  "costType": "gammaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}, {
  "id": 5040,
  "name": "Pasta Shell Earring",
  "evolutionTier": 1,
  "gearType": "RightEarring",
  "description": "description",
  "costType": "deltaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.1,
  "nextEvolveID": 5041,
  "active": false,
  "visible": false,
  "mods": [{
    "id": 5540,
    "name": "aTarMod4",
    "type": "production",
    "priority": null,
    "sourceID": 5040,
    "sourceCalcType": "add",
    "targetType": "allTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }]
}, {
  "id": 5041,
  "name": "Gold Spray-Painted Washer",
  "evolutionTier": 2,
  "gearType": "RightEarring",
  "description": "description",
  "costType": "deltaShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5042
}, {
  "id": 5042,
  "name": "Diamond Plastic Earring",
  "evolutionTier": 3,
  "gearType": "RightEarring",
  "description": "description",
  "costType": "deltaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5043
}, {
  "id": 5043,
  "name": "Subspace Transmission Tuner",
  "evolutionTier": 4,
  "gearType": "RightEarring",
  "description": "description",
  "costType": "deltaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}, {
  "id": 5050,
  "name": "Burlap Sack",
  "evolutionTier": 1,
  "gearType": "Armor",
  "description": "description",
  "costType": "epsilonShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.1,
  "nextEvolveID": 5051,
  "active": false,
  "visible": false,
  "mods": [{
    "id": 5550,
    "name": "aTarMod5",
    "type": "production",
    "priority": null,
    "sourceID": 5050,
    "sourceCalcType": "add",
    "targetType": "allTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }]
}, {
  "id": 5051,
  "name": "'100% Authentic' Leather Armor",
  "evolutionTier": 2,
  "gearType": "Armor",
  "description": "description",
  "costType": "epsilonShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5052
}, {
  "id": 5052,
  "name": "Steel Wool Sweater",
  "evolutionTier": 3,
  "gearType": "Armor",
  "description": "description",
  "costType": "epsilonShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5053
}, {
  "id": 5053,
  "name": "Tunic of Indistinguishable Colors",
  "evolutionTier": 4,
  "gearType": "Armor",
  "description": "description",
  "costType": "epsilonShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}, {
  "id": 5060,
  "name": "Duck Tape Wraps",
  "evolutionTier": 1,
  "gearType": "Gauntlets",
  "description": "description",
  "costType": "zetaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.1,
  "nextEvolveID": 5061,
  "active": false,
  "visible": false
}, {
  "id": 5061,
  "name": "Deluxe Oven Mitts",
  "evolutionTier": 2,
  "gearType": "Gauntlets",
  "description": "description",
  "costType": "zetaShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5062
}, {
  "id": 5062,
  "name": "Swiss Army Gauntlets",
  "evolutionTier": 3,
  "gearType": "Gauntlets",
  "description": "description",
  "costType": "zetaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5063
}, {
  "id": 5063,
  "name": "Robotic Finger Exercisers",
  "evolutionTier": 4,
  "gearType": "Gauntlets",
  "description": "description",
  "costType": "zetaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}, {
  "id": 5070,
  "name": "Cardboard Sandals",
  "evolutionTier": 1,
  "gearType": "Boots",
  "description": "description",
  "costType": "etaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.1,
  "nextEvolveID": 5071,
  "active": false,
  "visible": false
}, {
  "id": 5071,
  "name": "Boots of Unexpected Speed",
  "evolutionTier": 2,
  "gearType": "Boots",
  "description": "description",
  "costType": "etaShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5072
}, {
  "id": 5072,
  "name": "Hoverboard Sneakers",
  "evolutionTier": 3,
  "gearType": "Boots",
  "description": "description",
  "costType": "etaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5073
}, {
  "id": 5073,
  "name": "Differential Equations Boots",
  "evolutionTier": 4,
  "gearType": "Boots",
  "description": "description",
  "costType": "etaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}, {
  "id": 5080,
  "name": "Stick Ring",
  "evolutionTier": 1,
  "gearType": "Ring1",
  "description": "description",
  "costType": "thetaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.1,
  "nextEvolveID": 5081,
  "active": false,
  "visible": false
}, {
  "id": 5081,
  "name": "Ring Pop",
  "evolutionTier": 2,
  "gearType": "Ring1",
  "description": "description",
  "costType": "thetaShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5082
}, {
  "id": 5082,
  "name": "Electrically Charged Friendship Band",
  "evolutionTier": 3,
  "gearType": "Ring1",
  "description": "description",
  "costType": "thetaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5083
}, {
  "id": 5083,
  "name": "Finger-Toe Ring",
  "evolutionTier": 4,
  "gearType": "Ring1",
  "description": "description",
  "costType": "thetaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}, {
  "id": 5090,
  "name": "Pebble Ring",
  "evolutionTier": 1,
  "gearType": "Ring2",
  "description": "description",
  "costType": "iotaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.1,
  "nextEvolveID": 5091,
  "active": false,
  "visible": false
}, {
  "id": 5091,
  "name": "Onion Ring",
  "evolutionTier": 2,
  "gearType": "Ring2",
  "description": "description",
  "costType": "iotaShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5092
}, {
  "id": 5092,
  "name": "Fitness Tracker Ring",
  "evolutionTier": 3,
  "gearType": "Ring2",
  "description": "description",
  "costType": "iotaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5093
}, {
  "id": 5093,
  "name": "Alternate Reality Mood Ring",
  "evolutionTier": 4,
  "gearType": "Ring2",
  "description": "description",
  "costType": "iotaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}, {
  "id": 5100,
  "name": "Broken Stick",
  "evolutionTier": 1,
  "gearType": "Weapon1",
  "description": "description",
  "costType": "kappaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.1,
  "nextEvolveID": 5101,
  "active": false,
  "visible": false
}, {
  "id": 5101,
  "name": "Damascus Steel Foam Sword ",
  "evolutionTier": 2,
  "gearType": "Weapon1",
  "description": "description",
  "costType": "kappaShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5102
}, {
  "id": 5102,
  "name": "Lighter Saber",
  "evolutionTier": 3,
  "gearType": "Weapon1",
  "description": "description",
  "costType": "kappaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5103
}, {
  "id": 5103,
  "name": "Star-Pulverizing Rubber Hammer",
  "evolutionTier": 4,
  "gearType": "Weapon1",
  "description": "description",
  "costType": "kappaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}, {
  "id": 5110,
  "name": "Potato Gun",
  "evolutionTier": 1,
  "gearType": "Weapon2",
  "description": "description",
  "costType": "lambdaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.1,
  "nextEvolveID": 5111,
  "active": false,
  "visible": false
}, {
  "id": 5111,
  "name": "Supersoaker 5000",
  "evolutionTier": 2,
  "gearType": "Weapon2",
  "description": "description",
  "costType": "lambdaShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5112
}, {
  "id": 5112,
  "name": "Railgun with Training Wheels",
  "evolutionTier": 3,
  "gearType": "Weapon2",
  "description": "description",
  "costType": "lambdaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5113
}, {
  "id": 5113,
  "name": "Singularity Squirt Gun",
  "evolutionTier": 4,
  "gearType": "Weapon2",
  "description": "description",
  "costType": "lambdaShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}, {
  "id": 5120,
  "name": "Rabbit's Foot",
  "evolutionTier": 1,
  "gearType": "Trinket",
  "description": "(Still attached to rabbit)",
  "costType": "muShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.1,
  "nextEvolveID": 5121,
  "active": false,
  "visible": false
}, {
  "id": 5121,
  "name": "Worry Stone",
  "evolutionTier": 2,
  "gearType": "Trinket",
  "description": "description",
  "costType": "muShard",
  "maxLevel": 20,
  "costBase": 100,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5122
}, {
  "id": 5122,
  "name": "Infinite Paperclip Chain",
  "evolutionTier": 3,
  "gearType": "Trinket",
  "description": "description",
  "costType": "muShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5,
  "nextEvolveID": 5123
}, {
  "id": 5123,
  "name": "Schrodinger's Paperweight",
  "evolutionTier": 4,
  "gearType": "Trinket",
  "description": "description",
  "costType": "muShard",
  "maxLevel": 20,
  "costBase": 10,
  "costGrowthRate": 1.5
}];
},{}],"assets/gameData/achievementData.json":[function(require,module,exports) {
module.exports = [{
  "id": 6001,
  "name": "powerLevel 1e4",
  "description": "1e4 powerLevel = fTrain prodMult * 2",
  "unlockCategory": "stat",
  "conditionType": "powerLevel",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6201,
    "name": "achieveMod1",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6001,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 2,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6002,
  "name": "powerLevel 1e8",
  "description": "1e8 powerLevel = fTrain prodMult * 20",
  "unlockCategory": "stat",
  "conditionType": "powerLevel",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e8,
  "setID": 6401,
  "mods": [{
    "id": 6202,
    "name": "achieveMod2",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6002,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6003,
  "name": "powerLevel 1e12",
  "description": "1e12 powerLevel = fTrain prodMult * 200",
  "unlockCategory": "stat",
  "conditionType": "powerLevel",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e12,
  "setID": 6402,
  "mods": [{
    "id": 6203,
    "name": "achieveMod3",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6003,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 200,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6004,
  "name": "powerLevel 1e15",
  "description": "1e15 powerLevel = fTrain prodMult * 2000",
  "unlockCategory": "stat",
  "conditionType": "powerLevel",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e15,
  "setID": 6403,
  "mods": [{
    "id": 6204,
    "name": "achieveMod4",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6004,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 2000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6005,
  "name": "powerLevel 1e18",
  "description": "1e18 powerLevel = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "powerLevel",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e18,
  "setID": 6403,
  "mods": [{
    "id": 6205,
    "name": "achieveMod5",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6005,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6006,
  "name": "wisdom 1e4",
  "description": "1e4 wisdom = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "wisdom",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 10000,
  "setID": 6403,
  "mods": [{
    "id": 6206,
    "name": "achieveMod6",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6006,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 20000,
    "active": false
  }]
}, {
  "id": 6007,
  "name": "world1Achieve",
  "description": "world1 progressed = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isProgressed",
  "dependentID": 1000001,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6403,
  "mods": [{
    "id": 6207,
    "name": "achieveMod7",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6007,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6008,
  "name": "world2Achieve",
  "description": "world2 progressed = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isProgressed",
  "dependentID": 1000002,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6403,
  "mods": [{
    "id": 6208,
    "name": "achieveMod8",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6008,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6009,
  "name": "world3Achieve",
  "description": "world3 progressed = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isProgressed",
  "dependentID": 1000003,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6403,
  "mods": [{
    "id": 6209,
    "name": "achieveMod9",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6009,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6010,
  "name": "world4Achieve",
  "description": "world4 progressed = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isProgressed",
  "dependentID": 1000004,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6403,
  "mods": [{
    "id": 6210,
    "name": "achieveMod10",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6010,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6011,
  "name": "world5Achieve",
  "description": "world5 progressed = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isProgressed",
  "dependentID": 1000005,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6403,
  "mods": [{
    "id": 6211,
    "name": "achieveMod11",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6011,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6012,
  "name": "world6Achieve",
  "description": "world6 progressed = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isProgressed",
  "dependentID": 1000006,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6403,
  "mods": [{
    "id": 6212,
    "name": "achieveMod12",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6012,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6013,
  "name": "world7Achieve",
  "description": "world7 progressed = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isProgressed",
  "dependentID": 1000007,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6403,
  "mods": [{
    "id": 6213,
    "name": "achieveMod13",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6013,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6014,
  "name": "world8Achieve",
  "description": "world8 progressed = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isProgressed",
  "dependentID": 1000008,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6403,
  "mods": [{
    "id": 6214,
    "name": "achieveMod14",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6014,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6015,
  "name": "world9Achieve",
  "description": "world9 progressed = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isProgressed",
  "dependentID": 1000009,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6403,
  "mods": [{
    "id": 6215,
    "name": "achieveMod15",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6015,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6016,
  "name": "world10Achieve",
  "description": "world10 progressed = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isProgressed",
  "dependentID": 1000010,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6403,
  "mods": [{
    "id": 6216,
    "name": "achieveMod16",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6016,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6021,
  "name": "lifetimeForceEarnedAchieve",
  "description": "lifetimeForceEarned = 10000 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "lifetimeForceEarned",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6221,
    "name": "achieveMod21",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6021,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6022,
  "name": "lifetimeWisdomEarnedAchieve",
  "description": "lifetimeWisdomEarned = 10000 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "lifetimeWisdomEarned",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6222,
    "name": "achieveMod22",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6022,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6023,
  "name": "lifetimeEnergyEarnedAchieve",
  "description": "lifetimeEnergyEarned = 10000 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "lifetimeEnergyEarned",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6223,
    "name": "achieveMod23",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6023,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6024,
  "name": "lifetimeDivineEarnedAchieve",
  "description": "lifetimeDivineEarned = 10000 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "lifetimeDivineEarned",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6224,
    "name": "achieveMod24",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6024,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6025,
  "name": "lifetimeCrystalEarnedAchieve",
  "description": "lifetimeCrystalEarned = 10000 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "lifetimeCrystalEarned",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6225,
    "name": "achieveMod25",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6025,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6026,
  "name": "lifetimeEssenceEarnedAchieve",
  "description": "lifetimeEssenceEarned = 10000 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "lifetimeEssenceEarned",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6226,
    "name": "achieveMod26",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6026,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6027,
  "name": "totalPlaytimeAchieve",
  "description": "totalPlaytime = 10000 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "totalPlaytime",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6227,
    "name": "achieveMod27",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6027,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6029,
  "name": "maxProgressionRegionAchieve",
  "description": "maxProgressionRegion = 10000 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "maxProgressionRegion",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6229,
    "name": "achieveMod29",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6029,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6031,
  "name": "lifetimeZoneCompletionsAchieve",
  "description": "lifetimeZoneCompletions = 10000 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "lifetimeZoneCompletions",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6231,
    "name": "achieveMod31",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6031,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6032,
  "name": "lifetimeRegionProgressionsAchieve",
  "description": "lifetimeRegionProgressions = 10000 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "lifetimeRegionProgressions",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6232,
    "name": "achieveMod32",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6032,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6034,
  "name": "maxTournamentRankAchieve",
  "description": "maxTournamentRank = 10000 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "maxTournamentRank",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1e4,
  "setID": 6401,
  "mods": [{
    "id": 6234,
    "name": "achieveMod34",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6034,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6035,
  "name": "lifetimeKillsAchieve",
  "description": "lifetimeKills = 5 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "lifetimeKills",
  "dependentID": null,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 5,
  "setID": 6401,
  "mods": [{
    "id": 6235,
    "name": "achieveMod35",
    "type": "prodBase",
    "priority": null,
    "sourceID": 6035,
    "sourceCalcType": "mult",
    "targetType": "forceTrain",
    "targetID": null,
    "runningCalcType": "mult",
    "baseValue": 20000,
    "value": 2,
    "active": false
  }]
}, {
  "id": 6050,
  "name": "sideBossAchieve1",
  "description": "Super Side Boss 1 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9007,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6051,
  "name": "sideBossAchieve2",
  "description": "Super Side Boss 2 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9026,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6051,
  "name": "sideBossAchieve3",
  "description": "Super Side Boss 3 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9047,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6052,
  "name": "sideBossAchieve4",
  "description": "Super Side Boss 4 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9069,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6053,
  "name": "sideBossAchieve5",
  "description": "Super Side Boss 5 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9087,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6054,
  "name": "sideBossAchieve6",
  "description": "Super Side Boss 6 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9107,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6055,
  "name": "sideBossAchieve7",
  "description": "Super Side Boss 7 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9127,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6056,
  "name": "sideBossAchieve8",
  "description": "Super Side Boss 8 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9147,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6057,
  "name": "sideBossAchieve9",
  "description": "Super Side Boss 9 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9167,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6058,
  "name": "sideBossAchieve10",
  "description": "Super Side Boss 10 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9187,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6059,
  "name": "sideBossAchieve11",
  "description": "Super Side Boss 11 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9207,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6060,
  "name": "sideBossAchieve12",
  "description": "Super Side Boss 12 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9227,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6061,
  "name": "sideBossAchieve13",
  "description": "Super Side Boss 13 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9247,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6062,
  "name": "sideBossAchieve14",
  "description": "Super Side Boss 14 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9270,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6063,
  "name": "sideBossAchieve15",
  "description": "Super Side Boss 15 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9287,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6064,
  "name": "sideBossAchieve16",
  "description": "Super Side Boss 16 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9317,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6065,
  "name": "sideBossAchieve17",
  "description": "Super Side Boss 17 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9347,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6066,
  "name": "sideBossAchieve18",
  "description": "Super Side Boss 18 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9377,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6067,
  "name": "sideBossAchieve19",
  "description": "Super Side Boss 19 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9407,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6068,
  "name": "sideBossAchieve20",
  "description": "Super Side Boss 20 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9437,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6069,
  "name": "sideBossAchieve21",
  "description": "Super Side Boss 21 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9467,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6070,
  "name": "sideBossAchieve22",
  "description": "Super Side Boss 22 defeated = fTrain prodMult * 20000",
  "unlockCategory": "id",
  "conditionType": "isDefeated",
  "dependentID": 9507,
  "radianceReward": 10,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": true,
  "setID": 6404
}, {
  "id": 6101,
  "name": "maxProgressionWorldAchieve",
  "description": "maxProgressionworld = 1 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "maxProgressionWorld",
  "dependentID": null,
  "radianceReward": 100,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 1,
  "setID": 6401
}, {
  "id": 6102,
  "name": "maxProgressionWorldAchieve",
  "description": "maxProgressionworld = 2 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "maxProgressionWorld",
  "dependentID": null,
  "radianceReward": 100,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 2,
  "setID": 6401
}, {
  "id": 6103,
  "name": "maxProgressionWorldAchieve",
  "description": "maxProgressionworld = 3 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "maxProgressionWorld",
  "dependentID": null,
  "radianceReward": 100,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 3,
  "setID": 6401
}, {
  "id": 6104,
  "name": "maxProgressionWorldAchieve",
  "description": "maxProgressionworld = 4 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "maxProgressionWorld",
  "dependentID": null,
  "radianceReward": 100,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 4,
  "setID": 6401
}, {
  "id": 6105,
  "name": "maxProgressionWorldAchieve",
  "description": "maxProgressionworld = 5 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "maxProgressionWorld",
  "dependentID": null,
  "radianceReward": 100,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 5,
  "setID": 6401
}, {
  "id": 6106,
  "name": "maxProgressionWorldAchieve",
  "description": "maxProgressionworld = 6 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "maxProgressionWorld",
  "dependentID": null,
  "radianceReward": 100,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 6,
  "setID": 6401
}, {
  "id": 6107,
  "name": "maxProgressionWorldAchieve",
  "description": "maxProgressionworld = 7 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "maxProgressionWorld",
  "dependentID": null,
  "radianceReward": 100,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 7,
  "setID": 6401
}, {
  "id": 6108,
  "name": "maxProgressionWorldAchieve",
  "description": "maxProgressionworld = 8 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "maxProgressionWorld",
  "dependentID": null,
  "radianceReward": 100,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 8,
  "setID": 6401
}, {
  "id": 6109,
  "name": "maxProgressionWorldAchieve",
  "description": "maxProgressionworld = 9 = fTrain prodMult * 20000",
  "unlockCategory": "stat",
  "conditionType": "maxProgressionWorld",
  "dependentID": null,
  "radianceReward": 100,
  "triggerType": "setActive",
  "triggerValue": null,
  "conditionValue": 9,
  "setID": 6401
}];
},{}],"assets/gameData/interfaceElementData.json":[function(require,module,exports) {
module.exports = [{
  "id": "row-stats",
  "variableName": "statsRow",
  "parent": "root",
  "tag": "div"
}, {
  "id": "settings-container",
  "variableName": "settingsContainer",
  "parent": "root",
  "tag": "div",
  "className": "container"
}, {
  "id": "multSettings",
  "variableName": "multSettings",
  "parent": "settings-container",
  "tag": "button"
}, {
  "id": "save",
  "variableName": "saveButton",
  "parent": "settings-container",
  "tag": "button"
}, {
  "id": "load",
  "variableName": "loadButton",
  "parent": "settings-container",
  "tag": "button"
}, {
  "id": "reset",
  "variableName": "resetButton",
  "parent": "settings-container",
  "tag": "button"
}, {
  "id": "complete-unlocks",
  "variableName": "completeUnlocksButton",
  "parent": "settings-container",
  "tag": "button"
}, {
  "id": "rebirth1",
  "variableName": "rebirth1Button",
  "parent": "settings-container",
  "tag": "button"
}, {
  "id": "rebirth2",
  "variableName": "rebirth2Button",
  "parent": "settings-container",
  "tag": "button"
}, {
  "id": "rebirth3",
  "variableName": "rebirth3Button",
  "parent": "settings-container",
  "tag": "button"
}, {
  "id": "tab-buttons",
  "variableName": "tabButtons",
  "parent": "root",
  "tag": "div"
}, {
  "id": "trainingTab",
  "variableName": "trainingTab",
  "parent": "tab-buttons",
  "tag": "button",
  "className": "tabButton"
}, {
  "id": "forgeTab",
  "variableName": "forgeUpgradesTab",
  "parent": "tab-buttons",
  "tag": "button",
  "className": "tabButton"
}, {
  "id": "skillsTab",
  "variableName": "skillsTab",
  "parent": "tab-buttons",
  "tag": "button",
  "className": "tabButton"
}, {
  "id": "explorationTab",
  "variableName": "explorationTab",
  "parent": "tab-buttons",
  "tag": "button",
  "className": "tabButton"
}, {
  "id": "essenceTab",
  "variableName": "essenceTab",
  "parent": "tab-buttons",
  "tag": "button",
  "className": "tabButton"
}, {
  "id": "achievementsTab",
  "variableName": "achievementsTab",
  "parent": "tab-buttons",
  "tag": "button",
  "className": "tabButton"
}, {
  "id": "radianceTab",
  "variableName": "radianceTab",
  "parent": "tab-buttons",
  "tag": "button",
  "className": "tabButton"
}, {
  "id": "settingsTab",
  "variableName": "settingsTab",
  "parent": "tab-buttons",
  "tag": "button",
  "className": "tabButton"
}, {
  "id": "main-window",
  "variableName": "mainWindow",
  "parent": "root",
  "tag": "div",
  "className": "main-window"
}, {
  "id": "training",
  "variableName": "trainingTabContent",
  "parent": "main-window",
  "tag": "div",
  "className": "content-tab"
}, {
  "id": "training-realm-buttons",
  "variableName": "trainingRealmButtons",
  "parent": "training",
  "tag": "div",
  "className": "realm-buttons-row"
}, {
  "id": "forceSubTab",
  "variableName": "force-tab-button",
  "parent": "training-realm-buttons",
  "tag": "button",
  "className": "realm-button"
}, {
  "id": "wisdomSubTab",
  "variableName": "wisdom-tab-button",
  "parent": "training-realm-buttons",
  "tag": "button",
  "className": "realm-button"
}, {
  "id": "energySubTab",
  "variableName": "energy-tab-button",
  "parent": "training-realm-buttons",
  "tag": "button",
  "className": "realm-button"
}, {
  "id": "divineSubTab",
  "variableName": "divine-tab-button",
  "parent": "training-realm-buttons",
  "tag": "button",
  "className": "realm-button"
}, {
  "id": "forge",
  "variableName": "upgradesTabContent",
  "parent": "main-window",
  "tag": "div",
  "className": "content-tab"
}, {
  "id": "forge-upgrades-columns",
  "variableName": "forgeUpgradesColumns",
  "parent": "forge",
  "tag": "div",
  "className": "content-tab-column-container"
}, {
  "id": "essence",
  "variableName": "essenceTabContent",
  "parent": "main-window",
  "tag": "div",
  "className": "content-tab"
}, {
  "id": "essence-columns",
  "variableName": "essenceColumns",
  "parent": "essence",
  "tag": "div",
  "className": "content-tab-column-container"
}, {
  "id": "essence-col1",
  "variableName": "essenceCol1",
  "parent": "essence-columns",
  "tag": "div",
  "className": "content-tab-col"
}, {
  "id": "essence-col2",
  "variableName": "essenceCol2",
  "parent": "essence-columns",
  "tag": "div",
  "className": "content-tab-col"
}, {
  "id": "skills",
  "variableName": "skillsTabContent",
  "parent": "main-window",
  "tag": "div",
  "className": "content-tab"
}, {
  "id": "skills-columns",
  "variableName": "skillsColumns",
  "parent": "skills",
  "tag": "div",
  "className": "content-tab-column-container"
}, {
  "id": "skills-col1",
  "variableName": "skillsCol1",
  "parent": "skills-columns",
  "tag": "div",
  "className": "content-tab-col"
}, {
  "id": "skills-col2",
  "variableName": "skillsCol2",
  "parent": "skills-columns",
  "tag": "div",
  "className": "content-tab-col"
}, {
  "id": "achievements",
  "variableName": "achievementsTabContent",
  "parent": "main-window",
  "tag": "div",
  "className": "content-tab"
}, {
  "id": "achievements-columns",
  "variableName": "achievementsColumns",
  "parent": "achievements",
  "tag": "div",
  "className": "content-tab-column-container"
}, {
  "id": "achievements-col1",
  "variableName": "achievementsCol1",
  "parent": "achievements-columns",
  "tag": "div",
  "className": "content-tab-col"
}, {
  "id": "achievements-col2",
  "variableName": "achievementsCol2",
  "parent": "achievements-columns",
  "tag": "div",
  "className": "content-tab-col"
}, {
  "id": "exploration",
  "variableName": "explorationTabContent",
  "parent": "main-window",
  "tag": "div",
  "className": "content-tab"
}, {
  "id": "exploration-tab-buttons",
  "variableName": "explorationTabButtons",
  "parent": "exploration",
  "tag": "div",
  "className": "realm-buttons-row"
}, {
  "id": "OdysseySubTab",
  "variableName": "OdysseySubTab",
  "parent": "exploration-tab-buttons",
  "tag": "button",
  "className": "exploration-tab-button"
}, {
  "id": "TournamentSubTab",
  "variableName": "TournamentSubTab",
  "parent": "exploration-tab-buttons",
  "tag": "button",
  "className": "exploration-tab-button"
}, {
  "id": "ArtifactsSubTab",
  "variableName": "ArtifactsSubTab",
  "parent": "exploration-tab-buttons",
  "tag": "button",
  "className": "exploration-tab-button"
}, {
  "id": "radiance",
  "variableName": "radianceTabContent",
  "parent": "main-window",
  "tag": "div",
  "className": "content-tab"
}, {
  "id": "radiance-columns",
  "variableName": "radianceColumns",
  "parent": "radiance",
  "tag": "div",
  "className": "content-tab-column-container"
}, {
  "id": "radiance-col1",
  "variableName": "radianceCol1",
  "parent": "radiance-columns",
  "tag": "div",
  "className": "content-tab-col"
}, {
  "id": "radiance-col2",
  "variableName": "radianceCol2",
  "parent": "radiance-columns",
  "tag": "div",
  "className": "content-tab-col"
}, {
  "id": "settings",
  "variableName": "settingsTabContent",
  "parent": "main-window",
  "tag": "div",
  "className": "content-tab"
}, {
  "id": "numberSettings",
  "variableName": "numberSettings",
  "parent": "settings",
  "tag": "select",
  "options": ["scientific", "engineering", "log10", "string", "verbose", "standard"]
}];
},{}],"assets/gameData/tabData.json":[function(require,module,exports) {
module.exports = [{
  "id": 110,
  "name": "training",
  "visible": true,
  "active": true,
  "subTabs": [{
    "id": 111,
    "name": "force",
    "visible": true,
    "active": true,
    "initialUnlockedFeatureIDs": [1001]
  }, {
    "id": 112,
    "name": "wisdom",
    "visible": false,
    "active": false,
    "initialUnlockedFeatureIDs": [611]
  }, {
    "id": 113,
    "name": "energy",
    "visible": false,
    "active": false,
    "initialUnlockedFeatureIDs": [2001]
  }, {
    "id": 114,
    "name": "divine",
    "visible": false,
    "active": false,
    "initialUnlockedFeatureIDs": [711]
  }]
}, {
  "id": 120,
  "name": "forge",
  "visible": false,
  "active": false,
  "initialUnlockedFeatureIDs": [10001, 10002, 10003, 10004, 10005]
}, {
  "id": 130,
  "name": "skills",
  "visible": false,
  "active": false
}, {
  "id": 140,
  "name": "exploration",
  "visible": false,
  "active": false,
  "subTabs": [{
    "id": 141,
    "name": "odyssey",
    "visible": true,
    "active": true,
    "initialUnlockedFeatureIDs": [1010001]
  }, {
    "id": 142,
    "name": "tournament",
    "visible": false,
    "active": false
  }, {
    "id": 143,
    "name": "artifacts",
    "visible": false,
    "active": false
  }]
}, {
  "id": 150,
  "name": "essence",
  "visible": false,
  "active": false
}, {
  "id": 160,
  "name": "achievements",
  "visible": false,
  "active": false
}, {
  "id": 180,
  "name": "radiance",
  "visible": false,
  "active": false
}, {
  "id": 170,
  "name": "settings",
  "visible": true,
  "active": true
}];
},{}],"assets/icons/info-icon.png":[function(require,module,exports) {
module.exports = "/info-icon.4d6acb27.png";
},{}],"main.js":[function(require,module,exports) {
var define;
"use strict";

var _break_eternityMin = _interopRequireDefault(require("./break_eternity.min.js"));
var _trainingData = _interopRequireDefault(require("./assets/gameData/trainingData.json"));
var _generatorData = _interopRequireDefault(require("./assets/gameData/generatorData.json"));
var _realmUpgradeData = _interopRequireDefault(require("./assets/gameData/realmUpgradeData.json"));
var _forgeUpgradeData = _interopRequireDefault(require("./assets/gameData/forgeUpgradeData.json"));
var _essenceUpgradeData = _interopRequireDefault(require("./assets/gameData/essenceUpgradeData.json"));
var _radianceUpgradeData = _interopRequireDefault(require("./assets/gameData/radianceUpgradeData.json"));
var _fighterData = _interopRequireDefault(require("./assets/gameData/fighterData.json"));
var _skillData = _interopRequireDefault(require("./assets/gameData/skillData.json"));
var _zoneData2 = _interopRequireDefault(require("./assets/gameData/zoneData.json"));
var _regionData = _interopRequireDefault(require("./assets/gameData/regionData.json"));
var _worldData = _interopRequireDefault(require("./assets/gameData/worldData.json"));
var _artifactData = _interopRequireDefault(require("./assets/gameData/artifactData.json"));
var _achievementData = _interopRequireDefault(require("./assets/gameData/achievementData.json"));
var _interfaceElementData = _interopRequireDefault(require("./assets/gameData/interfaceElementData.json"));
var _tabData = _interopRequireDefault(require("./assets/gameData/tabData.json"));
var _infoIcon = _interopRequireDefault(require("./assets/icons/info-icon.png"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
document.addEventListener('DOMContentLoaded', function () {
  window.game = new Game();
});

//process game when tab loses and regains focus
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') {
    window.lastHidden = Date.now();
  } else {
    var elapsedTime = Date.now() - window.lastHidden;
    window.game.processOffline(elapsedTime);
    // console.error(elapsedTime,"ms since lost focus");
  }
});
var Game = /*#__PURE__*/function () {
  function Game() {
    var _this = this;
    _classCallCheck(this, Game);
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
    this.eventManager.addListener('restart', function (state) {
      return _this.restart(state);
    });
    this.eventManager.addListener('updateHotkeyButtons', function () {
      return _this.updateHotkeyButtons();
    });
    this.initHotkeys();
    this.gameLoop();
  }
  _createClass(Game, [{
    key: "init",
    value: function init(state) {
      this.running = false;

      //initial game load state
      if (state === 0) {}

      //reset game state
      else if (state === -1) {}

      //run on all game state loads
      if (!this.eventManager) {
        this.eventManager = new EventManager();
      }
      this.gameManager = new GameManager(this.eventManager);
      this.builder = new Builder(this.eventManager, this.gameManager);
      this.gameStateManager = new GameStateManager(this.eventManager, this.gameManager);
      this.rewardManager = new RewardManager(this.eventManager, this.gameManager);
      this.ui = new GameUI(this.eventManager, this.gameManager, this.gameStateManager, this.rewardManager);
      this.gameStateManager.loadGameState(state);

      //if game loaded naturally, and a save file exists, process offline income
      if (state === 0 && localStorage.getItem('saveGame')) {
        this.processOffline();
      }
      this.gameManager.updateNewMultiplierValues(this.gameManager.multiplierString);
      this.updateHotkeyButtons();

      //empty builder once it has initialized and built everything
      this.builder = null;
      this.running = true;
    }
  }, {
    key: "restart",
    value: function restart(state) {
      var _this2 = this;
      this.running = false;
      this.clearRunningIntervals();
      this.clearUI();
      this.eventManager.clearAllListeners();
      this.clearGameObjects();
      this.init(state);
      this.restartRunningIntervals();

      //re-attach listeners
      this.eventManager.addListener('restart', function (state) {
        return _this2.restart(state);
      });
      this.eventManager.addListener('updateHotkeyButtons', function () {
        return _this2.updateHotkeyButtons();
      });
      this.lastIncomeUpdate = performance.now();
      this.lastUnlockCheck = performance.now();

      //if rebirth triggered restart, immediately perform a regular full save after game reloads
      if (state > 0) {
        this.gameStateManager.autosave();
      }
      this.running = true;
    }
  }, {
    key: "processOffline",
    value: function processOffline() {
      var lastSaveTime = this.gameManager.gameContent.player.lastSave;
      var currentTime = Date.now();
      var timeDifference = (currentTime - lastSaveTime) / 1000; //in seconds

      //calculate income and automations in 10 second steps if offline more than 10 seconds
      if (timeDifference > 10) {
        var totalTime = timeDifference;
        var remainder = totalTime % 10;
        console.log(new Date(currentTime).toLocaleString(), ": Window focus regained.", timeDifference, "seconds have passed since the last save, (", new Date(lastSaveTime).toLocaleString(), "). Processing offline gains");

        // let beforeOfflineData = this.createOfflineGainsComparisonObject();

        var processCount = 0;
        while (totalTime >= 10) {
          this.gameManager.calculateIncome(10);
          totalTime -= 10;
          processCount++;
        }
        if (remainder > 0) {
          this.gameManager.calculateIncome(remainder);
          totalTime -= remainder;
          processCount++;
        }
        console.log(processCount, "income and autobuy intervals completed");
        // this.displayOfflineGainsModal(beforeOfflineData);
      } else {
        console.log(new Date(currentTime).toLocaleString(), ": Window focus regained. Less than 10 seconds have passed since the last save, (", new Date(lastSaveTime).toLocaleString(), "). No offline process");
      }
    }
  }, {
    key: "displayOfflineGainsModal",
    value: function displayOfflineGainsModal(beforeOfflineData) {
      var afterOfflineData = this.createOfflineGainsComparisonObject();
      var span = document.getElementsByClassName("close")[0];
      var modal = document.getElementById("myModal");
      span.onclick = function () {
        modal.style.display = "none";
      };
      modal.style.display = "block";
      var modalContent = document.getElementById("modal-message");
      var textContent = '';
      for (var key in beforeOfflineData) {
        if (key !== 'trainingLevels') {
          var gain = afterOfflineData[key].minus(beforeOfflineData[key]);
          textContent += "".concat(key, " gained: ").concat(gain.toString(), "\n");
        } else {
          // Handle trainingLevels separately
          for (var trainingId in beforeOfflineData.trainingLevels) {
            var beforeTrainingLevel = beforeOfflineData.trainingLevels[trainingId];
            var afterTrainingLevel = afterOfflineData.trainingLevels[trainingId];
            var trainingGain = afterTrainingLevel.minus(beforeTrainingLevel);
            textContent += "Training Level (".concat(trainingId, ") gained: ").concat(trainingGain.toString(), "\n");
          }
        }
      }
      modalContent.textContent = textContent;
    }
  }, {
    key: "createOfflineGainsComparisonObject",
    value: function createOfflineGainsComparisonObject() {
      var player = this.gameManager.gameContent.player;
      var comparisonObject = {
        powerLevel: player.powerLevel,
        forceIncome: player.forceIncome,
        wisdomIncome: player.wisdomIncome,
        trainingLevels: {}
      };
      this.gameManager.gameContent.trainings.forEach(function (training) {
        comparisonObject.trainingLevels[training.id] = training.level;
      });
      return comparisonObject;
    }
  }, {
    key: "clearGameObjects",
    value: function clearGameObjects() {
      // Clear object references
      this.gameManager = null;
      // this.builder = null;
      this.gameStateManager = null;
      this.rewardManager = null;
      this.ui = null;
      this.eventManager = null;
    }
  }, {
    key: "clearRunningIntervals",
    value: function clearRunningIntervals() {
      var _iterator = _createForOfIteratorHelper(this.gameManager.gameContent.zones),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var zone = _step.value;
          zone.stopConquest();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (this.ui.renderIntervalId) {
        clearInterval(this.ui.renderIntervalId);
        this.ui.renderIntervalId = null;
      }
    }
  }, {
    key: "restartRunningIntervals",
    value: function restartRunningIntervals() {
      var _iterator2 = _createForOfIteratorHelper(this.gameManager.gameContent.zones),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var zone = _step2.value;
          if (zone.active && zone.isDefeated && zone.autoUnlocked) {
            zone.startConquest();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "clearUI",
    value: function clearUI() {
      var rootElement = document.getElementById('root');
      while (rootElement.firstChild) {
        rootElement.removeChild(rootElement.firstChild);
      }
    }
  }, {
    key: "gameLoop",
    value: function gameLoop() {
      if (!this.running) {
        return;
      }
      this.checkUnlocks();
      this.updateUI();
      this.updateIncome();
      var now = Date.now();
      if (!this.lastSaveTime || now - this.lastSaveTime >= 10000) {
        // milliseconds
        this.gameStateManager.autosave();
        this.lastSaveTime = now;
      }
      this.rewardManager.checkRewards();
      this.totalGameTime = Date.now() - this.gameStartTime;
      this.gameManager.gameContent.player.totalPlaytime = this.totalGameTime;
    }
  }, {
    key: "updateIncome",
    value: function updateIncome() {
      var currentTime = performance.now();
      if (currentTime - this.lastIncomeUpdate >= this.incomeUpdateInterval) {
        // Calculate deltaTime in seconds
        var deltaTime = (currentTime - this.lastIncomeUpdate) / 1000;

        //increase deltatime by player timeModifierUpgrade
        deltaTime *= this.gameManager.gameContent.player.timeModifierUpgrade;
        this.gameManager.calculateIncome(deltaTime);
        this.gameManager.updateNewMultiplierValues(this.gameManager.multiplierString);
        this.lastIncomeUpdate = currentTime;
      }
    }
  }, {
    key: "checkUnlocks",
    value: function checkUnlocks() {
      var currentTime = performance.now();
      // Check unlocks every 100 ms
      if (currentTime - this.lastUnlockCheck >= this.unlockCheckInterval) {
        this.gameManager.gameContent.unlockManager.checkUnlocks();
        this.lastUnlockCheck = currentTime;
      }
    }
  }, {
    key: "updateUI",
    value: function updateUI() {
      var _this3 = this;
      // Throttle the UI updates to every 100ms
      var throttledUpdateUI = this.throttle(function () {
        return _this3.ui.updateUI();
      }, this.uiUpdateInterval);
      throttledUpdateUI();

      // Call the gameLoop again using requestAnimationFrame
      requestAnimationFrame(function () {
        return _this3.gameLoop();
      });
    }
  }, {
    key: "throttle",
    value: function throttle(func, wait) {
      var context, args, prevArgs, argsChanged, result;
      var previous = 0;
      return function () {
        var now, remaining;
        if (wait) {
          now = Date.now();
          remaining = wait - (now - previous);
        }
        context = this;
        args = arguments;
        argsChanged = JSON.stringify(args) !== JSON.stringify(prevArgs);
        prevArgs = Object.assign({}, args);
        if (argsChanged || wait && (remaining <= 0 || remaining > wait)) {
          if (wait) {
            previous = now;
          }
          result = func.apply(context, args);
          context = args = null;
        }
        return result;
      };
    }
  }, {
    key: "initHotkeys",
    value: function initHotkeys() {
      var _this4 = this;
      setTimeout(function () {
        var hotkeyLetters = ['q', 'w', 'e', 'r', 't', 'y'];
        document.addEventListener('keydown', function (event) {
          if (event.key === 'Tab') {
            event.preventDefault(); // prevent the default action (scroll / move caret)

            // Get the list of active tabs
            var activeTabs = _this4.ui.getActiveTabs();
            if (activeTabs.length > 1) {
              var currentTabName = _this4.ui.currentTab;

              // Get the index of the current active tab in the active tabs list
              var currentIndex = activeTabs.findIndex(function (tab) {
                return tab.name === currentTabName;
              });
              var nextIndex;
              // If shift is held down, move to the previous tab; otherwise move to the next tab
              if (event.shiftKey) {
                // If we're at the first tab wrap around to the end, otherwise just subtract one
                nextIndex = currentIndex === 0 ? activeTabs.length - 1 : currentIndex - 1;
              } else {
                // Otherwise, change to the next tab, wrapping around to the start of the list if necessary
                nextIndex = (currentIndex + 1) % activeTabs.length;
              }
              var newTab = activeTabs[nextIndex];
              if (newTab.subTabs.length > 0) {
                if (!newTab.currentSubTab) {
                  newTab.currentSubTab = newTab.subTabs[0].name;
                }
                _this4.ui.currentSubTab = newTab.currentSubTab.name;
              } else {
                _this4.ui.currentSubTab = null;
              }
              _this4.ui.changeTab(activeTabs[nextIndex].name);
            }
          } else if (event.key >= '0' && event.key <= '9') {
            var num = parseInt(event.key);
            num = num === 0 ? 9 : num - 1; // mapping 0 to 9 and 1-9 to 0-8
            if (num >= 0 && num < 10 && _this4.hotkeyButtons[num] && !_this4.hotkeyButtons[num].disabled && !_this4.hotkeyButtons[num].classList.contains('disabled')) {
              _this4.hotkeyButtons[num].click();
            }
          } else if (['q', 'w', 'e', 'r', 't', 'y'].includes(event.key.toLowerCase())) {
            var letterIndex = hotkeyLetters.indexOf(event.key);
            if (letterIndex >= 0 && letterIndex < _this4.letterHotkeyButtons.length && !_this4.letterHotkeyButtons[letterIndex].disabled & !_this4.letterHotkeyButtons[letterIndex].classList.contains('disabled')) {
              _this4.letterHotkeyButtons[letterIndex].click();
            }
          } else if (event.key.toLowerCase() === 'm') {
            // Code for 'm' key
            var multSettingsButton = document.getElementById('multSettings');
            if (multSettingsButton) {
              multSettingsButton.click();
            }
          }
        });
        _this4.updateHotkeyButtons();
      }, 100); // Wait 100 milliseconds before initializing hotkeys
    }
  }, {
    key: "updateHotkeyButtons",
    value: function updateHotkeyButtons() {
      this.hotkeyButtons = []; // reset the hotkeyButtons array
      var numberButtons;
      var tabContentID;
      if (this.ui.currentSubTab) {
        tabContentID = this.ui.currentSubTab;
        if (this.ui.currentTab.includes('training')) {
          tabContentID = "realm-content-" + tabContentID;
        } else if (this.ui.currentTab.includes('exploration')) {
          this.currentSubTab = tabContentID;
          //first letter uppercase
          tabContentID = tabContentID.charAt(0).toUpperCase() + tabContentID.slice(1);
          tabContentID = "tab-content-" + tabContentID + "SubTab";
        }
        numberButtons = this.ui.returnHotkeyNumberButtons(tabContentID);
      } else {
        numberButtons = this.ui.returnHotkeyNumberButtons(this.ui.currentTab);
      }
      for (var i = 0; i < 10 && i < numberButtons.length; i++) {
        this.hotkeyButtons.push(numberButtons[i]);
      }
      this.letterHotkeyButtons = []; // reset the letterHotkeyButtons array
      var subTabButtons = this.ui.returnSubTabButtons();
      for (var _i = 0; _i < subTabButtons.length; _i++) {
        this.letterHotkeyButtons.push(subTabButtons[_i]);
      }
    }
  }]);
  return Game;
}();
var Builder = /*#__PURE__*/function () {
  function Builder(eventManager, gameManager) {
    _classCallCheck(this, Builder);
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
  _createClass(Builder, [{
    key: "build",
    value: function build() {
      this.initializeGameFeatures();
      this.populateFeatures();
      this.distributeModsAndReferences();
    }
  }, {
    key: "initializeGameFeatures",
    value: function initializeGameFeatures() {
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
  }, {
    key: "populateFeatures",
    value: function populateFeatures() {
      this.pushRegionsToWorlds();
      this.pushZonesToRegions();
      this.pushTrainingsToRealms();
      this.pushUpgradesToRealms();
      this.pushGeneratorsToRealms();
      this.populateMilestones();
      this.createRebirthModAndPseudoObject();
      this.initHeadbandModsAndPseudoObject();
    }
  }, {
    key: "distributeModsAndReferences",
    value: function distributeModsAndReferences() {
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
  }, {
    key: "initAchievements",
    value: function initAchievements() {
      this.initAchievementObjects();
      this.initAchievementSets();
      this.assignAchievementsToSets();
      this.initAchievementSetMods();
    }
  }, {
    key: "initUnlocks",
    value: function initUnlocks() {
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
  }, {
    key: "initUpgrades",
    value: function initUpgrades() {
      this.initRealmUpgrades();
      this.initforgeUpgrades();
      this.initEssenceUpgrades();
      this.initRadianceUpgrades();
    }
  }, {
    key: "initGeneratorUnlocks",
    value: function initGeneratorUnlocks() {
      this.initWisdomGeneratorUnlocks();
      this.initDivineGeneratorUnlocks();
    }
  }, {
    key: "initAchievementObjects",
    value: function initAchievementObjects() {
      var _this5 = this;
      var achievementUnlockData = [];
      var unlockID = 6501;
      _achievementData.default.forEach(function (data) {
        var id = data.id,
          name = data.name,
          description = data.description,
          unlockCategory = data.unlockCategory,
          conditionType = data.conditionType,
          dependentID = data.dependentID,
          radianceReward = data.radianceReward,
          triggerType = data.triggerType,
          triggerCategory = data.triggerCategory,
          conditionValue = data.conditionValue,
          setID = data.setID,
          mods = data.mods;
        var achievement = new Achievement(_this5.eventManager, id, name, description, unlockCategory, conditionType, dependentID, radianceReward, triggerType, triggerCategory, conditionValue, setID);
        if (achievement.targetID) {
          achievement.target = _this5.findObjectById(achievement.targetID);
        }

        //grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
        if (mods) {
          mods.forEach(function (modData) {
            _this5.modsWaiting.push(modData);
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
        _this5.achievements.push(achievement);
        _this5.gameManager.gameContent.achievements.push(achievement);
        _this5.gameManager.gameContent.achievementsGrid.achievements.push(achievement);
        _this5.gameManager.gameContent.idToObjectMap.set(id, achievement);
      });
      this.createUnlocks(achievementUnlockData);
    }
  }, {
    key: "initAchievementSets",
    value: function initAchievementSets() {
      var _this6 = this;
      var achievementSetData = [{
        id: 6401,
        name: "achieveSet1",
        description: "forceTrain * 2",
        color: 'var(--color-7)',
        bonusType: "mod",
        bonusValue: null
      }, {
        id: 6402,
        name: "achieveSet2",
        description: "wisdomTrain * 2",
        color: 'var(--color-2)',
        bonusType: "mod",
        bonusValue: null
      }, {
        id: 6403,
        name: "achieveSet3",
        description: "1 skillpoint",
        color: 'var(--color-3)',
        bonusType: "skillpoint",
        bonusValue: new _break_eternityMin.default(1)
      }, {
        id: 6404,
        name: "achieveSet2",
        description: "wisdomTrain * 2",
        color: 'var(--color-4)',
        bonusType: "mod",
        bonusValue: null
      }];
      achievementSetData.forEach(function (data) {
        var id = data.id,
          name = data.name,
          description = data.description,
          color = data.color,
          bonusType = data.bonusType,
          bonusValue = data.bonusValue;
        var achievementSet = new AchievementSet(_this6.eventManager, id, name, description, color, bonusType, bonusValue);
        _this6.achievementSets.push(achievementSet);
        _this6.gameManager.gameContent.achievementSets.push(achievementSet);
        _this6.gameManager.gameContent.achievementsGrid.achievementSets.push(achievementSet);
        _this6.gameManager.gameContent.idToObjectMap.set(id, achievementSet);
      });
    }
  }, {
    key: "initAchievementSetMods",
    value: function initAchievementSetMods() {
      this.createMods([{
        id: 6451,
        name: "achieveSetMod1",
        type: "prodBase",
        priority: null,
        sourceID: 6401,
        sourceCalcType: "mult",
        targetType: "forceTrain",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 2,
        value: 2,
        active: false
      }, {
        id: 6452,
        name: "achieveSetMod2",
        type: "prodBase",
        priority: null,
        sourceID: 6402,
        sourceCalcType: "mult",
        targetType: "wisdomTrain",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 2,
        value: 2,
        active: false
      }]);
    }
  }, {
    key: "assignAchievementsToSets",
    value: function assignAchievementsToSets() {
      var _iterator3 = _createForOfIteratorHelper(this.achievements),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var achievement = _step3.value;
          var achievementSet = this.findObjectById(achievement.setID);
          achievement.set = achievementSet;
          achievementSet.achievements.push(achievement);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "createGenerators",
    value: function createGenerators(generatorData) {
      var _this7 = this;
      generatorData.forEach(function (data) {
        var id = data.id,
          genChainID = data.genChainID,
          evolutionTier = data.evolutionTier,
          name = data.name,
          description = data.description,
          level = data.level,
          _data$maxLevel = data.maxLevel,
          maxLevel = _data$maxLevel === void 0 ? new _break_eternityMin.default(Infinity) : _data$maxLevel,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active,
          evolutions = data.evolutions;
        var generator = new Generator(_this7.eventManager, id, genChainID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, evolutions);
        _this7.generators.push(generator);
        _this7.gameManager.gameContent.generators.push(generator);
        _this7.gameManager.gameContent.idToObjectMap.set(id, generator);
        if (evolutions) {
          evolutions.forEach(function (evolveData) {
            generator.evolutions.push(evolveData);
          });
        }

        //push generators to generatorchains
        var genChain = _this7.generatorChains.find(function (genChain) {
          return genChain.id === generator.genChainID;
        });
        if (genChain) {
          genChain.generators.push(generator);
          generator.parentGenChain = genChain;
        }
      });
    }
  }, {
    key: "pushGeneratorsToRealms",
    value: function pushGeneratorsToRealms() {
      var _this8 = this;
      this.generatorChains.forEach(function (chain) {
        var realm = _this8.realms.find(function (realm) {
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
    value: function initWorldUnlocks() {}
  }, {
    key: "initRegionUnlocks",
    value: function initRegionUnlocks() {}
  }, {
    key: "initZoneUnlocks",
    value: function initZoneUnlocks() {}
  }, {
    key: "initTabUnlocks",
    value: function initTabUnlocks() {
      this.createUnlocks([
      //training tab and force realm - default enabled 
      //settings tab - default enabled

      // wisdom tab
      {
        id: 251,
        category: "id",
        type: null,
        dependentID: 851,
        targetID: 112,
        conditionType: "isCompleted",
        conditionValue: true,
        triggerType: "tabEnable",
        triggerValue: null
      },
      //energy tab
      // { id: 252, category: "id", type: null, dependentID: 611,  targetID: 113, conditionType: "level", conditionValue: 5, triggerType: "tabEnable", triggerValue: null },
      //divine tab
      // { id: 253, category: "id", type: null, dependentID: 2001, targetID: 114, conditionType: "level", conditionValue: 5, triggerType: "tabEnable", triggerValue: null },

      // specific training realm objects (so they can add their starting resource basically)
      //wisdom realm
      {
        id: 271,
        category: "id",
        type: null,
        dependentID: 851,
        targetID: 20,
        conditionType: "isCompleted",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      },
      //energy realm
      // { id: 272, category: "id", type: null, dependentID: 611,  targetID: 30, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null },
      //divine realm
      // { id: 273, category: "id", type: null, dependentID: 2001, targetID: 40, conditionType: "level", conditionValue: 5, triggerType: "setActive", triggerValue: null },

      //exploration tab 
      {
        id: 256,
        category: "id",
        type: null,
        dependentID: 1001,
        targetID: 140,
        conditionType: "level",
        conditionValue: 7,
        triggerType: "tabEnable",
        triggerValue: null
      },
      //odyssey
      {
        id: 281,
        category: "id",
        type: null,
        dependentID: 1003,
        targetID: 141,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "tabEnable",
        triggerValue: null
      },
      //tournament
      {
        id: 282,
        category: "id",
        type: null,
        dependentID: 9004,
        targetID: 142,
        conditionType: "isDefeated",
        conditionValue: true,
        triggerType: "tabEnable",
        triggerValue: null
      },
      //artifact
      {
        id: 283,
        category: "id",
        type: null,
        dependentID: 1000001,
        targetID: 143,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "tabEnable",
        triggerValue: null
      },
      //forge
      {
        id: 254,
        category: "id",
        type: null,
        dependentID: 1101,
        targetID: 120,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "tabEnable",
        triggerValue: null
      },
      //skills
      {
        id: 255,
        category: "id",
        type: null,
        dependentID: 9009,
        targetID: 130,
        conditionType: "isDefeated",
        conditionValue: true,
        triggerType: "tabEnable",
        triggerValue: null
      },
      //essence
      {
        id: 257,
        category: "stat",
        type: null,
        dependentID: 1001,
        targetID: 150,
        conditionType: "powerLevel",
        conditionValue: 1000000,
        triggerType: "tabEnable",
        triggerValue: null
      },
      //achievements
      {
        id: 258,
        category: "id",
        type: null,
        dependentID: 1001,
        targetID: 160,
        conditionType: "level",
        conditionValue: 15,
        triggerType: "tabEnable",
        triggerValue: null
      },
      //radiance
      {
        id: 259,
        category: "id",
        type: null,
        dependentID: 6001,
        targetID: 180,
        conditionType: "isClaimed",
        conditionValue: true,
        triggerType: "tabEnable",
        triggerValue: null
      }]);
    }
  }, {
    key: "initForceTrainUnlocks",
    value: function initForceTrainUnlocks() {
      this.createUnlocks([
      //trainings unlocking trainings
      {
        id: 1201,
        category: "id",
        type: null,
        dependentID: 1001,
        targetID: 1002,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 1202,
        category: "id",
        type: null,
        dependentID: 1002,
        targetID: 1003,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 1203,
        category: "id",
        type: null,
        dependentID: 1003,
        targetID: 1004,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 1204,
        category: "id",
        type: null,
        dependentID: 1004,
        targetID: 1005,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      },
      //trainings unlocking upgrades
      {
        id: 1205,
        category: "id",
        type: null,
        dependentID: 1001,
        targetID: 1101,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 1206,
        category: "id",
        type: null,
        dependentID: 1001,
        targetID: 1102,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 1207,
        category: "id",
        type: null,
        dependentID: 1002,
        targetID: 1103,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 1208,
        category: "id",
        type: null,
        dependentID: 1003,
        targetID: 1104,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 1209,
        category: "id",
        type: null,
        dependentID: 1004,
        targetID: 1105,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }]);
    }
  }, {
    key: "initForgeUpgradeUnlocks",
    value: function initForgeUpgradeUnlocks() {
      this.createUnlocks([
      //row 1 forge upgrades unlocked by default when forge tab unlocks
      //row 2 forge upgrades
      {
        id: 11001,
        category: "id",
        type: null,
        dependentID: 10005,
        targetID: [10006, 10007, 10008, 10009, 10010],
        conditionType: "level",
        conditionValue: 1,
        triggerType: "setActive",
        triggerValue: null
      },
      //row 1 wisdom upgrades
      {
        id: 11002,
        category: "id",
        type: null,
        dependentID: 851,
        targetID: [10101, 10102, 10103, 10104, 10105],
        conditionType: "isCompleted",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      },
      //row 2 wisdom upgrades
      {
        id: 11003,
        category: "id",
        type: null,
        dependentID: 10105,
        targetID: [10106, 10107, 10108, 10109, 10110],
        conditionType: "level",
        conditionValue: 1,
        triggerType: "setActive",
        triggerValue: null
      },
      //row 1 crystal upgrades
      {
        id: 11004,
        category: "id",
        type: null,
        dependentID: 9004,
        targetID: [10401, 10402, 10403, 10404, 10405],
        conditionType: "isDefeated",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      },
      //row 2 crystal upgrades
      {
        id: 11005,
        category: "id",
        type: null,
        dependentID: 852,
        targetID: [10406, 10407, 10408, 10409, 10410],
        conditionType: "isCompleted",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      },
      //row 3 crystal upgrades
      {
        id: 11006,
        category: "id",
        type: null,
        dependentID: 853,
        targetID: [10411, 10412, 10413, 10414, 10415],
        conditionType: "isCompleted",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }]);
    }
  }, {
    key: "initWisdomGeneratorUnlocks",
    value: function initWisdomGeneratorUnlocks() {
      this.createUnlocks([
      //gens unlock gens
      {
        id: 621,
        category: "id",
        type: null,
        dependentID: 611,
        targetID: 612,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 622,
        category: "id",
        type: null,
        dependentID: 612,
        targetID: 613,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 623,
        category: "id",
        type: null,
        dependentID: 613,
        targetID: 614,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 624,
        category: "id",
        type: null,
        dependentID: 614,
        targetID: 615,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      },
      //gens unlock gen upgrades
      {
        id: 625,
        category: "id",
        type: null,
        dependentID: 611,
        targetID: 631,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 626,
        category: "id",
        type: null,
        dependentID: 611,
        targetID: 632,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 627,
        category: "id",
        type: null,
        dependentID: 612,
        targetID: 633,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 628,
        category: "id",
        type: null,
        dependentID: 613,
        targetID: 634,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 629,
        category: "id",
        type: null,
        dependentID: 614,
        targetID: 635,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }]);
    }
  }, {
    key: "initEnergyTrainUnlocks",
    value: function initEnergyTrainUnlocks() {
      this.createUnlocks([
      //trainings unlocking trainings
      {
        id: 2201,
        category: "id",
        type: null,
        dependentID: 2001,
        targetID: 2002,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 2202,
        category: "id",
        type: null,
        dependentID: 2002,
        targetID: 2003,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 2203,
        category: "id",
        type: null,
        dependentID: 2003,
        targetID: 2004,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 2204,
        category: "id",
        type: null,
        dependentID: 2004,
        targetID: 2005,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      },
      //trainings unlocking upgrades
      {
        id: 2205,
        category: "id",
        type: null,
        dependentID: 2001,
        targetID: 2101,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 2206,
        category: "id",
        type: null,
        dependentID: 2001,
        targetID: 2102,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 2207,
        category: "id",
        type: null,
        dependentID: 2002,
        targetID: 2103,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 2208,
        category: "id",
        type: null,
        dependentID: 2003,
        targetID: 2104,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 2209,
        category: "id",
        type: null,
        dependentID: 2004,
        targetID: 2105,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }]);
    }
  }, {
    key: "initDivineGeneratorUnlocks",
    value: function initDivineGeneratorUnlocks() {
      this.createUnlocks([
      //gens unlock gens
      {
        id: 721,
        category: "id",
        type: null,
        dependentID: 711,
        targetID: 712,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 722,
        category: "id",
        type: null,
        dependentID: 712,
        targetID: 713,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 723,
        category: "id",
        type: null,
        dependentID: 713,
        targetID: 714,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 724,
        category: "id",
        type: null,
        dependentID: 714,
        targetID: 715,
        conditionType: "level",
        conditionValue: 5,
        triggerType: "setActive",
        triggerValue: null
      },
      //gens unlock gen upgrades
      {
        id: 725,
        category: "id",
        type: null,
        dependentID: 711,
        targetID: 731,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 726,
        category: "id",
        type: null,
        dependentID: 712,
        targetID: 732,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 727,
        category: "id",
        type: null,
        dependentID: 713,
        targetID: 733,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 728,
        category: "id",
        type: null,
        dependentID: 714,
        targetID: 734,
        conditionType: "level",
        conditionValue: 10,
        triggerType: "setActive",
        triggerValue: null
      }]);
    }
  }, {
    key: "initArtifactBaseItemUnlocks",
    value: function initArtifactBaseItemUnlocks() {
      this.createUnlocks([
      //zone completions that unlock artifacts
      {
        id: 5901,
        category: "id",
        type: null,
        dependentID: 1000001,
        targetID: 5010,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 5902,
        category: "id",
        type: null,
        dependentID: 1000002,
        targetID: 5020,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 5903,
        category: "id",
        type: null,
        dependentID: 1000003,
        targetID: 5030,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 5904,
        category: "id",
        type: null,
        dependentID: 1000004,
        targetID: 5040,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 5905,
        category: "id",
        type: null,
        dependentID: 1000005,
        targetID: 5050,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 5906,
        category: "id",
        type: null,
        dependentID: 1000006,
        targetID: 5060,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 5907,
        category: "id",
        type: null,
        dependentID: 1000007,
        targetID: 5070,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 5908,
        category: "id",
        type: null,
        dependentID: 1000008,
        targetID: 5080,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 5909,
        category: "id",
        type: null,
        dependentID: 1000009,
        targetID: 5090,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 5910,
        category: "id",
        type: null,
        dependentID: 1000010,
        targetID: 5100,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 5911,
        category: "id",
        type: null,
        dependentID: 1000010,
        targetID: 5110,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }, {
        id: 5912,
        category: "id",
        type: null,
        dependentID: 1000010,
        targetID: 5120,
        conditionType: "isProgressed",
        conditionValue: true,
        triggerType: "setActive",
        triggerValue: null
      }]);
    }
  }, {
    key: "initArtifactZoneUnlocks",
    value: function initArtifactZoneUnlocks() {
      //artifact possessions that unlock zones (when artifact is built at lvl 1)
      this.createUnlocks([{
        id: 5951,
        category: "id",
        type: null,
        dependentID: 5010,
        targetID: 9007,
        conditionType: "level",
        conditionValue: new _break_eternityMin.default(1),
        triggerType: "setActive",
        triggerValue: null
      }]);
    }
  }, {
    key: "initArtifactZoneRepeatUnlocks",
    value: function initArtifactZoneRepeatUnlocks() {
      // Unlocks to the repeatUnlocked property of groups of zones based on an artifact being purchased
      this.createUnlocks([{
        id: 5981,
        category: "id",
        type: null,
        dependentID: 5010,
        targetID: 1000001,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "zoneRepeatEnable",
        triggerValue: null
      }, {
        id: 5982,
        category: "id",
        type: null,
        dependentID: 5020,
        targetID: 1000002,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "zoneRepeatEnable",
        triggerValue: null
      }, {
        id: 5983,
        category: "id",
        type: null,
        dependentID: 5030,
        targetID: 1000003,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "zoneRepeatEnable",
        triggerValue: null
      }, {
        id: 5984,
        category: "id",
        type: null,
        dependentID: 5040,
        targetID: 1000004,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "zoneRepeatEnable",
        triggerValue: null
      }, {
        id: 5985,
        category: "id",
        type: null,
        dependentID: 5050,
        targetID: 1000005,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "zoneRepeatEnable",
        triggerValue: null
      }, {
        id: 5986,
        category: "id",
        type: null,
        dependentID: 5060,
        targetID: 1000006,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "zoneRepeatEnable",
        triggerValue: null
      }, {
        id: 5987,
        category: "id",
        type: null,
        dependentID: 5070,
        targetID: 1000007,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "zoneRepeatEnable",
        triggerValue: null
      }, {
        id: 5988,
        category: "id",
        type: null,
        dependentID: 5080,
        targetID: 1000008,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "zoneRepeatEnable",
        triggerValue: null
      }, {
        id: 5989,
        category: "id",
        type: null,
        dependentID: 5090,
        targetID: 1000009,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "zoneRepeatEnable",
        triggerValue: null
      }, {
        id: 5990,
        category: "id",
        type: null,
        dependentID: 5100,
        targetID: 1000010,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "zoneRepeatEnable",
        triggerValue: null
      }, {
        id: 5991,
        category: "id",
        type: null,
        dependentID: 5110,
        targetID: 1000011,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "zoneRepeatEnable",
        triggerValue: null
      }
      // { id: 5992, category: "id", type: null, dependentID: 5120, targetID: 1000012, conditionType: "level", conditionValue: 1,triggerType: "zoneRepeatEnable", triggerValue: null },
      ]);
    }
  }, {
    key: "initEssenceUpgradeUnlocks",
    value: function initEssenceUpgradeUnlocks() {
      this.createUnlocks([{
        id: 3071,
        category: "id",
        type: null,
        dependentID: 100003,
        targetID: 4016,
        conditionType: "level",
        conditionValue: 1,
        triggerType: "setActive",
        triggerValue: null
      }]);
    }
  }, {
    key: "createUnlocks",
    value: function createUnlocks(unlockData) {
      var _this9 = this;
      unlockData.forEach(function (data) {
        var id = data.id,
          category = data.category,
          type = data.type,
          dependentID = data.dependentID,
          targetID = data.targetID,
          conditionType = data.conditionType,
          conditionValue = data.conditionValue,
          triggerType = data.triggerType,
          triggerValue = data.triggerValue;

        // check if conditionvalue is a digit, and if so, convert to Decimal
        // json cannot store a decimal value, but conditionvalue can be a digit or bool
        var decimalConditionValue = typeof conditionValue === 'number' ? new _break_eternityMin.default(conditionValue) : conditionValue;
        var decimalTriggerValue = typeof triggerValue === 'number' ? new _break_eternityMin.default(triggerValue) : triggerValue;
        var unlock = new Unlock(id, category, type, dependentID, targetID, conditionType, decimalConditionValue, triggerType, decimalTriggerValue);
        _this9.gameManager.gameContent.unlockManager.unlocks.set(id, unlock);
        _this9.unlocks.set(id, unlock);
        _this9.gameManager.gameContent.unlocks.set(id, unlock);
        _this9.gameManager.gameContent.idToObjectMap.set(id, unlock);
      });
    }
  }, {
    key: "initTrainings",
    value: function initTrainings() {
      var _this10 = this;
      _trainingData.default.forEach(function (data) {
        var id = data.id,
          realmID = data.realmID,
          evolutionTier = data.evolutionTier,
          name = data.name,
          description = data.description,
          level = data.level,
          _data$maxLevel2 = data.maxLevel,
          maxLevel = _data$maxLevel2 === void 0 ? new _break_eternityMin.default(Infinity) : _data$maxLevel2,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active,
          evolutions = data.evolutions;
        var training = new Training(_this10.eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, evolutions);
        if (evolutions) {
          evolutions.forEach(function (evolveData) {
            training.evolutions.push(evolveData);
          });
        }
        _this10.trainings.push(training);
        _this10.gameManager.gameContent.trainings.push(training);
        _this10.gameManager.gameContent.idToObjectMap.set(id, training);
      });
    }
  }, {
    key: "initRealmUpgrades",
    value: function initRealmUpgrades() {
      var _this11 = this;
      _realmUpgradeData.default.forEach(function (data) {
        var id = data.id,
          realmID = data.realmID,
          evolutionTier = data.evolutionTier,
          name = data.name,
          description = data.description,
          level = data.level,
          _data$maxLevel3 = data.maxLevel,
          maxLevel = _data$maxLevel3 === void 0 ? new _break_eternityMin.default(Infinity) : _data$maxLevel3,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active,
          mods = data.mods,
          evolutions = data.evolutions;
        var upgrade = new Upgrade(_this11.eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, evolutions);

        //grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
        if (mods) {
          mods.forEach(function (modData) {
            _this11.modsWaiting.push(modData);
          });
        }
        if (evolutions) {
          evolutions.forEach(function (evolveData) {
            upgrade.evolutions.push(evolveData);
          });
        }
        _this11.upgrades.push(upgrade);
        _this11.gameManager.gameContent.upgrades.push(upgrade);
        _this11.gameManager.gameContent.idToObjectMap.set(id, upgrade);
      });
    }
  }, {
    key: "initGeneratorChains",
    value: function initGeneratorChains() {
      var generatorChain1 = new GeneratorChain(this.eventManager, 601, "wGenChain1", 20, true);
      this.generatorChains.push(generatorChain1);
      this.gameManager.gameContent.generatorChains.push(generatorChain1);
      this.gameManager.gameContent.idToObjectMap.set(generatorChain1.id, generatorChain1);
      var generatorChain2 = new GeneratorChain(this.eventManager, 701, "dGenChain1", 40, true);
      this.generatorChains.push(generatorChain2);
      this.gameManager.gameContent.generatorChains.push(generatorChain2);
      this.gameManager.gameContent.idToObjectMap.set(generatorChain2.id, generatorChain2);
    }
  }, {
    key: "initGenerators",
    value: function initGenerators() {
      this.initGeneratorChains();
      this.createGenerators(_generatorData.default);
    }
  }, {
    key: "initEssenceUpgrades",
    value: function initEssenceUpgrades() {
      var _this12 = this;
      _essenceUpgradeData.default.forEach(function (data) {
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
          _data$active = data.active,
          active = _data$active === void 0 ? false : _data$active,
          specialTargetID = data.specialTargetID,
          parentID = data.parentID,
          angleFromParent = data.angleFromParent,
          distanceFromParent = data.distanceFromParent,
          _data$isUnlockedByPar = data.isUnlockedByParent,
          isUnlockedByParent = _data$isUnlockedByPar === void 0 ? true : _data$isUnlockedByPar,
          mods = data.mods;
        var upgrade = new EssenceUpgrade(_this12.eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialTargetID, parentID, angleFromParent, distanceFromParent, isUnlockedByParent);

        //grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
        if (mods) {
          mods.forEach(function (modData) {
            _this12.modsWaiting.push(modData);
          });
        }
        _this12.essenceUpgrades.push(upgrade);
        _this12.gameManager.gameContent.essenceUpgrades.push(upgrade);
        _this12.gameManager.gameContent.idToObjectMap.set(id, upgrade);
      });
      this.buildEssenceUpgradeConnections();
    }
  }, {
    key: "buildEssenceUpgradeConnections",
    value: function buildEssenceUpgradeConnections() {
      var _iterator4 = _createForOfIteratorHelper(this.essenceUpgrades),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var upgrade = _step4.value;
          if (upgrade.parentID) {
            upgrade.parent = this.findObjectById(upgrade.parentID);
            upgrade.parent.children.push(upgrade);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "initforgeUpgrades",
    value: function initforgeUpgrades() {
      var _this13 = this;
      _forgeUpgradeData.default.forEach(function (data) {
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
          _data$specialVar = data.specialVar1,
          specialVar1 = _data$specialVar === void 0 ? null : _data$specialVar,
          _data$specialVar2 = data.specialVar2,
          specialVar2 = _data$specialVar2 === void 0 ? null : _data$specialVar2,
          _data$specialVar3 = data.specialVar3,
          specialVar3 = _data$specialVar3 === void 0 ? null : _data$specialVar3,
          mods = data.mods;
        var upgrade = new ForgeUpgrade(_this13.eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialVar1, specialVar2, specialVar3);

        //grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
        if (mods) {
          mods.forEach(function (modData) {
            _this13.modsWaiting.push(modData);
          });
        }
        _this13.forgeUpgrades.push(upgrade);
        _this13.gameManager.gameContent.forgeUpgrades.push(upgrade);
        _this13.gameManager.gameContent.idToObjectMap.set(id, upgrade);
      });
    }
  }, {
    key: "initRadianceUpgrades",
    value: function initRadianceUpgrades() {
      var _this14 = this;
      _radianceUpgradeData.default.forEach(function (data) {
        var id = data.id,
          name = data.name,
          description = data.description,
          level = data.level,
          _data$maxLevel4 = data.maxLevel,
          maxLevel = _data$maxLevel4 === void 0 ? new _break_eternityMin.default(Infinity) : _data$maxLevel4,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          prodGrowthRate = data.prodGrowthRate,
          active = data.active,
          specialTargetID = data.specialTargetID,
          mods = data.mods;
        var upgrade = new RadianceUpgrade(_this14.eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialTargetID);

        //grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
        if (mods) {
          mods.forEach(function (modData) {
            _this14.modsWaiting.push(modData);
          });
        }
        _this14.radianceUpgrades.push(upgrade);
        _this14.gameManager.gameContent.radianceUpgrades.push(upgrade);
        _this14.gameManager.gameContent.idToObjectMap.set(id, upgrade);
      });
    }
  }, {
    key: "initArtifacts",
    value: function initArtifacts() {
      var _this15 = this;
      _artifactData.default.forEach(function (data) {
        var id = data.id,
          name = data.name,
          evolutionTier = data.evolutionTier,
          gearType = data.gearType,
          description = data.description,
          _data$level = data.level,
          level = _data$level === void 0 ? 0 : _data$level,
          maxLevel = data.maxLevel,
          costType = data.costType,
          costBase = data.costBase,
          costGrowthRate = data.costGrowthRate,
          _data$prodType = data.prodType,
          prodType = _data$prodType === void 0 ? null : _data$prodType,
          _data$prodBase = data.prodBase,
          prodBase = _data$prodBase === void 0 ? null : _data$prodBase,
          _data$prodGrowthRate = data.prodGrowthRate,
          prodGrowthRate = _data$prodGrowthRate === void 0 ? null : _data$prodGrowthRate,
          _data$nextEvolveID = data.nextEvolveID,
          nextEvolveID = _data$nextEvolveID === void 0 ? null : _data$nextEvolveID,
          _data$active2 = data.active,
          active = _data$active2 === void 0 ? false : _data$active2,
          _data$visible = data.visible,
          visible = _data$visible === void 0 ? false : _data$visible,
          mods = data.mods;
        var artifact = new Artifact(_this15.eventManager, id, name, evolutionTier, gearType, description, level, new _break_eternityMin.default(maxLevel), costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, nextEvolveID, active, visible);

        //grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
        if (mods) {
          mods.forEach(function (modData) {
            _this15.modsWaiting.push(modData);
          });
        }
        _this15.artifacts.push(artifact);
        _this15.gameManager.gameContent.artifacts.push(artifact);
        _this15.gameManager.gameContent.idToObjectMap.set(id, artifact);
      });
      this.assignArtifactEvolutionReferences();
    }
  }, {
    key: "assignArtifactEvolutionReferences",
    value: function assignArtifactEvolutionReferences() {
      var _iterator5 = _createForOfIteratorHelper(this.artifacts),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var artifact = _step5.value;
          if (artifact.nextEvolveID) {
            artifact.nextEvolveRef = this.findObjectById(artifact.nextEvolveID);
            artifact.nextEvolveRef.previousEvolution = artifact;
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }, {
    key: "assignEssenceUpgradeReferences",
    value: function assignEssenceUpgradeReferences() {
      var _iterator6 = _createForOfIteratorHelper(this.essenceUpgrades),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var upgrade = _step6.value;
          if (upgrade.specialTargetID) {
            upgrade.target = this.findObjectById(upgrade.specialTargetID);
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }, {
    key: "initRealms",
    value: function initRealms() {
      var _this16 = this;
      var realmData = [
      //force realms
      {
        id: 10,
        type: "force",
        name: "force",
        description: "",
        active: true
      }, {
        id: 20,
        type: "wisdom",
        name: "wisdom",
        description: "",
        active: true,
        startingResource: 2000
      }, {
        id: 30,
        type: "energy",
        name: "energy",
        description: "",
        active: true,
        startingResource: 2000
      }, {
        id: 40,
        type: "divine",
        name: "divine",
        description: "",
        active: true,
        startingResource: 2000
      }];
      realmData.forEach(function (data) {
        var id = data.id,
          type = data.type,
          name = data.name,
          description = data.description,
          active = data.active,
          startingResource = data.startingResource;
        var realm = new Realm(_this16.eventManager, id, type, name, description, active, startingResource);
        _this16.realms.push(realm);
        _this16.gameManager.gameContent.realms.push(realm);
        _this16.gameManager.gameContent.idToObjectMap.set(id, realm);
      });
    }
  }, {
    key: "initWorlds",
    value: function initWorlds() {
      var _this17 = this;
      _worldData.default.forEach(function (data) {
        var id = data.id,
          name = data.name,
          _data$active3 = data.active,
          active = _data$active3 === void 0 ? false : _data$active3;
        var world = new World(_this17.eventManager, _this17.gameManager.gameContent.worldManager, id, name, active);
        _this17.worlds.push(world);
        _this17.gameManager.gameContent.worldManager.worlds.push(world);
        _this17.gameManager.gameContent.idToObjectMap.set(id, world);
        _this17.gameManager.gameContent.worlds.push(world);
      });
    }
  }, {
    key: "initRegions",
    value: function initRegions() {
      var _this18 = this;
      _regionData.default.forEach(function (data) {
        var id = data.id,
          worldID = data.worldID,
          name = data.name,
          shardType = data.shardType,
          _data$active4 = data.active,
          active = _data$active4 === void 0 ? false : _data$active4;
        var region = new Region(_this18.eventManager, id, worldID, name, shardType, active);
        _this18.regions.push(region);
        _this18.gameManager.gameContent.idToObjectMap.set(id, region);
        _this18.gameManager.gameContent.regions.push(region);
      });
    }
  }, {
    key: "pushRegionsToWorlds",
    value: function pushRegionsToWorlds() {
      var _this19 = this;
      this.regions.forEach(function (region) {
        var world = _this19.worlds.find(function (world) {
          return world.id === region.worldID;
        });
        if (world) {
          world.regions.push(region);
          region.world = world;
        }
      });
    }
  }, {
    key: "initZones",
    value: function initZones() {
      var _this20 = this;
      _zoneData2.default.forEach(function (data) {
        var id = data.id,
          regionID = data.regionID,
          name = data.name,
          description = data.description,
          _data$level2 = data.level,
          level = _data$level2 === void 0 ? new _break_eternityMin.default(0) : _data$level2,
          _data$maxLevel5 = data.maxLevel,
          maxLevel = _data$maxLevel5 === void 0 ? new _break_eternityMin.default(1) : _data$maxLevel5,
          costType = data.costType,
          costBase = data.costBase,
          _data$costGrowthRate = data.costGrowthRate,
          costGrowthRate = _data$costGrowthRate === void 0 ? new _break_eternityMin.default(2) : _data$costGrowthRate,
          prodType = data.prodType,
          prodBase = data.prodBase,
          _data$prodGrowthRate2 = data.prodGrowthRate,
          prodGrowthRate = _data$prodGrowthRate2 === void 0 ? new _break_eternityMin.default(1.01) : _data$prodGrowthRate2,
          baseConquestTime = data.baseConquestTime,
          _data$active5 = data.active,
          active = _data$active5 === void 0 ? false : _data$active5,
          _data$zoneType = data.zoneType,
          zoneType = _data$zoneType === void 0 ? "standard" : _data$zoneType,
          parentID = data.parentID,
          angleFromParent = data.angleFromParent,
          distanceFromParent = data.distanceFromParent,
          _data$isUnlockedByPar2 = data.isUnlockedByParent,
          isUnlockedByParent = _data$isUnlockedByPar2 === void 0 ? true : _data$isUnlockedByPar2;
        var zone = new Zone(_this20.eventManager, id, regionID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, baseConquestTime, active, zoneType, parentID, angleFromParent, distanceFromParent, isUnlockedByParent);
        _this20.zones.push(zone);
        _this20.gameManager.gameContent.zones.push(zone);
        _this20.gameManager.gameContent.idToObjectMap.set(id, zone);
      });
      this.buildZoneConnections();
    }
  }, {
    key: "buildZoneConnections",
    value: function buildZoneConnections() {
      var _iterator7 = _createForOfIteratorHelper(this.zones),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var zone = _step7.value;
          if (zone.parentID) {
            zone.parent = this.findObjectById(zone.parentID);
            zone.parent.children.push(zone);
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "pushZonesToRegions",
    value: function pushZonesToRegions() {
      var _this21 = this;
      this.zones.forEach(function (zone) {
        var region = _this21.regions.find(function (region) {
          return region.id === zone.regionID;
        });
        if (region) {
          region.zones.push(zone);
          zone.region = region;
        }
      });
    }
  }, {
    key: "initFighters",
    value: function initFighters() {
      var _this22 = this;
      var fighterID = 901;
      _fighterData.default.forEach(function (data) {
        var _data$id = data.id,
          id = _data$id === void 0 ? fighterID : _data$id,
          name = data.name,
          description = data.description,
          tier = data.tier,
          _data$level3 = data.level,
          level = _data$level3 === void 0 ? new _break_eternityMin.default(0) : _data$level3,
          _data$maxLevel6 = data.maxLevel,
          maxLevel = _data$maxLevel6 === void 0 ? new _break_eternityMin.default(1) : _data$maxLevel6,
          _data$costType = data.costType,
          costType = _data$costType === void 0 ? "powerLevel" : _data$costType,
          costBase = data.costBase,
          _data$costGrowthRate2 = data.costGrowthRate,
          costGrowthRate = _data$costGrowthRate2 === void 0 ? new _break_eternityMin.default(2) : _data$costGrowthRate2,
          _data$prodType2 = data.prodType,
          prodType = _data$prodType2 === void 0 ? "crystal" : _data$prodType2,
          prodBase = data.prodBase,
          _data$prodGrowthRate3 = data.prodGrowthRate,
          prodGrowthRate = _data$prodGrowthRate3 === void 0 ? new _break_eternityMin.default(1.01) : _data$prodGrowthRate3,
          baseFightTime = data.baseFightTime,
          _data$active6 = data.active,
          active = _data$active6 === void 0 ? false : _data$active6,
          visible = data.visible;
        var fighter = new Fighter(_this22.eventManager, id, name, description, tier, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, baseFightTime, active, visible);
        _this22.fighters.push(fighter);
        _this22.gameManager.gameContent.fighters.push(fighter);
        _this22.gameManager.gameContent.tournament.fighters.push(fighter);
        _this22.gameManager.gameContent.idToObjectMap.set(id, fighter);
        fighterID++;
      });
    }
  }, {
    key: "initFighterTiers",
    value: function initFighterTiers() {
      // creates fighter tiers based on fighters' fighterTier property, and assigns corresponding fighters
      var fighterTierID = 851;
      var worldID = 1000001;
      var _iterator8 = _createForOfIteratorHelper(this.fighters),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var fighter = _step8.value;
          var added = false;
          var _iterator9 = _createForOfIteratorHelper(this.fighterTiers),
            _step9;
          try {
            for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
              var fighterTier = _step9.value;
              if (fighterTier.tier === fighter.tier) {
                fighterTier.fighters.push(fighter);
                fighter.fighterTier = fighterTier;
                added = true;
                if (fighterTier.id === 851) {
                  fighterTier.setActive();
                }
              }
            }
          } catch (err) {
            _iterator9.e(err);
          } finally {
            _iterator9.f();
          }
          if (!added) {
            var newTier = new FighterTier(this.eventManager, fighterTierID, fighter.tier, worldID);
            newTier.fighters.push(fighter);
            fighterTierID++;
            worldID++;
            this.fighterTiers.push(newTier);
            this.gameManager.gameContent.fighterTiers.push(newTier);
            this.gameManager.gameContent.tournament.fighterTiers.push(newTier);
            this.gameManager.gameContent.idToObjectMap.set(newTier.id, newTier);
            fighter.fighterTier = newTier;
            if (newTier.id === 851) {
              newTier.setActive();
            }
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
  }, {
    key: "assignFighterTierWorldRefernces",
    value: function assignFighterTierWorldRefernces() {
      //assign tiers to worlds
      //assign worlds to tiers
      var _iterator10 = _createForOfIteratorHelper(this.fighterTiers),
        _step10;
      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var fighterTier = _step10.value;
          var world = this.findObjectById(fighterTier.worldID);
          fighterTier.world = world;
          world.fighterTier = fighterTier;
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
    }
  }, {
    key: "initTournament",
    value: function initTournament() {
      var tournament = new Tournament(this.eventManager, 799);
      this.tournament = tournament;
      this.gameManager.gameContent.tournament = tournament;
      this.gameManager.gameContent.idToObjectMap.set(tournament.id, tournament);
    }
  }, {
    key: "initSkills",
    value: function initSkills() {
      var _this23 = this;
      _skillData.default.forEach(function (data) {
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
          connections = data.connections,
          mods = data.mods;
        var skill = new Skill(_this23.eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, connections);

        //grab mods declared in JSON and add them to the mod waiting array to be processed after all objects are initialized
        if (mods) {
          mods.forEach(function (modData) {
            _this23.modsWaiting.push(modData);
          });
        }
        _this23.skills.push(skill);
        _this23.gameManager.gameContent.skillTree.skills.push(skill);
        _this23.gameManager.gameContent.skills.push(skill);
        _this23.gameManager.gameContent.idToObjectMap.set(id, skill);
      });
      this.buildSkillTree();
    }
  }, {
    key: "initSkillConnectionUnlocks",
    value: function initSkillConnectionUnlocks() {
      var _this24 = this;
      var unlockID = 42000;
      var unlocksDone = [];
      this.skills.forEach(function (skill) {
        var _loop = function _loop(direction) {
          var unlock = new Unlock(unlockID, "id", null, skill.id, skill.connections[direction], "level", 1, "setActive", null);

          //don't push unlock if a target skill is already unlocked (to handle bidirectional unlock directions) - also don't create any unlock for sk1
          if (!unlocksDone.some(function (existingUnlock) {
            return existingUnlock.targetID === unlock.targetID;
          }) && unlock.targetID !== 4001) {
            //don't auto-create unlocks for otherwise unlocked skill paths
            if (!Array.from(_this24.unlocks.values()).find(function (u) {
              return u.targetID === skill.connections[direction];
            })) {
              //save reference to unlock on the unlocked skill for refunding skill and re-engaging unlock
              var targetSkill = _this24.gameManager.findObjectById(skill.connections[direction]);
              targetSkill.unlockingID = unlockID;
              skill.unlockedConnections.push(targetSkill);
              _this24.unlocks.set(unlockID, unlock);
              _this24.gameManager.gameContent.unlockManager.unlocks.set(unlockID, unlock);
              _this24.gameManager.gameContent.unlocks.set(unlockID, unlock);
              _this24.gameManager.gameContent.idToObjectMap.set(unlockID, unlock);
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
        evolutionTier: null,
        name: "hidden rebirth1 upgrade source",
        description: "hidden rebirth1 upgrade source",
        level: new _break_eternityMin.default(1),
        maxLevel: Infinity,
        costType: "force",
        costBase: 1,
        costGrowthRate: 2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false
      };
      var id = sourceUpgrade.id,
        realmID = sourceUpgrade.realmID,
        evolutionTier = sourceUpgrade.evolutionTier,
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
      var upgrade = new Upgrade(this.eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
      this.upgrades.push(upgrade);
      this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
      var modID = 60001;
      var mod = new Mod(this.eventManager, modID, "rebirth1EssenceMod", "production", null, 60000, "add", "allTrain", null, "mult", new _break_eternityMin.default(1), new _break_eternityMin.default(1), false);
      this.mods.push(mod);
      this.gameManager.gameContent.idToObjectMap.set(modID, mod);
    }
  }, {
    key: "initHeadbandModsAndPseudoObject",
    value: function initHeadbandModsAndPseudoObject() {
      //hidden upgrade object to act as source of rebirth mod
      var sourceUpgrade = {
        id: 800,
        realmID: null,
        evolutionTier: null,
        name: "hidden headband upgrade source",
        description: "",
        level: new _break_eternityMin.default(0),
        maxLevel: Infinity,
        costType: "force",
        costBase: 1,
        costGrowthRate: 2,
        prodType: null,
        prodBase: null,
        prodGrowthRate: null,
        active: false
      };
      var id = sourceUpgrade.id,
        realmID = sourceUpgrade.realmID,
        evolutionTier = sourceUpgrade.evolutionTier,
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
      var upgrade = new Upgrade(this.eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
      this.upgrades.push(upgrade);
      this.gameManager.gameContent.idToObjectMap.set(id, upgrade);
      var modData = [{
        id: 801,
        name: "headbandMod1",
        type: "production",
        priority: null,
        sourceID: 800,
        sourceCalcType: "add",
        targetType: "forceTrain",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 2,
        value: 2,
        active: false
      }, {
        id: 802,
        name: "headbandMod2",
        type: "production",
        priority: null,
        sourceID: 800,
        sourceCalcType: "add",
        targetType: "wisdomTrain",
        targetID: null,
        runningCalcType: "mult",
        baseValue: 2,
        value: 2,
        active: false
      }];
      this.createMods(modData);
    }
  }, {
    key: "initHeadbandModUnlocks",
    value: function initHeadbandModUnlocks() {
      this.createUnlocks([
      //trainings unlocking trainings
      {
        id: 821,
        category: "id",
        type: null,
        dependentID: 851,
        targetID: 801,
        conditionType: "isCompleted",
        conditionValue: true,
        triggerType: "headbandLevelActivate",
        triggerValue: null
      }, {
        id: 822,
        category: "id",
        type: null,
        dependentID: 852,
        targetID: 802,
        conditionType: "isCompleted",
        conditionValue: true,
        triggerType: "headbandLevelActivate",
        triggerValue: null
      }]);
    }
  }, {
    key: "populateMilestones",
    value: function populateMilestones() {
      //initForceTrainMilestones
      this.initMilestones(30000, 30001, 31000, this.trainings);

      //initWisdomGenMilestones
      this.initMilestones(32000, 32001, 33200, this.generators);

      //initArtifactMilestones
      this.initMilestones(34000, 34001, 35200, this.artifacts);
    }
  }, {
    key: "initMilestones",
    value: function initMilestones(sourceUpgradeID, modStartID, unlockStartID, features) {
      var MILESTONE_TIERS = [new _break_eternityMin.default(10), new _break_eternityMin.default(25), new _break_eternityMin.default(50), new _break_eternityMin.default(100), new _break_eternityMin.default(250), new _break_eternityMin.default(500), new _break_eternityMin.default(1000), new _break_eternityMin.default(2500), new _break_eternityMin.default(5000), new _break_eternityMin.default(10000), new _break_eternityMin.default(25000), new _break_eternityMin.default(50000), new _break_eternityMin.default(100000), new _break_eternityMin.default(250000), new _break_eternityMin.default(500000), new _break_eternityMin.default(1000000)];

      // Hidden upgrade object to act as source of milestone mods
      var sourceUpgrade = {
        id: sourceUpgradeID,
        realmID: null,
        name: "hidden milestone upgrade source",
        description: "hidden milestone upgrade source",
        level: new _break_eternityMin.default(1),
        maxLevel: new _break_eternityMin.default(1),
        costType: "force",
        costBase: 1,
        costGrowthRate: 1,
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
      var unlockID = unlockStartID;
      var modID = modStartID;
      var milestoneLevel = new _break_eternityMin.default(0);
      var _iterator11 = _createForOfIteratorHelper(features),
        _step11;
      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var feature = _step11.value;
          var modValue = new _break_eternityMin.default(2);

          //set feature initial nextMilestoneLevel info
          feature.nextMilestoneLevel = MILESTONE_TIERS[0];
          feature.nextMilestoneMult = modValue;
          for (var i = 0; i < MILESTONE_TIERS.length; i++) {
            milestoneLevel = MILESTONE_TIERS[i];
            var mod = new Mod(this.eventManager, modID, feature.id + "milestone" + milestoneLevel.toString(), "production", null, sourceUpgradeID, "mult", null, feature.id, "mult", modValue, modValue, false);
            this.mods.push(mod);
            this.gameManager.gameContent.mods.push(mod);
            this.gameManager.gameContent.idToObjectMap.set(modID, mod);
            var unlock = new Unlock(unlockID, "id", null, feature.id, mod.id, "manualLevel", milestoneLevel, "setActive", null);
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
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }
      var _iterator12 = _createForOfIteratorHelper(features),
        _step12;
      try {
        for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
          var _feature = _step12.value;
          _feature.milestoneTiers = MILESTONE_TIERS;
          _feature.setNextAffordableMilestoneLevel();
        }
      } catch (err) {
        _iterator12.e(err);
      } finally {
        _iterator12.f();
      }
    }
  }, {
    key: "buildSkillTree",
    value: function buildSkillTree() {
      var _this25 = this;
      var baseSkill = this.gameManager.gameContent.skillTree.skills.find(function (s) {
        return s.id === 4001;
      });
      var baseSkillNode = new SkillNode(baseSkill, 100, 0);
      baseSkill.node = baseSkillNode;
      var processConnectedNodes = function processConnectedNodes(skill) {
        var _loop2 = function _loop2() {
          var connectedSkillId = skill.connections[direction];
          var connectedSkill = _this25.gameManager.gameContent.skillTree.skills.find(function (s) {
            return s.id === connectedSkillId;
          });
          if (connectedSkill && !connectedSkill.node) {
            var position = _this25.calculateNodePosition(skill.node, direction);
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
          var targetSkill = _this25.gameManager.gameContent.skillTree.skills.find(function (s) {
            return s.id === targetSkillId;
          });
          if (targetSkill) {
            skill.node.connections[direction] = targetSkill.node;
            targetSkill.node.connections[_this25.oppositeDirection(direction)] = skill.node;
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
      var fixedLineLength = 90;
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
    key: "createModObjects",
    value: function createModObjects() {
      this.createMods(this.modsWaiting);
    }
  }, {
    key: "assignModPriorities",
    value: function assignModPriorities() {
      var typeValues = {
        "prodInit": 1,
        "prodBase": 100,
        "production": 1000,
        "costInit": 1,
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
        "tetra": 400,
        "addPercent": 900,
        "subPercent": 900
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
      var _this26 = this;
      this.mods.forEach(function (mod) {
        if (mod.sourceID) {
          mod.source = _this26.findObjectById(mod.sourceID);
        }
        if (mod.targetID) {
          mod.target = _this26.findObjectById(mod.targetID);
        }
      });
    }
  }, {
    key: "registerModsToSources",
    value: function registerModsToSources() {
      var _this27 = this;
      this.mods.forEach(function (mod) {
        _this27.registerModObserver(mod.source, mod);
        if (mod.specialActivator) {
          _this27.registerModObserver(mod.specialActivator, mod);
        }
      });
    }

    //register mod observers and push to calculation trees
  }, {
    key: "registerModObserversAndTrees",
    value: function registerModObserversAndTrees() {
      var _this28 = this;
      var typeMods = [];
      this.mods.forEach(function (mod) {
        if (mod.targetType) {
          typeMods.push(mod);
        } else if (mod.target) {
          _this28.addModToObjectCalcTree(mod.target, mod);
        } else {
          console.error("mod", mod.name, "is not initialized properly - missing: target type or target ID");
        }
      });
      this.typeModHandler(typeMods);
    }
  }, {
    key: "typeModHandler",
    value: function typeModHandler(typeMods) {
      var _this29 = this;
      typeMods.forEach(function (typeMod) {
        var featureLoop = null;

        //grab array of relevant targeted features
        if (typeMod.targetType === "forceTrain") {
          featureLoop = _this29.trainings.filter(function (training) {
            return training.realmID === 10;
          });
        } else if (typeMod.targetType === "wisdomTrain") {
          featureLoop = _this29.generators.filter(function (generator) {
            return generator.parentGenChain.realmID === 20;
          });
        }
        if (typeMod.targetType === "energyTrain") {
          featureLoop = _this29.trainings.filter(function (training) {
            return training.realmID === 30;
          });
        } else if (typeMod.targetType === "divineTrain") {
          featureLoop = _this29.generators.filter(function (generator) {
            return generator.parentGenChain.realmID === 40;
          });
        } else if (typeMod.targetType === "zones") {
          featureLoop = _this29.zones;
        } else if (typeMod.targetType === "allTrain") {
          featureLoop = _this29.trainings.concat(_this29.generators);
        }

        //add type mod to relevant feature
        var _iterator13 = _createForOfIteratorHelper(featureLoop),
          _step13;
        try {
          for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
            var feature = _step13.value;
            //make sure typemod does not apply to itself (upgrade that buffs upgrades)
            if (typeMod.source !== feature) {
              _this29.addModToObjectCalcTree(feature, typeMod);
            }
          }
        } catch (err) {
          _iterator13.e(err);
        } finally {
          _iterator13.f();
        }
      });
    }
  }, {
    key: "addModToObjectCalcTree",
    value: function addModToObjectCalcTree(targetObject, mod) {
      var tree = null;
      switch (mod.type) {
        case 'costInit':
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
        case 'prodInit':
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
      var _this30 = this;
      this.trainings.forEach(function (training) {
        var realm = _this30.realms.find(function (realm) {
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
      var _this31 = this;
      this.upgrades.forEach(function (upgrade) {
        var realm = _this31.realms.find(function (realm) {
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
      var _this32 = this;
      this.unlocks.forEach(function (unlock) {
        if (Array.isArray(unlock.targetID)) {
          unlock.target = unlock.targetID.map(function (id) {
            return _this32.findObjectById(id);
          });
        } else if (unlock.targetID) {
          unlock.target = _this32.findObjectById(unlock.targetID);
        }
        if (Array.isArray(unlock.dependentID)) {
          unlock.dependent = unlock.dependentID.map(function (id) {
            return _this32.findObjectById(id);
          });
        } else if (unlock.dependentID) {
          unlock.dependent = _this32.findObjectById(unlock.dependentID);
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
  }, {
    key: "createMods",
    value: function createMods(modData) {
      var _this33 = this;
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
          _data$specialActivato = data.specialActivatorID,
          specialActivatorID = _data$specialActivato === void 0 ? null : _data$specialActivato;
        var mod = new Mod(_this33.eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active, specialActivatorID);
        _this33.mods.push(mod);
        _this33.gameManager.gameContent.mods.push(mod);
        _this33.gameManager.gameContent.idToObjectMap.set(id, mod);
        if (mod.specialActivatorID) {
          mod.specialActivator = _this33.gameManager.findObjectById(specialActivatorID);
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
    key: "printZoneInfo",
    value: function printZoneInfo() {
      console.error("::::::::::::::::::::::::::");
      console.error("::::::   ZONES   ::::::");
      console.error("::::::::::::::::::::::::::");
      this.zones.forEach(function (zone) {
        console.error("Zone ".concat(zone.id, " - ").concat(zone.name));
        console.error(" Observers:");
        zone.observers.forEach(function (observer, index) {
          console.error("  Observer ".concat(index + 1, ": ").concat(observer.id, " ").concat(observer.name));
        });
        console.error(" Calc Trees:");
        zone.calcTreesMap.forEach(function (calcTree, key) {
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
      var _iterator14 = _createForOfIteratorHelper(this.gameManager.gameContent.unlocks),
        _step14;
      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var unlock = _step14.value;
          this.unlocksDiv.innerHTML += "".concat(unlock.dependent.name, " unlocks ").concat(unlock.target.name, " via ").concat(unlock.conditionType, " ").concat(unlock.conditionValue, "<br>");
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }
    }
  }, {
    key: "printWorldRegionZoneHeirarchy",
    value: function printWorldRegionZoneHeirarchy() {
      var str = "";
      var worldNum = 1;
      var zoneNames = [];
      var _iterator15 = _createForOfIteratorHelper(this.worlds),
        _step15;
      try {
        for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
          var world = _step15.value;
          var regionNum = 1;
          str += "World ".concat(worldNum, ": ").concat(world.name, " \n");
          var _iterator16 = _createForOfIteratorHelper(world.regions),
            _step16;
          try {
            for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
              var region = _step16.value;
              var zoneNum = 1;
              str += "   Region ".concat(regionNum, ": ").concat(region.name, " \n");
              var _iterator17 = _createForOfIteratorHelper(region.zones),
                _step17;
              try {
                for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
                  var zone = _step17.value;
                  zoneNames.push(zone.name);
                  if (zone.zoneType === "sideBoss") {
                    str += "     Zone ".concat(zoneNum, ": Side Boss: ").concat(zone.name, " \n");
                  } else if (zone.zoneType === "boss") {
                    str += "     Zone ".concat(zoneNum, ": Regional Boss: ").concat(zone.name, " \n");
                  } else {
                    str += "     Zone ".concat(zoneNum, ": ").concat(zone.name, " \n");
                  }
                  zoneNum++;
                }
              } catch (err) {
                _iterator17.e(err);
              } finally {
                _iterator17.f();
              }
              regionNum++;
            }
          } catch (err) {
            _iterator16.e(err);
          } finally {
            _iterator16.f();
          }
          str += '\n';
          worldNum++;
        }
      } catch (err) {
        _iterator15.e(err);
      } finally {
        _iterator15.f();
      }
      console.error(str);
      var duplicates = zoneNames.filter(function (value, index, self) {
        return self.indexOf(value) !== index;
      });
      console.log("Duplicates:", duplicates);
    }
  }]);
  return Builder;
}();
var GameUI = /*#__PURE__*/function () {
  function GameUI(eventManager, gameManager, gameStateManager, rewardManager) {
    var _this34 = this;
    _classCallCheck(this, GameUI);
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
    this.renderIntervalId = setInterval(function () {
      return _this34.renderZoneUpdates();
    }, 10); // Adjust interval as necessary
    this.zoneButtons = {};
  }
  _createClass(GameUI, [{
    key: "updateUI",
    value: function updateUI() {
      if (!this.isUiPopulated) {
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
      } else {
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
            console.warn("Unknown tab: ".concat(this.activeTab));
        }
        this.populateStatsRow();
        this.updateTabs();
      }
    }
  }, {
    key: "setupElements",
    value: function setupElements() {
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
  }, {
    key: "getActiveTabs",
    value: function getActiveTabs() {
      var activeTabs = [];

      // Iterate over the tab objects to check if the tab is active
      var _iterator18 = _createForOfIteratorHelper(this.tabs),
        _step18;
      try {
        for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
          var tab = _step18.value;
          if (tab.active && !tab.parentTab) {
            activeTabs.push(tab);
          }
        }
      } catch (err) {
        _iterator18.e(err);
      } finally {
        _iterator18.f();
      }
      return activeTabs;
    }
  }, {
    key: "setupTabs",
    value: function setupTabs() {
      this.initTabData();
      this.assignButtonsToTabObjects();
      this.currentTab = 'training'; //set default tab
      this.currentSubTab = 'force';
      this.currentTabHotkeys = null;
      this.isExplorationTabPopulated = false;
      this.populateStateChangeButtons();
      this.updateMultiplier();
      this.createTabEventListeners();
      this.tabIDs = ['training', 'forge', 'skills', 'exploration', 'essence', 'achievements', 'radiance', 'settings'];
    }
  }, {
    key: "initTabData",
    value: function initTabData() {
      var _this35 = this;
      this.tabs = [];
      _tabData.default.forEach(function (data) {
        var id = data.id,
          name = data.name,
          visible = data.visible,
          active = data.active,
          initialUnlockedFeatureIDs = data.initialUnlockedFeatureIDs,
          _data$subTabs = data.subTabs,
          subTabs = _data$subTabs === void 0 ? [] : _data$subTabs;
        var newTab = new Tab(_this35.eventManager, id, name, visible, active, initialUnlockedFeatureIDs);

        // set initial feature references
        if (newTab.initialUnlockedFeatureIDs) {
          var _iterator19 = _createForOfIteratorHelper(newTab.initialUnlockedFeatureIDs),
            _step19;
          try {
            for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
              var _id = _step19.value;
              newTab.initialUnlockedFeatureRefs.push(_this35.gameManager.findObjectById(_id));
            }
          } catch (err) {
            _iterator19.e(err);
          } finally {
            _iterator19.f();
          }
        }

        // create sub tabs if they exist
        subTabs.forEach(function (subTabData) {
          var id = subTabData.id,
            name = subTabData.name,
            visible = subTabData.visible,
            active = subTabData.active,
            initialUnlockedFeatureIDs = subTabData.initialUnlockedFeatureIDs;
          var newSubTab = new Tab(_this35.eventManager, id, name, visible, active, initialUnlockedFeatureIDs, null, newTab);

          // set initial feature references for subTab
          if (newSubTab.initialUnlockedFeatureIDs) {
            var _iterator20 = _createForOfIteratorHelper(newSubTab.initialUnlockedFeatureIDs),
              _step20;
            try {
              for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
                var _id2 = _step20.value;
                newSubTab.initialUnlockedFeatureRefs.push(_this35.gameManager.findObjectById(_id2));
              }
            } catch (err) {
              _iterator20.e(err);
            } finally {
              _iterator20.f();
            }
          }

          // Add sub tab to id to object map and parent tab's subTab list
          _this35.gameManager.gameContent.idToObjectMap.set(id, newSubTab);
          newTab.subTabs.push(newSubTab);
          if (newTab.subTabs.length === 1) {
            newTab.currentSubTab = newSubTab.name;
          }
          _this35.tabs.push(newSubTab);
          _this35.gameManager.gameContent.tabs.push(newSubTab);
        });

        // Add the tab to tabs list and id to object map
        _this35.tabs.push(newTab);
        _this35.gameManager.gameContent.tabs.push(newTab);
        _this35.gameManager.gameContent.idToObjectMap.set(id, newTab);
      });
    }
  }, {
    key: "assignButtonsToTabObjects",
    value: function assignButtonsToTabObjects() {
      var primaryTabButtons = Array.from(document.getElementsByClassName('tabButton'));
      var explorationSubTabButtons = Array.from(document.getElementsByClassName('exploration-tab-button'));
      var realmSubTabButtons = Array.from(document.getElementsByClassName('realm-button'));
      var allTabButtons = primaryTabButtons.concat(explorationSubTabButtons).concat(realmSubTabButtons);
      var _iterator21 = _createForOfIteratorHelper(allTabButtons),
        _step21;
      try {
        for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
          var tabButton = _step21.value;
          var tabButtonIdWithoutTab = tabButton.id.replace('Tab', '').replace('realm-', '').replace('Sub', '').toLowerCase();
          var _iterator22 = _createForOfIteratorHelper(this.tabs),
            _step22;
          try {
            for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
              var tab = _step22.value;
              if (tab.name === tabButtonIdWithoutTab) {
                tab.button = tabButton;
                break; // Breaks the inner loop if the matching button is found
              }
            }
          } catch (err) {
            _iterator22.e(err);
          } finally {
            _iterator22.f();
          }
        }
      } catch (err) {
        _iterator21.e(err);
      } finally {
        _iterator21.f();
      }
    }
  }, {
    key: "updateTabs",
    value: function updateTabs() {
      var _iterator23 = _createForOfIteratorHelper(this.tabs),
        _step23;
      try {
        for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
          var tab = _step23.value;
          this.updateVisibility(tab.button, tab.active);
        }
      } catch (err) {
        _iterator23.e(err);
      } finally {
        _iterator23.f();
      }
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this36 = this;
      this.numberSettings.addEventListener('change', this.updateNumberNotation.bind(this));
      this.multSettings = document.getElementById("multSettings");
      this.multSettings.addEventListener('click', this.updateMultiplierIndex.bind(this));
      this.eventManager.addListener('startFight', function (fighterID) {
        _this36.startFight(fighterID);
      });
      this.eventManager.addListener('zoneConquestProgress', this.handleZoneConquestProgress.bind(this));
      this.eventManager.addListener('zoneConquestComplete', this.handleZoneConquestComplete.bind(this));
      this.eventManager.addListener('zoneConquestStopped', this.handleZoneConquestStopped.bind(this));
    }
  }, {
    key: "buildUiSkeleton",
    value: function buildUiSkeleton() {
      var _this37 = this;
      _interfaceElementData.default.forEach(function (element) {
        if (!_this37[element.variableName]) {
          var newElement = document.createElement(element.tag);
          if (element.tag === "select") {
            element.options.forEach(function (optionValue) {
              var option = document.createElement('option');
              option.value = optionValue;
              option.text = optionValue;
              newElement.appendChild(option);
            });
          }
          newElement.id = element.id;

          // Assigning button text as id
          if (element.tag === "button") {
            var name = element.id;
            if (name.includes("SubTab")) {
              name = name.replace("SubTab", "");
            } else if (name.includes("Tab")) {
              name = name.replace("Tab", "");
            }

            // Making the first letter uppercase
            name = name.charAt(0).toUpperCase() + name.slice(1);
            newElement.textContent = name;
          }
          if (element.className) {
            newElement.className = element.className;
          }
          var parentElement = document.getElementById(element.parent);
          parentElement.appendChild(newElement);
          _this37[element.variableName] = newElement;
        }
      });
    }
  }, {
    key: "createTabEventListeners",
    value: function createTabEventListeners() {
      var _this38 = this;
      var tabButtons = document.getElementById('tab-buttons').getElementsByTagName('button');

      // Loop through each button and add a click event listener
      var _iterator24 = _createForOfIteratorHelper(tabButtons),
        _step24;
      try {
        var _loop4 = function _loop4() {
          var button = _step24.value;
          button.addEventListener('click', function () {
            // The button's id should correspond to the tab's id
            var tabId = button.id.slice(0, -3);
            _this38.changeTab(tabId);
          });
        };
        for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
          _loop4();
        }
      } catch (err) {
        _iterator24.e(err);
      } finally {
        _iterator24.f();
      }
    }
  }, {
    key: "changeTab",
    value: function changeTab(tabName) {
      // Hide the current tab
      var currentTabElement = document.getElementById(this.currentTab);
      if (currentTabElement) {
        currentTabElement.style.display = "none";
      }

      //set new current tab
      if (tabName) {
        this.currentTab = tabName;
      }

      // manual clicking rather than hotkeys caused issue with assigning subtabs
      // but nwo this breaks subtabs being remembered for hotkeys...
      var tabObject = this.tabs.find(function (tab) {
        return tab.name === tabName;
      });
      if (!tabObject.subTabs.length > 0) {
        this.currentSubTab = null;
      } else {
        this.currentSubTab = tabObject.currentSubTab;
      }

      // Show the new tab
      var newTabElement = document.getElementById(tabName);
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
  }, {
    key: "returnHotkeyNumberButtons",
    value: function returnHotkeyNumberButtons(tabID) {
      var _this39 = this;
      var currentTabElement = document.getElementById(tabID);
      var thisTab = this.tabs.find(function (tab) {
        return tab.name === _this39.currentTab;
      });
      var allButtons = Array.from(currentTabElement.querySelectorAll('button'));
      var filteredButtons = allButtons.filter(function (button) {
        return !(button.id.includes('realm') || button.id.includes('tab') || button.id.includes('refund') || button.id.includes('Tab')) && getComputedStyle(button).opacity !== '0';
      });
      return filteredButtons;
    }
  }, {
    key: "returnSubTabButtons",
    value: function returnSubTabButtons() {
      var currentTabElement = document.getElementById(this.currentTab);
      var allButtons = Array.from(currentTabElement.querySelectorAll('button'));
      var filteredButtons = allButtons.filter(function (button) {
        return button.id.includes('SubTab') && getComputedStyle(button).opacity !== '0';
      });
      if (filteredButtons.length === 0) {
        this.currentSubTab = null;
      }
      return filteredButtons;
    }
  }, {
    key: "isAffordable",
    value: function isAffordable(feature) {
      var currentResource = this.gameManager.queryPlayerValue(feature.costType);
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
  }, {
    key: "updateNumberNotation",
    value: function updateNumberNotation() {
      this.numberNotation = this.numberSettings.value;
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
      if (["1", "5", "10", "100"].includes(newValue)) {
        this.multSettings.textContent = "x".concat(newValue);
      } else {
        this.multSettings.textContent = newValue;
      }
      this.multiplierString = newValue;
      this.gameManager.onMultiplierChange(newValue);
    }
  }, {
    key: "populateStatsRow",
    value: function () {
      var _populateStatsRow = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _this40 = this;
        var statList, column, i, statDiv, statNameDiv, statValueDiv;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              statList = ['force', 'wisdom', 'energy', 'divine', 'crystal', 'essence', 'radiance', 'powerLevel']; // Create and add the elements only once
              if (!this.statsRow.querySelector('.force-stat')) {
                column = null;
                for (i = 0; i < statList.length; i++) {
                  // Check for 'powerLevel' or new column every 2 items
                  if (statList[i] === 'powerLevel' || i % 2 === 0) {
                    column = this.createElement('div', null, 'stats-column');
                    this.statsRow.appendChild(column);
                  }
                  statDiv = document.createElement('div');
                  statDiv.className = statList[i] === 'powerLevel' ? statList[i] : "".concat(statList[i], "-stat ").concat(statList[i], "-color");
                  statDiv.classList.add("stats-container");
                  statNameDiv = this.createElement('div', null, 'stat-name', "".concat(statList[i].charAt(0).toUpperCase() + statList[i].slice(1)));
                  statValueDiv = this.createElement('div', null, 'stat-value');
                  statDiv.appendChild(statNameDiv);
                  statDiv.appendChild(statValueDiv);
                  column.appendChild(statDiv);
                }
              }

              // Update Stats elements
              statList.forEach(function (stat) {
                var statDiv = _this40.statsRow.querySelector(".".concat(stat, "-stat")) || _this40.statsRow.querySelector(".".concat(stat));
                if (statDiv) {
                  if (stat === 'powerLevel') {
                    _this40.updateElementTextContent(statDiv, "Power Level: ".concat(_this40.formatNumber(_this40.gameManager.gameContent.player.powerLevel)));
                  } else {
                    var _statValueDiv = _this40.statsRow.querySelector(".".concat(stat, "-stat .stat-value")) || _this40.statsRow.querySelector(".".concat(stat, " .stat-value"));
                    if (_statValueDiv) {
                      _this40.updateElementTextContent(_statValueDiv, "".concat(_this40.formatNumber(_this40.gameManager.gameContent.player[stat])));
                    }
                  }
                  // Update the opacity of the statDiv based on the stat value
                  statDiv.style.opacity = _this40.gameManager.gameContent.player[stat] == 0 ? 0 : 1;
                }
              });
            case 3:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function populateStatsRow() {
        return _populateStatsRow.apply(this, arguments);
      }
      return populateStatsRow;
    }()
  }, {
    key: "populateStateChangeButtons",
    value: function populateStateChangeButtons() {
      var _this41 = this;
      // Get the save and load divs
      var saveButton = document.getElementById('save');
      var loadButton = document.getElementById('load');
      var resetButton = document.getElementById('reset');
      var completeUnlocksButton = document.getElementById('complete-unlocks');
      // const exportButton = document.getElementById('export');
      var rebirth1Button = document.getElementById('rebirth1');
      var rebirth2Button = document.getElementById('rebirth2');
      var rebirth3Button = document.getElementById('rebirth3');
      saveButton.disabled = false;
      loadButton.disabled = false;
      resetButton.disabled = false;
      // exportButton.disabled = false;
      rebirth1Button.disabled = false;
      rebirth2Button.disabled = true;
      rebirth3Button.disabled = true;
      this.saveButtonHandler = function () {
        _this41.gameStateManager.saveGameState(0);
        saveButton.innerHTML = "Game Saved!";
        saveButton.classList.add('fade');
        setTimeout(function () {
          saveButton.classList.remove('fade');
          saveButton.innerHTML = "Save";
        }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
      };

      this.loadButtonHandler = function () {
        _this41.eventManager.dispatchEvent('restart', 0);
        loadButton.innerHTML = "Game Loaded!";
        loadButton.classList.add('fade');
        setTimeout(function () {
          loadButton.classList.remove('fade');
          loadButton.innerHTML = "Load";
        }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
      };

      this.resetButtonHandler = function () {
        _this41.eventManager.dispatchEvent('restart', -1);
        resetButton.innerHTML = "Game Reset!";
        resetButton.classList.add('fade');
        setTimeout(function () {
          resetButton.classList.remove('fade');
          resetButton.innerHTML = "Reset";
        }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
      };

      this.completeUnlocksButtonHandler = function () {
        _this41.eventManager.dispatchEvent('complete-all-unlocks');
      };
      this.rebirth1ButtonHandler = function () {
        _this41.gameStateManager.saveGameState(1);
        rebirth1Button.innerHTML = "Rebirth1!";
        rebirth1Button.classList.add('fade');
        setTimeout(function () {
          rebirth1Button.classList.remove('fade');
          rebirth1Button.innerHTML = "Rebirth 1";
        }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
      };

      this.rebirth2ButtonHandler = function () {
        _this41.gameStateManager.saveGameState(2);
        rebirth2Button.innerHTML = "Rebirth2!";
        rebirth2Button.classList.add('fade');
        setTimeout(function () {
          rebirth2Button.classList.remove('fade');
          rebirth2Button.innerHTML = "Rebirth 2";
        }, 1000); // Set timeout to 2 seconds (2000 milliseconds)
      };

      this.rebirth3ButtonHandler = function () {
        _this41.gameStateManager.saveGameState(3);
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
  }, {
    key: "populateExplorationTab",
    value: function populateExplorationTab() {
      this.populateExplorationTabSubTabButtons();
      this.populateOdysseySubTab();
      this.populateTournamentSubTab();
      this.populateArtifactsSubTab();
    }
  }, {
    key: "populateExplorationTabSubTabButtons",
    value: function populateExplorationTabSubTabButtons() {
      var _this42 = this;
      if (!this.isExplorationTabPopulated) {
        var targetParent = document.getElementById('exploration');
        var tabButtonsContainer = document.getElementById("exploration-tab-buttons");
        var subTabButtons = Array.from(tabButtonsContainer.children);
        var subTabNames = subTabButtons.map(function (button) {
          return button.id.replace('SubTab', '').toLowerCase();
        });
        subTabButtons.forEach(function (button, index) {
          button.addEventListener('click', function () {
            return _this42.changeExplorationSubTab(button.id, subTabNames[index]);
          });
          var tabContent = document.getElementById("tab-content-".concat(button.id));
          var col1, col2;
          if (!tabContent) {
            tabContent = _this42.createElement('div', "tab-content-".concat(button.id));
            tabContent.style.display = index === 0 ? 'flex' : 'none'; // Only display the first tab by default

            col1 = _this42.createElement('div', "tab-col1-".concat(button.id), 'content-tab-col');
            col2 = _this42.createElement('div', "tab-col2-".concat(button.id), 'content-tab-col');
            tabContent.appendChild(col1);
            tabContent.appendChild(col2);
            targetParent.appendChild(tabContent);
          } else {
            col1 = document.getElementById("tab-col1-".concat(button.id));
            col2 = document.getElementById("tab-col2-".concat(button.id));
          }

          //universal event listener for the tournament subtab
          if (button.id === "TournamentSubTab" && !_this42.tournamentEventListenerAdded) {
            col1.addEventListener('click', function (event) {
              var target = event.target;
              // If clicked element is not a button, find the closest button ancestor
              if (target.tagName.toLowerCase() !== 'button') target = target.closest('button');
              if (target && target.tagName.toLowerCase() === 'button') {
                var fighterId = Number(target.id.replace('fight-button-', ''));
                if (fighterId && !target.disabled) {
                  _this42.startFight(fighterId);
                }
              }
            });
            _this42.tournamentEventListenerAdded = true;
          }
        });

        // If it's the first tab, add 'active-tab' class
        if (subTabButtons.length > 0) {
          subTabButtons[0].classList.add('active-tab');
        }
      }
      this.isExplorationTabPopulated = true;
    }
  }, {
    key: "changeExplorationSubTab",
    value: function changeExplorationSubTab(tabId, subTabName) {
      var _this43 = this;
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
      var thisTab = this.tabs.find(function (tab) {
        return tab.name === _this43.currentTab;
      });
      thisTab.currentSubTab = subTabName;

      // this.currentSubTab = `tab-content-${tabId}`;

      this.currentSubTab = subTabName;
      this.eventManager.dispatchEvent('updateHotkeyButtons');

      // Show the content of the clicked tab
      document.getElementById("tab-content-".concat(tabId)).style.display = 'flex';
    }
  }, {
    key: "changeOdysseySubTab",
    value: function changeOdysseySubTab(worldId) {
      // Get the parent container
      var tabButtonsContainer = document.getElementById("Odyssey-tab-buttons");
      var tabButtons = Array.from(tabButtonsContainer.children);

      // Remove 'active-tab' class from all tab buttons
      tabButtons.forEach(function (button) {
        button.classList.remove('active-tab');
      });

      // Add 'active-tab' class to the clicked button
      var targetTab = document.getElementById("worldTabButton-".concat(worldId));
      targetTab.classList.add('active-tab');

      // Get the parent container for the tab contents
      var targetParent = document.getElementById('tab-col2-OdysseySubTab');

      // Hide all tab contents
      var tabContents = Array.from(targetParent.children);
      tabContents.forEach(function (content) {
        if (content.id.includes('tab-content')) {
          content.style.display = 'none';
        }
      });

      // Show the content of the clicked tab
      document.getElementById("tab-content-world-".concat(worldId)).style.display = 'flex';
    }
  }, {
    key: "populateOdysseySubTab",
    value: function populateOdysseySubTab() {
      var _this44 = this;
      var subTabContainer = document.getElementById("tab-col1-OdysseySubTab");
      var worldsContainer = document.getElementById("tab-col2-OdysseySubTab");
      var worlds = this.gameManager.gameContent.worlds;
      var worldsTabButtonsContainer = document.getElementById("Odyssey-tab-buttons");
      if (!worldsTabButtonsContainer) {
        worldsTabButtonsContainer = this.createElement('div', "Odyssey-tab-buttons");
        subTabContainer.appendChild(worldsTabButtonsContainer);
      }
      worlds.forEach(function (world, index) {
        var worldTabButton = document.getElementById("worldTabButton-".concat(world.id));
        if (!worldTabButton) {
          worldTabButton = _this44.createElement('button', "worldTabButton-".concat(world.id), 'world-tab-button', "".concat(world.name));
          worldTabButton.addEventListener('click', function () {
            return _this44.changeOdysseySubTab(world.id);
          });
          worldsTabButtonsContainer.appendChild(worldTabButton);

          // If it's the first tab, add 'active-tab' class
          if (worldsTabButtonsContainer.children.length > 0) {
            worldsTabButtonsContainer.children[0].classList.add('active-tab');
          }
        }
        _this44.updateVisibility(worldTabButton, world.active);
        var worldTabContent = document.getElementById("tab-content-world-".concat(world.id));
        if (!worldTabContent) {
          worldTabContent = _this44.createElement('div', "tab-content-world-".concat(world.id));
          worldTabContent.style.display = index === 0 ? 'flex' : 'none'; // Only display the first tab by default

          worldsContainer.appendChild(worldTabContent);
        }
        _this44.populateWorld(worldTabContent, world);
        if (worldTabButton.classList.contains("active-tab")) {
          _this44.updateWorld(worldTabContent, world);
        }
      });
    }
  }, {
    key: "populateWorld",
    value: function populateWorld(worldContainer, world) {
      var worldCell = worldContainer.querySelector("#world-".concat(world.id));
      if (!worldCell) {
        worldCell = this.createElement('div', "world-".concat(world.id), 'world-cell');
        var worldName = this.createElement('div', "world-name-".concat(world.id), 'world-name', "".concat(world.name));
        worldCell.appendChild(worldName);
        var regionsContainer = this.createElement('div', null, 'regions-container');
        worldCell.appendChild(regionsContainer);
        worldContainer.appendChild(worldCell);
        if (world.regions) {
          this.populateRegions(regionsContainer, world.regions);
        }
      }
    }
  }, {
    key: "updateWorld",
    value: function updateWorld(worldContainer, world) {
      if (world.regions) {
        var regionsContainer = worldContainer.querySelector(".regions-container");
        this.updateRegions(regionsContainer, world.regions);
      }
    }
  }, {
    key: "populateRegions",
    value: function populateRegions(regionsContainer, regions) {
      var _this45 = this;
      regions.forEach(function (region) {
        var regionCell = regionsContainer.querySelector("#region-".concat(region.id));
        if (!regionCell) {
          regionCell = _this45.createElement('div', "region-".concat(region.id), 'region-cell');
          var regionName = _this45.createElement('div', null, 'region-name', "".concat(region.name));
          regionCell.appendChild(regionName);
          var zonesCol = _this45.createElement('div', null, 'zones-col');
          regionCell.appendChild(zonesCol);
          regionsContainer.appendChild(regionCell);

          // let zonesCol = regionCell.querySelector(`.zones-col`);
          if (region.zones) {
            _this45.populateZones(zonesCol, region.zones);
          }
        }
      });
    }
  }, {
    key: "updateRegions",
    value: function updateRegions(regionsContainer, regions) {
      var _this46 = this;
      regions.forEach(function (region) {
        if (region.zones) {
          var regionCell = regionsContainer.querySelector("#region-".concat(region.id));
          _this46.updateVisibility(regionCell, region.active);
          var zonesCol = regionCell.querySelector(".zones-col");
          _this46.updateZones(zonesCol, region.zones);
        }
      });
    }
  }, {
    key: "populateZones",
    value: function populateZones(zonesCol, zones) {
      var _this47 = this;
      var initialX = 400;
      var initialY = 0;
      zones.forEach(function (zone) {
        //create initial elements
        var zoneCell = zonesCol.querySelector("#zone-".concat(zone.id));
        if (!zoneCell) {
          zoneCell = _this47.createElement('div', "zone-".concat(zone.id), 'zone-cell');
          var topPosition = initialY;
          var leftPosition = initialX;
          // calculate the position of the zoneCell
          if (zone.parent) {
            var angleInRadians = zone.angleFromParent * (Math.PI / 180);
            topPosition = zone.parent.y + zone.distanceFromParent * Math.sin(angleInRadians);
            leftPosition = zone.parent.x + zone.distanceFromParent * Math.cos(angleInRadians);
          }
          zoneCell.style.position = 'absolute';
          zoneCell.style.top = "".concat(topPosition, "px");
          zoneCell.style.left = "".concat(leftPosition, "px");
          zone.y = topPosition;
          zone.x = leftPosition;

          //Add connecting lines
          if (zone.parent) {
            // Calculate the line's width (the distance between the cells) and angle
            var dx = zone.x - zone.parent.x;
            var dy = zone.y - zone.parent.y;
            var lineLength = Math.sqrt(dx * dx + dy * dy);
            var angle = Math.atan2(dy, dx) * 180 / Math.PI - 180;

            // Create line div and apply the calculated width and angle
            var line = _this47.createElement('div', null, 'zone-line');
            line.style.width = lineLength + 'px';
            line.style.transform = "rotate(".concat(angle, "deg)");

            // Append the line to the zone cell
            zoneCell.appendChild(line);
          }
          var button = _this47.createElement('button', "conquest-button-".concat(zone.id), 'zone-button');
          button.setAttribute('style', 'white-space:pre;');
          button.addEventListener('click', function () {
            if (!button.disabled && !zone.isConquesting) {
              zone.startConquest();
            }
          });
          var _zoneData = _this47.createElement('div', "zone-data-".concat(zone.id), null, "".concat(zone.name));
          button.appendChild(_zoneData);
          _this47.populateTooltip(zone, button);
          zoneCell.appendChild(button);
          zonesCol.appendChild(zoneCell);
          zone.elements.cell = zoneCell;
          zone.elements.button = button;
          zone.elements.data = _zoneData;
        }
      });
    }
  }, {
    key: "updateZones",
    value: function updateZones(zonesCol, zones) {
      var _this48 = this;
      zones.forEach(function (zone) {
        var zoneCell = zone.elements.cell;
        var button = zone.elements.button;
        var zoneData = zone.elements.data;

        // zoneData.textContent = `${zone.name}`;

        _this48.updateTooltip(zone);
        if (zone.zoneType === "boss") {
          button.style.border = '2px solid orange';
        } else if (zone.zoneType === "sideBoss") {
          button.style.border = '2px solid cyan';
        }
        if (zone.isDefeated && !zone.autoToggle) {
          button.style.border = '2px solid green';
        }
        if (!zone.active || !_this48.isAffordable(zone) || zone.isConquesting) {
          button.disabled = true;
          button.classList.remove('enabled');
        } else {
          button.disabled = false;
          button.classList.add('enabled');
        }
      });
    }
  }, {
    key: "handleZoneConquestProgress",
    value: function handleZoneConquestProgress(data) {
      this.zoneUpdates.set(data.zoneID, data.progress);
    }
  }, {
    key: "handleZoneConquestComplete",
    value: function handleZoneConquestComplete(data) {
      var zone = this.gameManager.findObjectById(data.zoneID);
      var button = this.getZoneButton(zone.id);
      button.disabled = false;
      button.classList.add('enabled');
      if (zone.repeatUnlocked) {
        button.click();
      }
    }
  }, {
    key: "handleZoneConquestStopped",
    value: function handleZoneConquestStopped(data) {
      var zone = this.gameManager.findObjectById(data.zoneID);
      var button = this.getZoneButton(zone.id);
      button.style.background = '';
      button.disabled = false;
      button.classList.remove('enabled');
    }
  }, {
    key: "getZoneButton",
    value: function getZoneButton(id) {
      if (!this.zoneButtons[id]) {
        this.zoneButtons[id] = document.querySelector("#conquest-button-".concat(id));
      }
      return this.zoneButtons[id];
    }
  }, {
    key: "renderZoneUpdates",
    value: function renderZoneUpdates() {
      var _iterator25 = _createForOfIteratorHelper(this.zoneUpdates),
        _step25;
      try {
        for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
          var _step25$value = _slicedToArray(_step25.value, 2),
            zoneID = _step25$value[0],
            progress = _step25$value[1];
          // Use Map's iteration syntax
          var zone = this.gameManager.findObjectById(zoneID);
          var button = this.getZoneButton(zone.id);
          if (progress === 1) {
            button.style.backgroundColor = "rgb(21, 97, 122)";
            button.style.backgroundImage = "";
          } else {
            button.style.backgroundColor = "rgb(21, 97, 122)";
            button.style.backgroundImage = "linear-gradient(to right, #90ee90 0%, #90ee90 ".concat(progress * 100, "%, transparent ").concat(progress * 100, "%, transparent 100%)");
          }
        }
      } catch (err) {
        _iterator25.e(err);
      } finally {
        _iterator25.f();
      }
      this.zoneUpdates.clear();
    }
  }, {
    key: "populateTournamentSubTab",
    value: function populateTournamentSubTab() {
      var _this49 = this;
      var tournamentCol = document.getElementById("tab-col1-TournamentSubTab");
      var tournament = this.gameManager.gameContent.tournament;
      var fighters = tournament.fighters;
      var tournamentData = this.findOrCreateElement(tournamentCol, 'div', 'tournament-data', ['tournament-color']);
      var rankData = this.findOrCreateElement(tournamentData, 'div', 'tournament-rank');
      var headbandData = this.findOrCreateElement(tournamentData, 'div', 'tournament-headband');
      var headbandPseudoObject = this.gameManager.findObjectById(800);
      var newHeadbandText = ["Headband Data:\n"];
      var _iterator26 = _createForOfIteratorHelper(headbandPseudoObject.observers),
        _step26;
      try {
        for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
          var obs = _step26.value;
          if (obs.active) {
            var str = "Modifiers: ".concat(obs.targetType, " ").concat(obs.runningCalcType, " (").concat(obs.value, " ").concat(obs.sourceCalcType, " ").concat(obs.source.level, ") \n");
            newHeadbandText.push(str);
          }
        }
      } catch (err) {
        _iterator26.e(err);
      } finally {
        _iterator26.f();
      }
      var newRankText = "Overall Rank: ".concat(tournament.rank);
      this.updateElementTextContent(headbandData, newHeadbandText.join('\r'));
      this.updateElementTextContent(rankData, newRankText);
      fighters.forEach(function (fighter) {
        var fighterCell = _this49.findOrCreateElement(tournamentCol, 'div', "fighter-".concat(fighter.id), ['fighter-cell', "color-".concat(fighter.tier)]);
        _this49.updateVisibility(fighterCell, fighter.visible);
        var button = _this49.findOrCreateElement(fighterCell, 'button', "fight-button-".concat(fighter.id), ['fight-button']);
        var newButtonText = "".concat(fighter.name, "\r\nUnlock:").concat(fighter.costType, " ").concat(_this49.formatNumber(fighter.costNext), "\r\nReward:").concat(_this49.formatNumber(fighter.prodNext), " ").concat(fighter.prodType, "\r\n");
        button.disabled = !fighter.active || !_this49.isAffordable(fighter) || fighter.isFighting;
        if (fighter.isDefeated) {
          button.style.background = "var(--color-".concat(fighter.tier, ")");
          button.style.color = 'white';
          button.style.border = '1px solid blue';
        } else {
          button.classList.remove('enabled');
        }
        _this49.updateElementTextContent(button, newButtonText);
      });
    }
  }, {
    key: "startFight",
    value: function startFight(id) {
      var tournament = this.gameManager.gameContent.tournament;
      var fighter = this.gameManager.findObjectById(id);
      var button = document.querySelector("#fight-button-".concat(id));
      fighter.isFighting = true;

      // let elapsedMs = 0;
      // let totalFightTimeMs = fighter.fightTime * 1000;

      var increment = 1 / (fighter.fightTime * 1000 / 10); // This gives you the increment size every 10 ms.

      var width = 0;
      var intervalId = setInterval(function () {
        width += increment;
        if (width >= 1) {
          clearInterval(intervalId);
          fighter.isFighting = false;
          tournament.handleFight(fighter.id);
          width = 0; // cap progress at 1
        }

        button.style.background = "linear-gradient(to right, #90ee90 0%, #90ee90 ".concat(width * 100, "%, #fff ").concat(width * 100, "%, #fff 100%)");
      }, 10); // Update every 10 milliseconds

      button.disabled = true;
      button.classList.remove('enabled');
    }
  }, {
    key: "populateArtifactsSubTab",
    value: function populateArtifactsSubTab() {
      var targetCol1 = document.getElementById("tab-col1-ArtifactsSubTab");
      var targetCol2 = document.getElementById("tab-col2-ArtifactsSubTab");
      var shardsMap = this.gameManager.gameContent.player.shards;
      var artifacts = this.gameManager.gameContent.artifacts;
      targetCol1.classList.add('artifacts-color');
      targetCol2.classList.add('artifacts-color');
      if (!this.artifactSubTabPopulated) {
        this.initialArtifactsSubTabPopulation(shardsMap, artifacts, targetCol1, targetCol2);
      }
      this.updateArtifactsSubTab(shardsMap, targetCol1, artifacts, targetCol2);
    }
  }, {
    key: "updateArtifactsSubTab",
    value: function updateArtifactsSubTab(shardsMap, targetCol1, artifacts, targetCol2) {
      var _this50 = this;
      if (this.artifactEvolving) {
        return;
      }
      // Update shard column
      shardsMap.forEach(function (amount, shardType) {
        var shardId = "shard-".concat(shardType);
        var shardCell = targetCol1.querySelector("#".concat(shardId));
        var shardName = shardCell.querySelector('.shard-name');
        shardName.textContent = "".concat(shardType, ": ").concat(_this50.formatNumber(new _break_eternityMin.default(amount)));
        shardCell.style.opacity = amount == 0 ? 0 : 1;
      });

      // Update Artifact Column
      var _iterator27 = _createForOfIteratorHelper(artifacts),
        _step27;
      try {
        for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
          var artifact = _step27.value;
          var artifactId = "artifact-".concat(artifact.id);
          var artifactCell = targetCol2.querySelector("#".concat(artifactId));

          // If an artifact cell exists for an evolved artifact, trigger evolution replacement
          if (artifactCell && artifact.evolved) {
            var newEvolvedArtifact = artifact.nextEvolveRef;
            var newArtifactCell = this.populateNewEvolvedArtifact(newEvolvedArtifact, artifactCell, targetCol2);
            this.updateFeatureCell(newEvolvedArtifact, newArtifactCell);
            this.updateAutobuyCheckbox(newEvolvedArtifact, newArtifactCell);
          }
          if (artifact.active) {
            this.updateFeatureCell(artifact, artifactCell);
            this.updateAutobuyCheckbox(artifact, artifactCell);
          }
        }
      } catch (err) {
        _iterator27.e(err);
      } finally {
        _iterator27.f();
      }
    }
  }, {
    key: "populateNewEvolvedArtifact",
    value: function populateNewEvolvedArtifact(newArtifact, artifactCell, container) {
      this.artifactEvolving = true;
      var position = Array.prototype.indexOf.call(container.children, artifactCell);
      var zIndex = artifactCell.style.zIndex;
      var artifactId = "artifact-".concat(newArtifact.id);
      var newArtifactCell = this.populateFeatureCell(newArtifact, container, artifactId, zIndex);
      this.populateAutobuyCheckbox(newArtifact, newArtifactCell, null);
      this.printArtifactEvolutionMessage(newArtifactCell);

      // Insert the new artifact cell at the position of the old one
      container.insertBefore(newArtifactCell, container.children[position]);
      if (newArtifact.autoUnlocked) {
        newArtifact.autoToggle = true;
        this.gameManager.artifactAutobuys.push(newArtifact);
      }

      // Remove the old artifact cell
      artifactCell.remove();
      this.artifactEvolving = false;
      return newArtifactCell;
    }
  }, {
    key: "initialArtifactsSubTabPopulation",
    value: function initialArtifactsSubTabPopulation(shardsMap, artifacts, targetCol1, targetCol2) {
      var _this51 = this;
      shardsMap.forEach(function (amount, shardType) {
        var shardId = "shard-".concat(shardType);
        var shardCell = targetCol1.querySelector("#".concat(shardId));
        if (!shardCell) {
          shardCell = _this51.createElement('div', shardId, 'shard-cell');
          var shardName = _this51.createElement('div', null, 'shard-name');
          shardCell.appendChild(shardName);
          targetCol1.appendChild(shardCell);
        }
      });

      // z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
      var zIndexCounter = 1000;

      // populate initial base item artifact cells and hide inactive ones
      var _iterator28 = _createForOfIteratorHelper(artifacts),
        _step28;
      try {
        for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
          var artifact = _step28.value;
          var currArtifactEvo = artifact;
          var artifactId = "artifact-".concat(currArtifactEvo.id);
          var artifactCell = targetCol2.querySelector("#".concat(artifactId));
          if (!currArtifactEvo.previousEvolution && !artifactCell) {
            artifactCell = this.populateFeatureCell(currArtifactEvo, targetCol2, artifactId, zIndexCounter);
            zIndexCounter--;
            this.populateAutobuyCheckbox(currArtifactEvo, artifactCell, null);
            this.updateVisibility(artifactCell, currArtifactEvo.visible);
          }
        }
      } catch (err) {
        _iterator28.e(err);
      } finally {
        _iterator28.f();
      }
      this.artifactSubTabPopulated = true;
    }
  }, {
    key: "printArtifactEvolutionMessage",
    value: function printArtifactEvolutionMessage(artifactCell) {
      var evolvedMessage = this.createElement('div', null, 'fadeout');
      evolvedMessage.textContent = 'Artifact evolved!';
      artifactCell.appendChild(evolvedMessage);

      // Remove the message after 2 seconds and apply fadeout class.
      setTimeout(function () {
        //   evolvedMessage.classList.add('fadeout');
        evolvedMessage.remove();
      }, 2000);
    }
  }, {
    key: "populateTrainingTab",
    value: function populateTrainingTab() {
      var _this52 = this;
      var targetParent = document.getElementById('training');
      // let realmButtonsContainer = document.getElementById('training-realm-buttons');

      this.gameManager.gameContent.realms.forEach(function (realm, index) {
        var realmId = "".concat(realm.name, "SubTab");
        var realmButton = document.getElementById(realmId);
        var realmContent = document.getElementById("realm-content-".concat(realm.name));
        var col1, col2;
        if (!realmContent) {
          realmButton.addEventListener('click', function () {
            return _this52.changeRealmSubTab(realmId, realm.name);
          });
          // If it's the first realm, add 'active-tab' class
          if (index === 0) {
            realmButton.classList.add('active-tab');
          }
          realmContent = _this52.createElement('div', "realm-content-".concat(realm.name), "realm-content");
          realmContent.style.display = index === 0 ? 'flex' : 'none'; // Only display the first realm by default

          col1 = _this52.createElement('div', "".concat(realm.type, "-col1-").concat(realm.name), 'content-tab-col');
          col2 = _this52.createElement('div', "".concat(realm.type, "-col2-").concat(realm.name), 'content-tab-col');
          realmContent.appendChild(col1);
          realmContent.appendChild(col2);
          targetParent.appendChild(realmContent);
        } else {
          col1 = document.getElementById("".concat(realm.type, "-col1-").concat(realm.name));
          col2 = document.getElementById("".concat(realm.type, "-col2-").concat(realm.name));
        }
        _this52.populateRealm(col1, col2, realm);
      });
    }
  }, {
    key: "populateAutobuyCheckbox",
    value: function populateAutobuyCheckbox(feature, container, heap) {
      var _this53 = this;
      var checkbox = container.querySelector("#checkbox-".concat(feature.id));
      var label = container.querySelector("#label-".concat(feature.id));
      if (!checkbox) {
        checkbox = this.createElement('input', "checkbox-".concat(feature.id));
        checkbox.type = 'checkbox';
        checkbox.style.display = 'none';
        checkbox.addEventListener('change', function () {
          feature.autoToggle = checkbox.checked;
          if (feature.featureType === "artifact") {
            if (checkbox.checked) {
              _this53.gameManager.artifactAutobuys.push(feature);
            } else {
              _this53.gameManager.artifactAutobuys = _this53.gameManager.artifactAutobuys.filter(function (item) {
                return item !== feature;
              });
            }
          } else {
            if (checkbox.checked) {
              heap.add(feature);
              feature.currentAutoHeap = heap;
            } else {
              heap.remove(feature);
              feature.currentAutoHeap = null;
            }
          }
        });
        label = this.createElement('label', "label-".concat(feature.id), null, "Auto");
        label.htmlFor = checkbox.id;
        label.style.fontSize = 'small';
        container.appendChild(checkbox);
        container.appendChild(label);
      }
    }
  }, {
    key: "updateAutobuyCheckbox",
    value: function updateAutobuyCheckbox(feature, container) {
      // Update checkbox visibility based on feature.autoUnlocked
      var checkbox = container.querySelector("#checkbox-".concat(feature.id));
      var label = container.querySelector("#label-".concat(feature.id));
      if (feature.autoUnlocked) {
        //changed to opacity vs display so the UI space is already taken and doesnt shift elements on enable
        label.style.opacity = 1;
        label.style.pointerEvents = 'auto';
      } else {
        label.style.opacity = 0;
        label.style.pointerEvents = 'none';
      }

      // Update checkbox checked state based on feature.autoToggle
      if (feature.maxLevel.eq(feature.level)) {
        checkbox.checked = false;
        checkbox.disabled = true;
      } else {
        checkbox.checked = feature.autoToggle;
        checkbox.disabled = !feature.active;
      }
    }
  }, {
    key: "populateTooltip",
    value: function populateTooltip(feature, element) {
      var tooltip = this.createElement('span', "tooltip-".concat(feature.id), 'tooltip-text', "Tooltip content here");
      element.appendChild(tooltip);
    }
  }, {
    key: "updateTooltip",
    value: function updateTooltip(feature) {
      var tooltipText = ["".concat(feature.description), '------'];
      if (feature.featureType === "forgeUpgrade") {
        tooltipText.push("".concat(feature.costBase, " ").concat(feature.costType));
      } else if (feature.featureType === "zone") {
        if (feature.zoneType === "boss") {
          tooltipText.push("Region Boss1 skillpoint on first kill");
        }
        tooltipText.push("Unlock: ".concat(this.formatNumber(feature.costNext), " ").concat(feature.costType));
        tooltipText.push("".concat(this.formatNumber(feature.prodNext), " ").concat(feature.prodType, " / ").concat(Math.round(feature.conquestTime * 100) / 100, " sec"));
      } else if (feature.featureType === "skill") {} else if (feature.featureType === "artifact") {
        tooltipText.push("Unlocks zone repeating (if upgrade purchased) for zones that unlocked it\n");
        tooltipText.push("Evolution Tier: ".concat(feature.evolutionTier));
        tooltipText.push("Artifact evolves at level ".concat(feature.maxLevel));
      } else if (feature.featureType === "essenceUpgrade") {} else if (feature.featureType === "achievement") {
        tooltipText.push("Radiance Bonus: ".concat(feature.radianceReward));
        var achievementText = 'Set Bonus: ' + feature.set.description;
        if (feature.set.completed) {
          achievementText = "<span style = \"color:".concat(feature.set.color, "; font-weight:bold;\">").concat(achievementText, " <br>(Active)</span>");
        }
        tooltipText.push(achievementText);
      } else if (feature.featureType === "upgrade") {
        var _iterator29 = _createForOfIteratorHelper(feature.observers),
          _step29;
        try {
          var _loop5 = function _loop5() {
            var obs = _step29.value;
            // Check if 'obs' has a 'targetType' property
            if (obs.targetType) {
              tooltipText.push('type targetting - not handled yet ');
              return "continue"; // Skip to the next iteration of the loop
            }
            var tree = obs.target.calcTreesMap.get("production");
            var targetNode = tree.nodes.find(function (node) {
              return node.ref.id === obs.id;
            });
            var treeType = "prod";

            // Check if targetNode wasn't found in 'production'. If not, look for it in 'cost'
            if (!targetNode) {
              tree = obs.target.calcTreesMap.get("cost");
              targetNode = tree.nodes.find(function (node) {
                return node.ref.id === obs.id;
              });
              treeType = "cost";
            }
            if (targetNode) {
              var result = tree.calcNodeResult(targetNode, obs.source.level);
              tooltipText.push("Current Contribution: ".concat(obs.target.name, " ").concat(treeType, " ").concat(obs.runningCalcType, " ").concat(result.toFixed(3), " "));
            }
          };
          for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
            var _ret = _loop5();
            if (_ret === "continue") continue;
          }
        } catch (err) {
          _iterator29.e(err);
        } finally {
          _iterator29.f();
        }
      } else if (feature.featureType === "training" || feature.featureType === "generator") {
        tooltipText.push("prodMult ".concat(feature.prodMult.toPrecision(2), " | prodGrowthRate ").concat(feature.prodGrowthRate.toPrecision(2)));
        tooltipText.push("costMult ".concat(feature.costMult.toPrecision(2), " | costGrowthRate ").concat(feature.costGrowthRate.toPrecision(2)));
        tooltipText.push("Evolution Tier: ".concat(feature.evolutionTier));

        //dont display prodNext value on upgrades or features who dont have prodNext
        if (feature.prodNext.gt(0)) {
          //incorporate milestone multipliers into next calculations where applicable
          var milestoneMult = new _break_eternityMin.default(1);
          if (feature.milestoneTiers && feature.featureType !== "artifact") {
            if (feature.nextLevelIncrement.plus(feature.manualLevel).gte(feature.nextMilestoneLevel)) {
              milestoneMult = feature.nextMilestoneMult;
            }
            tooltipText.push("Next Milestone:".concat(feature.nextMilestoneLevel, "\nNext Milestone Mult:").concat(feature.nextMilestoneMult));
          }
        }
      }
      var newContent = tooltipText.join('\n');
      var tooltipElement = document.getElementById("tooltip-".concat(feature.id));
      this.updateElementHTML(tooltipElement, newContent);
    }
  }, {
    key: "createElement",
    value: function createElement(type) {
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var classes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var textContent = arguments.length > 3 ? arguments[3] : undefined;
      var element = document.createElement(type);
      if (id) {
        element.id = id;
      }
      if (typeof classes === 'string') {
        element.classList.add(classes);
      } else if (Array.isArray(classes)) {
        var _iterator30 = _createForOfIteratorHelper(classes),
          _step30;
        try {
          for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {
            var cls = _step30.value;
            element.classList.add(cls);
          }
        } catch (err) {
          _iterator30.e(err);
        } finally {
          _iterator30.f();
        }
      }
      if (textContent) {
        element.textContent = textContent;
      }
      return element;
    }
  }, {
    key: "findOrCreateElement",
    value: function findOrCreateElement(parent, type, id) {
      var classes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      var element = parent.querySelector("#".concat(id));
      if (!element) {
        element = this.createElement(type, id, classes);
        parent.appendChild(element);
      }
      return element;
    }
  }, {
    key: "updateVisibility",
    value: function updateVisibility(element, condition) {
      // element.style.display = condition ? 'block' : 'none';
      element.style.opacity = condition ? 1 : 0;
      element.style.pointerEvents = condition ? 'auto' : 'none';
    }
  }, {
    key: "updateElementTextContent",
    value: function updateElementTextContent(element, newContent) {
      if (element.textContent !== newContent) {
        element.textContent = newContent;
      }
    }
  }, {
    key: "updateElementHTML",
    value: function updateElementHTML(element, newContent) {
      if (element.innerHTML !== newContent) {
        element.innerHTML = newContent;
      }
    }
  }, {
    key: "clearElement",
    value: function clearElement(element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
  }, {
    key: "populateTabInfo",
    value: function populateTabInfo() {
      var _this54 = this;
      var checker = document.querySelector(".tab-info-container");
      if (!checker) {
        var tabs = [{
          id: 'training',
          infoText: 'INFOnHotkeys'
        }, {
          id: 'forge',
          infoText: 'INFOnHotkeys'
        }, {
          id: 'tab-content-OdysseySubTab',
          infoText: 'INFOnHotkeys'
        }, {
          id: 'tab-content-TournamentSubTab',
          infoText: 'INFOnHotkeys'
        }, {
          id: 'tab-content-ArtifactsSubTab',
          infoText: 'INFOnHotkeys'
        }, {
          id: 'essence',
          infoText: 'INFOnHotkeys'
        }, {
          id: 'skills',
          infoText: 'INFOnHotkeys'
        }, {
          id: 'achievements',
          infoText: 'INFOnHotkeys'
        }, {
          id: 'radiance',
          infoText: 'INFOnHotkeys'
        }];
        var _loop6 = function _loop6() {
          var tab = _tabs[_i2];
          var targetElement = document.getElementById(tab.id);
          if (targetElement) {
            var tabInfoContainer = _this54.createElement('div', "".concat(tab.id, "-tab-info"), "tab-info-container");
            var infoIcon = _this54.createElement('img', null, "info-icon");
            infoIcon.src = _infoIcon.default;
            infoIcon.alt = 'Info';
            var infoTextContainer = _this54.createElement('div', "".concat(tab.id, "-info-text"), 'info-text-container', tab.infoText);
            infoTextContainer.style.display = "none"; // initially hidden

            infoIcon.addEventListener('click', function () {
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
        };
        for (var _i2 = 0, _tabs = tabs; _i2 < _tabs.length; _i2++) {
          _loop6();
        }
      }
    }
  }, {
    key: "populateFeatureCell",
    value: function populateFeatureCell(feature, targetCol, featureId, zIndex) {
      var _this55 = this;
      var realmTypeForColor = targetCol.id.split("-")[0];
      var cell = this.createElement('div', featureId, ["feature-cell", "".concat(feature.featureType, "-cell"), "".concat(realmTypeForColor, "-color")]);
      cell.style.zIndex = zIndex;
      var trainingName = this.createElement('div', null, ["feature-name", feature.featureType + '-name'], feature.name + " lvl " + feature.level + "\n" + feature.description);
      cell.appendChild(trainingName);
      var button = this.createElement('button', "button-".concat(feature.id));

      // Create a span to hold the button's text
      var buttonText = this.createElement('span', "buttonText-".concat(feature.id));
      button.style.zIndex = zIndex;
      button.appendChild(buttonText);
      this.populateTooltip(feature, button);
      button.addEventListener('click', function () {
        _this55.buyFeature(feature.id);
      });
      cell.appendChild(button);
      targetCol.appendChild(cell);
      return cell;
    }
  }, {
    key: "updateFeatureCell",
    value: function updateFeatureCell(feature, featureCell) {
      this.updateVisibility(featureCell, feature.active);
      var featureNameElement = featureCell.querySelector('.' + feature.featureType + '-name');
      var featureNameText = feature.name + " lvl " + this.formatNumber(feature.level.floor());
      this.updateElementTextContent(featureNameElement, featureNameText);

      // Update button text, style, and clickability based on feature.active
      var buttonTextElement = featureCell.querySelector("#buttonText-".concat(feature.id));
      var newButtonText = [];
      newButtonText.push("+".concat(feature.nextLevelIncrement, " level\r\n"));
      newButtonText.push("-".concat(this.formatNumber(feature.costNext), " ").concat(feature.costType, "\r\n"));

      //dont display prodNext value on upgrades or features who dont have prodNext
      if (feature.prodNext.gt(0)) {
        //incorporate milestone multipliers into next calculations where applicable
        var milestoneMult = new _break_eternityMin.default(1);
        if (feature.milestoneTiers && feature.featureType !== "artifact") {
          if (feature.nextLevelIncrement.plus(feature.manualLevel).gte(feature.nextMilestoneLevel)) {
            milestoneMult = feature.nextMilestoneMult;
            newButtonText.push("+".concat(this.formatNumber(feature.prodNext.plus(feature.prodCurrent).times(milestoneMult).minus(feature.prodCurrent)), " ").concat(feature.prodType.replace("Income", ""), "/sec"));
          } else {
            newButtonText.push("+".concat(this.formatNumber(feature.prodNext), " ").concat(feature.prodType.replace("Income", ""), "/sec"));
          }
        } else {
          newButtonText.push("+".concat(this.formatNumber(feature.prodNext), " ").concat(feature.prodType.replace("Income", ""), "/sec"));
        }
      }
      var button = featureCell.querySelector("#button-".concat(feature.id));
      if (feature.active && feature.level.neq(feature.maxLevel) && this.isAffordable(feature) && feature.nextLevelIncrement.gt(0)) {
        button.disabled = false;
        button.classList.add('enabled');
        button.classList.remove('disabled');
      } else if (feature.level.eq(feature.maxLevel)) {
        button.disabled = true;
        button.classList.remove('enabled');
        button.classList.add('disabled', 'complete');
        newButtonText = ["max"];
      } else {
        button.disabled = true;
        button.classList.remove('enabled');
        button.classList.add('disabled');
      }
      this.updateTooltip(feature);
      this.updateElementTextContent(buttonTextElement, newButtonText.join("\r"));
    }
  }, {
    key: "populateCurrentValueElement",
    value: function populateCurrentValueElement(feature, featureCell) {
      var currentValueElement = this.createElement('div', null, ["feature-current-value", "".concat(feature.featureType, "-current-value")]);
      featureCell.appendChild(currentValueElement);
      return currentValueElement;
    }
  }, {
    key: "populateFeatureDescription",
    value: function populateFeatureDescription(feature, featureCell) {
      var featureDescription = this.createElement('div', null, "".concat(feature.featureType, "-description"));
      featureDescription.setAttribute('style', 'font-size:10px; max-width: 150px;');
      featureCell.appendChild(featureDescription);
      featureDescription.textContent = "\n" + feature.description;
      return featureDescription;
    }
  }, {
    key: "populateRealm",
    value: function populateRealm(targetCol1, targetCol2, realm) {
      var _this56 = this;
      var realmFeatures;
      if (realm.type === "force" || realm.type === "energy") {
        realmFeatures = realm.trainings;
      } else if (realm.type === "wisdom" || realm.type === "divine") {
        realmFeatures = realm.generatorChains[0].generators;
      }

      // z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
      var zIndexCounter = 1000;
      realmFeatures.forEach(function (feature) {
        var featureId = "feature-".concat(feature.id);
        var featureCell = targetCol1.querySelector("#".concat(featureId));
        var currentValueElement;
        if (!featureCell) {
          featureCell = _this56.populateFeatureCell(feature, targetCol1, featureId, zIndexCounter);
          zIndexCounter--;
          _this56.populateAutobuyCheckbox(feature, featureCell, _this56.gameManager[realm.type + 'Heap']);
          currentValueElement = _this56.populateCurrentValueElement(feature, featureCell);
        } else {
          currentValueElement = featureCell.querySelector(".".concat(feature.featureType, "-current-value"));
        }
        _this56.updateAutobuyCheckbox(feature, featureCell);
        if (feature.prodCurrent.gt(0)) {
          var newCurrentValueText = "".concat(_this56.formatNumber(feature.prodCurrent), " ").concat(feature.prodType.replace("Income", ""), "/sec\r\n");
          _this56.updateElementTextContent(currentValueElement, newCurrentValueText);
        }
        _this56.updateFeatureCell(feature, featureCell);
      });
      realm.upgrades.forEach(function (upgrade) {
        var upgradeId = "upgrade-".concat(upgrade.id);
        var upgradeCell = targetCol2.querySelector("#".concat(upgradeId));
        if (!upgradeCell) {
          upgradeCell = _this56.populateFeatureCell(upgrade, targetCol2, upgradeId, zIndexCounter);
          zIndexCounter--;
          _this56.populateAutobuyCheckbox(upgrade, upgradeCell, _this56.gameManager[realm.type + 'Heap']);
          targetCol2.appendChild(upgradeCell);
        }
        _this56.updateAutobuyCheckbox(upgrade, upgradeCell);
        _this56.updateFeatureCell(upgrade, upgradeCell);
      });
    }
  }, {
    key: "changeRealmSubTab",
    value: function changeRealmSubTab(realmId, realmType) {
      var _this57 = this;
      // Get the parent container
      var realmButtonsContainer = document.getElementById("training-realm-buttons");

      // Get the children of the parent container
      var realmButtons = realmButtonsContainer.children;

      // Remove 'active-tab' class from all realm buttons
      for (var i = 0; i < realmButtons.length; i++) {
        realmButtons[i].classList.remove('active-tab');
      }

      // Add 'active-tab' class to the clicked button
      var newRealmButton = document.getElementById(realmId);
      newRealmButton.classList.add('active-tab');

      // Hide all realm contents
      var realmContents = document.getElementById("training").children;
      for (var _i3 = 0; _i3 < realmContents.length; _i3++) {
        if (realmContents[_i3].id.includes('realm-content')) {
          realmContents[_i3].style.display = 'none';
        }
      }
      var thisTab = this.tabs.find(function (tab) {
        return tab.name === _this57.currentTab;
      });
      thisTab.currentSubTab = realmType;
      this.currentSubTab = realmType;
      this.eventManager.dispatchEvent('updateHotkeyButtons');

      // Show the content of the clicked realm
      var newRealm = document.getElementById("realm-content-".concat(realmType));
      newRealm.style.display = 'flex';
    }
  }, {
    key: "populateForgeUpgradesTab",
    value: function populateForgeUpgradesTab() {
      var _this58 = this;
      var targetParent = document.getElementById('forge-upgrades-columns');
      var upgradeSectionNames = ['force', 'wisdom', 'energy', 'divine', 'crystal'];
      var allforgeUpgrades = {};
      upgradeSectionNames.forEach(function (section) {
        allforgeUpgrades[section] = _this58.gameManager.gameContent.forgeUpgrades.filter(function (upgrade) {
          return upgrade.costType === section;
        });
      });
      upgradeSectionNames.forEach(function (sectionName) {
        var upgrades = allforgeUpgrades[sectionName];
        var colID = 'forgeUpgrades-' + sectionName;
        var col = document.getElementById(colID);

        //create initial elements
        if (!col) {
          col = _this58.createElement('div', colID, ['content-tab-col', "".concat(sectionName, "-color")]);
          var colContent = _this58.createElement('div', null, 'forge-upgrade-col');
          var colTitle = _this58.createElement('div', null, null, sectionName.charAt(0).toUpperCase() + sectionName.slice(1));
          col.appendChild(colTitle);

          // z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
          var zIndexCounter = 1000;
          upgrades.forEach(function (upgrade) {
            var upgradeID = colID + '-' + upgrade.id;
            var upgradeCell = _this58.createElement('div', upgradeID, 'forge-upgrade-cell');
            var button = _this58.createElement('button', "button-".concat(upgrade.id), 'forge-upgrade-button');
            button.style.zIndex = zIndexCounter;
            var upgradeContent = _this58.createElement('div', "upgrade-content-".concat(upgrade.id));
            button.appendChild(upgradeContent);
            button.addEventListener('click', function () {
              _this58.buyFeature(upgrade.id);
            });
            _this58.populateTooltip(upgrade, button);
            upgradeCell.appendChild(button);
            colContent.appendChild(upgradeCell);
            zIndexCounter--;
          });
          col.appendChild(colContent);
          targetParent.appendChild(col);
        }

        //populate/update existing elements
        upgrades.forEach(function (upgrade) {
          var button = col.querySelector("#button-".concat(upgrade.id));
          var upgradeContent = document.getElementById("upgrade-content-".concat(upgrade.id));
          _this58.updateElementTextContent(upgradeContent, upgrade.name);
          _this58.updateTooltip(upgrade);
          _this58.updateVisibility(button, upgrade.active);
          if (upgrade.level.eq(upgrade.maxLevel)) {
            button.disabled = true;
            button.classList.remove('enabled');
            button.classList.add('complete');
            button.style.backgroundColor = "var(--".concat(sectionName, "-color)");
            button.children[0].style.color = "white";
          } else if (upgrade.active && upgrade.level !== upgrade.maxLevel && _this58.isAffordable(upgrade) && upgrade.nextLevelIncrement.gt(0)) {
            button.disabled = false;
            button.classList.add('enabled');
            // button.classList.remove('disabled');
          } else {
            button.disabled = true;
            // button.classList.add('disabled');
            button.classList.remove('enabled');
          }
        });
      });
    }
  }, {
    key: "populateSettingsTab",
    value: function populateSettingsTab() {
      var _this59 = this;
      var player = this.gameManager.gameContent.player;
      var settingsTabContent = document.getElementById('settings');
      var settingsTabContainer = document.getElementById('settings-tab-container');
      var settingsHotkeyList = document.getElementById('settings-hotkeys');
      var settingsPlayerStats = document.getElementById('settings-stats');
      var rewardContainer = document.getElementById('reward-container');
      if (!settingsTabContainer) {
        var col1 = this.createElement('div', null, 'content-tab-col');
        var col2 = this.createElement('div', null, 'content-tab-col');
        settingsTabContainer = this.createElement('div', 'settings-tab-container');
        settingsHotkeyList = this.createElement('div', "settings-hotkeys");
        settingsHotkeyList.innerHTML = "\n\t\t\t<b>Hotkeys:</b>\n\t\t\tNext Tab:           Tab\n\t\t\tPrevious Tab:    Shift+Tab";
        settingsPlayerStats = this.createElement('div', "settings-stats");

        // Add a new container for the rewards
        rewardContainer = this.createElement('div', 'reward-container');

        // Create elements for daily reward
        var dailyRewardContainer = this.createElement('div', 'dailyRewardContainer');
        var dailyRewardTitle = this.createElement('div', null, null, 'Daily Reward');
        var _dailyRewardTimer = this.createElement('div', 'dailyRewardTimer');
        var _dailyRewardButton = this.createElement('button', 'dailyRewardButton', null, 'Claim Daily Reward');
        _dailyRewardButton.onclick = function () {
          return _this59.rewardManager.giveDailyReward();
        };

        // Create elements for hourly reward
        var hourlyRewardContainer = this.createElement('div', 'hourlyRewardContainer');
        var _hourlyRewardTitle = this.createElement('div', 'hourlyRewardTitle', null, 'Hourly Reward');
        var _hourlyRewardTimer = this.createElement('div', 'hourlyRewardTimer');
        var _hourlyRewardButton = this.createElement('button', 'hourlyRewardButton', null, 'Claim Hourly Reward');
        _hourlyRewardButton.onclick = function () {
          return _this59.rewardManager.giveHourlyReward();
        };
        var gameInfo = this.createElement('div', null, null, "version ".concat(this.gameStateManager.version));

        //SETTINGS
        //tooltips
        var tooltipContainer = settingsTabContent.querySelector("#tooltips-settings-container");
        var checkbox = settingsTabContent.querySelector("#checkbox-tooltips");
        var label = settingsTabContent.querySelector("#label-tooltips");
        if (!tooltipContainer) {
          tooltipContainer = this.createElement('div', 'tooltips-settings-container');
          var tooltipTitle = this.createElement('div', null, null, "Toggle Tooltips");
          var tooltipCheckBox = document.createElement('div');
          checkbox = this.createElement('input', "checkbox-tooltips");
          checkbox.type = 'checkbox';
          checkbox.style.display = 'none';
          checkbox.checked = true;
          checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
              document.querySelector('#root').classList.remove('tooltips-off');
            } else {
              document.querySelector('#root').classList.add('tooltips-off');
            }
          });
          label = this.createElement('label', "label-tooltips");
          label.htmlFor = checkbox.id;
          tooltipCheckBox.appendChild(checkbox);
          tooltipCheckBox.appendChild(label);
          tooltipContainer.appendChild(tooltipTitle);
          tooltipContainer.appendChild(tooltipCheckBox);
          settingsTabContent.appendChild(tooltipContainer);
        }

        // Append all elements to the DOM

        dailyRewardContainer.appendChild(dailyRewardTitle);
        dailyRewardContainer.appendChild(_dailyRewardTimer);
        dailyRewardContainer.appendChild(_dailyRewardButton);
        hourlyRewardContainer.appendChild(_hourlyRewardTitle);
        hourlyRewardContainer.appendChild(_hourlyRewardTimer);
        hourlyRewardContainer.appendChild(_hourlyRewardButton);
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
      settingsPlayerStats.innerHTML = "\n\t\t<b>Lifetime Stats:</b>\n\t\t\r\nMax PowerLevel Achieved: ".concat(this.formatNumber(player.maxPowerLevelAchieved), "\n\t\t\r\nLifetime Force Earned: ").concat(this.formatNumber(player.lifetimeForceEarned), "\n\t\t\rLifetime Wisdom Earned: ").concat(this.formatNumber(player.lifetimeWisdomEarned), "\n\t\t\nLifetime Energy Earned: ").concat(this.formatNumber(player.lifetimeEnergyEarned), "\n\t\t\nLifetime Divine Earned: ").concat(this.formatNumber(player.lifetimeDivineEarned), "\n\t\t\nLifetime Essence Earned: ").concat(this.formatNumber(player.lifetimeEssenceEarned), "\n\t\t\nLifetime Crystal Earned: ").concat(this.formatNumber(player.lifetimeCrystalEarned), "\n\t\t\nMax World Achieved: ").concat(this.formatNumber(player.maxProgressionWorld), "\n\t\t\nMax Region Achieved: ").concat(this.formatNumber(player.maxProgressionRegion), "\n\t\t\nLifetime Zone Completions: ").concat(this.formatNumber(player.lifetimeZoneCompletions), "\n\t\t\nLifetime Region Progressions: ").concat(this.formatNumber(player.lifetimeRegionProgressions), "\n\t\t\nLifetime World Progressions: ").concat(this.formatNumber(player.lifetimeWorldProgressions), "\n\t\t\nMax Tournament Rank Achieved:").concat(this.formatNumber(player.maxTournamentRank), "\n\t\t\nLifetime Kills: ").concat(this.formatNumber(player.lifetimeKills), "\n\t\t\nTotal Playtime: ").concat(Math.round(player.totalPlaytime / 60000), " minutes\n\t\t\nStarted Playing: ").concat(player.originalStartDateTime.toLocaleString(), "\n\t\t\nLast Save: ").concat(player.lastSave.toLocaleString());

      // Check and display the time until the next daily reward
      var dailyRewardTimeLeft = this.rewardManager.checkDailyReward();
      var dailyRewardTimer = document.getElementById('dailyRewardTimer');
      dailyRewardTimer.innerText = this.formatTime(dailyRewardTimeLeft);
      var dailyRewardButton = document.getElementById('dailyRewardButton');
      //disable button if not claimable
      dailyRewardButton.disabled = !this.rewardManager.dailyRewardClaimable;

      // hourly reward info
      var hourlyRewardTitle = document.getElementById("hourlyRewardTitle");
      hourlyRewardTitle.innerText = "Hourly Reward (".concat(this.rewardManager.currentHourlyRewardsClaimable, "/").concat(this.rewardManager.hourlyRewardCap, ")");
      hourlyRewardTitle.id = "hourlyRewardTitle";

      // Check and display the time until the next hourly reward
      var hourlyRewardTimeLeft = this.rewardManager.checkHourlyReward();
      var hourlyRewardTimer = document.getElementById('hourlyRewardTimer');
      hourlyRewardTimer.innerText = this.formatTime(hourlyRewardTimeLeft);
      var hourlyRewardButton = document.getElementById('hourlyRewardButton');
      //disable button if not claimable
      hourlyRewardButton.disabled = !this.rewardManager.hourlyRewardClaimable;

      // Display the current amount of hourly rewards that are claimable on the claim button
      var currentHourlyRewards = this.rewardManager.currentHourlyRewardsClaimable;
      if (currentHourlyRewards.gt(0)) {
        hourlyRewardButton.innerText = "Claim Hourly Reward (".concat(currentHourlyRewards.toString(), ")");
      } else {
        hourlyRewardButton.innerText = 'Claim Hourly Reward';
      }
    }
  }, {
    key: "populateRadianceTab",
    value: function populateRadianceTab() {
      var _this60 = this;
      var targetCol = document.getElementById("radiance-col1");
      var radianceUpgrades = this.gameManager.gameContent.radianceUpgrades;
      targetCol.classList.add('radiance-color');

      // z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
      var zIndexCounter = 1000;
      radianceUpgrades.forEach(function (upgrade) {
        var upgradeId = "upgrade-".concat(upgrade.id);
        var upgradeCell = targetCol.querySelector("#".concat(upgradeId));
        if (!upgradeCell) {
          upgradeCell = _this60.populateFeatureCell(upgrade, targetCol, upgradeId, zIndexCounter);
          zIndexCounter--;
          targetCol.appendChild(upgradeCell);
        }
        _this60.updateFeatureCell(upgrade, upgradeCell);
      });
    }
  }, {
    key: "formatTime",
    value: function formatTime(milliseconds) {
      var totalSeconds = Math.floor(milliseconds / 1000);
      var hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      var minutes = Math.floor(totalSeconds / 60);
      var seconds = totalSeconds % 60;
      return "".concat(hours.toString().padStart(2, '0'), ":").concat(minutes.toString().padStart(2, '0'), ":").concat(seconds.toString().padStart(2, '0'));
    }
  }, {
    key: "populateAchievementsTab",
    value: function populateAchievementsTab() {
      var _this61 = this;
      var targetCol = this.achievementsCol1;
      var achievementSets = this.gameManager.gameContent.achievementsGrid.achievementSets;
      var achievementsChecker = document.getElementById('achieve-checker');
      if (!achievementsChecker) {
        achievementsChecker = this.createElement('div', 'achieve-checker');

        // z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
        var zIndexCounter = 1000;
        var _iterator31 = _createForOfIteratorHelper(achievementSets),
          _step31;
        try {
          for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
            var achievementSet = _step31.value;
            achievementSet.achievements.forEach(function (achievement) {
              var achievementID = "achievement-".concat(achievement.id);
              var achievementCell = targetCol.querySelector("#".concat(achievementID));
              if (!achievementCell) {
                achievementCell = _this61.createElement('button', achievementID, 'achievement-cell');
                achievementCell.style.color = "".concat(achievement.set.color);
                achievementCell.style.border = "2px solid ".concat(achievement.set.color);
                var achievementContent = _this61.createElement('div', null, null, "".concat(achievement.name));
                achievementCell.appendChild(achievementContent);
                achievementCell.addEventListener('click', function () {
                  _this61.claimAchievement(achievement);
                });
                _this61.populateTooltip(achievement, achievementCell);
                achievementCell.style.zIndex = zIndexCounter;
                zIndexCounter--;
                targetCol.appendChild(achievementCell);
              }
              _this61.updateTooltip(achievement);

              // Update button appearance based on achievement.isClaimable
              if (achievement.isClaimed) {
                achievementCell.disabled = true;
                achievementCell.classList.add('complete');
                achievementCell.classList.remove('enabled');
                achievementCell.classList.remove('disabled');
                achievementCell.style.backgroundColor = "".concat(achievement.set.color);
                achievementCell.style.color = "white";
              } else if (achievement.isClaimable) {
                achievementCell.disabled = false;
                achievementCell.classList.add('enabled');
                achievementCell.classList.remove('disabled');
                achievementCell.style.fontWeight = 'bold';
                achievementCell.style.color = "".concat(achievement.set.color);
              } else {
                achievementCell.disabled = true;
                achievementCell.classList.add('disabled');
                achievementCell.classList.remove('enabled');
              }
            });
          }
        } catch (err) {
          _iterator31.e(err);
        } finally {
          _iterator31.f();
        }
      }
    }
  }, {
    key: "populateSkillsTab",
    value: function populateSkillsTab() {
      var _this62 = this;
      //update skills tab button unspent points
      var skillsTabButton = document.querySelector('#skillsTab');
      var name = skillsTabButton.id;
      name = name.replace("Tab", "");
      name = name.charAt(0).toUpperCase() + name.slice(1);
      ;
      this.updateElementTextContent(skillsTabButton, "".concat(name, " (").concat(this.gameManager.gameContent.player.skillpoint, ")"));
      var skills = this.gameManager.gameContent.skillTree.skills;
      var skillData = this.skillsCol1.querySelector('#skill-data');
      var skillGrid, skillPointsTotal;

      // Populate Initial Elements
      if (!skillData) {
        //assign skillsCol1 color
        this.skillsCol1.classList.add('skills-color');
        skillData = this.createElement('div', 'skill-data');
        skillData.setAttribute('style', 'margin-bottom:30px;');
        this.skillsCol1.appendChild(skillData);
        var _skillPointsTotal = this.createElement('div', 'skillpoints', null, "Skill Points: ".concat(this.formatNumber(this.gameManager.gameContent.player.skillpoint)));
        skillData.appendChild(_skillPointsTotal);
        var refundSkillsButton = this.createElement('button', "refund-skills-button", null, "Refund All");
        refundSkillsButton.addEventListener('click', function () {
          _this62.gameManager.gameContent.skillTree.refundAllSkills();
        });
        skillData.appendChild(refundSkillsButton);
        skillGrid = this.createElement('div', null, 'skill-grid');
        this.skillsCol1.appendChild(skillGrid);

        // z-index for higher buttons to have higher zindex for tooltips to not be overlapped by lower buttons
        var zIndexCounter = 1000;
        skills.forEach(function (skill) {
          // Create a skill node element and position it based on its connections
          var skillNode = skillGrid.querySelector("#skill-".concat(skill.id));
          if (!skillNode) {
            skillNode = _this62.createElement('button', "skill-".concat(skill.id), 'skill-node');

            // Create the level text element
            var levelText = _this62.createElement('span', null, 'skill-level');
            skillNode.appendChild(levelText);

            // Create a line element to connect the skill nodes
            var connections = skill.node.connections;
            for (var direction in connections) {
              if (connections[direction]) {
                // Check if there is a connection in this direction
                var line = _this62.createElement('div', null, ['skill-line', direction]);
                skillNode.appendChild(line);
              }
            }

            // Add click event to upgrade the skill
            skillNode.addEventListener('click', function () {
              if (skill.level.eq(0)) {
                _this62.buyFeature(skill.id);
              } else {
                var _iterator32 = _createForOfIteratorHelper(skill.unlockedConnections),
                  _step32;
                try {
                  for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {
                    var connection = _step32.value;
                    if (connection.level.eq(1)) {
                      return;
                    }
                  }
                } catch (err) {
                  _iterator32.e(err);
                } finally {
                  _iterator32.f();
                }
                skill.refundSkill();
              }
            });
            _this62.populateTooltip(skill, skillNode);
            skillNode.style.zIndex = zIndexCounter;
            zIndexCounter--;

            // Add the skill node to the skill grid
            skillGrid.appendChild(skillNode);
          }
        });
      }

      // Update Elements
      skillPointsTotal = document.querySelector('#skillpoints');
      this.updateElementTextContent(skillPointsTotal, "Skill Points: ".concat(this.formatNumber(this.gameManager.gameContent.player.skillpoint)));
      skillGrid = this.skillsCol1.querySelector('.skill-grid');
      skills.forEach(function (skill) {
        var skillNode = skillGrid.querySelector("#skill-".concat(skill.id));

        // Update skill node title and level text
        var levelTextElement = skillNode.querySelector('.skill-level');
        var newLevelText = ["".concat(skill.name, "\n"), "".concat(skill.level, "/").concat(skill.maxLevel)];
        if (!skill.level.eq(skill.maxLevel)) {
          newLevelText.push("\nCost: ".concat(skill.costNext));
        }
        _this62.updateElementTextContent(levelTextElement, newLevelText.join('\r'));
        _this62.updateTooltip(skill);

        // Skill is purchased
        if (skill.level.eq(skill.maxLevel)) {
          skillNode.disabled = false;
          skillNode.classList.add('enabled', 'skill-complete');
          skillNode.classList.remove('disabled');
        }
        // Skill is not active or not affordable
        else if (!skill.active || !_this62.isAffordable(skill)) {
          skillNode.disabled = true;
          skillNode.classList.remove('enabled', 'skill-complete');
          skillNode.classList.add('disabled');
        }
        // skill is affordable and active but not purchased
        else {
          skillNode.disabled = false;
          skillNode.classList.add('enabled');
          skillNode.classList.remove('disabled', 'skill-complete');
        }
        skillNode.style.left = "".concat(skill.node.x, "px");
        skillNode.style.top = "".concat(skill.node.y, "px");
      });
    }
  }, {
    key: "calculateNextRebirth1Gain",
    value: function calculateNextRebirth1Gain() {
      //calculate essence/rebirth mult changes
      //CODE mostly copied from gameStateManager calculateRebirth1()
      var rebirth1PseudoObject = this.gameManager.findObjectById(60000);
      var powerLevel = this.gameManager.gameContent.player.powerLevel;

      //gain essence based on log10 power level
      var essenceGain = powerLevel.div(1000).plus(1).log(10);
      var newRebirthTime = Date.now();
      var timeSinceLastRebirth = newRebirthTime - this.gameManager.gameContent.player.lastRebirth1;

      // Convert timeSinceLastRebirth from milliseconds to hours
      var timeSinceLastRebirthHours = timeSinceLastRebirth / 3600000; // 1 hour = 3600000 milliseconds

      // Increase essenceGain by 5% for each hour since the last rebirth
      essenceGain = essenceGain.times(1 + 0.05 * timeSinceLastRebirthHours);
      return essenceGain;
    }
  }, {
    key: "populateEssenceTab",
    value: function populateEssenceTab() {
      var _this63 = this;
      var targetCol = this.essenceCol1;
      var essenceUpgrades = this.gameManager.gameContent.essenceUpgrades;
      var initialX = 700;
      var initialY = 500;

      //set overall essence stats/multiplier
      var essenceStats = document.querySelector('.essence-stats');
      if (!essenceStats) {
        essenceStats = this.createElement('div', null, 'essence-stats');
        essenceStats.setAttribute('style', 'margin-bottom:10px; white-space: pre;');
        targetCol.appendChild(essenceStats);
      }

      //init essence cells container
      var essenceGrid = targetCol.querySelector("#essence-grid");
      if (!essenceGrid) {
        //assign tab color
        targetCol.classList.add('essence-color');
        essenceGrid = this.createElement('div', "essence-grid");
        targetCol.appendChild(essenceGrid);
      }

      //update overall essence stats/multiplier
      var essenceGain = this.calculateNextRebirth1Gain();
      var rebirthMultGain = essenceGain;
      var essencePseudoObject = this.gameManager.findObjectById(60000);

      //update essence stats

      var newEssenceStatsText = "\n\t\tTotal Essence Earned: ".concat(this.formatNumber(this.gameManager.gameContent.player.lifetimeEssenceEarned), "\n\t\tEssenceMultiplier: ").concat(this.formatNumber(essencePseudoObject.level), "\n\t\tCurrent Essence: ").concat(this.formatNumber(this.gameManager.gameContent.player.essence), "\n\t\tEssence Gain on next Rebirth: ").concat(this.formatNumber(essenceGain), "\n\t\tMultiplier after rebirth: ").concat(this.formatNumber(rebirthMultGain.plus(essencePseudoObject.level)));
      this.updateElementTextContent(essenceStats, newEssenceStatsText);
      essenceUpgrades.forEach(function (upgrade) {
        var upgradeID = "eUpgrade-".concat(upgrade.id);
        var essenceCell = targetCol.querySelector("#".concat(upgradeID));

        //set essence cells
        if (!essenceCell) {
          essenceCell = _this63.createElement('button', upgradeID, 'essence-cell');
          essenceCell.addEventListener('click', function () {
            _this63.buyFeature(upgrade.id);
            upgrade.activateChildren();
          });
          var topPosition = initialY;
          var leftPosition = initialX;
          // calculate the position of the upgradeCell
          if (upgrade.parent) {
            var angleInRadians = upgrade.angleFromParent * (Math.PI / 180);
            topPosition = upgrade.parent.y + upgrade.distanceFromParent * Math.sin(angleInRadians);
            leftPosition = upgrade.parent.x + upgrade.distanceFromParent * Math.cos(angleInRadians);
          }
          essenceCell.style.position = 'absolute';
          essenceCell.style.top = "".concat(topPosition, "px");
          essenceCell.style.left = "".concat(leftPosition, "px");
          upgrade.y = topPosition;
          upgrade.x = leftPosition;

          //Add connecting lines
          if (upgrade.parent) {
            // Calculate the line's width (the distance between the cells) and angle
            var dx = upgrade.x - upgrade.parent.x;
            var dy = upgrade.y - upgrade.parent.y;
            var lineLength = Math.sqrt(dx * dx + dy * dy);
            var angle = Math.atan2(dy, dx) * 180 / Math.PI - 180;

            // Create line div and apply the calculated width and angle
            var line = _this63.createElement('div', null, 'essence-line');
            line.style.width = lineLength + 'px';
            line.style.transform = "rotate(".concat(angle, "deg)");

            // Append the line to the upgrade cell
            essenceCell.appendChild(line);
          }
          var _essenceData = _this63.createElement('div', "essence-data-".concat(upgradeID));
          essenceCell.appendChild(_essenceData);
          _this63.populateTooltip(upgrade, essenceCell);
          essenceGrid.appendChild(essenceCell);
        }

        //update essence cells/button statii
        var essenceData = essenceCell.querySelector("#essence-data-".concat(upgradeID));
        _this63.updateTooltip(upgrade);
        var newEssenceDataText = "".concat(upgrade.name, "\nlvl ").concat(upgrade.level, "/").concat(upgrade.maxLevel, "\nCost: ").concat(_this63.formatNumber(upgrade.costNext));
        _this63.updateElementTextContent(essenceData, newEssenceDataText);
        if (upgrade.active && upgrade.level.neq(upgrade.maxLevel) && _this63.isAffordable(upgrade) && upgrade.nextLevelIncrement.gt(0)) {
          essenceCell.disabled = false;
          essenceCell.classList.add('enabled');
          essenceCell.classList.remove('disabled');
        } else if (upgrade.level.eq(upgrade.maxLevel)) {
          essenceCell.disabled = true;
          essenceCell.classList.add('complete');
          essenceCell.classList.remove('enabled');
          // essenceCell.style.border = '2px solid cyan';
        } else {
          essenceCell.disabled = true;
          essenceCell.classList.add('disabled');
          essenceCell.classList.remove('enabled');
        }
      });
    }
  }, {
    key: "generateVerboseNotationUnits",
    value: function generateVerboseNotationUnits() {
      var units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
      var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
      for (var i = 0; i < alphabet.length; i++) {
        for (var j = 0; j < alphabet.length; j++) {
          units.push(alphabet[i] + alphabet[j]);
        }
      }
      return units;
    }
  }, {
    key: "formatNumberVerbose",
    value: function formatNumberVerbose(num) {
      var units = this.generateVerboseNotationUnits();
      var unitIndex = Math.floor(num.log10() / 3);
      var value = num.div(_break_eternityMin.default.pow(10, unitIndex * 3));
      var prefix = '';
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
      return "".concat(value.toFixed(2), " ").concat(prefix).concat(units[unitIndex]);
    }
  }, {
    key: "toEngineeringNotation",
    value: function toEngineeringNotation(decimal) {
      var exponent = decimal.e;
      var mantissa = decimal.mantissa;
      if (exponent < 3) {
        return mantissa * Math.pow(10, exponent);
      }
      var engExponent = Math.floor(exponent / 3);
      var remainder = exponent % 3;
      var engMantissa = mantissa * Math.pow(10, remainder);
      return "".concat(engMantissa.toFixed(2), "e").concat(engExponent * 3);
    }
  }, {
    key: "formatNumber",
    value: function formatNumber(num) {
      if (num.lte(9999)) {
        return num.toFixed(0);
      } else {
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
            var _num$toExponential$sp = num.toExponential(3).split('e'),
              _num$toExponential$sp2 = _slicedToArray(_num$toExponential$sp, 2),
              mantissa = _num$toExponential$sp2[0],
              exponent = _num$toExponential$sp2[1];
            return "".concat(mantissa, " * 10^").concat(exponent);
          case "abbreviated":
            // need to generate an array with more than 3333 suffixes to handle numbers up to 10^9999
            var suffixes = this.generateSuffixes();
            var suffixNum = Math.max(0, Math.floor(num.log10() / 3));
            if (suffixNum >= suffixes.length) {
              return num.toExponential(3); // fallback to scientific notation if the number is too large
            }

            var shortValue = num.div(_break_eternityMin.default.pow(10, suffixNum * 3));
            return "".concat(shortValue.toFixed(2)).concat(suffixes[suffixNum]);
          default:
            return num.toExponential(3);
        }
      }
    }
  }, {
    key: "claimAchievement",
    value: function claimAchievement(achievement) {
      achievement.claim();
    }

    //dispatch to gameManager
  }, {
    key: "buyFeature",
    value: function buyFeature(id) {
      this.eventManager.dispatchEvent('handlePurchase', {
        id: id
      });
      // this.eventManager.dispatchEvent('check-unlocks');
    }
  }]);
  return GameUI;
}();
var GameStateManager = /*#__PURE__*/function () {
  function GameStateManager(eventManager, gameManager) {
    _classCallCheck(this, GameStateManager);
    this.eventManager = eventManager;
    this.gameManager = gameManager;
    this.gameStateSaver = new GameStateSaver(eventManager, gameManager, this);
    this.gameStateLoader = new GameStateLoader(eventManager, gameManager, this);
    this.version = "0.0.1 (alpha)";
    this.definePropertyArrays();
    this.defineStateValuesAndTypes();
  }
  _createClass(GameStateManager, [{
    key: "defineStateValuesAndTypes",
    value: function defineStateValuesAndTypes() {
      this.universalStateValuesAndTypes();
      this.fullStateValuesAndTypes();
      this.rebirth1StateValuesAndTypes();
    }
  }, {
    key: "definePropertyArrays",
    value: function definePropertyArrays() {
      //Property arrays for use with featureType population/loading
      this.fullFeatureProperties = ['level', 'manualLevel', 'autoLevel', 'active', 'visible', 'prodCurrent', 'prodPrevious', 'prodNext', 'prodNextSingle', 'prodMult', 'costNext', 'costNextSingle', 'costMult', 'nextMilestoneMult', 'nextMilestoneLevel', 'nextAffordableMilestoneLevel', 'maxAffLvl'];
      this.autoFeatureProperties = ['autoUnlocked', 'autoToggle'];
      this.baseFeatureProperties = ['baseLevel', 'costBase', 'prodBase'];
    }
  }, {
    key: "universalStateValuesAndTypes",
    value: function universalStateValuesAndTypes() {
      this.universalStateValues = [
      //lifetime stats
      'lifetimeForceEarned', 'lifetimeWisdomEarned', 'lifetimeEnergyEarned', 'lifetimeDivineEarned', 'lifetimeEssenceEarned', 'lifetimeCrystalEarned', 'maxPowerLevelAchieved', 'lifetimeZoneCompletions', 'lifetimeRegionProgressions', 'lifetimeWorldProgressions', 'maxProgressionWorld', 'maxProgressionRegion', 'maxTournamentRank', 'lifetimeKills', 'totalPlaytime',
      //base stats
      'baseForce', 'baseWisdom', 'baseEnergy', 'baseDivine', 'baseSkillpoint', 'baseCrystal', 'baseEssence', 'baseForcePowerLevelMultiplier', 'baseWisdomPowerLevelMultiplier', 'baseEnergyPowerLevelMultiplier', 'baseDivinePowerLevelMultiplier',
      //other
      'radiance', 'timeModifierUpgrade', 'lastRebirth1'];

      // all game feature base values
      this.universalFeatureTypes = [{
        type: 'trainings',
        properties: _toConsumableArray(this.baseFeatureProperties)
      }, {
        type: 'generators',
        properties: _toConsumableArray(this.baseFeatureProperties)
      }, {
        type: 'upgrades',
        properties: _toConsumableArray(this.baseFeatureProperties)
      }, {
        type: 'fighters',
        properties: _toConsumableArray(this.baseFeatureProperties)
      }, {
        type: 'artifacts',
        properties: _toConsumableArray(this.baseFeatureProperties)
      }, {
        type: 'zones',
        properties: _toConsumableArray(this.baseFeatureProperties)
      }, {
        type: 'essenceUpgrades',
        properties: _toConsumableArray(this.baseFeatureProperties)
      }, {
        type: 'forgeUpgrades',
        properties: _toConsumableArray(this.baseFeatureProperties)
      }, {
        type: 'radianceUpgrades',
        properties: _toConsumableArray(this.fullFeatureProperties)
      }, {
        type: 'achievements',
        properties: [].concat(_toConsumableArray(this.fullFeatureProperties), ['isClaimable', 'isClaimed'])
      }, {
        type: 'achievementSets',
        properties: ['completed']
      }];
    }
  }, {
    key: "fullStateValuesAndTypes",
    value: function fullStateValuesAndTypes() {
      this.fullStateValues = ['powerLevel', 'force', 'wisdom', 'energy', 'divine', 'crystal', 'essence', 'skillpoint', 'forceIncome', 'wisdomIncome', 'energyIncome', 'divineIncome', 'forcePowerLevelMultiplier', 'powerLevelFromForce', 'wisdomPowerLevelMultiplier', 'powerLevelFromWisdom', 'energyPowerLevelMultiplier', 'powerLevelFromEnergy', 'divinePowerLevelMultiplier', 'powerLevelFromDivine'];
      this.fullFeatureTypes = [{
        type: 'trainings',
        properties: [].concat(_toConsumableArray(this.fullFeatureProperties), _toConsumableArray(this.autoFeatureProperties), ['evolutionTier'])
      }, {
        type: 'generators',
        properties: [].concat(_toConsumableArray(this.fullFeatureProperties), _toConsumableArray(this.autoFeatureProperties), ['evolutionTier'])
      }, {
        type: 'upgrades',
        properties: [].concat(_toConsumableArray(this.fullFeatureProperties), _toConsumableArray(this.autoFeatureProperties))
      }, {
        type: 'artifacts',
        properties: [].concat(_toConsumableArray(this.fullFeatureProperties), _toConsumableArray(this.autoFeatureProperties), ['unlocked', 'evolved', 'evolutionTier'])
      }, {
        type: 'skills',
        properties: _toConsumableArray(this.fullFeatureProperties)
      }, {
        type: 'forgeUpgrades',
        properties: _toConsumableArray(this.fullFeatureProperties)
      }, {
        type: 'essenceUpgrades',
        properties: _toConsumableArray(this.fullFeatureProperties)
      }, {
        type: 'radianceUpgrades',
        properties: _toConsumableArray(this.fullFeatureProperties)
      }, {
        type: 'fighters',
        properties: [].concat(_toConsumableArray(this.fullFeatureProperties), ['isDefeated', 'defeatCount', 'baseFightTime'])
      }, {
        type: 'fighterTiers',
        properties: ['isCompleted', 'active', 'visible']
      }, {
        type: 'zones',
        properties: [].concat(_toConsumableArray(this.fullFeatureProperties), _toConsumableArray(this.autoFeatureProperties), ['isDefeated', 'defeatCount', 'baseConquestTime', 'repeatUnlocked'])
      }, {
        type: 'regions',
        properties: ['isProgressed', 'isCompleted', 'active', 'visible']
      }, {
        type: 'worlds',
        properties: ['isProgressed', 'isCompleted', 'active', 'visible']
      }, {
        type: 'mods',
        properties: ['active']
      }, {
        type: 'realms',
        properties: ['active']
      }, {
        type: 'generatorChains',
        properties: ['active']
      }, {
        type: 'tabs',
        properties: ['active', 'visible']
      }];
    }
  }, {
    key: "rebirth1StateValuesAndTypes",
    value: function rebirth1StateValuesAndTypes() {
      this.rebirth1StateValues = ['essence', 'lifetimeEssenceEarned'];
      this.rebirth1StateFeatureTypes = [{
        type: 'essenceUpgrades',
        properties: _toConsumableArray(this.fullFeatureProperties)
      }, {
        type: 'radianceUpgrades',
        properties: _toConsumableArray(this.fullFeatureProperties)
      }];
    }
  }, {
    key: "autosave",
    value: function autosave() {
      this.saveGameState(0);
    }
  }, {
    key: "saveGameState",
    value: function saveGameState(state) {
      this.gameStateSaver.saveGameState(state);
    }
  }, {
    key: "loadGameState",
    value: function loadGameState(state) {
      this.gameStateLoader.loadGameState(state);
    }
  }]);
  return GameStateManager;
}();
var GameStateSaver = /*#__PURE__*/function () {
  function GameStateSaver(eventManager, gameManager, gameStateManager) {
    _classCallCheck(this, GameStateSaver);
    this.eventManager = eventManager;
    this.gameManager = gameManager;
    this.gameStateManager = gameStateManager;
  }
  _createClass(GameStateSaver, [{
    key: "saveGameState",
    value: function saveGameState(state) {
      this.gameManager.gameContent.player.lastSave = new Date();
      var gameData = this.populateSaveUniversalData();
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
      var gameDataJson = JSON.stringify(gameData);
      localStorage.setItem('saveGame', gameDataJson);

      //if rebirth (state > 0), immediately load rebirth state
      if (state > 0) {
        this.eventManager.dispatchEvent('restart', state);
      }
    }
  }, {
    key: "populateSaveUniversalData",
    value: function populateSaveUniversalData() {
      var gameData = {
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
  }, {
    key: "populateSaveFullData",
    value: function populateSaveFullData(gameData) {
      var _this64 = this;
      this.saveFeatureData(this.gameStateManager.fullFeatureTypes, gameData);

      //SPECIAL CASES
      // Special serialization for levelsAddLevelsTargets if the property exists
      this.gameManager.gameContent.trainings.forEach(function (item) {
        var data = _this64.getOrUpdateFeatureData(item, gameData, 'trainings');
        if ('levelsAddLevelsTargets' in item && item.levelsAddLevelsTargets.length > 0) {
          data.levelsAddLevelsTargets = item.levelsAddLevelsTargets.map(function (target) {
            var _target$amountPurchas, _target$amountPurchas2;
            return {
              target: target.target.id,
              calcType: target.calcType,
              calcValue: target.calcValue,
              amountPurchased: (_target$amountPurchas = (_target$amountPurchas2 = target.amountPurchased) === null || _target$amountPurchas2 === void 0 ? void 0 : _target$amountPurchas2.toString()) !== null && _target$amountPurchas !== void 0 ? _target$amountPurchas : "0"
            };
          });
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
      var headbandPseudoObject = this.gameManager.findObjectById(800);
      gameData.headbandPseudoObject = {
        id: headbandPseudoObject.id,
        level: headbandPseudoObject.level.toString(),
        active: headbandPseudoObject.active
      };
    }
  }, {
    key: "populateSaveRebirthState1",
    value: function populateSaveRebirthState1(gameData) {
      var _this65 = this;
      this.isRebirthing = true;
      this.calculateRebirth1();

      // Iterate over each feature type and add/update to gameData
      this.gameStateManager.rebirth1StateFeatureTypes.forEach(function (featureTypeObj) {
        _this65.gameManager.gameContent[featureTypeObj.type].forEach(function (item) {
          var data = _this65.getOrUpdateFeatureData(item, gameData, featureTypeObj.type);

          // Extract the data properties
          featureTypeObj.properties.forEach(function (property) {
            if (item[property] instanceof _break_eternityMin.default) {
              // Convert Decimals to string
              data[property] = item[property].toString();
            } else if (item[property] === null || typeof item[property] === 'number' || typeof item[property] === 'boolean' || typeof item[property] === 'string') {
              // Handle null values, ints, strings, and bools
              data[property] = item[property];
            } else {
              console.warn("Unsupported property type for property \"".concat(property, "\""));
            }
          });
        });
      });

      // Save player data
      this.gameStateManager.rebirth1StateValues.forEach(function (stat) {
        var _this65$gameManager$g;
        gameData.playerData[stat] = (_this65$gameManager$g = _this65.gameManager.gameContent.player[stat]) === null || _this65$gameManager$g === void 0 ? void 0 : _this65$gameManager$g.toString();
      });

      // save rebirth pseudo object for essence multiplier
      var rebirth1PseudoObject = this.gameManager.findObjectById(60000);
      gameData.rebirth1PseudoObject = {
        id: rebirth1PseudoObject.id,
        level: rebirth1PseudoObject.level.toString(),
        active: rebirth1PseudoObject.active
      };

      //save specific tabs
      gameData.essenceTab = this.saveTabData('essence');
    }
  }, {
    key: "calculateRebirth1",
    value: function calculateRebirth1() {
      var rebirth1PseudoObject = this.gameManager.findObjectById(60000);
      if (!rebirth1PseudoObject.active) {
        rebirth1PseudoObject.setActive();
      }
      var powerLevel = this.gameManager.gameContent.player.powerLevel;

      //gain essence based on log10 power level
      var essenceGain = powerLevel.div(1000).plus(1).log(10);
      var newRebirthTime = Date.now();
      var timeSinceLastRebirth = newRebirthTime - this.gameManager.gameContent.player.lastRebirth1;

      // Convert timeSinceLastRebirth from milliseconds to hours
      var timeSinceLastRebirthHours = timeSinceLastRebirth / 3600000; // 1 hour = 3600000 milliseconds

      // Increase essenceGain by 5% for each hour since the last rebirth
      essenceGain = essenceGain.times(1 + 0.05 * timeSinceLastRebirthHours);

      //set player essence currency values
      this.gameManager.gameContent.player.essence = this.gameManager.gameContent.player.essence.plus(essenceGain);
      this.gameManager.gameContent.player.lifetimeEssenceEarned = this.gameManager.gameContent.player.lifetimeEssenceEarned.plus(essenceGain);

      //set rebirth pseudo-object level which controls the game rebirth multiplier
      rebirth1PseudoObject.level = rebirth1PseudoObject.level.plus(essenceGain).round();
    }
  }, {
    key: "populateSaveRebirthState2",
    value: function populateSaveRebirthState2(gameData) {
      this.isRebirthing = true;
    }
  }, {
    key: "populateSaveRebirthState3",
    value: function populateSaveRebirthState3(gameData) {
      this.isRebirthing = true;
    }
  }, {
    key: "saveFeatureData",
    value: function saveFeatureData(featureTypes, gameData) {
      var _this66 = this;
      featureTypes.forEach(function (featureTypeObj) {
        _this66.gameManager.gameContent[featureTypeObj.type].forEach(function (item) {
          var data = _this66.getOrUpdateFeatureData(item, gameData, featureTypeObj.type);

          // Extract the data properties
          featureTypeObj.properties.forEach(function (property) {
            // console.error(item.name,property,item[property]);
            _this66.processFeatureSaveProperties(item, data, property);
          });
        });
      });
    }

    //SAVE HELPER FUNCTIONS
  }, {
    key: "saveTabData",
    value: function saveTabData(tabName) {
      var tab = this.gameManager.gameContent.tabs.find(function (tab) {
        return tab.name === tabName;
      });
      if (tab) {
        return {
          active: tab.active,
          visible: tab.visible
        };
      }
      return null;
    }
  }, {
    key: "getOrUpdateFeatureData",
    value: function getOrUpdateFeatureData(feature, gameData, featureType) {
      // Access the correct array in gameData directly using featureType
      var featureDataArray = gameData[featureType];

      // If the array doesn't exist yet, create it
      if (!featureDataArray) {
        featureDataArray = [];
        gameData[featureType] = featureDataArray;
      }

      // Find the existing data in the gameData object, if it exists
      var featureData = featureDataArray.find(function (t) {
        return t.id === feature.id;
      });

      // If the data doesn't exist yet, create it
      if (!featureData) {
        featureData = {
          id: feature.id
        };
        featureDataArray.push(featureData);
      }
      return featureData;
    }
  }, {
    key: "savePlayerData",
    value: function savePlayerData(playerData, gameData) {
      var _this67 = this;
      playerData.forEach(function (stat) {
        var _this67$gameManager$g;
        gameData.playerData[stat] = (_this67$gameManager$g = _this67.gameManager.gameContent.player[stat]) === null || _this67$gameManager$g === void 0 ? void 0 : _this67$gameManager$g.toString();
      });
    }
  }, {
    key: "processFeatureSaveProperties",
    value: function processFeatureSaveProperties(item, data, property) {
      if (item[property] instanceof _break_eternityMin.default) {
        // Convert Decimals to string
        data[property] = item[property].toString();
      } else if (item[property] === null || typeof item[property] === 'number' || typeof item[property] === 'boolean' || typeof item[property] === 'string') {
        // Handle null values, ints, strings, and bools
        data[property] = item[property];
      } else {
        console.warn("Unsupported property type for property \"".concat(property, "\""));
      }
    }
  }, {
    key: "createIdObject",
    value: function createIdObject(item) {
      return {
        id: item.id
      };
    }
  }, {
    key: "mapAndSaveIds",
    value: function mapAndSaveIds(collection) {
      var _this68 = this;
      return collection.map(function (item) {
        return _this68.createIdObject(item);
      });
    }
  }, {
    key: "stringifyObjectArrays",
    value: function stringifyObjectArrays(obj) {
      var result = {};
      for (var _i4 = 0, _Object$entries = Object.entries(obj); _i4 < _Object$entries.length; _i4++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i4], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        result[key] = value.toString();
      }
      return result;
    }
  }]);
  return GameStateSaver;
}();
var GameStateLoader = /*#__PURE__*/function () {
  function GameStateLoader(eventManager, gameManager, gameStateManager) {
    _classCallCheck(this, GameStateLoader);
    this.eventManager = eventManager;
    this.gameManager = gameManager;
    this.gameStateManager = gameStateManager;
  }
  _createClass(GameStateLoader, [{
    key: "loadGameState",
    value: function loadGameState(state) {
      //reset - load default state and clear local storage save
      if (state === -1) {
        localStorage.clear();
        return;
      }
      var gameDataJson = localStorage.getItem('saveGame');
      if (!gameDataJson) {
        console.error("No save game file located");
        return;
      }
      var gameData = JSON.parse(gameDataJson);
      this.applyLoadUniversalData(gameData);
      if (state === 0) {
        this.applyLoadFullData(gameData);
      } else if (state > 0) {
        this.applyLoadRebirthStateData(state, gameData);
      }
    }
  }, {
    key: "applyLoadUniversalData",
    value: function applyLoadUniversalData(gameData) {
      var _this69 = this;
      this.version = gameData.version;
      // player stats
      this.gameStateManager.universalStateValues.forEach(function (stat) {
        return _this69.loadDecimalData(gameData, 'playerData', _this69.gameManager.gameContent.player, stat);
      });

      // Iterate over each feature type and add/update to gameManager
      this.applyLoadData(gameData, this.gameStateManager.universalFeatureTypes);

      // load time variables
      this.gameManager.gameContent.player.lastSave = new Date(gameData.lastSave);
      this.gameManager.gameContent.player.originalStartDateTime = new Date(gameData.originalStartDateTime);

      // re-apply achievements
      var _iterator33 = _createForOfIteratorHelper(this.gameManager.gameContent.achievements),
        _step33;
      try {
        for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {
          var achievement = _step33.value;
          if (achievement.isClaimed) {
            achievement.setActive();
            achievement.updateObservers();
            achievement.set.checkCompletion();

            //not doing anything? hmmmmm
            var _iterator36 = _createForOfIteratorHelper(this.gameManager.gameContent.unlocks),
              _step36;
            try {
              for (_iterator36.s(); !(_step36 = _iterator36.n()).done;) {
                var unlock = _step36.value;
                if (unlock.target === achievement) {
                  this.gameManager.gameContent.unlockManager.transferUnlockToCompleted(unlock);
                }
              }
            } catch (err) {
              _iterator36.e(err);
            } finally {
              _iterator36.f();
            }
          }
        }

        // re-apply radiance upgrades
      } catch (err) {
        _iterator33.e(err);
      } finally {
        _iterator33.f();
      }
      gameData.radianceUpgrades.forEach(function (data) {
        var _iterator34 = _createForOfIteratorHelper(_this69.gameManager.gameContent.radianceUpgrades),
          _step34;
        try {
          for (_iterator34.s(); !(_step34 = _iterator34.n()).done;) {
            var radianceUpgrade = _step34.value;
            if (data.id === radianceUpgrade.id) {
              if (data.active) {
                radianceUpgrade.setActive();
                radianceUpgrade.updateObservers();
              }
            }
          }
        } catch (err) {
          _iterator34.e(err);
        } finally {
          _iterator34.f();
        }
      });

      // re-apply essence upgrades
      gameData.essenceUpgrades.forEach(function (data) {
        var _iterator35 = _createForOfIteratorHelper(_this69.gameManager.gameContent.essenceUpgrades),
          _step35;
        try {
          for (_iterator35.s(); !(_step35 = _iterator35.n()).done;) {
            var essenceUpgrade = _step35.value;
            if (data.id === essenceUpgrade.id) {
              if (data.active) {
                essenceUpgrade.setActive();
                essenceUpgrade.updateObservers();
              }
            }
          }
        } catch (err) {
          _iterator35.e(err);
        } finally {
          _iterator35.f();
        }
      });

      //load specific tabs
      this.loadTabData('radiance', gameData.radianceTab);
      this.loadTabData('achievements', gameData.achievementsTab);
    }
  }, {
    key: "applyLoadFullData",
    value: function applyLoadFullData(gameData) {
      var _this70 = this;
      // Iterate over each feature type and add/update to gameManager
      this.applyLoadData(gameData, this.gameStateManager.fullFeatureTypes);

      // Load player data
      this.gameStateManager.fullStateValues.forEach(function (stat) {
        return _this70.loadDecimalData(gameData, 'playerData', _this70.gameManager.gameContent.player, stat);
      });

      // Load synergyUpgrades
      for (var _i5 = 0, _Object$entries2 = Object.entries(gameData.playerData.synergyUpgrades || {}); _i5 < _Object$entries2.length; _i5++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i5], 2),
          key = _Object$entries2$_i[0],
          value = _Object$entries2$_i[1];
        this.gameManager.gameContent.player.synergyUpgrades[key] = new _break_eternityMin.default(value);
      }

      //load tournament and worldmanager autounlock
      this.gameManager.gameContent.tournament.autoUnlocked = gameData.tournamentAuto;
      this.gameManager.gameContent.worldManager.autoUnlocked = gameData.conquestAuto;

      // Load shards
      for (var _i6 = 0, _Object$entries3 = Object.entries(gameData.playerData.shards || {}); _i6 < _Object$entries3.length; _i6++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i6], 2),
          _key = _Object$entries3$_i[0],
          _value = _Object$entries3$_i[1];
        this.gameManager.gameContent.player.shards.set(_key, new _break_eternityMin.default(_value));
      }

      // load unlocks
      gameData.completedUnlocks.forEach(function (data) {
        if (_this70.gameManager.gameContent.unlockManager.unlocks.has(data.id)) {
          var completedUnlock = _this70.gameManager.gameContent.unlockManager.unlocks.get(data.id);
          _this70.gameManager.gameContent.unlockManager.unlocks.delete(data.id);
          _this70.gameManager.gameContent.unlockManager.completedUnlocks.set(data.id, completedUnlock);
        }
      });

      // Load heap data
      ['forceHeap', 'wisdomHeap', 'energyHeap', 'divineHeap'].forEach(function (heapName) {
        return _this70.loadAutobuyHeapData(gameData, heapName);
      });

      // load artifact autobuy array
      this.loadAutobuyArtifactData(gameData, 'artifactAutobuys');

      // load headband pseudo object
      var headbandPseudoObject = this.gameManager.findObjectById(800);
      headbandPseudoObject.level = new _break_eternityMin.default(gameData.headbandPseudoObject.level);
      if (gameData.headbandPseudoObject.active) {
        headbandPseudoObject.setActive();
        headbandPseudoObject.updateObservers();
      }
    }
  }, {
    key: "applyLoadRebirthStateData",
    value: function applyLoadRebirthStateData(state, gameData) {
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
  }, {
    key: "applyLoadRebirthState1",
    value: function applyLoadRebirthState1(gameData) {
      var _this71 = this;
      //load rebirth 1 features
      this.gameStateManager.rebirth1StateFeatureTypes.forEach(function (featureTypeObj) {
        var _gameData$featureType;
        (_gameData$featureType = gameData[featureTypeObj.type]) === null || _gameData$featureType === void 0 ? void 0 : _gameData$featureType.forEach(function (data) {
          var item = _this71.gameManager.gameContent[featureTypeObj.type].find(function (t) {
            return t.id === data.id;
          });
          if (!item) {
            console.error("load error-data does not exist for:", data.id);
            return;
          }

          // Apply the data properties
          featureTypeObj.properties.forEach(function (property) {
            if (data[property]) {
              item[property] = typeof data[property] === 'string' ? new _break_eternityMin.default(data[property]) : data[property];
            }
          });
        });
      });

      //load rebirth 1 player data
      this.gameStateManager.rebirth1StateValues.forEach(function (stat) {
        if (gameData.playerData[stat]) {
          _this71.gameManager.gameContent.player[stat] = new _break_eternityMin.default(gameData.playerData[stat]);
        }
      });

      // load rebirth pseudo object for essence multiplier
      var rebirth1PseudoObject = this.gameManager.findObjectById(60000);
      var _gameData$rebirth1Pse = gameData.rebirth1PseudoObject,
        id = _gameData$rebirth1Pse.id,
        level = _gameData$rebirth1Pse.level,
        active = _gameData$rebirth1Pse.active;
      rebirth1PseudoObject.level = new _break_eternityMin.default(level);
      rebirth1PseudoObject.setActive();
      rebirth1PseudoObject.updateObservers();

      //apply base skillpoint override
      this.gameManager.gameContent.player.skillpoint = this.gameManager.gameContent.player.baseSkillpoint;

      //load essence tab
      this.loadTabData('essence', gameData.essenceTab);
    }
  }, {
    key: "applyLoadRebirthState2",
    value: function applyLoadRebirthState2(gameData) {}
  }, {
    key: "applyLoadRebirthState3",
    value: function applyLoadRebirthState3(gameData) {}

    //LOAD HELPER FUNCTIONS
  }, {
    key: "loadTabData",
    value: function loadTabData(tabName, tabData) {
      var tab = this.gameManager.gameContent.tabs.find(function (tab) {
        return tab.name === tabName;
      });
      if (tab && tabData) {
        tab.active = tabData.active;
        tab.visible = tabData.visible;
      }
    }

    // Helper to load Decimal data into the game content
  }, {
    key: "loadDecimalData",
    value: function loadDecimalData(gameData, dataPath, target, stat) {
      if (gameData[dataPath][stat]) {
        target[stat] = new _break_eternityMin.default(gameData[dataPath][stat]);
      } else {
        console.error("load error-data does not exist for:", stat);
      }
    }

    // Helper to apply load data
  }, {
    key: "applyLoadData",
    value: function applyLoadData(gameData, featureTypes) {
      var _this72 = this;
      featureTypes.forEach(function (featureTypeObj) {
        var _gameData$featureType2;
        (_gameData$featureType2 = gameData[featureTypeObj.type]) === null || _gameData$featureType2 === void 0 ? void 0 : _gameData$featureType2.forEach(function (data) {
          var item = _this72.gameManager.gameContent[featureTypeObj.type].find(function (t) {
            return t.id === data.id;
          });
          if (!item) {
            console.error("load error-data does not exist for:", data.id);
            return;
          }

          // Apply the data properties
          featureTypeObj.properties.forEach(function (property) {
            if (data[property]) {
              item[property] = typeof data[property] === 'string' ? new _break_eternityMin.default(data[property]) : data[property];
            }
          });
        });
      });
    }

    // Helper to load heap data
  }, {
    key: "loadAutobuyHeapData",
    value: function loadAutobuyHeapData(gameData, heapName) {
      if (gameData[heapName]) {
        var _iterator37 = _createForOfIteratorHelper(gameData[heapName]),
          _step37;
        try {
          for (_iterator37.s(); !(_step37 = _iterator37.n()).done;) {
            var item = _step37.value;
            var feature = this.gameManager.findObjectById(item.id);
            this.gameManager[heapName].add(feature);
          }
        } catch (err) {
          _iterator37.e(err);
        } finally {
          _iterator37.f();
        }
      }
    }

    // Helper to load autoubuys
  }, {
    key: "loadAutobuyArtifactData",
    value: function loadAutobuyArtifactData(gameData, autoBuyName) {
      var _iterator38 = _createForOfIteratorHelper(gameData[autoBuyName]),
        _step38;
      try {
        for (_iterator38.s(); !(_step38 = _iterator38.n()).done;) {
          var item = _step38.value;
          var artifact = this.gameManager.findObjectById(item.id);
          this.gameManager[autoBuyName].push(artifact);
        }
      } catch (err) {
        _iterator38.e(err);
      } finally {
        _iterator38.f();
      }
    }
  }]);
  return GameStateLoader;
}();
var Unlock = /*#__PURE__*/_createClass(function Unlock(id, category, type, dependentID, targetID, conditionType, conditionValue, triggerType, triggerValue) {
  _classCallCheck(this, Unlock);
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
});
var UnlockManager = /*#__PURE__*/function () {
  function UnlockManager(eventManager, gameManager) {
    _classCallCheck(this, UnlockManager);
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
  _createClass(UnlockManager, [{
    key: "completeAllUnlocks",
    value: function completeAllUnlocks() {
      var tempCompletedUnlocks = new Map();
      var _iterator39 = _createForOfIteratorHelper(this.unlocks),
        _step39;
      try {
        for (_iterator39.s(); !(_step39 = _iterator39.n()).done;) {
          var _step39$value = _slicedToArray(_step39.value, 2),
            id = _step39$value[0],
            unlock = _step39$value[1];
          if (unlock.triggerType === "tabEnable" || unlock.id <= 11010 && unlock.id >= 11000) {
            tempCompletedUnlocks.set(id, unlock);
            this.unlocks.delete(id);
          }
        }
      } catch (err) {
        _iterator39.e(err);
      } finally {
        _iterator39.f();
      }
      this.processTriggers(tempCompletedUnlocks);
      var tempUnlocks2 = new Map();
      var _iterator40 = _createForOfIteratorHelper(this.unlocks),
        _step40;
      try {
        for (_iterator40.s(); !(_step40 = _iterator40.n()).done;) {
          var _step40$value = _slicedToArray(_step40.value, 2),
            _id3 = _step40$value[0],
            _unlock = _step40$value[1];
          // if (unlock.triggerType === "tabEnable" || (unlock.id <= 11010 && unlock.id >= 11000)){

          tempUnlocks2.set(_id3, _unlock);
          this.unlocks.delete(_id3);
          // }
        }
      } catch (err) {
        _iterator40.e(err);
      } finally {
        _iterator40.f();
      }
      this.processTriggers(tempUnlocks2);
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: "powerLevel",
        value: new _break_eternityMin.default(100000),
        operation: 'add'
      });
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: "wisdom",
        value: new _break_eternityMin.default(100000),
        operation: 'add'
      });
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: "energy",
        value: new _break_eternityMin.default(100000),
        operation: 'add'
      });
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: "divine",
        value: new _break_eternityMin.default(100000),
        operation: 'add'
      });
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: "crystal",
        value: new _break_eternityMin.default(100000),
        operation: 'add'
      });
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: "radiance",
        value: new _break_eternityMin.default(100000),
        operation: 'add'
      });
    }
  }, {
    key: "checkUnlocks",
    value: function () {
      var _checkUnlocks = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var _this73 = this;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!this.isChecking) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              this.isChecking = true;
              this.checkLock = new Promise(function (resolve) {
                var tempCompletedUnlocks = _this73.processConditions();
                if (tempCompletedUnlocks.size > 0) {
                  _this73.processTriggers(tempCompletedUnlocks);
                }
                resolve();
              });
              _context2.next = 6;
              return this.checkLock;
            case 6:
              this.isChecking = false;
            case 7:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function checkUnlocks() {
        return _checkUnlocks.apply(this, arguments);
      }
      return checkUnlocks;
    }()
  }, {
    key: "processConditions",
    value: function processConditions() {
      var _this74 = this;
      var tempCompletedArray = new Map();
      var allResources = this.gameManager.queryPlayerValue("all");
      var _iterator41 = _createForOfIteratorHelper(this.unlocks),
        _step41;
      try {
        var _loop7 = function _loop7() {
          var _step41$value = _slicedToArray(_step41.value, 2),
            id = _step41$value[0],
            unlock = _step41$value[1];
          var isCompleted = false;
          if (unlock.category === "id") {
            switch (unlock.conditionType) {
              case 'maxLevel':
                if (unlock.dependent.level.gte(unlock.dependent.maxLevel)) {
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
          } else if (unlock.category === "stat") {
            var matchingResource = allResources.find(function (resource) {
              return resource.type === unlock.conditionType;
            });
            if (unlock.conditionValue.lte(matchingResource.value)) {
              isCompleted = true;
            }
          }
          if (isCompleted) {
            tempCompletedArray.set(id, unlock);
            _this74.unlocks.delete(id);
          }
        };
        for (_iterator41.s(); !(_step41 = _iterator41.n()).done;) {
          _loop7();
        }
      } catch (err) {
        _iterator41.e(err);
      } finally {
        _iterator41.f();
      }
      return tempCompletedArray;
    }
  }, {
    key: "processTriggers",
    value: function processTriggers(tempCompletedArray) {
      var _iterator42 = _createForOfIteratorHelper(tempCompletedArray),
        _step42;
      try {
        for (_iterator42.s(); !(_step42 = _iterator42.n()).done;) {
          var _step42$value = _slicedToArray(_step42.value, 2),
            id = _step42$value[0],
            unlock = _step42$value[1];
          if (this[unlock.triggerType]) {
            this[unlock.triggerType](unlock);
          }
        }

        //add completed and processed unlocks to the primary completed unlocks array
      } catch (err) {
        _iterator42.e(err);
      } finally {
        _iterator42.f();
      }
      var _iterator43 = _createForOfIteratorHelper(tempCompletedArray),
        _step43;
      try {
        for (_iterator43.s(); !(_step43 = _iterator43.n()).done;) {
          var _step43$value = _slicedToArray(_step43.value, 2),
            _id4 = _step43$value[0],
            _unlock2 = _step43$value[1];
          this.completedUnlocks.set(_id4, _unlock2);
        }
      } catch (err) {
        _iterator43.e(err);
      } finally {
        _iterator43.f();
      }
    }
  }, {
    key: "tabEnable",
    value: function tabEnable(unlock) {
      //need to set tab targets at this stage for now, since not accessible on init
      unlock.target = this.gameManager.findObjectById(unlock.targetID);
      unlock.target.setActive();
    }
  }, {
    key: "transferUnlockToCompleted",
    value: function transferUnlockToCompleted(unlock) {
      this.completedUnlocks.push(unlock);
      this.unlocks.delete(unlock.id);
      console.error(unlock.target);
    }
  }, {
    key: "setActive",
    value: function setActive(unlock) {
      if (Array.isArray(unlock.target)) {
        unlock.target.forEach(function (target) {
          if (target && typeof target.setActive === 'function') {
            target.setActive();
          }
        });
      } else if (unlock.target && typeof unlock.target.setActive === 'function') {
        unlock.target.setActive();
      }
    }
  }, {
    key: "evolve",
    value: function evolve(unlock) {
      unlock.target.evolve();
    }
  }, {
    key: "zoneRepeatEnable",
    value: function zoneRepeatEnable(unlock) {
      var world = unlock.target;
      //set gruop of zones to repeatUnlocked = true
      var _iterator44 = _createForOfIteratorHelper(world.regions),
        _step44;
      try {
        for (_iterator44.s(); !(_step44 = _iterator44.n()).done;) {
          var region = _step44.value;
          var _iterator45 = _createForOfIteratorHelper(region.zones),
            _step45;
          try {
            for (_iterator45.s(); !(_step45 = _iterator45.n()).done;) {
              var zone = _step45.value;
              zone.repeatUnlocked = true;
              if (zone.active && zone.isDefeated) {
                zone.startConquest();
              }
            }
          } catch (err) {
            _iterator45.e(err);
          } finally {
            _iterator45.f();
          }
        }
      } catch (err) {
        _iterator44.e(err);
      } finally {
        _iterator44.f();
      }
    }
  }, {
    key: "headbandLevelActivate",
    value: function headbandLevelActivate(unlock) {
      //set headband mod active
      unlock.target.setActive();
      //level up headband pseudo object
      var pseudoObject = this.gameManager.findObjectById(800);
      pseudoObject.active = true;
      pseudoObject.level = pseudoObject.level.plus(1);
    }
  }, {
    key: "reEngageUnlock",
    value: function () {
      var _reEngageUnlock = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(event) {
        var _iterator46, _step46, unlock, _iterator47, _step47, _unlock3, _iterator48, _step48, _step48$value, id, _unlock4;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.checkLock;
            case 2:
              if (event.detail.type === "milestone") {
                _iterator46 = _createForOfIteratorHelper(this.completedUnlocks.values());
                try {
                  for (_iterator46.s(); !(_step46 = _iterator46.n()).done;) {
                    unlock = _step46.value;
                    if (unlock.dependentID === event.detail.id && unlock.target.name.includes("milestone")) {
                      //set milestone mod inactive
                      unlock.target.active = false;

                      //rebuild milestone object's buildtree to remove mod's mult
                      unlock.dependent.calcTreesMap.get("production").buildTree();

                      // Remove the unlock from the completedUnlocks map and re-add to the unlocks map
                      this.completedUnlocks.delete(unlock.id);
                      this.unlocks.set(unlock.id, unlock);
                    }
                  }
                } catch (err) {
                  _iterator46.e(err);
                } finally {
                  _iterator46.f();
                }
              } else if (event.detail.type === "realm-feature-unlock") {
                _iterator47 = _createForOfIteratorHelper(this.completedUnlocks.values());
                try {
                  for (_iterator47.s(); !(_step47 = _iterator47.n()).done;) {
                    _unlock3 = _step47.value;
                    if (_unlock3.id >= 1200 && _unlock3.id <= 1210) {
                      _unlock3.target.active = false;
                      _unlock3.target.visible = false;

                      // Remove the unlock from the completedUnlocks map and re-add to the unlocks map
                      this.completedUnlocks.delete(_unlock3.id);
                      this.unlocks.set(_unlock3.id, _unlock3);
                    }
                  }
                } catch (err) {
                  _iterator47.e(err);
                } finally {
                  _iterator47.f();
                }
              } else {
                // Find the unlock with the given targetID in the completedUnlocks map
                _iterator48 = _createForOfIteratorHelper(this.completedUnlocks.entries());
                try {
                  for (_iterator48.s(); !(_step48 = _iterator48.n()).done;) {
                    _step48$value = _slicedToArray(_step48.value, 2), id = _step48$value[0], _unlock4 = _step48$value[1];
                    if (_unlock4.targetID === event.detail.id) {
                      // Remove the unlock from the completedUnlocks map
                      this.completedUnlocks.delete(id);

                      // Re-add the unlock to the unlocks map
                      this.unlocks.set(id, _unlock4);

                      // Optionally break the loop after finding and processing the first matching unlock
                      // break;
                    }
                  }
                } catch (err) {
                  _iterator48.e(err);
                } finally {
                  _iterator48.f();
                }
              }
            case 3:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function reEngageUnlock(_x2) {
        return _reEngageUnlock.apply(this, arguments);
      }
      return reEngageUnlock;
    }()
  }]);
  return UnlockManager;
}();
var GameSettings = /*#__PURE__*/_createClass(function GameSettings() {
  _classCallCheck(this, GameSettings);
});
var MinHeap = /*#__PURE__*/function () {
  function MinHeap() {
    _classCallCheck(this, MinHeap);
    this.heap = [];
  }
  _createClass(MinHeap, [{
    key: "getLeftChildIndex",
    value: function getLeftChildIndex(parentIndex) {
      return 2 * parentIndex + 1;
    }
  }, {
    key: "getRightChildIndex",
    value: function getRightChildIndex(parentIndex) {
      return 2 * parentIndex + 2;
    }
  }, {
    key: "getParentIndex",
    value: function getParentIndex(childIndex) {
      return Math.floor((childIndex - 1) / 2);
    }
  }, {
    key: "hasLeftChild",
    value: function hasLeftChild(index) {
      return this.getLeftChildIndex(index) < this.heap.length;
    }
  }, {
    key: "hasRightChild",
    value: function hasRightChild(index) {
      return this.getRightChildIndex(index) < this.heap.length;
    }
  }, {
    key: "hasParent",
    value: function hasParent(index) {
      return this.getParentIndex(index) >= 0;
    }
  }, {
    key: "leftChild",
    value: function leftChild(index) {
      return this.heap[this.getLeftChildIndex(index)];
    }
  }, {
    key: "rightChild",
    value: function rightChild(index) {
      return this.heap[this.getRightChildIndex(index)];
    }
  }, {
    key: "parent",
    value: function parent(index) {
      return this.heap[this.getParentIndex(index)];
    }
  }, {
    key: "swap",
    value: function swap(indexOne, indexTwo) {
      var temp = this.heap[indexOne];
      this.heap[indexOne] = this.heap[indexTwo];
      this.heap[indexTwo] = temp;
    }
  }, {
    key: "peek",
    value: function peek() {
      if (this.heap.length === 0) throw "Heap is empty";
      return this.heap[0];
    }
  }, {
    key: "poll",
    value: function poll() {
      if (this.heap.length === 0) throw "Heap is empty";
      var item = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown();
      return item;
    }
  }, {
    key: "add",
    value: function add(item) {
      if (!this.contains(item)) {
        this.heap.push(item);
        this.heapifyUp();
      }
    }
  }, {
    key: "heapifyUp",
    value: function heapifyUp() {
      var index = this.heap.length - 1;
      while (this.hasParent(index) && this.parent(index).costNextSingle.gt(this.heap[index].costNextSingle)) {
        this.swap(this.getParentIndex(index), index);
        index = this.getParentIndex(index);
      }
    }
  }, {
    key: "heapifyDown",
    value: function heapifyDown() {
      var index = 0;
      while (this.hasLeftChild(index)) {
        var smallerChildIndex = this.getLeftChildIndex(index);
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
  }, {
    key: "remove",
    value: function remove(item) {
      var index = this.heap.findIndex(function (element) {
        return element.id === item.id;
      });
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
  }, {
    key: "contains",
    value: function contains(item) {
      return this.heap.some(function (element) {
        return element.id === item.id;
      });
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var startIdx = Math.floor((this.heap.length - 2) / 2);
      for (var i = startIdx; i >= 0; i--) {
        this.heapifyDown(i);
      }
    }
  }]);
  return MinHeap;
}();
var GameManager = /*#__PURE__*/function () {
  function GameManager(eventManager) {
    var _this75 = this;
    _classCallCheck(this, GameManager);
    this.eventManager = eventManager;
    this.gameContent = new GameContent(eventManager);
    this.gameContent.unlockManager = new UnlockManager(eventManager, this);
    this.multiplierString = "1";
    this.forceHeap = new MinHeap();
    this.wisdomHeap = new MinHeap();
    this.energyHeap = new MinHeap();
    this.divineHeap = new MinHeap();
    this.artifactAutobuys = [];
    this.eventManager.addListener('queryPlayerValue', function (data, respond) {
      var result = _this75.queryPlayerValue(data);
      if (respond) {
        respond(result);
      }
    });
    this.eventManager.addListener('handlePurchase', function (data) {
      _this75.handlePurchase(data.id);
    });
    this.eventManager.addListener('updateFeatureValues', function (data) {
      _this75.updateFeatureValues(data.target, data.isNewLvl);
    });
    this.eventManager.addListener('updateNewMultiplierValues', function () {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this75.multiplierString;
      _this75.updateNewMultiplierValues(data.multiplierString);
    });
  }
  _createClass(GameManager, [{
    key: "autobuyArtifacts",
    value: function autobuyArtifacts() {
      var _this76 = this;
      var _iterator49 = _createForOfIteratorHelper(this.artifactAutobuys),
        _step49;
      try {
        var _loop8 = function _loop8() {
          var artifact = _step49.value;
          if (!artifact.autoUnlocked) {
            return "break";
          }
          var allResources = _this76.queryPlayerValue("all");
          var tempResource = new _break_eternityMin.default(allResources.find(function (resource) {
            return resource.type === artifact.costType;
          }).value);
          var purchased = true;
          while (purchased) {
            if (artifact.costNextSingle.lte(tempResource) && artifact.level.lt(artifact.maxLevel)) {
              var ratio = tempResource.dividedBy(artifact.costNextSingle);
              var purchaseCount = _break_eternityMin.default.max(1, ratio.plus(1).log(2)).floor();
              if (ratio.gte(10)) {
                while (purchaseCount.greaterThan(1) && artifact.calculateCostN(purchaseCount).gt(tempResource)) {
                  purchaseCount = purchaseCount.minus(1);
                }
              }

              // if the purchase count would increase level beyond maxLevel, adjust purchaseCount
              if (artifact.level.plus(purchaseCount).gt(artifact.maxLevel)) {
                purchaseCount = artifact.maxLevel.minus(artifact.level);
              }
              artifact.costNext = artifact.calculateCostN(purchaseCount);
              artifact.prodNext = artifact.calculateProdN(purchaseCount);
              artifact.nextLevelIncrement = purchaseCount;
              tempResource = tempResource.minus(artifact.costNext);
              _this76.handlePurchase(artifact.id, purchaseCount);
              if (artifact.level.neq(artifact.maxLevel)) {}
            } else {
              purchased = false;
            }

            // break the loop if maxLevel has been reached
            if (artifact.level.gte(artifact.maxLevel)) {
              break;
            }
          }
        };
        for (_iterator49.s(); !(_step49 = _iterator49.n()).done;) {
          var _ret2 = _loop8();
          if (_ret2 === "break") break;
        }
      } catch (err) {
        _iterator49.e(err);
      } finally {
        _iterator49.f();
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
  }, {
    key: "onMultiplierChange",
    value: function onMultiplierChange(newMultiplierString) {
      this.multiplierString = newMultiplierString;
      this.updateNewMultiplierValues(newMultiplierString);
    }
  }, {
    key: "updateNewMultiplierValues",
    value: function updateNewMultiplierValues() {
      var _this77 = this;
      var newMultiplierString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.multiplierString;
      var feature = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var multipliableFeatures;
      if (!feature) {
        multipliableFeatures = this.gameContent.trainings.concat(this.gameContent.upgrades).concat(this.gameContent.skillTree.skills).concat(this.gameContent.generators).concat(this.gameContent.essenceUpgrades).concat(this.gameContent.zones).concat(this.gameContent.fighters).concat(this.gameContent.artifacts).concat(this.gameContent.radianceUpgrades).concat(this.gameContent.forgeUpgrades).filter(function (feature) {
          return !feature.level.equals(feature.maxLevel);
        });
      } else {
        multipliableFeatures = [feature];
      }

      //nextMilestone
      if (newMultiplierString === "nextMilestone") {
        var _iterator50 = _createForOfIteratorHelper(multipliableFeatures),
          _step50;
        try {
          for (_iterator50.s(); !(_step50 = _iterator50.n()).done;) {
            var _feature2 = _step50.value;
            if (_feature2.featureType === "training" || _feature2.featureType === "generator" || _feature2.featureType === "artifact") {
              _feature2.updateValuesMilestone();
            } else {
              _feature2.updateValuesDigit(new _break_eternityMin.default(1));
            }
          }
        } catch (err) {
          _iterator50.e(err);
        } finally {
          _iterator50.f();
        }
      }

      //max
      else if (newMultiplierString === "max") {
        var _iterator51 = _createForOfIteratorHelper(multipliableFeatures),
          _step51;
        try {
          var _loop9 = function _loop9() {
            var feature = _step51.value;
            var allResources = _this77.queryPlayerValue("all");
            var matchingResource = allResources.find(function (resource) {
              return resource.type === feature.costType;
            });
            feature.updateValuesMax(matchingResource.value);
          };
          for (_iterator51.s(); !(_step51 = _iterator51.n()).done;) {
            _loop9();
          }
        } catch (err) {
          _iterator51.e(err);
        } finally {
          _iterator51.f();
        }
      }

      //1,5,10,100
      else {
        var n = new _break_eternityMin.default(newMultiplierString);
        var _iterator52 = _createForOfIteratorHelper(multipliableFeatures),
          _step52;
        try {
          for (_iterator52.s(); !(_step52 = _iterator52.n()).done;) {
            var _feature3 = _step52.value;
            _feature3.updateValuesDigit(n);
          }
        } catch (err) {
          _iterator52.e(err);
        } finally {
          _iterator52.f();
        }
      }
    }
  }, {
    key: "handlePurchase",
    value: function handlePurchase(featureID) {
      var purchaseCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var feature = this.findObjectById(featureID);
      this.deductFeatureCost(feature, purchaseCount);
      this.updateFeatureValues(feature, true);
      var count = null;
      if (purchaseCount) {
        count = new _break_eternityMin.default(purchaseCount);
      }
      feature.levelUp("manual", count);
      feature.costNextSingle = feature.calcCostNextSingle();
      this.updateNewMultiplierValues(this.multiplierString, feature);

      // this.eventManager.dispatchEvent('check-unlocks');
    }
  }, {
    key: "updateFeatureValues",
    value: function updateFeatureValues(feature, isNewLvl) {
      //handle if an active feature's multiplier is being updated but not its level
      //also handles evolutions
      if (feature.active && !isNewLvl) {
        feature.prodPrevious = feature.prodCurrent;
        feature.prodCurrent = feature.calculateProdN(feature.level, 0);
        feature.costNext = feature.calculateCostN(feature.manualLevel.plus(1), 0);
      }

      //dont update values if inactive || (level 0 & not being levelled up)
      else if (!feature.active || feature.level.eq(0) && !isNewLvl) {
        return;
      }
      //handle features that are being levelled manually or generator autopurchase
      else {
        if (feature.featureType === "generator") {
          feature.prodPrevious = feature.prodCurrent;
          feature.prodCurrent = feature.prodCurrent.plus(feature.prodNext);
        } else {
          feature.prodPrevious = feature.prodCurrent;
          feature.prodCurrent = feature.prodCurrent.plus(feature.prodNext);
        }
      }
      var dif = feature.prodCurrent.minus(feature.prodPrevious);
      if (feature.prodType === "forceIncome") {
        this.gameContent.player.forceIncome = this.gameContent.player.forceIncome.plus(dif);
      } else if (feature.prodType === "wisdomIncome") {
        this.gameContent.player.wisdomIncome = this.gameContent.player.wisdomIncome.plus(dif);
      } else if (feature.prodType === "energyIncome") {
        this.gameContent.player.energyIncome = this.gameContent.player.energyIncome.plus(dif);
      } else if (feature.prodType === "divineIncome") {
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
            var _iterator53 = _createForOfIteratorHelper(this.gameContent.zones),
              _step53;
            try {
              for (_iterator53.s(); !(_step53 = _iterator53.n()).done;) {
                var zone = _step53.value;
                if (zone.active && zone.isDefeated) {
                  zone.prodCurrent = zone.prodPrevious;
                  zone.prodNext = zone.prodCurrent.times(zone.prodMult);
                  var skillpointstoadd = zone.prodNext;
                  this.gameContent.player.skillpoint = this.gameContent.player.skillpoint.plus(skillpointstoadd);
                }
              }
            } catch (err) {
              _iterator53.e(err);
            } finally {
              _iterator53.f();
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
            var _iterator54 = _createForOfIteratorHelper(this.gameContent.zones),
              _step54;
            try {
              for (_iterator54.s(); !(_step54 = _iterator54.n()).done;) {
                var _zone = _step54.value;
                _zone.autoUnlocked = true;
                if (_zone.active && _zone.repeatUnlocked && _zone.isDefeated) {
                  _zone.startConquest();
                }
              }
            } catch (err) {
              _iterator54.e(err);
            } finally {
              _iterator54.f();
            }
            break;
          case 'autoConquestProgression':
            this.gameContent.worldManager.autoUnlocked = true;
            break;
          case 'autoArtifact':
            var _iterator55 = _createForOfIteratorHelper(this.gameContent.artifacts),
              _step55;
            try {
              for (_iterator55.s(); !(_step55 = _iterator55.n()).done;) {
                var artifact = _step55.value;
                artifact.autoUnlocked = true;
                if (artifact.active) {
                  artifact.autoToggle = true;
                  this.artifactAutobuys.push(artifact);
                }
              }
            } catch (err) {
              _iterator55.e(err);
            } finally {
              _iterator55.f();
            }
            break;
          case 'autoTournamentProgression':
            this.gameContent.tournament.autoUnlocked = true;
            break;

          //Training Automation
          case 'autoForceTrain':
            var _iterator56 = _createForOfIteratorHelper(this.gameContent.trainings.filter(function (training) {
                return training.realmID === 10;
              })),
              _step56;
            try {
              for (_iterator56.s(); !(_step56 = _iterator56.n()).done;) {
                var training = _step56.value;
                training.autoUnlocked = true;
                this.forceHeap.add(training);
                training.autoToggle = true;
              }
            } catch (err) {
              _iterator56.e(err);
            } finally {
              _iterator56.f();
            }
            break;
          case 'autoWisdomTrain':
            var _iterator57 = _createForOfIteratorHelper(this.gameContent.generators.filter(function (generator) {
                return generator.parentGenChain.realmID === 20;
              })),
              _step57;
            try {
              for (_iterator57.s(); !(_step57 = _iterator57.n()).done;) {
                var generator = _step57.value;
                generator.autoUnlocked = true;
                this.wisdomHeap.add(generator);
                generator.autoToggle = true;
              }
            } catch (err) {
              _iterator57.e(err);
            } finally {
              _iterator57.f();
            }
            break;
          case 'autoEnergyTrain':
            var _iterator58 = _createForOfIteratorHelper(this.gameContent.trainings.filter(function (training) {
                return training.realmID === 30;
              })),
              _step58;
            try {
              for (_iterator58.s(); !(_step58 = _iterator58.n()).done;) {
                var _training = _step58.value;
                _training.autoUnlocked = true;
                this.energyHeap.add(_training);
                _training.autoToggle = true;
              }
            } catch (err) {
              _iterator58.e(err);
            } finally {
              _iterator58.f();
            }
            break;
          case 'autoDivineTrain':
            var _iterator59 = _createForOfIteratorHelper(this.gameContent.generators.filter(function (generator) {
                return generator.parentGenChain.realmID === 40;
              })),
              _step59;
            try {
              for (_iterator59.s(); !(_step59 = _iterator59.n()).done;) {
                var _generator = _step59.value;
                _generator.autoUnlocked = true;
                this.divineHeap.add(_generator);
                _generator.autoToggle = true;
              }
            } catch (err) {
              _iterator59.e(err);
            } finally {
              _iterator59.f();
            }
            break;

          // Training Upgrade Automation
          case 'autoForceUpgrade':
            var _iterator60 = _createForOfIteratorHelper(this.gameContent.upgrades.filter(function (upgrade) {
                return upgrade.realmID === 10;
              })),
              _step60;
            try {
              for (_iterator60.s(); !(_step60 = _iterator60.n()).done;) {
                var upgrade = _step60.value;
                upgrade.autoUnlocked = true;
                this.forceHeap.add(upgrade);
                upgrade.autoToggle = true;
              }
            } catch (err) {
              _iterator60.e(err);
            } finally {
              _iterator60.f();
            }
            break;
          case 'autoWisdomUpgrade':
            var _iterator61 = _createForOfIteratorHelper(this.gameContent.upgrades.filter(function (upgrade) {
                return upgrade.realmID === 20;
              })),
              _step61;
            try {
              for (_iterator61.s(); !(_step61 = _iterator61.n()).done;) {
                var _upgrade = _step61.value;
                _upgrade.autoUnlocked = true;
                this.wisdomHeap.add(_upgrade);
                _upgrade.autoToggle = true;
              }
            } catch (err) {
              _iterator61.e(err);
            } finally {
              _iterator61.f();
            }
            break;
          case 'autoEnergyUpgrade':
            var _iterator62 = _createForOfIteratorHelper(this.gameContent.upgrades.filter(function (upgrade) {
                return upgrade.realmID === 30;
              })),
              _step62;
            try {
              for (_iterator62.s(); !(_step62 = _iterator62.n()).done;) {
                var _upgrade2 = _step62.value;
                _upgrade2.autoUnlocked = true;
                this.energyHeap.add(_upgrade2);
                _upgrade2.autoToggle = true;
              }
            } catch (err) {
              _iterator62.e(err);
            } finally {
              _iterator62.f();
            }
            break;
          case 'autoDivineUpgrade':
            var _iterator63 = _createForOfIteratorHelper(this.gameContent.upgrades.filter(function (upgrade) {
                return upgrade.realmID === 40;
              })),
              _step63;
            try {
              for (_iterator63.s(); !(_step63 = _iterator63.n()).done;) {
                var _upgrade3 = _step63.value;
                _upgrade3.autoUnlocked = true;
                this.divineHeap.add(_upgrade3);
                _upgrade3.autoToggle = true;
              }
            } catch (err) {
              _iterator63.e(err);
            } finally {
              _iterator63.f();
            }
            break;

          //NON-AUTOMATION SUPER UPGRADE HANDLING
          case 'modifyPlayerValue':
            this.eventManager.dispatchEvent('updatePlayerCurrencyMult', {
              valueType: feature.specialVar1,
              valueAmount: feature.specialVar2
            });
            break;
          case 'unspentCurrency':
            this.gameContent.player.synergyUpgrades[feature.specialVar1] = new _break_eternityMin.default(feature.specialVar2);
            break;
          case 'levelsAddLevels':
            var target = this.findObjectById(feature.specialVar2);
            var targetsTarget = this.findObjectById(feature.specialVar1);
            var calcType = feature.specialVar3;
            var calcValue = feature.prodBase;
            target.addLevelsAddLevelsTarget(targetsTarget, calcType, calcValue);
            break;
          case 'evolveRealm':
            var targetRealm = this.findObjectById(feature.specialVar1);
            targetRealm.evolve();
            break;
          default:
          // console.error("Error - forgeUpgrade prodType not found");
        }
      }
    }
  }, {
    key: "deductFeatureCost",
    value: function deductFeatureCost(feature) {
      var purchaseCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var cost = feature.costNext;
      if (purchaseCount) {
        cost = feature.calculateCostN(purchaseCount);
      }
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: feature.costType,
        value: cost,
        operation: 'subtract'
      });
    }
  }, {
    key: "calculateIncome",
    value: function calculateIncome(deltaTime) {
      var _iterator64 = _createForOfIteratorHelper(this.gameContent.generatorChains),
        _step64;
      try {
        for (_iterator64.s(); !(_step64 = _iterator64.n()).done;) {
          var chain = _step64.value;
          if (chain.active) {
            chain.calculateChain(this, deltaTime);
          }
        }
      } catch (err) {
        _iterator64.e(err);
      } finally {
        _iterator64.f();
      }
      this.gameContent.player.updateCurrencySynergyMultipliers();
      this.gameContent.player.addIncomes(deltaTime);
      this.gameContent.player.calculatePowerLevel(deltaTime);
      this.gameContent.player.updateLifetimeValues(deltaTime);
      this.processAutobuying();

      //reduce zone and fight time based on power level and timeModifier upgrades
      var powerFactor = new _break_eternityMin.default(1).plus(this.gameContent.player.powerLevel.plus(1).ln().times(0.001));
      var timeModifier = this.gameContent.player.timeModifierUpgrade;
      var _iterator65 = _createForOfIteratorHelper(this.gameContent.zones),
        _step65;
      try {
        for (_iterator65.s(); !(_step65 = _iterator65.n()).done;) {
          var zone = _step65.value;
          zone.conquestTime = zone.baseConquestTime.div(powerFactor).div(timeModifier);
        }

        //reduce fighter conquest time based on power level
      } catch (err) {
        _iterator65.e(err);
      } finally {
        _iterator65.f();
      }
      var _iterator66 = _createForOfIteratorHelper(this.gameContent.fighters),
        _step66;
      try {
        for (_iterator66.s(); !(_step66 = _iterator66.n()).done;) {
          var fighter = _step66.value;
          fighter.fightTime = fighter.baseFightTime.div(powerFactor).div(timeModifier);
        }
      } catch (err) {
        _iterator66.e(err);
      } finally {
        _iterator66.f();
      }
    }
  }, {
    key: "processAutobuying",
    value: function processAutobuying() {
      var force = this.queryPlayerValue('force');
      var wisdom = this.queryPlayerValue('wisdom');
      var energy = this.queryPlayerValue('energy');
      var divine = this.queryPlayerValue('divine');
      this.autoTournamentProgression();
      this.autoConquestProgression();
      this.autobuyArtifacts();
      this.autobuy(force, "force");
      this.autobuy(wisdom, "wisdom");
      this.autobuy(energy, "energy");
      this.autobuy(divine, "divine");
    }
  }, {
    key: "autoConquestProgression",
    value: function autoConquestProgression() {
      if (!this.gameContent.worldManager.autoUnlocked) {
        return;
      }
      var _iterator67 = _createForOfIteratorHelper(this.gameContent.zones),
        _step67;
      try {
        for (_iterator67.s(); !(_step67 = _iterator67.n()).done;) {
          var zone = _step67.value;
          if (zone.isConquesting || !zone.active || zone.isDefeated) {
            continue;
          } else {
            var currentResource = this.queryPlayerValue(zone.costType);
            if (currentResource.gte(zone.costNext)) {
              zone.startConquest();
            }
          }
        }
      } catch (err) {
        _iterator67.e(err);
      } finally {
        _iterator67.f();
      }
    }
  }, {
    key: "autoTournamentProgression",
    value: function autoTournamentProgression() {
      if (!this.gameContent.tournament.autoUnlocked) {
        return;
      }
      var _iterator68 = _createForOfIteratorHelper(this.gameContent.tournament.fighters),
        _step68;
      try {
        for (_iterator68.s(); !(_step68 = _iterator68.n()).done;) {
          var fighter = _step68.value;
          if (fighter.isDefeated || fighter.isFighting || !fighter.active) {
            continue;
          } else {
            var currentResource = this.queryPlayerValue(fighter.costType);
            if (currentResource.gte(fighter.costNext)) {
              this.eventManager.dispatchEvent('startFight', fighter.id);
            }
          }
        }
      } catch (err) {
        _iterator68.e(err);
      } finally {
        _iterator68.f();
      }
    }
  }, {
    key: "autobuy",
    value: function autobuy(resource, resourceType) {
      var minHeap;
      switch (resourceType) {
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
      if (minHeap.heap.length === 0) {
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

      var tempResource = new _break_eternityMin.default(resource);
      var purchased = true;
      while (purchased) {
        var feature = minHeap.peek();

        //continue if can afford one
        if (feature.costNextSingle.lte(tempResource)) {
          var ratio = tempResource.div(feature.costNextSingle);
          var purchaseCount = _break_eternityMin.default.max(1, ratio.plus(1).log(2)).floor();
          if (ratio.gte(10)) {
            while (purchaseCount.gt(1) && feature.calculateCostN(purchaseCount).gt(tempResource)) {
              purchaseCount = purchaseCount.minus(1);
            }
          }

          //reduce purchase level if will push feature to max
          if (purchaseCount.gt(feature.maxLevel.minus(feature.level))) {
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
          if (feature.costNext.gt(tempResource)) {
            // console.error(feature.name,feature.costNext,tempResource);
            break;
          }
          feature.nextLevelIncrement = purchaseCount;
          tempResource = tempResource.minus(feature.costNext);
          this.handlePurchase(feature.id, purchaseCount);
          minHeap.poll();
          if (feature.level.neq(feature.maxLevel)) {
            minHeap.add(feature);
          }
        } else {
          purchased = false;
        }
      }
    }
  }, {
    key: "queryPlayerValue",
    value: function queryPlayerValue(type) {
      var _this78 = this;
      var properties = [
      // currencies
      'force', 'wisdom', 'energy', 'divine', 'essence', 'skillpoint', 'crystal', 'radiance', 'powerLevel',
      // lifetime stats
      'lifetimeForceEarned', 'lifetimeWisdomEarned', 'lifetimeEnergyEarned', 'lifetimeDivineEarned', 'lifetimeCrystalEarned', 'lifetimeEssenceEarned', 'totalPlaytime',
      //exploration stats
      'maxProgressionWorld', 'maxProgressionRegion', 'lifetimeZoneCompletions', 'lifetimeRegionProgressions',
      //tournament stats
      'maxTournamentRank', 'lifetimeKills'];
      if (type === 'all') {
        var allResources = [];
        properties.forEach(function (prop) {
          if (prop in _this78.gameContent.player) {
            allResources.push({
              'type': prop,
              'value': _this78.gameContent.player[prop]
            });
          }
        });
        this.gameContent.player.shards.forEach(function (value, key) {
          return allResources.push({
            'type': key,
            'value': value
          });
        });
        return allResources;
      } else if (properties.includes(type) && type in this.gameContent.player) {
        return this.gameContent.player[type];
      } else if (this.gameContent.player.shards.has(type)) {
        return this.gameContent.player.shards.get(type);
      }
    }
  }, {
    key: "findObjectById",
    value: function findObjectById(id) {
      var object = this.gameContent.idToObjectMap.get(id);
      return object;
    }
  }]);
  return GameManager;
}();
var EventManager = /*#__PURE__*/function () {
  function EventManager() {
    _classCallCheck(this, EventManager);
    this.listeners = {};
  }

  // Register an event listener
  _createClass(EventManager, [{
    key: "addListener",
    value: function addListener(eventType, callback) {
      if (!this.listeners[eventType]) {
        this.listeners[eventType] = [];
      }
      this.listeners[eventType].push(callback);
    }

    // Remove an event listener
  }, {
    key: "removeListener",
    value: function removeListener(eventType, callback) {
      if (this.listeners[eventType]) {
        var index = this.listeners[eventType].indexOf(callback);
        if (index > -1) {
          this.listeners[eventType].splice(index, 1);
        }
      }
    }

    // Dispatch an event to all registered listeners
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(eventType, eventData, handleResult) {
      if (this.listeners[eventType]) {
        this.listeners[eventType].forEach(function (callback) {
          if (typeof handleResult === 'function') {
            callback(eventData, handleResult);
          } else {
            callback(eventData);
          }
        });
      }
    }
  }, {
    key: "dispatchQuery",
    value: function dispatchQuery(eventType, eventData) {
      var _this79 = this;
      return new Promise(function (resolve) {
        _this79.dispatchEvent(eventType, eventData, resolve);
      });
    }
  }, {
    key: "clearAllListeners",
    value: function clearAllListeners() {
      for (var eventType in this.listeners) {
        delete this.listeners[eventType];
        // this.listeners[eventType] = [];
      }
    }
  }]);
  return EventManager;
}();
var GameContent = /*#__PURE__*/_createClass(function GameContent(eventManager) {
  _classCallCheck(this, GameContent);
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
});
var Player = /*#__PURE__*/function () {
  function Player(eventManager) {
    var _this80 = this;
    _classCallCheck(this, Player);
    this.eventManager = eventManager;
    this.powerLevel = new _break_eternityMin.default(5);
    this.baseForce = new _break_eternityMin.default(20000);
    this.force = this.baseForce;
    this.forceIncome = new _break_eternityMin.default(0);
    this.forceSynergyMult = new _break_eternityMin.default(1);
    this.baseForcePowerLevelMultiplier = new _break_eternityMin.default(1);
    this.forcePowerLevelMultiplier = this.baseForcePowerLevelMultiplier;
    this.powerLevelFromForce = new _break_eternityMin.default(0);
    this.baseWisdom = new _break_eternityMin.default(0);
    this.wisdom = this.baseWisdom;
    this.wisdomIncome = new _break_eternityMin.default(0);
    this.wisdomSynergyMult = new _break_eternityMin.default(1);
    this.baseWisdomPowerLevelMultiplier = new _break_eternityMin.default(10);
    this.wisdomPowerLevelMultiplier = this.baseWisdomPowerLevelMultiplier;
    this.powerLevelFromWisdom = new _break_eternityMin.default(0);
    this.baseEnergy = new _break_eternityMin.default(0);
    this.energy = this.baseEnergy;
    this.energyIncome = new _break_eternityMin.default(0);
    this.energySynergyMult = new _break_eternityMin.default(1);
    this.baseEnergyPowerLevelMultiplier = new _break_eternityMin.default(100);
    this.energyPowerLevelMultiplier = this.baseEnergyPowerLevelMultiplier;
    this.powerLevelFromEnergy = new _break_eternityMin.default(0);
    this.baseDivine = new _break_eternityMin.default(0);
    this.divine = this.baseDivine;
    this.divineIncome = new _break_eternityMin.default(0);
    this.divineSynergyMult = new _break_eternityMin.default(1);
    this.baseDivinePowerLevelMultiplier = new _break_eternityMin.default(1000);
    this.divinePowerLevelMultiplier = this.baseDivinePowerLevelMultiplier;
    this.powerLevelFromDivine = new _break_eternityMin.default(0);
    this.forceIncomeDisplay = new _break_eternityMin.default(0);
    this.wisdomIncomeDisplay = new _break_eternityMin.default(0);
    this.energyIncomeDisplay = new _break_eternityMin.default(0);
    this.divineIncomeDisplay = new _break_eternityMin.default(0);
    this.timeModifierUpgrade = 1;
    this.synergyUpgrades = {
      unspentForceToWisdom: new _break_eternityMin.default(0),
      unspentForceToEnergy: new _break_eternityMin.default(0),
      unspentForceToDivine: new _break_eternityMin.default(0),
      unspentWisdomToForce: new _break_eternityMin.default(0),
      unspentWisdomToEnergy: new _break_eternityMin.default(0),
      unspentWisdomToDivine: new _break_eternityMin.default(0),
      unspentEnergyToForce: new _break_eternityMin.default(0),
      unspentEnergyToWisdom: new _break_eternityMin.default(0),
      unspentEnergyToDivine: new _break_eternityMin.default(0),
      unspentDivineToForce: new _break_eternityMin.default(0),
      unspentDivineToWisdom: new _break_eternityMin.default(0),
      unspentDivineToEnergy: new _break_eternityMin.default(0)
    };
    this.baseCrystal = new _break_eternityMin.default(0);
    this.crystal = this.baseCrystal;
    this.radiance = new _break_eternityMin.default(0);
    this.shards = new Map();
    this.shards.set("alphaShard", new _break_eternityMin.default(0));
    this.shards.set("betaShard", new _break_eternityMin.default(0));
    this.shards.set("gammaShard", new _break_eternityMin.default(0));
    this.shards.set("deltaShard", new _break_eternityMin.default(0));
    this.shards.set("epsilonShard", new _break_eternityMin.default(0));
    this.shards.set("zetaShard", new _break_eternityMin.default(0));
    this.shards.set("etaShard", new _break_eternityMin.default(0));
    this.shards.set("thetaShard", new _break_eternityMin.default(0));
    this.shards.set("iotaShard", new _break_eternityMin.default(0));
    this.shards.set("kappaShard", new _break_eternityMin.default(0));
    this.shards.set("lambdaShard", new _break_eternityMin.default(0));
    this.shards.set("muShard", new _break_eternityMin.default(0));
    this.shards.set("nuShard", new _break_eternityMin.default(0));
    this.baseEssence = new _break_eternityMin.default(0);
    this.essence = this.baseEssence;
    this.essenceIncome = new _break_eternityMin.default(0);
    this.baseSkillpoint = new _break_eternityMin.default(20);
    this.skillpoint = this.baseSkillpoint;
    this.lifetimeForceEarned = new _break_eternityMin.default(0);
    this.lifetimeWisdomEarned = new _break_eternityMin.default(0);
    this.lifetimeEnergyEarned = new _break_eternityMin.default(0);
    this.lifetimeDivineEarned = new _break_eternityMin.default(0);
    this.lifetimeEssenceEarned = new _break_eternityMin.default(0);
    this.lifetimeCrystalEarned = new _break_eternityMin.default(0);
    this.maxPowerLevelAchieved = new _break_eternityMin.default(0);
    this.lifetimeZoneCompletions = new _break_eternityMin.default(0);
    this.lifetimeRegionProgressions = new _break_eternityMin.default(0);
    this.lifetimeWorldProgressions = new _break_eternityMin.default(0);
    this.maxProgressionWorld = new _break_eternityMin.default(0);
    this.maxProgressionRegion = new _break_eternityMin.default(0);
    this.maxTournamentRank = new _break_eternityMin.default(101); //top rank within max stage
    this.lifetimeKills = new _break_eternityMin.default(0);
    this.lastRebirth1 = Date.now();
    this.lastSave = new Date();
    this.originalStartDateTime = new Date();
    this.totalPlaytime = new _break_eternityMin.default(0);
    this.eventManager.addListener('updatePlayerCurrencyMult', function (data) {
      _this80.updatePlayerCurrencyMult(data);
    });
    this.eventManager.addListener('updatePlayerProperty', function (data) {
      _this80.updatePlayerProperty(data.property, data.value, data.operation);
    });
  }
  _createClass(Player, [{
    key: "addIncomes",
    value: function addIncomes(deltaTime) {
      this.calculateIncomeAndMultiplier('force', deltaTime);
      this.calculateIncomeAndMultiplier('wisdom', deltaTime);
      this.calculateIncomeAndMultiplier('energy', deltaTime);
      this.calculateIncomeAndMultiplier('divine', deltaTime);
    }
  }, {
    key: "calculateIncomeAndMultiplier",
    value: function calculateIncomeAndMultiplier(currency, deltaTime) {
      var income = this[currency + 'Income'];
      var synergyMult = this[currency + 'SynergyMult'];
      var calculatedIncome = income.times(synergyMult).times(deltaTime);
      this[currency] = this[currency].plus(calculatedIncome);
      this[currency + 'IncomeDisplay'] = income.times(synergyMult);

      // also update lifetime values
      this['lifetime' + currency.charAt(0).toUpperCase() + currency.slice(1) + 'Earned'] = this['lifetime' + currency.charAt(0).toUpperCase() + currency.slice(1) + 'Earned'].plus(calculatedIncome);
    }
  }, {
    key: "updateCurrencySynergyMultipliers",
    value: function updateCurrencySynergyMultipliers() {
      // Reset the multipliers to 1
      this.forceSynergyMult = new _break_eternityMin.default(1);
      this.wisdomSynergyMult = new _break_eternityMin.default(1);
      this.energySynergyMult = new _break_eternityMin.default(1);
      this.divineSynergyMult = new _break_eternityMin.default(1);
      var synergyMap = {
        'unspentForceToWisdom': {
          currency: 'wisdom',
          source: 'force'
        },
        'unspentForceToEnergy': {
          currency: 'energy',
          source: 'force'
        },
        'unspentForceToDivine': {
          currency: 'divine',
          source: 'force'
        },
        'unspentWisdomToForce': {
          currency: 'force',
          source: 'wisdom'
        },
        'unspentWisdomToEnergy': {
          currency: 'energy',
          source: 'wisdom'
        },
        'unspentWisdomToDivine': {
          currency: 'divine',
          source: 'wisdom'
        },
        'unspentEnergyToForce': {
          currency: 'force',
          source: 'energy'
        },
        'unspentEnergyToWisdom': {
          currency: 'wisdom',
          source: 'energy'
        },
        'unspentEnergyToDivine': {
          currency: 'divine',
          source: 'energy'
        },
        'unspentDivineToForce': {
          currency: 'force',
          source: 'divine'
        },
        'unspentDivineToWisdom': {
          currency: 'wisdom',
          source: 'divine'
        },
        'unspentDivineToEnergy': {
          currency: 'energy',
          source: 'divine'
        }
      };
      for (var synergy in this.synergyUpgrades) {
        var multiplier = this.synergyUpgrades[synergy];
        if (multiplier.gt(0)) {
          var _synergyMap$synergy = synergyMap[synergy],
            currency = _synergyMap$synergy.currency,
            source = _synergyMap$synergy.source;
          this[currency + 'SynergyMult'] = this[currency + 'SynergyMult'].times(this[source].times(multiplier));
        }
      }
    }
  }, {
    key: "calculatePowerLevel",
    value: function calculatePowerLevel(deltaTime) {
      var powerLevelAddedFromForce = this.forceIncome.times(this.forceSynergyMult).times(this.forcePowerLevelMultiplier).times(deltaTime);
      var powerLevelAddedFromWisdom = this.wisdomIncome.times(this.wisdomSynergyMult).times(this.wisdomPowerLevelMultiplier).times(deltaTime);
      var powerLevelAddedFromEnergy = this.energyIncome.times(this.energySynergyMult).times(this.energyPowerLevelMultiplier).times(deltaTime);
      var powerLevelAddedFromDivine = this.divineIncome.times(this.divineSynergyMult).times(this.divinePowerLevelMultiplier).times(deltaTime);
      this.powerLevel = this.powerLevel.plus(powerLevelAddedFromForce).plus(powerLevelAddedFromWisdom).plus(powerLevelAddedFromEnergy).plus(powerLevelAddedFromDivine);
      if (this.powerLevel.gt(this.maxPowerLevelAchieved)) {
        this.maxPowerLevelAchieved = this.powerLevel;
      }
      this.powerLevelFromForce = this.powerLevelFromForce.plus(powerLevelAddedFromForce);
      this.powerLevelFromWisdom = this.powerLevelFromWisdom.plus(powerLevelAddedFromWisdom);
      this.powerLevelFromEnergy = this.powerLevelFromEnergy.plus(powerLevelAddedFromEnergy);
      this.powerLevelFromDivine = this.powerLevelFromDivine.plus(powerLevelAddedFromDivine);
    }
  }, {
    key: "updateLifetimeValues",
    value: function updateLifetimeValues(deltaTime) {
      this.lifetimeForceEarned = this.lifetimeForceEarned.plus(this.forceIncome.times(deltaTime));
      this.lifetimeWisdomEarned = this.lifetimeWisdomEarned.plus(this.wisdomIncome.times(deltaTime));
      this.lifetimeEnergyEarned = this.lifetimeEnergyEarned.plus(this.energyIncome.times(deltaTime));
      this.lifetimeDivineEarned = this.lifetimeDivineEarned.plus(this.divineIncome.times(deltaTime));
    }
  }, {
    key: "updatePlayerCurrencyMult",
    value: function updatePlayerCurrencyMult(data) {
      var valueType = data.valueType;
      var valueAmount = data.valueAmount;
      var valueTypeMap = {
        'forcePowerLevelMultiplier': {
          'powerLevelFrom': 'powerLevelFromForce',
          'multiplier': 'forcePowerLevelMultiplier'
        },
        'wisdomPowerLevelMultiplier': {
          'powerLevelFrom': 'powerLevelFromWisdom',
          'multiplier': 'wisdomPowerLevelMultiplier'
        },
        'energyPowerLevelMultiplier': {
          'powerLevelFrom': 'powerLevelFromEnergy',
          'multiplier': 'energyPowerLevelMultiplier'
        },
        'divinePowerLevelMultiplier': {
          'powerLevelFrom': 'powerLevelFromDivine',
          'multiplier': 'divinePowerLevelMultiplier'
        }
      };
      var mappedValues = valueTypeMap[valueType];
      if (mappedValues) {
        //set power level from source to base level with no multiplier
        var newPowerLevelFromSource = this[mappedValues.powerLevelFrom].div(this[mappedValues.multiplier]);

        //update new multiplier
        this[mappedValues.multiplier] = this[mappedValues.multiplier].times(valueAmount);

        //calculate new power level contribution from source
        newPowerLevelFromSource = newPowerLevelFromSource.times(this[mappedValues.multiplier]);

        //subtract the old powerLevelFromSource value from overall powerLevel
        var newPowerLevel = this.powerLevel.minus(this[mappedValues.powerLevelFrom]);

        //add the new powerLevelFromSourceValue to power level
        newPowerLevel = newPowerLevel.plus(newPowerLevelFromSource);

        //update powerLevelFromSource and powerLevel with new values
        this[mappedValues.powerLevelFrom] = newPowerLevelFromSource;
        this.powerLevel = newPowerLevel;
      }
    }
  }, {
    key: "updatePlayerProperty",
    value: function updatePlayerProperty(property, value, operation) {
      // Check if property is a shard
      if (this.shards.has(property)) {
        var currentShardValue = this.shards.get(property);
        if (operation === "add") {
          this.shards.set(property, currentShardValue.plus(value));
        } else if (operation === "subtract") {
          if (currentShardValue.lt(value)) {
            console.error("Not enough ".concat(property, " to subtract."));
            return;
          }
          this.shards.set(property, currentShardValue.minus(value));
        }
      }
      // If not a shard, check if it's a valid property
      else if (this.hasOwnProperty(property)) {
        var currentProperty = this[property];
        if (!(currentProperty instanceof _break_eternityMin.default)) {
          console.error("Property ".concat(property, " is not a valid Decimal property."));
          return;
        }
        if (operation === "add") {
          this[property] = currentProperty.plus(value);
        } else if (operation === "subtract") {
          if (currentProperty.lt(value)) {
            console.error("Not enough ".concat(property, " to subtract."));
            return;
          }
          this[property] = currentProperty.minus(value);
        } else if (operation === "replaceIfGreater") {
          if (value.gt(currentProperty)) {
            this[property] = value;
          }
        } else if (operation === "replaceIfLesser") {
          if (value.lt(currentProperty)) {
            this[property] = value;
          }
        }
      }
      // If it's not a valid property or shard, throw error
      else {
        console.error("Property ".concat(property, " does not exist."));
        return;
      }
    }
  }]);
  return Player;
}();
var Observable = /*#__PURE__*/function () {
  function Observable() {
    _classCallCheck(this, Observable);
    this.observers = [];
  }
  _createClass(Observable, [{
    key: "registerObserver",
    value: function registerObserver(observer) {
      this.observers.push(observer);
    }
  }, {
    key: "unregisterObserver",
    value: function unregisterObserver(observer) {
      var index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    }
  }, {
    key: "notifyObservers",
    value: function notifyObservers(data) {
      this.observers.forEach(function (observer) {
        if (observer.active) {
          observer.update(data);
        }
      });
    }
  }, {
    key: "unlockObserver",
    value: function unlockObserver(observerID) {
      this.observers.find(function (observer) {
        return observer.id === observerID;
      }).active = true;
    }
  }]);
  return Observable;
}();
var Mod = /*#__PURE__*/function (_Observable) {
  _inherits(Mod, _Observable);
  var _super = _createSuper(Mod);
  function Mod(eventManager, id, name, type, priority, sourceID, sourceCalcType, targetType, targetID, runningCalcType, baseValue, value, active, specialActivatorID) {
    var _this81;
    _classCallCheck(this, Mod);
    _this81 = _super.call(this);
    _this81.eventManager = eventManager;
    _this81.id = id;
    _this81.name = name;
    _this81.type = type;
    _this81.priority = priority;
    _this81.source = null;
    _this81.sourceID = sourceID;
    _this81.sourceCalcType = sourceCalcType;
    _this81.target = null;
    _this81.targetID = targetID;
    _this81.runningCalcType = runningCalcType;
    _this81.targetType = targetType;
    _this81.baseValue = new _break_eternityMin.default(baseValue);
    _this81.value = new _break_eternityMin.default(baseValue);
    _this81.calcTreeReferences = [];
    _this81.active = active;
    _this81.specialActivatorID = specialActivatorID;
    _this81.specialActivator = null;
    return _this81;
  }
  _createClass(Mod, [{
    key: "setActive",
    value: function setActive() {
      this.active = true;
      this.source.updateObservers();
    }
  }]);
  return Mod;
}(Observable);
var CalculationTreeNode = /*#__PURE__*/_createClass(function CalculationTreeNode(ref, parentTree) {
  _classCallCheck(this, CalculationTreeNode);
  this.ref = ref;
  this.priority = ref.priority;
  this.result = new _break_eternityMin.default(0);
  this.runningResult = new _break_eternityMin.default(0);
  this.parentTree = parentTree;
  this.previousNode = null;
  this.nextNode = null;
});
var CalculationTree = /*#__PURE__*/function () {
  function CalculationTree(parent, type) {
    _classCallCheck(this, CalculationTree);
    this.nodes = [];
    this.parent = parent;
    this.type = type;
    this.currentRunningResult = new _break_eternityMin.default(0);
  }
  _createClass(CalculationTree, [{
    key: "buildTree",
    value: function buildTree() {
      var firstActiveNode = this.setFirstActiveNode();
      if (!firstActiveNode) {
        if (this.type === "cost") {
          this.parent.costMult = this.parent.costMultBase;
        } else if (this.type === "production") {
          this.parent.prodMult = this.parent.prodMultBase;
        }
        return;
      } else {
        this.updateDownstreamNodes(firstActiveNode);
      }
      if (this.type === "cost") {
        this.parent.costMult = this.currentRunningResult;
      } else if (this.type === "production") {
        this.parent.prodMult = this.currentRunningResult;
      }
    }
  }, {
    key: "setFirstActiveNode",
    value: function setFirstActiveNode() {
      var currentNode = this.nodes[0];
      var baseMult = new _break_eternityMin.default(0);
      if (this.type === "cost") {
        baseMult = this.parent.costMultBase;
      } else if (this.type === "production") {
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
  }, {
    key: "updateDownstreamNodes",
    value: function updateDownstreamNodes(firstActiveNode) {
      var currentNode = firstActiveNode.nextNode;
      var lastActiveNode = firstActiveNode;
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
  }, {
    key: "calcNodeResult",
    value: function calcNodeResult(node, sourceValue) {
      var val = new _break_eternityMin.default(node.ref.value);
      var srcVal = new _break_eternityMin.default(sourceValue);
      var calcType = node.ref.sourceCalcType;
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
          srcVal = new _break_eternityMin.default(0);
        } else if (node.ref.sourceCalcType === 'exp') {
          srcVal = new _break_eternityMin.default(1);
        }
      }
      return this.performCalculation(calcType, val, srcVal);
    }
  }, {
    key: "calcNodeRunningResult",
    value: function calcNodeRunningResult(node, prevRunningResult) {
      var res = new _break_eternityMin.default(node.result);
      var prevRes = new _break_eternityMin.default(prevRunningResult);
      return this.performCalculation(node.ref.runningCalcType, res, prevRes);
    }
  }, {
    key: "performCalculation",
    value: function performCalculation(type, val1, val2) {
      var CALCULATION_TYPES = {
        'add': function add(val1, val2) {
          return val1.plus(val2);
        },
        'sub': function sub(val1, val2) {
          return val2.minus(val1);
        },
        'mult': function mult(val1, val2) {
          return val1.times(val2);
        },
        'addPercent': function addPercent(val1, val2) {
          return val1.div(100).plus(1).times(val2);
        },
        'subPercent': function subPercent(val1, val2) {
          return new _break_eternityMin.default(1).minus(val1.div(100)).times(val2);
        },
        'div': function div(val1, val2) {
          return val2.dividedBy(val1);
        },
        'exp': function exp(val1, val2) {
          return val2.pow(val1);
        },
        'tetra': function tetra(val1, val2) {
          return val2.tetrate(val1);
        },
        'log': function log(val1, val2) {
          return val2.eq(0) ? new _break_eternityMin.default(0) : val2.log(new _break_eternityMin.default(val1));
        }
      };
      var calculation = CALCULATION_TYPES[type];
      if (!calculation) {
        throw new Error('Unknown calculation type: ' + type);
      }
      return calculation(val1, val2);
    }
  }, {
    key: "addNode",
    value: function addNode(mod) {
      var newNode = new CalculationTreeNode(mod, this);
      var insertIndex = this.nodes.length;
      for (var i = 0; i < this.nodes.length; i++) {
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
  }]);
  return CalculationTree;
}();
var GameFeature = /*#__PURE__*/function (_Observable2) {
  _inherits(GameFeature, _Observable2);
  var _super2 = _createSuper(GameFeature);
  function GameFeature(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate) {
    var _this82;
    var active = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : false;
    var visible = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : false;
    _classCallCheck(this, GameFeature);
    _this82 = _super2.call(this);
    _this82.eventManager = eventManager;
    _this82.id = id;
    _this82.featureType = null;
    _this82.name = name;
    _this82.description = description;
    _this82.maxLevel = new _break_eternityMin.default(maxLevel);
    _this82.autoLevel = new _break_eternityMin.default(0);
    _this82.manualLevel = new _break_eternityMin.default(0);
    _this82.baseLevel = new _break_eternityMin.default(0);
    _this82.level = new _break_eternityMin.default(level);
    _this82.maxAffLvl = new _break_eternityMin.default(0);
    _this82.nextAffordableMilestoneLevel = new _break_eternityMin.default(0);
    _this82.nextMilestoneLevel = new _break_eternityMin.default(0);
    _this82.nextMilestoneMult = new _break_eternityMin.default(0);
    _this82.nextLevelIncrement = new _break_eternityMin.default(0);
    _this82.costType = costType;
    _this82.costGrowthRate = new _break_eternityMin.default(costGrowthRate);
    _this82.costMultBase = new _break_eternityMin.default(1);
    _this82.costMult = new _break_eternityMin.default(1);
    _this82.costBase = new _break_eternityMin.default(costBase);
    _this82.costNext = new _break_eternityMin.default(0);
    _this82.costNextSingle = _this82.calcCostNextSingle();
    _this82.prodType = prodType;
    _this82.prodGrowthRate = new _break_eternityMin.default(prodGrowthRate);
    _this82.prodMultBase = new _break_eternityMin.default(1);
    _this82.prodMult = new _break_eternityMin.default(1);
    _this82.prodPrevious = new _break_eternityMin.default(0);
    _this82.prodBase = new _break_eternityMin.default(prodBase);
    _this82.prodCurrent = new _break_eternityMin.default(0);
    _this82.prodNext = new _break_eternityMin.default(0);
    _this82.prodNextSingle = new _break_eternityMin.default(0);
    _this82.calcTreesMap = new Map();
    _this82.active = active;
    _this82.autoUnlocked = false;
    _this82.autoToggle = false;
    _this82.currentAutoHeap = null;
    _this82.levelsAddLevelsTargets = [];
    _this82.visible = visible;
    return _this82;
  }
  _createClass(GameFeature, [{
    key: "calcGeometricSum",
    value: function calcGeometricSum(a, r, n) {
      var a_dec = new _break_eternityMin.default(a);
      var r_dec = new _break_eternityMin.default(r);
      var n_dec = new _break_eternityMin.default(n);
      var numerator = _break_eternityMin.default.sub(1, _break_eternityMin.default.pow(r_dec, n_dec));
      var denominator = _break_eternityMin.default.sub(1, r_dec);
      var n = _break_eternityMin.default.div(_break_eternityMin.default.mul(a_dec, numerator), denominator);
      return n;
    }
  }, {
    key: "calcCostNextSingle",
    value: function calcCostNextSingle() {
      return new _break_eternityMin.default(this.costBase).mul(this.costMult).mul(_break_eternityMin.default.pow(this.costGrowthRate, this.manualLevel));
    }
  }, {
    key: "calculateMaxAffordable",
    value: function calculateMaxAffordable(resource, nextPurchaseCost) {
      var S_dec = new _break_eternityMin.default(resource);
      var a_dec = nextPurchaseCost; // pass the next purchase cost directly
      var r_dec = new _break_eternityMin.default(this.costGrowthRate);
      if (!r_dec.gt(1) || !S_dec.gte(a_dec)) {
        //console.error(this.name, 'Invalid inputs:', S_dec.toString(), a_dec.toString(), r_dec.toString());
        return new _break_eternityMin.default(0);
      }
      var inner = _break_eternityMin.default.mul(S_dec, _break_eternityMin.default.sub(r_dec, 1));
      inner = _break_eternityMin.default.div(inner, a_dec);
      inner = _break_eternityMin.default.add(inner, 1);
      if (inner.lt(0)) {
        //console.error(this.name, 'Negative inner:', inner.toString());
        return new _break_eternityMin.default(0);
      }
      var n = _break_eternityMin.default.log(inner, r_dec).floor();
      if (n.gt(this.maxLevel)) {
        n = this.maxLevel.minus(this.level);
      }
      return n;
    }
  }, {
    key: "calculateCostN",
    value: function calculateCostN(n) {
      var startLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.manualLevel;
      // var nextPurchaseCost = new Decimal(this.costBase).mul(this.costMult).mul(Decimal.pow(this.costGrowthRate, startLevel));
      var nextPurchaseCost = this.calcCostNextSingle();
      return this.calcGeometricSum(nextPurchaseCost, this.costGrowthRate, n);
    }
  }, {
    key: "calculateProdN",
    value: function calculateProdN(n) {
      var startLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.level;
      if (this.featureType === "generator") {
        return this.prodBase.times(this.level.plus(1)).times(this.prodGrowthRate).times(this.prodMult).times(n);
      } else {
        var nextPurchaseProduction = new _break_eternityMin.default(this.prodBase).mul(this.prodMult).mul(_break_eternityMin.default.pow(this.prodGrowthRate, startLevel));
        return this.calcGeometricSum(nextPurchaseProduction, this.prodGrowthRate, n);
      }
    }
  }, {
    key: "updateValuesMilestone",
    value: function updateValuesMilestone() {
      this.setNextAffordableMilestoneLevel();
      if (this.nextAffordableMilestoneLevel) {
        var levelDif = this.nextAffordableMilestoneLevel.minus(this.level);
        this.costNext = this.calculateCostN(levelDif);
        this.prodNext = this.calculateProdN(levelDif);
        this.nextLevelIncrement = levelDif;
      } else {
        this.nextLevelIncrement = new _break_eternityMin.default(1);
        this.costNext = this.calculateCostN(1);
        this.prodNext = this.calculateProdN(1);
      }
    }
  }, {
    key: "updateValuesMax",
    value: function updateValuesMax(resource) {
      // var nextPurchaseCost = new Decimal(this.costBase).mul(this.costMult).mul(Decimal.pow(this.costGrowthRate, this.manualLevel));
      var nextPurchaseCost = this.calcCostNextSingle();
      if (resource.lt(nextPurchaseCost)) {
        this.nextLevelIncrement = new _break_eternityMin.default(1);
        this.costNext = nextPurchaseCost;
        this.prodNext = this.calculateProdN(1);
        this.maxAffLvl = new _break_eternityMin.default(0);
        return;
      }
      this.maxAffLvl = this.calculateMaxAffordable(resource, nextPurchaseCost);
      this.nextLevelIncrement = this.maxAffLvl;
      this.costNext = this.calculateCostN(this.maxAffLvl);
      this.prodNext = this.calculateProdN(this.maxAffLvl);
    }
  }, {
    key: "updateValuesDigit",
    value: function updateValuesDigit(n) {
      // Adjust n if it would take the level above the max
      if (n.plus(this.level).gt(this.maxLevel)) {
        n = this.maxLevel.minus(this.level);
      }
      this.costNext = this.calculateCostN(n);
      if (this.prodType) {
        this.prodNext = this.calculateProdN(n);
      }
      this.nextLevelIncrement = n;
    }
  }, {
    key: "setActive",
    value: function setActive() {
      this.active = true;
      this.visible = true;

      //this was here because skill unlocks would set connections to active, which would set their observesr to active and fuck up calc trees. now i have updateDownstreamNodes check if source level is gt(0) instead
      // if (this.level.gt(0)) {
      var _iterator69 = _createForOfIteratorHelper(this.observers),
        _step69;
      try {
        for (_iterator69.s(); !(_step69 = _iterator69.n()).done;) {
          var observer = _step69.value;
          if (!observer.specialActivatorID) {
            observer.active = true;
          } else if (observer.specialActivator === this) {
            observer.active = true;
          }
        }
        // }
      } catch (err) {
        _iterator69.e(err);
      } finally {
        _iterator69.f();
      }
    }
  }, {
    key: "setInactive",
    value: function setInactive() {
      this.active = false;
    }
  }, {
    key: "deactivateObservers",
    value: function deactivateObservers() {
      var _iterator70 = _createForOfIteratorHelper(this.observers),
        _step70;
      try {
        for (_iterator70.s(); !(_step70 = _iterator70.n()).done;) {
          var observer = _step70.value;
          if (observer.active) {
            observer.active = false;
            var _iterator71 = _createForOfIteratorHelper(observer.calcTreeReferences),
              _step71;
            try {
              for (_iterator71.s(); !(_step71 = _iterator71.n()).done;) {
                var targetTree = _step71.value;
                targetTree.buildTree();
                this.eventManager.dispatchEvent('updateFeatureValues', {
                  target: targetTree.parent,
                  isNewLvl: false
                });
                this.eventManager.dispatchEvent('updateNewMultiplierValues', {
                  feature: targetTree.parent
                });
              }
            } catch (err) {
              _iterator71.e(err);
            } finally {
              _iterator71.f();
            }
          }
        }
      } catch (err) {
        _iterator70.e(err);
      } finally {
        _iterator70.f();
      }
    }
  }, {
    key: "addLevelsAddLevelsTarget",
    value: function addLevelsAddLevelsTarget(target, calcType, calcValue) {
      this.levelsAddLevelsTargets.push({
        target: target,
        calcType: calcType,
        calcValue: calcValue,
        amountPurchased: new _break_eternityMin.default(0)
      });
      this.processLevelsAddLevelsTargets();
    }
  }, {
    key: "processLevelsAddLevelsTargets",
    value: function processLevelsAddLevelsTargets() {
      var amountToPurchase = new _break_eternityMin.default(0);
      var _iterator72 = _createForOfIteratorHelper(this.levelsAddLevelsTargets),
        _step72;
      try {
        for (_iterator72.s(); !(_step72 = _iterator72.n()).done;) {
          var target = _step72.value;
          if (target.calcType === "log") {
            amountToPurchase = this.level.log(target.calcValue);
            amountToPurchase = amountToPurchase.minus(target.amountPurchased);
            if (amountToPurchase.gt(0)) {
              target.target.levelUp("auto", amountToPurchase);
              target.amountPurchased = target.amountPurchased.plus(amountToPurchase);
            }
          }
        }
      } catch (err) {
        _iterator72.e(err);
      } finally {
        _iterator72.f();
      }
    }
  }, {
    key: "levelUp",
    value: function levelUp(auto) {
      var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      // if (this.level.gte(0)) {
      if (this.level.eq(0)) {
        // for (const observer of this.observers) {
        // 	observer.active = true;
        // }
        this.setActive();
      }
      if (auto === "manual") {
        var levelUpCount = this.nextLevelIncrement;
        if (count) {
          levelUpCount = new _break_eternityMin.default(count);
        }
        this.manualLevel = this.manualLevel.plus(levelUpCount);
        this.level = this.level.plus(levelUpCount);
        this.costNextSingle = this.calcCostNextSingle();
      } else if (auto === "auto") {
        this.autoLevel = this.autoLevel.plus(count);
        this.level = this.level.plus(count);
      }

      // this.eventManager.dispatchEvent('check-unlocks');

      this.updateObservers();
      if (this.levelsAddLevelsTargets.length > 0) {
        this.processLevelsAddLevelsTargets();
      }
      if (this.milestoneTiers && this.level.gte(this.nextMilestoneLevel)) {
        this.setNextMilestoneLevel();
      }
      if (this.featureType === "artifact" && this.level.gte(this.maxLevel)) {
        this.evolve();
      }
    }
  }, {
    key: "updateObservers",
    value: function updateObservers() {
      var _this83 = this;
      var _iterator73 = _createForOfIteratorHelper(this.observers),
        _step73;
      try {
        for (_iterator73.s(); !(_step73 = _iterator73.n()).done;) {
          var observer = _step73.value;
          if (!observer.active) continue;

          // Handle single target mods
          if (observer.source && observer.target && observer.target !== observer.source) {
            // ^ third condition is for essence upgrades to work
            observer.target.calcTreesMap.forEach(function (targetCalcTree) {
              targetCalcTree.buildTree();
              if (targetCalcTree.parent.active) {
                _this83.eventManager.dispatchEvent('updateFeatureValues', {
                  target: targetCalcTree.parent,
                  isNewLvl: false
                });

                // this.eventManager.dispatchEvent('updateNewMultiplierValues', { feature: targetCalcTree.parent });
              }
            });
          }

          // Handle Type Target Mods
          else if (observer.targetType) {
            var _iterator74 = _createForOfIteratorHelper(observer.calcTreeReferences),
              _step74;
            try {
              for (_iterator74.s(); !(_step74 = _iterator74.n()).done;) {
                var targetCalcTree = _step74.value;
                targetCalcTree.buildTree();
                if (targetCalcTree.parent.active) {
                  this.eventManager.dispatchEvent('updateFeatureValues', {
                    target: targetCalcTree.parent,
                    isNewLvl: false
                  });

                  // this.eventManager.dispatchEvent('updateNewMultiplierValues', { feature: targetCalcTree.parent });
                }
              }
            } catch (err) {
              _iterator74.e(err);
            } finally {
              _iterator74.f();
            }
          }
        }
      } catch (err) {
        _iterator73.e(err);
      } finally {
        _iterator73.f();
      }
    }
  }, {
    key: "setNextMilestoneLevel",
    value: function setNextMilestoneLevel() {
      var _this84 = this;
      // console.error(this.name);
      this.nextMilestoneLevel = this.milestoneTiers.find(function (tier) {
        return tier.gt(_this84.manualLevel);
      });
      this.nextMilestoneMult = this.calcTreesMap.get("production").nodes.find(function (t) {
        return t.ref.name === _this84.id + "milestone" + _this84.nextMilestoneLevel.toString();
      }).ref.value;
    }
  }, {
    key: "setNextAffordableMilestoneLevel",
    value: function setNextAffordableMilestoneLevel() {
      for (var i = 0; i < this.milestoneTiers.length; i++) {
        var milestone = this.milestoneTiers[i];
        if (this.manualLevel.lt(milestone)) {
          this.nextAffordableMilestoneLevel = new _break_eternityMin.default(milestone);
          return;
        }
      }
      this.nextAffordableMilestoneLevel = null;
    }
  }]);
  return GameFeature;
}(Observable);
var Generator = /*#__PURE__*/function (_GameFeature) {
  _inherits(Generator, _GameFeature);
  var _super3 = _createSuper(Generator);
  function Generator(eventManager, id, genChainID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active) {
    var _this85;
    _classCallCheck(this, Generator);
    _this85 = _super3.call(this, eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
    _this85.featureType = "generator";
    _this85.genChainID = genChainID;
    _this85.parentGenChain = null;
    _this85.timeAdjustedPurchaseAmount = new _break_eternityMin.default(0);
    _this85.milestoneTiers = [];
    _this85.evolutionTier = evolutionTier;
    _this85.evolutions = [];
    return _this85;
  }
  _createClass(Generator, [{
    key: "evolve",
    value: function evolve() {
      var _this86 = this;
      // Find the evolution object with the next evolution tier
      var nextEvolution = this.evolutions.find(function (evo) {
        return evo.evolutionTier === _this86.evolutionTier + 1;
      });
      if (nextEvolution) {
        this.evolutionTier = nextEvolution.evolutionTier;
        this.name = nextEvolution.name;
        this.description = nextEvolution.description;
        this.level = new _break_eternityMin.default(this.baseLevel);
        this.manualLevel = new _break_eternityMin.default(this.baseLevel);
        this.autoLevel = new _break_eternityMin.default(0);
        this.costBase = new _break_eternityMin.default(nextEvolution.costBase);
        this.costGrowthRate = new _break_eternityMin.default(nextEvolution.costGrowthRate);
        this.prodBase = new _break_eternityMin.default(nextEvolution.prodBase);
        this.prodGrowthRate = new _break_eternityMin.default(nextEvolution.prodGrowthRate);
        this.costNextSingle = this.calcCostNextSingle();
        this.nextMilestoneLevel = new _break_eternityMin.default(0);
        this.resetMilestoneUnlocks();
        this.resetRealmFeatureUnlocks();
        this.eventManager.dispatchEvent('updateFeatureValues', {
          target: this,
          isNewLvl: false
        });
      } else {
        console.log("Next evolution tier not found!");
      }
    }
  }, {
    key: "resetMilestoneUnlocks",
    value: function resetMilestoneUnlocks() {
      this.eventManager.dispatchEvent('reEngage-unlock', {
        detail: {
          id: this.id,
          type: "milestone"
        }
      });
    }
  }, {
    key: "resetRealmFeatureUnlocks",
    value: function resetRealmFeatureUnlocks() {
      this.eventManager.dispatchEvent('reEngage-unlock', {
        detail: {
          id: this.id,
          type: "realm-feature-unlock"
        }
      });
    }
  }]);
  return Generator;
}(GameFeature);
var GeneratorChain = /*#__PURE__*/function () {
  function GeneratorChain(eventManager, id, name, realmID, active) {
    _classCallCheck(this, GeneratorChain);
    this.eventManager = eventManager;
    this.id = id;
    this.name = name;
    this.generators = [];
    this.realmID = realmID;
    this.realm = null;
    this.active = active;
  }

  //start at top node and work down auto-buying generators
  _createClass(GeneratorChain, [{
    key: "calculateChain",
    value: function calculateChain(gameManager, deltaTime) {
      for (var i = this.generators.length - 2; i >= 0; i--) {
        var currentGen = this.generators[i];
        var nextGen = this.generators[i + 1];
        if (currentGen.active && nextGen.active && currentGen.level.gt(0)) {
          var deltaTimeAdjustedProduction = nextGen.prodCurrent.times(deltaTime);
          nextGen.timeAdjustedPurchaseAmount = nextGen.timeAdjustedPurchaseAmount.plus(deltaTimeAdjustedProduction);
          if (nextGen.timeAdjustedPurchaseAmount.floor().gte(1)) {
            currentGen.levelUp("auto", nextGen.timeAdjustedPurchaseAmount.floor());
            gameManager.updateFeatureValues(currentGen, true);
            nextGen.timeAdjustedPurchaseAmount = nextGen.timeAdjustedPurchaseAmount.minus(nextGen.timeAdjustedPurchaseAmount.floor());
          }
        }
      }
    }
  }]);
  return GeneratorChain;
}();
var Training = /*#__PURE__*/function (_GameFeature2) {
  _inherits(Training, _GameFeature2);
  var _super4 = _createSuper(Training);
  function Training(eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active) {
    var _this87;
    _classCallCheck(this, Training);
    _this87 = _super4.call(this, eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
    _this87.featureType = "training";
    _this87.realmID = realmID;
    _this87.realm = null;
    _this87.milestoneTiers = [];
    _this87.evolutionTier = evolutionTier;
    _this87.evolutions = [];
    return _this87;
  }
  _createClass(Training, [{
    key: "evolve",
    value: function evolve() {
      var _this88 = this;
      // Find the evolution object with the next evolution tier
      var nextEvolution = this.evolutions.find(function (evo) {
        return evo.evolutionTier === _this88.evolutionTier + 1;
      });
      if (nextEvolution) {
        this.evolutionTier = nextEvolution.evolutionTier;
        this.name = nextEvolution.name;
        this.description = nextEvolution.description;
        this.level = new _break_eternityMin.default(this.baseLevel);
        this.manualLevel = new _break_eternityMin.default(this.baseLevel);
        this.autoLevel = new _break_eternityMin.default(0);
        this.costBase = new _break_eternityMin.default(nextEvolution.costBase);
        this.costGrowthRate = new _break_eternityMin.default(nextEvolution.costGrowthRate);
        this.prodBase = new _break_eternityMin.default(nextEvolution.prodBase);
        this.prodGrowthRate = new _break_eternityMin.default(nextEvolution.prodGrowthRate);
        this.costNextSingle = this.calcCostNextSingle();
        this.nextMilestoneLevel = new _break_eternityMin.default(0);
        this.resetMilestoneUnlocks();
        this.resetRealmFeatureUnlocks();
        this.eventManager.dispatchEvent('updateFeatureValues', {
          target: this,
          isNewLvl: false
        });
      } else {
        console.log("Next evolution tier not found!");
      }
    }
  }, {
    key: "resetMilestoneUnlocks",
    value: function resetMilestoneUnlocks() {
      this.eventManager.dispatchEvent('reEngage-unlock', {
        detail: {
          id: this.id,
          type: "milestone"
        }
      });
    }
  }, {
    key: "resetRealmFeatureUnlocks",
    value: function resetRealmFeatureUnlocks() {
      this.eventManager.dispatchEvent('reEngage-unlock', {
        detail: {
          id: this.id,
          type: "realm-feature-unlock"
        }
      });
    }
  }]);
  return Training;
}(GameFeature);
var Upgrade = /*#__PURE__*/function (_GameFeature3) {
  _inherits(Upgrade, _GameFeature3);
  var _super5 = _createSuper(Upgrade);
  function Upgrade(eventManager, id, realmID, evolutionTier, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active) {
    var _this89;
    _classCallCheck(this, Upgrade);
    _this89 = _super5.call(this, eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
    _this89.featureType = "upgrade";
    _this89.realmID = realmID;
    _this89.evolutionTier = evolutionTier;
    _this89.evolutions = [];
    return _this89;
  }
  _createClass(Upgrade, [{
    key: "evolve",
    value: function evolve() {
      var _this90 = this;
      // Find the evolution object with the next evolution tier
      var nextEvolution = this.evolutions.find(function (evo) {
        return evo.evolutionTier === _this90.evolutionTier + 1;
      });
      if (nextEvolution) {
        this.evolutionTier = nextEvolution.evolutionTier;
        this.name = nextEvolution.name;
        this.description = nextEvolution.description;
        this.level = new _break_eternityMin.default(this.baseLevel);
        this.manualLevel = new _break_eternityMin.default(this.baseLevel);
        this.autoLevel = new _break_eternityMin.default(0);
        this.costBase = new _break_eternityMin.default(nextEvolution.costBase);
        this.costGrowthRate = new _break_eternityMin.default(nextEvolution.costGrowthRate);
        this.prodBase = new _break_eternityMin.default(nextEvolution.prodBase);
        this.prodGrowthRate = new _break_eternityMin.default(nextEvolution.prodGrowthRate);
        this.costNextSingle = this.calcCostNextSingle();
        this.eventManager.dispatchEvent('updateFeatureValues', {
          target: this,
          isNewLvl: false
        });
      } else {
        console.log("Next evolution tier not found!");
      }
    }
  }]);
  return Upgrade;
}(GameFeature);
var ForgeUpgrade = /*#__PURE__*/function (_GameFeature4) {
  _inherits(ForgeUpgrade, _GameFeature4);
  var _super6 = _createSuper(ForgeUpgrade);
  function ForgeUpgrade(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialVar1, specialVar2, specialVar3) {
    var _this91;
    _classCallCheck(this, ForgeUpgrade);
    _this91 = _super6.call(this, eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
    _this91.featureType = "forgeUpgrade";
    _this91.specialVar1 = specialVar1;
    _this91.specialVar2 = specialVar2;
    _this91.specialVar3 = specialVar3;
    return _this91;
  }
  return _createClass(ForgeUpgrade);
}(GameFeature);
var EssenceUpgrade = /*#__PURE__*/function (_GameFeature5) {
  _inherits(EssenceUpgrade, _GameFeature5);
  var _super7 = _createSuper(EssenceUpgrade);
  function EssenceUpgrade(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialTargetID, parentID, angleFromParent, distanceFromParent, isUnlockedByParent) {
    var _this92;
    _classCallCheck(this, EssenceUpgrade);
    _this92 = _super7.call(this, eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
    _this92.specialTargetID = specialTargetID;
    _this92.target = null;
    _this92.featureType = "essenceUpgrade";
    _this92.isUnlockedByParent = isUnlockedByParent;
    //graphical and connection properties
    _this92.parentID = parentID;
    _this92.parent = null;
    _this92.angleFromParent = angleFromParent; // in degrees
    _this92.distanceFromParent = distanceFromParent; // distance from parent node in pixels
    _this92.children = [];
    _this92.x;
    _this92.y;
    return _this92;
  }
  _createClass(EssenceUpgrade, [{
    key: "activateChildren",
    value: function activateChildren() {
      if (this.children.length > 0) {
        var _iterator75 = _createForOfIteratorHelper(this.children),
          _step75;
        try {
          for (_iterator75.s(); !(_step75 = _iterator75.n()).done;) {
            var child = _step75.value;
            if (child.isUnlockedByParent) {
              child.setActive();
            }
          }
        } catch (err) {
          _iterator75.e(err);
        } finally {
          _iterator75.f();
        }
      }
    }
  }]);
  return EssenceUpgrade;
}(GameFeature);
var RadianceUpgrade = /*#__PURE__*/function (_GameFeature6) {
  _inherits(RadianceUpgrade, _GameFeature6);
  var _super8 = _createSuper(RadianceUpgrade);
  function RadianceUpgrade(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, specialTargetID) {
    var _this93;
    _classCallCheck(this, RadianceUpgrade);
    _this93 = _super8.call(this, eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
    _this93.specialTargetID = specialTargetID;
    _this93.target = null;
    _this93.featureType = "radianceUpgrade";
    return _this93;
  }
  return _createClass(RadianceUpgrade);
}(GameFeature);
var Realm = /*#__PURE__*/function () {
  function Realm(eventManager, id, type, name, description, active, startingResource) {
    _classCallCheck(this, Realm);
    this.eventManager = eventManager;
    this.id = id;
    this.type = type;
    this.name = name;
    this.description = description;
    this.active = active;
    this.trainings = [];
    this.upgrades = [];
    this.generatorChains = [];
    this.evolutionTier = new _break_eternityMin.default(0);
    this.startingResource = startingResource;
  }
  _createClass(Realm, [{
    key: "setActive",
    value: function setActive() {
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
  }, {
    key: "evolve",
    value: function evolve() {
      this.evolutionTier = this.evolutionTier.plus(1);
      if (this.type === "force" || this.type === "energy") {
        var _iterator76 = _createForOfIteratorHelper(this.trainings.concat(this.upgrades)),
          _step76;
        try {
          for (_iterator76.s(); !(_step76 = _iterator76.n()).done;) {
            var feature = _step76.value;
            feature.evolve();
          }
        } catch (err) {
          _iterator76.e(err);
        } finally {
          _iterator76.f();
        }
      } else if (this.type === "wisdom" || this.type === "divine") {
        var _iterator77 = _createForOfIteratorHelper(this.generatorChains[0].generators.concat(this.upgrades)),
          _step77;
        try {
          for (_iterator77.s(); !(_step77 = _iterator77.n()).done;) {
            var _feature4 = _step77.value;
            _feature4.evolve();
          }
        } catch (err) {
          _iterator77.e(err);
        } finally {
          _iterator77.f();
        }
      }
    }
  }]);
  return Realm;
}();
var Skill = /*#__PURE__*/function (_GameFeature7) {
  _inherits(Skill, _GameFeature7);
  var _super9 = _createSuper(Skill);
  function Skill(eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, connections) {
    var _this94;
    _classCallCheck(this, Skill);
    _this94 = _super9.call(this, eventManager, id, name, description,
    // description
    level,
    // level
    maxLevel,
    // maxLevel
    costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
    _this94.featureType = "skill";
    _this94.connections = connections;
    _this94.unlockingID;
    _this94.unlockedConnections = [];
    return _this94;
  }
  _createClass(Skill, [{
    key: "refundSkill",
    value: function refundSkill() {
      this.level = new _break_eternityMin.default(0);
      this.manualLevel = new _break_eternityMin.default(0);
      this.costNextSingle = this.costBase;
      // this.active = false;

      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: this.costType,
        value: this.costBase,
        operation: 'add'
      });
      var _iterator78 = _createForOfIteratorHelper(this.unlockedConnections),
        _step78;
      try {
        for (_iterator78.s(); !(_step78 = _iterator78.n()).done;) {
          var connection = _step78.value;
          this.eventManager.dispatchEvent('reEngage-unlock', {
            detail: {
              id: connection.id
            }
          });
          connection.active = false;
        }
      } catch (err) {
        _iterator78.e(err);
      } finally {
        _iterator78.f();
      }
      this.deactivateObservers();
    }
  }]);
  return Skill;
}(GameFeature);
var SkillNode = /*#__PURE__*/_createClass(function SkillNode(skill, x, y) {
  _classCallCheck(this, SkillNode);
  this.skill = skill;
  this.x = x;
  this.y = y;
  this.connections = {
    north: null,
    east: null,
    south: null,
    west: null
  };
});
var SkillTree = /*#__PURE__*/function () {
  function SkillTree(eventManager) {
    _classCallCheck(this, SkillTree);
    this.eventManager = eventManager;
    this.skills = [];
  }
  _createClass(SkillTree, [{
    key: "refundAllSkills",
    value: function refundAllSkills() {
      var _iterator79 = _createForOfIteratorHelper(this.skills),
        _step79;
      try {
        for (_iterator79.s(); !(_step79 = _iterator79.n()).done;) {
          var skill = _step79.value;
          if (skill.level.gt(0)) {
            skill.refundSkill();
          }
        }
      } catch (err) {
        _iterator79.e(err);
      } finally {
        _iterator79.f();
      }
    }
  }]);
  return SkillTree;
}();
var Achievement = /*#__PURE__*/function (_GameFeature8) {
  _inherits(Achievement, _GameFeature8);
  var _super10 = _createSuper(Achievement);
  function Achievement(eventManager, id, name, description, unlockCategory, conditionType, dependentID, radianceReward, triggerType, triggerValue, conditionValue, setID) {
    var _this95;
    _classCallCheck(this, Achievement);
    _this95 = _super10.call(this, eventManager, id, name, description, new _break_eternityMin.default(0), new _break_eternityMin.default(1), null, null, null, null, null, null, false);
    _this95.featureType = "achievement";
    _this95.unlockCategory = unlockCategory;
    _this95.conditionType = conditionType;
    _this95.conditionValue = conditionValue;
    _this95.triggerType = triggerType;
    _this95.triggerValue = triggerValue;
    _this95.dependentID = dependentID;
    _this95.dependent = null;
    _this95.radianceReward = new _break_eternityMin.default(radianceReward);
    _this95.isClaimable = false;
    _this95.isClaimed = false;
    _this95.setID = setID;
    _this95.set = null;
    return _this95;
  }
  _createClass(Achievement, [{
    key: "setActive",
    value: function setActive() {
      this.isClaimable = true;
      _get(_getPrototypeOf(Achievement.prototype), "setActive", this).call(this);
    }
  }, {
    key: "claim",
    value: function claim() {
      this.level = this.level.plus(1);
      this.isClaimed = true;
      this.active = true;
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: 'radiance',
        value: this.radianceReward,
        operation: 'add'
      });
      this.set.checkCompletion();
      var _iterator80 = _createForOfIteratorHelper(this.observers),
        _step80;
      try {
        for (_iterator80.s(); !(_step80 = _iterator80.n()).done;) {
          var observer = _step80.value;
          observer.active = true;
        }
      } catch (err) {
        _iterator80.e(err);
      } finally {
        _iterator80.f();
      }
      this.updateObservers();
    }
  }]);
  return Achievement;
}(GameFeature);
var AchievementSet = /*#__PURE__*/function (_GameFeature9) {
  _inherits(AchievementSet, _GameFeature9);
  var _super11 = _createSuper(AchievementSet);
  function AchievementSet(eventManager, id, name, description, color, bonusType, bonusValue) {
    var _this96;
    _classCallCheck(this, AchievementSet);
    _this96 = _super11.call(this, eventManager, id, name, description, new _break_eternityMin.default(0), new _break_eternityMin.default(1), null, null, null, null, null, null, false);
    _this96.eventManager = eventManager;
    _this96.id = id;
    _this96.name = name;
    _this96.color = color;
    _this96.achievements = [];
    _this96.bonusType = bonusType;
    _this96.bonusValue = bonusValue;
    _this96.completed = false;
    return _this96;
  }
  _createClass(AchievementSet, [{
    key: "checkCompletion",
    value: function checkCompletion() {
      // check if all achievements are claimed
      if (this.achievements.every(function (a) {
        return a.isClaimed;
      })) {
        this.completed = true;
        this.applyBonus();
      }
    }
  }, {
    key: "applyBonus",
    value: function applyBonus() {
      if (this.completed) {
        if (this.bonusType !== "mod") {
          this.eventManager.dispatchEvent('updatePlayerProperty', {
            property: this.bonusType,
            value: this.bonusValue,
            operation: 'add'
          });
        } else {
          this.levelUp("manual", new _break_eternityMin.default(1));
          this.updateObservers();
        }
      }
    }
  }]);
  return AchievementSet;
}(GameFeature);
var AchievementGrid = /*#__PURE__*/_createClass(function AchievementGrid(eventManager) {
  _classCallCheck(this, AchievementGrid);
  this.eventManager = eventManager;
  this.achievements = [];
  this.achievementSets = [];
});
var WorldManager = /*#__PURE__*/function () {
  function WorldManager(eventManager) {
    _classCallCheck(this, WorldManager);
    this.eventManager = eventManager;
    this.worlds = [];
    this.isCompleted = false;
    this.isProgressed = false;
    this.autoUnlocked = false;
    this.currentWorld;
    this.currentRegion;
    this.worldsProgressed = new _break_eternityMin.default(0);
    this.regionsProgressed = new _break_eternityMin.default(0);
  }
  _createClass(WorldManager, [{
    key: "worldProgressed",
    value: function worldProgressed() {
      //check if all worlds are progressed, or set next world active
      var allWorldsProgressed = this.worlds.every(function (world) {
        return world.isProgressed;
      });
      if (allWorldsProgressed) {
        this.setProgressed();
      } else {
        var nextWorld = this.worlds.find(function (world) {
          return !world.active;
        });
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
  }, {
    key: "worldCompleted",
    value: function worldCompleted() {
      var allWorldsCompleted = this.worlds.every(function (world) {
        return world.isCompleted;
      });
      if (allWorldsCompleted) {
        this.setCompleted();
      }
    }
  }, {
    key: "regionProgressed",
    value: function regionProgressed() {
      this.regionsProgressed = this.regionsProgressed.plus(1);
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: 'maxProgressionRegion',
        value: this.regionsProgressed,
        operation: 'replaceIfGreater'
      });
    }
  }, {
    key: "setProgressed",
    value: function setProgressed() {
      this.isProgressed = true;
    }
  }, {
    key: "setCompleted",
    value: function setCompleted() {
      this.isCompleted = true;
    }
  }]);
  return WorldManager;
}();
var World = /*#__PURE__*/function () {
  function World(eventManager, worldManager, id, name, active) {
    _classCallCheck(this, World);
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
    this.regionsProgressedCount = new _break_eternityMin.default(0);
    this.zonesProgressedCount = new _break_eternityMin.default(0);
    this.worldsProgressedCount = new _break_eternityMin.default(0);
  }
  _createClass(World, [{
    key: "setCompleted",
    value: function setCompleted() {
      this.isCompleted = true;
      this.worldManager.worldCompleted();
    }
  }, {
    key: "setProgressed",
    value: function setProgressed() {
      this.isProgressed = true;
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: "lifetimeWorldProgressions",
        value: new _break_eternityMin.default(1),
        operation: 'add'
      });
      this.worldManager.worldProgressed();
    }
  }, {
    key: "setActive",
    value: function setActive() {
      this.active = true;
      this.regions[0].setActive();
      if (this.fighterTier) {
        this.fighterTier.worldSetActive();
      }
    }
  }, {
    key: "regionCompleted",
    value: function regionCompleted() {
      var allRegionsCompleted = this.regions.every(function (region) {
        return region.isCompleted;
      });
      if (allRegionsCompleted) {
        this.setCompleted();
      }
    }
  }, {
    key: "regionProgressed",
    value: function regionProgressed() {
      //check if world is progressed or set next region active
      var allRegionsProgressed = this.regions.every(function (region) {
        return region.isProgressed;
      });
      if (allRegionsProgressed) {
        this.setProgressed();
      } else {
        var nextRegion = this.regions.find(function (region) {
          return !region.active;
        });
        if (nextRegion) {
          nextRegion.setActive();
        }
      }
      this.worldManager.regionProgressed();
    }
  }]);
  return World;
}();
var Region = /*#__PURE__*/function () {
  function Region(eventManager, id, worldID, name, shardType, active) {
    _classCallCheck(this, Region);
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
  _createClass(Region, [{
    key: "setCompleted",
    value: function setCompleted() {
      this.isCompleted = true;
      this.world.regionCompleted();
    }
  }, {
    key: "setProgressed",
    value: function setProgressed() {
      this.isProgressed = true;
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: "lifetimeRegionProgressions",
        value: new _break_eternityMin.default(1),
        operation: 'add'
      });
      this.world.regionProgressed();
    }
  }, {
    key: "setActive",
    value: function setActive() {
      this.active = true;
      if (this.zones[0]) {
        this.zones[0].setActive();
      }
    }
  }, {
    key: "checkAllZonesCompleted",
    value: function checkAllZonesCompleted() {
      var allZonesDefeated = this.zones.every(function (zone) {
        return zone.isDefeated;
      });
      if (allZonesDefeated) {
        this.setCompleted();
      }
    }
  }, {
    key: "zoneCompleted",
    value: function zoneCompleted(zone) {
      if (zone.zoneType === "boss" && !this.isProgressed) {
        this.setProgressed();
      }
      if (!this.isCompleted) {
        this.checkAllZonesCompleted();
      }
    }
  }]);
  return Region;
}();
var Zone = /*#__PURE__*/function (_GameFeature10) {
  _inherits(Zone, _GameFeature10);
  var _super12 = _createSuper(Zone);
  function Zone(eventManager, id, regionID, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, baseConquestTime, active, zoneType, parentID, angleFromParent, distanceFromParent, isUnlockedByParent) {
    var _this97;
    _classCallCheck(this, Zone);
    _this97 = _super12.call(this, eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active);
    _this97.featureType = "zone";
    _this97.regionID = regionID;
    _this97.region = null;
    _this97.isDefeated = false;
    _this97.defeatCount = new _break_eternityMin.default(0);
    _this97.baseConquestTime = new _break_eternityMin.default(baseConquestTime);
    _this97.conquestTime = new _break_eternityMin.default(baseConquestTime);
    _this97.isConquesting = false;
    _this97.zoneType = zoneType;
    _this97.repeatUnlocked = false;

    //graphical and connection properties
    _this97.isUnlockedByParent = isUnlockedByParent;
    // this.node = null;
    _this97.parentID = parentID;
    _this97.parent = null;
    _this97.angleFromParent = angleFromParent; // in degrees
    _this97.distanceFromParent = distanceFromParent; // distance from parent node in pixels
    _this97.children = [];
    _this97.x;
    _this97.y;
    _this97.elements = {
      cell: null,
      button: null,
      data: null
    };
    return _this97;
  }
  _createClass(Zone, [{
    key: "setActive",
    value: function setActive() {
      this.active = true;
    }
  }, {
    key: "startConquest",
    value: function startConquest() {
      var _this98 = this;
      if (this.isConquesting) {
        return;
      }
      if (this.defeatCount.eq(0)) {
        this.eventManager.dispatchEvent('updatePlayerProperty', {
          property: this.costType,
          value: this.costNext,
          operation: 'subtract'
        });
      }
      this.isConquesting = true;
      var increment = 1 / (this.conquestTime * 1000 / 10); // This gives you the increment size every 10 ms.

      this.progress = 0;
      this.intervalId = setInterval(function () {
        _this98.progress += increment;
        if (_this98.progress >= 1) {
          _this98.progress = 0;
          clearInterval(_this98.intervalId);
          _this98.isConquesting = false;
          _this98.handleConquestComplete();
        }
        _this98.eventManager.dispatchEvent('zoneConquestProgress', {
          zoneID: _this98.id,
          progress: _this98.progress
        });
      }, 10); // Update every 10 milliseconds
    }
  }, {
    key: "stopConquest",
    value: function stopConquest() {
      this.eventManager.dispatchEvent('zoneConquestStopped', {
        zoneID: this.id
      });
      this.progress = 0;
      this.isConquesting = false;
      clearInterval(this.intervalId);
    }
  }, {
    key: "handleConquestComplete",
    value: function handleConquestComplete() {
      this.processRewards();
      if (!this.isDefeated) {
        this.isDefeated = true;
        this.activateChildren();
      }
      this.defeatCount = this.defeatCount.plus(1);
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: "lifetimeZoneCompletions",
        value: new _break_eternityMin.default(1),
        operation: 'add'
      });
      this.region.zoneCompleted(this);
      // this.eventManager.dispatchEvent('check-unlocks');
      this.eventManager.dispatchEvent('zoneConquestComplete', {
        zoneID: this.id
      });
    }
  }, {
    key: "processRewards",
    value: function processRewards() {
      if (this.defeatCount.eq(0)) {
        if (this.zoneType === "boss") {
          this.eventManager.dispatchEvent('updatePlayerProperty', {
            property: 'skillpoint',
            value: new _break_eternityMin.default(1),
            operation: 'add'
          });
        } else if (this.zoneType === "sideBoss") {}
      }
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: this.prodType,
        value: this.prodNext,
        operation: 'add'
      });
      this.prodPrevious = this.prodCurrent = this.prodNext;
    }
  }, {
    key: "activateChildren",
    value: function activateChildren() {
      if (this.children.length > 0) {
        var _iterator81 = _createForOfIteratorHelper(this.children),
          _step81;
        try {
          for (_iterator81.s(); !(_step81 = _iterator81.n()).done;) {
            var child = _step81.value;
            if (child.isUnlockedByParent) {
              child.setActive();
            }
          }
        } catch (err) {
          _iterator81.e(err);
        } finally {
          _iterator81.f();
        }
      }
    }
  }]);
  return Zone;
}(GameFeature);
var Tournament = /*#__PURE__*/function () {
  function Tournament(eventManager, id) {
    _classCallCheck(this, Tournament);
    this.eventManager = eventManager;
    this.id = id;
    this.fighterTiers = [];
    this.fighters = [];
    this.autoUnlocked = false;
    this.rank = 101;
  }
  _createClass(Tournament, [{
    key: "handleFight",
    value: function handleFight(fighterId) {
      var fighterIndex = this.fighters.findIndex(function (fighter) {
        return fighter.id === fighterId;
      });
      if (fighterIndex === -1) {
        console.error("fighter not found. no fight processed");
        return;
      }
      var fighter = this.fighters[fighterIndex];
      if (!fighter.isDefeated) {
        fighter.setDefeated();
        this.rank = this.fighters.length - (fighter.id - 901);
        this.eventManager.dispatchEvent('updatePlayerProperty', {
          property: 'maxTournamentRank',
          value: new _break_eternityMin.default(this.rank),
          operation: 'replaceIfLesser'
        });
      }

      // Check that the next fighter index is within the bounds of the fighters array
      if (fighterIndex + 1 < this.fighters.length) {
        // if next fighter is in next tier
        if (this.fighters[fighterIndex + 1].tier !== fighter.tier) {
          var tierIndex = this.fighterTiers.findIndex(function (fighterTier) {
            return fighterTier.tier === fighter.tier;
          });
          if (this.fighterTiers.length > tierIndex + 1) {
            this.fighterTiers[tierIndex].setComplete();
            this.fighterTiers[tierIndex + 1].setPrevTierComplete();
          }
        } else {
          // If the next fighter isn't active yet, activate it
          if (!this.fighters[fighterIndex + 1].active) {
            this.fighters[fighterIndex + 1].active = true;
          }
        }
      }

      // this.eventManager.dispatchEvent('check-unlocks');
    }
  }]);
  return Tournament;
}();
var FighterTier = /*#__PURE__*/function () {
  function FighterTier(eventManager, id, tier, worldID) {
    _classCallCheck(this, FighterTier);
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
  _createClass(FighterTier, [{
    key: "setComplete",
    value: function setComplete() {
      this.isCompleted = true;
      //award / improve headband
    }
  }, {
    key: "worldSetActive",
    value: function worldSetActive() {
      this.worldActive = true;
      this.checkActive();
    }
  }, {
    key: "setPrevTierComplete",
    value: function setPrevTierComplete() {
      this.prevTierComplete = true;
      this.checkActive();
    }
  }, {
    key: "checkActive",
    value: function checkActive() {
      if (this.worldActive && this.prevTierComplete) {
        this.setActive();
      }
    }
  }, {
    key: "setActive",
    value: function setActive() {
      this.visible = true;
      this.active = true;
      this.fighters[0].active = true;
      var _iterator82 = _createForOfIteratorHelper(this.fighters),
        _step82;
      try {
        for (_iterator82.s(); !(_step82 = _iterator82.n()).done;) {
          var fighter = _step82.value;
          fighter.visible = true;
        }
      } catch (err) {
        _iterator82.e(err);
      } finally {
        _iterator82.f();
      }
    }
  }]);
  return FighterTier;
}();
var Fighter = /*#__PURE__*/function (_GameFeature11) {
  _inherits(Fighter, _GameFeature11);
  var _super13 = _createSuper(Fighter);
  function Fighter(eventManager, id, name, description, tier, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, baseFightTime, active, visible) {
    var _this99;
    _classCallCheck(this, Fighter);
    _this99 = _super13.call(this, eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, visible);
    _this99.featureType = "fighter";
    _this99.tier = tier;
    _this99.fighterTier = null;
    _this99.isDefeated = false;
    _this99.defeatCount = new _break_eternityMin.default(0);
    _this99.baseFightTime = new _break_eternityMin.default(baseFightTime);
    _this99.fightTime = new _break_eternityMin.default(baseFightTime);
    _this99.isFighting = false;
    return _this99;
  }
  _createClass(Fighter, [{
    key: "setDefeated",
    value: function setDefeated() {
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
        value: new _break_eternityMin.default(1),
        operation: 'add'
      });
      this.prodPrevious = this.prodCurrent = this.prodNext;
    }
  }]);
  return Fighter;
}(GameFeature);
var Artifact = /*#__PURE__*/function (_GameFeature12) {
  _inherits(Artifact, _GameFeature12);
  var _super14 = _createSuper(Artifact);
  function Artifact(eventManager, id, name, evolutionTier, gearType, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, nextEvolveID, active, visible) {
    var _this100;
    _classCallCheck(this, Artifact);
    _this100 = _super14.call(this, eventManager, id, name, description, level, maxLevel, costType, costBase, costGrowthRate, prodType, prodBase, prodGrowthRate, active, visible);
    _this100.featureType = "artifact";
    _this100.unlocked = false;
    _this100.gearType = gearType;
    _this100.evolutionTier = evolutionTier;
    _this100.milestoneTiers = [];
    _this100.evolved = false;
    _this100.previousEvolution = null;
    _this100.nextEvolveID = nextEvolveID;
    _this100.nextEvolveRef;
    return _this100;
  }
  _createClass(Artifact, [{
    key: "evolve",
    value: function evolve() {
      if (this.nextEvolveID) {
        this.active = false;
        this.visible = false;
        this.setInactive();
        this.deactivateObservers();
        this.nextEvolveRef.setActive();
        this.evolved = true;
      }
    }
  }]);
  return Artifact;
}(GameFeature);
var RewardManager = /*#__PURE__*/function () {
  function RewardManager(eventManager, gameManager) {
    _classCallCheck(this, RewardManager);
    this.eventManager = eventManager;
    this.gameManager = gameManager;

    // Initialize last reward times to current time
    this.lastHourlyRewardTime = new Date().getTime();
    this.lastDailyRewardTime = new Date().getTime();
    this.oneHourInMilliseconds = 3600 * 1000;
    this.oneDayInMilliseconds = 24 * this.oneHourInMilliseconds;
    this.baseDailyRewardValue = new _break_eternityMin.default(100);
    this.dailyRewardValue = this.baseDailyRewardValue;
    this.dailyRewardType = "radiance";
    this.dailyRewardClaimable = false;
    this.hourlyRewardClaimable = false;
    this.baseHourlyRewardValue = new _break_eternityMin.default(10);
    this.hourlyRewardValue = this.baseHourlyRewardValue;
    this.hourlyRewardType = "radiance";
    this.currentHourlyRewardsClaimable = new _break_eternityMin.default(0);
    this.baseHourlyRewardCap = new _break_eternityMin.default(4);
    this.hourlyRewardCap = this.baseHourlyRewardCap;
  }
  _createClass(RewardManager, [{
    key: "processBoost",
    value: function processBoost() {
      console.error("boost");
    }
  }, {
    key: "checkRewards",
    value: function checkRewards() {
      var currentTime = Date.now();

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
  }, {
    key: "giveHourlyReward",
    value: function giveHourlyReward() {
      //reset time if rewards were capped
      if (this.currentHourlyRewardsClaimable.eq(this.hourlyRewardCap)) {
        this.lastHourlyRewardTime = Date.now();
      }
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: this.hourlyRewardType,
        value: this.hourlyRewardValue,
        operation: 'add'
      });
      this.currentHourlyRewardsClaimable = this.currentHourlyRewardsClaimable.minus(1);
      if (this.currentHourlyRewardsClaimable.eq(0)) {
        this.hourlyRewardClaimable = false;
      }
    }
  }, {
    key: "giveDailyReward",
    value: function giveDailyReward() {
      this.lastDailyRewardTime = Date.now();
      this.eventManager.dispatchEvent('updatePlayerProperty', {
        property: this.dailyRewardType,
        value: this.dailyRewardValue,
        operation: 'add'
      });
      this.dailyRewardClaimable = false;
    }
  }, {
    key: "checkHourlyReward",
    value: function checkHourlyReward() {
      //do not increment time if capped claimable
      if (this.currentHourlyRewardsClaimable.eq(this.hourlyRewardCap)) {
        return this.oneHourInMilliseconds;
      }
      var currentTime = Date.now();
      var timeSinceLastReward = currentTime - this.lastHourlyRewardTime;
      if (timeSinceLastReward >= this.oneHourInMilliseconds) {
        return 0; // The reward is ready to claim
      } else {
        return this.oneHourInMilliseconds - timeSinceLastReward; // Return time left until next reward
      }
    }
  }, {
    key: "checkDailyReward",
    value: function checkDailyReward() {
      //do not increment time if claimable
      if (this.dailyRewardClaimable === true) {
        return this.oneDayInMilliseconds;
      }
      var currentTime = Date.now();
      var timeSinceLastReward = currentTime - this.lastDailyRewardTime;
      if (timeSinceLastReward >= this.oneDayInMilliseconds) {
        return 0; // The reward is ready to claim
      } else {
        return this.oneDayInMilliseconds - timeSinceLastReward; // Return time left until next reward
      }
    }
  }]);
  return RewardManager;
}(); // class Benchmark {
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
var Tab = /*#__PURE__*/function () {
  function Tab(eventManager, id, name, visible, active, initialUnlockedFeatureIDs) {
    var initialUnlockedSubTabs = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var parentTab = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
    _classCallCheck(this, Tab);
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
  _createClass(Tab, [{
    key: "setActive",
    value: function setActive() {
      var _this101 = this;
      this.active = true;
      this.visible = true;
      if (this.initialUnlockedFeatureRefs) {
        var _iterator83 = _createForOfIteratorHelper(this.initialUnlockedFeatureRefs),
          _step83;
        try {
          for (_iterator83.s(); !(_step83 = _iterator83.n()).done;) {
            var feature = _step83.value;
            feature.setActive();
            feature.visible = true;
          }
        } catch (err) {
          _iterator83.e(err);
        } finally {
          _iterator83.f();
        }
      }

      //slight delay so that css properties have time to update when checking for visible tabs
      setTimeout(function () {
        _this101.eventManager.dispatchEvent('updateHotkeyButtons');
      }, 100);
    }
  }]);
  return Tab;
}();
},{"./break_eternity.min.js":"break_eternity.min.js","./assets/gameData/trainingData.json":"assets/gameData/trainingData.json","./assets/gameData/generatorData.json":"assets/gameData/generatorData.json","./assets/gameData/realmUpgradeData.json":"assets/gameData/realmUpgradeData.json","./assets/gameData/forgeUpgradeData.json":"assets/gameData/forgeUpgradeData.json","./assets/gameData/essenceUpgradeData.json":"assets/gameData/essenceUpgradeData.json","./assets/gameData/radianceUpgradeData.json":"assets/gameData/radianceUpgradeData.json","./assets/gameData/fighterData.json":"assets/gameData/fighterData.json","./assets/gameData/skillData.json":"assets/gameData/skillData.json","./assets/gameData/zoneData.json":"assets/gameData/zoneData.json","./assets/gameData/regionData.json":"assets/gameData/regionData.json","./assets/gameData/worldData.json":"assets/gameData/worldData.json","./assets/gameData/artifactData.json":"assets/gameData/artifactData.json","./assets/gameData/achievementData.json":"assets/gameData/achievementData.json","./assets/gameData/interfaceElementData.json":"assets/gameData/interfaceElementData.json","./assets/gameData/tabData.json":"assets/gameData/tabData.json","./assets/icons/info-icon.png":"assets/icons/info-icon.png"}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62762" + '/');
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
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map