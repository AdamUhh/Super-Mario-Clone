import KeyboardState from "./KeyboardState";

export function setupKeyboard(entity) {
  const SPACEBAR = "Space";
  const UP = "KeyW";
  const RIGHT = "KeyD";
  const LEFT = "KeyA";
  const input = new KeyboardState();
  // ? Will only check for when the user presses the Spacebar
  // ? If the user holds down the Spacebar, it will not continuously register it
  input.addMapping(SPACEBAR, (keyState) => {
    if (keyState) {
      // ? start and cancel is used as mario is able to cancel his jump
      // ? when the user releases the jump/spacebar key
      entity.jump.start();
    } else {
      entity.jump.cancel();
    }
  }); // ? " " means the Spacebar

  input.addMapping(UP, (keyState) => {
    if (keyState) {
      entity.jump.start();
    } else {
      entity.jump.cancel();
    }
  }); // ? " " means the Spacebar

  input.addMapping(RIGHT, (keyState) => {
    entity.go.direction = keyState;
  });
  input.addMapping(LEFT, (keyState) => {
    entity.go.direction = -keyState;
  });

  return input;
}
