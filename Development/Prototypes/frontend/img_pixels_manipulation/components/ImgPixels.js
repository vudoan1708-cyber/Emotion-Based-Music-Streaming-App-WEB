class ImgPixels {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  show() {
    rect(this.x, this.y, this.size, this.size);
  }
}