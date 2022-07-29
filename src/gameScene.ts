import "phaser";

export class GameScene extends Phaser.Scene {
  ummatchedTiles: Array<Phaser.GameObjects.Image>;
  uncoveredTiles: Array<Phaser.GameObjects.Image>; //tiles currently flipped over
  foundTiles: Array<Phaser.GameObjects.Image>; //matched tiles

  constructor() {
    super({
      key: "GameScene"
    });
  }

  preload(): void {
    this.load.image('blanket', 'assets/blanket.png');
    this.load.image('bow', 'assets/bow.png');
    this.load.image('orange', 'assets/orange.png');
    this.load.image('paws', 'assets/paws.png');
    this.load.image('tux', 'assets/tux.png');
    this.load.image('upsidedown', 'assets/upsidedown.png');
    this.load.image('bandana', 'assets/bandana.png');
    this.load.image('leaf', 'assets/leaf.png');


    this.load.image('pawprint', 'assets/pawprint.png');
    this.load.image('congratulations', 'assets/congratulations.png');
    this.load.image('play', 'assets/play.png');
    this.load.image('restart', 'assets/restart.png');
  }

  init(): void {
    this.ummatchedTiles = [];
    this.uncoveredTiles = [];
    this.foundTiles = [];
  }

  create(): void {
    var pets: Array<string> = ["blanket","bow","orange","paws","tux","upsidedown","leaf","bandana"];
    pets = pets.concat(pets);
    var tileSize: integer = 140;
    var cols: integer = 4  ;
    for (var i = 0; i < 16; i++) {
      var tileName = pets.splice(Math.floor(Math.random() * pets.length), 1)[0];
      var xx = ((i%cols) * tileSize)+180;
      var yy = (Math.floor(i/cols) * tileSize)+80;
      var tile = this.add.image(xx, yy, "pawprint").setInteractive();
      tile.setData({ name: tileName, flipped: false })
      tile.on("pointerdown", this.tileListener(tile), this);
      this.ummatchedTiles.push(tile);
    }
  }

  tileListener(tile: Phaser.GameObjects.Image): () => void {
    return function () {
      if (this.uncoveredTiles.length < 2 && tile.getData('flipped') === false) { //don't flip more than 2 tiles (or same tile) over
        tile.setData({ flipped: true });
        tile.setTexture(tile.getData('name'));
        this.uncoveredTiles.push(tile);

        if (this.uncoveredTiles.length >= 2) {
          if (tile.getData('name') === this.uncoveredTiles[0].getData('name')) {
            this.foundTiles.push(tile);

            this.ummatchedTiles = this.ummatchedTiles.filter(function(unmatchedTile: Phaser.GameObjects.Image, index: integer, arr: Array<Phaser.GameObjects.Image>){
              return unmatchedTile.getData('name') != tile.getData('name');
            });

            if (this.ummatchedTiles.length == 0) { //prints congratulations if all tiles are matched
              this.add.image(390, 200, 'congratulations');
              var playButton = this.add.image(570, 272, 'restart').setInteractive();
              playButton.on("pointerdown", () => { this.scene.restart() }, this);
            }

            this.uncoveredTiles = [];
          } else {
            this.time.delayedCall(1000, this.resetTiles, undefined, this)
          }
        }
      }
    }
  }

  resetTiles(): void {
    for (var i = 0; i < this.uncoveredTiles.length; i++) {
      this.uncoveredTiles[i].setTexture('pawprint');
      this.uncoveredTiles[i].setData({ flipped: false });
    }
    this.uncoveredTiles = [];
  }
};
