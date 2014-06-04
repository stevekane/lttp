var {map, forEach} = require("lodash")
var Round = require("./states/Round")
var screen = {
  height: 480,
  width: 640
}

var game = new Phaser.Game(screen.width, screen.height, Phaser.AUTO, "game")

game.state.add('game', Round);
game.state.start('game');
