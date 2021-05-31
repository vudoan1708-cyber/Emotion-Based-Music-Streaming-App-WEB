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

// GEOMETRY ALGORITHMS
export const VECTORS = [];

function removeVectors() {
  VECTORS.splice(0, VECTORS.length);
}

export function updateVectors(a, b) {
  const newX = a.x + b.x;
  const newY = a.y + b.y;

  removeVectors();
  return { newX, newY };
}

export function storeVectors(v) {
  VECTORS.push(v);
}

export function checkVectorsArrayLength() {
  return VECTORS.length;
}
