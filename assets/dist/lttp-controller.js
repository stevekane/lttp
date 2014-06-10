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
    this.name = e.target.value;
  },
  create: function () {
    this.game.stage.disableVisibilityChange = true;
    nameInput.addEventListener("input", this.updateName.bind(this));
    this.up = false;
    this.right = false;
    this.down = false;
    this.left = false;
    this.jump = false;
    this.fire = false;
    this.name = "";

    this.broadcastInterval = 100
    this.lastBroadcast = Date.now()

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
    this.processInputs();
    this.broadcast();
  },

  processInputs: function () {
    this.inputs.forEach(function (input) {
      this[input.prop] = input.key.isDown; 
    }, this); 
  },

  broadcast: function () {
    var now = Date.now()
      , doBroadcast = now > this.lastBroadcast + this.broadcastInterval
      , payload;

    if (!doBroadcast) return false;

    payload = {
      name: this.name,
      up: this.up,
      right: this.right,
      down: this.down,
      left: this.left,
      jump: this.jump,
      fire: this.fire    
    };

    socket.emit("tick", payload);
    this.lastBroadcast = now;
  }
};
var controller = new Phaser.Game(320, 240, Phaser.CANVAS, "controller", states);

var handleConnect = function () {
  console.log("connected");
};

var handleDisconnect = function () {
  console.log("disconnected");
};

var gotoLobby = function (url) {
  window.location = url || "/lobby";
};

socket
  .on("connect", handleConnect)
  .on("disconnect", handleDisconnect)
  .on("game-end", gotoLobby)

},{"socket.io-client":"k52UWs"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9jb250cm9sbGVycy9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgaW8gPSByZXF1aXJlKFwic29ja2V0LmlvLWNsaWVudFwiKVxuICAsIHNlcnZlclVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICwgc29ja2V0ID0gaW8uY29ubmVjdChzZXJ2ZXJVcmwpXG4gICwgbmFtZUlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lXCIpXG5cbnZhciBJbnB1dCA9IGZ1bmN0aW9uIChnYW1lLCBrZXksIHByb3ApIHtcbiAgcmV0dXJuIHtcbiAgICBrZXk6IGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KGtleSksXG4gICAgcHJvcDogcHJvcFxuICB9O1xufTtcblxudmFyIHN0YXRlcyA9IHtcbiAgdXBkYXRlTmFtZTogZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLm5hbWUgPSBlLnRhcmdldC52YWx1ZTtcbiAgfSxcbiAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5nYW1lLnN0YWdlLmRpc2FibGVWaXNpYmlsaXR5Q2hhbmdlID0gdHJ1ZTtcbiAgICBuYW1lSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIHRoaXMudXBkYXRlTmFtZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnVwID0gZmFsc2U7XG4gICAgdGhpcy5yaWdodCA9IGZhbHNlO1xuICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgIHRoaXMubGVmdCA9IGZhbHNlO1xuICAgIHRoaXMuanVtcCA9IGZhbHNlO1xuICAgIHRoaXMuZmlyZSA9IGZhbHNlO1xuICAgIHRoaXMubmFtZSA9IFwiXCI7XG5cbiAgICB0aGlzLmJyb2FkY2FzdEludGVydmFsID0gMTAwXG4gICAgdGhpcy5sYXN0QnJvYWRjYXN0ID0gRGF0ZS5ub3coKVxuXG4gICAgdGhpcy5pbnB1dHMgPSBbXG4gICAgICBJbnB1dCh0aGlzLCBQaGFzZXIuS2V5Ym9hcmQuVVAsIFwidXBcIiksXG4gICAgICBJbnB1dCh0aGlzLCBQaGFzZXIuS2V5Ym9hcmQuUklHSFQsIFwicmlnaHRcIiksXG4gICAgICBJbnB1dCh0aGlzLCBQaGFzZXIuS2V5Ym9hcmQuRE9XTiwgXCJkb3duXCIpLFxuICAgICAgSW5wdXQodGhpcywgUGhhc2VyLktleWJvYXJkLkxFRlQsIFwibGVmdFwiKSxcbiAgICAgIElucHV0KHRoaXMsIFBoYXNlci5LZXlib2FyZC5TUEFDRUJBUiwgXCJqdW1wXCIpLFxuICAgICAgSW5wdXQodGhpcywgUGhhc2VyLktleWJvYXJkLkYsIFwiZmlyZVwiKSxcbiAgICBdO1xuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByb2Nlc3NJbnB1dHMoKTtcbiAgICB0aGlzLmJyb2FkY2FzdCgpO1xuICB9LFxuXG4gIHByb2Nlc3NJbnB1dHM6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmlucHV0cy5mb3JFYWNoKGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgdGhpc1tpbnB1dC5wcm9wXSA9IGlucHV0LmtleS5pc0Rvd247IFxuICAgIH0sIHRoaXMpOyBcbiAgfSxcblxuICBicm9hZGNhc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKVxuICAgICAgLCBkb0Jyb2FkY2FzdCA9IG5vdyA+IHRoaXMubGFzdEJyb2FkY2FzdCArIHRoaXMuYnJvYWRjYXN0SW50ZXJ2YWxcbiAgICAgICwgcGF5bG9hZDtcblxuICAgIGlmICghZG9Ccm9hZGNhc3QpIHJldHVybiBmYWxzZTtcblxuICAgIHBheWxvYWQgPSB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICB1cDogdGhpcy51cCxcbiAgICAgIHJpZ2h0OiB0aGlzLnJpZ2h0LFxuICAgICAgZG93bjogdGhpcy5kb3duLFxuICAgICAgbGVmdDogdGhpcy5sZWZ0LFxuICAgICAganVtcDogdGhpcy5qdW1wLFxuICAgICAgZmlyZTogdGhpcy5maXJlICAgIFxuICAgIH07XG5cbiAgICBzb2NrZXQuZW1pdChcInRpY2tcIiwgcGF5bG9hZCk7XG4gICAgdGhpcy5sYXN0QnJvYWRjYXN0ID0gbm93O1xuICB9XG59O1xudmFyIGNvbnRyb2xsZXIgPSBuZXcgUGhhc2VyLkdhbWUoMzIwLCAyNDAsIFBoYXNlci5DQU5WQVMsIFwiY29udHJvbGxlclwiLCBzdGF0ZXMpO1xuXG52YXIgaGFuZGxlQ29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc29sZS5sb2coXCJjb25uZWN0ZWRcIik7XG59O1xuXG52YXIgaGFuZGxlRGlzY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc29sZS5sb2coXCJkaXNjb25uZWN0ZWRcIik7XG59O1xuXG52YXIgZ290b0xvYmJ5ID0gZnVuY3Rpb24gKHVybCkge1xuICB3aW5kb3cubG9jYXRpb24gPSB1cmwgfHwgXCIvbG9iYnlcIjtcbn07XG5cbnNvY2tldFxuICAub24oXCJjb25uZWN0XCIsIGhhbmRsZUNvbm5lY3QpXG4gIC5vbihcImRpc2Nvbm5lY3RcIiwgaGFuZGxlRGlzY29ubmVjdClcbiAgLm9uKFwiZ2FtZS1lbmRcIiwgZ290b0xvYmJ5KVxuIl19
