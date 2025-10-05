import { Entity } from './entitiy';

export class Player extends Entity {
  textureKey: string;
  private moveSpeed = 50;
  private shifting: 'left' | 'right' | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    const anims = this.scene.anims;
    const animsFrameRate = 9;
    this.textureKey = texture;

    // Проверяем, существует ли анимация, и создаем только если её нет
    if (!anims.exists('up')) {
      anims.create({
        key: 'up',
        frames: anims.generateFrameNames(this.textureKey, {
          start: 0,
          end: 5,
        }),
        frameRate: animsFrameRate,
        repeat: -1,
      });
    }
  }

  stopRun() {
    this.stop();
    this.setFrame(0);
  }

  update(delta: number): void {
    this.play('up', true);

    const keys = this.scene.input.keyboard?.createCursorKeys();

    // Нормализуем дельту времени для стабильного движения
    // При 60 FPS delta = 16.67ms, при 30 FPS delta = 33.33ms
    const normalizedDelta = delta * (delta / 16.67); // Нормализация к 60 FPS

    const defaultVelocity = { x: 0, y: -this.moveSpeed * normalizedDelta };

    if (keys?.left.isDown || this.shifting === 'left') {
      defaultVelocity.x = -this.moveSpeed * normalizedDelta;
    }

    if (keys?.right.isDown || this.shifting === 'right') {
      defaultVelocity.x = this.moveSpeed * normalizedDelta;
    }

    if (defaultVelocity.x === 0 && defaultVelocity.y === 0) {
      this.stopRun();
    }

    this.setVelocity(defaultVelocity.x, defaultVelocity.y);
  }

  shiftLeft() {
    this.shifting = 'left';
  }

  shiftRight() {
    this.shifting = 'right';
  }

  stopShifting() {
    this.shifting = null;
  }
}
