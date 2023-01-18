
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
    this.load.image('asteroidBig-2', 'assets/asteroidBig-2.png');
    this.load.image('asteroidBig-3', 'assets/asteroidBig-3.png');
    // load explosion spritesheet
    this.load.spritesheet('explosion', 'assets/spritesheets/explosion.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    // load laser image
    this.load.image('laser', 'assets/laserRed.png');
    // load life ship image
    this.load.image('life', 'assets/life.png');
    // load audio
    this.load.audio('shoot', 'assets/audio/laserSound.mp3');
    this.load.audio('explodeAsteroid', 'assets/audio/asteroidExplode.wav');
    this.load.audio('explodePlayer', 'assets/audio/playerExplode.wav');
    this.load.audio('gameMusic', 'assets/audio/gameMusic.ogg');
  };

  create() {
    this.music = this.sound.add('gameMusic');
    this.music.play(musicConfig);
    // add sfx
    this.laserSound = this.sound.add('shoot');
    this.explodeAsteroidSound = this.sound.add('explodeAsteroid');
    this.explodePlayerSound = this.sound.add('explodePlayer');
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
    this.lifeImages.forEach(image => {
      image.depth = 5;
    });
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
    // create player
    this.addPlayer();
    // start countdown attempt
    this.initialTime = 3;
    this.countdownText = this.add.text(400, 462.5, this.initialTime.toString(), { fontFamily: 'Anton', fontSize: '80px', fill: '#4ad468' });
    this.countdownText.setOrigin(0.5, 0.5);
    this.countdownText.depth = 5;
    this.countdownText.setShadow(2, 2, 'white', 2);
    this.countdown = this.time.addEvent({
      delay: 1000,
      callback: this.updateCountdown,
      callbackScope: this,
      repeat: 3
    });

    // create laser / asteroid collision
    this.physics.add.overlap(this.projectiles, this.asteroids, (projectile, asteroid) => {
      asteroid.damageAsteroid(true, false);
      projectile.destroyLaser();
    });
  };

  update(time) {
    // scroll background
    this.background.tilePositionY -= gameSettings.backgroundSpeed;
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
    // start below screen
    this.player = new Player(this, 400, 950);
    this.player.alpha = 0.5;
    this.player.depth = 5;
    // create player / asteroid collision 
    this.physics.add.overlap(this.player, this.asteroids, (player, asteroid) => {
      asteroid.damageAsteroid(false, true);
      if (this.player.alpha === 1) {
        this.cameras.main.shake(250, 0.02, true);
        player.damagePlayer();
        this.updateScore(-150);
      };
    });
    this.tweens.add({
      targets: this.player,
      y: config.height - 65,
      ease: 'Power1',
      duration: 2000,
      repeat: 0,
      onComplete: () => {
        this.player.alpha = 1;
      },
      callbackScope: this
    });
  };

  updateCountdown() {
    if (this.initialTime === 0) {
      this.countdownText.setVisible(false);
      this.addInitialAsteroids();
      this.startSpeedChangerLoop();
    } else {
      this.initialTime--;
      this.countdownText.setText(this.initialTime.toString());
    };
  };

  killPlayer() {
    // remove life
    this.playerLives--;
    // update life images
    this.updateLifeImages(this.playerLives);
    // destroy player
    this.player.destroyPlayer();
    // add delay & create new player
    if (this.playerLives > 0) {
      this.time.addEvent({
        delay: 1000,
        callback: function () { this.addPlayer(); },
        callbackScope: this
      });
    } else {
      this.showTempGameOver();
    };
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

  addInitialAsteroids() {
    this.time.addEvent({
      delay: 2000,
      callback: () => { this.addAsteroid(); },
      callbackScope: this,
      repeat: 4
    });
  };

  // create new asteroid
  addAsteroid() {
    const randomFloat = Math.random();
    const randomX = Phaser.Math.Between(25, config.width - 25);
    const randomY = Phaser.Math.Between(-100, -200);
    if (randomFloat < .5) {
      new AsteroidSml(this, randomX, randomY);
    } else {
      new AsteroidLrg(this, randomX, randomY);
    };
  };

  startSpeedChangerLoop() {
    console.log('loop called')
    this.time.addEvent({
      delay: 30000,
      callback: function () { this.speedUp(); },
      callbackScope: this,
      loop: true
    });
  };

  // create new laser
  addLaser() {
    if (this.player.active) {
      new Laser(this);
      this.laserSound.play();
    };
  };

  // update score on screen
  updateScore(numToAdd) {
    this.score += numToAdd;
    if (this.score < 0) {
      this.score = 0;
    };
    this.scoreText.setText(`Score : ${this.score}`);
  };

  showTempGameOver() {
    this.gameOverText = this.add.text(400, 462.5, 'GAME OVER', { fontFamily: 'Anton', fontSize: '80px', fill: '#4ad468' });
    this.gameOverText.setOrigin(0.5, 0.5);
    this.gameOverText.depth = 5;
    this.gameOverText.setShadow(2, 2, 'white', 2);
  };

  speedUp() {
    gameSettings.backgroundSpeed = gameSettings.backgroundSpeed + .5;
    gameSettings.asteroidSpeedLow = gameSettings.asteroidSpeedLow + 1;
    gameSettings.asteroidSpeedHigh = gameSettings.asteroidSpeedHigh + 1;
    console.log(`${gameSettings.asteroidSpeedHigh}`);
  };
};