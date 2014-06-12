var flip = function (fn) {
  return function (b, a) {
    return fn(a, b); 
  };
};

var slice = flip(Function.prototype.call.bind(Array.prototype.slice));

//TODO: implement
var curry = function (fn) {
  return fn; 
};

var reduce = function (accum, redFn, list) {
  for (var item in list) {
    accum = redFn(accum, list[item]);
  };

  return accum;
};

exports.flip = flip;
exports.slice = slice;
exports.curry = curry;
exports.reduce = reduce;
