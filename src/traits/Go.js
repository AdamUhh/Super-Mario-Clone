import { Trait } from "../Entity.js";

export default class Go extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    super("go");

    this.direction = 0; // ? Current direction of mario
    this.speed = 10000; // ? Speed of Mario
  }

  update(entity, deltaTime) {
    // ? add velocity to the entity/mario
    entity.vel.x = this.speed * this.direction * deltaTime;
  }
}
