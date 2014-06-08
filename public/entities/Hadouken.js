module.exports = class Hadouken extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, "none", 0)

    game.physics.p2.enable(this)

    this.body.setCircle(16)
    this.body._type = "hadouken"

    this.speed = 2000
    this.owner = null
  }

  update() {
    this.body.setZeroRotation()
  }
}
