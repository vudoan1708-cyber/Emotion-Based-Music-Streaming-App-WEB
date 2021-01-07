import star from '@/components/Utils/p5/star';

export default function twinkleEffects(i, j, starDots, p5) {
  // twinkle effects
  const c = p5.random(200, 255);
  const a = p5.random(20, 255);
  p5.fill(c, a);

  star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 4, starDots[i][j].size / 8, 4, p5);
}
