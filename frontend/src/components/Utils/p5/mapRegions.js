/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
// export default function mapRegions(i, j, star_i, starDots) {
//   // the centred dot
//   if (i === Math.floor(starDots.length / 2) && j === Math.floor(starDots[star_i].length / 2)) {
//     return 0;

//   // TOP LEFT (ANGRY)
//   } else if (i >= 0 && i < Math.floor(starDots.length / 2)
//     && j >= 0 && j < Math.floor(starDots[star_i].length / 2)) {
//     return 1;

//   // TOP RIGHT (HAPPY / EXCITED)
//   } else if (i > Math.floor(starDots.length / 2) && i < starDots.length
//     && j >= 0 && j < Math.floor(starDots[star_i].length / 2)) {
//     return 2;

//   // BOTTOM LEFT (SAD)
//   } else if (i >= 0 && i < Math.floor(starDots.length / 2)
//     && j > Math.floor(starDots[star_i].length / 2) && j < starDots[star_i].length) {
//     return 3;

//   // BOTTOM RIGHT (CALM / RELAXED)
//   } else if (i > Math.floor(starDots.length / 2) && i < starDots.length
//     && j > Math.floor(starDots[star_i].length / 2) && j < starDots[star_i].length) {
//     return 4;
//   }
// }

const CONSTRAINTS = 0;

export default function mapRegions(x, y, width, height) {
  // the centred dot
  if (x === (width / 2) && y === (height / 2)) {
    return 0;

  // TOP LEFT (ANGRY)
  } else if (x >= CONSTRAINTS && x <= (width / 2)
    && y >= CONSTRAINTS && y <= (height / 2)) {
    return 1;

  // TOP RIGHT (HAPPY / EXCITED)
  } else if (x >= (width / 2) && x < width - CONSTRAINTS
    && y >= CONSTRAINTS && y <= (height / 2)) {
    return 2;

  // BOTTOM LEFT (SAD)
  } else if (x >= CONSTRAINTS && x <= (width / 2)
    && y >= (height / 2) && y < height - CONSTRAINTS) {
    return 3;

  // BOTTOM RIGHT (CALM / RELAXED)
  } else if (x >= (width / 2) && x < width - CONSTRAINTS
    && y >= (height / 2) && y < height - CONSTRAINTS) {
    return 4;
  }
}
