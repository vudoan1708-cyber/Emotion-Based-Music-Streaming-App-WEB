class ImgPixels {
  constructor(x, y, size, red, green, blue) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  show() {
    fill(this.red, this.green, this.blue);
    rect(this.x, this.y, this.size, this.size);
  }
}