/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import StarDots from '@/components/Utils/p5/classes/starDots';
import star from '@/components/Utils/p5/star';
import make2dArray from '@/components/Utils/logic/array';

import { coordinatesToIndices } from '@/components/Utils/logic/algorithm';

// scoped functions
function drawLines(i, j, starDots, p5) {
  p5.push();
  p5.stroke(200, 220);
  p5.strokeWeight(4.5);

  // VERTICAL LINE
  p5.line(starDots[i][j].x, starDots[i][j].y, starDots[i][j].x, starDots[i][Math.floor(starDots[i].length / 2)].y);

  // HORIZONTAL LINE
  p5.line(starDots[i][j].x, starDots[i][j].y, starDots[Math.floor(starDots.length / 2)][j].x, starDots[i][j].y);
  p5.pop();
}

function drawHighlights(i, j, starDots, p5) {
  p5.push();
  p5.fill(255);
  starDots[i][j].show(p5);
  p5.pop();
}

function fillStarsColor(i, j, isClicked, starDots, p5) {
  p5.push();
  if (starDots[i][j].onHover(isClicked)) {
    // draw highlighted dot
    drawHighlights(i, j, starDots, p5);

    // draw guidlines
    drawLines(i, j, starDots, p5);

    p5.fill(255, 0, 0);

    // the centred dot
  } else if (i === Math.floor(starDots.length / 2) && j === Math.floor(starDots[i].length / 2)) {
    p5.fill(0);

    // TOP LEFT (ANGRY)
  } else if (i >= 0 && i < Math.floor(starDots.length / 2)
            && j >= 0 && j < Math.floor(starDots[i].length / 2)) {
    // orange
    p5.fill(200, 98, 20, 90);

    // BOTTOM LEFT (SAD)
  } else if (i >= 0 && i < Math.floor(starDots.length / 2)
            && j > Math.floor(starDots[i].length / 2) && j < starDots[i].length) {
    // blue
    p5.fill(73, 27, 180, 90);

    // TOP RIGHT (HAPPY / EXCITED)
  } else if (i > Math.floor(starDots.length / 2) && i < starDots.length
            && j >= 0 && j < Math.floor(starDots[i].length / 2)) {
    // green
    p5.fill(176, 220, 90, 90);

    // BOTTOM RIGHT (CALM / RELAXED)
  } else if (i > Math.floor(starDots.length / 2) && i < starDots.length
        && j > Math.floor(starDots[i].length / 2) && j < starDots[i].length) {
    // pink
    p5.fill(180, 83, 250, 90);

    // dots on the intersection lines
  } else {
    p5.fill(220, 150);
  }

  // show all stars with different colours depending on different conditions
  star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4, p5);
  p5.pop();
}

// globally accessible functions
export function createMap(width, height, starDots, p5) {
  // make a 2D array
  starDots = make2dArray(Math.floor(width / 25), Math.floor(height / 25));

  // instantiate the starDots object
  for (let i = 0; i < starDots.length; i += 1) {
    for (let j = 0; j < starDots[i].length; j += 1) {
      starDots[i][j] = new StarDots(i, j, width, height, p5.random(5, 12), p5);
    }
  }

  return starDots;
}

export function drawMap(width, height, isClicked, starDots, chosenPoints, p5) {
  p5.push();
  p5.noStroke();

  for (let i = 0; i < starDots.length; i += 1) {
    for (let j = 0; j < starDots[i].length; j += 1) {
      if (!isClicked) {
        // twinkle effects
        const c = p5.random(200, 255);
        const a = p5.random(20, 255);
        p5.fill(c, a);

        star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 4, starDots[i][j].size / 8, 4, p5);

        fillStarsColor(i, j, isClicked, starDots, p5);
      } else {
        fillStarsColor(i, j, isClicked, starDots, p5);

        // a circle represents a chosen dot
        drawHighlights(chosenPoints[0], chosenPoints[1], starDots, p5);

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

export function posOnMap(width, height, starDots, p5) {
  const indices = coordinatesToIndices(p5.mouseX, p5.mouseY, width, height);

  if (indices.i > 0 && indices.i < starDots[starDots.length - 1][0].i) {
    if (indices.j > 0 && indices.j < starDots[0][starDots[0].length - 1].j) {
      const { i, j } = indices;
      return { i, j };
    }
  // eslint-disable-next-line no-dupe-keys
  } return { NaN, NaN };
}
