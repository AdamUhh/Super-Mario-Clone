import Camera from "./Camera.js";
import { loadEntities } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers.js";
import { loadLevel } from "./loaders/level.js";
import Timer from "./Time.js";
// import { createCameraLayer, createCollisionLayer } from "./layers.js";
// import { setupMouseControl } from "./debug.js";

const canvas = document.getElementById("screen");
// ? context which contains the api that we will actually draw with
const context = canvas.getContext("2d");

Promise.all([loadEntities(), loadLevel("1-1")]).then(([entity, level]) => {

  const camera = new Camera();

  const mario = entity.mario();
  mario.pos.set(64, 64); // ? testing

  const goomba = entity.goomba();
  goomba.pos.x = 220;
  level.entities.add(goomba);

  const koopa = entity.koopa();
  koopa.pos.x = 260;
  level.entities.add(koopa);

  // ? spawn a lot of mario's whenever you jump - for fun :P
  // ? must be above 'level.entities.add(mario)'
  // mario.addTrait({
  //   NAME: "spawnAlotOfMarios",
  //   spawnTimeout: 0,
  //   obstruct() {},
  //   update(mario, deltaTime) {
  //     if (this.spawnTimeout > 0.1 && mario.vel.y < 0) {
  //       const spawn = entity.mario();
  //       spawn.pos.x = mario.pos.x;
  //       spawn.pos.y = mario.pos.y;
  //       spawn.vel.y = mario.vel.y - 200;
  //       level.entities.add(spawn);
  //       this.spawnTimeout = 0;
  //     }
  //     this.spawnTimeout += deltaTime;
  //   },
  // });
  level.entities.add(mario);


  // ? Used for debugging (shows red/blue collision boxes around mario)
  level.compositor.layers.push(
    createCollisionLayer(level)
    // createCameraLayer(camera)
  );

  const input = setupKeyboard(mario); // ? set up the controls for mario

  input.listenTo(window); // ? listen to user inputs which in turn will affect mario

  //? Used for debugging (will spawn entity/mario to wherever the mouse (down) is)
  // setupMouseControl(canvas, mario, camera);

  // ? This part is used to decouple/separate the internal frame rate of the game
  // ? from the rendering frame rate
  // ? This means that if a client has a slower or higher fps,
  // ? the way mario jumps wont differ (mario will always jump the exact same, no matter what)
  const timer = new Timer(1 / 60); // ? 1/60 is 1 frame not 1ms

  timer.update = function update(deltaTime) {
    level.update(deltaTime); // ? call the update func of the level instance (read class Level for more info)

    // ? make camera follow mario
    if (mario.pos.x > 100) {
      camera.pos.x = mario.pos.x - 100;
    }

    level.compositor.draw(context, camera); // ? draw each tile/tile layer on the screen in order
  };
  timer.start(); // ? start everything
});
