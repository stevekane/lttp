var Player = require("../entities/Player")
var Hadouken = require("../entities/Hadouken")
var {getRandom, noop, isTypeCombo} = require("../utils")

module.exports = class Round extends Phaser.State {

  addPlayer(id) {
    var spawn = getRandom(this.playerSpawns)
    var player = this.players.getFirstExists(false)

    player.reset(spawn.x, spawn.y)
    this.socketPlayerMap[id] = player
    console.log("add", id) 
  }

  removePlayer(id) {
    var player = this.socketPlayerMap[id]

    if (!player) return false
    player.kill()
    delete this.socketPlayerMap[id]
    console.log("remove", id)  
  }

  updatePlayer({id, keys}) {
    var player = this.socketPlayerMap[id]

    if (!player) return false
    player.name = keys.name
    player.up = keys.up
    player.right = keys.right
    player.down = keys.down
    player.left = keys.left
    if (keys.jump) player.jump()
    if (keys.fire) player.fire(this.hadoukens)
  }

  registerPlayer(player) {
    player.body.collides(this.wallsCg)
    player.body.setCollisionGroup(this.playersCg)
  }

  registerWall(wall) {
    this.walls.push(wall)
    wall.collides(this.playersCg)
    wall.collides(this.hadoukensCg)
    wall.setCollisionGroup(this.wallsCg)
  }

  registerHadouken(had) {
    had.body.collides(this.wallsCg, this.hadoukenHitsWall, this)
    had.body.setCollisionGroup(this.hadoukensCg) 
  }

  hadoukenHitsPlayer(had, player) {
    if (had.sprite.owner === player.sprite) {
      return 
    } else if (player.sprite.jumping) {
      getRandom(this.dodgeSounds).play()
      return
    } else {
      getRandom(this.killSounds).play()
      had.sprite.kill()
      player.sprite.kill()
    }
  }

  hadoukenHitsWall(had, wall) {
    getRandom(this.explosionSounds).play() 
    had.sprite.kill()
  }

  checkOverlap(body1, body2) {
    var hadouken
      , player
      , shouldCollide = true

    if (isTypeCombo(body1._type, body2._type, "player", "hadouken")) {
      shouldCollide = false
      player = body1._type === "player" ? body1 : body2
      hadouken = body2._type === "hadouken" ? body2 : body1
      this.hadoukenHitsPlayer(hadouken, player)
    } else {
      shouldCollide = true
    }
    return shouldCollide
  }

  preload() {
    this.game._assetLoader.loadFor("Round")
    this.physics.startSystem(Phaser.Physics.P2JS)
    this.game.physics.p2.setImpactEvents(true)
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, true)
    this.game.physics.p2.updateBoundsCollisionGroup()
  }

  create() {
    this.playerSpawns = [
      new Phaser.Point(200, 200),
      new Phaser.Point(600, 200),
      new Phaser.Point(1300, 200),
      new Phaser.Point(900, 450),
      new Phaser.Point(700, 650),
      new Phaser.Point(1200, 650)
    ]

    this.socketPlayerMap = {}

    this.game._socket
      .on("join", this.addPlayer.bind(this))
      .on("leave", this.removePlayer.bind(this))
      .on("tick", this.updatePlayer.bind(this))

    this.killSounds = [
      this.game.add.audio("toasty"), 
      this.game.add.audio("toasty3")
    ]

    this.explosionSounds = [
      this.game.add.audio("explosion"),
      this.game.add.audio("explosion5")
    ]

    this.dodgeSounds = [
      this.game.add.audio("dodge"),
      this.game.add.audio("dodge2"),
    ]

    this.map = this.game.add.tilemap("map")
    this.map.addTilesetImage("Desert", "Desert")
    this.ground = this.map.createLayer("Ground")

    this.players = this.game.add.group()
    this.players.classType = Player
    this.players.enableBody = true
    this.players.physicsBodyType = Phaser.Physics.P2
    this.players.createMultiple(20, "player")

    this.hadoukens = this.game.add.group()
    this.hadoukens.classType = Hadouken
    this.hadoukens.enableBody = true
    this.hadoukens.physicsBodyType = Phaser.Physics.P2
    this.hadoukens.createMultiple(1000, "hadouken")

    this.walls = []

    this.playersCg = this.game.physics.p2.createCollisionGroup()
    this.wallsCg = this.game.physics.p2.createCollisionGroup()
    this.hadoukensCg = this.game.physics.p2.createCollisionGroup()

    var walls = this.game.physics.p2.convertCollisionObjects(
      this.map,
      "Collisions",
      true
    )

    this.players.forEach(this.registerPlayer, this)
    this.hadoukens.forEach(this.registerHadouken, this)
    walls.forEach(this.registerWall, this)
  }

  update() {
    var living = this.players.countLiving()
    var playerCount = Object.keys(this.socketPlayerMap).length

    if (living > 1) {
      this.game.physics.p2.setPostBroadphaseCallback(this.checkOverlap, this) 
    } else if (living === 1) {
      Object.keys(this.socketPlayerMap).forEach(function (key) {
        this.socketPlayerMap[key].revive() 
      }, this)
    } else {
      if (this.game.physics.p2.postBroadphaseCallback) {
        this.game.physics.p2.setPostBroadphaseCallback(null)
      }
    }
  }
}
