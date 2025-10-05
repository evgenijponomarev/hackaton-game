import trackJsonSrc from '../map/track.json?url';

import trackJson from '../map/track.json';
import { SIZE, SPRITE, TILEMAP_NAME } from '../constants';
import { Player } from '../entities/player';

export class Track extends Phaser.Scene {
  player?: Player;
  score = 0;
  scoreText?: Phaser.GameObjects.Text;
  map?: Phaser.Tilemaps.Tilemap;
  layers?: Phaser.Tilemaps.TilemapLayer[];
  buttonLeft?: Phaser.GameObjects.Rectangle;
  buttonRight?: Phaser.GameObjects.Rectangle;

  constructor() {
    super('TrackScene');
  }

  loadAssets() {
    trackJson.tilesets.forEach((tileset) => {
      tileset.tiles.forEach((tile) => {
        this.load.image(tile.image, tile.image.replace('../../public/', '/'));
      });
    });

    this.load.spritesheet(SPRITE.PLAYER, '/assets/images/player.png', {
      frameWidth: SIZE.PLAYER.WIDTH,
      frameHeight: SIZE.PLAYER.HEIGHT,
    });

    this.load.tilemapTiledJSON(TILEMAP_NAME, trackJsonSrc);
  }

  addScoreText() {
    if (!this.map) return;

    this.scoreText = this.add.text(0, 0, `Score: ${this.score}`, {
      fontSize: 36,
      align: 'center',
      fixedWidth: this.map.widthInPixels,
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 0, y: 10 },
    });
    this.scoreText.setScrollFactor(0);
  }

  addButton(type: 'left' | 'right') {
    if (!this.map || !this.player) return;

    const button = this.add.rectangle(
      type === 'left' ? 0 : this.sys.game.canvas.width,
      this.sys.game.canvas.height,
      this.sys.game.canvas.width,
      this.sys.game.canvas.height,
      0xffffff,
      0
    );
    button.setScrollFactor(0);

    // Делаем кнопку интерактивной
    button.setInteractive({ useHandCursor: true });

    // Обработчики для мыши и тач-устройств
    const startAction =
      type === 'left' ? this.player.shiftLeft : this.player.shiftRight;
    const stopAction = this.player.stopShifting;

    // Визуальная обратная связь при нажатии
    button.on('pointerdown', () => {
      button.setAlpha(0.8); // Затемняем кнопку при нажатии
      startAction.call(this.player);
    });

    button.on('pointerup', () => {
      button.setAlpha(0.5); // Возвращаем прозрачность
      stopAction.call(this.player);
    });

    button.on('pointerout', () => {
      button.setAlpha(0.5); // Возвращаем прозрачность при выходе курсора
      stopAction.call(this.player);
    });

    // События для тач-устройств
    button.on('touchstart', () => {
      button.setAlpha(0.8);
      startAction.call(this.player);
    });

    button.on('touchend', () => {
      button.setAlpha(0.5);
      stopAction.call(this.player);
    });

    button.on('touchcancel', () => {
      button.setAlpha(0.5);
      stopAction.call(this.player);
    });

    return button;
  }

  createMap() {
    this.map = this.make.tilemap({ key: TILEMAP_NAME });

    const tilesets = this.map.tilesets
      .map((tileset) => {
        return this.map!.addTilesetImage(tileset.name, tileset.name);
      })
      .filter((t) => !!t);

    this.layers = trackJson.layers
      .map((layer) => {
        return this.map!.createLayer(layer.name, tilesets);
      })
      .filter((l) => !!l);
  }

  createPlayer() {
    if (!this.map) return;

    this.player = new Player(
      this,
      this.map.widthInPixels / 2,
      this.map.heightInPixels - SIZE.PLAYER.HEIGHT,
      SPRITE.PLAYER
    );
  }

  initCamera() {
    if (!this.player || !this.map) return;

    this.cameras.main.startFollow(
      this.player,
      false,
      1,
      1,
      0,
      this.sys.game.canvas.height / 3
    );
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
  }

  initWorldPhisics() {
    if (!this.player || !this.map) return;

    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.player.setCollideWorldBounds(true);
  }

  initRoadsideObjectsLayer() {
    if (!this.layers || !this.player) return;

    const roadsideObjectsLayer = this.layers.find(
      (layer) => layer.layer.name === 'roadside_objects'
    )!;
    this.physics.add.collider(this.player, roadsideObjectsLayer);
    roadsideObjectsLayer.setCollisionByExclusion([-1]);
  }

  initCoinsLayer() {
    if (!this.layers || !this.player) return;

    const coinsLayer = this.layers.find(
      (layer) => layer.layer.name === 'coins'
    )!;
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

  preload() {
    this.loadAssets();
  }

  create() {
    this.createMap();
    this.createPlayer();
    this.addScoreText();
    this.initCamera();
    this.initWorldPhisics();
    this.initRoadsideObjectsLayer();
    this.initCoinsLayer();
    this.buttonLeft = this.addButton('left');
    this.buttonRight = this.addButton('right');
  }

  update(_: number, delta: number): void {
    this.player?.update(delta);
  }
}
