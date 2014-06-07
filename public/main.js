var Round = require("./states/Round")
var AssetLoader = require("./systems/AssetLoader")
var assets = require("./assets.json")
var io = require("socket.io-client")
var serverUrl = window.location.href + "server"
var socket = io.connect(serverUrl)
var game = new Phaser.Game(1920, 960, Phaser.CANVAS, "game")

socket.on("connect", function () {
  console.log("server connected")
  game._assetLoader = new AssetLoader(game, assets)
  game._socket = socket
  game.state.add('game', Round)
  game.state.start('game')
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  game.scale.setScreenSize()
  game.scale.refresh()
  game.stage.disableVisibilityChange = true
});
