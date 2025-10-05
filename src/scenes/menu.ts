export class Menu extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    // Загружаем фоновое изображение если есть
    // this.load.image('menu-bg', '/assets/images/menu-bg.png');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Создаем фон
    this.add.rectangle(width / 2, height / 2, width, height, 0x2c3e50);

    // Заголовок игры
    const title = this.add.text(width / 2, height / 3, 'HACKATON GAME', {
      fontSize: '48px',
      color: '#ecf0f1',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5);

    // Подзаголовок
    const subtitle = this.add.text(
      width / 2,
      height / 3 + 60,
      'Endless Runner',
      {
        fontSize: '24px',
        color: '#bdc3c7',
        fontFamily: 'Arial, sans-serif',
      }
    );
    subtitle.setOrigin(0.5);

    // Кнопка Start
    const startButton = this.add.rectangle(
      width / 2,
      height / 2 + 50,
      200,
      60,
      0x27ae60
    );
    startButton.setStrokeStyle(2, 0x2ecc71);
    startButton.setInteractive({ useHandCursor: true });

    const startText = this.add.text(width / 2, height / 2 + 50, 'START', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold',
    });
    startText.setOrigin(0.5);

    // Анимация кнопки при наведении
    startButton.on('pointerover', () => {
      startButton.setFillStyle(0x2ecc71);
      startButton.setScale(1.05);
    });

    startButton.on('pointerout', () => {
      startButton.setFillStyle(0x27ae60);
      startButton.setScale(1);
    });

    // Обработчик клика
    startButton.on('pointerdown', () => {
      startButton.setFillStyle(0x229954);
      startButton.setScale(0.95);
    });

    startButton.on('pointerup', () => {
      startButton.setFillStyle(0x27ae60);
      startButton.setScale(1);
      this.startGame();
    });

    // Инструкции
    const instructions = this.add.text(
      width / 2,
      height - 100,
      'Use ← → arrow keys or touch buttons to move\nCollect coins and avoid obstacles!',
      {
        fontSize: '16px',
        color: '#95a5a6',
        fontFamily: 'Arial, sans-serif',
        align: 'center',
      }
    );
    instructions.setOrigin(0.5);

    // Анимация заголовка
    this.tweens.add({
      targets: title,
      y: title.y - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private startGame() {
    // Переход к игровой сцене
    this.scene.start('TrackScene');
  }
}
