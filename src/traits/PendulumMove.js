import { Sides, Trait } from "../Entity.js";

export default class PendulumMove extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    // ? this class is used on enemy entities (goomba, koopa) and is used to
    // ? invert their speed if they hit a wall
    // ? enemy entity heading is changed from ex:
    // ? ex: drawKoopa(context) inside /Koopa.js/ via this.vel.x < 0
    super("pendulumMove");

    this.enabled = true; // ? allow entity to move
    this.speed = -30; // ? default movement to the left
  }

  obstruct(entity, side) {
    // ? when an obstruction/'wall' is encounted, invert speed
    if (side === Sides.LEFT || side === Sides.RIGHT) {
      this.speed = -this.speed;
    }
  }

  update(entity) {
    // ? if pendulumMove is enabled, allow the entity to walk left/right
    if (this.enabled) {
      entity.vel.x = this.speed;
    }
  }
}
