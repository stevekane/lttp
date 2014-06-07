module.exports = class Player extends Phaser.Sprite {
  constructor(game, x, y) {
    //super(game, x, y, "player", 0)
    super(game, x, y, "none", 0)

    game.physics.p2.enable(this)

    this.body.setCircle(24)
    this.body.name = "player"

    this.speed = 300
    this.jumping = false
    this.jumpDuration = 600
    this.hadoukenTimeout = 1000
    this.lastHadouken = null

    this.z = 1.0
    this.scale.setTo(this.z, this.z)
    this.rotationOffset = Math.PI / 2

    this.up = false
    this.right = false
    this.down = false
    this.left = false

    //this.animations.add("walking", [0, 1, 2, 3], 8)
    //this.animations.add("jumping", [3], 8)
    //this.animations.add("idle", [0], 8)

    this.jumpSound = game.add.audio("jump")
    this.landSound = game.add.audio("jump")
    this.fireSound = game.add.audio("hadouken")
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

  fire(hadoukens) {
    var hadouken = hadoukens.getFirstExists(false)
    var now = this.game.time.now
    var hadoukenAllowed = now > this.lastHadouken + this.hadoukenTimeout

    if (!hadoukenAllowed) return
    hadouken.reset(this.x, this.y)
    hadouken.body.rotation = this.body.rotation
    hadouken.body.moveForward(hadouken.speed)
    hadouken.owner = this
    this.lastHadouken = now
    this.fireSound.play()
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
