
class TitleScreen extends Phaser.Scene {
  constructor() {
    super('titleScreen');
  };

  create() {
    this.add.text(400, 425, "Space Shooter!", { font: '25px Arial', fill: 'red' }).setOrigin(0.5, 0.5);
    this.scene.start('level1')
  };
};