import { Trait } from "../Entity.js";

export default class Gravity extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    super("gravity");
  }

  update(entity, { deltaTime }, level) {
    // ? Simulate Gravity
    entity.vel.y += level.gravity * deltaTime;
  }
}
