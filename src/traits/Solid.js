import { Sides, Trait } from "../Entity.js";

export default class Solid extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    super("solid");
    this.obstructs = true;
  }
  obstruct(entity, side, match) {
    if (!this.obstructs) return;

    // if (side === Sides.BOTTOM) {
    //   // ? if we collided with the ground
    //   entity.bounds.bottom = match.y1;
    //   entity.vel.y = 0;
    // } else if (side === Sides.TOP) {
    //   entity.bounds.top = match.y2;
    //   entity.vel.y = 0;
    // } else if (side === Sides.RIGHT) {
    //   // ? force mario's to no longer be inside the wall
    //   entity.bounds.right = match.x1;
    //   entity.vel.x = 0;
    // } else if (side === Sides.LEFT) {
    //   entity.bounds.left = match.x2;
    //   entity.vel.x = 0;
    // }

    switch (side) {
      case Sides.BOTTOM: {
        // ? if we collided with the ground
        entity.bounds.bottom = match.y1;
        entity.vel.y = 0;
        break;
      }
      case Sides.TOP: {
        // ? if we collided with the ceiling
        entity.bounds.top = match.y2;
        entity.vel.y = 0;
        break;
      }
      case Sides.RIGHT: {
        // ? force mario's to no longer be inside the wall
        entity.bounds.right = match.x1;
        entity.vel.x = 0;
        break;
      }
      case Sides.LEFT: {
        // ? force mario's to no longer be inside the wall
        entity.bounds.left = match.x2;
        entity.vel.x = 0;
        break;
      }
      default:
        break;
    }
  }
}
