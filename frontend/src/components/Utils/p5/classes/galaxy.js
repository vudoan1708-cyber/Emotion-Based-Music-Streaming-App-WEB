import star from '@/components/Utils/p5/star';

export default class GalaxyStars {
  constructor(x, y, s1, s2, c1, c2) {
    this.x = x;
    this.y = y;
    this.s1 = s1;
    this.s2 = s2;
    this.c1 = c1;
    this.c2 = c2;
  }

  show(_p5) {
    const p5 = _p5;
    p5.push();

    p5.fill(this.c2, p5.random(255));
    star(this.x, this.y, this.s1 * 1.5, this.s2 * 1.5, 4, p5);

    p5.fill(this.c1, p5.random(200, 255));
    star(this.x, this.y, this.s1 / 1.25, this.s2 / 1.25, 4, p5);
    p5.pop();
  }

  move(mouseX, width) {
    if (mouseX < width / 2) { this.x -= 1.5; } else { this.x += 1.5; }

    if (this.x > width) { this.x = 0; } else if (this.x < 0) { this.x = width; }
  }
}
