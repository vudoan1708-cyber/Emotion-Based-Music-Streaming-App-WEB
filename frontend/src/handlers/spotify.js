/* eslint-disable no-use-before-define */
/* eslint-disable no-lonely-if */
/* eslint-disable no-await-in-loop */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable operator-linebreak */
/* eslint-disable no-trailing-spaces */
/* eslint-disable camelcase */
/* eslint-disable padded-blocks */
/* eslint-disable no-console */

// logic
import hashURL from '@/components/Utils/logic/hashURL';
import sleep from '@/components/Utils/logic/sleep';

import { createSongDots } from '@/components/Utils/p5/songVisualisation';

// Spotify
let spotifyPlayerID = null;

// Set up the Web Playback SDK PLAYER
window.onSpotifyPlayerAPIReady = () => {
  const TOKEN = hashURL();

  // eslint-disable-next-line no-undef
  const player = new Spotify.Player({
    name: 'IAE',
    getOAuthToken: (cb) => { cb(TOKEN); },
  });

  // Error handling
  player.on('initialization_error', (e) => console.error(e));
  player.on('authentication_error', (e) => console.error(e));
  player.on('account_error', (e) => console.error(e));
  player.on('playback_error', (e) => console.error(e));

  // Playback status updates
  player.on('player_state_changed', (state) => {
    console.log(state);
    // $('#current-track').attr('src', state.track_window.current_track.album.images[0].url);
    // $('#current-track-name').text(state.track_window.current_track.name);
  });

  // Player Ready
  player.on('ready', (data) => {
    console.log('Ready with Device ID', data.device_id);
    
    // make the player id globally accessible
    spotifyPlayerID = data.device_id;
  });

  // Connect to the player!
  player.connect();
};

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

  } catch (err) {
    console.log(err);
    return err;
  }
}

async function makeATempPlaylist(id, valence, arousal, starDots, width, height, chosenPoints, playlist, p5) {
  
  if (playlist.length === 0) {

    // append the song's ids to the array
    playlist.push(id);

    // accepted songs
    createSongDots('accepted', valence, arousal, id, 
                    starDots, width, height, chosenPoints, playlist, p5);
  } else {
    for (let i = 0; i < playlist.length; i += 1) {
  
      // check for duplicates
      if (id === playlist[i]) {
        
        await sleep(250);
  
        // redo the workflow
        handlingSongsData(valence, arousal, playlist, starDots, chosenPoints, width, height, p5);
  
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
          createSongDots('accepted', valence, arousal, id, 
                          starDots, width, height, chosenPoints, playlist, p5);
  
          break;
        }
      }
    }
  }
}

// Play a track using our new device ID
async function playSong(TOKEN, playlist) {

  try {

    // Node.js
    const request = await fetch(`http://localhost:5000/play/?token=${TOKEN}&playlist=${playlist}&player_id=${spotifyPlayerID}`);

    const response = await request.json();
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

// GLOBALLY ACCESSIBLE FUNCTIONS
export async function LoginHandlers() {
  // handling production and development mode
  const PRODUCTION = process.env.NODE_ENV;

  // if it's production mode, get rid of the proxied server,
  // because, the client will be built on top of Python then,
  // and it is served by Python as static files
  // otherwise, run these two sides separately,
  // with the endpoint /api as a proxy to the server
  const ENDPOINT = (PRODUCTION === 'production') ? '' : '/api';
  try {
    window.location.href = `${ENDPOINT}/login`;
  } catch (e) {
    window.location.href = '/';
    console.log(e);
  }
}

export async function handlingSongsData(valence, arousal, playlist, starDots, chosenPoints, width, height, p5) {

  // get songs' valence and arousal data 
  const audio_features = await getSongsData();

  // console.log(audio_features);
  for (let i = 0; i < audio_features.length; i += 1) {

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
            await makeATempPlaylist(song_data.id, song_data.valence, song_data.arousal, starDots, width, height, chosenPoints, playlist, p5);
        } else {

          // unaccepted songs
          createSongDots('unaccepted', song_data.valence, song_data.arousal, song_data.id, 
                          starDots, width, height, chosenPoints, playlist, p5);
        }

      // otherwise, redo the loop again until the playlist array condition is satisfied
      } else {
        await sleep(500);
        // console.log(playlist.length)
        handlingSongsData(valence, arousal, playlist, starDots, chosenPoints, width, height, p5);
      }
    } else {
      console.log(`End The Loop With ${playlist.length} songs`);
      playSong(song_data.access_token, playlist);
      break;
    }
  }
}
