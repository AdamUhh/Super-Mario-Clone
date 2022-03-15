import { Trait } from "../Entity.js";

export default class Player extends Trait {
  constructor() {
    // ? super references the constructor of Trait.NAME
    super("player");

    this.lives = 3;
    this.score = 0;
  }
}
