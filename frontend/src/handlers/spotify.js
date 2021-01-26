/* eslint-disable import/no-cycle */
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
import isEmpty from '@/components/Utils/logic/object';
import { randomCharacters, randomInt } from '@/components/Utils/logic/random';
import useFetch from '@/components/Utils/logic/useFetch';

import errorHandler from '@/components/Utils/dom/error';

import { createSongDots } from '@/components/Utils/p5/songVisualisation';

// Spotify
let spotifyPlayerID = null;
let isPlaying = null;
let playlist = [];

// handling production and development mode
const PRODUCTION = process.env.NODE_ENV;
const TOKEN = hashURL(window.location.href);

// Set up the Web Playback SDK PLAYER
window.onSpotifyWebPlaybackSDKReady = () => {

  // eslint-disable-next-line no-undef
  const player = new Spotify.Player({
    name: 'Muserfly',
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

  player.on('not_ready', (data) => {
    console.log('Device ID is not ready', data.device_id);
  });

  // Connect to the player!
  player.connect();
};

export function getKeyword(how, text) {
  let keyword = '';

  // random character
  if (how === 'random') keyword = randomCharacters(randomInt(2, 3));

  // manual search input from a user
  else keyword = text;
  return keyword;
}

export async function getSongsData(KEYWORD) {

  try {
    // https://muserfly.herokuapp.com/
    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/spotify/?token=${TOKEN}&keyword=${KEYWORD}` 
              : `http://localhost:5000/spotify/?token=${TOKEN}&keyword=${KEYWORD}`;

    const response = await useFetch(URL, 'GET');
    const isObjEmpty = isEmpty(response);

    if (!isObjEmpty) return response;
    return null;

  } catch (err) {
    console.log(err);
    return err;
  }
}

export function removeATempPlaylist(emitter) {
  // empty the playlist and refill it
  playlist = [];

  // create an object to remove all songs from the DOM
  const data = {
    playlist,
    how: 'removeAll',
  };

  emitter.emit('song_data', data);
}

export function updatePlaylist(song, how, emitter) {
  // create an object to remove this song from the DOM
  let data = {};

  // splice the duplicates off the playlist array
  if (how === 'remove') {
    for (let i = playlist.length - 1; i >= 0; i -= 1) {
      if (playlist[i] === song.id) {
        playlist.splice(song.id, 1);

        // create an object to remove this song from the DOM
        data = {
          song,
          how,
        };

        emitter.emit('song_data', data);
      }
    }
  } else {
    playlist.push(song.id);

    // create an object to add this song to the DOM
    data = {
      song,
      how,
    };

    emitter.emit('song_data', data);
  }
}

export async function makeATempPlaylist(id, title, valence, arousal, 
                  album_imgs, artist_details, artist_names, external_urls,
                  starDots, width, height, chosenPoints, p5, emitter) {
  // re-format the id
  // eslint-disable-next-line no-param-reassign
  id = `spotify:track:${id}`;

  if (playlist.length === 0) {

    // append the song's ids to the array
    playlist.push(id);

    // accepted songs
    createSongDots('accepted', title, valence, arousal, id,
                    album_imgs, artist_details, artist_names, external_urls,
                    starDots, width, height, p5, emitter);
  } else {
    for (let i = 0; i < playlist.length; i += 1) {
  
      // check for duplicates
      if (id === playlist[i]) {
        
        await sleep(250);
  
        // redo the workflow
        handlingSongsData(valence, arousal, starDots, chosenPoints, width, height, p5, emitter);
  
        break;
      } else {
          
        // check the duplicates till the last element of the array
        if (i === playlist.length - 1) {
                
          // append the song's ids to the array
          playlist.push(id);
  
          // await sleep(250);
  
          // accepted songs
          createSongDots('accepted', title, valence, arousal, id,
                          album_imgs, artist_details, artist_names, external_urls,
                          starDots, width, height, p5, emitter);
  
          break;
        }
      }
    }
  }
}

// Play a track using the new device ID
async function playSong() {
  try {

    // https://muserfly.herokuapp.com/
    const URL = (PRODUCTION === 'production') 
              ? `https://muserfly.herokuapp.com/player/play/?token=${TOKEN}&playlist=${playlist}&player_id=${spotifyPlayerID}` 
              : `http://localhost:5000/player/play/?token=${TOKEN}&playlist=${playlist}&player_id=${spotifyPlayerID}`;

    // Node.js
    const response = await useFetch(URL, 'GET');
    const errorStatus = response.error !== undefined 
                      ? response.error.status
                      : undefined;
    if (errorStatus === 404) {
      const errorDiv = document.createElement('div');
      errorHandler(response.error.message, errorDiv);
    }
    console.log(response);
    return response;
  } catch (err) {
    const errorDiv = document.createElement('div');
    errorHandler(err, errorDiv);
    return err;
  }
}

// GLOBALLY ACCESSIBLE FUNCTIONS

// Add Song to Player's Queue
export async function addSongToQueue(URI) {
  let response = null;

  if (isPlaying) {
    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/player/queue/?token=${TOKEN}&uri=${URI}&player_id=${spotifyPlayerID}`
              : `http://localhost:5000/player/queue/?token=${TOKEN}&uri=${URI}&player_id=${spotifyPlayerID}`;
    try {
      response = await useFetch(URL, 'GET');
    } catch (err) {
      response = err;
    }
  }
  return response;
}

export async function LoginHandlers() {

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

// User
export async function getUserProfile() {
  const URL = (PRODUCTION === 'production')
            ? `https://muserfly.herokuapp.com/user/detail/?token=${TOKEN}`
            : `http://localhost:5000/user/detail/?token=${TOKEN}`;
  try {
    const response = await useFetch(URL, 'GET');
    return response;
  } catch (err) {
    return err;
  }
}

export async function getUserPersonalisation(type, offsetNum) {
  const URL = (PRODUCTION === 'production')
            ? `https://muserfly.herokuapp.com/user/personalisation/?token=${TOKEN}&type=${type}&offset=${offsetNum}`
            : `http://localhost:5000/user/personalisation/?token=${TOKEN}&type=${type}&offset=${offsetNum}`;
  try {
    const response = await useFetch(URL, 'GET');
    return response;
  } catch (err) {
    return err;
  }
}

// Song Fetch
export async function handlingSongsData(valence, arousal, starDots, chosenPoints, width, height, p5, emitter) {

  // get keyword for search
  const KEYWORD = getKeyword('random');

  // get songs' valence and arousal data 
  const audio_features = await getSongsData(KEYWORD);

  if (audio_features === null) LoginHandlers();

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

        // compare
        if (song_x > bounds.x1 && 
            song_x < bounds.x2
        && song_y > bounds.y1 && 
            song_y < bounds.y2) {

            // make a temporary playlist for the mood
            await makeATempPlaylist(song_data.id, song_data.title, song_data.valence, song_data.arousal,
                              song_data.album_imgs, song_data.artist_details, song_data.artist_names, song_data.external_urls,
                              starDots, width, height, chosenPoints, p5, emitter);
        } else {

          const id = `spotify:track:${song_data.id}`;

          // unaccepted songs
          createSongDots('unaccepted', song_data.title, song_data.valence, song_data.arousal, id,
                          song_data.album_imgs, song_data.artist_details, song_data.artist_names, song_data.external_urls,
                          starDots, width, height, p5, emitter);
        }

      // otherwise, redo the loop again until the playlist array condition is satisfied
      } else {
        await sleep(500);
        // console.log(playlist.length)
        handlingSongsData(valence, arousal, starDots, chosenPoints, width, height, p5, emitter);
      }
    } else {
      console.log(`End The Loop With ${playlist.length} songs`);
      isPlaying = await playSong(song_data.access_token, playlist);
      break;
    }
  }
}
