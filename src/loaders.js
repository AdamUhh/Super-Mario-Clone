import { createAnim } from "./anim";
import SpriteSheet from "./SpriteSheet";

export function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    // load event is run when the image has been downloaded and is ready
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = url;
  });
}

// ? returns data retrieved from the provided url (JSON)
export function loadJSON(url) {
  return fetch(url).then((r) => r.json());
}

export function loadSpriteSheet(name) {
  // ? used to define all the tiles that we want (from the provided /sprites/${name}.json file)
  return loadJSON(`sprites/${name}.json`).then((sheetSpecification) =>
    Promise.all([
      sheetSpecification,
      loadImage(sheetSpecification.imageURL),
    ]).then(([sheetSpecification, image]) => {
      const sprites = new SpriteSheet(
        image,
        sheetSpecification.tileW,
        sheetSpecification.tileH
      ); // ? tile size is 16x16

      // ? is it a background tile
      if (sheetSpecification.tiles) {
        sheetSpecification.tiles.forEach((tileSpecification) => {
          // ? create new tile 'ground' from spritesheet tile image - ex: name:'overworld', tile inside the image is at position at (0, 0) * 16
          // ? create new tile 'sky' from spritesheet tile image - ex: name:'overworld', tile inside the image is at position at (3, 23) * 16
          sprites.defineTile(
            tileSpecification.name,
            // ? index is the 'coords' (inside the .json) of what tile image to get (its already * 16, no need to add)
            tileSpecification.index[0],
            tileSpecification.index[1]
          );
        });
      }

      // ? is it an entity with animation
      if (sheetSpecification.frames) {
        sheetSpecification.frames.forEach((frameSpecification) => {
          sprites.define(frameSpecification.name, ...frameSpecification.rect);
        });
      }

      // this is used for animations of tiles
      if (sheetSpecification.animations) {
        sheetSpecification.animations.forEach((animSpecification) => {
          // ? ex: it will return chance-1, chance-2, chance-3, etc
          // ? this is the animation frame names
          const animation = createAnim(
            animSpecification.frames,
            animSpecification.frameLen
          );
          sprites.defineAnim(animSpecification.name, animation);
        });
      }
      return sprites;
    })
  );
}
