import Entity, { Trait } from "../Entity";
import { loadSpriteSheet } from "../loaders/sprite";
import Gravity from "../traits/Gravity";
import Killable from "../traits/Killable";
import Velocity from "../traits/Velocity";

export function loadBullet() {
  return loadSpriteSheet("bullet").then(createBulletFactory);
}

class Behaviour extends Trait {
  constructor() {
    super("behaviour");
    this.gravity = new Gravity();
  }

  collides(us, them) {
    if (us.killable.dead) return;

    if (them.stomper) {
      // ? is mario falling on us
      if (them.vel.y > us.vel.y) {
        us.killable.kill();
        us.vel.set(100, -200); // ? make a jump animation in his shell
      } else {
        // ? bullet has killed mario (as mario collided with the side of bullet)
        them.killable.kill();
      }
    }
  }

  update(entity, gameContext, level) {
    if (entity.killable.dead) {
      // ? if mario stomped the bullet and killed it, add gravity
      this.gravity.update(entity, gameContext, level);
    }
  }
}

function createBulletFactory(bulletSprite) {
  function drawBullet(context) {
    bulletSprite.draw("bullet", context, 0, 0, this.vel.x < 0);
  }

  return function createBullet() {
    const bullet = new Entity();
    bullet.size.set(16, 14);
    // bullet.vel.set(80, 0);

    bullet.addTrait(new Velocity()); // ? Enemy entity specific characteristics
    bullet.addTrait(new Behaviour()); // ? Enemy entity specific characteristics
    bullet.addTrait(new Killable()); // ? To kill, or check if dead and revive
    bullet.draw = drawBullet;

    return bullet;
  };
}
