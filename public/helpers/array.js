var fnHelpers = require("./functions")
  , demethodize = fnHelpers.demethodize;

var reduce = function (accum, redFn, list) {
  for (var item in list) {
    accum = redFn(accum, list[item]);
  };

  return accum;
};

exports.reduce = reduce;
