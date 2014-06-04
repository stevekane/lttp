(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
(function (process,global){
(function(global) {
  'use strict';
  if (global.$traceurRuntime) {
    return;
  }
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $Object.defineProperties;
  var $defineProperty = $Object.defineProperty;
  var $freeze = $Object.freeze;
  var $getOwnPropertyDescriptor = $Object.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $Object.getOwnPropertyNames;
  var $getPrototypeOf = $Object.getPrototypeOf;
  var $hasOwnProperty = $Object.prototype.hasOwnProperty;
  var $toString = $Object.prototype.toString;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var types = {
    void: function voidType() {},
    any: function any() {},
    string: function string() {},
    number: function number() {},
    boolean: function boolean() {}
  };
  var method = nonEnum;
  var counter = 0;
  function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
  }
  var symbolInternalProperty = newUniqueString();
  var symbolDescriptionProperty = newUniqueString();
  var symbolDataProperty = newUniqueString();
  var symbolValues = $create(null);
  function isSymbol(symbol) {
    return typeof symbol === 'object' && symbol instanceof SymbolValue;
  }
  function typeOf(v) {
    if (isSymbol(v))
      return 'symbol';
    return typeof v;
  }
  function Symbol(description) {
    var value = new SymbolValue(description);
    if (!(this instanceof Symbol))
      return value;
    throw new TypeError('Symbol cannot be new\'ed');
  }
  $defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(Symbol.prototype, 'toString', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    var desc = symbolValue[symbolDescriptionProperty];
    if (desc === undefined)
      desc = '';
    return 'Symbol(' + desc + ')';
  }));
  $defineProperty(Symbol.prototype, 'valueOf', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    return symbolValue;
  }));
  function SymbolValue(description) {
    var key = newUniqueString();
    $defineProperty(this, symbolDataProperty, {value: this});
    $defineProperty(this, symbolInternalProperty, {value: key});
    $defineProperty(this, symbolDescriptionProperty, {value: description});
    $freeze(this);
    symbolValues[key] = this;
  }
  $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(SymbolValue.prototype, 'toString', {
    value: Symbol.prototype.toString,
    enumerable: false
  });
  $defineProperty(SymbolValue.prototype, 'valueOf', {
    value: Symbol.prototype.valueOf,
    enumerable: false
  });
  $freeze(SymbolValue.prototype);
  Symbol.iterator = Symbol();
  function toProperty(name) {
    if (isSymbol(name))
      return name[symbolInternalProperty];
    return name;
  }
  function getOwnPropertyNames(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      if (!symbolValues[name])
        rv.push(name);
    }
    return rv;
  }
  function getOwnPropertyDescriptor(object, name) {
    return $getOwnPropertyDescriptor(object, toProperty(name));
  }
  function getOwnPropertySymbols(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var symbol = symbolValues[names[i]];
      if (symbol)
        rv.push(symbol);
    }
    return rv;
  }
  function hasOwnProperty(name) {
    return $hasOwnProperty.call(this, toProperty(name));
  }
  function getOption(name) {
    return global.traceur && global.traceur.options[name];
  }
  function setProperty(object, name, value) {
    var sym,
        desc;
    if (isSymbol(name)) {
      sym = name;
      name = name[symbolInternalProperty];
    }
    object[name] = value;
    if (sym && (desc = $getOwnPropertyDescriptor(object, name)))
      $defineProperty(object, name, {enumerable: false});
    return value;
  }
  function defineProperty(object, name, descriptor) {
    if (isSymbol(name)) {
      if (descriptor.enumerable) {
        descriptor = $create(descriptor, {enumerable: {value: false}});
      }
      name = name[symbolInternalProperty];
    }
    $defineProperty(object, name, descriptor);
    return object;
  }
  function polyfillObject(Object) {
    $defineProperty(Object, 'defineProperty', {value: defineProperty});
    $defineProperty(Object, 'getOwnPropertyNames', {value: getOwnPropertyNames});
    $defineProperty(Object, 'getOwnPropertyDescriptor', {value: getOwnPropertyDescriptor});
    $defineProperty(Object.prototype, 'hasOwnProperty', {value: hasOwnProperty});
    Object.getOwnPropertySymbols = getOwnPropertySymbols;
    function is(left, right) {
      if (left === right)
        return left !== 0 || 1 / left === 1 / right;
      return left !== left && right !== right;
    }
    $defineProperty(Object, 'is', method(is));
    function assign(target, source) {
      var props = $getOwnPropertyNames(source);
      var p,
          length = props.length;
      for (p = 0; p < length; p++) {
        target[props[p]] = source[props[p]];
      }
      return target;
    }
    $defineProperty(Object, 'assign', method(assign));
    function mixin(target, source) {
      var props = $getOwnPropertyNames(source);
      var p,
          descriptor,
          length = props.length;
      for (p = 0; p < length; p++) {
        descriptor = $getOwnPropertyDescriptor(source, props[p]);
        $defineProperty(target, props[p], descriptor);
      }
      return target;
    }
    $defineProperty(Object, 'mixin', method(mixin));
  }
  function exportStar(object) {
    for (var i = 1; i < arguments.length; i++) {
      var names = $getOwnPropertyNames(arguments[i]);
      for (var j = 0; j < names.length; j++) {
        (function(mod, name) {
          $defineProperty(object, name, {
            get: function() {
              return mod[name];
            },
            enumerable: true
          });
        })(arguments[i], names[j]);
      }
    }
    return object;
  }
  function toObject(value) {
    if (value == null)
      throw $TypeError();
    return $Object(value);
  }
  function spread() {
    var rv = [],
        k = 0;
    for (var i = 0; i < arguments.length; i++) {
      var valueToSpread = toObject(arguments[i]);
      for (var j = 0; j < valueToSpread.length; j++) {
        rv[k++] = valueToSpread[j];
      }
    }
    return rv;
  }
  function getPropertyDescriptor(object, name) {
    while (object !== null) {
      var result = $getOwnPropertyDescriptor(object, name);
      if (result)
        return result;
      object = $getPrototypeOf(object);
    }
    return undefined;
  }
  function superDescriptor(homeObject, name) {
    var proto = $getPrototypeOf(homeObject);
    if (!proto)
      throw $TypeError('super is null');
    return getPropertyDescriptor(proto, name);
  }
  function superCall(self, homeObject, name, args) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if ('value' in descriptor)
        return descriptor.value.apply(self, args);
      if (descriptor.get)
        return descriptor.get.call(self).apply(self, args);
    }
    throw $TypeError("super has no method '" + name + "'.");
  }
  function superGet(self, homeObject, name) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if (descriptor.get)
        return descriptor.get.call(self);
      else if ('value' in descriptor)
        return descriptor.value;
    }
    return undefined;
  }
  function superSet(self, homeObject, name, value) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor && descriptor.set) {
      descriptor.set.call(self, value);
      return value;
    }
    throw $TypeError("super has no setter '" + name + "'.");
  }
  function getDescriptors(object) {
    var descriptors = {},
        name,
        names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      descriptors[name] = $getOwnPropertyDescriptor(object, name);
    }
    return descriptors;
  }
  function createClass(ctor, object, staticObject, superClass) {
    $defineProperty(object, 'constructor', {
      value: ctor,
      configurable: true,
      enumerable: false,
      writable: true
    });
    if (arguments.length > 3) {
      if (typeof superClass === 'function')
        ctor.__proto__ = superClass;
      ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
    } else {
      ctor.prototype = object;
    }
    $defineProperty(ctor, 'prototype', {
      configurable: false,
      writable: false
    });
    return $defineProperties(ctor, getDescriptors(staticObject));
  }
  function getProtoParent(superClass) {
    if (typeof superClass === 'function') {
      var prototype = superClass.prototype;
      if ($Object(prototype) === prototype || prototype === null)
        return superClass.prototype;
    }
    if (superClass === null)
      return null;
    throw new TypeError();
  }
  function defaultSuperCall(self, homeObject, args) {
    if ($getPrototypeOf(homeObject) !== null)
      superCall(self, homeObject, 'constructor', args);
  }
  var ST_NEWBORN = 0;
  var ST_EXECUTING = 1;
  var ST_SUSPENDED = 2;
  var ST_CLOSED = 3;
  var END_STATE = -2;
  var RETHROW_STATE = -3;
  function addIterator(object) {
    return defineProperty(object, Symbol.iterator, nonEnum(function() {
      return this;
    }));
  }
  function getInternalError(state) {
    return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
  }
  function GeneratorContext() {
    this.state = 0;
    this.GState = ST_NEWBORN;
    this.storedException = undefined;
    this.finallyFallThrough = undefined;
    this.sent_ = undefined;
    this.returnValue = undefined;
    this.tryStack_ = [];
  }
  GeneratorContext.prototype = {
    pushTry: function(catchState, finallyState) {
      if (finallyState !== null) {
        var finallyFallThrough = null;
        for (var i = this.tryStack_.length - 1; i >= 0; i--) {
          if (this.tryStack_[i].catch !== undefined) {
            finallyFallThrough = this.tryStack_[i].catch;
            break;
          }
        }
        if (finallyFallThrough === null)
          finallyFallThrough = RETHROW_STATE;
        this.tryStack_.push({
          finally: finallyState,
          finallyFallThrough: finallyFallThrough
        });
      }
      if (catchState !== null) {
        this.tryStack_.push({catch: catchState});
      }
    },
    popTry: function() {
      this.tryStack_.pop();
    },
    get sent() {
      this.maybeThrow();
      return this.sent_;
    },
    set sent(v) {
      this.sent_ = v;
    },
    get sentIgnoreThrow() {
      return this.sent_;
    },
    maybeThrow: function() {
      if (this.action === 'throw') {
        this.action = 'next';
        throw this.sent_;
      }
    },
    end: function() {
      switch (this.state) {
        case END_STATE:
          return this;
        case RETHROW_STATE:
          throw this.storedException;
        default:
          throw getInternalError(this.state);
      }
    }
  };
  function getNextOrThrow(ctx, moveNext, action) {
    return function(x) {
      switch (ctx.GState) {
        case ST_EXECUTING:
          throw new Error(("\"" + action + "\" on executing generator"));
        case ST_CLOSED:
          throw new Error(("\"" + action + "\" on closed generator"));
        case ST_NEWBORN:
          if (action === 'throw') {
            ctx.GState = ST_CLOSED;
            throw x;
          }
          if (x !== undefined)
            throw $TypeError('Sent value to newborn generator');
        case ST_SUSPENDED:
          ctx.GState = ST_EXECUTING;
          ctx.action = action;
          ctx.sent = x;
          var value = moveNext(ctx);
          var done = value === ctx;
          if (done)
            value = ctx.returnValue;
          ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
          return {
            value: value,
            done: done
          };
      }
    };
  }
  function generatorWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new GeneratorContext();
    return addIterator({
      next: getNextOrThrow(ctx, moveNext, 'next'),
      throw: getNextOrThrow(ctx, moveNext, 'throw')
    });
  }
  function AsyncFunctionContext() {
    GeneratorContext.call(this);
    this.err = undefined;
    var ctx = this;
    ctx.result = new Promise(function(resolve, reject) {
      ctx.resolve = resolve;
      ctx.reject = reject;
    });
  }
  AsyncFunctionContext.prototype = Object.create(GeneratorContext.prototype);
  AsyncFunctionContext.prototype.end = function() {
    switch (this.state) {
      case END_STATE:
        return;
      case RETHROW_STATE:
        this.reject(this.storedException);
      default:
        this.reject(getInternalError(this.state));
    }
  };
  function asyncWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new AsyncFunctionContext();
    ctx.createCallback = function(newState) {
      return function(value) {
        ctx.state = newState;
        ctx.value = value;
        moveNext(ctx);
      };
    };
    ctx.createErrback = function(newState) {
      return function(err) {
        ctx.state = newState;
        ctx.err = err;
        moveNext(ctx);
      };
    };
    moveNext(ctx);
    return ctx.result;
  }
  function getMoveNext(innerFunction, self) {
    return function(ctx) {
      while (true) {
        try {
          return innerFunction.call(self, ctx);
        } catch (ex) {
          ctx.storedException = ex;
          var last = ctx.tryStack_[ctx.tryStack_.length - 1];
          if (!last) {
            ctx.GState = ST_CLOSED;
            ctx.state = END_STATE;
            throw ex;
          }
          ctx.state = last.catch !== undefined ? last.catch : last.finally;
          if (last.finallyFallThrough !== undefined)
            ctx.finallyFallThrough = last.finallyFallThrough;
        }
      }
    };
  }
  function setupGlobals(global) {
    global.Symbol = Symbol;
    polyfillObject(global.Object);
  }
  setupGlobals(global);
  global.$traceurRuntime = {
    asyncWrap: asyncWrap,
    createClass: createClass,
    defaultSuperCall: defaultSuperCall,
    exportStar: exportStar,
    generatorWrap: generatorWrap,
    setProperty: setProperty,
    setupGlobals: setupGlobals,
    spread: spread,
    superCall: superCall,
    superGet: superGet,
    superSet: superSet,
    toObject: toObject,
    toProperty: toProperty,
    type: types,
    typeof: typeOf
  };
})(typeof global !== 'undefined' ? global : this);
(function() {
  function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = [];
    if (opt_scheme) {
      out.push(opt_scheme, ':');
    }
    if (opt_domain) {
      out.push('//');
      if (opt_userInfo) {
        out.push(opt_userInfo, '@');
      }
      out.push(opt_domain);
      if (opt_port) {
        out.push(':', opt_port);
      }
    }
    if (opt_path) {
      out.push(opt_path);
    }
    if (opt_queryData) {
      out.push('?', opt_queryData);
    }
    if (opt_fragment) {
      out.push('#', opt_fragment);
    }
    return out.join('');
  }
  ;
  var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
  var ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
  };
  function split(uri) {
    return (uri.match(splitRe));
  }
  function removeDotSegments(path) {
    if (path === '/')
      return '/';
    var leadingSlash = path[0] === '/' ? '/' : '';
    var trailingSlash = path.slice(-1) === '/' ? '/' : '';
    var segments = path.split('/');
    var out = [];
    var up = 0;
    for (var pos = 0; pos < segments.length; pos++) {
      var segment = segments[pos];
      switch (segment) {
        case '':
        case '.':
          break;
        case '..':
          if (out.length)
            out.pop();
          else
            up++;
          break;
        default:
          out.push(segment);
      }
    }
    if (!leadingSlash) {
      while (up-- > 0) {
        out.unshift('..');
      }
      if (out.length === 0)
        out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
  }
  function joinAndCanonicalizePath(parts) {
    var path = parts[ComponentIndex.PATH] || '';
    path = removeDotSegments(path);
    parts[ComponentIndex.PATH] = path;
    return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
  }
  function canonicalizeUrl(url) {
    var parts = split(url);
    return joinAndCanonicalizePath(parts);
  }
  function resolveUrl(base, url) {
    var parts = split(url);
    var baseParts = split(base);
    if (parts[ComponentIndex.SCHEME]) {
      return joinAndCanonicalizePath(parts);
    } else {
      parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
    }
    for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
      if (!parts[i]) {
        parts[i] = baseParts[i];
      }
    }
    if (parts[ComponentIndex.PATH][0] == '/') {
      return joinAndCanonicalizePath(parts);
    }
    var path = baseParts[ComponentIndex.PATH];
    var index = path.lastIndexOf('/');
    path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
    parts[ComponentIndex.PATH] = path;
    return joinAndCanonicalizePath(parts);
  }
  function isAbsolute(name) {
    if (!name)
      return false;
    if (name[0] === '/')
      return true;
    var parts = split(name);
    if (parts[ComponentIndex.SCHEME])
      return true;
    return false;
  }
  $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
  $traceurRuntime.isAbsolute = isAbsolute;
  $traceurRuntime.removeDotSegments = removeDotSegments;
  $traceurRuntime.resolveUrl = resolveUrl;
})();
(function(global) {
  'use strict';
  var $__2 = $traceurRuntime,
      canonicalizeUrl = $__2.canonicalizeUrl,
      resolveUrl = $__2.resolveUrl,
      isAbsolute = $__2.isAbsolute;
  var moduleInstantiators = Object.create(null);
  var baseURL;
  if (global.location && global.location.href)
    baseURL = resolveUrl(global.location.href, './');
  else
    baseURL = '';
  var UncoatedModuleEntry = function UncoatedModuleEntry(url, uncoatedModule) {
    this.url = url;
    this.value_ = uncoatedModule;
  };
  ($traceurRuntime.createClass)(UncoatedModuleEntry, {}, {});
  var UncoatedModuleInstantiator = function UncoatedModuleInstantiator(url, func) {
    $traceurRuntime.superCall(this, $UncoatedModuleInstantiator.prototype, "constructor", [url, null]);
    this.func = func;
  };
  var $UncoatedModuleInstantiator = UncoatedModuleInstantiator;
  ($traceurRuntime.createClass)(UncoatedModuleInstantiator, {getUncoatedModule: function() {
      if (this.value_)
        return this.value_;
      return this.value_ = this.func.call(global);
    }}, {}, UncoatedModuleEntry);
  function getUncoatedModuleInstantiator(name) {
    if (!name)
      return;
    var url = ModuleStore.normalize(name);
    return moduleInstantiators[url];
  }
  ;
  var moduleInstances = Object.create(null);
  var liveModuleSentinel = {};
  function Module(uncoatedModule) {
    var isLive = arguments[1];
    var coatedModule = Object.create(null);
    Object.getOwnPropertyNames(uncoatedModule).forEach((function(name) {
      var getter,
          value;
      if (isLive === liveModuleSentinel) {
        var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
        if (descr.get)
          getter = descr.get;
      }
      if (!getter) {
        value = uncoatedModule[name];
        getter = function() {
          return value;
        };
      }
      Object.defineProperty(coatedModule, name, {
        get: getter,
        enumerable: true
      });
    }));
    Object.preventExtensions(coatedModule);
    return coatedModule;
  }
  var ModuleStore = {
    normalize: function(name, refererName, refererAddress) {
      if (typeof name !== "string")
        throw new TypeError("module name must be a string, not " + typeof name);
      if (isAbsolute(name))
        return canonicalizeUrl(name);
      if (/[^\.]\/\.\.\//.test(name)) {
        throw new Error('module name embeds /../: ' + name);
      }
      if (name[0] === '.' && refererName)
        return resolveUrl(refererName, name);
      return canonicalizeUrl(name);
    },
    get: function(normalizedName) {
      var m = getUncoatedModuleInstantiator(normalizedName);
      if (!m)
        return undefined;
      var moduleInstance = moduleInstances[m.url];
      if (moduleInstance)
        return moduleInstance;
      moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
      return moduleInstances[m.url] = moduleInstance;
    },
    set: function(normalizedName, module) {
      normalizedName = String(normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, (function() {
        return module;
      }));
      moduleInstances[normalizedName] = module;
    },
    get baseURL() {
      return baseURL;
    },
    set baseURL(v) {
      baseURL = String(v);
    },
    registerModule: function(name, func) {
      var normalizedName = ModuleStore.normalize(name);
      if (moduleInstantiators[normalizedName])
        throw new Error('duplicate module named ' + normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
    },
    bundleStore: Object.create(null),
    register: function(name, deps, func) {
      if (!deps || !deps.length) {
        this.registerModule(name, func);
      } else {
        this.bundleStore[name] = {
          deps: deps,
          execute: func
        };
      }
    },
    getAnonymousModule: function(func) {
      return new Module(func.call(global), liveModuleSentinel);
    },
    getForTesting: function(name) {
      var $__0 = this;
      if (!this.testingPrefix_) {
        Object.keys(moduleInstances).some((function(key) {
          var m = /(traceur@[^\/]*\/)/.exec(key);
          if (m) {
            $__0.testingPrefix_ = m[1];
            return true;
          }
        }));
      }
      return this.get(this.testingPrefix_ + name);
    }
  };
  ModuleStore.set('@traceur/src/runtime/ModuleStore', new Module({ModuleStore: ModuleStore}));
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
  };
  $traceurRuntime.ModuleStore = ModuleStore;
  global.System = {
    register: ModuleStore.register.bind(ModuleStore),
    get: ModuleStore.get,
    set: ModuleStore.set,
    normalize: ModuleStore.normalize
  };
  $traceurRuntime.getModuleImpl = function(name) {
    var instantiator = getUncoatedModuleInstantiator(name);
    return instantiator && instantiator.getUncoatedModule();
  };
})(typeof global !== 'undefined' ? global : this);
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/utils", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/utils";
  var toObject = $traceurRuntime.toObject;
  function toUint32(x) {
    return x | 0;
  }
  return {
    get toObject() {
      return toObject;
    },
    get toUint32() {
      return toUint32;
    }
  };
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator", [], function() {
  "use strict";
  var $__4;
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator";
  var $__5 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/utils"),
      toObject = $__5.toObject,
      toUint32 = $__5.toUint32;
  var ARRAY_ITERATOR_KIND_KEYS = 1;
  var ARRAY_ITERATOR_KIND_VALUES = 2;
  var ARRAY_ITERATOR_KIND_ENTRIES = 3;
  var ArrayIterator = function ArrayIterator() {};
  ($traceurRuntime.createClass)(ArrayIterator, ($__4 = {}, Object.defineProperty($__4, "next", {
    value: function() {
      var iterator = toObject(this);
      var array = iterator.iteratorObject_;
      if (!array) {
        throw new TypeError('Object is not an ArrayIterator');
      }
      var index = iterator.arrayIteratorNextIndex_;
      var itemKind = iterator.arrayIterationKind_;
      var length = toUint32(array.length);
      if (index >= length) {
        iterator.arrayIteratorNextIndex_ = Infinity;
        return createIteratorResultObject(undefined, true);
      }
      iterator.arrayIteratorNextIndex_ = index + 1;
      if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
        return createIteratorResultObject(array[index], false);
      if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
        return createIteratorResultObject([index, array[index]], false);
      return createIteratorResultObject(index, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__4, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__4), {});
  function createArrayIterator(array, kind) {
    var object = toObject(array);
    var iterator = new ArrayIterator;
    iterator.iteratorObject_ = object;
    iterator.arrayIteratorNextIndex_ = 0;
    iterator.arrayIterationKind_ = kind;
    return iterator;
  }
  function createIteratorResultObject(value, done) {
    return {
      value: value,
      done: done
    };
  }
  function entries() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
  }
  function keys() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
  }
  function values() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
  }
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    }
  };
});
System.register("traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap";
  var $__default = function asap(callback, arg) {
    var length = queue.push([callback, arg]);
    if (length === 1) {
      scheduleFlush();
    }
  };
  var browserGlobal = (typeof window !== 'undefined') ? window : {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  function useNextTick() {
    return function() {
      process.nextTick(flush);
    };
  }
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  var queue = [];
  function flush() {
    for (var i = 0; i < queue.length; i++) {
      var tuple = queue[i];
      var callback = tuple[0],
          arg = tuple[1];
      callback(arg);
    }
    queue = [];
  }
  var scheduleFlush;
  if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else {
    scheduleFlush = useSetTimeout();
  }
  return {get default() {
      return $__default;
    }};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/Promise", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/Promise";
  var async = System.get("traceur-runtime@0.0.32/node_modules/rsvp/lib/rsvp/asap").default;
  function isPromise(x) {
    return x && typeof x === 'object' && x.status_ !== undefined;
  }
  function chain(promise) {
    var onResolve = arguments[1] !== (void 0) ? arguments[1] : (function(x) {
      return x;
    });
    var onReject = arguments[2] !== (void 0) ? arguments[2] : (function(e) {
      throw e;
    });
    var deferred = getDeferred(promise.constructor);
    switch (promise.status_) {
      case undefined:
        throw TypeError;
      case 'pending':
        promise.onResolve_.push([deferred, onResolve]);
        promise.onReject_.push([deferred, onReject]);
        break;
      case 'resolved':
        promiseReact(deferred, onResolve, promise.value_);
        break;
      case 'rejected':
        promiseReact(deferred, onReject, promise.value_);
        break;
    }
    return deferred.promise;
  }
  function getDeferred(C) {
    var result = {};
    result.promise = new C((function(resolve, reject) {
      result.resolve = resolve;
      result.reject = reject;
    }));
    return result;
  }
  var Promise = function Promise(resolver) {
    var $__6 = this;
    this.status_ = 'pending';
    this.onResolve_ = [];
    this.onReject_ = [];
    resolver((function(x) {
      promiseResolve($__6, x);
    }), (function(r) {
      promiseReject($__6, r);
    }));
  };
  ($traceurRuntime.createClass)(Promise, {
    catch: function(onReject) {
      return this.then(undefined, onReject);
    },
    then: function() {
      var onResolve = arguments[0] !== (void 0) ? arguments[0] : (function(x) {
        return x;
      });
      var onReject = arguments[1];
      var $__6 = this;
      var constructor = this.constructor;
      return chain(this, (function(x) {
        x = promiseCoerce(constructor, x);
        return x === $__6 ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
      }), onReject);
    }
  }, {
    resolve: function(x) {
      return new this((function(resolve, reject) {
        resolve(x);
      }));
    },
    reject: function(r) {
      return new this((function(resolve, reject) {
        reject(r);
      }));
    },
    cast: function(x) {
      if (x instanceof this)
        return x;
      if (isPromise(x)) {
        var result = getDeferred(this);
        chain(x, result.resolve, result.reject);
        return result.promise;
      }
      return this.resolve(x);
    },
    all: function(values) {
      var deferred = getDeferred(this);
      var count = 0;
      var resolutions = [];
      try {
        for (var i = 0; i < values.length; i++) {
          ++count;
          this.cast(values[i]).then(function(i, x) {
            resolutions[i] = x;
            if (--count === 0)
              deferred.resolve(resolutions);
          }.bind(undefined, i), (function(r) {
            if (count > 0)
              count = 0;
            deferred.reject(r);
          }));
        }
        if (count === 0)
          deferred.resolve(resolutions);
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    },
    race: function(values) {
      var deferred = getDeferred(this);
      try {
        for (var i = 0; i < values.length; i++) {
          this.cast(values[i]).then((function(x) {
            deferred.resolve(x);
          }), (function(r) {
            deferred.reject(r);
          }));
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }
  });
  function promiseResolve(promise, x) {
    promiseDone(promise, 'resolved', x, promise.onResolve_);
  }
  function promiseReject(promise, r) {
    promiseDone(promise, 'rejected', r, promise.onReject_);
  }
  function promiseDone(promise, status, value, reactions) {
    if (promise.status_ !== 'pending')
      return;
    for (var i = 0; i < reactions.length; i++) {
      promiseReact(reactions[i][0], reactions[i][1], value);
    }
    promise.status_ = status;
    promise.value_ = value;
    promise.onResolve_ = promise.onReject_ = undefined;
  }
  function promiseReact(deferred, handler, x) {
    async((function() {
      try {
        var y = handler(x);
        if (y === deferred.promise)
          throw new TypeError;
        else if (isPromise(y))
          chain(y, deferred.resolve, deferred.reject);
        else
          deferred.resolve(y);
      } catch (e) {
        deferred.reject(e);
      }
    }));
  }
  var thenableSymbol = '@@thenable';
  function promiseCoerce(constructor, x) {
    if (isPromise(x)) {
      return x;
    } else if (x && typeof x.then === 'function') {
      var p = x[thenableSymbol];
      if (p) {
        return p;
      } else {
        var deferred = getDeferred(constructor);
        x[thenableSymbol] = deferred.promise;
        try {
          x.then(deferred.resolve, deferred.reject);
        } catch (e) {
          deferred.reject(e);
        }
        return deferred.promise;
      }
    } else {
      return x;
    }
  }
  return {get Promise() {
      return Promise;
    }};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/String", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/String";
  var $toString = Object.prototype.toString;
  var $indexOf = String.prototype.indexOf;
  var $lastIndexOf = String.prototype.lastIndexOf;
  function startsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) == start;
  }
  function endsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var pos = stringLength;
    if (arguments.length > 1) {
      var position = arguments[1];
      if (position !== undefined) {
        pos = position ? Number(position) : 0;
        if (isNaN(pos)) {
          pos = 0;
        }
      }
    }
    var end = Math.min(Math.max(pos, 0), stringLength);
    var start = end - searchLength;
    if (start < 0) {
      return false;
    }
    return $lastIndexOf.call(string, searchString, start) == start;
  }
  function contains(search) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) != -1;
  }
  function repeat(count) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var n = count ? Number(count) : 0;
    if (isNaN(n)) {
      n = 0;
    }
    if (n < 0 || n == Infinity) {
      throw RangeError();
    }
    if (n == 0) {
      return '';
    }
    var result = '';
    while (n--) {
      result += string;
    }
    return result;
  }
  function codePointAt(position) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var size = string.length;
    var index = position ? Number(position) : 0;
    if (isNaN(index)) {
      index = 0;
    }
    if (index < 0 || index >= size) {
      return undefined;
    }
    var first = string.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  }
  function raw(callsite) {
    var raw = callsite.raw;
    var len = raw.length >>> 0;
    if (len === 0)
      return '';
    var s = '';
    var i = 0;
    while (true) {
      s += raw[i];
      if (i + 1 === len)
        return s;
      s += arguments[++i];
    }
  }
  function fromCodePoint() {
    var codeUnits = [];
    var floor = Math.floor;
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
    }
    return String.fromCharCode.apply(null, codeUnits);
  }
  return {
    get startsWith() {
      return startsWith;
    },
    get endsWith() {
      return endsWith;
    },
    get contains() {
      return contains;
    },
    get repeat() {
      return repeat;
    },
    get codePointAt() {
      return codePointAt;
    },
    get raw() {
      return raw;
    },
    get fromCodePoint() {
      return fromCodePoint;
    }
  };
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfills/polyfills", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfills/polyfills";
  var Promise = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/Promise").Promise;
  var $__9 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/String"),
      codePointAt = $__9.codePointAt,
      contains = $__9.contains,
      endsWith = $__9.endsWith,
      fromCodePoint = $__9.fromCodePoint,
      repeat = $__9.repeat,
      raw = $__9.raw,
      startsWith = $__9.startsWith;
  var $__9 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/ArrayIterator"),
      entries = $__9.entries,
      keys = $__9.keys,
      values = $__9.values;
  function maybeDefineMethod(object, name, value) {
    if (!(name in object)) {
      Object.defineProperty(object, name, {
        value: value,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
  }
  function maybeAddFunctions(object, functions) {
    for (var i = 0; i < functions.length; i += 2) {
      var name = functions[i];
      var value = functions[i + 1];
      maybeDefineMethod(object, name, value);
    }
  }
  function polyfillPromise(global) {
    if (!global.Promise)
      global.Promise = Promise;
  }
  function polyfillString(String) {
    maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'contains', contains, 'endsWith', endsWith, 'startsWith', startsWith, 'repeat', repeat]);
    maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
  }
  function polyfillArray(Array, Symbol) {
    maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values]);
    if (Symbol && Symbol.iterator) {
      Object.defineProperty(Array.prototype, Symbol.iterator, {
        value: values,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
  }
  function polyfill(global) {
    polyfillPromise(global);
    polyfillString(global.String);
    polyfillArray(global.Array, global.Symbol);
  }
  polyfill(this);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
    polyfill(global);
  };
  return {};
});
System.register("traceur-runtime@0.0.32/src/runtime/polyfill-import", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.32/src/runtime/polyfill-import";
  var $__11 = System.get("traceur-runtime@0.0.32/src/runtime/polyfills/polyfills");
  return {};
});
System.get("traceur-runtime@0.0.32/src/runtime/polyfill-import" + '');

}).call(this,require("FWaASH"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"FWaASH":1}],3:[function(require,module,exports){
(function (global){
module.exports = function() {
  "use strict";
  var __moduleName = "node_modules/lodash/dist/lodash";
  ;
  (function() {
    var undefined;
    var arrayPool = [],
        objectPool = [];
    var idCounter = 0;
    var keyPrefix = +new Date + '';
    var largeArraySize = 75;
    var maxPoolSize = 40;
    var whitespace = (' \t\x0B\f\xA0\ufeff' + '\n\r\u2028\u2029' + '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000');
    var reEmptyStringLeading = /\b__p \+= '';/g,
        reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
        reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reFlags = /\w*$/;
    var reFuncName = /^\s*function[ \n\r\t]+\w/;
    var reInterpolate = /<%=([\s\S]+?)%>/g;
    var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');
    var reNoMatch = /($^)/;
    var reThis = /\bthis\b/;
    var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;
    var contextProps = ['Array', 'Boolean', 'Date', 'Function', 'Math', 'Number', 'Object', 'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN', 'parseInt', 'setTimeout'];
    var templateCounter = 0;
    var argsClass = '[object Arguments]',
        arrayClass = '[object Array]',
        boolClass = '[object Boolean]',
        dateClass = '[object Date]',
        funcClass = '[object Function]',
        numberClass = '[object Number]',
        objectClass = '[object Object]',
        regexpClass = '[object RegExp]',
        stringClass = '[object String]';
    var cloneableClasses = {};
    cloneableClasses[funcClass] = false;
    cloneableClasses[argsClass] = cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] = cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;
    var debounceOptions = {
      'leading': false,
      'maxWait': 0,
      'trailing': false
    };
    var descriptor = {
      'configurable': false,
      'enumerable': false,
      'value': null,
      'writable': false
    };
    var objectTypes = {
      'boolean': false,
      'function': true,
      'object': true,
      'number': false,
      'string': false,
      'undefined': false
    };
    var stringEscapes = {
      '\\': '\\',
      "'": "'",
      '\n': 'n',
      '\r': 'r',
      '\t': 't',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };
    var root = (objectTypes[typeof window] && window) || this;
    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
    var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
    var freeGlobal = objectTypes[typeof global] && global;
    if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
      root = freeGlobal;
    }
    function baseIndexOf(array, value, fromIndex) {
      var index = (fromIndex || 0) - 1,
          length = array ? array.length : 0;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function cacheIndexOf(cache, value) {
      var type = typeof value;
      cache = cache.cache;
      if (type == 'boolean' || value == null) {
        return cache[value] ? 0 : -1;
      }
      if (type != 'number' && type != 'string') {
        type = 'object';
      }
      var key = type == 'number' ? value : keyPrefix + value;
      cache = (cache = cache[type]) && cache[key];
      return type == 'object' ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1) : (cache ? 0 : -1);
    }
    function cachePush(value) {
      var cache = this.cache,
          type = typeof value;
      if (type == 'boolean' || value == null) {
        cache[value] = true;
      } else {
        if (type != 'number' && type != 'string') {
          type = 'object';
        }
        var key = type == 'number' ? value : keyPrefix + value,
            typeCache = cache[type] || (cache[type] = {});
        if (type == 'object') {
          (typeCache[key] || (typeCache[key] = [])).push(value);
        } else {
          typeCache[key] = true;
        }
      }
    }
    function charAtCallback(value) {
      return value.charCodeAt(0);
    }
    function compareAscending(a, b) {
      var ac = a.criteria,
          bc = b.criteria,
          index = -1,
          length = ac.length;
      while (++index < length) {
        var value = ac[index],
            other = bc[index];
        if (value !== other) {
          if (value > other || typeof value == 'undefined') {
            return 1;
          }
          if (value < other || typeof other == 'undefined') {
            return -1;
          }
        }
      }
      return a.index - b.index;
    }
    function createCache(array) {
      var index = -1,
          length = array.length,
          first = array[0],
          mid = array[(length / 2) | 0],
          last = array[length - 1];
      if (first && typeof first == 'object' && mid && typeof mid == 'object' && last && typeof last == 'object') {
        return false;
      }
      var cache = getObject();
      cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;
      var result = getObject();
      result.array = array;
      result.cache = cache;
      result.push = cachePush;
      while (++index < length) {
        result.push(array[index]);
      }
      return result;
    }
    function escapeStringChar(match) {
      return '\\' + stringEscapes[match];
    }
    function getArray() {
      return arrayPool.pop() || [];
    }
    function getObject() {
      return objectPool.pop() || {
        'array': null,
        'cache': null,
        'criteria': null,
        'false': false,
        'index': 0,
        'null': false,
        'number': null,
        'object': null,
        'push': null,
        'string': null,
        'true': false,
        'undefined': false,
        'value': null
      };
    }
    function releaseArray(array) {
      array.length = 0;
      if (arrayPool.length < maxPoolSize) {
        arrayPool.push(array);
      }
    }
    function releaseObject(object) {
      var cache = object.cache;
      if (cache) {
        releaseObject(cache);
      }
      object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
      if (objectPool.length < maxPoolSize) {
        objectPool.push(object);
      }
    }
    function slice(array, start, end) {
      start || (start = 0);
      if (typeof end == 'undefined') {
        end = array ? array.length : 0;
      }
      var index = -1,
          length = end - start || 0,
          result = Array(length < 0 ? 0 : length);
      while (++index < length) {
        result[index] = array[start + index];
      }
      return result;
    }
    function runInContext(context) {
      context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
      var Array = context.Array,
          Boolean = context.Boolean,
          Date = context.Date,
          Function = context.Function,
          Math = context.Math,
          Number = context.Number,
          Object = context.Object,
          RegExp = context.RegExp,
          String = context.String,
          TypeError = context.TypeError;
      var arrayRef = [];
      var objectProto = Object.prototype;
      var oldDash = context._;
      var toString = objectProto.toString;
      var reNative = RegExp('^' + String(toString).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/toString| for [^\]]+/g, '.*?') + '$');
      var ceil = Math.ceil,
          clearTimeout = context.clearTimeout,
          floor = Math.floor,
          fnToString = Function.prototype.toString,
          getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
          hasOwnProperty = objectProto.hasOwnProperty,
          push = arrayRef.push,
          setTimeout = context.setTimeout,
          splice = arrayRef.splice,
          unshift = arrayRef.unshift;
      var defineProperty = (function() {
        try {
          var o = {},
              func = isNative(func = Object.defineProperty) && func,
              result = func(o, o, o) && func;
        } catch (e) {}
        return result;
      }());
      var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
          nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
          nativeIsFinite = context.isFinite,
          nativeIsNaN = context.isNaN,
          nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
          nativeMax = Math.max,
          nativeMin = Math.min,
          nativeParseInt = context.parseInt,
          nativeRandom = Math.random;
      var ctorByClass = {};
      ctorByClass[arrayClass] = Array;
      ctorByClass[boolClass] = Boolean;
      ctorByClass[dateClass] = Date;
      ctorByClass[funcClass] = Function;
      ctorByClass[objectClass] = Object;
      ctorByClass[numberClass] = Number;
      ctorByClass[regexpClass] = RegExp;
      ctorByClass[stringClass] = String;
      function lodash(value) {
        return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__')) ? value : new lodashWrapper(value);
      }
      function lodashWrapper(value, chainAll) {
        this.__chain__ = !!chainAll;
        this.__wrapped__ = value;
      }
      lodashWrapper.prototype = lodash.prototype;
      var support = lodash.support = {};
      support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);
      support.funcNames = typeof Function.name == 'string';
      lodash.templateSettings = {
        'escape': /<%-([\s\S]+?)%>/g,
        'evaluate': /<%([\s\S]+?)%>/g,
        'interpolate': reInterpolate,
        'variable': '',
        'imports': {'_': lodash}
      };
      function baseBind(bindData) {
        var func = bindData[0],
            partialArgs = bindData[2],
            thisArg = bindData[4];
        function bound() {
          if (partialArgs) {
            var args = slice(partialArgs);
            push.apply(args, arguments);
          }
          if (this instanceof bound) {
            var thisBinding = baseCreate(func.prototype),
                result = func.apply(thisBinding, args || arguments);
            return isObject(result) ? result : thisBinding;
          }
          return func.apply(thisArg, args || arguments);
        }
        setBindData(bound, bindData);
        return bound;
      }
      function baseClone(value, isDeep, callback, stackA, stackB) {
        if (callback) {
          var result = callback(value);
          if (typeof result != 'undefined') {
            return result;
          }
        }
        var isObj = isObject(value);
        if (isObj) {
          var className = toString.call(value);
          if (!cloneableClasses[className]) {
            return value;
          }
          var ctor = ctorByClass[className];
          switch (className) {
            case boolClass:
            case dateClass:
              return new ctor(+value);
            case numberClass:
            case stringClass:
              return new ctor(value);
            case regexpClass:
              result = ctor(value.source, reFlags.exec(value));
              result.lastIndex = value.lastIndex;
              return result;
          }
        } else {
          return value;
        }
        var isArr = isArray(value);
        if (isDeep) {
          var initedStack = !stackA;
          stackA || (stackA = getArray());
          stackB || (stackB = getArray());
          var length = stackA.length;
          while (length--) {
            if (stackA[length] == value) {
              return stackB[length];
            }
          }
          result = isArr ? ctor(value.length) : {};
        } else {
          result = isArr ? slice(value) : assign({}, value);
        }
        if (isArr) {
          if (hasOwnProperty.call(value, 'index')) {
            result.index = value.index;
          }
          if (hasOwnProperty.call(value, 'input')) {
            result.input = value.input;
          }
        }
        if (!isDeep) {
          return result;
        }
        stackA.push(value);
        stackB.push(result);
        (isArr ? forEach : forOwn)(value, function(objValue, key) {
          result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
        });
        if (initedStack) {
          releaseArray(stackA);
          releaseArray(stackB);
        }
        return result;
      }
      function baseCreate(prototype, properties) {
        return isObject(prototype) ? nativeCreate(prototype) : {};
      }
      if (!nativeCreate) {
        baseCreate = (function() {
          function Object() {}
          return function(prototype) {
            if (isObject(prototype)) {
              Object.prototype = prototype;
              var result = new Object;
              Object.prototype = null;
            }
            return result || context.Object();
          };
        }());
      }
      function baseCreateCallback(func, thisArg, argCount) {
        if (typeof func != 'function') {
          return identity;
        }
        if (typeof thisArg == 'undefined' || !('prototype' in func)) {
          return func;
        }
        var bindData = func.__bindData__;
        if (typeof bindData == 'undefined') {
          if (support.funcNames) {
            bindData = !func.name;
          }
          bindData = bindData || !support.funcDecomp;
          if (!bindData) {
            var source = fnToString.call(func);
            if (!support.funcNames) {
              bindData = !reFuncName.test(source);
            }
            if (!bindData) {
              bindData = reThis.test(source);
              setBindData(func, bindData);
            }
          }
        }
        if (bindData === false || (bindData !== true && bindData[1] & 1)) {
          return func;
        }
        switch (argCount) {
          case 1:
            return function(value) {
              return func.call(thisArg, value);
            };
          case 2:
            return function(a, b) {
              return func.call(thisArg, a, b);
            };
          case 3:
            return function(value, index, collection) {
              return func.call(thisArg, value, index, collection);
            };
          case 4:
            return function(accumulator, value, index, collection) {
              return func.call(thisArg, accumulator, value, index, collection);
            };
        }
        return bind(func, thisArg);
      }
      function baseCreateWrapper(bindData) {
        var func = bindData[0],
            bitmask = bindData[1],
            partialArgs = bindData[2],
            partialRightArgs = bindData[3],
            thisArg = bindData[4],
            arity = bindData[5];
        var isBind = bitmask & 1,
            isBindKey = bitmask & 2,
            isCurry = bitmask & 4,
            isCurryBound = bitmask & 8,
            key = func;
        function bound() {
          var thisBinding = isBind ? thisArg : this;
          if (partialArgs) {
            var args = slice(partialArgs);
            push.apply(args, arguments);
          }
          if (partialRightArgs || isCurry) {
            args || (args = slice(arguments));
            if (partialRightArgs) {
              push.apply(args, partialRightArgs);
            }
            if (isCurry && args.length < arity) {
              bitmask |= 16 & ~32;
              return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
            }
          }
          args || (args = arguments);
          if (isBindKey) {
            func = thisBinding[key];
          }
          if (this instanceof bound) {
            thisBinding = baseCreate(func.prototype);
            var result = func.apply(thisBinding, args);
            return isObject(result) ? result : thisBinding;
          }
          return func.apply(thisBinding, args);
        }
        setBindData(bound, bindData);
        return bound;
      }
      function baseDifference(array, values) {
        var index = -1,
            indexOf = getIndexOf(),
            length = array ? array.length : 0,
            isLarge = length >= largeArraySize && indexOf === baseIndexOf,
            result = [];
        if (isLarge) {
          var cache = createCache(values);
          if (cache) {
            indexOf = cacheIndexOf;
            values = cache;
          } else {
            isLarge = false;
          }
        }
        while (++index < length) {
          var value = array[index];
          if (indexOf(values, value) < 0) {
            result.push(value);
          }
        }
        if (isLarge) {
          releaseObject(values);
        }
        return result;
      }
      function baseFlatten(array, isShallow, isStrict, fromIndex) {
        var index = (fromIndex || 0) - 1,
            length = array ? array.length : 0,
            result = [];
        while (++index < length) {
          var value = array[index];
          if (value && typeof value == 'object' && typeof value.length == 'number' && (isArray(value) || isArguments(value))) {
            if (!isShallow) {
              value = baseFlatten(value, isShallow, isStrict);
            }
            var valIndex = -1,
                valLength = value.length,
                resIndex = result.length;
            result.length += valLength;
            while (++valIndex < valLength) {
              result[resIndex++] = value[valIndex];
            }
          } else if (!isStrict) {
            result.push(value);
          }
        }
        return result;
      }
      function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
        if (callback) {
          var result = callback(a, b);
          if (typeof result != 'undefined') {
            return !!result;
          }
        }
        if (a === b) {
          return a !== 0 || (1 / a == 1 / b);
        }
        var type = typeof a,
            otherType = typeof b;
        if (a === a && !(a && objectTypes[type]) && !(b && objectTypes[otherType])) {
          return false;
        }
        if (a == null || b == null) {
          return a === b;
        }
        var className = toString.call(a),
            otherClass = toString.call(b);
        if (className == argsClass) {
          className = objectClass;
        }
        if (otherClass == argsClass) {
          otherClass = objectClass;
        }
        if (className != otherClass) {
          return false;
        }
        switch (className) {
          case boolClass:
          case dateClass:
            return +a == +b;
          case numberClass:
            return (a != +a) ? b != +b : (a == 0 ? (1 / a == 1 / b) : a == +b);
          case regexpClass:
          case stringClass:
            return a == String(b);
        }
        var isArr = className == arrayClass;
        if (!isArr) {
          var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
              bWrapped = hasOwnProperty.call(b, '__wrapped__');
          if (aWrapped || bWrapped) {
            return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
          }
          if (className != objectClass) {
            return false;
          }
          var ctorA = a.constructor,
              ctorB = b.constructor;
          if (ctorA != ctorB && !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) && ('constructor' in a && 'constructor' in b)) {
            return false;
          }
        }
        var initedStack = !stackA;
        stackA || (stackA = getArray());
        stackB || (stackB = getArray());
        var length = stackA.length;
        while (length--) {
          if (stackA[length] == a) {
            return stackB[length] == b;
          }
        }
        var size = 0;
        result = true;
        stackA.push(a);
        stackB.push(b);
        if (isArr) {
          length = a.length;
          size = b.length;
          result = size == length;
          if (result || isWhere) {
            while (size--) {
              var index = length,
                  value = b[size];
              if (isWhere) {
                while (index--) {
                  if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                    break;
                  }
                }
              } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
                break;
              }
            }
          }
        } else {
          forIn(b, function(value, key, b) {
            if (hasOwnProperty.call(b, key)) {
              size++;
              return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
            }
          });
          if (result && !isWhere) {
            forIn(a, function(value, key, a) {
              if (hasOwnProperty.call(a, key)) {
                return (result = --size > -1);
              }
            });
          }
        }
        stackA.pop();
        stackB.pop();
        if (initedStack) {
          releaseArray(stackA);
          releaseArray(stackB);
        }
        return result;
      }
      function baseMerge(object, source, callback, stackA, stackB) {
        (isArray(source) ? forEach : forOwn)(source, function(source, key) {
          var found,
              isArr,
              result = source,
              value = object[key];
          if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
            var stackLength = stackA.length;
            while (stackLength--) {
              if ((found = stackA[stackLength] == source)) {
                value = stackB[stackLength];
                break;
              }
            }
            if (!found) {
              var isShallow;
              if (callback) {
                result = callback(value, source);
                if ((isShallow = typeof result != 'undefined')) {
                  value = result;
                }
              }
              if (!isShallow) {
                value = isArr ? (isArray(value) ? value : []) : (isPlainObject(value) ? value : {});
              }
              stackA.push(source);
              stackB.push(value);
              if (!isShallow) {
                baseMerge(value, source, callback, stackA, stackB);
              }
            }
          } else {
            if (callback) {
              result = callback(value, source);
              if (typeof result == 'undefined') {
                result = source;
              }
            }
            if (typeof result != 'undefined') {
              value = result;
            }
          }
          object[key] = value;
        });
      }
      function baseRandom(min, max) {
        return min + floor(nativeRandom() * (max - min + 1));
      }
      function baseUniq(array, isSorted, callback) {
        var index = -1,
            indexOf = getIndexOf(),
            length = array ? array.length : 0,
            result = [];
        var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
            seen = (callback || isLarge) ? getArray() : result;
        if (isLarge) {
          var cache = createCache(seen);
          indexOf = cacheIndexOf;
          seen = cache;
        }
        while (++index < length) {
          var value = array[index],
              computed = callback ? callback(value, index, array) : value;
          if (isSorted ? !index || seen[seen.length - 1] !== computed : indexOf(seen, computed) < 0) {
            if (callback || isLarge) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
        if (isLarge) {
          releaseArray(seen.array);
          releaseObject(seen);
        } else if (callback) {
          releaseArray(seen);
        }
        return result;
      }
      function createAggregator(setter) {
        return function(collection, callback, thisArg) {
          var result = {};
          callback = lodash.createCallback(callback, thisArg, 3);
          var index = -1,
              length = collection ? collection.length : 0;
          if (typeof length == 'number') {
            while (++index < length) {
              var value = collection[index];
              setter(result, value, callback(value, index, collection), collection);
            }
          } else {
            forOwn(collection, function(value, key, collection) {
              setter(result, value, callback(value, key, collection), collection);
            });
          }
          return result;
        };
      }
      function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
        var isBind = bitmask & 1,
            isBindKey = bitmask & 2,
            isCurry = bitmask & 4,
            isCurryBound = bitmask & 8,
            isPartial = bitmask & 16,
            isPartialRight = bitmask & 32;
        if (!isBindKey && !isFunction(func)) {
          throw new TypeError;
        }
        if (isPartial && !partialArgs.length) {
          bitmask &= ~16;
          isPartial = partialArgs = false;
        }
        if (isPartialRight && !partialRightArgs.length) {
          bitmask &= ~32;
          isPartialRight = partialRightArgs = false;
        }
        var bindData = func && func.__bindData__;
        if (bindData && bindData !== true) {
          bindData = slice(bindData);
          if (bindData[2]) {
            bindData[2] = slice(bindData[2]);
          }
          if (bindData[3]) {
            bindData[3] = slice(bindData[3]);
          }
          if (isBind && !(bindData[1] & 1)) {
            bindData[4] = thisArg;
          }
          if (!isBind && bindData[1] & 1) {
            bitmask |= 8;
          }
          if (isCurry && !(bindData[1] & 4)) {
            bindData[5] = arity;
          }
          if (isPartial) {
            push.apply(bindData[2] || (bindData[2] = []), partialArgs);
          }
          if (isPartialRight) {
            unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
          }
          bindData[1] |= bitmask;
          return createWrapper.apply(null, bindData);
        }
        var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
        return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
      }
      function escapeHtmlChar(match) {
        return htmlEscapes[match];
      }
      function getIndexOf() {
        var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
        return result;
      }
      function isNative(value) {
        return typeof value == 'function' && reNative.test(value);
      }
      var setBindData = !defineProperty ? noop : function(func, value) {
        descriptor.value = value;
        defineProperty(func, '__bindData__', descriptor);
      };
      function shimIsPlainObject(value) {
        var ctor,
            result;
        if (!(value && toString.call(value) == objectClass) || (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
          return false;
        }
        forIn(value, function(value, key) {
          result = key;
        });
        return typeof result == 'undefined' || hasOwnProperty.call(value, result);
      }
      function unescapeHtmlChar(match) {
        return htmlUnescapes[match];
      }
      function isArguments(value) {
        return value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == argsClass || false;
      }
      var isArray = nativeIsArray || function(value) {
        return value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == arrayClass || false;
      };
      var shimKeys = function(object) {
        var index,
            iterable = object,
            result = [];
        if (!iterable)
          return result;
        if (!(objectTypes[typeof object]))
          return result;
        for (index in iterable) {
          if (hasOwnProperty.call(iterable, index)) {
            result.push(index);
          }
        }
        return result;
      };
      var keys = !nativeKeys ? shimKeys : function(object) {
        if (!isObject(object)) {
          return [];
        }
        return nativeKeys(object);
      };
      var htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      var htmlUnescapes = invert(htmlEscapes);
      var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
          reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');
      var assign = function(object, source, guard) {
        var index,
            iterable = object,
            result = iterable;
        if (!iterable)
          return result;
        var args = arguments,
            argsIndex = 0,
            argsLength = typeof guard == 'number' ? 2 : args.length;
        if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
          var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
        } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
          callback = args[--argsLength];
        }
        while (++argsIndex < argsLength) {
          iterable = args[argsIndex];
          if (iterable && objectTypes[typeof iterable]) {
            var ownIndex = -1,
                ownProps = objectTypes[typeof iterable] && keys(iterable),
                length = ownProps ? ownProps.length : 0;
            while (++ownIndex < length) {
              index = ownProps[ownIndex];
              result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
            }
          }
        }
        return result;
      };
      function clone(value, isDeep, callback, thisArg) {
        if (typeof isDeep != 'boolean' && isDeep != null) {
          thisArg = callback;
          callback = isDeep;
          isDeep = false;
        }
        return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
      }
      function cloneDeep(value, callback, thisArg) {
        return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
      }
      function create(prototype, properties) {
        var result = baseCreate(prototype);
        return properties ? assign(result, properties) : result;
      }
      var defaults = function(object, source, guard) {
        var index,
            iterable = object,
            result = iterable;
        if (!iterable)
          return result;
        var args = arguments,
            argsIndex = 0,
            argsLength = typeof guard == 'number' ? 2 : args.length;
        while (++argsIndex < argsLength) {
          iterable = args[argsIndex];
          if (iterable && objectTypes[typeof iterable]) {
            var ownIndex = -1,
                ownProps = objectTypes[typeof iterable] && keys(iterable),
                length = ownProps ? ownProps.length : 0;
            while (++ownIndex < length) {
              index = ownProps[ownIndex];
              if (typeof result[index] == 'undefined')
                result[index] = iterable[index];
            }
          }
        }
        return result;
      };
      function findKey(object, callback, thisArg) {
        var result;
        callback = lodash.createCallback(callback, thisArg, 3);
        forOwn(object, function(value, key, object) {
          if (callback(value, key, object)) {
            result = key;
            return false;
          }
        });
        return result;
      }
      function findLastKey(object, callback, thisArg) {
        var result;
        callback = lodash.createCallback(callback, thisArg, 3);
        forOwnRight(object, function(value, key, object) {
          if (callback(value, key, object)) {
            result = key;
            return false;
          }
        });
        return result;
      }
      var forIn = function(collection, callback, thisArg) {
        var index,
            iterable = collection,
            result = iterable;
        if (!iterable)
          return result;
        if (!objectTypes[typeof iterable])
          return result;
        callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        for (index in iterable) {
          if (callback(iterable[index], index, collection) === false)
            return result;
        }
        return result;
      };
      function forInRight(object, callback, thisArg) {
        var pairs = [];
        forIn(object, function(value, key) {
          pairs.push(key, value);
        });
        var length = pairs.length;
        callback = baseCreateCallback(callback, thisArg, 3);
        while (length--) {
          if (callback(pairs[length--], pairs[length], object) === false) {
            break;
          }
        }
        return object;
      }
      var forOwn = function(collection, callback, thisArg) {
        var index,
            iterable = collection,
            result = iterable;
        if (!iterable)
          return result;
        if (!objectTypes[typeof iterable])
          return result;
        callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;
        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (callback(iterable[index], index, collection) === false)
            return result;
        }
        return result;
      };
      function forOwnRight(object, callback, thisArg) {
        var props = keys(object),
            length = props.length;
        callback = baseCreateCallback(callback, thisArg, 3);
        while (length--) {
          var key = props[length];
          if (callback(object[key], key, object) === false) {
            break;
          }
        }
        return object;
      }
      function functions(object) {
        var result = [];
        forIn(object, function(value, key) {
          if (isFunction(value)) {
            result.push(key);
          }
        });
        return result.sort();
      }
      function has(object, key) {
        return object ? hasOwnProperty.call(object, key) : false;
      }
      function invert(object) {
        var index = -1,
            props = keys(object),
            length = props.length,
            result = {};
        while (++index < length) {
          var key = props[index];
          result[object[key]] = key;
        }
        return result;
      }
      function isBoolean(value) {
        return value === true || value === false || value && typeof value == 'object' && toString.call(value) == boolClass || false;
      }
      function isDate(value) {
        return value && typeof value == 'object' && toString.call(value) == dateClass || false;
      }
      function isElement(value) {
        return value && value.nodeType === 1 || false;
      }
      function isEmpty(value) {
        var result = true;
        if (!value) {
          return result;
        }
        var className = toString.call(value),
            length = value.length;
        if ((className == arrayClass || className == stringClass || className == argsClass) || (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
          return !length;
        }
        forOwn(value, function() {
          return (result = false);
        });
        return result;
      }
      function isEqual(a, b, callback, thisArg) {
        return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
      }
      function isFinite(value) {
        return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
      }
      function isFunction(value) {
        return typeof value == 'function';
      }
      function isObject(value) {
        return !!(value && objectTypes[typeof value]);
      }
      function isNaN(value) {
        return isNumber(value) && value != +value;
      }
      function isNull(value) {
        return value === null;
      }
      function isNumber(value) {
        return typeof value == 'number' || value && typeof value == 'object' && toString.call(value) == numberClass || false;
      }
      var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
        if (!(value && toString.call(value) == objectClass)) {
          return false;
        }
        var valueOf = value.valueOf,
            objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
        return objProto ? (value == objProto || getPrototypeOf(value) == objProto) : shimIsPlainObject(value);
      };
      function isRegExp(value) {
        return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
      }
      function isString(value) {
        return typeof value == 'string' || value && typeof value == 'object' && toString.call(value) == stringClass || false;
      }
      function isUndefined(value) {
        return typeof value == 'undefined';
      }
      function mapValues(object, callback, thisArg) {
        var result = {};
        callback = lodash.createCallback(callback, thisArg, 3);
        forOwn(object, function(value, key, object) {
          result[key] = callback(value, key, object);
        });
        return result;
      }
      function merge(object) {
        var args = arguments,
            length = 2;
        if (!isObject(object)) {
          return object;
        }
        if (typeof args[2] != 'number') {
          length = args.length;
        }
        if (length > 3 && typeof args[length - 2] == 'function') {
          var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
        } else if (length > 2 && typeof args[length - 1] == 'function') {
          callback = args[--length];
        }
        var sources = slice(arguments, 1, length),
            index = -1,
            stackA = getArray(),
            stackB = getArray();
        while (++index < length) {
          baseMerge(object, sources[index], callback, stackA, stackB);
        }
        releaseArray(stackA);
        releaseArray(stackB);
        return object;
      }
      function omit(object, callback, thisArg) {
        var result = {};
        if (typeof callback != 'function') {
          var props = [];
          forIn(object, function(value, key) {
            props.push(key);
          });
          props = baseDifference(props, baseFlatten(arguments, true, false, 1));
          var index = -1,
              length = props.length;
          while (++index < length) {
            var key = props[index];
            result[key] = object[key];
          }
        } else {
          callback = lodash.createCallback(callback, thisArg, 3);
          forIn(object, function(value, key, object) {
            if (!callback(value, key, object)) {
              result[key] = value;
            }
          });
        }
        return result;
      }
      function pairs(object) {
        var index = -1,
            props = keys(object),
            length = props.length,
            result = Array(length);
        while (++index < length) {
          var key = props[index];
          result[index] = [key, object[key]];
        }
        return result;
      }
      function pick(object, callback, thisArg) {
        var result = {};
        if (typeof callback != 'function') {
          var index = -1,
              props = baseFlatten(arguments, true, false, 1),
              length = isObject(object) ? props.length : 0;
          while (++index < length) {
            var key = props[index];
            if (key in object) {
              result[key] = object[key];
            }
          }
        } else {
          callback = lodash.createCallback(callback, thisArg, 3);
          forIn(object, function(value, key, object) {
            if (callback(value, key, object)) {
              result[key] = value;
            }
          });
        }
        return result;
      }
      function transform(object, callback, accumulator, thisArg) {
        var isArr = isArray(object);
        if (accumulator == null) {
          if (isArr) {
            accumulator = [];
          } else {
            var ctor = object && object.constructor,
                proto = ctor && ctor.prototype;
            accumulator = baseCreate(proto);
          }
        }
        if (callback) {
          callback = lodash.createCallback(callback, thisArg, 4);
          (isArr ? forEach : forOwn)(object, function(value, index, object) {
            return callback(accumulator, value, index, object);
          });
        }
        return accumulator;
      }
      function values(object) {
        var index = -1,
            props = keys(object),
            length = props.length,
            result = Array(length);
        while (++index < length) {
          result[index] = object[props[index]];
        }
        return result;
      }
      function at(collection) {
        var args = arguments,
            index = -1,
            props = baseFlatten(args, true, false, 1),
            length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
            result = Array(length);
        while (++index < length) {
          result[index] = collection[props[index]];
        }
        return result;
      }
      function contains(collection, target, fromIndex) {
        var index = -1,
            indexOf = getIndexOf(),
            length = collection ? collection.length : 0,
            result = false;
        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
        if (isArray(collection)) {
          result = indexOf(collection, target, fromIndex) > -1;
        } else if (typeof length == 'number') {
          result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
        } else {
          forOwn(collection, function(value) {
            if (++index >= fromIndex) {
              return !(result = value === target);
            }
          });
        }
        return result;
      }
      var countBy = createAggregator(function(result, value, key) {
        (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
      });
      function every(collection, callback, thisArg) {
        var result = true;
        callback = lodash.createCallback(callback, thisArg, 3);
        var index = -1,
            length = collection ? collection.length : 0;
        if (typeof length == 'number') {
          while (++index < length) {
            if (!(result = !!callback(collection[index], index, collection))) {
              break;
            }
          }
        } else {
          forOwn(collection, function(value, index, collection) {
            return (result = !!callback(value, index, collection));
          });
        }
        return result;
      }
      function filter(collection, callback, thisArg) {
        var result = [];
        callback = lodash.createCallback(callback, thisArg, 3);
        var index = -1,
            length = collection ? collection.length : 0;
        if (typeof length == 'number') {
          while (++index < length) {
            var value = collection[index];
            if (callback(value, index, collection)) {
              result.push(value);
            }
          }
        } else {
          forOwn(collection, function(value, index, collection) {
            if (callback(value, index, collection)) {
              result.push(value);
            }
          });
        }
        return result;
      }
      function find(collection, callback, thisArg) {
        callback = lodash.createCallback(callback, thisArg, 3);
        var index = -1,
            length = collection ? collection.length : 0;
        if (typeof length == 'number') {
          while (++index < length) {
            var value = collection[index];
            if (callback(value, index, collection)) {
              return value;
            }
          }
        } else {
          var result;
          forOwn(collection, function(value, index, collection) {
            if (callback(value, index, collection)) {
              result = value;
              return false;
            }
          });
          return result;
        }
      }
      function findLast(collection, callback, thisArg) {
        var result;
        callback = lodash.createCallback(callback, thisArg, 3);
        forEachRight(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result = value;
            return false;
          }
        });
        return result;
      }
      function forEach(collection, callback, thisArg) {
        var index = -1,
            length = collection ? collection.length : 0;
        callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        if (typeof length == 'number') {
          while (++index < length) {
            if (callback(collection[index], index, collection) === false) {
              break;
            }
          }
        } else {
          forOwn(collection, callback);
        }
        return collection;
      }
      function forEachRight(collection, callback, thisArg) {
        var length = collection ? collection.length : 0;
        callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        if (typeof length == 'number') {
          while (length--) {
            if (callback(collection[length], length, collection) === false) {
              break;
            }
          }
        } else {
          var props = keys(collection);
          length = props.length;
          forOwn(collection, function(value, key, collection) {
            key = props ? props[--length] : --length;
            return callback(collection[key], key, collection);
          });
        }
        return collection;
      }
      var groupBy = createAggregator(function(result, value, key) {
        (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
      });
      var indexBy = createAggregator(function(result, value, key) {
        result[key] = value;
      });
      function invoke(collection, methodName) {
        var args = slice(arguments, 2),
            index = -1,
            isFunc = typeof methodName == 'function',
            length = collection ? collection.length : 0,
            result = Array(typeof length == 'number' ? length : 0);
        forEach(collection, function(value) {
          result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
        });
        return result;
      }
      function map(collection, callback, thisArg) {
        var index = -1,
            length = collection ? collection.length : 0;
        callback = lodash.createCallback(callback, thisArg, 3);
        if (typeof length == 'number') {
          var result = Array(length);
          while (++index < length) {
            result[index] = callback(collection[index], index, collection);
          }
        } else {
          result = [];
          forOwn(collection, function(value, key, collection) {
            result[++index] = callback(value, key, collection);
          });
        }
        return result;
      }
      function max(collection, callback, thisArg) {
        var computed = -Infinity,
            result = computed;
        if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
          callback = null;
        }
        if (callback == null && isArray(collection)) {
          var index = -1,
              length = collection.length;
          while (++index < length) {
            var value = collection[index];
            if (value > result) {
              result = value;
            }
          }
        } else {
          callback = (callback == null && isString(collection)) ? charAtCallback : lodash.createCallback(callback, thisArg, 3);
          forEach(collection, function(value, index, collection) {
            var current = callback(value, index, collection);
            if (current > computed) {
              computed = current;
              result = value;
            }
          });
        }
        return result;
      }
      function min(collection, callback, thisArg) {
        var computed = Infinity,
            result = computed;
        if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
          callback = null;
        }
        if (callback == null && isArray(collection)) {
          var index = -1,
              length = collection.length;
          while (++index < length) {
            var value = collection[index];
            if (value < result) {
              result = value;
            }
          }
        } else {
          callback = (callback == null && isString(collection)) ? charAtCallback : lodash.createCallback(callback, thisArg, 3);
          forEach(collection, function(value, index, collection) {
            var current = callback(value, index, collection);
            if (current < computed) {
              computed = current;
              result = value;
            }
          });
        }
        return result;
      }
      var pluck = map;
      function reduce(collection, callback, accumulator, thisArg) {
        if (!collection)
          return accumulator;
        var noaccum = arguments.length < 3;
        callback = lodash.createCallback(callback, thisArg, 4);
        var index = -1,
            length = collection.length;
        if (typeof length == 'number') {
          if (noaccum) {
            accumulator = collection[++index];
          }
          while (++index < length) {
            accumulator = callback(accumulator, collection[index], index, collection);
          }
        } else {
          forOwn(collection, function(value, index, collection) {
            accumulator = noaccum ? (noaccum = false, value) : callback(accumulator, value, index, collection);
          });
        }
        return accumulator;
      }
      function reduceRight(collection, callback, accumulator, thisArg) {
        var noaccum = arguments.length < 3;
        callback = lodash.createCallback(callback, thisArg, 4);
        forEachRight(collection, function(value, index, collection) {
          accumulator = noaccum ? (noaccum = false, value) : callback(accumulator, value, index, collection);
        });
        return accumulator;
      }
      function reject(collection, callback, thisArg) {
        callback = lodash.createCallback(callback, thisArg, 3);
        return filter(collection, function(value, index, collection) {
          return !callback(value, index, collection);
        });
      }
      function sample(collection, n, guard) {
        if (collection && typeof collection.length != 'number') {
          collection = values(collection);
        }
        if (n == null || guard) {
          return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
        }
        var result = shuffle(collection);
        result.length = nativeMin(nativeMax(0, n), result.length);
        return result;
      }
      function shuffle(collection) {
        var index = -1,
            length = collection ? collection.length : 0,
            result = Array(typeof length == 'number' ? length : 0);
        forEach(collection, function(value) {
          var rand = baseRandom(0, ++index);
          result[index] = result[rand];
          result[rand] = value;
        });
        return result;
      }
      function size(collection) {
        var length = collection ? collection.length : 0;
        return typeof length == 'number' ? length : keys(collection).length;
      }
      function some(collection, callback, thisArg) {
        var result;
        callback = lodash.createCallback(callback, thisArg, 3);
        var index = -1,
            length = collection ? collection.length : 0;
        if (typeof length == 'number') {
          while (++index < length) {
            if ((result = callback(collection[index], index, collection))) {
              break;
            }
          }
        } else {
          forOwn(collection, function(value, index, collection) {
            return !(result = callback(value, index, collection));
          });
        }
        return !!result;
      }
      function sortBy(collection, callback, thisArg) {
        var index = -1,
            isArr = isArray(callback),
            length = collection ? collection.length : 0,
            result = Array(typeof length == 'number' ? length : 0);
        if (!isArr) {
          callback = lodash.createCallback(callback, thisArg, 3);
        }
        forEach(collection, function(value, key, collection) {
          var object = result[++index] = getObject();
          if (isArr) {
            object.criteria = map(callback, function(key) {
              return value[key];
            });
          } else {
            (object.criteria = getArray())[0] = callback(value, key, collection);
          }
          object.index = index;
          object.value = value;
        });
        length = result.length;
        result.sort(compareAscending);
        while (length--) {
          var object = result[length];
          result[length] = object.value;
          if (!isArr) {
            releaseArray(object.criteria);
          }
          releaseObject(object);
        }
        return result;
      }
      function toArray(collection) {
        if (collection && typeof collection.length == 'number') {
          return slice(collection);
        }
        return values(collection);
      }
      var where = filter;
      function compact(array) {
        var index = -1,
            length = array ? array.length : 0,
            result = [];
        while (++index < length) {
          var value = array[index];
          if (value) {
            result.push(value);
          }
        }
        return result;
      }
      function difference(array) {
        return baseDifference(array, baseFlatten(arguments, true, true, 1));
      }
      function findIndex(array, callback, thisArg) {
        var index = -1,
            length = array ? array.length : 0;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length) {
          if (callback(array[index], index, array)) {
            return index;
          }
        }
        return -1;
      }
      function findLastIndex(array, callback, thisArg) {
        var length = array ? array.length : 0;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (length--) {
          if (callback(array[length], length, array)) {
            return length;
          }
        }
        return -1;
      }
      function first(array, callback, thisArg) {
        var n = 0,
            length = array ? array.length : 0;
        if (typeof callback != 'number' && callback != null) {
          var index = -1;
          callback = lodash.createCallback(callback, thisArg, 3);
          while (++index < length && callback(array[index], index, array)) {
            n++;
          }
        } else {
          n = callback;
          if (n == null || thisArg) {
            return array ? array[0] : undefined;
          }
        }
        return slice(array, 0, nativeMin(nativeMax(0, n), length));
      }
      function flatten(array, isShallow, callback, thisArg) {
        if (typeof isShallow != 'boolean' && isShallow != null) {
          thisArg = callback;
          callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
          isShallow = false;
        }
        if (callback != null) {
          array = map(array, callback, thisArg);
        }
        return baseFlatten(array, isShallow);
      }
      function indexOf(array, value, fromIndex) {
        if (typeof fromIndex == 'number') {
          var length = array ? array.length : 0;
          fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
        } else if (fromIndex) {
          var index = sortedIndex(array, value);
          return array[index] === value ? index : -1;
        }
        return baseIndexOf(array, value, fromIndex);
      }
      function initial(array, callback, thisArg) {
        var n = 0,
            length = array ? array.length : 0;
        if (typeof callback != 'number' && callback != null) {
          var index = length;
          callback = lodash.createCallback(callback, thisArg, 3);
          while (index-- && callback(array[index], index, array)) {
            n++;
          }
        } else {
          n = (callback == null || thisArg) ? 1 : callback || n;
        }
        return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
      }
      function intersection() {
        var args = [],
            argsIndex = -1,
            argsLength = arguments.length,
            caches = getArray(),
            indexOf = getIndexOf(),
            trustIndexOf = indexOf === baseIndexOf,
            seen = getArray();
        while (++argsIndex < argsLength) {
          var value = arguments[argsIndex];
          if (isArray(value) || isArguments(value)) {
            args.push(value);
            caches.push(trustIndexOf && value.length >= largeArraySize && createCache(argsIndex ? args[argsIndex] : seen));
          }
        }
        var array = args[0],
            index = -1,
            length = array ? array.length : 0,
            result = [];
        outer: while (++index < length) {
          var cache = caches[0];
          value = array[index];
          if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
            argsIndex = argsLength;
            (cache || seen).push(value);
            while (--argsIndex) {
              cache = caches[argsIndex];
              if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
                continue outer;
              }
            }
            result.push(value);
          }
        }
        while (argsLength--) {
          cache = caches[argsLength];
          if (cache) {
            releaseObject(cache);
          }
        }
        releaseArray(caches);
        releaseArray(seen);
        return result;
      }
      function last(array, callback, thisArg) {
        var n = 0,
            length = array ? array.length : 0;
        if (typeof callback != 'number' && callback != null) {
          var index = length;
          callback = lodash.createCallback(callback, thisArg, 3);
          while (index-- && callback(array[index], index, array)) {
            n++;
          }
        } else {
          n = callback;
          if (n == null || thisArg) {
            return array ? array[length - 1] : undefined;
          }
        }
        return slice(array, nativeMax(0, length - n));
      }
      function lastIndexOf(array, value, fromIndex) {
        var index = array ? array.length : 0;
        if (typeof fromIndex == 'number') {
          index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
        }
        while (index--) {
          if (array[index] === value) {
            return index;
          }
        }
        return -1;
      }
      function pull(array) {
        var args = arguments,
            argsIndex = 0,
            argsLength = args.length,
            length = array ? array.length : 0;
        while (++argsIndex < argsLength) {
          var index = -1,
              value = args[argsIndex];
          while (++index < length) {
            if (array[index] === value) {
              splice.call(array, index--, 1);
              length--;
            }
          }
        }
        return array;
      }
      function range(start, end, step) {
        start = +start || 0;
        step = typeof step == 'number' ? step : (+step || 1);
        if (end == null) {
          end = start;
          start = 0;
        }
        var index = -1,
            length = nativeMax(0, ceil((end - start) / (step || 1))),
            result = Array(length);
        while (++index < length) {
          result[index] = start;
          start += step;
        }
        return result;
      }
      function remove(array, callback, thisArg) {
        var index = -1,
            length = array ? array.length : 0,
            result = [];
        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length) {
          var value = array[index];
          if (callback(value, index, array)) {
            result.push(value);
            splice.call(array, index--, 1);
            length--;
          }
        }
        return result;
      }
      function rest(array, callback, thisArg) {
        if (typeof callback != 'number' && callback != null) {
          var n = 0,
              index = -1,
              length = array ? array.length : 0;
          callback = lodash.createCallback(callback, thisArg, 3);
          while (++index < length && callback(array[index], index, array)) {
            n++;
          }
        } else {
          n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
        }
        return slice(array, n);
      }
      function sortedIndex(array, value, callback, thisArg) {
        var low = 0,
            high = array ? array.length : low;
        callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
        value = callback(value);
        while (low < high) {
          var mid = (low + high) >>> 1;
          (callback(array[mid]) < value) ? low = mid + 1 : high = mid;
        }
        return low;
      }
      function union() {
        return baseUniq(baseFlatten(arguments, true, true));
      }
      function uniq(array, isSorted, callback, thisArg) {
        if (typeof isSorted != 'boolean' && isSorted != null) {
          thisArg = callback;
          callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
          isSorted = false;
        }
        if (callback != null) {
          callback = lodash.createCallback(callback, thisArg, 3);
        }
        return baseUniq(array, isSorted, callback);
      }
      function without(array) {
        return baseDifference(array, slice(arguments, 1));
      }
      function xor() {
        var index = -1,
            length = arguments.length;
        while (++index < length) {
          var array = arguments[index];
          if (isArray(array) || isArguments(array)) {
            var result = result ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result))) : array;
          }
        }
        return result || [];
      }
      function zip() {
        var array = arguments.length > 1 ? arguments : arguments[0],
            index = -1,
            length = array ? max(pluck(array, 'length')) : 0,
            result = Array(length < 0 ? 0 : length);
        while (++index < length) {
          result[index] = pluck(array, index);
        }
        return result;
      }
      function zipObject(keys, values) {
        var index = -1,
            length = keys ? keys.length : 0,
            result = {};
        if (!values && length && !isArray(keys[0])) {
          values = [];
        }
        while (++index < length) {
          var key = keys[index];
          if (values) {
            result[key] = values[index];
          } else if (key) {
            result[key[0]] = key[1];
          }
        }
        return result;
      }
      function after(n, func) {
        if (!isFunction(func)) {
          throw new TypeError;
        }
        return function() {
          if (--n < 1) {
            return func.apply(this, arguments);
          }
        };
      }
      function bind(func, thisArg) {
        return arguments.length > 2 ? createWrapper(func, 17, slice(arguments, 2), null, thisArg) : createWrapper(func, 1, null, null, thisArg);
      }
      function bindAll(object) {
        var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
            index = -1,
            length = funcs.length;
        while (++index < length) {
          var key = funcs[index];
          object[key] = createWrapper(object[key], 1, null, null, object);
        }
        return object;
      }
      function bindKey(object, key) {
        return arguments.length > 2 ? createWrapper(key, 19, slice(arguments, 2), null, object) : createWrapper(key, 3, null, null, object);
      }
      function compose() {
        var funcs = arguments,
            length = funcs.length;
        while (length--) {
          if (!isFunction(funcs[length])) {
            throw new TypeError;
          }
        }
        return function() {
          var args = arguments,
              length = funcs.length;
          while (length--) {
            args = [funcs[length].apply(this, args)];
          }
          return args[0];
        };
      }
      function curry(func, arity) {
        arity = typeof arity == 'number' ? arity : (+arity || func.length);
        return createWrapper(func, 4, null, null, null, arity);
      }
      function debounce(func, wait, options) {
        var args,
            maxTimeoutId,
            result,
            stamp,
            thisArg,
            timeoutId,
            trailingCall,
            lastCalled = 0,
            maxWait = false,
            trailing = true;
        if (!isFunction(func)) {
          throw new TypeError;
        }
        wait = nativeMax(0, wait) || 0;
        if (options === true) {
          var leading = true;
          trailing = false;
        } else if (isObject(options)) {
          leading = options.leading;
          maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
          trailing = 'trailing' in options ? options.trailing : trailing;
        }
        var delayed = function() {
          var remaining = wait - (now() - stamp);
          if (remaining <= 0) {
            if (maxTimeoutId) {
              clearTimeout(maxTimeoutId);
            }
            var isCalled = trailingCall;
            maxTimeoutId = timeoutId = trailingCall = undefined;
            if (isCalled) {
              lastCalled = now();
              result = func.apply(thisArg, args);
              if (!timeoutId && !maxTimeoutId) {
                args = thisArg = null;
              }
            }
          } else {
            timeoutId = setTimeout(delayed, remaining);
          }
        };
        var maxDelayed = function() {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          maxTimeoutId = timeoutId = trailingCall = undefined;
          if (trailing || (maxWait !== wait)) {
            lastCalled = now();
            result = func.apply(thisArg, args);
            if (!timeoutId && !maxTimeoutId) {
              args = thisArg = null;
            }
          }
        };
        return function() {
          args = arguments;
          stamp = now();
          thisArg = this;
          trailingCall = trailing && (timeoutId || !leading);
          if (maxWait === false) {
            var leadingCall = leading && !timeoutId;
          } else {
            if (!maxTimeoutId && !leading) {
              lastCalled = stamp;
            }
            var remaining = maxWait - (stamp - lastCalled),
                isCalled = remaining <= 0;
            if (isCalled) {
              if (maxTimeoutId) {
                maxTimeoutId = clearTimeout(maxTimeoutId);
              }
              lastCalled = stamp;
              result = func.apply(thisArg, args);
            } else if (!maxTimeoutId) {
              maxTimeoutId = setTimeout(maxDelayed, remaining);
            }
          }
          if (isCalled && timeoutId) {
            timeoutId = clearTimeout(timeoutId);
          } else if (!timeoutId && wait !== maxWait) {
            timeoutId = setTimeout(delayed, wait);
          }
          if (leadingCall) {
            isCalled = true;
            result = func.apply(thisArg, args);
          }
          if (isCalled && !timeoutId && !maxTimeoutId) {
            args = thisArg = null;
          }
          return result;
        };
      }
      function defer(func) {
        if (!isFunction(func)) {
          throw new TypeError;
        }
        var args = slice(arguments, 1);
        return setTimeout(function() {
          func.apply(undefined, args);
        }, 1);
      }
      function delay(func, wait) {
        if (!isFunction(func)) {
          throw new TypeError;
        }
        var args = slice(arguments, 2);
        return setTimeout(function() {
          func.apply(undefined, args);
        }, wait);
      }
      function memoize(func, resolver) {
        if (!isFunction(func)) {
          throw new TypeError;
        }
        var memoized = function() {
          var cache = memoized.cache,
              key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];
          return hasOwnProperty.call(cache, key) ? cache[key] : (cache[key] = func.apply(this, arguments));
        };
        memoized.cache = {};
        return memoized;
      }
      function once(func) {
        var ran,
            result;
        if (!isFunction(func)) {
          throw new TypeError;
        }
        return function() {
          if (ran) {
            return result;
          }
          ran = true;
          result = func.apply(this, arguments);
          func = null;
          return result;
        };
      }
      function partial(func) {
        return createWrapper(func, 16, slice(arguments, 1));
      }
      function partialRight(func) {
        return createWrapper(func, 32, null, slice(arguments, 1));
      }
      function throttle(func, wait, options) {
        var leading = true,
            trailing = true;
        if (!isFunction(func)) {
          throw new TypeError;
        }
        if (options === false) {
          leading = false;
        } else if (isObject(options)) {
          leading = 'leading' in options ? options.leading : leading;
          trailing = 'trailing' in options ? options.trailing : trailing;
        }
        debounceOptions.leading = leading;
        debounceOptions.maxWait = wait;
        debounceOptions.trailing = trailing;
        return debounce(func, wait, debounceOptions);
      }
      function wrap(value, wrapper) {
        return createWrapper(wrapper, 16, [value]);
      }
      function constant(value) {
        return function() {
          return value;
        };
      }
      function createCallback(func, thisArg, argCount) {
        var type = typeof func;
        if (func == null || type == 'function') {
          return baseCreateCallback(func, thisArg, argCount);
        }
        if (type != 'object') {
          return property(func);
        }
        var props = keys(func),
            key = props[0],
            a = func[key];
        if (props.length == 1 && a === a && !isObject(a)) {
          return function(object) {
            var b = object[key];
            return a === b && (a !== 0 || (1 / a == 1 / b));
          };
        }
        return function(object) {
          var length = props.length,
              result = false;
          while (length--) {
            if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
              break;
            }
          }
          return result;
        };
      }
      function escape(string) {
        return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
      }
      function identity(value) {
        return value;
      }
      function mixin(object, source, options) {
        var chain = true,
            methodNames = source && functions(source);
        if (!source || (!options && !methodNames.length)) {
          if (options == null) {
            options = source;
          }
          ctor = lodashWrapper;
          source = object;
          object = lodash;
          methodNames = functions(source);
        }
        if (options === false) {
          chain = false;
        } else if (isObject(options) && 'chain' in options) {
          chain = options.chain;
        }
        var ctor = object,
            isFunc = isFunction(ctor);
        forEach(methodNames, function(methodName) {
          var func = object[methodName] = source[methodName];
          if (isFunc) {
            ctor.prototype[methodName] = function() {
              var chainAll = this.__chain__,
                  value = this.__wrapped__,
                  args = [value];
              push.apply(args, arguments);
              var result = func.apply(object, args);
              if (chain || chainAll) {
                if (value === result && isObject(result)) {
                  return this;
                }
                result = new ctor(result);
                result.__chain__ = chainAll;
              }
              return result;
            };
          }
        });
      }
      function noConflict() {
        context._ = oldDash;
        return this;
      }
      function noop() {}
      var now = isNative(now = Date.now) && now || function() {
        return new Date().getTime();
      };
      var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
        return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
      };
      function property(key) {
        return function(object) {
          return object[key];
        };
      }
      function random(min, max, floating) {
        var noMin = min == null,
            noMax = max == null;
        if (floating == null) {
          if (typeof min == 'boolean' && noMax) {
            floating = min;
            min = 1;
          } else if (!noMax && typeof max == 'boolean') {
            floating = max;
            noMax = true;
          }
        }
        if (noMin && noMax) {
          max = 1;
        }
        min = +min || 0;
        if (noMax) {
          max = min;
          min = 0;
        } else {
          max = +max || 0;
        }
        if (floating || min % 1 || max % 1) {
          var rand = nativeRandom();
          return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
        }
        return baseRandom(min, max);
      }
      function result(object, key) {
        if (object) {
          var value = object[key];
          return isFunction(value) ? object[key]() : value;
        }
      }
      function template(text, data, options) {
        var settings = lodash.templateSettings;
        text = String(text || '');
        options = defaults({}, options, settings);
        var imports = defaults({}, options.imports, settings.imports),
            importsKeys = keys(imports),
            importsValues = values(imports);
        var isEvaluating,
            index = 0,
            interpolate = options.interpolate || reNoMatch,
            source = "__p += '";
        var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
        text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
          interpolateValue || (interpolateValue = esTemplateValue);
          source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);
          if (escapeValue) {
            source += "' +\n__e(" + escapeValue + ") +\n'";
          }
          if (evaluateValue) {
            isEvaluating = true;
            source += "';\n" + evaluateValue + ";\n__p += '";
          }
          if (interpolateValue) {
            source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
          }
          index = offset + match.length;
          return match;
        });
        source += "';\n";
        var variable = options.variable,
            hasVariable = variable;
        if (!hasVariable) {
          variable = 'obj';
          source = 'with (' + variable + ') {\n' + source + '\n}\n';
        }
        source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
        source = 'function(' + variable + ') {\n' + (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') + "var __t, __p = '', __e = _.escape" + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';
        var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';
        try {
          var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
        } catch (e) {
          e.source = source;
          throw e;
        }
        if (data) {
          return result(data);
        }
        result.source = source;
        return result;
      }
      function times(n, callback, thisArg) {
        n = (n = +n) > -1 ? n : 0;
        var index = -1,
            result = Array(n);
        callback = baseCreateCallback(callback, thisArg, 1);
        while (++index < n) {
          result[index] = callback(index);
        }
        return result;
      }
      function unescape(string) {
        return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
      }
      function uniqueId(prefix) {
        var id = ++idCounter;
        return String(prefix == null ? '' : prefix) + id;
      }
      function chain(value) {
        value = new lodashWrapper(value);
        value.__chain__ = true;
        return value;
      }
      function tap(value, interceptor) {
        interceptor(value);
        return value;
      }
      function wrapperChain() {
        this.__chain__ = true;
        return this;
      }
      function wrapperToString() {
        return String(this.__wrapped__);
      }
      function wrapperValueOf() {
        return this.__wrapped__;
      }
      lodash.after = after;
      lodash.assign = assign;
      lodash.at = at;
      lodash.bind = bind;
      lodash.bindAll = bindAll;
      lodash.bindKey = bindKey;
      lodash.chain = chain;
      lodash.compact = compact;
      lodash.compose = compose;
      lodash.constant = constant;
      lodash.countBy = countBy;
      lodash.create = create;
      lodash.createCallback = createCallback;
      lodash.curry = curry;
      lodash.debounce = debounce;
      lodash.defaults = defaults;
      lodash.defer = defer;
      lodash.delay = delay;
      lodash.difference = difference;
      lodash.filter = filter;
      lodash.flatten = flatten;
      lodash.forEach = forEach;
      lodash.forEachRight = forEachRight;
      lodash.forIn = forIn;
      lodash.forInRight = forInRight;
      lodash.forOwn = forOwn;
      lodash.forOwnRight = forOwnRight;
      lodash.functions = functions;
      lodash.groupBy = groupBy;
      lodash.indexBy = indexBy;
      lodash.initial = initial;
      lodash.intersection = intersection;
      lodash.invert = invert;
      lodash.invoke = invoke;
      lodash.keys = keys;
      lodash.map = map;
      lodash.mapValues = mapValues;
      lodash.max = max;
      lodash.memoize = memoize;
      lodash.merge = merge;
      lodash.min = min;
      lodash.omit = omit;
      lodash.once = once;
      lodash.pairs = pairs;
      lodash.partial = partial;
      lodash.partialRight = partialRight;
      lodash.pick = pick;
      lodash.pluck = pluck;
      lodash.property = property;
      lodash.pull = pull;
      lodash.range = range;
      lodash.reject = reject;
      lodash.remove = remove;
      lodash.rest = rest;
      lodash.shuffle = shuffle;
      lodash.sortBy = sortBy;
      lodash.tap = tap;
      lodash.throttle = throttle;
      lodash.times = times;
      lodash.toArray = toArray;
      lodash.transform = transform;
      lodash.union = union;
      lodash.uniq = uniq;
      lodash.values = values;
      lodash.where = where;
      lodash.without = without;
      lodash.wrap = wrap;
      lodash.xor = xor;
      lodash.zip = zip;
      lodash.zipObject = zipObject;
      lodash.collect = map;
      lodash.drop = rest;
      lodash.each = forEach;
      lodash.eachRight = forEachRight;
      lodash.extend = assign;
      lodash.methods = functions;
      lodash.object = zipObject;
      lodash.select = filter;
      lodash.tail = rest;
      lodash.unique = uniq;
      lodash.unzip = zip;
      mixin(lodash);
      lodash.clone = clone;
      lodash.cloneDeep = cloneDeep;
      lodash.contains = contains;
      lodash.escape = escape;
      lodash.every = every;
      lodash.find = find;
      lodash.findIndex = findIndex;
      lodash.findKey = findKey;
      lodash.findLast = findLast;
      lodash.findLastIndex = findLastIndex;
      lodash.findLastKey = findLastKey;
      lodash.has = has;
      lodash.identity = identity;
      lodash.indexOf = indexOf;
      lodash.isArguments = isArguments;
      lodash.isArray = isArray;
      lodash.isBoolean = isBoolean;
      lodash.isDate = isDate;
      lodash.isElement = isElement;
      lodash.isEmpty = isEmpty;
      lodash.isEqual = isEqual;
      lodash.isFinite = isFinite;
      lodash.isFunction = isFunction;
      lodash.isNaN = isNaN;
      lodash.isNull = isNull;
      lodash.isNumber = isNumber;
      lodash.isObject = isObject;
      lodash.isPlainObject = isPlainObject;
      lodash.isRegExp = isRegExp;
      lodash.isString = isString;
      lodash.isUndefined = isUndefined;
      lodash.lastIndexOf = lastIndexOf;
      lodash.mixin = mixin;
      lodash.noConflict = noConflict;
      lodash.noop = noop;
      lodash.now = now;
      lodash.parseInt = parseInt;
      lodash.random = random;
      lodash.reduce = reduce;
      lodash.reduceRight = reduceRight;
      lodash.result = result;
      lodash.runInContext = runInContext;
      lodash.size = size;
      lodash.some = some;
      lodash.sortedIndex = sortedIndex;
      lodash.template = template;
      lodash.unescape = unescape;
      lodash.uniqueId = uniqueId;
      lodash.all = every;
      lodash.any = some;
      lodash.detect = find;
      lodash.findWhere = find;
      lodash.foldl = reduce;
      lodash.foldr = reduceRight;
      lodash.include = contains;
      lodash.inject = reduce;
      mixin(function() {
        var source = {};
        forOwn(lodash, function(func, methodName) {
          if (!lodash.prototype[methodName]) {
            source[methodName] = func;
          }
        });
        return source;
      }(), false);
      lodash.first = first;
      lodash.last = last;
      lodash.sample = sample;
      lodash.take = first;
      lodash.head = first;
      forOwn(lodash, function(func, methodName) {
        var callbackable = methodName !== 'sample';
        if (!lodash.prototype[methodName]) {
          lodash.prototype[methodName] = function(n, guard) {
            var chainAll = this.__chain__,
                result = func(this.__wrapped__, n, guard);
            return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function'))) ? result : new lodashWrapper(result, chainAll);
          };
        }
      });
      lodash.VERSION = '2.4.1';
      lodash.prototype.chain = wrapperChain;
      lodash.prototype.toString = wrapperToString;
      lodash.prototype.value = wrapperValueOf;
      lodash.prototype.valueOf = wrapperValueOf;
      forEach(['join', 'pop', 'shift'], function(methodName) {
        var func = arrayRef[methodName];
        lodash.prototype[methodName] = function() {
          var chainAll = this.__chain__,
              result = func.apply(this.__wrapped__, arguments);
          return chainAll ? new lodashWrapper(result, chainAll) : result;
        };
      });
      forEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
        var func = arrayRef[methodName];
        lodash.prototype[methodName] = function() {
          func.apply(this.__wrapped__, arguments);
          return this;
        };
      });
      forEach(['concat', 'slice', 'splice'], function(methodName) {
        var func = arrayRef[methodName];
        lodash.prototype[methodName] = function() {
          return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
        };
      });
      return lodash;
    }
    var _ = runInContext();
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      root._ = _;
      define(function() {
        return _;
      });
    } else if (freeExports && freeModule) {
      if (moduleExports) {
        (freeModule.exports = _)._ = _;
      } else {
        freeExports._ = _;
      }
    } else {
      root._ = _;
    }
  }.call(this));
  return {};
}.call(typeof global !== 'undefined' ? global : this);


}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
"use strict";
var __moduleName = "public/entities/Player";
module.exports = (function() {
  var Player = function Player(state, x, y) {
    var player = new Phaser.Sprite(state, x, y, "player");
    player.scale.x = .25;
    player.scale.y = .25;
    return player;
  };
  return ($traceurRuntime.createClass)(Player, {}, {});
}());


},{}],5:[function(require,module,exports){
"use strict";
var __moduleName = "public/main";
var $__0 = require("lodash"),
    map = $__0.map,
    forEach = $__0.forEach;
var Round = require("./states/Round");
var screen = {
  height: 480,
  width: 640
};
var game = new Phaser.Game(screen.width, screen.height, Phaser.AUTO, "game");
game.state.add('game', Round);
game.state.start('game');


},{"./states/Round":6,"lodash":3}],6:[function(require,module,exports){
"use strict";
var __moduleName = "public/states/Round";
var Player = require("../entities/Player");
var addPlayer = (function(state, player) {
  state.physics.arcade.enable(player);
  player.body.collideWorldBounds = true;
  state.add.existing(player);
});
module.exports = (function($__super) {
  var Round = function Round() {
    $traceurRuntime.defaultSuperCall(this, Round.prototype, arguments);
  };
  return ($traceurRuntime.createClass)(Round, {
    preload: function() {
      this.load.image('player', 'sprites/player.png');
    },
    create: function() {
      var player1 = Player(this, 0, 0);
      var player2 = Player(this, 300, 300);
      this.physics.startSystem(Phaser.Physics.Arcade);
      addPlayer(this, player1);
      addPlayer(this, player2);
    },
    update: function() {}
  }, {}, $__super);
}(Phaser.State));


},{"../entities/Player":4}]},{},[2,5])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9lczZpZnkvbm9kZV9tb2R1bGVzL3RyYWNldXIvYmluL3RyYWNldXItcnVudGltZS5qcyIsIi9Vc2Vycy9zdGV2ZW5rYW5lL2x0dHAvbm9kZV9tb2R1bGVzL2xvZGFzaC9kaXN0L2xvZGFzaC5qcyIsIi9Vc2Vycy9zdGV2ZW5rYW5lL2x0dHAvcHVibGljL2VudGl0aWVzL1BsYXllci5qcyIsIi9Vc2Vycy9zdGV2ZW5rYW5lL2x0dHAvcHVibGljL21haW4uanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9zdGF0ZXMvUm91bmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUcsZUFBYyxDQUFDO0FBQ3ZDLENBQUEsV0FBTSxNQUFNLEVBQUcsTUFBSyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxTQUFTLEVBQUcsU0FBUSxDQUFDO0FBQzNCLENBQUEsV0FBTSxTQUFTLEVBQUcsU0FBUSxDQUFDO0FBQzNCLENBQUEsV0FBTSxNQUFNLEVBQUcsTUFBSyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxNQUFNLEVBQUcsTUFBSyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxXQUFXLEVBQUcsV0FBVSxDQUFDO0FBQy9CLENBQUEsV0FBTSxPQUFPLEVBQUcsT0FBTSxDQUFDO0FBQ3ZCLENBQUEsV0FBTSxRQUFRLEVBQUcsUUFBTyxDQUFDO0FBQ3pCLENBQUEsV0FBTSxRQUFRLEVBQUcsUUFBTyxDQUFDO0FBQ3pCLENBQUEsV0FBTSxhQUFhLEVBQUcsYUFBWSxDQUFDO0FBQ25DLENBQUEsV0FBTSxNQUFNLEVBQUcsTUFBSyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxXQUFXLEVBQUcsV0FBVSxDQUFDO0FBQy9CLENBQUEsV0FBTSxPQUFPLEVBQUcsT0FBTSxDQUFDO0FBQ3ZCLENBQUEsV0FBTSxZQUFZLEVBQUcsWUFBVyxDQUFDO0FBQ2pDLENBQUEsV0FBTSxVQUFVLEVBQUcsVUFBUyxDQUFDO0FBQzdCLENBQUEsV0FBTSxRQUFRLEVBQUcsUUFBTyxDQUFDO0FBQ3pCLENBQUEsV0FBTSxRQUFRLEVBQUcsUUFBTyxDQUFDO0FBQ3pCLENBQUEsV0FBTSxRQUFRLEVBQUcsUUFBTyxDQUFDO0FBQ3pCLENBQUEsV0FBTSxhQUFhLEVBQUcsYUFBWSxDQUFDO0FBQ25DLENBQUEsV0FBTSxPQUFPLEVBQUcsT0FBTSxDQUFDO0FBQ3ZCLENBQUEsV0FBTSxPQUFPLEVBQUcsT0FBTSxDQUFDO0FBQ3ZCLENBQUEsV0FBTSxLQUFLLEVBQUcsS0FBSSxDQUFDO0FBQ25CLENBQUEsV0FBTSxJQUFJLEVBQUcsSUFBRyxDQUFDO0FBQ2pCLENBQUEsV0FBTSxVQUFVLEVBQUcsVUFBUyxDQUFDO0FBQzdCLENBQUEsV0FBTSxJQUFJLEVBQUcsSUFBRyxDQUFDO0FBQ2pCLENBQUEsV0FBTSxRQUFRLEVBQUcsUUFBTyxDQUFDO0FBQ3pCLENBQUEsV0FBTSxNQUFNLEVBQUcsTUFBSyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxJQUFJLEVBQUcsSUFBRyxDQUFDO0FBQ2pCLENBQUEsV0FBTSxLQUFLLEVBQUcsS0FBSSxDQUFDO0FBQ25CLENBQUEsV0FBTSxLQUFLLEVBQUcsS0FBSSxDQUFDO0FBQ25CLENBQUEsV0FBTSxNQUFNLEVBQUcsTUFBSyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxRQUFRLEVBQUcsUUFBTyxDQUFDO0FBQ3pCLENBQUEsV0FBTSxhQUFhLEVBQUcsYUFBWSxDQUFDO0FBQ25DLENBQUEsV0FBTSxLQUFLLEVBQUcsS0FBSSxDQUFDO0FBQ25CLENBQUEsV0FBTSxNQUFNLEVBQUcsTUFBSyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxTQUFTLEVBQUcsU0FBUSxDQUFDO0FBQzNCLENBQUEsV0FBTSxLQUFLLEVBQUcsS0FBSSxDQUFDO0FBQ25CLENBQUEsV0FBTSxNQUFNLEVBQUcsTUFBSyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxPQUFPLEVBQUcsT0FBTSxDQUFDO0FBQ3ZCLENBQUEsV0FBTSxPQUFPLEVBQUcsT0FBTSxDQUFDO0FBQ3ZCLENBQUEsV0FBTSxLQUFLLEVBQUcsS0FBSSxDQUFDO0FBQ25CLENBQUEsV0FBTSxRQUFRLEVBQUcsUUFBTyxDQUFDO0FBQ3pCLENBQUEsV0FBTSxPQUFPLEVBQUcsT0FBTSxDQUFDO0FBQ3ZCLENBQUEsV0FBTSxJQUFJLEVBQUcsSUFBRyxDQUFDO0FBQ2pCLENBQUEsV0FBTSxTQUFTLEVBQUcsU0FBUSxDQUFDO0FBQzNCLENBQUEsV0FBTSxNQUFNLEVBQUcsTUFBSyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxRQUFRLEVBQUcsUUFBTyxDQUFDO0FBQ3pCLENBQUEsV0FBTSxVQUFVLEVBQUcsVUFBUyxDQUFDO0FBQzdCLENBQUEsV0FBTSxNQUFNLEVBQUcsTUFBSyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxLQUFLLEVBQUcsS0FBSSxDQUFDO0FBQ25CLENBQUEsV0FBTSxPQUFPLEVBQUcsT0FBTSxDQUFDO0FBQ3ZCLENBQUEsV0FBTSxNQUFNLEVBQUcsTUFBSyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxRQUFRLEVBQUcsUUFBTyxDQUFDO0FBQ3pCLENBQUEsV0FBTSxLQUFLLEVBQUcsS0FBSSxDQUFDO0FBQ25CLENBQUEsV0FBTSxJQUFJLEVBQUcsSUFBRyxDQUFDO0FBQ2pCLENBQUEsV0FBTSxJQUFJLEVBQUcsSUFBRyxDQUFDO0FBQ2pCLENBQUEsV0FBTSxVQUFVLEVBQUcsVUFBUyxDQUFDO0FBRzdCLENBQUEsV0FBTSxRQUFRLEVBQUcsSUFBRyxDQUFDO0FBQ3JCLENBQUEsV0FBTSxLQUFLLEVBQUcsS0FBSSxDQUFDO0FBQ25CLENBQUEsV0FBTSxLQUFLLEVBQUcsUUFBTyxDQUFDO0FBQ3RCLENBQUEsV0FBTSxVQUFVLEVBQUcsYUFBWSxDQUFDO0FBQ2hDLENBQUEsV0FBTSxPQUFPLEVBQUcsT0FBTSxDQUFDO0FBQ3ZCLENBQUEsV0FBTSxRQUFRLEVBQUcsVUFBUyxDQUFDO0FBQzNCLENBQUEsV0FBTSxPQUFPLEVBQUcsVUFBUyxDQUFDO0FBQzFCLENBQUEsV0FBTSxPQUFPLEVBQUcsT0FBTSxDQUFDO0FBQ3ZCLENBQUEsV0FBTSxLQUFLLEVBQUcsS0FBSSxDQUFDO0FBQ25CLENBQUEsV0FBTSxPQUFPLEVBQUcsS0FBSSxDQUFDO0FBQ3JCLENBQUEsV0FBTSxNQUFNLEVBQUcsSUFBRyxDQUFDO0FBR25CLENBQUEsVUFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBS2QsQ0FBQSxXQUFNLE1BQU0sRUFBRyxNQUFLLENBQUM7QUFDckIsQ0FBQSxXQUFNLFVBQVUsRUFBRyxVQUFTLENBQUM7QUFDN0IsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFDM0IsQ0FBQSxXQUFNLE9BQU8sRUFBRyxPQUFNLENBQUM7QUFDdkIsQ0FBQSxXQUFNLE1BQU0sRUFBRyxNQUFLLENBQUM7QUFDckIsQ0FBQSxXQUFNLEtBQUssRUFBRyxLQUFJLENBQUM7QUFDbkIsQ0FBQSxXQUFNLFVBQVUsRUFBRyxVQUFTLENBQUM7QUFDN0IsQ0FBQSxXQUFNLFFBQVEsRUFBRyxRQUFPLENBQUM7QUFDekIsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFDM0IsQ0FBQSxXQUFNLGNBQWMsRUFBRyxjQUFhLENBQUM7QUFDckMsQ0FBQSxXQUFNLFlBQVksRUFBRyxZQUFXLENBQUM7QUFDakMsQ0FBQSxXQUFNLElBQUksRUFBRyxJQUFHLENBQUM7QUFDakIsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFDM0IsQ0FBQSxXQUFNLFFBQVEsRUFBRyxRQUFPLENBQUM7QUFDekIsQ0FBQSxXQUFNLFlBQVksRUFBRyxZQUFXLENBQUM7QUFDakMsQ0FBQSxXQUFNLFFBQVEsRUFBRyxRQUFPLENBQUM7QUFDekIsQ0FBQSxXQUFNLFVBQVUsRUFBRyxVQUFTLENBQUM7QUFDN0IsQ0FBQSxXQUFNLE9BQU8sRUFBRyxPQUFNLENBQUM7QUFDdkIsQ0FBQSxXQUFNLFVBQVUsRUFBRyxVQUFTLENBQUM7QUFDN0IsQ0FBQSxXQUFNLFFBQVEsRUFBRyxRQUFPLENBQUM7QUFDekIsQ0FBQSxXQUFNLFFBQVEsRUFBRyxRQUFPLENBQUM7QUFDekIsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFDM0IsQ0FBQSxXQUFNLFdBQVcsRUFBRyxXQUFVLENBQUM7QUFDL0IsQ0FBQSxXQUFNLE1BQU0sRUFBRyxNQUFLLENBQUM7QUFDckIsQ0FBQSxXQUFNLE9BQU8sRUFBRyxPQUFNLENBQUM7QUFDdkIsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFDM0IsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFDM0IsQ0FBQSxXQUFNLGNBQWMsRUFBRyxjQUFhLENBQUM7QUFDckMsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFDM0IsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFDM0IsQ0FBQSxXQUFNLFlBQVksRUFBRyxZQUFXLENBQUM7QUFDakMsQ0FBQSxXQUFNLFlBQVksRUFBRyxZQUFXLENBQUM7QUFDakMsQ0FBQSxXQUFNLE1BQU0sRUFBRyxNQUFLLENBQUM7QUFDckIsQ0FBQSxXQUFNLFdBQVcsRUFBRyxXQUFVLENBQUM7QUFDL0IsQ0FBQSxXQUFNLEtBQUssRUFBRyxLQUFJLENBQUM7QUFDbkIsQ0FBQSxXQUFNLElBQUksRUFBRyxJQUFHLENBQUM7QUFDakIsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFDM0IsQ0FBQSxXQUFNLE9BQU8sRUFBRyxPQUFNLENBQUM7QUFDdkIsQ0FBQSxXQUFNLE9BQU8sRUFBRyxPQUFNLENBQUM7QUFDdkIsQ0FBQSxXQUFNLFlBQVksRUFBRyxZQUFXLENBQUM7QUFDakMsQ0FBQSxXQUFNLE9BQU8sRUFBRyxPQUFNLENBQUM7QUFDdkIsQ0FBQSxXQUFNLGFBQWEsRUFBRyxhQUFZLENBQUM7QUFDbkMsQ0FBQSxXQUFNLEtBQUssRUFBRyxLQUFJLENBQUM7QUFDbkIsQ0FBQSxXQUFNLEtBQUssRUFBRyxLQUFJLENBQUM7QUFDbkIsQ0FBQSxXQUFNLFlBQVksRUFBRyxZQUFXLENBQUM7QUFDakMsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFDM0IsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFDM0IsQ0FBQSxXQUFNLFNBQVMsRUFBRyxTQUFRLENBQUM7QUFHM0IsQ0FBQSxXQUFNLElBQUksRUFBRyxNQUFLLENBQUM7QUFDbkIsQ0FBQSxXQUFNLElBQUksRUFBRyxLQUFJLENBQUM7QUFDbEIsQ0FBQSxXQUFNLE9BQU8sRUFBRyxLQUFJLENBQUM7QUFDckIsQ0FBQSxXQUFNLFVBQVUsRUFBRyxLQUFJLENBQUM7QUFDeEIsQ0FBQSxXQUFNLE1BQU0sRUFBRyxPQUFNLENBQUM7QUFDdEIsQ0FBQSxXQUFNLE1BQU0sRUFBRyxZQUFXLENBQUM7QUFDM0IsQ0FBQSxXQUFNLFFBQVEsRUFBRyxTQUFRLENBQUM7QUFDMUIsQ0FBQSxXQUFNLE9BQU8sRUFB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dGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBpZiAoZ2xvYmFsLiR0cmFjZXVyUnVudGltZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgJE9iamVjdCA9IE9iamVjdDtcbiAgdmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG4gIHZhciAkY3JlYXRlID0gJE9iamVjdC5jcmVhdGU7XG4gIHZhciAkZGVmaW5lUHJvcGVydGllcyA9ICRPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbiAgdmFyICRkZWZpbmVQcm9wZXJ0eSA9ICRPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4gIHZhciAkZnJlZXplID0gJE9iamVjdC5mcmVlemU7XG4gIHZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gIHZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9ICRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgdmFyICRnZXRQcm90b3R5cGVPZiA9ICRPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciAkaGFzT3duUHJvcGVydHkgPSAkT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyICR0b1N0cmluZyA9ICRPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICBmdW5jdGlvbiBub25FbnVtKHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9O1xuICB9XG4gIHZhciB0eXBlcyA9IHtcbiAgICB2b2lkOiBmdW5jdGlvbiB2b2lkVHlwZSgpIHt9LFxuICAgIGFueTogZnVuY3Rpb24gYW55KCkge30sXG4gICAgc3RyaW5nOiBmdW5jdGlvbiBzdHJpbmcoKSB7fSxcbiAgICBudW1iZXI6IGZ1bmN0aW9uIG51bWJlcigpIHt9LFxuICAgIGJvb2xlYW46IGZ1bmN0aW9uIGJvb2xlYW4oKSB7fVxuICB9O1xuICB2YXIgbWV0aG9kID0gbm9uRW51bTtcbiAgdmFyIGNvdW50ZXIgPSAwO1xuICBmdW5jdGlvbiBuZXdVbmlxdWVTdHJpbmcoKSB7XG4gICAgcmV0dXJuICdfXyQnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMWU5KSArICckJyArICsrY291bnRlciArICckX18nO1xuICB9XG4gIHZhciBzeW1ib2xJbnRlcm5hbFByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xEYXRhUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbFZhbHVlcyA9ICRjcmVhdGUobnVsbCk7XG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHN5bWJvbCkge1xuICAgIHJldHVybiB0eXBlb2Ygc3ltYm9sID09PSAnb2JqZWN0JyAmJiBzeW1ib2wgaW5zdGFuY2VvZiBTeW1ib2xWYWx1ZTtcbiAgfVxuICBmdW5jdGlvbiB0eXBlT2Yodikge1xuICAgIGlmIChpc1N5bWJvbCh2KSlcbiAgICAgIHJldHVybiAnc3ltYm9sJztcbiAgICByZXR1cm4gdHlwZW9mIHY7XG4gIH1cbiAgZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKSB7XG4gICAgdmFyIHZhbHVlID0gbmV3IFN5bWJvbFZhbHVlKGRlc2NyaXB0aW9uKTtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSlcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdTeW1ib2wgY2Fubm90IGJlIG5ld1xcJ2VkJyk7XG4gIH1cbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIG5vbkVudW0oU3ltYm9sKSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAndG9TdHJpbmcnLCBtZXRob2QoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN5bWJvbFZhbHVlID0gdGhpc1tzeW1ib2xEYXRhUHJvcGVydHldO1xuICAgIGlmICghZ2V0T3B0aW9uKCdzeW1ib2xzJykpXG4gICAgICByZXR1cm4gc3ltYm9sVmFsdWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgaWYgKCFzeW1ib2xWYWx1ZSlcbiAgICAgIHRocm93IFR5cGVFcnJvcignQ29udmVyc2lvbiBmcm9tIHN5bWJvbCB0byBzdHJpbmcnKTtcbiAgICB2YXIgZGVzYyA9IHN5bWJvbFZhbHVlW3N5bWJvbERlc2NyaXB0aW9uUHJvcGVydHldO1xuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpXG4gICAgICBkZXNjID0gJyc7XG4gICAgcmV0dXJuICdTeW1ib2woJyArIGRlc2MgKyAnKSc7XG4gIH0pKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICd2YWx1ZU9mJywgbWV0aG9kKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzeW1ib2xWYWx1ZSA9IHRoaXNbc3ltYm9sRGF0YVByb3BlcnR5XTtcbiAgICBpZiAoIXN5bWJvbFZhbHVlKVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdDb252ZXJzaW9uIGZyb20gc3ltYm9sIHRvIHN0cmluZycpO1xuICAgIGlmICghZ2V0T3B0aW9uKCdzeW1ib2xzJykpXG4gICAgICByZXR1cm4gc3ltYm9sVmFsdWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgcmV0dXJuIHN5bWJvbFZhbHVlO1xuICB9KSk7XG4gIGZ1bmN0aW9uIFN5bWJvbFZhbHVlKGRlc2NyaXB0aW9uKSB7XG4gICAgdmFyIGtleSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xEYXRhUHJvcGVydHksIHt2YWx1ZTogdGhpc30pO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xJbnRlcm5hbFByb3BlcnR5LCB7dmFsdWU6IGtleX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5LCB7dmFsdWU6IGRlc2NyaXB0aW9ufSk7XG4gICAgJGZyZWV6ZSh0aGlzKTtcbiAgICBzeW1ib2xWYWx1ZXNba2V5XSA9IHRoaXM7XG4gIH1cbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShTeW1ib2wpKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywge1xuICAgIHZhbHVlOiBTeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgIGVudW1lcmFibGU6IGZhbHNlXG4gIH0pO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAndmFsdWVPZicsIHtcbiAgICB2YWx1ZTogU3ltYm9sLnByb3RvdHlwZS52YWx1ZU9mLFxuICAgIGVudW1lcmFibGU6IGZhbHNlXG4gIH0pO1xuICAkZnJlZXplKFN5bWJvbFZhbHVlLnByb3RvdHlwZSk7XG4gIFN5bWJvbC5pdGVyYXRvciA9IFN5bWJvbCgpO1xuICBmdW5jdGlvbiB0b1Byb3BlcnR5KG5hbWUpIHtcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpXG4gICAgICByZXR1cm4gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCkge1xuICAgIHZhciBydiA9IFtdO1xuICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIGlmICghc3ltYm9sVmFsdWVzW25hbWVdKVxuICAgICAgICBydi5wdXNoKG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkge1xuICAgIHJldHVybiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgdG9Qcm9wZXJ0eShuYW1lKSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCkge1xuICAgIHZhciBydiA9IFtdO1xuICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN5bWJvbCA9IHN5bWJvbFZhbHVlc1tuYW1lc1tpXV07XG4gICAgICBpZiAoc3ltYm9sKVxuICAgICAgICBydi5wdXNoKHN5bWJvbCk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShuYW1lKSB7XG4gICAgcmV0dXJuICRoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsIHRvUHJvcGVydHkobmFtZSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldE9wdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIGdsb2JhbC50cmFjZXVyICYmIGdsb2JhbC50cmFjZXVyLm9wdGlvbnNbbmFtZV07XG4gIH1cbiAgZnVuY3Rpb24gc2V0UHJvcGVydHkob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBzeW0sXG4gICAgICAgIGRlc2M7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKSB7XG4gICAgICBzeW0gPSBuYW1lO1xuICAgICAgbmFtZSA9IG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgfVxuICAgIG9iamVjdFtuYW1lXSA9IHZhbHVlO1xuICAgIGlmIChzeW0gJiYgKGRlc2MgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkpKVxuICAgICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge2VudW1lcmFibGU6IGZhbHNlfSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwgZGVzY3JpcHRvcikge1xuICAgIGlmIChpc1N5bWJvbChuYW1lKSkge1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZW51bWVyYWJsZSkge1xuICAgICAgICBkZXNjcmlwdG9yID0gJGNyZWF0ZShkZXNjcmlwdG9yLCB7ZW51bWVyYWJsZToge3ZhbHVlOiBmYWxzZX19KTtcbiAgICAgIH1cbiAgICAgIG5hbWUgPSBuYW1lW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsT2JqZWN0KE9iamVjdCkge1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScsIHt2YWx1ZTogZGVmaW5lUHJvcGVydHl9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZ2V0T3duUHJvcGVydHlOYW1lcycsIHt2YWx1ZTogZ2V0T3duUHJvcGVydHlOYW1lc30pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCB7dmFsdWU6IGdldE93blByb3BlcnR5RGVzY3JpcHRvcn0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QucHJvdG90eXBlLCAnaGFzT3duUHJvcGVydHknLCB7dmFsdWU6IGhhc093blByb3BlcnR5fSk7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scztcbiAgICBmdW5jdGlvbiBpcyhsZWZ0LCByaWdodCkge1xuICAgICAgaWYgKGxlZnQgPT09IHJpZ2h0KVxuICAgICAgICByZXR1cm4gbGVmdCAhPT0gMCB8fCAxIC8gbGVmdCA9PT0gMSAvIHJpZ2h0O1xuICAgICAgcmV0dXJuIGxlZnQgIT09IGxlZnQgJiYgcmlnaHQgIT09IHJpZ2h0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnaXMnLCBtZXRob2QoaXMpKTtcbiAgICBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgIHZhciBwcm9wcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSk7XG4gICAgICB2YXIgcCxcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG4gICAgICBmb3IgKHAgPSAwOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BzW3BdXSA9IHNvdXJjZVtwcm9wc1twXV07XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnYXNzaWduJywgbWV0aG9kKGFzc2lnbikpO1xuICAgIGZ1bmN0aW9uIG1peGluKHRhcmdldCwgc291cmNlKSB7XG4gICAgICB2YXIgcHJvcHMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpO1xuICAgICAgdmFyIHAsXG4gICAgICAgICAgZGVzY3JpcHRvcixcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG4gICAgICBmb3IgKHAgPSAwOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgICAgZGVzY3JpcHRvciA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBwcm9wc1twXSk7XG4gICAgICAgICRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BzW3BdLCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdtaXhpbicsIG1ldGhvZChtaXhpbikpO1xuICB9XG4gIGZ1bmN0aW9uIGV4cG9ydFN0YXIob2JqZWN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKGFyZ3VtZW50c1tpXSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5hbWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIChmdW5jdGlvbihtb2QsIG5hbWUpIHtcbiAgICAgICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gbW9kW25hbWVdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoYXJndW1lbnRzW2ldLCBuYW1lc1tqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gdG9PYmplY3QodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgIHRocm93ICRUeXBlRXJyb3IoKTtcbiAgICByZXR1cm4gJE9iamVjdCh2YWx1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gc3ByZWFkKCkge1xuICAgIHZhciBydiA9IFtdLFxuICAgICAgICBrID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlVG9TcHJlYWQgPSB0b09iamVjdChhcmd1bWVudHNbaV0pO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZVRvU3ByZWFkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHJ2W2srK10gPSB2YWx1ZVRvU3ByZWFkW2pdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkge1xuICAgIHdoaWxlIChvYmplY3QgIT09IG51bGwpIHtcbiAgICAgIHZhciByZXN1bHQgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSk7XG4gICAgICBpZiAocmVzdWx0KVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgb2JqZWN0ID0gJGdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpIHtcbiAgICB2YXIgcHJvdG8gPSAkZ2V0UHJvdG90eXBlT2YoaG9tZU9iamVjdCk7XG4gICAgaWYgKCFwcm90bylcbiAgICAgIHRocm93ICRUeXBlRXJyb3IoJ3N1cGVyIGlzIG51bGwnKTtcbiAgICByZXR1cm4gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKTtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSwgYXJncykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmdldClcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmNhbGwoc2VsZikuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuICAgIHRocm93ICRUeXBlRXJyb3IoXCJzdXBlciBoYXMgbm8gbWV0aG9kICdcIiArIG5hbWUgKyBcIicuXCIpO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyR2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZ2V0KVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChzZWxmKTtcbiAgICAgIGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcilcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJTZXQoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnNldCkge1xuICAgICAgZGVzY3JpcHRvci5zZXQuY2FsbChzZWxmLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHRocm93ICRUeXBlRXJyb3IoXCJzdXBlciBoYXMgbm8gc2V0dGVyICdcIiArIG5hbWUgKyBcIicuXCIpO1xuICB9XG4gIGZ1bmN0aW9uIGdldERlc2NyaXB0b3JzKG9iamVjdCkge1xuICAgIHZhciBkZXNjcmlwdG9ycyA9IHt9LFxuICAgICAgICBuYW1lLFxuICAgICAgICBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIGRlc2NyaXB0b3JzW25hbWVdID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gZGVzY3JpcHRvcnM7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlQ2xhc3MoY3Rvciwgb2JqZWN0LCBzdGF0aWNPYmplY3QsIHN1cGVyQ2xhc3MpIHtcbiAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnY29uc3RydWN0b3InLCB7XG4gICAgICB2YWx1ZTogY3RvcixcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY3Rvci5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSAkY3JlYXRlKGdldFByb3RvUGFyZW50KHN1cGVyQ2xhc3MpLCBnZXREZXNjcmlwdG9ycyhvYmplY3QpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBvYmplY3Q7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShjdG9yLCAncHJvdG90eXBlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHJldHVybiAkZGVmaW5lUHJvcGVydGllcyhjdG9yLCBnZXREZXNjcmlwdG9ycyhzdGF0aWNPYmplY3QpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRQcm90b1BhcmVudChzdXBlckNsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcHJvdG90eXBlID0gc3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgICBpZiAoJE9iamVjdChwcm90b3R5cGUpID09PSBwcm90b3R5cGUgfHwgcHJvdG90eXBlID09PSBudWxsKVxuICAgICAgICByZXR1cm4gc3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgfVxuICAgIGlmIChzdXBlckNsYXNzID09PSBudWxsKVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICB9XG4gIGZ1bmN0aW9uIGRlZmF1bHRTdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgYXJncykge1xuICAgIGlmICgkZ2V0UHJvdG90eXBlT2YoaG9tZU9iamVjdCkgIT09IG51bGwpXG4gICAgICBzdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgJ2NvbnN0cnVjdG9yJywgYXJncyk7XG4gIH1cbiAgdmFyIFNUX05FV0JPUk4gPSAwO1xuICB2YXIgU1RfRVhFQ1VUSU5HID0gMTtcbiAgdmFyIFNUX1NVU1BFTkRFRCA9IDI7XG4gIHZhciBTVF9DTE9TRUQgPSAzO1xuICB2YXIgRU5EX1NUQVRFID0gLTI7XG4gIHZhciBSRVRIUk9XX1NUQVRFID0gLTM7XG4gIGZ1bmN0aW9uIGFkZEl0ZXJhdG9yKG9iamVjdCkge1xuICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIFN5bWJvbC5pdGVyYXRvciwgbm9uRW51bShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRJbnRlcm5hbEVycm9yKHN0YXRlKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignVHJhY2V1ciBjb21waWxlciBidWc6IGludmFsaWQgc3RhdGUgaW4gc3RhdGUgbWFjaGluZTogJyArIHN0YXRlKTtcbiAgfVxuICBmdW5jdGlvbiBHZW5lcmF0b3JDb250ZXh0KCkge1xuICAgIHRoaXMuc3RhdGUgPSAwO1xuICAgIHRoaXMuR1N0YXRlID0gU1RfTkVXQk9STjtcbiAgICB0aGlzLnN0b3JlZEV4Y2VwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmZpbmFsbHlGYWxsVGhyb3VnaCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNlbnRfID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucmV0dXJuVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50cnlTdGFja18gPSBbXTtcbiAgfVxuICBHZW5lcmF0b3JDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBwdXNoVHJ5OiBmdW5jdGlvbihjYXRjaFN0YXRlLCBmaW5hbGx5U3RhdGUpIHtcbiAgICAgIGlmIChmaW5hbGx5U3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZpbmFsbHlGYWxsVGhyb3VnaCA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeVN0YWNrXy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmICh0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2ggPSB0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmluYWxseUZhbGxUaHJvdWdoID09PSBudWxsKVxuICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaCA9IFJFVEhST1dfU1RBVEU7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe1xuICAgICAgICAgIGZpbmFsbHk6IGZpbmFsbHlTdGF0ZSxcbiAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2g6IGZpbmFsbHlGYWxsVGhyb3VnaFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChjYXRjaFN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe2NhdGNoOiBjYXRjaFN0YXRlfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwb3BUcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50cnlTdGFja18ucG9wKCk7XG4gICAgfSxcbiAgICBnZXQgc2VudCgpIHtcbiAgICAgIHRoaXMubWF5YmVUaHJvdygpO1xuICAgICAgcmV0dXJuIHRoaXMuc2VudF87XG4gICAgfSxcbiAgICBzZXQgc2VudCh2KSB7XG4gICAgICB0aGlzLnNlbnRfID0gdjtcbiAgICB9LFxuICAgIGdldCBzZW50SWdub3JlVGhyb3coKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZW50XztcbiAgICB9LFxuICAgIG1heWJlVGhyb3c6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aW9uID09PSAndGhyb3cnKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uID0gJ25leHQnO1xuICAgICAgICB0aHJvdyB0aGlzLnNlbnRfO1xuICAgICAgfVxuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgICBjYXNlIEVORF9TVEFURTpcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgY2FzZSBSRVRIUk9XX1NUQVRFOlxuICAgICAgICAgIHRocm93IHRoaXMuc3RvcmVkRXhjZXB0aW9uO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IGdldEludGVybmFsRXJyb3IodGhpcy5zdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBnZXROZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCBhY3Rpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgICAgc3dpdGNoIChjdHguR1N0YXRlKSB7XG4gICAgICAgIGNhc2UgU1RfRVhFQ1VUSU5HOlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigoXCJcXFwiXCIgKyBhY3Rpb24gKyBcIlxcXCIgb24gZXhlY3V0aW5nIGdlbmVyYXRvclwiKSk7XG4gICAgICAgIGNhc2UgU1RfQ0xPU0VEOlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigoXCJcXFwiXCIgKyBhY3Rpb24gKyBcIlxcXCIgb24gY2xvc2VkIGdlbmVyYXRvclwiKSk7XG4gICAgICAgIGNhc2UgU1RfTkVXQk9STjpcbiAgICAgICAgICBpZiAoYWN0aW9uID09PSAndGhyb3cnKSB7XG4gICAgICAgICAgICBjdHguR1N0YXRlID0gU1RfQ0xPU0VEO1xuICAgICAgICAgICAgdGhyb3cgeDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRocm93ICRUeXBlRXJyb3IoJ1NlbnQgdmFsdWUgdG8gbmV3Ym9ybiBnZW5lcmF0b3InKTtcbiAgICAgICAgY2FzZSBTVF9TVVNQRU5ERUQ6XG4gICAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0VYRUNVVElORztcbiAgICAgICAgICBjdHguYWN0aW9uID0gYWN0aW9uO1xuICAgICAgICAgIGN0eC5zZW50ID0geDtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBtb3ZlTmV4dChjdHgpO1xuICAgICAgICAgIHZhciBkb25lID0gdmFsdWUgPT09IGN0eDtcbiAgICAgICAgICBpZiAoZG9uZSlcbiAgICAgICAgICAgIHZhbHVlID0gY3R4LnJldHVyblZhbHVlO1xuICAgICAgICAgIGN0eC5HU3RhdGUgPSBkb25lID8gU1RfQ0xPU0VEIDogU1RfU1VTUEVOREVEO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBkb25lOiBkb25lXG4gICAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGdlbmVyYXRvcldyYXAoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHZhciBtb3ZlTmV4dCA9IGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpO1xuICAgIHZhciBjdHggPSBuZXcgR2VuZXJhdG9yQ29udGV4dCgpO1xuICAgIHJldHVybiBhZGRJdGVyYXRvcih7XG4gICAgICBuZXh0OiBnZXROZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCAnbmV4dCcpLFxuICAgICAgdGhyb3c6IGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsICd0aHJvdycpXG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gQXN5bmNGdW5jdGlvbkNvbnRleHQoKSB7XG4gICAgR2VuZXJhdG9yQ29udGV4dC5jYWxsKHRoaXMpO1xuICAgIHRoaXMuZXJyID0gdW5kZWZpbmVkO1xuICAgIHZhciBjdHggPSB0aGlzO1xuICAgIGN0eC5yZXN1bHQgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGN0eC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIGN0eC5yZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG4gIH1cbiAgQXN5bmNGdW5jdGlvbkNvbnRleHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHZW5lcmF0b3JDb250ZXh0LnByb3RvdHlwZSk7XG4gIEFzeW5jRnVuY3Rpb25Db250ZXh0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICAgIGNhc2UgRU5EX1NUQVRFOlxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIFJFVEhST1dfU1RBVEU6XG4gICAgICAgIHRoaXMucmVqZWN0KHRoaXMuc3RvcmVkRXhjZXB0aW9uKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMucmVqZWN0KGdldEludGVybmFsRXJyb3IodGhpcy5zdGF0ZSkpO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gYXN5bmNXcmFwKGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICB2YXIgbW92ZU5leHQgPSBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKTtcbiAgICB2YXIgY3R4ID0gbmV3IEFzeW5jRnVuY3Rpb25Db250ZXh0KCk7XG4gICAgY3R4LmNyZWF0ZUNhbGxiYWNrID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBjdHguc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgY3R4LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgICB9O1xuICAgIH07XG4gICAgY3R4LmNyZWF0ZUVycmJhY2sgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjdHguc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgY3R4LmVyciA9IGVycjtcbiAgICAgICAgbW92ZU5leHQoY3R4KTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBtb3ZlTmV4dChjdHgpO1xuICAgIHJldHVybiBjdHgucmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oY3R4KSB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBpbm5lckZ1bmN0aW9uLmNhbGwoc2VsZiwgY3R4KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBjdHguc3RvcmVkRXhjZXB0aW9uID0gZXg7XG4gICAgICAgICAgdmFyIGxhc3QgPSBjdHgudHJ5U3RhY2tfW2N0eC50cnlTdGFja18ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgaWYgKCFsYXN0KSB7XG4gICAgICAgICAgICBjdHguR1N0YXRlID0gU1RfQ0xPU0VEO1xuICAgICAgICAgICAgY3R4LnN0YXRlID0gRU5EX1NUQVRFO1xuICAgICAgICAgICAgdGhyb3cgZXg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN0eC5zdGF0ZSA9IGxhc3QuY2F0Y2ggIT09IHVuZGVmaW5lZCA/IGxhc3QuY2F0Y2ggOiBsYXN0LmZpbmFsbHk7XG4gICAgICAgICAgaWYgKGxhc3QuZmluYWxseUZhbGxUaHJvdWdoICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBjdHguZmluYWxseUZhbGxUaHJvdWdoID0gbGFzdC5maW5hbGx5RmFsbFRocm91Z2g7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHNldHVwR2xvYmFscyhnbG9iYWwpIHtcbiAgICBnbG9iYWwuU3ltYm9sID0gU3ltYm9sO1xuICAgIHBvbHlmaWxsT2JqZWN0KGdsb2JhbC5PYmplY3QpO1xuICB9XG4gIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICBnbG9iYWwuJHRyYWNldXJSdW50aW1lID0ge1xuICAgIGFzeW5jV3JhcDogYXN5bmNXcmFwLFxuICAgIGNyZWF0ZUNsYXNzOiBjcmVhdGVDbGFzcyxcbiAgICBkZWZhdWx0U3VwZXJDYWxsOiBkZWZhdWx0U3VwZXJDYWxsLFxuICAgIGV4cG9ydFN0YXI6IGV4cG9ydFN0YXIsXG4gICAgZ2VuZXJhdG9yV3JhcDogZ2VuZXJhdG9yV3JhcCxcbiAgICBzZXRQcm9wZXJ0eTogc2V0UHJvcGVydHksXG4gICAgc2V0dXBHbG9iYWxzOiBzZXR1cEdsb2JhbHMsXG4gICAgc3ByZWFkOiBzcHJlYWQsXG4gICAgc3VwZXJDYWxsOiBzdXBlckNhbGwsXG4gICAgc3VwZXJHZXQ6IHN1cGVyR2V0LFxuICAgIHN1cGVyU2V0OiBzdXBlclNldCxcbiAgICB0b09iamVjdDogdG9PYmplY3QsXG4gICAgdG9Qcm9wZXJ0eTogdG9Qcm9wZXJ0eSxcbiAgICB0eXBlOiB0eXBlcyxcbiAgICB0eXBlb2Y6IHR5cGVPZlxuICB9O1xufSkodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTtcbihmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKG9wdF9zY2hlbWUsIG9wdF91c2VySW5mbywgb3B0X2RvbWFpbiwgb3B0X3BvcnQsIG9wdF9wYXRoLCBvcHRfcXVlcnlEYXRhLCBvcHRfZnJhZ21lbnQpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgaWYgKG9wdF9zY2hlbWUpIHtcbiAgICAgIG91dC5wdXNoKG9wdF9zY2hlbWUsICc6Jyk7XG4gICAgfVxuICAgIGlmIChvcHRfZG9tYWluKSB7XG4gICAgICBvdXQucHVzaCgnLy8nKTtcbiAgICAgIGlmIChvcHRfdXNlckluZm8pIHtcbiAgICAgICAgb3V0LnB1c2gob3B0X3VzZXJJbmZvLCAnQCcpO1xuICAgICAgfVxuICAgICAgb3V0LnB1c2gob3B0X2RvbWFpbik7XG4gICAgICBpZiAob3B0X3BvcnQpIHtcbiAgICAgICAgb3V0LnB1c2goJzonLCBvcHRfcG9ydCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvcHRfcGF0aCkge1xuICAgICAgb3V0LnB1c2gob3B0X3BhdGgpO1xuICAgIH1cbiAgICBpZiAob3B0X3F1ZXJ5RGF0YSkge1xuICAgICAgb3V0LnB1c2goJz8nLCBvcHRfcXVlcnlEYXRhKTtcbiAgICB9XG4gICAgaWYgKG9wdF9mcmFnbWVudCkge1xuICAgICAgb3V0LnB1c2goJyMnLCBvcHRfZnJhZ21lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xuICB9XG4gIDtcbiAgdmFyIHNwbGl0UmUgPSBuZXcgUmVnRXhwKCdeJyArICcoPzonICsgJyhbXjovPyMuXSspJyArICc6KT8nICsgJyg/Oi8vJyArICcoPzooW14vPyNdKilAKT8nICsgJyhbXFxcXHdcXFxcZFxcXFwtXFxcXHUwMTAwLVxcXFx1ZmZmZi4lXSopJyArICcoPzo6KFswLTldKykpPycgKyAnKT8nICsgJyhbXj8jXSspPycgKyAnKD86XFxcXD8oW14jXSopKT8nICsgJyg/OiMoLiopKT8nICsgJyQnKTtcbiAgdmFyIENvbXBvbmVudEluZGV4ID0ge1xuICAgIFNDSEVNRTogMSxcbiAgICBVU0VSX0lORk86IDIsXG4gICAgRE9NQUlOOiAzLFxuICAgIFBPUlQ6IDQsXG4gICAgUEFUSDogNSxcbiAgICBRVUVSWV9EQVRBOiA2LFxuICAgIEZSQUdNRU5UOiA3XG4gIH07XG4gIGZ1bmN0aW9uIHNwbGl0KHVyaSkge1xuICAgIHJldHVybiAodXJpLm1hdGNoKHNwbGl0UmUpKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVEb3RTZWdtZW50cyhwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcvJylcbiAgICAgIHJldHVybiAnLyc7XG4gICAgdmFyIGxlYWRpbmdTbGFzaCA9IHBhdGhbMF0gPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciB0cmFpbGluZ1NsYXNoID0gcGF0aC5zbGljZSgtMSkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciBzZWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIHVwID0gMDtcbiAgICBmb3IgKHZhciBwb3MgPSAwOyBwb3MgPCBzZWdtZW50cy5sZW5ndGg7IHBvcysrKSB7XG4gICAgICB2YXIgc2VnbWVudCA9IHNlZ21lbnRzW3Bvc107XG4gICAgICBzd2l0Y2ggKHNlZ21lbnQpIHtcbiAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy4uJzpcbiAgICAgICAgICBpZiAob3V0Lmxlbmd0aClcbiAgICAgICAgICAgIG91dC5wb3AoKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1cCsrO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG91dC5wdXNoKHNlZ21lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWxlYWRpbmdTbGFzaCkge1xuICAgICAgd2hpbGUgKHVwLS0gPiAwKSB7XG4gICAgICAgIG91dC51bnNoaWZ0KCcuLicpO1xuICAgICAgfVxuICAgICAgaWYgKG91dC5sZW5ndGggPT09IDApXG4gICAgICAgIG91dC5wdXNoKCcuJyk7XG4gICAgfVxuICAgIHJldHVybiBsZWFkaW5nU2xhc2ggKyBvdXQuam9pbignLycpICsgdHJhaWxpbmdTbGFzaDtcbiAgfVxuICBmdW5jdGlvbiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cykge1xuICAgIHZhciBwYXRoID0gcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gfHwgJyc7XG4gICAgcGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlVTRVJfSU5GT10sIHBhcnRzW0NvbXBvbmVudEluZGV4LkRPTUFJTl0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlBPUlRdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUVVFUllfREFUQV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LkZSQUdNRU5UXSk7XG4gIH1cbiAgZnVuY3Rpb24gY2Fub25pY2FsaXplVXJsKHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgfVxuICBmdW5jdGlvbiByZXNvbHZlVXJsKGJhc2UsIHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgdmFyIGJhc2VQYXJ0cyA9IHNwbGl0KGJhc2UpO1xuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdID0gYmFzZVBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSBDb21wb25lbnRJbmRleC5TQ0hFTUU7IGkgPD0gQ29tcG9uZW50SW5kZXguUE9SVDsgaSsrKSB7XG4gICAgICBpZiAoIXBhcnRzW2ldKSB7XG4gICAgICAgIHBhcnRzW2ldID0gYmFzZVBhcnRzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF1bMF0gPT0gJy8nKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH1cbiAgICB2YXIgcGF0aCA9IGJhc2VQYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXTtcbiAgICB2YXIgaW5kZXggPSBwYXRoLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgcGF0aCA9IHBhdGguc2xpY2UoMCwgaW5kZXggKyAxKSArIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICB9XG4gIGZ1bmN0aW9uIGlzQWJzb2x1dGUobmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmFtZVswXSA9PT0gJy8nKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQobmFtZSk7XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgJHRyYWNldXJSdW50aW1lLmNhbm9uaWNhbGl6ZVVybCA9IGNhbm9uaWNhbGl6ZVVybDtcbiAgJHRyYWNldXJSdW50aW1lLmlzQWJzb2x1dGUgPSBpc0Fic29sdXRlO1xuICAkdHJhY2V1clJ1bnRpbWUucmVtb3ZlRG90U2VnbWVudHMgPSByZW1vdmVEb3RTZWdtZW50cztcbiAgJHRyYWNldXJSdW50aW1lLnJlc29sdmVVcmwgPSByZXNvbHZlVXJsO1xufSkoKTtcbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgJF9fMiA9ICR0cmFjZXVyUnVudGltZSxcbiAgICAgIGNhbm9uaWNhbGl6ZVVybCA9ICRfXzIuY2Fub25pY2FsaXplVXJsLFxuICAgICAgcmVzb2x2ZVVybCA9ICRfXzIucmVzb2x2ZVVybCxcbiAgICAgIGlzQWJzb2x1dGUgPSAkX18yLmlzQWJzb2x1dGU7XG4gIHZhciBtb2R1bGVJbnN0YW50aWF0b3JzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGJhc2VVUkw7XG4gIGlmIChnbG9iYWwubG9jYXRpb24gJiYgZ2xvYmFsLmxvY2F0aW9uLmhyZWYpXG4gICAgYmFzZVVSTCA9IHJlc29sdmVVcmwoZ2xvYmFsLmxvY2F0aW9uLmhyZWYsICcuLycpO1xuICBlbHNlXG4gICAgYmFzZVVSTCA9ICcnO1xuICB2YXIgVW5jb2F0ZWRNb2R1bGVFbnRyeSA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlRW50cnkodXJsLCB1bmNvYXRlZE1vZHVsZSkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMudmFsdWVfID0gdW5jb2F0ZWRNb2R1bGU7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFVuY29hdGVkTW9kdWxlRW50cnksIHt9LCB7fSk7XG4gIHZhciBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKHVybCwgZnVuYykge1xuICAgICR0cmFjZXVyUnVudGltZS5zdXBlckNhbGwodGhpcywgJFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yLnByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBbdXJsLCBudWxsXSk7XG4gICAgdGhpcy5mdW5jID0gZnVuYztcbiAgfTtcbiAgdmFyICRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yO1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciwge2dldFVuY29hdGVkTW9kdWxlOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlXylcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVfO1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVfID0gdGhpcy5mdW5jLmNhbGwoZ2xvYmFsKTtcbiAgICB9fSwge30sIFVuY29hdGVkTW9kdWxlRW50cnkpO1xuICBmdW5jdGlvbiBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihuYW1lKSB7XG4gICAgaWYgKCFuYW1lKVxuICAgICAgcmV0dXJuO1xuICAgIHZhciB1cmwgPSBNb2R1bGVTdG9yZS5ub3JtYWxpemUobmFtZSk7XG4gICAgcmV0dXJuIG1vZHVsZUluc3RhbnRpYXRvcnNbdXJsXTtcbiAgfVxuICA7XG4gIHZhciBtb2R1bGVJbnN0YW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2YXIgbGl2ZU1vZHVsZVNlbnRpbmVsID0ge307XG4gIGZ1bmN0aW9uIE1vZHVsZSh1bmNvYXRlZE1vZHVsZSkge1xuICAgIHZhciBpc0xpdmUgPSBhcmd1bWVudHNbMV07XG4gICAgdmFyIGNvYXRlZE1vZHVsZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModW5jb2F0ZWRNb2R1bGUpLmZvckVhY2goKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBnZXR0ZXIsXG4gICAgICAgICAgdmFsdWU7XG4gICAgICBpZiAoaXNMaXZlID09PSBsaXZlTW9kdWxlU2VudGluZWwpIHtcbiAgICAgICAgdmFyIGRlc2NyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih1bmNvYXRlZE1vZHVsZSwgbmFtZSk7XG4gICAgICAgIGlmIChkZXNjci5nZXQpXG4gICAgICAgICAgZ2V0dGVyID0gZGVzY3IuZ2V0O1xuICAgICAgfVxuICAgICAgaWYgKCFnZXR0ZXIpIHtcbiAgICAgICAgdmFsdWUgPSB1bmNvYXRlZE1vZHVsZVtuYW1lXTtcbiAgICAgICAgZ2V0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvYXRlZE1vZHVsZSwgbmFtZSwge1xuICAgICAgICBnZXQ6IGdldHRlcixcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSkpO1xuICAgIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhjb2F0ZWRNb2R1bGUpO1xuICAgIHJldHVybiBjb2F0ZWRNb2R1bGU7XG4gIH1cbiAgdmFyIE1vZHVsZVN0b3JlID0ge1xuICAgIG5vcm1hbGl6ZTogZnVuY3Rpb24obmFtZSwgcmVmZXJlck5hbWUsIHJlZmVyZXJBZGRyZXNzKSB7XG4gICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJtb2R1bGUgbmFtZSBtdXN0IGJlIGEgc3RyaW5nLCBub3QgXCIgKyB0eXBlb2YgbmFtZSk7XG4gICAgICBpZiAoaXNBYnNvbHV0ZShuYW1lKSlcbiAgICAgICAgcmV0dXJuIGNhbm9uaWNhbGl6ZVVybChuYW1lKTtcbiAgICAgIGlmICgvW15cXC5dXFwvXFwuXFwuXFwvLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbW9kdWxlIG5hbWUgZW1iZWRzIC8uLi86ICcgKyBuYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lWzBdID09PSAnLicgJiYgcmVmZXJlck5hbWUpXG4gICAgICAgIHJldHVybiByZXNvbHZlVXJsKHJlZmVyZXJOYW1lLCBuYW1lKTtcbiAgICAgIHJldHVybiBjYW5vbmljYWxpemVVcmwobmFtZSk7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKG5vcm1hbGl6ZWROYW1lKSB7XG4gICAgICB2YXIgbSA9IGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIGlmICghbSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIHZhciBtb2R1bGVJbnN0YW5jZSA9IG1vZHVsZUluc3RhbmNlc1ttLnVybF07XG4gICAgICBpZiAobW9kdWxlSW5zdGFuY2UpXG4gICAgICAgIHJldHVybiBtb2R1bGVJbnN0YW5jZTtcbiAgICAgIG1vZHVsZUluc3RhbmNlID0gTW9kdWxlKG0uZ2V0VW5jb2F0ZWRNb2R1bGUoKSwgbGl2ZU1vZHVsZVNlbnRpbmVsKTtcbiAgICAgIHJldHVybiBtb2R1bGVJbnN0YW5jZXNbbS51cmxdID0gbW9kdWxlSW5zdGFuY2U7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKG5vcm1hbGl6ZWROYW1lLCBtb2R1bGUpIHtcbiAgICAgIG5vcm1hbGl6ZWROYW1lID0gU3RyaW5nKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdID0gbmV3IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lLCAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgICB9KSk7XG4gICAgICBtb2R1bGVJbnN0YW5jZXNbbm9ybWFsaXplZE5hbWVdID0gbW9kdWxlO1xuICAgIH0sXG4gICAgZ2V0IGJhc2VVUkwoKSB7XG4gICAgICByZXR1cm4gYmFzZVVSTDtcbiAgICB9LFxuICAgIHNldCBiYXNlVVJMKHYpIHtcbiAgICAgIGJhc2VVUkwgPSBTdHJpbmcodik7XG4gICAgfSxcbiAgICByZWdpc3Rlck1vZHVsZTogZnVuY3Rpb24obmFtZSwgZnVuYykge1xuICAgICAgdmFyIG5vcm1hbGl6ZWROYW1lID0gTW9kdWxlU3RvcmUubm9ybWFsaXplKG5hbWUpO1xuICAgICAgaWYgKG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2R1cGxpY2F0ZSBtb2R1bGUgbmFtZWQgJyArIG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdID0gbmV3IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lLCBmdW5jKTtcbiAgICB9LFxuICAgIGJ1bmRsZVN0b3JlOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbihuYW1lLCBkZXBzLCBmdW5jKSB7XG4gICAgICBpZiAoIWRlcHMgfHwgIWRlcHMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmFtZSwgZnVuYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJ1bmRsZVN0b3JlW25hbWVdID0ge1xuICAgICAgICAgIGRlcHM6IGRlcHMsXG4gICAgICAgICAgZXhlY3V0ZTogZnVuY1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0QW5vbnltb3VzTW9kdWxlOiBmdW5jdGlvbihmdW5jKSB7XG4gICAgICByZXR1cm4gbmV3IE1vZHVsZShmdW5jLmNhbGwoZ2xvYmFsKSwgbGl2ZU1vZHVsZVNlbnRpbmVsKTtcbiAgICB9LFxuICAgIGdldEZvclRlc3Rpbmc6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciAkX18wID0gdGhpcztcbiAgICAgIGlmICghdGhpcy50ZXN0aW5nUHJlZml4Xykge1xuICAgICAgICBPYmplY3Qua2V5cyhtb2R1bGVJbnN0YW5jZXMpLnNvbWUoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHZhciBtID0gLyh0cmFjZXVyQFteXFwvXSpcXC8pLy5leGVjKGtleSk7XG4gICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICRfXzAudGVzdGluZ1ByZWZpeF8gPSBtWzFdO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5nZXQodGhpcy50ZXN0aW5nUHJlZml4XyArIG5hbWUpO1xuICAgIH1cbiAgfTtcbiAgTW9kdWxlU3RvcmUuc2V0KCdAdHJhY2V1ci9zcmMvcnVudGltZS9Nb2R1bGVTdG9yZScsIG5ldyBNb2R1bGUoe01vZHVsZVN0b3JlOiBNb2R1bGVTdG9yZX0pKTtcbiAgdmFyIHNldHVwR2xvYmFscyA9ICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHM7XG4gICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHMgPSBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgfTtcbiAgJHRyYWNldXJSdW50aW1lLk1vZHVsZVN0b3JlID0gTW9kdWxlU3RvcmU7XG4gIGdsb2JhbC5TeXN0ZW0gPSB7XG4gICAgcmVnaXN0ZXI6IE1vZHVsZVN0b3JlLnJlZ2lzdGVyLmJpbmQoTW9kdWxlU3RvcmUpLFxuICAgIGdldDogTW9kdWxlU3RvcmUuZ2V0LFxuICAgIHNldDogTW9kdWxlU3RvcmUuc2V0LFxuICAgIG5vcm1hbGl6ZTogTW9kdWxlU3RvcmUubm9ybWFsaXplXG4gIH07XG4gICR0cmFjZXVyUnVudGltZS5nZXRNb2R1bGVJbXBsID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpbnN0YW50aWF0b3IgPSBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihuYW1lKTtcbiAgICByZXR1cm4gaW5zdGFudGlhdG9yICYmIGluc3RhbnRpYXRvci5nZXRVbmNvYXRlZE1vZHVsZSgpO1xuICB9O1xufSkodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCI7XG4gIHZhciB0b09iamVjdCA9ICR0cmFjZXVyUnVudGltZS50b09iamVjdDtcbiAgZnVuY3Rpb24gdG9VaW50MzIoeCkge1xuICAgIHJldHVybiB4IHwgMDtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCB0b09iamVjdCgpIHtcbiAgICAgIHJldHVybiB0b09iamVjdDtcbiAgICB9LFxuICAgIGdldCB0b1VpbnQzMigpIHtcbiAgICAgIHJldHVybiB0b1VpbnQzMjtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyICRfXzQ7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIjtcbiAgdmFyICRfXzUgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIiksXG4gICAgICB0b09iamVjdCA9ICRfXzUudG9PYmplY3QsXG4gICAgICB0b1VpbnQzMiA9ICRfXzUudG9VaW50MzI7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX0tFWVMgPSAxO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMgPSAyO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTID0gMztcbiAgdmFyIEFycmF5SXRlcmF0b3IgPSBmdW5jdGlvbiBBcnJheUl0ZXJhdG9yKCkge307XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKEFycmF5SXRlcmF0b3IsICgkX180ID0ge30sIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX180LCBcIm5leHRcIiwge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IHRvT2JqZWN0KHRoaXMpO1xuICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuaXRlcmF0b3JPYmplY3RfO1xuICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QgaXMgbm90IGFuIEFycmF5SXRlcmF0b3InKTtcbiAgICAgIH1cbiAgICAgIHZhciBpbmRleCA9IGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfO1xuICAgICAgdmFyIGl0ZW1LaW5kID0gaXRlcmF0b3IuYXJyYXlJdGVyYXRpb25LaW5kXztcbiAgICAgIHZhciBsZW5ndGggPSB0b1VpbnQzMihhcnJheS5sZW5ndGgpO1xuICAgICAgaWYgKGluZGV4ID49IGxlbmd0aCkge1xuICAgICAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IEluZmluaXR5O1xuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QodW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gaW5kZXggKyAxO1xuICAgICAgaWYgKGl0ZW1LaW5kID09IEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTKVxuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoYXJyYXlbaW5kZXhdLCBmYWxzZSk7XG4gICAgICBpZiAoaXRlbUtpbmQgPT0gQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTKVxuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoW2luZGV4LCBhcnJheVtpbmRleF1dLCBmYWxzZSk7XG4gICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoaW5kZXgsIGZhbHNlKTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCBPYmplY3QuZGVmaW5lUHJvcGVydHkoJF9fNCwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgJF9fNCksIHt9KTtcbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlJdGVyYXRvcihhcnJheSwga2luZCkge1xuICAgIHZhciBvYmplY3QgPSB0b09iamVjdChhcnJheSk7XG4gICAgdmFyIGl0ZXJhdG9yID0gbmV3IEFycmF5SXRlcmF0b3I7XG4gICAgaXRlcmF0b3IuaXRlcmF0b3JPYmplY3RfID0gb2JqZWN0O1xuICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gMDtcbiAgICBpdGVyYXRvci5hcnJheUl0ZXJhdGlvbktpbmRfID0ga2luZDtcbiAgICByZXR1cm4gaXRlcmF0b3I7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QodmFsdWUsIGRvbmUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZG9uZTogZG9uZVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZW50cmllcygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMpO1xuICB9XG4gIGZ1bmN0aW9uIGtleXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9LRVlTKTtcbiAgfVxuICBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IGVudHJpZXMoKSB7XG4gICAgICByZXR1cm4gZW50cmllcztcbiAgICB9LFxuICAgIGdldCBrZXlzKCkge1xuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcbiAgICBnZXQgdmFsdWVzKCkge1xuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIjtcbiAgdmFyICRfX2RlZmF1bHQgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgICB2YXIgbGVuZ3RoID0gcXVldWUucHVzaChbY2FsbGJhY2ssIGFyZ10pO1xuICAgIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgICB9XG4gIH07XG4gIHZhciBicm93c2VyR2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHt9O1xuICB2YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuICBmdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIG5vZGUuZGF0YSA9IChpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMik7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICAgIH07XG4gIH1cbiAgdmFyIHF1ZXVlID0gW107XG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0dXBsZSA9IHF1ZXVlW2ldO1xuICAgICAgdmFyIGNhbGxiYWNrID0gdHVwbGVbMF0sXG4gICAgICAgICAgYXJnID0gdHVwbGVbMV07XG4gICAgICBjYWxsYmFjayhhcmcpO1xuICAgIH1cbiAgICBxdWV1ZSA9IFtdO1xuICB9XG4gIHZhciBzY2hlZHVsZUZsdXNoO1xuICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xuICB9IGVsc2UgaWYgKEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbiAgfSBlbHNlIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xuICB9XG4gIHJldHVybiB7Z2V0IGRlZmF1bHQoKSB7XG4gICAgICByZXR1cm4gJF9fZGVmYXVsdDtcbiAgICB9fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCI7XG4gIHZhciBhc3luYyA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIikuZGVmYXVsdDtcbiAgZnVuY3Rpb24gaXNQcm9taXNlKHgpIHtcbiAgICByZXR1cm4geCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeC5zdGF0dXNfICE9PSB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gY2hhaW4ocHJvbWlzZSkge1xuICAgIHZhciBvblJlc29sdmUgPSBhcmd1bWVudHNbMV0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzFdIDogKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH0pO1xuICAgIHZhciBvblJlamVjdCA9IGFyZ3VtZW50c1syXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMl0gOiAoZnVuY3Rpb24oZSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9KTtcbiAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZChwcm9taXNlLmNvbnN0cnVjdG9yKTtcbiAgICBzd2l0Y2ggKHByb21pc2Uuc3RhdHVzXykge1xuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHRocm93IFR5cGVFcnJvcjtcbiAgICAgIGNhc2UgJ3BlbmRpbmcnOlxuICAgICAgICBwcm9taXNlLm9uUmVzb2x2ZV8ucHVzaChbZGVmZXJyZWQsIG9uUmVzb2x2ZV0pO1xuICAgICAgICBwcm9taXNlLm9uUmVqZWN0Xy5wdXNoKFtkZWZlcnJlZCwgb25SZWplY3RdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXNvbHZlZCc6XG4gICAgICAgIHByb21pc2VSZWFjdChkZWZlcnJlZCwgb25SZXNvbHZlLCBwcm9taXNlLnZhbHVlXyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVqZWN0ZWQnOlxuICAgICAgICBwcm9taXNlUmVhY3QoZGVmZXJyZWQsIG9uUmVqZWN0LCBwcm9taXNlLnZhbHVlXyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuICBmdW5jdGlvbiBnZXREZWZlcnJlZChDKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5wcm9taXNlID0gbmV3IEMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVzdWx0LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgcmVzdWx0LnJlamVjdCA9IHJlamVjdDtcbiAgICB9KSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB2YXIgUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UocmVzb2x2ZXIpIHtcbiAgICB2YXIgJF9fNiA9IHRoaXM7XG4gICAgdGhpcy5zdGF0dXNfID0gJ3BlbmRpbmcnO1xuICAgIHRoaXMub25SZXNvbHZlXyA9IFtdO1xuICAgIHRoaXMub25SZWplY3RfID0gW107XG4gICAgcmVzb2x2ZXIoKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHByb21pc2VSZXNvbHZlKCRfXzYsIHgpO1xuICAgIH0pLCAoZnVuY3Rpb24ocikge1xuICAgICAgcHJvbWlzZVJlamVjdCgkX182LCByKTtcbiAgICB9KSk7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFByb21pc2UsIHtcbiAgICBjYXRjaDogZnVuY3Rpb24ob25SZWplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdCk7XG4gICAgfSxcbiAgICB0aGVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvblJlc29sdmUgPSBhcmd1bWVudHNbMF0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzBdIDogKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgICB9KTtcbiAgICAgIHZhciBvblJlamVjdCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIHZhciAkX182ID0gdGhpcztcbiAgICAgIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICByZXR1cm4gY2hhaW4odGhpcywgKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgeCA9IHByb21pc2VDb2VyY2UoY29uc3RydWN0b3IsIHgpO1xuICAgICAgICByZXR1cm4geCA9PT0gJF9fNiA/IG9uUmVqZWN0KG5ldyBUeXBlRXJyb3IpIDogaXNQcm9taXNlKHgpID8geC50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpIDogb25SZXNvbHZlKHgpO1xuICAgICAgfSksIG9uUmVqZWN0KTtcbiAgICB9XG4gIH0sIHtcbiAgICByZXNvbHZlOiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXNvbHZlKHgpO1xuICAgICAgfSkpO1xuICAgIH0sXG4gICAgcmVqZWN0OiBmdW5jdGlvbihyKSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZWplY3Qocik7XG4gICAgICB9KSk7XG4gICAgfSxcbiAgICBjYXN0OiBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoeCBpbnN0YW5jZW9mIHRoaXMpXG4gICAgICAgIHJldHVybiB4O1xuICAgICAgaWYgKGlzUHJvbWlzZSh4KSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICAgIGNoYWluKHgsIHJlc3VsdC5yZXNvbHZlLCByZXN1bHQucmVqZWN0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wcm9taXNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZSh4KTtcbiAgICB9LFxuICAgIGFsbDogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICB2YXIgcmVzb2x1dGlvbnMgPSBbXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgKytjb3VudDtcbiAgICAgICAgICB0aGlzLmNhc3QodmFsdWVzW2ldKS50aGVuKGZ1bmN0aW9uKGksIHgpIHtcbiAgICAgICAgICAgIHJlc29sdXRpb25zW2ldID0geDtcbiAgICAgICAgICAgIGlmICgtLWNvdW50ID09PSAwKVxuICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc29sdXRpb25zKTtcbiAgICAgICAgICB9LmJpbmQodW5kZWZpbmVkLCBpKSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIGlmIChjb3VudCA+IDApXG4gICAgICAgICAgICAgIGNvdW50ID0gMDtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50ID09PSAwKVxuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzb2x1dGlvbnMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuICAgIHJhY2U6IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuY2FzdCh2YWx1ZXNbaV0pLnRoZW4oKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoeCk7XG4gICAgICAgICAgfSksIChmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qocik7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIHByb21pc2VSZXNvbHZlKHByb21pc2UsIHgpIHtcbiAgICBwcm9taXNlRG9uZShwcm9taXNlLCAncmVzb2x2ZWQnLCB4LCBwcm9taXNlLm9uUmVzb2x2ZV8pO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VSZWplY3QocHJvbWlzZSwgcikge1xuICAgIHByb21pc2VEb25lKHByb21pc2UsICdyZWplY3RlZCcsIHIsIHByb21pc2Uub25SZWplY3RfKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlRG9uZShwcm9taXNlLCBzdGF0dXMsIHZhbHVlLCByZWFjdGlvbnMpIHtcbiAgICBpZiAocHJvbWlzZS5zdGF0dXNfICE9PSAncGVuZGluZycpXG4gICAgICByZXR1cm47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWFjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb21pc2VSZWFjdChyZWFjdGlvbnNbaV1bMF0sIHJlYWN0aW9uc1tpXVsxXSwgdmFsdWUpO1xuICAgIH1cbiAgICBwcm9taXNlLnN0YXR1c18gPSBzdGF0dXM7XG4gICAgcHJvbWlzZS52YWx1ZV8gPSB2YWx1ZTtcbiAgICBwcm9taXNlLm9uUmVzb2x2ZV8gPSBwcm9taXNlLm9uUmVqZWN0XyA9IHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlUmVhY3QoZGVmZXJyZWQsIGhhbmRsZXIsIHgpIHtcbiAgICBhc3luYygoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgeSA9IGhhbmRsZXIoeCk7XG4gICAgICAgIGlmICh5ID09PSBkZWZlcnJlZC5wcm9taXNlKVxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICAgIGVsc2UgaWYgKGlzUHJvbWlzZSh5KSlcbiAgICAgICAgICBjaGFpbih5LCBkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh5KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuICB2YXIgdGhlbmFibGVTeW1ib2wgPSAnQEB0aGVuYWJsZSc7XG4gIGZ1bmN0aW9uIHByb21pc2VDb2VyY2UoY29uc3RydWN0b3IsIHgpIHtcbiAgICBpZiAoaXNQcm9taXNlKHgpKSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9IGVsc2UgaWYgKHggJiYgdHlwZW9mIHgudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIHAgPSB4W3RoZW5hYmxlU3ltYm9sXTtcbiAgICAgIGlmIChwKSB7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQoY29uc3RydWN0b3IpO1xuICAgICAgICB4W3RoZW5hYmxlU3ltYm9sXSA9IGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgeC50aGVuKGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfVxuICByZXR1cm4ge2dldCBQcm9taXNlKCkge1xuICAgICAgcmV0dXJuIFByb21pc2U7XG4gICAgfX07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdcIjtcbiAgdmFyICR0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciAkaW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUuaW5kZXhPZjtcbiAgdmFyICRsYXN0SW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUubGFzdEluZGV4T2Y7XG4gIGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc2VhcmNoKSB7XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICBpZiAodGhpcyA9PSBudWxsIHx8ICR0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgcmV0dXJuICRpbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHBvcykgPT0gc3RhcnQ7XG4gIH1cbiAgZnVuY3Rpb24gZW5kc1dpdGgoc2VhcmNoKSB7XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICBpZiAodGhpcyA9PSBudWxsIHx8ICR0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvcyA9IHN0cmluZ0xlbmd0aDtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChwb3NpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgICAgIGlmIChpc05hTihwb3MpKSB7XG4gICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZW5kID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICB2YXIgc3RhcnQgPSBlbmQgLSBzZWFyY2hMZW5ndGg7XG4gICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gJGxhc3RJbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHN0YXJ0KSA9PSBzdGFydDtcbiAgfVxuICBmdW5jdGlvbiBjb250YWlucyhzZWFyY2gpIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgcmV0dXJuICRpbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHBvcykgIT0gLTE7XG4gIH1cbiAgZnVuY3Rpb24gcmVwZWF0KGNvdW50KSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIG4gPSBjb3VudCA/IE51bWJlcihjb3VudCkgOiAwO1xuICAgIGlmIChpc05hTihuKSkge1xuICAgICAgbiA9IDA7XG4gICAgfVxuICAgIGlmIChuIDwgMCB8fCBuID09IEluZmluaXR5KSB7XG4gICAgICB0aHJvdyBSYW5nZUVycm9yKCk7XG4gICAgfVxuICAgIGlmIChuID09IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHdoaWxlIChuLS0pIHtcbiAgICAgIHJlc3VsdCArPSBzdHJpbmc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZnVuY3Rpb24gY29kZVBvaW50QXQocG9zaXRpb24pIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgc2l6ZSA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4oaW5kZXgpKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gc2l6ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdmFyIGZpcnN0ID0gc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgIHZhciBzZWNvbmQ7XG4gICAgaWYgKGZpcnN0ID49IDB4RDgwMCAmJiBmaXJzdCA8PSAweERCRkYgJiYgc2l6ZSA+IGluZGV4ICsgMSkge1xuICAgICAgc2Vjb25kID0gc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXggKyAxKTtcbiAgICAgIGlmIChzZWNvbmQgPj0gMHhEQzAwICYmIHNlY29uZCA8PSAweERGRkYpIHtcbiAgICAgICAgcmV0dXJuIChmaXJzdCAtIDB4RDgwMCkgKiAweDQwMCArIHNlY29uZCAtIDB4REMwMCArIDB4MTAwMDA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaXJzdDtcbiAgfVxuICBmdW5jdGlvbiByYXcoY2FsbHNpdGUpIHtcbiAgICB2YXIgcmF3ID0gY2FsbHNpdGUucmF3O1xuICAgIHZhciBsZW4gPSByYXcubGVuZ3RoID4+PiAwO1xuICAgIGlmIChsZW4gPT09IDApXG4gICAgICByZXR1cm4gJyc7XG4gICAgdmFyIHMgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHMgKz0gcmF3W2ldO1xuICAgICAgaWYgKGkgKyAxID09PSBsZW4pXG4gICAgICAgIHJldHVybiBzO1xuICAgICAgcyArPSBhcmd1bWVudHNbKytpXTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZnJvbUNvZGVQb2ludCgpIHtcbiAgICB2YXIgY29kZVVuaXRzID0gW107XG4gICAgdmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbiAgICB2YXIgaGlnaFN1cnJvZ2F0ZTtcbiAgICB2YXIgbG93U3Vycm9nYXRlO1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xuICAgICAgaWYgKCFpc0Zpbml0ZShjb2RlUG9pbnQpIHx8IGNvZGVQb2ludCA8IDAgfHwgY29kZVBvaW50ID4gMHgxMEZGRkYgfHwgZmxvb3IoY29kZVBvaW50KSAhPSBjb2RlUG9pbnQpIHtcbiAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcignSW52YWxpZCBjb2RlIHBvaW50OiAnICsgY29kZVBvaW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2RlUG9pbnQgPD0gMHhGRkZGKSB7XG4gICAgICAgIGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMDtcbiAgICAgICAgaGlnaFN1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgPj4gMTApICsgMHhEODAwO1xuICAgICAgICBsb3dTdXJyb2dhdGUgPSAoY29kZVBvaW50ICUgMHg0MDApICsgMHhEQzAwO1xuICAgICAgICBjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IHN0YXJ0c1dpdGgoKSB7XG4gICAgICByZXR1cm4gc3RhcnRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBlbmRzV2l0aCgpIHtcbiAgICAgIHJldHVybiBlbmRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBjb250YWlucygpIHtcbiAgICAgIHJldHVybiBjb250YWlucztcbiAgICB9LFxuICAgIGdldCByZXBlYXQoKSB7XG4gICAgICByZXR1cm4gcmVwZWF0O1xuICAgIH0sXG4gICAgZ2V0IGNvZGVQb2ludEF0KCkge1xuICAgICAgcmV0dXJuIGNvZGVQb2ludEF0O1xuICAgIH0sXG4gICAgZ2V0IHJhdygpIHtcbiAgICAgIHJldHVybiByYXc7XG4gICAgfSxcbiAgICBnZXQgZnJvbUNvZGVQb2ludCgpIHtcbiAgICAgIHJldHVybiBmcm9tQ29kZVBvaW50O1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiO1xuICB2YXIgUHJvbWlzZSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCIpLlByb21pc2U7XG4gIHZhciAkX185ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiKSxcbiAgICAgIGNvZGVQb2ludEF0ID0gJF9fOS5jb2RlUG9pbnRBdCxcbiAgICAgIGNvbnRhaW5zID0gJF9fOS5jb250YWlucyxcbiAgICAgIGVuZHNXaXRoID0gJF9fOS5lbmRzV2l0aCxcbiAgICAgIGZyb21Db2RlUG9pbnQgPSAkX185LmZyb21Db2RlUG9pbnQsXG4gICAgICByZXBlYXQgPSAkX185LnJlcGVhdCxcbiAgICAgIHJhdyA9ICRfXzkucmF3LFxuICAgICAgc3RhcnRzV2l0aCA9ICRfXzkuc3RhcnRzV2l0aDtcbiAgdmFyICRfXzkgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiKSxcbiAgICAgIGVudHJpZXMgPSAkX185LmVudHJpZXMsXG4gICAgICBrZXlzID0gJF9fOS5rZXlzLFxuICAgICAgdmFsdWVzID0gJF9fOS52YWx1ZXM7XG4gIGZ1bmN0aW9uIG1heWJlRGVmaW5lTWV0aG9kKG9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoIShuYW1lIGluIG9iamVjdCkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlQWRkRnVuY3Rpb25zKG9iamVjdCwgZnVuY3Rpb25zKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmdW5jdGlvbnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gZnVuY3Rpb25zW2ldO1xuICAgICAgdmFyIHZhbHVlID0gZnVuY3Rpb25zW2kgKyAxXTtcbiAgICAgIG1heWJlRGVmaW5lTWV0aG9kKG9iamVjdCwgbmFtZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbFByb21pc2UoZ2xvYmFsKSB7XG4gICAgaWYgKCFnbG9iYWwuUHJvbWlzZSlcbiAgICAgIGdsb2JhbC5Qcm9taXNlID0gUHJvbWlzZTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbFN0cmluZyhTdHJpbmcpIHtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhTdHJpbmcucHJvdG90eXBlLCBbJ2NvZGVQb2ludEF0JywgY29kZVBvaW50QXQsICdjb250YWlucycsIGNvbnRhaW5zLCAnZW5kc1dpdGgnLCBlbmRzV2l0aCwgJ3N0YXJ0c1dpdGgnLCBzdGFydHNXaXRoLCAncmVwZWF0JywgcmVwZWF0XSk7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoU3RyaW5nLCBbJ2Zyb21Db2RlUG9pbnQnLCBmcm9tQ29kZVBvaW50LCAncmF3JywgcmF3XSk7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxBcnJheShBcnJheSwgU3ltYm9sKSB7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoQXJyYXkucHJvdG90eXBlLCBbJ2VudHJpZXMnLCBlbnRyaWVzLCAna2V5cycsIGtleXMsICd2YWx1ZXMnLCB2YWx1ZXNdKTtcbiAgICBpZiAoU3ltYm9sICYmIFN5bWJvbC5pdGVyYXRvcikge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZXMsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGwoZ2xvYmFsKSB7XG4gICAgcG9seWZpbGxQcm9taXNlKGdsb2JhbCk7XG4gICAgcG9seWZpbGxTdHJpbmcoZ2xvYmFsLlN0cmluZyk7XG4gICAgcG9seWZpbGxBcnJheShnbG9iYWwuQXJyYXksIGdsb2JhbC5TeW1ib2wpO1xuICB9XG4gIHBvbHlmaWxsKHRoaXMpO1xuICB2YXIgc2V0dXBHbG9iYWxzID0gJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscztcbiAgJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscyA9IGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICAgIHBvbHlmaWxsKGdsb2JhbCk7XG4gIH07XG4gIHJldHVybiB7fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIjtcbiAgdmFyICRfXzExID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiKTtcbiAgcmV0dXJuIHt9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIiArICcnKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGV2FBU0hcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiAtbyAuL2Rpc3QvbG9kYXNoLmpzYFxuICogQ29weXJpZ2h0IDIwMTItMjAxMyBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS41LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHA6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbjsoZnVuY3Rpb24oKSB7XG5cbiAgLyoqIFVzZWQgYXMgYSBzYWZlIHJlZmVyZW5jZSBmb3IgYHVuZGVmaW5lZGAgaW4gcHJlIEVTNSBlbnZpcm9ubWVudHMgKi9cbiAgdmFyIHVuZGVmaW5lZDtcblxuICAvKiogVXNlZCB0byBwb29sIGFycmF5cyBhbmQgb2JqZWN0cyB1c2VkIGludGVybmFsbHkgKi9cbiAgdmFyIGFycmF5UG9vbCA9IFtdLFxuICAgICAgb2JqZWN0UG9vbCA9IFtdO1xuXG4gIC8qKiBVc2VkIHRvIGdlbmVyYXRlIHVuaXF1ZSBJRHMgKi9cbiAgdmFyIGlkQ291bnRlciA9IDA7XG5cbiAgLyoqIFVzZWQgdG8gcHJlZml4IGtleXMgdG8gYXZvaWQgaXNzdWVzIHdpdGggYF9fcHJvdG9fX2AgYW5kIHByb3BlcnRpZXMgb24gYE9iamVjdC5wcm90b3R5cGVgICovXG4gIHZhciBrZXlQcmVmaXggPSArbmV3IERhdGUgKyAnJztcblxuICAvKiogVXNlZCBhcyB0aGUgc2l6ZSB3aGVuIG9wdGltaXphdGlvbnMgYXJlIGVuYWJsZWQgZm9yIGxhcmdlIGFycmF5cyAqL1xuICB2YXIgbGFyZ2VBcnJheVNpemUgPSA3NTtcblxuICAvKiogVXNlZCBhcyB0aGUgbWF4IHNpemUgb2YgdGhlIGBhcnJheVBvb2xgIGFuZCBgb2JqZWN0UG9vbGAgKi9cbiAgdmFyIG1heFBvb2xTaXplID0gNDA7XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZWN0IGFuZCB0ZXN0IHdoaXRlc3BhY2UgKi9cbiAgdmFyIHdoaXRlc3BhY2UgPSAoXG4gICAgLy8gd2hpdGVzcGFjZVxuICAgICcgXFx0XFx4MEJcXGZcXHhBMFxcdWZlZmYnICtcblxuICAgIC8vIGxpbmUgdGVybWluYXRvcnNcbiAgICAnXFxuXFxyXFx1MjAyOFxcdTIwMjknICtcblxuICAgIC8vIHVuaWNvZGUgY2F0ZWdvcnkgXCJac1wiIHNwYWNlIHNlcGFyYXRvcnNcbiAgICAnXFx1MTY4MFxcdTE4MGVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwYVxcdTIwMmZcXHUyMDVmXFx1MzAwMCdcbiAgKTtcblxuICAvKiogVXNlZCB0byBtYXRjaCBlbXB0eSBzdHJpbmcgbGl0ZXJhbHMgaW4gY29tcGlsZWQgdGVtcGxhdGUgc291cmNlICovXG4gIHZhciByZUVtcHR5U3RyaW5nTGVhZGluZyA9IC9cXGJfX3AgXFwrPSAnJzsvZyxcbiAgICAgIHJlRW1wdHlTdHJpbmdNaWRkbGUgPSAvXFxiKF9fcCBcXCs9KSAnJyBcXCsvZyxcbiAgICAgIHJlRW1wdHlTdHJpbmdUcmFpbGluZyA9IC8oX19lXFwoLio/XFwpfFxcYl9fdFxcKSkgXFwrXFxuJyc7L2c7XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gbWF0Y2ggRVM2IHRlbXBsYXRlIGRlbGltaXRlcnNcbiAgICogaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbGl0ZXJhbHMtc3RyaW5nLWxpdGVyYWxzXG4gICAqL1xuICB2YXIgcmVFc1RlbXBsYXRlID0gL1xcJFxceyhbXlxcXFx9XSooPzpcXFxcLlteXFxcXH1dKikqKVxcfS9nO1xuXG4gIC8qKiBVc2VkIHRvIG1hdGNoIHJlZ2V4cCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcyAqL1xuICB2YXIgcmVGbGFncyA9IC9cXHcqJC87XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZWN0ZWQgbmFtZWQgZnVuY3Rpb25zICovXG4gIHZhciByZUZ1bmNOYW1lID0gL15cXHMqZnVuY3Rpb25bIFxcblxcclxcdF0rXFx3LztcblxuICAvKiogVXNlZCB0byBtYXRjaCBcImludGVycG9sYXRlXCIgdGVtcGxhdGUgZGVsaW1pdGVycyAqL1xuICB2YXIgcmVJbnRlcnBvbGF0ZSA9IC88JT0oW1xcc1xcU10rPyklPi9nO1xuXG4gIC8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgd2hpdGVzcGFjZSBhbmQgemVyb3MgdG8gYmUgcmVtb3ZlZCAqL1xuICB2YXIgcmVMZWFkaW5nU3BhY2VzQW5kWmVyb3MgPSBSZWdFeHAoJ15bJyArIHdoaXRlc3BhY2UgKyAnXSowKyg/PS4kKScpO1xuXG4gIC8qKiBVc2VkIHRvIGVuc3VyZSBjYXB0dXJpbmcgb3JkZXIgb2YgdGVtcGxhdGUgZGVsaW1pdGVycyAqL1xuICB2YXIgcmVOb01hdGNoID0gLygkXikvO1xuXG4gIC8qKiBVc2VkIHRvIGRldGVjdCBmdW5jdGlvbnMgY29udGFpbmluZyBhIGB0aGlzYCByZWZlcmVuY2UgKi9cbiAgdmFyIHJlVGhpcyA9IC9cXGJ0aGlzXFxiLztcblxuICAvKiogVXNlZCB0byBtYXRjaCB1bmVzY2FwZWQgY2hhcmFjdGVycyBpbiBjb21waWxlZCBzdHJpbmcgbGl0ZXJhbHMgKi9cbiAgdmFyIHJlVW5lc2NhcGVkU3RyaW5nID0gL1snXFxuXFxyXFx0XFx1MjAyOFxcdTIwMjlcXFxcXS9nO1xuXG4gIC8qKiBVc2VkIHRvIGFzc2lnbiBkZWZhdWx0IGBjb250ZXh0YCBvYmplY3QgcHJvcGVydGllcyAqL1xuICB2YXIgY29udGV4dFByb3BzID0gW1xuICAgICdBcnJheScsICdCb29sZWFuJywgJ0RhdGUnLCAnRnVuY3Rpb24nLCAnTWF0aCcsICdOdW1iZXInLCAnT2JqZWN0JyxcbiAgICAnUmVnRXhwJywgJ1N0cmluZycsICdfJywgJ2F0dGFjaEV2ZW50JywgJ2NsZWFyVGltZW91dCcsICdpc0Zpbml0ZScsICdpc05hTicsXG4gICAgJ3BhcnNlSW50JywgJ3NldFRpbWVvdXQnXG4gIF07XG5cbiAgLyoqIFVzZWQgdG8gbWFrZSB0ZW1wbGF0ZSBzb3VyY2VVUkxzIGVhc2llciB0byBpZGVudGlmeSAqL1xuICB2YXIgdGVtcGxhdGVDb3VudGVyID0gMDtcblxuICAvKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHNob3J0Y3V0cyAqL1xuICB2YXIgYXJnc0NsYXNzID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgICBhcnJheUNsYXNzID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICAgIGJvb2xDbGFzcyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICAgIGRhdGVDbGFzcyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICAgIGZ1bmNDbGFzcyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgICBudW1iZXJDbGFzcyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgICAgb2JqZWN0Q2xhc3MgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICAgIHJlZ2V4cENsYXNzID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgICBzdHJpbmdDbGFzcyA9ICdbb2JqZWN0IFN0cmluZ10nO1xuXG4gIC8qKiBVc2VkIHRvIGlkZW50aWZ5IG9iamVjdCBjbGFzc2lmaWNhdGlvbnMgdGhhdCBgXy5jbG9uZWAgc3VwcG9ydHMgKi9cbiAgdmFyIGNsb25lYWJsZUNsYXNzZXMgPSB7fTtcbiAgY2xvbmVhYmxlQ2xhc3Nlc1tmdW5jQ2xhc3NdID0gZmFsc2U7XG4gIGNsb25lYWJsZUNsYXNzZXNbYXJnc0NsYXNzXSA9IGNsb25lYWJsZUNsYXNzZXNbYXJyYXlDbGFzc10gPVxuICBjbG9uZWFibGVDbGFzc2VzW2Jvb2xDbGFzc10gPSBjbG9uZWFibGVDbGFzc2VzW2RhdGVDbGFzc10gPVxuICBjbG9uZWFibGVDbGFzc2VzW251bWJlckNsYXNzXSA9IGNsb25lYWJsZUNsYXNzZXNbb2JqZWN0Q2xhc3NdID1cbiAgY2xvbmVhYmxlQ2xhc3Nlc1tyZWdleHBDbGFzc10gPSBjbG9uZWFibGVDbGFzc2VzW3N0cmluZ0NsYXNzXSA9IHRydWU7XG5cbiAgLyoqIFVzZWQgYXMgYW4gaW50ZXJuYWwgYF8uZGVib3VuY2VgIG9wdGlvbnMgb2JqZWN0ICovXG4gIHZhciBkZWJvdW5jZU9wdGlvbnMgPSB7XG4gICAgJ2xlYWRpbmcnOiBmYWxzZSxcbiAgICAnbWF4V2FpdCc6IDAsXG4gICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAgfTtcblxuICAvKiogVXNlZCBhcyB0aGUgcHJvcGVydHkgZGVzY3JpcHRvciBmb3IgYF9fYmluZERhdGFfX2AgKi9cbiAgdmFyIGRlc2NyaXB0b3IgPSB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IGZhbHNlLFxuICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG4gICAgJ3ZhbHVlJzogbnVsbCxcbiAgICAnd3JpdGFibGUnOiBmYWxzZVxuICB9O1xuXG4gIC8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIE9iamVjdCAqL1xuICB2YXIgb2JqZWN0VHlwZXMgPSB7XG4gICAgJ2Jvb2xlYW4nOiBmYWxzZSxcbiAgICAnZnVuY3Rpb24nOiB0cnVlLFxuICAgICdvYmplY3QnOiB0cnVlLFxuICAgICdudW1iZXInOiBmYWxzZSxcbiAgICAnc3RyaW5nJzogZmFsc2UsXG4gICAgJ3VuZGVmaW5lZCc6IGZhbHNlXG4gIH07XG5cbiAgLyoqIFVzZWQgdG8gZXNjYXBlIGNoYXJhY3RlcnMgZm9yIGluY2x1c2lvbiBpbiBjb21waWxlZCBzdHJpbmcgbGl0ZXJhbHMgKi9cbiAgdmFyIHN0cmluZ0VzY2FwZXMgPSB7XG4gICAgJ1xcXFwnOiAnXFxcXCcsXG4gICAgXCInXCI6IFwiJ1wiLFxuICAgICdcXG4nOiAnbicsXG4gICAgJ1xccic6ICdyJyxcbiAgICAnXFx0JzogJ3QnLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICAvKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCAqL1xuICB2YXIgcm9vdCA9IChvYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cpIHx8IHRoaXM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYCAqL1xuICB2YXIgZnJlZUV4cG9ydHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYCAqL1xuICB2YXIgZnJlZU1vZHVsZSA9IG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgICovXG4gIHZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzICYmIGZyZWVFeHBvcnRzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMgb3IgQnJvd3NlcmlmaWVkIGNvZGUgYW5kIHVzZSBpdCBhcyBgcm9vdGAgKi9cbiAgdmFyIGZyZWVHbG9iYWwgPSBvYmplY3RUeXBlc1t0eXBlb2YgZ2xvYmFsXSAmJiBnbG9iYWw7XG4gIGlmIChmcmVlR2xvYmFsICYmIChmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCkpIHtcbiAgICByb290ID0gZnJlZUdsb2JhbDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pbmRleE9mYCB3aXRob3V0IHN1cHBvcnQgZm9yIGJpbmFyeSBzZWFyY2hlc1xuICAgKiBvciBgZnJvbUluZGV4YCBjb25zdHJhaW50cy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSBvciBgLTFgLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgaW5kZXggPSAoZnJvbUluZGV4IHx8IDApIC0gMSxcbiAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGltcGxlbWVudGF0aW9uIG9mIGBfLmNvbnRhaW5zYCBmb3IgY2FjaGUgb2JqZWN0cyB0aGF0IG1pbWljcyB0aGUgcmV0dXJuXG4gICAqIHNpZ25hdHVyZSBvZiBgXy5pbmRleE9mYCBieSByZXR1cm5pbmcgYDBgIGlmIHRoZSB2YWx1ZSBpcyBmb3VuZCwgZWxzZSBgLTFgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGAwYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGAtMWAuXG4gICAqL1xuICBmdW5jdGlvbiBjYWNoZUluZGV4T2YoY2FjaGUsIHZhbHVlKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gICAgY2FjaGUgPSBjYWNoZS5jYWNoZTtcblxuICAgIGlmICh0eXBlID09ICdib29sZWFuJyB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY2FjaGVbdmFsdWVdID8gMCA6IC0xO1xuICAgIH1cbiAgICBpZiAodHlwZSAhPSAnbnVtYmVyJyAmJiB0eXBlICE9ICdzdHJpbmcnKSB7XG4gICAgICB0eXBlID0gJ29iamVjdCc7XG4gICAgfVxuICAgIHZhciBrZXkgPSB0eXBlID09ICdudW1iZXInID8gdmFsdWUgOiBrZXlQcmVmaXggKyB2YWx1ZTtcbiAgICBjYWNoZSA9IChjYWNoZSA9IGNhY2hlW3R5cGVdKSAmJiBjYWNoZVtrZXldO1xuXG4gICAgcmV0dXJuIHR5cGUgPT0gJ29iamVjdCdcbiAgICAgID8gKGNhY2hlICYmIGJhc2VJbmRleE9mKGNhY2hlLCB2YWx1ZSkgPiAtMSA/IDAgOiAtMSlcbiAgICAgIDogKGNhY2hlID8gMCA6IC0xKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgZ2l2ZW4gdmFsdWUgdG8gdGhlIGNvcnJlc3BvbmRpbmcgY2FjaGUgb2JqZWN0LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhZGQgdG8gdGhlIGNhY2hlLlxuICAgKi9cbiAgZnVuY3Rpb24gY2FjaGVQdXNoKHZhbHVlKSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZSxcbiAgICAgICAgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcblxuICAgIGlmICh0eXBlID09ICdib29sZWFuJyB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgICBjYWNoZVt2YWx1ZV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZSAhPSAnbnVtYmVyJyAmJiB0eXBlICE9ICdzdHJpbmcnKSB7XG4gICAgICAgIHR5cGUgPSAnb2JqZWN0JztcbiAgICAgIH1cbiAgICAgIHZhciBrZXkgPSB0eXBlID09ICdudW1iZXInID8gdmFsdWUgOiBrZXlQcmVmaXggKyB2YWx1ZSxcbiAgICAgICAgICB0eXBlQ2FjaGUgPSBjYWNoZVt0eXBlXSB8fCAoY2FjaGVbdHlwZV0gPSB7fSk7XG5cbiAgICAgIGlmICh0eXBlID09ICdvYmplY3QnKSB7XG4gICAgICAgICh0eXBlQ2FjaGVba2V5XSB8fCAodHlwZUNhY2hlW2tleV0gPSBbXSkpLnB1c2godmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHlwZUNhY2hlW2tleV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IGBfLm1heGAgYW5kIGBfLm1pbmAgYXMgdGhlIGRlZmF1bHQgY2FsbGJhY2sgd2hlbiBhIGdpdmVuXG4gICAqIGNvbGxlY3Rpb24gaXMgYSBzdHJpbmcgdmFsdWUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgY2hhcmFjdGVyIHRvIGluc3BlY3QuXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvZGUgdW5pdCBvZiBnaXZlbiBjaGFyYWN0ZXIuXG4gICAqL1xuICBmdW5jdGlvbiBjaGFyQXRDYWxsYmFjayh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5jaGFyQ29kZUF0KDApO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgYnkgYHNvcnRCeWAgdG8gY29tcGFyZSB0cmFuc2Zvcm1lZCBgY29sbGVjdGlvbmAgZWxlbWVudHMsIHN0YWJsZSBzb3J0aW5nXG4gICAqIHRoZW0gaW4gYXNjZW5kaW5nIG9yZGVyLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgb2JqZWN0IHRvIGNvbXBhcmUgdG8gYGJgLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgb2JqZWN0IHRvIGNvbXBhcmUgdG8gYGFgLlxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBzb3J0IG9yZGVyIGluZGljYXRvciBvZiBgMWAgb3IgYC0xYC5cbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhcmVBc2NlbmRpbmcoYSwgYikge1xuICAgIHZhciBhYyA9IGEuY3JpdGVyaWEsXG4gICAgICAgIGJjID0gYi5jcml0ZXJpYSxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gYWMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGFjW2luZGV4XSxcbiAgICAgICAgICBvdGhlciA9IGJjW2luZGV4XTtcblxuICAgICAgaWYgKHZhbHVlICE9PSBvdGhlcikge1xuICAgICAgICBpZiAodmFsdWUgPiBvdGhlciB8fCB0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgPCBvdGhlciB8fCB0eXBlb2Ygb3RoZXIgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRml4ZXMgYW4gYEFycmF5I3NvcnRgIGJ1ZyBpbiB0aGUgSlMgZW5naW5lIGVtYmVkZGVkIGluIEFkb2JlIGFwcGxpY2F0aW9uc1xuICAgIC8vIHRoYXQgY2F1c2VzIGl0LCB1bmRlciBjZXJ0YWluIGNpcmN1bXN0YW5jZXMsIHRvIHJldHVybiB0aGUgc2FtZSB2YWx1ZSBmb3JcbiAgICAvLyBgYWAgYW5kIGBiYC4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYXNoa2VuYXMvdW5kZXJzY29yZS9wdWxsLzEyNDdcbiAgICAvL1xuICAgIC8vIFRoaXMgYWxzbyBlbnN1cmVzIGEgc3RhYmxlIHNvcnQgaW4gVjggYW5kIG90aGVyIGVuZ2luZXMuXG4gICAgLy8gU2VlIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTkwXG4gICAgcmV0dXJuIGEuaW5kZXggLSBiLmluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjYWNoZSBvYmplY3QgdG8gb3B0aW1pemUgbGluZWFyIHNlYXJjaGVzIG9mIGxhcmdlIGFycmF5cy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgKiBAcmV0dXJucyB7bnVsbHxPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIG9iamVjdCBvciBgbnVsbGAgaWYgY2FjaGluZyBzaG91bGQgbm90IGJlIHVzZWQuXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVDYWNoZShhcnJheSkge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICAgIGZpcnN0ID0gYXJyYXlbMF0sXG4gICAgICAgIG1pZCA9IGFycmF5WyhsZW5ndGggLyAyKSB8IDBdLFxuICAgICAgICBsYXN0ID0gYXJyYXlbbGVuZ3RoIC0gMV07XG5cbiAgICBpZiAoZmlyc3QgJiYgdHlwZW9mIGZpcnN0ID09ICdvYmplY3QnICYmXG4gICAgICAgIG1pZCAmJiB0eXBlb2YgbWlkID09ICdvYmplY3QnICYmIGxhc3QgJiYgdHlwZW9mIGxhc3QgPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGNhY2hlID0gZ2V0T2JqZWN0KCk7XG4gICAgY2FjaGVbJ2ZhbHNlJ10gPSBjYWNoZVsnbnVsbCddID0gY2FjaGVbJ3RydWUnXSA9IGNhY2hlWyd1bmRlZmluZWQnXSA9IGZhbHNlO1xuXG4gICAgdmFyIHJlc3VsdCA9IGdldE9iamVjdCgpO1xuICAgIHJlc3VsdC5hcnJheSA9IGFycmF5O1xuICAgIHJlc3VsdC5jYWNoZSA9IGNhY2hlO1xuICAgIHJlc3VsdC5wdXNoID0gY2FjaGVQdXNoO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGFycmF5W2luZGV4XSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCBieSBgdGVtcGxhdGVgIHRvIGVzY2FwZSBjaGFyYWN0ZXJzIGZvciBpbmNsdXNpb24gaW4gY29tcGlsZWRcbiAgICogc3RyaW5nIGxpdGVyYWxzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2ggVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIGVzY2FwZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBjaGFyYWN0ZXIuXG4gICAqL1xuICBmdW5jdGlvbiBlc2NhcGVTdHJpbmdDaGFyKG1hdGNoKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIHN0cmluZ0VzY2FwZXNbbWF0Y2hdO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYW4gYXJyYXkgZnJvbSB0aGUgYXJyYXkgcG9vbCBvciBjcmVhdGVzIGEgbmV3IG9uZSBpZiB0aGUgcG9vbCBpcyBlbXB0eS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgZnJvbSB0aGUgcG9vbC5cbiAgICovXG4gIGZ1bmN0aW9uIGdldEFycmF5KCkge1xuICAgIHJldHVybiBhcnJheVBvb2wucG9wKCkgfHwgW107XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYmplY3QgZnJvbSB0aGUgb2JqZWN0IHBvb2wgb3IgY3JlYXRlcyBhIG5ldyBvbmUgaWYgdGhlIHBvb2wgaXMgZW1wdHkuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBvYmplY3QgZnJvbSB0aGUgcG9vbC5cbiAgICovXG4gIGZ1bmN0aW9uIGdldE9iamVjdCgpIHtcbiAgICByZXR1cm4gb2JqZWN0UG9vbC5wb3AoKSB8fCB7XG4gICAgICAnYXJyYXknOiBudWxsLFxuICAgICAgJ2NhY2hlJzogbnVsbCxcbiAgICAgICdjcml0ZXJpYSc6IG51bGwsXG4gICAgICAnZmFsc2UnOiBmYWxzZSxcbiAgICAgICdpbmRleCc6IDAsXG4gICAgICAnbnVsbCc6IGZhbHNlLFxuICAgICAgJ251bWJlcic6IG51bGwsXG4gICAgICAnb2JqZWN0JzogbnVsbCxcbiAgICAgICdwdXNoJzogbnVsbCxcbiAgICAgICdzdHJpbmcnOiBudWxsLFxuICAgICAgJ3RydWUnOiBmYWxzZSxcbiAgICAgICd1bmRlZmluZWQnOiBmYWxzZSxcbiAgICAgICd2YWx1ZSc6IG51bGxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIHRoZSBnaXZlbiBhcnJheSBiYWNrIHRvIHRoZSBhcnJheSBwb29sLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byByZWxlYXNlLlxuICAgKi9cbiAgZnVuY3Rpb24gcmVsZWFzZUFycmF5KGFycmF5KSB7XG4gICAgYXJyYXkubGVuZ3RoID0gMDtcbiAgICBpZiAoYXJyYXlQb29sLmxlbmd0aCA8IG1heFBvb2xTaXplKSB7XG4gICAgICBhcnJheVBvb2wucHVzaChhcnJheSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIHRoZSBnaXZlbiBvYmplY3QgYmFjayB0byB0aGUgb2JqZWN0IHBvb2wuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHJlbGVhc2UuXG4gICAqL1xuICBmdW5jdGlvbiByZWxlYXNlT2JqZWN0KG9iamVjdCkge1xuICAgIHZhciBjYWNoZSA9IG9iamVjdC5jYWNoZTtcbiAgICBpZiAoY2FjaGUpIHtcbiAgICAgIHJlbGVhc2VPYmplY3QoY2FjaGUpO1xuICAgIH1cbiAgICBvYmplY3QuYXJyYXkgPSBvYmplY3QuY2FjaGUgPSBvYmplY3QuY3JpdGVyaWEgPSBvYmplY3Qub2JqZWN0ID0gb2JqZWN0Lm51bWJlciA9IG9iamVjdC5zdHJpbmcgPSBvYmplY3QudmFsdWUgPSBudWxsO1xuICAgIGlmIChvYmplY3RQb29sLmxlbmd0aCA8IG1heFBvb2xTaXplKSB7XG4gICAgICBvYmplY3RQb29sLnB1c2gob2JqZWN0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2xpY2VzIHRoZSBgY29sbGVjdGlvbmAgZnJvbSB0aGUgYHN0YXJ0YCBpbmRleCB1cCB0bywgYnV0IG5vdCBpbmNsdWRpbmcsXG4gICAqIHRoZSBgZW5kYCBpbmRleC5cbiAgICpcbiAgICogTm90ZTogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGluc3RlYWQgb2YgYEFycmF5I3NsaWNlYCB0byBzdXBwb3J0IG5vZGUgbGlzdHNcbiAgICogaW4gSUUgPCA5IGFuZCB0byBlbnN1cmUgZGVuc2UgYXJyYXlzIGFyZSByZXR1cm5lZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNsaWNlLlxuICAgKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgVGhlIHN0YXJ0IGluZGV4LlxuICAgKiBAcGFyYW0ge251bWJlcn0gZW5kIFRoZSBlbmQgaW5kZXguXG4gICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5LlxuICAgKi9cbiAgZnVuY3Rpb24gc2xpY2UoYXJyYXksIHN0YXJ0LCBlbmQpIHtcbiAgICBzdGFydCB8fCAoc3RhcnQgPSAwKTtcbiAgICBpZiAodHlwZW9mIGVuZCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgZW5kID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gZW5kIC0gc3RhcnQgfHwgMCxcbiAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBhcnJheVtzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgYGxvZGFzaGAgZnVuY3Rpb24gdXNpbmcgdGhlIGdpdmVuIGNvbnRleHQgb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0PXJvb3RdIFRoZSBjb250ZXh0IG9iamVjdC5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBgbG9kYXNoYCBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIHJ1bkluQ29udGV4dChjb250ZXh0KSB7XG4gICAgLy8gQXZvaWQgaXNzdWVzIHdpdGggc29tZSBFUzMgZW52aXJvbm1lbnRzIHRoYXQgYXR0ZW1wdCB0byB1c2UgdmFsdWVzLCBuYW1lZFxuICAgIC8vIGFmdGVyIGJ1aWx0LWluIGNvbnN0cnVjdG9ycyBsaWtlIGBPYmplY3RgLCBmb3IgdGhlIGNyZWF0aW9uIG9mIGxpdGVyYWxzLlxuICAgIC8vIEVTNSBjbGVhcnMgdGhpcyB1cCBieSBzdGF0aW5nIHRoYXQgbGl0ZXJhbHMgbXVzdCB1c2UgYnVpbHQtaW4gY29uc3RydWN0b3JzLlxuICAgIC8vIFNlZSBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDExLjEuNS5cbiAgICBjb250ZXh0ID0gY29udGV4dCA/IF8uZGVmYXVsdHMocm9vdC5PYmplY3QoKSwgY29udGV4dCwgXy5waWNrKHJvb3QsIGNvbnRleHRQcm9wcykpIDogcm9vdDtcblxuICAgIC8qKiBOYXRpdmUgY29uc3RydWN0b3IgcmVmZXJlbmNlcyAqL1xuICAgIHZhciBBcnJheSA9IGNvbnRleHQuQXJyYXksXG4gICAgICAgIEJvb2xlYW4gPSBjb250ZXh0LkJvb2xlYW4sXG4gICAgICAgIERhdGUgPSBjb250ZXh0LkRhdGUsXG4gICAgICAgIEZ1bmN0aW9uID0gY29udGV4dC5GdW5jdGlvbixcbiAgICAgICAgTWF0aCA9IGNvbnRleHQuTWF0aCxcbiAgICAgICAgTnVtYmVyID0gY29udGV4dC5OdW1iZXIsXG4gICAgICAgIE9iamVjdCA9IGNvbnRleHQuT2JqZWN0LFxuICAgICAgICBSZWdFeHAgPSBjb250ZXh0LlJlZ0V4cCxcbiAgICAgICAgU3RyaW5nID0gY29udGV4dC5TdHJpbmcsXG4gICAgICAgIFR5cGVFcnJvciA9IGNvbnRleHQuVHlwZUVycm9yO1xuXG4gICAgLyoqXG4gICAgICogVXNlZCBmb3IgYEFycmF5YCBtZXRob2QgcmVmZXJlbmNlcy5cbiAgICAgKlxuICAgICAqIE5vcm1hbGx5IGBBcnJheS5wcm90b3R5cGVgIHdvdWxkIHN1ZmZpY2UsIGhvd2V2ZXIsIHVzaW5nIGFuIGFycmF5IGxpdGVyYWxcbiAgICAgKiBhdm9pZHMgaXNzdWVzIGluIE5hcndoYWwuXG4gICAgICovXG4gICAgdmFyIGFycmF5UmVmID0gW107XG5cbiAgICAvKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzICovXG4gICAgdmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuICAgIC8qKiBVc2VkIHRvIHJlc3RvcmUgdGhlIG9yaWdpbmFsIGBfYCByZWZlcmVuY2UgaW4gYG5vQ29uZmxpY3RgICovXG4gICAgdmFyIG9sZERhc2ggPSBjb250ZXh0Ll87XG5cbiAgICAvKiogVXNlZCB0byByZXNvbHZlIHRoZSBpbnRlcm5hbCBbW0NsYXNzXV0gb2YgdmFsdWVzICovXG4gICAgdmFyIHRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbiAgICAvKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlICovXG4gICAgdmFyIHJlTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gICAgICBTdHJpbmcodG9TdHJpbmcpXG4gICAgICAgIC5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpXG4gICAgICAgIC5yZXBsYWNlKC90b1N0cmluZ3wgZm9yIFteXFxdXSsvZywgJy4qPycpICsgJyQnXG4gICAgKTtcblxuICAgIC8qKiBOYXRpdmUgbWV0aG9kIHNob3J0Y3V0cyAqL1xuICAgIHZhciBjZWlsID0gTWF0aC5jZWlsLFxuICAgICAgICBjbGVhclRpbWVvdXQgPSBjb250ZXh0LmNsZWFyVGltZW91dCxcbiAgICAgICAgZmxvb3IgPSBNYXRoLmZsb29yLFxuICAgICAgICBmblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgICAgICBnZXRQcm90b3R5cGVPZiA9IGlzTmF0aXZlKGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKSAmJiBnZXRQcm90b3R5cGVPZixcbiAgICAgICAgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eSxcbiAgICAgICAgcHVzaCA9IGFycmF5UmVmLnB1c2gsXG4gICAgICAgIHNldFRpbWVvdXQgPSBjb250ZXh0LnNldFRpbWVvdXQsXG4gICAgICAgIHNwbGljZSA9IGFycmF5UmVmLnNwbGljZSxcbiAgICAgICAgdW5zaGlmdCA9IGFycmF5UmVmLnVuc2hpZnQ7XG5cbiAgICAvKiogVXNlZCB0byBzZXQgbWV0YSBkYXRhIG9uIGZ1bmN0aW9ucyAqL1xuICAgIHZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcbiAgICAgIC8vIElFIDggb25seSBhY2NlcHRzIERPTSBlbGVtZW50c1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIG8gPSB7fSxcbiAgICAgICAgICAgIGZ1bmMgPSBpc05hdGl2ZShmdW5jID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KSAmJiBmdW5jLFxuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYyhvLCBvLCBvKSAmJiBmdW5jO1xuICAgICAgfSBjYXRjaChlKSB7IH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSgpKTtcblxuICAgIC8qIE5hdGl2ZSBtZXRob2Qgc2hvcnRjdXRzIGZvciBtZXRob2RzIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzICovXG4gICAgdmFyIG5hdGl2ZUNyZWF0ZSA9IGlzTmF0aXZlKG5hdGl2ZUNyZWF0ZSA9IE9iamVjdC5jcmVhdGUpICYmIG5hdGl2ZUNyZWF0ZSxcbiAgICAgICAgbmF0aXZlSXNBcnJheSA9IGlzTmF0aXZlKG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KSAmJiBuYXRpdmVJc0FycmF5LFxuICAgICAgICBuYXRpdmVJc0Zpbml0ZSA9IGNvbnRleHQuaXNGaW5pdGUsXG4gICAgICAgIG5hdGl2ZUlzTmFOID0gY29udGV4dC5pc05hTixcbiAgICAgICAgbmF0aXZlS2V5cyA9IGlzTmF0aXZlKG5hdGl2ZUtleXMgPSBPYmplY3Qua2V5cykgJiYgbmF0aXZlS2V5cyxcbiAgICAgICAgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluLFxuICAgICAgICBuYXRpdmVQYXJzZUludCA9IGNvbnRleHQucGFyc2VJbnQsXG4gICAgICAgIG5hdGl2ZVJhbmRvbSA9IE1hdGgucmFuZG9tO1xuXG4gICAgLyoqIFVzZWQgdG8gbG9va3VwIGEgYnVpbHQtaW4gY29uc3RydWN0b3IgYnkgW1tDbGFzc11dICovXG4gICAgdmFyIGN0b3JCeUNsYXNzID0ge307XG4gICAgY3RvckJ5Q2xhc3NbYXJyYXlDbGFzc10gPSBBcnJheTtcbiAgICBjdG9yQnlDbGFzc1tib29sQ2xhc3NdID0gQm9vbGVhbjtcbiAgICBjdG9yQnlDbGFzc1tkYXRlQ2xhc3NdID0gRGF0ZTtcbiAgICBjdG9yQnlDbGFzc1tmdW5jQ2xhc3NdID0gRnVuY3Rpb247XG4gICAgY3RvckJ5Q2xhc3Nbb2JqZWN0Q2xhc3NdID0gT2JqZWN0O1xuICAgIGN0b3JCeUNsYXNzW251bWJlckNsYXNzXSA9IE51bWJlcjtcbiAgICBjdG9yQnlDbGFzc1tyZWdleHBDbGFzc10gPSBSZWdFeHA7XG4gICAgY3RvckJ5Q2xhc3Nbc3RyaW5nQ2xhc3NdID0gU3RyaW5nO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgYGxvZGFzaGAgb2JqZWN0IHdoaWNoIHdyYXBzIHRoZSBnaXZlbiB2YWx1ZSB0byBlbmFibGUgaW50dWl0aXZlXG4gICAgICogbWV0aG9kIGNoYWluaW5nLlxuICAgICAqXG4gICAgICogSW4gYWRkaXRpb24gdG8gTG8tRGFzaCBtZXRob2RzLCB3cmFwcGVycyBhbHNvIGhhdmUgdGhlIGZvbGxvd2luZyBgQXJyYXlgIG1ldGhvZHM6XG4gICAgICogYGNvbmNhdGAsIGBqb2luYCwgYHBvcGAsIGBwdXNoYCwgYHJldmVyc2VgLCBgc2hpZnRgLCBgc2xpY2VgLCBgc29ydGAsIGBzcGxpY2VgLFxuICAgICAqIGFuZCBgdW5zaGlmdGBcbiAgICAgKlxuICAgICAqIENoYWluaW5nIGlzIHN1cHBvcnRlZCBpbiBjdXN0b20gYnVpbGRzIGFzIGxvbmcgYXMgdGhlIGB2YWx1ZWAgbWV0aG9kIGlzXG4gICAgICogaW1wbGljaXRseSBvciBleHBsaWNpdGx5IGluY2x1ZGVkIGluIHRoZSBidWlsZC5cbiAgICAgKlxuICAgICAqIFRoZSBjaGFpbmFibGUgd3JhcHBlciBmdW5jdGlvbnMgYXJlOlxuICAgICAqIGBhZnRlcmAsIGBhc3NpZ25gLCBgYmluZGAsIGBiaW5kQWxsYCwgYGJpbmRLZXlgLCBgY2hhaW5gLCBgY29tcGFjdGAsXG4gICAgICogYGNvbXBvc2VgLCBgY29uY2F0YCwgYGNvdW50QnlgLCBgY3JlYXRlYCwgYGNyZWF0ZUNhbGxiYWNrYCwgYGN1cnJ5YCxcbiAgICAgKiBgZGVib3VuY2VgLCBgZGVmYXVsdHNgLCBgZGVmZXJgLCBgZGVsYXlgLCBgZGlmZmVyZW5jZWAsIGBmaWx0ZXJgLCBgZmxhdHRlbmAsXG4gICAgICogYGZvckVhY2hgLCBgZm9yRWFjaFJpZ2h0YCwgYGZvckluYCwgYGZvckluUmlnaHRgLCBgZm9yT3duYCwgYGZvck93blJpZ2h0YCxcbiAgICAgKiBgZnVuY3Rpb25zYCwgYGdyb3VwQnlgLCBgaW5kZXhCeWAsIGBpbml0aWFsYCwgYGludGVyc2VjdGlvbmAsIGBpbnZlcnRgLFxuICAgICAqIGBpbnZva2VgLCBga2V5c2AsIGBtYXBgLCBgbWF4YCwgYG1lbW9pemVgLCBgbWVyZ2VgLCBgbWluYCwgYG9iamVjdGAsIGBvbWl0YCxcbiAgICAgKiBgb25jZWAsIGBwYWlyc2AsIGBwYXJ0aWFsYCwgYHBhcnRpYWxSaWdodGAsIGBwaWNrYCwgYHBsdWNrYCwgYHB1bGxgLCBgcHVzaGAsXG4gICAgICogYHJhbmdlYCwgYHJlamVjdGAsIGByZW1vdmVgLCBgcmVzdGAsIGByZXZlcnNlYCwgYHNodWZmbGVgLCBgc2xpY2VgLCBgc29ydGAsXG4gICAgICogYHNvcnRCeWAsIGBzcGxpY2VgLCBgdGFwYCwgYHRocm90dGxlYCwgYHRpbWVzYCwgYHRvQXJyYXlgLCBgdHJhbnNmb3JtYCxcbiAgICAgKiBgdW5pb25gLCBgdW5pcWAsIGB1bnNoaWZ0YCwgYHVuemlwYCwgYHZhbHVlc2AsIGB3aGVyZWAsIGB3aXRob3V0YCwgYHdyYXBgLFxuICAgICAqIGFuZCBgemlwYFxuICAgICAqXG4gICAgICogVGhlIG5vbi1jaGFpbmFibGUgd3JhcHBlciBmdW5jdGlvbnMgYXJlOlxuICAgICAqIGBjbG9uZWAsIGBjbG9uZURlZXBgLCBgY29udGFpbnNgLCBgZXNjYXBlYCwgYGV2ZXJ5YCwgYGZpbmRgLCBgZmluZEluZGV4YCxcbiAgICAgKiBgZmluZEtleWAsIGBmaW5kTGFzdGAsIGBmaW5kTGFzdEluZGV4YCwgYGZpbmRMYXN0S2V5YCwgYGhhc2AsIGBpZGVudGl0eWAsXG4gICAgICogYGluZGV4T2ZgLCBgaXNBcmd1bWVudHNgLCBgaXNBcnJheWAsIGBpc0Jvb2xlYW5gLCBgaXNEYXRlYCwgYGlzRWxlbWVudGAsXG4gICAgICogYGlzRW1wdHlgLCBgaXNFcXVhbGAsIGBpc0Zpbml0ZWAsIGBpc0Z1bmN0aW9uYCwgYGlzTmFOYCwgYGlzTnVsbGAsIGBpc051bWJlcmAsXG4gICAgICogYGlzT2JqZWN0YCwgYGlzUGxhaW5PYmplY3RgLCBgaXNSZWdFeHBgLCBgaXNTdHJpbmdgLCBgaXNVbmRlZmluZWRgLCBgam9pbmAsXG4gICAgICogYGxhc3RJbmRleE9mYCwgYG1peGluYCwgYG5vQ29uZmxpY3RgLCBgcGFyc2VJbnRgLCBgcG9wYCwgYHJhbmRvbWAsIGByZWR1Y2VgLFxuICAgICAqIGByZWR1Y2VSaWdodGAsIGByZXN1bHRgLCBgc2hpZnRgLCBgc2l6ZWAsIGBzb21lYCwgYHNvcnRlZEluZGV4YCwgYHJ1bkluQ29udGV4dGAsXG4gICAgICogYHRlbXBsYXRlYCwgYHVuZXNjYXBlYCwgYHVuaXF1ZUlkYCwgYW5kIGB2YWx1ZWBcbiAgICAgKlxuICAgICAqIFRoZSB3cmFwcGVyIGZ1bmN0aW9ucyBgZmlyc3RgIGFuZCBgbGFzdGAgcmV0dXJuIHdyYXBwZWQgdmFsdWVzIHdoZW4gYG5gIGlzXG4gICAgICogcHJvdmlkZWQsIG90aGVyd2lzZSB0aGV5IHJldHVybiB1bndyYXBwZWQgdmFsdWVzLlxuICAgICAqXG4gICAgICogRXhwbGljaXQgY2hhaW5pbmcgY2FuIGJlIGVuYWJsZWQgYnkgdXNpbmcgdGhlIGBfLmNoYWluYCBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAbmFtZSBfXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQGNhdGVnb3J5IENoYWluaW5nXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd3JhcCBpbiBhIGBsb2Rhc2hgIGluc3RhbmNlLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYSBgbG9kYXNoYCBpbnN0YW5jZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHdyYXBwZWQgPSBfKFsxLCAyLCAzXSk7XG4gICAgICpcbiAgICAgKiAvLyByZXR1cm5zIGFuIHVud3JhcHBlZCB2YWx1ZVxuICAgICAqIHdyYXBwZWQucmVkdWNlKGZ1bmN0aW9uKHN1bSwgbnVtKSB7XG4gICAgICogICByZXR1cm4gc3VtICsgbnVtO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IDZcbiAgICAgKlxuICAgICAqIC8vIHJldHVybnMgYSB3cmFwcGVkIHZhbHVlXG4gICAgICogdmFyIHNxdWFyZXMgPSB3cmFwcGVkLm1hcChmdW5jdGlvbihudW0pIHtcbiAgICAgKiAgIHJldHVybiBudW0gKiBudW07XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBfLmlzQXJyYXkoc3F1YXJlcyk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIF8uaXNBcnJheShzcXVhcmVzLnZhbHVlKCkpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsb2Rhc2godmFsdWUpIHtcbiAgICAgIC8vIGRvbid0IHdyYXAgaWYgYWxyZWFkeSB3cmFwcGVkLCBldmVuIGlmIHdyYXBwZWQgYnkgYSBkaWZmZXJlbnQgYGxvZGFzaGAgY29uc3RydWN0b3JcbiAgICAgIHJldHVybiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmICFpc0FycmF5KHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnX193cmFwcGVkX18nKSlcbiAgICAgICA/IHZhbHVlXG4gICAgICAgOiBuZXcgbG9kYXNoV3JhcHBlcih2YWx1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBmYXN0IHBhdGggZm9yIGNyZWF0aW5nIGBsb2Rhc2hgIHdyYXBwZXIgb2JqZWN0cy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gd3JhcCBpbiBhIGBsb2Rhc2hgIGluc3RhbmNlLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hhaW5BbGwgQSBmbGFnIHRvIGVuYWJsZSBjaGFpbmluZyBmb3IgYWxsIG1ldGhvZHNcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGEgYGxvZGFzaGAgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gbG9kYXNoV3JhcHBlcih2YWx1ZSwgY2hhaW5BbGwpIHtcbiAgICAgIHRoaXMuX19jaGFpbl9fID0gISFjaGFpbkFsbDtcbiAgICAgIHRoaXMuX193cmFwcGVkX18gPSB2YWx1ZTtcbiAgICB9XG4gICAgLy8gZW5zdXJlIGBuZXcgbG9kYXNoV3JhcHBlcmAgaXMgYW4gaW5zdGFuY2Ugb2YgYGxvZGFzaGBcbiAgICBsb2Rhc2hXcmFwcGVyLnByb3RvdHlwZSA9IGxvZGFzaC5wcm90b3R5cGU7XG5cbiAgICAvKipcbiAgICAgKiBBbiBvYmplY3QgdXNlZCB0byBmbGFnIGVudmlyb25tZW50cyBmZWF0dXJlcy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEB0eXBlIE9iamVjdFxuICAgICAqL1xuICAgIHZhciBzdXBwb3J0ID0gbG9kYXNoLnN1cHBvcnQgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIERldGVjdCBpZiBmdW5jdGlvbnMgY2FuIGJlIGRlY29tcGlsZWQgYnkgYEZ1bmN0aW9uI3RvU3RyaW5nYFxuICAgICAqIChhbGwgYnV0IFBTMyBhbmQgb2xkZXIgT3BlcmEgbW9iaWxlIGJyb3dzZXJzICYgYXZvaWRlZCBpbiBXaW5kb3dzIDggYXBwcykuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgXy5zdXBwb3J0XG4gICAgICogQHR5cGUgYm9vbGVhblxuICAgICAqL1xuICAgIHN1cHBvcnQuZnVuY0RlY29tcCA9ICFpc05hdGl2ZShjb250ZXh0LldpblJURXJyb3IpICYmIHJlVGhpcy50ZXN0KHJ1bkluQ29udGV4dCk7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlY3QgaWYgYEZ1bmN0aW9uI25hbWVgIGlzIHN1cHBvcnRlZCAoYWxsIGJ1dCBJRSkuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgXy5zdXBwb3J0XG4gICAgICogQHR5cGUgYm9vbGVhblxuICAgICAqL1xuICAgIHN1cHBvcnQuZnVuY05hbWVzID0gdHlwZW9mIEZ1bmN0aW9uLm5hbWUgPT0gJ3N0cmluZyc7XG5cbiAgICAvKipcbiAgICAgKiBCeSBkZWZhdWx0LCB0aGUgdGVtcGxhdGUgZGVsaW1pdGVycyB1c2VkIGJ5IExvLURhc2ggYXJlIHNpbWlsYXIgdG8gdGhvc2UgaW5cbiAgICAgKiBlbWJlZGRlZCBSdWJ5IChFUkIpLiBDaGFuZ2UgdGhlIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmVcbiAgICAgKiBkZWxpbWl0ZXJzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQHR5cGUgT2JqZWN0XG4gICAgICovXG4gICAgbG9kYXNoLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVXNlZCB0byBkZXRlY3QgYGRhdGFgIHByb3BlcnR5IHZhbHVlcyB0byBiZSBIVE1MLWVzY2FwZWQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIF8udGVtcGxhdGVTZXR0aW5nc1xuICAgICAgICogQHR5cGUgUmVnRXhwXG4gICAgICAgKi9cbiAgICAgICdlc2NhcGUnOiAvPCUtKFtcXHNcXFNdKz8pJT4vZyxcblxuICAgICAgLyoqXG4gICAgICAgKiBVc2VkIHRvIGRldGVjdCBjb2RlIHRvIGJlIGV2YWx1YXRlZC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgXy50ZW1wbGF0ZVNldHRpbmdzXG4gICAgICAgKiBAdHlwZSBSZWdFeHBcbiAgICAgICAqL1xuICAgICAgJ2V2YWx1YXRlJzogLzwlKFtcXHNcXFNdKz8pJT4vZyxcblxuICAgICAgLyoqXG4gICAgICAgKiBVc2VkIHRvIGRldGVjdCBgZGF0YWAgcHJvcGVydHkgdmFsdWVzIHRvIGluamVjdC5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgXy50ZW1wbGF0ZVNldHRpbmdzXG4gICAgICAgKiBAdHlwZSBSZWdFeHBcbiAgICAgICAqL1xuICAgICAgJ2ludGVycG9sYXRlJzogcmVJbnRlcnBvbGF0ZSxcblxuICAgICAgLyoqXG4gICAgICAgKiBVc2VkIHRvIHJlZmVyZW5jZSB0aGUgZGF0YSBvYmplY3QgaW4gdGhlIHRlbXBsYXRlIHRleHQuXG4gICAgICAgKlxuICAgICAgICogQG1lbWJlck9mIF8udGVtcGxhdGVTZXR0aW5nc1xuICAgICAgICogQHR5cGUgc3RyaW5nXG4gICAgICAgKi9cbiAgICAgICd2YXJpYWJsZSc6ICcnLFxuXG4gICAgICAvKipcbiAgICAgICAqIFVzZWQgdG8gaW1wb3J0IHZhcmlhYmxlcyBpbnRvIHRoZSBjb21waWxlZCB0ZW1wbGF0ZS5cbiAgICAgICAqXG4gICAgICAgKiBAbWVtYmVyT2YgXy50ZW1wbGF0ZVNldHRpbmdzXG4gICAgICAgKiBAdHlwZSBPYmplY3RcbiAgICAgICAqL1xuICAgICAgJ2ltcG9ydHMnOiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEEgcmVmZXJlbmNlIHRvIHRoZSBgbG9kYXNoYCBmdW5jdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogQG1lbWJlck9mIF8udGVtcGxhdGVTZXR0aW5ncy5pbXBvcnRzXG4gICAgICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICAgICAqL1xuICAgICAgICAnXyc6IGxvZGFzaFxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmJpbmRgIHRoYXQgY3JlYXRlcyB0aGUgYm91bmQgZnVuY3Rpb24gYW5kXG4gICAgICogc2V0cyBpdHMgbWV0YSBkYXRhLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBiaW5kRGF0YSBUaGUgYmluZCBkYXRhIGFycmF5LlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJvdW5kIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VCaW5kKGJpbmREYXRhKSB7XG4gICAgICB2YXIgZnVuYyA9IGJpbmREYXRhWzBdLFxuICAgICAgICAgIHBhcnRpYWxBcmdzID0gYmluZERhdGFbMl0sXG4gICAgICAgICAgdGhpc0FyZyA9IGJpbmREYXRhWzRdO1xuXG4gICAgICBmdW5jdGlvbiBib3VuZCgpIHtcbiAgICAgICAgLy8gYEZ1bmN0aW9uI2JpbmRgIHNwZWNcbiAgICAgICAgLy8gaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS4zLjQuNVxuICAgICAgICBpZiAocGFydGlhbEFyZ3MpIHtcbiAgICAgICAgICAvLyBhdm9pZCBgYXJndW1lbnRzYCBvYmplY3QgZGVvcHRpbWl6YXRpb25zIGJ5IHVzaW5nIGBzbGljZWAgaW5zdGVhZFxuICAgICAgICAgIC8vIG9mIGBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbGAgYW5kIG5vdCBhc3NpZ25pbmcgYGFyZ3VtZW50c2AgdG8gYVxuICAgICAgICAgIC8vIHZhcmlhYmxlIGFzIGEgdGVybmFyeSBleHByZXNzaW9uXG4gICAgICAgICAgdmFyIGFyZ3MgPSBzbGljZShwYXJ0aWFsQXJncyk7XG4gICAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1pbWljIHRoZSBjb25zdHJ1Y3RvcidzIGByZXR1cm5gIGJlaGF2aW9yXG4gICAgICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTMuMi4yXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgYm91bmQpIHtcbiAgICAgICAgICAvLyBlbnN1cmUgYG5ldyBib3VuZGAgaXMgYW4gaW5zdGFuY2Ugb2YgYGZ1bmNgXG4gICAgICAgICAgdmFyIHRoaXNCaW5kaW5nID0gYmFzZUNyZWF0ZShmdW5jLnByb3RvdHlwZSksXG4gICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0JpbmRpbmcsIGFyZ3MgfHwgYXJndW1lbnRzKTtcbiAgICAgICAgICByZXR1cm4gaXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IHRoaXNCaW5kaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MgfHwgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIHNldEJpbmREYXRhKGJvdW5kLCBiaW5kRGF0YSk7XG4gICAgICByZXR1cm4gYm91bmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIHdpdGhvdXQgYXJndW1lbnQganVnZ2xpbmcgb3Igc3VwcG9ydFxuICAgICAqIGZvciBgdGhpc0FyZ2AgYmluZGluZy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwPWZhbHNlXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZyB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBBc3NvY2lhdGVzIGNsb25lcyB3aXRoIHNvdXJjZSBjb3VudGVycGFydHMuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiYXNlQ2xvbmUodmFsdWUsIGlzRGVlcCwgY2FsbGJhY2ssIHN0YWNrQSwgc3RhY2tCKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrKHZhbHVlKTtcbiAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBpbnNwZWN0IFtbQ2xhc3NdXVxuICAgICAgdmFyIGlzT2JqID0gaXNPYmplY3QodmFsdWUpO1xuICAgICAgaWYgKGlzT2JqKSB7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgICAgICAgaWYgKCFjbG9uZWFibGVDbGFzc2VzW2NsYXNzTmFtZV0pIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGN0b3IgPSBjdG9yQnlDbGFzc1tjbGFzc05hbWVdO1xuICAgICAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgICAgIGNhc2UgYm9vbENsYXNzOlxuICAgICAgICAgIGNhc2UgZGF0ZUNsYXNzOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBjdG9yKCt2YWx1ZSk7XG5cbiAgICAgICAgICBjYXNlIG51bWJlckNsYXNzOlxuICAgICAgICAgIGNhc2Ugc3RyaW5nQ2xhc3M6XG4gICAgICAgICAgICByZXR1cm4gbmV3IGN0b3IodmFsdWUpO1xuXG4gICAgICAgICAgY2FzZSByZWdleHBDbGFzczpcbiAgICAgICAgICAgIHJlc3VsdCA9IGN0b3IodmFsdWUuc291cmNlLCByZUZsYWdzLmV4ZWModmFsdWUpKTtcbiAgICAgICAgICAgIHJlc3VsdC5sYXN0SW5kZXggPSB2YWx1ZS5sYXN0SW5kZXg7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgICAgIGlmIChpc0RlZXApIHtcbiAgICAgICAgLy8gY2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBjb3JyZXNwb25kaW5nIGNsb25lXG4gICAgICAgIHZhciBpbml0ZWRTdGFjayA9ICFzdGFja0E7XG4gICAgICAgIHN0YWNrQSB8fCAoc3RhY2tBID0gZ2V0QXJyYXkoKSk7XG4gICAgICAgIHN0YWNrQiB8fCAoc3RhY2tCID0gZ2V0QXJyYXkoKSk7XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHN0YWNrQS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAgIGlmIChzdGFja0FbbGVuZ3RoXSA9PSB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YWNrQltsZW5ndGhdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBpc0FyciA/IGN0b3IodmFsdWUubGVuZ3RoKSA6IHt9O1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGlzQXJyID8gc2xpY2UodmFsdWUpIDogYXNzaWduKHt9LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICAvLyBhZGQgYXJyYXkgcHJvcGVydGllcyBhc3NpZ25lZCBieSBgUmVnRXhwI2V4ZWNgXG4gICAgICBpZiAoaXNBcnIpIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdpbmRleCcpKSB7XG4gICAgICAgICAgcmVzdWx0LmluZGV4ID0gdmFsdWUuaW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdpbnB1dCcpKSB7XG4gICAgICAgICAgcmVzdWx0LmlucHV0ID0gdmFsdWUuaW5wdXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGV4aXQgZm9yIHNoYWxsb3cgY2xvbmVcbiAgICAgIGlmICghaXNEZWVwKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICAvLyBhZGQgdGhlIHNvdXJjZSB2YWx1ZSB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHNcbiAgICAgIC8vIGFuZCBhc3NvY2lhdGUgaXQgd2l0aCBpdHMgY2xvbmVcbiAgICAgIHN0YWNrQS5wdXNoKHZhbHVlKTtcbiAgICAgIHN0YWNrQi5wdXNoKHJlc3VsdCk7XG5cbiAgICAgIC8vIHJlY3Vyc2l2ZWx5IHBvcHVsYXRlIGNsb25lIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cylcbiAgICAgIChpc0FyciA/IGZvckVhY2ggOiBmb3JPd24pKHZhbHVlLCBmdW5jdGlvbihvYmpWYWx1ZSwga2V5KSB7XG4gICAgICAgIHJlc3VsdFtrZXldID0gYmFzZUNsb25lKG9ialZhbHVlLCBpc0RlZXAsIGNhbGxiYWNrLCBzdGFja0EsIHN0YWNrQik7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGluaXRlZFN0YWNrKSB7XG4gICAgICAgIHJlbGVhc2VBcnJheShzdGFja0EpO1xuICAgICAgICByZWxlYXNlQXJyYXkoc3RhY2tCKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlYCB3aXRob3V0IHN1cHBvcnQgZm9yIGFzc2lnbmluZ1xuICAgICAqIHByb3BlcnRpZXMgdG8gdGhlIGNyZWF0ZWQgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvdG90eXBlIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmFzZUNyZWF0ZShwcm90b3R5cGUsIHByb3BlcnRpZXMpIHtcbiAgICAgIHJldHVybiBpc09iamVjdChwcm90b3R5cGUpID8gbmF0aXZlQ3JlYXRlKHByb3RvdHlwZSkgOiB7fTtcbiAgICB9XG4gICAgLy8gZmFsbGJhY2sgZm9yIGJyb3dzZXJzIHdpdGhvdXQgYE9iamVjdC5jcmVhdGVgXG4gICAgaWYgKCFuYXRpdmVDcmVhdGUpIHtcbiAgICAgIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIE9iamVjdCgpIHt9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICAgICAgICBpZiAoaXNPYmplY3QocHJvdG90eXBlKSkge1xuICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgT2JqZWN0O1xuICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQgfHwgY29udGV4dC5PYmplY3QoKTtcbiAgICAgICAgfTtcbiAgICAgIH0oKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY3JlYXRlQ2FsbGJhY2tgIHdpdGhvdXQgc3VwcG9ydCBmb3IgY3JlYXRpbmdcbiAgICAgKiBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja3MuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7Kn0gW2Z1bmM9aWRlbnRpdHldIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGEgY2FsbGJhY2suXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjcmVhdGVkIGNhbGxiYWNrLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYXJnQ291bnRdIFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRoZSBjYWxsYmFjayBhY2NlcHRzLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VDcmVhdGVDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCkge1xuICAgICAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGlkZW50aXR5O1xuICAgICAgfVxuICAgICAgLy8gZXhpdCBlYXJseSBmb3Igbm8gYHRoaXNBcmdgIG9yIGFscmVhZHkgYm91bmQgYnkgYEZ1bmN0aW9uI2JpbmRgXG4gICAgICBpZiAodHlwZW9mIHRoaXNBcmcgPT0gJ3VuZGVmaW5lZCcgfHwgISgncHJvdG90eXBlJyBpbiBmdW5jKSkge1xuICAgICAgICByZXR1cm4gZnVuYztcbiAgICAgIH1cbiAgICAgIHZhciBiaW5kRGF0YSA9IGZ1bmMuX19iaW5kRGF0YV9fO1xuICAgICAgaWYgKHR5cGVvZiBiaW5kRGF0YSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAoc3VwcG9ydC5mdW5jTmFtZXMpIHtcbiAgICAgICAgICBiaW5kRGF0YSA9ICFmdW5jLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgYmluZERhdGEgPSBiaW5kRGF0YSB8fCAhc3VwcG9ydC5mdW5jRGVjb21wO1xuICAgICAgICBpZiAoIWJpbmREYXRhKSB7XG4gICAgICAgICAgdmFyIHNvdXJjZSA9IGZuVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICAgICAgICBpZiAoIXN1cHBvcnQuZnVuY05hbWVzKSB7XG4gICAgICAgICAgICBiaW5kRGF0YSA9ICFyZUZ1bmNOYW1lLnRlc3Qoc291cmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFiaW5kRGF0YSkge1xuICAgICAgICAgICAgLy8gY2hlY2tzIGlmIGBmdW5jYCByZWZlcmVuY2VzIHRoZSBgdGhpc2Aga2V5d29yZCBhbmQgc3RvcmVzIHRoZSByZXN1bHRcbiAgICAgICAgICAgIGJpbmREYXRhID0gcmVUaGlzLnRlc3Qoc291cmNlKTtcbiAgICAgICAgICAgIHNldEJpbmREYXRhKGZ1bmMsIGJpbmREYXRhKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGV4aXQgZWFybHkgaWYgdGhlcmUgYXJlIG5vIGB0aGlzYCByZWZlcmVuY2VzIG9yIGBmdW5jYCBpcyBib3VuZFxuICAgICAgaWYgKGJpbmREYXRhID09PSBmYWxzZSB8fCAoYmluZERhdGEgIT09IHRydWUgJiYgYmluZERhdGFbMV0gJiAxKSkge1xuICAgICAgICByZXR1cm4gZnVuYztcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAoYXJnQ291bnQpIHtcbiAgICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYSwgYik7XG4gICAgICAgIH07XG4gICAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gYmluZChmdW5jLCB0aGlzQXJnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgY3JlYXRlV3JhcHBlcmAgdGhhdCBjcmVhdGVzIHRoZSB3cmFwcGVyIGFuZFxuICAgICAqIHNldHMgaXRzIG1ldGEgZGF0YS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gYmluZERhdGEgVGhlIGJpbmQgZGF0YSBhcnJheS5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiYXNlQ3JlYXRlV3JhcHBlcihiaW5kRGF0YSkge1xuICAgICAgdmFyIGZ1bmMgPSBiaW5kRGF0YVswXSxcbiAgICAgICAgICBiaXRtYXNrID0gYmluZERhdGFbMV0sXG4gICAgICAgICAgcGFydGlhbEFyZ3MgPSBiaW5kRGF0YVsyXSxcbiAgICAgICAgICBwYXJ0aWFsUmlnaHRBcmdzID0gYmluZERhdGFbM10sXG4gICAgICAgICAgdGhpc0FyZyA9IGJpbmREYXRhWzRdLFxuICAgICAgICAgIGFyaXR5ID0gYmluZERhdGFbNV07XG5cbiAgICAgIHZhciBpc0JpbmQgPSBiaXRtYXNrICYgMSxcbiAgICAgICAgICBpc0JpbmRLZXkgPSBiaXRtYXNrICYgMixcbiAgICAgICAgICBpc0N1cnJ5ID0gYml0bWFzayAmIDQsXG4gICAgICAgICAgaXNDdXJyeUJvdW5kID0gYml0bWFzayAmIDgsXG4gICAgICAgICAga2V5ID0gZnVuYztcblxuICAgICAgZnVuY3Rpb24gYm91bmQoKSB7XG4gICAgICAgIHZhciB0aGlzQmluZGluZyA9IGlzQmluZCA/IHRoaXNBcmcgOiB0aGlzO1xuICAgICAgICBpZiAocGFydGlhbEFyZ3MpIHtcbiAgICAgICAgICB2YXIgYXJncyA9IHNsaWNlKHBhcnRpYWxBcmdzKTtcbiAgICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcnRpYWxSaWdodEFyZ3MgfHwgaXNDdXJyeSkge1xuICAgICAgICAgIGFyZ3MgfHwgKGFyZ3MgPSBzbGljZShhcmd1bWVudHMpKTtcbiAgICAgICAgICBpZiAocGFydGlhbFJpZ2h0QXJncykge1xuICAgICAgICAgICAgcHVzaC5hcHBseShhcmdzLCBwYXJ0aWFsUmlnaHRBcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGlzQ3VycnkgJiYgYXJncy5sZW5ndGggPCBhcml0eSkge1xuICAgICAgICAgICAgYml0bWFzayB8PSAxNiAmIH4zMjtcbiAgICAgICAgICAgIHJldHVybiBiYXNlQ3JlYXRlV3JhcHBlcihbZnVuYywgKGlzQ3VycnlCb3VuZCA/IGJpdG1hc2sgOiBiaXRtYXNrICYgfjMpLCBhcmdzLCBudWxsLCB0aGlzQXJnLCBhcml0eV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcmdzIHx8IChhcmdzID0gYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKGlzQmluZEtleSkge1xuICAgICAgICAgIGZ1bmMgPSB0aGlzQmluZGluZ1trZXldO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgYm91bmQpIHtcbiAgICAgICAgICB0aGlzQmluZGluZyA9IGJhc2VDcmVhdGUoZnVuYy5wcm90b3R5cGUpO1xuICAgICAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgICAgICAgICByZXR1cm4gaXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IHRoaXNCaW5kaW5nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHNldEJpbmREYXRhKGJvdW5kLCBiaW5kRGF0YSk7XG4gICAgICByZXR1cm4gYm91bmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZGlmZmVyZW5jZWAgdGhhdCBhY2NlcHRzIGEgc2luZ2xlIGFycmF5XG4gICAgICogb2YgdmFsdWVzIHRvIGV4Y2x1ZGUuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSBhcnJheSBvZiB2YWx1ZXMgdG8gZXhjbHVkZS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZmlsdGVyZWQgdmFsdWVzLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VEaWZmZXJlbmNlKGFycmF5LCB2YWx1ZXMpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGluZGV4T2YgPSBnZXRJbmRleE9mKCksXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICAgIGlzTGFyZ2UgPSBsZW5ndGggPj0gbGFyZ2VBcnJheVNpemUgJiYgaW5kZXhPZiA9PT0gYmFzZUluZGV4T2YsXG4gICAgICAgICAgcmVzdWx0ID0gW107XG5cbiAgICAgIGlmIChpc0xhcmdlKSB7XG4gICAgICAgIHZhciBjYWNoZSA9IGNyZWF0ZUNhY2hlKHZhbHVlcyk7XG4gICAgICAgIGlmIChjYWNoZSkge1xuICAgICAgICAgIGluZGV4T2YgPSBjYWNoZUluZGV4T2Y7XG4gICAgICAgICAgdmFsdWVzID0gY2FjaGU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNMYXJnZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgICAgIGlmIChpbmRleE9mKHZhbHVlcywgdmFsdWUpIDwgMCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzTGFyZ2UpIHtcbiAgICAgICAgcmVsZWFzZU9iamVjdCh2YWx1ZXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mbGF0dGVuYCB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gICAgICogc2hvcnRoYW5kcyBvciBgdGhpc0FyZ2AgYmluZGluZy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGZsYXR0ZW4uXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaXNTaGFsbG93PWZhbHNlXSBBIGZsYWcgdG8gcmVzdHJpY3QgZmxhdHRlbmluZyB0byBhIHNpbmdsZSBsZXZlbC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1N0cmljdD1mYWxzZV0gQSBmbGFnIHRvIHJlc3RyaWN0IGZsYXR0ZW5pbmcgdG8gYXJyYXlzIGFuZCBgYXJndW1lbnRzYCBvYmplY3RzLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4PTBdIFRoZSBpbmRleCB0byBzdGFydCBmcm9tLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBmbGF0dGVuZWQgYXJyYXkuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmFzZUZsYXR0ZW4oYXJyYXksIGlzU2hhbGxvdywgaXNTdHJpY3QsIGZyb21JbmRleCkge1xuICAgICAgdmFyIGluZGV4ID0gKGZyb21JbmRleCB8fCAwKSAtIDEsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICAgIHJlc3VsdCA9IFtdO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG5cbiAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09ICdudW1iZXInXG4gICAgICAgICAgICAmJiAoaXNBcnJheSh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgICAgICAgIC8vIHJlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cylcbiAgICAgICAgICBpZiAoIWlzU2hhbGxvdykge1xuICAgICAgICAgICAgdmFsdWUgPSBiYXNlRmxhdHRlbih2YWx1ZSwgaXNTaGFsbG93LCBpc1N0cmljdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxJbmRleCA9IC0xLFxuICAgICAgICAgICAgICB2YWxMZW5ndGggPSB2YWx1ZS5sZW5ndGgsXG4gICAgICAgICAgICAgIHJlc0luZGV4ID0gcmVzdWx0Lmxlbmd0aDtcblxuICAgICAgICAgIHJlc3VsdC5sZW5ndGggKz0gdmFsTGVuZ3RoO1xuICAgICAgICAgIHdoaWxlICgrK3ZhbEluZGV4IDwgdmFsTGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZVt2YWxJbmRleF07XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFpc1N0cmljdCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCwgd2l0aG91dCBzdXBwb3J0IGZvciBgdGhpc0FyZ2AgYmluZGluZyxcbiAgICAgKiB0aGF0IGFsbG93cyBwYXJ0aWFsIFwiXy53aGVyZVwiIHN0eWxlIGNvbXBhcmlzb25zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IGEgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gICAgICogQHBhcmFtIHsqfSBiIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpbmcgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtpc1doZXJlPWZhbHNlXSBBIGZsYWcgdG8gaW5kaWNhdGUgcGVyZm9ybWluZyBwYXJ0aWFsIGNvbXBhcmlzb25zLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0E9W11dIFRyYWNrcyB0cmF2ZXJzZWQgYGFgIG9iamVjdHMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQj1bXV0gVHJhY2tzIHRyYXZlcnNlZCBgYmAgb2JqZWN0cy5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VJc0VxdWFsKGEsIGIsIGNhbGxiYWNrLCBpc1doZXJlLCBzdGFja0EsIHN0YWNrQikge1xuICAgICAgLy8gdXNlZCB0byBpbmRpY2F0ZSB0aGF0IHdoZW4gY29tcGFyaW5nIG9iamVjdHMsIGBhYCBoYXMgYXQgbGVhc3QgdGhlIHByb3BlcnRpZXMgb2YgYGJgXG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrKGEsIGIpO1xuICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHJldHVybiAhIXJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gZXhpdCBlYXJseSBmb3IgaWRlbnRpY2FsIHZhbHVlc1xuICAgICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgLy8gdHJlYXQgYCswYCB2cy4gYC0wYCBhcyBub3QgZXF1YWxcbiAgICAgICAgcmV0dXJuIGEgIT09IDAgfHwgKDEgLyBhID09IDEgLyBiKTtcbiAgICAgIH1cbiAgICAgIHZhciB0eXBlID0gdHlwZW9mIGEsXG4gICAgICAgICAgb3RoZXJUeXBlID0gdHlwZW9mIGI7XG5cbiAgICAgIC8vIGV4aXQgZWFybHkgZm9yIHVubGlrZSBwcmltaXRpdmUgdmFsdWVzXG4gICAgICBpZiAoYSA9PT0gYSAmJlxuICAgICAgICAgICEoYSAmJiBvYmplY3RUeXBlc1t0eXBlXSkgJiZcbiAgICAgICAgICAhKGIgJiYgb2JqZWN0VHlwZXNbb3RoZXJUeXBlXSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gZXhpdCBlYXJseSBmb3IgYG51bGxgIGFuZCBgdW5kZWZpbmVkYCBhdm9pZGluZyBFUzMncyBGdW5jdGlvbiNjYWxsIGJlaGF2aW9yXG4gICAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjMuNC40XG4gICAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gYSA9PT0gYjtcbiAgICAgIH1cbiAgICAgIC8vIGNvbXBhcmUgW1tDbGFzc11dIG5hbWVzXG4gICAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKSxcbiAgICAgICAgICBvdGhlckNsYXNzID0gdG9TdHJpbmcuY2FsbChiKTtcblxuICAgICAgaWYgKGNsYXNzTmFtZSA9PSBhcmdzQ2xhc3MpIHtcbiAgICAgICAgY2xhc3NOYW1lID0gb2JqZWN0Q2xhc3M7XG4gICAgICB9XG4gICAgICBpZiAob3RoZXJDbGFzcyA9PSBhcmdzQ2xhc3MpIHtcbiAgICAgICAgb3RoZXJDbGFzcyA9IG9iamVjdENsYXNzO1xuICAgICAgfVxuICAgICAgaWYgKGNsYXNzTmFtZSAhPSBvdGhlckNsYXNzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGNhc2UgYm9vbENsYXNzOlxuICAgICAgICBjYXNlIGRhdGVDbGFzczpcbiAgICAgICAgICAvLyBjb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWJlcnMsIGRhdGVzIHRvIG1pbGxpc2Vjb25kcyBhbmQgYm9vbGVhbnNcbiAgICAgICAgICAvLyB0byBgMWAgb3IgYDBgIHRyZWF0aW5nIGludmFsaWQgZGF0ZXMgY29lcmNlZCB0byBgTmFOYCBhcyBub3QgZXF1YWxcbiAgICAgICAgICByZXR1cm4gK2EgPT0gK2I7XG5cbiAgICAgICAgY2FzZSBudW1iZXJDbGFzczpcbiAgICAgICAgICAvLyB0cmVhdCBgTmFOYCB2cy4gYE5hTmAgYXMgZXF1YWxcbiAgICAgICAgICByZXR1cm4gKGEgIT0gK2EpXG4gICAgICAgICAgICA/IGIgIT0gK2JcbiAgICAgICAgICAgIC8vIGJ1dCB0cmVhdCBgKzBgIHZzLiBgLTBgIGFzIG5vdCBlcXVhbFxuICAgICAgICAgICAgOiAoYSA9PSAwID8gKDEgLyBhID09IDEgLyBiKSA6IGEgPT0gK2IpO1xuXG4gICAgICAgIGNhc2UgcmVnZXhwQ2xhc3M6XG4gICAgICAgIGNhc2Ugc3RyaW5nQ2xhc3M6XG4gICAgICAgICAgLy8gY29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyAoaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS4xMC42LjQpXG4gICAgICAgICAgLy8gdHJlYXQgc3RyaW5nIHByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IGluc3RhbmNlcyBhcyBlcXVhbFxuICAgICAgICAgIHJldHVybiBhID09IFN0cmluZyhiKTtcbiAgICAgIH1cbiAgICAgIHZhciBpc0FyciA9IGNsYXNzTmFtZSA9PSBhcnJheUNsYXNzO1xuICAgICAgaWYgKCFpc0Fycikge1xuICAgICAgICAvLyB1bndyYXAgYW55IGBsb2Rhc2hgIHdyYXBwZWQgdmFsdWVzXG4gICAgICAgIHZhciBhV3JhcHBlZCA9IGhhc093blByb3BlcnR5LmNhbGwoYSwgJ19fd3JhcHBlZF9fJyksXG4gICAgICAgICAgICBiV3JhcHBlZCA9IGhhc093blByb3BlcnR5LmNhbGwoYiwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICAgICAgaWYgKGFXcmFwcGVkIHx8IGJXcmFwcGVkKSB7XG4gICAgICAgICAgcmV0dXJuIGJhc2VJc0VxdWFsKGFXcmFwcGVkID8gYS5fX3dyYXBwZWRfXyA6IGEsIGJXcmFwcGVkID8gYi5fX3dyYXBwZWRfXyA6IGIsIGNhbGxiYWNrLCBpc1doZXJlLCBzdGFja0EsIHN0YWNrQik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZXhpdCBmb3IgZnVuY3Rpb25zIGFuZCBET00gbm9kZXNcbiAgICAgICAgaWYgKGNsYXNzTmFtZSAhPSBvYmplY3RDbGFzcykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpbiBvbGRlciB2ZXJzaW9ucyBvZiBPcGVyYSwgYGFyZ3VtZW50c2Agb2JqZWN0cyBoYXZlIGBBcnJheWAgY29uc3RydWN0b3JzXG4gICAgICAgIHZhciBjdG9yQSA9IGEuY29uc3RydWN0b3IsXG4gICAgICAgICAgICBjdG9yQiA9IGIuY29uc3RydWN0b3I7XG5cbiAgICAgICAgLy8gbm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWxcbiAgICAgICAgaWYgKGN0b3JBICE9IGN0b3JCICYmXG4gICAgICAgICAgICAgICEoaXNGdW5jdGlvbihjdG9yQSkgJiYgY3RvckEgaW5zdGFuY2VvZiBjdG9yQSAmJiBpc0Z1bmN0aW9uKGN0b3JCKSAmJiBjdG9yQiBpbnN0YW5jZW9mIGN0b3JCKSAmJlxuICAgICAgICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gYXNzdW1lIGN5Y2xpYyBzdHJ1Y3R1cmVzIGFyZSBlcXVhbFxuICAgICAgLy8gdGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpYyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjFcbiAgICAgIC8vIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AgKGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuMTIuMylcbiAgICAgIHZhciBpbml0ZWRTdGFjayA9ICFzdGFja0E7XG4gICAgICBzdGFja0EgfHwgKHN0YWNrQSA9IGdldEFycmF5KCkpO1xuICAgICAgc3RhY2tCIHx8IChzdGFja0IgPSBnZXRBcnJheSgpKTtcblxuICAgICAgdmFyIGxlbmd0aCA9IHN0YWNrQS5sZW5ndGg7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKHN0YWNrQVtsZW5ndGhdID09IGEpIHtcbiAgICAgICAgICByZXR1cm4gc3RhY2tCW2xlbmd0aF0gPT0gYjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIHNpemUgPSAwO1xuICAgICAgcmVzdWx0ID0gdHJ1ZTtcblxuICAgICAgLy8gYWRkIGBhYCBhbmQgYGJgIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0c1xuICAgICAgc3RhY2tBLnB1c2goYSk7XG4gICAgICBzdGFja0IucHVzaChiKTtcblxuICAgICAgLy8gcmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKVxuICAgICAgaWYgKGlzQXJyKSB7XG4gICAgICAgIC8vIGNvbXBhcmUgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5XG4gICAgICAgIGxlbmd0aCA9IGEubGVuZ3RoO1xuICAgICAgICBzaXplID0gYi5sZW5ndGg7XG4gICAgICAgIHJlc3VsdCA9IHNpemUgPT0gbGVuZ3RoO1xuXG4gICAgICAgIGlmIChyZXN1bHQgfHwgaXNXaGVyZSkge1xuICAgICAgICAgIC8vIGRlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXNcbiAgICAgICAgICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBsZW5ndGgsXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBiW3NpemVdO1xuXG4gICAgICAgICAgICBpZiAoaXNXaGVyZSkge1xuICAgICAgICAgICAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgICAgICAgICAgIGlmICgocmVzdWx0ID0gYmFzZUlzRXF1YWwoYVtpbmRleF0sIHZhbHVlLCBjYWxsYmFjaywgaXNXaGVyZSwgc3RhY2tBLCBzdGFja0IpKSkge1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCEocmVzdWx0ID0gYmFzZUlzRXF1YWwoYVtzaXplXSwgdmFsdWUsIGNhbGxiYWNrLCBpc1doZXJlLCBzdGFja0EsIHN0YWNrQikpKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vIGRlZXAgY29tcGFyZSBvYmplY3RzIHVzaW5nIGBmb3JJbmAsIGluc3RlYWQgb2YgYGZvck93bmAsIHRvIGF2b2lkIGBPYmplY3Qua2V5c2BcbiAgICAgICAgLy8gd2hpY2gsIGluIHRoaXMgY2FzZSwgaXMgbW9yZSBjb3N0bHlcbiAgICAgICAgZm9ySW4oYiwgZnVuY3Rpb24odmFsdWUsIGtleSwgYikge1xuICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIGtleSkpIHtcbiAgICAgICAgICAgIC8vIGNvdW50IHRoZSBudW1iZXIgb2YgcHJvcGVydGllcy5cbiAgICAgICAgICAgIHNpemUrKztcbiAgICAgICAgICAgIC8vIGRlZXAgY29tcGFyZSBlYWNoIHByb3BlcnR5IHZhbHVlLlxuICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGtleSkgJiYgYmFzZUlzRXF1YWwoYVtrZXldLCB2YWx1ZSwgY2FsbGJhY2ssIGlzV2hlcmUsIHN0YWNrQSwgc3RhY2tCKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmVzdWx0ICYmICFpc1doZXJlKSB7XG4gICAgICAgICAgLy8gZW5zdXJlIGJvdGggb2JqZWN0cyBoYXZlIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzXG4gICAgICAgICAgZm9ySW4oYSwgZnVuY3Rpb24odmFsdWUsIGtleSwgYSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoYSwga2V5KSkge1xuICAgICAgICAgICAgICAvLyBgc2l6ZWAgd2lsbCBiZSBgLTFgIGlmIGBhYCBoYXMgbW9yZSBwcm9wZXJ0aWVzIHRoYW4gYGJgXG4gICAgICAgICAgICAgIHJldHVybiAocmVzdWx0ID0gLS1zaXplID4gLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdGFja0EucG9wKCk7XG4gICAgICBzdGFja0IucG9wKCk7XG5cbiAgICAgIGlmIChpbml0ZWRTdGFjaykge1xuICAgICAgICByZWxlYXNlQXJyYXkoc3RhY2tBKTtcbiAgICAgICAgcmVsZWFzZUFycmF5KHN0YWNrQik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1lcmdlYCB3aXRob3V0IGFyZ3VtZW50IGp1Z2dsaW5nIG9yIHN1cHBvcnRcbiAgICAgKiBmb3IgYHRoaXNBcmdgIGJpbmRpbmcuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBtZXJnaW5nIHByb3BlcnRpZXMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBBc3NvY2lhdGVzIHZhbHVlcyB3aXRoIHNvdXJjZSBjb3VudGVycGFydHMuXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBjYWxsYmFjaywgc3RhY2tBLCBzdGFja0IpIHtcbiAgICAgIChpc0FycmF5KHNvdXJjZSkgPyBmb3JFYWNoIDogZm9yT3duKShzb3VyY2UsIGZ1bmN0aW9uKHNvdXJjZSwga2V5KSB7XG4gICAgICAgIHZhciBmb3VuZCxcbiAgICAgICAgICAgIGlzQXJyLFxuICAgICAgICAgICAgcmVzdWx0ID0gc291cmNlLFxuICAgICAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuICAgICAgICBpZiAoc291cmNlICYmICgoaXNBcnIgPSBpc0FycmF5KHNvdXJjZSkpIHx8IGlzUGxhaW5PYmplY3Qoc291cmNlKSkpIHtcbiAgICAgICAgICAvLyBhdm9pZCBtZXJnaW5nIHByZXZpb3VzbHkgbWVyZ2VkIGN5Y2xpYyBzb3VyY2VzXG4gICAgICAgICAgdmFyIHN0YWNrTGVuZ3RoID0gc3RhY2tBLmxlbmd0aDtcbiAgICAgICAgICB3aGlsZSAoc3RhY2tMZW5ndGgtLSkge1xuICAgICAgICAgICAgaWYgKChmb3VuZCA9IHN0YWNrQVtzdGFja0xlbmd0aF0gPT0gc291cmNlKSkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHN0YWNrQltzdGFja0xlbmd0aF07XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICB2YXIgaXNTaGFsbG93O1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrKHZhbHVlLCBzb3VyY2UpO1xuICAgICAgICAgICAgICBpZiAoKGlzU2hhbGxvdyA9IHR5cGVvZiByZXN1bHQgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNTaGFsbG93KSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gaXNBcnJcbiAgICAgICAgICAgICAgICA/IChpc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW10pXG4gICAgICAgICAgICAgICAgOiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkgPyB2YWx1ZSA6IHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGFkZCBgc291cmNlYCBhbmQgYXNzb2NpYXRlZCBgdmFsdWVgIHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0c1xuICAgICAgICAgICAgc3RhY2tBLnB1c2goc291cmNlKTtcbiAgICAgICAgICAgIHN0YWNrQi5wdXNoKHZhbHVlKTtcblxuICAgICAgICAgICAgLy8gcmVjdXJzaXZlbHkgbWVyZ2Ugb2JqZWN0cyBhbmQgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cylcbiAgICAgICAgICAgIGlmICghaXNTaGFsbG93KSB7XG4gICAgICAgICAgICAgIGJhc2VNZXJnZSh2YWx1ZSwgc291cmNlLCBjYWxsYmFjaywgc3RhY2tBLCBzdGFja0IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrKHZhbHVlLCBzb3VyY2UpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gc291cmNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIHJlc3VsdCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yYW5kb21gIHdpdGhvdXQgYXJndW1lbnQganVnZ2xpbmcgb3Igc3VwcG9ydFxuICAgICAqIGZvciByZXR1cm5pbmcgZmxvYXRpbmctcG9pbnQgbnVtYmVycy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbiBUaGUgbWluaW11bSBwb3NzaWJsZSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4IFRoZSBtYXhpbXVtIHBvc3NpYmxlIHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYSByYW5kb20gbnVtYmVyLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJhc2VSYW5kb20obWluLCBtYXgpIHtcbiAgICAgIHJldHVybiBtaW4gKyBmbG9vcihuYXRpdmVSYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5pcWAgd2l0aG91dCBzdXBwb3J0IGZvciBjYWxsYmFjayBzaG9ydGhhbmRzXG4gICAgICogb3IgYHRoaXNBcmdgIGJpbmRpbmcuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU29ydGVkPWZhbHNlXSBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCBgYXJyYXlgIGlzIHNvcnRlZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBkdXBsaWNhdGUtdmFsdWUtZnJlZSBhcnJheS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiYXNlVW5pcShhcnJheSwgaXNTb3J0ZWQsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBpbmRleE9mID0gZ2V0SW5kZXhPZigpLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgdmFyIGlzTGFyZ2UgPSAhaXNTb3J0ZWQgJiYgbGVuZ3RoID49IGxhcmdlQXJyYXlTaXplICYmIGluZGV4T2YgPT09IGJhc2VJbmRleE9mLFxuICAgICAgICAgIHNlZW4gPSAoY2FsbGJhY2sgfHwgaXNMYXJnZSkgPyBnZXRBcnJheSgpIDogcmVzdWx0O1xuXG4gICAgICBpZiAoaXNMYXJnZSkge1xuICAgICAgICB2YXIgY2FjaGUgPSBjcmVhdGVDYWNoZShzZWVuKTtcbiAgICAgICAgaW5kZXhPZiA9IGNhY2hlSW5kZXhPZjtcbiAgICAgICAgc2VlbiA9IGNhY2hlO1xuICAgICAgfVxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICAgICAgY29tcHV0ZWQgPSBjYWxsYmFjayA/IGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgYXJyYXkpIDogdmFsdWU7XG5cbiAgICAgICAgaWYgKGlzU29ydGVkXG4gICAgICAgICAgICAgID8gIWluZGV4IHx8IHNlZW5bc2Vlbi5sZW5ndGggLSAxXSAhPT0gY29tcHV0ZWRcbiAgICAgICAgICAgICAgOiBpbmRleE9mKHNlZW4sIGNvbXB1dGVkKSA8IDBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgIGlmIChjYWxsYmFjayB8fCBpc0xhcmdlKSB7XG4gICAgICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0xhcmdlKSB7XG4gICAgICAgIHJlbGVhc2VBcnJheShzZWVuLmFycmF5KTtcbiAgICAgICAgcmVsZWFzZU9iamVjdChzZWVuKTtcbiAgICAgIH0gZWxzZSBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgcmVsZWFzZUFycmF5KHNlZW4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBhZ2dyZWdhdGVzIGEgY29sbGVjdGlvbiwgY3JlYXRpbmcgYW4gb2JqZWN0IGNvbXBvc2VkXG4gICAgICogb2Yga2V5cyBnZW5lcmF0ZWQgZnJvbSB0aGUgcmVzdWx0cyBvZiBydW5uaW5nIGVhY2ggZWxlbWVudCBvZiB0aGUgY29sbGVjdGlvblxuICAgICAqIHRocm91Z2ggYSBjYWxsYmFjay4gVGhlIGdpdmVuIGBzZXR0ZXJgIGZ1bmN0aW9uIHNldHMgdGhlIGtleXMgYW5kIHZhbHVlc1xuICAgICAqIG9mIHRoZSBjb21wb3NlZCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHNldHRlciBUaGUgc2V0dGVyIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFnZ3JlZ2F0b3IgZnVuY3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlQWdncmVnYXRvcihzZXR0ZXIpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcblxuICAgICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDA7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicpIHtcbiAgICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gY29sbGVjdGlvbltpbmRleF07XG4gICAgICAgICAgICBzZXR0ZXIocmVzdWx0LCB2YWx1ZSwgY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSwgY29sbGVjdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICBzZXR0ZXIocmVzdWx0LCB2YWx1ZSwgY2FsbGJhY2sodmFsdWUsIGtleSwgY29sbGVjdGlvbiksIGNvbGxlY3Rpb24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCwgZWl0aGVyIGN1cnJpZXMgb3IgaW52b2tlcyBgZnVuY2BcbiAgICAgKiB3aXRoIGFuIG9wdGlvbmFsIGB0aGlzYCBiaW5kaW5nIGFuZCBwYXJ0aWFsbHkgYXBwbGllZCBhcmd1bWVudHMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBmdW5jIFRoZSBmdW5jdGlvbiBvciBtZXRob2QgbmFtZSB0byByZWZlcmVuY2UuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgbWV0aG9kIGZsYWdzIHRvIGNvbXBvc2UuXG4gICAgICogIFRoZSBiaXRtYXNrIG1heSBiZSBjb21wb3NlZCBvZiB0aGUgZm9sbG93aW5nIGZsYWdzOlxuICAgICAqICAxIC0gYF8uYmluZGBcbiAgICAgKiAgMiAtIGBfLmJpbmRLZXlgXG4gICAgICogIDQgLSBgXy5jdXJyeWBcbiAgICAgKiAgOCAtIGBfLmN1cnJ5YCAoYm91bmQpXG4gICAgICogIDE2IC0gYF8ucGFydGlhbGBcbiAgICAgKiAgMzIgLSBgXy5wYXJ0aWFsUmlnaHRgXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3BhcnRpYWxBcmdzXSBBbiBhcnJheSBvZiBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZVxuICAgICAqICBwcm92aWRlZCB0byB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IFtwYXJ0aWFsUmlnaHRBcmdzXSBBbiBhcnJheSBvZiBhcmd1bWVudHMgdG8gYXBwZW5kIHRvIHRob3NlXG4gICAgICogIHByb3ZpZGVkIHRvIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FyaXR5XSBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZVdyYXBwZXIoZnVuYywgYml0bWFzaywgcGFydGlhbEFyZ3MsIHBhcnRpYWxSaWdodEFyZ3MsIHRoaXNBcmcsIGFyaXR5KSB7XG4gICAgICB2YXIgaXNCaW5kID0gYml0bWFzayAmIDEsXG4gICAgICAgICAgaXNCaW5kS2V5ID0gYml0bWFzayAmIDIsXG4gICAgICAgICAgaXNDdXJyeSA9IGJpdG1hc2sgJiA0LFxuICAgICAgICAgIGlzQ3VycnlCb3VuZCA9IGJpdG1hc2sgJiA4LFxuICAgICAgICAgIGlzUGFydGlhbCA9IGJpdG1hc2sgJiAxNixcbiAgICAgICAgICBpc1BhcnRpYWxSaWdodCA9IGJpdG1hc2sgJiAzMjtcblxuICAgICAgaWYgKCFpc0JpbmRLZXkgJiYgIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgIH1cbiAgICAgIGlmIChpc1BhcnRpYWwgJiYgIXBhcnRpYWxBcmdzLmxlbmd0aCkge1xuICAgICAgICBiaXRtYXNrICY9IH4xNjtcbiAgICAgICAgaXNQYXJ0aWFsID0gcGFydGlhbEFyZ3MgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1BhcnRpYWxSaWdodCAmJiAhcGFydGlhbFJpZ2h0QXJncy5sZW5ndGgpIHtcbiAgICAgICAgYml0bWFzayAmPSB+MzI7XG4gICAgICAgIGlzUGFydGlhbFJpZ2h0ID0gcGFydGlhbFJpZ2h0QXJncyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgdmFyIGJpbmREYXRhID0gZnVuYyAmJiBmdW5jLl9fYmluZERhdGFfXztcbiAgICAgIGlmIChiaW5kRGF0YSAmJiBiaW5kRGF0YSAhPT0gdHJ1ZSkge1xuICAgICAgICAvLyBjbG9uZSBgYmluZERhdGFgXG4gICAgICAgIGJpbmREYXRhID0gc2xpY2UoYmluZERhdGEpO1xuICAgICAgICBpZiAoYmluZERhdGFbMl0pIHtcbiAgICAgICAgICBiaW5kRGF0YVsyXSA9IHNsaWNlKGJpbmREYXRhWzJdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmluZERhdGFbM10pIHtcbiAgICAgICAgICBiaW5kRGF0YVszXSA9IHNsaWNlKGJpbmREYXRhWzNdKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzZXQgYHRoaXNCaW5kaW5nYCBpcyBub3QgcHJldmlvdXNseSBib3VuZFxuICAgICAgICBpZiAoaXNCaW5kICYmICEoYmluZERhdGFbMV0gJiAxKSkge1xuICAgICAgICAgIGJpbmREYXRhWzRdID0gdGhpc0FyZztcbiAgICAgICAgfVxuICAgICAgICAvLyBzZXQgaWYgcHJldmlvdXNseSBib3VuZCBidXQgbm90IGN1cnJlbnRseSAoc3Vic2VxdWVudCBjdXJyaWVkIGZ1bmN0aW9ucylcbiAgICAgICAgaWYgKCFpc0JpbmQgJiYgYmluZERhdGFbMV0gJiAxKSB7XG4gICAgICAgICAgYml0bWFzayB8PSA4O1xuICAgICAgICB9XG4gICAgICAgIC8vIHNldCBjdXJyaWVkIGFyaXR5IGlmIG5vdCB5ZXQgc2V0XG4gICAgICAgIGlmIChpc0N1cnJ5ICYmICEoYmluZERhdGFbMV0gJiA0KSkge1xuICAgICAgICAgIGJpbmREYXRhWzVdID0gYXJpdHk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXBwZW5kIHBhcnRpYWwgbGVmdCBhcmd1bWVudHNcbiAgICAgICAgaWYgKGlzUGFydGlhbCkge1xuICAgICAgICAgIHB1c2guYXBwbHkoYmluZERhdGFbMl0gfHwgKGJpbmREYXRhWzJdID0gW10pLCBwYXJ0aWFsQXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXBwZW5kIHBhcnRpYWwgcmlnaHQgYXJndW1lbnRzXG4gICAgICAgIGlmIChpc1BhcnRpYWxSaWdodCkge1xuICAgICAgICAgIHVuc2hpZnQuYXBwbHkoYmluZERhdGFbM10gfHwgKGJpbmREYXRhWzNdID0gW10pLCBwYXJ0aWFsUmlnaHRBcmdzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBtZXJnZSBmbGFnc1xuICAgICAgICBiaW5kRGF0YVsxXSB8PSBiaXRtYXNrO1xuICAgICAgICByZXR1cm4gY3JlYXRlV3JhcHBlci5hcHBseShudWxsLCBiaW5kRGF0YSk7XG4gICAgICB9XG4gICAgICAvLyBmYXN0IHBhdGggZm9yIGBfLmJpbmRgXG4gICAgICB2YXIgY3JlYXRlciA9IChiaXRtYXNrID09IDEgfHwgYml0bWFzayA9PT0gMTcpID8gYmFzZUJpbmQgOiBiYXNlQ3JlYXRlV3JhcHBlcjtcbiAgICAgIHJldHVybiBjcmVhdGVyKFtmdW5jLCBiaXRtYXNrLCBwYXJ0aWFsQXJncywgcGFydGlhbFJpZ2h0QXJncywgdGhpc0FyZywgYXJpdHldKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVc2VkIGJ5IGBlc2NhcGVgIHRvIGNvbnZlcnQgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2ggVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIGVzY2FwZS5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIGNoYXJhY3Rlci5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBlc2NhcGVIdG1sQ2hhcihtYXRjaCkge1xuICAgICAgcmV0dXJuIGh0bWxFc2NhcGVzW21hdGNoXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBhcHByb3ByaWF0ZSBcImluZGV4T2ZcIiBmdW5jdGlvbi4gSWYgdGhlIGBfLmluZGV4T2ZgIG1ldGhvZCBpc1xuICAgICAqIGN1c3RvbWl6ZWQsIHRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGN1c3RvbSBtZXRob2QsIG90aGVyd2lzZSBpdCByZXR1cm5zXG4gICAgICogdGhlIGBiYXNlSW5kZXhPZmAgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgXCJpbmRleE9mXCIgZnVuY3Rpb24uXG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0SW5kZXhPZigpIHtcbiAgICAgIHZhciByZXN1bHQgPSAocmVzdWx0ID0gbG9kYXNoLmluZGV4T2YpID09PSBpbmRleE9mID8gYmFzZUluZGV4T2YgOiByZXN1bHQ7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nICYmIHJlTmF0aXZlLnRlc3QodmFsdWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgYHRoaXNgIGJpbmRpbmcgZGF0YSBvbiBhIGdpdmVuIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBzZXQgZGF0YSBvbi5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZSBUaGUgZGF0YSBhcnJheSB0byBzZXQuXG4gICAgICovXG4gICAgdmFyIHNldEJpbmREYXRhID0gIWRlZmluZVByb3BlcnR5ID8gbm9vcCA6IGZ1bmN0aW9uKGZ1bmMsIHZhbHVlKSB7XG4gICAgICBkZXNjcmlwdG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICBkZWZpbmVQcm9wZXJ0eShmdW5jLCAnX19iaW5kRGF0YV9fJywgZGVzY3JpcHRvcik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEEgZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gb2YgYGlzUGxhaW5PYmplY3RgIHdoaWNoIGNoZWNrcyBpZiBhIGdpdmVuIHZhbHVlXG4gICAgICogaXMgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLCBhc3N1bWluZyBvYmplY3RzIGNyZWF0ZWRcbiAgICAgKiBieSB0aGUgYE9iamVjdGAgY29uc3RydWN0b3IgaGF2ZSBubyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGFuZCB0aGF0XG4gICAgICogdGhlcmUgYXJlIG5vIGBPYmplY3QucHJvdG90eXBlYCBleHRlbnNpb25zLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNoaW1Jc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gICAgICB2YXIgY3RvcixcbiAgICAgICAgICByZXN1bHQ7XG5cbiAgICAgIC8vIGF2b2lkIG5vbiBPYmplY3Qgb2JqZWN0cywgYGFyZ3VtZW50c2Agb2JqZWN0cywgYW5kIERPTSBlbGVtZW50c1xuICAgICAgaWYgKCEodmFsdWUgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gb2JqZWN0Q2xhc3MpIHx8XG4gICAgICAgICAgKGN0b3IgPSB2YWx1ZS5jb25zdHJ1Y3RvciwgaXNGdW5jdGlvbihjdG9yKSAmJiAhKGN0b3IgaW5zdGFuY2VvZiBjdG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gSW4gbW9zdCBlbnZpcm9ubWVudHMgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMgYXJlIGl0ZXJhdGVkIGJlZm9yZVxuICAgICAgLy8gaXRzIGluaGVyaXRlZCBwcm9wZXJ0aWVzLiBJZiB0aGUgbGFzdCBpdGVyYXRlZCBwcm9wZXJ0eSBpcyBhbiBvYmplY3Qnc1xuICAgICAgLy8gb3duIHByb3BlcnR5IHRoZW4gdGhlcmUgYXJlIG5vIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gICAgICBmb3JJbih2YWx1ZSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICByZXN1bHQgPSBrZXk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ID09ICd1bmRlZmluZWQnIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHJlc3VsdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXNlZCBieSBgdW5lc2NhcGVgIHRvIGNvbnZlcnQgSFRNTCBlbnRpdGllcyB0byBjaGFyYWN0ZXJzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2ggVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIHVuZXNjYXBlLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuZXNjYXBlZCBjaGFyYWN0ZXIuXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5lc2NhcGVIdG1sQ2hhcihtYXRjaCkge1xuICAgICAgcmV0dXJuIGh0bWxVbmVzY2FwZXNbbWF0Y2hdO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIChmdW5jdGlvbigpIHsgcmV0dXJuIF8uaXNBcmd1bWVudHMoYXJndW1lbnRzKTsgfSkoMSwgMiwgMyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PSAnbnVtYmVyJyAmJlxuICAgICAgICB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcmdzQ2xhc3MgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIChmdW5jdGlvbigpIHsgcmV0dXJuIF8uaXNBcnJheShhcmd1bWVudHMpOyB9KSgpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICpcbiAgICAgKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT0gJ251bWJlcicgJiZcbiAgICAgICAgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJyYXlDbGFzcyB8fCBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQSBmYWxsYmFjayBpbXBsZW1lbnRhdGlvbiBvZiBgT2JqZWN0LmtleXNgIHdoaWNoIHByb2R1Y2VzIGFuIGFycmF5IG9mIHRoZVxuICAgICAqIGdpdmVuIG9iamVjdCdzIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAgICAgKi9cbiAgICB2YXIgc2hpbUtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIHZhciBpbmRleCwgaXRlcmFibGUgPSBvYmplY3QsIHJlc3VsdCA9IFtdO1xuICAgICAgaWYgKCFpdGVyYWJsZSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGlmICghKG9iamVjdFR5cGVzW3R5cGVvZiBvYmplY3RdKSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgZm9yIChpbmRleCBpbiBpdGVyYWJsZSkge1xuICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0ZXJhYmxlLCBpbmRleCkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBjb21wb3NlZCBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYW4gb2JqZWN0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ua2V5cyh7ICdvbmUnOiAxLCAndHdvJzogMiwgJ3RocmVlJzogMyB9KTtcbiAgICAgKiAvLyA9PiBbJ29uZScsICd0d28nLCAndGhyZWUnXSAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICAgKi9cbiAgICB2YXIga2V5cyA9ICFuYXRpdmVLZXlzID8gc2hpbUtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVc2VkIHRvIGNvbnZlcnQgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzOlxuICAgICAqXG4gICAgICogVGhvdWdoIHRoZSBgPmAgY2hhcmFjdGVyIGlzIGVzY2FwZWQgZm9yIHN5bW1ldHJ5LCBjaGFyYWN0ZXJzIGxpa2UgYD5gIGFuZCBgL2BcbiAgICAgKiBkb24ndCByZXF1aXJlIGVzY2FwaW5nIGluIEhUTUwgYW5kIGhhdmUgbm8gc3BlY2lhbCBtZWFuaW5nIHVubGVzcyB0aGV5J3JlIHBhcnRcbiAgICAgKiBvZiBhIHRhZyBvciBhbiB1bnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWUuXG4gICAgICogaHR0cDovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvYW1iaWd1b3VzLWFtcGVyc2FuZHMgKHVuZGVyIFwic2VtaS1yZWxhdGVkIGZ1biBmYWN0XCIpXG4gICAgICovXG4gICAgdmFyIGh0bWxFc2NhcGVzID0ge1xuICAgICAgJyYnOiAnJmFtcDsnLFxuICAgICAgJzwnOiAnJmx0OycsXG4gICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgXCInXCI6ICcmIzM5OydcbiAgICB9O1xuXG4gICAgLyoqIFVzZWQgdG8gY29udmVydCBIVE1MIGVudGl0aWVzIHRvIGNoYXJhY3RlcnMgKi9cbiAgICB2YXIgaHRtbFVuZXNjYXBlcyA9IGludmVydChodG1sRXNjYXBlcyk7XG5cbiAgICAvKiogVXNlZCB0byBtYXRjaCBIVE1MIGVudGl0aWVzIGFuZCBIVE1MIGNoYXJhY3RlcnMgKi9cbiAgICB2YXIgcmVFc2NhcGVkSHRtbCA9IFJlZ0V4cCgnKCcgKyBrZXlzKGh0bWxVbmVzY2FwZXMpLmpvaW4oJ3wnKSArICcpJywgJ2cnKSxcbiAgICAgICAgcmVVbmVzY2FwZWRIdG1sID0gUmVnRXhwKCdbJyArIGtleXMoaHRtbEVzY2FwZXMpLmpvaW4oJycpICsgJ10nLCAnZycpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAgICAgKiBvYmplY3QuIFN1YnNlcXVlbnQgc291cmNlcyB3aWxsIG92ZXJ3cml0ZSBwcm9wZXJ0eSBhc3NpZ25tZW50cyBvZiBwcmV2aW91c1xuICAgICAqIHNvdXJjZXMuIElmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBleGVjdXRlZCB0byBwcm9kdWNlIHRoZVxuICAgICAqIGFzc2lnbmVkIHZhbHVlcy4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHR3b1xuICAgICAqIGFyZ3VtZW50czsgKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBhbGlhcyBleHRlbmRcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZV0gVGhlIHNvdXJjZSBvYmplY3RzLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25pbmcgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5hc3NpZ24oeyAnbmFtZSc6ICdmcmVkJyB9LCB7ICdlbXBsb3llcic6ICdzbGF0ZScgfSk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdmcmVkJywgJ2VtcGxveWVyJzogJ3NsYXRlJyB9XG4gICAgICpcbiAgICAgKiB2YXIgZGVmYXVsdHMgPSBfLnBhcnRpYWxSaWdodChfLmFzc2lnbiwgZnVuY3Rpb24oYSwgYikge1xuICAgICAqICAgcmV0dXJuIHR5cGVvZiBhID09ICd1bmRlZmluZWQnID8gYiA6IGE7XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiB2YXIgb2JqZWN0ID0geyAnbmFtZSc6ICdiYXJuZXknIH07XG4gICAgICogZGVmYXVsdHMob2JqZWN0LCB7ICduYW1lJzogJ2ZyZWQnLCAnZW1wbG95ZXInOiAnc2xhdGUnIH0pO1xuICAgICAqIC8vID0+IHsgJ25hbWUnOiAnYmFybmV5JywgJ2VtcGxveWVyJzogJ3NsYXRlJyB9XG4gICAgICovXG4gICAgdmFyIGFzc2lnbiA9IGZ1bmN0aW9uKG9iamVjdCwgc291cmNlLCBndWFyZCkge1xuICAgICAgdmFyIGluZGV4LCBpdGVyYWJsZSA9IG9iamVjdCwgcmVzdWx0ID0gaXRlcmFibGU7XG4gICAgICBpZiAoIWl0ZXJhYmxlKSByZXR1cm4gcmVzdWx0O1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgYXJnc0luZGV4ID0gMCxcbiAgICAgICAgICBhcmdzTGVuZ3RoID0gdHlwZW9mIGd1YXJkID09ICdudW1iZXInID8gMiA6IGFyZ3MubGVuZ3RoO1xuICAgICAgaWYgKGFyZ3NMZW5ndGggPiAzICYmIHR5cGVvZiBhcmdzW2FyZ3NMZW5ndGggLSAyXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGJhc2VDcmVhdGVDYWxsYmFjayhhcmdzWy0tYXJnc0xlbmd0aCAtIDFdLCBhcmdzW2FyZ3NMZW5ndGgtLV0sIDIpO1xuICAgICAgfSBlbHNlIGlmIChhcmdzTGVuZ3RoID4gMiAmJiB0eXBlb2YgYXJnc1thcmdzTGVuZ3RoIC0gMV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IGFyZ3NbLS1hcmdzTGVuZ3RoXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlICgrK2FyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcbiAgICAgICAgaXRlcmFibGUgPSBhcmdzW2FyZ3NJbmRleF07XG4gICAgICAgIGlmIChpdGVyYWJsZSAmJiBvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdKSB7XG4gICAgICAgIHZhciBvd25JbmRleCA9IC0xLFxuICAgICAgICAgICAgb3duUHJvcHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdICYmIGtleXMoaXRlcmFibGUpLFxuICAgICAgICAgICAgbGVuZ3RoID0gb3duUHJvcHMgPyBvd25Qcm9wcy5sZW5ndGggOiAwO1xuXG4gICAgICAgIHdoaWxlICgrK293bkluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgaW5kZXggPSBvd25Qcm9wc1tvd25JbmRleF07XG4gICAgICAgICAgcmVzdWx0W2luZGV4XSA9IGNhbGxiYWNrID8gY2FsbGJhY2socmVzdWx0W2luZGV4XSwgaXRlcmFibGVbaW5kZXhdKSA6IGl0ZXJhYmxlW2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdmFsdWVgLiBJZiBgaXNEZWVwYCBpcyBgdHJ1ZWAgbmVzdGVkIG9iamVjdHMgd2lsbCBhbHNvXG4gICAgICogYmUgY2xvbmVkLCBvdGhlcndpc2UgdGhleSB3aWxsIGJlIGFzc2lnbmVkIGJ5IHJlZmVyZW5jZS4gSWYgYSBjYWxsYmFja1xuICAgICAqIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgZXhlY3V0ZWQgdG8gcHJvZHVjZSB0aGUgY2xvbmVkIHZhbHVlcy4gSWYgdGhlXG4gICAgICogY2FsbGJhY2sgcmV0dXJucyBgdW5kZWZpbmVkYCBjbG9uaW5nIHdpbGwgYmUgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuXG4gICAgICogVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIG9uZSBhcmd1bWVudDsgKHZhbHVlKS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwPWZhbHNlXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY2xvbmluZyB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiB2YXIgc2hhbGxvdyA9IF8uY2xvbmUoY2hhcmFjdGVycyk7XG4gICAgICogc2hhbGxvd1swXSA9PT0gY2hhcmFjdGVyc1swXTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiB2YXIgZGVlcCA9IF8uY2xvbmUoY2hhcmFjdGVycywgdHJ1ZSk7XG4gICAgICogZGVlcFswXSA9PT0gY2hhcmFjdGVyc1swXTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqXG4gICAgICogXy5taXhpbih7XG4gICAgICogICAnY2xvbmUnOiBfLnBhcnRpYWxSaWdodChfLmNsb25lLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAqICAgICByZXR1cm4gXy5pc0VsZW1lbnQodmFsdWUpID8gdmFsdWUuY2xvbmVOb2RlKGZhbHNlKSA6IHVuZGVmaW5lZDtcbiAgICAgKiAgIH0pXG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiB2YXIgY2xvbmUgPSBfLmNsb25lKGRvY3VtZW50LmJvZHkpO1xuICAgICAqIGNsb25lLmNoaWxkTm9kZXMubGVuZ3RoO1xuICAgICAqIC8vID0+IDBcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjbG9uZSh2YWx1ZSwgaXNEZWVwLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgLy8gYWxsb3dzIHdvcmtpbmcgd2l0aCBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcyB3aXRob3V0IHVzaW5nIHRoZWlyIGBpbmRleGBcbiAgICAgIC8vIGFuZCBgY29sbGVjdGlvbmAgYXJndW1lbnRzIGZvciBgaXNEZWVwYCBhbmQgYGNhbGxiYWNrYFxuICAgICAgaWYgKHR5cGVvZiBpc0RlZXAgIT0gJ2Jvb2xlYW4nICYmIGlzRGVlcCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXNBcmcgPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2sgPSBpc0RlZXA7XG4gICAgICAgIGlzRGVlcCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJhc2VDbG9uZSh2YWx1ZSwgaXNEZWVwLCB0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJyAmJiBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZGVlcCBjbG9uZSBvZiBgdmFsdWVgLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmVcbiAgICAgKiBleGVjdXRlZCB0byBwcm9kdWNlIHRoZSBjbG9uZWQgdmFsdWVzLiBJZiB0aGUgY2FsbGJhY2sgcmV0dXJucyBgdW5kZWZpbmVkYFxuICAgICAqIGNsb25pbmcgd2lsbCBiZSBoYW5kbGVkIGJ5IHRoZSBtZXRob2QgaW5zdGVhZC4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvXG4gICAgICogYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OyAodmFsdWUpLlxuICAgICAqXG4gICAgICogTm90ZTogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvbiB0aGUgc3RydWN0dXJlZCBjbG9uZSBhbGdvcml0aG0uIEZ1bmN0aW9uc1xuICAgICAqIGFuZCBET00gbm9kZXMgYXJlICoqbm90KiogY2xvbmVkLiBUaGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGBhcmd1bWVudHNgIG9iamVjdHMgYW5kXG4gICAgICogb2JqZWN0cyBjcmVhdGVkIGJ5IGNvbnN0cnVjdG9ycyBvdGhlciB0aGFuIGBPYmplY3RgIGFyZSBjbG9uZWQgdG8gcGxhaW4gYE9iamVjdGAgb2JqZWN0cy5cbiAgICAgKiBTZWUgaHR0cDovL3d3dy53My5vcmcvVFIvaHRtbDUvaW5mcmFzdHJ1Y3R1cmUuaHRtbCNpbnRlcm5hbC1zdHJ1Y3R1cmVkLWNsb25pbmctYWxnb3JpdGhtLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBkZWVwIGNsb25lLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZGVlcCBjbG9uZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogdmFyIGRlZXAgPSBfLmNsb25lRGVlcChjaGFyYWN0ZXJzKTtcbiAgICAgKiBkZWVwWzBdID09PSBjaGFyYWN0ZXJzWzBdO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICpcbiAgICAgKiB2YXIgdmlldyA9IHtcbiAgICAgKiAgICdsYWJlbCc6ICdkb2NzJyxcbiAgICAgKiAgICdub2RlJzogZWxlbWVudFxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgY2xvbmUgPSBfLmNsb25lRGVlcCh2aWV3LCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAqICAgcmV0dXJuIF8uaXNFbGVtZW50KHZhbHVlKSA/IHZhbHVlLmNsb25lTm9kZSh0cnVlKSA6IHVuZGVmaW5lZDtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIGNsb25lLm5vZGUgPT0gdmlldy5ub2RlO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gY2xvbmVEZWVwKHZhbHVlLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgcmV0dXJuIGJhc2VDbG9uZSh2YWx1ZSwgdHJ1ZSwgdHlwZW9mIGNhbGxiYWNrID09ICdmdW5jdGlvbicgJiYgYmFzZUNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAxKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoZSBnaXZlbiBgcHJvdG90eXBlYCBvYmplY3QuIElmIGFcbiAgICAgKiBgcHJvcGVydGllc2Agb2JqZWN0IGlzIHByb3ZpZGVkIGl0cyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGFyZSBhc3NpZ25lZFxuICAgICAqIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb3RvdHlwZSBUaGUgb2JqZWN0IHRvIGluaGVyaXQgZnJvbS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3Byb3BlcnRpZXNdIFRoZSBwcm9wZXJ0aWVzIHRvIGFzc2lnbiB0byB0aGUgb2JqZWN0LlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIGZ1bmN0aW9uIFNoYXBlKCkge1xuICAgICAqICAgdGhpcy54ID0gMDtcbiAgICAgKiAgIHRoaXMueSA9IDA7XG4gICAgICogfVxuICAgICAqXG4gICAgICogZnVuY3Rpb24gQ2lyY2xlKCkge1xuICAgICAqICAgU2hhcGUuY2FsbCh0aGlzKTtcbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBDaXJjbGUucHJvdG90eXBlID0gXy5jcmVhdGUoU2hhcGUucHJvdG90eXBlLCB7ICdjb25zdHJ1Y3Rvcic6IENpcmNsZSB9KTtcbiAgICAgKlxuICAgICAqIHZhciBjaXJjbGUgPSBuZXcgQ2lyY2xlO1xuICAgICAqIGNpcmNsZSBpbnN0YW5jZW9mIENpcmNsZTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBjaXJjbGUgaW5zdGFuY2VvZiBTaGFwZTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSwgcHJvcGVydGllcykge1xuICAgICAgdmFyIHJlc3VsdCA9IGJhc2VDcmVhdGUocHJvdG90eXBlKTtcbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzID8gYXNzaWduKHJlc3VsdCwgcHJvcGVydGllcykgOiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXNzaWducyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3QocykgdG8gdGhlIGRlc3RpbmF0aW9uXG4gICAgICogb2JqZWN0IGZvciBhbGwgZGVzdGluYXRpb24gcHJvcGVydGllcyB0aGF0IHJlc29sdmUgdG8gYHVuZGVmaW5lZGAuIE9uY2UgYVxuICAgICAqIHByb3BlcnR5IGlzIHNldCwgYWRkaXRpb25hbCBkZWZhdWx0cyBvZiB0aGUgc2FtZSBwcm9wZXJ0eSB3aWxsIGJlIGlnbm9yZWQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlXSBUaGUgc291cmNlIG9iamVjdHMuXG4gICAgICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEFsbG93cyB3b3JraW5nIHdpdGggYF8ucmVkdWNlYCB3aXRob3V0IHVzaW5nIGl0c1xuICAgICAqICBga2V5YCBhbmQgYG9iamVjdGAgYXJndW1lbnRzIGFzIHNvdXJjZXMuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgb2JqZWN0ID0geyAnbmFtZSc6ICdiYXJuZXknIH07XG4gICAgICogXy5kZWZhdWx0cyhvYmplY3QsIHsgJ25hbWUnOiAnZnJlZCcsICdlbXBsb3llcic6ICdzbGF0ZScgfSk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdiYXJuZXknLCAnZW1wbG95ZXInOiAnc2xhdGUnIH1cbiAgICAgKi9cbiAgICB2YXIgZGVmYXVsdHMgPSBmdW5jdGlvbihvYmplY3QsIHNvdXJjZSwgZ3VhcmQpIHtcbiAgICAgIHZhciBpbmRleCwgaXRlcmFibGUgPSBvYmplY3QsIHJlc3VsdCA9IGl0ZXJhYmxlO1xuICAgICAgaWYgKCFpdGVyYWJsZSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgIGFyZ3NJbmRleCA9IDAsXG4gICAgICAgICAgYXJnc0xlbmd0aCA9IHR5cGVvZiBndWFyZCA9PSAnbnVtYmVyJyA/IDIgOiBhcmdzLmxlbmd0aDtcbiAgICAgIHdoaWxlICgrK2FyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcbiAgICAgICAgaXRlcmFibGUgPSBhcmdzW2FyZ3NJbmRleF07XG4gICAgICAgIGlmIChpdGVyYWJsZSAmJiBvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdKSB7XG4gICAgICAgIHZhciBvd25JbmRleCA9IC0xLFxuICAgICAgICAgICAgb3duUHJvcHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdICYmIGtleXMoaXRlcmFibGUpLFxuICAgICAgICAgICAgbGVuZ3RoID0gb3duUHJvcHMgPyBvd25Qcm9wcy5sZW5ndGggOiAwO1xuXG4gICAgICAgIHdoaWxlICgrK293bkluZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgaW5kZXggPSBvd25Qcm9wc1tvd25JbmRleF07XG4gICAgICAgICAgaWYgKHR5cGVvZiByZXN1bHRbaW5kZXhdID09ICd1bmRlZmluZWQnKSByZXN1bHRbaW5kZXhdID0gaXRlcmFibGVbaW5kZXhdO1xuICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5maW5kSW5kZXhgIGV4Y2VwdCB0aGF0IGl0IHJldHVybnMgdGhlIGtleSBvZiB0aGVcbiAgICAgKiBmaXJzdCBlbGVtZW50IHRoYXQgcGFzc2VzIHRoZSBjYWxsYmFjayBjaGVjaywgaW5zdGVhZCBvZiB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHNlYXJjaC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXJcbiAgICAgKiAgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZCB0b1xuICAgICAqICBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd8dW5kZWZpbmVkfSBSZXR1cm5zIHRoZSBrZXkgb2YgdGhlIGZvdW5kIGVsZW1lbnQsIGVsc2UgYHVuZGVmaW5lZGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0ge1xuICAgICAqICAgJ2Jhcm5leSc6IHsgICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9LFxuICAgICAqICAgJ2ZyZWQnOiB7ICAgICdhZ2UnOiA0MCwgJ2Jsb2NrZWQnOiB0cnVlIH0sXG4gICAgICogICAncGViYmxlcyc6IHsgJ2FnZSc6IDEsICAnYmxvY2tlZCc6IGZhbHNlIH1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5maW5kS2V5KGNoYXJhY3RlcnMsIGZ1bmN0aW9uKGNocikge1xuICAgICAqICAgcmV0dXJuIGNoci5hZ2UgPCA0MDtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiAnYmFybmV5JyAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uZmluZEtleShjaGFyYWN0ZXJzLCB7ICdhZ2UnOiAxIH0pO1xuICAgICAqIC8vID0+ICdwZWJibGVzJ1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kS2V5KGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4gJ2ZyZWQnXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZEtleShvYmplY3QsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgZm9yT3duKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqZWN0KSB7XG4gICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwga2V5LCBvYmplY3QpKSB7XG4gICAgICAgICAgcmVzdWx0ID0ga2V5O1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZmluZEtleWAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBlbGVtZW50c1xuICAgICAqIG9mIGEgYGNvbGxlY3Rpb25gIGluIHRoZSBvcHBvc2l0ZSBvcmRlci5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gc2VhcmNoLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlclxuICAgICAqICBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkIHRvXG4gICAgICogIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge3N0cmluZ3x1bmRlZmluZWR9IFJldHVybnMgdGhlIGtleSBvZiB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgdW5kZWZpbmVkYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSB7XG4gICAgICogICAnYmFybmV5JzogeyAgJ2FnZSc6IDM2LCAnYmxvY2tlZCc6IHRydWUgfSxcbiAgICAgKiAgICdmcmVkJzogeyAgICAnYWdlJzogNDAsICdibG9ja2VkJzogZmFsc2UgfSxcbiAgICAgKiAgICdwZWJibGVzJzogeyAnYWdlJzogMSwgICdibG9ja2VkJzogdHJ1ZSB9XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIF8uZmluZExhc3RLZXkoY2hhcmFjdGVycywgZnVuY3Rpb24oY2hyKSB7XG4gICAgICogICByZXR1cm4gY2hyLmFnZSA8IDQwO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IHJldHVybnMgYHBlYmJsZXNgLCBhc3N1bWluZyBgXy5maW5kS2V5YCByZXR1cm5zIGBiYXJuZXlgXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpbmRMYXN0S2V5KGNoYXJhY3RlcnMsIHsgJ2FnZSc6IDQwIH0pO1xuICAgICAqIC8vID0+ICdmcmVkJ1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kTGFzdEtleShjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpO1xuICAgICAqIC8vID0+ICdwZWJibGVzJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbmRMYXN0S2V5KG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICBmb3JPd25SaWdodChvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWUsIGtleSwgb2JqZWN0KSkge1xuICAgICAgICAgIHJlc3VsdCA9IGtleTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiBhbiBvYmplY3QsXG4gICAgICogZXhlY3V0aW5nIHRoZSBjYWxsYmFjayBmb3IgZWFjaCBwcm9wZXJ0eS4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYFxuICAgICAqIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGtleSwgb2JqZWN0KS4gQ2FsbGJhY2tzIG1heSBleGl0XG4gICAgICogaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBmdW5jdGlvbiBTaGFwZSgpIHtcbiAgICAgKiAgIHRoaXMueCA9IDA7XG4gICAgICogICB0aGlzLnkgPSAwO1xuICAgICAqIH1cbiAgICAgKlxuICAgICAqIFNoYXBlLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24oeCwgeSkge1xuICAgICAqICAgdGhpcy54ICs9IHg7XG4gICAgICogICB0aGlzLnkgKz0geTtcbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5mb3JJbihuZXcgU2hhcGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgKiAgIGNvbnNvbGUubG9nKGtleSk7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gbG9ncyAneCcsICd5JywgYW5kICdtb3ZlJyAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICAgKi9cbiAgICB2YXIgZm9ySW4gPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGluZGV4LCBpdGVyYWJsZSA9IGNvbGxlY3Rpb24sIHJlc3VsdCA9IGl0ZXJhYmxlO1xuICAgICAgaWYgKCFpdGVyYWJsZSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGlmICghb2JqZWN0VHlwZXNbdHlwZW9mIGl0ZXJhYmxlXSkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgJiYgdHlwZW9mIHRoaXNBcmcgPT0gJ3VuZGVmaW5lZCcgPyBjYWxsYmFjayA6IGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIGZvciAoaW5kZXggaW4gaXRlcmFibGUpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2soaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbikgPT09IGZhbHNlKSByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZm9ySW5gIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgZWxlbWVudHNcbiAgICAgKiBvZiBhIGBjb2xsZWN0aW9uYCBpbiB0aGUgb3Bwb3NpdGUgb3JkZXIuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogZnVuY3Rpb24gU2hhcGUoKSB7XG4gICAgICogICB0aGlzLnggPSAwO1xuICAgICAqICAgdGhpcy55ID0gMDtcbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBTaGFwZS5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgKiAgIHRoaXMueCArPSB4O1xuICAgICAqICAgdGhpcy55ICs9IHk7XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIF8uZm9ySW5SaWdodChuZXcgU2hhcGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgKiAgIGNvbnNvbGUubG9nKGtleSk7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gbG9ncyAnbW92ZScsICd5JywgYW5kICd4JyBhc3N1bWluZyBgXy5mb3JJbiBgIGxvZ3MgJ3gnLCAneScsIGFuZCAnbW92ZSdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmb3JJblJpZ2h0KG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBwYWlycyA9IFtdO1xuXG4gICAgICBmb3JJbihvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcGFpcnMucHVzaChrZXksIHZhbHVlKTtcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbGVuZ3RoID0gcGFpcnMubGVuZ3RoO1xuICAgICAgY2FsbGJhY2sgPSBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayhwYWlyc1tsZW5ndGgtLV0sIHBhaXJzW2xlbmd0aF0sIG9iamVjdCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXRlcmF0ZXMgb3ZlciBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCwgZXhlY3V0aW5nIHRoZSBjYWxsYmFja1xuICAgICAqIGZvciBlYWNoIHByb3BlcnR5LiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWVcbiAgICAgKiBhcmd1bWVudHM7ICh2YWx1ZSwga2V5LCBvYmplY3QpLiBDYWxsYmFja3MgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5XG4gICAgICogZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uZm9yT3duKHsgJzAnOiAnemVybycsICcxJzogJ29uZScsICdsZW5ndGgnOiAyIH0sIGZ1bmN0aW9uKG51bSwga2V5KSB7XG4gICAgICogICBjb25zb2xlLmxvZyhrZXkpO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IGxvZ3MgJzAnLCAnMScsIGFuZCAnbGVuZ3RoJyAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICAgKi9cbiAgICB2YXIgZm9yT3duID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBpbmRleCwgaXRlcmFibGUgPSBjb2xsZWN0aW9uLCByZXN1bHQgPSBpdGVyYWJsZTtcbiAgICAgIGlmICghaXRlcmFibGUpIHJldHVybiByZXN1bHQ7XG4gICAgICBpZiAoIW9iamVjdFR5cGVzW3R5cGVvZiBpdGVyYWJsZV0pIHJldHVybiByZXN1bHQ7XG4gICAgICBjYWxsYmFjayA9IGNhbGxiYWNrICYmIHR5cGVvZiB0aGlzQXJnID09ICd1bmRlZmluZWQnID8gY2FsbGJhY2sgOiBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgICB2YXIgb3duSW5kZXggPSAtMSxcbiAgICAgICAgICAgIG93blByb3BzID0gb2JqZWN0VHlwZXNbdHlwZW9mIGl0ZXJhYmxlXSAmJiBrZXlzKGl0ZXJhYmxlKSxcbiAgICAgICAgICAgIGxlbmd0aCA9IG93blByb3BzID8gb3duUHJvcHMubGVuZ3RoIDogMDtcblxuICAgICAgICB3aGlsZSAoKytvd25JbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIGluZGV4ID0gb3duUHJvcHNbb3duSW5kZXhdO1xuICAgICAgICAgIGlmIChjYWxsYmFjayhpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBjb2xsZWN0aW9uKSA9PT0gZmFsc2UpIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5mb3JPd25gIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgZWxlbWVudHNcbiAgICAgKiBvZiBhIGBjb2xsZWN0aW9uYCBpbiB0aGUgb3Bwb3NpdGUgb3JkZXIuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5mb3JPd25SaWdodCh7ICcwJzogJ3plcm8nLCAnMSc6ICdvbmUnLCAnbGVuZ3RoJzogMiB9LCBmdW5jdGlvbihudW0sIGtleSkge1xuICAgICAqICAgY29uc29sZS5sb2coa2V5KTtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiBsb2dzICdsZW5ndGgnLCAnMScsIGFuZCAnMCcgYXNzdW1pbmcgYF8uZm9yT3duYCBsb2dzICcwJywgJzEnLCBhbmQgJ2xlbmd0aCdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmb3JPd25SaWdodChvYmplY3QsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgcHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgICBjYWxsYmFjayA9IGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgdmFyIGtleSA9IHByb3BzW2xlbmd0aF07XG4gICAgICAgIGlmIChjYWxsYmFjayhvYmplY3Rba2V5XSwga2V5LCBvYmplY3QpID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzb3J0ZWQgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgb2YgYWxsIGVudW1lcmFibGUgcHJvcGVydGllcyxcbiAgICAgKiBvd24gYW5kIGluaGVyaXRlZCwgb2YgYG9iamVjdGAgdGhhdCBoYXZlIGZ1bmN0aW9uIHZhbHVlcy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBtZXRob2RzXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgdGhhdCBoYXZlIGZ1bmN0aW9uIHZhbHVlcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5mdW5jdGlvbnMoXyk7XG4gICAgICogLy8gPT4gWydhbGwnLCAnYW55JywgJ2JpbmQnLCAnYmluZEFsbCcsICdjbG9uZScsICdjb21wYWN0JywgJ2NvbXBvc2UnLCAuLi5dXG4gICAgICovXG4gICAgZnVuY3Rpb24gZnVuY3Rpb25zKG9iamVjdCkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgZm9ySW4ob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdC5zb3J0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBzcGVjaWZpZWQgcHJvcGVydHkgbmFtZSBleGlzdHMgYXMgYSBkaXJlY3QgcHJvcGVydHkgb2YgYG9iamVjdGAsXG4gICAgICogaW5zdGVhZCBvZiBhbiBpbmhlcml0ZWQgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBrZXkgaXMgYSBkaXJlY3QgcHJvcGVydHksIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5oYXMoeyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH0sICdiJyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGhhcyhvYmplY3QsIGtleSkge1xuICAgICAgcmV0dXJuIG9iamVjdCA/IGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpIDogZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIGludmVydGVkIGtleXMgYW5kIHZhbHVlcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW52ZXJ0LlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNyZWF0ZWQgaW52ZXJ0ZWQgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmludmVydCh7ICdmaXJzdCc6ICdmcmVkJywgJ3NlY29uZCc6ICdiYXJuZXknIH0pO1xuICAgICAqIC8vID0+IHsgJ2ZyZWQnOiAnZmlyc3QnLCAnYmFybmV5JzogJ3NlY29uZCcgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGludmVydChvYmplY3QpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIHByb3BzID0ga2V5cyhvYmplY3QpLFxuICAgICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgICAgICByZXN1bHQgPSB7fTtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICAgICAgcmVzdWx0W29iamVjdFtrZXldXSA9IGtleTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBib29sZWFuIHZhbHVlLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBib29sZWFuIHZhbHVlLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNCb29sZWFuKG51bGwpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNCb29sZWFuKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlIHx8XG4gICAgICAgIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBib29sQ2xhc3MgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBkYXRlLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBkYXRlLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNEYXRlKG5ldyBEYXRlKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09IGRhdGVDbGFzcyB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIERPTSBlbGVtZW50LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBET00gZWxlbWVudCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzRWxlbWVudChkb2N1bWVudC5ib2R5KTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNFbGVtZW50KHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUubm9kZVR5cGUgPT09IDEgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgZW1wdHkuIEFycmF5cywgc3RyaW5ncywgb3IgYGFyZ3VtZW50c2Agb2JqZWN0cyB3aXRoIGFcbiAgICAgKiBsZW5ndGggb2YgYDBgIGFuZCBvYmplY3RzIHdpdGggbm8gb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBhcmUgY29uc2lkZXJlZFxuICAgICAqIFwiZW1wdHlcIi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgZW1wdHksIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5pc0VtcHR5KFsxLCAyLCAzXSk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIF8uaXNFbXB0eSh7fSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc0VtcHR5KCcnKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICAgICAgdmFyIHJlc3VsdCA9IHRydWU7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuXG4gICAgICBpZiAoKGNsYXNzTmFtZSA9PSBhcnJheUNsYXNzIHx8IGNsYXNzTmFtZSA9PSBzdHJpbmdDbGFzcyB8fCBjbGFzc05hbWUgPT0gYXJnc0NsYXNzICkgfHxcbiAgICAgICAgICAoY2xhc3NOYW1lID09IG9iamVjdENsYXNzICYmIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgaXNGdW5jdGlvbih2YWx1ZS5zcGxpY2UpKSkge1xuICAgICAgICByZXR1cm4gIWxlbmd0aDtcbiAgICAgIH1cbiAgICAgIGZvck93bih2YWx1ZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAocmVzdWx0ID0gZmFsc2UpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmVcbiAgICAgKiBlcXVpdmFsZW50IHRvIGVhY2ggb3RoZXIuIElmIGEgY2FsbGJhY2sgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBleGVjdXRlZFxuICAgICAqIHRvIGNvbXBhcmUgdmFsdWVzLiBJZiB0aGUgY2FsbGJhY2sgcmV0dXJucyBgdW5kZWZpbmVkYCBjb21wYXJpc29ucyB3aWxsXG4gICAgICogYmUgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kXG4gICAgICogaW52b2tlZCB3aXRoIHR3byBhcmd1bWVudHM7IChhLCBiKS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSBhIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICAgICAqIEBwYXJhbSB7Kn0gYiBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaW5nIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgb2JqZWN0ID0geyAnbmFtZSc6ICdmcmVkJyB9O1xuICAgICAqIHZhciBjb3B5ID0geyAnbmFtZSc6ICdmcmVkJyB9O1xuICAgICAqXG4gICAgICogb2JqZWN0ID09IGNvcHk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIF8uaXNFcXVhbChvYmplY3QsIGNvcHkpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIHZhciB3b3JkcyA9IFsnaGVsbG8nLCAnZ29vZGJ5ZSddO1xuICAgICAqIHZhciBvdGhlcldvcmRzID0gWydoaScsICdnb29kYnllJ107XG4gICAgICpcbiAgICAgKiBfLmlzRXF1YWwod29yZHMsIG90aGVyV29yZHMsIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgKiAgIHZhciByZUdyZWV0ID0gL14oPzpoZWxsb3xoaSkkL2ksXG4gICAgICogICAgICAgYUdyZWV0ID0gXy5pc1N0cmluZyhhKSAmJiByZUdyZWV0LnRlc3QoYSksXG4gICAgICogICAgICAgYkdyZWV0ID0gXy5pc1N0cmluZyhiKSAmJiByZUdyZWV0LnRlc3QoYik7XG4gICAgICpcbiAgICAgKiAgIHJldHVybiAoYUdyZWV0IHx8IGJHcmVldCkgPyAoYUdyZWV0ID09IGJHcmVldCkgOiB1bmRlZmluZWQ7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzRXF1YWwoYSwgYiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHJldHVybiBiYXNlSXNFcXVhbChhLCBiLCB0eXBlb2YgY2FsbGJhY2sgPT0gJ2Z1bmN0aW9uJyAmJiBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDIpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcywgb3IgY2FuIGJlIGNvZXJjZWQgdG8sIGEgZmluaXRlIG51bWJlci5cbiAgICAgKlxuICAgICAqIE5vdGU6IFRoaXMgaXMgbm90IHRoZSBzYW1lIGFzIG5hdGl2ZSBgaXNGaW5pdGVgIHdoaWNoIHdpbGwgcmV0dXJuIHRydWUgZm9yXG4gICAgICogYm9vbGVhbnMgYW5kIGVtcHR5IHN0cmluZ3MuIFNlZSBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjEuMi41LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgZmluaXRlLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNGaW5pdGUoLTEwMSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc0Zpbml0ZSgnMTAnKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzRmluaXRlKHRydWUpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICpcbiAgICAgKiBfLmlzRmluaXRlKCcnKTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqXG4gICAgICogXy5pc0Zpbml0ZShJbmZpbml0eSk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc0Zpbml0ZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIG5hdGl2ZUlzRmluaXRlKHZhbHVlKSAmJiAhbmF0aXZlSXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNGdW5jdGlvbihfKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBsYW5ndWFnZSB0eXBlIG9mIE9iamVjdC5cbiAgICAgKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzT2JqZWN0KHt9KTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc09iamVjdCgxKTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gICAgICAvLyBjaGVjayBpZiB0aGUgdmFsdWUgaXMgdGhlIEVDTUFTY3JpcHQgbGFuZ3VhZ2UgdHlwZSBvZiBPYmplY3RcbiAgICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4OFxuICAgICAgLy8gYW5kIGF2b2lkIGEgVjggYnVnXG4gICAgICAvLyBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxXG4gICAgICByZXR1cm4gISEodmFsdWUgJiYgb2JqZWN0VHlwZXNbdHlwZW9mIHZhbHVlXSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYE5hTmAuXG4gICAgICpcbiAgICAgKiBOb3RlOiBUaGlzIGlzIG5vdCB0aGUgc2FtZSBhcyBuYXRpdmUgYGlzTmFOYCB3aGljaCB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yXG4gICAgICogYHVuZGVmaW5lZGAgYW5kIG90aGVyIG5vbi1udW1lcmljIHZhbHVlcy4gU2VlIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuMS4yLjQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzTmFOKE5hTik7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc05hTihuZXcgTnVtYmVyKE5hTikpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIGlzTmFOKHVuZGVmaW5lZCk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5pc05hTih1bmRlZmluZWQpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNOYU4odmFsdWUpIHtcbiAgICAgIC8vIGBOYU5gIGFzIGEgcHJpbWl0aXZlIGlzIHRoZSBvbmx5IHZhbHVlIHRoYXQgaXMgbm90IGVxdWFsIHRvIGl0c2VsZlxuICAgICAgLy8gKHBlcmZvcm0gdGhlIFtbQ2xhc3NdXSBjaGVjayBmaXJzdCB0byBhdm9pZCBlcnJvcnMgd2l0aCBzb21lIGhvc3Qgb2JqZWN0cyBpbiBJRSlcbiAgICAgIHJldHVybiBpc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgIT0gK3ZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGBudWxsYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGBudWxsYCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzTnVsbChudWxsKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmlzTnVsbCh1bmRlZmluZWQpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNOdWxsKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBudW1iZXIuXG4gICAgICpcbiAgICAgKiBOb3RlOiBgTmFOYCBpcyBjb25zaWRlcmVkIGEgbnVtYmVyLiBTZWUgaHR0cDovL2VzNS5naXRodWIuaW8vI3g4LjUuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIG51bWJlciwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzTnVtYmVyKDguNCAqIDUpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fFxuICAgICAgICB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gbnVtYmVyQ2xhc3MgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBmdW5jdGlvbiBTaGFwZSgpIHtcbiAgICAgKiAgIHRoaXMueCA9IDA7XG4gICAgICogICB0aGlzLnkgPSAwO1xuICAgICAqIH1cbiAgICAgKlxuICAgICAqIF8uaXNQbGFpbk9iamVjdChuZXcgU2hhcGUpO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICpcbiAgICAgKiBfLmlzUGxhaW5PYmplY3QoWzEsIDIsIDNdKTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqXG4gICAgICogXy5pc1BsYWluT2JqZWN0KHsgJ3gnOiAwLCAneSc6IDAgfSk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBpc1BsYWluT2JqZWN0ID0gIWdldFByb3RvdHlwZU9mID8gc2hpbUlzUGxhaW5PYmplY3QgOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCEodmFsdWUgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gb2JqZWN0Q2xhc3MpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHZhciB2YWx1ZU9mID0gdmFsdWUudmFsdWVPZixcbiAgICAgICAgICBvYmpQcm90byA9IGlzTmF0aXZlKHZhbHVlT2YpICYmIChvYmpQcm90byA9IGdldFByb3RvdHlwZU9mKHZhbHVlT2YpKSAmJiBnZXRQcm90b3R5cGVPZihvYmpQcm90byk7XG5cbiAgICAgIHJldHVybiBvYmpQcm90b1xuICAgICAgICA/ICh2YWx1ZSA9PSBvYmpQcm90byB8fCBnZXRQcm90b3R5cGVPZih2YWx1ZSkgPT0gb2JqUHJvdG8pXG4gICAgICAgIDogc2hpbUlzUGxhaW5PYmplY3QodmFsdWUpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGEgcmVndWxhciBleHByZXNzaW9uLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNSZWdFeHAoL2ZyZWQvKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNSZWdFeHAodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gcmVnZXhwQ2xhc3MgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIHN0cmluZywgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmlzU3RyaW5nKCdmcmVkJyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8XG4gICAgICAgIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzdHJpbmdDbGFzcyB8fCBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBgdW5kZWZpbmVkYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaXNVbmRlZmluZWQodm9pZCAwKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBrZXlzIGFzIGBvYmplY3RgIGFuZCB2YWx1ZXMgZ2VuZXJhdGVkIGJ5XG4gICAgICogcnVubmluZyBlYWNoIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG9mIGBvYmplY3RgIHRocm91Z2ggdGhlIGNhbGxiYWNrLlxuICAgICAqIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7XG4gICAgICogKHZhbHVlLCBrZXksIG9iamVjdCkuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBvYmplY3Qgd2l0aCB2YWx1ZXMgb2YgdGhlIHJlc3VsdHMgb2YgZWFjaCBgY2FsbGJhY2tgIGV4ZWN1dGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5tYXBWYWx1ZXMoeyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzfSAsIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gbnVtICogMzsgfSk7XG4gICAgICogLy8gPT4geyAnYSc6IDMsICdiJzogNiwgJ2MnOiA5IH1cbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0ge1xuICAgICAqICAgJ2ZyZWQnOiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfSxcbiAgICAgKiAgICdwZWJibGVzJzogeyAnbmFtZSc6ICdwZWJibGVzJywgJ2FnZSc6IDEgfVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLm1hcFZhbHVlcyhjaGFyYWN0ZXJzLCAnYWdlJyk7XG4gICAgICogLy8gPT4geyAnZnJlZCc6IDQwLCAncGViYmxlcyc6IDEgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1hcFZhbHVlcyhvYmplY3QsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG5cbiAgICAgIGZvck93bihvYmplY3QsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgICAgICByZXN1bHRba2V5XSA9IGNhbGxiYWNrKHZhbHVlLCBrZXksIG9iamVjdCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVjdXJzaXZlbHkgbWVyZ2VzIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgdGhlIHNvdXJjZSBvYmplY3QocyksIHRoYXRcbiAgICAgKiBkb24ndCByZXNvbHZlIHRvIGB1bmRlZmluZWRgIGludG8gdGhlIGRlc3RpbmF0aW9uIG9iamVjdC4gU3Vic2VxdWVudCBzb3VyY2VzXG4gICAgICogd2lsbCBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy4gSWYgYSBjYWxsYmFjayBpc1xuICAgICAqIHByb3ZpZGVkIGl0IHdpbGwgYmUgZXhlY3V0ZWQgdG8gcHJvZHVjZSB0aGUgbWVyZ2VkIHZhbHVlcyBvZiB0aGUgZGVzdGluYXRpb25cbiAgICAgKiBhbmQgc291cmNlIHByb3BlcnRpZXMuIElmIHRoZSBjYWxsYmFjayByZXR1cm5zIGB1bmRlZmluZWRgIG1lcmdpbmcgd2lsbFxuICAgICAqIGJlIGhhbmRsZWQgYnkgdGhlIG1ldGhvZCBpbnN0ZWFkLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZFxuICAgICAqIGludm9rZWQgd2l0aCB0d28gYXJndW1lbnRzOyAob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlKS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlXSBUaGUgc291cmNlIG9iamVjdHMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdpbmcgcHJvcGVydGllcy5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBuYW1lcyA9IHtcbiAgICAgKiAgICdjaGFyYWN0ZXJzJzogW1xuICAgICAqICAgICB7ICduYW1lJzogJ2Jhcm5leScgfSxcbiAgICAgKiAgICAgeyAnbmFtZSc6ICdmcmVkJyB9XG4gICAgICogICBdXG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIHZhciBhZ2VzID0ge1xuICAgICAqICAgJ2NoYXJhY3RlcnMnOiBbXG4gICAgICogICAgIHsgJ2FnZSc6IDM2IH0sXG4gICAgICogICAgIHsgJ2FnZSc6IDQwIH1cbiAgICAgKiAgIF1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5tZXJnZShuYW1lcywgYWdlcyk7XG4gICAgICogLy8gPT4geyAnY2hhcmFjdGVycyc6IFt7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LCB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfV0gfVxuICAgICAqXG4gICAgICogdmFyIGZvb2QgPSB7XG4gICAgICogICAnZnJ1aXRzJzogWydhcHBsZSddLFxuICAgICAqICAgJ3ZlZ2V0YWJsZXMnOiBbJ2JlZXQnXVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgb3RoZXJGb29kID0ge1xuICAgICAqICAgJ2ZydWl0cyc6IFsnYmFuYW5hJ10sXG4gICAgICogICAndmVnZXRhYmxlcyc6IFsnY2Fycm90J11cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5tZXJnZShmb29kLCBvdGhlckZvb2QsIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgKiAgIHJldHVybiBfLmlzQXJyYXkoYSkgPyBhLmNvbmNhdChiKSA6IHVuZGVmaW5lZDtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiB7ICdmcnVpdHMnOiBbJ2FwcGxlJywgJ2JhbmFuYSddLCAndmVnZXRhYmxlcyc6IFsnYmVldCcsICdjYXJyb3RdIH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtZXJnZShvYmplY3QpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICAgIGxlbmd0aCA9IDI7XG5cbiAgICAgIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfVxuICAgICAgLy8gYWxsb3dzIHdvcmtpbmcgd2l0aCBgXy5yZWR1Y2VgIGFuZCBgXy5yZWR1Y2VSaWdodGAgd2l0aG91dCB1c2luZ1xuICAgICAgLy8gdGhlaXIgYGluZGV4YCBhbmQgYGNvbGxlY3Rpb25gIGFyZ3VtZW50c1xuICAgICAgaWYgKHR5cGVvZiBhcmdzWzJdICE9ICdudW1iZXInKSB7XG4gICAgICAgIGxlbmd0aCA9IGFyZ3MubGVuZ3RoO1xuICAgICAgfVxuICAgICAgaWYgKGxlbmd0aCA+IDMgJiYgdHlwZW9mIGFyZ3NbbGVuZ3RoIC0gMl0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBiYXNlQ3JlYXRlQ2FsbGJhY2soYXJnc1stLWxlbmd0aCAtIDFdLCBhcmdzW2xlbmd0aC0tXSwgMik7XG4gICAgICB9IGVsc2UgaWYgKGxlbmd0aCA+IDIgJiYgdHlwZW9mIGFyZ3NbbGVuZ3RoIC0gMV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IGFyZ3NbLS1sZW5ndGhdO1xuICAgICAgfVxuICAgICAgdmFyIHNvdXJjZXMgPSBzbGljZShhcmd1bWVudHMsIDEsIGxlbmd0aCksXG4gICAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgICBzdGFja0EgPSBnZXRBcnJheSgpLFxuICAgICAgICAgIHN0YWNrQiA9IGdldEFycmF5KCk7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGJhc2VNZXJnZShvYmplY3QsIHNvdXJjZXNbaW5kZXhdLCBjYWxsYmFjaywgc3RhY2tBLCBzdGFja0IpO1xuICAgICAgfVxuICAgICAgcmVsZWFzZUFycmF5KHN0YWNrQSk7XG4gICAgICByZWxlYXNlQXJyYXkoc3RhY2tCKTtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYG9iamVjdGAgZXhjbHVkaW5nIHRoZSBzcGVjaWZpZWQgcHJvcGVydGllcy5cbiAgICAgKiBQcm9wZXJ0eSBuYW1lcyBtYXkgYmUgc3BlY2lmaWVkIGFzIGluZGl2aWR1YWwgYXJndW1lbnRzIG9yIGFzIGFycmF5cyBvZlxuICAgICAqIHByb3BlcnR5IG5hbWVzLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgZXhlY3V0ZWQgZm9yIGVhY2hcbiAgICAgKiBwcm9wZXJ0eSBvZiBgb2JqZWN0YCBvbWl0dGluZyB0aGUgcHJvcGVydGllcyB0aGUgY2FsbGJhY2sgcmV0dXJucyB0cnVleVxuICAgICAqIGZvci4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50cztcbiAgICAgKiAodmFsdWUsIGtleSwgb2JqZWN0KS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufC4uLnN0cmluZ3xzdHJpbmdbXX0gW2NhbGxiYWNrXSBUaGUgcHJvcGVydGllcyB0byBvbWl0IG9yIHRoZVxuICAgICAqICBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCB3aXRob3V0IHRoZSBvbWl0dGVkIHByb3BlcnRpZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ub21pdCh7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfSwgJ2FnZScpO1xuICAgICAqIC8vID0+IHsgJ25hbWUnOiAnZnJlZCcgfVxuICAgICAqXG4gICAgICogXy5vbWl0KHsgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCB9LCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAqICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJztcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2ZyZWQnIH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBvbWl0KG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgcHJvcHMgPSBbXTtcbiAgICAgICAgZm9ySW4ob2JqZWN0LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgcHJvcHMucHVzaChrZXkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcHJvcHMgPSBiYXNlRGlmZmVyZW5jZShwcm9wcywgYmFzZUZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCBmYWxzZSwgMSkpO1xuXG4gICAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIGZvckluKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqZWN0KSB7XG4gICAgICAgICAgaWYgKCFjYWxsYmFjayh2YWx1ZSwga2V5LCBvYmplY3QpKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSB0d28gZGltZW5zaW9uYWwgYXJyYXkgb2YgYW4gb2JqZWN0J3Mga2V5LXZhbHVlIHBhaXJzLFxuICAgICAqIGkuZS4gYFtba2V5MSwgdmFsdWUxXSwgW2tleTIsIHZhbHVlMl1dYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIG5ldyBhcnJheSBvZiBrZXktdmFsdWUgcGFpcnMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ucGFpcnMoeyAnYmFybmV5JzogMzYsICdmcmVkJzogNDAgfSk7XG4gICAgICogLy8gPT4gW1snYmFybmV5JywgMzZdLCBbJ2ZyZWQnLCA0MF1dIChwcm9wZXJ0eSBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCBhY3Jvc3MgZW52aXJvbm1lbnRzKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhaXJzKG9iamVjdCkge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgcHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBba2V5LCBvYmplY3Rba2V5XV07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBzaGFsbG93IGNsb25lIG9mIGBvYmplY3RgIGNvbXBvc2VkIG9mIHRoZSBzcGVjaWZpZWQgcHJvcGVydGllcy5cbiAgICAgKiBQcm9wZXJ0eSBuYW1lcyBtYXkgYmUgc3BlY2lmaWVkIGFzIGluZGl2aWR1YWwgYXJndW1lbnRzIG9yIGFzIGFycmF5cyBvZlxuICAgICAqIHByb3BlcnR5IG5hbWVzLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgZXhlY3V0ZWQgZm9yIGVhY2hcbiAgICAgKiBwcm9wZXJ0eSBvZiBgb2JqZWN0YCBwaWNraW5nIHRoZSBwcm9wZXJ0aWVzIHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWV5XG4gICAgICogZm9yLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzO1xuICAgICAqICh2YWx1ZSwga2V5LCBvYmplY3QpLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258Li4uc3RyaW5nfHN0cmluZ1tdfSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyXG4gICAgICogIGl0ZXJhdGlvbiBvciBwcm9wZXJ0eSBuYW1lcyB0byBwaWNrLCBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBwcm9wZXJ0eVxuICAgICAqICBuYW1lcyBvciBhcnJheXMgb2YgcHJvcGVydHkgbmFtZXMuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIHBpY2tlZCBwcm9wZXJ0aWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnBpY2soeyAnbmFtZSc6ICdmcmVkJywgJ191c2VyaWQnOiAnZnJlZDEnIH0sICduYW1lJyk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdmcmVkJyB9XG4gICAgICpcbiAgICAgKiBfLnBpY2soeyAnbmFtZSc6ICdmcmVkJywgJ191c2VyaWQnOiAnZnJlZDEnIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgKiAgIHJldHVybiBrZXkuY2hhckF0KDApICE9ICdfJztcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2ZyZWQnIH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwaWNrKG9iamVjdCwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICAgIHByb3BzID0gYmFzZUZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCBmYWxzZSwgMSksXG4gICAgICAgICAgICBsZW5ndGggPSBpc09iamVjdChvYmplY3QpID8gcHJvcHMubGVuZ3RoIDogMDtcblxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIGZvckluKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqZWN0KSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBrZXksIG9iamVjdCkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW4gYWx0ZXJuYXRpdmUgdG8gYF8ucmVkdWNlYCB0aGlzIG1ldGhvZCB0cmFuc2Zvcm1zIGBvYmplY3RgIHRvIGEgbmV3XG4gICAgICogYGFjY3VtdWxhdG9yYCBvYmplY3Qgd2hpY2ggaXMgdGhlIHJlc3VsdCBvZiBydW5uaW5nIGVhY2ggb2YgaXRzIG93blxuICAgICAqIGVudW1lcmFibGUgcHJvcGVydGllcyB0aHJvdWdoIGEgY2FsbGJhY2ssIHdpdGggZWFjaCBjYWxsYmFjayBleGVjdXRpb25cbiAgICAgKiBwb3RlbnRpYWxseSBtdXRhdGluZyB0aGUgYGFjY3VtdWxhdG9yYCBvYmplY3QuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0b1xuICAgICAqIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIGZvdXIgYXJndW1lbnRzOyAoYWNjdW11bGF0b3IsIHZhbHVlLCBrZXksIG9iamVjdCkuXG4gICAgICogQ2FsbGJhY2tzIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Kn0gW2FjY3VtdWxhdG9yXSBUaGUgY3VzdG9tIGFjY3VtdWxhdG9yIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHNxdWFyZXMgPSBfLnRyYW5zZm9ybShbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTBdLCBmdW5jdGlvbihyZXN1bHQsIG51bSkge1xuICAgICAqICAgbnVtICo9IG51bTtcbiAgICAgKiAgIGlmIChudW0gJSAyKSB7XG4gICAgICogICAgIHJldHVybiByZXN1bHQucHVzaChudW0pIDwgMztcbiAgICAgKiAgIH1cbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiBbMSwgOSwgMjVdXG4gICAgICpcbiAgICAgKiB2YXIgbWFwcGVkID0gXy50cmFuc2Zvcm0oeyAnYSc6IDEsICdiJzogMiwgJ2MnOiAzIH0sIGZ1bmN0aW9uKHJlc3VsdCwgbnVtLCBrZXkpIHtcbiAgICAgKiAgIHJlc3VsdFtrZXldID0gbnVtICogMztcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiB7ICdhJzogMywgJ2InOiA2LCAnYyc6IDkgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRyYW5zZm9ybShvYmplY3QsIGNhbGxiYWNrLCBhY2N1bXVsYXRvciwgdGhpc0FyZykge1xuICAgICAgdmFyIGlzQXJyID0gaXNBcnJheShvYmplY3QpO1xuICAgICAgaWYgKGFjY3VtdWxhdG9yID09IG51bGwpIHtcbiAgICAgICAgaWYgKGlzQXJyKSB7XG4gICAgICAgICAgYWNjdW11bGF0b3IgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgY3RvciA9IG9iamVjdCAmJiBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgICAgICAgIHByb3RvID0gY3RvciAmJiBjdG9yLnByb3RvdHlwZTtcblxuICAgICAgICAgIGFjY3VtdWxhdG9yID0gYmFzZUNyZWF0ZShwcm90byk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgNCk7XG4gICAgICAgIChpc0FyciA/IGZvckVhY2ggOiBmb3JPd24pKG9iamVjdCwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgb2JqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjdW11bGF0b3I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBjb21wb3NlZCBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgdmFsdWVzIG9mIGBvYmplY3RgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgcHJvcGVydHkgdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnZhbHVlcyh7ICdvbmUnOiAxLCAndHdvJzogMiwgJ3RocmVlJzogMyB9KTtcbiAgICAgKiAvLyA9PiBbMSwgMiwgM10gKHByb3BlcnR5IG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkIGFjcm9zcyBlbnZpcm9ubWVudHMpXG4gICAgICovXG4gICAgZnVuY3Rpb24gdmFsdWVzKG9iamVjdCkge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgcHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBvYmplY3RbcHJvcHNbaW5kZXhdXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIGVsZW1lbnRzIGZyb20gdGhlIHNwZWNpZmllZCBpbmRleGVzLCBvciBrZXlzLCBvZiB0aGVcbiAgICAgKiBgY29sbGVjdGlvbmAuIEluZGV4ZXMgbWF5IGJlIHNwZWNpZmllZCBhcyBpbmRpdmlkdWFsIGFyZ3VtZW50cyBvciBhcyBhcnJheXNcbiAgICAgKiBvZiBpbmRleGVzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0gey4uLihudW1iZXJ8bnVtYmVyW118c3RyaW5nfHN0cmluZ1tdKX0gW2luZGV4XSBUaGUgaW5kZXhlcyBvZiBgY29sbGVjdGlvbmBcbiAgICAgKiAgIHRvIHJldHJpZXZlLCBzcGVjaWZpZWQgYXMgaW5kaXZpZHVhbCBpbmRleGVzIG9yIGFycmF5cyBvZiBpbmRleGVzLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBlbGVtZW50cyBjb3JyZXNwb25kaW5nIHRvIHRoZVxuICAgICAqICBwcm92aWRlZCBpbmRleGVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmF0KFsnYScsICdiJywgJ2MnLCAnZCcsICdlJ10sIFswLCAyLCA0XSk7XG4gICAgICogLy8gPT4gWydhJywgJ2MnLCAnZSddXG4gICAgICpcbiAgICAgKiBfLmF0KFsnZnJlZCcsICdiYXJuZXknLCAncGViYmxlcyddLCAwLCAyKTtcbiAgICAgKiAvLyA9PiBbJ2ZyZWQnLCAncGViYmxlcyddXG4gICAgICovXG4gICAgZnVuY3Rpb24gYXQoY29sbGVjdGlvbikge1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgICBwcm9wcyA9IGJhc2VGbGF0dGVuKGFyZ3MsIHRydWUsIGZhbHNlLCAxKSxcbiAgICAgICAgICBsZW5ndGggPSAoYXJnc1syXSAmJiBhcmdzWzJdW2FyZ3NbMV1dID09PSBjb2xsZWN0aW9uKSA/IDEgOiBwcm9wcy5sZW5ndGgsXG4gICAgICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgICAgd2hpbGUoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gY29sbGVjdGlvbltwcm9wc1tpbmRleF1dO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYSBnaXZlbiB2YWx1ZSBpcyBwcmVzZW50IGluIGEgY29sbGVjdGlvbiB1c2luZyBzdHJpY3QgZXF1YWxpdHlcbiAgICAgKiBmb3IgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuIElmIGBmcm9tSW5kZXhgIGlzIG5lZ2F0aXZlLCBpdCBpcyB1c2VkIGFzIHRoZVxuICAgICAqIG9mZnNldCBmcm9tIHRoZSBlbmQgb2YgdGhlIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgaW5jbHVkZVxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHsqfSB0YXJnZXQgVGhlIHZhbHVlIHRvIGNoZWNrIGZvci5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdGFyZ2V0YCBlbGVtZW50IGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uY29udGFpbnMoWzEsIDIsIDNdLCAxKTtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICpcbiAgICAgKiBfLmNvbnRhaW5zKFsxLCAyLCAzXSwgMSwgMik7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIF8uY29udGFpbnMoeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwIH0sICdmcmVkJyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogXy5jb250YWlucygncGViYmxlcycsICdlYicpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjb250YWlucyhjb2xsZWN0aW9uLCB0YXJnZXQsIGZyb21JbmRleCkge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgaW5kZXhPZiA9IGdldEluZGV4T2YoKSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwLFxuICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICBmcm9tSW5kZXggPSAoZnJvbUluZGV4IDwgMCA/IG5hdGl2ZU1heCgwLCBsZW5ndGggKyBmcm9tSW5kZXgpIDogZnJvbUluZGV4KSB8fCAwO1xuICAgICAgaWYgKGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgICAgcmVzdWx0ID0gaW5kZXhPZihjb2xsZWN0aW9uLCB0YXJnZXQsIGZyb21JbmRleCkgPiAtMTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICByZXN1bHQgPSAoaXNTdHJpbmcoY29sbGVjdGlvbikgPyBjb2xsZWN0aW9uLmluZGV4T2YodGFyZ2V0LCBmcm9tSW5kZXgpIDogaW5kZXhPZihjb2xsZWN0aW9uLCB0YXJnZXQsIGZyb21JbmRleCkpID4gLTE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JPd24oY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAoKytpbmRleCA+PSBmcm9tSW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiAhKHJlc3VsdCA9IHZhbHVlID09PSB0YXJnZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIGtleXMgZ2VuZXJhdGVkIGZyb20gdGhlIHJlc3VsdHMgb2YgcnVubmluZ1xuICAgICAqIGVhY2ggZWxlbWVudCBvZiBgY29sbGVjdGlvbmAgdGhyb3VnaCB0aGUgY2FsbGJhY2suIFRoZSBjb3JyZXNwb25kaW5nIHZhbHVlXG4gICAgICogb2YgZWFjaCBrZXkgaXMgdGhlIG51bWJlciBvZiB0aW1lcyB0aGUga2V5IHdhcyByZXR1cm5lZCBieSB0aGUgY2FsbGJhY2suXG4gICAgICogVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50cztcbiAgICAgKiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjb21wb3NlZCBhZ2dyZWdhdGUgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmNvdW50QnkoWzQuMywgNi4xLCA2LjRdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIE1hdGguZmxvb3IobnVtKTsgfSk7XG4gICAgICogLy8gPT4geyAnNCc6IDEsICc2JzogMiB9XG4gICAgICpcbiAgICAgKiBfLmNvdW50QnkoWzQuMywgNi4xLCA2LjRdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIHRoaXMuZmxvb3IobnVtKTsgfSwgTWF0aCk7XG4gICAgICogLy8gPT4geyAnNCc6IDEsICc2JzogMiB9XG4gICAgICpcbiAgICAgKiBfLmNvdW50QnkoWydvbmUnLCAndHdvJywgJ3RocmVlJ10sICdsZW5ndGgnKTtcbiAgICAgKiAvLyA9PiB7ICczJzogMiwgJzUnOiAxIH1cbiAgICAgKi9cbiAgICB2YXIgY291bnRCeSA9IGNyZWF0ZUFnZ3JlZ2F0b3IoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgICAoaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSsrIDogcmVzdWx0W2tleV0gPSAxKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gY2FsbGJhY2sgcmV0dXJucyB0cnVleSB2YWx1ZSBmb3IgKiphbGwqKiBlbGVtZW50cyBvZlxuICAgICAqIGEgY29sbGVjdGlvbi4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlXG4gICAgICogYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBhbGxcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFsbCBlbGVtZW50cyBwYXNzZWQgdGhlIGNhbGxiYWNrIGNoZWNrLFxuICAgICAqICBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uZXZlcnkoW3RydWUsIDEsIG51bGwsICd5ZXMnXSk7XG4gICAgICogLy8gPT4gZmFsc2VcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5ldmVyeShjaGFyYWN0ZXJzLCAnYWdlJyk7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5ldmVyeShjaGFyYWN0ZXJzLCB7ICdhZ2UnOiAzNiB9KTtcbiAgICAgKiAvLyA9PiBmYWxzZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGV2ZXJ5KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcblxuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMDtcblxuICAgICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicpIHtcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSAhIWNhbGxiYWNrKGNvbGxlY3Rpb25baW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbikpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gKHJlc3VsdCA9ICEhY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGEgY29sbGVjdGlvbiwgcmV0dXJuaW5nIGFuIGFycmF5IG9mIGFsbCBlbGVtZW50c1xuICAgICAqIHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWV5IGZvci4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmRcbiAgICAgKiBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBzZWxlY3RcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGVsZW1lbnRzIHRoYXQgcGFzc2VkIHRoZSBjYWxsYmFjayBjaGVjay5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGV2ZW5zID0gXy5maWx0ZXIoWzEsIDIsIDMsIDQsIDUsIDZdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIG51bSAlIDIgPT0gMDsgfSk7XG4gICAgICogLy8gPT4gWzIsIDQsIDZdXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYmxvY2tlZCc6IGZhbHNlIH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCwgJ2Jsb2NrZWQnOiB0cnVlIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maWx0ZXIoY2hhcmFjdGVycywgJ2Jsb2NrZWQnKTtcbiAgICAgKiAvLyA9PiBbeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IHRydWUgfV1cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uZmlsdGVyKGNoYXJhY3RlcnMsIHsgJ2FnZSc6IDM2IH0pO1xuICAgICAqIC8vID0+IFt7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbHRlcihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuXG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwO1xuXG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGNvbGxlY3Rpb25baW5kZXhdO1xuICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JPd24oY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGEgY29sbGVjdGlvbiwgcmV0dXJuaW5nIHRoZSBmaXJzdCBlbGVtZW50IHRoYXRcbiAgICAgKiB0aGUgY2FsbGJhY2sgcmV0dXJucyB0cnVleSBmb3IuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kXG4gICAgICogaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgZGV0ZWN0LCBmaW5kV2hlcmVcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZvdW5kIGVsZW1lbnQsIGVsc2UgYHVuZGVmaW5lZGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAgJ2FnZSc6IDM2LCAnYmxvY2tlZCc6IGZhbHNlIH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICAnYWdlJzogNDAsICdibG9ja2VkJzogdHJ1ZSB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdwZWJibGVzJywgJ2FnZSc6IDEsICAnYmxvY2tlZCc6IGZhbHNlIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogXy5maW5kKGNoYXJhY3RlcnMsIGZ1bmN0aW9uKGNocikge1xuICAgICAqICAgcmV0dXJuIGNoci5hZ2UgPCA0MDtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpbmQoY2hhcmFjdGVycywgeyAnYWdlJzogMSB9KTtcbiAgICAgKiAvLyA9PiAgeyAnbmFtZSc6ICdwZWJibGVzJywgJ2FnZSc6IDEsICdibG9ja2VkJzogZmFsc2UgfVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kKGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IHRydWUgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpbmQoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcblxuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMDtcblxuICAgICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicpIHtcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBjb2xsZWN0aW9uW2luZGV4XTtcbiAgICAgICAgICBpZiAoY2FsbGJhY2sodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgZm9yT3duKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZmluZGAgZXhjZXB0IHRoYXQgaXQgaXRlcmF0ZXMgb3ZlciBlbGVtZW50c1xuICAgICAqIG9mIGEgYGNvbGxlY3Rpb25gIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgdW5kZWZpbmVkYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5maW5kTGFzdChbMSwgMiwgMywgNF0sIGZ1bmN0aW9uKG51bSkge1xuICAgICAqICAgcmV0dXJuIG51bSAlIDIgPT0gMTtcbiAgICAgKiB9KTtcbiAgICAgKiAvLyA9PiAzXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZExhc3QoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICBmb3JFYWNoUmlnaHQoY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBhIGNvbGxlY3Rpb24sIGV4ZWN1dGluZyB0aGUgY2FsbGJhY2sgZm9yIGVhY2hcbiAgICAgKiBlbGVtZW50LiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzO1xuICAgICAqICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS4gQ2FsbGJhY2tzIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieVxuICAgICAqIGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBOb3RlOiBBcyB3aXRoIG90aGVyIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzLCBvYmplY3RzIHdpdGggYSBgbGVuZ3RoYCBwcm9wZXJ0eVxuICAgICAqIGFyZSBpdGVyYXRlZCBsaWtlIGFycmF5cy4gVG8gYXZvaWQgdGhpcyBiZWhhdmlvciBgXy5mb3JJbmAgb3IgYF8uZm9yT3duYFxuICAgICAqIG1heSBiZSB1c2VkIGZvciBvYmplY3QgaXRlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIGVhY2hcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8c3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXyhbMSwgMiwgM10pLmZvckVhY2goZnVuY3Rpb24obnVtKSB7IGNvbnNvbGUubG9nKG51bSk7IH0pLmpvaW4oJywnKTtcbiAgICAgKiAvLyA9PiBsb2dzIGVhY2ggbnVtYmVyIGFuZCByZXR1cm5zICcxLDIsMydcbiAgICAgKlxuICAgICAqIF8uZm9yRWFjaCh7ICdvbmUnOiAxLCAndHdvJzogMiwgJ3RocmVlJzogMyB9LCBmdW5jdGlvbihudW0pIHsgY29uc29sZS5sb2cobnVtKTsgfSk7XG4gICAgICogLy8gPT4gbG9ncyBlYWNoIG51bWJlciBhbmQgcmV0dXJucyB0aGUgb2JqZWN0IChwcm9wZXJ0eSBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCBhY3Jvc3MgZW52aXJvbm1lbnRzKVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDA7XG5cbiAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgJiYgdHlwZW9mIHRoaXNBcmcgPT0gJ3VuZGVmaW5lZCcgPyBjYWxsYmFjayA6IGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIGlmIChjYWxsYmFjayhjb2xsZWN0aW9uW2luZGV4XSwgaW5kZXgsIGNvbGxlY3Rpb24pID09PSBmYWxzZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JPd24oY29sbGVjdGlvbiwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5mb3JFYWNoYCBleGNlcHQgdGhhdCBpdCBpdGVyYXRlcyBvdmVyIGVsZW1lbnRzXG4gICAgICogb2YgYSBgY29sbGVjdGlvbmAgZnJvbSByaWdodCB0byBsZWZ0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIGVhY2hSaWdodFxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fE9iamVjdHxzdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfKFsxLCAyLCAzXSkuZm9yRWFjaFJpZ2h0KGZ1bmN0aW9uKG51bSkgeyBjb25zb2xlLmxvZyhudW0pOyB9KS5qb2luKCcsJyk7XG4gICAgICogLy8gPT4gbG9ncyBlYWNoIG51bWJlciBmcm9tIHJpZ2h0IHRvIGxlZnQgYW5kIHJldHVybnMgJzMsMiwxJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZvckVhY2hSaWdodChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDA7XG4gICAgICBjYWxsYmFjayA9IGNhbGxiYWNrICYmIHR5cGVvZiB0aGlzQXJnID09ICd1bmRlZmluZWQnID8gY2FsbGJhY2sgOiBiYXNlQ3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicpIHtcbiAgICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrKGNvbGxlY3Rpb25bbGVuZ3RoXSwgbGVuZ3RoLCBjb2xsZWN0aW9uKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHByb3BzID0ga2V5cyhjb2xsZWN0aW9uKTtcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgICAgICBmb3JPd24oY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGtleSwgY29sbGVjdGlvbikge1xuICAgICAgICAgIGtleSA9IHByb3BzID8gcHJvcHNbLS1sZW5ndGhdIDogLS1sZW5ndGg7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNvbGxlY3Rpb25ba2V5XSwga2V5LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIG9iamVjdCBjb21wb3NlZCBvZiBrZXlzIGdlbmVyYXRlZCBmcm9tIHRoZSByZXN1bHRzIG9mIHJ1bm5pbmdcbiAgICAgKiBlYWNoIGVsZW1lbnQgb2YgYSBjb2xsZWN0aW9uIHRocm91Z2ggdGhlIGNhbGxiYWNrLiBUaGUgY29ycmVzcG9uZGluZyB2YWx1ZVxuICAgICAqIG9mIGVhY2gga2V5IGlzIGFuIGFycmF5IG9mIHRoZSBlbGVtZW50cyByZXNwb25zaWJsZSBmb3IgZ2VuZXJhdGluZyB0aGUga2V5LlxuICAgICAqIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7XG4gICAgICogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWBcbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjb21wb3NlZCBhZ2dyZWdhdGUgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmdyb3VwQnkoWzQuMiwgNi4xLCA2LjRdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIE1hdGguZmxvb3IobnVtKTsgfSk7XG4gICAgICogLy8gPT4geyAnNCc6IFs0LjJdLCAnNic6IFs2LjEsIDYuNF0gfVxuICAgICAqXG4gICAgICogXy5ncm91cEJ5KFs0LjIsIDYuMSwgNi40XSwgZnVuY3Rpb24obnVtKSB7IHJldHVybiB0aGlzLmZsb29yKG51bSk7IH0sIE1hdGgpO1xuICAgICAqIC8vID0+IHsgJzQnOiBbNC4yXSwgJzYnOiBbNi4xLCA2LjRdIH1cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uZ3JvdXBCeShbJ29uZScsICd0d28nLCAndGhyZWUnXSwgJ2xlbmd0aCcpO1xuICAgICAqIC8vID0+IHsgJzMnOiBbJ29uZScsICd0d28nXSwgJzUnOiBbJ3RocmVlJ10gfVxuICAgICAqL1xuICAgIHZhciBncm91cEJ5ID0gY3JlYXRlQWdncmVnYXRvcihmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICAgIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdCwga2V5KSA/IHJlc3VsdFtrZXldIDogcmVzdWx0W2tleV0gPSBbXSkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIG9iamVjdCBjb21wb3NlZCBvZiBrZXlzIGdlbmVyYXRlZCBmcm9tIHRoZSByZXN1bHRzIG9mIHJ1bm5pbmdcbiAgICAgKiBlYWNoIGVsZW1lbnQgb2YgdGhlIGNvbGxlY3Rpb24gdGhyb3VnaCB0aGUgZ2l2ZW4gY2FsbGJhY2suIFRoZSBjb3JyZXNwb25kaW5nXG4gICAgICogdmFsdWUgb2YgZWFjaCBrZXkgaXMgdGhlIGxhc3QgZWxlbWVudCByZXNwb25zaWJsZSBmb3IgZ2VuZXJhdGluZyB0aGUga2V5LlxuICAgICAqIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7XG4gICAgICogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY29tcG9zZWQgYWdncmVnYXRlIG9iamVjdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGtleXMgPSBbXG4gICAgICogICB7ICdkaXInOiAnbGVmdCcsICdjb2RlJzogOTcgfSxcbiAgICAgKiAgIHsgJ2Rpcic6ICdyaWdodCcsICdjb2RlJzogMTAwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogXy5pbmRleEJ5KGtleXMsICdkaXInKTtcbiAgICAgKiAvLyA9PiB7ICdsZWZ0JzogeyAnZGlyJzogJ2xlZnQnLCAnY29kZSc6IDk3IH0sICdyaWdodCc6IHsgJ2Rpcic6ICdyaWdodCcsICdjb2RlJzogMTAwIH0gfVxuICAgICAqXG4gICAgICogXy5pbmRleEJ5KGtleXMsIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShrZXkuY29kZSk7IH0pO1xuICAgICAqIC8vID0+IHsgJ2EnOiB7ICdkaXInOiAnbGVmdCcsICdjb2RlJzogOTcgfSwgJ2QnOiB7ICdkaXInOiAncmlnaHQnLCAnY29kZSc6IDEwMCB9IH1cbiAgICAgKlxuICAgICAqIF8uaW5kZXhCeShjaGFyYWN0ZXJzLCBmdW5jdGlvbihrZXkpIHsgdGhpcy5mcm9tQ2hhckNvZGUoa2V5LmNvZGUpOyB9LCBTdHJpbmcpO1xuICAgICAqIC8vID0+IHsgJ2EnOiB7ICdkaXInOiAnbGVmdCcsICdjb2RlJzogOTcgfSwgJ2QnOiB7ICdkaXInOiAncmlnaHQnLCAnY29kZSc6IDEwMCB9IH1cbiAgICAgKi9cbiAgICB2YXIgaW5kZXhCeSA9IGNyZWF0ZUFnZ3JlZ2F0b3IoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyB0aGUgbWV0aG9kIG5hbWVkIGJ5IGBtZXRob2ROYW1lYCBvbiBlYWNoIGVsZW1lbnQgaW4gdGhlIGBjb2xsZWN0aW9uYFxuICAgICAqIHJldHVybmluZyBhbiBhcnJheSBvZiB0aGUgcmVzdWx0cyBvZiBlYWNoIGludm9rZWQgbWV0aG9kLiBBZGRpdGlvbmFsIGFyZ3VtZW50c1xuICAgICAqIHdpbGwgYmUgcHJvdmlkZWQgdG8gZWFjaCBpbnZva2VkIG1ldGhvZC4gSWYgYG1ldGhvZE5hbWVgIGlzIGEgZnVuY3Rpb24gaXRcbiAgICAgKiB3aWxsIGJlIGludm9rZWQgZm9yLCBhbmQgYHRoaXNgIGJvdW5kIHRvLCBlYWNoIGVsZW1lbnQgaW4gdGhlIGBjb2xsZWN0aW9uYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmd9IG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0byBpbnZva2Ugb3JcbiAgICAgKiAgdGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0gey4uLip9IFthcmddIEFyZ3VtZW50cyB0byBpbnZva2UgdGhlIG1ldGhvZCB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiB0aGUgcmVzdWx0cyBvZiBlYWNoIGludm9rZWQgbWV0aG9kLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmludm9rZShbWzUsIDEsIDddLCBbMywgMiwgMV1dLCAnc29ydCcpO1xuICAgICAqIC8vID0+IFtbMSwgNSwgN10sIFsxLCAyLCAzXV1cbiAgICAgKlxuICAgICAqIF8uaW52b2tlKFsxMjMsIDQ1Nl0sIFN0cmluZy5wcm90b3R5cGUuc3BsaXQsICcnKTtcbiAgICAgKiAvLyA9PiBbWycxJywgJzInLCAnMyddLCBbJzQnLCAnNScsICc2J11dXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW52b2tlKGNvbGxlY3Rpb24sIG1ldGhvZE5hbWUpIHtcbiAgICAgIHZhciBhcmdzID0gc2xpY2UoYXJndW1lbnRzLCAyKSxcbiAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgIGlzRnVuYyA9IHR5cGVvZiBtZXRob2ROYW1lID09ICdmdW5jdGlvbicsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBBcnJheSh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInID8gbGVuZ3RoIDogMCk7XG5cbiAgICAgIGZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmVzdWx0WysraW5kZXhdID0gKGlzRnVuYyA/IG1ldGhvZE5hbWUgOiB2YWx1ZVttZXRob2ROYW1lXSkuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdmFsdWVzIGJ5IHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uXG4gICAgICogdGhyb3VnaCB0aGUgY2FsbGJhY2suIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aFxuICAgICAqIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgY29sbGVjdFxuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgdGhlIHJlc3VsdHMgb2YgZWFjaCBgY2FsbGJhY2tgIGV4ZWN1dGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5tYXAoWzEsIDIsIDNdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIG51bSAqIDM7IH0pO1xuICAgICAqIC8vID0+IFszLCA2LCA5XVxuICAgICAqXG4gICAgICogXy5tYXAoeyAnb25lJzogMSwgJ3R3byc6IDIsICd0aHJlZSc6IDMgfSwgZnVuY3Rpb24obnVtKSB7IHJldHVybiBudW0gKiAzOyB9KTtcbiAgICAgKiAvLyA9PiBbMywgNiwgOV0gKHByb3BlcnR5IG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkIGFjcm9zcyBlbnZpcm9ubWVudHMpXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ubWFwKGNoYXJhY3RlcnMsICduYW1lJyk7XG4gICAgICogLy8gPT4gWydiYXJuZXknLCAnZnJlZCddXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFwKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uID8gY29sbGVjdGlvbi5sZW5ndGggOiAwO1xuXG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICByZXN1bHRbaW5kZXhdID0gY2FsbGJhY2soY29sbGVjdGlvbltpbmRleF0sIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ID0gW107XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgcmVzdWx0WysraW5kZXhdID0gY2FsbGJhY2sodmFsdWUsIGtleSwgY29sbGVjdGlvbik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIG1heGltdW0gdmFsdWUgb2YgYSBjb2xsZWN0aW9uLiBJZiB0aGUgY29sbGVjdGlvbiBpcyBlbXB0eSBvclxuICAgICAqIGZhbHNleSBgLUluZmluaXR5YCBpcyByZXR1cm5lZC4gSWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGV4ZWN1dGVkXG4gICAgICogZm9yIGVhY2ggdmFsdWUgaW4gdGhlIGNvbGxlY3Rpb24gdG8gZ2VuZXJhdGUgdGhlIGNyaXRlcmlvbiBieSB3aGljaCB0aGUgdmFsdWVcbiAgICAgKiBpcyByYW5rZWQuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZVxuICAgICAqIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWF4aW11bSB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5tYXgoWzQsIDIsIDgsIDZdKTtcbiAgICAgKiAvLyA9PiA4XG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIF8ubWF4KGNoYXJhY3RlcnMsIGZ1bmN0aW9uKGNocikgeyByZXR1cm4gY2hyLmFnZTsgfSk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwIH07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLm1heChjaGFyYWN0ZXJzLCAnYWdlJyk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwIH07XG4gICAgICovXG4gICAgZnVuY3Rpb24gbWF4KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgY29tcHV0ZWQgPSAtSW5maW5pdHksXG4gICAgICAgICAgcmVzdWx0ID0gY29tcHV0ZWQ7XG5cbiAgICAgIC8vIGFsbG93cyB3b3JraW5nIHdpdGggZnVuY3Rpb25zIGxpa2UgYF8ubWFwYCB3aXRob3V0IHVzaW5nXG4gICAgICAvLyB0aGVpciBgaW5kZXhgIGFyZ3VtZW50IGFzIGEgY2FsbGJhY2tcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJyAmJiB0aGlzQXJnICYmIHRoaXNBcmdbY2FsbGJhY2tdID09PSBjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjayA9PSBudWxsICYmIGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGNvbGxlY3Rpb25baW5kZXhdO1xuICAgICAgICAgIGlmICh2YWx1ZSA+IHJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayA9IChjYWxsYmFjayA9PSBudWxsICYmIGlzU3RyaW5nKGNvbGxlY3Rpb24pKVxuICAgICAgICAgID8gY2hhckF0Q2FsbGJhY2tcbiAgICAgICAgICA6IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG5cbiAgICAgICAgZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB2YXIgY3VycmVudCA9IGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICAgICAgaWYgKGN1cnJlbnQgPiBjb21wdXRlZCkge1xuICAgICAgICAgICAgY29tcHV0ZWQgPSBjdXJyZW50O1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBtaW5pbXVtIHZhbHVlIG9mIGEgY29sbGVjdGlvbi4gSWYgdGhlIGNvbGxlY3Rpb24gaXMgZW1wdHkgb3JcbiAgICAgKiBmYWxzZXkgYEluZmluaXR5YCBpcyByZXR1cm5lZC4gSWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGV4ZWN1dGVkXG4gICAgICogZm9yIGVhY2ggdmFsdWUgaW4gdGhlIGNvbGxlY3Rpb24gdG8gZ2VuZXJhdGUgdGhlIGNyaXRlcmlvbiBieSB3aGljaCB0aGUgdmFsdWVcbiAgICAgKiBpcyByYW5rZWQuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZVxuICAgICAqIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8c3RyaW5nfSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGl0ZXJhdGlvbi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWRcbiAgICAgKiAgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWluaW11bSB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5taW4oWzQsIDIsIDgsIDZdKTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIF8ubWluKGNoYXJhY3RlcnMsIGZ1bmN0aW9uKGNocikgeyByZXR1cm4gY2hyLmFnZTsgfSk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ubWluKGNoYXJhY3RlcnMsICdhZ2UnKTtcbiAgICAgKiAvLyA9PiB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9O1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIG1pbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGNvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgICAgcmVzdWx0ID0gY29tcHV0ZWQ7XG5cbiAgICAgIC8vIGFsbG93cyB3b3JraW5nIHdpdGggZnVuY3Rpb25zIGxpa2UgYF8ubWFwYCB3aXRob3V0IHVzaW5nXG4gICAgICAvLyB0aGVpciBgaW5kZXhgIGFyZ3VtZW50IGFzIGEgY2FsbGJhY2tcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJyAmJiB0aGlzQXJnICYmIHRoaXNBcmdbY2FsbGJhY2tdID09PSBjb2xsZWN0aW9uKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjayA9PSBudWxsICYmIGlzQXJyYXkoY29sbGVjdGlvbikpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGNvbGxlY3Rpb25baW5kZXhdO1xuICAgICAgICAgIGlmICh2YWx1ZSA8IHJlc3VsdCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayA9IChjYWxsYmFjayA9PSBudWxsICYmIGlzU3RyaW5nKGNvbGxlY3Rpb24pKVxuICAgICAgICAgID8gY2hhckF0Q2FsbGJhY2tcbiAgICAgICAgICA6IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG5cbiAgICAgICAgZm9yRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICB2YXIgY3VycmVudCA9IGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICAgICAgaWYgKGN1cnJlbnQgPCBjb21wdXRlZCkge1xuICAgICAgICAgICAgY29tcHV0ZWQgPSBjdXJyZW50O1xuICAgICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSB2YWx1ZSBvZiBhIHNwZWNpZmllZCBwcm9wZXJ0eSBmcm9tIGFsbCBlbGVtZW50cyBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIHBsdWNrLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBwcm9wZXJ0eSB2YWx1ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogXy5wbHVjayhjaGFyYWN0ZXJzLCAnbmFtZScpO1xuICAgICAqIC8vID0+IFsnYmFybmV5JywgJ2ZyZWQnXVxuICAgICAqL1xuICAgIHZhciBwbHVjayA9IG1hcDtcblxuICAgIC8qKlxuICAgICAqIFJlZHVjZXMgYSBjb2xsZWN0aW9uIHRvIGEgdmFsdWUgd2hpY2ggaXMgdGhlIGFjY3VtdWxhdGVkIHJlc3VsdCBvZiBydW5uaW5nXG4gICAgICogZWFjaCBlbGVtZW50IGluIHRoZSBjb2xsZWN0aW9uIHRocm91Z2ggdGhlIGNhbGxiYWNrLCB3aGVyZSBlYWNoIHN1Y2Nlc3NpdmVcbiAgICAgKiBjYWxsYmFjayBleGVjdXRpb24gY29uc3VtZXMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgcHJldmlvdXMgZXhlY3V0aW9uLiBJZlxuICAgICAqIGBhY2N1bXVsYXRvcmAgaXMgbm90IHByb3ZpZGVkIHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBjb2xsZWN0aW9uIHdpbGwgYmVcbiAgICAgKiB1c2VkIGFzIHRoZSBpbml0aWFsIGBhY2N1bXVsYXRvcmAgdmFsdWUuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2BcbiAgICAgKiBhbmQgaW52b2tlZCB3aXRoIGZvdXIgYXJndW1lbnRzOyAoYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIGZvbGRsLCBpbmplY3RcbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7Kn0gW2FjY3VtdWxhdG9yXSBJbml0aWFsIHZhbHVlIG9mIHRoZSBhY2N1bXVsYXRvci5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBzdW0gPSBfLnJlZHVjZShbMSwgMiwgM10sIGZ1bmN0aW9uKHN1bSwgbnVtKSB7XG4gICAgICogICByZXR1cm4gc3VtICsgbnVtO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IDZcbiAgICAgKlxuICAgICAqIHZhciBtYXBwZWQgPSBfLnJlZHVjZSh7ICdhJzogMSwgJ2InOiAyLCAnYyc6IDMgfSwgZnVuY3Rpb24ocmVzdWx0LCBudW0sIGtleSkge1xuICAgICAqICAgcmVzdWx0W2tleV0gPSBudW0gKiAzO1xuICAgICAqICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgKiB9LCB7fSk7XG4gICAgICogLy8gPT4geyAnYSc6IDMsICdiJzogNiwgJ2MnOiA5IH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWR1Y2UoY29sbGVjdGlvbiwgY2FsbGJhY2ssIGFjY3VtdWxhdG9yLCB0aGlzQXJnKSB7XG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHJldHVybiBhY2N1bXVsYXRvcjtcbiAgICAgIHZhciBub2FjY3VtID0gYXJndW1lbnRzLmxlbmd0aCA8IDM7XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgNCk7XG5cbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuXG4gICAgICBpZiAodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAobm9hY2N1bSkge1xuICAgICAgICAgIGFjY3VtdWxhdG9yID0gY29sbGVjdGlvblsrK2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIGFjY3VtdWxhdG9yID0gY2FsbGJhY2soYWNjdW11bGF0b3IsIGNvbGxlY3Rpb25baW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICBhY2N1bXVsYXRvciA9IG5vYWNjdW1cbiAgICAgICAgICAgID8gKG5vYWNjdW0gPSBmYWxzZSwgdmFsdWUpXG4gICAgICAgICAgICA6IGNhbGxiYWNrKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8ucmVkdWNlYCBleGNlcHQgdGhhdCBpdCBpdGVyYXRlcyBvdmVyIGVsZW1lbnRzXG4gICAgICogb2YgYSBgY29sbGVjdGlvbmAgZnJvbSByaWdodCB0byBsZWZ0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIGZvbGRyXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0geyp9IFthY2N1bXVsYXRvcl0gSW5pdGlhbCB2YWx1ZSBvZiB0aGUgYWNjdW11bGF0b3IuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgbGlzdCA9IFtbMCwgMV0sIFsyLCAzXSwgWzQsIDVdXTtcbiAgICAgKiB2YXIgZmxhdCA9IF8ucmVkdWNlUmlnaHQobGlzdCwgZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS5jb25jYXQoYik7IH0sIFtdKTtcbiAgICAgKiAvLyA9PiBbNCwgNSwgMiwgMywgMCwgMV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZWR1Y2VSaWdodChjb2xsZWN0aW9uLCBjYWxsYmFjaywgYWNjdW11bGF0b3IsIHRoaXNBcmcpIHtcbiAgICAgIHZhciBub2FjY3VtID0gYXJndW1lbnRzLmxlbmd0aCA8IDM7XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgNCk7XG4gICAgICBmb3JFYWNoUmlnaHQoY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIGFjY3VtdWxhdG9yID0gbm9hY2N1bVxuICAgICAgICAgID8gKG5vYWNjdW0gPSBmYWxzZSwgdmFsdWUpXG4gICAgICAgICAgOiBjYWxsYmFjayhhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGFjY3VtdWxhdG9yO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBvcHBvc2l0ZSBvZiBgXy5maWx0ZXJgIHRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGVsZW1lbnRzIG9mIGFcbiAgICAgKiBjb2xsZWN0aW9uIHRoYXQgdGhlIGNhbGxiYWNrIGRvZXMgKipub3QqKiByZXR1cm4gdHJ1ZXkgZm9yLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGVsZW1lbnRzIHRoYXQgZmFpbGVkIHRoZSBjYWxsYmFjayBjaGVjay5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIG9kZHMgPSBfLnJlamVjdChbMSwgMiwgMywgNCwgNSwgNl0sIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gbnVtICUgMiA9PSAwOyB9KTtcbiAgICAgKiAvLyA9PiBbMSwgMywgNV1cbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYsICdibG9ja2VkJzogZmFsc2UgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IHRydWUgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnJlamVjdChjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpO1xuICAgICAqIC8vID0+IFt7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9XVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5yZWplY3QoY2hhcmFjdGVycywgeyAnYWdlJzogMzYgfSk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCwgJ2Jsb2NrZWQnOiB0cnVlIH1dXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmVqZWN0KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICByZXR1cm4gZmlsdGVyKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gIWNhbGxiYWNrKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgYSByYW5kb20gZWxlbWVudCBvciBgbmAgcmFuZG9tIGVsZW1lbnRzIGZyb20gYSBjb2xsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNhbXBsZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW25dIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gc2FtcGxlLlxuICAgICAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBBbGxvd3Mgd29ya2luZyB3aXRoIGZ1bmN0aW9ucyBsaWtlIGBfLm1hcGBcbiAgICAgKiAgd2l0aG91dCB1c2luZyB0aGVpciBgaW5kZXhgIGFyZ3VtZW50cyBhcyBgbmAuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSByYW5kb20gc2FtcGxlKHMpIG9mIGBjb2xsZWN0aW9uYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5zYW1wbGUoWzEsIDIsIDMsIDRdKTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICpcbiAgICAgKiBfLnNhbXBsZShbMSwgMiwgMywgNF0sIDIpO1xuICAgICAqIC8vID0+IFszLCAxXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNhbXBsZShjb2xsZWN0aW9uLCBuLCBndWFyZCkge1xuICAgICAgaWYgKGNvbGxlY3Rpb24gJiYgdHlwZW9mIGNvbGxlY3Rpb24ubGVuZ3RoICE9ICdudW1iZXInKSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSB2YWx1ZXMoY29sbGVjdGlvbik7XG4gICAgICB9XG4gICAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uID8gY29sbGVjdGlvbltiYXNlUmFuZG9tKDAsIGNvbGxlY3Rpb24ubGVuZ3RoIC0gMSldIDogdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgdmFyIHJlc3VsdCA9IHNodWZmbGUoY29sbGVjdGlvbik7XG4gICAgICByZXN1bHQubGVuZ3RoID0gbmF0aXZlTWluKG5hdGl2ZU1heCgwLCBuKSwgcmVzdWx0Lmxlbmd0aCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygc2h1ZmZsZWQgdmFsdWVzLCB1c2luZyBhIHZlcnNpb24gb2YgdGhlIEZpc2hlci1ZYXRlc1xuICAgICAqIHNodWZmbGUuIFNlZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlci1ZYXRlc19zaHVmZmxlLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIHNodWZmbGUuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IHNodWZmbGVkIGNvbGxlY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uc2h1ZmZsZShbMSwgMiwgMywgNCwgNSwgNl0pO1xuICAgICAqIC8vID0+IFs0LCAxLCA2LCAzLCA1LCAyXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNodWZmbGUoY29sbGVjdGlvbikge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBBcnJheSh0eXBlb2YgbGVuZ3RoID09ICdudW1iZXInID8gbGVuZ3RoIDogMCk7XG5cbiAgICAgIGZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdmFyIHJhbmQgPSBiYXNlUmFuZG9tKDAsICsraW5kZXgpO1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gcmVzdWx0W3JhbmRdO1xuICAgICAgICByZXN1bHRbcmFuZF0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzaXplIG9mIHRoZSBgY29sbGVjdGlvbmAgYnkgcmV0dXJuaW5nIGBjb2xsZWN0aW9uLmxlbmd0aGAgZm9yIGFycmF5c1xuICAgICAqIGFuZCBhcnJheS1saWtlIG9iamVjdHMgb3IgdGhlIG51bWJlciBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIGZvciBvYmplY3RzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGluc3BlY3QuXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBgY29sbGVjdGlvbi5sZW5ndGhgIG9yIG51bWJlciBvZiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnNpemUoWzEsIDJdKTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICpcbiAgICAgKiBfLnNpemUoeyAnb25lJzogMSwgJ3R3byc6IDIsICd0aHJlZSc6IDMgfSk7XG4gICAgICogLy8gPT4gM1xuICAgICAqXG4gICAgICogXy5zaXplKCdwZWJibGVzJyk7XG4gICAgICogLy8gPT4gN1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNpemUoY29sbGVjdGlvbikge1xuICAgICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDA7XG4gICAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyA/IGxlbmd0aCA6IGtleXMoY29sbGVjdGlvbikubGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgY2FsbGJhY2sgcmV0dXJucyBhIHRydWV5IHZhbHVlIGZvciAqKmFueSoqIGVsZW1lbnQgb2YgYVxuICAgICAqIGNvbGxlY3Rpb24uIFRoZSBmdW5jdGlvbiByZXR1cm5zIGFzIHNvb24gYXMgaXQgZmluZHMgYSBwYXNzaW5nIHZhbHVlIGFuZFxuICAgICAqIGRvZXMgbm90IGl0ZXJhdGUgb3ZlciB0aGUgZW50aXJlIGNvbGxlY3Rpb24uIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0b1xuICAgICAqIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgYW55XG4gICAgICogQGNhdGVnb3J5IENvbGxlY3Rpb25zXG4gICAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbnkgZWxlbWVudCBwYXNzZWQgdGhlIGNhbGxiYWNrIGNoZWNrLFxuICAgICAqICBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uc29tZShbbnVsbCwgMCwgJ3llcycsIGZhbHNlXSwgQm9vbGVhbik7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2Jsb2NrZWQnOiBmYWxzZSB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAsICdibG9ja2VkJzogdHJ1ZSB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uc29tZShjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpO1xuICAgICAqIC8vID0+IHRydWVcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uc29tZShjaGFyYWN0ZXJzLCB7ICdhZ2UnOiAxIH0pO1xuICAgICAqIC8vID0+IGZhbHNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gc29tZShjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcblxuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24ubGVuZ3RoIDogMDtcblxuICAgICAgaWYgKHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicpIHtcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICBpZiAoKHJlc3VsdCA9IGNhbGxiYWNrKGNvbGxlY3Rpb25baW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbikpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvck93bihjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgICByZXR1cm4gIShyZXN1bHQgPSBjYWxsYmFjayh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gISFyZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBvZiBlbGVtZW50cywgc29ydGVkIGluIGFzY2VuZGluZyBvcmRlciBieSB0aGUgcmVzdWx0cyBvZlxuICAgICAqIHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIGEgY29sbGVjdGlvbiB0aHJvdWdoIHRoZSBjYWxsYmFjay4gVGhpcyBtZXRob2RcbiAgICAgKiBwZXJmb3JtcyBhIHN0YWJsZSBzb3J0LCB0aGF0IGlzLCBpdCB3aWxsIHByZXNlcnZlIHRoZSBvcmlnaW5hbCBzb3J0IG9yZGVyXG4gICAgICogb2YgZXF1YWwgZWxlbWVudHMuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aFxuICAgICAqIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNvbGxlY3Rpb25cbiAgICAgKiB3aWxsIGJlIHNvcnRlZCBieSBlYWNoIHByb3BlcnR5IHZhbHVlLlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7QXJyYXl8RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIHNvcnRlZCBlbGVtZW50cy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5zb3J0QnkoWzEsIDIsIDNdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIE1hdGguc2luKG51bSk7IH0pO1xuICAgICAqIC8vID0+IFszLCAxLCAyXVxuICAgICAqXG4gICAgICogXy5zb3J0QnkoWzEsIDIsIDNdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIHRoaXMuc2luKG51bSk7IH0sIE1hdGgpO1xuICAgICAqIC8vID0+IFszLCAxLCAyXVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYWdlJzogMzYgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdhZ2UnOiA0MCB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdiYXJuZXknLCAgJ2FnZSc6IDI2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICAnYWdlJzogMzAgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLm1hcChfLnNvcnRCeShjaGFyYWN0ZXJzLCAnYWdlJyksIF8udmFsdWVzKTtcbiAgICAgKiAvLyA9PiBbWydiYXJuZXknLCAyNl0sIFsnZnJlZCcsIDMwXSwgWydiYXJuZXknLCAzNl0sIFsnZnJlZCcsIDQwXV1cbiAgICAgKlxuICAgICAqIC8vIHNvcnRpbmcgYnkgbXVsdGlwbGUgcHJvcGVydGllc1xuICAgICAqIF8ubWFwKF8uc29ydEJ5KGNoYXJhY3RlcnMsIFsnbmFtZScsICdhZ2UnXSksIF8udmFsdWVzKTtcbiAgICAgKiAvLyA9ID4gW1snYmFybmV5JywgMjZdLCBbJ2Jhcm5leScsIDM2XSwgWydmcmVkJywgMzBdLCBbJ2ZyZWQnLCA0MF1dXG4gICAgICovXG4gICAgZnVuY3Rpb24gc29ydEJ5KGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBpc0FyciA9IGlzQXJyYXkoY2FsbGJhY2spLFxuICAgICAgICAgIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBjb2xsZWN0aW9uLmxlbmd0aCA6IDAsXG4gICAgICAgICAgcmVzdWx0ID0gQXJyYXkodHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyA/IGxlbmd0aCA6IDApO1xuXG4gICAgICBpZiAoIWlzQXJyKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIH1cbiAgICAgIGZvckVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGtleSwgY29sbGVjdGlvbikge1xuICAgICAgICB2YXIgb2JqZWN0ID0gcmVzdWx0WysraW5kZXhdID0gZ2V0T2JqZWN0KCk7XG4gICAgICAgIGlmIChpc0Fycikge1xuICAgICAgICAgIG9iamVjdC5jcml0ZXJpYSA9IG1hcChjYWxsYmFjaywgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAob2JqZWN0LmNyaXRlcmlhID0gZ2V0QXJyYXkoKSlbMF0gPSBjYWxsYmFjayh2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBvYmplY3QuaW5kZXggPSBpbmRleDtcbiAgICAgICAgb2JqZWN0LnZhbHVlID0gdmFsdWU7XG4gICAgICB9KTtcblxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcbiAgICAgIHJlc3VsdC5zb3J0KGNvbXBhcmVBc2NlbmRpbmcpO1xuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSByZXN1bHRbbGVuZ3RoXTtcbiAgICAgICAgcmVzdWx0W2xlbmd0aF0gPSBvYmplY3QudmFsdWU7XG4gICAgICAgIGlmICghaXNBcnIpIHtcbiAgICAgICAgICByZWxlYXNlQXJyYXkob2JqZWN0LmNyaXRlcmlhKTtcbiAgICAgICAgfVxuICAgICAgICByZWxlYXNlT2JqZWN0KG9iamVjdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoZSBgY29sbGVjdGlvbmAgdG8gYW4gYXJyYXkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gY29udmVydC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBjb252ZXJ0ZWQgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIChmdW5jdGlvbigpIHsgcmV0dXJuIF8udG9BcnJheShhcmd1bWVudHMpLnNsaWNlKDEpOyB9KSgxLCAyLCAzLCA0KTtcbiAgICAgKiAvLyA9PiBbMiwgMywgNF1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0b0FycmF5KGNvbGxlY3Rpb24pIHtcbiAgICAgIGlmIChjb2xsZWN0aW9uICYmIHR5cGVvZiBjb2xsZWN0aW9uLmxlbmd0aCA9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gc2xpY2UoY29sbGVjdGlvbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWVzKGNvbGxlY3Rpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIG9mIGVhY2ggZWxlbWVudCBpbiBhIGBjb2xsZWN0aW9uYCB0byB0aGUgZ2l2ZW5cbiAgICAgKiBgcHJvcGVydGllc2Agb2JqZWN0LCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgYWxsIGVsZW1lbnRzIHRoYXQgaGF2ZSBlcXVpdmFsZW50XG4gICAgICogcHJvcGVydHkgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgKiBAY2F0ZWdvcnkgQ29sbGVjdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wcyBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBmaWx0ZXIgYnkuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGFycmF5IG9mIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgZ2l2ZW4gcHJvcGVydGllcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ3BldHMnOiBbJ2hvcHB5J10gfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAncGV0cyc6IFsnYmFieSBwdXNzJywgJ2Rpbm8nXSB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIF8ud2hlcmUoY2hhcmFjdGVycywgeyAnYWdlJzogMzYgfSk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAncGV0cyc6IFsnaG9wcHknXSB9XVxuICAgICAqXG4gICAgICogXy53aGVyZShjaGFyYWN0ZXJzLCB7ICdwZXRzJzogWydkaW5vJ10gfSk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCwgJ3BldHMnOiBbJ2JhYnkgcHVzcycsICdkaW5vJ10gfV1cbiAgICAgKi9cbiAgICB2YXIgd2hlcmUgPSBmaWx0ZXI7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgd2l0aCBhbGwgZmFsc2V5IHZhbHVlcyByZW1vdmVkLiBUaGUgdmFsdWVzIGBmYWxzZWAsIGBudWxsYCxcbiAgICAgKiBgMGAsIGBcIlwiYCwgYHVuZGVmaW5lZGAsIGFuZCBgTmFOYCBhcmUgYWxsIGZhbHNleS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZmlsdGVyZWQgdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmNvbXBhY3QoWzAsIDEsIGZhbHNlLCAyLCAnJywgM10pO1xuICAgICAqIC8vID0+IFsxLCAyLCAzXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXBhY3QoYXJyYXkpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBleGNsdWRpbmcgYWxsIHZhbHVlcyBvZiB0aGUgcHJvdmlkZWQgYXJyYXlzIHVzaW5nIHN0cmljdFxuICAgICAqIGVxdWFsaXR5IGZvciBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcHJvY2Vzcy5cbiAgICAgKiBAcGFyYW0gey4uLkFycmF5fSBbdmFsdWVzXSBUaGUgYXJyYXlzIG9mIHZhbHVlcyB0byBleGNsdWRlLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiBmaWx0ZXJlZCB2YWx1ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uZGlmZmVyZW5jZShbMSwgMiwgMywgNCwgNV0sIFs1LCAyLCAxMF0pO1xuICAgICAqIC8vID0+IFsxLCAzLCA0XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRpZmZlcmVuY2UoYXJyYXkpIHtcbiAgICAgIHJldHVybiBiYXNlRGlmZmVyZW5jZShhcnJheSwgYmFzZUZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlLCAxKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5maW5kYCBleGNlcHQgdGhhdCBpdCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZmlyc3RcbiAgICAgKiBlbGVtZW50IHRoYXQgcGFzc2VzIHRoZSBjYWxsYmFjayBjaGVjaywgaW5zdGVhZCBvZiB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZvdW5kIGVsZW1lbnQsIGVsc2UgYC0xYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYWdlJzogMzYsICdibG9ja2VkJzogZmFsc2UgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdhZ2UnOiA0MCwgJ2Jsb2NrZWQnOiB0cnVlIH0sXG4gICAgICogICB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYWdlJzogMSwgICdibG9ja2VkJzogZmFsc2UgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiBfLmZpbmRJbmRleChjaGFyYWN0ZXJzLCBmdW5jdGlvbihjaHIpIHtcbiAgICAgKiAgIHJldHVybiBjaHIuYWdlIDwgMjA7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gMlxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kSW5kZXgoY2hhcmFjdGVycywgeyAnYWdlJzogMzYgfSk7XG4gICAgICogLy8gPT4gMFxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kSW5kZXgoY2hhcmFjdGVycywgJ2Jsb2NrZWQnKTtcbiAgICAgKiAvLyA9PiAxXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmluZEluZGV4KGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICBpZiAoY2FsbGJhY2soYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5maW5kSW5kZXhgIGV4Y2VwdCB0aGF0IGl0IGl0ZXJhdGVzIG92ZXIgZWxlbWVudHNcbiAgICAgKiBvZiBhIGBjb2xsZWN0aW9uYCBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZvdW5kIGVsZW1lbnQsIGVsc2UgYC0xYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYWdlJzogMzYsICdibG9ja2VkJzogdHJ1ZSB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAgJ2FnZSc6IDQwLCAnYmxvY2tlZCc6IGZhbHNlIH0sXG4gICAgICogICB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYWdlJzogMSwgICdibG9ja2VkJzogdHJ1ZSB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIF8uZmluZExhc3RJbmRleChjaGFyYWN0ZXJzLCBmdW5jdGlvbihjaHIpIHtcbiAgICAgKiAgIHJldHVybiBjaHIuYWdlID4gMzA7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gMVxuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLndoZXJlXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5maW5kTGFzdEluZGV4KGNoYXJhY3RlcnMsIHsgJ2FnZSc6IDM2IH0pO1xuICAgICAqIC8vID0+IDBcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8uZmluZExhc3RJbmRleChjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpO1xuICAgICAqIC8vID0+IDJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBmaW5kTGFzdEluZGV4KGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBpZiAoY2FsbGJhY2soYXJyYXlbbGVuZ3RoXSwgbGVuZ3RoLCBhcnJheSkpIHtcbiAgICAgICAgICByZXR1cm4gbGVuZ3RoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgZmlyc3QgZWxlbWVudCBvciBmaXJzdCBgbmAgZWxlbWVudHMgb2YgYW4gYXJyYXkuIElmIGEgY2FsbGJhY2tcbiAgICAgKiBpcyBwcm92aWRlZCBlbGVtZW50cyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBhcnJheSBhcmUgcmV0dXJuZWQgYXMgbG9uZ1xuICAgICAqIGFzIHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWV5LiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZFxuICAgICAqIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXgsIGFycmF5KS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGFsaWFzIGhlYWQsIHRha2VcbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fG51bWJlcnxzdHJpbmd9IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgZWxlbWVudCBvciB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHJldHVybi4gSWYgYSBwcm9wZXJ0eSBuYW1lIG9yXG4gICAgICogIG9iamVjdCBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWQgdG8gY3JlYXRlIGEgXCJfLnBsdWNrXCIgb3IgXCJfLndoZXJlXCJcbiAgICAgKiAgc3R5bGUgY2FsbGJhY2ssIHJlc3BlY3RpdmVseS5cbiAgICAgKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAgICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudChzKSBvZiBgYXJyYXlgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmZpcnN0KFsxLCAyLCAzXSk7XG4gICAgICogLy8gPT4gMVxuICAgICAqXG4gICAgICogXy5maXJzdChbMSwgMiwgM10sIDIpO1xuICAgICAqIC8vID0+IFsxLCAyXVxuICAgICAqXG4gICAgICogXy5maXJzdChbMSwgMiwgM10sIGZ1bmN0aW9uKG51bSkge1xuICAgICAqICAgcmV0dXJuIG51bSA8IDM7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gWzEsIDJdXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgICdibG9ja2VkJzogdHJ1ZSwgICdlbXBsb3llcic6ICdzbGF0ZScgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdibG9ja2VkJzogZmFsc2UsICdlbXBsb3llcic6ICdzbGF0ZScgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAncGViYmxlcycsICdibG9ja2VkJzogdHJ1ZSwgICdlbXBsb3llcic6ICduYScgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLmZpcnN0KGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnYmFybmV5JywgJ2Jsb2NrZWQnOiB0cnVlLCAnZW1wbG95ZXInOiAnc2xhdGUnIH1dXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnBsdWNrKF8uZmlyc3QoY2hhcmFjdGVycywgeyAnZW1wbG95ZXInOiAnc2xhdGUnIH0pLCAnbmFtZScpO1xuICAgICAqIC8vID0+IFsnYmFybmV5JywgJ2ZyZWQnXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGZpcnN0KGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIG4gPSAwLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcblxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnbnVtYmVyJyAmJiBjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoICYmIGNhbGxiYWNrKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgICAgIG4rKztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbiA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAobiA9PSBudWxsIHx8IHRoaXNBcmcpIHtcbiAgICAgICAgICByZXR1cm4gYXJyYXkgPyBhcnJheVswXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNsaWNlKGFycmF5LCAwLCBuYXRpdmVNaW4obmF0aXZlTWF4KDAsIG4pLCBsZW5ndGgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGbGF0dGVucyBhIG5lc3RlZCBhcnJheSAodGhlIG5lc3RpbmcgY2FuIGJlIHRvIGFueSBkZXB0aCkuIElmIGBpc1NoYWxsb3dgXG4gICAgICogaXMgdHJ1ZXksIHRoZSBhcnJheSB3aWxsIG9ubHkgYmUgZmxhdHRlbmVkIGEgc2luZ2xlIGxldmVsLiBJZiBhIGNhbGxiYWNrXG4gICAgICogaXMgcHJvdmlkZWQgZWFjaCBlbGVtZW50IG9mIHRoZSBhcnJheSBpcyBwYXNzZWQgdGhyb3VnaCB0aGUgY2FsbGJhY2sgYmVmb3JlXG4gICAgICogZmxhdHRlbmluZy4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlXG4gICAgICogYXJndW1lbnRzOyAodmFsdWUsIGluZGV4LCBhcnJheSkuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1NoYWxsb3c9ZmFsc2VdIEEgZmxhZyB0byByZXN0cmljdCBmbGF0dGVuaW5nIHRvIGEgc2luZ2xlIGxldmVsLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkXG4gICAgICogIHBlciBpdGVyYXRpb24uIElmIGEgcHJvcGVydHkgbmFtZSBvciBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkXG4gICAgICogIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5mbGF0dGVuKFsxLCBbMl0sIFszLCBbWzRdXV1dKTtcbiAgICAgKiAvLyA9PiBbMSwgMiwgMywgNF07XG4gICAgICpcbiAgICAgKiBfLmZsYXR0ZW4oWzEsIFsyXSwgWzMsIFtbNF1dXV0sIHRydWUpO1xuICAgICAqIC8vID0+IFsxLCAyLCAzLCBbWzRdXV07XG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDMwLCAncGV0cyc6IFsnaG9wcHknXSB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAsICdwZXRzJzogWydiYWJ5IHB1c3MnLCAnZGlubyddIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5mbGF0dGVuKGNoYXJhY3RlcnMsICdwZXRzJyk7XG4gICAgICogLy8gPT4gWydob3BweScsICdiYWJ5IHB1c3MnLCAnZGlubyddXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmxhdHRlbihhcnJheSwgaXNTaGFsbG93LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgLy8ganVnZ2xlIGFyZ3VtZW50c1xuICAgICAgaWYgKHR5cGVvZiBpc1NoYWxsb3cgIT0gJ2Jvb2xlYW4nICYmIGlzU2hhbGxvdyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXNBcmcgPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2sgPSAodHlwZW9mIGlzU2hhbGxvdyAhPSAnZnVuY3Rpb24nICYmIHRoaXNBcmcgJiYgdGhpc0FyZ1tpc1NoYWxsb3ddID09PSBhcnJheSkgPyBudWxsIDogaXNTaGFsbG93O1xuICAgICAgICBpc1NoYWxsb3cgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgIGFycmF5ID0gbWFwKGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZUZsYXR0ZW4oYXJyYXksIGlzU2hhbGxvdyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYHZhbHVlYCBpcyBmb3VuZCB1c2luZ1xuICAgICAqIHN0cmljdCBlcXVhbGl0eSBmb3IgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuIElmIHRoZSBhcnJheSBpcyBhbHJlYWR5IHNvcnRlZFxuICAgICAqIHByb3ZpZGluZyBgdHJ1ZWAgZm9yIGBmcm9tSW5kZXhgIHdpbGwgcnVuIGEgZmFzdGVyIGJpbmFyeSBzZWFyY2guXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNlYXJjaC5cbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbnxudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tIG9yIGB0cnVlYFxuICAgICAqICB0byBwZXJmb3JtIGEgYmluYXJ5IHNlYXJjaCBvbiBhIHNvcnRlZCBhcnJheS5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSBvciBgLTFgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmluZGV4T2YoWzEsIDIsIDMsIDEsIDIsIDNdLCAyKTtcbiAgICAgKiAvLyA9PiAxXG4gICAgICpcbiAgICAgKiBfLmluZGV4T2YoWzEsIDIsIDMsIDEsIDIsIDNdLCAyLCAzKTtcbiAgICAgKiAvLyA9PiA0XG4gICAgICpcbiAgICAgKiBfLmluZGV4T2YoWzEsIDEsIDIsIDIsIDMsIDNdLCAyLCB0cnVlKTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICAgICAgaWYgKHR5cGVvZiBmcm9tSW5kZXggPT0gJ251bWJlcicpIHtcbiAgICAgICAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICAgICAgZnJvbUluZGV4ID0gKGZyb21JbmRleCA8IDAgPyBuYXRpdmVNYXgoMCwgbGVuZ3RoICsgZnJvbUluZGV4KSA6IGZyb21JbmRleCB8fCAwKTtcbiAgICAgIH0gZWxzZSBpZiAoZnJvbUluZGV4KSB7XG4gICAgICAgIHZhciBpbmRleCA9IHNvcnRlZEluZGV4KGFycmF5LCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpbmRleF0gPT09IHZhbHVlID8gaW5kZXggOiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhbGwgYnV0IHRoZSBsYXN0IGVsZW1lbnQgb3IgbGFzdCBgbmAgZWxlbWVudHMgb2YgYW4gYXJyYXkuIElmIGFcbiAgICAgKiBjYWxsYmFjayBpcyBwcm92aWRlZCBlbGVtZW50cyBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheSBhcmUgZXhjbHVkZWQgZnJvbVxuICAgICAqIHRoZSByZXN1bHQgYXMgbG9uZyBhcyB0aGUgY2FsbGJhY2sgcmV0dXJucyB0cnVleS4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kXG4gICAgICogdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOyAodmFsdWUsIGluZGV4LCBhcnJheSkuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8bnVtYmVyfHN0cmluZ30gW2NhbGxiYWNrPTFdIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBlbGVtZW50cyB0byBleGNsdWRlLiBJZiBhIHByb3BlcnR5IG5hbWUgb3JcbiAgICAgKiAgb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZCB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIlxuICAgICAqICBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIHNsaWNlIG9mIGBhcnJheWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8uaW5pdGlhbChbMSwgMiwgM10pO1xuICAgICAqIC8vID0+IFsxLCAyXVxuICAgICAqXG4gICAgICogXy5pbml0aWFsKFsxLCAyLCAzXSwgMik7XG4gICAgICogLy8gPT4gWzFdXG4gICAgICpcbiAgICAgKiBfLmluaXRpYWwoWzEsIDIsIDNdLCBmdW5jdGlvbihudW0pIHtcbiAgICAgKiAgIHJldHVybiBudW0gPiAxO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IFsxXVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYmxvY2tlZCc6IGZhbHNlLCAnZW1wbG95ZXInOiAnc2xhdGUnIH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICAnYmxvY2tlZCc6IHRydWUsICAnZW1wbG95ZXInOiAnc2xhdGUnIH0sXG4gICAgICogICB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYmxvY2tlZCc6IHRydWUsICAnZW1wbG95ZXInOiAnbmEnIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5pbml0aWFsKGNoYXJhY3RlcnMsICdibG9ja2VkJyk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnYmFybmV5JywgICdibG9ja2VkJzogZmFsc2UsICdlbXBsb3llcic6ICdzbGF0ZScgfV1cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ucGx1Y2soXy5pbml0aWFsKGNoYXJhY3RlcnMsIHsgJ2VtcGxveWVyJzogJ25hJyB9KSwgJ25hbWUnKTtcbiAgICAgKiAvLyA9PiBbJ2Jhcm5leScsICdmcmVkJ11cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbml0aWFsKGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIG4gPSAwLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcblxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnbnVtYmVyJyAmJiBjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGxlbmd0aDtcbiAgICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgICB3aGlsZSAoaW5kZXgtLSAmJiBjYWxsYmFjayhhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgICAgICBuKys7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG4gPSAoY2FsbGJhY2sgPT0gbnVsbCB8fCB0aGlzQXJnKSA/IDEgOiBjYWxsYmFjayB8fCBuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNsaWNlKGFycmF5LCAwLCBuYXRpdmVNaW4obmF0aXZlTWF4KDAsIGxlbmd0aCAtIG4pLCBsZW5ndGgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIHVuaXF1ZSB2YWx1ZXMgcHJlc2VudCBpbiBhbGwgcHJvdmlkZWQgYXJyYXlzIHVzaW5nXG4gICAgICogc3RyaWN0IGVxdWFsaXR5IGZvciBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0gey4uLkFycmF5fSBbYXJyYXldIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2Ygc2hhcmVkIHZhbHVlcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5pbnRlcnNlY3Rpb24oWzEsIDIsIDNdLCBbNSwgMiwgMSwgNF0sIFsyLCAxXSk7XG4gICAgICogLy8gPT4gWzEsIDJdXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW50ZXJzZWN0aW9uKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXSxcbiAgICAgICAgICBhcmdzSW5kZXggPSAtMSxcbiAgICAgICAgICBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgICBjYWNoZXMgPSBnZXRBcnJheSgpLFxuICAgICAgICAgIGluZGV4T2YgPSBnZXRJbmRleE9mKCksXG4gICAgICAgICAgdHJ1c3RJbmRleE9mID0gaW5kZXhPZiA9PT0gYmFzZUluZGV4T2YsXG4gICAgICAgICAgc2VlbiA9IGdldEFycmF5KCk7XG5cbiAgICAgIHdoaWxlICgrK2FyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzW2FyZ3NJbmRleF07XG4gICAgICAgIGlmIChpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpIHtcbiAgICAgICAgICBhcmdzLnB1c2godmFsdWUpO1xuICAgICAgICAgIGNhY2hlcy5wdXNoKHRydXN0SW5kZXhPZiAmJiB2YWx1ZS5sZW5ndGggPj0gbGFyZ2VBcnJheVNpemUgJiZcbiAgICAgICAgICAgIGNyZWF0ZUNhY2hlKGFyZ3NJbmRleCA/IGFyZ3NbYXJnc0luZGV4XSA6IHNlZW4pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIGFycmF5ID0gYXJnc1swXSxcbiAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMCxcbiAgICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgICAgb3V0ZXI6XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgY2FjaGUgPSBjYWNoZXNbMF07XG4gICAgICAgIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuXG4gICAgICAgIGlmICgoY2FjaGUgPyBjYWNoZUluZGV4T2YoY2FjaGUsIHZhbHVlKSA6IGluZGV4T2Yoc2VlbiwgdmFsdWUpKSA8IDApIHtcbiAgICAgICAgICBhcmdzSW5kZXggPSBhcmdzTGVuZ3RoO1xuICAgICAgICAgIChjYWNoZSB8fCBzZWVuKS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICB3aGlsZSAoLS1hcmdzSW5kZXgpIHtcbiAgICAgICAgICAgIGNhY2hlID0gY2FjaGVzW2FyZ3NJbmRleF07XG4gICAgICAgICAgICBpZiAoKGNhY2hlID8gY2FjaGVJbmRleE9mKGNhY2hlLCB2YWx1ZSkgOiBpbmRleE9mKGFyZ3NbYXJnc0luZGV4XSwgdmFsdWUpKSA8IDApIHtcbiAgICAgICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgd2hpbGUgKGFyZ3NMZW5ndGgtLSkge1xuICAgICAgICBjYWNoZSA9IGNhY2hlc1thcmdzTGVuZ3RoXTtcbiAgICAgICAgaWYgKGNhY2hlKSB7XG4gICAgICAgICAgcmVsZWFzZU9iamVjdChjYWNoZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlbGVhc2VBcnJheShjYWNoZXMpO1xuICAgICAgcmVsZWFzZUFycmF5KHNlZW4pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBsYXN0IGVsZW1lbnQgb3IgbGFzdCBgbmAgZWxlbWVudHMgb2YgYW4gYXJyYXkuIElmIGEgY2FsbGJhY2sgaXNcbiAgICAgKiBwcm92aWRlZCBlbGVtZW50cyBhdCB0aGUgZW5kIG9mIHRoZSBhcnJheSBhcmUgcmV0dXJuZWQgYXMgbG9uZyBhcyB0aGVcbiAgICAgKiBjYWxsYmFjayByZXR1cm5zIHRydWV5LiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkXG4gICAgICogd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXgsIGFycmF5KS5cbiAgICAgKlxuICAgICAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ucGx1Y2tcIiBzdHlsZVxuICAgICAqIGNhbGxiYWNrIHdpbGwgcmV0dXJuIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKlxuICAgICAqIElmIGFuIG9iamVjdCBpcyBwcm92aWRlZCBmb3IgYGNhbGxiYWNrYCB0aGUgY3JlYXRlZCBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja1xuICAgICAqIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBnaXZlbiBvYmplY3QsXG4gICAgICogZWxzZSBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxudW1iZXJ8c3RyaW5nfSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZXR1cm4uIElmIGEgcHJvcGVydHkgbmFtZSBvclxuICAgICAqICBvYmplY3QgaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSB1c2VkIHRvIGNyZWF0ZSBhIFwiXy5wbHVja1wiIG9yIFwiXy53aGVyZVwiXG4gICAgICogIHN0eWxlIGNhbGxiYWNrLCByZXNwZWN0aXZlbHkuXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGxhc3QgZWxlbWVudChzKSBvZiBgYXJyYXlgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmxhc3QoWzEsIDIsIDNdKTtcbiAgICAgKiAvLyA9PiAzXG4gICAgICpcbiAgICAgKiBfLmxhc3QoWzEsIDIsIDNdLCAyKTtcbiAgICAgKiAvLyA9PiBbMiwgM11cbiAgICAgKlxuICAgICAqIF8ubGFzdChbMSwgMiwgM10sIGZ1bmN0aW9uKG51bSkge1xuICAgICAqICAgcmV0dXJuIG51bSA+IDE7XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gWzIsIDNdXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgICdibG9ja2VkJzogZmFsc2UsICdlbXBsb3llcic6ICdzbGF0ZScgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnZnJlZCcsICAgICdibG9ja2VkJzogdHJ1ZSwgICdlbXBsb3llcic6ICdzbGF0ZScgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAncGViYmxlcycsICdibG9ja2VkJzogdHJ1ZSwgICdlbXBsb3llcic6ICduYScgfVxuICAgICAqIF07XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnBsdWNrKF8ubGFzdChjaGFyYWN0ZXJzLCAnYmxvY2tlZCcpLCAnbmFtZScpO1xuICAgICAqIC8vID0+IFsnZnJlZCcsICdwZWJibGVzJ11cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy53aGVyZVwiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8ubGFzdChjaGFyYWN0ZXJzLCB7ICdlbXBsb3llcic6ICduYScgfSk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAncGViYmxlcycsICdibG9ja2VkJzogdHJ1ZSwgJ2VtcGxveWVyJzogJ25hJyB9XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGxhc3QoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgbiA9IDAsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9ICdudW1iZXInICYmIGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gbGVuZ3RoO1xuICAgICAgICBjYWxsYmFjayA9IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMyk7XG4gICAgICAgIHdoaWxlIChpbmRleC0tICYmIGNhbGxiYWNrKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgICAgIG4rKztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbiA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAobiA9PSBudWxsIHx8IHRoaXNBcmcpIHtcbiAgICAgICAgICByZXR1cm4gYXJyYXkgPyBhcnJheVtsZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHNsaWNlKGFycmF5LCBuYXRpdmVNYXgoMCwgbGVuZ3RoIC0gbikpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBsYXN0IG9jY3VycmVuY2Ugb2YgYHZhbHVlYCBpcyBmb3VuZCB1c2luZyBzdHJpY3RcbiAgICAgKiBlcXVhbGl0eSBmb3IgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuIElmIGBmcm9tSW5kZXhgIGlzIG5lZ2F0aXZlLCBpdCBpcyB1c2VkXG4gICAgICogYXMgdGhlIG9mZnNldCBmcm9tIHRoZSBlbmQgb2YgdGhlIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2VhcmNoLlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9YXJyYXkubGVuZ3RoLTFdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSBvciBgLTFgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmxhc3RJbmRleE9mKFsxLCAyLCAzLCAxLCAyLCAzXSwgMik7XG4gICAgICogLy8gPT4gNFxuICAgICAqXG4gICAgICogXy5sYXN0SW5kZXhPZihbMSwgMiwgMywgMSwgMiwgM10sIDIsIDMpO1xuICAgICAqIC8vID0+IDFcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBsYXN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICAgICAgdmFyIGluZGV4ID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgICAgaWYgKHR5cGVvZiBmcm9tSW5kZXggPT0gJ251bWJlcicpIHtcbiAgICAgICAgaW5kZXggPSAoZnJvbUluZGV4IDwgMCA/IG5hdGl2ZU1heCgwLCBpbmRleCArIGZyb21JbmRleCkgOiBuYXRpdmVNaW4oZnJvbUluZGV4LCBpbmRleCAtIDEpKSArIDE7XG4gICAgICB9XG4gICAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIHByb3ZpZGVkIHZhbHVlcyBmcm9tIHRoZSBnaXZlbiBhcnJheSB1c2luZyBzdHJpY3QgZXF1YWxpdHkgZm9yXG4gICAgICogY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAgICAgKiBAcGFyYW0gey4uLip9IFt2YWx1ZV0gVGhlIHZhbHVlcyB0byByZW1vdmUuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBhcnJheSA9IFsxLCAyLCAzLCAxLCAyLCAzXTtcbiAgICAgKiBfLnB1bGwoYXJyYXksIDIsIDMpO1xuICAgICAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAgICAgKiAvLyA9PiBbMSwgMV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwdWxsKGFycmF5KSB7XG4gICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICBhcmdzSW5kZXggPSAwLFxuICAgICAgICAgIGFyZ3NMZW5ndGggPSBhcmdzLmxlbmd0aCxcbiAgICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG5cbiAgICAgIHdoaWxlICgrK2FyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgICB2YWx1ZSA9IGFyZ3NbYXJnc0luZGV4XTtcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgc3BsaWNlLmNhbGwoYXJyYXksIGluZGV4LS0sIDEpO1xuICAgICAgICAgICAgbGVuZ3RoLS07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBhcnJheSBvZiBudW1iZXJzIChwb3NpdGl2ZSBhbmQvb3IgbmVnYXRpdmUpIHByb2dyZXNzaW5nIGZyb21cbiAgICAgKiBgc3RhcnRgIHVwIHRvIGJ1dCBub3QgaW5jbHVkaW5nIGBlbmRgLiBJZiBgc3RhcnRgIGlzIGxlc3MgdGhhbiBgc3RvcGAgYVxuICAgICAqIHplcm8tbGVuZ3RoIHJhbmdlIGlzIGNyZWF0ZWQgdW5sZXNzIGEgbmVnYXRpdmUgYHN0ZXBgIGlzIHNwZWNpZmllZC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBvZiB0aGUgcmFuZ2UuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIG9mIHRoZSByYW5nZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MV0gVGhlIHZhbHVlIHRvIGluY3JlbWVudCBvciBkZWNyZW1lbnQgYnkuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGEgbmV3IHJhbmdlIGFycmF5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnJhbmdlKDQpO1xuICAgICAqIC8vID0+IFswLCAxLCAyLCAzXVxuICAgICAqXG4gICAgICogXy5yYW5nZSgxLCA1KTtcbiAgICAgKiAvLyA9PiBbMSwgMiwgMywgNF1cbiAgICAgKlxuICAgICAqIF8ucmFuZ2UoMCwgMjAsIDUpO1xuICAgICAqIC8vID0+IFswLCA1LCAxMCwgMTVdXG4gICAgICpcbiAgICAgKiBfLnJhbmdlKDAsIC00LCAtMSk7XG4gICAgICogLy8gPT4gWzAsIC0xLCAtMiwgLTNdXG4gICAgICpcbiAgICAgKiBfLnJhbmdlKDEsIDQsIDApO1xuICAgICAqIC8vID0+IFsxLCAxLCAxXVxuICAgICAqXG4gICAgICogXy5yYW5nZSgwKTtcbiAgICAgKiAvLyA9PiBbXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgICAgIHN0YXJ0ID0gK3N0YXJ0IHx8IDA7XG4gICAgICBzdGVwID0gdHlwZW9mIHN0ZXAgPT0gJ251bWJlcicgPyBzdGVwIDogKCtzdGVwIHx8IDEpO1xuXG4gICAgICBpZiAoZW5kID09IG51bGwpIHtcbiAgICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgIH1cbiAgICAgIC8vIHVzZSBgQXJyYXkobGVuZ3RoKWAgc28gZW5naW5lcyBsaWtlIENoYWtyYSBhbmQgVjggYXZvaWQgc2xvd2VyIG1vZGVzXG4gICAgICAvLyBodHRwOi8veW91dHUuYmUvWEFxSXBHVThaWmsjdD0xN20yNXNcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heCgwLCBjZWlsKChlbmQgLSBzdGFydCkgLyAoc3RlcCB8fCAxKSkpLFxuICAgICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBzdGFydDtcbiAgICAgICAgc3RhcnQgKz0gc3RlcDtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgZWxlbWVudHMgZnJvbSBhbiBhcnJheSB0aGF0IHRoZSBjYWxsYmFjayByZXR1cm5zIHRydWV5IGZvclxuICAgICAqIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIHJlbW92ZWQgZWxlbWVudHMuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2BcbiAgICAgKiBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgYXJyYXkpLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIG5ldyBhcnJheSBvZiByZW1vdmVkIGVsZW1lbnRzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgYXJyYXkgPSBbMSwgMiwgMywgNCwgNSwgNl07XG4gICAgICogdmFyIGV2ZW5zID0gXy5yZW1vdmUoYXJyYXksIGZ1bmN0aW9uKG51bSkgeyByZXR1cm4gbnVtICUgMiA9PSAwOyB9KTtcbiAgICAgKlxuICAgICAqIGNvbnNvbGUubG9nKGFycmF5KTtcbiAgICAgKiAvLyA9PiBbMSwgMywgNV1cbiAgICAgKlxuICAgICAqIGNvbnNvbGUubG9nKGV2ZW5zKTtcbiAgICAgKiAvLyA9PiBbMiwgNCwgNl1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZW1vdmUoYXJyYXksIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDAsXG4gICAgICAgICAgcmVzdWx0ID0gW107XG5cbiAgICAgIGNhbGxiYWNrID0gbG9kYXNoLmNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKTtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgIHNwbGljZS5jYWxsKGFycmF5LCBpbmRleC0tLCAxKTtcbiAgICAgICAgICBsZW5ndGgtLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb3Bwb3NpdGUgb2YgYF8uaW5pdGlhbGAgdGhpcyBtZXRob2QgZ2V0cyBhbGwgYnV0IHRoZSBmaXJzdCBlbGVtZW50IG9yXG4gICAgICogZmlyc3QgYG5gIGVsZW1lbnRzIG9mIGFuIGFycmF5LiBJZiBhIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIGVsZW1lbnRzXG4gICAgICogYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYXJyYXkgYXJlIGV4Y2x1ZGVkIGZyb20gdGhlIHJlc3VsdCBhcyBsb25nIGFzIHRoZVxuICAgICAqIGNhbGxiYWNrIHJldHVybnMgdHJ1ZXkuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWRcbiAgICAgKiB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgYXJyYXkpLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgZHJvcCwgdGFpbFxuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R8bnVtYmVyfHN0cmluZ30gW2NhbGxiYWNrPTFdIFRoZSBmdW5jdGlvbiBjYWxsZWRcbiAgICAgKiAgcGVyIGVsZW1lbnQgb3IgdGhlIG51bWJlciBvZiBlbGVtZW50cyB0byBleGNsdWRlLiBJZiBhIHByb3BlcnR5IG5hbWUgb3JcbiAgICAgKiAgb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZCB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIlxuICAgICAqICBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIHNsaWNlIG9mIGBhcnJheWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ucmVzdChbMSwgMiwgM10pO1xuICAgICAqIC8vID0+IFsyLCAzXVxuICAgICAqXG4gICAgICogXy5yZXN0KFsxLCAyLCAzXSwgMik7XG4gICAgICogLy8gPT4gWzNdXG4gICAgICpcbiAgICAgKiBfLnJlc3QoWzEsIDIsIDNdLCBmdW5jdGlvbihudW0pIHtcbiAgICAgKiAgIHJldHVybiBudW0gPCAzO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IFszXVxuICAgICAqXG4gICAgICogdmFyIGNoYXJhY3RlcnMgPSBbXG4gICAgICogICB7ICduYW1lJzogJ2Jhcm5leScsICAnYmxvY2tlZCc6IHRydWUsICAnZW1wbG95ZXInOiAnc2xhdGUnIH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICAnYmxvY2tlZCc6IGZhbHNlLCAgJ2VtcGxveWVyJzogJ3NsYXRlJyB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdwZWJibGVzJywgJ2Jsb2NrZWQnOiB0cnVlLCAnZW1wbG95ZXInOiAnbmEnIH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgXCJfLnBsdWNrXCIgY2FsbGJhY2sgc2hvcnRoYW5kXG4gICAgICogXy5wbHVjayhfLnJlc3QoY2hhcmFjdGVycywgJ2Jsb2NrZWQnKSwgJ25hbWUnKTtcbiAgICAgKiAvLyA9PiBbJ2ZyZWQnLCAncGViYmxlcyddXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ud2hlcmVcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnJlc3QoY2hhcmFjdGVycywgeyAnZW1wbG95ZXInOiAnc2xhdGUnIH0pO1xuICAgICAqIC8vID0+IFt7ICduYW1lJzogJ3BlYmJsZXMnLCAnYmxvY2tlZCc6IHRydWUsICdlbXBsb3llcic6ICduYScgfV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZXN0KGFycmF5LCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPSAnbnVtYmVyJyAmJiBjYWxsYmFjayAhPSBudWxsKSB7XG4gICAgICAgIHZhciBuID0gMCxcbiAgICAgICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgICAgICBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG5cbiAgICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCAmJiBjYWxsYmFjayhhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgICAgICBuKys7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG4gPSAoY2FsbGJhY2sgPT0gbnVsbCB8fCB0aGlzQXJnKSA/IDEgOiBuYXRpdmVNYXgoMCwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNsaWNlKGFycmF5LCBuKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVc2VzIGEgYmluYXJ5IHNlYXJjaCB0byBkZXRlcm1pbmUgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoIGEgdmFsdWVcbiAgICAgKiBzaG91bGQgYmUgaW5zZXJ0ZWQgaW50byBhIGdpdmVuIHNvcnRlZCBhcnJheSBpbiBvcmRlciB0byBtYWludGFpbiB0aGUgc29ydFxuICAgICAqIG9yZGVyIG9mIHRoZSBhcnJheS4gSWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGV4ZWN1dGVkIGZvclxuICAgICAqIGB2YWx1ZWAgYW5kIGVhY2ggZWxlbWVudCBvZiBgYXJyYXlgIHRvIGNvbXB1dGUgdGhlaXIgc29ydCByYW5raW5nLiBUaGVcbiAgICAgKiBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ7ICh2YWx1ZSkuXG4gICAgICpcbiAgICAgKiBJZiBhIHByb3BlcnR5IG5hbWUgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLnBsdWNrXCIgc3R5bGVcbiAgICAgKiBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgb2YgdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiBhbiBvYmplY3QgaXMgcHJvdmlkZWQgZm9yIGBjYWxsYmFja2AgdGhlIGNyZWF0ZWQgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2tcbiAgICAgKiB3aWxsIHJldHVybiBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0LFxuICAgICAqIGVsc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBldmFsdWF0ZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IGF0IHdoaWNoIGB2YWx1ZWAgc2hvdWxkIGJlIGluc2VydGVkXG4gICAgICogIGludG8gYGFycmF5YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5zb3J0ZWRJbmRleChbMjAsIDMwLCA1MF0sIDQwKTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyBcIl8ucGx1Y2tcIiBjYWxsYmFjayBzaG9ydGhhbmRcbiAgICAgKiBfLnNvcnRlZEluZGV4KFt7ICd4JzogMjAgfSwgeyAneCc6IDMwIH0sIHsgJ3gnOiA1MCB9XSwgeyAneCc6IDQwIH0sICd4Jyk7XG4gICAgICogLy8gPT4gMlxuICAgICAqXG4gICAgICogdmFyIGRpY3QgPSB7XG4gICAgICogICAnd29yZFRvTnVtYmVyJzogeyAndHdlbnR5JzogMjAsICd0aGlydHknOiAzMCwgJ2ZvdXJ0eSc6IDQwLCAnZmlmdHknOiA1MCB9XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIF8uc29ydGVkSW5kZXgoWyd0d2VudHknLCAndGhpcnR5JywgJ2ZpZnR5J10sICdmb3VydHknLCBmdW5jdGlvbih3b3JkKSB7XG4gICAgICogICByZXR1cm4gZGljdC53b3JkVG9OdW1iZXJbd29yZF07XG4gICAgICogfSk7XG4gICAgICogLy8gPT4gMlxuICAgICAqXG4gICAgICogXy5zb3J0ZWRJbmRleChbJ3R3ZW50eScsICd0aGlydHknLCAnZmlmdHknXSwgJ2ZvdXJ0eScsIGZ1bmN0aW9uKHdvcmQpIHtcbiAgICAgKiAgIHJldHVybiB0aGlzLndvcmRUb051bWJlclt3b3JkXTtcbiAgICAgKiB9LCBkaWN0KTtcbiAgICAgKiAvLyA9PiAyXG4gICAgICovXG4gICAgZnVuY3Rpb24gc29ydGVkSW5kZXgoYXJyYXksIHZhbHVlLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAgdmFyIGxvdyA9IDAsXG4gICAgICAgICAgaGlnaCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogbG93O1xuXG4gICAgICAvLyBleHBsaWNpdGx5IHJlZmVyZW5jZSBgaWRlbnRpdHlgIGZvciBiZXR0ZXIgaW5saW5pbmcgaW4gRmlyZWZveFxuICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayA/IGxvZGFzaC5jcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMSkgOiBpZGVudGl0eTtcbiAgICAgIHZhbHVlID0gY2FsbGJhY2sodmFsdWUpO1xuXG4gICAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+PiAxO1xuICAgICAgICAoY2FsbGJhY2soYXJyYXlbbWlkXSkgPCB2YWx1ZSlcbiAgICAgICAgICA/IGxvdyA9IG1pZCArIDFcbiAgICAgICAgICA6IGhpZ2ggPSBtaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gbG93O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdW5pcXVlIHZhbHVlcywgaW4gb3JkZXIsIG9mIHRoZSBwcm92aWRlZCBhcnJheXMgdXNpbmdcbiAgICAgKiBzdHJpY3QgZXF1YWxpdHkgZm9yIGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7Li4uQXJyYXl9IFthcnJheV0gVGhlIGFycmF5cyB0byBpbnNwZWN0LlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBjb21iaW5lZCB2YWx1ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8udW5pb24oWzEsIDIsIDNdLCBbNSwgMiwgMSwgNF0sIFsyLCAxXSk7XG4gICAgICogLy8gPT4gWzEsIDIsIDMsIDUsIDRdXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5pb24oKSB7XG4gICAgICByZXR1cm4gYmFzZVVuaXEoYmFzZUZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGR1cGxpY2F0ZS12YWx1ZS1mcmVlIHZlcnNpb24gb2YgYW4gYXJyYXkgdXNpbmcgc3RyaWN0IGVxdWFsaXR5XG4gICAgICogZm9yIGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLiBJZiB0aGUgYXJyYXkgaXMgc29ydGVkLCBwcm92aWRpbmdcbiAgICAgKiBgdHJ1ZWAgZm9yIGBpc1NvcnRlZGAgd2lsbCB1c2UgYSBmYXN0ZXIgYWxnb3JpdGhtLiBJZiBhIGNhbGxiYWNrIGlzIHByb3ZpZGVkXG4gICAgICogZWFjaCBlbGVtZW50IG9mIGBhcnJheWAgaXMgcGFzc2VkIHRocm91Z2ggdGhlIGNhbGxiYWNrIGJlZm9yZSB1bmlxdWVuZXNzXG4gICAgICogaXMgY29tcHV0ZWQuIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZVxuICAgICAqIGFyZ3VtZW50czsgKHZhbHVlLCBpbmRleCwgYXJyYXkpLlxuICAgICAqXG4gICAgICogSWYgYSBwcm9wZXJ0eSBuYW1lIGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy5wbHVja1wiIHN0eWxlXG4gICAgICogY2FsbGJhY2sgd2lsbCByZXR1cm4gdGhlIHByb3BlcnR5IHZhbHVlIG9mIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgICAqXG4gICAgICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgY2FsbGJhY2tgIHRoZSBjcmVhdGVkIFwiXy53aGVyZVwiIHN0eWxlIGNhbGxiYWNrXG4gICAgICogd2lsbCByZXR1cm4gYHRydWVgIGZvciBlbGVtZW50cyB0aGF0IGhhdmUgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGdpdmVuIG9iamVjdCxcbiAgICAgKiBlbHNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgdW5pcXVlXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBwcm9jZXNzLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU29ydGVkPWZhbHNlXSBBIGZsYWcgdG8gaW5kaWNhdGUgdGhhdCBgYXJyYXlgIGlzIHNvcnRlZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdHxzdHJpbmd9IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZFxuICAgICAqICBwZXIgaXRlcmF0aW9uLiBJZiBhIHByb3BlcnR5IG5hbWUgb3Igb2JqZWN0IGlzIHByb3ZpZGVkIGl0IHdpbGwgYmUgdXNlZFxuICAgICAqICB0byBjcmVhdGUgYSBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFjaywgcmVzcGVjdGl2ZWx5LlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICAgICAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBhIGR1cGxpY2F0ZS12YWx1ZS1mcmVlIGFycmF5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnVuaXEoWzEsIDIsIDEsIDMsIDFdKTtcbiAgICAgKiAvLyA9PiBbMSwgMiwgM11cbiAgICAgKlxuICAgICAqIF8udW5pcShbMSwgMSwgMiwgMiwgM10sIHRydWUpO1xuICAgICAqIC8vID0+IFsxLCAyLCAzXVxuICAgICAqXG4gICAgICogXy51bmlxKFsnQScsICdiJywgJ0MnLCAnYScsICdCJywgJ2MnXSwgZnVuY3Rpb24obGV0dGVyKSB7IHJldHVybiBsZXR0ZXIudG9Mb3dlckNhc2UoKTsgfSk7XG4gICAgICogLy8gPT4gWydBJywgJ2InLCAnQyddXG4gICAgICpcbiAgICAgKiBfLnVuaXEoWzEsIDIuNSwgMywgMS41LCAyLCAzLjVdLCBmdW5jdGlvbihudW0pIHsgcmV0dXJuIHRoaXMuZmxvb3IobnVtKTsgfSwgTWF0aCk7XG4gICAgICogLy8gPT4gWzEsIDIuNSwgM11cbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIFwiXy5wbHVja1wiIGNhbGxiYWNrIHNob3J0aGFuZFxuICAgICAqIF8udW5pcShbeyAneCc6IDEgfSwgeyAneCc6IDIgfSwgeyAneCc6IDEgfV0sICd4Jyk7XG4gICAgICogLy8gPT4gW3sgJ3gnOiAxIH0sIHsgJ3gnOiAyIH1dXG4gICAgICovXG4gICAgZnVuY3Rpb24gdW5pcShhcnJheSwgaXNTb3J0ZWQsIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICAvLyBqdWdnbGUgYXJndW1lbnRzXG4gICAgICBpZiAodHlwZW9mIGlzU29ydGVkICE9ICdib29sZWFuJyAmJiBpc1NvcnRlZCAhPSBudWxsKSB7XG4gICAgICAgIHRoaXNBcmcgPSBjYWxsYmFjaztcbiAgICAgICAgY2FsbGJhY2sgPSAodHlwZW9mIGlzU29ydGVkICE9ICdmdW5jdGlvbicgJiYgdGhpc0FyZyAmJiB0aGlzQXJnW2lzU29ydGVkXSA9PT0gYXJyYXkpID8gbnVsbCA6IGlzU29ydGVkO1xuICAgICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBsb2Rhc2guY3JlYXRlQ2FsbGJhY2soY2FsbGJhY2ssIHRoaXNBcmcsIDMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJhc2VVbmlxKGFycmF5LCBpc1NvcnRlZCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgZXhjbHVkaW5nIGFsbCBwcm92aWRlZCB2YWx1ZXMgdXNpbmcgc3RyaWN0IGVxdWFsaXR5IGZvclxuICAgICAqIGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEFycmF5c1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmaWx0ZXIuXG4gICAgICogQHBhcmFtIHsuLi4qfSBbdmFsdWVdIFRoZSB2YWx1ZXMgdG8gZXhjbHVkZS5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZmlsdGVyZWQgdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLndpdGhvdXQoWzEsIDIsIDEsIDAsIDMsIDEsIDRdLCAwLCAxKTtcbiAgICAgKiAvLyA9PiBbMiwgMywgNF1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB3aXRob3V0KGFycmF5KSB7XG4gICAgICByZXR1cm4gYmFzZURpZmZlcmVuY2UoYXJyYXksIHNsaWNlKGFyZ3VtZW50cywgMSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gYXJyYXkgdGhhdCBpcyB0aGUgc3ltbWV0cmljIGRpZmZlcmVuY2Ugb2YgdGhlIHByb3ZpZGVkIGFycmF5cy5cbiAgICAgKiBTZWUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9TeW1tZXRyaWNfZGlmZmVyZW5jZS5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBBcnJheXNcbiAgICAgKiBAcGFyYW0gey4uLkFycmF5fSBbYXJyYXldIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLnhvcihbMSwgMiwgM10sIFs1LCAyLCAxLCA0XSk7XG4gICAgICogLy8gPT4gWzMsIDUsIDRdXG4gICAgICpcbiAgICAgKiBfLnhvcihbMSwgMiwgNV0sIFsyLCAzLCA1XSwgWzMsIDQsIDVdKTtcbiAgICAgKiAvLyA9PiBbMSwgNCwgNV1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB4b3IoKSB7XG4gICAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgICAgICBpZiAoaXNBcnJheShhcnJheSkgfHwgaXNBcmd1bWVudHMoYXJyYXkpKSB7XG4gICAgICAgICAgdmFyIHJlc3VsdCA9IHJlc3VsdFxuICAgICAgICAgICAgPyBiYXNlVW5pcShiYXNlRGlmZmVyZW5jZShyZXN1bHQsIGFycmF5KS5jb25jYXQoYmFzZURpZmZlcmVuY2UoYXJyYXksIHJlc3VsdCkpKVxuICAgICAgICAgICAgOiBhcnJheTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdCB8fCBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGFycmF5IG9mIGdyb3VwZWQgZWxlbWVudHMsIHRoZSBmaXJzdCBvZiB3aGljaCBjb250YWlucyB0aGUgZmlyc3RcbiAgICAgKiBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gYXJyYXlzLCB0aGUgc2Vjb25kIG9mIHdoaWNoIGNvbnRhaW5zIHRoZSBzZWNvbmRcbiAgICAgKiBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gYXJyYXlzLCBhbmQgc28gb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAYWxpYXMgdW56aXBcbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHsuLi5BcnJheX0gW2FycmF5XSBBcnJheXMgdG8gcHJvY2Vzcy5cbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZ3JvdXBlZCBlbGVtZW50cy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy56aXAoWydmcmVkJywgJ2Jhcm5leSddLCBbMzAsIDQwXSwgW3RydWUsIGZhbHNlXSk7XG4gICAgICogLy8gPT4gW1snZnJlZCcsIDMwLCB0cnVlXSwgWydiYXJuZXknLCA0MCwgZmFsc2VdXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHppcCgpIHtcbiAgICAgIHZhciBhcnJheSA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzIDogYXJndW1lbnRzWzBdLFxuICAgICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBtYXgocGx1Y2soYXJyYXksICdsZW5ndGgnKSkgOiAwLFxuICAgICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoKTtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IHBsdWNrKGFycmF5LCBpbmRleCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIGZyb20gYXJyYXlzIG9mIGBrZXlzYCBhbmQgYHZhbHVlc2AuIFByb3ZpZGVcbiAgICAgKiBlaXRoZXIgYSBzaW5nbGUgdHdvIGRpbWVuc2lvbmFsIGFycmF5LCBpLmUuIGBbW2tleTEsIHZhbHVlMV0sIFtrZXkyLCB2YWx1ZTJdXWBcbiAgICAgKiBvciB0d28gYXJyYXlzLCBvbmUgb2YgYGtleXNgIGFuZCBvbmUgb2YgY29ycmVzcG9uZGluZyBgdmFsdWVzYC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyBvYmplY3RcbiAgICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAgICogQHBhcmFtIHtBcnJheX0ga2V5cyBUaGUgYXJyYXkgb2Yga2V5cy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzPVtdXSBUaGUgYXJyYXkgb2YgdmFsdWVzLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIHRoZSBnaXZlbiBrZXlzIGFuZFxuICAgICAqICBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy56aXBPYmplY3QoWydmcmVkJywgJ2Jhcm5leSddLCBbMzAsIDQwXSk7XG4gICAgICogLy8gPT4geyAnZnJlZCc6IDMwLCAnYmFybmV5JzogNDAgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHppcE9iamVjdChrZXlzLCB2YWx1ZXMpIHtcbiAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGtleXMgPyBrZXlzLmxlbmd0aCA6IDAsXG4gICAgICAgICAgcmVzdWx0ID0ge307XG5cbiAgICAgIGlmICghdmFsdWVzICYmIGxlbmd0aCAmJiAhaXNBcnJheShrZXlzWzBdKSkge1xuICAgICAgICB2YWx1ZXMgPSBbXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWVzW2luZGV4XTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkpIHtcbiAgICAgICAgICByZXN1bHRba2V5WzBdXSA9IGtleVsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGV4ZWN1dGVzIGBmdW5jYCwgd2l0aCAgdGhlIGB0aGlzYCBiaW5kaW5nIGFuZFxuICAgICAqIGFyZ3VtZW50cyBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbiwgb25seSBhZnRlciBiZWluZyBjYWxsZWQgYG5gIHRpbWVzLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdGhlIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIGJlZm9yZVxuICAgICAqICBgZnVuY2AgaXMgZXhlY3V0ZWQuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgcmVzdHJpY3RlZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHNhdmVzID0gWydwcm9maWxlJywgJ3NldHRpbmdzJ107XG4gICAgICpcbiAgICAgKiB2YXIgZG9uZSA9IF8uYWZ0ZXIoc2F2ZXMubGVuZ3RoLCBmdW5jdGlvbigpIHtcbiAgICAgKiAgIGNvbnNvbGUubG9nKCdEb25lIHNhdmluZyEnKTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIF8uZm9yRWFjaChzYXZlcywgZnVuY3Rpb24odHlwZSkge1xuICAgICAqICAgYXN5bmNTYXZlKHsgJ3R5cGUnOiB0eXBlLCAnY29tcGxldGUnOiBkb25lIH0pO1xuICAgICAqIH0pO1xuICAgICAqIC8vID0+IGxvZ3MgJ0RvbmUgc2F2aW5nIScsIGFmdGVyIGFsbCBzYXZlcyBoYXZlIGNvbXBsZXRlZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFmdGVyKG4sIGZ1bmMpIHtcbiAgICAgIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoLS1uIDwgMSkge1xuICAgICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2BcbiAgICAgKiBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgcHJlcGVuZHMgYW55IGFkZGl0aW9uYWwgYGJpbmRgIGFyZ3VtZW50cyB0byB0aG9zZVxuICAgICAqIHByb3ZpZGVkIHRvIHRoZSBib3VuZCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBiaW5kLlxuICAgICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gICAgICogQHBhcmFtIHsuLi4qfSBbYXJnXSBBcmd1bWVudHMgdG8gYmUgcGFydGlhbGx5IGFwcGxpZWQuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYm91bmQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBmdW5jID0gZnVuY3Rpb24oZ3JlZXRpbmcpIHtcbiAgICAgKiAgIHJldHVybiBncmVldGluZyArICcgJyArIHRoaXMubmFtZTtcbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogZnVuYyA9IF8uYmluZChmdW5jLCB7ICduYW1lJzogJ2ZyZWQnIH0sICdoaScpO1xuICAgICAqIGZ1bmMoKTtcbiAgICAgKiAvLyA9PiAnaGkgZnJlZCdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBiaW5kKGZ1bmMsIHRoaXNBcmcpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMlxuICAgICAgICA/IGNyZWF0ZVdyYXBwZXIoZnVuYywgMTcsIHNsaWNlKGFyZ3VtZW50cywgMiksIG51bGwsIHRoaXNBcmcpXG4gICAgICAgIDogY3JlYXRlV3JhcHBlcihmdW5jLCAxLCBudWxsLCBudWxsLCB0aGlzQXJnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCaW5kcyBtZXRob2RzIG9mIGFuIG9iamVjdCB0byB0aGUgb2JqZWN0IGl0c2VsZiwgb3ZlcndyaXRpbmcgdGhlIGV4aXN0aW5nXG4gICAgICogbWV0aG9kLiBNZXRob2QgbmFtZXMgbWF5IGJlIHNwZWNpZmllZCBhcyBpbmRpdmlkdWFsIGFyZ3VtZW50cyBvciBhcyBhcnJheXNcbiAgICAgKiBvZiBtZXRob2QgbmFtZXMuIElmIG5vIG1ldGhvZCBuYW1lcyBhcmUgcHJvdmlkZWQgYWxsIHRoZSBmdW5jdGlvbiBwcm9wZXJ0aWVzXG4gICAgICogb2YgYG9iamVjdGAgd2lsbCBiZSBib3VuZC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gYmluZCBhbmQgYXNzaWduIHRoZSBib3VuZCBtZXRob2RzIHRvLlxuICAgICAqIEBwYXJhbSB7Li4uc3RyaW5nfSBbbWV0aG9kTmFtZV0gVGhlIG9iamVjdCBtZXRob2QgbmFtZXMgdG9cbiAgICAgKiAgYmluZCwgc3BlY2lmaWVkIGFzIGluZGl2aWR1YWwgbWV0aG9kIG5hbWVzIG9yIGFycmF5cyBvZiBtZXRob2QgbmFtZXMuXG4gICAgICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHZpZXcgPSB7XG4gICAgICogICAnbGFiZWwnOiAnZG9jcycsXG4gICAgICogICAnb25DbGljayc6IGZ1bmN0aW9uKCkgeyBjb25zb2xlLmxvZygnY2xpY2tlZCAnICsgdGhpcy5sYWJlbCk7IH1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy5iaW5kQWxsKHZpZXcpO1xuICAgICAqIGpRdWVyeSgnI2RvY3MnKS5vbignY2xpY2snLCB2aWV3Lm9uQ2xpY2spO1xuICAgICAqIC8vID0+IGxvZ3MgJ2NsaWNrZWQgZG9jcycsIHdoZW4gdGhlIGJ1dHRvbiBpcyBjbGlja2VkXG4gICAgICovXG4gICAgZnVuY3Rpb24gYmluZEFsbChvYmplY3QpIHtcbiAgICAgIHZhciBmdW5jcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYmFzZUZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCBmYWxzZSwgMSkgOiBmdW5jdGlvbnMob2JqZWN0KSxcbiAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgIGxlbmd0aCA9IGZ1bmNzLmxlbmd0aDtcblxuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGZ1bmNzW2luZGV4XTtcbiAgICAgICAgb2JqZWN0W2tleV0gPSBjcmVhdGVXcmFwcGVyKG9iamVjdFtrZXldLCAxLCBudWxsLCBudWxsLCBvYmplY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsIGludm9rZXMgdGhlIG1ldGhvZCBhdCBgb2JqZWN0W2tleV1gXG4gICAgICogYW5kIHByZXBlbmRzIGFueSBhZGRpdGlvbmFsIGBiaW5kS2V5YCBhcmd1bWVudHMgdG8gdGhvc2UgcHJvdmlkZWQgdG8gdGhlIGJvdW5kXG4gICAgICogZnVuY3Rpb24uIFRoaXMgbWV0aG9kIGRpZmZlcnMgZnJvbSBgXy5iaW5kYCBieSBhbGxvd2luZyBib3VuZCBmdW5jdGlvbnMgdG9cbiAgICAgKiByZWZlcmVuY2UgbWV0aG9kcyB0aGF0IHdpbGwgYmUgcmVkZWZpbmVkIG9yIGRvbid0IHlldCBleGlzdC5cbiAgICAgKiBTZWUgaHR0cDovL21pY2hhdXguY2EvYXJ0aWNsZXMvbGF6eS1mdW5jdGlvbi1kZWZpbml0aW9uLXBhdHRlcm4uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRoZSBtZXRob2QgYmVsb25ncyB0by5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZC5cbiAgICAgKiBAcGFyYW0gey4uLip9IFthcmddIEFyZ3VtZW50cyB0byBiZSBwYXJ0aWFsbHkgYXBwbGllZC5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBib3VuZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIG9iamVjdCA9IHtcbiAgICAgKiAgICduYW1lJzogJ2ZyZWQnLFxuICAgICAqICAgJ2dyZWV0JzogZnVuY3Rpb24oZ3JlZXRpbmcpIHtcbiAgICAgKiAgICAgcmV0dXJuIGdyZWV0aW5nICsgJyAnICsgdGhpcy5uYW1lO1xuICAgICAqICAgfVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgZnVuYyA9IF8uYmluZEtleShvYmplY3QsICdncmVldCcsICdoaScpO1xuICAgICAqIGZ1bmMoKTtcbiAgICAgKiAvLyA9PiAnaGkgZnJlZCdcbiAgICAgKlxuICAgICAqIG9iamVjdC5ncmVldCA9IGZ1bmN0aW9uKGdyZWV0aW5nKSB7XG4gICAgICogICByZXR1cm4gZ3JlZXRpbmcgKyAneWEgJyArIHRoaXMubmFtZSArICchJztcbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogZnVuYygpO1xuICAgICAqIC8vID0+ICdoaXlhIGZyZWQhJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGJpbmRLZXkob2JqZWN0LCBrZXkpIHtcbiAgICAgIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID4gMlxuICAgICAgICA/IGNyZWF0ZVdyYXBwZXIoa2V5LCAxOSwgc2xpY2UoYXJndW1lbnRzLCAyKSwgbnVsbCwgb2JqZWN0KVxuICAgICAgICA6IGNyZWF0ZVdyYXBwZXIoa2V5LCAzLCBudWxsLCBudWxsLCBvYmplY3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiB0aGUgcHJvdmlkZWQgZnVuY3Rpb25zLFxuICAgICAqIHdoZXJlIGVhY2ggZnVuY3Rpb24gY29uc3VtZXMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICAgICAqIEZvciBleGFtcGxlLCBjb21wb3NpbmcgdGhlIGZ1bmN0aW9ucyBgZigpYCwgYGcoKWAsIGFuZCBgaCgpYCBwcm9kdWNlcyBgZihnKGgoKSkpYC5cbiAgICAgKiBFYWNoIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBbZnVuY10gRnVuY3Rpb25zIHRvIGNvbXBvc2UuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29tcG9zZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciByZWFsTmFtZU1hcCA9IHtcbiAgICAgKiAgICdwZWJibGVzJzogJ3BlbmVsb3BlJ1xuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgZm9ybWF0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgICAqICAgbmFtZSA9IHJlYWxOYW1lTWFwW25hbWUudG9Mb3dlckNhc2UoKV0gfHwgbmFtZTtcbiAgICAgKiAgIHJldHVybiBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpO1xuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgZ3JlZXQgPSBmdW5jdGlvbihmb3JtYXR0ZWQpIHtcbiAgICAgKiAgIHJldHVybiAnSGl5YSAnICsgZm9ybWF0dGVkICsgJyEnO1xuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgd2VsY29tZSA9IF8uY29tcG9zZShncmVldCwgZm9ybWF0KTtcbiAgICAgKiB3ZWxjb21lKCdwZWJibGVzJyk7XG4gICAgICogLy8gPT4gJ0hpeWEgUGVuZWxvcGUhJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbXBvc2UoKSB7XG4gICAgICB2YXIgZnVuY3MgPSBhcmd1bWVudHMsXG4gICAgICAgICAgbGVuZ3RoID0gZnVuY3MubGVuZ3RoO1xuXG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmNzW2xlbmd0aF0pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgICAgIGxlbmd0aCA9IGZ1bmNzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgICBhcmdzID0gW2Z1bmNzW2xlbmd0aF0uYXBwbHkodGhpcywgYXJncyldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gd2hpY2ggYWNjZXB0cyBvbmUgb3IgbW9yZSBhcmd1bWVudHMgb2YgYGZ1bmNgIHRoYXQgd2hlblxuICAgICAqIGludm9rZWQgZWl0aGVyIGV4ZWN1dGVzIGBmdW5jYCByZXR1cm5pbmcgaXRzIHJlc3VsdCwgaWYgYWxsIGBmdW5jYCBhcmd1bWVudHNcbiAgICAgKiBoYXZlIGJlZW4gcHJvdmlkZWQsIG9yIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgb25lIG9yIG1vcmUgb2YgdGhlXG4gICAgICogcmVtYWluaW5nIGBmdW5jYCBhcmd1bWVudHMsIGFuZCBzbyBvbi4gVGhlIGFyaXR5IG9mIGBmdW5jYCBjYW4gYmUgc3BlY2lmaWVkXG4gICAgICogaWYgYGZ1bmMubGVuZ3RoYCBpcyBub3Qgc3VmZmljaWVudC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2FyaXR5PWZ1bmMubGVuZ3RoXSBUaGUgYXJpdHkgb2YgYGZ1bmNgLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGN1cnJpZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjdXJyaWVkID0gXy5jdXJyeShmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICogICBjb25zb2xlLmxvZyhhICsgYiArIGMpO1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogY3VycmllZCgxKSgyKSgzKTtcbiAgICAgKiAvLyA9PiA2XG4gICAgICpcbiAgICAgKiBjdXJyaWVkKDEsIDIpKDMpO1xuICAgICAqIC8vID0+IDZcbiAgICAgKlxuICAgICAqIGN1cnJpZWQoMSwgMiwgMyk7XG4gICAgICogLy8gPT4gNlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGN1cnJ5KGZ1bmMsIGFyaXR5KSB7XG4gICAgICBhcml0eSA9IHR5cGVvZiBhcml0eSA9PSAnbnVtYmVyJyA/IGFyaXR5IDogKCthcml0eSB8fCBmdW5jLmxlbmd0aCk7XG4gICAgICByZXR1cm4gY3JlYXRlV3JhcHBlcihmdW5jLCA0LCBudWxsLCBudWxsLCBudWxsLCBhcml0eSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBkZWxheSB0aGUgZXhlY3V0aW9uIG9mIGBmdW5jYCB1bnRpbCBhZnRlclxuICAgICAqIGB3YWl0YCBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgaXQgd2FzIGludm9rZWQuXG4gICAgICogUHJvdmlkZSBhbiBvcHRpb25zIG9iamVjdCB0byBpbmRpY2F0ZSB0aGF0IGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvblxuICAgICAqIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gU3Vic2VxdWVudCBjYWxsc1xuICAgICAqIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgY2FsbC5cbiAgICAgKlxuICAgICAqIE5vdGU6IElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAgYGZ1bmNgIHdpbGwgYmUgY2FsbGVkXG4gICAgICogb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiBpc1xuICAgICAqIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2FpdCBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdIFNwZWNpZnkgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBjYWxsZWQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXSBTcGVjaWZ5IGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXhcbiAgICAgKiB2YXIgbGF6eUxheW91dCA9IF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApO1xuICAgICAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBsYXp5TGF5b3V0KTtcbiAgICAgKlxuICAgICAqIC8vIGV4ZWN1dGUgYHNlbmRNYWlsYCB3aGVuIHRoZSBjbGljayBldmVudCBpcyBmaXJlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzXG4gICAgICogalF1ZXJ5KCcjcG9zdGJveCcpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICAgICAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICAgICAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIC8vIGVuc3VyZSBgYmF0Y2hMb2dgIGlzIGV4ZWN1dGVkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzXG4gICAgICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICAgICAqIHNvdXJjZS5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7XG4gICAgICogICAnbWF4V2FpdCc6IDEwMDBcbiAgICAgKiB9LCBmYWxzZSk7XG4gICAgICovXG4gICAgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgICAgdmFyIGFyZ3MsXG4gICAgICAgICAgbWF4VGltZW91dElkLFxuICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICBzdGFtcCxcbiAgICAgICAgICB0aGlzQXJnLFxuICAgICAgICAgIHRpbWVvdXRJZCxcbiAgICAgICAgICB0cmFpbGluZ0NhbGwsXG4gICAgICAgICAgbGFzdENhbGxlZCA9IDAsXG4gICAgICAgICAgbWF4V2FpdCA9IGZhbHNlLFxuICAgICAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICB9XG4gICAgICB3YWl0ID0gbmF0aXZlTWF4KDAsIHdhaXQpIHx8IDA7XG4gICAgICBpZiAob3B0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgICB2YXIgbGVhZGluZyA9IHRydWU7XG4gICAgICAgIHRyYWlsaW5nID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgICAgIGxlYWRpbmcgPSBvcHRpb25zLmxlYWRpbmc7XG4gICAgICAgIG1heFdhaXQgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucyAmJiAobmF0aXZlTWF4KHdhaXQsIG9wdGlvbnMubWF4V2FpdCkgfHwgMCk7XG4gICAgICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICAgICAgfVxuICAgICAgdmFyIGRlbGF5ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93KCkgLSBzdGFtcCk7XG4gICAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICAgIGlmIChtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChtYXhUaW1lb3V0SWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgaXNDYWxsZWQgPSB0cmFpbGluZ0NhbGw7XG4gICAgICAgICAgbWF4VGltZW91dElkID0gdGltZW91dElkID0gdHJhaWxpbmdDYWxsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgICAgICAgbGFzdENhbGxlZCA9IG5vdygpO1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgICAgICAgIGlmICghdGltZW91dElkICYmICFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgICAgICAgYXJncyA9IHRoaXNBcmcgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHJlbWFpbmluZyk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciBtYXhEZWxheWVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aW1lb3V0SWQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgfVxuICAgICAgICBtYXhUaW1lb3V0SWQgPSB0aW1lb3V0SWQgPSB0cmFpbGluZ0NhbGwgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmICh0cmFpbGluZyB8fCAobWF4V2FpdCAhPT0gd2FpdCkpIHtcbiAgICAgICAgICBsYXN0Q2FsbGVkID0gbm93KCk7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgICAgICBpZiAoIXRpbWVvdXRJZCAmJiAhbWF4VGltZW91dElkKSB7XG4gICAgICAgICAgICBhcmdzID0gdGhpc0FyZyA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIHN0YW1wID0gbm93KCk7XG4gICAgICAgIHRoaXNBcmcgPSB0aGlzO1xuICAgICAgICB0cmFpbGluZ0NhbGwgPSB0cmFpbGluZyAmJiAodGltZW91dElkIHx8ICFsZWFkaW5nKTtcblxuICAgICAgICBpZiAobWF4V2FpdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB2YXIgbGVhZGluZ0NhbGwgPSBsZWFkaW5nICYmICF0aW1lb3V0SWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCFtYXhUaW1lb3V0SWQgJiYgIWxlYWRpbmcpIHtcbiAgICAgICAgICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHJlbWFpbmluZyA9IG1heFdhaXQgLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKSxcbiAgICAgICAgICAgICAgaXNDYWxsZWQgPSByZW1haW5pbmcgPD0gMDtcblxuICAgICAgICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgICAgICAgaWYgKG1heFRpbWVvdXRJZCkge1xuICAgICAgICAgICAgICBtYXhUaW1lb3V0SWQgPSBjbGVhclRpbWVvdXQobWF4VGltZW91dElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKCFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgICAgIG1heFRpbWVvdXRJZCA9IHNldFRpbWVvdXQobWF4RGVsYXllZCwgcmVtYWluaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ2FsbGVkICYmIHRpbWVvdXRJZCkge1xuICAgICAgICAgIHRpbWVvdXRJZCA9IGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF0aW1lb3V0SWQgJiYgd2FpdCAhPT0gbWF4V2FpdCkge1xuICAgICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZGVsYXllZCwgd2FpdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxlYWRpbmdDYWxsKSB7XG4gICAgICAgICAgaXNDYWxsZWQgPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ2FsbGVkICYmICF0aW1lb3V0SWQgJiYgIW1heFRpbWVvdXRJZCkge1xuICAgICAgICAgIGFyZ3MgPSB0aGlzQXJnID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWZlcnMgZXhlY3V0aW5nIHRoZSBgZnVuY2AgZnVuY3Rpb24gdW50aWwgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXMgY2xlYXJlZC5cbiAgICAgKiBBZGRpdGlvbmFsIGFyZ3VtZW50cyB3aWxsIGJlIHByb3ZpZGVkIHRvIGBmdW5jYCB3aGVuIGl0IGlzIGludm9rZWQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVmZXIuXG4gICAgICogQHBhcmFtIHsuLi4qfSBbYXJnXSBBcmd1bWVudHMgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVyIGlkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfLmRlZmVyKGZ1bmN0aW9uKHRleHQpIHsgY29uc29sZS5sb2codGV4dCk7IH0sICdkZWZlcnJlZCcpO1xuICAgICAqIC8vIGxvZ3MgJ2RlZmVycmVkJyBhZnRlciBvbmUgb3IgbW9yZSBtaWxsaXNlY29uZHNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkZWZlcihmdW5jKSB7XG4gICAgICBpZiAoIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgIH1cbiAgICAgIHZhciBhcmdzID0gc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7IH0sIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIHRoZSBgZnVuY2AgZnVuY3Rpb24gYWZ0ZXIgYHdhaXRgIG1pbGxpc2Vjb25kcy4gQWRkaXRpb25hbCBhcmd1bWVudHNcbiAgICAgKiB3aWxsIGJlIHByb3ZpZGVkIHRvIGBmdW5jYCB3aGVuIGl0IGlzIGludm9rZWQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVsYXkuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdhaXQgVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgZXhlY3V0aW9uLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ10gQXJndW1lbnRzIHRvIGludm9rZSB0aGUgZnVuY3Rpb24gd2l0aC5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lciBpZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5kZWxheShmdW5jdGlvbih0ZXh0KSB7IGNvbnNvbGUubG9nKHRleHQpOyB9LCAxMDAwLCAnbGF0ZXInKTtcbiAgICAgKiAvLyA9PiBsb2dzICdsYXRlcicgYWZ0ZXIgb25lIHNlY29uZFxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRlbGF5KGZ1bmMsIHdhaXQpIHtcbiAgICAgIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgfVxuICAgICAgdmFyIGFyZ3MgPSBzbGljZShhcmd1bWVudHMsIDIpO1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTsgfSwgd2FpdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgbWVtb2l6ZXMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuIElmIGByZXNvbHZlcmAgaXNcbiAgICAgKiBwcm92aWRlZCBpdCB3aWxsIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSBjYWNoZSBrZXkgZm9yIHN0b3JpbmcgdGhlIHJlc3VsdFxuICAgICAqIGJhc2VkIG9uIHRoZSBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGVcbiAgICAgKiBmaXJzdCBhcmd1bWVudCBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgY2FjaGUga2V5LlxuICAgICAqIFRoZSBgZnVuY2AgaXMgZXhlY3V0ZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIG1lbW9pemVkIGZ1bmN0aW9uLlxuICAgICAqIFRoZSByZXN1bHQgY2FjaGUgaXMgZXhwb3NlZCBhcyB0aGUgYGNhY2hlYCBwcm9wZXJ0eSBvbiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtyZXNvbHZlcl0gQSBmdW5jdGlvbiB1c2VkIHRvIHJlc29sdmUgdGhlIGNhY2hlIGtleS5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXppbmcgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBmaWJvbmFjY2kgPSBfLm1lbW9pemUoZnVuY3Rpb24obikge1xuICAgICAqICAgcmV0dXJuIG4gPCAyID8gbiA6IGZpYm9uYWNjaShuIC0gMSkgKyBmaWJvbmFjY2kobiAtIDIpO1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogZmlib25hY2NpKDkpXG4gICAgICogLy8gPT4gMzRcbiAgICAgKlxuICAgICAqIHZhciBkYXRhID0ge1xuICAgICAqICAgJ2ZyZWQnOiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfSxcbiAgICAgKiAgICdwZWJibGVzJzogeyAnbmFtZSc6ICdwZWJibGVzJywgJ2FnZSc6IDEgfVxuICAgICAqIH07XG4gICAgICpcbiAgICAgKiAvLyBtb2RpZnlpbmcgdGhlIHJlc3VsdCBjYWNoZVxuICAgICAqIHZhciBnZXQgPSBfLm1lbW9pemUoZnVuY3Rpb24obmFtZSkgeyByZXR1cm4gZGF0YVtuYW1lXTsgfSwgXy5pZGVudGl0eSk7XG4gICAgICogZ2V0KCdwZWJibGVzJyk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdwZWJibGVzJywgJ2FnZSc6IDEgfVxuICAgICAqXG4gICAgICogZ2V0LmNhY2hlLnBlYmJsZXMubmFtZSA9ICdwZW5lbG9wZSc7XG4gICAgICogZ2V0KCdwZWJibGVzJyk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdwZW5lbG9wZScsICdhZ2UnOiAxIH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gICAgICBpZiAoIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgIH1cbiAgICAgIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2FjaGUgPSBtZW1vaXplZC5jYWNoZSxcbiAgICAgICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGtleVByZWZpeCArIGFyZ3VtZW50c1swXTtcblxuICAgICAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChjYWNoZSwga2V5KVxuICAgICAgICAgID8gY2FjaGVba2V5XVxuICAgICAgICAgIDogKGNhY2hlW2tleV0gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgfVxuICAgICAgbWVtb2l6ZWQuY2FjaGUgPSB7fTtcbiAgICAgIHJldHVybiBtZW1vaXplZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyByZXN0cmljdGVkIHRvIGV4ZWN1dGUgYGZ1bmNgIG9uY2UuIFJlcGVhdCBjYWxscyB0b1xuICAgICAqIHRoZSBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgdmFsdWUgb2YgdGhlIGZpcnN0IGNhbGwuIFRoZSBgZnVuY2AgaXMgZXhlY3V0ZWRcbiAgICAgKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgY3JlYXRlZCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyByZXN0cmljdGVkIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgaW5pdGlhbGl6ZSA9IF8ub25jZShjcmVhdGVBcHBsaWNhdGlvbik7XG4gICAgICogaW5pdGlhbGl6ZSgpO1xuICAgICAqIGluaXRpYWxpemUoKTtcbiAgICAgKiAvLyBgaW5pdGlhbGl6ZWAgZXhlY3V0ZXMgYGNyZWF0ZUFwcGxpY2F0aW9uYCBvbmNlXG4gICAgICovXG4gICAgZnVuY3Rpb24gb25jZShmdW5jKSB7XG4gICAgICB2YXIgcmFuLFxuICAgICAgICAgIHJlc3VsdDtcblxuICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChyYW4pIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIHJhbiA9IHRydWU7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAvLyBjbGVhciB0aGUgYGZ1bmNgIHZhcmlhYmxlIHNvIHRoZSBmdW5jdGlvbiBtYXkgYmUgZ2FyYmFnZSBjb2xsZWN0ZWRcbiAgICAgICAgZnVuYyA9IG51bGw7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCwgaW52b2tlcyBgZnVuY2Agd2l0aCBhbnkgYWRkaXRpb25hbFxuICAgICAqIGBwYXJ0aWFsYCBhcmd1bWVudHMgcHJlcGVuZGVkIHRvIHRob3NlIHByb3ZpZGVkIHRvIHRoZSBuZXcgZnVuY3Rpb24uIFRoaXNcbiAgICAgKiBtZXRob2QgaXMgc2ltaWxhciB0byBgXy5iaW5kYCBleGNlcHQgaXQgZG9lcyAqKm5vdCoqIGFsdGVyIHRoZSBgdGhpc2AgYmluZGluZy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBwYXJ0aWFsbHkgYXBwbHkgYXJndW1lbnRzIHRvLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ10gQXJndW1lbnRzIHRvIGJlIHBhcnRpYWxseSBhcHBsaWVkLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHBhcnRpYWxseSBhcHBsaWVkIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgZ3JlZXQgPSBmdW5jdGlvbihncmVldGluZywgbmFtZSkgeyByZXR1cm4gZ3JlZXRpbmcgKyAnICcgKyBuYW1lOyB9O1xuICAgICAqIHZhciBoaSA9IF8ucGFydGlhbChncmVldCwgJ2hpJyk7XG4gICAgICogaGkoJ2ZyZWQnKTtcbiAgICAgKiAvLyA9PiAnaGkgZnJlZCdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJ0aWFsKGZ1bmMpIHtcbiAgICAgIHJldHVybiBjcmVhdGVXcmFwcGVyKGZ1bmMsIDE2LCBzbGljZShhcmd1bWVudHMsIDEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLnBhcnRpYWxgIGV4Y2VwdCB0aGF0IGBwYXJ0aWFsYCBhcmd1bWVudHMgYXJlXG4gICAgICogYXBwZW5kZWQgdG8gdGhvc2UgcHJvdmlkZWQgdG8gdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBwYXJ0aWFsbHkgYXBwbHkgYXJndW1lbnRzIHRvLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ10gQXJndW1lbnRzIHRvIGJlIHBhcnRpYWxseSBhcHBsaWVkLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHBhcnRpYWxseSBhcHBsaWVkIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgZGVmYXVsdHNEZWVwID0gXy5wYXJ0aWFsUmlnaHQoXy5tZXJnZSwgXy5kZWZhdWx0cyk7XG4gICAgICpcbiAgICAgKiB2YXIgb3B0aW9ucyA9IHtcbiAgICAgKiAgICd2YXJpYWJsZSc6ICdkYXRhJyxcbiAgICAgKiAgICdpbXBvcnRzJzogeyAnanEnOiAkIH1cbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogZGVmYXVsdHNEZWVwKG9wdGlvbnMsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG4gICAgICpcbiAgICAgKiBvcHRpb25zLnZhcmlhYmxlXG4gICAgICogLy8gPT4gJ2RhdGEnXG4gICAgICpcbiAgICAgKiBvcHRpb25zLmltcG9ydHNcbiAgICAgKiAvLyA9PiB7ICdfJzogXywgJ2pxJzogJCB9XG4gICAgICovXG4gICAgZnVuY3Rpb24gcGFydGlhbFJpZ2h0KGZ1bmMpIHtcbiAgICAgIHJldHVybiBjcmVhdGVXcmFwcGVyKGZ1bmMsIDMyLCBudWxsLCBzbGljZShhcmd1bWVudHMsIDEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBleGVjdXRlZCwgd2lsbCBvbmx5IGNhbGwgdGhlIGBmdW5jYCBmdW5jdGlvblxuICAgICAqIGF0IG1vc3Qgb25jZSBwZXIgZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gUHJvdmlkZSBhbiBvcHRpb25zIG9iamVjdCB0b1xuICAgICAqIGluZGljYXRlIHRoYXQgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlXG4gICAgICogb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbFxuICAgICAqIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBjYWxsLlxuICAgICAqXG4gICAgICogTm90ZTogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCBgZnVuY2Agd2lsbCBiZSBjYWxsZWRcbiAgICAgKiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIGlzXG4gICAgICogaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGV4ZWN1dGlvbnMgdG8uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPXRydWVdIFNwZWNpZnkgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXSBTcGVjaWZ5IGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB0aHJvdHRsZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIC8vIGF2b2lkIGV4Y2Vzc2l2ZWx5IHVwZGF0aW5nIHRoZSBwb3NpdGlvbiB3aGlsZSBzY3JvbGxpbmdcbiAgICAgKiB2YXIgdGhyb3R0bGVkID0gXy50aHJvdHRsZSh1cGRhdGVQb3NpdGlvbiwgMTAwKTtcbiAgICAgKiBqUXVlcnkod2luZG93KS5vbignc2Nyb2xsJywgdGhyb3R0bGVkKTtcbiAgICAgKlxuICAgICAqIC8vIGV4ZWN1dGUgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlc1xuICAgICAqIGpRdWVyeSgnLmludGVyYWN0aXZlJykub24oJ2NsaWNrJywgXy50aHJvdHRsZShyZW5ld1Rva2VuLCAzMDAwMDAsIHtcbiAgICAgKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gICAgICogfSkpO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgICAgIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMgPT09IGZhbHNlKSB7XG4gICAgICAgIGxlYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICAgICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gb3B0aW9ucy5sZWFkaW5nIDogbGVhZGluZztcbiAgICAgICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyBvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gICAgICB9XG4gICAgICBkZWJvdW5jZU9wdGlvbnMubGVhZGluZyA9IGxlYWRpbmc7XG4gICAgICBkZWJvdW5jZU9wdGlvbnMubWF4V2FpdCA9IHdhaXQ7XG4gICAgICBkZWJvdW5jZU9wdGlvbnMudHJhaWxpbmcgPSB0cmFpbGluZztcblxuICAgICAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGRlYm91bmNlT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcHJvdmlkZXMgYHZhbHVlYCB0byB0aGUgd3JhcHBlciBmdW5jdGlvbiBhcyBpdHNcbiAgICAgKiBmaXJzdCBhcmd1bWVudC4gQWRkaXRpb25hbCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGZ1bmN0aW9uIGFyZSBhcHBlbmRlZFxuICAgICAqIHRvIHRob3NlIHByb3ZpZGVkIHRvIHRoZSB3cmFwcGVyIGZ1bmN0aW9uLiBUaGUgd3JhcHBlciBpcyBleGVjdXRlZCB3aXRoXG4gICAgICogdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjcmVhdGVkIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHdyYXAuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gd3JhcHBlciBUaGUgd3JhcHBlciBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIHAgPSBfLndyYXAoXy5lc2NhcGUsIGZ1bmN0aW9uKGZ1bmMsIHRleHQpIHtcbiAgICAgKiAgIHJldHVybiAnPHA+JyArIGZ1bmModGV4dCkgKyAnPC9wPic7XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBwKCdGcmVkLCBXaWxtYSwgJiBQZWJibGVzJyk7XG4gICAgICogLy8gPT4gJzxwPkZyZWQsIFdpbG1hLCAmYW1wOyBQZWJibGVzPC9wPidcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB3cmFwKHZhbHVlLCB3cmFwcGVyKSB7XG4gICAgICByZXR1cm4gY3JlYXRlV3JhcHBlcih3cmFwcGVyLCAxNiwgW3ZhbHVlXSk7XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIG9iamVjdCA9IHsgJ25hbWUnOiAnZnJlZCcgfTtcbiAgICAgKiB2YXIgZ2V0dGVyID0gXy5jb25zdGFudChvYmplY3QpO1xuICAgICAqIGdldHRlcigpID09PSBvYmplY3Q7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvZHVjZXMgYSBjYWxsYmFjayBib3VuZCB0byBhbiBvcHRpb25hbCBgdGhpc0FyZ2AuIElmIGBmdW5jYCBpcyBhIHByb3BlcnR5XG4gICAgICogbmFtZSB0aGUgY3JlYXRlZCBjYWxsYmFjayB3aWxsIHJldHVybiB0aGUgcHJvcGVydHkgdmFsdWUgZm9yIGEgZ2l2ZW4gZWxlbWVudC5cbiAgICAgKiBJZiBgZnVuY2AgaXMgYW4gb2JqZWN0IHRoZSBjcmVhdGVkIGNhbGxiYWNrIHdpbGwgcmV0dXJuIGB0cnVlYCBmb3IgZWxlbWVudHNcbiAgICAgKiB0aGF0IGNvbnRhaW4gdGhlIGVxdWl2YWxlbnQgb2JqZWN0IHByb3BlcnRpZXMsIG90aGVyd2lzZSBpdCB3aWxsIHJldHVybiBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7Kn0gW2Z1bmM9aWRlbnRpdHldIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGEgY2FsbGJhY2suXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBjcmVhdGVkIGNhbGxiYWNrLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbYXJnQ291bnRdIFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRoZSBjYWxsYmFjayBhY2NlcHRzLlxuICAgICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHdyYXAgdG8gY3JlYXRlIGN1c3RvbSBjYWxsYmFjayBzaG9ydGhhbmRzXG4gICAgICogXy5jcmVhdGVDYWxsYmFjayA9IF8ud3JhcChfLmNyZWF0ZUNhbGxiYWNrLCBmdW5jdGlvbihmdW5jLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgICAqICAgdmFyIG1hdGNoID0gL14oLis/KV9fKFtnbF10KSguKykkLy5leGVjKGNhbGxiYWNrKTtcbiAgICAgKiAgIHJldHVybiAhbWF0Y2ggPyBmdW5jKGNhbGxiYWNrLCB0aGlzQXJnKSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAqICAgICByZXR1cm4gbWF0Y2hbMl0gPT0gJ2d0JyA/IG9iamVjdFttYXRjaFsxXV0gPiBtYXRjaFszXSA6IG9iamVjdFttYXRjaFsxXV0gPCBtYXRjaFszXTtcbiAgICAgKiAgIH07XG4gICAgICogfSk7XG4gICAgICpcbiAgICAgKiBfLmZpbHRlcihjaGFyYWN0ZXJzLCAnYWdlX19ndDM4Jyk7XG4gICAgICogLy8gPT4gW3sgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCB9XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGNyZWF0ZUNhbGxiYWNrKGZ1bmMsIHRoaXNBcmcsIGFyZ0NvdW50KSB7XG4gICAgICB2YXIgdHlwZSA9IHR5cGVvZiBmdW5jO1xuICAgICAgaWYgKGZ1bmMgPT0gbnVsbCB8fCB0eXBlID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VDcmVhdGVDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCk7XG4gICAgICB9XG4gICAgICAvLyBoYW5kbGUgXCJfLnBsdWNrXCIgc3R5bGUgY2FsbGJhY2sgc2hvcnRoYW5kc1xuICAgICAgaWYgKHR5cGUgIT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5KGZ1bmMpO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BzID0ga2V5cyhmdW5jKSxcbiAgICAgICAgICBrZXkgPSBwcm9wc1swXSxcbiAgICAgICAgICBhID0gZnVuY1trZXldO1xuXG4gICAgICAvLyBoYW5kbGUgXCJfLndoZXJlXCIgc3R5bGUgY2FsbGJhY2sgc2hvcnRoYW5kc1xuICAgICAgaWYgKHByb3BzLmxlbmd0aCA9PSAxICYmIGEgPT09IGEgJiYgIWlzT2JqZWN0KGEpKSB7XG4gICAgICAgIC8vIGZhc3QgcGF0aCB0aGUgY29tbW9uIGNhc2Ugb2YgcHJvdmlkaW5nIGFuIG9iamVjdCB3aXRoIGEgc2luZ2xlXG4gICAgICAgIC8vIHByb3BlcnR5IGNvbnRhaW5pbmcgYSBwcmltaXRpdmUgdmFsdWVcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICAgIHZhciBiID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgcmV0dXJuIGEgPT09IGIgJiYgKGEgIT09IDAgfHwgKDEgLyBhID09IDEgLyBiKSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgIHZhciBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcblxuICAgICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBiYXNlSXNFcXVhbChvYmplY3RbcHJvcHNbbGVuZ3RoXV0sIGZ1bmNbcHJvcHNbbGVuZ3RoXV0sIG51bGwsIHRydWUpKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoZSBjaGFyYWN0ZXJzIGAmYCwgYDxgLCBgPmAsIGBcImAsIGFuZCBgJ2AgaW4gYHN0cmluZ2AgdG8gdGhlaXJcbiAgICAgKiBjb3JyZXNwb25kaW5nIEhUTUwgZW50aXRpZXMuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGVzY2FwZS5cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5lc2NhcGUoJ0ZyZWQsIFdpbG1hLCAmIFBlYmJsZXMnKTtcbiAgICAgKiAvLyA9PiAnRnJlZCwgV2lsbWEsICZhbXA7IFBlYmJsZXMnXG4gICAgICovXG4gICAgZnVuY3Rpb24gZXNjYXBlKHN0cmluZykge1xuICAgICAgcmV0dXJuIHN0cmluZyA9PSBudWxsID8gJycgOiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKHJlVW5lc2NhcGVkSHRtbCwgZXNjYXBlSHRtbENoYXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IHByb3ZpZGVkIHRvIGl0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBvYmplY3QgPSB7ICduYW1lJzogJ2ZyZWQnIH07XG4gICAgICogXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3Q7XG4gICAgICogLy8gPT4gdHJ1ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBmdW5jdGlvbiBwcm9wZXJ0aWVzIG9mIGEgc291cmNlIG9iamVjdCB0byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIElmIGBvYmplY3RgIGlzIGEgZnVuY3Rpb24gbWV0aG9kcyB3aWxsIGJlIGFkZGVkIHRvIGl0cyBwcm90b3R5cGUgYXMgd2VsbC5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gW29iamVjdD1sb2Rhc2hdIG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBmdW5jdGlvbnMgdG8gYWRkLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMuY2hhaW49dHJ1ZV0gU3BlY2lmeSB3aGV0aGVyIHRoZSBmdW5jdGlvbnMgYWRkZWQgYXJlIGNoYWluYWJsZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcbiAgICAgKiAgIHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBfLm1peGluKHsgJ2NhcGl0YWxpemUnOiBjYXBpdGFsaXplIH0pO1xuICAgICAqIF8uY2FwaXRhbGl6ZSgnZnJlZCcpO1xuICAgICAqIC8vID0+ICdGcmVkJ1xuICAgICAqXG4gICAgICogXygnZnJlZCcpLmNhcGl0YWxpemUoKS52YWx1ZSgpO1xuICAgICAqIC8vID0+ICdGcmVkJ1xuICAgICAqXG4gICAgICogXy5taXhpbih7ICdjYXBpdGFsaXplJzogY2FwaXRhbGl6ZSB9LCB7ICdjaGFpbic6IGZhbHNlIH0pO1xuICAgICAqIF8oJ2ZyZWQnKS5jYXBpdGFsaXplKCk7XG4gICAgICogLy8gPT4gJ0ZyZWQnXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWl4aW4ob2JqZWN0LCBzb3VyY2UsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBjaGFpbiA9IHRydWUsXG4gICAgICAgICAgbWV0aG9kTmFtZXMgPSBzb3VyY2UgJiYgZnVuY3Rpb25zKHNvdXJjZSk7XG5cbiAgICAgIGlmICghc291cmNlIHx8ICghb3B0aW9ucyAmJiAhbWV0aG9kTmFtZXMubGVuZ3RoKSkge1xuICAgICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgb3B0aW9ucyA9IHNvdXJjZTtcbiAgICAgICAgfVxuICAgICAgICBjdG9yID0gbG9kYXNoV3JhcHBlcjtcbiAgICAgICAgc291cmNlID0gb2JqZWN0O1xuICAgICAgICBvYmplY3QgPSBsb2Rhc2g7XG4gICAgICAgIG1ldGhvZE5hbWVzID0gZnVuY3Rpb25zKHNvdXJjZSk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICAgICAgY2hhaW4gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qob3B0aW9ucykgJiYgJ2NoYWluJyBpbiBvcHRpb25zKSB7XG4gICAgICAgIGNoYWluID0gb3B0aW9ucy5jaGFpbjtcbiAgICAgIH1cbiAgICAgIHZhciBjdG9yID0gb2JqZWN0LFxuICAgICAgICAgIGlzRnVuYyA9IGlzRnVuY3Rpb24oY3Rvcik7XG5cbiAgICAgIGZvckVhY2gobWV0aG9kTmFtZXMsIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgdmFyIGZ1bmMgPSBvYmplY3RbbWV0aG9kTmFtZV0gPSBzb3VyY2VbbWV0aG9kTmFtZV07XG4gICAgICAgIGlmIChpc0Z1bmMpIHtcbiAgICAgICAgICBjdG9yLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNoYWluQWxsID0gdGhpcy5fX2NoYWluX18sXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLl9fd3JhcHBlZF9fLFxuICAgICAgICAgICAgICAgIGFyZ3MgPSBbdmFsdWVdO1xuXG4gICAgICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseShvYmplY3QsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKGNoYWluIHx8IGNoYWluQWxsKSB7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gcmVzdWx0ICYmIGlzT2JqZWN0KHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXN1bHQgPSBuZXcgY3RvcihyZXN1bHQpO1xuICAgICAgICAgICAgICByZXN1bHQuX19jaGFpbl9fID0gY2hhaW5BbGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldmVydHMgdGhlICdfJyB2YXJpYWJsZSB0byBpdHMgcHJldmlvdXMgdmFsdWUgYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG9cbiAgICAgKiB0aGUgYGxvZGFzaGAgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBgbG9kYXNoYCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogdmFyIGxvZGFzaCA9IF8ubm9Db25mbGljdCgpO1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG4gICAgICBjb250ZXh0Ll8gPSBvbGREYXNoO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBuby1vcGVyYXRpb24gZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBvYmplY3QgPSB7ICduYW1lJzogJ2ZyZWQnIH07XG4gICAgICogXy5ub29wKG9iamVjdCkgPT09IHVuZGVmaW5lZDtcbiAgICAgKiAvLyA9PiB0cnVlXG4gICAgICovXG4gICAgZnVuY3Rpb24gbm9vcCgpIHtcbiAgICAgIC8vIG5vIG9wZXJhdGlvbiBwZXJmb3JtZWRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBVbml4IGVwb2NoXG4gICAgICogKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBzdGFtcCA9IF8ubm93KCk7XG4gICAgICogXy5kZWZlcihmdW5jdGlvbigpIHsgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTsgfSk7XG4gICAgICogLy8gPT4gbG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgZnVuY3Rpb24gdG8gYmUgY2FsbGVkXG4gICAgICovXG4gICAgdmFyIG5vdyA9IGlzTmF0aXZlKG5vdyA9IERhdGUubm93KSAmJiBub3cgfHwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIHRoZSBnaXZlbiB2YWx1ZSBpbnRvIGFuIGludGVnZXIgb2YgdGhlIHNwZWNpZmllZCByYWRpeC5cbiAgICAgKiBJZiBgcmFkaXhgIGlzIGB1bmRlZmluZWRgIG9yIGAwYCBhIGByYWRpeGAgb2YgYDEwYCBpcyB1c2VkIHVubGVzcyB0aGVcbiAgICAgKiBgdmFsdWVgIGlzIGEgaGV4YWRlY2ltYWwsIGluIHdoaWNoIGNhc2UgYSBgcmFkaXhgIG9mIGAxNmAgaXMgdXNlZC5cbiAgICAgKlxuICAgICAqIE5vdGU6IFRoaXMgbWV0aG9kIGF2b2lkcyBkaWZmZXJlbmNlcyBpbiBuYXRpdmUgRVMzIGFuZCBFUzUgYHBhcnNlSW50YFxuICAgICAqIGltcGxlbWVudGF0aW9ucy4gU2VlIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyNFLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcGFyc2UuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtyYWRpeF0gVGhlIHJhZGl4IHVzZWQgdG8gaW50ZXJwcmV0IHRoZSB2YWx1ZSB0byBwYXJzZS5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBuZXcgaW50ZWdlciB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy5wYXJzZUludCgnMDgnKTtcbiAgICAgKiAvLyA9PiA4XG4gICAgICovXG4gICAgdmFyIHBhcnNlSW50ID0gbmF0aXZlUGFyc2VJbnQod2hpdGVzcGFjZSArICcwOCcpID09IDggPyBuYXRpdmVQYXJzZUludCA6IGZ1bmN0aW9uKHZhbHVlLCByYWRpeCkge1xuICAgICAgLy8gRmlyZWZveCA8IDIxIGFuZCBPcGVyYSA8IDE1IGZvbGxvdyB0aGUgRVMzIHNwZWNpZmllZCBpbXBsZW1lbnRhdGlvbiBvZiBgcGFyc2VJbnRgXG4gICAgICByZXR1cm4gbmF0aXZlUGFyc2VJbnQoaXNTdHJpbmcodmFsdWUpID8gdmFsdWUucmVwbGFjZShyZUxlYWRpbmdTcGFjZXNBbmRaZXJvcywgJycpIDogdmFsdWUsIHJhZGl4IHx8IDApO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgXCJfLnBsdWNrXCIgc3R5bGUgZnVuY3Rpb24sIHdoaWNoIHJldHVybnMgdGhlIGBrZXlgIHZhbHVlIG9mIGFcbiAgICAgKiBnaXZlbiBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gcmV0cmlldmUuXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAgfSxcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH1cbiAgICAgKiBdO1xuICAgICAqXG4gICAgICogdmFyIGdldE5hbWUgPSBfLnByb3BlcnR5KCduYW1lJyk7XG4gICAgICpcbiAgICAgKiBfLm1hcChjaGFyYWN0ZXJzLCBnZXROYW1lKTtcbiAgICAgKiAvLyA9PiBbJ2Jhcm5leScsICdmcmVkJ11cbiAgICAgKlxuICAgICAqIF8uc29ydEJ5KGNoYXJhY3RlcnMsIGdldE5hbWUpO1xuICAgICAqIC8vID0+IFt7ICduYW1lJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9LCB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHByb3BlcnR5KGtleSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2R1Y2VzIGEgcmFuZG9tIG51bWJlciBiZXR3ZWVuIGBtaW5gIGFuZCBgbWF4YCAoaW5jbHVzaXZlKS4gSWYgb25seSBvbmVcbiAgICAgKiBhcmd1bWVudCBpcyBwcm92aWRlZCBhIG51bWJlciBiZXR3ZWVuIGAwYCBhbmQgdGhlIGdpdmVuIG51bWJlciB3aWxsIGJlXG4gICAgICogcmV0dXJuZWQuIElmIGBmbG9hdGluZ2AgaXMgdHJ1ZXkgb3IgZWl0aGVyIGBtaW5gIG9yIGBtYXhgIGFyZSBmbG9hdHMgYVxuICAgICAqIGZsb2F0aW5nLXBvaW50IG51bWJlciB3aWxsIGJlIHJldHVybmVkIGluc3RlYWQgb2YgYW4gaW50ZWdlci5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21pbj0wXSBUaGUgbWluaW11bSBwb3NzaWJsZSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21heD0xXSBUaGUgbWF4aW11bSBwb3NzaWJsZSB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtmbG9hdGluZz1mYWxzZV0gU3BlY2lmeSByZXR1cm5pbmcgYSBmbG9hdGluZy1wb2ludCBudW1iZXIuXG4gICAgICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBhIHJhbmRvbSBudW1iZXIuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8ucmFuZG9tKDAsIDUpO1xuICAgICAqIC8vID0+IGFuIGludGVnZXIgYmV0d2VlbiAwIGFuZCA1XG4gICAgICpcbiAgICAgKiBfLnJhbmRvbSg1KTtcbiAgICAgKiAvLyA9PiBhbHNvIGFuIGludGVnZXIgYmV0d2VlbiAwIGFuZCA1XG4gICAgICpcbiAgICAgKiBfLnJhbmRvbSg1LCB0cnVlKTtcbiAgICAgKiAvLyA9PiBhIGZsb2F0aW5nLXBvaW50IG51bWJlciBiZXR3ZWVuIDAgYW5kIDVcbiAgICAgKlxuICAgICAqIF8ucmFuZG9tKDEuMiwgNS4yKTtcbiAgICAgKiAvLyA9PiBhIGZsb2F0aW5nLXBvaW50IG51bWJlciBiZXR3ZWVuIDEuMiBhbmQgNS4yXG4gICAgICovXG4gICAgZnVuY3Rpb24gcmFuZG9tKG1pbiwgbWF4LCBmbG9hdGluZykge1xuICAgICAgdmFyIG5vTWluID0gbWluID09IG51bGwsXG4gICAgICAgICAgbm9NYXggPSBtYXggPT0gbnVsbDtcblxuICAgICAgaWYgKGZsb2F0aW5nID09IG51bGwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtaW4gPT0gJ2Jvb2xlYW4nICYmIG5vTWF4KSB7XG4gICAgICAgICAgZmxvYXRpbmcgPSBtaW47XG4gICAgICAgICAgbWluID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghbm9NYXggJiYgdHlwZW9mIG1heCA9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICBmbG9hdGluZyA9IG1heDtcbiAgICAgICAgICBub01heCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChub01pbiAmJiBub01heCkge1xuICAgICAgICBtYXggPSAxO1xuICAgICAgfVxuICAgICAgbWluID0gK21pbiB8fCAwO1xuICAgICAgaWYgKG5vTWF4KSB7XG4gICAgICAgIG1heCA9IG1pbjtcbiAgICAgICAgbWluID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1heCA9ICttYXggfHwgMDtcbiAgICAgIH1cbiAgICAgIGlmIChmbG9hdGluZyB8fCBtaW4gJSAxIHx8IG1heCAlIDEpIHtcbiAgICAgICAgdmFyIHJhbmQgPSBuYXRpdmVSYW5kb20oKTtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZU1pbihtaW4gKyAocmFuZCAqIChtYXggLSBtaW4gKyBwYXJzZUZsb2F0KCcxZS0nICsgKChyYW5kICsnJykubGVuZ3RoIC0gMSkpKSksIG1heCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmFzZVJhbmRvbShtaW4sIG1heCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgdGhlIHZhbHVlIG9mIHByb3BlcnR5IGBrZXlgIG9uIGBvYmplY3RgLiBJZiBga2V5YCBpcyBhIGZ1bmN0aW9uXG4gICAgICogaXQgd2lsbCBiZSBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBvYmplY3RgIGFuZCBpdHMgcmVzdWx0IHJldHVybmVkLFxuICAgICAqIGVsc2UgdGhlIHByb3BlcnR5IHZhbHVlIGlzIHJldHVybmVkLiBJZiBgb2JqZWN0YCBpcyBmYWxzZXkgdGhlbiBgdW5kZWZpbmVkYFxuICAgICAqIGlzIHJldHVybmVkLlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIHJlc29sdmUuXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgb2JqZWN0ID0ge1xuICAgICAqICAgJ2NoZWVzZSc6ICdjcnVtcGV0cycsXG4gICAgICogICAnc3R1ZmYnOiBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgcmV0dXJuICdub25zZW5zZSc7XG4gICAgICogICB9XG4gICAgICogfTtcbiAgICAgKlxuICAgICAqIF8ucmVzdWx0KG9iamVjdCwgJ2NoZWVzZScpO1xuICAgICAqIC8vID0+ICdjcnVtcGV0cydcbiAgICAgKlxuICAgICAqIF8ucmVzdWx0KG9iamVjdCwgJ3N0dWZmJyk7XG4gICAgICogLy8gPT4gJ25vbnNlbnNlJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJlc3VsdChvYmplY3QsIGtleSkge1xuICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAgICAgcmV0dXJuIGlzRnVuY3Rpb24odmFsdWUpID8gb2JqZWN0W2tleV0oKSA6IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgbWljcm8tdGVtcGxhdGluZyBtZXRob2QgdGhhdCBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXNcbiAgICAgKiB3aGl0ZXNwYWNlLCBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgICAgKlxuICAgICAqIE5vdGU6IEluIHRoZSBkZXZlbG9wbWVudCBidWlsZCwgYF8udGVtcGxhdGVgIHV0aWxpemVzIHNvdXJjZVVSTHMgZm9yIGVhc2llclxuICAgICAqIGRlYnVnZ2luZy4gU2VlIGh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vdHV0b3JpYWxzL2RldmVsb3BlcnRvb2xzL3NvdXJjZW1hcHMvI3RvYy1zb3VyY2V1cmxcbiAgICAgKlxuICAgICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIHByZWNvbXBpbGluZyB0ZW1wbGF0ZXMgc2VlOlxuICAgICAqIGh0dHA6Ly9sb2Rhc2guY29tL2N1c3RvbS1idWlsZHNcbiAgICAgKlxuICAgICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIENocm9tZSBleHRlbnNpb24gc2FuZGJveGVzIHNlZTpcbiAgICAgKiBodHRwOi8vZGV2ZWxvcGVyLmNocm9tZS5jb20vc3RhYmxlL2V4dGVuc2lvbnMvc2FuZGJveGluZ0V2YWwuaHRtbFxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZW1wbGF0ZSB0ZXh0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBkYXRhIG9iamVjdCB1c2VkIHRvIHBvcHVsYXRlIHRoZSB0ZXh0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSBbb3B0aW9ucy5lc2NhcGVdIFRoZSBcImVzY2FwZVwiIGRlbGltaXRlci5cbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gW29wdGlvbnMuZXZhbHVhdGVdIFRoZSBcImV2YWx1YXRlXCIgZGVsaW1pdGVyLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5pbXBvcnRzXSBBbiBvYmplY3QgdG8gaW1wb3J0IGludG8gdGhlIHRlbXBsYXRlIGFzIGxvY2FsIHZhcmlhYmxlcy5cbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gW29wdGlvbnMuaW50ZXJwb2xhdGVdIFRoZSBcImludGVycG9sYXRlXCIgZGVsaW1pdGVyLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbc291cmNlVVJMXSBUaGUgc291cmNlVVJMIG9mIHRoZSB0ZW1wbGF0ZSdzIGNvbXBpbGVkIHNvdXJjZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3ZhcmlhYmxlXSBUaGUgZGF0YSBvYmplY3QgdmFyaWFibGUgbmFtZS5cbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb258c3RyaW5nfSBSZXR1cm5zIGEgY29tcGlsZWQgZnVuY3Rpb24gd2hlbiBubyBgZGF0YWAgb2JqZWN0XG4gICAgICogIGlzIGdpdmVuLCBlbHNlIGl0IHJldHVybnMgdGhlIGludGVycG9sYXRlZCB0ZXh0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyB0aGUgXCJpbnRlcnBvbGF0ZVwiIGRlbGltaXRlciB0byBjcmVhdGUgYSBjb21waWxlZCB0ZW1wbGF0ZVxuICAgICAqIHZhciBjb21waWxlZCA9IF8udGVtcGxhdGUoJ2hlbGxvIDwlPSBuYW1lICU+Jyk7XG4gICAgICogY29tcGlsZWQoeyAnbmFtZSc6ICdmcmVkJyB9KTtcbiAgICAgKiAvLyA9PiAnaGVsbG8gZnJlZCdcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIHRoZSBcImVzY2FwZVwiIGRlbGltaXRlciB0byBlc2NhcGUgSFRNTCBpbiBkYXRhIHByb3BlcnR5IHZhbHVlc1xuICAgICAqIF8udGVtcGxhdGUoJzxiPjwlLSB2YWx1ZSAlPjwvYj4nLCB7ICd2YWx1ZSc6ICc8c2NyaXB0PicgfSk7XG4gICAgICogLy8gPT4gJzxiPiZsdDtzY3JpcHQmZ3Q7PC9iPidcbiAgICAgKlxuICAgICAqIC8vIHVzaW5nIHRoZSBcImV2YWx1YXRlXCIgZGVsaW1pdGVyIHRvIGdlbmVyYXRlIEhUTUxcbiAgICAgKiB2YXIgbGlzdCA9ICc8JSBfLmZvckVhY2gocGVvcGxlLCBmdW5jdGlvbihuYW1lKSB7ICU+PGxpPjwlLSBuYW1lICU+PC9saT48JSB9KTsgJT4nO1xuICAgICAqIF8udGVtcGxhdGUobGlzdCwgeyAncGVvcGxlJzogWydmcmVkJywgJ2Jhcm5leSddIH0pO1xuICAgICAqIC8vID0+ICc8bGk+ZnJlZDwvbGk+PGxpPmJhcm5leTwvbGk+J1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgdGhlIEVTNiBkZWxpbWl0ZXIgYXMgYW4gYWx0ZXJuYXRpdmUgdG8gdGhlIGRlZmF1bHQgXCJpbnRlcnBvbGF0ZVwiIGRlbGltaXRlclxuICAgICAqIF8udGVtcGxhdGUoJ2hlbGxvICR7IG5hbWUgfScsIHsgJ25hbWUnOiAncGViYmxlcycgfSk7XG4gICAgICogLy8gPT4gJ2hlbGxvIHBlYmJsZXMnXG4gICAgICpcbiAgICAgKiAvLyB1c2luZyB0aGUgaW50ZXJuYWwgYHByaW50YCBmdW5jdGlvbiBpbiBcImV2YWx1YXRlXCIgZGVsaW1pdGVyc1xuICAgICAqIF8udGVtcGxhdGUoJzwlIHByaW50KFwiaGVsbG8gXCIgKyBuYW1lKTsgJT4hJywgeyAnbmFtZSc6ICdiYXJuZXknIH0pO1xuICAgICAqIC8vID0+ICdoZWxsbyBiYXJuZXkhJ1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgYSBjdXN0b20gdGVtcGxhdGUgZGVsaW1pdGVyc1xuICAgICAqIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICAgKiAgICdpbnRlcnBvbGF0ZSc6IC97eyhbXFxzXFxTXSs/KX19L2dcbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogXy50ZW1wbGF0ZSgnaGVsbG8ge3sgbmFtZSB9fSEnLCB7ICduYW1lJzogJ211c3RhY2hlJyB9KTtcbiAgICAgKiAvLyA9PiAnaGVsbG8gbXVzdGFjaGUhJ1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgdGhlIGBpbXBvcnRzYCBvcHRpb24gdG8gaW1wb3J0IGpRdWVyeVxuICAgICAqIHZhciBsaXN0ID0gJzwlIGpxLmVhY2gocGVvcGxlLCBmdW5jdGlvbihuYW1lKSB7ICU+PGxpPjwlLSBuYW1lICU+PC9saT48JSB9KTsgJT4nO1xuICAgICAqIF8udGVtcGxhdGUobGlzdCwgeyAncGVvcGxlJzogWydmcmVkJywgJ2Jhcm5leSddIH0sIHsgJ2ltcG9ydHMnOiB7ICdqcSc6IGpRdWVyeSB9IH0pO1xuICAgICAqIC8vID0+ICc8bGk+ZnJlZDwvbGk+PGxpPmJhcm5leTwvbGk+J1xuICAgICAqXG4gICAgICogLy8gdXNpbmcgdGhlIGBzb3VyY2VVUkxgIG9wdGlvbiB0byBzcGVjaWZ5IGEgY3VzdG9tIHNvdXJjZVVSTCBmb3IgdGhlIHRlbXBsYXRlXG4gICAgICogdmFyIGNvbXBpbGVkID0gXy50ZW1wbGF0ZSgnaGVsbG8gPCU9IG5hbWUgJT4nLCBudWxsLCB7ICdzb3VyY2VVUkwnOiAnL2Jhc2ljL2dyZWV0aW5nLmpzdCcgfSk7XG4gICAgICogY29tcGlsZWQoZGF0YSk7XG4gICAgICogLy8gPT4gZmluZCB0aGUgc291cmNlIG9mIFwiZ3JlZXRpbmcuanN0XCIgdW5kZXIgdGhlIFNvdXJjZXMgdGFiIG9yIFJlc291cmNlcyBwYW5lbCBvZiB0aGUgd2ViIGluc3BlY3RvclxuICAgICAqXG4gICAgICogLy8gdXNpbmcgdGhlIGB2YXJpYWJsZWAgb3B0aW9uIHRvIGVuc3VyZSBhIHdpdGgtc3RhdGVtZW50IGlzbid0IHVzZWQgaW4gdGhlIGNvbXBpbGVkIHRlbXBsYXRlXG4gICAgICogdmFyIGNvbXBpbGVkID0gXy50ZW1wbGF0ZSgnaGkgPCU9IGRhdGEubmFtZSAlPiEnLCBudWxsLCB7ICd2YXJpYWJsZSc6ICdkYXRhJyB9KTtcbiAgICAgKiBjb21waWxlZC5zb3VyY2U7XG4gICAgICogLy8gPT4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAqICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xuICAgICAqICAgX19wICs9ICdoaSAnICsgKChfX3QgPSAoIGRhdGEubmFtZSApKSA9PSBudWxsID8gJycgOiBfX3QpICsgJyEnO1xuICAgICAqICAgcmV0dXJuIF9fcDtcbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiAvLyB1c2luZyB0aGUgYHNvdXJjZWAgcHJvcGVydHkgdG8gaW5saW5lIGNvbXBpbGVkIHRlbXBsYXRlcyBmb3IgbWVhbmluZ2Z1bFxuICAgICAqIC8vIGxpbmUgbnVtYmVycyBpbiBlcnJvciBtZXNzYWdlcyBhbmQgYSBzdGFjayB0cmFjZVxuICAgICAqIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGN3ZCwgJ2pzdC5qcycpLCAnXFxcbiAgICAgKiAgIHZhciBKU1QgPSB7XFxcbiAgICAgKiAgICAgXCJtYWluXCI6ICcgKyBfLnRlbXBsYXRlKG1haW5UZXh0KS5zb3VyY2UgKyAnXFxcbiAgICAgKiAgIH07XFxcbiAgICAgKiAnKTtcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSh0ZXh0LCBkYXRhLCBvcHRpb25zKSB7XG4gICAgICAvLyBiYXNlZCBvbiBKb2huIFJlc2lnJ3MgYHRtcGxgIGltcGxlbWVudGF0aW9uXG4gICAgICAvLyBodHRwOi8vZWpvaG4ub3JnL2Jsb2cvamF2YXNjcmlwdC1taWNyby10ZW1wbGF0aW5nL1xuICAgICAgLy8gYW5kIExhdXJhIERva3Rvcm92YSdzIGRvVC5qc1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL29sYWRvL2RvVFxuICAgICAgdmFyIHNldHRpbmdzID0gbG9kYXNoLnRlbXBsYXRlU2V0dGluZ3M7XG4gICAgICB0ZXh0ID0gU3RyaW5nKHRleHQgfHwgJycpO1xuXG4gICAgICAvLyBhdm9pZCBtaXNzaW5nIGRlcGVuZGVuY2llcyB3aGVuIGBpdGVyYXRvclRlbXBsYXRlYCBpcyBub3QgZGVmaW5lZFxuICAgICAgb3B0aW9ucyA9IGRlZmF1bHRzKHt9LCBvcHRpb25zLCBzZXR0aW5ncyk7XG5cbiAgICAgIHZhciBpbXBvcnRzID0gZGVmYXVsdHMoe30sIG9wdGlvbnMuaW1wb3J0cywgc2V0dGluZ3MuaW1wb3J0cyksXG4gICAgICAgICAgaW1wb3J0c0tleXMgPSBrZXlzKGltcG9ydHMpLFxuICAgICAgICAgIGltcG9ydHNWYWx1ZXMgPSB2YWx1ZXMoaW1wb3J0cyk7XG5cbiAgICAgIHZhciBpc0V2YWx1YXRpbmcsXG4gICAgICAgICAgaW5kZXggPSAwLFxuICAgICAgICAgIGludGVycG9sYXRlID0gb3B0aW9ucy5pbnRlcnBvbGF0ZSB8fCByZU5vTWF0Y2gsXG4gICAgICAgICAgc291cmNlID0gXCJfX3AgKz0gJ1wiO1xuXG4gICAgICAvLyBjb21waWxlIHRoZSByZWdleHAgdG8gbWF0Y2ggZWFjaCBkZWxpbWl0ZXJcbiAgICAgIHZhciByZURlbGltaXRlcnMgPSBSZWdFeHAoXG4gICAgICAgIChvcHRpb25zLmVzY2FwZSB8fCByZU5vTWF0Y2gpLnNvdXJjZSArICd8JyArXG4gICAgICAgIGludGVycG9sYXRlLnNvdXJjZSArICd8JyArXG4gICAgICAgIChpbnRlcnBvbGF0ZSA9PT0gcmVJbnRlcnBvbGF0ZSA/IHJlRXNUZW1wbGF0ZSA6IHJlTm9NYXRjaCkuc291cmNlICsgJ3wnICtcbiAgICAgICAgKG9wdGlvbnMuZXZhbHVhdGUgfHwgcmVOb01hdGNoKS5zb3VyY2UgKyAnfCQnXG4gICAgICAsICdnJyk7XG5cbiAgICAgIHRleHQucmVwbGFjZShyZURlbGltaXRlcnMsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGVWYWx1ZSwgaW50ZXJwb2xhdGVWYWx1ZSwgZXNUZW1wbGF0ZVZhbHVlLCBldmFsdWF0ZVZhbHVlLCBvZmZzZXQpIHtcbiAgICAgICAgaW50ZXJwb2xhdGVWYWx1ZSB8fCAoaW50ZXJwb2xhdGVWYWx1ZSA9IGVzVGVtcGxhdGVWYWx1ZSk7XG5cbiAgICAgICAgLy8gZXNjYXBlIGNoYXJhY3RlcnMgdGhhdCBjYW5ub3QgYmUgaW5jbHVkZWQgaW4gc3RyaW5nIGxpdGVyYWxzXG4gICAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UocmVVbmVzY2FwZWRTdHJpbmcsIGVzY2FwZVN0cmluZ0NoYXIpO1xuXG4gICAgICAgIC8vIHJlcGxhY2UgZGVsaW1pdGVycyB3aXRoIHNuaXBwZXRzXG4gICAgICAgIGlmIChlc2NhcGVWYWx1ZSkge1xuICAgICAgICAgIHNvdXJjZSArPSBcIicgK1xcbl9fZShcIiArIGVzY2FwZVZhbHVlICsgXCIpICtcXG4nXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2YWx1YXRlVmFsdWUpIHtcbiAgICAgICAgICBpc0V2YWx1YXRpbmcgPSB0cnVlO1xuICAgICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZVZhbHVlICsgXCI7XFxuX19wICs9ICdcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW50ZXJwb2xhdGVWYWx1ZSkge1xuICAgICAgICAgIHNvdXJjZSArPSBcIicgK1xcbigoX190ID0gKFwiICsgaW50ZXJwb2xhdGVWYWx1ZSArIFwiKSkgPT0gbnVsbCA/ICcnIDogX190KSArXFxuJ1wiO1xuICAgICAgICB9XG4gICAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICAgIC8vIHRoZSBKUyBlbmdpbmUgZW1iZWRkZWQgaW4gQWRvYmUgcHJvZHVjdHMgcmVxdWlyZXMgcmV0dXJuaW5nIHRoZSBgbWF0Y2hgXG4gICAgICAgIC8vIHN0cmluZyBpbiBvcmRlciB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IGBvZmZzZXRgIHZhbHVlXG4gICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgIH0pO1xuXG4gICAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgICAvLyBpZiBgdmFyaWFibGVgIGlzIG5vdCBzcGVjaWZpZWQsIHdyYXAgYSB3aXRoLXN0YXRlbWVudCBhcm91bmQgdGhlIGdlbmVyYXRlZFxuICAgICAgLy8gY29kZSB0byBhZGQgdGhlIGRhdGEgb2JqZWN0IHRvIHRoZSB0b3Agb2YgdGhlIHNjb3BlIGNoYWluXG4gICAgICB2YXIgdmFyaWFibGUgPSBvcHRpb25zLnZhcmlhYmxlLFxuICAgICAgICAgIGhhc1ZhcmlhYmxlID0gdmFyaWFibGU7XG5cbiAgICAgIGlmICghaGFzVmFyaWFibGUpIHtcbiAgICAgICAgdmFyaWFibGUgPSAnb2JqJztcbiAgICAgICAgc291cmNlID0gJ3dpdGggKCcgKyB2YXJpYWJsZSArICcpIHtcXG4nICsgc291cmNlICsgJ1xcbn1cXG4nO1xuICAgICAgfVxuICAgICAgLy8gY2xlYW51cCBjb2RlIGJ5IHN0cmlwcGluZyBlbXB0eSBzdHJpbmdzXG4gICAgICBzb3VyY2UgPSAoaXNFdmFsdWF0aW5nID8gc291cmNlLnJlcGxhY2UocmVFbXB0eVN0cmluZ0xlYWRpbmcsICcnKSA6IHNvdXJjZSlcbiAgICAgICAgLnJlcGxhY2UocmVFbXB0eVN0cmluZ01pZGRsZSwgJyQxJylcbiAgICAgICAgLnJlcGxhY2UocmVFbXB0eVN0cmluZ1RyYWlsaW5nLCAnJDE7Jyk7XG5cbiAgICAgIC8vIGZyYW1lIGNvZGUgYXMgdGhlIGZ1bmN0aW9uIGJvZHlcbiAgICAgIHNvdXJjZSA9ICdmdW5jdGlvbignICsgdmFyaWFibGUgKyAnKSB7XFxuJyArXG4gICAgICAgIChoYXNWYXJpYWJsZSA/ICcnIDogdmFyaWFibGUgKyAnIHx8ICgnICsgdmFyaWFibGUgKyAnID0ge30pO1xcbicpICtcbiAgICAgICAgXCJ2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGVcIiArXG4gICAgICAgIChpc0V2YWx1YXRpbmdcbiAgICAgICAgICA/ICcsIF9faiA9IEFycmF5LnByb3RvdHlwZS5qb2luO1xcbicgK1xuICAgICAgICAgICAgXCJmdW5jdGlvbiBwcmludCgpIHsgX19wICs9IF9fai5jYWxsKGFyZ3VtZW50cywgJycpIH1cXG5cIlxuICAgICAgICAgIDogJztcXG4nXG4gICAgICAgICkgK1xuICAgICAgICBzb3VyY2UgK1xuICAgICAgICAncmV0dXJuIF9fcFxcbn0nO1xuXG4gICAgICAvLyBVc2UgYSBzb3VyY2VVUkwgZm9yIGVhc2llciBkZWJ1Z2dpbmcuXG4gICAgICAvLyBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL3R1dG9yaWFscy9kZXZlbG9wZXJ0b29scy9zb3VyY2VtYXBzLyN0b2Mtc291cmNldXJsXG4gICAgICB2YXIgc291cmNlVVJMID0gJ1xcbi8qXFxuLy8jIHNvdXJjZVVSTD0nICsgKG9wdGlvbnMuc291cmNlVVJMIHx8ICcvbG9kYXNoL3RlbXBsYXRlL3NvdXJjZVsnICsgKHRlbXBsYXRlQ291bnRlcisrKSArICddJykgKyAnXFxuKi8nO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gRnVuY3Rpb24oaW1wb3J0c0tleXMsICdyZXR1cm4gJyArIHNvdXJjZSArIHNvdXJjZVVSTCkuYXBwbHkodW5kZWZpbmVkLCBpbXBvcnRzVmFsdWVzKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQoZGF0YSk7XG4gICAgICB9XG4gICAgICAvLyBwcm92aWRlIHRoZSBjb21waWxlZCBmdW5jdGlvbidzIHNvdXJjZSBieSBpdHMgYHRvU3RyaW5nYCBtZXRob2QsIGluXG4gICAgICAvLyBzdXBwb3J0ZWQgZW52aXJvbm1lbnRzLCBvciB0aGUgYHNvdXJjZWAgcHJvcGVydHkgYXMgYSBjb252ZW5pZW5jZSBmb3JcbiAgICAgIC8vIGlubGluaW5nIGNvbXBpbGVkIHRlbXBsYXRlcyBkdXJpbmcgdGhlIGJ1aWxkIHByb2Nlc3NcbiAgICAgIHJlc3VsdC5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGVzIHRoZSBjYWxsYmFjayBgbmAgdGltZXMsIHJldHVybmluZyBhbiBhcnJheSBvZiB0aGUgcmVzdWx0c1xuICAgICAqIG9mIGVhY2ggY2FsbGJhY2sgZXhlY3V0aW9uLiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkXG4gICAgICogd2l0aCBvbmUgYXJndW1lbnQ7IChpbmRleCkuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBleGVjdXRlIHRoZSBjYWxsYmFjay5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIHRoZSByZXN1bHRzIG9mIGVhY2ggYGNhbGxiYWNrYCBleGVjdXRpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIHZhciBkaWNlUm9sbHMgPSBfLnRpbWVzKDMsIF8ucGFydGlhbChfLnJhbmRvbSwgMSwgNikpO1xuICAgICAqIC8vID0+IFszLCA2LCA0XVxuICAgICAqXG4gICAgICogXy50aW1lcygzLCBmdW5jdGlvbihuKSB7IG1hZ2UuY2FzdFNwZWxsKG4pOyB9KTtcbiAgICAgKiAvLyA9PiBjYWxscyBgbWFnZS5jYXN0U3BlbGwobilgIHRocmVlIHRpbWVzLCBwYXNzaW5nIGBuYCBvZiBgMGAsIGAxYCwgYW5kIGAyYCByZXNwZWN0aXZlbHlcbiAgICAgKlxuICAgICAqIF8udGltZXMoMywgZnVuY3Rpb24obikgeyB0aGlzLmNhc3Qobik7IH0sIG1hZ2UpO1xuICAgICAqIC8vID0+IGFsc28gY2FsbHMgYG1hZ2UuY2FzdFNwZWxsKG4pYCB0aHJlZSB0aW1lc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRpbWVzKG4sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgICBuID0gKG4gPSArbikgPiAtMSA/IG4gOiAwO1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgICAgIGNhbGxiYWNrID0gYmFzZUNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAxKTtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gY2FsbGJhY2soaW5kZXgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaW52ZXJzZSBvZiBgXy5lc2NhcGVgIHRoaXMgbWV0aG9kIGNvbnZlcnRzIHRoZSBIVE1MIGVudGl0aWVzXG4gICAgICogYCZhbXA7YCwgYCZsdDtgLCBgJmd0O2AsIGAmcXVvdDtgLCBhbmQgYCYjMzk7YCBpbiBgc3RyaW5nYCB0byB0aGVpclxuICAgICAqIGNvcnJlc3BvbmRpbmcgY2hhcmFjdGVycy5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gdW5lc2NhcGUuXG4gICAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5lc2NhcGVkIHN0cmluZy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy51bmVzY2FwZSgnRnJlZCwgQmFybmV5ICZhbXA7IFBlYmJsZXMnKTtcbiAgICAgKiAvLyA9PiAnRnJlZCwgQmFybmV5ICYgUGViYmxlcydcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmVzY2FwZShzdHJpbmcpIHtcbiAgICAgIHJldHVybiBzdHJpbmcgPT0gbnVsbCA/ICcnIDogU3RyaW5nKHN0cmluZykucmVwbGFjZShyZUVzY2FwZWRIdG1sLCB1bmVzY2FwZUh0bWxDaGFyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgYSB1bmlxdWUgSUQuIElmIGBwcmVmaXhgIGlzIHByb3ZpZGVkIHRoZSBJRCB3aWxsIGJlIGFwcGVuZGVkIHRvIGl0LlxuICAgICAqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbcHJlZml4XSBUaGUgdmFsdWUgdG8gcHJlZml4IHRoZSBJRCB3aXRoLlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuaXF1ZSBJRC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogXy51bmlxdWVJZCgnY29udGFjdF8nKTtcbiAgICAgKiAvLyA9PiAnY29udGFjdF8xMDQnXG4gICAgICpcbiAgICAgKiBfLnVuaXF1ZUlkKCk7XG4gICAgICogLy8gPT4gJzEwNSdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiB1bmlxdWVJZChwcmVmaXgpIHtcbiAgICAgIHZhciBpZCA9ICsraWRDb3VudGVyO1xuICAgICAgcmV0dXJuIFN0cmluZyhwcmVmaXggPT0gbnVsbCA/ICcnIDogcHJlZml4KSArIGlkO1xuICAgIH1cblxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGBsb2Rhc2hgIG9iamVjdCB0aGF0IHdyYXBzIHRoZSBnaXZlbiB2YWx1ZSB3aXRoIGV4cGxpY2l0XG4gICAgICogbWV0aG9kIGNoYWluaW5nIGVuYWJsZWQuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ2hhaW5pbmdcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB3cmFwLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHdyYXBwZXIgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgICdhZ2UnOiAzNiB9LFxuICAgICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAgJ2FnZSc6IDQwIH0sXG4gICAgICogICB7ICduYW1lJzogJ3BlYmJsZXMnLCAnYWdlJzogMSB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIHZhciB5b3VuZ2VzdCA9IF8uY2hhaW4oY2hhcmFjdGVycylcbiAgICAgKiAgICAgLnNvcnRCeSgnYWdlJylcbiAgICAgKiAgICAgLm1hcChmdW5jdGlvbihjaHIpIHsgcmV0dXJuIGNoci5uYW1lICsgJyBpcyAnICsgY2hyLmFnZTsgfSlcbiAgICAgKiAgICAgLmZpcnN0KClcbiAgICAgKiAgICAgLnZhbHVlKCk7XG4gICAgICogLy8gPT4gJ3BlYmJsZXMgaXMgMSdcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjaGFpbih2YWx1ZSkge1xuICAgICAgdmFsdWUgPSBuZXcgbG9kYXNoV3JhcHBlcih2YWx1ZSk7XG4gICAgICB2YWx1ZS5fX2NoYWluX18gPSB0cnVlO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludm9rZXMgYGludGVyY2VwdG9yYCB3aXRoIHRoZSBgdmFsdWVgIGFzIHRoZSBmaXJzdCBhcmd1bWVudCBhbmQgdGhlblxuICAgICAqIHJldHVybnMgYHZhbHVlYC4gVGhlIHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kXG4gICAgICogY2hhaW4gaW4gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpblxuICAgICAqIHRoZSBjaGFpbi5cbiAgICAgKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBjYXRlZ29yeSBDaGFpbmluZ1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb3ZpZGUgdG8gYGludGVyY2VwdG9yYC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBpbnRlcmNlcHRvciBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIF8oWzEsIDIsIDMsIDRdKVxuICAgICAqICAudGFwKGZ1bmN0aW9uKGFycmF5KSB7IGFycmF5LnBvcCgpOyB9KVxuICAgICAqICAucmV2ZXJzZSgpXG4gICAgICogIC52YWx1ZSgpO1xuICAgICAqIC8vID0+IFszLCAyLCAxXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRhcCh2YWx1ZSwgaW50ZXJjZXB0b3IpIHtcbiAgICAgIGludGVyY2VwdG9yKHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFbmFibGVzIGV4cGxpY2l0IG1ldGhvZCBjaGFpbmluZyBvbiB0aGUgd3JhcHBlciBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAbmFtZSBjaGFpblxuICAgICAqIEBtZW1iZXJPZiBfXG4gICAgICogQGNhdGVnb3J5IENoYWluaW5nXG4gICAgICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHdyYXBwZXIgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiB2YXIgY2hhcmFjdGVycyA9IFtcbiAgICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAgICogICB7ICduYW1lJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCB9XG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIC8vIHdpdGhvdXQgZXhwbGljaXQgY2hhaW5pbmdcbiAgICAgKiBfKGNoYXJhY3RlcnMpLmZpcnN0KCk7XG4gICAgICogLy8gPT4geyAnbmFtZSc6ICdiYXJuZXknLCAnYWdlJzogMzYgfVxuICAgICAqXG4gICAgICogLy8gd2l0aCBleHBsaWNpdCBjaGFpbmluZ1xuICAgICAqIF8oY2hhcmFjdGVycykuY2hhaW4oKVxuICAgICAqICAgLmZpcnN0KClcbiAgICAgKiAgIC5waWNrKCdhZ2UnKVxuICAgICAqICAgLnZhbHVlKCk7XG4gICAgICogLy8gPT4geyAnYWdlJzogMzYgfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHdyYXBwZXJDaGFpbigpIHtcbiAgICAgIHRoaXMuX19jaGFpbl9fID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2R1Y2VzIHRoZSBgdG9TdHJpbmdgIHJlc3VsdCBvZiB0aGUgd3JhcHBlZCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBuYW1lIHRvU3RyaW5nXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAY2F0ZWdvcnkgQ2hhaW5pbmdcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcgcmVzdWx0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfKFsxLCAyLCAzXSkudG9TdHJpbmcoKTtcbiAgICAgKiAvLyA9PiAnMSwyLDMnXG4gICAgICovXG4gICAgZnVuY3Rpb24gd3JhcHBlclRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIFN0cmluZyh0aGlzLl9fd3JhcHBlZF9fKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0cyB0aGUgd3JhcHBlZCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBuYW1lIHZhbHVlT2ZcbiAgICAgKiBAbWVtYmVyT2YgX1xuICAgICAqIEBhbGlhcyB2YWx1ZVxuICAgICAqIEBjYXRlZ29yeSBDaGFpbmluZ1xuICAgICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSB3cmFwcGVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiBfKFsxLCAyLCAzXSkudmFsdWVPZigpO1xuICAgICAqIC8vID0+IFsxLCAyLCAzXVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHdyYXBwZXJWYWx1ZU9mKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX193cmFwcGVkX187XG4gICAgfVxuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBhZGQgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIHdyYXBwZWQgdmFsdWVzIHdoZW4gY2hhaW5pbmdcbiAgICBsb2Rhc2guYWZ0ZXIgPSBhZnRlcjtcbiAgICBsb2Rhc2guYXNzaWduID0gYXNzaWduO1xuICAgIGxvZGFzaC5hdCA9IGF0O1xuICAgIGxvZGFzaC5iaW5kID0gYmluZDtcbiAgICBsb2Rhc2guYmluZEFsbCA9IGJpbmRBbGw7XG4gICAgbG9kYXNoLmJpbmRLZXkgPSBiaW5kS2V5O1xuICAgIGxvZGFzaC5jaGFpbiA9IGNoYWluO1xuICAgIGxvZGFzaC5jb21wYWN0ID0gY29tcGFjdDtcbiAgICBsb2Rhc2guY29tcG9zZSA9IGNvbXBvc2U7XG4gICAgbG9kYXNoLmNvbnN0YW50ID0gY29uc3RhbnQ7XG4gICAgbG9kYXNoLmNvdW50QnkgPSBjb3VudEJ5O1xuICAgIGxvZGFzaC5jcmVhdGUgPSBjcmVhdGU7XG4gICAgbG9kYXNoLmNyZWF0ZUNhbGxiYWNrID0gY3JlYXRlQ2FsbGJhY2s7XG4gICAgbG9kYXNoLmN1cnJ5ID0gY3Vycnk7XG4gICAgbG9kYXNoLmRlYm91bmNlID0gZGVib3VuY2U7XG4gICAgbG9kYXNoLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4gICAgbG9kYXNoLmRlZmVyID0gZGVmZXI7XG4gICAgbG9kYXNoLmRlbGF5ID0gZGVsYXk7XG4gICAgbG9kYXNoLmRpZmZlcmVuY2UgPSBkaWZmZXJlbmNlO1xuICAgIGxvZGFzaC5maWx0ZXIgPSBmaWx0ZXI7XG4gICAgbG9kYXNoLmZsYXR0ZW4gPSBmbGF0dGVuO1xuICAgIGxvZGFzaC5mb3JFYWNoID0gZm9yRWFjaDtcbiAgICBsb2Rhc2guZm9yRWFjaFJpZ2h0ID0gZm9yRWFjaFJpZ2h0O1xuICAgIGxvZGFzaC5mb3JJbiA9IGZvckluO1xuICAgIGxvZGFzaC5mb3JJblJpZ2h0ID0gZm9ySW5SaWdodDtcbiAgICBsb2Rhc2guZm9yT3duID0gZm9yT3duO1xuICAgIGxvZGFzaC5mb3JPd25SaWdodCA9IGZvck93blJpZ2h0O1xuICAgIGxvZGFzaC5mdW5jdGlvbnMgPSBmdW5jdGlvbnM7XG4gICAgbG9kYXNoLmdyb3VwQnkgPSBncm91cEJ5O1xuICAgIGxvZGFzaC5pbmRleEJ5ID0gaW5kZXhCeTtcbiAgICBsb2Rhc2guaW5pdGlhbCA9IGluaXRpYWw7XG4gICAgbG9kYXNoLmludGVyc2VjdGlvbiA9IGludGVyc2VjdGlvbjtcbiAgICBsb2Rhc2guaW52ZXJ0ID0gaW52ZXJ0O1xuICAgIGxvZGFzaC5pbnZva2UgPSBpbnZva2U7XG4gICAgbG9kYXNoLmtleXMgPSBrZXlzO1xuICAgIGxvZGFzaC5tYXAgPSBtYXA7XG4gICAgbG9kYXNoLm1hcFZhbHVlcyA9IG1hcFZhbHVlcztcbiAgICBsb2Rhc2gubWF4ID0gbWF4O1xuICAgIGxvZGFzaC5tZW1vaXplID0gbWVtb2l6ZTtcbiAgICBsb2Rhc2gubWVyZ2UgPSBtZXJnZTtcbiAgICBsb2Rhc2gubWluID0gbWluO1xuICAgIGxvZGFzaC5vbWl0ID0gb21pdDtcbiAgICBsb2Rhc2gub25jZSA9IG9uY2U7XG4gICAgbG9kYXNoLnBhaXJzID0gcGFpcnM7XG4gICAgbG9kYXNoLnBhcnRpYWwgPSBwYXJ0aWFsO1xuICAgIGxvZGFzaC5wYXJ0aWFsUmlnaHQgPSBwYXJ0aWFsUmlnaHQ7XG4gICAgbG9kYXNoLnBpY2sgPSBwaWNrO1xuICAgIGxvZGFzaC5wbHVjayA9IHBsdWNrO1xuICAgIGxvZGFzaC5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuICAgIGxvZGFzaC5wdWxsID0gcHVsbDtcbiAgICBsb2Rhc2gucmFuZ2UgPSByYW5nZTtcbiAgICBsb2Rhc2gucmVqZWN0ID0gcmVqZWN0O1xuICAgIGxvZGFzaC5yZW1vdmUgPSByZW1vdmU7XG4gICAgbG9kYXNoLnJlc3QgPSByZXN0O1xuICAgIGxvZGFzaC5zaHVmZmxlID0gc2h1ZmZsZTtcbiAgICBsb2Rhc2guc29ydEJ5ID0gc29ydEJ5O1xuICAgIGxvZGFzaC50YXAgPSB0YXA7XG4gICAgbG9kYXNoLnRocm90dGxlID0gdGhyb3R0bGU7XG4gICAgbG9kYXNoLnRpbWVzID0gdGltZXM7XG4gICAgbG9kYXNoLnRvQXJyYXkgPSB0b0FycmF5O1xuICAgIGxvZGFzaC50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG4gICAgbG9kYXNoLnVuaW9uID0gdW5pb247XG4gICAgbG9kYXNoLnVuaXEgPSB1bmlxO1xuICAgIGxvZGFzaC52YWx1ZXMgPSB2YWx1ZXM7XG4gICAgbG9kYXNoLndoZXJlID0gd2hlcmU7XG4gICAgbG9kYXNoLndpdGhvdXQgPSB3aXRob3V0O1xuICAgIGxvZGFzaC53cmFwID0gd3JhcDtcbiAgICBsb2Rhc2gueG9yID0geG9yO1xuICAgIGxvZGFzaC56aXAgPSB6aXA7XG4gICAgbG9kYXNoLnppcE9iamVjdCA9IHppcE9iamVjdDtcblxuICAgIC8vIGFkZCBhbGlhc2VzXG4gICAgbG9kYXNoLmNvbGxlY3QgPSBtYXA7XG4gICAgbG9kYXNoLmRyb3AgPSByZXN0O1xuICAgIGxvZGFzaC5lYWNoID0gZm9yRWFjaDtcbiAgICBsb2Rhc2guZWFjaFJpZ2h0ID0gZm9yRWFjaFJpZ2h0O1xuICAgIGxvZGFzaC5leHRlbmQgPSBhc3NpZ247XG4gICAgbG9kYXNoLm1ldGhvZHMgPSBmdW5jdGlvbnM7XG4gICAgbG9kYXNoLm9iamVjdCA9IHppcE9iamVjdDtcbiAgICBsb2Rhc2guc2VsZWN0ID0gZmlsdGVyO1xuICAgIGxvZGFzaC50YWlsID0gcmVzdDtcbiAgICBsb2Rhc2gudW5pcXVlID0gdW5pcTtcbiAgICBsb2Rhc2gudW56aXAgPSB6aXA7XG5cbiAgICAvLyBhZGQgZnVuY3Rpb25zIHRvIGBsb2Rhc2gucHJvdG90eXBlYFxuICAgIG1peGluKGxvZGFzaCk7XG5cbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAgIC8vIGFkZCBmdW5jdGlvbnMgdGhhdCByZXR1cm4gdW53cmFwcGVkIHZhbHVlcyB3aGVuIGNoYWluaW5nXG4gICAgbG9kYXNoLmNsb25lID0gY2xvbmU7XG4gICAgbG9kYXNoLmNsb25lRGVlcCA9IGNsb25lRGVlcDtcbiAgICBsb2Rhc2guY29udGFpbnMgPSBjb250YWlucztcbiAgICBsb2Rhc2guZXNjYXBlID0gZXNjYXBlO1xuICAgIGxvZGFzaC5ldmVyeSA9IGV2ZXJ5O1xuICAgIGxvZGFzaC5maW5kID0gZmluZDtcbiAgICBsb2Rhc2guZmluZEluZGV4ID0gZmluZEluZGV4O1xuICAgIGxvZGFzaC5maW5kS2V5ID0gZmluZEtleTtcbiAgICBsb2Rhc2guZmluZExhc3QgPSBmaW5kTGFzdDtcbiAgICBsb2Rhc2guZmluZExhc3RJbmRleCA9IGZpbmRMYXN0SW5kZXg7XG4gICAgbG9kYXNoLmZpbmRMYXN0S2V5ID0gZmluZExhc3RLZXk7XG4gICAgbG9kYXNoLmhhcyA9IGhhcztcbiAgICBsb2Rhc2guaWRlbnRpdHkgPSBpZGVudGl0eTtcbiAgICBsb2Rhc2guaW5kZXhPZiA9IGluZGV4T2Y7XG4gICAgbG9kYXNoLmlzQXJndW1lbnRzID0gaXNBcmd1bWVudHM7XG4gICAgbG9kYXNoLmlzQXJyYXkgPSBpc0FycmF5O1xuICAgIGxvZGFzaC5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG4gICAgbG9kYXNoLmlzRGF0ZSA9IGlzRGF0ZTtcbiAgICBsb2Rhc2guaXNFbGVtZW50ID0gaXNFbGVtZW50O1xuICAgIGxvZGFzaC5pc0VtcHR5ID0gaXNFbXB0eTtcbiAgICBsb2Rhc2guaXNFcXVhbCA9IGlzRXF1YWw7XG4gICAgbG9kYXNoLmlzRmluaXRlID0gaXNGaW5pdGU7XG4gICAgbG9kYXNoLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuICAgIGxvZGFzaC5pc05hTiA9IGlzTmFOO1xuICAgIGxvZGFzaC5pc051bGwgPSBpc051bGw7XG4gICAgbG9kYXNoLmlzTnVtYmVyID0gaXNOdW1iZXI7XG4gICAgbG9kYXNoLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG4gICAgbG9kYXNoLmlzUGxhaW5PYmplY3QgPSBpc1BsYWluT2JqZWN0O1xuICAgIGxvZGFzaC5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuICAgIGxvZGFzaC5pc1N0cmluZyA9IGlzU3RyaW5nO1xuICAgIGxvZGFzaC5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuICAgIGxvZGFzaC5sYXN0SW5kZXhPZiA9IGxhc3RJbmRleE9mO1xuICAgIGxvZGFzaC5taXhpbiA9IG1peGluO1xuICAgIGxvZGFzaC5ub0NvbmZsaWN0ID0gbm9Db25mbGljdDtcbiAgICBsb2Rhc2gubm9vcCA9IG5vb3A7XG4gICAgbG9kYXNoLm5vdyA9IG5vdztcbiAgICBsb2Rhc2gucGFyc2VJbnQgPSBwYXJzZUludDtcbiAgICBsb2Rhc2gucmFuZG9tID0gcmFuZG9tO1xuICAgIGxvZGFzaC5yZWR1Y2UgPSByZWR1Y2U7XG4gICAgbG9kYXNoLnJlZHVjZVJpZ2h0ID0gcmVkdWNlUmlnaHQ7XG4gICAgbG9kYXNoLnJlc3VsdCA9IHJlc3VsdDtcbiAgICBsb2Rhc2gucnVuSW5Db250ZXh0ID0gcnVuSW5Db250ZXh0O1xuICAgIGxvZGFzaC5zaXplID0gc2l6ZTtcbiAgICBsb2Rhc2guc29tZSA9IHNvbWU7XG4gICAgbG9kYXNoLnNvcnRlZEluZGV4ID0gc29ydGVkSW5kZXg7XG4gICAgbG9kYXNoLnRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgbG9kYXNoLnVuZXNjYXBlID0gdW5lc2NhcGU7XG4gICAgbG9kYXNoLnVuaXF1ZUlkID0gdW5pcXVlSWQ7XG5cbiAgICAvLyBhZGQgYWxpYXNlc1xuICAgIGxvZGFzaC5hbGwgPSBldmVyeTtcbiAgICBsb2Rhc2guYW55ID0gc29tZTtcbiAgICBsb2Rhc2guZGV0ZWN0ID0gZmluZDtcbiAgICBsb2Rhc2guZmluZFdoZXJlID0gZmluZDtcbiAgICBsb2Rhc2guZm9sZGwgPSByZWR1Y2U7XG4gICAgbG9kYXNoLmZvbGRyID0gcmVkdWNlUmlnaHQ7XG4gICAgbG9kYXNoLmluY2x1ZGUgPSBjb250YWlucztcbiAgICBsb2Rhc2guaW5qZWN0ID0gcmVkdWNlO1xuXG4gICAgbWl4aW4oZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc291cmNlID0ge31cbiAgICAgIGZvck93bihsb2Rhc2gsIGZ1bmN0aW9uKGZ1bmMsIG1ldGhvZE5hbWUpIHtcbiAgICAgICAgaWYgKCFsb2Rhc2gucHJvdG90eXBlW21ldGhvZE5hbWVdKSB7XG4gICAgICAgICAgc291cmNlW21ldGhvZE5hbWVdID0gZnVuYztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gc291cmNlO1xuICAgIH0oKSwgZmFsc2UpO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvLyBhZGQgZnVuY3Rpb25zIGNhcGFibGUgb2YgcmV0dXJuaW5nIHdyYXBwZWQgYW5kIHVud3JhcHBlZCB2YWx1ZXMgd2hlbiBjaGFpbmluZ1xuICAgIGxvZGFzaC5maXJzdCA9IGZpcnN0O1xuICAgIGxvZGFzaC5sYXN0ID0gbGFzdDtcbiAgICBsb2Rhc2guc2FtcGxlID0gc2FtcGxlO1xuXG4gICAgLy8gYWRkIGFsaWFzZXNcbiAgICBsb2Rhc2gudGFrZSA9IGZpcnN0O1xuICAgIGxvZGFzaC5oZWFkID0gZmlyc3Q7XG5cbiAgICBmb3JPd24obG9kYXNoLCBmdW5jdGlvbihmdW5jLCBtZXRob2ROYW1lKSB7XG4gICAgICB2YXIgY2FsbGJhY2thYmxlID0gbWV0aG9kTmFtZSAhPT0gJ3NhbXBsZSc7XG4gICAgICBpZiAoIWxvZGFzaC5wcm90b3R5cGVbbWV0aG9kTmFtZV0pIHtcbiAgICAgICAgbG9kYXNoLnByb3RvdHlwZVttZXRob2ROYW1lXT0gZnVuY3Rpb24obiwgZ3VhcmQpIHtcbiAgICAgICAgICB2YXIgY2hhaW5BbGwgPSB0aGlzLl9fY2hhaW5fXyxcbiAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYyh0aGlzLl9fd3JhcHBlZF9fLCBuLCBndWFyZCk7XG5cbiAgICAgICAgICByZXR1cm4gIWNoYWluQWxsICYmIChuID09IG51bGwgfHwgKGd1YXJkICYmICEoY2FsbGJhY2thYmxlICYmIHR5cGVvZiBuID09ICdmdW5jdGlvbicpKSlcbiAgICAgICAgICAgID8gcmVzdWx0XG4gICAgICAgICAgICA6IG5ldyBsb2Rhc2hXcmFwcGVyKHJlc3VsdCwgY2hhaW5BbGwpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgICAvKipcbiAgICAgKiBUaGUgc2VtYW50aWMgdmVyc2lvbiBudW1iZXIuXG4gICAgICpcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1lbWJlck9mIF9cbiAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgKi9cbiAgICBsb2Rhc2guVkVSU0lPTiA9ICcyLjQuMSc7XG5cbiAgICAvLyBhZGQgXCJDaGFpbmluZ1wiIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlclxuICAgIGxvZGFzaC5wcm90b3R5cGUuY2hhaW4gPSB3cmFwcGVyQ2hhaW47XG4gICAgbG9kYXNoLnByb3RvdHlwZS50b1N0cmluZyA9IHdyYXBwZXJUb1N0cmluZztcbiAgICBsb2Rhc2gucHJvdG90eXBlLnZhbHVlID0gd3JhcHBlclZhbHVlT2Y7XG4gICAgbG9kYXNoLnByb3RvdHlwZS52YWx1ZU9mID0gd3JhcHBlclZhbHVlT2Y7XG5cbiAgICAvLyBhZGQgYEFycmF5YCBmdW5jdGlvbnMgdGhhdCByZXR1cm4gdW53cmFwcGVkIHZhbHVlc1xuICAgIGZvckVhY2goWydqb2luJywgJ3BvcCcsICdzaGlmdCddLCBmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IGFycmF5UmVmW21ldGhvZE5hbWVdO1xuICAgICAgbG9kYXNoLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2hhaW5BbGwgPSB0aGlzLl9fY2hhaW5fXyxcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcy5fX3dyYXBwZWRfXywgYXJndW1lbnRzKTtcblxuICAgICAgICByZXR1cm4gY2hhaW5BbGxcbiAgICAgICAgICA/IG5ldyBsb2Rhc2hXcmFwcGVyKHJlc3VsdCwgY2hhaW5BbGwpXG4gICAgICAgICAgOiByZXN1bHQ7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgLy8gYWRkIGBBcnJheWAgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIHRoZSBleGlzdGluZyB3cmFwcGVkIHZhbHVlXG4gICAgZm9yRWFjaChbJ3B1c2gnLCAncmV2ZXJzZScsICdzb3J0JywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBhcnJheVJlZlttZXRob2ROYW1lXTtcbiAgICAgIGxvZGFzaC5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuYy5hcHBseSh0aGlzLl9fd3JhcHBlZF9fLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgYEFycmF5YCBmdW5jdGlvbnMgdGhhdCByZXR1cm4gbmV3IHdyYXBwZWQgdmFsdWVzXG4gICAgZm9yRWFjaChbJ2NvbmNhdCcsICdzbGljZScsICdzcGxpY2UnXSwgZnVuY3Rpb24obWV0aG9kTmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBhcnJheVJlZlttZXRob2ROYW1lXTtcbiAgICAgIGxvZGFzaC5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBsb2Rhc2hXcmFwcGVyKGZ1bmMuYXBwbHkodGhpcy5fX3dyYXBwZWRfXywgYXJndW1lbnRzKSwgdGhpcy5fX2NoYWluX18pO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBsb2Rhc2g7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvLyBleHBvc2UgTG8tRGFzaFxuICB2YXIgXyA9IHJ1bkluQ29udGV4dCgpO1xuXG4gIC8vIHNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMgbGlrZSByLmpzIGNoZWNrIGZvciBjb25kaXRpb24gcGF0dGVybnMgbGlrZSB0aGUgZm9sbG93aW5nOlxuICBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBkZWZpbmUuYW1kID09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBFeHBvc2UgTG8tRGFzaCB0byB0aGUgZ2xvYmFsIG9iamVjdCBldmVuIHdoZW4gYW4gQU1EIGxvYWRlciBpcyBwcmVzZW50IGluXG4gICAgLy8gY2FzZSBMby1EYXNoIGlzIGxvYWRlZCB3aXRoIGEgUmVxdWlyZUpTIHNoaW0gY29uZmlnLlxuICAgIC8vIFNlZSBodHRwOi8vcmVxdWlyZWpzLm9yZy9kb2NzL2FwaS5odG1sI2NvbmZpZy1zaGltXG4gICAgcm9vdC5fID0gXztcblxuICAgIC8vIGRlZmluZSBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlIHNvLCB0aHJvdWdoIHBhdGggbWFwcGluZywgaXQgY2FuIGJlXG4gICAgLy8gcmVmZXJlbmNlZCBhcyB0aGUgXCJ1bmRlcnNjb3JlXCIgbW9kdWxlXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbiAgLy8gY2hlY2sgZm9yIGBleHBvcnRzYCBhZnRlciBgZGVmaW5lYCBpbiBjYXNlIGEgYnVpbGQgb3B0aW1pemVyIGFkZHMgYW4gYGV4cG9ydHNgIG9iamVjdFxuICBlbHNlIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG4gICAgLy8gaW4gTm9kZS5qcyBvciBSaW5nb0pTXG4gICAgaWYgKG1vZHVsZUV4cG9ydHMpIHtcbiAgICAgIChmcmVlTW9kdWxlLmV4cG9ydHMgPSBfKS5fID0gXztcbiAgICB9XG4gICAgLy8gaW4gTmFyd2hhbCBvciBSaGlubyAtcmVxdWlyZVxuICAgIGVsc2Uge1xuICAgICAgZnJlZUV4cG9ydHMuXyA9IF87XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIC8vIGluIGEgYnJvd3NlciBvciBSaGlub1xuICAgIHJvb3QuXyA9IF87XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBsYXllciBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xuICBjb25zdHJ1Y3RvcihzdGF0ZSwgeCwgeSkge1xuICAgIHZhciBwbGF5ZXIgPSBuZXcgUGhhc2VyLlNwcml0ZShzdGF0ZSwgeCwgeSwgXCJwbGF5ZXJcIilcblxuICAgIHBsYXllci5zY2FsZS54ID0gLjI1O1xuICAgIHBsYXllci5zY2FsZS55ID0gLjI1O1xuXG4gICAgcmV0dXJuIHBsYXllcjtcbiAgfVxufVxuIiwidmFyIHttYXAsIGZvckVhY2h9ID0gcmVxdWlyZShcImxvZGFzaFwiKVxudmFyIFJvdW5kID0gcmVxdWlyZShcIi4vc3RhdGVzL1JvdW5kXCIpXG52YXIgc2NyZWVuID0ge1xuICBoZWlnaHQ6IDQ4MCxcbiAgd2lkdGg6IDY0MFxufVxuXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZShzY3JlZW4ud2lkdGgsIHNjcmVlbi5oZWlnaHQsIFBoYXNlci5BVVRPLCBcImdhbWVcIilcblxuZ2FtZS5zdGF0ZS5hZGQoJ2dhbWUnLCBSb3VuZCk7XG5nYW1lLnN0YXRlLnN0YXJ0KCdnYW1lJyk7XG4iLCJ2YXIgUGxheWVyID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL1BsYXllclwiKVxuXG52YXIgYWRkUGxheWVyID0gKHN0YXRlLCBwbGF5ZXIpID0+IHtcbiAgc3RhdGUucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHBsYXllcilcbiAgcGxheWVyLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gdHJ1ZVxuICBzdGF0ZS5hZGQuZXhpc3RpbmcocGxheWVyKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJvdW5kIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3BsYXllcicsICdzcHJpdGVzL3BsYXllci5wbmcnKVxuICB9XG5cbiAgY3JlYXRlKCkge1xuICAgIHZhciBwbGF5ZXIxID0gUGxheWVyKHRoaXMsIDAsIDApXG4gICAgdmFyIHBsYXllcjIgPSBQbGF5ZXIodGhpcywgMzAwLCAzMDApXG5cbiAgICB0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQXJjYWRlKVxuICAgIGFkZFBsYXllcih0aGlzLCBwbGF5ZXIxKVxuICAgIGFkZFBsYXllcih0aGlzLCBwbGF5ZXIyKVxuICB9XG5cbiAgdXBkYXRlKCkge1xuICBcbiAgfVxufVxuIl19
