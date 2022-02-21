// function drawBackground(background, context, mappedBackgroundSprites) {
//   // ? ex: [0,25,0,14] means from (x0 to x25) * 16 = 400px
//   // ? and (y0 to y14) * 16 = 224px
//   background.ranges.forEach(([x1, x2, y1, y2]) => {
//     for (let x = x1; x < x2; ++x) {
//       for (let y = y1; y < y2; ++y) {
//         // ? draw the tile onto the screen
//         mappedBackgroundSprites.drawTile(background.tile, context, x, y);
//       }
//     }
//   });
// }

export function createBackgroundLayer(level, mappedBackgroundSprites) {
  const buffer = document.createElement("canvas");
  buffer.width = 400; // ? 256
  buffer.height = 224; // ? 240
  const context = buffer.getContext("2d");

  // ? loop through all the level data and draw it on the screen
  level.tiles.forEach((tile, x, y) => {
    mappedBackgroundSprites.drawTile(tile.name, context, x, y);
  });

  return function drawBackgroundLayer(context) {
    // ? Im not sure what this is for, but its needed
    // ? unsure how this works with the above level.tiles.forEach :c
    context.drawImage(buffer, 0, 0);
  };
}

// ? Create/Draw a sprite
export function createSpriteLayer(entities) {
  return function drawSpriteLayer(context) {
    entities.forEach((entity) => {
      entity.draw(context);
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

  return function drawCollision(context) {
    // ? Used for debugging
    context.strokeStyle = "blue";
    resolvedTiles.forEach(({ x, y }) => {
      // ? Visualization of what tiles mario is touching, in terms of actual tiles around mario
      // ? we are drawing a blue square of what tiles mario is touching
      // ? ex: so if mario's left is on 17 and mario's right is 33, it will detect 2 tiles (16 to 32, and 32 to 48)
      // ? ex: if mario's left is on 16, it will detect 1 tile (16 to 32 only)
      context.beginPath();
      context.rect(x * tileSize, y * tileSize, tileSize, tileSize);
      context.stroke();
    });

    context.strokeStyle = "red";
    level.entities.forEach((entity) => {
      // ? Visualization of what tiles mario is touching (only the character)
      // ? we are drawing a red square around mario only
      context.beginPath();
      context.rect(entity.pos.x, entity.pos.y, entity.size.x, entity.size.y);
      context.stroke();
    });
    resolvedTiles.length = 0;
  };
}
