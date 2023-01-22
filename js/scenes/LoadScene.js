
class LoadScene extends Phaser.Scene {
  constructor() {
    super('loadScene');
  };

  preload() {
    // loading bar / text
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    // load background image
    this.load.image('background', 'assets/backgroundSpace.png');
    // load player images
    this.load.image('player', 'assets/player.png');
    this.load.image('playerLeft', 'assets/playerLeft.png');
    this.load.image('playerRight', 'assets/playerRight.png');
    this.load.image('playerShield', 'assets/shield.png');
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
    // load pickup images
    this.load.image('life', 'assets/life.png');
    this.load.image('shieldPickup', 'assets/shieldPickup.png');
    this.load.image('scorePickup', 'assets/scorePickup.png');
    // load audio
    this.load.audio('shoot', 'assets/audio/laserSound.mp3');
    this.load.audio('explodeAsteroid', 'assets/audio/asteroidExplode.wav');
    this.load.audio('explodePlayer', 'assets/audio/playerExplode.wav');
    this.load.audio('gameMusic', 'assets/audio/gameMusic.ogg');
    this.load.audio('menuMusic', 'assets/audio/menuMusic.ogg');
    this.load.audio('lifePickup', 'assets/audio/lifePickup.mp3');
    this.load.audio('shieldPickupSound', 'assets/audio/shieldPickup.wav');
    this.load.audio('shieldDestroySound', 'assets/audio/loseShield.wav');
    this.load.audio('scorePickupSound', 'assets/audio/scorePickup.ogg');

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      this.startGame();
    });
  };

  startGame() {
    this.scene.start('mainMenu');
  };
};