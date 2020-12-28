p5.disableFriendlyErrors = true; // disables FES

const width = window.innerWidth,
      height = window.innerHeight;

let starDots = [];
let galaxy = [];
const songDots = [];
const chosenPoints = [];

// to visualise songs ouside and inside the zone of the accepted
const unacceptedSongs = [];
const acceptedSongs = [];
// const neighbours = [];


const stars = Array(360);

let showMap = false;
let isClicked = false;

let socket = null;

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

function userDataEmit(data) {
  console.log(data);
}

function getSocket() {
  const URL = 'http://localhost:5000';
  socket = io.connect(URL);

  socket.on('connect', () => {
    console.log('Successfully Connected');
  });

  socket.on('click', userDataEmit);

  socket.on('error', (err) => {
    console.log(err);
  })
}

function setup() {
  createCanvas(width, height);

  getSocket();

  if (!showMap) {
    background(0);
    makeBGStars();
  }
  
  ellipseMode(CENTER);

  rectMode(CENTER);

  // make a 2D array
  starDots = make2dArray(Math.floor(width / 25), Math.floor(height / 25));

  // instantiate the starDots object
  for (let i = 0; i < starDots.length; i++) {
    for (let j = 0; j < starDots[i].length; j++) {

      starDots[i][j] = new StarDots(i, j, random(5, 12));
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

function fillStarsColor(i, j) {

  push();
    if (starDots[i][j].onHover()) {
      
      // draw highlighted dot
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
    
    // show all stars with different colours depending on different conditions
    star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 2, starDots[i][j].size / 4, 4);
  pop();
}

function drawStarDots() {
  
  push();
    noStroke();

    for (let i = 0; i < starDots.length; i++) {
      for (let j = 0; j < starDots[i].length; j++) {
  
        if (!isClicked) {
              
          // twinkle effects
          const c = random(200, 255);
          const a = random(20, 255);
          fill(c, a);
          
          star(starDots[i][j].x, starDots[i][j].y, starDots[i][j].size / 4, starDots[i][j].size / 8, 4);

          fillStarsColor(i, j);
        } else {
          fillStarsColor(i, j);

          // a circle represents a chosen dot
          drawHighlights(chosenPoints[0], chosenPoints[1]);

          // zone of the accepted
          starDots[chosenPoints[0]][chosenPoints[1]].showZoneofTheAccepted();
    
          // red star on top
          fill(255, 0, 0);
          star(starDots[chosenPoints[0]][chosenPoints[1]].x, starDots[chosenPoints[0]][chosenPoints[1]].y, 
                starDots[chosenPoints[0]][chosenPoints[1]].size / 2, starDots[chosenPoints[0]][chosenPoints[1]].size / 4, 4);
        }
      }
    }   
  pop();
}

function changeMap() {
  // loop();
  showMap = true;
  
}

async function mousePressed() {

  // only clickable when the emotion map is shown
  if (showMap) {
    for (let i = 0; i < starDots.length; i++) {
      for (let j = 0; j < starDots[i].length; j++) {
  
        if (starDots[i][j].onHover()) {
          console.log(i / starDots.length, 1 - j / starDots[i].length);
          console.log(i, j);

          const valence = i / starDots.length;
          const arousal = 1 - j / starDots[i].length;
          isClicked = true;
          chosenPoints.push(i, j);

          // send data to the server via socket
          let data = {
            i,
            j,
          }
          socket.emit('click', data);

          // get songs data from Spotify via the server
          handlingSongsData(valence, arousal);
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

function windowResized() {
  resizeCanvas(width, height);
}


// Spotify
const playlist = [];

function hashURL () {
  const splittedString = window.location.search.split('=');
  const result = splittedString[splittedString.length - 1];
  
  return result;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function makeATempPlaylist(access_token, id, title, valence, arousal) {

}

async function getSongsData() {

  const TOKEN = hashURL();

  // Node.js
  const request = await fetch(`http://localhost:5000/spotify/?token=${TOKEN}`);

  // Python
  // const request = await fetch(`http://localhost:5000/spotify/${TOKEN}/${valence}/${arousal}`);

  const response = await request.json();
  // console.log(response);
  return response;
}

async function handlingSongsData(valence, arousal) {

  // get songs' valence and arousal data 
  const audio_features = await getSongsData();
  
  console.log(audio_features);
  for (let i = 0; i < audio_features.length; i++) {

    const song_data = audio_features[i];

    console.log(song_data.valence, song_data.arousal);
    // console.log(song_data)

    // if playlist array has a length of less requested length (atm 5)
    if (playlist.length < 5) {
      // if i hasn't reached the end of the array
      if (i < audio_features.length - 1) {

        if (valence > song_data.valence - 0.050 && 
            valence < song_data.valence + 0.050
        && arousal > song_data.energy - 0.050 && 
            arousal < song_data.energy + 0.050) {

            // make a temporary playlist for the mood
            makeATempPlaylist(song_data.access_token, song_data.id, song_data.title, song_data.valence, song_data.arousal);
        }
      } else {
        await sleep(500);
        
        // handlingSongsData(valence, arousal);
      }
    } else {
      console.log(playlist.length);
      break;
    }
  }
}
