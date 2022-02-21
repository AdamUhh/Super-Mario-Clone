import Entity from "./Entity";
import Go from "./traits/Go";
import Jump from "./traits/Jump.js";
import { loadMarioSprite } from "./sprites";

export function createMario() {
  // ? Load the spritesheet/image of mario
  return loadMarioSprite().then((marioSprite) => {
    // ? Note: Remember that 'mario' is an Entity,
    // ? and marioSprite is a SpriteSheet
    const mario = new Entity();
    mario.size.set(14, 16); // ? testing

    mario.addTrait(new Go()); // ? Add walking to mario
    mario.addTrait(new Jump()); // ? Add Jump to mario
    // mario.addTrait(new Velocity());

    // ? When you assign a function to an object,
    // ? you can directly use 'this' inside the function, instead of 'mario'
    mario.draw = function drawMario(context) {
      // ? when composite.draw is run, it will run SpriteSheet.draw for mario given tile
      marioSprite.draw("idle", context, this.pos.x, this.pos.y); // ? draw mario on the screen
    };

    return mario;
  });
}
