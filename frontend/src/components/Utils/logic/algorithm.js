// MAPPING ALGORITHMS
const OFFSET = 15.4;

export function indicesToMood(i, j, starDots) {
  const valence = i / starDots.length;
  const arousal = 1 - j / starDots[i].length;
  return { valence, arousal };
}

export function moodToCoordinates(valence, arousal, starDots, width, height) {
  const i = Math.floor(valence * starDots.length);
  const j = Math.floor((1 - arousal) * starDots[i].length);

  const x = width / 5 + i * OFFSET;
  const y = height / 5 + j * OFFSET;
  return { x, y };
}

export function coordinatesToIndices(x, y, width, height) {
  const i = Math.floor((x - width / 5) / OFFSET);
  const j = Math.floor((y - height / 5) / OFFSET);
  return { i, j };
}

export function indicestoCoordinates(i, j, width, height) {
  const x = width / 5 + i * OFFSET;
  const y = height / 5 + j * OFFSET;

  return { x, y };
}
