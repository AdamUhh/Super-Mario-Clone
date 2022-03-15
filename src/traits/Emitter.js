import { Trait } from "../Entity.js";

export default class Emitter extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    super("emitter");
    this.interval = 2;
    this.coolDown = this.interval;
    this.emitters = []; // ? functions that are fired depending on the cooldown
  }

  emit(entity, level) {
    // ? run the functions inside the emitters array
    for (const emitter of this.emitters) {
      emitter(entity, level);
    }
  }

  update(entity, { deltaTime }, level) {
    this.coolDown -= deltaTime;

    if (this.coolDown <= 0) {
      this.emit(entity, level);
      this.coolDown = this.interval;
    }
  }
}
