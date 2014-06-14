var demethodize = function (obj, fnName) {
  return Function.prototype.call.bind(obj[fnName]); 
};

var isArray = function (obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};

var reduce = function (accum, redFn, list) {
  for (var item in list) {
    accum = redFn(accum, list[item], item);
  };

  return accum;
};

var map = function (mapFn, list) {
  var result = [];

  for (var item in list) {
    result.push(mapFn(list[item], item, list));
  }

  return result;
};

var filter = function (filterFn, list) {
  var results = [];

  for (var item in list) {
    if (filterFn(list[item], item, list)) {
      results.push(list[item]); 
    }
  }

  return results;
};

var find = function (findFn, list) {
  var result;  

  for (var item in list) {
    if (findFn(list[item], item, list)) {
      result = list[item];
      break;  
    }
  }
  
  return result;
};

var reverse = function (list) {
  var backwards = [];

  for (var item in list) {
    backwards.unshift(list[item]); 
  }

  return backwards;
};

//don't export?  just used in definitions
var badSlice = demethodize(Array.prototype, "slice");
var toArray = function (args) { return badSlice(args, 0) };
var allButFirst = function (args) { return badSlice(args, 1) };

var concat = demethodize(Array.prototype, "concat");
var dot = function (prop, obj) { return obj[prop] };

//TODO: add tests
var apply = function (fn, argsList) { return fn.apply(this, argsList) };
var call = function (fn) { return fn.call(this, allButFirst(arguments)) };
var bind = function (fn) { return fn.bind(this, allButFirst(arguments)) };

var compose = function (fns) {
  var fns = isArray(fns) ? fns : toArray(arguments);

  return function composed () {
    var prev = toArray(arguments);

    for (var i = 0, len = fns.length; i < len; i++) {
      prev = isArray(prev) 
        ? apply(fns[len-1-i], prev) 
        : call(fns[len-1-i], prev);
    }

    return prev;
  };
};

var flip = function (fn) {
  return function () {
    return apply(fn, reverse(badSlice(arguments)));
  }
};

var slice = flip(badSlice);

var sequence = function () { return compose(reverse(toArray(arguments))) };

var partial = function (fn) {
  var args = slice(1, arguments);

  return function partialed () {
    var innerArgs = toArray(arguments);
    var allArgs = concat(args, innerArgs);

    return apply(fn, allArgs);
  };
};


var curry = function (fn) {
  var args = allButFirst(arguments);

  return function () {
    var innerArgs = toArray(arguments);

    return apply(fn, concat(args, innerArgs));
  };
};

var autoCurry = function autoCurry (fn, argsCount) {
  var fnArity = argsCount || fn.length;

  return function curried () {
    var notEnoughArgs = arguments.length < fnArity;
    var missingArgsCount = fnArity - arguments.length;
    var stillMissingArgs = missingArgsCount > 0;
    var args = concat([fn], toArray(arguments));
    var result;

    if (notEnoughArgs && stillMissingArgs) {
      result = autoCurry(apply(curry, args), missingArgsCount);
    } else if (notEnoughArgs) {
      result = apply(curry, args);
    } else {
      result = apply(fn, slice(arguments)); 
    }

    return result;
  };
};

var withRange = function (start, stop) {
  return function (fn) { 
    return function () {
      return apply(fn, slice(stop, start, arguments));
    };
  };
};

var unary = withRange(0, 1);
var binary = withRange(0, 2);
var ternary = withRange(0, 3);

exports.reduce = reduce;
exports.map = map;
exports.filter = filter;
exports.find = find;
exports.demethodize = demethodize;
exports.reverse = reverse;
exports.slice = slice;
exports.concat = concat;
exports.flip = flip;
exports.dot = dot;
exports.compose = compose;
exports.sequence = sequence;
exports.partial = partial;
exports.curry = curry;
exports.autoCurry = autoCurry;
exports.unary = unary;
exports.binary = binary;
exports.ternary = ternary;
