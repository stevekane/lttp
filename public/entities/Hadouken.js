module.exports = class Hadouken extends Phaser.Sprite {
  constructor(game, x, y) {
    //super(game, x, y, "hadouken", 0)
    //super(game, x, y, "fireball", 0)
    super(game, x, y, "none", 0)

    game.physics.p2.enable(this)

    this.body.setCircle(16)
    this.body.name = "hadouken"

    this.speed = 2000
    this.owner = null

    //this.animations.add("traveling", [0, 1, 2, 3], 8)
    //this.animations.add("exploding", [3], 8)
  }

  update() {
    this.body.setZeroRotation()
  }
}
