const width = window.innerWidth,
      height = window.innerHeight;

let starDots = [];

function make2dArray(cols, rows) {
  const arr = new Array(cols);

  for (let i = 0; i < cols; i++) {
      arr[i] = new Array(rows);
  }
  return arr;
}

function setup() {
  createCanvas(width, height);

  ellipseMode(CENTER);

  // make a 2D array
  starDots = make2dArray(Math.floor(width / 25), Math.floor(height / 25));

  // instantiate the starDots object
  for (let i = 0; i < starDots.length; i++) {
    for (let j = 0; j < starDots[i].length; j++) {

      const x = width / 4.5 + i * 15;
      const y = height / 4.5 + j * 15;
      // starDots.push([x, y]);
      starDots[i][j] = new StarDots(x, y, 12);
    }
  }
}

function drawLines(i, j) {
  push();
    stroke(200);
    strokeWeight(4);

    // VERTICAL LINE
    line(starDots[i][j].x, starDots[i][j].y, starDots[i][j].x, starDots[i][Math.floor(starDots[i].length / 2)].y);

    // HORIZONTAL LINE
    line(starDots[i][j].x, starDots[i][j].y, starDots[Math.floor(starDots.length / 2)][j].x, starDots[i][j].y);
  pop();
}

function drawStarDots() {
  for (let i = 0; i < starDots.length; i++) {
    for (let j = 0; j < starDots[i].length; j++) {

      if (starDots[i][j].onHover()) {

        // draw guidlines
        drawLines(i, j);
        fill(255, 0, 0);
        
      // the centred dot
      } else if (i === Math.floor(starDots.length / 2) && j === Math.floor(starDots[i].length / 2)) {
        fill(0);

      // TOP RIGHT (ANGRY)
      } else if (i >= 0 && i < Math.floor(starDots.length / 2)
              && j >= 0 && j < Math.floor(starDots[i].length / 2)) {
          
          // orange
          fill(200, 98, 20, 150);

      // BOTTOM RIGHT (SAD)
      } else if (i >= 0 && i < Math.floor(starDots.length / 2)
              && j > Math.floor(starDots[i].length / 2) && j < starDots[i].length) {

          // blue
          fill(20, 20, 180, 150);

      // TOP LEFT (HAPPY / EXCITED)
      } else if (i > Math.floor(starDots.length / 2) && i < starDots.length
              && j >= 0 && j < Math.floor(starDots[i].length / 2)) {
          
          // green
          fill(176, 220, 90, 150);

      // BOTTOM LEFT (CALM / RELAXED)
      } else if (i > Math.floor(starDots.length / 2) && i < starDots.length
          && j > Math.floor(starDots[i].length / 2) && j < starDots[i].length) {
      
        // pink
        fill(180, 83, 250, 150);

      // dots on the intersection lines
      } else {
        fill(220);
      }
      starDots[i][j].show();
    }
  }
}

function mousePressed() {
  for (let i = 0; i < starDots.length; i++) {
    for (let j = 0; j < starDots[i].length; j++) {

      if (starDots[i][j].onHover()) {
        console.log(i / starDots.length, 1 - j / starDots[i].length);
      }
    }
  }
}

function draw() {
  background(10);
  drawStarDots();
}