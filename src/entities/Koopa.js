import Entity, { Trait } from "../Entity";
import { loadSpriteSheet } from "../loaders/sprite";
import Killable from "../traits/Killable";
import PendulumMove from "../traits/PendulumMove";
import Physics from "../traits/Physics";
import Solid from "../traits/Solid";

export function loadKoopa() {
  return loadSpriteSheet("koopa").then(createKoopaFactory);
}

const STATE_WALKING = Symbol("walking");
const STATE_HIDING = Symbol("hiding");
const STATE_PANIC = Symbol("panic");

class Behaviour extends Trait {
  constructor() {
    super("behaviour");

    this.state = STATE_WALKING;
    this.hideTime = 0;
    this.wakeDuration = 3;
    this.hideDuration = 5;
    this.walkSpeed = null;
    this.panicSpeed = 300;
  }

  collides(us, them) {
    // ? collides is run every update, inside /Level.js/ -> this.entityCollider.check(entity);
    // ? which goes to /Entity.js/ -> loop collides(this, candidate) -> to this collides(us, them)

    if (us.killable.dead) return;

    // ? if the entity collides with another entity that has the class Stomper()
    // ? essentially, if the goomba collides with mario (since mario has class Stomper())
    // ? this is called Feature Detection - decisions are made on whether the object CAN and not what the object is
    // ? essentially, you wont need to do something like them === mario ;p
    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        // ? is mario falling on us
        this.handleStomp(us, them);
      } else {
        // ? else if mario collides with us on the side (left/right)
        this.handleNudge(us, them);
      }
    }
  }

  handleNudge(us, them) {
    if (this.state === STATE_WALKING) {
      // ? if mario collides with us on the side while we are walking
      them.killable.kill();
    } else if (this.state === STATE_HIDING) {
      // ? if mario collides with us on the side while we are hiding
      this.panic(us, them);
    } else if (this.state === STATE_PANIC) {
      // ? if mario collides with us on the side while we are panicking
      const travelDir = Math.sign(us.vel.x); // ? direction of koopa and whether he is going forwards or backwards
      const impactDir = Math.sign(us.pos.x - them.pos.x); // ? what side koopa was hit from (by mario)

      // ? if koopa is moving (prevents mario from dying when koopa is not moving while in shell)
      // ? and basically if koopa is going towards mario
      // ? to be honest, im not exactly sure how this works
      if (travelDir !== 0 && travelDir !== impactDir) {
        them.killable.kill();
      }
    }
  }

  handleStomp(us, them) {
    if (this.state === STATE_WALKING) {
      // ? if koopa is stomped while walking
      this.hide(us);
    } else if (this.state === STATE_HIDING) {
      // ? if koopa is stomped while hiding in his shell

      us.killable.kill(); // ? remove/kill koopa after few seconds (default is 2)
      us.vel.set(100, -200); // ? make a jump animation in his shell
      us.solid.obstructs = false; // ? make koopa no longer collidable
      // ? since koopa would no longer be collidable and we set the velocity so he 'bounces'
      // ? koopa will bounce out of the screen, before being removed from the level
    } else if (this.state === STATE_PANIC) {
      // ? if koopa is stomped while panicking (koopa will stop moving)
      this.hide(us);
    }
  }

  panic(us, them) {
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x); // ? makes koopa faster than normal
    this.state = STATE_PANIC;
  }

  hide(us) {
    us.vel.x = 0;
    us.pendulumMove.enabled = false; // ? stop moving

    if (this.walkSpeed === null) {
      // ? used when unhiding
      this.walkSpeed = us.pendulumMove.speed;
    }

    this.hideTime = 0;
    this.state = STATE_HIDING;
  }

  unhide(us) {
    us.pendulumMove.enabled = true; // ? allow entity to move
    us.pendulumMove.speed = this.walkSpeed; // ? essentially, this sets a standard speed (no need for random manual values, but instead only the value inside PendulumMove().speed
    this.state = STATE_WALKING;
  }

  update(us, { deltaTime }) {
    // ? if koopa is currently hiding in his shell
    if (this.state === STATE_HIDING) {
      this.hideTime += deltaTime;
      // ? if koopa has been hiding for long enough
      if (this.hideTime > this.hideDuration) {
        // make him walk again
        this.unhide(us);
      }
    }
  }
}

function createKoopaFactory(koopaSprite) {
  // ? koopaSprite.animations is resolveFrame(distance) due to defineAnim in /SpriteSheet.js/
  const walkAnim = koopaSprite.animations.get("walk");
  const wakeAnim = koopaSprite.animations.get("wake");

  function routeAnim(koopa) {
    // ? if koopa is hiding
    if (koopa.behaviour.state === STATE_HIDING) {
      // ? if koopa has been hiding for enough time
      if (koopa.behaviour.hideTime > koopa.behaviour.wakeDuration) {
        // ? start waking koopa up
        return wakeAnim(koopa.behaviour.hideTime);
      }
      return "hiding";
    }

    // ? if koopa is panicking
    if (koopa.behaviour.state === STATE_PANIC) {
      return "hiding";
    }

    // ? default walking animation
    // ? this.lifetime (deltaTime) is used as the distance for walkAnim
    return walkAnim(koopa.lifetime);
  }

  function drawKoopa(context) {
    // ? using walkAnim, we are returning the name of the animation and drawing it
    koopaSprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0);
    // ? this.vel.x < 0 is to flip (heading) depending on entity direction
  }

  return function createKoopa() {
    const koopa = new Entity();
    koopa.size.set(16, 16);
    koopa.offset.y = 8;
    // ? the koopa image tile is 16x24, and if we kept this value (24), then
    // ? our collision box will be 16x24, which means that koopa wouldnt be able
    // ? to go under a tunnel, as he is too tall - therefore, we set the size to 16x16
    // ? and offset the image tile by 8 (24-16=8), which corrects the tile image
    // ? while also making the collision box of koopa 16x16

    koopa.addTrait(new Physics()); // ? Move the entity, add gravity and check if colliding
    koopa.addTrait(new Solid()); // ? If something is colliding, stop the collision
    koopa.addTrait(new PendulumMove()); // ? entity movement (left and right)
    koopa.addTrait(new Behaviour()); // ? Enemy entity specific characteristics
    koopa.addTrait(new Killable()); // ? To kill, or check if dead and revive

    koopa.draw = drawKoopa;

    return koopa;
  };
}
