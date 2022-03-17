import { loadJSON } from "../loaders";
import MusicPlayer from "../MusicPlayer";

export function loadMusicSheet(name) {
  // ? name would be ex: 'overworld' for overworld.json inside /public/music/

  return loadJSON(`music/${name}.json`).then((musicSheet) => {
    const musicPlayer = new MusicPlayer();
    for (const [name, track] of Object.entries(musicSheet)) {
      musicPlayer.addTrack(name, track.url);
    }

    return musicPlayer;
  });
}
