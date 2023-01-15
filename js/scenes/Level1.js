
class Level1 extends Phaser.Scene {
  constructor() {
    super('level1')
  }

  preload() {
    // load background image
    this.load.image('background', 'assets/backgroundSpace.png');
    // load player images
    this.load.image('player', 'assets/player.png');
    this.load.image('playerLeft', 'assets/playerLeft.png');
    this.load.image('playerRight', 'assets/playerRight.png');
    // load asteroid images
    this.load.image('asteroidSmall', 'assets/asteroidSmall.png');
    this.load.image('asteroidBig', 'assets/asteroidBig.png');
    // load explosion spritesheet
    this.load.spritesheet('explosion', 'assets/spritesheets/explosion.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    // load laser image
    this.load.image('laser', 'assets/laserRed.png');
    // load life ship image
    this.load.image('life', 'assets/life.png');
  };

  create() {
    // add background image
    this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background').setOrigin(0, 0);
    // create score text
    this.score = 0;
    this.scoreText = this.add.text(16, 16, `Score : ${this.score}`, { fontFamily: 'Anton', fontSize: '40px', fill: '#4ad468' });
    this.scoreText.depth = 5;
    this.scoreText.setShadow(2, 2, 'white', 2);
    // create life images
    this.life1 = this.add.image(775, 40, 'life');
    this.life2 = this.add.image(725, 40, 'life');
    this.life3 = this.add.image(675, 40, 'life');
    this.lifeImages = [this.life1, this.life2, this.life3];
    this.playerLives = 3;
    // create input variables
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.cursors.space;
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    // create laser group
    this.projectiles = this.add.group({
      classType: Laser,
      maxSize: 10,
      runChildUpdate: true
    });
    // create asteroid group
    this.asteroids = this.add.group({
      classType: [AsteroidSml, AsteroidLrg],
      maxSize: 10,
      runChildUpdate: true
    });
    // create explosion animation
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion'),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });
    // create initial asteroids
    this.addAsteroid();
    this.addAsteroid();
    this.addAsteroid();
    this.addAsteroid();
    this.addAsteroid();
    // create player
    this.addPlayer();
    // create laser / asteroid collision
    this.physics.add.overlap(this.projectiles, this.asteroids, (projectile, asteroid) => {
      asteroid.damageAsteroid(true, false);
      projectile.destroyLaser();
    });
  };

  update() {
    // scroll background
    this.background.tilePositionY -= 0.75;
    // check for player fire
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.addLaser();
    };
    // check for pause button
    if (Phaser.Input.Keyboard.JustUp(this.escKey) && !this.scene.isPaused()) {
      this.scene.pause();
    };
  };

  // add player to the scene
  addPlayer() {
    this.player = new Player(this, 400, 860);
    this.player.depth = 5;
    // create player / asteroid collision 
    this.physics.add.overlap(this.player, this.asteroids, (player, asteroid) => {
      asteroid.damageAsteroid(false, true);
      this.cameras.main.shake(250, 0.02, true);
      player.damagePlayer();
      this.updateScore(-150);
    });
  };

  killPlayer() {
    // remove life
    this.playerLives--;
    // update life images
    this.updateLifeImages(this.playerLives);
    // destroy player
    this.player.destroyPlayer();
    // add delay & create new player
    if (this.playerLives >= 0) {
      this.time.addEvent({
        delay: 1000,
        callback: function () { this.addPlayer(); },
        callbackScope: this
      });
    };
    // if 0 lives left, game over
  };

  updateLifeImages(lives) {
    const color = '#000000';
    if (lives >= 3) {
      this.lifeImages.forEach(image => {
        image.clearTint();
      });
    } else if (lives === 2) {
      this.lifeImages[2].setTint(color);
    } else if (lives === 1) {
      this.lifeImages[1].setTint(color);
      this.lifeImages[2].setTint(color);
    } else {
      this.lifeImages.forEach(image => {
        image.setTint(color);
      });
    };
  };

  // create new asteroid
  addAsteroid() {
    const randomFloat = Math.random();
    const randomX = Phaser.Math.Between(0, config.width);
    const randomY = Phaser.Math.Between(-100, -200);
    if (randomFloat < .5) {
      new AsteroidSml(this, randomX, randomY);
    } else {
      new AsteroidLrg(this, randomX, randomY);
    };
  };

  // create new laser
  addLaser() {
    new Laser(this);
  };

  // update score on screen
  updateScore(numToAdd) {
    this.score += numToAdd;
    this.scoreText.setText(`Score : ${this.score}`);
  };
};