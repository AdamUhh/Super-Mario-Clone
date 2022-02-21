export default class Compositor {
  constructor() {
      // ? This is to draw all the layers in order, allowing us to display them correctly
      // ? So we will draw the background, mario, etc. on top of each other per update
      this.layers = [];
    }
    
    draw(context) {
      // ? Loops over all the layers and draws them
      this.layers.forEach((layer) => {
        // ? essentially, layer is the callback return function
        // ? ex: layer is drawSpriteLayer(context) inside the return of createSpriteLayer()
        layer(context);
      });
    }
  }