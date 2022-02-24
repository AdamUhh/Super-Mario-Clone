import { Vec2 } from "./math";

export default class Camera {
  constructor() {
    // ? Position of the camera
    this.pos = new Vec2(0, 0);
    // ? Size of the camera on the screen
    this.size = new Vec2(256, 224);
  }
}
