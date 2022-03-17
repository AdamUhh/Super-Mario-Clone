export class Matrix {
  constructor() {
    this.grid = [];
  }

  forEach(callback) {
    this.grid.forEach((column, x) => {
      column.forEach((value, y) => {
        callback(value, x, y);
      });
    });
  }

  delete(x, y) {
    const column = this.grid[x];
    if (column) {
      delete column[y];
    }
  }

  get(x, y) {
    const column = this.grid[x];
    if (column) {
      return column[y];
    }
    return undefined;
  }

  set(x, y, value) {
    // ? 'this' is level.tiles
    if (!this.grid[x]) {
      // ? Does x exist in the grid
      // ? if not, create a new row
      this.grid[x] = [];
    }

    this.grid[x][y] = value;
  }
}

export class Vec2 {
  constructor(x, y) {
    this.set(x, y);
  }

  copy(vec2) {
    this.x = vec2.x;
    this.y = vec2.y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }
}
