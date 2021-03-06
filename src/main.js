import Camera from "./Camera.js";
import { loadEntities } from "./entities.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers/collision.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { loadFont } from "./loaders/font.js";
import { createLevelLoader } from "./loaders/level.js";
import { createPlayer, createPlayerEnvironment } from "./player.js";
import Timer from "./Time.js";

async function main(canvas) {
  // ? context which contains the api that we will actually draw with
  const context = canvas.getContext("2d");

  const audioContext = new AudioContext();
  
  const entityFactory = await loadEntities(audioContext);
  const font = await loadFont();
  const loadLevel = await createLevelLoader(entityFactory);

  const level = await loadLevel("1-1");

  const camera = new Camera();

  // ? add score and lives to mario/player
  const mario = createPlayer(entityFactory.mario());

  // ? Used for debugging (shows red/blue collision boxes around mario)
  level.compositor.layers.push(
    createCollisionLayer(level)
    // createCameraLayer(camera)
  );

  // ? adding this will also add mario to the level
  // ? (since it will consider that mario is dead when we first load)
  // ? this is done inside PlayerController().update()
  const playerEnv = createPlayerEnvironment(mario);
  level.entities.add(playerEnv);

  // ? add scoreboard to screen
  level.compositor.layers.push(createDashboardLayer(font, playerEnv));

  const input = setupKeyboard(mario); // ? set up the controls for mario

  input.listenTo(window); // ? listen to user inputs which in turn will affect mario

  const gameContext = {
    audioContext,
    entityFactory,
    deltaTime: null,
  };

  // ? This part is used to decouple/separate the internal frame rate of the game
  // ? from the rendering frame rate
  // ? This means that if a client has a slower or higher fps,
  // ? the way mario jumps wont differ (mario will always jump the exact same, no matter what)
  const timer = new Timer(1 / 60); // ? 1/60 is 1 frame not 1ms

  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;
    
    level.update(gameContext); // ? call the update func of the level instance (read class Level for more info)

    // ? make camera follow mario
    camera.pos.x = Math.max(0, mario.pos.x - 100);

    level.compositor.draw(context, camera); // ? draw each tile/tile layer on the screen in order
  };

  timer.start(); // ? start everything
  level.music.player.playTrack('main')
}
const canvas = document.getElementById("screen");

const start = () => {
  window.removeEventListener("click", start);
  main(canvas);
};

window.addEventListener("click", start);
