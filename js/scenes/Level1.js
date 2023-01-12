
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
    // load meteor images
    this.load.image('meteorSmall', 'assets/meteorSmall.png');
    this.load.image('meteorBig', 'assets/meteorBig.png');
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
    // create meteor group
    this.meteors = this.add.group({
      classType: [MeteorSml, MeteorLrg],
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
    // create initial meteors
    this.addMeteor();
    this.addMeteor();
    this.addMeteor();
    this.addMeteor();
    this.addMeteor();
    // create player
    this.addPlayer();
    // create player / meteor collision 
    this.physics.add.collider(this.player, this.meteors, (player, meteor) => {
      console.log('hit')
      meteor.body.disable = true;
      meteor.damageMeteor(false);
      player.damagePlayer();
      this.updateScore(-150);
    });
    // create laser / meteor collision
    this.physics.add.overlap(this.projectiles, this.meteors, (projectile, meteor) => {
      meteor.damageMeteor(true);
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

  // create new meteor
  addMeteor() {
    const randomFloat = Math.random();
    const randomX = Phaser.Math.Between(0, config.width);
    const randomY = Phaser.Math.Between(-100, -200);
    if (randomFloat < .5) {
      new MeteorSml(this, randomX, randomY);
    }
    else {
      new MeteorLrg(this, randomX, randomY);
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