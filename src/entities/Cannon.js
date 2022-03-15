import Entity from "../Entity";
import { loadAudioBoard } from "../loaders/audio";
import { findPlayers } from "../player";
import Emitter from "../traits/Emitter";

const HOLD_FIRE_THRESHOLD = 30;

export function loadCannon(audioContext, entityFactories) {
  // ? load the audio only for the 'cannon' inside /public/sounds/cannon.json/
  return loadAudioBoard("cannon", audioContext).then((audio) => {
    return createCannonFactory(audio, entityFactories);
  });
}

function createCannonFactory(audio, entityFactories) {
  function emitBullet(cannon, level) {
    // ? if mario is infront of the cannon, create a bullet facing the right (towards mario)
    let dir = 1;

    // ? find mario inside of the level, to get his data, such as position
    for (const player of findPlayers(level)) {
      if (
        player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHOLD &&
        player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHOLD
      ) {
        // ? if mario is close to the cannon (via a range threshold), stop firing/creating bullets
        return;
      }

      if (player.pos.x < cannon.pos.x) {
        // ? if mario is behind of the cannon, create a bullet facing the left (towards mario)
        dir = -1;
      }
    }

    const bullet = entityFactories.bullet(); // ? bullet object with all its traits, etc.

    bullet.pos.copy(cannon.pos); // ? set bullet pos in same place as cannon
    bullet.vel.set(80 * dir, 0); // ? dir is dependent on mario pos

    cannon.sounds.add("shoot");

    level.entities.add(bullet);
  }

  return function createCannon() {
    const cannon = new Entity();
    cannon.audio = audio;

    const emitter = new Emitter();
    emitter.interval = 4;
    emitter.emitters.push(emitBullet); // ? every 4 seconds, add the emitBullet function (that will be run every time we emit, inside /Emitter.js/)

    cannon.addTrait(emitter);

    return cannon;
  };
}
