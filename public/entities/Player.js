module.exports = class Player extends Phaser.Sprite {
  constructor(state, x, y) {
    var player = new Phaser.Sprite(state, x, y, "player")

    player.scale.x = .25;
    player.scale.y = .25;

    return player;
  }
}
