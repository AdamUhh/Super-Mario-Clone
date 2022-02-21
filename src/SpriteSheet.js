export default class SpriteSheet {
  constructor(image, width, height) {
    // ? This class is used to control properties/draw the 
    // ? provided image/tile on screen
    this.image = image;
    this.width = width;
    this.height = height;
    this.tiles = new Map(); // ? to save buffer to a map
  }

  define(name, x, y, width, height) {
    const buffer = document.createElement("canvas");
    buffer.width = width;
    buffer.height = height;

    buffer.getContext("2d").drawImage(
      this.image, // ? draw the image
      x, // ? this is the subset
      y,
      width, // ? size of the subset
      height,
      0, // ? full buffer of subset
      0,
      width,
      height
    );
    this.tiles.set(name, buffer); // ? save buffer to a map
  }

  defineTile(name, x, y) {
    this.define(name, x * this.width, y * this.width, this.width, this.height);
  }

  draw(name, context, x, y) {
    const buffer = this.tiles.get(name); // ? retrieve buffer/tile from the tiles set
    // ? draw tile at (x, y)
    context.drawImage(buffer, x, y);
  }

  // ? this is for convenience, so we dont have to repeatedly type in x '* 16'
  // ? whenever we want to draw a tile, since each tile is 16x16 px
  drawTile(name, context, x, y) {
    this.draw(name, context, x * this.width, y * this.height);
  }
}
