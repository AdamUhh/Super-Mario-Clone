import { Sides, Trait } from "../Entity.js";

export default class Jump extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    super("jump");

    // ? this.ready -> less than 0 = in air, 1 = on ground
    this.ready = 0; // ? can mario jump - NOTE: later change this to 'onGround'
    this.duration = 0.3; // ? The maximum time you can hold the jump key
    this.velocity = 200; // ? Velocity that the jump has
    this.engageTime = 0; // ? Is the jump currently engaged
    this.speedBoost = 0.3; // ? the faster mario runs, the bigger the jump

    this.requestTime = 0;
    this.gracePeriod = 0.1; // ? A time before you land where a button press will count as a jump
    // ? this.gracePeriod allows some leeway where if you didnt have this, you would have to perfectly time
    // ? the jump from when you land - by having gracePeriod, you can press the jump key again, 0.1s before
    // ? landing, and it will count as a jump
    // ? This essentially makes jumping a lot smoother
  }

  // ? having the get prefix on the method name allows you to
  // ? just write mario.jump.falling instead of mario.jump.falling()
  get falling() {
    // ? is mario in the air
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  obstruct(entity, side) {
    if (side === Sides.BOTTOM) {
      this.ready = 1;
    } else if (side === Sides.TOP) {
      this.cancel();
    }
  }

  update(entity, { deltaTime }) {
    // ? when you press the jump button, we will look for an opportunity to jump again?
    if (this.requestTime > 0) {
      // ? if mario is ready (on the 'bottom'/'ground')
      // ? allow mario to jump
      if (this.ready > 0) {
        this.engageTime = this.duration;
        this.requestTime = 0;
        entity.sounds.add("jump");
      }
      this.requestTime -= deltaTime;
    }
    if (this.engageTime > 0) {
      // ? Math.abs(entity.vel.x) * this.speedBoost means that the faster we run, the higher we will jump
      entity.vel.y = -(
        this.velocity +
        Math.abs(entity.vel.x) * this.speedBoost
      ); // ? the velocity will be -200 on y for a maximum of 0.5s
      this.engageTime -= deltaTime;
    }
    // ? if we update the Jump trait, ready is decremented
    this.ready--;
    // ? but once we have obstructed/checked bottom collision
    // ? when we call checkY inside /TileCollider.js/
    // ? it will be set to 1 again
    // ? then, when we decrement it again, it will be set to 0, of which,
    // ? there are no checks, as we are only checking for < 0
  }
}
