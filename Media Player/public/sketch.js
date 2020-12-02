import getUserEmotion from './components/emotion.js';

let lyricsData = null,
    moodScr = 0;

// ERROR HANDLING
function errHandling(err) {
    console.log(err);

    if (err === 'NO ACTIVE DEVICE') {
        window.open('https://open.spotify.com/');
    }
}
function hashURL () {
    const splittedString = window.location.search.split('=');
    const result = splittedString[splittedString.length - 1];
    
    return result;
}

// Set up the Web Playback SDK

// Set token
const TOKEN = 'BQAQ8XDnGPbbOGGwKIUSubI0jWoJHQaO4GmIVFkPwiLADuTYvPjUKIvHLJV8Pe-7XmQgbbbbb37suaB4ouTDnngP6YZhDEzWqAvZxvnwcSpzKyxWfNObl0Qc1ry7EfOr7t6hgx5zI6uElq3rmc7TkIV3_E7z25T--f7WEaZpwqj0bHLRaTHgLmIIFbm2QOsi_DNasa1P-kT3NPRRTYKuDazk1hvciReSo-uzs7HIuNHIOkg675m0-g';

window.onSpotifyPlayerAPIReady = () => {
    const player = new Spotify.Player({
      name: 'Web Playback SDK Template',
      getOAuthToken: cb => { cb(TOKEN); }
    });
  
    // Error handling
    player.on('initialization_error', e => console.error(e));
    player.on('authentication_error', e => console.error(e));
    player.on('account_error', e => console.error(e));
    player.on('playback_error', e => console.error(e));
  
    // Playback status updates
    // player.on('player_state_changed', state => {
    //   console.log(state)
    //   $('#current-track').attr('src', state.track_window.current_track.album.images[0].url);
    //   $('#current-track-name').text(state.track_window.current_track.name);
    // });
  
    // Ready
    player.on('ready', data => {
      console.log('Ready with Device ID', data.device_id);
  
      getEmotion(data.device_id);
    });
  
    // Connect to the player!
    player.connect();
}
  
  // Play a specified track on the Web Playback SDK's device ID
//   function playSong(device_id) {
//     $.ajax({
//      url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
//      type: "PUT",
//      data: '{"uris": ["spotify:track:5ya2gsaIhTkAuWYEMB0nw5"]}',
//      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
//      success: function(data) { 
//        console.log(data)
//      }
//     });
//   }


// Play a track using our new device ID
async function playSong(accessToken, device_id, tempPlaylist) {

    const data = {
        'uris': tempPlaylist,
        'play': true,
    };

    const BASE_URL = `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`;

    const options = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(BASE_URL, options);
        const json = await response.json();
        console.log(json);

    } catch(err) {
        errHandling(err);
    }
}

// const audio = document.getElementById('player');

// // PLAY SONGS FROM SPOTIFY USING WEB API
// async function songPreview(accessToken, id) {

//     let songHolders = [];
//     const oldSource = document.getElementsByTagName('source');
//     console.log(oldSource)
//     console.log(oldSource.length)

//     // check for a single id 
//     if (typeof(id) === 'string') {
        

//     // or a collection of ids
//     } else {
        
//         // loop through the array
//         for (let i = 0; i < id.length; i++) {

//             // create div tags
//             songHolders[i] = document.createElement('div');
//             songHolders[i].innerHTML = titles[i];
//             songHolders[i].style.display = 'inline-block';
//             songHolders[i].style.backgroundColor = 'rgb(111, 97, 255)';
//             songHolders[i].style.color = 'white';
//             songHolders[i].style.margin = '10px';
//             songHolders[i].style.padding = '10px';

//             // append to the DOM
//             document.body.appendChild(songHolders[i]);
//             console.log(preview_urls);

//             // add a global event listener
//             songHolders[i].addEventListener('click', () => {

//                 if (oldSource.length > 0) {
//                     for (let n = 0; n < oldSource.length; n++) {
//                         oldSource[n].remove();
//                     }
//                 }
//                 const player = document.createElement('source');

//                 player.src = preview_urls[i];

//                 audio.load(); //call this to just preload the audio without playing

//                 audio.play(); //call this to play the song right away

//                 audio.appendChild(player);
//             });
//         }
//     }
// }

let preview_urls = [], 
    titles = [];

// MAKE A TEMPORARY PLAYLIST OF SONGS FOR THE CUURENT MOOD
function makeATempPlaylist(accessToken, id, preview_url, title, tempPlaylist, device_id) {

    // re-format the id
    id = 'spotify:track:' + id;
    
    // check for the available length of the array
    if (tempPlaylist.length > 0) {

        // check for the limit number of playlist tracks
        if (tempPlaylist.length < 5) {

            for (let i = 0; i < tempPlaylist.length; i++) {

                // check for duplicates
                if (id === tempPlaylist[i]) {
                    
                    // redo the workflow
                    getSongID(accessToken, tempPlaylist, device_id);

                    break;
                } else {
                    
                    // check the duplicates till the last element of the array
                    if (i === tempPlaylist.length - 1) {
                            
                        // append the song's id to the array
                        tempPlaylist.push(id);

                        preview_urls.push(preview_url);

                        titles.push(title);

                        console.log(tempPlaylist.length + 1);

                        // redo the workflow from getting a song's id, since we already have an access token
                        getSongID(accessToken, tempPlaylist, device_id);

                        break;
                    }
                }
            }

        // if the array's length reaches the limit
        } else {
            
            // Play a track using our new device ID
            playSong(accessToken, device_id, tempPlaylist);
            console.log(tempPlaylist);
        }

    // if the array is empty
    } else {
    
        // append the song's id to the array
        tempPlaylist.push(id);
        
        preview_urls.push(preview_url);

        titles.push(title);

        // redo the workflow
        getSongID(accessToken, tempPlaylist, device_id);
    }
}

// GET SONG TITLE THROUGH LYRICS
// async function getLyrics(lyrics, apiKey) {

//     // get the URL
//     const URL = `http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${lyrics}&apikey=${apiKey}`

//     // fetch it
//     const request = await fetch(URL);
//     lyricsData = await request.json();
//     return lyricsData;
// }


// GET AUDIO FEATURE THROUGH A PROVIDED ID OF A SONG
async function getAudioFeature(id, preview_url, title, accessToken, available, search, tempPlaylist, device_id) {

    // convert a string from  object to a number that represents a user's emotion
    const user_emotion = await getUserEmotion();
    console.log(user_emotion.valence, user_emotion.arousal)
    
    // get the url
    const BASE_URL = 'https://api.spotify.com/v1/audio-features/',
          FETCH_URL = BASE_URL + id;

    // create options object that includes Authorisation header
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    };

    // fetch the url with the provided options
    try {
        const request = await fetch(FETCH_URL, options);
        const song_emotion = await request.json();
        console.log(song_emotion.valence.toFixed(3), song_emotion.energy.toFixed(3));
        // console.log(song_emotion)

        // check if a user's playlist is empty and the workflow of find songs is random
        // or, if a user's playlist is available but a searched keyword is not found
        if (!available && !search || available && !search) {

            // CATEGORISING DIFFERENT EMOTION VALUES
            // happy
            if (user_emotion.valence > song_emotion.valence.toFixed(2) - 0.4 || user_emotion.valence < song_emotion.valence.toFixed(2) + 0.4
                && user_emotion.arousal > song_emotion.energy.toFixed(2) - 0.4 || user_emotion.arousal < song_emotion.energy.toFixed(2) + 0.4)

                // make a temporary playlist for the mood
                makeATempPlaylist(accessToken, id, preview_url, title, tempPlaylist, device_id);

            // otherwise
            // redo the workflow, from getting a song's id,
            // as an access token has been taken since the initialisation
            else getSongID(accessToken, tempPlaylist, device_id);

        // otherwise, if a user's playlist is empty but a searched keyword is found
        } else if (!available && search) {

            // play the found song
            songPreview(accessToken, id);
        }
    } catch(err) {
        errHandling(err);
    }
}

// REDIRECT USER BACK TO THE AUTHORISATION PAGE WHEN AN ACCESS TOKEN IS EXPIRED
async function redirectToAuth(status, message) {
    console.log(status, message)

    // fetch an endpoint from the server side to get an uri
    // to reload the authorisation page
    const requestAuth = await fetch('/reload/');
    const AUTH_URI = await requestAuth.json();
    location.href = AUTH_URI;
}


// SEARCH SONGS
async function searchSongsByKeywords(accessToken, BASE_URL) {

    // get the song title and artist name from the input field
    let title = song_title.value,
        artist = artist_name.value;

    // query params
    const QUERY = title + ' ' + artist + '&type=track&limit=1';

    // get the url
    const FETCH_URL = BASE_URL + 'q=' + QUERY;

    // create options object that include Authorisation header
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    };

    // fetch the url with provided options
    try {
        const request = await fetch(FETCH_URL, options);
        const json = await request.json();
        const status = request.status;
        
        // check for the expiry of an access token
        if (status !== 401) {

            // get the song's id
            const id = json.tracks.items[0].id;

            // pass the id to the getAudioFeature func, no tracks but with searches
            getAudioFeature(id, accessToken, false, true, null);
        } else {

            redirectToAuth(status, 'Timeout!!! Please log back into your account');
        }
    } catch(err) {
        errHandling(err);
    }
}

// FIND A TRACK FROM A PLAYLIST
async function getATrackFromAPlaylist(accessToken, tracks) {

    // create an options instance
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    };

    // try make a request
    try {

        const request = await fetch(tracks, options);
        const track_info = await request.json();
        
        // find a random track
        const random_item = Math.floor(Math.random() * track_info.items.length);
        const track_uri = track_info.items[random_item].track.href;
        
        return track_uri;

    // catch error
    } catch(err) {
        errHandling(err);
    }
}

// SONGS AVAILABLE IN USERS' PLAYLIST
async function songsAvailable(accessToken, tracks, tempPlaylist, ) {

    const track_uri = await getATrackFromAPlaylist(accessToken, tracks);
    
    // create an options instance
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    }

    // try making a request
    try {

        const request = await fetch(track_uri, options);
        const song = await request.json();

        // get the song's id
        const id = song.id;

        // pass the id to the getAudioFeature func, with tracks, and no searches
        getAudioFeature(id, accessToken, true, false, tempPlaylist);
    } catch(err) {
        errHandling(err);
    }
}

// GET A RANDOM CHARACTER
function getRandomCharacter() {

    // a list of characters that can be chosen
    const char = 'abcdefghijklmnopqrstuvwxyz';

    // get random character from the string
    const randomChar = char.charAt(Math.floor(Math.random() * char.length));

    return randomChar;
}

// NO SONGS AVAILABLE IN USERS' PLAYLIST
async function songsNotAvailable(accessToken, BASE_URL, tempPlaylist, device_id) {

    // search limit
    const lim = 10;

    // random character
    const randomChar = getRandomCharacter();

    // market
    const MARKET = 'from_token';
    
    // query params
    const QUERY = randomChar + `&type=track&market=${MARKET}&limit=${lim}`;

    // get the url
    const FETCH_URL = BASE_URL + 'q=' + QUERY;

    // create options object that include Authorisation header
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    };

    // fetch the url with provided options
    try {
        const request = await fetch(FETCH_URL, options);
        const json = await request.json();

        // get the song's id
        const random_value = Math.floor(Math.random() * lim);

        const id = json.tracks.items[random_value].id;
        const preview_url = json.tracks.items[random_value].preview_url;
        const title = json.tracks.items[random_value].name;
        console.log(json.tracks.items[random_value]);

        console.log(id);

        // pass the id to the getAudioFeature func, no tracks, and no searches
        getAudioFeature(id, preview_url, title, accessToken, false, false, tempPlaylist, device_id);
    } catch(err) {
        errHandling(err);
    }
}

function searchOnUserPlaylist() {

    // if a radio button that reppresents an option of playing songs on playlists is true
    if (radio_btn1.checked && !radio_btn2.checked) {
        return true;
    } else return false;
}

// GET USER PROFILE
async function getUserPlaylists(accessToken, BASE_URL, tempPlaylist, device_id) {

    // get the url
    const URL = 'https://api.spotify.com/v1/me/playlists';

    // create an object for parsing the endpoint
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        } 
    };
    
    // try fetching it
    try {
        const request = await fetch(URL, options);
        const playlists = await request.json();
        const status = request.status;

        // check for the expiry of an access token
        if (status !== 401) {
        
            // if there are available playlists in a user account
            if (playlists.items.length > 0) {

                // get a random number
                const random_item = Math.floor(Math.random() * playlists.items.length);

                // find all tracks from a random playlist
                const tracks = playlists.items[random_item].tracks.href;
                
                // find out if the user wants to play songs on their playlist
                // or play those off the playlist
                const onUserPlaylist = searchOnUserPlaylist();
                
                if (onUserPlaylist)
                    songsAvailable(accessToken, tracks, tempPlaylist, );
                else songsNotAvailable(accessToken, BASE_URL, tempPlaylist, device_id);

            // otherwise
            } else {
                songsNotAvailable(accessToken, BASE_URL, tempPlaylist, device_id);
            }

        // if the access token is expired
        } else {

            // redirect back to the authorisation page
            redirectToAuth(status, 'Timeout!!! Please log back into your account');
        }

    // catch error
    } catch(err) {
        errHandling(err);
    }
}

// GET SONG ID
async function getSongID(accessToken, tempPlaylist, device_id) {

    // base URL
    const BASE_URL = 'https://api.spotify.com/v1/search?';

    // check for which button is pressed
    // if button 1
    // check for input of a song's name and search it
    // if (num == 1) {

    //     searchSongsByKeywords(accessToken, BASE_URL);

    // // otherwise
    // // search random songs
    // } else if (num == 3) {

    //     // first of all, find out if there is a playlist in a user's account
    //     // if not, search songs with random keywords
    //     // otherwise, search songs randomly on his / her playlist
    //     getUserPlaylists(accessToken, BASE_URL, tempPlaylist);
    // }
    getUserPlaylists(accessToken, BASE_URL, tempPlaylist, device_id);
}


// GET A USER'S EMOTION FROM EMOTION.JS FILE
async function getEmotion(device_id) {

    // if detecting is yet to be true
    // if (!detecting) {
    //     setTimeout(() => {
    //         getEmotion(device_id)
    //     }, 1000);

    // // otherwise
    // } else {

        // create an empty array for a temporary playlist
        let tempPlaylist = [];

        // // get the query string and split it using the = sign as a separator
        // const splitted_queryString = location.search.split('=');
        
        // // get the access token
        // const TOKEN = splitted_queryString[splitted_queryString.length - 1];

        // start getting a song's id
        await getSongID(TOKEN, tempPlaylist, device_id);
    // }
}

// getAPI()
//     .then(() => { console.log(lyricsData.message.body) });