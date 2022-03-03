// function drawBackground(background, context, mappedBackgroundSprites) {

import TileResolver from "./TileResolver";

export function createBackgroundLayer(level, tiles, mappedBackgroundSprites) {
  // ? Note: mappedBackgroundSprites is a Map (with reference to SpriteSheet)
  // const tiles = level.tiles; // ? contains all the tiles properties(coords, name, type) that is to be put on the screen
  // const resolver = level.tileCollider.tiles; // ? contains all the tiles data (that will be used to check if mario can collidge with)
  const resolver = new TileResolver(tiles);

  const buffer = document.createElement("canvas");
  buffer.width = 256 + 16; // ? 16 is just used to showcase how the Camera works
  buffer.height = 240;
  const context = buffer.getContext("2d");

  function redraw(startIndex, endIndex) {
    // ? clear the screen before every redraw
    context.clearRect(0, 0, buffer.width, buffer.height);

    // ? loop through all the tiles (x-axis) from the left to right
    for (let x = startIndex; x <= endIndex; ++x) {
      const column = tiles.grid[x];
      // ? if there exists a tile at, ex: (13, y)
      if (column) {
        // ? loop through all the tiles (y-axis)
        column.forEach((tile, y) => {
          // ? check if 'overworld' has an animation property
          // ? and check if it contains the provided tile name (ex: chance)
          if (mappedBackgroundSprites.animations.has(tile.name)) {
            mappedBackgroundSprites.drawAnim(
              tile.name,
              context,
              x - startIndex,
              y,
              // ? essentially, this is the deltaTime, which tells us how long the level has progressed for
              level.totalTime
            );
          } else {
            // ? draw the background tiles
            mappedBackgroundSprites.drawTile(
              tile.name,
              context,
              // ? ex: x = 18 and startIndex = 2, this will properly draw the tiles at correct coords (and will also fit 16tiles as 18-2=16)
              x - startIndex,
              y
            );
          }
        });
      }
    }
  }

  return function drawBackgroundLayer(context, camera) {
    // ? only draw more of the level as the camera moves left/right

    // ? remember, toIndex will take a position and return the index of that position
    // ? ex: So a pos of 35.5 to 2 due to the tileSize being 16 (so 35.5/16=2 (rounded))
    const drawWidth = resolver.toIndex(camera.size.x); // ? width of the camera (16 tiles)
    const drawFrom = resolver.toIndex(camera.pos.x); // ? pos of the left side of the camera
    const drawTo = drawFrom + drawWidth;
    redraw(drawFrom, drawTo);

    // ? redraw and the below drawImage, draws the actual images on the screen
    // ? it is not related to the actual tiles that are collidable <- these are 'invisible',
    // ? and redraw/below drawImage is the actual image, in order to represent these 'invisible' tiles
    // ? % 16 is used to make sure that the pos (or how many tiles the camera will draw) can never go beyond 16 tiles
    context.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y % 16);
  };
}

// ? Create/Draw a sprite
export function createSpriteLayer(entities, width = 64, height = 64) {
  const spriteBuffer = document.createElement("canvas");
  spriteBuffer.width = width; // ? any given entity cannot be
  spriteBuffer.height = height; // bigger than 64 px?
  const spriteBufferContext = spriteBuffer.getContext("2d");

  // ? This will draw the sprite at the right location
  return function drawSpriteLayer(context, camera) {
    entities.forEach((entity) => {
      spriteBufferContext.clearRect(0, 0, width, height);

      entity.draw(spriteBufferContext);

      context.drawImage(
        spriteBuffer,
        // ? '- camera.pos.*' in order to not move the entity/mario while the camera is moving
        // ? basically, the camera moves separately from the entity
        entity.pos.x - camera.pos.x,
        entity.pos.y - camera.pos.y
      );
    });
  };
}

// ? This is purely for testing and checking the way collision works
export function createCollisionLayer(level) {
  const resolvedTiles = [];

  const tileResolver = level.tileCollider.tiles;
  const tileSize = tileResolver.tileSize;

  // ? reference to TileResolver getByIndex()
  const getByIndexOriginal = tileResolver.getByIndex;

  // ? override the original function
  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({ x, y });

    // ? call(tileResolver) will bind the 'this' keyword to tileResolver
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function drawCollision(context, camera) {
    // ? Used for debugging
    context.strokeStyle = "blue";
    resolvedTiles.forEach(({ x, y }) => {
      // ? Visualization of what tiles mario is touching, in terms of actual tiles around mario
      // ? we are drawing a blue square of what tiles mario is touching
      // ? ex: so if mario's left is on 17 and mario's right is 33, it will detect 2 tiles (16 to 32, and 32 to 48)
      // ? ex: if mario's left is on 16, it will detect 1 tile (16 to 32 only)
      context.beginPath();
      context.rect(
        x * tileSize - camera.pos.x,
        y * tileSize - camera.pos.y,
        tileSize,
        tileSize
      );
      context.stroke();
    });

    context.strokeStyle = "red";
    level.entities.forEach((entity) => {
      // ? Visualization of what tiles mario is touching (only the character)
      // ? we are drawing a red square around mario only
      context.beginPath();
      context.rect(
        entity.pos.x - camera.pos.x,
        entity.pos.y - camera.pos.y,
        entity.size.x,
        entity.size.y
      );
      context.stroke();
    });
    resolvedTiles.length = 0;
  };
}

// ? This is purely for testing and checking the way the camera works
export function createCameraLayer(cameraToDraw) {
  // ? cameraToDraw is the camera rectangle that we will draw (purple)
  // ? fromCamera is the perspective we draw from
  return function drawCameraRect(context, fromCamera) {
    context.strokeStyle = "purple";
    context.beginPath();
    context.rect(
      // ? two be honest, i dont understand why this cant be 0,0
      // ? perhaps later in the video he will explain why
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y
    );
    context.stroke();
  };
}
