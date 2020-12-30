// @ts-nocheck
class SongDots {
  constructor(label, x, y, size) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  show() {
    push();

      // effects
      noStroke();
      fill(200, 75);
      ellipse(this.x, this.y, this.size + 5);

      stroke(0);
      if (this.label === 'accepted')
        fill(0, 225, 0);
      else fill(150);
      ellipse(this.x, this.y, this.size);

      // effects
      fill(200, 75);
      ellipse(this.x, this.y, this.size - 5);
    pop();
  }

  onHover(isSongLoading) {
    if (isSongLoading) {
      if (mouseX > this.x - this/size / 2 && mouseX < this.x + this.size / 2) {
        if (mouseY > this.y - this/size / 2 && mouseY < this.y + this.size / 2) {
          return true;
        } 
      } return false;
    }
  }
}