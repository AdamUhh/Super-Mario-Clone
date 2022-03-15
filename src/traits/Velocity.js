import { Trait } from "../Entity.js";

export default class Velocity extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    super("velocity");
  }

  update(entity, { deltaTime }, level) {
    entity.pos.x += entity.vel.x * deltaTime;
    entity.pos.y += entity.vel.y * deltaTime;
  }
}
