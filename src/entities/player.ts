import { Entity } from './entitiy';

export class Player extends Entity {
  textureKey: string;
  private moveSpeed = 50;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    const anims = this.scene.anims;
    const animsFrameRate = 9;
    this.textureKey = texture;

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

    const velocity = { x: 0, y: -this.moveSpeed * normalizedDelta };

    if (keys?.left.isDown) {
      velocity.x = -this.moveSpeed * normalizedDelta;
    }

    if (keys?.right.isDown) {
      velocity.x = this.moveSpeed * normalizedDelta;
    }

    if (velocity.x === 0 && velocity.y === 0) {
      this.stopRun();
    }

    this.setVelocity(velocity.x, velocity.y);
  }
}
