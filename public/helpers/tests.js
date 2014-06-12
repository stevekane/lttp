var test = require("tape")
  , ah = require("./array")
  , fh = require("./functions")
  , demethodize = fh.demethodize
  , demethodizeMultiple = fh.demothodizeMultiple
  , slice = fh.slice
  , concat = fh.concat
  , curry = fh.curry
  , autoCurry = fh.autoCurry
  , flip = fh.flip
  , compose = fh.compose 
  , reduce = ah.reduce;

test("slice", function (t) {
  var ar = [1,2,3,4,5,6] 
    , lastThree = slice(3, ar);

  t.plan(1);
  t.same([4,5,6], lastThree, "returns last 3 elements");
});

test("flip", function (t) {
  var makeName = function (first, last) {
    return first + last; 
  };
  var makeNameFlipped = flip(makeName);
  var original = makeName("steve", "kane");
  var flipped = makeNameFlipped("kane", "steve");

  t.plan(1);
  t.same(original, flipped, "flipped correctly flips arguments");
});

test("reduce", function (t) {
  var grades = ["A", "B", "A", "C", "D"];
  var count = function (accum, grade) {
    if (!accum[grade]) accum[grade] = 1;
    else accum[grade] = accum[grade] + 1;
    return accum;
  };
  var gradeCount = reduce({}, count, grades);

  t.plan(4);
  t.same(gradeCount["A"], 2, "two As were found");
  t.same(gradeCount["B"], 1, "one B was found");
  t.same(gradeCount["C"], 1, "one A was found");
  t.same(gradeCount["D"], 1, "one D was found");
});

test("reduce to value", function (t) {
  var nums = [1,2,3,4,5,6];
  var tally = function (accum, grade) {
    return accum + grade;
  };
  var total = reduce(0, tally, nums);

  t.plan(1);
  t.equal(total, 21, "correctly sums numbers");
});

test("curry", function (t) {
  var fn = function (a, b, c, d) {
    return a + b + c + d;
  };
  var curried = curry(fn, 1, 2);
  var result = curried(3, 4);

  t.plan(1);
  t.same(10, result, "curry correctly returns 10");
});

test("autoCurry", function (t) {
  var fn = function (a, b, c, d) {
    return a + b + c + d;
  };
  var curried = autoCurry(fn);
  var halfway = curried(1, 2);
  var firstResult = halfway(3, 4);
  var phase1 = curried(1);
  var phase2 = phase1(2);
  var phase3 = phase2(3);
  var secondResult = phase3(4);

  t.plan(2);
  t.same(10, firstResult, "curry correctly returns 10");
  t.same(10, secondResult, "curry correctly returns 10");
});
