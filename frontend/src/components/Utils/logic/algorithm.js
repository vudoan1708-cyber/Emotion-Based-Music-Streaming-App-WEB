// MAPPING ALGORITHMS
export const OFFSET = 18;

export function indicesToMood(i, j, starDots) {
  const valence = i / starDots.length;
  const arousal = 1 - j / starDots[i].length;
  return { valence, arousal };
}

export function moodToCoordinates(valence, arousal, starDots, width, height) {
  const i = Math.floor(valence * starDots.length);
  const j = Math.floor((1 - arousal) * starDots[i].length);

  const x = width / 4 + i * OFFSET;
  const y = height / 4 + j * OFFSET;
  return { x, y };
}

export function coordinatesToIndices(x, y, width, height) {
  const i = Math.floor((x - width / 4) / OFFSET);
  const j = Math.floor((y - height / 4) / OFFSET);
  return { i, j };
}

export function indicestoCoordinates(i, j, width, height) {
  const x = width / 4 + i * OFFSET;
  const y = height / 4 + j * OFFSET;

  return { x, y };
}
