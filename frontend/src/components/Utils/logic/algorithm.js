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
  const i = Math.floor(valence * starDots.length);
  const j = Math.floor((1 - arousal) * starDots[i].length);

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
