module.exports = class Hadouken extends Phaser.Sprite {
  constructor(game, x, y) {
    //super(game, x, y, "hadouken", 0)
    //super(game, x, y, "fireball", 0)
    super(game, x, y, "none", 0)

    game.physics.p2.enable(this)
    this.enableBody = true
    this.physicsBodyType = Phaser.Physics.P2JS
    this.anchor.setTo(.5, .5)
    this.body.setCircle(6)

    this.checkWorldBounds = true
    this.outOfBoundsKill = true

    this.speed = 3000
    this.owner = null

    //this.animations.add("traveling", [0, 1, 2, 3], 8)
    //this.animations.add("exploding", [3], 8)

    //this.travelSound = game.add.audio("jump")
    this.collideSound = game.add.audio("land")
  }

  update() {
    this.body.setZeroRotation()
  }

  explode() {
    this.collideSound.play()
    this.kill() 
  }
}
