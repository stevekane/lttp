var Player = require("../entities/Player")

module.exports = class Round extends Phaser.State {
  registerPlayer(player) {
    this.players.add(player) 
    player.body.collides(this.wallsCg)
    player.body.setCollisionGroup(this.playersCg)
  }

  registerWall(wall) {
    this.walls.push(wall)
    wall.collides(this.playersCg)
    wall.setCollisionGroup(this.wallsCg)
  }

  preload() {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.game.scale.setScreenSize()
    this.game._assetLoader.loadFor("Round")
    this.physics.startSystem(Phaser.Physics.P2JS)
    this.game.physics.p2.setImpactEvents(true)
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, true)
    this.game.physics.p2.updateBoundsCollisionGroup()
  }

  create() {
    this.inputs = []
    this.map = this.game.add.tilemap("map")
    this.map.addTilesetImage("Desert", "Desert")
    this.ground = this.map.createLayer("Ground")
    this.players = this.add.group()
    this.walls = []
    this.playersCg = this.game.physics.p2.createCollisionGroup()
    this.wallsCg = this.game.physics.p2.createCollisionGroup()

    var player1 = new Player(this.game, 900, 450)
    var walls = this.game.physics.p2.convertCollisionObjects(
      this.map,
      "Collisions",
      true
    )

    this.registerPlayer(player1)
    walls.forEach(this.registerWall, this)

    this.inputs.push({
      key: this.input.keyboard.addKey(Phaser.Keyboard.UP), 
      down: () => { player1.up = true }, 
      up: () => { player1.up = false }
    })
    this.inputs.push({
      key: this.input.keyboard.addKey(Phaser.Keyboard.RIGHT), 
      down: () => { player1.right = true }, 
      up: () => { player1.right = false }
    })
    this.inputs.push({
      key: this.input.keyboard.addKey(Phaser.Keyboard.DOWN), 
      down: () => { player1.down = true }, 
      up: () => { player1.down = false }
    })
    this.inputs.push({
      key: this.input.keyboard.addKey(Phaser.Keyboard.LEFT), 
      down: () => { player1.left = true }, 
      up: () => { player1.left = false }
    })
    this.inputs.push({
      key: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
      down: player1.jump.bind(player1)
    })
  }

  update() {
    this.inputs.forEach(doActionForKey)
  }
}

var noop = () => {}

var doActionForKey = ({key, down, up}) => {
  var down = down || noop
    , up = up || noop

  if (key.isDown) down()
  else up()
}
