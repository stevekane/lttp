(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var io = require("socket.io-client")
  , serverUrl = window.location.href
  , socket = io.connect(serverUrl)

var Input = function (game, key, prop) {
  return {
    key: game.input.keyboard.addKey(key),
    prop: prop
  };
};

var states = {
  preload: function () {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.setScreenSize();
  },
  create: function () {
    this.up = false;
    this.right = false;
    this.down = false;
    this.left = false;
    this.jump = false;
    this.fire = false;

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
    up: controller.up,
    right: controller.right,
    down: controller.down,
    left: controller.left,
    jump: controller.jump,
    fire: controller.fire    
  });
};

var controller = new Phaser.Game(1920, 960, Phaser.CANVAS, "controller", states);

var handleConnect = function () {
  //controller.active = true;
  console.log("connected");
};

var handleDisconnect = function () {
  //controller.active = false;
  console.log("disconnected");
};

socket
  .on("connect", handleConnect)
  .on("disconnect", handleDisconnect)

},{"socket.io-client":"k52UWs"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9jb250cm9sbGVycy9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgaW8gPSByZXF1aXJlKFwic29ja2V0LmlvLWNsaWVudFwiKVxuICAsIHNlcnZlclVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICwgc29ja2V0ID0gaW8uY29ubmVjdChzZXJ2ZXJVcmwpXG5cbnZhciBJbnB1dCA9IGZ1bmN0aW9uIChnYW1lLCBrZXksIHByb3ApIHtcbiAgcmV0dXJuIHtcbiAgICBrZXk6IGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KGtleSksXG4gICAgcHJvcDogcHJvcFxuICB9O1xufTtcblxudmFyIHN0YXRlcyA9IHtcbiAgcHJlbG9hZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgIHRoaXMuZ2FtZS5zY2FsZS5zZXRTY3JlZW5TaXplKCk7XG4gIH0sXG4gIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMudXAgPSBmYWxzZTtcbiAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XG4gICAgdGhpcy5kb3duID0gZmFsc2U7XG4gICAgdGhpcy5sZWZ0ID0gZmFsc2U7XG4gICAgdGhpcy5qdW1wID0gZmFsc2U7XG4gICAgdGhpcy5maXJlID0gZmFsc2U7XG5cbiAgICB0aGlzLmlucHV0cyA9IFtcbiAgICAgIElucHV0KHRoaXMsIFBoYXNlci5LZXlib2FyZC5VUCwgXCJ1cFwiKSxcbiAgICAgIElucHV0KHRoaXMsIFBoYXNlci5LZXlib2FyZC5SSUdIVCwgXCJyaWdodFwiKSxcbiAgICAgIElucHV0KHRoaXMsIFBoYXNlci5LZXlib2FyZC5ET1dOLCBcImRvd25cIiksXG4gICAgICBJbnB1dCh0aGlzLCBQaGFzZXIuS2V5Ym9hcmQuTEVGVCwgXCJsZWZ0XCIpLFxuICAgICAgSW5wdXQodGhpcywgUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSLCBcImp1bXBcIiksXG4gICAgICBJbnB1dCh0aGlzLCBQaGFzZXIuS2V5Ym9hcmQuRiwgXCJmaXJlXCIpLFxuICAgIF07XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHByb2Nlc3NJbnB1dHModGhpcyk7XG4gICAgYnJvYWRjYXN0KHRoaXMpO1xuICB9XG59O1xuXG52YXIgcHJvY2Vzc0lucHV0cyA9IGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XG4gIGNvbnRyb2xsZXIuaW5wdXRzLmZvckVhY2goZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgY29udHJvbGxlcltpbnB1dC5wcm9wXSA9IGlucHV0LmtleS5pc0Rvd247XG4gIH0pO1xufTtcblxudmFyIGJyb2FkY2FzdCA9IGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XG4gIHNvY2tldC5lbWl0KFwidGlja1wiLCB7XG4gICAgdXA6IGNvbnRyb2xsZXIudXAsXG4gICAgcmlnaHQ6IGNvbnRyb2xsZXIucmlnaHQsXG4gICAgZG93bjogY29udHJvbGxlci5kb3duLFxuICAgIGxlZnQ6IGNvbnRyb2xsZXIubGVmdCxcbiAgICBqdW1wOiBjb250cm9sbGVyLmp1bXAsXG4gICAgZmlyZTogY29udHJvbGxlci5maXJlICAgIFxuICB9KTtcbn07XG5cbnZhciBjb250cm9sbGVyID0gbmV3IFBoYXNlci5HYW1lKDE5MjAsIDk2MCwgUGhhc2VyLkNBTlZBUywgXCJjb250cm9sbGVyXCIsIHN0YXRlcyk7XG5cbnZhciBoYW5kbGVDb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICAvL2NvbnRyb2xsZXIuYWN0aXZlID0gdHJ1ZTtcbiAgY29uc29sZS5sb2coXCJjb25uZWN0ZWRcIik7XG59O1xuXG52YXIgaGFuZGxlRGlzY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy9jb250cm9sbGVyLmFjdGl2ZSA9IGZhbHNlO1xuICBjb25zb2xlLmxvZyhcImRpc2Nvbm5lY3RlZFwiKTtcbn07XG5cbnNvY2tldFxuICAub24oXCJjb25uZWN0XCIsIGhhbmRsZUNvbm5lY3QpXG4gIC5vbihcImRpc2Nvbm5lY3RcIiwgaGFuZGxlRGlzY29ubmVjdClcbiJdfQ==
