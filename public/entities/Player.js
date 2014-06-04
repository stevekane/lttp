module.exports = class Player extends Phaser.Sprite {
  constructor(state, x, y) {
    super(state, x, y, "player")
    state.physics.arcade.enable(this)
    this.body.collideWorldBounds = true
    this.checkWorldBounds = true
    this.scale.x = .25
    this.scale.y = .25
    this.anchor.set(.5)
    this.speed = 150
  }
  stop() {
    this.body.velocity.y = 0 
    this.body.velocity.x = 0 
  }
  moveUp() {
    this.body.velocity.y = -1 * this.speed
  }
  moveDown() {
    this.body.velocity.y = this.speed
  }
  moveLeft() {
    this.body.velocity.x = -1 * this.speed
  }
  moveRight() {
    this.body.velocity.x = this.speed
  }
}
