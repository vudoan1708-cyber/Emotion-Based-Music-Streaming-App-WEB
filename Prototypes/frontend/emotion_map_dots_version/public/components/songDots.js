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

      if (this.label === 'accepted')
        fill(0, 180, 0, 200);
      else fill(150, 200);
      ellipse(this.x, this.y, this.size);
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