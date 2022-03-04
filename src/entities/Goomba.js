import Entity from "../Entity";
import { loadSpriteSheet } from "../loaders";
import PendulumWalk from "../traits/PendulumWalk";

export function loadGoomba() {
  return loadSpriteSheet("goomba").then(createGoombaFactory);
}

function createGoombaFactory(goombaSprite) {
  // ? goombaSprite.animations is resolveFrame(distance) inside /anim.js/ due to defineAnim in /SpriteSheet.js/
  const walkAnim = goombaSprite.animations.get("walk");

  function drawGoomba(context) {
    // ? this.lifetime is used as the distance for walkAnim
    // ? Note: this.lifetime is deltaTime
    // ? using walkAnim, we are returning the name of the animation and drawing it
    goombaSprite.draw(walkAnim(this.lifetime), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();
    goomba.size.set(16, 16);

    goomba.addTrait(new PendulumWalk());

    goomba.draw = drawGoomba;

    return goomba;
  };
}
