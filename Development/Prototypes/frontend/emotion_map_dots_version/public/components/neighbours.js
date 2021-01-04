class Neighbours {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  show() {
    push();

    // the white circle
      fill(255);
      ellipse(this.x, this.y, 20);

      fill(0, 0, 255);
      star(this.x, this.y, this.size / 2, this.size / 4, 4);
    pop();
  }
}