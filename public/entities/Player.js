module.exports = class Player extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, "player", 0)

    game.physics.p2.enable(this)
    this.enableBody = true
    this.physicsBodyType = Phaser.Physics.P2JS
    this.anchor.setTo(.5, .5)
    this.body.setCircle(24)

    this.speed = 300
    this.jumping = false
    this.jumpDuration = 600
    this.z = 1.0
    this.scale.setTo(this.z, this.z)

    this.up = false
    this.right = false
    this.down = false
    this.left = false

    this.animations.add("walking", [0, 1, 2, 3], 8)
    this.animations.add("jumping", [3], 8)
    this.animations.add("idle", [0], 8)
    this.rotationOffset = (-1 * Math.PI / 2)

    this.jumpSound = game.add.audio("jump")
    this.landSound = game.add.audio("land")
  }

  jump() {
    if (this.jumping) return false

    var initialHeight = this.z
      , apex = initialHeight * 1.2
      , upTime = this.jumpDuration / 2
      , downTime = this.jumpDuration / 2
      , easeUp = Phaser.Easing.Sinusoidal.Out
      , easeDown = Phaser.Easing.Sinusoidal.In
      , ascent = this.game.add.tween(this).to({z: apex}, upTime, easeUp)
      , descent = this.game.add.tween(this).to({z: initialHeight}, downTime, easeDown)

    ascent.onStart.add(() => {
      this.jumpSound.play()
      this.jumping = true
    })
    descent.onComplete.add(() => {
      this.landSound.play()
      this.jumping = false
    })
    ascent.chain(descent).start()
  }

  update() {
    var leftVel = this.left ? this.speed * -1 : 0
      , rightVel = this.right ? this.speed : 0
      , upVel = this.up ? this.speed * -1 : 0
      , downVel = this.down ? this.speed : 0
      , xVel = leftVel + rightVel
      , yVel = upVel + downVel
      , stopped = (!xVel && !yVel)

    this.scale.x = this.z
    this.scale.y = this.z
    this.body.setZeroRotation()
    this.body.rotation = stopped 
      ? this.body.rotation 
      : Phaser.Math.angleBetween(0, 0, xVel, yVel) + this.rotationOffset

    if (!this.jumping) {
      this.body.velocity.x = xVel 
      this.body.velocity.y = yVel
      this.animations.play(stopped ? "idle" : "walking")
    } else {
      this.animations.play("jumping") 
    }
  }
}
