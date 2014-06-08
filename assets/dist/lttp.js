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
      var player = this.players.getFirstExists(false);
      player.reset(spawn.x, spawn.y);
      this.socketPlayerMap[id] = player;
      console.log("add", id);
    },
    removePlayer: function(id) {
      var player = this.socketPlayerMap[id];
      if (!player)
        return false;
      player.kill();
      delete this.socketPlayerMap[id];
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
        player.sprite.kill();
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
      this.killSounds = [this.game.add.audio("toasty"), this.game.add.audio("toasty3")];
      this.explosionSounds = [this.game.add.audio("explosion"), this.game.add.audio("explosion5")];
      this.dodgeSounds = [this.game.add.audio("dodge"), this.game.add.audio("dodge2")];
      this.map = this.game.add.tilemap("map");
      this.map.addTilesetImage("Desert", "Desert");
      this.ground = this.map.createLayer("Ground");
      this.players = this.game.add.group();
      this.players.classType = Player;
      this.players.enableBody = true;
      this.players.physicsBodyType = Phaser.Physics.P2;
      this.players.createMultiple(20, "player");
      this.hadoukens = this.game.add.group();
      this.hadoukens.classType = Hadouken;
      this.hadoukens.enableBody = true;
      this.hadoukens.physicsBodyType = Phaser.Physics.P2;
      this.hadoukens.createMultiple(1000, "hadouken");
      this.walls = [];
      this.playersCg = this.game.physics.p2.createCollisionGroup();
      this.wallsCg = this.game.physics.p2.createCollisionGroup();
      this.hadoukensCg = this.game.physics.p2.createCollisionGroup();
      var walls = this.game.physics.p2.convertCollisionObjects(this.map, "Collisions", true);
      this.players.forEach(this.registerPlayer, this);
      this.hadoukens.forEach(this.registerHadouken, this);
      walls.forEach(this.registerWall, this);
    },
    update: function() {
      var living = this.players.countLiving();
      var playerCount = Object.keys(this.socketPlayerMap).length;
      if (living > 1) {
        this.game.physics.p2.setPostBroadphaseCallback(this.checkOverlap, this);
      } else if (living === 1) {
        Object.keys(this.socketPlayerMap).forEach(function(key) {
          this.socketPlayerMap[key].revive();
        }, this);
      } else {
        if (this.game.physics.p2.postBroadphaseCallback) {
          this.game.physics.p2.setPostBroadphaseCallback(null);
        }
      }
    }
  }, {}, $__super);
}(Phaser.State));


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9lczZpZnkvbm9kZV9tb2R1bGVzL3RyYWNldXIvYmluL3RyYWNldXItcnVudGltZS5qcyIsIi9Vc2Vycy9zdGV2ZW5rYW5lL2x0dHAvcHVibGljL2Fzc2V0cy5qc29uIiwiL1VzZXJzL3N0ZXZlbmthbmUvbHR0cC9wdWJsaWMvZW50aXRpZXMvSGFkb3VrZW4uanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9lbnRpdGllcy9QbGF5ZXIuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9tYWluLmpzIiwiL1VzZXJzL3N0ZXZlbmthbmUvbHR0cC9wdWJsaWMvc3RhdGVzL1JvdW5kLmpzIiwiL1VzZXJzL3N0ZXZlbmthbmUvbHR0cC9wdWJsaWMvc3lzdGVtcy9Bc3NldExvYWRlci5qcyIsIi9Vc2Vycy9zdGV2ZW5rYW5lL2x0dHAvcHVibGljL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOXpDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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WSxhQUFJLEtBQUssQ0FBRSxDQUFBLE1BQU0sQ0FBRSxDQUFBLEtBQUssQ0FBRSxDQUFBLEtBQUssQ0FBSztDQUM1RCxLQUFJLENBQUMsS0FBSyxDQUFBLEVBQUksRUFBQyxNQUFNLENBQUEsRUFBSSxFQUFDLEtBQUssQ0FBQSxFQUFJLEVBQUMsS0FBSztDQUFFLFNBQU8sTUFBSyxDQUFBO0FBRW5ELENBRm1ELElBRW5ELENBQUEsS0FBSyxFQUFHLEVBQUMsS0FBSyxJQUFLLE1BQUssQ0FBQSxFQUFJLENBQUEsTUFBTSxJQUFLLE1BQUssQ0FBQyxDQUFBO0FBQzdDLENBQUosSUFBSSxDQUFBLEtBQUssRUFBRyxFQUFDLEtBQUssSUFBSyxNQUFLLENBQUEsRUFBSSxDQUFBLE1BQU0sSUFBSyxNQUFLLENBQUMsQ0FBQTtDQUVqRCxPQUFPLENBQUEsS0FBSyxHQUFJLE1BQUssQ0FBQTtDQUN0QixDQUFBLENBQUE7Q0FDRCIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsKXtcbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBpZiAoZ2xvYmFsLiR0cmFjZXVyUnVudGltZSkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgJE9iamVjdCA9IE9iamVjdDtcbiAgdmFyICRUeXBlRXJyb3IgPSBUeXBlRXJyb3I7XG4gIHZhciAkY3JlYXRlID0gJE9iamVjdC5jcmVhdGU7XG4gIHZhciAkZGVmaW5lUHJvcGVydGllcyA9ICRPYmplY3QuZGVmaW5lUHJvcGVydGllcztcbiAgdmFyICRkZWZpbmVQcm9wZXJ0eSA9ICRPYmplY3QuZGVmaW5lUHJvcGVydHk7XG4gIHZhciAkZnJlZXplID0gJE9iamVjdC5mcmVlemU7XG4gIHZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gIHZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9ICRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgdmFyICRnZXRQcm90b3R5cGVPZiA9ICRPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciAkaGFzT3duUHJvcGVydHkgPSAkT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyICR0b1N0cmluZyA9ICRPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICBmdW5jdGlvbiBub25FbnVtKHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9O1xuICB9XG4gIHZhciB0eXBlcyA9IHtcbiAgICB2b2lkOiBmdW5jdGlvbiB2b2lkVHlwZSgpIHt9LFxuICAgIGFueTogZnVuY3Rpb24gYW55KCkge30sXG4gICAgc3RyaW5nOiBmdW5jdGlvbiBzdHJpbmcoKSB7fSxcbiAgICBudW1iZXI6IGZ1bmN0aW9uIG51bWJlcigpIHt9LFxuICAgIGJvb2xlYW46IGZ1bmN0aW9uIGJvb2xlYW4oKSB7fVxuICB9O1xuICB2YXIgbWV0aG9kID0gbm9uRW51bTtcbiAgdmFyIGNvdW50ZXIgPSAwO1xuICBmdW5jdGlvbiBuZXdVbmlxdWVTdHJpbmcoKSB7XG4gICAgcmV0dXJuICdfXyQnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMWU5KSArICckJyArICsrY291bnRlciArICckX18nO1xuICB9XG4gIHZhciBzeW1ib2xJbnRlcm5hbFByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5ID0gbmV3VW5pcXVlU3RyaW5nKCk7XG4gIHZhciBzeW1ib2xEYXRhUHJvcGVydHkgPSBuZXdVbmlxdWVTdHJpbmcoKTtcbiAgdmFyIHN5bWJvbFZhbHVlcyA9ICRjcmVhdGUobnVsbCk7XG4gIGZ1bmN0aW9uIGlzU3ltYm9sKHN5bWJvbCkge1xuICAgIHJldHVybiB0eXBlb2Ygc3ltYm9sID09PSAnb2JqZWN0JyAmJiBzeW1ib2wgaW5zdGFuY2VvZiBTeW1ib2xWYWx1ZTtcbiAgfVxuICBmdW5jdGlvbiB0eXBlT2Yodikge1xuICAgIGlmIChpc1N5bWJvbCh2KSlcbiAgICAgIHJldHVybiAnc3ltYm9sJztcbiAgICByZXR1cm4gdHlwZW9mIHY7XG4gIH1cbiAgZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKSB7XG4gICAgdmFyIHZhbHVlID0gbmV3IFN5bWJvbFZhbHVlKGRlc2NyaXB0aW9uKTtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSlcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdTeW1ib2wgY2Fubm90IGJlIG5ld1xcJ2VkJyk7XG4gIH1cbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICdjb25zdHJ1Y3RvcicsIG5vbkVudW0oU3ltYm9sKSk7XG4gICRkZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCAndG9TdHJpbmcnLCBtZXRob2QoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN5bWJvbFZhbHVlID0gdGhpc1tzeW1ib2xEYXRhUHJvcGVydHldO1xuICAgIGlmICghZ2V0T3B0aW9uKCdzeW1ib2xzJykpXG4gICAgICByZXR1cm4gc3ltYm9sVmFsdWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgaWYgKCFzeW1ib2xWYWx1ZSlcbiAgICAgIHRocm93IFR5cGVFcnJvcignQ29udmVyc2lvbiBmcm9tIHN5bWJvbCB0byBzdHJpbmcnKTtcbiAgICB2YXIgZGVzYyA9IHN5bWJvbFZhbHVlW3N5bWJvbERlc2NyaXB0aW9uUHJvcGVydHldO1xuICAgIGlmIChkZXNjID09PSB1bmRlZmluZWQpXG4gICAgICBkZXNjID0gJyc7XG4gICAgcmV0dXJuICdTeW1ib2woJyArIGRlc2MgKyAnKSc7XG4gIH0pKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsICd2YWx1ZU9mJywgbWV0aG9kKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzeW1ib2xWYWx1ZSA9IHRoaXNbc3ltYm9sRGF0YVByb3BlcnR5XTtcbiAgICBpZiAoIXN5bWJvbFZhbHVlKVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdDb252ZXJzaW9uIGZyb20gc3ltYm9sIHRvIHN0cmluZycpO1xuICAgIGlmICghZ2V0T3B0aW9uKCdzeW1ib2xzJykpXG4gICAgICByZXR1cm4gc3ltYm9sVmFsdWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgcmV0dXJuIHN5bWJvbFZhbHVlO1xuICB9KSk7XG4gIGZ1bmN0aW9uIFN5bWJvbFZhbHVlKGRlc2NyaXB0aW9uKSB7XG4gICAgdmFyIGtleSA9IG5ld1VuaXF1ZVN0cmluZygpO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xEYXRhUHJvcGVydHksIHt2YWx1ZTogdGhpc30pO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xJbnRlcm5hbFByb3BlcnR5LCB7dmFsdWU6IGtleX0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBzeW1ib2xEZXNjcmlwdGlvblByb3BlcnR5LCB7dmFsdWU6IGRlc2NyaXB0aW9ufSk7XG4gICAgJGZyZWV6ZSh0aGlzKTtcbiAgICBzeW1ib2xWYWx1ZXNba2V5XSA9IHRoaXM7XG4gIH1cbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ2NvbnN0cnVjdG9yJywgbm9uRW51bShTeW1ib2wpKTtcbiAgJGRlZmluZVByb3BlcnR5KFN5bWJvbFZhbHVlLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywge1xuICAgIHZhbHVlOiBTeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgIGVudW1lcmFibGU6IGZhbHNlXG4gIH0pO1xuICAkZGVmaW5lUHJvcGVydHkoU3ltYm9sVmFsdWUucHJvdG90eXBlLCAndmFsdWVPZicsIHtcbiAgICB2YWx1ZTogU3ltYm9sLnByb3RvdHlwZS52YWx1ZU9mLFxuICAgIGVudW1lcmFibGU6IGZhbHNlXG4gIH0pO1xuICAkZnJlZXplKFN5bWJvbFZhbHVlLnByb3RvdHlwZSk7XG4gIFN5bWJvbC5pdGVyYXRvciA9IFN5bWJvbCgpO1xuICBmdW5jdGlvbiB0b1Byb3BlcnR5KG5hbWUpIHtcbiAgICBpZiAoaXNTeW1ib2wobmFtZSkpXG4gICAgICByZXR1cm4gbmFtZVtzeW1ib2xJbnRlcm5hbFByb3BlcnR5XTtcbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCkge1xuICAgIHZhciBydiA9IFtdO1xuICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIGlmICghc3ltYm9sVmFsdWVzW25hbWVdKVxuICAgICAgICBydi5wdXNoKG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkge1xuICAgIHJldHVybiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgdG9Qcm9wZXJ0eShuYW1lKSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdCkge1xuICAgIHZhciBydiA9IFtdO1xuICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN5bWJvbCA9IHN5bWJvbFZhbHVlc1tuYW1lc1tpXV07XG4gICAgICBpZiAoc3ltYm9sKVxuICAgICAgICBydi5wdXNoKHN5bWJvbCk7XG4gICAgfVxuICAgIHJldHVybiBydjtcbiAgfVxuICBmdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShuYW1lKSB7XG4gICAgcmV0dXJuICRoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsIHRvUHJvcGVydHkobmFtZSkpO1xuICB9XG4gIGZ1bmN0aW9uIGdldE9wdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIGdsb2JhbC50cmFjZXVyICYmIGdsb2JhbC50cmFjZXVyLm9wdGlvbnNbbmFtZV07XG4gIH1cbiAgZnVuY3Rpb24gc2V0UHJvcGVydHkob2JqZWN0LCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBzeW0sXG4gICAgICAgIGRlc2M7XG4gICAgaWYgKGlzU3ltYm9sKG5hbWUpKSB7XG4gICAgICBzeW0gPSBuYW1lO1xuICAgICAgbmFtZSA9IG5hbWVbc3ltYm9sSW50ZXJuYWxQcm9wZXJ0eV07XG4gICAgfVxuICAgIG9iamVjdFtuYW1lXSA9IHZhbHVlO1xuICAgIGlmIChzeW0gJiYgKGRlc2MgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkpKVxuICAgICAgJGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwge2VudW1lcmFibGU6IGZhbHNlfSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KG9iamVjdCwgbmFtZSwgZGVzY3JpcHRvcikge1xuICAgIGlmIChpc1N5bWJvbChuYW1lKSkge1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZW51bWVyYWJsZSkge1xuICAgICAgICBkZXNjcmlwdG9yID0gJGNyZWF0ZShkZXNjcmlwdG9yLCB7ZW51bWVyYWJsZToge3ZhbHVlOiBmYWxzZX19KTtcbiAgICAgIH1cbiAgICAgIG5hbWUgPSBuYW1lW3N5bWJvbEludGVybmFsUHJvcGVydHldO1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCBkZXNjcmlwdG9yKTtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIGZ1bmN0aW9uIHBvbHlmaWxsT2JqZWN0KE9iamVjdCkge1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScsIHt2YWx1ZTogZGVmaW5lUHJvcGVydHl9KTtcbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnZ2V0T3duUHJvcGVydHlOYW1lcycsIHt2YWx1ZTogZ2V0T3duUHJvcGVydHlOYW1lc30pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCB7dmFsdWU6IGdldE93blByb3BlcnR5RGVzY3JpcHRvcn0pO1xuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QucHJvdG90eXBlLCAnaGFzT3duUHJvcGVydHknLCB7dmFsdWU6IGhhc093blByb3BlcnR5fSk7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scztcbiAgICBmdW5jdGlvbiBpcyhsZWZ0LCByaWdodCkge1xuICAgICAgaWYgKGxlZnQgPT09IHJpZ2h0KVxuICAgICAgICByZXR1cm4gbGVmdCAhPT0gMCB8fCAxIC8gbGVmdCA9PT0gMSAvIHJpZ2h0O1xuICAgICAgcmV0dXJuIGxlZnQgIT09IGxlZnQgJiYgcmlnaHQgIT09IHJpZ2h0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnaXMnLCBtZXRob2QoaXMpKTtcbiAgICBmdW5jdGlvbiBhc3NpZ24odGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgIHZhciBwcm9wcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZSk7XG4gICAgICB2YXIgcCxcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG4gICAgICBmb3IgKHAgPSAwOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BzW3BdXSA9IHNvdXJjZVtwcm9wc1twXV07XG4gICAgICB9XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICAkZGVmaW5lUHJvcGVydHkoT2JqZWN0LCAnYXNzaWduJywgbWV0aG9kKGFzc2lnbikpO1xuICAgIGZ1bmN0aW9uIG1peGluKHRhcmdldCwgc291cmNlKSB7XG4gICAgICB2YXIgcHJvcHMgPSAkZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpO1xuICAgICAgdmFyIHAsXG4gICAgICAgICAgZGVzY3JpcHRvcixcbiAgICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG4gICAgICBmb3IgKHAgPSAwOyBwIDwgbGVuZ3RoOyBwKyspIHtcbiAgICAgICAgZGVzY3JpcHRvciA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBwcm9wc1twXSk7XG4gICAgICAgICRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BzW3BdLCBkZXNjcmlwdG9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShPYmplY3QsICdtaXhpbicsIG1ldGhvZChtaXhpbikpO1xuICB9XG4gIGZ1bmN0aW9uIGV4cG9ydFN0YXIob2JqZWN0KSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKGFyZ3VtZW50c1tpXSk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG5hbWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIChmdW5jdGlvbihtb2QsIG5hbWUpIHtcbiAgICAgICAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCBuYW1lLCB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gbW9kW25hbWVdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoYXJndW1lbnRzW2ldLCBuYW1lc1tqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgZnVuY3Rpb24gdG9PYmplY3QodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbClcbiAgICAgIHRocm93ICRUeXBlRXJyb3IoKTtcbiAgICByZXR1cm4gJE9iamVjdCh2YWx1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gc3ByZWFkKCkge1xuICAgIHZhciBydiA9IFtdLFxuICAgICAgICBrID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlVG9TcHJlYWQgPSB0b09iamVjdChhcmd1bWVudHNbaV0pO1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2YWx1ZVRvU3ByZWFkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHJ2W2srK10gPSB2YWx1ZVRvU3ByZWFkW2pdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnY7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSkge1xuICAgIHdoaWxlIChvYmplY3QgIT09IG51bGwpIHtcbiAgICAgIHZhciByZXN1bHQgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgbmFtZSk7XG4gICAgICBpZiAocmVzdWx0KVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgb2JqZWN0ID0gJGdldFByb3RvdHlwZU9mKG9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpIHtcbiAgICB2YXIgcHJvdG8gPSAkZ2V0UHJvdG90eXBlT2YoaG9tZU9iamVjdCk7XG4gICAgaWYgKCFwcm90bylcbiAgICAgIHRocm93ICRUeXBlRXJyb3IoJ3N1cGVyIGlzIG51bGwnKTtcbiAgICByZXR1cm4gZ2V0UHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKTtcbiAgfVxuICBmdW5jdGlvbiBzdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSwgYXJncykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gc3VwZXJEZXNjcmlwdG9yKGhvbWVPYmplY3QsIG5hbWUpO1xuICAgIGlmIChkZXNjcmlwdG9yKSB7XG4gICAgICBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci52YWx1ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIGlmIChkZXNjcmlwdG9yLmdldClcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmNhbGwoc2VsZikuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuICAgIHRocm93ICRUeXBlRXJyb3IoXCJzdXBlciBoYXMgbm8gbWV0aG9kICdcIiArIG5hbWUgKyBcIicuXCIpO1xuICB9XG4gIGZ1bmN0aW9uIHN1cGVyR2V0KHNlbGYsIGhvbWVPYmplY3QsIG5hbWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvcikge1xuICAgICAgaWYgKGRlc2NyaXB0b3IuZ2V0KVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvci5nZXQuY2FsbChzZWxmKTtcbiAgICAgIGVsc2UgaWYgKCd2YWx1ZScgaW4gZGVzY3JpcHRvcilcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gc3VwZXJTZXQoc2VsZiwgaG9tZU9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHN1cGVyRGVzY3JpcHRvcihob21lT2JqZWN0LCBuYW1lKTtcbiAgICBpZiAoZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnNldCkge1xuICAgICAgZGVzY3JpcHRvci5zZXQuY2FsbChzZWxmLCB2YWx1ZSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHRocm93ICRUeXBlRXJyb3IoXCJzdXBlciBoYXMgbm8gc2V0dGVyICdcIiArIG5hbWUgKyBcIicuXCIpO1xuICB9XG4gIGZ1bmN0aW9uIGdldERlc2NyaXB0b3JzKG9iamVjdCkge1xuICAgIHZhciBkZXNjcmlwdG9ycyA9IHt9LFxuICAgICAgICBuYW1lLFxuICAgICAgICBuYW1lcyA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG5hbWUgPSBuYW1lc1tpXTtcbiAgICAgIGRlc2NyaXB0b3JzW25hbWVdID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmplY3QsIG5hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gZGVzY3JpcHRvcnM7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlQ2xhc3MoY3Rvciwgb2JqZWN0LCBzdGF0aWNPYmplY3QsIHN1cGVyQ2xhc3MpIHtcbiAgICAkZGVmaW5lUHJvcGVydHkob2JqZWN0LCAnY29uc3RydWN0b3InLCB7XG4gICAgICB2YWx1ZTogY3RvcixcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDMpIHtcbiAgICAgIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgY3Rvci5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSAkY3JlYXRlKGdldFByb3RvUGFyZW50KHN1cGVyQ2xhc3MpLCBnZXREZXNjcmlwdG9ycyhvYmplY3QpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBvYmplY3Q7XG4gICAgfVxuICAgICRkZWZpbmVQcm9wZXJ0eShjdG9yLCAncHJvdG90eXBlJywge1xuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgIH0pO1xuICAgIHJldHVybiAkZGVmaW5lUHJvcGVydGllcyhjdG9yLCBnZXREZXNjcmlwdG9ycyhzdGF0aWNPYmplY3QpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRQcm90b1BhcmVudChzdXBlckNsYXNzKSB7XG4gICAgaWYgKHR5cGVvZiBzdXBlckNsYXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcHJvdG90eXBlID0gc3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgICBpZiAoJE9iamVjdChwcm90b3R5cGUpID09PSBwcm90b3R5cGUgfHwgcHJvdG90eXBlID09PSBudWxsKVxuICAgICAgICByZXR1cm4gc3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgfVxuICAgIGlmIChzdXBlckNsYXNzID09PSBudWxsKVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICB9XG4gIGZ1bmN0aW9uIGRlZmF1bHRTdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgYXJncykge1xuICAgIGlmICgkZ2V0UHJvdG90eXBlT2YoaG9tZU9iamVjdCkgIT09IG51bGwpXG4gICAgICBzdXBlckNhbGwoc2VsZiwgaG9tZU9iamVjdCwgJ2NvbnN0cnVjdG9yJywgYXJncyk7XG4gIH1cbiAgdmFyIFNUX05FV0JPUk4gPSAwO1xuICB2YXIgU1RfRVhFQ1VUSU5HID0gMTtcbiAgdmFyIFNUX1NVU1BFTkRFRCA9IDI7XG4gIHZhciBTVF9DTE9TRUQgPSAzO1xuICB2YXIgRU5EX1NUQVRFID0gLTI7XG4gIHZhciBSRVRIUk9XX1NUQVRFID0gLTM7XG4gIGZ1bmN0aW9uIGFkZEl0ZXJhdG9yKG9iamVjdCkge1xuICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIFN5bWJvbC5pdGVyYXRvciwgbm9uRW51bShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRJbnRlcm5hbEVycm9yKHN0YXRlKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcignVHJhY2V1ciBjb21waWxlciBidWc6IGludmFsaWQgc3RhdGUgaW4gc3RhdGUgbWFjaGluZTogJyArIHN0YXRlKTtcbiAgfVxuICBmdW5jdGlvbiBHZW5lcmF0b3JDb250ZXh0KCkge1xuICAgIHRoaXMuc3RhdGUgPSAwO1xuICAgIHRoaXMuR1N0YXRlID0gU1RfTkVXQk9STjtcbiAgICB0aGlzLnN0b3JlZEV4Y2VwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmZpbmFsbHlGYWxsVGhyb3VnaCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnNlbnRfID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucmV0dXJuVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50cnlTdGFja18gPSBbXTtcbiAgfVxuICBHZW5lcmF0b3JDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBwdXNoVHJ5OiBmdW5jdGlvbihjYXRjaFN0YXRlLCBmaW5hbGx5U3RhdGUpIHtcbiAgICAgIGlmIChmaW5hbGx5U3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZpbmFsbHlGYWxsVGhyb3VnaCA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeVN0YWNrXy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmICh0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2ggPSB0aGlzLnRyeVN0YWNrX1tpXS5jYXRjaDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmluYWxseUZhbGxUaHJvdWdoID09PSBudWxsKVxuICAgICAgICAgIGZpbmFsbHlGYWxsVGhyb3VnaCA9IFJFVEhST1dfU1RBVEU7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe1xuICAgICAgICAgIGZpbmFsbHk6IGZpbmFsbHlTdGF0ZSxcbiAgICAgICAgICBmaW5hbGx5RmFsbFRocm91Z2g6IGZpbmFsbHlGYWxsVGhyb3VnaFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChjYXRjaFN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMudHJ5U3RhY2tfLnB1c2goe2NhdGNoOiBjYXRjaFN0YXRlfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwb3BUcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy50cnlTdGFja18ucG9wKCk7XG4gICAgfSxcbiAgICBnZXQgc2VudCgpIHtcbiAgICAgIHRoaXMubWF5YmVUaHJvdygpO1xuICAgICAgcmV0dXJuIHRoaXMuc2VudF87XG4gICAgfSxcbiAgICBzZXQgc2VudCh2KSB7XG4gICAgICB0aGlzLnNlbnRfID0gdjtcbiAgICB9LFxuICAgIGdldCBzZW50SWdub3JlVGhyb3coKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZW50XztcbiAgICB9LFxuICAgIG1heWJlVGhyb3c6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuYWN0aW9uID09PSAndGhyb3cnKSB7XG4gICAgICAgIHRoaXMuYWN0aW9uID0gJ25leHQnO1xuICAgICAgICB0aHJvdyB0aGlzLnNlbnRfO1xuICAgICAgfVxuICAgIH0sXG4gICAgZW5kOiBmdW5jdGlvbigpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgICBjYXNlIEVORF9TVEFURTpcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgY2FzZSBSRVRIUk9XX1NUQVRFOlxuICAgICAgICAgIHRocm93IHRoaXMuc3RvcmVkRXhjZXB0aW9uO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IGdldEludGVybmFsRXJyb3IodGhpcy5zdGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBmdW5jdGlvbiBnZXROZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCBhY3Rpb24pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgICAgc3dpdGNoIChjdHguR1N0YXRlKSB7XG4gICAgICAgIGNhc2UgU1RfRVhFQ1VUSU5HOlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigoXCJcXFwiXCIgKyBhY3Rpb24gKyBcIlxcXCIgb24gZXhlY3V0aW5nIGdlbmVyYXRvclwiKSk7XG4gICAgICAgIGNhc2UgU1RfQ0xPU0VEOlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigoXCJcXFwiXCIgKyBhY3Rpb24gKyBcIlxcXCIgb24gY2xvc2VkIGdlbmVyYXRvclwiKSk7XG4gICAgICAgIGNhc2UgU1RfTkVXQk9STjpcbiAgICAgICAgICBpZiAoYWN0aW9uID09PSAndGhyb3cnKSB7XG4gICAgICAgICAgICBjdHguR1N0YXRlID0gU1RfQ0xPU0VEO1xuICAgICAgICAgICAgdGhyb3cgeDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRocm93ICRUeXBlRXJyb3IoJ1NlbnQgdmFsdWUgdG8gbmV3Ym9ybiBnZW5lcmF0b3InKTtcbiAgICAgICAgY2FzZSBTVF9TVVNQRU5ERUQ6XG4gICAgICAgICAgY3R4LkdTdGF0ZSA9IFNUX0VYRUNVVElORztcbiAgICAgICAgICBjdHguYWN0aW9uID0gYWN0aW9uO1xuICAgICAgICAgIGN0eC5zZW50ID0geDtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBtb3ZlTmV4dChjdHgpO1xuICAgICAgICAgIHZhciBkb25lID0gdmFsdWUgPT09IGN0eDtcbiAgICAgICAgICBpZiAoZG9uZSlcbiAgICAgICAgICAgIHZhbHVlID0gY3R4LnJldHVyblZhbHVlO1xuICAgICAgICAgIGN0eC5HU3RhdGUgPSBkb25lID8gU1RfQ0xPU0VEIDogU1RfU1VTUEVOREVEO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBkb25lOiBkb25lXG4gICAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGdlbmVyYXRvcldyYXAoaW5uZXJGdW5jdGlvbiwgc2VsZikge1xuICAgIHZhciBtb3ZlTmV4dCA9IGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpO1xuICAgIHZhciBjdHggPSBuZXcgR2VuZXJhdG9yQ29udGV4dCgpO1xuICAgIHJldHVybiBhZGRJdGVyYXRvcih7XG4gICAgICBuZXh0OiBnZXROZXh0T3JUaHJvdyhjdHgsIG1vdmVOZXh0LCAnbmV4dCcpLFxuICAgICAgdGhyb3c6IGdldE5leHRPclRocm93KGN0eCwgbW92ZU5leHQsICd0aHJvdycpXG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gQXN5bmNGdW5jdGlvbkNvbnRleHQoKSB7XG4gICAgR2VuZXJhdG9yQ29udGV4dC5jYWxsKHRoaXMpO1xuICAgIHRoaXMuZXJyID0gdW5kZWZpbmVkO1xuICAgIHZhciBjdHggPSB0aGlzO1xuICAgIGN0eC5yZXN1bHQgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGN0eC5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIGN0eC5yZWplY3QgPSByZWplY3Q7XG4gICAgfSk7XG4gIH1cbiAgQXN5bmNGdW5jdGlvbkNvbnRleHQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHZW5lcmF0b3JDb250ZXh0LnByb3RvdHlwZSk7XG4gIEFzeW5jRnVuY3Rpb25Db250ZXh0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbigpIHtcbiAgICBzd2l0Y2ggKHRoaXMuc3RhdGUpIHtcbiAgICAgIGNhc2UgRU5EX1NUQVRFOlxuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlIFJFVEhST1dfU1RBVEU6XG4gICAgICAgIHRoaXMucmVqZWN0KHRoaXMuc3RvcmVkRXhjZXB0aW9uKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMucmVqZWN0KGdldEludGVybmFsRXJyb3IodGhpcy5zdGF0ZSkpO1xuICAgIH1cbiAgfTtcbiAgZnVuY3Rpb24gYXN5bmNXcmFwKGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICB2YXIgbW92ZU5leHQgPSBnZXRNb3ZlTmV4dChpbm5lckZ1bmN0aW9uLCBzZWxmKTtcbiAgICB2YXIgY3R4ID0gbmV3IEFzeW5jRnVuY3Rpb25Db250ZXh0KCk7XG4gICAgY3R4LmNyZWF0ZUNhbGxiYWNrID0gZnVuY3Rpb24obmV3U3RhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBjdHguc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgY3R4LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIG1vdmVOZXh0KGN0eCk7XG4gICAgICB9O1xuICAgIH07XG4gICAgY3R4LmNyZWF0ZUVycmJhY2sgPSBmdW5jdGlvbihuZXdTdGF0ZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjdHguc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgY3R4LmVyciA9IGVycjtcbiAgICAgICAgbW92ZU5leHQoY3R4KTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBtb3ZlTmV4dChjdHgpO1xuICAgIHJldHVybiBjdHgucmVzdWx0O1xuICB9XG4gIGZ1bmN0aW9uIGdldE1vdmVOZXh0KGlubmVyRnVuY3Rpb24sIHNlbGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oY3R4KSB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBpbm5lckZ1bmN0aW9uLmNhbGwoc2VsZiwgY3R4KTtcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICBjdHguc3RvcmVkRXhjZXB0aW9uID0gZXg7XG4gICAgICAgICAgdmFyIGxhc3QgPSBjdHgudHJ5U3RhY2tfW2N0eC50cnlTdGFja18ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgaWYgKCFsYXN0KSB7XG4gICAgICAgICAgICBjdHguR1N0YXRlID0gU1RfQ0xPU0VEO1xuICAgICAgICAgICAgY3R4LnN0YXRlID0gRU5EX1NUQVRFO1xuICAgICAgICAgICAgdGhyb3cgZXg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN0eC5zdGF0ZSA9IGxhc3QuY2F0Y2ggIT09IHVuZGVmaW5lZCA/IGxhc3QuY2F0Y2ggOiBsYXN0LmZpbmFsbHk7XG4gICAgICAgICAgaWYgKGxhc3QuZmluYWxseUZhbGxUaHJvdWdoICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBjdHguZmluYWxseUZhbGxUaHJvdWdoID0gbGFzdC5maW5hbGx5RmFsbFRocm91Z2g7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHNldHVwR2xvYmFscyhnbG9iYWwpIHtcbiAgICBnbG9iYWwuU3ltYm9sID0gU3ltYm9sO1xuICAgIHBvbHlmaWxsT2JqZWN0KGdsb2JhbC5PYmplY3QpO1xuICB9XG4gIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICBnbG9iYWwuJHRyYWNldXJSdW50aW1lID0ge1xuICAgIGFzeW5jV3JhcDogYXN5bmNXcmFwLFxuICAgIGNyZWF0ZUNsYXNzOiBjcmVhdGVDbGFzcyxcbiAgICBkZWZhdWx0U3VwZXJDYWxsOiBkZWZhdWx0U3VwZXJDYWxsLFxuICAgIGV4cG9ydFN0YXI6IGV4cG9ydFN0YXIsXG4gICAgZ2VuZXJhdG9yV3JhcDogZ2VuZXJhdG9yV3JhcCxcbiAgICBzZXRQcm9wZXJ0eTogc2V0UHJvcGVydHksXG4gICAgc2V0dXBHbG9iYWxzOiBzZXR1cEdsb2JhbHMsXG4gICAgc3ByZWFkOiBzcHJlYWQsXG4gICAgc3VwZXJDYWxsOiBzdXBlckNhbGwsXG4gICAgc3VwZXJHZXQ6IHN1cGVyR2V0LFxuICAgIHN1cGVyU2V0OiBzdXBlclNldCxcbiAgICB0b09iamVjdDogdG9PYmplY3QsXG4gICAgdG9Qcm9wZXJ0eTogdG9Qcm9wZXJ0eSxcbiAgICB0eXBlOiB0eXBlcyxcbiAgICB0eXBlb2Y6IHR5cGVPZlxuICB9O1xufSkodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTtcbihmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKG9wdF9zY2hlbWUsIG9wdF91c2VySW5mbywgb3B0X2RvbWFpbiwgb3B0X3BvcnQsIG9wdF9wYXRoLCBvcHRfcXVlcnlEYXRhLCBvcHRfZnJhZ21lbnQpIHtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgaWYgKG9wdF9zY2hlbWUpIHtcbiAgICAgIG91dC5wdXNoKG9wdF9zY2hlbWUsICc6Jyk7XG4gICAgfVxuICAgIGlmIChvcHRfZG9tYWluKSB7XG4gICAgICBvdXQucHVzaCgnLy8nKTtcbiAgICAgIGlmIChvcHRfdXNlckluZm8pIHtcbiAgICAgICAgb3V0LnB1c2gob3B0X3VzZXJJbmZvLCAnQCcpO1xuICAgICAgfVxuICAgICAgb3V0LnB1c2gob3B0X2RvbWFpbik7XG4gICAgICBpZiAob3B0X3BvcnQpIHtcbiAgICAgICAgb3V0LnB1c2goJzonLCBvcHRfcG9ydCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvcHRfcGF0aCkge1xuICAgICAgb3V0LnB1c2gob3B0X3BhdGgpO1xuICAgIH1cbiAgICBpZiAob3B0X3F1ZXJ5RGF0YSkge1xuICAgICAgb3V0LnB1c2goJz8nLCBvcHRfcXVlcnlEYXRhKTtcbiAgICB9XG4gICAgaWYgKG9wdF9mcmFnbWVudCkge1xuICAgICAgb3V0LnB1c2goJyMnLCBvcHRfZnJhZ21lbnQpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xuICB9XG4gIDtcbiAgdmFyIHNwbGl0UmUgPSBuZXcgUmVnRXhwKCdeJyArICcoPzonICsgJyhbXjovPyMuXSspJyArICc6KT8nICsgJyg/Oi8vJyArICcoPzooW14vPyNdKilAKT8nICsgJyhbXFxcXHdcXFxcZFxcXFwtXFxcXHUwMTAwLVxcXFx1ZmZmZi4lXSopJyArICcoPzo6KFswLTldKykpPycgKyAnKT8nICsgJyhbXj8jXSspPycgKyAnKD86XFxcXD8oW14jXSopKT8nICsgJyg/OiMoLiopKT8nICsgJyQnKTtcbiAgdmFyIENvbXBvbmVudEluZGV4ID0ge1xuICAgIFNDSEVNRTogMSxcbiAgICBVU0VSX0lORk86IDIsXG4gICAgRE9NQUlOOiAzLFxuICAgIFBPUlQ6IDQsXG4gICAgUEFUSDogNSxcbiAgICBRVUVSWV9EQVRBOiA2LFxuICAgIEZSQUdNRU5UOiA3XG4gIH07XG4gIGZ1bmN0aW9uIHNwbGl0KHVyaSkge1xuICAgIHJldHVybiAodXJpLm1hdGNoKHNwbGl0UmUpKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmVEb3RTZWdtZW50cyhwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcvJylcbiAgICAgIHJldHVybiAnLyc7XG4gICAgdmFyIGxlYWRpbmdTbGFzaCA9IHBhdGhbMF0gPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciB0cmFpbGluZ1NsYXNoID0gcGF0aC5zbGljZSgtMSkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIHZhciBzZWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIHVwID0gMDtcbiAgICBmb3IgKHZhciBwb3MgPSAwOyBwb3MgPCBzZWdtZW50cy5sZW5ndGg7IHBvcysrKSB7XG4gICAgICB2YXIgc2VnbWVudCA9IHNlZ21lbnRzW3Bvc107XG4gICAgICBzd2l0Y2ggKHNlZ21lbnQpIHtcbiAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgY2FzZSAnLic6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJy4uJzpcbiAgICAgICAgICBpZiAob3V0Lmxlbmd0aClcbiAgICAgICAgICAgIG91dC5wb3AoKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB1cCsrO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIG91dC5wdXNoKHNlZ21lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWxlYWRpbmdTbGFzaCkge1xuICAgICAgd2hpbGUgKHVwLS0gPiAwKSB7XG4gICAgICAgIG91dC51bnNoaWZ0KCcuLicpO1xuICAgICAgfVxuICAgICAgaWYgKG91dC5sZW5ndGggPT09IDApXG4gICAgICAgIG91dC5wdXNoKCcuJyk7XG4gICAgfVxuICAgIHJldHVybiBsZWFkaW5nU2xhc2ggKyBvdXQuam9pbignLycpICsgdHJhaWxpbmdTbGFzaDtcbiAgfVxuICBmdW5jdGlvbiBqb2luQW5kQ2Fub25pY2FsaXplUGF0aChwYXJ0cykge1xuICAgIHZhciBwYXRoID0gcGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF0gfHwgJyc7XG4gICAgcGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gYnVpbGRGcm9tRW5jb2RlZFBhcnRzKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlVTRVJfSU5GT10sIHBhcnRzW0NvbXBvbmVudEluZGV4LkRPTUFJTl0sIHBhcnRzW0NvbXBvbmVudEluZGV4LlBPUlRdLCBwYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXSwgcGFydHNbQ29tcG9uZW50SW5kZXguUVVFUllfREFUQV0sIHBhcnRzW0NvbXBvbmVudEluZGV4LkZSQUdNRU5UXSk7XG4gIH1cbiAgZnVuY3Rpb24gY2Fub25pY2FsaXplVXJsKHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgcmV0dXJuIGpvaW5BbmRDYW5vbmljYWxpemVQYXRoKHBhcnRzKTtcbiAgfVxuICBmdW5jdGlvbiByZXNvbHZlVXJsKGJhc2UsIHVybCkge1xuICAgIHZhciBwYXJ0cyA9IHNwbGl0KHVybCk7XG4gICAgdmFyIGJhc2VQYXJ0cyA9IHNwbGl0KGJhc2UpO1xuICAgIGlmIChwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0c1tDb21wb25lbnRJbmRleC5TQ0hFTUVdID0gYmFzZVBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSBDb21wb25lbnRJbmRleC5TQ0hFTUU7IGkgPD0gQ29tcG9uZW50SW5kZXguUE9SVDsgaSsrKSB7XG4gICAgICBpZiAoIXBhcnRzW2ldKSB7XG4gICAgICAgIHBhcnRzW2ldID0gYmFzZVBhcnRzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocGFydHNbQ29tcG9uZW50SW5kZXguUEFUSF1bMF0gPT0gJy8nKSB7XG4gICAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICAgIH1cbiAgICB2YXIgcGF0aCA9IGJhc2VQYXJ0c1tDb21wb25lbnRJbmRleC5QQVRIXTtcbiAgICB2YXIgaW5kZXggPSBwYXRoLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgcGF0aCA9IHBhdGguc2xpY2UoMCwgaW5kZXggKyAxKSArIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdO1xuICAgIHBhcnRzW0NvbXBvbmVudEluZGV4LlBBVEhdID0gcGF0aDtcbiAgICByZXR1cm4gam9pbkFuZENhbm9uaWNhbGl6ZVBhdGgocGFydHMpO1xuICB9XG4gIGZ1bmN0aW9uIGlzQWJzb2x1dGUobmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmFtZVswXSA9PT0gJy8nKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgdmFyIHBhcnRzID0gc3BsaXQobmFtZSk7XG4gICAgaWYgKHBhcnRzW0NvbXBvbmVudEluZGV4LlNDSEVNRV0pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgJHRyYWNldXJSdW50aW1lLmNhbm9uaWNhbGl6ZVVybCA9IGNhbm9uaWNhbGl6ZVVybDtcbiAgJHRyYWNldXJSdW50aW1lLmlzQWJzb2x1dGUgPSBpc0Fic29sdXRlO1xuICAkdHJhY2V1clJ1bnRpbWUucmVtb3ZlRG90U2VnbWVudHMgPSByZW1vdmVEb3RTZWdtZW50cztcbiAgJHRyYWNldXJSdW50aW1lLnJlc29sdmVVcmwgPSByZXNvbHZlVXJsO1xufSkoKTtcbihmdW5jdGlvbihnbG9iYWwpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB2YXIgJF9fMiA9ICR0cmFjZXVyUnVudGltZSxcbiAgICAgIGNhbm9uaWNhbGl6ZVVybCA9ICRfXzIuY2Fub25pY2FsaXplVXJsLFxuICAgICAgcmVzb2x2ZVVybCA9ICRfXzIucmVzb2x2ZVVybCxcbiAgICAgIGlzQWJzb2x1dGUgPSAkX18yLmlzQWJzb2x1dGU7XG4gIHZhciBtb2R1bGVJbnN0YW50aWF0b3JzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdmFyIGJhc2VVUkw7XG4gIGlmIChnbG9iYWwubG9jYXRpb24gJiYgZ2xvYmFsLmxvY2F0aW9uLmhyZWYpXG4gICAgYmFzZVVSTCA9IHJlc29sdmVVcmwoZ2xvYmFsLmxvY2F0aW9uLmhyZWYsICcuLycpO1xuICBlbHNlXG4gICAgYmFzZVVSTCA9ICcnO1xuICB2YXIgVW5jb2F0ZWRNb2R1bGVFbnRyeSA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlRW50cnkodXJsLCB1bmNvYXRlZE1vZHVsZSkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICAgIHRoaXMudmFsdWVfID0gdW5jb2F0ZWRNb2R1bGU7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFVuY29hdGVkTW9kdWxlRW50cnksIHt9LCB7fSk7XG4gIHZhciBVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IGZ1bmN0aW9uIFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKHVybCwgZnVuYykge1xuICAgICR0cmFjZXVyUnVudGltZS5zdXBlckNhbGwodGhpcywgJFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yLnByb3RvdHlwZSwgXCJjb25zdHJ1Y3RvclwiLCBbdXJsLCBudWxsXSk7XG4gICAgdGhpcy5mdW5jID0gZnVuYztcbiAgfTtcbiAgdmFyICRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciA9IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yO1xuICAoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKShVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvciwge2dldFVuY29hdGVkTW9kdWxlOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnZhbHVlXylcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVfO1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVfID0gdGhpcy5mdW5jLmNhbGwoZ2xvYmFsKTtcbiAgICB9fSwge30sIFVuY29hdGVkTW9kdWxlRW50cnkpO1xuICBmdW5jdGlvbiBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihuYW1lKSB7XG4gICAgaWYgKCFuYW1lKVxuICAgICAgcmV0dXJuO1xuICAgIHZhciB1cmwgPSBNb2R1bGVTdG9yZS5ub3JtYWxpemUobmFtZSk7XG4gICAgcmV0dXJuIG1vZHVsZUluc3RhbnRpYXRvcnNbdXJsXTtcbiAgfVxuICA7XG4gIHZhciBtb2R1bGVJbnN0YW5jZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB2YXIgbGl2ZU1vZHVsZVNlbnRpbmVsID0ge307XG4gIGZ1bmN0aW9uIE1vZHVsZSh1bmNvYXRlZE1vZHVsZSkge1xuICAgIHZhciBpc0xpdmUgPSBhcmd1bWVudHNbMV07XG4gICAgdmFyIGNvYXRlZE1vZHVsZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModW5jb2F0ZWRNb2R1bGUpLmZvckVhY2goKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBnZXR0ZXIsXG4gICAgICAgICAgdmFsdWU7XG4gICAgICBpZiAoaXNMaXZlID09PSBsaXZlTW9kdWxlU2VudGluZWwpIHtcbiAgICAgICAgdmFyIGRlc2NyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih1bmNvYXRlZE1vZHVsZSwgbmFtZSk7XG4gICAgICAgIGlmIChkZXNjci5nZXQpXG4gICAgICAgICAgZ2V0dGVyID0gZGVzY3IuZ2V0O1xuICAgICAgfVxuICAgICAgaWYgKCFnZXR0ZXIpIHtcbiAgICAgICAgdmFsdWUgPSB1bmNvYXRlZE1vZHVsZVtuYW1lXTtcbiAgICAgICAgZ2V0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvYXRlZE1vZHVsZSwgbmFtZSwge1xuICAgICAgICBnZXQ6IGdldHRlcixcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSkpO1xuICAgIE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyhjb2F0ZWRNb2R1bGUpO1xuICAgIHJldHVybiBjb2F0ZWRNb2R1bGU7XG4gIH1cbiAgdmFyIE1vZHVsZVN0b3JlID0ge1xuICAgIG5vcm1hbGl6ZTogZnVuY3Rpb24obmFtZSwgcmVmZXJlck5hbWUsIHJlZmVyZXJBZGRyZXNzKSB7XG4gICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJtb2R1bGUgbmFtZSBtdXN0IGJlIGEgc3RyaW5nLCBub3QgXCIgKyB0eXBlb2YgbmFtZSk7XG4gICAgICBpZiAoaXNBYnNvbHV0ZShuYW1lKSlcbiAgICAgICAgcmV0dXJuIGNhbm9uaWNhbGl6ZVVybChuYW1lKTtcbiAgICAgIGlmICgvW15cXC5dXFwvXFwuXFwuXFwvLy50ZXN0KG5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbW9kdWxlIG5hbWUgZW1iZWRzIC8uLi86ICcgKyBuYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lWzBdID09PSAnLicgJiYgcmVmZXJlck5hbWUpXG4gICAgICAgIHJldHVybiByZXNvbHZlVXJsKHJlZmVyZXJOYW1lLCBuYW1lKTtcbiAgICAgIHJldHVybiBjYW5vbmljYWxpemVVcmwobmFtZSk7XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKG5vcm1hbGl6ZWROYW1lKSB7XG4gICAgICB2YXIgbSA9IGdldFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIGlmICghbSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIHZhciBtb2R1bGVJbnN0YW5jZSA9IG1vZHVsZUluc3RhbmNlc1ttLnVybF07XG4gICAgICBpZiAobW9kdWxlSW5zdGFuY2UpXG4gICAgICAgIHJldHVybiBtb2R1bGVJbnN0YW5jZTtcbiAgICAgIG1vZHVsZUluc3RhbmNlID0gTW9kdWxlKG0uZ2V0VW5jb2F0ZWRNb2R1bGUoKSwgbGl2ZU1vZHVsZVNlbnRpbmVsKTtcbiAgICAgIHJldHVybiBtb2R1bGVJbnN0YW5jZXNbbS51cmxdID0gbW9kdWxlSW5zdGFuY2U7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKG5vcm1hbGl6ZWROYW1lLCBtb2R1bGUpIHtcbiAgICAgIG5vcm1hbGl6ZWROYW1lID0gU3RyaW5nKG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdID0gbmV3IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lLCAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBtb2R1bGU7XG4gICAgICB9KSk7XG4gICAgICBtb2R1bGVJbnN0YW5jZXNbbm9ybWFsaXplZE5hbWVdID0gbW9kdWxlO1xuICAgIH0sXG4gICAgZ2V0IGJhc2VVUkwoKSB7XG4gICAgICByZXR1cm4gYmFzZVVSTDtcbiAgICB9LFxuICAgIHNldCBiYXNlVVJMKHYpIHtcbiAgICAgIGJhc2VVUkwgPSBTdHJpbmcodik7XG4gICAgfSxcbiAgICByZWdpc3Rlck1vZHVsZTogZnVuY3Rpb24obmFtZSwgZnVuYykge1xuICAgICAgdmFyIG5vcm1hbGl6ZWROYW1lID0gTW9kdWxlU3RvcmUubm9ybWFsaXplKG5hbWUpO1xuICAgICAgaWYgKG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2R1cGxpY2F0ZSBtb2R1bGUgbmFtZWQgJyArIG5vcm1hbGl6ZWROYW1lKTtcbiAgICAgIG1vZHVsZUluc3RhbnRpYXRvcnNbbm9ybWFsaXplZE5hbWVdID0gbmV3IFVuY29hdGVkTW9kdWxlSW5zdGFudGlhdG9yKG5vcm1hbGl6ZWROYW1lLCBmdW5jKTtcbiAgICB9LFxuICAgIGJ1bmRsZVN0b3JlOiBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgIHJlZ2lzdGVyOiBmdW5jdGlvbihuYW1lLCBkZXBzLCBmdW5jKSB7XG4gICAgICBpZiAoIWRlcHMgfHwgIWRlcHMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJNb2R1bGUobmFtZSwgZnVuYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJ1bmRsZVN0b3JlW25hbWVdID0ge1xuICAgICAgICAgIGRlcHM6IGRlcHMsXG4gICAgICAgICAgZXhlY3V0ZTogZnVuY1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0QW5vbnltb3VzTW9kdWxlOiBmdW5jdGlvbihmdW5jKSB7XG4gICAgICByZXR1cm4gbmV3IE1vZHVsZShmdW5jLmNhbGwoZ2xvYmFsKSwgbGl2ZU1vZHVsZVNlbnRpbmVsKTtcbiAgICB9LFxuICAgIGdldEZvclRlc3Rpbmc6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciAkX18wID0gdGhpcztcbiAgICAgIGlmICghdGhpcy50ZXN0aW5nUHJlZml4Xykge1xuICAgICAgICBPYmplY3Qua2V5cyhtb2R1bGVJbnN0YW5jZXMpLnNvbWUoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHZhciBtID0gLyh0cmFjZXVyQFteXFwvXSpcXC8pLy5leGVjKGtleSk7XG4gICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICRfXzAudGVzdGluZ1ByZWZpeF8gPSBtWzFdO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5nZXQodGhpcy50ZXN0aW5nUHJlZml4XyArIG5hbWUpO1xuICAgIH1cbiAgfTtcbiAgTW9kdWxlU3RvcmUuc2V0KCdAdHJhY2V1ci9zcmMvcnVudGltZS9Nb2R1bGVTdG9yZScsIG5ldyBNb2R1bGUoe01vZHVsZVN0b3JlOiBNb2R1bGVTdG9yZX0pKTtcbiAgdmFyIHNldHVwR2xvYmFscyA9ICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHM7XG4gICR0cmFjZXVyUnVudGltZS5zZXR1cEdsb2JhbHMgPSBmdW5jdGlvbihnbG9iYWwpIHtcbiAgICBzZXR1cEdsb2JhbHMoZ2xvYmFsKTtcbiAgfTtcbiAgJHRyYWNldXJSdW50aW1lLk1vZHVsZVN0b3JlID0gTW9kdWxlU3RvcmU7XG4gIGdsb2JhbC5TeXN0ZW0gPSB7XG4gICAgcmVnaXN0ZXI6IE1vZHVsZVN0b3JlLnJlZ2lzdGVyLmJpbmQoTW9kdWxlU3RvcmUpLFxuICAgIGdldDogTW9kdWxlU3RvcmUuZ2V0LFxuICAgIHNldDogTW9kdWxlU3RvcmUuc2V0LFxuICAgIG5vcm1hbGl6ZTogTW9kdWxlU3RvcmUubm9ybWFsaXplXG4gIH07XG4gICR0cmFjZXVyUnVudGltZS5nZXRNb2R1bGVJbXBsID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBpbnN0YW50aWF0b3IgPSBnZXRVbmNvYXRlZE1vZHVsZUluc3RhbnRpYXRvcihuYW1lKTtcbiAgICByZXR1cm4gaW5zdGFudGlhdG9yICYmIGluc3RhbnRpYXRvci5nZXRVbmNvYXRlZE1vZHVsZSgpO1xuICB9O1xufSkodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzKTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3V0aWxzXCI7XG4gIHZhciB0b09iamVjdCA9ICR0cmFjZXVyUnVudGltZS50b09iamVjdDtcbiAgZnVuY3Rpb24gdG9VaW50MzIoeCkge1xuICAgIHJldHVybiB4IHwgMDtcbiAgfVxuICByZXR1cm4ge1xuICAgIGdldCB0b09iamVjdCgpIHtcbiAgICAgIHJldHVybiB0b09iamVjdDtcbiAgICB9LFxuICAgIGdldCB0b1VpbnQzMigpIHtcbiAgICAgIHJldHVybiB0b1VpbnQzMjtcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyICRfXzQ7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL0FycmF5SXRlcmF0b3JcIjtcbiAgdmFyICRfXzUgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvdXRpbHNcIiksXG4gICAgICB0b09iamVjdCA9ICRfXzUudG9PYmplY3QsXG4gICAgICB0b1VpbnQzMiA9ICRfXzUudG9VaW50MzI7XG4gIHZhciBBUlJBWV9JVEVSQVRPUl9LSU5EX0tFWVMgPSAxO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMgPSAyO1xuICB2YXIgQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTID0gMztcbiAgdmFyIEFycmF5SXRlcmF0b3IgPSBmdW5jdGlvbiBBcnJheUl0ZXJhdG9yKCkge307XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKEFycmF5SXRlcmF0b3IsICgkX180ID0ge30sIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkX180LCBcIm5leHRcIiwge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IHRvT2JqZWN0KHRoaXMpO1xuICAgICAgdmFyIGFycmF5ID0gaXRlcmF0b3IuaXRlcmF0b3JPYmplY3RfO1xuICAgICAgaWYgKCFhcnJheSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QgaXMgbm90IGFuIEFycmF5SXRlcmF0b3InKTtcbiAgICAgIH1cbiAgICAgIHZhciBpbmRleCA9IGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfO1xuICAgICAgdmFyIGl0ZW1LaW5kID0gaXRlcmF0b3IuYXJyYXlJdGVyYXRpb25LaW5kXztcbiAgICAgIHZhciBsZW5ndGggPSB0b1VpbnQzMihhcnJheS5sZW5ndGgpO1xuICAgICAgaWYgKGluZGV4ID49IGxlbmd0aCkge1xuICAgICAgICBpdGVyYXRvci5hcnJheUl0ZXJhdG9yTmV4dEluZGV4XyA9IEluZmluaXR5O1xuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QodW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gaW5kZXggKyAxO1xuICAgICAgaWYgKGl0ZW1LaW5kID09IEFSUkFZX0lURVJBVE9SX0tJTkRfVkFMVUVTKVxuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoYXJyYXlbaW5kZXhdLCBmYWxzZSk7XG4gICAgICBpZiAoaXRlbUtpbmQgPT0gQVJSQVlfSVRFUkFUT1JfS0lORF9FTlRSSUVTKVxuICAgICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoW2luZGV4LCBhcnJheVtpbmRleF1dLCBmYWxzZSk7XG4gICAgICByZXR1cm4gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QoaW5kZXgsIGZhbHNlKTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlXG4gIH0pLCBPYmplY3QuZGVmaW5lUHJvcGVydHkoJF9fNCwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZVxuICB9KSwgJF9fNCksIHt9KTtcbiAgZnVuY3Rpb24gY3JlYXRlQXJyYXlJdGVyYXRvcihhcnJheSwga2luZCkge1xuICAgIHZhciBvYmplY3QgPSB0b09iamVjdChhcnJheSk7XG4gICAgdmFyIGl0ZXJhdG9yID0gbmV3IEFycmF5SXRlcmF0b3I7XG4gICAgaXRlcmF0b3IuaXRlcmF0b3JPYmplY3RfID0gb2JqZWN0O1xuICAgIGl0ZXJhdG9yLmFycmF5SXRlcmF0b3JOZXh0SW5kZXhfID0gMDtcbiAgICBpdGVyYXRvci5hcnJheUl0ZXJhdGlvbktpbmRfID0ga2luZDtcbiAgICByZXR1cm4gaXRlcmF0b3I7XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlSXRlcmF0b3JSZXN1bHRPYmplY3QodmFsdWUsIGRvbmUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZG9uZTogZG9uZVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gZW50cmllcygpIHtcbiAgICByZXR1cm4gY3JlYXRlQXJyYXlJdGVyYXRvcih0aGlzLCBBUlJBWV9JVEVSQVRPUl9LSU5EX0VOVFJJRVMpO1xuICB9XG4gIGZ1bmN0aW9uIGtleXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9LRVlTKTtcbiAgfVxuICBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUFycmF5SXRlcmF0b3IodGhpcywgQVJSQVlfSVRFUkFUT1JfS0lORF9WQUxVRVMpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IGVudHJpZXMoKSB7XG4gICAgICByZXR1cm4gZW50cmllcztcbiAgICB9LFxuICAgIGdldCBrZXlzKCkge1xuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfSxcbiAgICBnZXQgdmFsdWVzKCkge1xuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG4gIH07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvbm9kZV9tb2R1bGVzL3JzdnAvbGliL3JzdnAvYXNhcFwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIjtcbiAgdmFyICRfX2RlZmF1bHQgPSBmdW5jdGlvbiBhc2FwKGNhbGxiYWNrLCBhcmcpIHtcbiAgICB2YXIgbGVuZ3RoID0gcXVldWUucHVzaChbY2FsbGJhY2ssIGFyZ10pO1xuICAgIGlmIChsZW5ndGggPT09IDEpIHtcbiAgICAgIHNjaGVkdWxlRmx1c2goKTtcbiAgICB9XG4gIH07XG4gIHZhciBicm93c2VyR2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHt9O1xuICB2YXIgQnJvd3Nlck11dGF0aW9uT2JzZXJ2ZXIgPSBicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgYnJvd3Nlckdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuICBmdW5jdGlvbiB1c2VOZXh0VGljaygpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIHVzZU11dGF0aW9uT2JzZXJ2ZXIoKSB7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBvYnNlcnZlciA9IG5ldyBCcm93c2VyTXV0YXRpb25PYnNlcnZlcihmbHVzaCk7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIG5vZGUuZGF0YSA9IChpdGVyYXRpb25zID0gKytpdGVyYXRpb25zICUgMik7XG4gICAgfTtcbiAgfVxuICBmdW5jdGlvbiB1c2VTZXRUaW1lb3V0KCkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHNldFRpbWVvdXQoZmx1c2gsIDEpO1xuICAgIH07XG4gIH1cbiAgdmFyIHF1ZXVlID0gW107XG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0dXBsZSA9IHF1ZXVlW2ldO1xuICAgICAgdmFyIGNhbGxiYWNrID0gdHVwbGVbMF0sXG4gICAgICAgICAgYXJnID0gdHVwbGVbMV07XG4gICAgICBjYWxsYmFjayhhcmcpO1xuICAgIH1cbiAgICBxdWV1ZSA9IFtdO1xuICB9XG4gIHZhciBzY2hlZHVsZUZsdXNoO1xuICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHt9LnRvU3RyaW5nLmNhbGwocHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJykge1xuICAgIHNjaGVkdWxlRmx1c2ggPSB1c2VOZXh0VGljaygpO1xuICB9IGVsc2UgaWYgKEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgc2NoZWR1bGVGbHVzaCA9IHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbiAgfSBlbHNlIHtcbiAgICBzY2hlZHVsZUZsdXNoID0gdXNlU2V0VGltZW91dCgpO1xuICB9XG4gIHJldHVybiB7Z2V0IGRlZmF1bHQoKSB7XG4gICAgICByZXR1cm4gJF9fZGVmYXVsdDtcbiAgICB9fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvUHJvbWlzZVwiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCI7XG4gIHZhciBhc3luYyA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL25vZGVfbW9kdWxlcy9yc3ZwL2xpYi9yc3ZwL2FzYXBcIikuZGVmYXVsdDtcbiAgZnVuY3Rpb24gaXNQcm9taXNlKHgpIHtcbiAgICByZXR1cm4geCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeC5zdGF0dXNfICE9PSB1bmRlZmluZWQ7XG4gIH1cbiAgZnVuY3Rpb24gY2hhaW4ocHJvbWlzZSkge1xuICAgIHZhciBvblJlc29sdmUgPSBhcmd1bWVudHNbMV0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzFdIDogKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH0pO1xuICAgIHZhciBvblJlamVjdCA9IGFyZ3VtZW50c1syXSAhPT0gKHZvaWQgMCkgPyBhcmd1bWVudHNbMl0gOiAoZnVuY3Rpb24oZSkge1xuICAgICAgdGhyb3cgZTtcbiAgICB9KTtcbiAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZChwcm9taXNlLmNvbnN0cnVjdG9yKTtcbiAgICBzd2l0Y2ggKHByb21pc2Uuc3RhdHVzXykge1xuICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgIHRocm93IFR5cGVFcnJvcjtcbiAgICAgIGNhc2UgJ3BlbmRpbmcnOlxuICAgICAgICBwcm9taXNlLm9uUmVzb2x2ZV8ucHVzaChbZGVmZXJyZWQsIG9uUmVzb2x2ZV0pO1xuICAgICAgICBwcm9taXNlLm9uUmVqZWN0Xy5wdXNoKFtkZWZlcnJlZCwgb25SZWplY3RdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXNvbHZlZCc6XG4gICAgICAgIHByb21pc2VSZWFjdChkZWZlcnJlZCwgb25SZXNvbHZlLCBwcm9taXNlLnZhbHVlXyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVqZWN0ZWQnOlxuICAgICAgICBwcm9taXNlUmVhY3QoZGVmZXJyZWQsIG9uUmVqZWN0LCBwcm9taXNlLnZhbHVlXyk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxuICBmdW5jdGlvbiBnZXREZWZlcnJlZChDKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHJlc3VsdC5wcm9taXNlID0gbmV3IEMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVzdWx0LnJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgcmVzdWx0LnJlamVjdCA9IHJlamVjdDtcbiAgICB9KSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB2YXIgUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UocmVzb2x2ZXIpIHtcbiAgICB2YXIgJF9fNiA9IHRoaXM7XG4gICAgdGhpcy5zdGF0dXNfID0gJ3BlbmRpbmcnO1xuICAgIHRoaXMub25SZXNvbHZlXyA9IFtdO1xuICAgIHRoaXMub25SZWplY3RfID0gW107XG4gICAgcmVzb2x2ZXIoKGZ1bmN0aW9uKHgpIHtcbiAgICAgIHByb21pc2VSZXNvbHZlKCRfXzYsIHgpO1xuICAgIH0pLCAoZnVuY3Rpb24ocikge1xuICAgICAgcHJvbWlzZVJlamVjdCgkX182LCByKTtcbiAgICB9KSk7XG4gIH07XG4gICgkdHJhY2V1clJ1bnRpbWUuY3JlYXRlQ2xhc3MpKFByb21pc2UsIHtcbiAgICBjYXRjaDogZnVuY3Rpb24ob25SZWplY3QpIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdCk7XG4gICAgfSxcbiAgICB0aGVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvblJlc29sdmUgPSBhcmd1bWVudHNbMF0gIT09ICh2b2lkIDApID8gYXJndW1lbnRzWzBdIDogKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgICB9KTtcbiAgICAgIHZhciBvblJlamVjdCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIHZhciAkX182ID0gdGhpcztcbiAgICAgIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gICAgICByZXR1cm4gY2hhaW4odGhpcywgKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgeCA9IHByb21pc2VDb2VyY2UoY29uc3RydWN0b3IsIHgpO1xuICAgICAgICByZXR1cm4geCA9PT0gJF9fNiA/IG9uUmVqZWN0KG5ldyBUeXBlRXJyb3IpIDogaXNQcm9taXNlKHgpID8geC50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpIDogb25SZXNvbHZlKHgpO1xuICAgICAgfSksIG9uUmVqZWN0KTtcbiAgICB9XG4gIH0sIHtcbiAgICByZXNvbHZlOiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXNvbHZlKHgpO1xuICAgICAgfSkpO1xuICAgIH0sXG4gICAgcmVqZWN0OiBmdW5jdGlvbihyKSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMoKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZWplY3Qocik7XG4gICAgICB9KSk7XG4gICAgfSxcbiAgICBjYXN0OiBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoeCBpbnN0YW5jZW9mIHRoaXMpXG4gICAgICAgIHJldHVybiB4O1xuICAgICAgaWYgKGlzUHJvbWlzZSh4KSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICAgIGNoYWluKHgsIHJlc3VsdC5yZXNvbHZlLCByZXN1bHQucmVqZWN0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wcm9taXNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZSh4KTtcbiAgICB9LFxuICAgIGFsbDogZnVuY3Rpb24odmFsdWVzKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSBnZXREZWZlcnJlZCh0aGlzKTtcbiAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICB2YXIgcmVzb2x1dGlvbnMgPSBbXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgKytjb3VudDtcbiAgICAgICAgICB0aGlzLmNhc3QodmFsdWVzW2ldKS50aGVuKGZ1bmN0aW9uKGksIHgpIHtcbiAgICAgICAgICAgIHJlc29sdXRpb25zW2ldID0geDtcbiAgICAgICAgICAgIGlmICgtLWNvdW50ID09PSAwKVxuICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc29sdXRpb25zKTtcbiAgICAgICAgICB9LmJpbmQodW5kZWZpbmVkLCBpKSwgKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIGlmIChjb3VudCA+IDApXG4gICAgICAgICAgICAgIGNvdW50ID0gMDtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvdW50ID09PSAwKVxuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzb2x1dGlvbnMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuICAgIHJhY2U6IGZ1bmN0aW9uKHZhbHVlcykge1xuICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQodGhpcyk7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuY2FzdCh2YWx1ZXNbaV0pLnRoZW4oKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoeCk7XG4gICAgICAgICAgfSksIChmdW5jdGlvbihyKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qocik7XG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIHByb21pc2VSZXNvbHZlKHByb21pc2UsIHgpIHtcbiAgICBwcm9taXNlRG9uZShwcm9taXNlLCAncmVzb2x2ZWQnLCB4LCBwcm9taXNlLm9uUmVzb2x2ZV8pO1xuICB9XG4gIGZ1bmN0aW9uIHByb21pc2VSZWplY3QocHJvbWlzZSwgcikge1xuICAgIHByb21pc2VEb25lKHByb21pc2UsICdyZWplY3RlZCcsIHIsIHByb21pc2Uub25SZWplY3RfKTtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlRG9uZShwcm9taXNlLCBzdGF0dXMsIHZhbHVlLCByZWFjdGlvbnMpIHtcbiAgICBpZiAocHJvbWlzZS5zdGF0dXNfICE9PSAncGVuZGluZycpXG4gICAgICByZXR1cm47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZWFjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHByb21pc2VSZWFjdChyZWFjdGlvbnNbaV1bMF0sIHJlYWN0aW9uc1tpXVsxXSwgdmFsdWUpO1xuICAgIH1cbiAgICBwcm9taXNlLnN0YXR1c18gPSBzdGF0dXM7XG4gICAgcHJvbWlzZS52YWx1ZV8gPSB2YWx1ZTtcbiAgICBwcm9taXNlLm9uUmVzb2x2ZV8gPSBwcm9taXNlLm9uUmVqZWN0XyA9IHVuZGVmaW5lZDtcbiAgfVxuICBmdW5jdGlvbiBwcm9taXNlUmVhY3QoZGVmZXJyZWQsIGhhbmRsZXIsIHgpIHtcbiAgICBhc3luYygoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgeSA9IGhhbmRsZXIoeCk7XG4gICAgICAgIGlmICh5ID09PSBkZWZlcnJlZC5wcm9taXNlKVxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgICAgIGVsc2UgaWYgKGlzUHJvbWlzZSh5KSlcbiAgICAgICAgICBjaGFpbih5LCBkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh5KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuICB2YXIgdGhlbmFibGVTeW1ib2wgPSAnQEB0aGVuYWJsZSc7XG4gIGZ1bmN0aW9uIHByb21pc2VDb2VyY2UoY29uc3RydWN0b3IsIHgpIHtcbiAgICBpZiAoaXNQcm9taXNlKHgpKSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9IGVsc2UgaWYgKHggJiYgdHlwZW9mIHgudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIHAgPSB4W3RoZW5hYmxlU3ltYm9sXTtcbiAgICAgIGlmIChwKSB7XG4gICAgICAgIHJldHVybiBwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gZ2V0RGVmZXJyZWQoY29uc3RydWN0b3IpO1xuICAgICAgICB4W3RoZW5hYmxlU3ltYm9sXSA9IGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgeC50aGVuKGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfVxuICByZXR1cm4ge2dldCBQcm9taXNlKCkge1xuICAgICAgcmV0dXJuIFByb21pc2U7XG4gICAgfX07XG59KTtcblN5c3RlbS5yZWdpc3RlcihcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiLCBbXSwgZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgX19tb2R1bGVOYW1lID0gXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9TdHJpbmdcIjtcbiAgdmFyICR0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciAkaW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUuaW5kZXhPZjtcbiAgdmFyICRsYXN0SW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUubGFzdEluZGV4T2Y7XG4gIGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc2VhcmNoKSB7XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICBpZiAodGhpcyA9PSBudWxsIHx8ICR0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgcmV0dXJuICRpbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHBvcykgPT0gc3RhcnQ7XG4gIH1cbiAgZnVuY3Rpb24gZW5kc1dpdGgoc2VhcmNoKSB7XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICBpZiAodGhpcyA9PSBudWxsIHx8ICR0b1N0cmluZy5jYWxsKHNlYXJjaCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcigpO1xuICAgIH1cbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvcyA9IHN0cmluZ0xlbmd0aDtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHZhciBwb3NpdGlvbiA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChwb3NpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgICAgIGlmIChpc05hTihwb3MpKSB7XG4gICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZW5kID0gTWF0aC5taW4oTWF0aC5tYXgocG9zLCAwKSwgc3RyaW5nTGVuZ3RoKTtcbiAgICB2YXIgc3RhcnQgPSBlbmQgLSBzZWFyY2hMZW5ndGg7XG4gICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gJGxhc3RJbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHN0YXJ0KSA9PSBzdGFydDtcbiAgfVxuICBmdW5jdGlvbiBjb250YWlucyhzZWFyY2gpIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gc3RyaW5nLmxlbmd0aDtcbiAgICB2YXIgc2VhcmNoU3RyaW5nID0gU3RyaW5nKHNlYXJjaCk7XG4gICAgdmFyIHNlYXJjaExlbmd0aCA9IHNlYXJjaFN0cmluZy5sZW5ndGg7XG4gICAgdmFyIHBvc2l0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIHBvcyA9IHBvc2l0aW9uID8gTnVtYmVyKHBvc2l0aW9uKSA6IDA7XG4gICAgaWYgKGlzTmFOKHBvcykpIHtcbiAgICAgIHBvcyA9IDA7XG4gICAgfVxuICAgIHZhciBzdGFydCA9IE1hdGgubWluKE1hdGgubWF4KHBvcywgMCksIHN0cmluZ0xlbmd0aCk7XG4gICAgcmV0dXJuICRpbmRleE9mLmNhbGwoc3RyaW5nLCBzZWFyY2hTdHJpbmcsIHBvcykgIT0gLTE7XG4gIH1cbiAgZnVuY3Rpb24gcmVwZWF0KGNvdW50KSB7XG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCk7XG4gICAgfVxuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcodGhpcyk7XG4gICAgdmFyIG4gPSBjb3VudCA/IE51bWJlcihjb3VudCkgOiAwO1xuICAgIGlmIChpc05hTihuKSkge1xuICAgICAgbiA9IDA7XG4gICAgfVxuICAgIGlmIChuIDwgMCB8fCBuID09IEluZmluaXR5KSB7XG4gICAgICB0aHJvdyBSYW5nZUVycm9yKCk7XG4gICAgfVxuICAgIGlmIChuID09IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHdoaWxlIChuLS0pIHtcbiAgICAgIHJlc3VsdCArPSBzdHJpbmc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZnVuY3Rpb24gY29kZVBvaW50QXQocG9zaXRpb24pIHtcbiAgICBpZiAodGhpcyA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoKTtcbiAgICB9XG4gICAgdmFyIHN0cmluZyA9IFN0cmluZyh0aGlzKTtcbiAgICB2YXIgc2l6ZSA9IHN0cmluZy5sZW5ndGg7XG4gICAgdmFyIGluZGV4ID0gcG9zaXRpb24gPyBOdW1iZXIocG9zaXRpb24pIDogMDtcbiAgICBpZiAoaXNOYU4oaW5kZXgpKSB7XG4gICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gc2l6ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdmFyIGZpcnN0ID0gc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpO1xuICAgIHZhciBzZWNvbmQ7XG4gICAgaWYgKGZpcnN0ID49IDB4RDgwMCAmJiBmaXJzdCA8PSAweERCRkYgJiYgc2l6ZSA+IGluZGV4ICsgMSkge1xuICAgICAgc2Vjb25kID0gc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXggKyAxKTtcbiAgICAgIGlmIChzZWNvbmQgPj0gMHhEQzAwICYmIHNlY29uZCA8PSAweERGRkYpIHtcbiAgICAgICAgcmV0dXJuIChmaXJzdCAtIDB4RDgwMCkgKiAweDQwMCArIHNlY29uZCAtIDB4REMwMCArIDB4MTAwMDA7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaXJzdDtcbiAgfVxuICBmdW5jdGlvbiByYXcoY2FsbHNpdGUpIHtcbiAgICB2YXIgcmF3ID0gY2FsbHNpdGUucmF3O1xuICAgIHZhciBsZW4gPSByYXcubGVuZ3RoID4+PiAwO1xuICAgIGlmIChsZW4gPT09IDApXG4gICAgICByZXR1cm4gJyc7XG4gICAgdmFyIHMgPSAnJztcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHMgKz0gcmF3W2ldO1xuICAgICAgaWYgKGkgKyAxID09PSBsZW4pXG4gICAgICAgIHJldHVybiBzO1xuICAgICAgcyArPSBhcmd1bWVudHNbKytpXTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZnJvbUNvZGVQb2ludCgpIHtcbiAgICB2YXIgY29kZVVuaXRzID0gW107XG4gICAgdmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbiAgICB2YXIgaGlnaFN1cnJvZ2F0ZTtcbiAgICB2YXIgbG93U3Vycm9nYXRlO1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgY29kZVBvaW50ID0gTnVtYmVyKGFyZ3VtZW50c1tpbmRleF0pO1xuICAgICAgaWYgKCFpc0Zpbml0ZShjb2RlUG9pbnQpIHx8IGNvZGVQb2ludCA8IDAgfHwgY29kZVBvaW50ID4gMHgxMEZGRkYgfHwgZmxvb3IoY29kZVBvaW50KSAhPSBjb2RlUG9pbnQpIHtcbiAgICAgICAgdGhyb3cgUmFuZ2VFcnJvcignSW52YWxpZCBjb2RlIHBvaW50OiAnICsgY29kZVBvaW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2RlUG9pbnQgPD0gMHhGRkZGKSB7XG4gICAgICAgIGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMDtcbiAgICAgICAgaGlnaFN1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgPj4gMTApICsgMHhEODAwO1xuICAgICAgICBsb3dTdXJyb2dhdGUgPSAoY29kZVBvaW50ICUgMHg0MDApICsgMHhEQzAwO1xuICAgICAgICBjb2RlVW5pdHMucHVzaChoaWdoU3Vycm9nYXRlLCBsb3dTdXJyb2dhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpO1xuICB9XG4gIHJldHVybiB7XG4gICAgZ2V0IHN0YXJ0c1dpdGgoKSB7XG4gICAgICByZXR1cm4gc3RhcnRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBlbmRzV2l0aCgpIHtcbiAgICAgIHJldHVybiBlbmRzV2l0aDtcbiAgICB9LFxuICAgIGdldCBjb250YWlucygpIHtcbiAgICAgIHJldHVybiBjb250YWlucztcbiAgICB9LFxuICAgIGdldCByZXBlYXQoKSB7XG4gICAgICByZXR1cm4gcmVwZWF0O1xuICAgIH0sXG4gICAgZ2V0IGNvZGVQb2ludEF0KCkge1xuICAgICAgcmV0dXJuIGNvZGVQb2ludEF0O1xuICAgIH0sXG4gICAgZ2V0IHJhdygpIHtcbiAgICAgIHJldHVybiByYXc7XG4gICAgfSxcbiAgICBnZXQgZnJvbUNvZGVQb2ludCgpIHtcbiAgICAgIHJldHVybiBmcm9tQ29kZVBvaW50O1xuICAgIH1cbiAgfTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvcG9seWZpbGxzXCIsIFtdLCBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBfX21vZHVsZU5hbWUgPSBcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiO1xuICB2YXIgUHJvbWlzZSA9IFN5c3RlbS5nZXQoXCJ0cmFjZXVyLXJ1bnRpbWVAMC4wLjMyL3NyYy9ydW50aW1lL3BvbHlmaWxscy9Qcm9taXNlXCIpLlByb21pc2U7XG4gIHZhciAkX185ID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL1N0cmluZ1wiKSxcbiAgICAgIGNvZGVQb2ludEF0ID0gJF9fOS5jb2RlUG9pbnRBdCxcbiAgICAgIGNvbnRhaW5zID0gJF9fOS5jb250YWlucyxcbiAgICAgIGVuZHNXaXRoID0gJF9fOS5lbmRzV2l0aCxcbiAgICAgIGZyb21Db2RlUG9pbnQgPSAkX185LmZyb21Db2RlUG9pbnQsXG4gICAgICByZXBlYXQgPSAkX185LnJlcGVhdCxcbiAgICAgIHJhdyA9ICRfXzkucmF3LFxuICAgICAgc3RhcnRzV2l0aCA9ICRfXzkuc3RhcnRzV2l0aDtcbiAgdmFyICRfXzkgPSBTeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbHMvQXJyYXlJdGVyYXRvclwiKSxcbiAgICAgIGVudHJpZXMgPSAkX185LmVudHJpZXMsXG4gICAgICBrZXlzID0gJF9fOS5rZXlzLFxuICAgICAgdmFsdWVzID0gJF9fOS52YWx1ZXM7XG4gIGZ1bmN0aW9uIG1heWJlRGVmaW5lTWV0aG9kKG9iamVjdCwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoIShuYW1lIGluIG9iamVjdCkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlQWRkRnVuY3Rpb25zKG9iamVjdCwgZnVuY3Rpb25zKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmdW5jdGlvbnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gZnVuY3Rpb25zW2ldO1xuICAgICAgdmFyIHZhbHVlID0gZnVuY3Rpb25zW2kgKyAxXTtcbiAgICAgIG1heWJlRGVmaW5lTWV0aG9kKG9iamVjdCwgbmFtZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbFByb21pc2UoZ2xvYmFsKSB7XG4gICAgaWYgKCFnbG9iYWwuUHJvbWlzZSlcbiAgICAgIGdsb2JhbC5Qcm9taXNlID0gUHJvbWlzZTtcbiAgfVxuICBmdW5jdGlvbiBwb2x5ZmlsbFN0cmluZyhTdHJpbmcpIHtcbiAgICBtYXliZUFkZEZ1bmN0aW9ucyhTdHJpbmcucHJvdG90eXBlLCBbJ2NvZGVQb2ludEF0JywgY29kZVBvaW50QXQsICdjb250YWlucycsIGNvbnRhaW5zLCAnZW5kc1dpdGgnLCBlbmRzV2l0aCwgJ3N0YXJ0c1dpdGgnLCBzdGFydHNXaXRoLCAncmVwZWF0JywgcmVwZWF0XSk7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoU3RyaW5nLCBbJ2Zyb21Db2RlUG9pbnQnLCBmcm9tQ29kZVBvaW50LCAncmF3JywgcmF3XSk7XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGxBcnJheShBcnJheSwgU3ltYm9sKSB7XG4gICAgbWF5YmVBZGRGdW5jdGlvbnMoQXJyYXkucHJvdG90eXBlLCBbJ2VudHJpZXMnLCBlbnRyaWVzLCAna2V5cycsIGtleXMsICd2YWx1ZXMnLCB2YWx1ZXNdKTtcbiAgICBpZiAoU3ltYm9sICYmIFN5bWJvbC5pdGVyYXRvcikge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgU3ltYm9sLml0ZXJhdG9yLCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZXMsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gcG9seWZpbGwoZ2xvYmFsKSB7XG4gICAgcG9seWZpbGxQcm9taXNlKGdsb2JhbCk7XG4gICAgcG9seWZpbGxTdHJpbmcoZ2xvYmFsLlN0cmluZyk7XG4gICAgcG9seWZpbGxBcnJheShnbG9iYWwuQXJyYXksIGdsb2JhbC5TeW1ib2wpO1xuICB9XG4gIHBvbHlmaWxsKHRoaXMpO1xuICB2YXIgc2V0dXBHbG9iYWxzID0gJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscztcbiAgJHRyYWNldXJSdW50aW1lLnNldHVwR2xvYmFscyA9IGZ1bmN0aW9uKGdsb2JhbCkge1xuICAgIHNldHVwR2xvYmFscyhnbG9iYWwpO1xuICAgIHBvbHlmaWxsKGdsb2JhbCk7XG4gIH07XG4gIHJldHVybiB7fTtcbn0pO1xuU3lzdGVtLnJlZ2lzdGVyKFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIiwgW10sIGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIF9fbW9kdWxlTmFtZSA9IFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIjtcbiAgdmFyICRfXzExID0gU3lzdGVtLmdldChcInRyYWNldXItcnVudGltZUAwLjAuMzIvc3JjL3J1bnRpbWUvcG9seWZpbGxzL3BvbHlmaWxsc1wiKTtcbiAgcmV0dXJuIHt9O1xufSk7XG5TeXN0ZW0uZ2V0KFwidHJhY2V1ci1ydW50aW1lQDAuMC4zMi9zcmMvcnVudGltZS9wb2x5ZmlsbC1pbXBvcnRcIiArICcnKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJGV2FBU0hcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJSb3VuZFwiOiB7XG4gICAgXCJ0aWxlbWFwc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcIm1hcFwiLFxuICAgICAgICBcInBhdGhcIjogXCJzcHJpdGVzL21hcHMvMmZvcnQuanNvblwiXG4gICAgICB9XG4gICAgXSxcbiAgICBcInNwcml0ZXNoZWV0c1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInBsYXllclwiLFxuICAgICAgICBcInBhdGhcIjogXCJzcHJpdGVzL2VuZW15LnBuZ1wiLFxuICAgICAgICBcIndpZHRoXCI6IDY0LFxuICAgICAgICBcImhlaWdodFwiOiA2NCxcbiAgICAgICAgXCJsZW5ndGhcIjogNFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwiaGFkb3VrZW5cIixcbiAgICAgICAgXCJwYXRoXCI6IFwic3ByaXRlcy9oYWRvdWtlbi5wbmdcIixcbiAgICAgICAgXCJ3aWR0aFwiOiAxMDAsXG4gICAgICAgIFwiaGVpZ2h0XCI6IDc1LFxuICAgICAgICBcImxlbmd0aFwiOiA2XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJmaXJlYmFsbFwiLFxuICAgICAgICBcInBhdGhcIjogXCJzcHJpdGVzL2ZpcmViYWxsLnBuZ1wiLFxuICAgICAgICBcIndpZHRoXCI6IDIzLFxuICAgICAgICBcImhlaWdodFwiOiAyOCxcbiAgICAgICAgXCJsZW5ndGhcIjogNCBcbiAgICAgIH1cbiAgICBdLFxuICAgIFwiaW1hZ2VzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwiRGVzZXJ0XCIsXG4gICAgICAgIFwicGF0aFwiOiBcInNwcml0ZXMvdG13X2Rlc2VydF9zcGFjaW5nLnBuZ1wiXG4gICAgICB9XG4gICAgXSxcbiAgICBcImF1ZGlvc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcImp1bXBcIixcbiAgICAgICAgXCJwYXRoXCI6IFwic291bmRzL2p1bXAub2dnXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcImxhbmRcIixcbiAgICAgICAgXCJwYXRoXCI6IFwic291bmRzL2xhbmQub2dnXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcImhhZG91a2VuXCIsXG4gICAgICAgIFwicGF0aFwiOiBcInNvdW5kcy9oYWRvdWtlbi5tcDNcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwiZXhwbG9zaW9uXCIsXG4gICAgICAgIFwicGF0aFwiOiBcInNvdW5kcy9leHBsb3Npb24ubXAzXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcImV4cGxvc2lvbjVcIixcbiAgICAgICAgXCJwYXRoXCI6IFwic291bmRzL2V4cGxvc2lvbjUubXAzXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInRvYXN0eVwiLFxuICAgICAgICBcInBhdGhcIjogXCJzb3VuZHMvdG9hc3R5Lm1wM1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJ0b2FzdHkzXCIsXG4gICAgICAgIFwicGF0aFwiOiBcInNvdW5kcy90b2FzdHkzLm1wM1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJkb2RnZVwiLFxuICAgICAgICBcInBhdGhcIjogXCJzb3VuZHMvZG9kZ2UubXAzXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcImRvZGdlMlwiLFxuICAgICAgICBcInBhdGhcIjogXCJzb3VuZHMvZG9kZ2UyLm1wM1wiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJtdXNpY1wiLFxuICAgICAgICBcInBhdGhcIjogXCJzb3VuZHMvbXVzaWMub2dnXCJcbiAgICAgIH1cbiAgICBdXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSGFkb3VrZW4gZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcbiAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSkge1xuICAgIHN1cGVyKGdhbWUsIHgsIHksIFwibm9uZVwiLCAwKVxuXG4gICAgZ2FtZS5waHlzaWNzLnAyLmVuYWJsZSh0aGlzKVxuXG4gICAgdGhpcy5ib2R5LnNldENpcmNsZSgxNilcbiAgICB0aGlzLmJvZHkuX3R5cGUgPSBcImhhZG91a2VuXCJcblxuICAgIHRoaXMuc3BlZWQgPSAyMDAwXG4gICAgdGhpcy5vd25lciA9IG51bGxcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLmJvZHkuc2V0WmVyb1JvdGF0aW9uKClcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcbiAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSkge1xuICAgIHN1cGVyKGdhbWUsIHgsIHksIFwibm9uZVwiLCAwKVxuXG4gICAgZ2FtZS5waHlzaWNzLnAyLmVuYWJsZSh0aGlzKVxuXG4gICAgdGhpcy5ib2R5LnNldENpcmNsZSgyNClcbiAgICB0aGlzLmJvZHkuX3R5cGUgPSBcInBsYXllclwiXG5cbiAgICB0aGlzLm5hbWUgPSBcIlwiXG4gICAgdGhpcy5zcGVlZCA9IDMwMFxuICAgIHRoaXMuanVtcGluZyA9IGZhbHNlXG4gICAgdGhpcy5qdW1wRHVyYXRpb24gPSA2MDBcbiAgICB0aGlzLmhhZG91a2VuVGltZW91dCA9IDEwMDBcbiAgICB0aGlzLmxhc3RIYWRvdWtlbiA9IG51bGxcblxuICAgIHRoaXMuaW5pdGlhbEhlaWdodCA9IDEuMFxuICAgIHRoaXMuc2NhbGUuc2V0VG8odGhpcy5pbml0aWFsSGVpZ2h0LCB0aGlzLmluaXRpYWxIZWlnaHQpXG4gICAgdGhpcy5yb3RhdGlvbk9mZnNldCA9IE1hdGguUEkgLyAyXG5cbiAgICB0aGlzLnVwID0gZmFsc2VcbiAgICB0aGlzLnJpZ2h0ID0gZmFsc2VcbiAgICB0aGlzLmRvd24gPSBmYWxzZVxuICAgIHRoaXMubGVmdCA9IGZhbHNlXG5cbiAgICB0aGlzLmp1bXBTb3VuZCA9IGdhbWUuYWRkLmF1ZGlvKFwianVtcFwiKVxuICAgIHRoaXMubGFuZFNvdW5kID0gZ2FtZS5hZGQuYXVkaW8oXCJqdW1wXCIpXG4gICAgdGhpcy5maXJlU291bmQgPSBnYW1lLmFkZC5hdWRpbyhcImhhZG91a2VuXCIpXG4gIH1cblxuICBqdW1wKCkge1xuICAgIGlmICh0aGlzLmp1bXBpbmcpIHJldHVybiBmYWxzZVxuXG4gICAgdmFyIGluaXRpYWxIZWlnaHQgPSB0aGlzLmluaXRpYWxIZWlnaHRcbiAgICAgICwgYXBleCA9IGluaXRpYWxIZWlnaHQgKiAxLjJcbiAgICAgICwgbWF4ID0ge3g6IGFwZXgsIHk6IGFwZXh9XG4gICAgICAsIG1pbiA9IHt4OiBpbml0aWFsSGVpZ2h0LCB5OiBpbml0aWFsSGVpZ2h0fVxuICAgICAgLCB1cFRpbWUgPSB0aGlzLmp1bXBEdXJhdGlvbiAvIDJcbiAgICAgICwgZG93blRpbWUgPSB0aGlzLmp1bXBEdXJhdGlvbiAvIDJcbiAgICAgICwgZWFzZVVwID0gUGhhc2VyLkVhc2luZy5TaW51c29pZGFsLk91dFxuICAgICAgLCBlYXNlRG93biA9IFBoYXNlci5FYXNpbmcuU2ludXNvaWRhbC5JblxuICAgICAgLCBhc2NlbnQgPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuc2NhbGUpLnRvKG1heCwgdXBUaW1lLCBlYXNlVXApXG4gICAgICAsIGRlc2NlbnQgPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuc2NhbGUpLnRvKG1pbiwgZG93blRpbWUsIGVhc2VEb3duKVxuXG4gICAgYXNjZW50Lm9uU3RhcnQuYWRkKCgpID0+IHtcbiAgICAgIHRoaXMuanVtcFNvdW5kLnBsYXkoKVxuICAgICAgdGhpcy5qdW1waW5nID0gdHJ1ZVxuICAgIH0pXG4gICAgZGVzY2VudC5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XG4gICAgICB0aGlzLmxhbmRTb3VuZC5wbGF5KClcbiAgICAgIHRoaXMuanVtcGluZyA9IGZhbHNlXG4gICAgfSlcbiAgICBhc2NlbnQuY2hhaW4oZGVzY2VudCkuc3RhcnQoKVxuICB9XG5cbiAgZmlyZShoYWRvdWtlbnMpIHtcbiAgICB2YXIgaGFkb3VrZW4gPSBoYWRvdWtlbnMuZ2V0Rmlyc3RFeGlzdHMoZmFsc2UpXG4gICAgdmFyIG5vdyA9IHRoaXMuZ2FtZS50aW1lLm5vd1xuICAgIHZhciBoYWRvdWtlbkFsbG93ZWQgPSBub3cgPiB0aGlzLmxhc3RIYWRvdWtlbiArIHRoaXMuaGFkb3VrZW5UaW1lb3V0XG5cbiAgICBpZiAoIWhhZG91a2VuQWxsb3dlZCkgcmV0dXJuXG4gICAgaGFkb3VrZW4ucmVzZXQodGhpcy54LCB0aGlzLnkpXG4gICAgaGFkb3VrZW4uYm9keS5yb3RhdGlvbiA9IHRoaXMuYm9keS5yb3RhdGlvblxuICAgIGhhZG91a2VuLmJvZHkubW92ZUZvcndhcmQoaGFkb3VrZW4uc3BlZWQpXG4gICAgaGFkb3VrZW4ub3duZXIgPSB0aGlzXG4gICAgdGhpcy5sYXN0SGFkb3VrZW4gPSBub3dcbiAgICB0aGlzLmZpcmVTb3VuZC5wbGF5KClcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB2YXIgbGVmdFZlbCA9IHRoaXMubGVmdCA/IHRoaXMuc3BlZWQgKiAtMSA6IDBcbiAgICAgICwgcmlnaHRWZWwgPSB0aGlzLnJpZ2h0ID8gdGhpcy5zcGVlZCA6IDBcbiAgICAgICwgdXBWZWwgPSB0aGlzLnVwID8gdGhpcy5zcGVlZCAqIC0xIDogMFxuICAgICAgLCBkb3duVmVsID0gdGhpcy5kb3duID8gdGhpcy5zcGVlZCA6IDBcbiAgICAgICwgeFZlbCA9IGxlZnRWZWwgKyByaWdodFZlbFxuICAgICAgLCB5VmVsID0gdXBWZWwgKyBkb3duVmVsXG4gICAgICAsIHN0b3BwZWQgPSAoIXhWZWwgJiYgIXlWZWwpXG5cbiAgICB0aGlzLmJvZHkuc2V0WmVyb1JvdGF0aW9uKClcbiAgICB0aGlzLmJvZHkucm90YXRpb24gPSBzdG9wcGVkIFxuICAgICAgPyB0aGlzLmJvZHkucm90YXRpb25cbiAgICAgIDogUGhhc2VyLk1hdGguYW5nbGVCZXR3ZWVuKDAsIDAsIHhWZWwsIHlWZWwpICsgdGhpcy5yb3RhdGlvbk9mZnNldFxuXG4gICAgaWYgKCF0aGlzLmp1bXBpbmcpIHtcbiAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS54ID0geFZlbCBcbiAgICAgIHRoaXMuYm9keS52ZWxvY2l0eS55ID0geVZlbFxuICAgICAgdGhpcy5hbmltYXRpb25zLnBsYXkoc3RvcHBlZCA/IFwiaWRsZVwiIDogXCJ3YWxraW5nXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYW5pbWF0aW9ucy5wbGF5KFwianVtcGluZ1wiKSBcbiAgICB9XG4gIH1cbn1cbiIsInZhciBSb3VuZCA9IHJlcXVpcmUoXCIuL3N0YXRlcy9Sb3VuZFwiKVxudmFyIEFzc2V0TG9hZGVyID0gcmVxdWlyZShcIi4vc3lzdGVtcy9Bc3NldExvYWRlclwiKVxudmFyIGFzc2V0cyA9IHJlcXVpcmUoXCIuL2Fzc2V0cy5qc29uXCIpXG52YXIgaW8gPSByZXF1aXJlKFwic29ja2V0LmlvLWNsaWVudFwiKVxudmFyIHNlcnZlclVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmICsgXCJzZXJ2ZXJcIlxudmFyIHNvY2tldCA9IGlvLmNvbm5lY3Qoc2VydmVyVXJsKVxudmFyIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoMTkyMCwgOTYwLCBQaGFzZXIuQ0FOVkFTLCBcImdhbWVcIilcblxuc29ja2V0Lm9uKFwiY29ubmVjdFwiLCBmdW5jdGlvbiAoKSB7XG4gIGNvbnNvbGUubG9nKFwic2VydmVyIGNvbm5lY3RlZFwiKVxuICBnYW1lLl9hc3NldExvYWRlciA9IG5ldyBBc3NldExvYWRlcihnYW1lLCBhc3NldHMpXG4gIGdhbWUuX3NvY2tldCA9IHNvY2tldFxuICBnYW1lLnN0YXRlLmFkZCgnZ2FtZScsIFJvdW5kKVxuICBnYW1lLnN0YXRlLnN0YXJ0KCdnYW1lJylcbiAgZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMXG4gIGdhbWUuc2NhbGUuc2V0U2NyZWVuU2l6ZSgpXG4gIGdhbWUuc2NhbGUucmVmcmVzaCgpXG4gIGdhbWUuc3RhZ2UuZGlzYWJsZVZpc2liaWxpdHlDaGFuZ2UgPSB0cnVlXG59KTtcbiIsInZhciBQbGF5ZXIgPSByZXF1aXJlKFwiLi4vZW50aXRpZXMvUGxheWVyXCIpXG52YXIgSGFkb3VrZW4gPSByZXF1aXJlKFwiLi4vZW50aXRpZXMvSGFkb3VrZW5cIilcbnZhciB7Z2V0UmFuZG9tLCBub29wLCBpc1R5cGVDb21ib30gPSByZXF1aXJlKFwiLi4vdXRpbHNcIilcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSb3VuZCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG5cbiAgYWRkUGxheWVyKGlkKSB7XG4gICAgdmFyIHNwYXduID0gZ2V0UmFuZG9tKHRoaXMucGxheWVyU3Bhd25zKVxuICAgIHZhciBwbGF5ZXIgPSB0aGlzLnBsYXllcnMuZ2V0Rmlyc3RFeGlzdHMoZmFsc2UpXG5cbiAgICBwbGF5ZXIucmVzZXQoc3Bhd24ueCwgc3Bhd24ueSlcbiAgICB0aGlzLnNvY2tldFBsYXllck1hcFtpZF0gPSBwbGF5ZXJcbiAgICBjb25zb2xlLmxvZyhcImFkZFwiLCBpZCkgXG4gIH1cblxuICByZW1vdmVQbGF5ZXIoaWQpIHtcbiAgICB2YXIgcGxheWVyID0gdGhpcy5zb2NrZXRQbGF5ZXJNYXBbaWRdXG5cbiAgICBpZiAoIXBsYXllcikgcmV0dXJuIGZhbHNlXG4gICAgcGxheWVyLmtpbGwoKVxuICAgIGRlbGV0ZSB0aGlzLnNvY2tldFBsYXllck1hcFtpZF1cbiAgICBjb25zb2xlLmxvZyhcInJlbW92ZVwiLCBpZCkgIFxuICB9XG5cbiAgdXBkYXRlUGxheWVyKHtpZCwga2V5c30pIHtcbiAgICB2YXIgcGxheWVyID0gdGhpcy5zb2NrZXRQbGF5ZXJNYXBbaWRdXG5cbiAgICBpZiAoIXBsYXllcikgcmV0dXJuIGZhbHNlXG4gICAgcGxheWVyLm5hbWUgPSBrZXlzLm5hbWVcbiAgICBwbGF5ZXIudXAgPSBrZXlzLnVwXG4gICAgcGxheWVyLnJpZ2h0ID0ga2V5cy5yaWdodFxuICAgIHBsYXllci5kb3duID0ga2V5cy5kb3duXG4gICAgcGxheWVyLmxlZnQgPSBrZXlzLmxlZnRcbiAgICBpZiAoa2V5cy5qdW1wKSBwbGF5ZXIuanVtcCgpXG4gICAgaWYgKGtleXMuZmlyZSkgcGxheWVyLmZpcmUodGhpcy5oYWRvdWtlbnMpXG4gIH1cblxuICByZWdpc3RlclBsYXllcihwbGF5ZXIpIHtcbiAgICBwbGF5ZXIuYm9keS5jb2xsaWRlcyh0aGlzLndhbGxzQ2cpXG4gICAgcGxheWVyLmJvZHkuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy5wbGF5ZXJzQ2cpXG4gIH1cblxuICByZWdpc3RlcldhbGwod2FsbCkge1xuICAgIHRoaXMud2FsbHMucHVzaCh3YWxsKVxuICAgIHdhbGwuY29sbGlkZXModGhpcy5wbGF5ZXJzQ2cpXG4gICAgd2FsbC5jb2xsaWRlcyh0aGlzLmhhZG91a2Vuc0NnKVxuICAgIHdhbGwuc2V0Q29sbGlzaW9uR3JvdXAodGhpcy53YWxsc0NnKVxuICB9XG5cbiAgcmVnaXN0ZXJIYWRvdWtlbihoYWQpIHtcbiAgICBoYWQuYm9keS5jb2xsaWRlcyh0aGlzLndhbGxzQ2csIHRoaXMuaGFkb3VrZW5IaXRzV2FsbCwgdGhpcylcbiAgICBoYWQuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmhhZG91a2Vuc0NnKSBcbiAgfVxuXG4gIGhhZG91a2VuSGl0c1BsYXllcihoYWQsIHBsYXllcikge1xuICAgIGlmIChoYWQuc3ByaXRlLm93bmVyID09PSBwbGF5ZXIuc3ByaXRlKSB7XG4gICAgICByZXR1cm4gXG4gICAgfSBlbHNlIGlmIChwbGF5ZXIuc3ByaXRlLmp1bXBpbmcpIHtcbiAgICAgIGdldFJhbmRvbSh0aGlzLmRvZGdlU291bmRzKS5wbGF5KClcbiAgICAgIHJldHVyblxuICAgIH0gZWxzZSB7XG4gICAgICBnZXRSYW5kb20odGhpcy5raWxsU291bmRzKS5wbGF5KClcbiAgICAgIGhhZC5zcHJpdGUua2lsbCgpXG4gICAgICBwbGF5ZXIuc3ByaXRlLmtpbGwoKVxuICAgIH1cbiAgfVxuXG4gIGhhZG91a2VuSGl0c1dhbGwoaGFkLCB3YWxsKSB7XG4gICAgZ2V0UmFuZG9tKHRoaXMuZXhwbG9zaW9uU291bmRzKS5wbGF5KCkgXG4gICAgaGFkLnNwcml0ZS5raWxsKClcbiAgfVxuXG4gIGNoZWNrT3ZlcmxhcChib2R5MSwgYm9keTIpIHtcbiAgICB2YXIgaGFkb3VrZW5cbiAgICAgICwgcGxheWVyXG4gICAgICAsIHNob3VsZENvbGxpZGUgPSB0cnVlXG5cbiAgICBpZiAoaXNUeXBlQ29tYm8oYm9keTEuX3R5cGUsIGJvZHkyLl90eXBlLCBcInBsYXllclwiLCBcImhhZG91a2VuXCIpKSB7XG4gICAgICBzaG91bGRDb2xsaWRlID0gZmFsc2VcbiAgICAgIHBsYXllciA9IGJvZHkxLl90eXBlID09PSBcInBsYXllclwiID8gYm9keTEgOiBib2R5MlxuICAgICAgaGFkb3VrZW4gPSBib2R5Mi5fdHlwZSA9PT0gXCJoYWRvdWtlblwiID8gYm9keTIgOiBib2R5MVxuICAgICAgdGhpcy5oYWRvdWtlbkhpdHNQbGF5ZXIoaGFkb3VrZW4sIHBsYXllcilcbiAgICB9IGVsc2Uge1xuICAgICAgc2hvdWxkQ29sbGlkZSA9IHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHNob3VsZENvbGxpZGVcbiAgfVxuXG4gIHByZWxvYWQoKSB7XG4gICAgdGhpcy5nYW1lLl9hc3NldExvYWRlci5sb2FkRm9yKFwiUm91bmRcIilcbiAgICB0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuUDJKUylcbiAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi5zZXRJbXBhY3RFdmVudHModHJ1ZSlcbiAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi5zZXRCb3VuZHNUb1dvcmxkKHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUpXG4gICAgdGhpcy5nYW1lLnBoeXNpY3MucDIudXBkYXRlQm91bmRzQ29sbGlzaW9uR3JvdXAoKVxuICB9XG5cbiAgY3JlYXRlKCkge1xuICAgIHRoaXMucGxheWVyU3Bhd25zID0gW1xuICAgICAgbmV3IFBoYXNlci5Qb2ludCgyMDAsIDIwMCksXG4gICAgICBuZXcgUGhhc2VyLlBvaW50KDYwMCwgMjAwKSxcbiAgICAgIG5ldyBQaGFzZXIuUG9pbnQoMTMwMCwgMjAwKSxcbiAgICAgIG5ldyBQaGFzZXIuUG9pbnQoOTAwLCA0NTApLFxuICAgICAgbmV3IFBoYXNlci5Qb2ludCg3MDAsIDY1MCksXG4gICAgICBuZXcgUGhhc2VyLlBvaW50KDEyMDAsIDY1MClcbiAgICBdXG5cbiAgICB0aGlzLnNvY2tldFBsYXllck1hcCA9IHt9XG5cbiAgICB0aGlzLmdhbWUuX3NvY2tldFxuICAgICAgLm9uKFwiam9pblwiLCB0aGlzLmFkZFBsYXllci5iaW5kKHRoaXMpKVxuICAgICAgLm9uKFwibGVhdmVcIiwgdGhpcy5yZW1vdmVQbGF5ZXIuYmluZCh0aGlzKSlcbiAgICAgIC5vbihcInRpY2tcIiwgdGhpcy51cGRhdGVQbGF5ZXIuYmluZCh0aGlzKSlcblxuICAgIHRoaXMua2lsbFNvdW5kcyA9IFtcbiAgICAgIHRoaXMuZ2FtZS5hZGQuYXVkaW8oXCJ0b2FzdHlcIiksIFxuICAgICAgdGhpcy5nYW1lLmFkZC5hdWRpbyhcInRvYXN0eTNcIilcbiAgICBdXG5cbiAgICB0aGlzLmV4cGxvc2lvblNvdW5kcyA9IFtcbiAgICAgIHRoaXMuZ2FtZS5hZGQuYXVkaW8oXCJleHBsb3Npb25cIiksXG4gICAgICB0aGlzLmdhbWUuYWRkLmF1ZGlvKFwiZXhwbG9zaW9uNVwiKVxuICAgIF1cblxuICAgIHRoaXMuZG9kZ2VTb3VuZHMgPSBbXG4gICAgICB0aGlzLmdhbWUuYWRkLmF1ZGlvKFwiZG9kZ2VcIiksXG4gICAgICB0aGlzLmdhbWUuYWRkLmF1ZGlvKFwiZG9kZ2UyXCIpLFxuICAgIF1cblxuICAgIHRoaXMubWFwID0gdGhpcy5nYW1lLmFkZC50aWxlbWFwKFwibWFwXCIpXG4gICAgdGhpcy5tYXAuYWRkVGlsZXNldEltYWdlKFwiRGVzZXJ0XCIsIFwiRGVzZXJ0XCIpXG4gICAgdGhpcy5ncm91bmQgPSB0aGlzLm1hcC5jcmVhdGVMYXllcihcIkdyb3VuZFwiKVxuXG4gICAgdGhpcy5wbGF5ZXJzID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpXG4gICAgdGhpcy5wbGF5ZXJzLmNsYXNzVHlwZSA9IFBsYXllclxuICAgIHRoaXMucGxheWVycy5lbmFibGVCb2R5ID0gdHJ1ZVxuICAgIHRoaXMucGxheWVycy5waHlzaWNzQm9keVR5cGUgPSBQaGFzZXIuUGh5c2ljcy5QMlxuICAgIHRoaXMucGxheWVycy5jcmVhdGVNdWx0aXBsZSgyMCwgXCJwbGF5ZXJcIilcblxuICAgIHRoaXMuaGFkb3VrZW5zID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpXG4gICAgdGhpcy5oYWRvdWtlbnMuY2xhc3NUeXBlID0gSGFkb3VrZW5cbiAgICB0aGlzLmhhZG91a2Vucy5lbmFibGVCb2R5ID0gdHJ1ZVxuICAgIHRoaXMuaGFkb3VrZW5zLnBoeXNpY3NCb2R5VHlwZSA9IFBoYXNlci5QaHlzaWNzLlAyXG4gICAgdGhpcy5oYWRvdWtlbnMuY3JlYXRlTXVsdGlwbGUoMTAwMCwgXCJoYWRvdWtlblwiKVxuXG4gICAgdGhpcy53YWxscyA9IFtdXG5cbiAgICB0aGlzLnBsYXllcnNDZyA9IHRoaXMuZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKClcbiAgICB0aGlzLndhbGxzQ2cgPSB0aGlzLmdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpXG4gICAgdGhpcy5oYWRvdWtlbnNDZyA9IHRoaXMuZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKClcblxuICAgIHZhciB3YWxscyA9IHRoaXMuZ2FtZS5waHlzaWNzLnAyLmNvbnZlcnRDb2xsaXNpb25PYmplY3RzKFxuICAgICAgdGhpcy5tYXAsXG4gICAgICBcIkNvbGxpc2lvbnNcIixcbiAgICAgIHRydWVcbiAgICApXG5cbiAgICB0aGlzLnBsYXllcnMuZm9yRWFjaCh0aGlzLnJlZ2lzdGVyUGxheWVyLCB0aGlzKVxuICAgIHRoaXMuaGFkb3VrZW5zLmZvckVhY2godGhpcy5yZWdpc3RlckhhZG91a2VuLCB0aGlzKVxuICAgIHdhbGxzLmZvckVhY2godGhpcy5yZWdpc3RlcldhbGwsIHRoaXMpXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdmFyIGxpdmluZyA9IHRoaXMucGxheWVycy5jb3VudExpdmluZygpXG4gICAgdmFyIHBsYXllckNvdW50ID0gT2JqZWN0LmtleXModGhpcy5zb2NrZXRQbGF5ZXJNYXApLmxlbmd0aFxuXG4gICAgaWYgKGxpdmluZyA+IDEpIHtcbiAgICAgIHRoaXMuZ2FtZS5waHlzaWNzLnAyLnNldFBvc3RCcm9hZHBoYXNlQ2FsbGJhY2sodGhpcy5jaGVja092ZXJsYXAsIHRoaXMpIFxuICAgIH0gZWxzZSBpZiAobGl2aW5nID09PSAxKSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLnNvY2tldFBsYXllck1hcCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHRoaXMuc29ja2V0UGxheWVyTWFwW2tleV0ucmV2aXZlKCkgXG4gICAgICB9LCB0aGlzKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5nYW1lLnBoeXNpY3MucDIucG9zdEJyb2FkcGhhc2VDYWxsYmFjaykge1xuICAgICAgICB0aGlzLmdhbWUucGh5c2ljcy5wMi5zZXRQb3N0QnJvYWRwaGFzZUNhbGxiYWNrKG51bGwpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEFzc2V0TG9hZGVyIHtcbiAgY29uc3RydWN0b3IoZ2FtZSwgYXNzZXRzKSB7XG4gICAgaWYgKCFnYW1lIHx8ICFhc3NldHMpIHRocm93IG5ldyBFcnJvcihcIlByb3ZpZGUgZ2FtZSBhbmQgYXNzZXRzIHRvIGNvbnN0cnVjdG9yXCIpXG4gICAgdGhpcy5nYW1lID0gZ2FtZVxuICAgIHRoaXMuYXNzZXRzID0gYXNzZXRzIFxuICB9XG4gIGxvYWRGb3Ioc3RhdGUpIHtcbiAgICB2YXIgZm9yU3RhdGUgPSB0aGlzLmFzc2V0c1tzdGF0ZV0gXG4gICAgdmFyIGdhbWUgPSB0aGlzLmdhbWVcblxuICAgIGlmICghZm9yU3RhdGUpIHJldHVyblxuXG4gICAgdmFyIHRpbGVtYXBzID0gZm9yU3RhdGUudGlsZW1hcHMgfHwgW11cbiAgICB2YXIgaW1hZ2VzID0gZm9yU3RhdGUuaW1hZ2VzIHx8IFtdXG4gICAgdmFyIGF1ZGlvcyA9IGZvclN0YXRlLmF1ZGlvcyB8fCBbXVxuICAgIHZhciBzcHJpdGVzaGVldHMgPSBmb3JTdGF0ZS5zcHJpdGVzaGVldHMgfHwgW11cblxuICAgIGltYWdlcy5mb3JFYWNoKGltZyA9PiBnYW1lLmxvYWQuaW1hZ2UoaW1nLm5hbWUsIGltZy5wYXRoKSlcbiAgICBhdWRpb3MuZm9yRWFjaChhdWRpbyA9PiBnYW1lLmxvYWQuYXVkaW8oYXVkaW8ubmFtZSwgYXVkaW8ucGF0aCkpXG4gICAgc3ByaXRlc2hlZXRzLmZvckVhY2goKHNoZWV0KSA9PiB7XG4gICAgICBnYW1lLmxvYWQuc3ByaXRlc2hlZXQoXG4gICAgICAgIHNoZWV0Lm5hbWUsXG4gICAgICAgIHNoZWV0LnBhdGgsXG4gICAgICAgIHNoZWV0LndpZHRoLFxuICAgICAgICBzaGVldC5oZWlnaHQsXG4gICAgICAgIHNoZWV0Lmxlbmd0aFxuICAgICAgKVxuICAgIH0pXG4gICAgdGlsZW1hcHMuZm9yRWFjaCgodGlsZW1hcCkgPT4ge1xuICAgICAgZ2FtZS5sb2FkLnRpbGVtYXAoXG4gICAgICAgIHRpbGVtYXAubmFtZSxcbiAgICAgICAgdGlsZW1hcC5wYXRoLFxuICAgICAgICBudWxsLFxuICAgICAgICBQaGFzZXIuVGlsZW1hcC5USUxFRF9KU09OXG4gICAgICApXG4gICAgfSlcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMuZ2V0UmFuZG9tID0gKGxpc3QpID0+IHtcbiAgcmV0dXJuIGxpc3RbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbGlzdC5sZW5ndGgpXVxufVxuXG5tb2R1bGUuZXhwb3J0cy5ub29wID0gKCkgPT4ge31cblxubW9kdWxlLmV4cG9ydHMuaXNUeXBlQ29tYm8gPSAoZmlyc3QsIHNlY29uZCwgcHJvcDEsIHByb3AyKSA9PiB7XG4gIGlmICghZmlyc3QgfHwgIXNlY29uZCB8fCAhcHJvcDEgfHwgIXByb3AyKSByZXR1cm4gZmFsc2VcblxuICB2YXIgY2FzZTEgPSAoZmlyc3QgPT09IHByb3AxICYmIHNlY29uZCA9PT0gcHJvcDIpXG4gIHZhciBjYXNlMiA9IChmaXJzdCA9PT0gcHJvcDIgJiYgc2Vjb25kID09PSBwcm9wMSlcblxuICByZXR1cm4gY2FzZTEgfHwgY2FzZTJcbn1cbiJdfQ==
