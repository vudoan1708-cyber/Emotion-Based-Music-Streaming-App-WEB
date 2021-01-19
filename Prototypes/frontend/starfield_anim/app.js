// @AminAhmadAhmadi
// Coding Challenge #1: Starfield
// https://youtu.be/17WoOqgXsRM

var stars;
var speed = 10;
var ir = 0.1; // interaction ratio
var L = 4; // line length

function setup() {
  createCanvas(windowWidth, windowHeight);
  stars = Array(floor(width * 2)).fill().map(() => new star());
}

function draw() {
  background(51);
  translate(map(mouseX, 0, width, 0.5 + ir, 0.5 - ir) * width, map(mouseY, 0, height, 0.5 + ir, 0.5 - ir) * height);

  stars.forEach(p => {
    p.update(speed);
    p.show();
  });
}


function star() {

  this.x = random(-width / 2, width / 2);
  this.y = random(-height / 2, height / 2);
  this.z = random(width);
  this.pz = this.z;

  this.update = (speed) => {
    this.z -= speed;
    this.pz = this.z + L * speed;

    if (this.z < 1) {
      this.x = random(-width / 2, width / 2);
      this.y = random(-height / 2, height / 2);
      this.z = width;
      this.pz = this.z;
    }
  }

  this.show = () => {

    this.sx = map(this.x / this.z, 0, 1, 0, width);
    this.sy = map(this.y / this.z, 0, 1, 0, height);

    this.r = map(this.z, 0, width, 5, 0);

    this.psx = map(this.x / this.pz, 0, 1, 0, width);
    this.psy = map(this.y / this.pz, 0, 1, 0, height);

    noFill();
    stroke(map(this.z, 0, width, 100, 51));
    line(this.psx, this.psy, this.sx, this.sy);

    fill(255);
    noStroke();
    ellipse(this.sx, this.sy, this.r, this.r);
  }

}
