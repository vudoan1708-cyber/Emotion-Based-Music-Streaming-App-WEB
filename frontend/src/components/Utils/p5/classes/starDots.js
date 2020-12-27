/* eslint-disable consistent-return */
export default class StarDots {
  constructor(i, j, width, height, size, p5) {
    this.i = i;
    this.j = j;
    this.x = width / 5 + i * 15.4;
    this.y = height / 5 + j * 15.4;
    this.size = size;

    this.subt = 0.01;
    this.acc = 0.000125;
    this.p5 = p5;
  }

  update() {
    this.subt += this.acc;
    this.acc += 0.0000000000001;
  }

  show() {
    this.p5.ellipse(this.x, this.y, 20);
  }

  showZoneofTheAccepted(width, height) {
    // for animation
    if (this.subt <= 1) this.update();

    // 4 marks on 4 corners relative to the clicked point
    const marks = [this.i - this.subt, this.i + this.subt, this.j - this.subt, this.j + this.subt];

    // create new properties from those marks, relatively to the map
    const newPos = {
      x1: width / 5 + marks[0] * 15.4,
      x2: width / 5 + marks[1] * 15.4,
      y1: height / 5 + marks[2] * 15.4,
      y2: height / 5 + marks[3] * 15.4,
    };

    // create a white rect from those points
    this.p5.push();
    this.p5.fill(255, 150);
    this.p5.strokeWeight(3);
    this.p5.stroke(180);
    this.p5.beginShape();
    this.p5.vertex(newPos.x1, newPos.y1);
    this.p5.vertex(newPos.x2, newPos.y1);
    this.p5.vertex(newPos.x2, newPos.y2);
    this.p5.vertex(newPos.x1, newPos.y2);
    this.p5.endShape(this.p5.CLOSE);
    this.p5.pop();
  }

  onHover(isClicked) {
    if (!isClicked) {
      if (this.p5.mouseX > this.x - this.size / 2 && this.p5.mouseX < this.x + this.size / 2) {
        if (this.p5.mouseY > this.y - this.size / 2 && this.p5.mouseY < this.y + this.size / 2) {
          return true;
        }
      } else return false;
    }
  }
}
