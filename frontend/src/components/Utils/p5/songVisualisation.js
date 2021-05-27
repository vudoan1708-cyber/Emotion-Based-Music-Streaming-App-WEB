/* eslint-disable camelcase */
/* eslint-disable indent */
// eslint-disable-next-line import/no-cycle
import SongDots from '@/components/Utils/p5/classes/songDots';
import { moodToCoordinates } from '@/components/Utils/logic/algorithm';

export const songDots = [];

let songLoaded = false;
let songIndex = -1;

export function createSongDots(label, title, valence, arousal, id,
                              album_imgs, artist_details, artist_names, external_urls,
                              beforeLoading, starDots, width, height, p5, emitter) {
  // reverse the mapping algorithm to get the location values from valence and arousal
  const coordinates = moodToCoordinates(valence, arousal, starDots, width, height);

  const song = new SongDots(label, title, id, valence, arousal,
                            album_imgs, artist_details, artist_names, external_urls,
                            coordinates.x, coordinates.y, p5.random(3, 5), width, height, p5);

  songDots.push(song);
  songLoaded = true;

  const emitData = {
    song,
    how: 'add',
    beforeLoading,
  };

  // emit the songDots instances one at a time
  emitter.emit('song_data', emitData);
}

export function drawSongDots(starDots, chosenPoints, emitter) {
  if (songLoaded) {
    for (let i = songDots.length - 1; i >= 0; i -= 1) {
      songDots[i].show();

      if (chosenPoints.length > 0) {
        // live updating every song dots positions
        songDots[i].updateLabels(starDots, chosenPoints);
      }

      // On Hover
      const songOnHover = songDots[i].onHover();
      if (songOnHover) {
        songIndex = i;
        emitter.emit('song_on_hover', songDots[i]);

        if (document.body.style.cursor !== 'pointer') document.body.style.cursor = 'pointer';
      } else {
        // Only send data of null to disable song detail display on the map
        // if the song which is not on hover is the latest one that was hovered on
        // eslint-disable-next-line no-lonely-if
        if (songIndex === i) {
          emitter.emit('song_on_hover', null);

          if (document.body.style.cursor === 'pointer') document.body.style.cursor = 'context-menu';
        }
      }
    }
  }
}
