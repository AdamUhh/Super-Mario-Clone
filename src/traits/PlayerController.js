import { Trait } from "../Entity.js";
import { Vec2 } from "../math.js";

export default class PlayerController extends Trait {
  constructor() {
    // ? this is to keep track of mario
    // ? used to reset mario when he dies
    super("playerController");

    this.checkpoint = new Vec2(0, 0);
    this.player = null;
    this.score = 0;
    this.time = 300;
  }

  setPlayer(entity) {
    this.player = entity;

    // ? (create) a function that is run whenever we emit 'stomp' (inside /Stomper.js/)
    this.player.stomper.events.listen("stomp", () => {
      this.score += 100;
    });
  }

  update(entity, { deltaTime }, level) {
    // ? if the player is not in the level
    if (!level.entities.has(this.player)) {
      // ? revive the player incase he is killed
      this.player.killable.revive();
      this.player.pos.set(this.checkpoint.x, this.checkpoint.y); // ? to a checkpoint
      level.entities.add(this.player); // ? add player back to the level
    } else {
      this.time -= deltaTime * 2;
    }
  }
}
