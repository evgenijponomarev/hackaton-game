import trackJSON from '../map/track.json';
import { SIZE, SPRITE, TILEMAP_NAME } from '../constants';
import { Player } from '../entities/player';

export class Track extends Phaser.Scene {
  player?: Player;
  score = 0;
  scoreText?: Phaser.GameObjects.Text;

  constructor() {
    super('TrackScene');
  }

  preload() {
    trackJSON.tilesets.forEach((tileset) => {
      tileset.tiles.forEach((tile) => {
        this.load.image(tile.image, tile.image.replace('../../public/', '/'));
      });
    });

    this.load.tilemapTiledJSON(TILEMAP_NAME, 'src/map/track.json?');

    this.load.spritesheet(SPRITE.PLAYER, '/assets/images/player.png', {
      frameWidth: SIZE.PLAYER.WIDTH,
      frameHeight: SIZE.PLAYER.HEIGHT,
    });
  }

  create() {
    const map = this.make.tilemap({ key: TILEMAP_NAME });

    const tilesets = map.tilesets
      .map((tileset) => {
        return map.addTilesetImage(tileset.name, tileset.name);
      })
      .filter((t) => !!t);

    const layers = trackJSON.layers
      .map((layer) => {
        return map.createLayer(layer.name, tilesets);
      })
      .filter((l) => !!l);

    this.player = new Player(
      this,
      map.widthInPixels / 2,
      map.heightInPixels - SIZE.PLAYER.HEIGHT,
      SPRITE.PLAYER
    );

    this.scoreText = this.add.text(0, 0, `Score: ${this.score}`, {
      fontSize: 36,
      align: 'center',
      fixedWidth: map.widthInPixels,
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 0, y: 10 },
    });
    this.scoreText.setScrollFactor(0);

    this.cameras.main.startFollow(
      this.player,
      false,
      1,
      1,
      0,
      window.innerHeight / 2
    );
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.player.setCollideWorldBounds(true);
    const roadsideObjectsLayer = layers.find(
      (layer) => layer.layer.name === 'roadside_objects'
    )!;
    const coinsLayer = layers.find((layer) => layer.layer.name === 'coins')!;
    this.physics.add.collider(this.player, roadsideObjectsLayer);
    roadsideObjectsLayer.setCollisionByExclusion([-1]);

    this.physics.add.collider(this.player, coinsLayer, (_, tile) => {
      tile.destroy();
      coinsLayer.removeTileAt(
        (tile as Phaser.Tilemaps.Tile).x,
        (tile as Phaser.Tilemaps.Tile).y
      );
      this.score += 1;
      this.scoreText?.setText(`Score: ${this.score}`);
    });
    coinsLayer.setCollisionByExclusion([-1]);
  }

  update(_: number, delta: number): void {
    this.player?.update(delta);
  }
}
