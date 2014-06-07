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
