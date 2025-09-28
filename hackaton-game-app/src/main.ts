import Phaser from 'phaser';

import { scenes } from './scenes';

import './style.css';

new Phaser.Game({
  width: 1000,
  height: 2000,
  title: 'Hackaton game',
  scene: scenes,
  url: import.meta.env.URL || '',
  version: import.meta.env.VERSION || '',
  backgroundColor: '#000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
});
