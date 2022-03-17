import TileResolver from "../TileResolver";

export function createBackgroundLayer(level, tiles, mappedBackgroundSprites) {
    // ? Note: mappedBackgroundSprites is a Map (with reference to SpriteSheet)
    const resolver = new TileResolver(tiles); // ? contains all the tiles data (that will be used to check if mario can collidge with)
  
    const buffer = document.createElement("canvas");
    // ? essentially, it is preemtively loading an extra column of tiles (16px)
    buffer.width = 256 + 16; // ? this helps hide the tiles that are still 'loading' (due to when we move the camera)
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
      // ? ex: So a pos of 35.5 means 2 due to the tileSize being 16 (so 35.5/16=2 (rounded))
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