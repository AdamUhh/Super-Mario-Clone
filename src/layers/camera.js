// ? This is purely for testing and checking the way the camera works
export function createCameraLayer(cameraToDraw) {
  // ? cameraToDraw is the camera rectangle that we will draw (purple)
  // ? fromCamera is the perspective we draw from
  return function drawCameraRect(context, fromCamera) {
    context.strokeStyle = "purple";
    context.beginPath();
    context.rect(
      // ? two be honest, i dont understand why this cant be 0,0
      // ? perhaps later in the video he will explain why
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y
    );
    context.stroke();
  };
}
