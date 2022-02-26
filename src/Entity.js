import { Vec2 } from "./math.js";

export const Sides = {
  // ? a symbol is a unique marker in the code
  // ? its a unique memory location that the program assigns that you can only compare to
  // ? if you know the memory address location
  // ? the name 'top'/'bottom' has nothing to do with the behaviour of the symbol
  // ? 'top'/'bottom' is only the description
  TOP: Symbol("top"),
  BOTTOM: Symbol("bottom"),
};

export class Trait {
  constructor(name) {
    // ? Trait is an instance of a class that can operate on an entity
    this.NAME = name;
  }

  obstruct() {}

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
    // ? trait will contain the above Trait class as well as Go() and Jump(), etc.
    // ? ex: { NAME: "go", acceleration: 400, direciton: 0, etc... }
    // ? Add trait to the trait array
    this.traits.push(trait);
    // ? 'this' is the Entity/mario
    this[trait.NAME] = trait; // ? This allows us to set and allow ex: mario.JUMP.start(), get it?
    // ? This technique is called composition and allows us to create objects in smaller fragments
  }

  obstruct(side) {
    // ? used to only allow mario to jump if he is touching the side/'bottom'/'ground'
    // ? Will run an obstruct on all the traits Mario has
    // ? in this case, its for calling the obstruct function inside Jump()
    this.traits.forEach((trait) => {
      trait.obstruct(this, side);
    });
  }

  update(deltaTime) {
    // ? Will run an update on all the traits Mario has
    // ? ex: Go(), Jump(), etc.
    this.traits.forEach((trait) => {
      trait.update(this, deltaTime);
    });
  }
}
