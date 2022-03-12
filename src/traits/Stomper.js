import { Trait } from "../Entity.js";

export default class Stomper extends Trait {
  constructor() {
    // ? Used to check if we are stomping on an enemy entity, and  if so, bounce mario

    super("stomper");
    this.bounceSpeed = 400;
  }

  bounce(us, them) {
    us.bounds.bottom = them.bounds.top;
    // ? make mario bounce after falling ontop of them
    us.vel.y = -this.bounceSpeed;
  }

  collides(us, them) {
    // ? if they are a killable entity or they are already dead
    if (!them.killable || them.killable.dead) {
      return;
    }

    // ? is mario is falling ontop of them
    if (us.vel.y > them.vel.y) {
      this.bounce(us, them);
      this.sounds.add("stomp");
      // Note: us, them is not needed. will change later
      this.events.emit("stomp", us, them); // ? if we stomp on something, call the 'stomp' function
    }
  }
}
