let lyricsData = null;

// GET AN ACTIVE DEVICE ID
async function getDeviceId(accessToken) {

    // get the url
    const URL = 'https://api.spotify.com/v1/me/player/devices'

    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    }

    const request = await fetch(URL, options);
    const device = await request.json();

    // currently active device
    const currentDeviceId = device.devices[0].id;
    
    return currentDeviceId;
}

// PLAY SONGS FROM SPOTIFY USING WEB API
async function songPlayer(accessToken, id) {

    // get a string that represents a device id
    const device_id = await getDeviceId(accessToken);

    // get the url
    const BASE_URL = 'https://api.spotify.com/v1/me/player/play?',
          FETCH_URL = BASE_URL + 'q=' + device_id;
          
    // create a data instance
    const data = {
        'uris': ['spotify:track:' + id]
    };

    // create an options instance
    const options = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(data)
    };

    // fetch it
    const request = await fetch(FETCH_URL, options);
    const json = await request.json();
    console.log(json);
}

// GET SONG TITLE THROUGH LYRICS
async function getLyrics(lyrics, apiKey) {

    // get the URL
    const URL = `http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${lyrics}&apikey=${apiKey}`

    // fetch it
    const request = await fetch(URL);
    lyricsData = await request.json();
    return lyricsData;
}

// GET THE API_KEY STORED FROM THE SERVESIDE
async function getAPI() {

    // fetch the endpoint from the server side
    const request = await fetch('/api/');

    // pass the api key to a local variable
    const API_KEY = await request.json();

    // call the getLyrics function
    await getLyrics("I love you baby and if it's quite alright I need you baby", API_KEY);
}



// GET AUDIO FEATURE THROUGH A PROVIDED ID OF A SONG
async function getAudioFeature(id, accessToken, available) {

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
    const request = await fetch(FETCH_URL, options);
    const audio_value = await request.json();
    console.log(audio_value);

    // check if a user's playlist is empty
    if (!available) {

        // check if the songs's valence level is less than a requested value
        if (audio_value.valence < valenceLv.value) {

            // redo the workflow
            getToken(3);

        // otherwise
        } else {

            // play the found song
            songPlayer(accessToken, id);
        }

    // otherwise
    } else {

        // play the found song
        songPlayer(accessToken, id);
    }
}


// SONGS AVAILABLE IN USERS' PLAYLIST
async function songsAvailable(accessToken, BASE_URL) {

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
    const request = await fetch(FETCH_URL, options);
    const json = await request.json();
    console.log(json);

    // get the song's id
    const id = json.tracks.items[0].id;

    // pass the id to the getAudioFeature func
    getAudioFeature(id, accessToken, true);
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
async function songsNotAvailable(accessToken, BASE_URL) {

    // search limit
    const lim = 10;

    // random character
    const randomChar = getRandomCharacter();
    
    // query params
    const QUERY = randomChar + '&type=track&limit=' + lim;

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
    const request = await fetch(FETCH_URL, options);
    const json = await request.json();
    console.log(json);

    // get the song's id
    const id = json.tracks.items[Math.floor(Math.random() * lim)].id;

    // pass the id to the getAudioFeature func
    getAudioFeature(id, accessToken, false);
}


// GET SONG ID
async function getSongID(accessToken, num) {

    // base URL
    const BASE_URL = 'https://api.spotify.com/v1/search?';

    // check for which button is pressed
    // if button 1
    // check for input of a song's name and search it
    if (num == 1) {

        songsAvailable(accessToken, BASE_URL);

    // otherwise
    // get a random character for a random song search
    } else if (num == 3) {

        songsNotAvailable(accessToken, BASE_URL);
    }
}


// GET USER PROFILE
async function getUserPlaylists(accessToken) {

    // get the url
    const URL = 'https://api.spotify.com/v1/me/playlists';

    // create an object for parsing the endpoint
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        } 
    };
    
    const request = await fetch(URL, options);
    const json = await request.json();
    console.log(json);
}


// GET SPOTIFY TOKEN NUMBER
async function getToken(num) {

    // get the query string and split it using the = sign as a separator
    const splitted_queryString = location.search.split('=');
    
    // get the access token
    const TOKEN = splitted_queryString[splitted_queryString.length - 1];

    // check for whichever button is clicked
    // and pass the access token to a corresponding function
    if (num == 1)
        await getSongID(TOKEN, num);
    else if (num == 2)
        await getUserPlaylists(TOKEN);
    else if (num == 3)
        await getSongID(TOKEN, num);
}


// initialise the function as the website starts to get the web SDK defined first
// without using an actual access token
// songPlayer(null);

// getAPI()
//     .then(() => { console.log(lyricsData.message.body) });