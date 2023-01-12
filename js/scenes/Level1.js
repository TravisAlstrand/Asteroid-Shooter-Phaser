
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
  };

  create() {
    // add background image
    this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background').setOrigin(0, 0);
    // create score text
    this.score = 0;
    this.scoreText = this.add.text(16, 16, `Score : ${this.score}`, { fontFamily: 'Anton', fontSize: '40px', fill: '#4ad468' });
    this.scoreText.depth = 5;
    this.scoreText.setShadow(2, 2, 'white', 2)
    // create input variables
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.cursors.space;
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
    // create player / asteroid collision 
    this.physics.add.collider(this.player, this.asteroids, (player, asteroid) => {
      console.log('hit')
      asteroid.body.disable = true;
      asteroid.damageAsteroid(false);
      player.damagePlayer();
      this.updateScore(-150);
    });
    // create laser / asteroid collision
    this.physics.add.overlap(this.projectiles, this.asteroids, (projectile, asteroid) => {
      asteroid.damageAsteroid(true);
      projectile.destroyLaser();
    });
  };

  update() {
    // scroll background
    this.background.tilePositionY -= 0.75;
    // check for player fire
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.addLaser();
    };
  };

  // add player to the scene
  addPlayer() {
    this.player = new Player(this, 400, 825);
  };

  // create new asteroid
  addAsteroid() {
    const randomFloat = Math.random();
    const randomX = Phaser.Math.Between(0, config.width);
    const randomY = Phaser.Math.Between(-100, -200);
    if (randomFloat < .5) {
      new AsteroidSml(this, randomX, randomY);
    }
    else {
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