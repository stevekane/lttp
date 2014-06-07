(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var io = require("socket.io-client")
  , serverUrl = window.location.href
  , socket = io.connect(serverUrl)
  , nameInput = document.getElementById("name")

var Input = function (game, key, prop) {
  return {
    key: game.input.keyboard.addKey(key),
    prop: prop
  };
};

var states = {
  updateName: function (e) {
    console.log(e.target.value) 
  },
  create: function () {
    nameInput.addEventListener("input", this.updateName.bind(this));
    this.up = false;
    this.right = false;
    this.down = false;
    this.left = false;
    this.jump = false;
    this.fire = false;
    this.name = "";

    this.inputs = [
      Input(this, Phaser.Keyboard.UP, "up"),
      Input(this, Phaser.Keyboard.RIGHT, "right"),
      Input(this, Phaser.Keyboard.DOWN, "down"),
      Input(this, Phaser.Keyboard.LEFT, "left"),
      Input(this, Phaser.Keyboard.SPACEBAR, "jump"),
      Input(this, Phaser.Keyboard.F, "fire"),
    ];
  },
  update: function () {
    processInputs(this);
    broadcast(this);
  }
};

var processInputs = function (controller) {
  controller.inputs.forEach(function (input) {
    controller[input.prop] = input.key.isDown;
  });
};

var broadcast = function (controller) {
  socket.emit("tick", {
    name: controller.name,
    up: controller.up,
    right: controller.right,
    down: controller.down,
    left: controller.left,
    jump: controller.jump,
    fire: controller.fire    
  });
};

var controller = new Phaser.Game(320, 240, Phaser.CANVAS, "controller", states);

var handleConnect = function () {
  console.log("connected");
};

var handleDisconnect = function () {
  console.log("disconnected");
};

socket
  .on("connect", handleConnect)
  .on("disconnect", handleDisconnect)

},{"socket.io-client":"k52UWs"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9jb250cm9sbGVycy9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBpbyA9IHJlcXVpcmUoXCJzb2NrZXQuaW8tY2xpZW50XCIpXG4gICwgc2VydmVyVXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgLCBzb2NrZXQgPSBpby5jb25uZWN0KHNlcnZlclVybClcbiAgLCBuYW1lSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVcIilcblxudmFyIElucHV0ID0gZnVuY3Rpb24gKGdhbWUsIGtleSwgcHJvcCkge1xuICByZXR1cm4ge1xuICAgIGtleTogZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoa2V5KSxcbiAgICBwcm9wOiBwcm9wXG4gIH07XG59O1xuXG52YXIgc3RhdGVzID0ge1xuICB1cGRhdGVOYW1lOiBmdW5jdGlvbiAoZSkge1xuICAgIGNvbnNvbGUubG9nKGUudGFyZ2V0LnZhbHVlKSBcbiAgfSxcbiAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgbmFtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCB0aGlzLnVwZGF0ZU5hbWUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy51cCA9IGZhbHNlO1xuICAgIHRoaXMucmlnaHQgPSBmYWxzZTtcbiAgICB0aGlzLmRvd24gPSBmYWxzZTtcbiAgICB0aGlzLmxlZnQgPSBmYWxzZTtcbiAgICB0aGlzLmp1bXAgPSBmYWxzZTtcbiAgICB0aGlzLmZpcmUgPSBmYWxzZTtcbiAgICB0aGlzLm5hbWUgPSBcIlwiO1xuXG4gICAgdGhpcy5pbnB1dHMgPSBbXG4gICAgICBJbnB1dCh0aGlzLCBQaGFzZXIuS2V5Ym9hcmQuVVAsIFwidXBcIiksXG4gICAgICBJbnB1dCh0aGlzLCBQaGFzZXIuS2V5Ym9hcmQuUklHSFQsIFwicmlnaHRcIiksXG4gICAgICBJbnB1dCh0aGlzLCBQaGFzZXIuS2V5Ym9hcmQuRE9XTiwgXCJkb3duXCIpLFxuICAgICAgSW5wdXQodGhpcywgUGhhc2VyLktleWJvYXJkLkxFRlQsIFwibGVmdFwiKSxcbiAgICAgIElucHV0KHRoaXMsIFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUiwgXCJqdW1wXCIpLFxuICAgICAgSW5wdXQodGhpcywgUGhhc2VyLktleWJvYXJkLkYsIFwiZmlyZVwiKSxcbiAgICBdO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBwcm9jZXNzSW5wdXRzKHRoaXMpO1xuICAgIGJyb2FkY2FzdCh0aGlzKTtcbiAgfVxufTtcblxudmFyIHByb2Nlc3NJbnB1dHMgPSBmdW5jdGlvbiAoY29udHJvbGxlcikge1xuICBjb250cm9sbGVyLmlucHV0cy5mb3JFYWNoKGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGNvbnRyb2xsZXJbaW5wdXQucHJvcF0gPSBpbnB1dC5rZXkuaXNEb3duO1xuICB9KTtcbn07XG5cbnZhciBicm9hZGNhc3QgPSBmdW5jdGlvbiAoY29udHJvbGxlcikge1xuICBzb2NrZXQuZW1pdChcInRpY2tcIiwge1xuICAgIG5hbWU6IGNvbnRyb2xsZXIubmFtZSxcbiAgICB1cDogY29udHJvbGxlci51cCxcbiAgICByaWdodDogY29udHJvbGxlci5yaWdodCxcbiAgICBkb3duOiBjb250cm9sbGVyLmRvd24sXG4gICAgbGVmdDogY29udHJvbGxlci5sZWZ0LFxuICAgIGp1bXA6IGNvbnRyb2xsZXIuanVtcCxcbiAgICBmaXJlOiBjb250cm9sbGVyLmZpcmUgICAgXG4gIH0pO1xufTtcblxudmFyIGNvbnRyb2xsZXIgPSBuZXcgUGhhc2VyLkdhbWUoMzIwLCAyNDAsIFBoYXNlci5DQU5WQVMsIFwiY29udHJvbGxlclwiLCBzdGF0ZXMpO1xuXG52YXIgaGFuZGxlQ29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc29sZS5sb2coXCJjb25uZWN0ZWRcIik7XG59O1xuXG52YXIgaGFuZGxlRGlzY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc29sZS5sb2coXCJkaXNjb25uZWN0ZWRcIik7XG59O1xuXG5zb2NrZXRcbiAgLm9uKFwiY29ubmVjdFwiLCBoYW5kbGVDb25uZWN0KVxuICAub24oXCJkaXNjb25uZWN0XCIsIGhhbmRsZURpc2Nvbm5lY3QpXG4iXX0=
