import { Trait } from "../Entity.js";

export default class Go extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    super("go");

    // ? direction is essentially whether mario is moving, ex: 1, 0, -1
    this.direction = 0; // ? Current direction of mario
    this.speed = 10000; // ? Speed of Mario

    // ? used to decide which animation to set on mario
    // ? depending on how far he has gone
    this.distance = 0;
    // ? heading is essentially the direction mario is facing
    this.heading = 1; // ? 1 is right, -1 is left
  }

  update(entity, deltaTime) {
    // ? add velocity to the entity/mario
    entity.vel.x = this.speed * this.direction * deltaTime;

    if (this.direction) {
      // ? set the direction that mario is facing
      this.heading = this.direction; // ? can be 1 or -1
      // ? distance of running over time
      this.distance += Math.abs(entity.vel.x * deltaTime);
    } else {
      this.distance = 0;
    }
  }
}
