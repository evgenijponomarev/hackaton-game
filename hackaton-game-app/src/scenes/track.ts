import trackJSON from '../map/track.json';
import { TILEMAP_NAME } from '../constants';

export class Track extends Phaser.Scene {
  constructor() {
    super('TrackScene');
  }

  preload() {
    trackJSON.tilesets[0].tiles.forEach((tile) => {
      const imagePath = `src/map/${tile.image}`;
      this.load.image(tile.image, imagePath);
    });

    this.load.tilemapTiledJSON(TILEMAP_NAME, 'src/map/track.json');
  }

  create() {
    const map = this.make.tilemap({ key: TILEMAP_NAME });

    const tilesets = map.tilesets
      .map((tileset) => {
        return map.addTilesetImage(tileset.name, tileset.name);
      })
      .filter((t) => !!t);

    trackJSON.layers.forEach((layer) => {
      map.createLayer(layer.name, tilesets, layer.x, layer.y);
    });
  }
}
