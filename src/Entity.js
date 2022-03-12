import AudioBoard from "./AudioBoard.js";
import BoundingBox from "./BoundingBox.js";
import EventEmitter from "./EventEmitter.js";
import { Vec2 } from "./math.js";

export const Sides = {
  // ? a symbol is a unique marker in the code
  // ? its a unique memory location that the program assigns that you can only compare to
  // ? if you know the memory address location
  // ? the name 'top'/'bottom' has nothing to do with the behaviour of the symbol
  // ? 'top'/'bottom' is only the description
  TOP: Symbol("top"),
  BOTTOM: Symbol("bottom"),
  RIGHT: Symbol("right"),
  LEFT: Symbol("left"),
};

export class Trait {
  constructor(name) {
    // ? Trait is an instance of a class that can operate on an entity
    this.NAME = name;
    this.events = new EventEmitter();
    this.sounds = new Set();
    this.tasks = [];
  }

  queue(task) {
    // ? task is a callback that is pushed into the tasks array
    this.tasks.push(task);
  }

  finalize() {
    // ? process all the tasks
    this.tasks.forEach((task) => task());
    this.tasks.length = 0; // ? this is the equivalent of deleting all the tasks (after running all of them)
  }

  collides() {}

  obstruct() {}

  playSounds(audioBoard, audioContext) {
    // ? remember, sounds can only play if this.sounds has any elements
    this.sounds.forEach((name) => {
      audioBoard.playAudio(name, audioContext);
    });
    this.sounds.clear();
  }

  update() {}
}

export default class Entity {
  constructor() {
    // ? An Entity in this case is any object that can be on the screen
    // ? that we can simulate things on/move around
    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);
    this.size = new Vec2(0, 0);
    this.offset = new Vec2(0, 0); // ? a value to offset the tile image of an entity (used for koopa since tile image is too tall, making him clip through the floor)
    this.bounds = new BoundingBox(this.pos, this.size, this.offset); // ? simplify the entity boundaries (top, bottom, left, right)
    this.lifetime = 0;
    this.canCollide = true;
    this.traits = [];
    this.audio = new AudioBoard();
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

  collides(candidate) {
    this.traits.forEach((trait) => {
      // ? this is inside /Mario.js/->Stomper() or /Goomba.js/->Behaviour(), etc
      trait.collides(this, candidate);
    });
  }
  draw() {}

  finalize() {
    this.traits.forEach((trait) => {
      trait.finalize();
    });
  }

  obstruct(side, match) {
    // ? used to only allow mario to jump if he is touching the side/'bottom'/'ground'
    // ? Will run an obstruct on all the traits Mario has
    // ? in this case, its for calling the obstruct function inside Jump()
    this.traits.forEach((trait) => {
      trait.obstruct(this, side, match);
    });
  }

  update(gameContext, level) {
    // ? Will run an update on all the traits mario or goomba,etc. has
    // ? ex: Go(), Jump(), PendulumMove(), etc.
    this.traits.forEach((trait) => {
      trait.update(this, gameContext, level);
      trait.playSounds(this.audio, gameContext.audioContext);
    });

    this.lifetime += gameContext.deltaTime;
  }
}
