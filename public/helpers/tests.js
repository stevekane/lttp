var test = require("tape")
  , ah = require("./array")
  , slice = ah.slice
  , curry = ah.curry
  , reduce = ah.reduce
  , flip = ah.flip;

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
