import { createBackgroundLayer } from "../layers/background";
import { createSpriteLayer } from "../layers/sprites";
import Level from "../Level";
import { loadJSON } from "../loaders";
import { Matrix } from "../math";
import { loadMusicSheet } from "./music";
import { loadSpriteSheet } from "./sprite";

function setupBackgrounds(levelSpecification, level, backgroundSprites) {
  levelSpecification.layers.forEach((layer) => {
    const grid = createGrid(layer.tiles, levelSpecification.patterns);
    const backgroundLayer = createBackgroundLayer(
      // ? create/draw the background using the json levels data (only when needed)
      level,
      grid,
      backgroundSprites // ? Note: This is a Map (with reference to SpriteSheet)
    );
    // ? Note: createBackgroundLayer() returns a function called drawBackgroundLayer(context)
    // ? drawBackgroundLayer will run when composite.draw is called
    level.compositor.layers.push(backgroundLayer);

    level.tileCollider.addGrid(grid);
  });
}

function setupEntities(levelSpecification, level, entityFactory) {
  // ? create ex: mario on the screen
  const spriteLayer = createSpriteLayer(level.entities);

  // ? using data from the level JSON, get the entities for a specific level
  // ? and add them to the level
  levelSpecification.entities.forEach(({ name, pos: [x, y] }) => {
    // ? createEntity returns ex: createGoomba() from /entities.js/ -> ex: loadGoomba() -> class Goomba() -> createGoomba()
    const createEntity = entityFactory[name];

    const entity = createEntity();
    entity.pos.set(x, y);
    level.entities.add(entity);
    // ? the above is the equivalent of:
    // const goomba = entityFactory.goomba();
    // goomba.pos.x = 220;
    // level.entities.add(goomba);
  });

  // ? Note: createSpriteLayer() returns a function called drawSpriteLayer(context)
  // ? drawSpriteLayer will run when composite.draw is called
  level.compositor.layers.push(spriteLayer);
}
export function createLevelLoader(entityFactory) {
  return function loadLevel(name) {
    // ? This Promise is to ensure that images and the level are loaded in async
    // ? ex: if image takes 2s and level takes 3s, it wont take 5s for everything to load
    // ? but will only take 3 seconds, since they are done asynchronously
    return loadJSON(`levels/${name}.json`)
      .then((levelSpecification) =>
        Promise.all([
          // ? get the level data (of where you want the sprites/tiles to appear in the level)
          levelSpecification,
          // ? define the sprites/tiles (their locations inside the spritesheet image are inside ex: 'overworld.json')
          loadSpriteSheet(levelSpecification.spritesheet),
          loadMusicSheet(levelSpecification.musicsheet),
        ])
      )
      .then(([levelSpecification, backgroundSprites, musicPlayer]) => {
        const level = new Level();
        
        level.music.setPlayer(musicPlayer);

        setupBackgrounds(levelSpecification, level, backgroundSprites);

        setupEntities(levelSpecification, level, entityFactory);

        return level;
      });
  };
}

function createGrid(tiles, patterns) {
  // ? get the data of tiles that have types (ex: 'ground', 'bricks', etc.),
  // ? to be used to identify as as collision tile
  const grid = new Matrix();
  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, tile);
  }
  // ? ex: grid will be something like [x][y] -> output: {type: 'ground' / undefined}
  // ? so [199][0] -> {type: undefined}, but [199][14] -> {type: 'ground'}
  return grid;
}

// ? old way - without using the generator function
// ? this is just a reference to see difference using generator function for this situation
// function expandSpan(xStart, xLen, yStart, yLen) {
//   const coords = [];
//   // ? Setting the tile data to level.tiles.grid
//   const xEnd = xStart + xLen;
//   const yEnd = yStart + yLen;
//   for (let x = xStart; x < xEnd; ++x) {
//     for (let y = yStart; y < yEnd; ++y) {
//       coords.push({ x, y });
//     }
//   }
//   return coords;
// }

// ? we made it into a generator function (for this case)
// ? in order to remove the need for a temporary 'coords' array
function* expandSpan(xStart, xLen, yStart, yLen) {
  // ? Setting the tile data to level.tiles.grid
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;
  for (let x = xStart; x < xEnd; ++x) {
    for (let y = yStart; y < yEnd; ++y) {
      yield { x, y };
    }
  }
}

function expandRange(range) {
  // ? with the new JSON level format, we are specifying the length relative to the provided xStart/yStart
  // ? so if xStart=10 and xLen=5, we will later draw from (10,y) to (15,y)
  // ? it checks whether we are specifying exact WxH coords for a tile
  if (range.length === 4) {
    const [xStart, xLen, yStart, yLen] = range;
    return expandSpan(xStart, xLen, yStart, yLen);
  } else if (range.length === 3) {
    // ? whether we are specifying x=20 tiles length at xStart and y=1 tile height at yStart
    const [xStart, xLen, yStart] = range;
    return expandSpan(xStart, xLen, yStart, 1);
  } else if (range.length === 2) {
    // ? whether we are only specifying one tile only (at xStart and yStart)
    const [xStart, yStart] = range;
    return expandSpan(xStart, 1, yStart, 1);
  }
}

// function* expandRanges(ranges) {
//   for (const range of ranges) {
//     for (const item of expandRange(range)) {
//       yield item; // ? will be { x: ?, y: ?}, etc.
//     }
//   }
// }
function* expandRanges(ranges) {
  for (const range of ranges) {
    yield* expandRange(range); // ? will be { x: ?, y: ?}, etc.
  }
}

function* expandTiles(tiles, patterns) {
  // ? createTiles() -> walkTiles() is used to loop through the provided level json data
  // ? and properly set the correct data to the level.tiles(.grid[x][y]) object

  function* walkTiles(tiles, offsetX, offsetY) {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        // ? if the json has a pattern instead of a name
        if (tile.pattern) {
          // ? this will assign the patterns name and ranges to tiles
          // ? from the patterns instead of layers
          // ? ex: { "name": "cloud-1-1", "ranges": [ [ 0, 0 ] ] }
          const tiles = patterns[tile.pattern].tiles;
          // ? then, it will run walkTiles again, but with the name of the tile
          // ? hence, it will not run this block of code (until the next tile.pattern)
          yield* walkTiles(tiles, derivedX, derivedY);
        } else {
          yield { tile, x: derivedX, y: derivedY };
        }
      }
    }
  }

  // ? Note: yield* 'expression' which returns an iterable object
  // ? returns an array containing { tile.name, tile.type, type.ranges, x, y }
  yield* walkTiles(tiles, 0, 0);
}

// ? Old method of createTiles()
// ? the new method is essentially the old method, but separated into more efficient/readable functions
// ? as well as allows for the use of multiple 'layers' of tiles (being drawn per update)
// function createTiles(level, backgrounds) {
//   // ? createTiles is used to loop through the provided level json data
//   // ? and properly set the correct data to the level.tiles(.grid[x][y]) object

//   // ? with the new JSON level format, we are specifying the length relative to the provided xStart/yStart
//   // ? so if xStart=10 and xLen=5, we will later draw from (10,y) to (15,y)
//   function applyRange(background, xStart, xLen, yStart, yLen) {
//     // ? Setting the background data to level.tiles.grid
//     const xEnd = xStart + xLen;
//     const yEnd = yStart + yLen;
//     for (let x = xStart; x < xEnd; ++x) {
//       for (let y = yStart; y < yEnd; ++y) {
//         // ? add that background to the matrix
//         // ? this will be set inside a nested array of grid
//         // ? so, level.tiles.grid[x][y]
//         level.tiles.set(x, y, { name: background.tile, type: background.type });
//         // ? note: 'type' is whether it is considered a 'ground' tile, meaning mario can collide with it
//       }
//     }
//   }

//   backgrounds.forEach((background) => {
//     background.ranges.forEach((range) => {
//       // ? this part is used, due to simplifying the level json file
//       // ? it checks whether we are specifying exact WxH coords for a tile
//       if (range.length === 4) {
//         const [xStart, xLen, yStart, yLen] = range;
//         applyRange(background, xStart, xLen, yStart, yLen);
//       } else if (range.length === 3) {
//         // ? whether we are specifying x=20 tiles length at xStart and y=1 tile height at yStart
//         const [xStart, xLen, yStart] = range;
//         applyRange(background, xStart, xLen, yStart, 1);
//       } else if (range.length === 2) {
//         // ? whether we are only specifying one tile only (at xStart and yStart)
//         const [xStart, yStart] = range;
//         applyRange(background, xStart, 1, yStart, 1);
//       }
//     });
//   });
// }
