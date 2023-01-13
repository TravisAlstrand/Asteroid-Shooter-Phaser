class AsteroidSml extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'asteroidSmall');
    this.gameScene = scene;
    // add to existing scene
    scene.add.existing(this);
    // add existing physics
    scene.physics.add.existing(this);

    // add beam to projectiles group
    scene.asteroids.add(this);

    this.speed = Phaser.Math.FloatBetween(1, 4);
    this.rotSpeed = Phaser.Math.FloatBetween(1, 3);
  };

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.moveAsteroid(this.speed, this.rotSpeed);
  };

  moveAsteroid(speed, rotSpeed) {
    // movement
    this.y += speed;
    // rotation
    this.angle += rotSpeed;
    // check if made it below screen
    if (this.y > config.height + 100) {
      this.destroyAsteroid(false);
    };
  };

  damageAsteroid(fromLaser, fromPlayerCollision) {
    if (fromLaser || fromPlayerCollision) {
      // play explosion
      const boom = this.gameScene.add.sprite(this.x, this.y, 'explosion');
      boom.play('explode');
      if (fromLaser) {
        this.destroyAsteroid(true);
      } else {
        this.destroyAsteroid(false);
      };
    };
  };

  destroyAsteroid(playerDestroyed) {
    if (playerDestroyed) {
      this.gameScene.updateScore(15);
    };
    // destroy & add new asteroid
    this.destroy();
    this.gameScene.addAsteroid();
  };
};