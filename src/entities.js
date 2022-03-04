import { loadGoomba } from "./entities/Goomba";
import { loadKoopa } from "./entities/Koopa";
import { loadMario } from "./entities/Mario";

export function loadEntities() {
  const entityFactories = {};

  function addAs(name) {
    // ? custom name for each entity
    return (factory) => (entityFactories[name] = factory);
  }

  return Promise.all([
    loadMario().then(addAs("mario")),
    loadGoomba().then(addAs("goomba")),
    loadKoopa().then(addAs("koopa")),
  ]).then(() => entityFactories);
}
