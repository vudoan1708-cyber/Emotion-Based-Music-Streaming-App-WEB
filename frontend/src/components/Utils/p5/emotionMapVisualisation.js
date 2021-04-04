/* eslint-disable padded-blocks */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import StarDots from '@/components/Utils/p5/classes/starDots';
import star from '@/components/Utils/p5/star';
// import mapRegions from '@/components/Utils/p5/mapRegions';

import make2dArray from '@/components/Utils/logic/array';

// import { songDots } from '@/components/Utils/p5/songVisualisation';

import { coordinatesToIndices, indicesToMood } from '@/components/Utils/logic/algorithm';

// scoped functions
// function drawLines(i, j, starDots, p5) {
//   p5.push();
//   p5.stroke(200, 220);
//   p5.strokeWeight(4.5);

//   // VERTICAL LINE
//   p5.line(starDots[i][j].x, starDots[i][j].y, starDots[i][j].x, starDots[i][Math.floor(starDots[i].length / 2)].y);

//   // HORIZONTAL LINE
//   p5.line(starDots[i][j].x, starDots[i][j].y, starDots[Math.floor(starDots.length / 2)][j].x, starDots[i][j].y);
//   p5.pop();
// }

// function drawHighlights(i, j, starDots, p5) {
//   p5.push();
//   p5.fill(255);
//   starDots[i][j].show(p5);
//   p5.pop();
// }

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

// function mutateMapProps(map, mapName, emitter, starDots, width, height, p5) {
//   // Keep Track of Affective Values on The Emotion Map
//   const mood = posOnMap(width, height, starDots, p5);
//   // eslint-disable-next-line valid-typeof
//   map.i = typeof (mood.valence) === 'number' ? (mood.valence).toFixed(3) : NaN;
//   map.j = typeof (mood.arousal) === 'number' ? (mood.arousal).toFixed(3) : NaN;

//   map.name = mapName;
//   emitter.emit('map', map);
// }

// function fillStarsColor(i, j, isClicked, starDots, chosenPoints, showMap, map, emitter, width, height, p5) {
//   // effects for separate regions
//   // hovering only affects one selected region
//   const region = mapRegions(i, j, i, starDots);

//   let green = ((i + j) * 3.5);
//   let blue = ((i + j) * 3.5);
//   let red = ((i + j) * 3.5);
//   let alpha = 255 - ((i + j) * 3.5);

//   p5.push();

//   // the centred dot
//   if (region === 0) {

//     if (starDots[i][j].onHover(isClicked)) {

//       // draw highlighted dot
//       drawHighlights(i, j, starDots, p5);

//       // draw guidlines
//       drawLines(i, j, starDots, p5);

//       p5.fill(255, 0, 0);
//       star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);
//     }
//     p5.fill(0);
//     star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);

//     // TOP LEFT (AGGRESSIVENESS)
//   } else if (region === 1 && showMap === 1) {

//     if (starDots[i][j].onHover(isClicked)) {

//       // draw highlighted dot
//       drawHighlights(i, j, starDots, p5);

//       // draw guidlines
//       drawLines(i, j, starDots, p5);
//       p5.fill(255, 0, 0);
//       star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);

//       mutateMapProps(map, 'Land of Aggressiveness', emitter, starDots, width, height, p5);
//     }

//     // red
//     p5.fill(225, green, blue, alpha);

//     star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);

//     // BOTTOM LEFT (SAD)
//   } else if (region === 3 && showMap === 3) {

//     if (starDots[i][j].onHover(isClicked)) {

//       // draw highlighted dot
//       drawHighlights(i, j, starDots, p5);

//       // draw guidlines
//       drawLines(i, j, starDots, p5);

//       p5.fill(255, 0, 0);
//       star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);

//       mutateMapProps(map, 'Land of Sadness', emitter, starDots, width, height, p5);
//     }

//     // blue
//     red = (100 * i) / j;
//     green = (100 * i) / j;
//     p5.fill(red, green, 255, alpha);
//     star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);

//     // TOP RIGHT (HAPPY / EXCITED)
//   } else if (region === 2 && showMap === 2) {

//     if (starDots[i][j].onHover(isClicked)) {

//       // draw highlighted dot
//       drawHighlights(i, j, starDots, p5);

//       // draw guidlines
//       drawLines(i, j, starDots, p5);

//       p5.fill(255, 0, 0);
//       star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);

//       mutateMapProps(map, 'Land of Excitement', emitter, starDots, width, height, p5);
//     }

//     // green
//     red = (255 * (j + 5)) / i;
//     blue = (255 * (j + 5)) / i;
//     alpha = (i / (j + 5)) * 50;

//     p5.fill(red + 40, 255, blue + 40, alpha);
//     star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);

//     // BOTTOM RIGHT (CALM / RELAXED)
//   } else if (region === 4 && showMap === 4) {

//     if (starDots[i][j].onHover(isClicked)) {

//       // draw highlighted dot
//       drawHighlights(i, j, starDots, p5);

//       // draw guidlines
//       drawLines(i, j, starDots, p5);

//       p5.fill(255, 0, 0);
//       star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);

//       mutateMapProps(map, 'Land of Calmness', emitter, starDots, width, height, p5);
//     }

//     // pink
//     p5.fill(220, 255 - green, 250, 255 - alpha);
//     star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);

//     // dots on the unselected ones
//   } else {
//     p5.fill(90, 150);
//     star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);
//   }

//   p5.pop();
// }

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

export function drawMap(width, height, isClicked, starDots, chosenPoints, showMap, map, emitter, p5) {
  p5.push();
  p5.noStroke();

  for (let i = 0; i < starDots.length; i += 1) {
    for (let j = 0; j < starDots[i].length; j += 1) {
      if (!isClicked) {
        // twinkle effects
        // const c = p5.random(200, 255);
        // const a = p5.random(20, 255);
        // p5.fill(c, a);

        // star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 4, starDots[i][j].size / 8, 4, p5);

        // fillStarsColor(i, j, isClicked, starDots, chosenPoints, showMap, map, emitter, width, height, p5);
      } else {
        // fillStarsColor(i, j, isClicked, starDots, chosenPoints, showMap, map, emitter, width, height, p5);

        // a circle represents a chosen dot
        // drawHighlights(chosenPoints[0], chosenPoints[1], starDots, p5);

        // zone of the accepted
        starDots[chosenPoints[0]][chosenPoints[1]].showZoneofTheAccepted(width, height);

        // red star on top
        p5.fill(255, 0, 0);
        star(starDots[chosenPoints[0]][chosenPoints[1]].x, starDots[chosenPoints[0]][chosenPoints[1]].y,
          starDots[chosenPoints[0]][chosenPoints[1]].size / 2, starDots[chosenPoints[0]][chosenPoints[1]].size / 4, 4, p5);
      }
    }
  }
  p5.pop();
}
