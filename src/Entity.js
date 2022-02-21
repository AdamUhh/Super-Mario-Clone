import { Vec2 } from "./math.js";

export class Trait {
  constructor(name) {
    // ? Trait is an instance of a class that can operate on an entity
    this.NAME = name;
  }

  update() {
    console.warn("Unhandled update call in trait");
  }
}

export default class Entity {
  constructor() {
    // ? An Entity in this case is any object that can be on the screen
    // ? that we can simulate things on/move around
    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);
    this.size = new Vec2(0, 0);

    this.traits = [];
  }

  addTrait(trait) {
    // ? Add trait to the trait array
    this.traits.push(trait);
    this[trait.NAME] = trait; // ? This allows us to set and allow ex: mario.JUMP.start(), get it?
    // ? This technique is called composition and allows us to create objects in smaller fragments
  }

  update(deltaTime) {
    // ? Will run an update on all the traits Mario has
    // ? ex: Go(), Jump(), etc
    this.traits.forEach((trait) => {
      trait.update(this, deltaTime);
    });
  }
}
