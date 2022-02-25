export function createAnim(frames, frameLen) {
    return function resolveFrame(distance) {
      // ? Math.floor to make it an integer
      // ? % frames.length will make sure the value cannot be the amount of frames the entity has
      // ? so when running, it will be ex: 0...1...2, even if the distance is, for example, 100
      const frameIndex = Math.floor(distance / frameLen) % frames.length;
      const frameName = frames[frameIndex];
      return frameName;
      // const frameIndex = Math.floor(mario.go.distance / 10) % frames.length;
      // const frameName = frames[frameIndex];
    };
  }