import trackJSON from '../map/level/track.json';
import { TILEMAP_NAME } from '../constants';

export class Track extends Phaser.Scene {
  constructor() {
    super('TrackScene');
  }

  loadIcons() {
    trackJSON.tilesets.forEach((tileset) => {
      this.load.image(tileset.name, tileset.image.replace('..', 'src/map'));
    });
  }

  preload() {
    trackJSON.tilesets.forEach((tileset) => {
      this.load.image(tileset.name, tileset.image.replace('..', 'src/map'));
    });

    this.load.tilemapTiledJSON(TILEMAP_NAME, 'src/map/level/track.json');
  }

  create() {
    const map = this.make.tilemap({ key: TILEMAP_NAME });
    const tilesets = trackJSON.tilesets
      .map((tileset) => {
        return map.addTilesetImage(tileset.name);
      })
      .filter((t) => !!t);

    trackJSON.layers.forEach((layer) => {
      map.createLayer(layer.name, tilesets, layer.x, layer.y);
    });
  }
}
