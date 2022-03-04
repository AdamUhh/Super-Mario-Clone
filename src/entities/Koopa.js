import Entity from "../Entity";
import { loadSpriteSheet } from "../loaders";
import PendulumWalk from "../traits/PendulumWalk";

export function loadKoopa() {
  return loadSpriteSheet("koopa").then(createKoopaFactory);
}

function createKoopaFactory(koopaSprite) {
  // ? koopaSprite.animations is resolveFrame(distance) due to defineAnim in /SpriteSheet.js/
  const walkAnim = koopaSprite.animations.get("walk");

  function drawKoopa(context) {
    // ? this.lifetime is used as the distance for walkAnim
    // ? Note: this.lifetime is deltaTime
    // ? using walkAnim, we are returning the name of the animation and drawing it
    koopaSprite.draw(walkAnim(this.lifetime), context, 0, 0, this.vel.x < 0);
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

    koopa.addTrait(new PendulumWalk());

    koopa.draw = drawKoopa;

    return koopa;
  };
}
