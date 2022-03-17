import { Sides } from "../Entity";

function handleX({entity, match}) {
  // ? does mario have velocity
  if (entity.vel.x > 0) {
    // ? is mario's right side greater than the tile's left side
    // ? (basically, is mario detected on the left side of a 'wall' (going right))
    if (entity.bounds.right > match.x1) {
      // ? this is for enemy entities (ex: goomba)
      // ? if goomba hits the left side of a 'wall' (going right)
      entity.obstruct(Sides.RIGHT, match);
    }
  } else if (entity.vel.x < 0) {
    // ? same thing, but for when mario is detected on the right side of a 'wall' (going left)
    if (entity.bounds.left < match.x2) {
      // ? this is for enemy entities (ex: goomba)
      // ? if goomba hits the right side of a 'wall' (going left)
      entity.obstruct(Sides.LEFT, match);
    }
  }
}
function handleY({entity, match}) {
  // ? if mario is falling
  if (entity.vel.y > 0) {
    // ? if mario's bottom is detected on the top of the 'ground'
    if (entity.bounds.bottom > match.y1) {
      // ? if mario is on the ground
      // ? this is used to allow mario to jump again
      // ? this will call the obstruct function inside the class Entity()
      entity.obstruct(Sides.BOTTOM, match);
    }
  } else if (entity.vel.y < 0) {
    // ? if mario is jumping
    // ? if mario's top is detected on the bottom of the 'ground'
    if (entity.bounds.top < match.y2) {
      // ? if mario is in the air/has jumped and has hit the bottom of a tile/a ceiling
      // ? this is used to cancel the jump
      entity.obstruct(Sides.TOP, match);
    }
  }
}

export const ground = [handleX, handleY];
