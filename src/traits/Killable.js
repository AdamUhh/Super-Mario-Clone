import { Trait } from "../Entity.js";

export default class Killable extends Trait {
  constructor() {
    super("killable");

    this.dead = false;
    this.deadTime = 0;
    this.removeAfter = 2; // ? how many seconds until we delete the entity from the scene
  }

  kill() {
    this.queue(() => (this.dead = true));
  }

  revive() {
    this.dead = false;
    this.deadTime = 0;
  }

  update(entity, { deltaTime }, level) {
    // ? if the entity is dead
    if (this.dead) {
      this.deadTime += deltaTime;

      if (this.deadTime > this.removeAfter) {
        this.queue(() => {
          level.entities.delete(entity);
        });
      }
    }
  }
}
