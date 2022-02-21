import { createMario } from "./entities.js";
import { setupKeyboard } from "./input.js";
import Timer from "./Time.js";
import { loadLevel } from "./loaders.js";

const canvas = document.getElementById("screen");
// ? context which contains the api that we will actually draw with
const context = canvas.getContext("2d");

Promise.all([createMario(), loadLevel("1-1")]).then(([mario, level]) => {
  mario.pos.set(64, 64); // ? testing
  // mario.vel.set(200, -600); // ? testing

  //? Used for debugging
  // level.compositor.layers.push(createCollisionLayer(level));

  level.entities.add(mario);

  const input = setupKeyboard(mario); // ? set up the controls for mario

  input.listenTo(window); // ? listen to user inputs which in turn will affect mario

  //? Used for debugging (will spawn mario to wherever the mouse (down) is)
  // ["mousedown", "mousemove"].forEach((eventName) => {
  //   canvas.addEventListener(eventName, (event) => {
  //     if (event.buttons === 1) {
  //       mario.vel.set(0, 0);
  //       mario.pos.set(event.offsetX, event.offsetY);
  //     }
  //   });
  // });

  // ? This part is used to decouple/separate the internal frame rate of the game
  // ? from the rendering frame rate
  // ? This means that if a client has a slower or higher fps,
  // ? the way mario jumps wont differ (mario will always jump the exact same, no matter what)
  const timer = new Timer(1 / 60); // ? 1/60 is 1 frame not 1ms

  timer.update = function update(deltaTime) {
    level.update(deltaTime); // ? call the update func of the level instance (read class Level for more info)
    level.compositor.draw(context); // ? draw each tile/tile layer on the screen in order
  };
  timer.start(); // ? start everything
});
