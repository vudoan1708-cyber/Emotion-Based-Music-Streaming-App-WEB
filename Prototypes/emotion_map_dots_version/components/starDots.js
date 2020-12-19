class StarDots {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  show(hovered) {
    if (!hovered)
      ellipse(this.x, this.y, this.size);
    else ellipse(this.x, this.y, 20);
  }

  showPaths(size) {
    ellipse(this.x, this.y, size);
  }

  onHover() {
    if (mouseX > this.x - this.size / 2 && mouseX < this.x + this.size / 2) {
      if (mouseY > this.y - this.size / 2 && mouseY < this.y + this.size / 2) {
        return true;
      }
    } else return false;
  }
}