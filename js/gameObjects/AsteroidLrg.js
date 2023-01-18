class AsteroidLrg extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'asteroidBig');
    this.gameScene = scene;
    // add to existing scene
    scene.add.existing(this);
    // add existing physics
    scene.physics.add.existing(this);
    // add beam to projectiles group
    scene.asteroids.add(this);

    this.health = 3;
    this.speed = Phaser.Math.FloatBetween(gameSettings.asteroidSpeedLow, gameSettings.asteroidSpeedHigh);
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
    this.angle -= rotSpeed;
    // check if made it below screen
    if (this.y > config.height + 100) {
      this.destroyAsteroid(false);
    };
  };

  damageAsteroid(fromLaser, fromPlayerCollision) {
    if (fromLaser) {
      this.health--;
      if (this.health === 2) {
        this.setTexture('asteroidBig-2');
      } else if (this.health === 1) {
        this.setTexture('asteroidBig-3');
      };
      this.gameScene.updateScore(5);
    };
    if (this.health <= 0 || fromPlayerCollision) {
      // play explosion
      const boom = this.gameScene.add.sprite(this.x, this.y, 'explosion');
      boom.setScale(2.5);
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
      this.gameScene.explodeAsteroidSound.play();
    };
    // destroy & add new asteroid
    this.destroy();
    this.gameScene.addAsteroid();
  };
};