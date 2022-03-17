import TileResolver from "./TileResolver";
import { brick } from "./tiles/brick";
import { ground } from "./tiles/ground";

const handlers = {
  ground,
  brick,
};

export default class TileCollider {
  constructor() {
    this.resolvers = [];
  }

  addGrid(tileMatrix) {
    this.resolvers.push(new TileResolver(tileMatrix));
  }

  checkX(entity, gameContext, level) {
    // ? used to check if mario is detected inside a wall
    let x;
    // ? if mario is moving right (due to Go())
    if (entity.vel.x > 0) {
      x = entity.bounds.right; // ? Use mario's right side as x
    } else if (entity.vel.x < 0) {
      x = entity.bounds.left; // ? Use mario's left side as x
    } else {
      return;
    }
    for (const resolver of this.resolvers) {
      // ? used to check the tiles around mario
      const matches = resolver.searchByRange(
        x,
        x,
        entity.bounds.top,
        entity.bounds.bottom
      );

      matches.forEach((match) => {
        this.handle(0, entity, match, resolver, gameContext, level);
      });
    }
  }

  checkY(entity, gameContext, level) {
    let y;
    // ? if mario is falling down
    if (entity.vel.y > 0) {
      y = entity.bounds.bottom; // ? Use mario's bottom side as y
    } else if (entity.vel.y < 0) {
      y = entity.bounds.top; // ? Use mario's top side as y
    } else {
      return;
    }
    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        entity.bounds.left,
        entity.bounds.right,
        y,
        y
      );

      matches.forEach((match) => {
        this.handle(1, entity, match, resolver, gameContext, level);
      });
    }
  }

  handle(index, entity, match, resolver, gameContext, level) {
    const tileCollisionContext = {
      entity,
      match,
      resolver,
      gameContext,
      level,
    };

    const handler = handlers[match.tile.type];
    // ? if the tile has a type
    if (handler) {
      // ? handler will be ex: ground, bricks, etc. and is used to call the
      // ? handleX ([0]) and handleY ([1]) functions inside /tiles/ground.js/
      // ? which in turn, will check the collisions of the entities and tiles
      handler[index](tileCollisionContext);
    }
  }
}
