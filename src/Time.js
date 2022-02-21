export default class Timer {
  // ? deltaTime is a constant used to figure out how long has passed between each frame
  constructor(deltaTime = 1 / 60) {
    // ? This part is used to decouple/separate the internal frame rate of the game
    // ? from the rendering frame rate
    // ? This means that if a client has a slower or higher fps,
    // ? the way mario jumps wont differ (mario will always jump the exact same, no matter what)
    let accumulatedTime = 0;
    let lastTime = 0;

    // ? This is a proxy for the this.update, in order to control when an update will happen
    // ? via the while loop
    this.updateProxy = (time) => {
      // ? take into account how much real time has passed between each frame/update
      // ? and add it to the accumulatedTime.
      // ? By doing this, we can have an extremely small difference between
      // ? accumulatedTime and deltaTime, for example
      // ? Output: accumulatedTime: 0.02296100000000007
      // ? Output: deltaTime: 0.016666666666666666 (1/60)
      accumulatedTime += (time - lastTime) / 1000;

      while (accumulatedTime > deltaTime) {
        // ? If the time that has passed from the last frame is now greater than deltaTime
        // ? call the update function to re-render the game,
        this.update(deltaTime);
        accumulatedTime -= deltaTime;
      }

      lastTime = time;

      this.enqueue();
    };
  }

  enqueue() {
    // ? This will call the provided function whenever the browser is ready to draw something on the screen
    // ? This also takes into account the clients fps, which is bad, hence the deltaTime... fix
    requestAnimationFrame(this.updateProxy); // ? update only this.updateProxy
  }

  start() {
    this.enqueue();
  }
}
