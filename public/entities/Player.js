module.exports = class Player extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, "none", 0)

    game.physics.p2.enable(this)

    this.body.setCircle(24)
    this.body._type = "player"

    this.name = "test"
    this.nameText = game.add.text(this.x, this.y - 60, this.name, {
      font: "30px Arial",
      fill: "#ff0000",
      align: "center"
    })
    this.nameText.anchor.set(.5)
    this.speed = 300
    this.jumping = false
    this.jumpDuration = 600
    this.hadoukenTimeout = 1000
    this.lastHadouken = null

    this.initialHeight = 1.0
    this.scale.setTo(this.initialHeight, this.initialHeight)
    this.rotationOffset = Math.PI / 2

    this.up = false
    this.right = false
    this.down = false
    this.left = false

    this.jumpSound = game.add.audio("jump")
    this.landSound = game.add.audio("jump")
    this.fireSound = game.add.audio("hadouken")
  }

  jump() {
    if (this.jumping) return false

    var initialHeight = this.initialHeight
      , apex = initialHeight * 1.2
      , max = {x: apex, y: apex}
      , min = {x: initialHeight, y: initialHeight}
      , upTime = this.jumpDuration / 2
      , downTime = this.jumpDuration / 2
      , easeUp = Phaser.Easing.Sinusoidal.Out
      , easeDown = Phaser.Easing.Sinusoidal.In
      , ascent = this.game.add.tween(this.scale).to(max, upTime, easeUp)
      , descent = this.game.add.tween(this.scale).to(min, downTime, easeDown)

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

    this.nameText.x = this.x
    this.nameText.y = this.y - 60
    this.nameText.setText(this.name)
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
