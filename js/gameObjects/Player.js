class Player extends Phaser.GameObjects.Sprite {
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
    console.log(`Player Health: ${this.health}`);
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
    // console.log(`Player Health: ${this.health}`);
  };
};
