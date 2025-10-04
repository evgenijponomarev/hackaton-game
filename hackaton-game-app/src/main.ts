import Phaser from 'phaser';

import trackJSON from './map/track.json';
import { scenes } from './scenes';

import './style.css';

new Phaser.Game({
  width: trackJSON.width * trackJSON.tilewidth,
  height: (trackJSON.height * trackJSON.tileheight) / 8,
  title: 'Hackaton game',
  scene: scenes,
  url: import.meta.env.URL || '',
  version: import.meta.env.VERSION || '',
  backgroundColor: '#6c627b',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
});
