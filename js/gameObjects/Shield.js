class Shield extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'playerShield');
    this.gameScene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.shields.add(this);

    this.player = this.gameScene.player;
    this.health = 2;
    this.tint = 0x4ad468;
  };

  preUpdate() {
    this.moveShield();
  };

  moveShield() {
    this.x = this.player.x;
  };

  damageShield() {
    this.health--;
    this.tint = 0xFF0000;
    if (this.health <= 0) {
      this.destroyShield(true);
    };
  };

  destroyShield(fromAsteroid) {
    if (fromAsteroid) {
      this.gameScene.loseShieldSound.play();
    };
    this.destroy();
    this.player.hasShield = false;
  };
};