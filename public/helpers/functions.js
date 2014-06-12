var isArray = function (obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};

var flip = function (fn) {
  return function (b, a) {
    return fn(a, b); 
  };
};

var demethodize = function (obj, fnName) {
  return Function.prototype.call.bind(obj[fnName]); 
};

var demethodizeMultiple = function (obj, fnNames) {
  var results = {};

  for (var name in fnNames) {
    results[fnNames[name]] = demethodize(obj, fnNames[name]);
  }

  return results;
};

var slice = flip(demethodize(Array.prototype, "slice"));

var concat = demethodize(Array.prototype, "concat");

var compose = function (fns) {
  var fns = isArray(fns) ? fns : slice(0, arguments);
  var count = fns.length;

  return function composed () {
    var prev = slice(0, arguments);
    var result;

    for (var fn in fns) {
      prev = isArray(prev) ? fns[fn].apply(this, prev) : fns[fn].call(this, prev);
    }

    return result;
  };
};

var curry = function (fn) {
  var args = slice(1, arguments);

  return function () {
    var innerArgs = slice(0, arguments);

    return fn.apply(this, concat(args, innerArgs));
  };
};

var autoCurry = function autoCurry (fn, argsCount) {
  var fnArity = argsCount || fn.length;

  return function curried () {
    var notEnoughArgs = arguments.length < fnArity;
    var missingArgsCount = fnArity - arguments.length;
    var stillMissingArgs = missingArgsCount > 0;
    var args = concat([fn], slice(0, arguments));
    var result;

    if (notEnoughArgs && stillMissingArgs) {
      result = autoCurry(curry.apply(this, args), missingArgsCount);
    } else if (notEnoughArgs) {
      result = curry.apply(this, args);
    } else {
      result = fn.apply(this, arguments); 
    }

    return result;
  };
};


exports.demethodize = demethodize;
exports.demethodizeMultiple = demethodizeMultiple;
exports.slice = slice;
exports.concat = concat;
exports.flip = flip;
exports.compose = compose;
exports.curry = curry;
exports.autoCurry = autoCurry;
