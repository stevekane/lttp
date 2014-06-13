var test = require("tape")
  , fh = require("./functions")
  , demethodize = fh.demethodize
  , slice = fh.slice
  , concat = fh.concat
  , partial = fh.partial
  , curry = fh.curry
  , autoCurry = fh.autoCurry
  , reverse = fh.reverse
  , flip = fh.flip
  , dot = fh.dot
  , compose = fh.compose 
  , sequence = fh.sequence
  , reduce = fh.reduce
  , map = fh.map
  , unary = fh.unary
  , binary = fh.binary
  , ternary = fh.ternary;

test("demethodize", function (t) {
  var name = "Steve Ballmer";
  var yell = demethodize(String.prototype, "toUpperCase");

  t.plan(1);
  t.same(yell(name), name.toUpperCase(), "demethodization works");
});

test("slice", function (t) {
  var ar = [1,2,3,4,5,6];
  var lastThree = slice(3, ar);

  t.plan(1);
  t.same([4,5,6], lastThree, "returns last 3 elements");
});

test("concat", function (t) {
  var ar1 = [1,2];
  var ar2 = [3,4];
  var ar3 = [5,6];
  var result = concat(ar1, ar2);
  var triple = concat(ar1, ar2, ar3);

  t.plan(2);
  t.same([1,2,3,4], result, "concat returns concatenated result");
  t.same([1,2,3,4,5,6], triple, "concat returns concat of >2 arrays");
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

test("dot", function (t) {
  var customer = {
    name: "Ted Danson",
    title: "Overlord" 
  };
  var name = dot("name", customer);
  var title = dot("title", customer);
  
  t.plan(2);
  t.same("Ted Danson", name, "dot returns a named property name");
  t.same("Overlord", title, "dot returns a named property title");
});

test("compose", function (t) {
  var addSmith = function (name) { return name + " Smith" };
  var addTitle = function (fullName) { return "Mr. " + fullName };
  var makeMrSmith = compose(addTitle, addSmith);
  var capitalize = demethodize(String.prototype, "toUpperCase");
  var name = makeMrSmith("Steve");
  var yellMrSmith = compose(capitalize, makeMrSmith);
  var bigName = yellMrSmith("Steve");

  t.plan(2);
  t.same("Mr. Steve Smith", name, "compose concats functions");
  t.same("MR. STEVE SMITH", bigName, "compose concats composed function");
});

test("sequence", function (t) {
  var addSmith = function (name) { return name + " Smith" };
  var addTitle = function (fullName) { return "Mr. " + fullName };
  var makeMrSmith = sequence(addSmith, addTitle);
  var capitalize = demethodize(String.prototype, "toUpperCase");
  var name = makeMrSmith("Steve");
  var yellMrSmith = sequence(makeMrSmith, capitalize);
  var bigName = yellMrSmith("Steve");

  t.plan(2);
  t.same("Mr. Steve Smith", name, "sequence concats functions");
  t.same("MR. STEVE SMITH", bigName, "sequence concats sequenced function");
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

test("map", function (t) {
  var grades = ["A", "B", "A"];
  var makePlus = function (grade) { return grade + "+" };
  var betterGrades = map(makePlus, grades);

  t.plan(1);
  t.same(["A+", "B+", "A+"], betterGrades);
});

var sumFour = function (a, b, c, d) { return a + b + c + d };

test("partial", function (t) {
  var partialFn = partial(sumFour, 1, 2);
  var result = partialFn(3, 4);
  
  t.plan(1);
  t.same(10, result, "partial application works");
});

test("curry", function (t) {
  var curried = curry(sumFour, 1, 2);
  var result = curried(3, 4);

  t.plan(1);
  t.same(10, result, "curry correctly returns 10");
});

test("autoCurry", function (t) {
  var curried = autoCurry(sumFour);
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

var getLen = function () { 
  return arguments.length; 
};

test("unary", function (t) {
  var onlyOne = unary(getLen);
  var len = onlyOne(1,2,3,4,5);

  t.plan(1);
  t.same(1, len);
});

test("binary", function (t) {
  var onlyTwo = binary(getLen);
  var len = onlyTwo(1,2,3,4,5);

  t.plan(1);
  t.same(2, len);
});

test("ternary", function (t) {
  var onlyThree = ternary(getLen);
  var len = onlyThree(1,2,3,4,5);

  t.plan(1);
  t.same(3, len);
});
