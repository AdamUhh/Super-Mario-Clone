import KeyboardState from "./KeyboardState";

export function setupKeyboard(mario) {
  const SPACEBAR = "Space";
  const UP = "KeyW";
  const RIGHT = "KeyD";
  const LEFT = "KeyA";
  const RUN = "ShiftLeft";
  const input = new KeyboardState();
  // ? Will only check for when the user presses the Spacebar
  // ? If the user holds down the Spacebar, it will not continuously register it
  input.addMapping(SPACEBAR, (keyState) => {
    if (keyState) {
      // ? start and cancel is used as mario is able to cancel his jump
      // ? when the user releases the jump/spacebar key
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  }); // ? " " means the Spacebar

  input.addMapping(UP, (keyState) => {
    if (keyState) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  }); // ? " " means the Spacebar

  input.addMapping(RUN, (keyState) => {
    // ? if user is currently pressing RUN/Shift -> 1
    // ? else if user released RUN/Shift -> -1
    // ? if we are not pressing shift, we have much higher drag/resistance (mario becomes slower)
    // mario.go.dragFactor = keyState ? 1 / 5000 : 1 / 2000;
    mario.turbo(keyState);
  });

  // ? this is useful as if the user presses both keys at the same time
  // ? it will stop mario from moving (as direction will equal to 1 + (-1) = 0)
  input.addMapping(RIGHT, (keyState) => {
    // ? if user is currently pressing RIGHT/KeyD -> 1
    // ? else if user released RIGHT/KeyD -> -1
    mario.go.direction += keyState ? 1 : -1;
  });
  input.addMapping(LEFT, (keyState) => {
    // ? if user is currently pressing LEFT/KeyA -> -1
    // ? else if user released LEFT/KeyA -> 1
    mario.go.direction += keyState ? -1 : 1;
  });

  return input;
}
