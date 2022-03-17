import Entity, { Trait } from "../Entity";
import { loadSpriteSheet } from "../loaders/sprite";
import Killable from "../traits/Killable";
import PendulumMove from "../traits/PendulumMove";
import Physics from "../traits/Physics";
import Solid from "../traits/Solid";

export function loadGoomba() {
  return loadSpriteSheet("goomba").then(createGoombaFactory);
}

class Behaviour extends Trait {
  constructor() {
    super("behaviour");
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
      // ? is mario falling on us
      if (them.vel.y > us.vel.y) {
        us.killable.kill();
        us.pendulumMove.speed = 0; // ? can also be us.pendulumMove.enabled = false
      } else {
        // ? goomba has killed mario (as mario collided with the side of goomba)
        them.killable.kill();
      }
    }
  }
}

function createGoombaFactory(goombaSprite) {
  // ? goombaSprite.animations is resolveFrame(distance) inside /anim.js/ due to defineAnim in /SpriteSheet.js/
  const walkAnim = goombaSprite.animations.get("walk");

  function routeAnim(goomba) {
    if (goomba.killable.dead) {
      return "flat";
    }

    // ? this.lifetime (deltaTime) is used as the distance for walkAnim
    // ? using walkAnim, we are returning the name of the animation and drawing it
    return walkAnim(goomba.lifetime);
  }

  function drawGoomba(context) {
    goombaSprite.draw(routeAnim(this), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();
    goomba.size.set(16, 16);

    goomba.addTrait(new Physics()); // ? Move the entity, add gravity and check if colliding
    goomba.addTrait(new Solid()); // ? If something is colliding, stop the collision
    goomba.addTrait(new PendulumMove()); // ? entity movement (left and right)
    goomba.addTrait(new Behaviour()); // ? Enemy entity specific characteristics
    goomba.addTrait(new Killable()); // ? To kill, or check if dead and revive
    goomba.draw = drawGoomba;

    return goomba;
  };
}
