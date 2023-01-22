class MainMenu extends Phaser.Scene {
  constructor() {
    super('mainMenu');
  };

  create() {
    const gameTitleText = this.add.text(400, 200, 'PEW PEW PEW!', { fontFamily: 'Anton', fontSize: '80px', fill: '#4ad468' });
    gameTitleText.setOrigin(0.5, 0.5);
    gameTitleText.setShadow(2, 2, 'white', 2)

    this.music = this.sound.add('menuMusic');
    this.music.play(musicConfig);

    const controlsHeader = this.add.text(400, 400, 'CONTROLS', { fontFamily: 'Anton', fontSize: '50px', fill: '#ffffff' })
    controlsHeader.setOrigin(0.5, 0.5);
    controlsHeader.setShadow(2, 2, '#8934eb', 2);

    const moveLeftText = this.add.text(400, 500, 'MOVE LEFT: A or LEFTARROW', { fontFamily: 'Anton', fontSize: '30px', fill: '#ffffff' })
    moveLeftText.setOrigin(0.5, 0.5);
    moveLeftText.setShadow(2, 2, '#8934eb', 2);
    const moveRightText = this.add.text(400, 550, 'MOVE RIGHT: D or RIGHTARROW', { fontFamily: 'Anton', fontSize: '30px', fill: '#ffffff' })
    moveRightText.setOrigin(0.5, 0.5);
    moveRightText.setShadow(2, 2, '#8934eb', 2);
    const shootText = this.add.text(400, 600, 'PEW PEW: ENTER or SPACE', { fontFamily: 'Anton', fontSize: '30px', fill: '#ffffff' })
    shootText.setOrigin(0.5, 0.5);
    shootText.setShadow(2, 2, '#8934eb', 2);

    const startText = this.add.text(400, 800, 'PRESS ENTER TO START', { fontFamily: 'Anton', fontSize: '50px', fill: '#4ad468' })
    startText.setOrigin(0.5, 0.5);
    startText.setShadow(2, 2, 'white', 2);

    this.ship = this.add.image(400, 700, 'life');

    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  };

  update() {
    this.ship.angle += 1;
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.music.stop();
      this.scene.start('level1');
    };
  };
};