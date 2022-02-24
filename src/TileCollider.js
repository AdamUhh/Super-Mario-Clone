import TileResolver from "./TileResolver";

export default class TileCollider {
  constructor(tileMatrix) {
    this.tiles = new TileResolver(tileMatrix);
  }

  checkX(entity) {
    // ? used to check if mario is detected inside a wall
    let x;
    // ? if mario is moving right (due to Go())
    if (entity.vel.x > 0) {
      x = entity.pos.x + entity.size.x; // ? Use mario's right side as x
    } else if (entity.vel.x < 0) {
      x = entity.pos.x; // ? Use mario's left side as x
    } else {
      return;
    }

    // ? used to check the tiles around mario
    const matches = this.tiles.searchByRange(
      x,
      x,
      entity.pos.y,
      entity.pos.y + entity.size.y
    );

    matches.forEach((match) => {
      // ? if the tile.type (from the /level/*.json file) does not have a type 'ground'
      // ? essentially, if the tile is not considered to be collidable with mario
      if (match.tile.type !== "ground") {
        return;
      }
      // ? if mario is touching the 'ground'
      // ? does mario have velocity
      if (entity.vel.x > 0) {
        // ? is mario's right side greater than the tile's left side
        // ? (basically, is mario detected on the left side of a 'wall' (going right))
        if (entity.pos.x + entity.size.x > match.x1) {
          // ? force mario's to no longer be inside the wall
          entity.pos.x = match.x1 - entity.size.x;
          entity.vel.x = 0;
        }
      } else if (entity.vel.x < 0) {
        // ? same thing, but for when mario is detected on the right side of a 'wall' (going left)
        if (entity.pos.x < match.x2) {
          entity.pos.x = match.x2;
          entity.vel.x = 0;
        }
      }
    });
  }

  checkY(entity) {
    let y;
    // ? if mario is falling down
    if (entity.vel.y > 0) {
      y = entity.pos.y + entity.size.y; // ? Use mario's bottom side as y
    } else if (entity.vel.y < 0) {
      y = entity.pos.y; // ? Use mario's top side as y
    } else {
      return;
    }
    const matches = this.tiles.searchByRange(
      entity.pos.x,
      entity.pos.x + entity.size.x,
      y,
      y
    );

    matches.forEach((match) => {
      if (match.tile.type !== "ground") {
        return;
      }

      // ? if mario is falling
      if (entity.vel.y > 0) {
        // ? if mario's bottom is detected on the top of the 'ground'
        if (entity.pos.y + entity.size.y > match.y1) {
          entity.pos.y = match.y1 - entity.size.y;
          entity.vel.y = 0;
        }
      } else if (entity.vel.y < 0) {
        // ? if mario is jumping
        // ? if mario's top is detected on the bottom of the 'ground'
        if (entity.pos.y < match.y2) {
          entity.pos.y = match.y2;
          entity.vel.y = 0;
        }
      }
    });
  }
}
