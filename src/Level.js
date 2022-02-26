import Compositor from "./Compositor";
import { Matrix } from "./math";
import TileCollider from "./TileCollider";

export default class Level {
  constructor() {
    // ? Used to setup the actual level
    // ? This class will handle level making and tile collision between entities and each tile
    this.gravity = 1500;
    this.totalTime = 0; // ? will be accumulated. Used for animation as it lets us know how long the level has progressed for
    this.compositor = new Compositor(); // ? Draw layers in order
    this.entities = new Set(); // ? Only allows one instance of every entity in the level
    this.tiles = new Matrix();
    // ? Matrix is used keep data on each background tile that will eventually be drawn
    // ? and is used to help the TileCollider keep track of what can be counted as a collision
    this.tileCollider = new TileCollider(this.tiles);
  }

  update(deltaTime) {
    // ? For each give entity (ex: mario, or specifically createMario() inside /entities/)
    this.entities.forEach((entity) => {
      // ? run its update function, which would be mario's Entity().update()
      // ? which in turn, will loop through and call the update() on mario's Traits, ex: Go(), Jump(), etc
      entity.update(deltaTime);

      // ? if 'mario' has any velocity from Go(), move his position
      // ? then check if mario is colliding with a (collidable) tile
      entity.pos.x += entity.vel.x * deltaTime;
      this.tileCollider.checkX(entity);

      entity.pos.y += entity.vel.y * deltaTime;
      this.tileCollider.checkY(entity);

      // ? Simulate Gravity (constantly give mario gravity, that is reset inside)
      entity.vel.y += this.gravity * deltaTime;
    });

    // ? used inside /layers/ in order to let us know how long the level has progressed for
    this.totalTime += deltaTime;
  }
}
