// @ts-nocheck
p5.disableFriendlyErrors = true; // disables FES

const width = window.innerWidth,
      height = window.innerHeight;

let starDots = [];
let galaxy = [];
const songDots = [];
const chosenPoints = [];

const neighbours = [];


const stars = Array(360);

let showMap = false;
let isClicked = false;
let songLoaded = false;

let socket = null;

function make2dArray(cols, rows) {
  const arr = new Array(cols);

  for (let i = 0; i < cols; i++) {
      arr[i] = new Array(rows);
  }
  return arr;
}

function star(x, y, radius1, radius2, npoints) {

  // @ts-ignore
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

let history = [];

function createNewNeighbours(data) {

  // here I compare new users locations to one that's connecting
  if (data.i > chosenPoints[0] - 10 && 
    data.i < chosenPoints[0] + 10
  && data.j > chosenPoints[1] - 10 &&
    data.j < chosenPoints[1] + 10) {

      const x = width / 5 + data.i * 15.4;
      const y = height / 5 + data.j * 15.4;

      // create a new neighbour instance everytime the condition is satisfied
      neighbours.push(new Neighbours(x, y, data.size));
    }
}

function createHistoricalNeighbours() {
  for (let h = 0; h < history.length; h++) {

    // here I compare old users locations to one that's connecting
    if (history[h].i > chosenPoints[0] - 10 && 
      history[h].i < chosenPoints[0] + 10
    && history[h].j > chosenPoints[1] - 10 &&
      history[h].j < chosenPoints[1] + 10) {
        const x = width / 5 + history[h].i * 15.4;
        const y = height / 5 + history[h].j * 15.4;

        // create a new neighbour instance everytime the condition is satisfied
        neighbours.push(new Neighbours(x, y, history[h].size));
      }
  }
}

// in one machine, only two types of data emit from this socket connection
// 1: HISTORICAL DATA (when first open the app)
// 2: NEW DATA (when other users choose a coordinates closely to others)
function userDataEmit(curent_data) {

  // check if it is the first HISTORICAL data emit
  // because a HISTORICAL data emit is in a form of an array (not undefined)
  // this condition statement is to store the historical data to a global variable
  if (curent_data.length !== undefined) {

    // check if a user is not the first connection to the system
    // because first users don't need historical data
    if (curent_data.length !== 0) {

      // shallow copy the data and assign it to a global array
      history = [...curent_data];
      console.log(history);
    }

  // check if it is a current event
  } else {

    // receive the NEW data broadcasted by OTHER USERS
    // and push it to neighbours array
    createNewNeighbours(curent_data);
  }
  console.log(curent_data)
  console.log(`Other User Data: ${curent_data.i}, ${curent_data.j}`);
  console.log(`My Data: ${chosenPoints[0]}, ${chosenPoints[1]}`);

  
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
    // background(0);
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

function drawSongDots() {
  if (songLoaded) {
    for (let i = 0; i < songDots.length; i++) {
      songDots[i].show();

      // for re-collecting songs within The Zone, but aren't included 
      // because the Zone hasn't spreaded out to its maximum size
      if (songDots[i].label === 'unaccepted')
        songDots[i].updateLabels();
    }
  }
}

function changeMap() {
  showMap = true;
}

async function mousePressed() {

  // only clickable when the emotion map is shown
  if (showMap) {
    for (let i = 0; i < starDots.length; i++) {
      for (let j = 0; j < starDots[i].length; j++) {
  
        if (starDots[i][j].onHover()) {
          console.log((i / starDots.length).toFixed(3), (1 - j / starDots[i].length).toFixed(3));
          console.log(i, j);

          // mapping algorithm to get the valence and arousal values by getting the percentage of an index to the max value
          const valence = i / starDots.length;
          const arousal = 1 - j / starDots[i].length;
          isClicked = true;
          chosenPoints.push(i, j);

          // send data to the server via socket
          let data = {
            i,
            j,
            size: starDots[i][j].size,
          }
          socket.emit('click', data);

          // HISTORICAL USERS
          // use the history array available globally after collecting it the first time
          // and push it t0 neighbours array as well
          createHistoricalNeighbours();

          // get songs data from Spotify via the server
          handlingSongsData(Number(valence.toFixed(3)), Number(arousal.toFixed(3)));
        }
      }
    }
  }
}

function createSongDots(label, valence, arousal, id) {

  // reverse the mapping algorithm to get the location values from valence and arousal
  const i = Math.floor(valence * starDots.length);
  const j = Math.floor((1 - arousal) * starDots[i].length);
  
  const x = width / 5 + i * 15.4;
  const y = height / 5 + j * 15.4;
  // console.log(`Song's Valence, Arousal: ${valence}, ${arousal}, amd indices: ${i}, ${j}`);
  songDots.push(new SongDots(label, id, x, y, 10));
  songLoaded = true;
}

function drawNeighbours() {

  if (neighbours.length > 0) {
    for (let i = 0; i < neighbours.length; i++) {
      neighbours[i].show();
    }
  }
}

function draw() {

  background(10);
  drawGalaxyBG();
  
  if (showMap) {
    drawStarDots();
    drawSongDots();
    drawNeighbours();
  }
}

function windowResized() {
  resizeCanvas(width, height);
}


// Spotify
const playlist = [];
let spotifyPlayerID = null;

function hashURL () {
  const splittedString = window.location.search.split('=');
  const result = splittedString[splittedString.length - 1];
  
  return result;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeATempPlaylist(access_token, id, title, valence, arousal) {
  
  if (playlist.length === 0) {

    // append the song's ids to the array
    playlist.push(id);

    // accepted songs
    createSongDots('accepted', valence, arousal, id);
  } else {
    for (let i = 0; i < playlist.length; i++) {
  
      // check for duplicates
      if (id === playlist[i]) {
        
        await sleep(250);
  
        // redo the workflow
        handlingSongsData(valence, arousal);
  
        break;
      } else {
          
        // check the duplicates till the last element of the array
        if (i === playlist.length - 1) {
                
          // append the song's ids to the array
          playlist.push(id);
  
          // preview_urls.push(preview_url);
  
          // titles.push(title);
  
          // valences.push(song_valence);
  
          // arousals.push(song_energy);
  
          console.log(`Counter ${Number(playlist.length)}`);
  
          // await sleep(250);
  
          // accepted songs
          createSongDots('accepted', valence, arousal, id);
  
          break;
        }
      }
    }
  }
}

async function getSongsData() {

  const TOKEN = hashURL();

  try {

    // Node.js
    const request = await fetch(`http://localhost:5000/spotify/?token=${TOKEN}`);

    // Python
    // const request = await fetch(`http://localhost:5000/spotify/${TOKEN}/${valence}/${arousal}`);

    const response = await request.json();
    // console.log(response);
    return response;
  } catch(err) {
    console.log(err);
  }
}

async function handlingSongsData(valence, arousal) {

  // get songs' valence and arousal data 
  const audio_features = await getSongsData();
  
  // console.log(audio_features);
  for (let i = 0; i < audio_features.length; i++) {

    const song_data = audio_features[i];

    // if playlist array hasn't reached its end
    if (playlist.length < 5) {

      // if i hasn't reached the end of the audio featiures array's loop
      if (i < audio_features.length - 1) {

        const bounds = starDots[chosenPoints[0]][chosenPoints[1]].showBoundaries();
        // console.log(`Bounds: ${bounds.x1}, ${bounds.x2}, ${bounds.y1}, ${bounds.y2}`);

        // map song's affective values to coordinates on the map
        const song_i = Math.floor(song_data.valence * starDots.length);
        const song_j = Math.floor((1 - song_data.arousal) * starDots[song_i].length);

        const song_x = width / 5 + song_i * 15.4;
        const song_y = height / 5 + song_j * 15.4;
        // console.log(`Song's Coordinates: ${song_x}, ${song_y}`);

        // compare
        if (song_x > bounds.x1 && 
            song_x < bounds.x2
        && song_y > bounds.y1 && 
            song_y < bounds.y2) {

            // make a temporary playlist for the mood
            await makeATempPlaylist(song_data.access_token, song_data.id, song_data.title, song_data.valence, song_data.arousal);
        } else {

          // unaccepted songs
          createSongDots('unaccepted', song_data.valence, song_data.arousal, song_data.id);
        }

      // otherwise, redo the loop again until the playlist array condition is satisfied
      } else {
        await sleep(500);
        // console.log(playlist.length)
        handlingSongsData(valence, arousal);
      }
    } else {
      console.log(`End The Loop With ${playlist.length} songs`);
      playSong(song_data.access_token);
      break;
    }
  }
}

// Set up the Web Playback SDK PLAYER
window.onSpotifyPlayerAPIReady = () => {
  const TOKEN = hashURL();

  const player = new Spotify.Player({
    name: 'IAE',
    getOAuthToken: cb => { cb(TOKEN); }
  });

  // Error handling
  player.on('initialization_error', e => console.error(e));
  player.on('authentication_error', e => console.error(e));
  player.on('account_error', e => console.error(e));
  player.on('playback_error', e => console.error(e));

  // Playback status updates
  player.on('player_state_changed', state => {
    console.log(state)
    $('#current-track').attr('src', state.track_window.current_track.album.images[0].url);
    $('#current-track-name').text(state.track_window.current_track.name);
  });

  // Player Ready
  player.on('ready', data => {
    console.log('Ready with Device ID', data.device_id);
    
    // make the player id globally accessible
    spotifyPlayerID = data.device_id;
  });

  // Connect to the player!
  player.connect();
}

// Play a track using our new device ID
async function playSong(TOKEN) {

  try {

    // Node.js
    const request = await fetch(`http://localhost:5000/play/?token=${TOKEN}&playlist=${playlist}&player_id=${spotifyPlayerID}`);

    const response = await request.json();
    console.log(response);
  } catch(err) {
    console.log(err);
  }
}
