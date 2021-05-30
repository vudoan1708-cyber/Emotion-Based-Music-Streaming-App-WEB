/* eslint-disable padded-blocks */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import StarDots from '@/components/Utils/p5/classes/starDots';
// import mapRegions from '@/components/Utils/p5/mapRegions';

import make2dArray from '@/components/Utils/logic/array';

// import { songDots } from '@/components/Utils/p5/songVisualisation';

import { OFFSET, coordinatesToIndices, indicesToMood } from '@/components/Utils/logic/algorithm';

export function mapConstraintVisualisation(width, height, starDots, p5) {

  const indices = {
    i1: 0,
    i2: starDots[starDots.length - 1][0].i,
    j1: 0,
    j2: starDots[0][starDots[0].length - 1].j,
  };

  // create new coordinate properties from those marks
  const newPos = {
    x1: width / 4.35 + indices.i1 * OFFSET,
    x2: width / 4.35 + (indices.i2 + 1) * OFFSET,
    y1: height / 4.5 + indices.j1 * OFFSET,
    y2: height / 4.5 + (indices.j2 + 1) * OFFSET,
  };

  p5.push();
  p5.strokeWeight(2.5);
  // Filled Rect As A Coverage
  p5.fill(50, 75);
  p5.beginShape();
  p5.vertex(0, 0);
  p5.vertex(width, 0);
  p5.vertex(width, height);
  p5.vertex(0, height);
  p5.endShape(p5.CLOSE);

  p5.fill(0, 200);
  p5.stroke(50, 50, 50, 200);
  p5.beginShape();
  p5.vertex(newPos.x1, newPos.y1);
  p5.vertex(newPos.x2, newPos.y1);
  p5.vertex(newPos.x2, newPos.y2);
  p5.vertex(newPos.x1, newPos.y2);
  p5.endShape(p5.CLOSE);
  p5.pop();
}

export function posOnMap(width, height, starDots, mx, my) {

  // to get affective values
  // start by translating coordinates values to indices
  const indices = coordinatesToIndices(mx, my, width, height);
  if (indices.i >= 0 && indices.i <= starDots[starDots.length - 1][0].i) {
    if (indices.j >= 0 && indices.j <= starDots[0][starDots[0].length - 1].j) {
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
