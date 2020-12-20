const width = window.innerWidth,
      height = window.innerHeight;

let starDots = [];
let galaxy = [];
let chosenPoints = [];

const stars = Array(500);

let showMap = false;
let isClicked = false;

function make2dArray(cols, rows) {
  const arr = new Array(cols);

  for (let i = 0; i < cols; i++) {
      arr[i] = new Array(rows);
  }
  return arr;
}

function star(x, y, radius1, radius2, npoints) {

  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;

  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function makeBGStars() {

  let r, g, b;

  for (let i = 0; i < stars.length; i++) {
    const a = random(45, 100);
    
    if (i < stars.length / 4) {
      r = random(200, 255);
      g = random(200, 255);
      b = 0;
    } else if (i >= stars.length / 4 && i < stars.length / 2) {
      r = random(200, 255);
      g = random(20, 40);
      b = random(20, 40);
    } else if (i >= stars.length / 2 && i < stars.length / 1.5) {
      r = random(20, 40);
      g = random(200, 255);
      b = random(20, 40);
    } else {
      r = random(20, 40);
      g = random(20, 40);
      b = random(200, 255);
    }

    galaxy[i] = new GalaxyStars(random(width), random(height), random(1.0, 1.5), random(1.5, 2.5), color(r, g, b, a), random(255));
  }
}

function drawGalaxyBG() {
  for (let i = 0; i < galaxy.length; i++) {
    galaxy[i].show();
  }
}

function setup() {
  createCanvas(width, height);

  if (!showMap) {
    background(0);
    makeBGStars();
    // drawGalaxyBG();
  }
  

  ellipseMode(CENTER);

  // make a 2D array
  starDots = make2dArray(Math.floor(width / 25), Math.floor(height / 25));

  // instantiate the starDots object
  for (let i = 0; i < starDots.length; i++) {
    for (let j = 0; j < starDots[i].length; j++) {

      const x = width / 5 + i * 15;
      const y = height / 5 + j * 15;
      starDots[i][j] = new StarDots(x, y, random(5, 12));
    }
  }

  // noLoop();
}

function drawLines(i, j) {
  push();
    stroke(200, 220);
    strokeWeight(4.5);

    // VERTICAL LINE
    line(starDots[i][j].x, starDots[i][j].y, starDots[i][j].x, starDots[i][Math.floor(starDots[i].length / 2)].y);

    // HORIZONTAL LINE
    line(starDots[i][j].x, starDots[i][j].y, starDots[Math.floor(starDots.length / 2)][j].x, starDots[i][j].y);
  pop();
}

function drawHighlights(i, j) {
  
  // TOP LEFT
  // if (i < starDots.length / 2 && j < starDots[i].length / 2) {
  //   for (let a = i; a < starDots.length / 2; a++) {
  //     push();
  //       fill(255);
  //       starDots[a][j].show(true);
  //     pop();
  //     if (a === i) {
  //       for (let b = j; b < starDots[a].length / 2; b++) {
  //         push();
  //           fill(255);
  //           starDots[a][b].show(true);
  //         pop();
  //       }
  //     }
  //   }
  // }

  push();
    fill(255);
    starDots[i][j].show();
  pop();
}

function drawStarDots() {
  
  push();
    noStroke();

    if (!isClicked) {
      for (let i = 0; i < starDots.length; i++) {
        for (let j = 0; j < starDots[i].length; j++) {
    
          const c = random(200, 255);
          const a = random(20, 255);
          fill(c, a);
          
          star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 4, starDots[i][j].size / 8, 4);
          
          if (starDots[i][j].onHover()) {
    
            // draw highlighted paths
            drawHighlights(i, j);
            
            // draw guidlines
            drawLines(i, j);
    
            fill(255, 0, 0);
            
          // the centred dot
          } else if (i === Math.floor(starDots.length / 2) && j === Math.floor(starDots[i].length / 2)) {
            fill(0);
    
          // TOP LEFT (ANGRY)
          } else if (i >= 0 && i < Math.floor(starDots.length / 2)
                  && j >= 0 && j < Math.floor(starDots[i].length / 2)) {
              
              // orange
              fill(200, 98, 20, 90);
    
          // BOTTOM LEFT (SAD)
          } else if (i >= 0 && i < Math.floor(starDots.length / 2)
                  && j > Math.floor(starDots[i].length / 2) && j < starDots[i].length) {
    
              // blue
              fill(73, 27, 180, 90);
    
          // TOP RIGHT (HAPPY / EXCITED)
          } else if (i > Math.floor(starDots.length / 2) && i < starDots.length
                  && j >= 0 && j < Math.floor(starDots[i].length / 2)) {
              
              // green
              fill(176, 220, 90, 90);
    
          // BOTTOM RIGHT (CALM / RELAXED)
          } else if (i > Math.floor(starDots.length / 2) && i < starDots.length
              && j > Math.floor(starDots[i].length / 2) && j < starDots[i].length) {
          
            // pink
            fill(180, 83, 250, 90);
    
          // dots on the intersection lines
          } else {
            fill(220, 150);
          }
          // starDots[i][j].show(false);
          star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4);
        }
      }
    } else {
      drawHighlights(chosenPoints[0], chosenPoints[1]);

      fill(255, 0, 0);
      star(starDots[chosenPoints[0]][chosenPoints[1]].x, starDots[chosenPoints[0]][chosenPoints[1]].y, 
            starDots[chosenPoints[0]][chosenPoints[1]].size / 2, starDots[chosenPoints[0]][chosenPoints[1]].size / 4, 4);
    }
  pop();
}

function changeMap() {
  loop();
  showMap = true;
}

function mousePressed() {

  // only clickable when the emotion map is shown
  if (showMap) {
    for (let i = 0; i < starDots.length; i++) {
      for (let j = 0; j < starDots[i].length; j++) {
  
        if (starDots[i][j].onHover()) {
          console.log(i / starDots.length, 1 - j / starDots[i].length);
          isClicked = true;
          chosenPoints.push(i, j);
        }
      }
    }
  }
}

function draw() {

  background(10);
  drawGalaxyBG();
  
  if (showMap) {
    drawStarDots();
  }
}