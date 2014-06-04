module.exports = class Wall extends Phaser.Sprite {
  constructor(state, x, y) {
    super(state, y, y, "wall")
    state.physics.arcade.enable(this)
    this.body.collideWorldBounds = true
    this.immovable = true
    this.anchor.set(.5)
  }
}
