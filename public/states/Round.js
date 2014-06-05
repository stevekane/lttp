var Player = require("../entities/Player")
var Wall = require("../entities/Wall")

module.exports = class Round extends Phaser.State {
  preload() {
    this.load.spritesheet('player', 'sprites/enemy.png', 64, 64, 4)
    this.load.image('wall', 'sprites/player.png')
    this.load.audio('jump', 'sounds/jump.ogg')
    this.load.audio('land', 'sounds/land.ogg')
  }

  create() {
    var player1 = new Player(this.game, 0, 0)
    var wall1 = new Wall(this, 200, 200)
    var upKey = this.input.keyboard.addKey(Phaser.Keyboard.UP)
    var rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    var downKey = this.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    var leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    var jumpKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    this.physics.startSystem(Phaser.Physics.Arcade)
    this.inputs = [
      {
        key: upKey, 
        down: () => { player1.up = true}, 
        up: () => {player1.up = false}
      },
      {
        key: rightKey, 
        down: () => { player1.right = true}, 
        up: () => {player1.right = false}
      },
      {
        key: downKey, 
        down: () => { player1.down = true}, 
        up: () => {player1.down = false}
      },
      {
        key: leftKey, 
        down: () => { player1.left = true}, 
        up: () => {player1.left = false}
      },
      {
        key: jumpKey, 
        down: player1.jump.bind(player1)
      }
    ]

    this.players = this.add.group()

    this.players.add(player1)
  }

  update() {
    var {inputs, game, players, walls} = this 

    inputs.forEach(doActionForKey)
  }
}

var noop = () => {}

var doActionForKey = ({key, down, up}) => {
  var down = down || noop
    , up = up || noop

  if (key.isDown) down()
  else up()
}
