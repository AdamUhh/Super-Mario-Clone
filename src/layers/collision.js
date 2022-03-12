// ? This file is purely for testing and checking the way collision works

function createEntityCollisionLayer(entities) {
  return function drawBoundingBox(context, camera) {
    context.strokeStyle = "red";
    entities.forEach((entity) => {
      // ? Visualization of what tiles mario is touching (only the character)
      // ? we are drawing a red square around mario only
      context.beginPath();
      context.rect(
        entity.bounds.left - camera.pos.x,
        entity.bounds.top - camera.pos.y,
        entity.size.x,
        entity.size.y
      );
      context.stroke();
    });
  };
}

function createTileCandidateCollisionLayer(tileCollider) {
  const resolvedTiles = [];

  const tileResolver = tileCollider.tiles;
  const tileSize = tileResolver.tileSize;

  // ? reference to TileResolver getByIndex()
  const getByIndexOriginal = tileResolver.getByIndex;

  // ? override the original function
  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({ x, y });

    // ? call(tileResolver) will bind the 'this' keyword to tileResolver
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function drawTileCandidates(context, camera) {
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

    resolvedTiles.length = 0;
  };
}

export function createCollisionLayer(level) {
  const drawBoundingBoxes = createEntityCollisionLayer(level.entities);
  const drawTileCandidates = createTileCandidateCollisionLayer(level.tileCollider);

  return function drawCollision(context, camera) {
    drawBoundingBoxes(context, camera);
    drawTileCandidates(context, camera);
  };
}
