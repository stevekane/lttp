var Player = require("../entities/Player")
var Wall = require("../entities/Wall")

module.exports = class Round extends Phaser.State {
  preload() {
    this.load.image('player', 'sprites/player.png')
    this.load.image('wall', 'sprites/player.png')
  }

  create() {
    var player1 = new Player(this, 0, 0)
    var wall1 = new Wall(this, 200, 200)
    var upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP)
    var rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    var downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    var leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    var jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    this.physics.startSystem(Phaser.Physics.Arcade)
    this.inputs = [
      {key: upKey, fn: player1.moveUp.bind(player1)},
      {key: rightKey, fn: player1.moveRight.bind(player1)},
      {key: downKey, fn: player1.moveDown.bind(player1)},
      {key: leftKey, fn: player1.moveLeft.bind(player1)},
      {key: jumpKey, fn: player1.jump.bind(player1)}
    ]

    this.players = this.add.group()
    this.walls = this.add.group()

    this.players.add(player1)
    this.walls.add(wall1)
  }

  update() {
    var {inputs, game, players, walls} = this 

    players.callAll("stop")
    inputs.forEach(doIfPressed)
  }
}

var doIfPressed = (input) => {
  if (input.key.isDown) input.fn()
}
