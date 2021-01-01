/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import SongDots from '@/components/Utils/p5/classes/songDots';

const songDots = [];

let songLoaded = false;

export function createSongDots(label, valence, arousal, id, starDots, width, height, chosenPoints, playlist, p5) {
  // reverse the mapping algorithm to get the location values from valence and arousal
  const i = Math.floor(valence * starDots.length);
  const j = Math.floor((1 - arousal) * starDots[i].length);

  const x = width / 5 + i * 15.4;
  const y = height / 5 + j * 15.4;

  // console.log(`Song's Valence, Arousal: ${valence}, ${arousal}, amd indices: ${i}, ${j}`);
  songDots.push(new SongDots(label, id, x, y, 10, p5));
  songLoaded = true;
}

export function drawSongDots(starDots, chosenPoints, playlist) {
  if (songLoaded) {
    for (let i = 0; i < songDots.length; i += 1) {
      songDots[i].show();

      // for re-collecting songs within The Zone, but aren't included
      // because the Zone hasn't spreaded out to its maximum size
      if (songDots[i].label === 'unaccepted') { songDots[i].updateLabels(starDots, chosenPoints, playlist); }
    }
  }
}
