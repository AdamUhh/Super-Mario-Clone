import Compositor from "./Compositor";
import EntityCollider from "./EntityCollider";
import TileCollider from "./TileCollider";

export default class Level {
  constructor() {
    // ? Used to setup the actual level
    // ? This class will handle level making and tile collision between entities and each tile
    this.gravity = 1500;
    this.totalTime = 0; // ? will be accumulated. Used for animation as it lets us know how long the level has progressed for
    this.compositor = new Compositor(); // ? Draw layers in order
    this.entities = new Set(); // ? Only allows one instance of every entity in the level
    this.entityCollider = new EntityCollider(this.entities);
    this.tileCollider = null; // ? set to null until we set the collision grid
  }

  setCollisionGrid(matrix) {
    // ? Matrix is used keep data on each background tile that will eventually be drawn
    // ? and is used to help the TileCollider keep track of what can be counted as a collision
    this.tileCollider = new TileCollider(matrix);
  }

  update(deltaTime) {
    // ? For each entity (ex: mario)
    this.entities.forEach((entity) => {
      // ? run its update function, which would be mario's Entity().update()
      // ? which in turn, will loop through and call the update() on mario's Traits, ex: Go(), Jump(), etc
      entity.update(deltaTime, this);
    });

    // ? this is to ensure that gravity affects all entities before anything else is run
    this.entities.forEach((entity) => {
      // ? supply each entity to the entity collider
      // ? when mario collides with an entity, it is sent to the queue()
      // ? to later be finalized (in order)
      this.entityCollider.check(entity);
    });

    this.entities.forEach((entity) => {
      entity.finalize();
    });

    // ? used inside /layers/ in order to let us know how long the level has progressed for
    this.totalTime += deltaTime;
  }
}
