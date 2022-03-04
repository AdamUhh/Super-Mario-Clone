import Entity from "../Entity";
import { loadSpriteSheet } from "../loaders";
import Go from "../traits/Go";
import Jump from "../traits/Jump.js";

const WALKING_DRAG = 1 / 2000;
const RUNNING_DRAG = 1 / 5000;

export function loadMario() {
  // ? Load the spritesheet/image of mario
  //   return loadSpriteSheet("mario").then((marioSprite) => {
  //     createMarioFactory(marioSprite);
  //   });
  return loadSpriteSheet("mario").then(createMarioFactory);
}

function createMarioFactory(marioSprite) {
  // ? marioSprite.animations is resolveFrame(distance) due to defineAnim in /SpriteSheet.js/
  const runAnim = marioSprite.animations.get("run");

  // ? Check mario's object and decide what animation to play
  function routeFrame(mario) {
    // ? if mario is in the air
    if (mario.jump.falling) {
      return "jump"; // ? return jump animation name
    }
    // ? if mario is moving
    if (mario.go.distance > 0) {
      // ? if mario is moving but switches directions (left to right or right to left)
      if (
        (mario.vel.x > 0 && mario.go.direction < 0) ||
        (mario.vel.x < 0 && mario.go.direction > 0)
      ) {
        return "break"; // ? return break animation name
      }

      // ? is mario is moving, return 1 from 3 running animation frames
      // ? that is determined by a small calculation via how far mario has gone
      return runAnim(mario.go.distance);
    }

    // ? default animation state (not moving)
    return "idle";
  }

  function setTurboState(turboOn) {
    this.go.dragFactor = turboOn ? RUNNING_DRAG : WALKING_DRAG;
  }

  function drawMario(context) {
    // ? when composite.draw is run, it will run SpriteSheet.draw for mario given tile
    // ? mario.go.direction < 0 means that if we are running to the left, flip the image
    marioSprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0); // ? draw mario on the screen
  }

  return function createMario() {
    // ? Note: Remember that 'mario' is an Entity,
    // ? and marioSprite is a SpriteSheet
    const mario = new Entity();
    mario.size.set(14, 16); // ? testing

    mario.addTrait(new Go()); // ? Add walking to mario
    mario.addTrait(new Jump()); // ? Add Jump to mario

    mario.turbo = setTurboState;

    // ? When you assign a function to an object,
    // ? you can directly use 'this' inside the function, instead of 'mario'
    mario.draw = drawMario;

    mario.turbo(false);

    return mario;
  };
}
