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

socket
  .on("connect", handleConnect)
  .on("disconnect", handleDisconnect)

},{"socket.io-client":"k52UWs"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc3RldmVua2FuZS9sdHRwL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3RldmVua2FuZS9sdHRwL3B1YmxpYy9jb250cm9sbGVycy9jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBpbyA9IHJlcXVpcmUoXCJzb2NrZXQuaW8tY2xpZW50XCIpXG4gICwgc2VydmVyVXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgLCBzb2NrZXQgPSBpby5jb25uZWN0KHNlcnZlclVybClcbiAgLCBuYW1lSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVcIilcblxudmFyIElucHV0ID0gZnVuY3Rpb24gKGdhbWUsIGtleSwgcHJvcCkge1xuICByZXR1cm4ge1xuICAgIGtleTogZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoa2V5KSxcbiAgICBwcm9wOiBwcm9wXG4gIH07XG59O1xuXG52YXIgc3RhdGVzID0ge1xuICB1cGRhdGVOYW1lOiBmdW5jdGlvbiAoZSkge1xuICAgIHRoaXMubmFtZSA9IGUudGFyZ2V0LnZhbHVlO1xuICB9LFxuICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmdhbWUuc3RhZ2UuZGlzYWJsZVZpc2liaWxpdHlDaGFuZ2UgPSB0cnVlO1xuICAgIG5hbWVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgdGhpcy51cGRhdGVOYW1lLmJpbmQodGhpcykpO1xuICAgIHRoaXMudXAgPSBmYWxzZTtcbiAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XG4gICAgdGhpcy5kb3duID0gZmFsc2U7XG4gICAgdGhpcy5sZWZ0ID0gZmFsc2U7XG4gICAgdGhpcy5qdW1wID0gZmFsc2U7XG4gICAgdGhpcy5maXJlID0gZmFsc2U7XG4gICAgdGhpcy5uYW1lID0gXCJcIjtcblxuICAgIHRoaXMuYnJvYWRjYXN0SW50ZXJ2YWwgPSAxMDBcbiAgICB0aGlzLmxhc3RCcm9hZGNhc3QgPSBEYXRlLm5vdygpXG5cbiAgICB0aGlzLmlucHV0cyA9IFtcbiAgICAgIElucHV0KHRoaXMsIFBoYXNlci5LZXlib2FyZC5VUCwgXCJ1cFwiKSxcbiAgICAgIElucHV0KHRoaXMsIFBoYXNlci5LZXlib2FyZC5SSUdIVCwgXCJyaWdodFwiKSxcbiAgICAgIElucHV0KHRoaXMsIFBoYXNlci5LZXlib2FyZC5ET1dOLCBcImRvd25cIiksXG4gICAgICBJbnB1dCh0aGlzLCBQaGFzZXIuS2V5Ym9hcmQuTEVGVCwgXCJsZWZ0XCIpLFxuICAgICAgSW5wdXQodGhpcywgUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSLCBcImp1bXBcIiksXG4gICAgICBJbnB1dCh0aGlzLCBQaGFzZXIuS2V5Ym9hcmQuRiwgXCJmaXJlXCIpLFxuICAgIF07XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucHJvY2Vzc0lucHV0cygpO1xuICAgIHRoaXMuYnJvYWRjYXN0KCk7XG4gIH0sXG5cbiAgcHJvY2Vzc0lucHV0czogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaW5wdXRzLmZvckVhY2goZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICB0aGlzW2lucHV0LnByb3BdID0gaW5wdXQua2V5LmlzRG93bjsgXG4gICAgfSwgdGhpcyk7IFxuICB9LFxuXG4gIGJyb2FkY2FzdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBub3cgPSBEYXRlLm5vdygpXG4gICAgICAsIGRvQnJvYWRjYXN0ID0gbm93ID4gdGhpcy5sYXN0QnJvYWRjYXN0ICsgdGhpcy5icm9hZGNhc3RJbnRlcnZhbFxuICAgICAgLCBwYXlsb2FkO1xuXG4gICAgaWYgKCFkb0Jyb2FkY2FzdCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgcGF5bG9hZCA9IHtcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIHVwOiB0aGlzLnVwLFxuICAgICAgcmlnaHQ6IHRoaXMucmlnaHQsXG4gICAgICBkb3duOiB0aGlzLmRvd24sXG4gICAgICBsZWZ0OiB0aGlzLmxlZnQsXG4gICAgICBqdW1wOiB0aGlzLmp1bXAsXG4gICAgICBmaXJlOiB0aGlzLmZpcmUgICAgXG4gICAgfTtcblxuICAgIHNvY2tldC5lbWl0KFwidGlja1wiLCBwYXlsb2FkKTtcbiAgICB0aGlzLmxhc3RCcm9hZGNhc3QgPSBub3c7XG4gIH1cbn07XG52YXIgY29udHJvbGxlciA9IG5ldyBQaGFzZXIuR2FtZSgzMjAsIDI0MCwgUGhhc2VyLkNBTlZBUywgXCJjb250cm9sbGVyXCIsIHN0YXRlcyk7XG5cbnZhciBoYW5kbGVDb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLmxvZyhcImNvbm5lY3RlZFwiKTtcbn07XG5cbnZhciBoYW5kbGVEaXNjb25uZWN0ID0gZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLmxvZyhcImRpc2Nvbm5lY3RlZFwiKTtcbn07XG5cbnNvY2tldFxuICAub24oXCJjb25uZWN0XCIsIGhhbmRsZUNvbm5lY3QpXG4gIC5vbihcImRpc2Nvbm5lY3RcIiwgaGFuZGxlRGlzY29ubmVjdClcbiJdfQ==
