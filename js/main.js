const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 925,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: [TitleScreen, Level1]
};

const gameSettings = {
  playerSpeed: 300,
};

const game = new Phaser.Game(config);