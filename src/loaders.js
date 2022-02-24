import { createBackgroundLayer, createSpriteLayer } from "./layers";
import Level from "./Level";
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

function createTiles(level, backgrounds) {
  // ? createTiles is used to loop through the provided level json data
  // ? and properly set the correct data to the level.tiles(.grid[x][y]) object

  // ? with the new JSON level format, we are specifying the length relative to the provided xStart/yStart
  // ? so if xStart=10 and xLen=5, we will later draw from (10,y) to (15,y)

  function applyRange(background, xStart, xLen, yStart, yLen) {
    // ? Setting the background data to level.tiles.grid
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; ++x) {
      for (let y = yStart; y < yEnd; ++y) {
        // ? add that background to the matrix
        // ? this will be set inside a nested array of grid
        // ? so, level.tiles.grid[x][y]
        level.tiles.set(x, y, { name: background.tile, type: background.type });
        // ? note: 'type' is whether it is considered a 'ground' tile, meaning mario can collide with it
      }
    }
  }

  backgrounds.forEach((background) => {
    background.ranges.forEach((range) => {
      // ? this part is used, due to simplifying the level json file
      // ? it checks whether we are specifying exact WxH coords for a tile
      if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        applyRange(background, xStart, xLen, yStart, yLen);
      } else if (range.length === 3) {
        // ? whether we are specifying x=20 tiles length at xStart and y=1 tile height at yStart
        const [xStart, xLen, yStart] = range;
        applyRange(background, xStart, xLen, yStart, 1);
      } else if (range.length === 2) {
        // ? whether we are only specifying one tile only (at xStart and yStart)
        const [xStart, yStart] = range;
        applyRange(background, xStart, 1, yStart, 1);
      }
    });
  });
}

function loadSpriteSheet(name) {
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
      return sprites;
    })
  );
}

export function loadLevel(name) {
  // ? This Promise is to ensure that images and the level are loaded in async
  // ? ex: if image takes 2s and level takes 3s, it wont take 5s for everything to load
  // ? but will only take 3 seconds, since they are done asynchronously
  return loadJSON(`levels/${name}.json`)
    .then((levelSpecification) =>
      Promise.all([
        levelSpecification,
        loadSpriteSheet(levelSpecification.spritesheet),
      ])
    )
    .then(([levelSpecification, backgroundSprites]) => {
      const level = new Level();

      // ? levelSpecification.backgrounds data/syntax can be found in the /levels/*.json file
      // ? Create
      createTiles(level, levelSpecification.backgrounds);

      const backgroundLayer = createBackgroundLayer(
        // ? create the background using the json levels data
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
