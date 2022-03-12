import { loadGoomba } from "./entities/Goomba";
import { loadKoopa } from "./entities/Koopa";
import { loadMario } from "./entities/Mario";

export function loadEntities(audioContext) {
  const entityFactories = {};

  function addAs(name) {
    // ? custom name for each entity
    return (factory) => (entityFactories[name] = factory);
  }

  return Promise.all([
    loadMario(audioContext).then(addAs("mario")),
    loadGoomba(audioContext).then(addAs("goomba")),
    loadKoopa(audioContext).then(addAs("koopa")),
  ]).then(() => entityFactories);
}
