// MAPPING ALGORITHMS
export function indicesToMood(i, j, starDots) {
  const valence = i / starDots.length;
  const arousal = 1 - j / starDots[i].length;
  return { valence, arousal };
}

export function moodToCoordinates(valence, arousal, starDots, width, height) {
  const i = Math.floor(valence * starDots.length);
  const j = Math.floor((1 - arousal) * starDots[i].length);

  const x = width / 5 + i * 15.4;
  const y = height / 5 + j * 15.4;
  return { x, y };
}

export function coordinatesToIndices(width, height, p5) {
  const i = Math.floor((p5.mouseX - width / 5) / 15.4);
  const j = Math.floor((p5.mouseY - height / 5) / 15.4);
  return { i, j };
}
