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
module.exports={
  "Round": {
    "tilemaps": [
      {
        "name": "map",
        "path": "sprites/maps/2fort.json"
      }
    ],
    "spritesheets": [
      {
        "name": "player",
        "path": "sprites/enemy.png",
        "width": 64,
        "height": 64,
        "length": 4
      },
      {
        "name": "hadouken",
        "path": "sprites/hadouken.png",
        "width": 100,
        "height": 75,
        "length": 6
      },
      {
        "name": "fireball",
        "path": "sprites/fireball.png",
        "width": 23,
        "height": 28,
        "length": 4 
      }
    ],
    "images": [
      {
        "name": "Desert",
        "path": "sprites/tmw_desert_spacing.png"
      }
    ],
    "audios": [
      {
        "name": "jump",
        "path": "sounds/jump.ogg"
      },
      {
        "name": "land",
        "path": "sounds/land.ogg"
      },
      {
        "name": "hadouken",
        "path": "sounds/hadouken.mp3"
      },
      {
        "name": "explosion",
        "path": "sounds/explosion.mp3"
      },
      {
        "name": "explosion5",
        "path": "sounds/explosion5.mp3"
      },
      {
        "name": "toasty",
        "path": "sounds/toasty.mp3"
      },
      {
        "name": "toasty3",
        "path": "sounds/toasty3.mp3"
      },
      {
        "name": "dodge",
        "path": "sounds/dodge.mp3"
      },
      {
        "name": "dodge2",
        "path": "sounds/dodge2.mp3"
      },
      {
        "name": "music",
        "path": "sounds/music.ogg"
      }
    ]
  }
}

},{}],4:[function(require,module,exports){
"use strict";
var __moduleName = "public/entities/Hadouken";
module.exports = (function($__super) {
  var Hadouken = function Hadouken(game, x, y) {
    $traceurRuntime.superCall(this, Hadouken.prototype, "constructor", [game, x, y, "none", 0]);
    game.physics.p2.enable(this);
    this.body.setCircle(16);
    this.body._type = "hadouken";
    this.speed = 2000;
    this.owner = null;
  };
  return ($traceurRuntime.createClass)(Hadouken, {update: function() {
      this.body.setZeroRotation();
    }}, {}, $__super);
}(Phaser.Sprite));


},{}],5:[function(require,module,exports){
"use strict";
var __moduleName = "public/entities/Player";
module.exports = (function($__super) {
  var Player = function Player(game, x, y) {
    $traceurRuntime.superCall(this, Player.prototype, "constructor", [game, x, y, "none", 0]);
    game.physics.p2.enable(this);
    this.body.setCircle(24);
    this.body._type = "player";
    this.name = "";
    this.speed = 300;
    this.jumping = false;
    this.jumpDuration = 600;
    this.hadoukenTimeout = 1000;
    this.lastHadouken = null;
    this.initialHeight = 1.0;
    this.scale.setTo(this.initialHeight, this.initialHeight);
    this.rotationOffset = Math.PI / 2;
    this.up = false;
    this.right = false;
    this.down = false;
    this.left = false;
    this.jumpSound = game.add.audio("jump");
    this.landSound = game.add.audio("jump");
    this.fireSound = game.add.audio("hadouken");
  };
  return ($traceurRuntime.createClass)(Player, {
    jump: function() {
      var $__0 = this;
      if (this.jumping)
        return false;
      var initialHeight = this.initialHeight,
          apex = initialHeight * 1.2,
          max = {
            x: apex,
            y: apex
          },
          min = {
            x: initialHeight,
            y: initialHeight
          },
          upTime = this.jumpDuration / 2,
          downTime = this.jumpDuration / 2,
          easeUp = Phaser.Easing.Sinusoidal.Out,
          easeDown = Phaser.Easing.Sinusoidal.In,
          ascent = this.game.add.tween(this.scale).to(max, upTime, easeUp),
          descent = this.game.add.tween(this.scale).to(min, downTime, easeDown);
      ascent.onStart.add((function() {
        $__0.jumpSound.play();
        $__0.jumping = true;
      }));
      descent.onComplete.add((function() {
        $__0.landSound.play();
        $__0.jumping = false;
      }));
      ascent.chain(descent).start();
    },
    fire: function(hadoukens) {
      var hadouken = hadoukens.getFirstExists(false);
      var now = this.game.time.now;
      var hadoukenAllowed = now > this.lastHadouken + this.hadoukenTimeout;
      if (!hadoukenAllowed)
        return;
      hadouken.reset(this.x, this.y);
      hadouken.body.rotation = this.body.rotation;
      hadouken.body.moveForward(hadouken.speed);
      hadouken.owner = this;
      this.lastHadouken = now;
      this.fireSound.play();
    },
    update: function() {
      var leftVel = this.left ? this.speed * -1 : 0,
          rightVel = this.right ? this.speed : 0,
          upVel = this.up ? this.speed * -1 : 0,
          downVel = this.down ? this.speed : 0,
          xVel = leftVel + rightVel,
          yVel = upVel + downVel,
          stopped = (!xVel && !yVel);
      this.body.setZeroRotation();
      this.body.rotation = stopped ? this.body.rotation : Phaser.Math.angleBetween(0, 0, xVel, yVel) + this.rotationOffset;
      if (!this.jumping) {
        this.body.velocity.x = xVel;
        this.body.velocity.y = yVel;
        this.animations.play(stopped ? "idle" : "walking");
      } else {
        this.animations.play("jumping");
      }
    }
  }, {}, $__super);
}(Phaser.Sprite));


},{}],6:[function(require,module,exports){
"use strict";
var __moduleName = "public/main";
var Round = require("./states/Round");
var AssetLoader = require("./systems/AssetLoader");
var assets = require("./assets.json");
var io = require("socket.io-client");
var serverUrl = window.location.href + "server";
var socket = io.connect(serverUrl);
var game = new Phaser.Game(1920, 960, Phaser.CANVAS, "game");
socket.on("connect", function() {
  console.log("server connected");
  game._assetLoader = new AssetLoader(game, assets);
  game._socket = socket;
  game.state.add('game', Round);
  game.state.start('game');
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.setScreenSize();
  game.scale.refresh();
  game.stage.disableVisibilityChange = true;
});


},{"./assets.json":3,"./states/Round":7,"./systems/AssetLoader":8,"socket.io-client":"k52UWs"}],7:[function(require,module,exports){
"use strict";
var __moduleName = "public/states/Round";
var Player = require("../entities/Player");
var Hadouken = require("../entities/Hadouken");
var $__1 = require("../utils"),
    getRandom = $__1.getRandom,
    noop = $__1.noop,
    isTypeCombo = $__1.isTypeCombo;
module.exports = (function($__super) {
  var Round = function Round() {
    $traceurRuntime.defaultSuperCall(this, Round.prototype, arguments);
  };
  return ($traceurRuntime.createClass)(Round, {
    addPlayer: function(id) {
      var spawn = getRandom(this.playerSpawns);
      var player = new Player(this.game, spawn.x, spawn.y);
      this.registerPlayer(player);
      this.socketPlayerMap[id] = player;
      console.log("add", id);
    },
    removePlayer: function(id) {
      var player = this.socketPlayerMap[id];
      if (!player)
        return false;
      this.players.remove(player);
      this.socketPlayerMap[id] = undefined;
      console.log("remove", id);
    },
    updatePlayer: function($__1) {
      var id = $__1.id,
          keys = $__1.keys;
      var player = this.socketPlayerMap[id];
      if (!player)
        return false;
      player.name = keys.name;
      player.up = keys.up;
      player.right = keys.right;
      player.down = keys.down;
      player.left = keys.left;
      if (keys.jump)
        player.jump();
      if (keys.fire)
        player.fire(this.hadoukens);
    },
    registerPlayer: function(player) {
      this.players.add(player);
      player.body.collides(this.wallsCg);
      player.body.setCollisionGroup(this.playersCg);
    },
    registerWall: function(wall) {
      this.walls.push(wall);
      wall.collides(this.playersCg);
      wall.collides(this.hadoukensCg);
      wall.setCollisionGroup(this.wallsCg);
    },
    registerHadouken: function(had) {
      had.body.collides(this.wallsCg, this.hadoukenHitsWall, this);
      had.body.setCollisionGroup(this.hadoukensCg);
    },
    hadoukenHitsPlayer: function(had, player) {
      if (had.sprite.owner === player.sprite) {
        return;
      } else if (player.sprite.jumping) {
        getRandom(this.dodgeSounds).play();
        return;
      } else {
        getRandom(this.killSounds).play();
        had.sprite.kill();
      }
    },
    hadoukenHitsWall: function(had, wall) {
      getRandom(this.explosionSounds).play();
      had.sprite.kill();
    },
    checkOverlap: function(body1, body2) {
      var hadouken,
          player,
          shouldCollide = true;
      if (isTypeCombo(body1._type, body2._type, "player", "hadouken")) {
        shouldCollide = false;
        player = body1._type === "player" ? body1 : body2;
        hadouken = body2._type === "hadouken" ? body2 : body1;
        this.hadoukenHitsPlayer(hadouken, player);
      } else {
        shouldCollide = true;
      }
      return shouldCollide;
    },
    preload: function() {
      this.game._assetLoader.loadFor("Round");
      this.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);
      this.game.physics.p2.setBoundsToWorld(true, true, true, true, true);
      this.game.physics.p2.updateBoundsCollisionGroup();
    },
    create: function() {
      this.playerSpawns = [new Phaser.Point(200, 200), new Phaser.Point(600, 200), new Phaser.Point(1300, 200), new Phaser.Point(900, 450), new Phaser.Point(700, 650), new Phaser.Point(1200, 650)];
      this.socketPlayerMap = {};
      this.game._socket.on("join", this.addPlayer.bind(this)).on("leave", this.removePlayer.bind(this)).on("tick", this.updatePlayer.bind(this));
      this.inputs = [];
      this.killSounds = [this.game.add.audio("toasty"), this.game.add.audio("toasty3")];
      this.explosionSounds = [this.game.add.audio("explosion"), this.game.add.audio("explosion5")];
      this.dodgeSounds = [this.game.add.audio("dodge"), this.game.add.audio("dodge2")];
      this.map = this.game.add.tilemap("map");
      this.map.addTilesetImage("Desert", "Desert");
      this.ground = this.map.createLayer("Ground");
      this.players = this.add.group();
      this.hadoukens = this.add.group();
      this.hadoukens.classType = Hadouken;
      this.hadoukens.createMultiple(1000);
      this.walls = [];
      this.playersCg = this.game.physics.p2.createCollisionGroup();
      this.wallsCg = this.game.physics.p2.createCollisionGroup();
      this.hadoukensCg = this.game.physics.p2.createCollisionGroup();
      var walls = this.game.physics.p2.convertCollisionObjects(this.map, "Collisions", true);
      var spawn = getRandom(this.playerSpawns);
      var player1 = new Player(this.game, spawn.x, spawn.y);
      this.registerPlayer(player1);
      walls.forEach(this.registerWall, this);
      this.hadoukens.forEach(this.registerHadouken, this);
      this.inputs.push({
        key: this.input.keyboard.addKey(Phaser.Keyboard.UP),
        down: (function() {
          player1.up = true;
        }),
        up: (function() {
          player1.up = false;
        })
      });
      this.inputs.push({
        key: this.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
        down: (function() {
          player1.right = true;
        }),
        up: (function() {
          player1.right = false;
        })
      });
      this.inputs.push({
        key: this.input.keyboard.addKey(Phaser.Keyboard.DOWN),
        down: (function() {
          player1.down = true;
        }),
        up: (function() {
          player1.down = false;
        })
      });
      this.inputs.push({
        key: this.input.keyboard.addKey(Phaser.Keyboard.LEFT),
        down: (function() {
          player1.left = true;
        }),
        up: (function() {
          player1.left = false;
        })
      });
      this.inputs.push({
        key: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        down: player1.jump.bind(player1)
      });
      this.inputs.push({
        key: this.input.keyboard.addKey(Phaser.Keyboard.F),
        down: player1.fire.bind(player1, this.hadoukens)
      });
      this.game.physics.p2.setPostBroadphaseCallback(this.checkOverlap, this);
    },
    update: function() {
      this.inputs.forEach(doActionForKey);
    }
  }, {}, $__super);
}(Phaser.State));
var doActionForKey = (function($__1) {
  var key = $__1.key,
      down = $__1.down,
      up = $__1.up;
  var down = down || noop,
      up = up || noop;
  if (key.isDown)
    down();
  else
    up();
});


},{"../entities/Hadouken":4,"../entities/Player":5,"../utils":9}],8:[function(require,module,exports){
"use strict";
var __moduleName = "public/systems/AssetLoader";
module.exports = (function() {
  var AssetLoader = function AssetLoader(game, assets) {
    if (!game || !assets)
      throw new Error("Provide game and assets to constructor");
    this.game = game;
    this.assets = assets;
  };
  return ($traceurRuntime.createClass)(AssetLoader, {loadFor: function(state) {
      var forState = this.assets[state];
      var game = this.game;
      if (!forState)
        return;
      var tilemaps = forState.tilemaps || [];
      var images = forState.images || [];
      var audios = forState.audios || [];
      var spritesheets = forState.spritesheets || [];
      images.forEach((function(img) {
        return game.load.image(img.name, img.path);
      }));
      audios.forEach((function(audio) {
        return game.load.audio(audio.name, audio.path);
      }));
      spritesheets.forEach((function(sheet) {
        game.load.spritesheet(sheet.name, sheet.path, sheet.width, sheet.height, sheet.length);
      }));
      tilemaps.forEach((function(tilemap) {
        game.load.tilemap(tilemap.name, tilemap.path, null, Phaser.Tilemap.TILED_JSON);
      }));
    }}, {});
}());


},{}],9:[function(require,module,exports){
"use strict";
var __moduleName = "public/utils";
module.exports.getRandom = (function(list) {
  return list[Math.floor(Math.random() * list.length)];
});
module.exports.noop = (function() {});
module.exports.isTypeCombo = (function(first, second, prop1, prop2) {
  if (!first || !second || !prop1 || !prop2)
    return false;
  var case1 = (first === prop1 && second === prop2);
  var case2 = (first === prop2 && second === prop1);
  return case1 || case2;
});


},{}]},{},[2,6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9lczZpZnkvbm9kZV9tb2R1bGVzL3RyYWNldXIvYmluL3RyYWNldXItcnVudGltZS5qcyIsIi9Vc2Vycy9zdGV2ZW5rYW5lL2x0dHAvcHVibGljL2Fzc2V0cy5qc29uIiwiL1VzZXJzL3N0ZXZlbmthbmUvbHR0cC9wdWJsaWMvZW50aXRpZXMvSGFkb3VrZW4uanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9lbnRpdGllcy9QbGF5ZXIuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9tYWluLmpzIiwiL1VzZXJzL3N0ZXZlbmthbmUvbHR0cC9wdWJsaWMvc3RhdGVzL1JvdW5kLmpzIiwiL1VzZXJzL3N0ZXZlbmthbmUvbHR0cC9wdWJsaWMvc3lzdGVtcy9Bc3NldExvYWRlci5qcyIsIi9Vc2Vycy9zdGV2ZW5rYW5lL2x0dHAvcHVibGljL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOXpDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q0FDbkMsT0FBTyxDQUFBLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLE9BQU8sRUFBRSxDQUFBLENBQUcsQ0FBQSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUE7Q0FDckQsQ0FBQSxDQUFBO0FBRUQsQ0FBQSxLQUFNLFFBQVEsS0FBSyxjQUFTLEdBQUUsQ0FBQSxDQUFBO0FBRTlCLENBQUEsS0FBTSxRQUFRLFlBQVksYUFBSSxLQUFLLENBQUUsQ0FBQSxNQUFNLENBQUUsQ0FBQSxLQUFLLENBQUUsQ0FBQSxLQUFLLENBQUs7Q0FDNUQsS0FBSSxDQUFDLEtBQUssQ0FBQSxFQUFJLEVBQUMsTUFBTSxDQUFBLEVBQUksRUFBQyxLQUFLLENBQUEsRUFBSSxFQUFDLEtBQUs7Q0FBRSxTQUFPLE1BQUssQ0FBQTtBQUVuRCxDQUZtRCxJQUVuRCxDQUFBLEtBQUssRUFBRyxFQUFDLEtBQUssSUFBSyxNQUFLLENBQUEsRUFBSSxDQUFBLE1BQU0sSUFBSyxNQUFLLENBQUMsQ0FBQTtBQUM3QyxDQUFKLElBQUksQ0FBQSxLQUFLLEVBQUcsRUFBQyxLQUFLLElBQUssTUFBSyxDQUFBLEVBQUksQ0FBQSxNQUFNLElBQUssTUFBSyxDQUFDLENBQUE7Q0FFakQsT0FBTyxDQUFBLEtBQUssR0FBSSxNQUFLLENBQUE7Q0FDdEIsQ0FBQSxDQUFBO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCl7XG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKGdsb2JhbC4kdHJhY2V1clJ1bnRpbWUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyICRPYmplY3QgPSBPYmplY3Q7XG4gIHZhciAkVHlwZUVycm9yID0gVHlwZUVycm9yO1xuICB2YXIgJGNyZWF0ZSA9ICRPYmplY3QuY3JlYXRlO1xuICB2YXIgJGRlZmluZVByb3BlcnRpZXMgPSAkT2JqZWN0LmRlZmluZVByb3BlcnRpZXM7XG4gIHZhciAkZGVmaW5lUHJvcGVydHkgPSAkT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuICB2YXIgJGZyZWV6ZSA9ICRPYmplY3QuZnJlZXplO1xuICB2YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9ICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICB2YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG4gIHZhciAkZ2V0UHJvdG90eXBlT2YgPSAkT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgJGhhc093blByb3BlcnR5ID0gJE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciAkdG9TdHJpbmcgPSAkT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgZnVuY3Rpb24gbm9uRW51bSh2YWx1ZSkge1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfTtcbiAgfVxuICB2YXIgdHlwZXMgPSB7XG4gICAgdm9pZDogZnVuY3Rpb24gdm9pZFR5cGUoKSB7fSxcbiAgICBhbnk6IGZ1bmN0aW9uIGFueSgpIHt9LFxuICAgIHN0cmluZzogZnVuY3Rpb24gc3RyaW5nKCkge30sXG4gICAgbnVtYmVyOiBmdW5jdGlvbiBudW1iZXIoKSB7fSxcbiAgICBib29sZWFuOiBmdW5jdGlvbiBib29sZWFuKCkge31cbiAgfTtcbiAgdmFyIG1ldGhvZCA9IG5vbkVudW07XG4gIHZhciBjb3VudGVyID0gMDtcbiAgZnVuY3Rpb24gbmV3VW5pcXVlU3RyaW5nKCkge1xuICAgIHJldHVybiAnX18kJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDFlOSkgKyAnJCcgKyArK2NvdW50ZXIgKyAnJF9fJztcbiAgfVxuICB2YXIgc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sRGF0YVByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xWYWx1ZXMgPSAkY3JlYXRlKG51bGwpO1xuICBmdW5jdGlvbiBpc1N5bWJvbChzeW1ib2wpIHtcbiAgICByZXR1cm4gdHlwZW9mIHN5bWJvbCA9PT0gJ29iamVjdCcgJiYgc3ltYm9sIGluc3RhbmNlb2YgU3ltYm9sVmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gdHlwZU9mKHYpIHtcbiAgICBpZiAoaXNTeW1ib2wodikpXG4gICAgICByZXR1cm4gJ3N5bWJvbCc7XG4gICAgcmV0dXJuIHR5cGVvZiB2O1xuICB9XG4gIGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xuICAgIHZhciB2YWx1ZSA9IG5ldyBTeW1ib2xWYWx1ZShkZXNjcmlwdGlvbik7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkpXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU3ltYm9sIGNhbm5vdCBiZSBuZXdcXCdlZCcpO1xuICB9XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCBub25FbnVtKFN5bWJvbCkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgbWV0aG9kKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzeW1ib2xWYWx1ZSA9IHRoaXNbc3ltYm9sRGF0YVByb3BlcnR5XTtcbiAgICBpZiAoIWdldE9wdGlvbignc3ltYm9scycpKVxuICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIGlmICghc3ltYm9sVmFsdWUpXG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0NvbnZlcnNpb24gZnJvbSBzeW1ib2wgdG8gc3RyaW5nJyk7XG4gICAgdmFyIGRlc2MgPSBzeW1ib2xWYWx1ZVtzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5XTtcbiAgICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKVxuICAgICAgZGVzYyA9ICcnO1xuICAgIHJldHVybiAnU3ltYm9sKCcgKyBkZXNjICsgJyknO1xuICB9KSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAndmFsdWVPZicsIG1ldGhvZChmdW5jdGlvbigpIHtcbiAgICB2YXIgc3ltYm9sVmFsdWUgPSB0aGlzW3N5bWJvbERhdGFQcm9wZXJ0eV07XG4gICAgaWYgKCFzeW1ib2xWYWx1ZSlcbiAgICAgIHRocm93IFR5cGVFcnJvcignQ29udmVyc2lvbiBmcm9tIHN5bWJvbCB0byBzdHJpbmcnKTtcbiAgICBpZiAoIWdldE9wdGlvbignc3ltYm9scycpKVxuICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIHJldHVybiBzeW1ib2xWYWx1ZTtcbiAgfSkpO1xuICBmdW5jdGlvbiBTeW1ib2xWYWx1ZShkZXNjcmlwdGlvbikge1xuICAgIHZhciBrZXkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sRGF0YVByb3BlcnR5LCB7dmFsdWU6IHRoaXN9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eSwge3ZhbHVlOiBrZXl9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkodGhpcywgc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eSwge3ZhbHVlOiBkZXNjcmlwdGlvbn0pO1xuICAgICRmcmVlemUodGhpcyk7XG4gICAgc3ltYm9sVmFsdWVzW2tleV0gPSB0aGlzO1xuICB9XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIG5vbkVudW0oU3ltYm9sKSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICd0b1N0cmluZycsIHtcbiAgICB2YWx1ZTogU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9KTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ3ZhbHVlT2YnLCB7XG4gICAgdmFsdWU6IFN5bWJvbC5wcm90b3R5cGUudmFsdWVPZixcbiAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICB9KTtcbiAgJGZyZWV6ZShTeW1ib2xWYWx1ZS5wcm90b3R5cGUpO1xuICBTeW1ib2wuaXRlcmF0b3IgPSBTeW1ib2woKTtcbiAgZnVuY3Rpb24gdG9Qcm9wZXJ0eShuYW1lKSB7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKVxuICAgICAgcmV0dXJuIG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpIHtcbiAgICB2YXIgcnYgPSBbXTtcbiAgICB2YXIgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lID0gbmFtZXNbaV07XG4gICAgICBpZiAoIXN5bWJvbFZhbHVlc1tuYW1lXSlcbiAgICAgICAgcnYucHVzaChuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpIHtcbiAgICByZXR1cm4gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIHRvUHJvcGVydHkobmFtZSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpIHtcbiAgICB2YXIgcnYgPSBbXTtcbiAgICB2YXIgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzeW1ib2wgPSBzeW1ib2xWYWx1ZXNbbmFtZXNbaV1dO1xuICAgICAgaWYgKHN5bWJvbClcbiAgICAgICAgcnYucHVzaChzeW1ib2wpO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gaGFzT3duUHJvcGVydHkobmFtZSkge1xuICAgIHJldHVybiAkaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLCB0b1Byb3BlcnR5KG5hbWUpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPcHRpb24obmFtZSkge1xuICAgIHJldHVybiBnbG9iYWwudHJhY2V1ciAmJiBnbG9iYWwudHJhY2V1ci5vcHRpb25zW25hbWVdO1xuICB9XG4gIGZ1bmN0aW9uIHNldFByb3BlcnR5KG9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgc3ltLFxuICAgICAgICBkZXNjO1xuICAgIGlmIChpc1N5bWJvbChuYW1lKSkge1xuICAgICAgc3ltID0gbmFtZTtcbiAgICAgIG5hbWUgPSBuYW1lW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIH1cbiAgICBvYmplY3RbbmFtZV0gPSB2YWx1ZTtcbiAgICBpZiAoc3ltICYmIChkZXNjID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpKSlcbiAgICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtlbnVtZXJhYmxlOiBmYWxzZX0pO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyaXB0b3IpIHtcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpIHtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmVudW1lcmFibGUpIHtcbiAgICAgICAgZGVzY3JpcHRvciA9ICRjcmVhdGUoZGVzY3JpcHRvciwge2VudW1lcmFibGU6IHt2YWx1ZTogZmFsc2V9fSk7XG4gICAgICB9XG4gICAgICBuYW1lID0gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwgZGVzY3JpcHRvcik7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbE9iamVjdChPYmplY3QpIHtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknLCB7dmFsdWU6IGRlZmluZVByb3BlcnR5fSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2dldE93blByb3BlcnR5TmFtZXMnLCB7dmFsdWU6IGdldE93blByb3BlcnR5TmFtZXN9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywge3ZhbHVlOiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3J9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LnByb3RvdHlwZSwgJ2hhc093blByb3BlcnR5Jywge3ZhbHVlOiBoYXNPd25Qcm9wZXJ0eX0pO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4gICAgZnVuY3Rpb24gaXMobGVmdCwgcmlnaHQpIHtcbiAgICAgIGlmIChsZWZ0ID09PSByaWdodClcbiAgICAgICAgcmV0dXJuIGxlZnQgIT09IDAgfHwgMSAvIGxlZnQgPT09IDEgLyByaWdodDtcbiAgICAgIHJldHVybiBsZWZ0ICE9PSBsZWZ0ICYmIHJpZ2h0ICE9PSByaWdodDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2lzJywgbWV0aG9kKGlzKSk7XG4gICAgZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7XG4gICAgICB2YXIgcHJvcHMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpO1xuICAgICAgdmFyIHAsXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgICAgZm9yIChwID0gMDsgcCA8IGxlbmd0aDsgcCsrKSB7XG4gICAgICAgIHRhcmdldFtwcm9wc1twXV0gPSBzb3VyY2VbcHJvcHNbcF1dO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2Fzc2lnbicsIG1ldGhvZChhc3NpZ24pKTtcbiAgICBmdW5jdGlvbiBtaXhpbih0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgdmFyIHByb3BzID0gJGdldE93blByb3BlcnR5TmFtZXMoc291cmNlKTtcbiAgICAgIHZhciBwLFxuICAgICAgICAgIGRlc2NyaXB0b3IsXG4gICAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgICAgZm9yIChwID0gMDsgcCA8IGxlbmd0aDsgcCsrKSB7XG4gICAgICAgIGRlc2NyaXB0b3IgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgcHJvcHNbcF0pO1xuICAgICAgICAkZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wc1twXSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnbWl4aW4nLCBtZXRob2QobWl4aW4pKTtcbiAgfVxuICBmdW5jdGlvbiBleHBvcnRTdGFyKG9iamVjdCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhhcmd1bWVudHNbaV0pO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBuYW1lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAoZnVuY3Rpb24obW9kLCBuYW1lKSB7XG4gICAgICAgICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG1vZFtuYW1lXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pKGFyZ3VtZW50c1tpXSwgbmFtZXNbal0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGZ1bmN0aW9uIHRvT2JqZWN0KHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICB0aHJvdyAkVHlwZUVycm9yKCk7XG4gICAgcmV0dXJuICRPYmplY3QodmFsdWUpO1xuICB9XG4gIGZ1bmN0aW9uIHNwcmVhZCgpIHtcbiAgICB2YXIgcnYgPSBbXSxcbiAgICAgICAgayA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZVRvU3ByZWFkID0gdG9PYmplY3QoYXJndW1lbnRzW2ldKTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsdWVUb1NwcmVhZC5sZW5ndGg7IGorKykge1xuICAgICAgICBydltrKytdID0gdmFsdWVUb1NwcmVhZFtqXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGdldFByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpIHtcbiAgICB3aGlsZSAob2JqZWN0ICE9PSBudWxsKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpO1xuICAgICAgaWYgKHJlc3VsdClcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIG9iamVjdCA9ICRnZXRQcm90b3R5cGVPZihvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKSB7XG4gICAgdmFyIHByb3RvID0gJGdldFByb3RvdHlwZU9mKGhvbWVPYmplY3QpO1xuICAgIGlmICghcHJvdG8pXG4gICAgICB0aHJvdyAkVHlwZUVycm9yKCdzdXBlciBpcyBudWxsJyk7XG4gICAgcmV0dXJuIGdldFByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSk7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsIG5hbWUsIGFyZ3MpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcilcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICBpZiAoZGVzY3JpcHRvci5nZXQpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHNlbGYpLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgICB0aHJvdyAkVHlwZUVycm9yKFwic3VwZXIgaGFzIG5vIG1ldGhvZCAnXCIgKyBuYW1lICsgXCInLlwiKTtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckdldChzZWxmLCBob21lT2JqZWN0LCBuYW1lKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmdldClcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmNhbGwoc2VsZik7XG4gICAgICBlbHNlIGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyU2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgIGRlc2NyaXB0b3Iuc2V0LmNhbGwoc2VsZiwgdmFsdWUpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB0aHJvdyAkVHlwZUVycm9yKFwic3VwZXIgaGFzIG5vIHNldHRlciAnXCIgKyBuYW1lICsgXCInLlwiKTtcbiAgfVxuICBmdW5jdGlvbiBnZXREZXNjcmlwdG9ycyhvYmplY3QpIHtcbiAgICB2YXIgZGVzY3JpcHRvcnMgPSB7fSxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgbmFtZXMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lID0gbmFtZXNbaV07XG4gICAgICBkZXNjcmlwdG9yc1tuYW1lXSA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2NyaXB0b3JzO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZUNsYXNzKGN0b3IsIG9iamVjdCwgc3RhdGljT2JqZWN0LCBzdXBlckNsYXNzKSB7XG4gICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgJ2NvbnN0cnVjdG9yJywge1xuICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAzKSB7XG4gICAgICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIGN0b3IuX19wcm90b19fID0gc3VwZXJDbGFzcztcbiAgICAgIGN0b3IucHJvdG90eXBlID0gJGNyZWF0ZShnZXRQcm90b1BhcmVudChzdXBlckNsYXNzKSwgZ2V0RGVzY3JpcHRvcnMob2JqZWN0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gb2JqZWN0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoY3RvciwgJ3Byb3RvdHlwZScsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2VcbiAgICB9KTtcbiAgICByZXR1cm4gJGRlZmluZVByb3BlcnRpZXMoY3RvciwgZ2V0RGVzY3JpcHRvcnMoc3RhdGljT2JqZWN0KSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0UHJvdG9QYXJlbnQoc3VwZXJDbGFzcykge1xuICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIHByb3RvdHlwZSA9IHN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgICAgaWYgKCRPYmplY3QocHJvdG90eXBlKSA9PT0gcHJvdG90eXBlIHx8IHByb3RvdHlwZSA9PT0gbnVsbClcbiAgICAgICAgcmV0dXJuIHN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgIH1cbiAgICBpZiAoc3VwZXJDbGFzcyA9PT0gbnVsbClcbiAgICAgIHJldHVybiBudWxsO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgfVxuICBmdW5jdGlvbiBkZWZhdWx0U3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsIGFyZ3MpIHtcbiAgICBpZiAoJGdldFByb3RvdHlwZU9mKGhvbWVPYmplY3QpICE9PSBudWxsKVxuICAgICAgc3VwZXJDYWxsKHNlbGYsIGhvbWVPYmplY3QsICdjb25zdHJ1Y3RvcicsIGFyZ3MpO1xuICB9XG4gIHZhciBTVF9ORVdCT1JOID0gMDtcbiAgdmFyIFNUX0VYRUNVVElORyA9IDE7XG4gIHZhciBTVF9TVVNQRU5ERUQgPSAyO1xuICB2YXIgU1RfQ0xPU0VEID0gMztcbiAgdmFyIEVORF9TVEFURSA9IC0yO1xuICB2YXIgUkVUSFJPV19TVEFURSA9IC0zO1xuICBmdW5jdGlvbiBhZGRJdGVyYXRvcihvYmplY3QpIHtcbiAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBTeW1ib2wuaXRlcmF0b3IsIG5vbkVudW0oZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0SW50ZXJuYWxFcnJvcihzdGF0ZSkge1xuICAgIHJldHVybiBuZXcgRXJyb3IoJ1RyYWNldXIgY29tcGlsZXIgYnVnOiBpbnZhbGlkIHN0YXRlIGluIHN0YXRlIG1hY2hpbmU6ICcgKyBzdGF0ZSk7XG4gIH1cbiAgZnVuY3Rpb24gR2VuZXJhdG9yQ29udGV4dCgpIHtcbiAgICB0aGlzLnN0YXRlID0gMDtcbiAgICB0aGlzLkdTdGF0ZSA9IFNUX05FV0JPUk47XG4gICAgdGhpcy5zdG9yZWRFeGNlcHRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5maW5hbGx5RmFsbFRocm91Z2ggPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zZW50XyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnJldHVyblZhbHVlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudHJ5U3RhY2tfID0gW107XG4gIH1cbiAgR2VuZXJhdG9yQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgcHVzaFRyeTogZnVuY3Rpb24oY2F0Y2hTdGF0ZSwgZmluYWxseVN0YXRlKSB7XG4gICAgICBpZiAoZmluYWxseVN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBmaW5hbGx5RmFsbFRocm91Z2ggPSBudWxsO1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlTdGFja18ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAodGhpcy50cnlTdGFja19baV0uY2F0Y2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoID0gdGhpcy50cnlTdGFja19baV0uY2F0Y2g7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbmFsbHlGYWxsVGhyb3VnaCA9PT0gbnVsbClcbiAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2ggPSBSRVRIUk9XX1NUQVRFO1xuICAgICAgICB0aGlzLnRyeVN0YWNrXy5wdXNoKHtcbiAgICAgICAgICBmaW5hbGx5OiBmaW5hbGx5U3RhdGUsXG4gICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoOiBmaW5hbGx5RmFsbFRocm91Z2hcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoY2F0Y2hTdGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLnRyeVN0YWNrXy5wdXNoKHtjYXRjaDogY2F0Y2hTdGF0ZX0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgcG9wVHJ5OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMudHJ5U3RhY2tfLnBvcCgpO1xuICAgIH0sXG4gICAgZ2V0IHNlbnQoKSB7XG4gICAgICB0aGlzLm1heWJlVGhyb3coKTtcbiAgICAgIHJldHVybiB0aGlzLnNlbnRfO1xuICAgIH0sXG4gICAgc2V0IHNlbnQodikge1xuICAgICAgdGhpcy5zZW50XyA9IHY7XG4gICAgfSxcbiAgICBnZXQgc2VudElnbm9yZVRocm93KCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2VudF87XG4gICAgfSxcbiAgICBtYXliZVRocm93OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmFjdGlvbiA9PT0gJ3Rocm93Jykge1xuICAgICAgICB0aGlzLmFjdGlvbiA9ICduZXh0JztcbiAgICAgICAgdGhyb3cgdGhpcy5zZW50XztcbiAgICAgIH1cbiAgICB9LFxuICAgIGVuZDogZnVuY3Rpb24oKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICAgICAgY2FzZSBFTkRfU1RBVEU6XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIGNhc2UgUkVUSFJPV19TVEFURTpcbiAgICAgICAgICB0aHJvdyB0aGlzLnN0b3JlZEV4Y2VwdGlvbjtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBnZXRJbnRlcm5hbEVycm9yKHRoaXMuc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gZ2V0TmV4dE9yVGhyb3coY3R4LCBtb3ZlTmV4dCwgYWN0aW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgIHN3aXRjaCAoY3R4LkdTdGF0ZSkge1xuICAgICAgICBjYXNlIFNUX0VYRUNVVElORzpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKFwiXFxcIlwiICsgYWN0aW9uICsgXCJcXFwiIG9uIGV4ZWN1dGluZyBnZW5lcmF0b3JcIikpO1xuICAgICAgICBjYXNlIFNUX0NMT1NFRDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKFwiXFxcIlwiICsgYWN0aW9uICsgXCJcXFwiIG9uIGNsb3NlZCBnZW5lcmF0b3JcIikpO1xuICAgICAgICBjYXNlIFNUX05FV0JPUk46XG4gICAgICAgICAgaWYgKGFjdGlvbiA9PT0gJ3Rocm93Jykge1xuICAgICAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0NMT1NFRDtcbiAgICAgICAgICAgIHRocm93IHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh4ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aHJvdyAkVHlwZUVycm9yKCdTZW50IHZhbHVlIHRvIG5ld2Jvcm4gZ2VuZXJhdG9yJyk7XG4gICAgICAgIGNhc2UgU1RfU1VTUEVOREVEOlxuICAgICAgICAgIGN0eC5HU3RhdGUgPSBTVF9FWEVDVVRJTkc7XG4gICAgICAgICAgY3R4LmFjdGlvbiA9IGFjdGlvbjtcbiAgICAgICAgICBjdHguc2VudCA9IHg7XG4gICAgICAgICAgdmFyIHZhbHVlID0gbW92ZU5leHQoY3R4KTtcbiAgICAgICAgICB2YXIgZG9uZSA9IHZhbHVlID09PSBjdHg7XG4gICAgICAgICAgaWYgKGRvbmUpXG4gICAgICAgICAgICB2YWx1ZSA9IGN0eC5yZXR1cm5WYWx1ZTtcbiAgICAgICAgICBjdHguR1N0YXRlID0gZG9uZSA/IFNUX0NMT1NFRCA6IFNUX1NVU1BFTkRFRDtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZG9uZTogZG9uZVxuICAgICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBnZW5lcmF0b3JXcmFwKGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICB2YXIgbW92ZU5leHQgPSBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKTtcbiAgICB2YXIgY3R4ID0gbmV3IEdlbmVyYXRvckNvbnRleHQoKTtcbiAgICByZXR1cm4gYWRkSXRlcmF0b3Ioe1xuICAgICAgbmV4dDogZ2V0TmV4dE9yVGhyb3coY3R4LCBtb3ZlTmV4dCwgJ25leHQnKSxcbiAgICAgIHRocm93OiBnZXROZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCAndGhyb3cnKVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIEFzeW5jRnVuY3Rpb25Db250ZXh0KCkge1xuICAgIEdlbmVyYXRvckNvbnRleHQuY2FsbCh0aGlzKTtcbiAgICB0aGlzLmVyciA9IHVuZGVmaW5lZDtcbiAgICB2YXIgY3R4ID0gdGhpcztcbiAgICBjdHgucmVzdWx0ID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBjdHgucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICBjdHgucmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuICB9XG4gIEFzeW5jRnVuY3Rpb25Db250ZXh0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR2VuZXJhdG9yQ29udGV4dC5wcm90b3R5cGUpO1xuICBBc3luY0Z1bmN0aW9uQ29udGV4dC5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgICBjYXNlIEVORF9TVEFURTpcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY2FzZSBSRVRIUk9XX1NUQVRFOlxuICAgICAgICB0aGlzLnJlamVjdCh0aGlzLnN0b3JlZEV4Y2VwdGlvbik7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnJlamVjdChnZXRJbnRlcm5hbEVycm9yKHRoaXMuc3RhdGUpKTtcbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGFzeW5jV3JhcChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgdmFyIG1vdmVOZXh0ID0gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZik7XG4gICAgdmFyIGN0eCA9IG5ldyBBc3luY0Z1bmN0aW9uQ29udGV4dCgpO1xuICAgIGN0eC5jcmVhdGVDYWxsYmFjayA9IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgY3R4LnN0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgIGN0eC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBtb3ZlTmV4dChjdHgpO1xuICAgICAgfTtcbiAgICB9O1xuICAgIGN0eC5jcmVhdGVFcnJiYWNrID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY3R4LnN0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgIGN0eC5lcnIgPSBlcnI7XG4gICAgICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgICB9O1xuICAgIH07XG4gICAgbW92ZU5leHQoY3R4KTtcbiAgICByZXR1cm4gY3R4LnJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGN0eCkge1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gaW5uZXJGdW5jdGlvbi5jYWxsKHNlbGYsIGN0eCk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgY3R4LnN0b3JlZEV4Y2VwdGlvbiA9IGV4O1xuICAgICAgICAgIHZhciBsYXN0ID0gY3R4LnRyeVN0YWNrX1tjdHgudHJ5U3RhY2tfLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIGlmICghbGFzdCkge1xuICAgICAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0NMT1NFRDtcbiAgICAgICAgICAgIGN0eC5zdGF0ZSA9IEVORF9TVEFURTtcbiAgICAgICAgICAgIHRocm93IGV4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdHguc3RhdGUgPSBsYXN0LmNhdGNoICE9PSB1bmRlZmluZWQgPyBsYXN0LmNhdGNoIDogbGFzdC5maW5hbGx5O1xuICAgICAgICAgIGlmIChsYXN0LmZpbmFsbHlGYWxsVGhyb3VnaCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgY3R4LmZpbmFsbHlGYWxsVGhyb3VnaCA9IGxhc3QuZmluYWxseUZhbGxUaHJvdWdoO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBzZXR1cEdsb2JhbHMoZ2xvYmFsKSB7XG4gICAgZ2xvYmFsLlN5bWJvbCA9IFN5bWJvbDtcbiAgICBwb2x5ZmlsbE9iamVjdChnbG9iYWwuT2JqZWN0KTtcbiAgfVxuICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgZ2xvYmFsLiR0cmFjZXVyUnVudGltZSA9IHtcbiAgICBhc3luY1dyYXA6IGFzeW5jV3JhcCxcbiAgICBjcmVhdGVDbGFzczogY3JlYXRlQ2xhc3MsXG4gICAgZGVmYXVsdFN1cGVyQ2FsbDogZGVmYXVsdFN1cGVyQ2FsbCxcbiAgICBleHBvcnRTdGFyOiBleHBvcnRTdGFyLFxuICAgIGdlbmVyYXRvcldyYXA6IGdlbmVyYXRvcldyYXAsXG4gICAgc2V0UHJvcGVydHk6IHNldFByb3BlcnR5LFxuICAgIHNldHVwR2xvYmFsczogc2V0dXBHbG9iYWxzLFxuICAgIHNwcmVhZDogc3ByZWFkLFxuICAgIHN1cGVyQ2FsbDogc3VwZXJDYWxsLFxuICAgIHN1cGVyR2V0OiBzdXBlckdldCxcbiAgICBzdXBlclNldDogc3VwZXJTZXQsXG4gICAgdG9PYmplY3Q6IHRvT2JqZWN0LFxuICAgIHRvUHJvcGVydHk6IHRvUHJvcGVydHksXG4gICAgdHlwZTogdHlwZXMsXG4gICAgdHlwZW9mOiB0eXBlT2ZcbiAgfTtcbn0pKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdGhpcyk7XG4oZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGJ1aWxkRnJvbUVuY29kZWRQYXJ0cyhvcHRfc2NoZW1lLCBvcHRfdXNlckluZm8sIG9wdF9kb21haW4sIG9wdF9wb3J0LCBvcHRfcGF0aCwgb3B0X3F1ZXJ5RGF0YSwgb3B0X2ZyYWdtZW50KSB7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIGlmIChvcHRfc2NoZW1lKSB7XG4gICAgICBvdXQucHVzaChvcHRfc2NoZW1lLCAnOicpO1xuICAgIH1cbiAgICBpZiAob3B0X2RvbWFpbikge1xuICAgICAgb3V0LnB1c2goJy8vJyk7XG4gICAgICBpZiAob3B0X3VzZXJJbmZvKSB7XG4gICAgICAgIG91dC5wdXNoKG9wdF91c2VySW5mbywgJ0AnKTtcbiAgICAgIH1cbiAgICAgIG91dC5wdXNoKG9wdF9kb21haW4pO1xuICAgICAgaWYgKG9wdF9wb3J0KSB7XG4gICAgICAgIG91dC5wdXNoKCc6Jywgb3B0X3BvcnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob3B0X3BhdGgpIHtcbiAgICAgIG91dC5wdXNoKG9wdF9wYXRoKTtcbiAgICB9XG4gICAgaWYgKG9wdF9xdWVyeURhdGEpIHtcbiAgICAgIG91dC5wdXNoKCc/Jywgb3B0X3F1ZXJ5RGF0YSk7XG4gICAgfVxuICAgIGlmIChvcHRfZnJhZ21lbnQpIHtcbiAgICAgIG91dC5wdXNoKCcjJywgb3B0X2ZyYWdtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIG91dC5qb2luKCcnKTtcbiAgfVxuICA7XG4gIHZhciBzcGxpdFJlID0gbmV3IFJlZ0V4cCgnXicgKyAnKD86JyArICcoW146Lz8jLl0rKScgKyAnOik/JyArICcoPzovLycgKyAnKD86KFteLz8jXSopQCk/JyArICcoW1xcXFx3XFxcXGRcXFxcLVxcXFx1MDEwMC1cXFxcdWZmZmYuJV0qKScgKyAnKD86OihbMC05XSspKT8nICsgJyk/JyArICcoW14/I10rKT8nICsgJyg/OlxcXFw/KFteI10qKSk/JyArICcoPzojKC4qKSk/JyArICckJyk7XG4gIHZhciBDb21wb25lbnRJbmRleCA9IHtcbiAgICBTQ0hFTUU6IDEsXG4gICAgVVNFUl9JTkZPOiAyLFxuICAgIERPTUFJTjogMyxcbiAgICBQT1JUOiA0LFxuICAgIFBBVEg6IDUsXG4gICAgUVVFUllfREFUQTogNixcbiAgICBGUkFHTUVOVDogN1xuICB9O1xuICBmdW5jdGlvbiBzcGxpdCh1cmkpIHtcbiAgICByZXR1cm4gKHVyaS5tYXRjaChzcGxpdFJlKSk7XG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlRG90U2VnbWVudHMocGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnLycpXG4gICAgICByZXR1cm4gJy8nO1xuICAgIHZhciBsZWFkaW5nU2xhc2ggPSBwYXRoWzBdID09PSAnLycgPyAnLycgOiAnJztcbiAgICB2YXIgdHJhaWxpbmdTbGFzaCA9IHBhdGguc2xpY2UoLTEpID09PSAnLycgPyAnLycgOiAnJztcbiAgICB2YXIgc2VnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIHZhciB1cCA9IDA7XG4gICAgZm9yICh2YXIgcG9zID0gMDsgcG9zIDwgc2VnbWVudHMubGVuZ3RoOyBwb3MrKykge1xuICAgICAgdmFyIHNlZ21lbnQgPSBzZWdtZW50c1twb3NdO1xuICAgICAgc3dpdGNoIChzZWdtZW50KSB7XG4gICAgICAgIGNhc2UgJyc6XG4gICAgICAgIGNhc2UgJy4nOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcuLic6XG4gICAgICAgICAgaWYgKG91dC5sZW5ndGgpXG4gICAgICAgICAgICBvdXQucG9wKCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdXArKztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBvdXQucHVzaChzZWdtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFsZWFkaW5nU2xhc2gpIHtcbiAgICAgIHdoaWxlICh1cC0tID4gMCkge1xuICAgICAgICBvdXQudW5zaGlmdCgnLi4nKTtcbiAgICAgIH1cbiAgICAgIGlmIChvdXQubGVuZ3RoID09PSAwKVxuICAgICAgICBvdXQucHVzaCgnLicpO1xuICAgIH1cbiAgICByZXR1cm4gbGVhZGluZ1NsYXNoICsgb3V0LmpvaW4oJy8nKSArIHRyYWlsaW5nU2xhc2g7XG4gIH1cbiAgZnVuY3Rpb24gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpIHtcbiAgICB2YXIgcGF0aCA9IHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdIHx8ICcnO1xuICAgIHBhdGggPSByZW1vdmVEb3RTZWdtZW50cyhwYXRoKTtcbiAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSA9IHBhdGg7XG4gICAgcmV0dXJuIGJ1aWxkRnJvbUVuY29kZWRQYXJ0cyhwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5VU0VSX0lORk9dLCBwYXJ0c1tDb21wb25lbnRJbmRleC5ET01BSU5dLCBwYXJ0c1tDb21wb25lbnRJbmRleC5QT1JUXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlFVRVJZX0RBVEFdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5GUkFHTUVOVF0pO1xuICB9XG4gIGZ1bmN0aW9uIGNhbm9uaWNhbGl6ZVVybCh1cmwpIHtcbiAgICB2YXIgcGFydHMgPSBzcGxpdCh1cmwpO1xuICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gIH1cbiAgZnVuY3Rpb24gcmVzb2x2ZVVybChiYXNlLCB1cmwpIHtcbiAgICB2YXIgcGFydHMgPSBzcGxpdCh1cmwpO1xuICAgIHZhciBiYXNlUGFydHMgPSBzcGxpdChiYXNlKTtcbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSkge1xuICAgICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSA9IGJhc2VQYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gQ29tcG9uZW50SW5kZXguU0NIRU1FOyBpIDw9IENvbXBvbmVudEluZGV4LlBPUlQ7IGkrKykge1xuICAgICAgaWYgKCFwYXJ0c1tpXSkge1xuICAgICAgICBwYXJ0c1tpXSA9IGJhc2VQYXJ0c1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdWzBdID09ICcvJykge1xuICAgICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgICB9XG4gICAgdmFyIHBhdGggPSBiYXNlUGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF07XG4gICAgdmFyIGluZGV4ID0gcGF0aC5sYXN0SW5kZXhPZignLycpO1xuICAgIHBhdGggPSBwYXRoLnNsaWNlKDAsIGluZGV4ICsgMSkgKyBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXTtcbiAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSA9IHBhdGg7XG4gICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgfVxuICBmdW5jdGlvbiBpc0Fic29sdXRlKG5hbWUpIHtcbiAgICBpZiAoIW5hbWUpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKG5hbWVbMF0gPT09ICcvJylcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KG5hbWUpO1xuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gICR0cmFjZXVyUnVudGltZS5jYW5vbmljYWxpemVVcmwgPSBjYW5vbmljYWxpemVVcmw7XG4gICR0cmFjZXVyUnVudGltZS5pc0Fic29sdXRlID0gaXNBYnNvbHV0ZTtcbiAgJHRyYWNldXJSdW50aW1lLnJlbW92ZURvdFNlZ21lbnRzID0gcmVtb3ZlRG90U2VnbWVudHM7XG4gICR0cmFjZXVyUnVudGltZS5yZXNvbHZlVXJsID0gcmVzb2x2ZVVybDtcbn0pKCk7XG4oZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgdmFyICRfXzIgPSAkdHJhY2V1clJ1bnRpbWUsXG4gICAgICBjYW5vbmljYWxpemVVcmwgPSAkX18yLmNhbm9uaWNhbGl6ZVVybCxcbiAgICAgIHJlc29sdmVVcmwgPSAkX18yLnJlc29sdmVVcmwsXG4gICAgICBpc0Fic29sdXRlID0gJF9fMi5pc0Fic29sdXRlO1xuICB2YXIgbW9kdWxlSW5zdGFudGlhdG9ycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHZhciBiYXNlVVJMO1xuICBpZiAoZ2xvYmFsLmxvY2F0aW9uICYmIGdsb2JhbC5sb2NhdGlvbi5ocmVmKVxuICAgIGJhc2VVUkwgPSByZXNvbHZlVXJsKGdsb2JhbC5sb2NhdGlvbi5ocmVmLCAnLi8nKTtcbiAgZWxzZVxuICAgIGJhc2VVUkwgPSAnJztcbiAgdmFyIFVuY29hdGVkTW9kdWxlRW50cnkgPSBmdW5jdGlvbiBVbmNvYXRlZE1vZHVsZUVudHJ5KHVybCwgdW5jb2F0ZWRNb2R1bGUpIHtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgICB0aGlzLnZhbHVlXyA9IHVuY29hdGVkTW9kdWxlO1xuICB9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShVbmNvYXRlZE1vZHVsZUVudHJ5LCB7fSwge30pO1xuICB2YXIgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IgPSBmdW5jdGlvbiBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcih1cmwsIGZ1bmMpIHtcbiAgICAkdHJhY2V1clJ1bnRpbWUuc3VwZXJDYWxsKHRoaXMsICRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvci5wcm90b3R5cGUsIFwiY29uc3RydWN0b3JcIiwgW3VybCwgbnVsbF0pO1xuICAgIHRoaXMuZnVuYyA9IGZ1bmM7XG4gIH07XG4gIHZhciAkVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IgPSBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcjtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IsIHtnZXRVbmNvYXRlZE1vZHVsZTogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy52YWx1ZV8pXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlXztcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlXyA9IHRoaXMuZnVuYy5jYWxsKGdsb2JhbCk7XG4gICAgfX0sIHt9LCBVbmNvYXRlZE1vZHVsZUVudHJ5KTtcbiAgZnVuY3Rpb24gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IobmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgIHJldHVybjtcbiAgICB2YXIgdXJsID0gTW9kdWxlU3RvcmUubm9ybWFsaXplKG5hbWUpO1xuICAgIHJldHVybiBtb2R1bGVJbnN0YW50aWF0b3JzW3VybF07XG4gIH1cbiAgO1xuICB2YXIgbW9kdWxlSW5zdGFuY2VzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGxpdmVNb2R1bGVTZW50aW5lbCA9IHt9O1xuICBmdW5jdGlvbiBNb2R1bGUodW5jb2F0ZWRNb2R1bGUpIHtcbiAgICB2YXIgaXNMaXZlID0gYXJndW1lbnRzWzFdO1xuICAgIHZhciBjb2F0ZWRNb2R1bGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHVuY29hdGVkTW9kdWxlKS5mb3JFYWNoKChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZ2V0dGVyLFxuICAgICAgICAgIHZhbHVlO1xuICAgICAgaWYgKGlzTGl2ZSA9PT0gbGl2ZU1vZHVsZVNlbnRpbmVsKSB7XG4gICAgICAgIHZhciBkZXNjciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodW5jb2F0ZWRNb2R1bGUsIG5hbWUpO1xuICAgICAgICBpZiAoZGVzY3IuZ2V0KVxuICAgICAgICAgIGdldHRlciA9IGRlc2NyLmdldDtcbiAgICAgIH1cbiAgICAgIGlmICghZ2V0dGVyKSB7XG4gICAgICAgIHZhbHVlID0gdW5jb2F0ZWRNb2R1bGVbbmFtZV07XG4gICAgICAgIGdldHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb2F0ZWRNb2R1bGUsIG5hbWUsIHtcbiAgICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgICBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoY29hdGVkTW9kdWxlKTtcbiAgICByZXR1cm4gY29hdGVkTW9kdWxlO1xuICB9XG4gIHZhciBNb2R1bGVTdG9yZSA9IHtcbiAgICBub3JtYWxpemU6IGZ1bmN0aW9uKG5hbWUsIHJlZmVyZXJOYW1lLCByZWZlcmVyQWRkcmVzcykge1xuICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSBcInN0cmluZ1wiKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibW9kdWxlIG5hbWUgbXVzdCBiZSBhIHN0cmluZywgbm90IFwiICsgdHlwZW9mIG5hbWUpO1xuICAgICAgaWYgKGlzQWJzb2x1dGUobmFtZSkpXG4gICAgICAgIHJldHVybiBjYW5vbmljYWxpemVVcmwobmFtZSk7XG4gICAgICBpZiAoL1teXFwuXVxcL1xcLlxcLlxcLy8udGVzdChuYW1lKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21vZHVsZSBuYW1lIGVtYmVkcyAvLi4vOiAnICsgbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAobmFtZVswXSA9PT0gJy4nICYmIHJlZmVyZXJOYW1lKVxuICAgICAgICByZXR1cm4gcmVzb2x2ZVVybChyZWZlcmVyTmFtZSwgbmFtZSk7XG4gICAgICByZXR1cm4gY2Fub25pY2FsaXplVXJsKG5hbWUpO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihub3JtYWxpemVkTmFtZSkge1xuICAgICAgdmFyIG0gPSBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSk7XG4gICAgICBpZiAoIW0pXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB2YXIgbW9kdWxlSW5zdGFuY2UgPSBtb2R1bGVJbnN0YW5jZXNbbS51cmxdO1xuICAgICAgaWYgKG1vZHVsZUluc3RhbmNlKVxuICAgICAgICByZXR1cm4gbW9kdWxlSW5zdGFuY2U7XG4gICAgICBtb2R1bGVJbnN0YW5jZSA9IE1vZHVsZShtLmdldFVuY29hdGVkTW9kdWxlKCksIGxpdmVNb2R1bGVTZW50aW5lbCk7XG4gICAgICByZXR1cm4gbW9kdWxlSW5zdGFuY2VzW20udXJsXSA9IG1vZHVsZUluc3RhbmNlO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihub3JtYWxpemVkTmFtZSwgbW9kdWxlKSB7XG4gICAgICBub3JtYWxpemVkTmFtZSA9IFN0cmluZyhub3JtYWxpemVkTmFtZSk7XG4gICAgICBtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSA9IG5ldyBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSwgKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbW9kdWxlO1xuICAgICAgfSkpO1xuICAgICAgbW9kdWxlSW5zdGFuY2VzW25vcm1hbGl6ZWROYW1lXSA9IG1vZHVsZTtcbiAgICB9LFxuICAgIGdldCBiYXNlVVJMKCkge1xuICAgICAgcmV0dXJuIGJhc2VVUkw7XG4gICAgfSxcbiAgICBzZXQgYmFzZVVSTCh2KSB7XG4gICAgICBiYXNlVVJMID0gU3RyaW5nKHYpO1xuICAgIH0sXG4gICAgcmVnaXN0ZXJNb2R1bGU6IGZ1bmN0aW9uKG5hbWUsIGZ1bmMpIHtcbiAgICAgIHZhciBub3JtYWxpemVkTmFtZSA9IE1vZHVsZVN0b3JlLm5vcm1hbGl6ZShuYW1lKTtcbiAgICAgIGlmIChtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdkdXBsaWNhdGUgbW9kdWxlIG5hbWVkICcgKyBub3JtYWxpemVkTmFtZSk7XG4gICAgICBtb2R1bGVJbnN0YW50aWF0b3JzW25vcm1hbGl6ZWROYW1lXSA9IG5ldyBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihub3JtYWxpemVkTmFtZSwgZnVuYyk7XG4gICAgfSxcbiAgICBidW5kbGVTdG9yZTogT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICByZWdpc3RlcjogZnVuY3Rpb24obmFtZSwgZGVwcywgZnVuYykge1xuICAgICAgaWYgKCFkZXBzIHx8ICFkZXBzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTW9kdWxlKG5hbWUsIGZ1bmMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5idW5kbGVTdG9yZVtuYW1lXSA9IHtcbiAgICAgICAgICBkZXBzOiBkZXBzLFxuICAgICAgICAgIGV4ZWN1dGU6IGZ1bmNcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldEFub255bW91c01vZHVsZTogZnVuY3Rpb24oZnVuYykge1xuICAgICAgcmV0dXJuIG5ldyBNb2R1bGUoZnVuYy5jYWxsKGdsb2JhbCksIGxpdmVNb2R1bGVTZW50aW5lbCk7XG4gICAgfSxcbiAgICBnZXRGb3JUZXN0aW5nOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgJF9fMCA9IHRoaXM7XG4gICAgICBpZiAoIXRoaXMudGVzdGluZ1ByZWZpeF8pIHtcbiAgICAgICAgT2JqZWN0LmtleXMobW9kdWxlSW5zdGFuY2VzKS5zb21lKChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICB2YXIgbSA9IC8odHJhY2V1ckBbXlxcL10qXFwvKS8uZXhlYyhrZXkpO1xuICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAkX18wLnRlc3RpbmdQcmVmaXhfID0gbVsxXTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0KHRoaXMudGVzdGluZ1ByZWZpeF8gKyBuYW1lKTtcbiAgICB9XG4gIH07XG4gIE1vZHVsZVN0b3JlLnNldCgnQHRyYWNldXIvc3JjL3J1bnRpbWUvTW9kdWxlU3RvcmUnLCBuZXcgTW9kdWxlKHtNb2R1bGVTdG9yZTogTW9kdWxlU3RvcmV9KSk7XG4gIHZhciBzZXR1cEdsb2JhbHMgPSAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzO1xuICAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzID0gZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gIH07XG4gICR0cmFjZXVyUnVudGltZS5Nb2R1bGVTdG9yZSA9IE1vZHVsZVN0b3JlO1xuICBnbG9iYWwuU3lzdGVtID0ge1xuICAgIHJlZ2lzdGVyOiBNb2R1bGVTdG9yZS5yZWdpc3Rlci5iaW5kKE1vZHVsZVN0b3JlKSxcbiAgICBnZXQ6IE1vZHVsZVN0b3JlLmdldCxcbiAgICBzZXQ6IE1vZHVsZVN0b3JlLnNldCxcbiAgICBub3JtYWxpemU6IE1vZHVsZVN0b3JlLm5vcm1hbGl6ZVxuICB9O1xuICAkdHJhY2V1clJ1bnRpbWUuZ2V0TW9kdWxlSW1wbCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgaW5zdGFudGlhdG9yID0gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IobmFtZSk7XG4gICAgcmV0dXJuIGluc3RhbnRpYXRvciAmJiBpbnN0YW50aWF0b3IuZ2V0VW5jb2F0ZWRNb2R1bGUoKTtcbiAgfTtcbn0pKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdGhpcyk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlsc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlsc1wiO1xuICB2YXIgdG9PYmplY3QgPSAkdHJhY2V1clJ1bnRpbWUudG9PYmplY3Q7XG4gIGZ1bmN0aW9uIHRvVWludDMyKHgpIHtcbiAgICByZXR1cm4geCB8IDA7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgdG9PYmplY3QoKSB7XG4gICAgICByZXR1cm4gdG9PYmplY3Q7XG4gICAgfSxcbiAgICBnZXQgdG9VaW50MzIoKSB7XG4gICAgICByZXR1cm4gdG9VaW50MzI7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciAkX180O1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yXCI7XG4gIHZhciAkX181ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCIpLFxuICAgICAgdG9PYmplY3QgPSAkX181LnRvT2JqZWN0LFxuICAgICAgdG9VaW50MzIgPSAkX181LnRvVWludDMyO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9LRVlTID0gMTtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTID0gMjtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUyA9IDM7XG4gIHZhciBBcnJheUl0ZXJhdG9yID0gZnVuY3Rpb24gQXJyYXlJdGVyYXRvcigpIHt9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShBcnJheUl0ZXJhdG9yLCAoJF9fNCA9IHt9LCBPYmplY3QuZGVmaW5lUHJvcGVydHkoJF9fNCwgXCJuZXh0XCIsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0b09iamVjdCh0aGlzKTtcbiAgICAgIHZhciBhcnJheSA9IGl0ZXJhdG9yLml0ZXJhdG9yT2JqZWN0XztcbiAgICAgIGlmICghYXJyYXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IGlzIG5vdCBhbiBBcnJheUl0ZXJhdG9yJyk7XG4gICAgICB9XG4gICAgICB2YXIgaW5kZXggPSBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XztcbiAgICAgIHZhciBpdGVtS2luZCA9IGl0ZXJhdG9yLmFycmF5SXRlcmF0aW9uS2luZF87XG4gICAgICB2YXIgbGVuZ3RoID0gdG9VaW50MzIoYXJyYXkubGVuZ3RoKTtcbiAgICAgIGlmIChpbmRleCA+PSBsZW5ndGgpIHtcbiAgICAgICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSBJbmZpbml0eTtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IGluZGV4ICsgMTtcbiAgICAgIGlmIChpdGVtS2luZCA9PSBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUylcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KGFycmF5W2luZGV4XSwgZmFsc2UpO1xuICAgICAgaWYgKGl0ZW1LaW5kID09IEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUylcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KFtpbmRleCwgYXJyYXlbaW5kZXhdXSwgZmFsc2UpO1xuICAgICAgcmV0dXJuIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KGluZGV4LCBmYWxzZSk7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KCRfXzQsIFN5bWJvbC5pdGVyYXRvciwge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksICRfXzQpLCB7fSk7XG4gIGZ1bmN0aW9uIGNyZWF0ZUFycmF5SXRlcmF0b3IoYXJyYXksIGtpbmQpIHtcbiAgICB2YXIgb2JqZWN0ID0gdG9PYmplY3QoYXJyYXkpO1xuICAgIHZhciBpdGVyYXRvciA9IG5ldyBBcnJheUl0ZXJhdG9yO1xuICAgIGl0ZXJhdG9yLml0ZXJhdG9yT2JqZWN0XyA9IG9iamVjdDtcbiAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IDA7XG4gICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRpb25LaW5kXyA9IGtpbmQ7XG4gICAgcmV0dXJuIGl0ZXJhdG9yO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZUl0ZXJhdG9yUmVzdWx0T2JqZWN0KHZhbHVlLCBkb25lKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGRvbmU6IGRvbmVcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGVudHJpZXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTKTtcbiAgfVxuICBmdW5jdGlvbiBrZXlzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfS0VZUyk7XG4gIH1cbiAgZnVuY3Rpb24gdmFsdWVzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCBlbnRyaWVzKCkge1xuICAgICAgcmV0dXJuIGVudHJpZXM7XG4gICAgfSxcbiAgICBnZXQga2V5cygpIHtcbiAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG4gICAgZ2V0IHZhbHVlcygpIHtcbiAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwXCI7XG4gIHZhciAkX19kZWZhdWx0ID0gZnVuY3Rpb24gYXNhcChjYWxsYmFjaywgYXJnKSB7XG4gICAgdmFyIGxlbmd0aCA9IHF1ZXVlLnB1c2goW2NhbGxiYWNrLCBhcmddKTtcbiAgICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgICBzY2hlZHVsZUZsdXNoKCk7XG4gICAgfVxuICB9O1xuICB2YXIgYnJvd3Nlckdsb2JhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgPyB3aW5kb3cgOiB7fTtcbiAgdmFyIEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gYnJvd3Nlckdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGJyb3dzZXJHbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbiAgZnVuY3Rpb24gdXNlTmV4dFRpY2soKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiB1c2VNdXRhdGlvbk9ic2VydmVyKCkge1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIoZmx1c2gpO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgIG9ic2VydmVyLm9ic2VydmUobm9kZSwge2NoYXJhY3RlckRhdGE6IHRydWV9KTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBub2RlLmRhdGEgPSAoaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDIpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gdXNlU2V0VGltZW91dCgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZsdXNoLCAxKTtcbiAgICB9O1xuICB9XG4gIHZhciBxdWV1ZSA9IFtdO1xuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdHVwbGUgPSBxdWV1ZVtpXTtcbiAgICAgIHZhciBjYWxsYmFjayA9IHR1cGxlWzBdLFxuICAgICAgICAgIGFyZyA9IHR1cGxlWzFdO1xuICAgICAgY2FsbGJhY2soYXJnKTtcbiAgICB9XG4gICAgcXVldWUgPSBbXTtcbiAgfVxuICB2YXIgc2NoZWR1bGVGbHVzaDtcbiAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiB7fS50b1N0cmluZy5jYWxsKHByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlTmV4dFRpY2soKTtcbiAgfSBlbHNlIGlmIChCcm93c2VyTXV0YXRpb25PYnNlcnZlcikge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VNdXRhdGlvbk9ic2VydmVyKCk7XG4gIH0gZWxzZSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZVNldFRpbWVvdXQoKTtcbiAgfVxuICByZXR1cm4ge2dldCBkZWZhdWx0KCkge1xuICAgICAgcmV0dXJuICRfX2RlZmF1bHQ7XG4gICAgfX07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2VcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiO1xuICB2YXIgYXN5bmMgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwXCIpLmRlZmF1bHQ7XG4gIGZ1bmN0aW9uIGlzUHJvbWlzZSh4KSB7XG4gICAgcmV0dXJuIHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnICYmIHguc3RhdHVzXyAhPT0gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIGNoYWluKHByb21pc2UpIHtcbiAgICB2YXIgb25SZXNvbHZlID0gYXJndW1lbnRzWzFdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1sxXSA6IChmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9KTtcbiAgICB2YXIgb25SZWplY3QgPSBhcmd1bWVudHNbMl0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzJdIDogKGZ1bmN0aW9uKGUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfSk7XG4gICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQocHJvbWlzZS5jb25zdHJ1Y3Rvcik7XG4gICAgc3dpdGNoIChwcm9taXNlLnN0YXR1c18pIHtcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICB0aHJvdyBUeXBlRXJyb3I7XG4gICAgICBjYXNlICdwZW5kaW5nJzpcbiAgICAgICAgcHJvbWlzZS5vblJlc29sdmVfLnB1c2goW2RlZmVycmVkLCBvblJlc29sdmVdKTtcbiAgICAgICAgcHJvbWlzZS5vblJlamVjdF8ucHVzaChbZGVmZXJyZWQsIG9uUmVqZWN0XSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVzb2x2ZWQnOlxuICAgICAgICBwcm9taXNlUmVhY3QoZGVmZXJyZWQsIG9uUmVzb2x2ZSwgcHJvbWlzZS52YWx1ZV8pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlamVjdGVkJzpcbiAgICAgICAgcHJvbWlzZVJlYWN0KGRlZmVycmVkLCBvblJlamVjdCwgcHJvbWlzZS52YWx1ZV8pO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0RGVmZXJyZWQoQykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICByZXN1bHQucHJvbWlzZSA9IG5ldyBDKChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlc3VsdC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHJlc3VsdC5yZWplY3QgPSByZWplY3Q7XG4gICAgfSkpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdmFyIFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKHJlc29sdmVyKSB7XG4gICAgdmFyICRfXzYgPSB0aGlzO1xuICAgIHRoaXMuc3RhdHVzXyA9ICdwZW5kaW5nJztcbiAgICB0aGlzLm9uUmVzb2x2ZV8gPSBbXTtcbiAgICB0aGlzLm9uUmVqZWN0XyA9IFtdO1xuICAgIHJlc29sdmVyKChmdW5jdGlvbih4KSB7XG4gICAgICBwcm9taXNlUmVzb2x2ZSgkX182LCB4KTtcbiAgICB9KSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgIHByb21pc2VSZWplY3QoJF9fNiwgcik7XG4gICAgfSkpO1xuICB9O1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShQcm9taXNlLCB7XG4gICAgY2F0Y2g6IGZ1bmN0aW9uKG9uUmVqZWN0KSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3QpO1xuICAgIH0sXG4gICAgdGhlbjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb25SZXNvbHZlID0gYXJndW1lbnRzWzBdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1swXSA6IChmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfSk7XG4gICAgICB2YXIgb25SZWplY3QgPSBhcmd1bWVudHNbMV07XG4gICAgICB2YXIgJF9fNiA9IHRoaXM7XG4gICAgICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLmNvbnN0cnVjdG9yO1xuICAgICAgcmV0dXJuIGNoYWluKHRoaXMsIChmdW5jdGlvbih4KSB7XG4gICAgICAgIHggPSBwcm9taXNlQ29lcmNlKGNvbnN0cnVjdG9yLCB4KTtcbiAgICAgICAgcmV0dXJuIHggPT09ICRfXzYgPyBvblJlamVjdChuZXcgVHlwZUVycm9yKSA6IGlzUHJvbWlzZSh4KSA/IHgudGhlbihvblJlc29sdmUsIG9uUmVqZWN0KSA6IG9uUmVzb2x2ZSh4KTtcbiAgICAgIH0pLCBvblJlamVjdCk7XG4gICAgfVxuICB9LCB7XG4gICAgcmVzb2x2ZTogZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzKChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVzb2x2ZSh4KTtcbiAgICAgIH0pKTtcbiAgICB9LFxuICAgIHJlamVjdDogZnVuY3Rpb24ocikge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzKChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmVqZWN0KHIpO1xuICAgICAgfSkpO1xuICAgIH0sXG4gICAgY2FzdDogZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKHggaW5zdGFuY2VvZiB0aGlzKVxuICAgICAgICByZXR1cm4geDtcbiAgICAgIGlmIChpc1Byb21pc2UoeCkpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgICBjaGFpbih4LCByZXN1bHQucmVzb2x2ZSwgcmVzdWx0LnJlamVjdCk7XG4gICAgICAgIHJldHVybiByZXN1bHQucHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnJlc29sdmUoeCk7XG4gICAgfSxcbiAgICBhbGw6IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgdmFyIHJlc29sdXRpb25zID0gW107XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICsrY291bnQ7XG4gICAgICAgICAgdGhpcy5jYXN0KHZhbHVlc1tpXSkudGhlbihmdW5jdGlvbihpLCB4KSB7XG4gICAgICAgICAgICByZXNvbHV0aW9uc1tpXSA9IHg7XG4gICAgICAgICAgICBpZiAoLS1jb3VudCA9PT0gMClcbiAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNvbHV0aW9ucyk7XG4gICAgICAgICAgfS5iaW5kKHVuZGVmaW5lZCwgaSksIChmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICBpZiAoY291bnQgPiAwKVxuICAgICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qocik7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb3VudCA9PT0gMClcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc29sdXRpb25zKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfSxcbiAgICByYWNlOiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLmNhc3QodmFsdWVzW2ldKS50aGVuKChmdW5jdGlvbih4KSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHgpO1xuICAgICAgICAgIH0pLCAoZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHIpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBwcm9taXNlUmVzb2x2ZShwcm9taXNlLCB4KSB7XG4gICAgcHJvbWlzZURvbmUocHJvbWlzZSwgJ3Jlc29sdmVkJywgeCwgcHJvbWlzZS5vblJlc29sdmVfKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlUmVqZWN0KHByb21pc2UsIHIpIHtcbiAgICBwcm9taXNlRG9uZShwcm9taXNlLCAncmVqZWN0ZWQnLCByLCBwcm9taXNlLm9uUmVqZWN0Xyk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZURvbmUocHJvbWlzZSwgc3RhdHVzLCB2YWx1ZSwgcmVhY3Rpb25zKSB7XG4gICAgaWYgKHByb21pc2Uuc3RhdHVzXyAhPT0gJ3BlbmRpbmcnKVxuICAgICAgcmV0dXJuO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVhY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwcm9taXNlUmVhY3QocmVhY3Rpb25zW2ldWzBdLCByZWFjdGlvbnNbaV1bMV0sIHZhbHVlKTtcbiAgICB9XG4gICAgcHJvbWlzZS5zdGF0dXNfID0gc3RhdHVzO1xuICAgIHByb21pc2UudmFsdWVfID0gdmFsdWU7XG4gICAgcHJvbWlzZS5vblJlc29sdmVfID0gcHJvbWlzZS5vblJlamVjdF8gPSB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZVJlYWN0KGRlZmVycmVkLCBoYW5kbGVyLCB4KSB7XG4gICAgYXN5bmMoKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHkgPSBoYW5kbGVyKHgpO1xuICAgICAgICBpZiAoeSA9PT0gZGVmZXJyZWQucHJvbWlzZSlcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgICAgICBlbHNlIGlmIChpc1Byb21pc2UoeSkpXG4gICAgICAgICAgY2hhaW4oeSwgZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoeSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cbiAgdmFyIHRoZW5hYmxlU3ltYm9sID0gJ0BAdGhlbmFibGUnO1xuICBmdW5jdGlvbiBwcm9taXNlQ29lcmNlKGNvbnN0cnVjdG9yLCB4KSB7XG4gICAgaWYgKGlzUHJvbWlzZSh4KSkge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSBlbHNlIGlmICh4ICYmIHR5cGVvZiB4LnRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBwID0geFt0aGVuYWJsZVN5bWJvbF07XG4gICAgICBpZiAocCkge1xuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKGNvbnN0cnVjdG9yKTtcbiAgICAgICAgeFt0aGVuYWJsZVN5bWJvbF0gPSBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHgudGhlbihkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtnZXQgUHJvbWlzZSgpIHtcbiAgICAgIHJldHVybiBQcm9taXNlO1xuICAgIH19O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCI7XG4gIHZhciAkdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICB2YXIgJGluZGV4T2YgPSBTdHJpbmcucHJvdG90eXBlLmluZGV4T2Y7XG4gIHZhciAkbGFzdEluZGV4T2YgPSBTdHJpbmcucHJvdG90eXBlLmxhc3RJbmRleE9mO1xuICBmdW5jdGlvbiBzdGFydHNXaXRoKHNlYXJjaCkge1xuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCB8fCAkdG9TdHJpbmcuY2FsbChzZWFyY2gpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHNlYXJjaFN0cmluZyA9IFN0cmluZyhzZWFyY2gpO1xuICAgIHZhciBzZWFyY2hMZW5ndGggPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgIGlmIChpc05hTihwb3MpKSB7XG4gICAgICBwb3MgPSAwO1xuICAgIH1cbiAgICB2YXIgc3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHJldHVybiAkaW5kZXhPZi5jYWxsKHN0cmluZywgc2VhcmNoU3RyaW5nLCBwb3MpID09IHN0YXJ0O1xuICB9XG4gIGZ1bmN0aW9uIGVuZHNXaXRoKHNlYXJjaCkge1xuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCB8fCAkdG9TdHJpbmcuY2FsbChzZWFyY2gpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHNlYXJjaFN0cmluZyA9IFN0cmluZyhzZWFyY2gpO1xuICAgIHZhciBzZWFyY2hMZW5ndGggPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICAgIHZhciBwb3MgPSBzdHJpbmdMZW5ndGg7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAocG9zaXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgICAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGVuZCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgdmFyIHN0YXJ0ID0gZW5kIC0gc2VhcmNoTGVuZ3RoO1xuICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICRsYXN0SW5kZXhPZi5jYWxsKHN0cmluZywgc2VhcmNoU3RyaW5nLCBzdGFydCkgPT0gc3RhcnQ7XG4gIH1cbiAgZnVuY3Rpb24gY29udGFpbnMoc2VhcmNoKSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHNlYXJjaFN0cmluZyA9IFN0cmluZyhzZWFyY2gpO1xuICAgIHZhciBzZWFyY2hMZW5ndGggPSBzZWFyY2hTdHJpbmcubGVuZ3RoO1xuICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBwb3MgPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgIGlmIChpc05hTihwb3MpKSB7XG4gICAgICBwb3MgPSAwO1xuICAgIH1cbiAgICB2YXIgc3RhcnQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHJldHVybiAkaW5kZXhPZi5jYWxsKHN0cmluZywgc2VhcmNoU3RyaW5nLCBwb3MpICE9IC0xO1xuICB9XG4gIGZ1bmN0aW9uIHJlcGVhdChjb3VudCkge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBuID0gY291bnQgPyBOdW1iZXIoY291bnQpIDogMDtcbiAgICBpZiAoaXNOYU4obikpIHtcbiAgICAgIG4gPSAwO1xuICAgIH1cbiAgICBpZiAobiA8IDAgfHwgbiA9PSBJbmZpbml0eSkge1xuICAgICAgdGhyb3cgUmFuZ2VFcnJvcigpO1xuICAgIH1cbiAgICBpZiAobiA9PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB3aGlsZSAobi0tKSB7XG4gICAgICByZXN1bHQgKz0gc3RyaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGNvZGVQb2ludEF0KHBvc2l0aW9uKSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIHNpemUgPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBpbmRleCA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKGluZGV4KSkge1xuICAgICAgaW5kZXggPSAwO1xuICAgIH1cbiAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHNpemUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHZhciBmaXJzdCA9IHN0cmluZy5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICB2YXIgc2Vjb25kO1xuICAgIGlmIChmaXJzdCA+PSAweEQ4MDAgJiYgZmlyc3QgPD0gMHhEQkZGICYmIHNpemUgPiBpbmRleCArIDEpIHtcbiAgICAgIHNlY29uZCA9IHN0cmluZy5jaGFyQ29kZUF0KGluZGV4ICsgMSk7XG4gICAgICBpZiAoc2Vjb25kID49IDB4REMwMCAmJiBzZWNvbmQgPD0gMHhERkZGKSB7XG4gICAgICAgIHJldHVybiAoZmlyc3QgLSAweEQ4MDApICogMHg0MDAgKyBzZWNvbmQgLSAweERDMDAgKyAweDEwMDAwO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmlyc3Q7XG4gIH1cbiAgZnVuY3Rpb24gcmF3KGNhbGxzaXRlKSB7XG4gICAgdmFyIHJhdyA9IGNhbGxzaXRlLnJhdztcbiAgICB2YXIgbGVuID0gcmF3Lmxlbmd0aCA+Pj4gMDtcbiAgICBpZiAobGVuID09PSAwKVxuICAgICAgcmV0dXJuICcnO1xuICAgIHZhciBzID0gJyc7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBzICs9IHJhd1tpXTtcbiAgICAgIGlmIChpICsgMSA9PT0gbGVuKVxuICAgICAgICByZXR1cm4gcztcbiAgICAgIHMgKz0gYXJndW1lbnRzWysraV07XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGZyb21Db2RlUG9pbnQoKSB7XG4gICAgdmFyIGNvZGVVbml0cyA9IFtdO1xuICAgIHZhciBmbG9vciA9IE1hdGguZmxvb3I7XG4gICAgdmFyIGhpZ2hTdXJyb2dhdGU7XG4gICAgdmFyIGxvd1N1cnJvZ2F0ZTtcbiAgICB2YXIgaW5kZXggPSAtMTtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgdmFyIGNvZGVQb2ludCA9IE51bWJlcihhcmd1bWVudHNbaW5kZXhdKTtcbiAgICAgIGlmICghaXNGaW5pdGUoY29kZVBvaW50KSB8fCBjb2RlUG9pbnQgPCAwIHx8IGNvZGVQb2ludCA+IDB4MTBGRkZGIHx8IGZsb29yKGNvZGVQb2ludCkgIT0gY29kZVBvaW50KSB7XG4gICAgICAgIHRocm93IFJhbmdlRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludDogJyArIGNvZGVQb2ludCk7XG4gICAgICB9XG4gICAgICBpZiAoY29kZVBvaW50IDw9IDB4RkZGRikge1xuICAgICAgICBjb2RlVW5pdHMucHVzaChjb2RlUG9pbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29kZVBvaW50IC09IDB4MTAwMDA7XG4gICAgICAgIGhpZ2hTdXJyb2dhdGUgPSAoY29kZVBvaW50ID4+IDEwKSArIDB4RDgwMDtcbiAgICAgICAgbG93U3Vycm9nYXRlID0gKGNvZGVQb2ludCAlIDB4NDAwKSArIDB4REMwMDtcbiAgICAgICAgY29kZVVuaXRzLnB1c2goaGlnaFN1cnJvZ2F0ZSwgbG93U3Vycm9nYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgY29kZVVuaXRzKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCBzdGFydHNXaXRoKCkge1xuICAgICAgcmV0dXJuIHN0YXJ0c1dpdGg7XG4gICAgfSxcbiAgICBnZXQgZW5kc1dpdGgoKSB7XG4gICAgICByZXR1cm4gZW5kc1dpdGg7XG4gICAgfSxcbiAgICBnZXQgY29udGFpbnMoKSB7XG4gICAgICByZXR1cm4gY29udGFpbnM7XG4gICAgfSxcbiAgICBnZXQgcmVwZWF0KCkge1xuICAgICAgcmV0dXJuIHJlcGVhdDtcbiAgICB9LFxuICAgIGdldCBjb2RlUG9pbnRBdCgpIHtcbiAgICAgIHJldHVybiBjb2RlUG9pbnRBdDtcbiAgICB9LFxuICAgIGdldCByYXcoKSB7XG4gICAgICByZXR1cm4gcmF3O1xuICAgIH0sXG4gICAgZ2V0IGZyb21Db2RlUG9pbnQoKSB7XG4gICAgICByZXR1cm4gZnJvbUNvZGVQb2ludDtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHNcIjtcbiAgdmFyIFByb21pc2UgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiKS5Qcm9taXNlO1xuICB2YXIgJF9fOSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdcIiksXG4gICAgICBjb2RlUG9pbnRBdCA9ICRfXzkuY29kZVBvaW50QXQsXG4gICAgICBjb250YWlucyA9ICRfXzkuY29udGFpbnMsXG4gICAgICBlbmRzV2l0aCA9ICRfXzkuZW5kc1dpdGgsXG4gICAgICBmcm9tQ29kZVBvaW50ID0gJF9fOS5mcm9tQ29kZVBvaW50LFxuICAgICAgcmVwZWF0ID0gJF9fOS5yZXBlYXQsXG4gICAgICByYXcgPSAkX185LnJhdyxcbiAgICAgIHN0YXJ0c1dpdGggPSAkX185LnN0YXJ0c1dpdGg7XG4gIHZhciAkX185ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIiksXG4gICAgICBlbnRyaWVzID0gJF9fOS5lbnRyaWVzLFxuICAgICAga2V5cyA9ICRfXzkua2V5cyxcbiAgICAgIHZhbHVlcyA9ICRfXzkudmFsdWVzO1xuICBmdW5jdGlvbiBtYXliZURlZmluZU1ldGhvZChvYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKCEobmFtZSBpbiBvYmplY3QpKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBtYXliZUFkZEZ1bmN0aW9ucyhvYmplY3QsIGZ1bmN0aW9ucykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZnVuY3Rpb25zLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICB2YXIgbmFtZSA9IGZ1bmN0aW9uc1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IGZ1bmN0aW9uc1tpICsgMV07XG4gICAgICBtYXliZURlZmluZU1ldGhvZChvYmplY3QsIG5hbWUsIHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxQcm9taXNlKGdsb2JhbCkge1xuICAgIGlmICghZ2xvYmFsLlByb21pc2UpXG4gICAgICBnbG9iYWwuUHJvbWlzZSA9IFByb21pc2U7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxTdHJpbmcoU3RyaW5nKSB7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoU3RyaW5nLnByb3RvdHlwZSwgWydjb2RlUG9pbnRBdCcsIGNvZGVQb2ludEF0LCAnY29udGFpbnMnLCBjb250YWlucywgJ2VuZHNXaXRoJywgZW5kc1dpdGgsICdzdGFydHNXaXRoJywgc3RhcnRzV2l0aCwgJ3JlcGVhdCcsIHJlcGVhdF0pO1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKFN0cmluZywgWydmcm9tQ29kZVBvaW50JywgZnJvbUNvZGVQb2ludCwgJ3JhdycsIHJhd10pO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsQXJyYXkoQXJyYXksIFN5bWJvbCkge1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKEFycmF5LnByb3RvdHlwZSwgWydlbnRyaWVzJywgZW50cmllcywgJ2tleXMnLCBrZXlzLCAndmFsdWVzJywgdmFsdWVzXSk7XG4gICAgaWYgKFN5bWJvbCAmJiBTeW1ib2wuaXRlcmF0b3IpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsIFN5bWJvbC5pdGVyYXRvciwge1xuICAgICAgICB2YWx1ZTogdmFsdWVzLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsKGdsb2JhbCkge1xuICAgIHBvbHlmaWxsUHJvbWlzZShnbG9iYWwpO1xuICAgIHBvbHlmaWxsU3RyaW5nKGdsb2JhbC5TdHJpbmcpO1xuICAgIHBvbHlmaWxsQXJyYXkoZ2xvYmFsLkFycmF5LCBnbG9iYWwuU3ltYm9sKTtcbiAgfVxuICBwb2x5ZmlsbCh0aGlzKTtcbiAgdmFyIHNldHVwR2xvYmFscyA9ICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHM7XG4gICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHMgPSBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgICBwb2x5ZmlsbChnbG9iYWwpO1xuICB9O1xuICByZXR1cm4ge307XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGwtaW1wb3J0XCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGwtaW1wb3J0XCI7XG4gIHZhciAkX18xMSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHNcIik7XG4gIHJldHVybiB7fTtcbn0pO1xuU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGwtaW1wb3J0XCIgKyAnJyk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiRldhQVNIXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwiUm91bmRcIjoge1xuICAgIFwidGlsZW1hcHNcIjogW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJtYXBcIixcbiAgICAgICAgXCJwYXRoXCI6IFwic3ByaXRlcy9tYXBzLzJmb3J0Lmpzb25cIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJzcHJpdGVzaGVldHNcIjogW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJwbGF5ZXJcIixcbiAgICAgICAgXCJwYXRoXCI6IFwic3ByaXRlcy9lbmVteS5wbmdcIixcbiAgICAgICAgXCJ3aWR0aFwiOiA2NCxcbiAgICAgICAgXCJoZWlnaHRcIjogNjQsXG4gICAgICAgIFwibGVuZ3RoXCI6IDRcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcImhhZG91a2VuXCIsXG4gICAgICAgIFwicGF0aFwiOiBcInNwcml0ZXMvaGFkb3VrZW4ucG5nXCIsXG4gICAgICAgIFwid2lkdGhcIjogMTAwLFxuICAgICAgICBcImhlaWdodFwiOiA3NSxcbiAgICAgICAgXCJsZW5ndGhcIjogNlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwiZmlyZWJhbGxcIixcbiAgICAgICAgXCJwYXRoXCI6IFwic3ByaXRlcy9maXJlYmFsbC5wbmdcIixcbiAgICAgICAgXCJ3aWR0aFwiOiAyMyxcbiAgICAgICAgXCJoZWlnaHRcIjogMjgsXG4gICAgICAgIFwibGVuZ3RoXCI6IDQgXG4gICAgICB9XG4gICAgXSxcbiAgICBcImltYWdlc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcIkRlc2VydFwiLFxuICAgICAgICBcInBhdGhcIjogXCJzcHJpdGVzL3Rtd19kZXNlcnRfc3BhY2luZy5wbmdcIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJhdWRpb3NcIjogW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJqdW1wXCIsXG4gICAgICAgIFwicGF0aFwiOiBcInNvdW5kcy9qdW1wLm9nZ1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJsYW5kXCIsXG4gICAgICAgIFwicGF0aFwiOiBcInNvdW5kcy9sYW5kLm9nZ1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJoYWRvdWtlblwiLFxuICAgICAgICBcInBhdGhcIjogXCJzb3VuZHMvaGFkb3VrZW4ubXAzXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcImV4cGxvc2lvblwiLFxuICAgICAgICBcInBhdGhcIjogXCJzb3VuZHMvZXhwbG9zaW9uLm1wM1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJleHBsb3Npb241XCIsXG4gICAgICAgIFwicGF0aFwiOiBcInNvdW5kcy9leHBsb3Npb241Lm1wM1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJ0b2FzdHlcIixcbiAgICAgICAgXCJwYXRoXCI6IFwic291bmRzL3RvYXN0eS5tcDNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwidG9hc3R5M1wiLFxuICAgICAgICBcInBhdGhcIjogXCJzb3VuZHMvdG9hc3R5My5tcDNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwiZG9kZ2VcIixcbiAgICAgICAgXCJwYXRoXCI6IFwic291bmRzL2RvZGdlLm1wM1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJkb2RnZTJcIixcbiAgICAgICAgXCJwYXRoXCI6IFwic291bmRzL2RvZGdlMi5tcDNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwibXVzaWNcIixcbiAgICAgICAgXCJwYXRoXCI6IFwic291bmRzL211c2ljLm9nZ1wiXG4gICAgICB9XG4gICAgXVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEhhZG91a2VuIGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHkpIHtcbiAgICAvL3N1cGVyKGdhbWUsIHgsIHksIFwiaGFkb3VrZW5cIiwgMClcbiAgICAvL3N1cGVyKGdhbWUsIHgsIHksIFwiZmlyZWJhbGxcIiwgMClcbiAgICBzdXBlcihnYW1lLCB4LCB5LCBcIm5vbmVcIiwgMClcblxuICAgIGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcylcblxuICAgIHRoaXMuYm9keS5zZXRDaXJjbGUoMTYpXG4gICAgdGhpcy5ib2R5Ll90eXBlID0gXCJoYWRvdWtlblwiXG5cbiAgICB0aGlzLnNwZWVkID0gMjAwMFxuICAgIHRoaXMub3duZXIgPSBudWxsXG5cbiAgICAvL3RoaXMuYW5pbWF0aW9ucy5hZGQoXCJ0cmF2ZWxpbmdcIiwgWzAsIDEsIDIsIDNdLCA4KVxuICAgIC8vdGhpcy5hbmltYXRpb25zLmFkZChcImV4cGxvZGluZ1wiLCBbM10sIDgpXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5ib2R5LnNldFplcm9Sb3RhdGlvbigpXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUGxheWVyIGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHkpIHtcbiAgICAvL3N1cGVyKGdhbWUsIHgsIHksIFwicGxheWVyXCIsIDApXG4gICAgc3VwZXIoZ2FtZSwgeCwgeSwgXCJub25lXCIsIDApXG5cbiAgICBnYW1lLnBoeXNpY3MucDIuZW5hYmxlKHRoaXMpXG5cbiAgICB0aGlzLmJvZHkuc2V0Q2lyY2xlKDI0KVxuICAgIHRoaXMuYm9keS5fdHlwZSA9IFwicGxheWVyXCJcblxuICAgIHRoaXMubmFtZSA9IFwiXCJcbiAgICB0aGlzLnNwZWVkID0gMzAwXG4gICAgdGhpcy5qdW1waW5nID0gZmFsc2VcbiAgICB0aGlzLmp1bXBEdXJhdGlvbiA9IDYwMFxuICAgIHRoaXMuaGFkb3VrZW5UaW1lb3V0ID0gMTAwMFxuICAgIHRoaXMubGFzdEhhZG91a2VuID0gbnVsbFxuXG4gICAgdGhpcy5pbml0aWFsSGVpZ2h0ID0gMS4wXG4gICAgdGhpcy5zY2FsZS5zZXRUbyh0aGlzLmluaXRpYWxIZWlnaHQsIHRoaXMuaW5pdGlhbEhlaWdodClcbiAgICB0aGlzLnJvdGF0aW9uT2Zmc2V0ID0gTWF0aC5QSSAvIDJcblxuICAgIHRoaXMudXAgPSBmYWxzZVxuICAgIHRoaXMucmlnaHQgPSBmYWxzZVxuICAgIHRoaXMuZG93biA9IGZhbHNlXG4gICAgdGhpcy5sZWZ0ID0gZmFsc2VcblxuICAgIC8vdGhpcy5hbmltYXRpb25zLmFkZChcIndhbGtpbmdcIiwgWzAsIDEsIDIsIDNdLCA4KVxuICAgIC8vdGhpcy5hbmltYXRpb25zLmFkZChcImp1bXBpbmdcIiwgWzNdLCA4KVxuICAgIC8vdGhpcy5hbmltYXRpb25zLmFkZChcImlkbGVcIiwgWzBdLCA4KVxuXG4gICAgdGhpcy5qdW1wU291bmQgPSBnYW1lLmFkZC5hdWRpbyhcImp1bXBcIilcbiAgICB0aGlzLmxhbmRTb3VuZCA9IGdhbWUuYWRkLmF1ZGlvKFwianVtcFwiKVxuICAgIHRoaXMuZmlyZVNvdW5kID0gZ2FtZS5hZGQuYXVkaW8oXCJoYWRvdWtlblwiKVxuICB9XG5cbiAganVtcCgpIHtcbiAgICBpZiAodGhpcy5qdW1waW5nKSByZXR1cm4gZmFsc2VcblxuICAgIHZhciBpbml0aWFsSGVpZ2h0ID0gdGhpcy5pbml0aWFsSGVpZ2h0XG4gICAgICAsIGFwZXggPSBpbml0aWFsSGVpZ2h0ICogMS4yXG4gICAgICAsIG1heCA9IHt4OiBhcGV4LCB5OiBhcGV4fVxuICAgICAgLCBtaW4gPSB7eDogaW5pdGlhbEhlaWdodCwgeTogaW5pdGlhbEhlaWdodH1cbiAgICAgICwgdXBUaW1lID0gdGhpcy5qdW1wRHVyYXRpb24gLyAyXG4gICAgICAsIGRvd25UaW1lID0gdGhpcy5qdW1wRHVyYXRpb24gLyAyXG4gICAgICAsIGVhc2VVcCA9IFBoYXNlci5FYXNpbmcuU2ludXNvaWRhbC5PdXRcbiAgICAgICwgZWFzZURvd24gPSBQaGFzZXIuRWFzaW5nLlNpbnVzb2lkYWwuSW5cbiAgICAgICwgYXNjZW50ID0gdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLnNjYWxlKS50byhtYXgsIHVwVGltZSwgZWFzZVVwKVxuICAgICAgLCBkZXNjZW50ID0gdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLnNjYWxlKS50byhtaW4sIGRvd25UaW1lLCBlYXNlRG93bilcblxuICAgIGFzY2VudC5vblN0YXJ0LmFkZCgoKSA9PiB7XG4gICAgICB0aGlzLmp1bXBTb3VuZC5wbGF5KClcbiAgICAgIHRoaXMuanVtcGluZyA9IHRydWVcbiAgICB9KVxuICAgIGRlc2NlbnQub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xuICAgICAgdGhpcy5sYW5kU291bmQucGxheSgpXG4gICAgICB0aGlzLmp1bXBpbmcgPSBmYWxzZVxuICAgIH0pXG4gICAgYXNjZW50LmNoYWluKGRlc2NlbnQpLnN0YXJ0KClcbiAgfVxuXG4gIGZpcmUoaGFkb3VrZW5zKSB7XG4gICAgdmFyIGhhZG91a2VuID0gaGFkb3VrZW5zLmdldEZpcnN0RXhpc3RzKGZhbHNlKVxuICAgIHZhciBub3cgPSB0aGlzLmdhbWUudGltZS5ub3dcbiAgICB2YXIgaGFkb3VrZW5BbGxvd2VkID0gbm93ID4gdGhpcy5sYXN0SGFkb3VrZW4gKyB0aGlzLmhhZG91a2VuVGltZW91dFxuXG4gICAgaWYgKCFoYWRvdWtlbkFsbG93ZWQpIHJldHVyblxuICAgIGhhZG91a2VuLnJlc2V0KHRoaXMueCwgdGhpcy55KVxuICAgIGhhZG91a2VuLmJvZHkucm90YXRpb24gPSB0aGlzLmJvZHkucm90YXRpb25cbiAgICBoYWRvdWtlbi5ib2R5Lm1vdmVGb3J3YXJkKGhhZG91a2VuLnNwZWVkKVxuICAgIGhhZG91a2VuLm93bmVyID0gdGhpc1xuICAgIHRoaXMubGFzdEhhZG91a2VuID0gbm93XG4gICAgdGhpcy5maXJlU291bmQucGxheSgpXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdmFyIGxlZnRWZWwgPSB0aGlzLmxlZnQgPyB0aGlzLnNwZWVkICogLTEgOiAwXG4gICAgICAsIHJpZ2h0VmVsID0gdGhpcy5yaWdodCA/IHRoaXMuc3BlZWQgOiAwXG4gICAgICAsIHVwVmVsID0gdGhpcy51cCA/IHRoaXMuc3BlZWQgKiAtMSA6IDBcbiAgICAgICwgZG93blZlbCA9IHRoaXMuZG93biA/IHRoaXMuc3BlZWQgOiAwXG4gICAgICAsIHhWZWwgPSBsZWZ0VmVsICsgcmlnaHRWZWxcbiAgICAgICwgeVZlbCA9IHVwVmVsICsgZG93blZlbFxuICAgICAgLCBzdG9wcGVkID0gKCF4VmVsICYmICF5VmVsKVxuXG4gICAgdGhpcy5ib2R5LnNldFplcm9Sb3RhdGlvbigpXG4gICAgdGhpcy5ib2R5LnJvdGF0aW9uID0gc3RvcHBlZCBcbiAgICAgID8gdGhpcy5ib2R5LnJvdGF0aW9uXG4gICAgICA6IFBoYXNlci5NYXRoLmFuZ2xlQmV0d2VlbigwLCAwLCB4VmVsLCB5VmVsKSArIHRoaXMucm90YXRpb25PZmZzZXRcblxuICAgIGlmICghdGhpcy5qdW1waW5nKSB7XG4gICAgICB0aGlzLmJvZHkudmVsb2NpdHkueCA9IHhWZWwgXG4gICAgICB0aGlzLmJvZHkudmVsb2NpdHkueSA9IHlWZWxcbiAgICAgIHRoaXMuYW5pbWF0aW9ucy5wbGF5KHN0b3BwZWQgPyBcImlkbGVcIiA6IFwid2Fsa2luZ1wiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFuaW1hdGlvbnMucGxheShcImp1bXBpbmdcIikgXG4gICAgfVxuICB9XG59XG4iLCJ2YXIgUm91bmQgPSByZXF1aXJlKFwiLi9zdGF0ZXMvUm91bmRcIilcbnZhciBBc3NldExvYWRlciA9IHJlcXVpcmUoXCIuL3N5c3RlbXMvQXNzZXRMb2FkZXJcIilcbnZhciBhc3NldHMgPSByZXF1aXJlKFwiLi9hc3NldHMuanNvblwiKVxudmFyIGlvID0gcmVxdWlyZShcInNvY2tldC5pby1jbGllbnRcIilcbnZhciBzZXJ2ZXJVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZiArIFwic2VydmVyXCJcbnZhciBzb2NrZXQgPSBpby5jb25uZWN0KHNlcnZlclVybClcbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDE5MjAsIDk2MCwgUGhhc2VyLkNBTlZBUywgXCJnYW1lXCIpXG5cbnNvY2tldC5vbihcImNvbm5lY3RcIiwgZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLmxvZyhcInNlcnZlciBjb25uZWN0ZWRcIilcbiAgZ2FtZS5fYXNzZXRMb2FkZXIgPSBuZXcgQXNzZXRMb2FkZXIoZ2FtZSwgYXNzZXRzKVxuICBnYW1lLl9zb2NrZXQgPSBzb2NrZXRcbiAgZ2FtZS5zdGF0ZS5hZGQoJ2dhbWUnLCBSb3VuZClcbiAgZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZScpXG4gIGdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuICBnYW1lLnNjYWxlLnNldFNjcmVlblNpemUoKVxuICBnYW1lLnNjYWxlLnJlZnJlc2goKVxuICBnYW1lLnN0YWdlLmRpc2FibGVWaXNpYmlsaXR5Q2hhbmdlID0gdHJ1ZVxufSk7XG4iLCJ2YXIgUGxheWVyID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL1BsYXllclwiKVxudmFyIEhhZG91a2VuID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL0hhZG91a2VuXCIpXG52YXIge2dldFJhbmRvbSwgbm9vcCwgaXNUeXBlQ29tYm99ID0gcmVxdWlyZShcIi4uL3V0aWxzXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUm91bmQgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuXG4gIGFkZFBsYXllcihpZCkge1xuICAgIHZhciBzcGF3biA9IGdldFJhbmRvbSh0aGlzLnBsYXllclNwYXducylcbiAgICB2YXIgcGxheWVyID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIHNwYXduLngsIHNwYXduLnkpXG5cbiAgICB0aGlzLnJlZ2lzdGVyUGxheWVyKHBsYXllcilcbiAgICB0aGlzLnNvY2tldFBsYXllck1hcFtpZF0gPSBwbGF5ZXJcbiAgICBjb25zb2xlLmxvZyhcImFkZFwiLCBpZCkgXG4gIH1cblxuICByZW1vdmVQbGF5ZXIoaWQpIHtcbiAgICB2YXIgcGxheWVyID0gdGhpcy5zb2NrZXRQbGF5ZXJNYXBbaWRdXG5cbiAgICBpZiAoIXBsYXllcikgcmV0dXJuIGZhbHNlXG4gICAgdGhpcy5wbGF5ZXJzLnJlbW92ZShwbGF5ZXIpXG4gICAgdGhpcy5zb2NrZXRQbGF5ZXJNYXBbaWRdID0gdW5kZWZpbmVkXG4gICAgY29uc29sZS5sb2coXCJyZW1vdmVcIiwgaWQpICBcbiAgfVxuXG4gIHVwZGF0ZVBsYXllcih7aWQsIGtleXN9KSB7XG4gICAgdmFyIHBsYXllciA9IHRoaXMuc29ja2V0UGxheWVyTWFwW2lkXVxuXG4gICAgaWYgKCFwbGF5ZXIpIHJldHVybiBmYWxzZVxuICAgIHBsYXllci5uYW1lID0ga2V5cy5uYW1lXG4gICAgcGxheWVyLnVwID0ga2V5cy51cFxuICAgIHBsYXllci5yaWdodCA9IGtleXMucmlnaHRcbiAgICBwbGF5ZXIuZG93biA9IGtleXMuZG93blxuICAgIHBsYXllci5sZWZ0ID0ga2V5cy5sZWZ0XG4gICAgaWYgKGtleXMuanVtcCkgcGxheWVyLmp1bXAoKVxuICAgIGlmIChrZXlzLmZpcmUpIHBsYXllci5maXJlKHRoaXMuaGFkb3VrZW5zKVxuICB9XG5cbiAgcmVnaXN0ZXJQbGF5ZXIocGxheWVyKSB7XG4gICAgdGhpcy5wbGF5ZXJzLmFkZChwbGF5ZXIpIFxuICAgIHBsYXllci5ib2R5LmNvbGxpZGVzKHRoaXMud2FsbHNDZylcbiAgICBwbGF5ZXIuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLnBsYXllcnNDZylcbiAgfVxuXG4gIHJlZ2lzdGVyV2FsbCh3YWxsKSB7XG4gICAgdGhpcy53YWxscy5wdXNoKHdhbGwpXG4gICAgd2FsbC5jb2xsaWRlcyh0aGlzLnBsYXllcnNDZylcbiAgICB3YWxsLmNvbGxpZGVzKHRoaXMuaGFkb3VrZW5zQ2cpXG4gICAgd2FsbC5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLndhbGxzQ2cpXG4gIH1cblxuICByZWdpc3RlckhhZG91a2VuKGhhZCkge1xuICAgIGhhZC5ib2R5LmNvbGxpZGVzKHRoaXMud2FsbHNDZywgdGhpcy5oYWRvdWtlbkhpdHNXYWxsLCB0aGlzKVxuICAgIGhhZC5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuaGFkb3VrZW5zQ2cpIFxuICB9XG5cbiAgaGFkb3VrZW5IaXRzUGxheWVyKGhhZCwgcGxheWVyKSB7XG4gICAgaWYgKGhhZC5zcHJpdGUub3duZXIgPT09IHBsYXllci5zcHJpdGUpIHtcbiAgICAgIHJldHVybiBcbiAgICB9IGVsc2UgaWYgKHBsYXllci5zcHJpdGUuanVtcGluZykge1xuICAgICAgZ2V0UmFuZG9tKHRoaXMuZG9kZ2VTb3VuZHMpLnBsYXkoKVxuICAgICAgcmV0dXJuXG4gICAgfSBlbHNlIHtcbiAgICAgIGdldFJhbmRvbSh0aGlzLmtpbGxTb3VuZHMpLnBsYXkoKVxuICAgICAgaGFkLnNwcml0ZS5raWxsKClcbiAgICAgIC8vcGxheWVyLnNwcml0ZS5raWxsKClcbiAgICB9XG4gIH1cblxuICBoYWRvdWtlbkhpdHNXYWxsKGhhZCwgd2FsbCkge1xuICAgIGdldFJhbmRvbSh0aGlzLmV4cGxvc2lvblNvdW5kcykucGxheSgpIFxuICAgIGhhZC5zcHJpdGUua2lsbCgpXG4gIH1cblxuICBjaGVja092ZXJsYXAoYm9keTEsIGJvZHkyKSB7XG4gICAgdmFyIGhhZG91a2VuXG4gICAgICAsIHBsYXllclxuICAgICAgLCBzaG91bGRDb2xsaWRlID0gdHJ1ZVxuXG4gICAgaWYgKGlzVHlwZUNvbWJvKGJvZHkxLl90eXBlLCBib2R5Mi5fdHlwZSwgXCJwbGF5ZXJcIiwgXCJoYWRvdWtlblwiKSkge1xuICAgICAgc2hvdWxkQ29sbGlkZSA9IGZhbHNlXG4gICAgICBwbGF5ZXIgPSBib2R5MS5fdHlwZSA9PT0gXCJwbGF5ZXJcIiA/IGJvZHkxIDogYm9keTJcbiAgICAgIGhhZG91a2VuID0gYm9keTIuX3R5cGUgPT09IFwiaGFkb3VrZW5cIiA/IGJvZHkyIDogYm9keTFcbiAgICAgIHRoaXMuaGFkb3VrZW5IaXRzUGxheWVyKGhhZG91a2VuLCBwbGF5ZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNob3VsZENvbGxpZGUgPSB0cnVlXG4gICAgfVxuICAgIHJldHVybiBzaG91bGRDb2xsaWRlXG4gIH1cblxuICBwcmVsb2FkKCkge1xuICAgIHRoaXMuZ2FtZS5fYXNzZXRMb2FkZXIubG9hZEZvcihcIlJvdW5kXCIpXG4gICAgdGhpcy5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLlAySlMpXG4gICAgdGhpcy5nYW1lLnBoeXNpY3MucDIuc2V0SW1wYWN0RXZlbnRzKHRydWUpXG4gICAgdGhpcy5nYW1lLnBoeXNpY3MucDIuc2V0Qm91bmRzVG9Xb3JsZCh0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKVxuICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLnVwZGF0ZUJvdW5kc0NvbGxpc2lvbkdyb3VwKClcbiAgfVxuXG4gIGNyZWF0ZSgpIHtcbiAgICB0aGlzLnBsYXllclNwYXducyA9IFtcbiAgICAgIG5ldyBQaGFzZXIuUG9pbnQoMjAwLCAyMDApLFxuICAgICAgbmV3IFBoYXNlci5Qb2ludCg2MDAsIDIwMCksXG4gICAgICBuZXcgUGhhc2VyLlBvaW50KDEzMDAsIDIwMCksXG4gICAgICBuZXcgUGhhc2VyLlBvaW50KDkwMCwgNDUwKSxcbiAgICAgIG5ldyBQaGFzZXIuUG9pbnQoNzAwLCA2NTApLFxuICAgICAgbmV3IFBoYXNlci5Qb2ludCgxMjAwLCA2NTApXG4gICAgXVxuXG4gICAgdGhpcy5zb2NrZXRQbGF5ZXJNYXAgPSB7fVxuXG4gICAgdGhpcy5nYW1lLl9zb2NrZXRcbiAgICAgIC5vbihcImpvaW5cIiwgdGhpcy5hZGRQbGF5ZXIuYmluZCh0aGlzKSlcbiAgICAgIC5vbihcImxlYXZlXCIsIHRoaXMucmVtb3ZlUGxheWVyLmJpbmQodGhpcykpXG4gICAgICAub24oXCJ0aWNrXCIsIHRoaXMudXBkYXRlUGxheWVyLmJpbmQodGhpcykpXG5cbiAgICB0aGlzLmlucHV0cyA9IFtdXG5cbiAgICB0aGlzLmtpbGxTb3VuZHMgPSBbXG4gICAgICB0aGlzLmdhbWUuYWRkLmF1ZGlvKFwidG9hc3R5XCIpLCBcbiAgICAgIHRoaXMuZ2FtZS5hZGQuYXVkaW8oXCJ0b2FzdHkzXCIpXG4gICAgXVxuXG4gICAgdGhpcy5leHBsb3Npb25Tb3VuZHMgPSBbXG4gICAgICB0aGlzLmdhbWUuYWRkLmF1ZGlvKFwiZXhwbG9zaW9uXCIpLFxuICAgICAgdGhpcy5nYW1lLmFkZC5hdWRpbyhcImV4cGxvc2lvbjVcIilcbiAgICBdXG5cbiAgICB0aGlzLmRvZGdlU291bmRzID0gW1xuICAgICAgdGhpcy5nYW1lLmFkZC5hdWRpbyhcImRvZGdlXCIpLFxuICAgICAgdGhpcy5nYW1lLmFkZC5hdWRpbyhcImRvZGdlMlwiKSxcbiAgICBdXG5cbiAgICB0aGlzLm1hcCA9IHRoaXMuZ2FtZS5hZGQudGlsZW1hcChcIm1hcFwiKVxuICAgIHRoaXMubWFwLmFkZFRpbGVzZXRJbWFnZShcIkRlc2VydFwiLCBcIkRlc2VydFwiKVxuICAgIHRoaXMuZ3JvdW5kID0gdGhpcy5tYXAuY3JlYXRlTGF5ZXIoXCJHcm91bmRcIilcblxuICAgIHRoaXMucGxheWVycyA9IHRoaXMuYWRkLmdyb3VwKClcblxuICAgIHRoaXMuaGFkb3VrZW5zID0gdGhpcy5hZGQuZ3JvdXAoKVxuICAgIHRoaXMuaGFkb3VrZW5zLmNsYXNzVHlwZSA9IEhhZG91a2VuXG4gICAgdGhpcy5oYWRvdWtlbnMuY3JlYXRlTXVsdGlwbGUoMTAwMClcblxuICAgIHRoaXMud2FsbHMgPSBbXVxuXG4gICAgdGhpcy5wbGF5ZXJzQ2cgPSB0aGlzLmdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpXG4gICAgdGhpcy53YWxsc0NnID0gdGhpcy5nYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKVxuICAgIHRoaXMuaGFkb3VrZW5zQ2cgPSB0aGlzLmdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpXG5cbiAgICB2YXIgd2FsbHMgPSB0aGlzLmdhbWUucGh5c2ljcy5wMi5jb252ZXJ0Q29sbGlzaW9uT2JqZWN0cyhcbiAgICAgIHRoaXMubWFwLFxuICAgICAgXCJDb2xsaXNpb25zXCIsXG4gICAgICB0cnVlXG4gICAgKVxuICAgIHZhciBzcGF3biA9IGdldFJhbmRvbSh0aGlzLnBsYXllclNwYXducylcbiAgICB2YXIgcGxheWVyMSA9IG5ldyBQbGF5ZXIodGhpcy5nYW1lLCBzcGF3bi54LCBzcGF3bi55KVxuXG4gICAgdGhpcy5yZWdpc3RlclBsYXllcihwbGF5ZXIxKVxuICAgIHdhbGxzLmZvckVhY2godGhpcy5yZWdpc3RlcldhbGwsIHRoaXMpXG4gICAgdGhpcy5oYWRvdWtlbnMuZm9yRWFjaCh0aGlzLnJlZ2lzdGVySGFkb3VrZW4sIHRoaXMpXG5cbiAgICB0aGlzLmlucHV0cy5wdXNoKHtcbiAgICAgIGtleTogdGhpcy5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlVQKSwgXG4gICAgICBkb3duOiAoKSA9PiB7IHBsYXllcjEudXAgPSB0cnVlIH0sIFxuICAgICAgdXA6ICgpID0+IHsgcGxheWVyMS51cCA9IGZhbHNlIH1cbiAgICB9KVxuICAgIHRoaXMuaW5wdXRzLnB1c2goe1xuICAgICAga2V5OiB0aGlzLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuUklHSFQpLCBcbiAgICAgIGRvd246ICgpID0+IHsgcGxheWVyMS5yaWdodCA9IHRydWUgfSwgXG4gICAgICB1cDogKCkgPT4geyBwbGF5ZXIxLnJpZ2h0ID0gZmFsc2UgfVxuICAgIH0pXG4gICAgdGhpcy5pbnB1dHMucHVzaCh7XG4gICAgICBrZXk6IHRoaXMuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5ET1dOKSwgXG4gICAgICBkb3duOiAoKSA9PiB7IHBsYXllcjEuZG93biA9IHRydWUgfSwgXG4gICAgICB1cDogKCkgPT4geyBwbGF5ZXIxLmRvd24gPSBmYWxzZSB9XG4gICAgfSlcbiAgICB0aGlzLmlucHV0cy5wdXNoKHtcbiAgICAgIGtleTogdGhpcy5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkxFRlQpLCBcbiAgICAgIGRvd246ICgpID0+IHsgcGxheWVyMS5sZWZ0ID0gdHJ1ZSB9LCBcbiAgICAgIHVwOiAoKSA9PiB7IHBsYXllcjEubGVmdCA9IGZhbHNlIH1cbiAgICB9KVxuICAgIHRoaXMuaW5wdXRzLnB1c2goe1xuICAgICAga2V5OiB0aGlzLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVIpLFxuICAgICAgZG93bjogcGxheWVyMS5qdW1wLmJpbmQocGxheWVyMSlcbiAgICB9KVxuICAgIHRoaXMuaW5wdXRzLnB1c2goe1xuICAgICAga2V5OiB0aGlzLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuRiksXG4gICAgICBkb3duOiBwbGF5ZXIxLmZpcmUuYmluZChwbGF5ZXIxLCB0aGlzLmhhZG91a2VucylcbiAgICB9KVxuXG4gICAgdGhpcy5nYW1lLnBoeXNpY3MucDIuc2V0UG9zdEJyb2FkcGhhc2VDYWxsYmFjayh0aGlzLmNoZWNrT3ZlcmxhcCwgdGhpcylcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLmlucHV0cy5mb3JFYWNoKGRvQWN0aW9uRm9yS2V5KVxuICB9XG59XG5cbnZhciBkb0FjdGlvbkZvcktleSA9ICh7a2V5LCBkb3duLCB1cH0pID0+IHtcbiAgdmFyIGRvd24gPSBkb3duIHx8IG5vb3BcbiAgICAsIHVwID0gdXAgfHwgbm9vcFxuXG4gIGlmIChrZXkuaXNEb3duKSBkb3duKClcbiAgZWxzZSB1cCgpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEFzc2V0TG9hZGVyIHtcbiAgY29uc3RydWN0b3IoZ2FtZSwgYXNzZXRzKSB7XG4gICAgaWYgKCFnYW1lIHx8ICFhc3NldHMpIHRocm93IG5ldyBFcnJvcihcIlByb3ZpZGUgZ2FtZSBhbmQgYXNzZXRzIHRvIGNvbnN0cnVjdG9yXCIpXG4gICAgdGhpcy5nYW1lID0gZ2FtZVxuICAgIHRoaXMuYXNzZXRzID0gYXNzZXRzIFxuICB9XG4gIGxvYWRGb3Ioc3RhdGUpIHtcbiAgICB2YXIgZm9yU3RhdGUgPSB0aGlzLmFzc2V0c1tzdGF0ZV0gXG4gICAgdmFyIGdhbWUgPSB0aGlzLmdhbWVcblxuICAgIGlmICghZm9yU3RhdGUpIHJldHVyblxuXG4gICAgdmFyIHRpbGVtYXBzID0gZm9yU3RhdGUudGlsZW1hcHMgfHwgW11cbiAgICB2YXIgaW1hZ2VzID0gZm9yU3RhdGUuaW1hZ2VzIHx8IFtdXG4gICAgdmFyIGF1ZGlvcyA9IGZvclN0YXRlLmF1ZGlvcyB8fCBbXVxuICAgIHZhciBzcHJpdGVzaGVldHMgPSBmb3JTdGF0ZS5zcHJpdGVzaGVldHMgfHwgW11cblxuICAgIGltYWdlcy5mb3JFYWNoKGltZyA9PiBnYW1lLmxvYWQuaW1hZ2UoaW1nLm5hbWUsIGltZy5wYXRoKSlcbiAgICBhdWRpb3MuZm9yRWFjaChhdWRpbyA9PiBnYW1lLmxvYWQuYXVkaW8oYXVkaW8ubmFtZSwgYXVkaW8ucGF0aCkpXG4gICAgc3ByaXRlc2hlZXRzLmZvckVhY2goKHNoZWV0KSA9PiB7XG4gICAgICBnYW1lLmxvYWQuc3ByaXRlc2hlZXQoXG4gICAgICAgIHNoZWV0Lm5hbWUsXG4gICAgICAgIHNoZWV0LnBhdGgsXG4gICAgICAgIHNoZWV0LndpZHRoLFxuICAgICAgICBzaGVldC5oZWlnaHQsXG4gICAgICAgIHNoZWV0Lmxlbmd0aFxuICAgICAgKVxuICAgIH0pXG4gICAgdGlsZW1hcHMuZm9yRWFjaCgodGlsZW1hcCkgPT4ge1xuICAgICAgZ2FtZS5sb2FkLnRpbGVtYXAoXG4gICAgICAgIHRpbGVtYXAubmFtZSxcbiAgICAgICAgdGlsZW1hcC5wYXRoLFxuICAgICAgICBudWxsLFxuICAgICAgICBQaGFzZXIuVGlsZW1hcC5USUxFRF9KU09OXG4gICAgICApXG4gICAgfSlcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tID0gKGxpc3QpID0+IHtcbiAgcmV0dXJuIGxpc3RbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGlzdC5sZW5ndGgpXVxufVxuXG5tb2R1bGUuZXhwb3J0cy5ub29wID0gKCkgPT4ge31cblxubW9kdWxlLmV4cG9ydHMuaXNUeXBlQ29tYm8gPSAoZmlyc3QsIHNlY29uZCwgcHJvcDEsIHByb3AyKSA9PiB7XG4gIGlmICghZmlyc3QgfHwgIXNlY29uZCB8fCAhcHJvcDEgfHwgIXByb3AyKSByZXR1cm4gZmFsc2VcblxuICB2YXIgY2FzZTEgPSAoZmlyc3QgPT09IHByb3AxICYmIHNlY29uZCA9PT0gcHJvcDIpXG4gIHZhciBjYXNlMiA9IChmaXJzdCA9PT0gcHJvcDIgJiYgc2Vjb25kID09PSBwcm9wMSlcblxuICByZXR1cm4gY2FzZTEgfHwgY2FzZTJcbn1cbiJdfQ==
