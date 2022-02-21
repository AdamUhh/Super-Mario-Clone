import { Trait } from "../Entity.js";

export default class Velocity extends Trait {
  constructor() {
    // ? super references the constructor of Trait
    super("velocity");
  }
 

  update(entity, deltaTime) {
    entity.pos.x += entity.vel.x * deltaTime;
    entity.pos.y += entity.vel.y * deltaTime;
  }
}
