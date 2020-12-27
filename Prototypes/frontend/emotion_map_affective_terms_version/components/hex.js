class Hex {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.a = random(255);
  }

  show() {
    strokeWeight(2);
    stroke(this.r, this.g, this.b, this.a);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}