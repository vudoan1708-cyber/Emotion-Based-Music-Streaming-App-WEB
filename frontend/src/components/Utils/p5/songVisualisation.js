/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
// eslint-disable-next-line import/no-cycle
import SongDots from '@/components/Utils/p5/classes/songDots';
import { moodToCoordinates } from '@/components/Utils/logic/algorithm';

const songDots = [];

let songLoaded = false;

export function createSongDots(label, title, valence, arousal, id, starDots, width, height, p5, emitter) {
  // reverse the mapping algorithm to get the location values from valence and arousal
  const coordinates = moodToCoordinates(valence, arousal, starDots, width, height);

  const song = new SongDots(label, title, id, valence, arousal, coordinates.x, coordinates.y, 10, p5);

  // console.log(`Song's Valence, Arousal: ${valence}, ${arousal}, amd indices: ${i}, ${j}`);
  songDots.push(song);
  songLoaded = true;

  // emit the songDots instances one at a time
  emitter.emit('song_data', song);
}

export function drawSongDots(starDots, chosenPoints) {
  if (songLoaded) {
    for (let i = 0; i < songDots.length; i += 1) {
      songDots[i].show();

      // live updating every song dots positions
      songDots[i].updateLabels(starDots, chosenPoints);
    }
  }
}
