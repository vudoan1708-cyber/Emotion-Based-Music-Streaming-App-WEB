// @ts-nocheck
class StarDots {
  constructor(i, j, size) {
    this.i = i;
    this.j = j;
    this.x = width / 5 + this.i * 15.4;
    this.y = height / 5 + this.j * 15.4;
    this.size = size;

    this.subt = 0.01;
    this.acc = 0.000125;
    this.angle = 0;
  }

  update(categorgy) {
    if (categorgy === 'spread')
      this.subt += this.acc;
    else
      this.angle += this.acc;
    this.acc += 0.0000000000001;
  }

  show() {
    ellipse(this.x, this.y, 20);
  }

  showBoundaries() {
    // for spread animation
    if (this.subt <= 2.5) this.update('spread');
    
    // 4 marks on 4 corners relative to the clicked point
    const marks = [this.i - this.subt, this.i + this.subt, 
                    this.j - this.subt, this.j + this.subt];

    // create new coordinate properties from those marks
    const newPos = {
      x1: width / 5 + marks[0] * 15.4,
      x2: width / 5 + marks[1] * 15.4,
      y1: height / 5 + marks[2] * 15.4,
      y2: height / 5 + marks[3] * 15.4,
    } 
    return newPos;
  }

  showZoneofTheAccepted() {

    const newPos = this.showBoundaries();

    // for orientation animation
    if (this.angle <= PI / 2) this.update('orientation');

    // create a white rect from those points
    push();
      translate(this.x, this.y);
      rotate(this.angle);
      noFill();
      strokeWeight(2.5);
      stroke(0, 180, 0, 100);
      beginShape();
        vertex(newPos.x1 - this.x, newPos.y1 - this.y);
        vertex(newPos.x2 - this.x, newPos.y1 - this.y);
        vertex(newPos.x2 - this.x, newPos.y2 - this.y);
        vertex(newPos.x1 - this.x, newPos.y2 - this.y);
      endShape(CLOSE);

      // rotate(PI / 4);
      // beginShape();
      //   vertex(newPos.x1 - this.x, newPos.y1 - this.y);
      //   vertex(newPos.x2 - this.x, newPos.y1 - this.y);
      //   vertex(newPos.x2 - this.x, newPos.y2 - this.y);
      //   vertex(newPos.x1 - this.x, newPos.y2 - this.y);
      // endShape(CLOSE);
    pop();
  }

  onHover() {
    if (!isClicked) {
      if (mouseX > this.x - this.size / 2 && mouseX < this.x + this.size / 2) {
        if (mouseY > this.y - this.size / 2 && mouseY < this.y + this.size / 2) {
          return true;
        }
      } else return false;
    }
  }
}