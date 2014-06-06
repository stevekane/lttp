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
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.anchor.setTo(.5, .5);
    this.body.setCircle(6);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.speed = 3000;
    this.owner = null;
    this.collideSound = game.add.audio("land");
  };
  return ($traceurRuntime.createClass)(Hadouken, {
    update: function() {
      this.body.setZeroRotation();
    },
    explode: function() {
      this.collideSound.play();
      this.kill();
    }
  }, {}, $__super);
}(Phaser.Sprite));


},{}],5:[function(require,module,exports){
"use strict";
var __moduleName = "public/entities/Player";
module.exports = (function($__super) {
  var Player = function Player(game, x, y) {
    $traceurRuntime.superCall(this, Player.prototype, "constructor", [game, x, y, "none", 0]);
    game.physics.p2.enable(this);
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.P2JS;
    this.anchor.setTo(.5, .5);
    this.body.setCircle(24);
    this.speed = 300;
    this.jumping = false;
    this.jumpDuration = 600;
    this.z = 1.0;
    this.scale.setTo(this.z, this.z);
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
      var initialHeight = this.z,
          apex = initialHeight * 1.2,
          upTime = this.jumpDuration / 2,
          downTime = this.jumpDuration / 2,
          easeUp = Phaser.Easing.Sinusoidal.Out,
          easeDown = Phaser.Easing.Sinusoidal.In,
          ascent = this.game.add.tween(this).to({z: apex}, upTime, easeUp),
          descent = this.game.add.tween(this).to({z: initialHeight}, downTime, easeDown);
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
      hadouken.reset(this.x, this.y);
      hadouken.body.rotation = this.body.rotation;
      hadouken.body.moveForward(hadouken.speed);
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
      this.scale.x = this.z;
      this.scale.y = this.z;
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
var game = new Phaser.Game(1920, 960, Phaser.AUTO, "game");
game.state.add('game', Round);
game.state.start('game');
game._assetLoader = new AssetLoader(game, assets);


},{"./assets.json":3,"./states/Round":7,"./systems/AssetLoader":8}],7:[function(require,module,exports){
"use strict";
var __moduleName = "public/states/Round";
var Player = require("../entities/Player");
var Hadouken = require("../entities/Hadouken");
module.exports = (function($__super) {
  var Round = function Round() {
    $traceurRuntime.defaultSuperCall(this, Round.prototype, arguments);
  };
  return ($traceurRuntime.createClass)(Round, {
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
      had.body.collides(this.wallsCg, had.explode, had);
      had.body.setCollisionGroup(this.hadoukensCg);
    },
    preload: function() {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.setScreenSize();
      this.game._assetLoader.loadFor("Round");
      this.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);
      this.game.physics.p2.setBoundsToWorld(true, true, true, true, true);
      this.game.physics.p2.updateBoundsCollisionGroup();
    },
    create: function() {
      this.inputs = [];
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
      var player1 = new Player(this.game, 900, 450);
      var walls = this.game.physics.p2.convertCollisionObjects(this.map, "Collisions", true);
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
    },
    update: function() {
      this.inputs.forEach(doActionForKey);
    }
  }, {}, $__super);
}(Phaser.State));
var noop = (function() {});
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


},{"../entities/Hadouken":4,"../entities/Player":5}],8:[function(require,module,exports){
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


},{}]},{},[2,6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9lczZpZnkvbm9kZV9tb2R1bGVzL3RyYWNldXIvYmluL3RyYWNldXItcnVudGltZS5qcyIsIi9Vc2Vycy9zdGV2ZW5rYW5lL2x0dHAvcHVibGljL2Fzc2V0cy5qc29uIiwiL1VzZXJzL3N0ZXZlbmthbmUvbHR0cC9wdWJsaWMvZW50aXRpZXMvSGFkb3VrZW4uanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9lbnRpdGllcy9QbGF5ZXIuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9tYWluLmpzIiwiL1VzZXJzL3N0ZXZlbmthbmUvbHR0cC9wdWJsaWMvc3RhdGVzL1JvdW5kLmpzIiwiL1VzZXJzL3N0ZXZlbmthbmUvbHR0cC9wdWJsaWMvc3lzdGVtcy9Bc3NldExvYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzl6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTs7QUFBQSxDQUFBLEtBQU0sUUFBUTtnQkFBRyxTQUFNLFNBQVEsQ0FDakIsSUFBSSxDQUFFLENBQUEsQ0FBQyxDQUFFLENBQUEsQ0FBQyxDQUFFO0NBR3RCLHVFQUFNLElBQUksQ0FBRSxFQUFDLENBQUUsRUFBQyxDQUFFLE9BQU0sQ0FBRSxFQUFDLEdBQUM7QUFFNUIsQ0FBQSxPQUFJ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QSxRQUFRLE9BQU8sR0FBSSxHQUFFLENBQUE7QUFDOUIsQ0FBSixRQUFJLENBQUEsWUFBWSxFQUFHLENBQUEsUUFBUSxhQUFhLEdBQUksR0FBRSxDQUFBO0FBRTlDLENBQUEsV0FBTSxRQUFRLFdBQUMsR0FBRztjQUFJLENBQUEsSUFBSSxLQUFLLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBRSxDQUFBLEdBQUcsS0FBSyxDQUFDO1NBQUMsQ0FBQTtBQUMxRCxDQUFBLFdBQU0sUUFBUSxXQUFDLEtBQUs7Y0FBSSxDQUFBLElBQUksS0FBSyxNQUFNLENBQUMsS0FBSyxLQUFLLENBQUUsQ0FBQSxLQUFLLEtBQUssQ0FBQztTQUFDLENBQUE7QUFDaEUsQ0FBQSxpQkFBWSxRQUFRLFdBQUUsS0FBSyxDQUFLO0FBQzlCLENBQUEsV0FBSSxLQUFLLFlBQVksQ0FDbkIsS0FBSyxLQUFLLENBQ1YsQ0FBQSxLQUFLLEtBQUssQ0FDVixDQUFBLEtBQUssTUFBTSxDQUNYLENBQUEsS0FBSyxPQUFPLENBQ1osQ0FBQSxLQUFLLE9BQU8sQ0FDYixDQUFBO09BQ0YsRUFBQyxDQUFBO0FBQ0YsQ0FBQSxhQUFRLFFBQVEsV0FBRSxPQUFPLENBQUs7QUFDNUIsQ0FBQSxXQUFJLEtBQUssUUFBUSxDQUNmLE9BQU8sS0FBSyxDQUNaLENBQUEsT0FBTyxLQUFLLENBQ1osS0FBSSxDQUNKLENBQUEsTUFBTSxRQUFRLFdBQVcsQ0FDMUIsQ0FBQTtPQUNGLEVBQUMsQ0FBQTtLQUNIO0lBQ0YsQ0FBQTtDQUNEIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwpe1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmIChnbG9iYWwuJHRyYWNldXJSdW50aW1lKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciAkT2JqZWN0ID0gT2JqZWN0O1xuICB2YXIgJFR5cGVFcnJvciA9IFR5cGVFcnJvcjtcbiAgdmFyICRjcmVhdGUgPSAkT2JqZWN0LmNyZWF0ZTtcbiAgdmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzO1xuICB2YXIgJGRlZmluZVByb3BlcnR5ID0gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbiAgdmFyICRmcmVlemUgPSAkT2JqZWN0LmZyZWV6ZTtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgdmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICB2YXIgJGdldFByb3RvdHlwZU9mID0gJE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbiAgdmFyICRoYXNPd25Qcm9wZXJ0eSA9ICRPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgJHRvU3RyaW5nID0gJE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIGZ1bmN0aW9uIG5vbkVudW0odmFsdWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH07XG4gIH1cbiAgdmFyIHR5cGVzID0ge1xuICAgIHZvaWQ6IGZ1bmN0aW9uIHZvaWRUeXBlKCkge30sXG4gICAgYW55OiBmdW5jdGlvbiBhbnkoKSB7fSxcbiAgICBzdHJpbmc6IGZ1bmN0aW9uIHN0cmluZygpIHt9LFxuICAgIG51bWJlcjogZnVuY3Rpb24gbnVtYmVyKCkge30sXG4gICAgYm9vbGVhbjogZnVuY3Rpb24gYm9vbGVhbigpIHt9XG4gIH07XG4gIHZhciBtZXRob2QgPSBub25FbnVtO1xuICB2YXIgY291bnRlciA9IDA7XG4gIGZ1bmN0aW9uIG5ld1VuaXF1ZVN0cmluZygpIHtcbiAgICByZXR1cm4gJ19fJCcgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxZTkpICsgJyQnICsgKytjb3VudGVyICsgJyRfXyc7XG4gIH1cbiAgdmFyIHN5bWJvbEludGVybmFsUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbERlc2NyaXB0aW9uUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbERhdGFQcm9wZXJ0eSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICB2YXIgc3ltYm9sVmFsdWVzID0gJGNyZWF0ZShudWxsKTtcbiAgZnVuY3Rpb24gaXNTeW1ib2woc3ltYm9sKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzeW1ib2wgPT09ICdvYmplY3QnICYmIHN5bWJvbCBpbnN0YW5jZW9mIFN5bWJvbFZhbHVlO1xuICB9XG4gIGZ1bmN0aW9uIHR5cGVPZih2KSB7XG4gICAgaWYgKGlzU3ltYm9sKHYpKVxuICAgICAgcmV0dXJuICdzeW1ib2wnO1xuICAgIHJldHVybiB0eXBlb2YgdjtcbiAgfVxuICBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcbiAgICB2YXIgdmFsdWUgPSBuZXcgU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpKVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N5bWJvbCBjYW5ub3QgYmUgbmV3XFwnZWQnKTtcbiAgfVxuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShTeW1ib2wpKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIG1ldGhvZChmdW5jdGlvbigpIHtcbiAgICB2YXIgc3ltYm9sVmFsdWUgPSB0aGlzW3N5bWJvbERhdGFQcm9wZXJ0eV07XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICBpZiAoIXN5bWJvbFZhbHVlKVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdDb252ZXJzaW9uIGZyb20gc3ltYm9sIHRvIHN0cmluZycpO1xuICAgIHZhciBkZXNjID0gc3ltYm9sVmFsdWVbc3ltYm9sRGVzY3JpcHRpb25Qcm9wZXJ0eV07XG4gICAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZClcbiAgICAgIGRlc2MgPSAnJztcbiAgICByZXR1cm4gJ1N5bWJvbCgnICsgZGVzYyArICcpJztcbiAgfSkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sLnByb3RvdHlwZSwgJ3ZhbHVlT2YnLCBtZXRob2QoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN5bWJvbFZhbHVlID0gdGhpc1tzeW1ib2xEYXRhUHJvcGVydHldO1xuICAgIGlmICghc3ltYm9sVmFsdWUpXG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0NvbnZlcnNpb24gZnJvbSBzeW1ib2wgdG8gc3RyaW5nJyk7XG4gICAgaWYgKCFnZXRPcHRpb24oJ3N5bWJvbHMnKSlcbiAgICAgIHJldHVybiBzeW1ib2xWYWx1ZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gc3ltYm9sVmFsdWU7XG4gIH0pKTtcbiAgZnVuY3Rpb24gU3ltYm9sVmFsdWUoZGVzY3JpcHRpb24pIHtcbiAgICB2YXIga2V5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERhdGFQcm9wZXJ0eSwge3ZhbHVlOiB0aGlzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbEludGVybmFsUHJvcGVydHksIHt2YWx1ZToga2V5fSk7XG4gICAgJGRlZmluZVByb3BlcnR5KHRoaXMsIHN5bWJvbERlc2NyaXB0aW9uUHJvcGVydHksIHt2YWx1ZTogZGVzY3JpcHRpb259KTtcbiAgICAkZnJlZXplKHRoaXMpO1xuICAgIHN5bWJvbFZhbHVlc1trZXldID0gdGhpcztcbiAgfVxuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCBub25FbnVtKFN5bWJvbCkpO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAndG9TdHJpbmcnLCB7XG4gICAgdmFsdWU6IFN5bWJvbC5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgZW51bWVyYWJsZTogZmFsc2VcbiAgfSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2xWYWx1ZS5wcm90b3R5cGUsICd2YWx1ZU9mJywge1xuICAgIHZhbHVlOiBTeW1ib2wucHJvdG90eXBlLnZhbHVlT2YsXG4gICAgZW51bWVyYWJsZTogZmFsc2VcbiAgfSk7XG4gICRmcmVlemUoU3ltYm9sVmFsdWUucHJvdG90eXBlKTtcbiAgU3ltYm9sLml0ZXJhdG9yID0gU3ltYm9sKCk7XG4gIGZ1bmN0aW9uIHRvUHJvcGVydHkobmFtZSkge1xuICAgIGlmIChpc1N5bWJvbChuYW1lKSlcbiAgICAgIHJldHVybiBuYW1lW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIHJldHVybiBuYW1lO1xuICB9XG4gIGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KSB7XG4gICAgdmFyIHJ2ID0gW107XG4gICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgaWYgKCFzeW1ib2xWYWx1ZXNbbmFtZV0pXG4gICAgICAgIHJ2LnB1c2gobmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCB0b1Byb3BlcnR5KG5hbWUpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KSB7XG4gICAgdmFyIHJ2ID0gW107XG4gICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3ltYm9sID0gc3ltYm9sVmFsdWVzW25hbWVzW2ldXTtcbiAgICAgIGlmIChzeW1ib2wpXG4gICAgICAgIHJ2LnB1c2goc3ltYm9sKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ2O1xuICB9XG4gIGZ1bmN0aW9uIGhhc093blByb3BlcnR5KG5hbWUpIHtcbiAgICByZXR1cm4gJGhhc093blByb3BlcnR5LmNhbGwodGhpcywgdG9Qcm9wZXJ0eShuYW1lKSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3B0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gZ2xvYmFsLnRyYWNldXIgJiYgZ2xvYmFsLnRyYWNldXIub3B0aW9uc1tuYW1lXTtcbiAgfVxuICBmdW5jdGlvbiBzZXRQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIHN5bSxcbiAgICAgICAgZGVzYztcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpIHtcbiAgICAgIHN5bSA9IG5hbWU7XG4gICAgICBuYW1lID0gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICB9XG4gICAgb2JqZWN0W25hbWVdID0gdmFsdWU7XG4gICAgaWYgKHN5bSAmJiAoZGVzYyA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSkpXG4gICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7ZW51bWVyYWJsZTogZmFsc2V9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBkZXNjcmlwdG9yKSB7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKSB7XG4gICAgICBpZiAoZGVzY3JpcHRvci5lbnVtZXJhYmxlKSB7XG4gICAgICAgIGRlc2NyaXB0b3IgPSAkY3JlYXRlKGRlc2NyaXB0b3IsIHtlbnVtZXJhYmxlOiB7dmFsdWU6IGZhbHNlfX0pO1xuICAgICAgfVxuICAgICAgbmFtZSA9IG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxPYmplY3QoT2JqZWN0KSB7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jywge3ZhbHVlOiBkZWZpbmVQcm9wZXJ0eX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eU5hbWVzJywge3ZhbHVlOiBnZXRPd25Qcm9wZXJ0eU5hbWVzfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIHt2YWx1ZTogZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yfSk7XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdC5wcm90b3R5cGUsICdoYXNPd25Qcm9wZXJ0eScsIHt2YWx1ZTogaGFzT3duUHJvcGVydHl9KTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuICAgIGZ1bmN0aW9uIGlzKGxlZnQsIHJpZ2h0KSB7XG4gICAgICBpZiAobGVmdCA9PT0gcmlnaHQpXG4gICAgICAgIHJldHVybiBsZWZ0ICE9PSAwIHx8IDEgLyBsZWZ0ID09PSAxIC8gcmlnaHQ7XG4gICAgICByZXR1cm4gbGVmdCAhPT0gbGVmdCAmJiByaWdodCAhPT0gcmlnaHQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdpcycsIG1ldGhvZChpcykpO1xuICAgIGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkge1xuICAgICAgdmFyIHByb3BzID0gJGdldE93blByb3BlcnR5TmFtZXMoc291cmNlKTtcbiAgICAgIHZhciBwLFxuICAgICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICAgIGZvciAocCA9IDA7IHAgPCBsZW5ndGg7IHArKykge1xuICAgICAgICB0YXJnZXRbcHJvcHNbcF1dID0gc291cmNlW3Byb3BzW3BdXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdhc3NpZ24nLCBtZXRob2QoYXNzaWduKSk7XG4gICAgZnVuY3Rpb24gbWl4aW4odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgIHZhciBwcm9wcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSk7XG4gICAgICB2YXIgcCxcbiAgICAgICAgICBkZXNjcmlwdG9yLFxuICAgICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcbiAgICAgIGZvciAocCA9IDA7IHAgPCBsZW5ndGg7IHArKykge1xuICAgICAgICBkZXNjcmlwdG9yID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3BzW3BdKTtcbiAgICAgICAgJGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcHNbcF0sIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KE9iamVjdCwgJ21peGluJywgbWV0aG9kKG1peGluKSk7XG4gIH1cbiAgZnVuY3Rpb24gZXhwb3J0U3RhcihvYmplY3QpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMoYXJndW1lbnRzW2ldKTtcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbmFtZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgKGZ1bmN0aW9uKG1vZCwgbmFtZSkge1xuICAgICAgICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBtb2RbbmFtZV07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KShhcmd1bWVudHNbaV0sIG5hbWVzW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBmdW5jdGlvbiB0b09iamVjdCh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgdGhyb3cgJFR5cGVFcnJvcigpO1xuICAgIHJldHVybiAkT2JqZWN0KHZhbHVlKTtcbiAgfVxuICBmdW5jdGlvbiBzcHJlYWQoKSB7XG4gICAgdmFyIHJ2ID0gW10sXG4gICAgICAgIGsgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWVUb1NwcmVhZCA9IHRvT2JqZWN0KGFyZ3VtZW50c1tpXSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZhbHVlVG9TcHJlYWQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgcnZbaysrXSA9IHZhbHVlVG9TcHJlYWRbal07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBnZXRQcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKSB7XG4gICAgd2hpbGUgKG9iamVjdCAhPT0gbnVsbCkge1xuICAgICAgdmFyIHJlc3VsdCA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBuYW1lKTtcbiAgICAgIGlmIChyZXN1bHQpXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBvYmplY3QgPSAkZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSkge1xuICAgIHZhciBwcm90byA9ICRnZXRQcm90b3R5cGVPZihob21lT2JqZWN0KTtcbiAgICBpZiAoIXByb3RvKVxuICAgICAgdGhyb3cgJFR5cGVFcnJvcignc3VwZXIgaXMgbnVsbCcpO1xuICAgIHJldHVybiBnZXRQcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIG5hbWUpO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCBhcmdzKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBzdXBlckRlc2NyaXB0b3IoaG9tZU9iamVjdCwgbmFtZSk7XG4gICAgaWYgKGRlc2NyaXB0b3IpIHtcbiAgICAgIGlmICgndmFsdWUnIGluIGRlc2NyaXB0b3IpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLnZhbHVlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZ2V0KVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChzZWxmKS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG4gICAgdGhyb3cgJFR5cGVFcnJvcihcInN1cGVyIGhhcyBubyBtZXRob2QgJ1wiICsgbmFtZSArIFwiJy5cIik7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJHZXQoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICBpZiAoZGVzY3JpcHRvci5nZXQpXG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yLmdldC5jYWxsKHNlbGYpO1xuICAgICAgZWxzZSBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBzdXBlclNldChzZWxmLCBob21lT2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3Iuc2V0KSB7XG4gICAgICBkZXNjcmlwdG9yLnNldC5jYWxsKHNlbGYsIHZhbHVlKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdGhyb3cgJFR5cGVFcnJvcihcInN1cGVyIGhhcyBubyBzZXR0ZXIgJ1wiICsgbmFtZSArIFwiJy5cIik7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0RGVzY3JpcHRvcnMob2JqZWN0KSB7XG4gICAgdmFyIGRlc2NyaXB0b3JzID0ge30sXG4gICAgICAgIG5hbWUsXG4gICAgICAgIG5hbWVzID0gJGdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmFtZSA9IG5hbWVzW2ldO1xuICAgICAgZGVzY3JpcHRvcnNbbmFtZV0gPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBkZXNjcmlwdG9ycztcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVDbGFzcyhjdG9yLCBvYmplY3QsIHN0YXRpY09iamVjdCwgc3VwZXJDbGFzcykge1xuICAgICRkZWZpbmVQcm9wZXJ0eShvYmplY3QsICdjb25zdHJ1Y3RvcicsIHtcbiAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMykge1xuICAgICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBjdG9yLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9ICRjcmVhdGUoZ2V0UHJvdG9QYXJlbnQoc3VwZXJDbGFzcyksIGdldERlc2NyaXB0b3JzKG9iamVjdCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdG9yLnByb3RvdHlwZSA9IG9iamVjdDtcbiAgICB9XG4gICAgJGRlZmluZVByb3BlcnR5KGN0b3IsICdwcm90b3R5cGUnLCB7XG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlXG4gICAgfSk7XG4gICAgcmV0dXJuICRkZWZpbmVQcm9wZXJ0aWVzKGN0b3IsIGdldERlc2NyaXB0b3JzKHN0YXRpY09iamVjdCkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldFByb3RvUGFyZW50KHN1cGVyQ2xhc3MpIHtcbiAgICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBwcm90b3R5cGUgPSBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICAgIGlmICgkT2JqZWN0KHByb3RvdHlwZSkgPT09IHByb3RvdHlwZSB8fCBwcm90b3R5cGUgPT09IG51bGwpXG4gICAgICAgIHJldHVybiBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICB9XG4gICAgaWYgKHN1cGVyQ2xhc3MgPT09IG51bGwpXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gIH1cbiAgZnVuY3Rpb24gZGVmYXVsdFN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCBhcmdzKSB7XG4gICAgaWYgKCRnZXRQcm90b3R5cGVPZihob21lT2JqZWN0KSAhPT0gbnVsbClcbiAgICAgIHN1cGVyQ2FsbChzZWxmLCBob21lT2JqZWN0LCAnY29uc3RydWN0b3InLCBhcmdzKTtcbiAgfVxuICB2YXIgU1RfTkVXQk9STiA9IDA7XG4gIHZhciBTVF9FWEVDVVRJTkcgPSAxO1xuICB2YXIgU1RfU1VTUEVOREVEID0gMjtcbiAgdmFyIFNUX0NMT1NFRCA9IDM7XG4gIHZhciBFTkRfU1RBVEUgPSAtMjtcbiAgdmFyIFJFVEhST1dfU1RBVEUgPSAtMztcbiAgZnVuY3Rpb24gYWRkSXRlcmF0b3Iob2JqZWN0KSB7XG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KG9iamVjdCwgU3ltYm9sLml0ZXJhdG9yLCBub25FbnVtKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldEludGVybmFsRXJyb3Ioc3RhdGUpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKCdUcmFjZXVyIGNvbXBpbGVyIGJ1ZzogaW52YWxpZCBzdGF0ZSBpbiBzdGF0ZSBtYWNoaW5lOiAnICsgc3RhdGUpO1xuICB9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckNvbnRleHQoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IDA7XG4gICAgdGhpcy5HU3RhdGUgPSBTVF9ORVdCT1JOO1xuICAgIHRoaXMuc3RvcmVkRXhjZXB0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZmluYWxseUZhbGxUaHJvdWdoID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc2VudF8gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5yZXR1cm5WYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRyeVN0YWNrXyA9IFtdO1xuICB9XG4gIEdlbmVyYXRvckNvbnRleHQucHJvdG90eXBlID0ge1xuICAgIHB1c2hUcnk6IGZ1bmN0aW9uKGNhdGNoU3RhdGUsIGZpbmFsbHlTdGF0ZSkge1xuICAgICAgaWYgKGZpbmFsbHlTdGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgZmluYWxseUZhbGxUaHJvdWdoID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5U3RhY2tfLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKHRoaXMudHJ5U3RhY2tfW2ldLmNhdGNoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaCA9IHRoaXMudHJ5U3RhY2tfW2ldLmNhdGNoO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmaW5hbGx5RmFsbFRocm91Z2ggPT09IG51bGwpXG4gICAgICAgICAgZmluYWxseUZhbGxUaHJvdWdoID0gUkVUSFJPV19TVEFURTtcbiAgICAgICAgdGhpcy50cnlTdGFja18ucHVzaCh7XG4gICAgICAgICAgZmluYWxseTogZmluYWxseVN0YXRlLFxuICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaDogZmluYWxseUZhbGxUaHJvdWdoXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGNhdGNoU3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy50cnlTdGFja18ucHVzaCh7Y2F0Y2g6IGNhdGNoU3RhdGV9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHBvcFRyeTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnRyeVN0YWNrXy5wb3AoKTtcbiAgICB9LFxuICAgIGdldCBzZW50KCkge1xuICAgICAgdGhpcy5tYXliZVRocm93KCk7XG4gICAgICByZXR1cm4gdGhpcy5zZW50XztcbiAgICB9LFxuICAgIHNldCBzZW50KHYpIHtcbiAgICAgIHRoaXMuc2VudF8gPSB2O1xuICAgIH0sXG4gICAgZ2V0IHNlbnRJZ25vcmVUaHJvdygpIHtcbiAgICAgIHJldHVybiB0aGlzLnNlbnRfO1xuICAgIH0sXG4gICAgbWF5YmVUaHJvdzogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5hY3Rpb24gPT09ICd0aHJvdycpIHtcbiAgICAgICAgdGhpcy5hY3Rpb24gPSAnbmV4dCc7XG4gICAgICAgIHRocm93IHRoaXMuc2VudF87XG4gICAgICB9XG4gICAgfSxcbiAgICBlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgICAgIGNhc2UgRU5EX1NUQVRFOlxuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICBjYXNlIFJFVEhST1dfU1RBVEU6XG4gICAgICAgICAgdGhyb3cgdGhpcy5zdG9yZWRFeGNlcHRpb247XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgZ2V0SW50ZXJuYWxFcnJvcih0aGlzLnN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGZ1bmN0aW9uIGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsIGFjdGlvbikge1xuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICBzd2l0Y2ggKGN0eC5HU3RhdGUpIHtcbiAgICAgICAgY2FzZSBTVF9FWEVDVVRJTkc6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKChcIlxcXCJcIiArIGFjdGlvbiArIFwiXFxcIiBvbiBleGVjdXRpbmcgZ2VuZXJhdG9yXCIpKTtcbiAgICAgICAgY2FzZSBTVF9DTE9TRUQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKChcIlxcXCJcIiArIGFjdGlvbiArIFwiXFxcIiBvbiBjbG9zZWQgZ2VuZXJhdG9yXCIpKTtcbiAgICAgICAgY2FzZSBTVF9ORVdCT1JOOlxuICAgICAgICAgIGlmIChhY3Rpb24gPT09ICd0aHJvdycpIHtcbiAgICAgICAgICAgIGN0eC5HU3RhdGUgPSBTVF9DTE9TRUQ7XG4gICAgICAgICAgICB0aHJvdyB4O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoeCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhyb3cgJFR5cGVFcnJvcignU2VudCB2YWx1ZSB0byBuZXdib3JuIGdlbmVyYXRvcicpO1xuICAgICAgICBjYXNlIFNUX1NVU1BFTkRFRDpcbiAgICAgICAgICBjdHguR1N0YXRlID0gU1RfRVhFQ1VUSU5HO1xuICAgICAgICAgIGN0eC5hY3Rpb24gPSBhY3Rpb247XG4gICAgICAgICAgY3R4LnNlbnQgPSB4O1xuICAgICAgICAgIHZhciB2YWx1ZSA9IG1vdmVOZXh0KGN0eCk7XG4gICAgICAgICAgdmFyIGRvbmUgPSB2YWx1ZSA9PT0gY3R4O1xuICAgICAgICAgIGlmIChkb25lKVxuICAgICAgICAgICAgdmFsdWUgPSBjdHgucmV0dXJuVmFsdWU7XG4gICAgICAgICAgY3R4LkdTdGF0ZSA9IGRvbmUgPyBTVF9DTE9TRUQgOiBTVF9TVVNQRU5ERUQ7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGRvbmU6IGRvbmVcbiAgICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZ2VuZXJhdG9yV3JhcChpbm5lckZ1bmN0aW9uLCBzZWxmKSB7XG4gICAgdmFyIG1vdmVOZXh0ID0gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZik7XG4gICAgdmFyIGN0eCA9IG5ldyBHZW5lcmF0b3JDb250ZXh0KCk7XG4gICAgcmV0dXJuIGFkZEl0ZXJhdG9yKHtcbiAgICAgIG5leHQ6IGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsICduZXh0JyksXG4gICAgICB0aHJvdzogZ2V0TmV4dE9yVGhyb3coY3R4LCBtb3ZlTmV4dCwgJ3Rocm93JylcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBBc3luY0Z1bmN0aW9uQ29udGV4dCgpIHtcbiAgICBHZW5lcmF0b3JDb250ZXh0LmNhbGwodGhpcyk7XG4gICAgdGhpcy5lcnIgPSB1bmRlZmluZWQ7XG4gICAgdmFyIGN0eCA9IHRoaXM7XG4gICAgY3R4LnJlc3VsdCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgY3R4LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgY3R4LnJlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgfVxuICBBc3luY0Z1bmN0aW9uQ29udGV4dC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdlbmVyYXRvckNvbnRleHQucHJvdG90eXBlKTtcbiAgQXN5bmNGdW5jdGlvbkNvbnRleHQucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSBFTkRfU1RBVEU6XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgUkVUSFJPV19TVEFURTpcbiAgICAgICAgdGhpcy5yZWplY3QodGhpcy5zdG9yZWRFeGNlcHRpb24pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5yZWplY3QoZ2V0SW50ZXJuYWxFcnJvcih0aGlzLnN0YXRlKSk7XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBhc3luY1dyYXAoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHZhciBtb3ZlTmV4dCA9IGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpO1xuICAgIHZhciBjdHggPSBuZXcgQXN5bmNGdW5jdGlvbkNvbnRleHQoKTtcbiAgICBjdHguY3JlYXRlQ2FsbGJhY2sgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGN0eC5zdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgICBjdHgudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgbW92ZU5leHQoY3R4KTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBjdHguY3JlYXRlRXJyYmFjayA9IGZ1bmN0aW9uKG5ld1N0YXRlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGN0eC5zdGF0ZSA9IG5ld1N0YXRlO1xuICAgICAgICBjdHguZXJyID0gZXJyO1xuICAgICAgICBtb3ZlTmV4dChjdHgpO1xuICAgICAgfTtcbiAgICB9O1xuICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgcmV0dXJuIGN0eC5yZXN1bHQ7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0TW92ZU5leHQoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHJldHVybiBmdW5jdGlvbihjdHgpIHtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIGlubmVyRnVuY3Rpb24uY2FsbChzZWxmLCBjdHgpO1xuICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgIGN0eC5zdG9yZWRFeGNlcHRpb24gPSBleDtcbiAgICAgICAgICB2YXIgbGFzdCA9IGN0eC50cnlTdGFja19bY3R4LnRyeVN0YWNrXy5sZW5ndGggLSAxXTtcbiAgICAgICAgICBpZiAoIWxhc3QpIHtcbiAgICAgICAgICAgIGN0eC5HU3RhdGUgPSBTVF9DTE9TRUQ7XG4gICAgICAgICAgICBjdHguc3RhdGUgPSBFTkRfU1RBVEU7XG4gICAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3R4LnN0YXRlID0gbGFzdC5jYXRjaCAhPT0gdW5kZWZpbmVkID8gbGFzdC5jYXRjaCA6IGxhc3QuZmluYWxseTtcbiAgICAgICAgICBpZiAobGFzdC5maW5hbGx5RmFsbFRocm91Z2ggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGN0eC5maW5hbGx5RmFsbFRocm91Z2ggPSBsYXN0LmZpbmFsbHlGYWxsVGhyb3VnaDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gc2V0dXBHbG9iYWxzKGdsb2JhbCkge1xuICAgIGdsb2JhbC5TeW1ib2wgPSBTeW1ib2w7XG4gICAgcG9seWZpbGxPYmplY3QoZ2xvYmFsLk9iamVjdCk7XG4gIH1cbiAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gIGdsb2JhbC4kdHJhY2V1clJ1bnRpbWUgPSB7XG4gICAgYXN5bmNXcmFwOiBhc3luY1dyYXAsXG4gICAgY3JlYXRlQ2xhc3M6IGNyZWF0ZUNsYXNzLFxuICAgIGRlZmF1bHRTdXBlckNhbGw6IGRlZmF1bHRTdXBlckNhbGwsXG4gICAgZXhwb3J0U3RhcjogZXhwb3J0U3RhcixcbiAgICBnZW5lcmF0b3JXcmFwOiBnZW5lcmF0b3JXcmFwLFxuICAgIHNldFByb3BlcnR5OiBzZXRQcm9wZXJ0eSxcbiAgICBzZXR1cEdsb2JhbHM6IHNldHVwR2xvYmFscyxcbiAgICBzcHJlYWQ6IHNwcmVhZCxcbiAgICBzdXBlckNhbGw6IHN1cGVyQ2FsbCxcbiAgICBzdXBlckdldDogc3VwZXJHZXQsXG4gICAgc3VwZXJTZXQ6IHN1cGVyU2V0LFxuICAgIHRvT2JqZWN0OiB0b09iamVjdCxcbiAgICB0b1Byb3BlcnR5OiB0b1Byb3BlcnR5LFxuICAgIHR5cGU6IHR5cGVzLFxuICAgIHR5cGVvZjogdHlwZU9mXG4gIH07XG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpO1xuKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBidWlsZEZyb21FbmNvZGVkUGFydHMob3B0X3NjaGVtZSwgb3B0X3VzZXJJbmZvLCBvcHRfZG9tYWluLCBvcHRfcG9ydCwgb3B0X3BhdGgsIG9wdF9xdWVyeURhdGEsIG9wdF9mcmFnbWVudCkge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICBpZiAob3B0X3NjaGVtZSkge1xuICAgICAgb3V0LnB1c2gob3B0X3NjaGVtZSwgJzonKTtcbiAgICB9XG4gICAgaWYgKG9wdF9kb21haW4pIHtcbiAgICAgIG91dC5wdXNoKCcvLycpO1xuICAgICAgaWYgKG9wdF91c2VySW5mbykge1xuICAgICAgICBvdXQucHVzaChvcHRfdXNlckluZm8sICdAJyk7XG4gICAgICB9XG4gICAgICBvdXQucHVzaChvcHRfZG9tYWluKTtcbiAgICAgIGlmIChvcHRfcG9ydCkge1xuICAgICAgICBvdXQucHVzaCgnOicsIG9wdF9wb3J0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9wdF9wYXRoKSB7XG4gICAgICBvdXQucHVzaChvcHRfcGF0aCk7XG4gICAgfVxuICAgIGlmIChvcHRfcXVlcnlEYXRhKSB7XG4gICAgICBvdXQucHVzaCgnPycsIG9wdF9xdWVyeURhdGEpO1xuICAgIH1cbiAgICBpZiAob3B0X2ZyYWdtZW50KSB7XG4gICAgICBvdXQucHVzaCgnIycsIG9wdF9mcmFnbWVudCk7XG4gICAgfVxuICAgIHJldHVybiBvdXQuam9pbignJyk7XG4gIH1cbiAgO1xuICB2YXIgc3BsaXRSZSA9IG5ldyBSZWdFeHAoJ14nICsgJyg/OicgKyAnKFteOi8/Iy5dKyknICsgJzopPycgKyAnKD86Ly8nICsgJyg/OihbXi8/I10qKUApPycgKyAnKFtcXFxcd1xcXFxkXFxcXC1cXFxcdTAxMDAtXFxcXHVmZmZmLiVdKiknICsgJyg/OjooWzAtOV0rKSk/JyArICcpPycgKyAnKFtePyNdKyk/JyArICcoPzpcXFxcPyhbXiNdKikpPycgKyAnKD86IyguKikpPycgKyAnJCcpO1xuICB2YXIgQ29tcG9uZW50SW5kZXggPSB7XG4gICAgU0NIRU1FOiAxLFxuICAgIFVTRVJfSU5GTzogMixcbiAgICBET01BSU46IDMsXG4gICAgUE9SVDogNCxcbiAgICBQQVRIOiA1LFxuICAgIFFVRVJZX0RBVEE6IDYsXG4gICAgRlJBR01FTlQ6IDdcbiAgfTtcbiAgZnVuY3Rpb24gc3BsaXQodXJpKSB7XG4gICAgcmV0dXJuICh1cmkubWF0Y2goc3BsaXRSZSkpO1xuICB9XG4gIGZ1bmN0aW9uIHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJy8nKVxuICAgICAgcmV0dXJuICcvJztcbiAgICB2YXIgbGVhZGluZ1NsYXNoID0gcGF0aFswXSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgdmFyIHRyYWlsaW5nU2xhc2ggPSBwYXRoLnNsaWNlKC0xKSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgdmFyIHNlZ21lbnRzID0gcGF0aC5zcGxpdCgnLycpO1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICB2YXIgdXAgPSAwO1xuICAgIGZvciAodmFyIHBvcyA9IDA7IHBvcyA8IHNlZ21lbnRzLmxlbmd0aDsgcG9zKyspIHtcbiAgICAgIHZhciBzZWdtZW50ID0gc2VnbWVudHNbcG9zXTtcbiAgICAgIHN3aXRjaCAoc2VnbWVudCkge1xuICAgICAgICBjYXNlICcnOlxuICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLi4nOlxuICAgICAgICAgIGlmIChvdXQubGVuZ3RoKVxuICAgICAgICAgICAgb3V0LnBvcCgpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHVwKys7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgb3V0LnB1c2goc2VnbWVudCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghbGVhZGluZ1NsYXNoKSB7XG4gICAgICB3aGlsZSAodXAtLSA+IDApIHtcbiAgICAgICAgb3V0LnVuc2hpZnQoJy4uJyk7XG4gICAgICB9XG4gICAgICBpZiAob3V0Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgb3V0LnB1c2goJy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIGxlYWRpbmdTbGFzaCArIG91dC5qb2luKCcvJykgKyB0cmFpbGluZ1NsYXNoO1xuICB9XG4gIGZ1bmN0aW9uIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKSB7XG4gICAgdmFyIHBhdGggPSBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSB8fCAnJztcbiAgICBwYXRoID0gcmVtb3ZlRG90U2VnbWVudHMocGF0aCk7XG4gICAgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gPSBwYXRoO1xuICAgIHJldHVybiBidWlsZEZyb21FbmNvZGVkUGFydHMocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSwgcGFydHNbQ29tcG9uZW50SW5kZXguVVNFUl9JTkZPXSwgcGFydHNbQ29tcG9uZW50SW5kZXguRE9NQUlOXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUE9SVF0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5RVUVSWV9EQVRBXSwgcGFydHNbQ29tcG9uZW50SW5kZXguRlJBR01FTlRdKTtcbiAgfVxuICBmdW5jdGlvbiBjYW5vbmljYWxpemVVcmwodXJsKSB7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQodXJsKTtcbiAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICB9XG4gIGZ1bmN0aW9uIHJlc29sdmVVcmwoYmFzZSwgdXJsKSB7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQodXJsKTtcbiAgICB2YXIgYmFzZVBhcnRzID0gc3BsaXQoYmFzZSk7XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0pIHtcbiAgICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0gPSBiYXNlUGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IENvbXBvbmVudEluZGV4LlNDSEVNRTsgaSA8PSBDb21wb25lbnRJbmRleC5QT1JUOyBpKyspIHtcbiAgICAgIGlmICghcGFydHNbaV0pIHtcbiAgICAgICAgcGFydHNbaV0gPSBiYXNlUGFydHNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXVswXSA9PSAnLycpIHtcbiAgICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gICAgfVxuICAgIHZhciBwYXRoID0gYmFzZVBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdO1xuICAgIHZhciBpbmRleCA9IHBhdGgubGFzdEluZGV4T2YoJy8nKTtcbiAgICBwYXRoID0gcGF0aC5zbGljZSgwLCBpbmRleCArIDEpICsgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF07XG4gICAgcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gPSBwYXRoO1xuICAgIHJldHVybiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cyk7XG4gIH1cbiAgZnVuY3Rpb24gaXNBYnNvbHV0ZShuYW1lKSB7XG4gICAgaWYgKCFuYW1lKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChuYW1lWzBdID09PSAnLycpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB2YXIgcGFydHMgPSBzcGxpdChuYW1lKTtcbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguU0NIRU1FXSlcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAkdHJhY2V1clJ1bnRpbWUuY2Fub25pY2FsaXplVXJsID0gY2Fub25pY2FsaXplVXJsO1xuICAkdHJhY2V1clJ1bnRpbWUuaXNBYnNvbHV0ZSA9IGlzQWJzb2x1dGU7XG4gICR0cmFjZXVyUnVudGltZS5yZW1vdmVEb3RTZWdtZW50cyA9IHJlbW92ZURvdFNlZ21lbnRzO1xuICAkdHJhY2V1clJ1bnRpbWUucmVzb2x2ZVVybCA9IHJlc29sdmVVcmw7XG59KSgpO1xuKGZ1bmN0aW9uKGdsb2JhbCkge1xuICAndXNlIHN0cmljdCc7XG4gIHZhciAkX18yID0gJHRyYWNldXJSdW50aW1lLFxuICAgICAgY2Fub25pY2FsaXplVXJsID0gJF9fMi5jYW5vbmljYWxpemVVcmwsXG4gICAgICByZXNvbHZlVXJsID0gJF9fMi5yZXNvbHZlVXJsLFxuICAgICAgaXNBYnNvbHV0ZSA9ICRfXzIuaXNBYnNvbHV0ZTtcbiAgdmFyIG1vZHVsZUluc3RhbnRpYXRvcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2YXIgYmFzZVVSTDtcbiAgaWYgKGdsb2JhbC5sb2NhdGlvbiAmJiBnbG9iYWwubG9jYXRpb24uaHJlZilcbiAgICBiYXNlVVJMID0gcmVzb2x2ZVVybChnbG9iYWwubG9jYXRpb24uaHJlZiwgJy4vJyk7XG4gIGVsc2VcbiAgICBiYXNlVVJMID0gJyc7XG4gIHZhciBVbmNvYXRlZE1vZHVsZUVudHJ5ID0gZnVuY3Rpb24gVW5jb2F0ZWRNb2R1bGVFbnRyeSh1cmwsIHVuY29hdGVkTW9kdWxlKSB7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy52YWx1ZV8gPSB1bmNvYXRlZE1vZHVsZTtcbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoVW5jb2F0ZWRNb2R1bGVFbnRyeSwge30sIHt9KTtcbiAgdmFyIFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yID0gZnVuY3Rpb24gVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IodXJsLCBmdW5jKSB7XG4gICAgJHRyYWNldXJSdW50aW1lLnN1cGVyQ2FsbCh0aGlzLCAkVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3IucHJvdG90eXBlLCBcImNvbnN0cnVjdG9yXCIsIFt1cmwsIG51bGxdKTtcbiAgICB0aGlzLmZ1bmMgPSBmdW5jO1xuICB9O1xuICB2YXIgJFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yID0gVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3I7XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yLCB7Z2V0VW5jb2F0ZWRNb2R1bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudmFsdWVfKVxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZV87XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZV8gPSB0aGlzLmZ1bmMuY2FsbChnbG9iYWwpO1xuICAgIH19LCB7fSwgVW5jb2F0ZWRNb2R1bGVFbnRyeSk7XG4gIGZ1bmN0aW9uIGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5hbWUpIHtcbiAgICBpZiAoIW5hbWUpXG4gICAgICByZXR1cm47XG4gICAgdmFyIHVybCA9IE1vZHVsZVN0b3JlLm5vcm1hbGl6ZShuYW1lKTtcbiAgICByZXR1cm4gbW9kdWxlSW5zdGFudGlhdG9yc1t1cmxdO1xuICB9XG4gIDtcbiAgdmFyIG1vZHVsZUluc3RhbmNlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHZhciBsaXZlTW9kdWxlU2VudGluZWwgPSB7fTtcbiAgZnVuY3Rpb24gTW9kdWxlKHVuY29hdGVkTW9kdWxlKSB7XG4gICAgdmFyIGlzTGl2ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICB2YXIgY29hdGVkTW9kdWxlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh1bmNvYXRlZE1vZHVsZSkuZm9yRWFjaCgoZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGdldHRlcixcbiAgICAgICAgICB2YWx1ZTtcbiAgICAgIGlmIChpc0xpdmUgPT09IGxpdmVNb2R1bGVTZW50aW5lbCkge1xuICAgICAgICB2YXIgZGVzY3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHVuY29hdGVkTW9kdWxlLCBuYW1lKTtcbiAgICAgICAgaWYgKGRlc2NyLmdldClcbiAgICAgICAgICBnZXR0ZXIgPSBkZXNjci5nZXQ7XG4gICAgICB9XG4gICAgICBpZiAoIWdldHRlcikge1xuICAgICAgICB2YWx1ZSA9IHVuY29hdGVkTW9kdWxlW25hbWVdO1xuICAgICAgICBnZXR0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29hdGVkTW9kdWxlLCBuYW1lLCB7XG4gICAgICAgIGdldDogZ2V0dGVyLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9KSk7XG4gICAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKGNvYXRlZE1vZHVsZSk7XG4gICAgcmV0dXJuIGNvYXRlZE1vZHVsZTtcbiAgfVxuICB2YXIgTW9kdWxlU3RvcmUgPSB7XG4gICAgbm9ybWFsaXplOiBmdW5jdGlvbihuYW1lLCByZWZlcmVyTmFtZSwgcmVmZXJlckFkZHJlc3MpIHtcbiAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIilcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIm1vZHVsZSBuYW1lIG11c3QgYmUgYSBzdHJpbmcsIG5vdCBcIiArIHR5cGVvZiBuYW1lKTtcbiAgICAgIGlmIChpc0Fic29sdXRlKG5hbWUpKVxuICAgICAgICByZXR1cm4gY2Fub25pY2FsaXplVXJsKG5hbWUpO1xuICAgICAgaWYgKC9bXlxcLl1cXC9cXC5cXC5cXC8vLnRlc3QobmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtb2R1bGUgbmFtZSBlbWJlZHMgLy4uLzogJyArIG5hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG5hbWVbMF0gPT09ICcuJyAmJiByZWZlcmVyTmFtZSlcbiAgICAgICAgcmV0dXJuIHJlc29sdmVVcmwocmVmZXJlck5hbWUsIG5hbWUpO1xuICAgICAgcmV0dXJuIGNhbm9uaWNhbGl6ZVVybChuYW1lKTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24obm9ybWFsaXplZE5hbWUpIHtcbiAgICAgIHZhciBtID0gZ2V0VW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUpO1xuICAgICAgaWYgKCFtKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgdmFyIG1vZHVsZUluc3RhbmNlID0gbW9kdWxlSW5zdGFuY2VzW20udXJsXTtcbiAgICAgIGlmIChtb2R1bGVJbnN0YW5jZSlcbiAgICAgICAgcmV0dXJuIG1vZHVsZUluc3RhbmNlO1xuICAgICAgbW9kdWxlSW5zdGFuY2UgPSBNb2R1bGUobS5nZXRVbmNvYXRlZE1vZHVsZSgpLCBsaXZlTW9kdWxlU2VudGluZWwpO1xuICAgICAgcmV0dXJuIG1vZHVsZUluc3RhbmNlc1ttLnVybF0gPSBtb2R1bGVJbnN0YW5jZTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24obm9ybWFsaXplZE5hbWUsIG1vZHVsZSkge1xuICAgICAgbm9ybWFsaXplZE5hbWUgPSBTdHJpbmcobm9ybWFsaXplZE5hbWUpO1xuICAgICAgbW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0gPSBuZXcgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUsIChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG1vZHVsZTtcbiAgICAgIH0pKTtcbiAgICAgIG1vZHVsZUluc3RhbmNlc1tub3JtYWxpemVkTmFtZV0gPSBtb2R1bGU7XG4gICAgfSxcbiAgICBnZXQgYmFzZVVSTCgpIHtcbiAgICAgIHJldHVybiBiYXNlVVJMO1xuICAgIH0sXG4gICAgc2V0IGJhc2VVUkwodikge1xuICAgICAgYmFzZVVSTCA9IFN0cmluZyh2KTtcbiAgICB9LFxuICAgIHJlZ2lzdGVyTW9kdWxlOiBmdW5jdGlvbihuYW1lLCBmdW5jKSB7XG4gICAgICB2YXIgbm9ybWFsaXplZE5hbWUgPSBNb2R1bGVTdG9yZS5ub3JtYWxpemUobmFtZSk7XG4gICAgICBpZiAobW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZHVwbGljYXRlIG1vZHVsZSBuYW1lZCAnICsgbm9ybWFsaXplZE5hbWUpO1xuICAgICAgbW9kdWxlSW5zdGFudGlhdG9yc1tub3JtYWxpemVkTmFtZV0gPSBuZXcgVW5jb2F0ZWRNb2R1bGVJbnN0YW50aWF0b3Iobm9ybWFsaXplZE5hbWUsIGZ1bmMpO1xuICAgIH0sXG4gICAgYnVuZGxlU3RvcmU6IE9iamVjdC5jcmVhdGUobnVsbCksXG4gICAgcmVnaXN0ZXI6IGZ1bmN0aW9uKG5hbWUsIGRlcHMsIGZ1bmMpIHtcbiAgICAgIGlmICghZGVwcyB8fCAhZGVwcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5yZWdpc3Rlck1vZHVsZShuYW1lLCBmdW5jKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYnVuZGxlU3RvcmVbbmFtZV0gPSB7XG4gICAgICAgICAgZGVwczogZGVwcyxcbiAgICAgICAgICBleGVjdXRlOiBmdW5jXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXRBbm9ueW1vdXNNb2R1bGU6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgIHJldHVybiBuZXcgTW9kdWxlKGZ1bmMuY2FsbChnbG9iYWwpLCBsaXZlTW9kdWxlU2VudGluZWwpO1xuICAgIH0sXG4gICAgZ2V0Rm9yVGVzdGluZzogZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyICRfXzAgPSB0aGlzO1xuICAgICAgaWYgKCF0aGlzLnRlc3RpbmdQcmVmaXhfKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG1vZHVsZUluc3RhbmNlcykuc29tZSgoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgdmFyIG0gPSAvKHRyYWNldXJAW15cXC9dKlxcLykvLmV4ZWMoa2V5KTtcbiAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgJF9fMC50ZXN0aW5nUHJlZml4XyA9IG1bMV07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldCh0aGlzLnRlc3RpbmdQcmVmaXhfICsgbmFtZSk7XG4gICAgfVxuICB9O1xuICBNb2R1bGVTdG9yZS5zZXQoJ0B0cmFjZXVyL3NyYy9ydW50aW1lL01vZHVsZVN0b3JlJywgbmV3IE1vZHVsZSh7TW9kdWxlU3RvcmU6IE1vZHVsZVN0b3JlfSkpO1xuICB2YXIgc2V0dXBHbG9iYWxzID0gJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscztcbiAgJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscyA9IGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICB9O1xuICAkdHJhY2V1clJ1bnRpbWUuTW9kdWxlU3RvcmUgPSBNb2R1bGVTdG9yZTtcbiAgZ2xvYmFsLlN5c3RlbSA9IHtcbiAgICByZWdpc3RlcjogTW9kdWxlU3RvcmUucmVnaXN0ZXIuYmluZChNb2R1bGVTdG9yZSksXG4gICAgZ2V0OiBNb2R1bGVTdG9yZS5nZXQsXG4gICAgc2V0OiBNb2R1bGVTdG9yZS5zZXQsXG4gICAgbm9ybWFsaXplOiBNb2R1bGVTdG9yZS5ub3JtYWxpemVcbiAgfTtcbiAgJHRyYWNldXJSdW50aW1lLmdldE1vZHVsZUltcGwgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGluc3RhbnRpYXRvciA9IGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5hbWUpO1xuICAgIHJldHVybiBpbnN0YW50aWF0b3IgJiYgaW5zdGFudGlhdG9yLmdldFVuY29hdGVkTW9kdWxlKCk7XG4gIH07XG59KSh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMpO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIjtcbiAgdmFyIHRvT2JqZWN0ID0gJHRyYWNldXJSdW50aW1lLnRvT2JqZWN0O1xuICBmdW5jdGlvbiB0b1VpbnQzMih4KSB7XG4gICAgcmV0dXJuIHggfCAwO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IHRvT2JqZWN0KCkge1xuICAgICAgcmV0dXJuIHRvT2JqZWN0O1xuICAgIH0sXG4gICAgZ2V0IHRvVWludDMyKCkge1xuICAgICAgcmV0dXJuIHRvVWludDMyO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgJF9fNDtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiO1xuICB2YXIgJF9fNSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy91dGlsc1wiKSxcbiAgICAgIHRvT2JqZWN0ID0gJF9fNS50b09iamVjdCxcbiAgICAgIHRvVWludDMyID0gJF9fNS50b1VpbnQzMjtcbiAgdmFyIEFSUkFZX0lURVJBVE9SX0tJTkRfS0VZUyA9IDE7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUyA9IDI7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMgPSAzO1xuICB2YXIgQXJyYXlJdGVyYXRvciA9IGZ1bmN0aW9uIEFycmF5SXRlcmF0b3IoKSB7fTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoQXJyYXlJdGVyYXRvciwgKCRfXzQgPSB7fSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KCRfXzQsIFwibmV4dFwiLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gdG9PYmplY3QodGhpcyk7XG4gICAgICB2YXIgYXJyYXkgPSBpdGVyYXRvci5pdGVyYXRvck9iamVjdF87XG4gICAgICBpZiAoIWFycmF5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBpcyBub3QgYW4gQXJyYXlJdGVyYXRvcicpO1xuICAgICAgfVxuICAgICAgdmFyIGluZGV4ID0gaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF87XG4gICAgICB2YXIgaXRlbUtpbmQgPSBpdGVyYXRvci5hcnJheUl0ZXJhdGlvbktpbmRfO1xuICAgICAgdmFyIGxlbmd0aCA9IHRvVWludDMyKGFycmF5Lmxlbmd0aCk7XG4gICAgICBpZiAoaW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gSW5maW5pdHk7XG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfVxuICAgICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSBpbmRleCArIDE7XG4gICAgICBpZiAoaXRlbUtpbmQgPT0gQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMpXG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChhcnJheVtpbmRleF0sIGZhbHNlKTtcbiAgICAgIGlmIChpdGVtS2luZCA9PSBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMpXG4gICAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChbaW5kZXgsIGFycmF5W2luZGV4XV0sIGZhbHNlKTtcbiAgICAgIHJldHVybiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdChpbmRleCwgZmFsc2UpO1xuICAgIH0sXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWVcbiAgfSksIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX180LCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCAkX180KSwge30pO1xuICBmdW5jdGlvbiBjcmVhdGVBcnJheUl0ZXJhdG9yKGFycmF5LCBraW5kKSB7XG4gICAgdmFyIG9iamVjdCA9IHRvT2JqZWN0KGFycmF5KTtcbiAgICB2YXIgaXRlcmF0b3IgPSBuZXcgQXJyYXlJdGVyYXRvcjtcbiAgICBpdGVyYXRvci5pdGVyYXRvck9iamVjdF8gPSBvYmplY3Q7XG4gICAgaXRlcmF0b3IuYXJyYXlJdGVyYXRvck5leHRJbmRleF8gPSAwO1xuICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0aW9uS2luZF8gPSBraW5kO1xuICAgIHJldHVybiBpdGVyYXRvcjtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVJdGVyYXRvclJlc3VsdE9iamVjdCh2YWx1ZSwgZG9uZSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBkb25lOiBkb25lXG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiBlbnRyaWVzKCkge1xuICAgIHJldHVybiBjcmVhdGVBcnJheUl0ZXJhdG9yKHRoaXMsIEFSUkFZX0lURVJBVE9SX0tJTkRfRU5UUklFUyk7XG4gIH1cbiAgZnVuY3Rpb24ga2V5cygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX0tFWVMpO1xuICB9XG4gIGZ1bmN0aW9uIHZhbHVlcygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX1ZBTFVFUyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgZW50cmllcygpIHtcbiAgICAgIHJldHVybiBlbnRyaWVzO1xuICAgIH0sXG4gICAgZ2V0IGtleXMoKSB7XG4gICAgICByZXR1cm4ga2V5cztcbiAgICB9LFxuICAgIGdldCB2YWx1ZXMoKSB7XG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9ub2RlX21vZHVsZXMvcnN2cC9saWIvcnN2cC9hc2FwXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiO1xuICB2YXIgJF9fZGVmYXVsdCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICAgIHZhciBsZW5ndGggPSBxdWV1ZS5wdXNoKFtjYWxsYmFjaywgYXJnXSk7XG4gICAgaWYgKGxlbmd0aCA9PT0gMSkge1xuICAgICAgc2NoZWR1bGVGbHVzaCgpO1xuICAgIH1cbiAgfTtcbiAgdmFyIGJyb3dzZXJHbG9iYWwgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpID8gd2luZG93IDoge307XG4gIHZhciBCcm93c2VyTXV0YXRpb25PYnNlcnZlciA9IGJyb3dzZXJHbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG4gIGZ1bmN0aW9uIHVzZU5leHRUaWNrKCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgdmFyIG9ic2VydmVyID0gbmV3IEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKGZsdXNoKTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgbm9kZS5kYXRhID0gKGl0ZXJhdGlvbnMgPSArK2l0ZXJhdGlvbnMgJSAyKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZVNldFRpbWVvdXQoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmbHVzaCwgMSk7XG4gICAgfTtcbiAgfVxuICB2YXIgcXVldWUgPSBbXTtcbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHR1cGxlID0gcXVldWVbaV07XG4gICAgICB2YXIgY2FsbGJhY2sgPSB0dXBsZVswXSxcbiAgICAgICAgICBhcmcgPSB0dXBsZVsxXTtcbiAgICAgIGNhbGxiYWNrKGFyZyk7XG4gICAgfVxuICAgIHF1ZXVlID0gW107XG4gIH1cbiAgdmFyIHNjaGVkdWxlRmx1c2g7XG4gIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZU5leHRUaWNrKCk7XG4gIH0gZWxzZSBpZiAoQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlTXV0YXRpb25PYnNlcnZlcigpO1xuICB9IGVsc2Uge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VTZXRUaW1lb3V0KCk7XG4gIH1cbiAgcmV0dXJuIHtnZXQgZGVmYXVsdCgpIHtcbiAgICAgIHJldHVybiAkX19kZWZhdWx0O1xuICAgIH19O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2VcIjtcbiAgdmFyIGFzeW5jID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiKS5kZWZhdWx0O1xuICBmdW5jdGlvbiBpc1Byb21pc2UoeCkge1xuICAgIHJldHVybiB4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiB4LnN0YXR1c18gIT09IHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBjaGFpbihwcm9taXNlKSB7XG4gICAgdmFyIG9uUmVzb2x2ZSA9IGFyZ3VtZW50c1sxXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMV0gOiAoZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfSk7XG4gICAgdmFyIG9uUmVqZWN0ID0gYXJndW1lbnRzWzJdICE9PSAodm9pZCAwKSA/IGFyZ3VtZW50c1syXSA6IChmdW5jdGlvbihlKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH0pO1xuICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHByb21pc2UuY29uc3RydWN0b3IpO1xuICAgIHN3aXRjaCAocHJvbWlzZS5zdGF0dXNfKSB7XG4gICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yO1xuICAgICAgY2FzZSAncGVuZGluZyc6XG4gICAgICAgIHByb21pc2Uub25SZXNvbHZlXy5wdXNoKFtkZWZlcnJlZCwgb25SZXNvbHZlXSk7XG4gICAgICAgIHByb21pc2Uub25SZWplY3RfLnB1c2goW2RlZmVycmVkLCBvblJlamVjdF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jlc29sdmVkJzpcbiAgICAgICAgcHJvbWlzZVJlYWN0KGRlZmVycmVkLCBvblJlc29sdmUsIHByb21pc2UudmFsdWVfKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZWplY3RlZCc6XG4gICAgICAgIHByb21pc2VSZWFjdChkZWZlcnJlZCwgb25SZWplY3QsIHByb21pc2UudmFsdWVfKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG4gIGZ1bmN0aW9uIGdldERlZmVycmVkKEMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgcmVzdWx0LnByb21pc2UgPSBuZXcgQygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXN1bHQucmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICByZXN1bHQucmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHZhciBQcm9taXNlID0gZnVuY3Rpb24gUHJvbWlzZShyZXNvbHZlcikge1xuICAgIHZhciAkX182ID0gdGhpcztcbiAgICB0aGlzLnN0YXR1c18gPSAncGVuZGluZyc7XG4gICAgdGhpcy5vblJlc29sdmVfID0gW107XG4gICAgdGhpcy5vblJlamVjdF8gPSBbXTtcbiAgICByZXNvbHZlcigoZnVuY3Rpb24oeCkge1xuICAgICAgcHJvbWlzZVJlc29sdmUoJF9fNiwgeCk7XG4gICAgfSksIChmdW5jdGlvbihyKSB7XG4gICAgICBwcm9taXNlUmVqZWN0KCRfXzYsIHIpO1xuICAgIH0pKTtcbiAgfTtcbiAgKCR0cmFjZXVyUnVudGltZS5jcmVhdGVDbGFzcykoUHJvbWlzZSwge1xuICAgIGNhdGNoOiBmdW5jdGlvbihvblJlamVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0KTtcbiAgICB9LFxuICAgIHRoZW46IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9uUmVzb2x2ZSA9IGFyZ3VtZW50c1swXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMF0gOiAoZnVuY3Rpb24oeCkge1xuICAgICAgICByZXR1cm4geDtcbiAgICAgIH0pO1xuICAgICAgdmFyIG9uUmVqZWN0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgdmFyICRfXzYgPSB0aGlzO1xuICAgICAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgICAgIHJldHVybiBjaGFpbih0aGlzLCAoZnVuY3Rpb24oeCkge1xuICAgICAgICB4ID0gcHJvbWlzZUNvZXJjZShjb25zdHJ1Y3RvciwgeCk7XG4gICAgICAgIHJldHVybiB4ID09PSAkX182ID8gb25SZWplY3QobmV3IFR5cGVFcnJvcikgOiBpc1Byb21pc2UoeCkgPyB4LnRoZW4ob25SZXNvbHZlLCBvblJlamVjdCkgOiBvblJlc29sdmUoeCk7XG4gICAgICB9KSwgb25SZWplY3QpO1xuICAgIH1cbiAgfSwge1xuICAgIHJlc29sdmU6IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlc29sdmUoeCk7XG4gICAgICB9KSk7XG4gICAgfSxcbiAgICByZWplY3Q6IGZ1bmN0aW9uKHIpIHtcbiAgICAgIHJldHVybiBuZXcgdGhpcygoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJlamVjdChyKTtcbiAgICAgIH0pKTtcbiAgICB9LFxuICAgIGNhc3Q6IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICh4IGluc3RhbmNlb2YgdGhpcylcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgICBpZiAoaXNQcm9taXNlKHgpKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgICAgY2hhaW4oeCwgcmVzdWx0LnJlc29sdmUsIHJlc3VsdC5yZWplY3QpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LnByb21pc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKHgpO1xuICAgIH0sXG4gICAgYWxsOiBmdW5jdGlvbih2YWx1ZXMpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9IGdldERlZmVycmVkKHRoaXMpO1xuICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgIHZhciByZXNvbHV0aW9ucyA9IFtdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICArK2NvdW50O1xuICAgICAgICAgIHRoaXMuY2FzdCh2YWx1ZXNbaV0pLnRoZW4oZnVuY3Rpb24oaSwgeCkge1xuICAgICAgICAgICAgcmVzb2x1dGlvbnNbaV0gPSB4O1xuICAgICAgICAgICAgaWYgKC0tY291bnQgPT09IDApXG4gICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzb2x1dGlvbnMpO1xuICAgICAgICAgIH0uYmluZCh1bmRlZmluZWQsIGkpLCAoZnVuY3Rpb24ocikge1xuICAgICAgICAgICAgaWYgKGNvdW50ID4gMClcbiAgICAgICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHIpO1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY291bnQgPT09IDApXG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNvbHV0aW9ucyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0sXG4gICAgcmFjZTogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5jYXN0KHZhbHVlc1tpXSkudGhlbigoZnVuY3Rpb24oeCkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh4KTtcbiAgICAgICAgICB9KSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuICB9KTtcbiAgZnVuY3Rpb24gcHJvbWlzZVJlc29sdmUocHJvbWlzZSwgeCkge1xuICAgIHByb21pc2VEb25lKHByb21pc2UsICdyZXNvbHZlZCcsIHgsIHByb21pc2Uub25SZXNvbHZlXyk7XG4gIH1cbiAgZnVuY3Rpb24gcHJvbWlzZVJlamVjdChwcm9taXNlLCByKSB7XG4gICAgcHJvbWlzZURvbmUocHJvbWlzZSwgJ3JlamVjdGVkJywgciwgcHJvbWlzZS5vblJlamVjdF8pO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VEb25lKHByb21pc2UsIHN0YXR1cywgdmFsdWUsIHJlYWN0aW9ucykge1xuICAgIGlmIChwcm9taXNlLnN0YXR1c18gIT09ICdwZW5kaW5nJylcbiAgICAgIHJldHVybjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlYWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgcHJvbWlzZVJlYWN0KHJlYWN0aW9uc1tpXVswXSwgcmVhY3Rpb25zW2ldWzFdLCB2YWx1ZSk7XG4gICAgfVxuICAgIHByb21pc2Uuc3RhdHVzXyA9IHN0YXR1cztcbiAgICBwcm9taXNlLnZhbHVlXyA9IHZhbHVlO1xuICAgIHByb21pc2Uub25SZXNvbHZlXyA9IHByb21pc2Uub25SZWplY3RfID0gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VSZWFjdChkZWZlcnJlZCwgaGFuZGxlciwgeCkge1xuICAgIGFzeW5jKChmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciB5ID0gaGFuZGxlcih4KTtcbiAgICAgICAgaWYgKHkgPT09IGRlZmVycmVkLnByb21pc2UpXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgICAgICAgZWxzZSBpZiAoaXNQcm9taXNlKHkpKVxuICAgICAgICAgIGNoYWluKHksIGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG4gIHZhciB0aGVuYWJsZVN5bWJvbCA9ICdAQHRoZW5hYmxlJztcbiAgZnVuY3Rpb24gcHJvbWlzZUNvZXJjZShjb25zdHJ1Y3RvciwgeCkge1xuICAgIGlmIChpc1Byb21pc2UoeCkpIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH0gZWxzZSBpZiAoeCAmJiB0eXBlb2YgeC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcCA9IHhbdGhlbmFibGVTeW1ib2xdO1xuICAgICAgaWYgKHApIHtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZChjb25zdHJ1Y3Rvcik7XG4gICAgICAgIHhbdGhlbmFibGVTeW1ib2xdID0gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB4LnRoZW4oZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9XG4gIHJldHVybiB7Z2V0IFByb21pc2UoKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZTtcbiAgICB9fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiO1xuICB2YXIgJHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgdmFyICRpbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mO1xuICB2YXIgJGxhc3RJbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5sYXN0SW5kZXhPZjtcbiAgZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICByZXR1cm4gJGluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zKSA9PSBzdGFydDtcbiAgfVxuICBmdW5jdGlvbiBlbmRzV2l0aChzZWFyY2gpIHtcbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIGlmICh0aGlzID09IG51bGwgfHwgJHRvU3RyaW5nLmNhbGwoc2VhcmNoKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zID0gc3RyaW5nTGVuZ3RoO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKHBvc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICAgICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgICAgICBwb3MgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBlbmQgPSBNYXRoLm1pbihNYXRoLm1heChwb3MsIDApLCBzdHJpbmdMZW5ndGgpO1xuICAgIHZhciBzdGFydCA9IGVuZCAtIHNlYXJjaExlbmd0aDtcbiAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAkbGFzdEluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgc3RhcnQpID09IHN0YXJ0O1xuICB9XG4gIGZ1bmN0aW9uIGNvbnRhaW5zKHNlYXJjaCkge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHZhciBzZWFyY2hTdHJpbmcgPSBTdHJpbmcoc2VhcmNoKTtcbiAgICB2YXIgc2VhcmNoTGVuZ3RoID0gc2VhcmNoU3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgcG9zaXRpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgcG9zID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4ocG9zKSkge1xuICAgICAgcG9zID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0ID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICByZXR1cm4gJGluZGV4T2YuY2FsbChzdHJpbmcsIHNlYXJjaFN0cmluZywgcG9zKSAhPSAtMTtcbiAgfVxuICBmdW5jdGlvbiByZXBlYXQoY291bnQpIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgbiA9IGNvdW50ID8gTnVtYmVyKGNvdW50KSA6IDA7XG4gICAgaWYgKGlzTmFOKG4pKSB7XG4gICAgICBuID0gMDtcbiAgICB9XG4gICAgaWYgKG4gPCAwIHx8IG4gPT0gSW5maW5pdHkpIHtcbiAgICAgIHRocm93IFJhbmdlRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKG4gPT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgd2hpbGUgKG4tLSkge1xuICAgICAgcmVzdWx0ICs9IHN0cmluZztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBmdW5jdGlvbiBjb2RlUG9pbnRBdChwb3NpdGlvbikge1xuICAgIGlmICh0aGlzID09IG51bGwpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgIHZhciBzaXplID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgaW5kZXggPSBwb3NpdGlvbiA/IE51bWJlcihwb3NpdGlvbikgOiAwO1xuICAgIGlmIChpc05hTihpbmRleCkpIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBzaXplKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB2YXIgZmlyc3QgPSBzdHJpbmcuY2hhckNvZGVBdChpbmRleCk7XG4gICAgdmFyIHNlY29uZDtcbiAgICBpZiAoZmlyc3QgPj0gMHhEODAwICYmIGZpcnN0IDw9IDB4REJGRiAmJiBzaXplID4gaW5kZXggKyAxKSB7XG4gICAgICBzZWNvbmQgPSBzdHJpbmcuY2hhckNvZGVBdChpbmRleCArIDEpO1xuICAgICAgaWYgKHNlY29uZCA+PSAweERDMDAgJiYgc2Vjb25kIDw9IDB4REZGRikge1xuICAgICAgICByZXR1cm4gKGZpcnN0IC0gMHhEODAwKSAqIDB4NDAwICsgc2Vjb25kIC0gMHhEQzAwICsgMHgxMDAwMDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZpcnN0O1xuICB9XG4gIGZ1bmN0aW9uIHJhdyhjYWxsc2l0ZSkge1xuICAgIHZhciByYXcgPSBjYWxsc2l0ZS5yYXc7XG4gICAgdmFyIGxlbiA9IHJhdy5sZW5ndGggPj4+IDA7XG4gICAgaWYgKGxlbiA9PT0gMClcbiAgICAgIHJldHVybiAnJztcbiAgICB2YXIgcyA9ICcnO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgcyArPSByYXdbaV07XG4gICAgICBpZiAoaSArIDEgPT09IGxlbilcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgICBzICs9IGFyZ3VtZW50c1srK2ldO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KCkge1xuICAgIHZhciBjb2RlVW5pdHMgPSBbXTtcbiAgICB2YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xuICAgIHZhciBoaWdoU3Vycm9nYXRlO1xuICAgIHZhciBsb3dTdXJyb2dhdGU7XG4gICAgdmFyIGluZGV4ID0gLTE7XG4gICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSk7XG4gICAgICBpZiAoIWlzRmluaXRlKGNvZGVQb2ludCkgfHwgY29kZVBvaW50IDwgMCB8fCBjb2RlUG9pbnQgPiAweDEwRkZGRiB8fCBmbG9vcihjb2RlUG9pbnQpICE9IGNvZGVQb2ludCkge1xuICAgICAgICB0aHJvdyBSYW5nZUVycm9yKCdJbnZhbGlkIGNvZGUgcG9pbnQ6ICcgKyBjb2RlUG9pbnQpO1xuICAgICAgfVxuICAgICAgaWYgKGNvZGVQb2ludCA8PSAweEZGRkYpIHtcbiAgICAgICAgY29kZVVuaXRzLnB1c2goY29kZVBvaW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwO1xuICAgICAgICBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyAweEQ4MDA7XG4gICAgICAgIGxvd1N1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgJSAweDQwMCkgKyAweERDMDA7XG4gICAgICAgIGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIGNvZGVVbml0cyk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBnZXQgc3RhcnRzV2l0aCgpIHtcbiAgICAgIHJldHVybiBzdGFydHNXaXRoO1xuICAgIH0sXG4gICAgZ2V0IGVuZHNXaXRoKCkge1xuICAgICAgcmV0dXJuIGVuZHNXaXRoO1xuICAgIH0sXG4gICAgZ2V0IGNvbnRhaW5zKCkge1xuICAgICAgcmV0dXJuIGNvbnRhaW5zO1xuICAgIH0sXG4gICAgZ2V0IHJlcGVhdCgpIHtcbiAgICAgIHJldHVybiByZXBlYXQ7XG4gICAgfSxcbiAgICBnZXQgY29kZVBvaW50QXQoKSB7XG4gICAgICByZXR1cm4gY29kZVBvaW50QXQ7XG4gICAgfSxcbiAgICBnZXQgcmF3KCkge1xuICAgICAgcmV0dXJuIHJhdztcbiAgICB9LFxuICAgIGdldCBmcm9tQ29kZVBvaW50KCkge1xuICAgICAgcmV0dXJuIGZyb21Db2RlUG9pbnQ7XG4gICAgfVxuICB9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9wb2x5ZmlsbHNcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCI7XG4gIHZhciBQcm9taXNlID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1Byb21pc2VcIikuUHJvbWlzZTtcbiAgdmFyICRfXzkgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvU3RyaW5nXCIpLFxuICAgICAgY29kZVBvaW50QXQgPSAkX185LmNvZGVQb2ludEF0LFxuICAgICAgY29udGFpbnMgPSAkX185LmNvbnRhaW5zLFxuICAgICAgZW5kc1dpdGggPSAkX185LmVuZHNXaXRoLFxuICAgICAgZnJvbUNvZGVQb2ludCA9ICRfXzkuZnJvbUNvZGVQb2ludCxcbiAgICAgIHJlcGVhdCA9ICRfXzkucmVwZWF0LFxuICAgICAgcmF3ID0gJF9fOS5yYXcsXG4gICAgICBzdGFydHNXaXRoID0gJF9fOS5zdGFydHNXaXRoO1xuICB2YXIgJF9fOSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9BcnJheUl0ZXJhdG9yXCIpLFxuICAgICAgZW50cmllcyA9ICRfXzkuZW50cmllcyxcbiAgICAgIGtleXMgPSAkX185LmtleXMsXG4gICAgICB2YWx1ZXMgPSAkX185LnZhbHVlcztcbiAgZnVuY3Rpb24gbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIGlmICghKG5hbWUgaW4gb2JqZWN0KSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVBZGRGdW5jdGlvbnMob2JqZWN0LCBmdW5jdGlvbnMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZ1bmN0aW9ucy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgdmFyIG5hbWUgPSBmdW5jdGlvbnNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBmdW5jdGlvbnNbaSArIDFdO1xuICAgICAgbWF5YmVEZWZpbmVNZXRob2Qob2JqZWN0LCBuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsUHJvbWlzZShnbG9iYWwpIHtcbiAgICBpZiAoIWdsb2JhbC5Qcm9taXNlKVxuICAgICAgZ2xvYmFsLlByb21pc2UgPSBQcm9taXNlO1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsU3RyaW5nKFN0cmluZykge1xuICAgIG1heWJlQWRkRnVuY3Rpb25zKFN0cmluZy5wcm90b3R5cGUsIFsnY29kZVBvaW50QXQnLCBjb2RlUG9pbnRBdCwgJ2NvbnRhaW5zJywgY29udGFpbnMsICdlbmRzV2l0aCcsIGVuZHNXaXRoLCAnc3RhcnRzV2l0aCcsIHN0YXJ0c1dpdGgsICdyZXBlYXQnLCByZXBlYXRdKTtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhTdHJpbmcsIFsnZnJvbUNvZGVQb2ludCcsIGZyb21Db2RlUG9pbnQsICdyYXcnLCByYXddKTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbEFycmF5KEFycmF5LCBTeW1ib2wpIHtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhBcnJheS5wcm90b3R5cGUsIFsnZW50cmllcycsIGVudHJpZXMsICdrZXlzJywga2V5cywgJ3ZhbHVlcycsIHZhbHVlc10pO1xuICAgIGlmIChTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCBTeW1ib2wuaXRlcmF0b3IsIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlcyxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbChnbG9iYWwpIHtcbiAgICBwb2x5ZmlsbFByb21pc2UoZ2xvYmFsKTtcbiAgICBwb2x5ZmlsbFN0cmluZyhnbG9iYWwuU3RyaW5nKTtcbiAgICBwb2x5ZmlsbEFycmF5KGdsb2JhbC5BcnJheSwgZ2xvYmFsLlN5bWJvbCk7XG4gIH1cbiAgcG9seWZpbGwodGhpcyk7XG4gIHZhciBzZXR1cEdsb2JhbHMgPSAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzO1xuICAkdHJhY2V1clJ1bnRpbWUuc2V0dXBHbG9iYWxzID0gZnVuY3Rpb24oZ2xvYmFsKSB7XG4gICAgc2V0dXBHbG9iYWxzKGdsb2JhbCk7XG4gICAgcG9seWZpbGwoZ2xvYmFsKTtcbiAgfTtcbiAgcmV0dXJuIHt9O1xufSk7XG5TeXN0ZW0ucmVnaXN0ZXIoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiO1xuICB2YXIgJF9fMTEgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCIpO1xuICByZXR1cm4ge307XG59KTtcblN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxsLWltcG9ydFwiICsgJycpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkZXYUFTSFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcIlJvdW5kXCI6IHtcbiAgICBcInRpbGVtYXBzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwibWFwXCIsXG4gICAgICAgIFwicGF0aFwiOiBcInNwcml0ZXMvbWFwcy8yZm9ydC5qc29uXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwic3ByaXRlc2hlZXRzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwicGxheWVyXCIsXG4gICAgICAgIFwicGF0aFwiOiBcInNwcml0ZXMvZW5lbXkucG5nXCIsXG4gICAgICAgIFwid2lkdGhcIjogNjQsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDY0LFxuICAgICAgICBcImxlbmd0aFwiOiA0XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJoYWRvdWtlblwiLFxuICAgICAgICBcInBhdGhcIjogXCJzcHJpdGVzL2hhZG91a2VuLnBuZ1wiLFxuICAgICAgICBcIndpZHRoXCI6IDEwMCxcbiAgICAgICAgXCJoZWlnaHRcIjogNzUsXG4gICAgICAgIFwibGVuZ3RoXCI6IDZcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcImZpcmViYWxsXCIsXG4gICAgICAgIFwicGF0aFwiOiBcInNwcml0ZXMvZmlyZWJhbGwucG5nXCIsXG4gICAgICAgIFwid2lkdGhcIjogMjMsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDI4LFxuICAgICAgICBcImxlbmd0aFwiOiA0IFxuICAgICAgfVxuICAgIF0sXG4gICAgXCJpbWFnZXNcIjogW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJEZXNlcnRcIixcbiAgICAgICAgXCJwYXRoXCI6IFwic3ByaXRlcy90bXdfZGVzZXJ0X3NwYWNpbmcucG5nXCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwiYXVkaW9zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwianVtcFwiLFxuICAgICAgICBcInBhdGhcIjogXCJzb3VuZHMvanVtcC5vZ2dcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwibGFuZFwiLFxuICAgICAgICBcInBhdGhcIjogXCJzb3VuZHMvbGFuZC5vZ2dcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwiaGFkb3VrZW5cIixcbiAgICAgICAgXCJwYXRoXCI6IFwic291bmRzL2hhZG91a2VuLm1wM1wiXG4gICAgICB9XG4gICAgXVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEhhZG91a2VuIGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHkpIHtcbiAgICAvL3N1cGVyKGdhbWUsIHgsIHksIFwiaGFkb3VrZW5cIiwgMClcbiAgICAvL3N1cGVyKGdhbWUsIHgsIHksIFwiZmlyZWJhbGxcIiwgMClcbiAgICBzdXBlcihnYW1lLCB4LCB5LCBcIm5vbmVcIiwgMClcblxuICAgIGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcylcbiAgICB0aGlzLmVuYWJsZUJvZHkgPSB0cnVlXG4gICAgdGhpcy5waHlzaWNzQm9keVR5cGUgPSBQaGFzZXIuUGh5c2ljcy5QMkpTXG4gICAgdGhpcy5hbmNob3Iuc2V0VG8oLjUsIC41KVxuICAgIHRoaXMuYm9keS5zZXRDaXJjbGUoNilcblxuICAgIHRoaXMuY2hlY2tXb3JsZEJvdW5kcyA9IHRydWVcbiAgICB0aGlzLm91dE9mQm91bmRzS2lsbCA9IHRydWVcblxuICAgIHRoaXMuc3BlZWQgPSAzMDAwXG4gICAgdGhpcy5vd25lciA9IG51bGxcblxuICAgIC8vdGhpcy5hbmltYXRpb25zLmFkZChcInRyYXZlbGluZ1wiLCBbMCwgMSwgMiwgM10sIDgpXG4gICAgLy90aGlzLmFuaW1hdGlvbnMuYWRkKFwiZXhwbG9kaW5nXCIsIFszXSwgOClcblxuICAgIC8vdGhpcy50cmF2ZWxTb3VuZCA9IGdhbWUuYWRkLmF1ZGlvKFwianVtcFwiKVxuICAgIHRoaXMuY29sbGlkZVNvdW5kID0gZ2FtZS5hZGQuYXVkaW8oXCJsYW5kXCIpXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5ib2R5LnNldFplcm9Sb3RhdGlvbigpXG4gIH1cblxuICBleHBsb2RlKCkge1xuICAgIHRoaXMuY29sbGlkZVNvdW5kLnBsYXkoKVxuICAgIHRoaXMua2lsbCgpIFxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBsYXllciBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xuICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5KSB7XG4gICAgLy9zdXBlcihnYW1lLCB4LCB5LCBcInBsYXllclwiLCAwKVxuICAgIHN1cGVyKGdhbWUsIHgsIHksIFwibm9uZVwiLCAwKVxuXG4gICAgZ2FtZS5waHlzaWNzLnAyLmVuYWJsZSh0aGlzKVxuICAgIHRoaXMuZW5hYmxlQm9keSA9IHRydWVcbiAgICB0aGlzLnBoeXNpY3NCb2R5VHlwZSA9IFBoYXNlci5QaHlzaWNzLlAySlNcbiAgICB0aGlzLmFuY2hvci5zZXRUbyguNSwgLjUpXG4gICAgdGhpcy5ib2R5LnNldENpcmNsZSgyNClcblxuICAgIHRoaXMuc3BlZWQgPSAzMDBcbiAgICB0aGlzLmp1bXBpbmcgPSBmYWxzZVxuICAgIHRoaXMuanVtcER1cmF0aW9uID0gNjAwXG4gICAgdGhpcy56ID0gMS4wXG4gICAgdGhpcy5zY2FsZS5zZXRUbyh0aGlzLnosIHRoaXMueilcbiAgICB0aGlzLnJvdGF0aW9uT2Zmc2V0ID0gTWF0aC5QSSAvIDJcblxuICAgIHRoaXMudXAgPSBmYWxzZVxuICAgIHRoaXMucmlnaHQgPSBmYWxzZVxuICAgIHRoaXMuZG93biA9IGZhbHNlXG4gICAgdGhpcy5sZWZ0ID0gZmFsc2VcblxuICAgIC8vdGhpcy5hbmltYXRpb25zLmFkZChcIndhbGtpbmdcIiwgWzAsIDEsIDIsIDNdLCA4KVxuICAgIC8vdGhpcy5hbmltYXRpb25zLmFkZChcImp1bXBpbmdcIiwgWzNdLCA4KVxuICAgIC8vdGhpcy5hbmltYXRpb25zLmFkZChcImlkbGVcIiwgWzBdLCA4KVxuXG4gICAgdGhpcy5qdW1wU291bmQgPSBnYW1lLmFkZC5hdWRpbyhcImp1bXBcIilcbiAgICB0aGlzLmxhbmRTb3VuZCA9IGdhbWUuYWRkLmF1ZGlvKFwianVtcFwiKVxuICAgIHRoaXMuZmlyZVNvdW5kID0gZ2FtZS5hZGQuYXVkaW8oXCJoYWRvdWtlblwiKVxuICB9XG5cbiAganVtcCgpIHtcbiAgICBpZiAodGhpcy5qdW1waW5nKSByZXR1cm4gZmFsc2VcblxuICAgIHZhciBpbml0aWFsSGVpZ2h0ID0gdGhpcy56XG4gICAgICAsIGFwZXggPSBpbml0aWFsSGVpZ2h0ICogMS4yXG4gICAgICAsIHVwVGltZSA9IHRoaXMuanVtcER1cmF0aW9uIC8gMlxuICAgICAgLCBkb3duVGltZSA9IHRoaXMuanVtcER1cmF0aW9uIC8gMlxuICAgICAgLCBlYXNlVXAgPSBQaGFzZXIuRWFzaW5nLlNpbnVzb2lkYWwuT3V0XG4gICAgICAsIGVhc2VEb3duID0gUGhhc2VyLkVhc2luZy5TaW51c29pZGFsLkluXG4gICAgICAsIGFzY2VudCA9IHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcykudG8oe3o6IGFwZXh9LCB1cFRpbWUsIGVhc2VVcClcbiAgICAgICwgZGVzY2VudCA9IHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcykudG8oe3o6IGluaXRpYWxIZWlnaHR9LCBkb3duVGltZSwgZWFzZURvd24pXG5cbiAgICBhc2NlbnQub25TdGFydC5hZGQoKCkgPT4ge1xuICAgICAgdGhpcy5qdW1wU291bmQucGxheSgpXG4gICAgICB0aGlzLmp1bXBpbmcgPSB0cnVlXG4gICAgfSlcbiAgICBkZXNjZW50Lm9uQ29tcGxldGUuYWRkKCgpID0+IHtcbiAgICAgIHRoaXMubGFuZFNvdW5kLnBsYXkoKVxuICAgICAgdGhpcy5qdW1waW5nID0gZmFsc2VcbiAgICB9KVxuICAgIGFzY2VudC5jaGFpbihkZXNjZW50KS5zdGFydCgpXG4gIH1cblxuICBmaXJlKGhhZG91a2Vucykge1xuICAgIHZhciBoYWRvdWtlbiA9IGhhZG91a2Vucy5nZXRGaXJzdEV4aXN0cyhmYWxzZSlcblxuICAgIGhhZG91a2VuLnJlc2V0KHRoaXMueCwgdGhpcy55KVxuICAgIGhhZG91a2VuLmJvZHkucm90YXRpb24gPSB0aGlzLmJvZHkucm90YXRpb25cbiAgICBoYWRvdWtlbi5ib2R5Lm1vdmVGb3J3YXJkKGhhZG91a2VuLnNwZWVkKVxuICAgIHRoaXMuZmlyZVNvdW5kLnBsYXkoKVxuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHZhciBsZWZ0VmVsID0gdGhpcy5sZWZ0ID8gdGhpcy5zcGVlZCAqIC0xIDogMFxuICAgICAgLCByaWdodFZlbCA9IHRoaXMucmlnaHQgPyB0aGlzLnNwZWVkIDogMFxuICAgICAgLCB1cFZlbCA9IHRoaXMudXAgPyB0aGlzLnNwZWVkICogLTEgOiAwXG4gICAgICAsIGRvd25WZWwgPSB0aGlzLmRvd24gPyB0aGlzLnNwZWVkIDogMFxuICAgICAgLCB4VmVsID0gbGVmdFZlbCArIHJpZ2h0VmVsXG4gICAgICAsIHlWZWwgPSB1cFZlbCArIGRvd25WZWxcbiAgICAgICwgc3RvcHBlZCA9ICgheFZlbCAmJiAheVZlbClcblxuICAgIHRoaXMuc2NhbGUueCA9IHRoaXMuelxuICAgIHRoaXMuc2NhbGUueSA9IHRoaXMuelxuICAgIHRoaXMuYm9keS5zZXRaZXJvUm90YXRpb24oKVxuICAgIHRoaXMuYm9keS5yb3RhdGlvbiA9IHN0b3BwZWQgXG4gICAgICA/IHRoaXMuYm9keS5yb3RhdGlvblxuICAgICAgOiBQaGFzZXIuTWF0aC5hbmdsZUJldHdlZW4oMCwgMCwgeFZlbCwgeVZlbCkgKyB0aGlzLnJvdGF0aW9uT2Zmc2V0XG5cbiAgICBpZiAoIXRoaXMuanVtcGluZykge1xuICAgICAgdGhpcy5ib2R5LnZlbG9jaXR5LnggPSB4VmVsIFxuICAgICAgdGhpcy5ib2R5LnZlbG9jaXR5LnkgPSB5VmVsXG4gICAgICB0aGlzLmFuaW1hdGlvbnMucGxheShzdG9wcGVkID8gXCJpZGxlXCIgOiBcIndhbGtpbmdcIilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hbmltYXRpb25zLnBsYXkoXCJqdW1waW5nXCIpIFxuICAgIH1cbiAgfVxufVxuIiwidmFyIFJvdW5kID0gcmVxdWlyZShcIi4vc3RhdGVzL1JvdW5kXCIpXG52YXIgQXNzZXRMb2FkZXIgPSByZXF1aXJlKFwiLi9zeXN0ZW1zL0Fzc2V0TG9hZGVyXCIpXG52YXIgYXNzZXRzID0gcmVxdWlyZShcIi4vYXNzZXRzLmpzb25cIilcblxudmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoMTkyMCwgOTYwLCBQaGFzZXIuQVVUTywgXCJnYW1lXCIpXG5cbmdhbWUuc3RhdGUuYWRkKCdnYW1lJywgUm91bmQpXG5nYW1lLnN0YXRlLnN0YXJ0KCdnYW1lJylcbmdhbWUuX2Fzc2V0TG9hZGVyID0gbmV3IEFzc2V0TG9hZGVyKGdhbWUsIGFzc2V0cylcbiIsInZhciBQbGF5ZXIgPSByZXF1aXJlKFwiLi4vZW50aXRpZXMvUGxheWVyXCIpXG52YXIgSGFkb3VrZW4gPSByZXF1aXJlKFwiLi4vZW50aXRpZXMvSGFkb3VrZW5cIilcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSb3VuZCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gIHJlZ2lzdGVyUGxheWVyKHBsYXllcikge1xuICAgIHRoaXMucGxheWVycy5hZGQocGxheWVyKSBcbiAgICBwbGF5ZXIuYm9keS5jb2xsaWRlcyh0aGlzLndhbGxzQ2cpXG4gICAgLy9wbGF5ZXJzLmJvZHkuY29sbGlkZXModGhpcy5oYWRvdWtlbnNDZylcbiAgICBwbGF5ZXIuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLnBsYXllcnNDZylcbiAgfVxuXG4gIHJlZ2lzdGVyV2FsbCh3YWxsKSB7XG4gICAgdGhpcy53YWxscy5wdXNoKHdhbGwpXG4gICAgd2FsbC5jb2xsaWRlcyh0aGlzLnBsYXllcnNDZylcbiAgICB3YWxsLmNvbGxpZGVzKHRoaXMuaGFkb3VrZW5zQ2cpXG4gICAgd2FsbC5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLndhbGxzQ2cpXG4gIH1cblxuICByZWdpc3RlckhhZG91a2VuKGhhZCkge1xuICAgIC8vaGFkLmJvZHkuY29sbGlkZXModGhpcy5wbGF5ZXJzQ2cpXG4gICAgaGFkLmJvZHkuY29sbGlkZXModGhpcy53YWxsc0NnLCBoYWQuZXhwbG9kZSwgaGFkKVxuICAgIGhhZC5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuaGFkb3VrZW5zQ2cpIFxuICB9XG5cbiAgcHJlbG9hZCgpIHtcbiAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTFxuICAgIHRoaXMuZ2FtZS5zY2FsZS5zZXRTY3JlZW5TaXplKClcbiAgICB0aGlzLmdhbWUuX2Fzc2V0TG9hZGVyLmxvYWRGb3IoXCJSb3VuZFwiKVxuICAgIHRoaXMucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5QMkpTKVxuICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLnNldEltcGFjdEV2ZW50cyh0cnVlKVxuICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLnNldEJvdW5kc1RvV29ybGQodHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSlcbiAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi51cGRhdGVCb3VuZHNDb2xsaXNpb25Hcm91cCgpXG4gIH1cblxuICBjcmVhdGUoKSB7XG4gICAgdGhpcy5pbnB1dHMgPSBbXVxuICAgIHRoaXMubWFwID0gdGhpcy5nYW1lLmFkZC50aWxlbWFwKFwibWFwXCIpXG4gICAgdGhpcy5tYXAuYWRkVGlsZXNldEltYWdlKFwiRGVzZXJ0XCIsIFwiRGVzZXJ0XCIpXG4gICAgdGhpcy5ncm91bmQgPSB0aGlzLm1hcC5jcmVhdGVMYXllcihcIkdyb3VuZFwiKVxuXG4gICAgdGhpcy5wbGF5ZXJzID0gdGhpcy5hZGQuZ3JvdXAoKVxuXG4gICAgdGhpcy5oYWRvdWtlbnMgPSB0aGlzLmFkZC5ncm91cCgpXG4gICAgdGhpcy5oYWRvdWtlbnMuY2xhc3NUeXBlID0gSGFkb3VrZW5cbiAgICB0aGlzLmhhZG91a2Vucy5jcmVhdGVNdWx0aXBsZSgxMDAwKVxuXG4gICAgdGhpcy53YWxscyA9IFtdXG5cbiAgICB0aGlzLnBsYXllcnNDZyA9IHRoaXMuZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKClcbiAgICB0aGlzLndhbGxzQ2cgPSB0aGlzLmdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpXG4gICAgdGhpcy5oYWRvdWtlbnNDZyA9IHRoaXMuZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKClcblxuICAgIHZhciBwbGF5ZXIxID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIDkwMCwgNDUwKVxuICAgIHZhciB3YWxscyA9IHRoaXMuZ2FtZS5waHlzaWNzLnAyLmNvbnZlcnRDb2xsaXNpb25PYmplY3RzKFxuICAgICAgdGhpcy5tYXAsXG4gICAgICBcIkNvbGxpc2lvbnNcIixcbiAgICAgIHRydWVcbiAgICApXG5cbiAgICB0aGlzLnJlZ2lzdGVyUGxheWVyKHBsYXllcjEpXG4gICAgd2FsbHMuZm9yRWFjaCh0aGlzLnJlZ2lzdGVyV2FsbCwgdGhpcylcbiAgICB0aGlzLmhhZG91a2Vucy5mb3JFYWNoKHRoaXMucmVnaXN0ZXJIYWRvdWtlbiwgdGhpcylcblxuICAgIHRoaXMuaW5wdXRzLnB1c2goe1xuICAgICAga2V5OiB0aGlzLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuVVApLCBcbiAgICAgIGRvd246ICgpID0+IHsgcGxheWVyMS51cCA9IHRydWUgfSwgXG4gICAgICB1cDogKCkgPT4geyBwbGF5ZXIxLnVwID0gZmFsc2UgfVxuICAgIH0pXG4gICAgdGhpcy5pbnB1dHMucHVzaCh7XG4gICAgICBrZXk6IHRoaXMuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5SSUdIVCksIFxuICAgICAgZG93bjogKCkgPT4geyBwbGF5ZXIxLnJpZ2h0ID0gdHJ1ZSB9LCBcbiAgICAgIHVwOiAoKSA9PiB7IHBsYXllcjEucmlnaHQgPSBmYWxzZSB9XG4gICAgfSlcbiAgICB0aGlzLmlucHV0cy5wdXNoKHtcbiAgICAgIGtleTogdGhpcy5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLkRPV04pLCBcbiAgICAgIGRvd246ICgpID0+IHsgcGxheWVyMS5kb3duID0gdHJ1ZSB9LCBcbiAgICAgIHVwOiAoKSA9PiB7IHBsYXllcjEuZG93biA9IGZhbHNlIH1cbiAgICB9KVxuICAgIHRoaXMuaW5wdXRzLnB1c2goe1xuICAgICAga2V5OiB0aGlzLmlucHV0LmtleWJvYXJkLmFkZEtleShQaGFzZXIuS2V5Ym9hcmQuTEVGVCksIFxuICAgICAgZG93bjogKCkgPT4geyBwbGF5ZXIxLmxlZnQgPSB0cnVlIH0sIFxuICAgICAgdXA6ICgpID0+IHsgcGxheWVyMS5sZWZ0ID0gZmFsc2UgfVxuICAgIH0pXG4gICAgdGhpcy5pbnB1dHMucHVzaCh7XG4gICAgICBrZXk6IHRoaXMuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUiksXG4gICAgICBkb3duOiBwbGF5ZXIxLmp1bXAuYmluZChwbGF5ZXIxKVxuICAgIH0pXG4gICAgdGhpcy5pbnB1dHMucHVzaCh7XG4gICAgICBrZXk6IHRoaXMuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5GKSxcbiAgICAgIGRvd246IHBsYXllcjEuZmlyZS5iaW5kKHBsYXllcjEsIHRoaXMuaGFkb3VrZW5zKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5pbnB1dHMuZm9yRWFjaChkb0FjdGlvbkZvcktleSlcbiAgfVxufVxuXG52YXIgbm9vcCA9ICgpID0+IHt9XG5cbnZhciBkb0FjdGlvbkZvcktleSA9ICh7a2V5LCBkb3duLCB1cH0pID0+IHtcbiAgdmFyIGRvd24gPSBkb3duIHx8IG5vb3BcbiAgICAsIHVwID0gdXAgfHwgbm9vcFxuXG4gIGlmIChrZXkuaXNEb3duKSBkb3duKClcbiAgZWxzZSB1cCgpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEFzc2V0TG9hZGVyIHtcbiAgY29uc3RydWN0b3IoZ2FtZSwgYXNzZXRzKSB7XG4gICAgaWYgKCFnYW1lIHx8ICFhc3NldHMpIHRocm93IG5ldyBFcnJvcihcIlByb3ZpZGUgZ2FtZSBhbmQgYXNzZXRzIHRvIGNvbnN0cnVjdG9yXCIpXG4gICAgdGhpcy5nYW1lID0gZ2FtZVxuICAgIHRoaXMuYXNzZXRzID0gYXNzZXRzIFxuICB9XG4gIGxvYWRGb3Ioc3RhdGUpIHtcbiAgICB2YXIgZm9yU3RhdGUgPSB0aGlzLmFzc2V0c1tzdGF0ZV0gXG4gICAgdmFyIGdhbWUgPSB0aGlzLmdhbWVcblxuICAgIGlmICghZm9yU3RhdGUpIHJldHVyblxuXG4gICAgdmFyIHRpbGVtYXBzID0gZm9yU3RhdGUudGlsZW1hcHMgfHwgW11cbiAgICB2YXIgaW1hZ2VzID0gZm9yU3RhdGUuaW1hZ2VzIHx8IFtdXG4gICAgdmFyIGF1ZGlvcyA9IGZvclN0YXRlLmF1ZGlvcyB8fCBbXVxuICAgIHZhciBzcHJpdGVzaGVldHMgPSBmb3JTdGF0ZS5zcHJpdGVzaGVldHMgfHwgW11cblxuICAgIGltYWdlcy5mb3JFYWNoKGltZyA9PiBnYW1lLmxvYWQuaW1hZ2UoaW1nLm5hbWUsIGltZy5wYXRoKSlcbiAgICBhdWRpb3MuZm9yRWFjaChhdWRpbyA9PiBnYW1lLmxvYWQuYXVkaW8oYXVkaW8ubmFtZSwgYXVkaW8ucGF0aCkpXG4gICAgc3ByaXRlc2hlZXRzLmZvckVhY2goKHNoZWV0KSA9PiB7XG4gICAgICBnYW1lLmxvYWQuc3ByaXRlc2hlZXQoXG4gICAgICAgIHNoZWV0Lm5hbWUsXG4gICAgICAgIHNoZWV0LnBhdGgsXG4gICAgICAgIHNoZWV0LndpZHRoLFxuICAgICAgICBzaGVldC5oZWlnaHQsXG4gICAgICAgIHNoZWV0Lmxlbmd0aFxuICAgICAgKVxuICAgIH0pXG4gICAgdGlsZW1hcHMuZm9yRWFjaCgodGlsZW1hcCkgPT4ge1xuICAgICAgZ2FtZS5sb2FkLnRpbGVtYXAoXG4gICAgICAgIHRpbGVtYXAubmFtZSxcbiAgICAgICAgdGlsZW1hcC5wYXRoLFxuICAgICAgICBudWxsLFxuICAgICAgICBQaGFzZXIuVGlsZW1hcC5USUxFRF9KU09OXG4gICAgICApXG4gICAgfSlcbiAgfVxufVxuIl19
