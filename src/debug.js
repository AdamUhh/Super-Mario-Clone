export function setupMouseControl(canvas, entity, camera) {
  let lastEvent;

  //? Used for debugging (will spawn entity/mario to wherever the mouse (down) is)
  ["mousedown", "mousemove"].forEach((eventName) => {
    canvas.addEventListener(eventName, (event) => {
      if (event.buttons === 1) {
        entity.vel.set(0, 0);
        entity.pos.set(
          event.offsetX + camera.pos.x,
          event.offsetY + camera.pos.y
        );
      } else if (
        event.buttons === 2 &&
        lastEvent &&
        lastEvent.buttons === 2 &&
        lastEvent.type === "mousemove"
      ) {
        // ? right mouse button
        // ? this allows you to drag the CAMERA around the screen
        camera.pos.x -= event.offsetX - lastEvent.offsetX;
      }
      // ? This is to check whether the previous event was user still holding the
      // ? right mouse button and whether he is moving the mouse/dragging mario
      // ? (used in the else if condition above)
      lastEvent = event;
    });

    // ? block context menu when right clicking on the canvas
    canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  });
}
