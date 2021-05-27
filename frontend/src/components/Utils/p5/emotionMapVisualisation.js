/* eslint-disable padded-blocks */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import StarDots from '@/components/Utils/p5/classes/starDots';
// import mapRegions from '@/components/Utils/p5/mapRegions';

import make2dArray from '@/components/Utils/logic/array';

// import { songDots } from '@/components/Utils/p5/songVisualisation';

import { coordinatesToIndices, indicesToMood } from '@/components/Utils/logic/algorithm';

export function posOnMap(width, height, starDots, p5) {

  // to get affective values
  /// start by translating coordinates values to indices
  const indices = coordinatesToIndices(p5.mouseX, p5.mouseY, width, height);

  if (indices.i >= 0 && indices.i < starDots[starDots.length - 1][0].i) {
    if (indices.j >= 0 && indices.j < starDots[0][starDots[0].length - 1].j) {
      // then translate those indices to affective values
      const mood = indicesToMood(indices.i, indices.j, starDots);
      const { valence, arousal } = mood;
      return { valence, arousal };
    }
  // eslint-disable-next-line no-dupe-keys
  } return { NaN, NaN };
}

// globally accessible functions
export function createMap(width, height, starDots, p5) {
  // make a 2D array
  starDots = make2dArray(Math.floor(width / 45), Math.floor(height / 42));

  // instantiate the starDots object
  for (let i = 0; i < starDots.length; i += 1) {
    for (let j = 0; j < starDots[i].length; j += 1) {
      starDots[i][j] = new StarDots(i, j, width, height, p5.random(5, 12), p5);
    }
  }

  return starDots;
}

export function drawMap(isClicked, starDots, chosenPoints, p5) {
  p5.push();
  p5.noStroke();

  for (let i = 0; i < starDots.length; i += 1) {
  //   for (let j = 0; j < starDots[i].length; j += 1) {
    if (isClicked) {
      starDots[chosenPoints[0]][chosenPoints[1]].showZoneofTheAccepted();
    }
  //   }
  }
  p5.pop();
}
