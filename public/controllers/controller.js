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
