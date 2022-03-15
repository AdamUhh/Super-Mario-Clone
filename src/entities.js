import { loadBullet } from "./entities/Bullet";
import { loadCannon } from "./entities/Cannon";
import { loadGoomba } from "./entities/Goomba";
import { loadKoopa } from "./entities/Koopa";
import { loadMario } from "./entities/Mario";

export function loadEntities(audioContext) {
  const entityFactories = {};
  // ? entityFactories is somehow populated with all the functions already... 
  // ? not really sure how tbh
  
  function addAs(name) {
    // ? custom name for each entity
    return (factory) => (entityFactories[name] = factory);
  }

  return Promise.all([
    loadMario(audioContext).then(addAs("mario")),
    loadGoomba(audioContext).then(addAs("goomba")),
    loadKoopa(audioContext).then(addAs("koopa")),
    loadBullet(audioContext).then(addAs("bullet")),
    loadCannon(audioContext, entityFactories).then(addAs("cannon")),
  ]).then(() => entityFactories);
}
