import { Entity } from './entitiy';

export class Player extends Entity {
  textureKey: string;
  private moveSpeed = 100;

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

  update(delta: number): void {
    this.play('up', true);

    const keys = this.scene.input.keyboard?.createCursorKeys();

    const velocity = { x: 0, y: -delta * this.moveSpeed };

    if (keys?.left.isDown) {
      velocity.x = -delta * this.moveSpeed;
    }

    if (keys?.right.isDown) {
      velocity.x = delta * this.moveSpeed;
    }

    if (velocity.x === 0 && velocity.y === 0) {
      this.stop();
      this.setFrame(0);
    }

    this.setVelocity(velocity.x, velocity.y);
  }
}
