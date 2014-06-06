var Player = require("../entities/Player")

module.exports = class Round extends Phaser.State {
  preload() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.setScreenSize()
    this.game._assetLoader.loadFor("Round")
    this.physics.startSystem(Phaser.Physics.P2JS)
    this.game.physics.p2.setImpactEvents(true)
    this.inputs = []
    this.movementBounds = this.game.physics.p2.createCollisionGroup()
  }

  create() {
    var {input, game, inputs} = this
    var player1 = new Player(this.game, 900, 450)

    this.map = game.add.tilemap("map")
    this.map.addTilesetImage("Desert", "Desert")
    this.ground = this.map.createLayer("Ground")
    this.players = game.add.group()
    this.movementBounds = game.physics.p2.createCollisionGroup()

    inputs.push({
      key: input.keyboard.addKey(Phaser.Keyboard.UP), 
      down: () => { player1.up = true }, 
      up: () => { player1.up = false }
    })
    inputs.push({
      key: input.keyboard.addKey(Phaser.Keyboard.RIGHT), 
      down: () => { player1.right = true }, 
      up: () => { player1.right = false }
    })
    inputs.push({
      key: input.keyboard.addKey(Phaser.Keyboard.DOWN), 
      down: () => { player1.down = true }, 
      up: () => { player1.down = false }
    })
    inputs.push({
      key: input.keyboard.addKey(Phaser.Keyboard.LEFT), 
      down: () => { player1.left = true }, 
      up: () => { player1.left = false }
    })
    inputs.push({
      key: input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
      down: player1.jump.bind(player1)
    })

    this.players.add(player1)
  }

  update() {
    var {inputs, game, players, collisions} = this 

    inputs.forEach(doActionForKey)
  }

  render() {
    //this.players.children.forEach(function (player) {
    //  this.game.debug.rectangle(player.body) 
    //}, this)
  }
}

var noop = () => {}

var doActionForKey = ({key, down, up}) => {
  var down = down || noop
    , up = up || noop

  if (key.isDown) down()
  else up()
}
