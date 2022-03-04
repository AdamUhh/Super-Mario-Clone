import { Sides, Trait } from "../Entity.js";

export default class PendulumWalk extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    // ? this class is used on enemy entities (goomba, koopa) and is used to
    // ? invert their speed if they hit a wall
    // ? enemy entity heading is changed from ex: 
    // ? ex: drawKoopa(context) inside /Koopa.js/ via this.vel.x < 0
    super("pendulumWalk");

    this.speed = -30;
  }

  obstruct(entity, side) {
    // ? when an obstruction/'wall' is encounted, invert speed
    if (side === Sides.LEFT || side === Sides.RIGHT) {
      this.speed = -this.speed;
    }
  }

  update(entity) {
    entity.vel.x = this.speed;
  }
}
