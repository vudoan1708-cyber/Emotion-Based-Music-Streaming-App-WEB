// MAPPING ALGORITHMS
export const OFFSET = 25;

export function indicesToMood(i, j, starDots) {
  const valence = i / starDots.length;
  const arousal = 1 - j / starDots[i].length;
  return { valence, arousal };
}

export function moodToIndices(valence, arousal, starDots) {
  const i = Math.floor(valence * starDots.length);
  const j = Math.floor((1 - arousal) * starDots[i].length);
  return { i, j };
}

export function moodToCoordinates(valence, arousal, starDots, width, height) {
  // const i = Math.floor(valence * starDots.length);
  // const j = Math.floor((1 - arousal) * starDots[i].length);

  // avoid rounding up decimal values for variant results
  const i = valence * starDots.length;
  const j = (1 - arousal) * starDots[Math.floor(i)].length;

  const x = width / 4.35 + i * OFFSET;
  const y = height / 4.5 + j * OFFSET;
  return { x, y };
}

export function coordinatesToIndices(x, y, width, height) {
  const i = Math.floor((x - width / 4.35) / OFFSET);
  const j = Math.floor((y - height / 4.5) / OFFSET);
  return { i, j };
}

export function indicestoCoordinates(i, j, width, height) {
  const x = width / 4.35 + i * OFFSET;
  const y = height / 4.5 + j * OFFSET;
  return { x, y };
}

export function zoom(zoomFactor, roi, x, y, p5, reverse) {
  const OFFSET_ZOOM = {
    x: 0,
    y: 0,
  };

  if (zoomFactor === 0) {
    return OFFSET_ZOOM;
  }
  // Calculate the distance between the mouse coordinates and each song dot's coordinates
  const d = !reverse
    ? Math.floor(p5.dist(roi.x, roi.y, x, y) / Math.abs(zoomFactor))
    : -Math.floor(p5.dist(roi.x, roi.y, x, y) / Math.abs(zoomFactor));

  // Find distance ratio between the current node and the previous node
  // const ratio = dMouseCurrent / dMousePrev;
  // console.log(ratio, dCurrentPrev);

  // Check for the sign of the zoomFactor argument
  // if it is positive, which means, zooming in (for now)
  if (Math.sign(zoomFactor) === 1) {
    if (x < roi.x) {
      OFFSET_ZOOM.x = -d;
    } else if (x > roi.x) OFFSET_ZOOM.x = d;

    if (y < roi.y) {
      OFFSET_ZOOM.y = -d;
    } else if (y > roi.y) OFFSET_ZOOM.y = d;

  // otherwise, if it is negative, which means, zooming out
  } else {
    if (x < roi.x) {
      OFFSET_ZOOM.x = d;
    } else if (x > roi.x) OFFSET_ZOOM.x = -d;

    if (y < roi.y) {
      OFFSET_ZOOM.y = d;
    } else if (y > roi.y) OFFSET_ZOOM.y = -d;
  }
  return OFFSET_ZOOM;
}

// VECTOR-BASED ALGORITHMS
export const VECTORS = [];

function removeVectors() {
  VECTORS.splice(0, VECTORS.length);
}

export function updateVectors(a, b) {
  const newDX = a.x + b.x;
  const newDY = a.y + b.y;

  removeVectors();
  return { newDX, newDY };
}

export function storeVectors(vx, vy) {
  const v = {
    x: vx,
    y: vy,
  };
  VECTORS.push(v);
}

export function checkVectorsArrayLength() {
  return VECTORS.length;
}

// RULE OF THREE
export function ruleOfThree(a, aRelated, b) {
  // Find b_related
  return (b * aRelated) / a;
}
