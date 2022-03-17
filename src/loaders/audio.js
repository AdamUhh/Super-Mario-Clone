import AudioBoard from "../AudioBoard";
import { loadJSON } from "../loaders";

export function createAudioLoader(audioContext) {
  // ? will decode the provided audio file (url)
  return function loadAudio(url) {
    return fetch(url)
      .then((response) => {
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        return audioContext.decodeAudioData(arrayBuffer);
      });
  };
}

export function loadAudioBoard(name, audioContext) {
  // ? name would be ex: 'mario' for mario.json inside /public/sounds/
  
  const loadAudio = createAudioLoader(audioContext);
  return loadJSON(`sounds/${name}.json`).then((audioSheet) => {
    // ? returns an audioBoard where all the audio is ready to play
    const audioBoard = new AudioBoard();
    // ? fx output, ex: jump: {url: '/audio/fx/jump.ogg'}, stomp: {url: '/audio/fx/stomp.ogg'}
    const fx = audioSheet.fx;
    const jobs = [];
    Object.keys(fx).forEach((name) => {
      const url = fx[name].url;
      const job = loadAudio(url).then((buffer) => {
        audioBoard.addAudio(name, buffer);
      });
      jobs.push(job);
    });
    return Promise.all(jobs).then(() => audioBoard);
  });
}
