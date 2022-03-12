import { Trait } from "../Entity.js";

export default class Go extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    super("go");

    // ? direction is essentially whether mario is moving, ex: 1, 0, -1
    this.direction = 0; // ? Current direction of mario
    this.acceleration = 400; // ? Acceleration of Mario
    // ? Deceleration is required as when mario stops moving, he does not slow down fast enough
    // ? and sort of 'ice skates' in that direction forever
    this.deceleration = 300; // ? Determines how fast mario is stopping
    this.dragFactor = 1 / 5000; // ? Drag - The faster we run, the more resistance to running
    // ? used to decide which animation to set on mario
    // ? depending on how far he has gone
    this.distance = 0;
    // ? heading is essentially the direction mario is facing
    this.heading = 1; // ? 1 is right, -1 is left
  }

  update(entity, { deltaTime }) {
    const absX = Math.abs(entity.vel.x);

    if (this.direction !== 0) {
      // ? add velocity to the entity/mario over time
      entity.vel.x += this.acceleration * this.direction * deltaTime;

      // ? if mario is moving (which will automatically give him the Jump trait)
      if (entity.jump) {
        // ? check if mario is on the ground (in order to change the heading/direction mario is facing)
        if (!entity.jump.falling) {
          // change the direction that mario is facing
          this.heading = this.direction; // ? can be 1 or -1
        }
      } else {
        // ? set the direction that mario is facing
        this.heading = this.direction; // ? can be 1 or -1
      }
    } else if (entity.vel.x !== 0) {
      // ? Math.min is to never go past 0
      // ? so when we calculate how much we should brake, we dont want to go in the opposite direction
      // ? we make sure we never decrease/increase the horizontal speed with more htan would reach 0
      const decel = Math.min(absX, this.deceleration * deltaTime);
      entity.vel.x += entity.vel.x > 0 ? -decel : decel;
    } else {
      this.distance = 0;
    }

    const drag = this.dragFactor * entity.vel.x * absX;
    entity.vel.x -= drag;

    // ? distance of running over time
    this.distance += absX * deltaTime;
  }
}
