import Entity from "./Entity";
import Go from "./traits/Go";
import Jump from "./traits/Jump.js";
import { loadSpriteSheet } from "./loaders";
import { createAnim } from "./anim";

export function createMario() {
  // ? Load the spritesheet/image of mario
  return loadSpriteSheet("mario").then((marioSprite) => {
    // ? Note: Remember that 'mario' is an Entity,
    // ? and marioSprite is a SpriteSheet
    const mario = new Entity();
    mario.size.set(14, 16); // ? testing

    mario.addTrait(new Go()); // ? Add walking to mario
    mario.addTrait(new Jump()); // ? Add Jump to mario

    // ? runAnim returns a function (from createAnim)
    // ? thats why I am passing a parameter to it below and it works ;p
    const runAnim = createAnim(["run-1", "run-2", "run-3"], 10);

    // ? Check mario's object and decide what animation to play
    function routeFrame(mario) {
      // ? if mario is moving
      if (mario.go.direction !== 0) {
        return runAnim(mario.go.distance);
      }

      // ? default animation state
      return "idle";
    }

    // ? When you assign a function to an object,
    // ? you can directly use 'this' inside the function, instead of 'mario'
    mario.draw = function drawMario(context) {
      // ? when composite.draw is run, it will run SpriteSheet.draw for mario given tile
      // ?  mario.go.direction < 0 means that if we are running to the left, flip the image
      marioSprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0); // ? draw mario on the screen
    };

    return mario;
  });
}
