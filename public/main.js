var Round = require("./states/Round")
var AssetLoader = require("./systems/AssetLoader")
var assets = require("./assets.json")

var game = new Phaser.Game(1920, 960, Phaser.AUTO, "game")

game.state.add('game', Round)
game.state.start('game')
game._assetLoader = new AssetLoader(game, assets)
