class Pickup extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.gameScene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.pickups.add(this);

    this.speed = 1;
    this.rotSpeed = 1;
  };

  preUpdate() {
    this.movePickup(this.speed, this.rotSpeed);
  };

  movePickup(speed, rotSpeed) {
    this.y += speed;
    this.angle += rotSpeed;
    if (this.y > config.height + 100) {
      this.destroyPickup();
    };
  };

  destroyPickup() {
    this.destroy();
  };
};