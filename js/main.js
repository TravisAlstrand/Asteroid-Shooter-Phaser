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
      debug: false
    }
  },
  scene: [TitleScreen, Level1]
};

const musicConfig = {
  mute: false,
  volume: 0,
  rate: 1,
  detune: 0,
  seek: 0,
  loop: true,
  delay: 0
};

const gameSettings = {
  playerSpeed: 300,
  backgroundSpeed: 0.75,
  asteroidSpeedLow: 1,
  asteroidSpeedHigh: 3
};

const game = new Phaser.Game(config);