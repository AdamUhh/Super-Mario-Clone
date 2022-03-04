export default class SpriteSheet {
  constructor(image, width, height) {
    // ? This class is used to control properties/draw the
    // ? provided image/tile on screen
    this.image = image;
    this.width = width;
    this.height = height;
    this.tiles = new Map(); // ? to save buffer to a map
    this.animations = new Map(); // ? to save animations to a map
  }

  defineAnim(name, animation) {
    this.animations.set(name, animation);
  }

  define(name, x, y, width, height) {
    // ? create two canvas's (non-mirrored and mirrored)
    const buffers = [false, true].map((flip) => {
      const buffer = document.createElement("canvas");
      buffer.width = width;
      buffer.height = height;
      const context = buffer.getContext("2d");

      // ? mirrored tiles for when mario is running left/right
      if (flip) {
        context.scale(-1, 1);
        context.translate(-width, 0);
      }

      context.drawImage(
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

      return buffer;
    });
    this.tiles.set(name, buffers); // ? save buffers to a map
  }

  defineTile(name, x, y) {
    this.define(name, x * this.width, y * this.width, this.width, this.height);
  }

  draw(name, context, x, y, flip = false) {
    // ? [flip] is to get the non-mirrored buffer
    const buffer = this.tiles.get(name)[flip ? 1 : 0]; // ? retrieve buffer/tile from the tiles set
    // ? draw tile at (x, y)
    context.drawImage(buffer, x, y);
  }

  drawAnim(name, context, x, y, distance) {
    // ? animation would be resolveFrame() inside /anim.js/
    // ? this would draw the tile according to the name
    const animation = this.animations.get(name);
    // ? animation(distance) will do a calculation to be between 0...1...2, which in turn
    // ? is the index of the animation that we want, therefore, its constantly changing
    // ? since delta time is constantly changing - essentially, we have a loop on the animation
    // ? (ex: for the chance animation)
    this.drawTile(animation(distance), context, x, y);
  }
  // ? this is for convenience, so we dont have to repeatedly type in x '* 16'
  // ? whenever we want to draw a tile, since each tile is 16x16 px
  drawTile(name, context, x, y) {
    this.draw(name, context, x * this.width, y * this.height);
  }
}
