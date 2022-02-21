import { Trait } from "../Entity.js";

export default class Jump extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    super("jump");

    this.duration = 0.5; // ? The maximum time you can hold the jump key
    this.velocity = 200; // ? Velocity that the jump has
    this.engageTime = 0; // ? Is the jump currently engaged
  }

  start() {
    this.engageTime = this.duration;
  }
  
  cancel() {
    this.engageTime = 0;
  }

  update(entity, deltaTime) {
    if (this.engageTime > 0) {
      entity.vel.y = -this.velocity; // ? the velocity will be -200 on y for a maximum of 0.5s
      this.engageTime -= deltaTime;
    }
  }
}
