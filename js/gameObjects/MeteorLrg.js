class MeteorLrg extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'meteorBig');
    this.gameScene = scene;
    // add to existing scene
    scene.add.existing(this);
    // add existing physics
    scene.physics.add.existing(this);
    // add beam to projectiles group
    scene.meteors.add(this);

    this.health = 3;
    this.speed = Phaser.Math.FloatBetween(1, 2.5);
    this.rotSpeed = Phaser.Math.FloatBetween(1, 3);
  };

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.moveMeteor(this.speed, this.rotSpeed);
  };

  moveMeteor(speed, rotSpeed) {
    // movement
    this.y += speed;
    // rotation
    this.angle -= rotSpeed;
    // check if made it below screen
    if (this.y > config.height + 100) {
      this.destroyMeteor(false);
    };
  };

  damageMeteor(fromLaser) {
    if (fromLaser) {
      this.health--;
      this.gameScene.updateScore(5);
      if (this.health <= 0) {
        // play explosion
        const boom = this.gameScene.add.sprite(this.x, this.y, 'explosion');
        boom.play('explode');
        this.destroyMeteor(true);
      };
    } else {
      this.destroyMeteor(false);
    };
  };

  destroyMeteor(playerDestroyed) {
    if (playerDestroyed) {
      this.gameScene.updateScore(15);
    };
    // destroy & add new meteor
    this.destroy();
    this.gameScene.addMeteor();
  };
};