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
