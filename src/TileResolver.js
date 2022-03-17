export default class TileResolver {
  constructor(matrix, tileSize = 16) {
    this.matrix = matrix;
    this.tileSize = tileSize;
  }
  
  toIndex(pos) {
    // ? Take a position and return the index of that position
    // ? ex: This will convert a pos of 35.5 to 2 due to the tileSize being 16 (so 35.5/16=2 (rounded))
    return Math.floor(pos / this.tileSize);
  }

  toIndexRange(pos1, pos2) {
    // ? Find the ranges between two tiles
    // ? pMax indicates the max search range/right side of the tile in pos2
    // ? ex: if (the left side of mario is on px) 68px, which is a little more than the left side of the tile (64px)
    // ? which would mean that mario is also touching the (right) tile too
    // ? pMax will calculate 80px (max of the right-most of the tile that mario is touching)
    const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize;
    const range = [];
    let pos = pos1; // ? position of where we start counting the distance
    do {
      range.push(this.toIndex(pos)); // ? convert the position into an index, ex: pos1=23 would be in tile 1
      // ? have the position go to the next tile, ex: pos1=23, next tile would be 39 which
      // ? after looping again, would mean tile 2
      pos += this.tileSize;
    } while (pos < pMax);
    // ? ex: [4] if mario is standing on the tile at 64px
    // ? ex: [4,5] is mario is standing on the tile at 65px
    return range;
  }

  getByIndex(indexX, indexY) {
    // ? check if there is any tile in the provided coords

    // ? get the name of the tile at these coords
    const tile = this.matrix.get(indexX, indexY);
    // ? if a tile exists, return all its details
    if (tile) {
      const x1 = indexX * this.tileSize;
      const x2 = x1 + this.tileSize;
      const y1 = indexY * this.tileSize;
      const y2 = y1 + this.tileSize;
      return {
        tile,
        indexX,
        indexY,
        x1,
        x2,
        y1,
        y2,
      };
    }
  }

  // ? used for testing collision (same as in /layers.js/)
  searchByPosition(posX, posY) {
    return this.getByIndex(this.toIndex(posX), this.toIndex(posY));
  }

  searchByRange(x1, x2, y1, y2) {
    // ? used to check the tiles around mario
    const matches = [];
    // ? check left and right side of 'mario' to which tile column it is touching
    this.toIndexRange(x1, x2).forEach((indexX) => {
      // ? do the same for the y axis
      this.toIndexRange(y1, y2).forEach((indexY) => {
        // ? check the tiles that are around mario
        const match = this.getByIndex(indexX, indexY);
        if (match) {
          matches.push(match);
        }
      });
    });
    return matches;
  }
}
