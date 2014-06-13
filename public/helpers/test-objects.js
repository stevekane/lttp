var test = require("tape")
  , oh = require("./objects")
  , values = oh.values
  , demethodizeMany = oh.demethodizeMany
  , autoCurryMany = oh.autoCurryMany
  , autoCurryAll = oh.autoCurryAll;

test("demethodizeMany", function (t) {
  var funky = demethodizeMany(["toUpperCase", "toLowerCase"], String.prototype);
  var name = "Billy-Bob Thorton";
  var upper = funky.toUpperCase(name);
  var lower = funky.toLowerCase(name);

  t.plan(2);
  t.same("billy-bob thorton", lower, "String was lower-cased");
  t.same("BILLY-BOB THORTON", upper, "String was upper-cased");
});

test("autoCurryMany", function (t) {
  var obj = {
    addFirstName: function (first, last) { return first + " " + last },
    addTitle: function (title, name) { return title + " " + name }
  };

  var curried = autoCurryMany(["addFirstName", "addTitle"], obj);
  var addSteven = curried.addFirstName("Steven");
  var addMr = curried.addTitle("Mr.");
  var fullName = addMr(addSteven("Smith"));

  t.plan(1);
  t.same("Mr. Steven Smith", fullName, "autoCurryMany works properly");
});

test("autoCurryAll", function (t) {
  var obj = {
    addFirstName: function (first, last) { return first + " " + last },
    addTitle: function (title, name) { return title + " " + name }
  };

  var curried = autoCurryAll(obj);
  var addSteven = curried.addFirstName("Steven");
  var addMr = curried.addTitle("Mr.");
  var fullName = addMr(addSteven("Smith"));

  t.plan(1);
  t.same("Mr. Steven Smith", fullName, "autoCurryMany works properly");
});

test("values", function (t) {
  var obj = {
    first: "Ted",
    last: "Williams" 
  };
  var vals = values(obj);
  var firstNameFound = vals.some(function (val) {
    return val === "Ted"; 
  }, undefined);
  var lastNameFound = vals.some(function (val) {
    return val === "Williams"; 
  });

  t.plan(2);
  t.true(firstNameFound, "values returned Ted");
  t.true(lastNameFound, "values returned Williams");
});
