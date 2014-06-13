var fh = require("./functions")
  , reduce = fh.reduce
  , demethodize = fh.demethodize
  , map = fh.map
  , partial = fh.partial
  , autoCurry = fh.autoCurry;

var keys = Object.keys;

var values = function (obj) {
  return map(function (key) {
    return obj[key];
  }, keys(obj))
};

var transformMany = function (names, transFn, obj) {
  var doTrans = function (accum, name) {
    accum[name] = transFn(name);
    return accum;
  };

  return reduce({}, doTrans, names);
};

var transformAll = function (transFn, obj) {
  return transformMany(keys(obj), transFn, obj);
};

var demethodizeMany = function (methodNames, obj) {
  return transformMany(methodNames, partial(demethodize, obj), obj);
};

var demethodizeAll = function (obj) {
  return demethodizeMany(keys(obj), obj);
};

var autoCurryMany = function (methodNames, obj) {
  var curryMethod = function (name) {
    return autoCurry(obj[name]);
  };
  return transformMany(methodNames, curryMethod, obj); 
};

var autoCurryAll = function (obj) {
  return autoCurryMany(keys(obj), obj); 
};

exports.demethodizeMany = demethodizeMany;
exports.demethodizeAll = demethodizeAll;
exports.autoCurryMany = autoCurryMany;
exports.autoCurryAll = autoCurryAll;
exports.keys = keys;
exports.values = values;
