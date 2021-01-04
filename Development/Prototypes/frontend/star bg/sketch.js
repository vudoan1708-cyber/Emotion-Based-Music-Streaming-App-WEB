const stars = Array(500);
let r, g, b;

async function getEmotion() {
  const PRIVATE_KEY = '9756eb9a-5cba-4090-ad57-1870d98d6189',
        PUBLIC_KEY = '6979139e-0d82-4fae-977b-96e96e58f1ab';

  const URL = 'https://api.sherpa.ai/v2/sentiment-analysis/polarities';

  const data = {
      'text': "I'm sad",
  };
  
  const options = {
    method: 'POST',
    headers: {
      'X-API-Key': PUBLIC_KEY,
      'Content-Type': "application/json", 
    },
    body: JSON.stringify(data),
  };
  const request = await fetch(URL, options);
  const response = await request.json();
  console.log(response);
}


function setup() {
  getEmotion();
  
  createCanvas(windowWidth, windowHeight);
  background(0,0,0); 
  
  for (let i = 0; i < stars.length; i++) {
    const a = random(75, 100);
    
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
    var galaxy = { 
      locationX : random(width),
      locationY : random(height),
      size1 : random(1.5, 2.1),
      size2 : random(2.1, 2.7),
      colour: color(r, g, b, a)
    }
    // fill(galaxy.colour);
    star(galaxy.locationX ,galaxy.locationY, galaxy.size1, galaxy.size2, 5, galaxy.colour);
  }
}

function draw() {
  
}

function star(x, y, radius1, radius2, npoints, colour) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  fill(colour);
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

