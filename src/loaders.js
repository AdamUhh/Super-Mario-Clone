import Level from "./Level";
import { createBackgroundLayer, createSpriteLayer } from "./layers";
import { loadBackgroundSprites } from "./sprites";

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

function createTiles(level, backgrounds) {
  // ? Setting the background data to level.tiles.grid
  backgrounds.forEach((background) => {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
      for (let x = x1; x < x2; ++x) {
        for (let y = y1; y < y2; ++y) {
          // ? add that background to the matrix
          // ? this will be set inside a nested array of grid
          // ? so, level.tiles.grid[x][y]
          level.tiles.set(x, y, { name: background.tile });
        }
      }
    });
  });
}

export function loadLevel(name) {
  // ? This Promise is to ensure that images and the level are loaded in async
  // ? ex: if image takes 2s and level takes 3s, it wont take 5s for everything to load
  // ? but will only take 3 seconds, since they are done asynchronously
  return Promise.all([
    fetch(`levels/${name}.json`).then((r) => r.json()),
    loadBackgroundSprites(),
  ]).then(([levelSpecification, backgroundSprites]) => {
    const level = new Level();

    // ? levelSpecification.backgrounds data/syntax can be found in the /levels/*.json file
    createTiles(level, levelSpecification.backgrounds);

    const backgroundLayer = createBackgroundLayer(
      // ? After loading, create the background using the json levels data
      level,
      backgroundSprites // ? Note: This is a Map (with reference to SpriteSheet)
    );
    // ? Note: createBackgroundLayer() returns a function called drawBackgroundLayer(context)
    // ? drawBackgroundLayer will run when composite.draw is called
    level.compositor.layers.push(backgroundLayer);

    // ? create mario on the screen
    const spriteLayer = createSpriteLayer(level.entities);
    // ? Note: createSpriteLayer() returns a function called drawSpriteLayer(context)
    // ? drawSpriteLayer will run when composite.draw is called
    level.compositor.layers.push(spriteLayer);

    return level;
  });
}

// export function loadLevel(name) {
//   return fetch(`levels/${name}.json`).then((r) => r.json());
// }
