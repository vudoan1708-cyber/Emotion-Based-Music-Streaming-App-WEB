import star from '@/components/Utils/p5/star';

export default class Neighbours {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  show(p5) {
    p5.push();

    // the white circle
    p5.fill(255);
    p5.ellipse(this.x, this.y, 20);

    p5.fill(0, 0, 255);
    star(this.x, this.y, this.size / 2, this.size / 4, 4, p5);
    p5.pop();
  }
}
