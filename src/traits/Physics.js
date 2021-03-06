import { Trait } from "../Entity.js";

export default class Physics extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    super("physics");
  }

  update(entity, gameContext, level) {
    const { deltaTime } = gameContext;
    // ? if ex: mario has any velocity from Go() (or ex: goomba from PendulumMove()), move his position
    // ? then check if mario is colliding with a (collidable) tile
    entity.pos.x += entity.vel.x * deltaTime;
    level.tileCollider.checkX(entity, gameContext, level);

    entity.pos.y += entity.vel.y * deltaTime;
    level.tileCollider.checkY(entity, gameContext, level);

    // ? Simulate Gravity (constantly give mario gravity, that is reset inside)
    entity.vel.y += level.gravity * deltaTime;
  }
}
