import { loadImage } from "./loaders";
import SpriteSheet from "./SpriteSheet";

export function loadMarioSprite() {
  // ? Load and define the main spritesheet data of mario
  return loadImage("images/characters.gif").then((image) => {
    const sprites = new SpriteSheet(image, 16, 16); // ? tile size is 16x16
    // ? named 'idle' as we are defining the tile image of when mario is not moving in the actual spritesheet image
    sprites.define("idle", 276, 44, 16, 16); // ? create new tile 'idle' with custom width/height from tile image
    return sprites;
  });
}

export function loadBackgroundSprites() {
  // ? Load and define the background spritesheet data
  return loadImage("images/tiles.png").then((image) => {
    const sprites = new SpriteSheet(image, 16, 16); // ? tile size is 16x16
    sprites.defineTile("ground", 0, 0); // ? create new tile 'ground' from spritesheet tile image - tile inside the image is at position at (0, 0) * 16
    sprites.defineTile("sky", 3, 23); // ? create new tile 'sky' from spritesheet tile image - tile inside the image is at position at (3, 23) * 16
    return sprites;
  });
}
