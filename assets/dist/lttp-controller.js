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

    this.broadcastInterval = 33
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9jb250cm9sbGVycy9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBpbyA9IHJlcXVpcmUoXCJzb2NrZXQuaW8tY2xpZW50XCIpXG4gICwgc2VydmVyVXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgLCBzb2NrZXQgPSBpby5jb25uZWN0KHNlcnZlclVybClcbiAgLCBuYW1lSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVcIilcblxudmFyIElucHV0ID0gZnVuY3Rpb24gKGdhbWUsIGtleSwgcHJvcCkge1xuICByZXR1cm4ge1xuICAgIGtleTogZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoa2V5KSxcbiAgICBwcm9wOiBwcm9wXG4gIH07XG59O1xuXG52YXIgc3RhdGVzID0ge1xuICB1cGRhdGVOYW1lOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMubmFtZSA9IGUudGFyZ2V0LnZhbHVlO1xuICB9LFxuICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmdhbWUuc3RhZ2UuZGlzYWJsZVZpc2liaWxpdHlDaGFuZ2UgPSB0cnVlO1xuICAgIG5hbWVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgdGhpcy51cGRhdGVOYW1lLmJpbmQodGhpcykpO1xuICAgIHRoaXMudXAgPSBmYWxzZTtcbiAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XG4gICAgdGhpcy5kb3duID0gZmFsc2U7XG4gICAgdGhpcy5sZWZ0ID0gZmFsc2U7XG4gICAgdGhpcy5qdW1wID0gZmFsc2U7XG4gICAgdGhpcy5maXJlID0gZmFsc2U7XG4gICAgdGhpcy5uYW1lID0gXCJcIjtcblxuICAgIHRoaXMuYnJvYWRjYXN0SW50ZXJ2YWwgPSAzM1xuICAgIHRoaXMubGFzdEJyb2FkY2FzdCA9IERhdGUubm93KClcblxuICAgIHRoaXMuaW5wdXRzID0gW1xuICAgICAgSW5wdXQodGhpcywgUGhhc2VyLktleWJvYXJkLlVQLCBcInVwXCIpLFxuICAgICAgSW5wdXQodGhpcywgUGhhc2VyLktleWJvYXJkLlJJR0hULCBcInJpZ2h0XCIpLFxuICAgICAgSW5wdXQodGhpcywgUGhhc2VyLktleWJvYXJkLkRPV04sIFwiZG93blwiKSxcbiAgICAgIElucHV0KHRoaXMsIFBoYXNlci5LZXlib2FyZC5MRUZULCBcImxlZnRcIiksXG4gICAgICBJbnB1dCh0aGlzLCBQaGFzZXIuS2V5Ym9hcmQuU1BBQ0VCQVIsIFwianVtcFwiKSxcbiAgICAgIElucHV0KHRoaXMsIFBoYXNlci5LZXlib2FyZC5GLCBcImZpcmVcIiksXG4gICAgXTtcbiAgfSxcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcm9jZXNzSW5wdXRzKCk7XG4gICAgdGhpcy5icm9hZGNhc3QoKTtcbiAgfSxcblxuICBwcm9jZXNzSW5wdXRzOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pbnB1dHMuZm9yRWFjaChmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgIHRoaXNbaW5wdXQucHJvcF0gPSBpbnB1dC5rZXkuaXNEb3duOyBcbiAgICB9LCB0aGlzKTsgXG4gIH0sXG5cbiAgYnJvYWRjYXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5vdyA9IERhdGUubm93KClcbiAgICAgICwgZG9Ccm9hZGNhc3QgPSBub3cgPiB0aGlzLmxhc3RCcm9hZGNhc3QgKyB0aGlzLmJyb2FkY2FzdEludGVydmFsXG4gICAgICAsIHBheWxvYWQ7XG5cbiAgICBpZiAoIWRvQnJvYWRjYXN0KSByZXR1cm4gZmFsc2U7XG5cbiAgICBwYXlsb2FkID0ge1xuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgdXA6IHRoaXMudXAsXG4gICAgICByaWdodDogdGhpcy5yaWdodCxcbiAgICAgIGRvd246IHRoaXMuZG93bixcbiAgICAgIGxlZnQ6IHRoaXMubGVmdCxcbiAgICAgIGp1bXA6IHRoaXMuanVtcCxcbiAgICAgIGZpcmU6IHRoaXMuZmlyZSAgICBcbiAgICB9O1xuXG4gICAgc29ja2V0LmVtaXQoXCJ0aWNrXCIsIHBheWxvYWQpO1xuICAgIHRoaXMubGFzdEJyb2FkY2FzdCA9IG5vdztcbiAgfVxufTtcblxudmFyIGNvbnRyb2xsZXIgPSBuZXcgUGhhc2VyLkdhbWUoMzIwLCAyNDAsIFBoYXNlci5DQU5WQVMsIFwiY29udHJvbGxlclwiLCBzdGF0ZXMpO1xuXG52YXIgaGFuZGxlQ29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc29sZS5sb2coXCJjb25uZWN0ZWRcIik7XG59O1xuXG52YXIgaGFuZGxlRGlzY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc29sZS5sb2coXCJkaXNjb25uZWN0ZWRcIik7XG59O1xuXG52YXIgZ290b0xvYmJ5ID0gZnVuY3Rpb24gKHVybCkge1xuICB3aW5kb3cubG9jYXRpb24gPSB1cmwgfHwgXCIvbG9iYnlcIjtcbn07XG5cbnNvY2tldFxuICAub24oXCJjb25uZWN0XCIsIGhhbmRsZUNvbm5lY3QpXG4gIC5vbihcImRpc2Nvbm5lY3RcIiwgaGFuZGxlRGlzY29ubmVjdClcbiAgLm9uKFwiZ2FtZS1lbmRcIiwgZ290b0xvYmJ5KVxuIl19
