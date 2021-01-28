/* eslint-disable indent */
/* eslint-disable consistent-return */
import { OFFSET, indicestoCoordinates } from '@/components/Utils/logic/algorithm';

export default class StarDots {
  constructor(i, j, width, height, size, p5) {
    this.i = i;
    this.j = j;
    this.width = width;
    this.height = height;

    const coordinates = indicestoCoordinates(this.i, this.j, this.width, this.height);
    this.x = coordinates.x;
    this.y = coordinates.y;
    this.size = size;

    this.subt = 0.01;
    this.acc = 0.000125;
    this.angle = 0;

    this.p5 = p5;
  }

  update(categorgy) {
    if (categorgy === 'spread') this.subt += this.acc;
    else this.angle += this.acc;
    this.acc += 0.0000000000001;
  }

  show() {
    this.p5.ellipse(this.x, this.y, 20);
  }

  showBoundaries() {
    // for spread animation
    if (this.subt <= 2.5) this.update('spread');

    // 4 marks on 4 corners relative to the clicked point
    const marks = [this.i - this.subt, this.i + this.subt,
                    this.j - this.subt, this.j + this.subt];

    // create new coordinate properties from those marks
    const newPos = {
      x1: this.width / 4 + marks[0] * OFFSET,
      x2: this.width / 4 + marks[1] * OFFSET,
      y1: this.height / 4 + marks[2] * OFFSET,
      y2: this.height / 4 + marks[3] * OFFSET,
    };
    return newPos;
  }

  showZoneofTheAccepted() {
    const newPos = this.showBoundaries();

    // for orientation animation
    if (this.angle <= this.p5.PI / 2) this.update('orientation');

    // create a white rect from those points
    this.p5.push();
    this.p5.translate(this.x, this.y);
    this.p5.rotate(this.angle);
    this.p5.noFill();
    this.p5.strokeWeight(2.5);
    this.p5.stroke(0, 180, 0, 100);
    this.p5.beginShape();
    this.p5.vertex(newPos.x1 - this.x, newPos.y1 - this.y);
    this.p5.vertex(newPos.x2 - this.x, newPos.y1 - this.y);
    this.p5.vertex(newPos.x2 - this.x, newPos.y2 - this.y);
    this.p5.vertex(newPos.x1 - this.x, newPos.y2 - this.y);
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
