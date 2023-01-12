class Laser extends Phaser.GameObjects.Sprite {
  constructor(scene) {

    // player coords
    const x = scene.player.x;
    const y = scene.player.y;

    super(scene, x, y, 'laser');
    // add to scene
    scene.add.existing(this);
    // enable physics / move up
    scene.physics.add.existing(this);
    this.body.velocity.y = -650;

    // add beam to projectiles group
    scene.projectiles.add(this);
  };

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.y < -50) {
      this.destroy();
    };
  };

  destroyLaser() {
    this.destroy();
  };
};