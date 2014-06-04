var Player = require("../entities/Player")

var addPlayer = (state, player) => {
  state.physics.arcade.enable(player)
  player.body.collideWorldBounds = true
  state.add.existing(player)
}

module.exports = class Round extends Phaser.State {
  preload() {
    this.load.image('player', 'sprites/player.png')
  }

  create() {
    var player1 = Player(this, 0, 0)
    var player2 = Player(this, 300, 300)

    this.physics.startSystem(Phaser.Physics.Arcade)
    addPlayer(this, player1)
    addPlayer(this, player2)
  }

  update() {
  
  }
}
