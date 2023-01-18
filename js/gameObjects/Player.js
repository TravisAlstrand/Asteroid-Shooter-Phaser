class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    this.gameScene = scene;
    // add to existing scene
    scene.add.existing(this);
    // add existing physics to player
    scene.physics.add.existing(this);
    // confine player to world bounds
    this.body.setCollideWorldBounds(true);
    // retrieve input from scene
    this.keys = scene.cursors;
    this.aKey = scene.aKey;
    this.dKey = scene.dKey;

    this.setScale(0.75);
    this.health = 3;
  };

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.movePlayer();
  };

  movePlayer() {
    if (this.keys.left.isDown || this.aKey.isDown) {
      // move player left / set image
      this.body.setVelocityX(-gameSettings.playerSpeed);
      this.setTexture('playerLeft');
    } else if (this.keys.right.isDown || this.dKey.isDown) {
      // move player right / set image
      this.body.setVelocityX(gameSettings.playerSpeed);
      this.setTexture('playerRight');
    } else {
      // stop movement 
      this.body.setVelocityX(0);
      this.setTexture('player');
    };
  };

  damagePlayer() {
    this.health--;
    this.gameScene.explodeAsteroidSound.play();
    this.alpha = 0.5;
    this.gameScene.time.addEvent({
      delay: 1500,
      callback: function () { this.alpha = 1; },
      callbackScope: this
    });
    if (this.health > 1) {
      this.flashColor(0xFF0000);
    } else if (this.health === 1) {
      this.setTint(0xFF0000)
      this.gameScene.time.addEvent({
        delay: 1000,
        callback: function () { this.setTint(0xFF0000); },
        callbackScope: this
      });
    } else {
      this.gameScene.killPlayer();
    };
  };

  flashColor(color) {
    this.setTint(color);
    this.gameScene.time.addEvent({
      delay: 1000,
      callback: function () { this.clearTint(); },
      callbackScope: this
    });
  };

  destroyPlayer() {
    // play explosion
    this.gameScene.explodePlayerSound.play();
    const boom = this.gameScene.add.sprite(this.x, this.y, 'explosion');
    boom.setScale(4);
    boom.play('explode');
    this.destroy();
  };
};
