module.exports = class AssetLoader {
  constructor(game, assets) {
    if (!game || !assets) throw new Error("Provide game and assets to constructor")
    this.game = game
    this.assets = assets 
  }
  loadFor(state) {
    var forState = this.assets[state] 
    var game = this.game

    if (!forState) return

    var tilemaps = forState.tilemaps || []
    var images = forState.images || []
    var audios = forState.audios || []
    var spritesheets = forState.spritesheets || []

    images.forEach(img => game.load.image(img.name, img.path))
    audios.forEach(audio => game.load.audio(audio.name, audio.path))
    spritesheets.forEach((sheet) => {
      game.load.spritesheet(
        sheet.name,
        sheet.path,
        sheet.width,
        sheet.height,
        sheet.length
      )
    })
    tilemaps.forEach((tilemap) => {
      game.load.tilemap(
        tilemap.name,
        tilemap.path,
        null,
        Phaser.Tilemap.TILED_JSON
      )
    })
  }
}
