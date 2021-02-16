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
import { moodToCoordinates } from '@/components/Utils/logic/algorithm';
import useFetch from '@/components/Utils/logic/useFetch';

import { createSongDots } from '@/components/Utils/p5/songVisualisation';

// Spotify
let spotifyPlayerID = null;
let isPlaying = null;
let emitter = null;
let isSearching = false;
let playlist = [];
let minTracks = 5;
const personalisedPlaylist = [];

// handling production and development mode
const PRODUCTION = process.env.NODE_ENV;
const TOKEN = hashURL(window.location.href);

export function LoginHandlers() {

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
  player.on('playback_error', (e) => { 
    console.error(e);
    LoginHandlers();
  });

  // Playback status updates
  player.on('player_state_changed', (state) => {
    // eslint-disable-next-line no-underscore-dangle
    if (state.paused) document.title = player._options.name;
    // Change The Document's Title to The Currently Played Track
    else document.title = `${state.track_window.current_track.name} - ${state.track_window.current_track.artists[0].name}`;
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

export function findSongViaID(uri) {
  // Offset Song
  let offset = 0;
  let count = 0;
  // Loop through the playlist array to check offset songs
  playlist.forEach((songID, index) => {
    if (songID === uri) {
      count += 1;
      if (count <= 1) {
        offset = index;
      } else updatePlaylist(songID, 'remove');
    }
  });
  return offset;
}

export async function getSongIsPlaying() {

  try {
    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/player/is-playing/?token=${TOKEN}`
              : `http://localhost:5000/player/is-playing/?token=${TOKEN}`;

    const response = await useFetch(URL, 'GET');

    // Find Songs Via Their IDs
    const offset = findSongViaID(response.item.uri);

    const responseData = {
      offset,
      response,
    };
    return responseData;
  } catch (err) {
    return err;
  }
}

export async function changeVolume(PERCENT) {
  try {
    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/player/volume/?token=${TOKEN}&player_id=${spotifyPlayerID}&percent=${PERCENT}`
              : `http://localhost:5000/player/volume/?token=${TOKEN}&player_id=${spotifyPlayerID}&percent=${PERCENT}`;
    const response = await useFetch(URL, 'GET');
    return response;
  } catch (err) {
    return err;
  }
}

export async function shuffleSong(state) {
  try {
    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/player/shuffle/?token=${TOKEN}&player_id=${spotifyPlayerID}&state=${state}`
              : `http://localhost:5000/player/shuffle/?token=${TOKEN}&player_id=${spotifyPlayerID}&state=${state}`;
    const response = await useFetch(URL, 'GET');
    return response;
  } catch (err) {
    return err;
  }
}

export async function repeatSong(state) {
  try {
    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/player/repeat/?token=${TOKEN}&player_id=${spotifyPlayerID}&state=${state}`
              : `http://localhost:5000/player/repeat/?token=${TOKEN}&player_id=${spotifyPlayerID}&state=${state}`;
    const response = await useFetch(URL, 'GET');
    return response;
  } catch (err) {
    return err;
  }
}

export async function skipSong(how) {
  try {
    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/player/skip/?token=${TOKEN}&player_id=${spotifyPlayerID}&how=${how}`
              : `http://localhost:5000/player/skip/?token=${TOKEN}&player_id=${spotifyPlayerID}&how=${how}`;
    const response = await useFetch(URL, 'GET');
    return response;
  } catch (err) {
    return err;
  }
}

export async function seekSongPosition(ms) {
  try {
    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/player/seek/?token=${TOKEN}&player_id=${spotifyPlayerID}&position_ms=${ms}`
              : `http://localhost:5000/player/seek/?token=${TOKEN}&player_id=${spotifyPlayerID}&position_ms=${ms}`;

    const response = await useFetch(URL, 'GET');
    return response;
  } catch (err) {
    return err;
  }
}

export async function getSongsData(KEYWORD, SEARCH_TYPE, LIMIT) {

  try {
    // https://muserfly.herokuapp.com/
    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/spotify/search/?token=${TOKEN}&keyword=${KEYWORD}&search_type=${SEARCH_TYPE}&limit=${LIMIT}`
              : `http://localhost:5000/spotify/search/?token=${TOKEN}&keyword=${KEYWORD}&search_type=${SEARCH_TYPE}&limit=${LIMIT}`;

    const response = await useFetch(URL, 'GET');
    const isObjEmpty = isEmpty(response);

    if (!isObjEmpty) return response;
    return null;

  } catch (err) {
    console.log(err);
    return err;
  }
}

export function removeATempPlaylist(emitterObj) {
  // empty the playlist and refill it
  playlist = [];

  // create an object to remove all songs from the DOM
  const data = {
    playlist,
    how: 'removeAll',
  };

  emitterObj.emit('song_data', data);
}

export function updatePlaylist(song, how) {
  // create an object to remove this song from the DOM
  let data = {};

  const songID = song.id !== undefined ? song.id : song;

  // splice the duplicates off the playlist array
  if (how === 'remove') {
    for (let i = playlist.length - 1; i >= 0; i -= 1) {
      if (playlist[i] === songID) {
        playlist.splice(i, 1);

        // create an object to remove this song from the DOM
        data = {
          song,
          how,
        };

        emitter.emit('song_data', data);
        break;
      }
    }
  } else {
    playlist.push(songID);

    // create an object to add this song to the DOM
    data = {
      song,
      how,
    };

    emitter.emit('song_data', data);
  }
}

export async function showUserPlaylist(title, valence, arousal, id,
                  album_imgs, artist_details, artist_names, external_urls,
                  starDots, width, height, p5, emitterObj) {
  // re-format the id
  // eslint-disable-next-line no-param-reassign
  id = `spotify:track:${id}`;
  
  const isDuplicate = checkDuplicates(id, personalisedPlaylist);

  if (!isDuplicate) {
    personalisedPlaylist.push(id);
    // accepted songs
    createSongDots('user_playlist', title, valence, arousal, id,
                    album_imgs, artist_details, artist_names, external_urls,
                    true, starDots, width, height, p5, emitterObj);
  }
}
// audio_features, valence, arousal, how, trackObj, starDots, chosenPoints, width, height, p5
export async function searchRecommendation(id, artist_details, valence, arousal) {
  // eslint-disable-next-line no-param-reassign
  artist_details = artist_details.split(':');
  const artist_id = artist_details[artist_details.length - 1];
  try {
    // https://muserfly.herokuapp.com/
    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/spotify/recommendation/?token=${TOKEN}&id=${id}&artist_id=${artist_id}&min_valence=${valence - 0.25}&min_arousal=${arousal - 0.25}&max_valence=${valence + 0.25}&max_arousal=${arousal + 0.25}`
              : `http://localhost:5000/spotify/recommendation/?token=${TOKEN}&id=${id}&artist_id=${artist_id}&min_valence=${valence - 0.25}&min_arousal=${arousal - 0.25}&max_valence=${valence + 0.25}&max_arousal=${arousal + 0.25}`;

    const response = await useFetch(URL, 'GET');
    return response;

  } catch (err) {
    console.log(err);
    return err;
  }
}

function checkDuplicates(id, playlists) {
  let response = false;

  if (playlists.length > 0) {
    for (let i = 0; i < playlists.length; i += 1) {
  
      // check for duplicates
      if (id === playlists[i]) {

        response = true;
        break;
      } else if (id !== playlists[i]) {
          
        // check the duplicates till the last element of the array
        if (i === playlists.length - 1) {
  
          response = false;
          break;
        }
      }
    }
  }
  return response;
}

async function checkCloselyMatched(audio_features, valence, arousal, how, trackObj, userSettingsData, starDots, chosenPoints, width, height, p5) {
  for (let i = 0; i < audio_features.length; i += 1) {

    const song_data = audio_features[i];

    if (song_data.valence !== undefined && song_data.arousal !== undefined) {

      // if playlist array hasn't reached its end
      if (playlist.length < minTracks) {
  
        // if i hasn't reached the end of the audio features array's loop
        if (i < audio_features.length - 1) {
  
          const bounds = starDots[chosenPoints[0]][chosenPoints[1]].showBoundaries();

          const song = moodToCoordinates(song_data.valence, song_data.arousal, starDots, width, height);
          const song_x = song.x;
          const song_y = song.y;

          // compare
          if (song_x > bounds.x1 && 
              song_x < bounds.x2
          && song_y > bounds.y1 && 
              song_y < bounds.y2) {

              // make a temporary playlist based on the mood
              await makeATempPlaylist(song_data.id, song_data.title, song_data.valence, song_data.arousal,
                                song_data.album_imgs, song_data.artist_details, song_data.artist_names, song_data.external_urls,
                                how, trackObj, userSettingsData, starDots, width, height, chosenPoints, p5);
          } else {
  
            const id = `spotify:track:${song_data.id}`;
  
            // unaccepted songs
            createSongDots('unaccepted', song_data.title, song_data.valence, song_data.arousal, id,
                            song_data.album_imgs, song_data.artist_details, song_data.artist_names, song_data.external_urls,
                            false, starDots, width, height, p5, emitter);
          }
  
        // otherwise, redo the loop again until the playlist array condition is satisfied
        } else {
          await sleep(250);

          // search recommendations
          const results = await searchRecommendation(song_data.id, song_data.artist_details, valence, arousal);
          // if audio features object is invalid, go back to the start of the workflow
          // this happens because, the marginal differences at the edges of the map
          // creates negative/over-scored mood values
          if (results === null || results.type === 'invalid-json' || results.error) handlingSongsData(valence, arousal, how, null, userSettingsData, starDots, chosenPoints, width, height, p5);
          else checkCloselyMatched(results, valence, arousal, how, null, userSettingsData, starDots, chosenPoints, width, height, p5);
        }
      } else {
        if (isSearching) {
          isSearching = false;

          console.log(`End The Loop With ${playlist.length} songs`);
          isPlaying = await playSong(0);
  
          const data = {
            song: song_data,
            how: 'finish',
            isLoaded: true,
          };
          emitter.emit('song_data', data);
          break;
        }
      }
    }
  }
}

export async function makeATempPlaylist(id, title, valence, arousal, 
                  album_imgs, artist_details, artist_names, external_urls,
                  how, trackObj, userSettingsData, starDots, width, height, chosenPoints, p5) {
  // re-format the id
  // eslint-disable-next-line no-param-reassign
  const reformatID = `spotify:track:${id}`;

  const isDuplicate = checkDuplicates(reformatID, playlist);

  // If There's A Duplicate of Songs
  if (isDuplicate) {

    // redo the workflow
    const audioFeature = await searchRecommendation(id, artist_details, valence, arousal);
    checkCloselyMatched(audioFeature, valence, arousal, how, trackObj, userSettingsData, starDots, chosenPoints, width, height, p5);
  // Otherwise
  } else {

    // append the song's ids to the array
    playlist.push(reformatID);

    // accepted songs
    createSongDots('accepted', title, valence, arousal, reformatID,
                    album_imgs, artist_details, artist_names, external_urls,
                    false, starDots, width, height, p5, emitter);
  }
}

export async function pauseSong() {
  try {

    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/player/pause/?token=${TOKEN}&player_id=${spotifyPlayerID}`
              : `http://localhost:5000/player/pause/?token=${TOKEN}&player_id=${spotifyPlayerID}`;

    const response = await useFetch(URL, 'GET');
    return response;
  } catch (err) {
    return err;
  }
}

// Play a track using the new device ID
export async function playSong(position_ms, offset) {
  try {

    // https://muserfly.herokuapp.com/
    const URL = (PRODUCTION === 'production')
              ? `https://muserfly.herokuapp.com/player/play/?token=${TOKEN}&playlist=${playlist}&player_id=${spotifyPlayerID}&position_ms=${position_ms}&offset=${offset}`
              : `http://localhost:5000/player/play/?token=${TOKEN}&playlist=${playlist}&player_id=${spotifyPlayerID}&position_ms=${position_ms}&offset=${offset}`;

    const response = await useFetch(URL, 'GET');
    const errorStatus = response.error !== undefined 
                      ? response.error.status
                      : undefined;
    if (errorStatus === 404 || errorStatus === 403) {
      // Do Some Error Handling Here
      // const { message } = response.error;
    }
    return response;
  } catch (err) {
    // Do Some Error Handling Here
    return err;
  }
}

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
export async function handlingSongsData(valence, arousal, how, trackObj, userSettingsData, starDots, chosenPoints, width, height, p5, emitterObj) {
  isSearching = true;
  emitter = emitterObj;

  // Get The Min Number of Tracks to Collect from User Settings Data
  minTracks = (userSettingsData.length !== 0 && userSettingsData[userSettingsData.length - 1] !== undefined)
            ? userSettingsData[userSettingsData.length - 1].settings_data.user.personalisation.numOfTracks
            : minTracks;
  let KEYWORD = '';

  // If The Song Track Comming in As A Valid Object
  if (trackObj !== null) {
    // Get Search Keyword based on Its Artist
    KEYWORD = getKeyword(how, trackObj.artist_names);

    makeATempPlaylist(trackObj.id, trackObj.title, valence, arousal, 
      trackObj.album_imgs, trackObj.artist_details, trackObj.artist_names, trackObj.external_urls,
      false, trackObj, userSettingsData, starDots, width, height, chosenPoints, p5);

  } else KEYWORD = getKeyword(how, trackObj);

  // get songs' valence and arousal data
  let audio_features = await getSongsData((KEYWORD).normalize('NFD').replace(/[\u0300-\u036f]/g, ''), 'track');

  if (audio_features === null) audio_features = await getSongsData((KEYWORD).normalize('NFD').replace(/[\u0300-\u036f]/g, ''), 'album');

  else checkCloselyMatched(audio_features, valence, arousal, how, trackObj, userSettingsData, starDots, chosenPoints, width, height, p5);
}
