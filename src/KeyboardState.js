const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
  constructor() {
    this.keyStates = new Map(); // ? Holds the current state of a given key
    this.keyMap = new Map(); // ? Holds the callback functions for a key
  }

  addMapping(code, callback) {
    // ? Add a key 'code' to listen to and add a callback/function
    // ? to run when that key is pressed
    this.keyMap.set(code, callback);
  }

  handleEvent(event) {
    const { code } = event;
    if (!this.keyMap.has(code)) {
      // ? If the user pressed a key that we dont need in the application
      // ? if the user pressed, for example, the Spacebar to jump, continue, else return
      return;
    }
    // ? Prevent the keys from affecting the screen
    // ? ex: if the user presses PageDown, it will not scroll down due to preventDefault()
    event.preventDefault();

    // ? Is the key being pressed or did the user let go of the key
    const keyState = event.type === "keydown" ? PRESSED : RELEASED;

    // ? If the key state is still being pressed/is released, return
    // ? This is to not run (the below) code when the same key is
    // ? continuously being pressed (same state)
    if (this.keyStates.get(code) === keyState) return;

    // ? If the key state has changed, change keyState
    this.keyStates.set(code, keyState);

    this.keyMap.get(code)(keyState);
  }

  listenTo(window) {
    ["keydown", "keyup"].forEach((eventName) => {
      window.addEventListener(eventName, (event) => {
        this.handleEvent(event);
      });
    });
  }
}
