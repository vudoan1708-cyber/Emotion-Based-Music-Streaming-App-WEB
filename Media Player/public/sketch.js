let lyricsData = null;
let mood = '';

// ERROR HANDLING
function errHandling(err) {
    console.log(err);

    if (err === 'NO ACTIVE DEVICE') {
        window.open('https://open.spotify.com/');
    }
}


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

    // try to fetch the url
    try {
        const request = await fetch(URL, options);
        const device = await request.json();
        
        // check if there is any available device
        if (device.devices.length > 0) {

            // check if the device is active
            if (device.devices[0].is_active) {

                // currently available device
                const currentDeviceId = device.devices[0].id;
                return currentDeviceId;
            } else return null;
            
        } else return '';
        

    // catch error
    } catch(err) {
        errHandling(err);
    }
}

// PLAY SONGS FROM SPOTIFY USING WEB API
async function songPlayer(accessToken, id) {

    // get a string that represents a device id
    const device_id = await getDeviceId(accessToken);

    // check if the returned device id is null
    if (device_id === null || device_id === '')
        errHandling('NO ACTIVE DEVICE');

    // otherwise
    else {

        // get the url
        const BASE_URL = 'https://api.spotify.com/v1/me/player/play?',
              FETCH_URL = BASE_URL + 'q=' + device_id;

        // check for a single id 
        if (typeof(id) === 'string') {
            
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

            // try to fetch it
            try {
                const request = await fetch(FETCH_URL, options);
                const json = await request.json();
                console.log(json);

            // catch error
            } catch(err) {
                errHandling(err);
            }

        // or a collection of ids
        } else {
            
            // create a data instance
            const data = {
                'uris': id
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

            // try to fetch it
            try {
                const request = await fetch(FETCH_URL, options);
                const json = await request.json();
                console.log(json);

            // catch error
            } catch(err) {
                errHandling(err);
            }
        }
    }
}

// MAKE A TEMPORARY PLAYLIST OF SONGS FOR THE CUURENT MOOD
function makeATempPlaylist(accessToken, id, tempPlaylist) {

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
                    getSongID(accessToken, 3, tempPlaylist);

                    break;
                } else {
                    
                    // check the duplicates till the last element of the array
                    if (i === tempPlaylist.length - 1) {
                            
                        // append the song's id to the array
                        tempPlaylist.push(id);

                        // redo the workflow from getting a song's id, since we already have an access token
                        getSongID(accessToken, 3, tempPlaylist);

                        break;
                    }
                }
            }

        // if the array's length reaches the limit
        } else {
            
            // play the found songs
            songPlayer(accessToken, tempPlaylist);
        }

    // if the array is empty
    } else {
    
        // append the song's id to the array
        tempPlaylist.push(id);

        // redo the workflow
        getSongID(accessToken, 3, tempPlaylist);
    }
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
    await getLyrics("anh muốn được cùng em về vùng biển vắng", API_KEY);
}

// GET AUDIO FEATURE THROUGH A PROVIDED ID OF A SONG
async function getAudioFeature(id, accessToken, available, search, tempPlaylist) {

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
        const audio_value = await request.json();
        console.log(audio_value);

        // check if a user's playlist is empty and the workflow of find songs is random
        // or, if a user's playlist is available but a searched keyword is not found
        if (!available && !search || available && !search) {

            // check if the songs's valence level is less than a requested value
            if (audio_value.valence < Number(valenceLv.value)) {

                // redo the workflow, from getting a song's id,
                // as an access token has been taken since the initialisation
                getSongID(accessToken, 3, tempPlaylist);

            // otherwise
            } else {

                // make a temporary playlist for the mood
                makeATempPlaylist(accessToken, id, tempPlaylist);
            }

        // otherwise, if a user's playlist is empty but a searched keyword is found
        } else if (!available && search) {

            // play the found song
            songPlayer(accessToken, id);
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
async function songsAvailable(accessToken, tracks, tempPlaylist) {

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
async function songsNotAvailable(accessToken, BASE_URL, tempPlaylist) {

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
    try {
        const request = await fetch(FETCH_URL, options);
        const json = await request.json();
        console.log(json);

        // get the song's id
        const id = json.tracks.items[Math.floor(Math.random() * lim)].id;

        // pass the id to the getAudioFeature func, no tracks, and no searches
        getAudioFeature(id, accessToken, false, false, tempPlaylist);
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
async function getUserPlaylists(accessToken, BASE_URL, tempPlaylist) {

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
                    songsAvailable(accessToken, tracks, tempPlaylist);
                else songsNotAvailable(accessToken, BASE_URL, tempPlaylist);

            // otherwise
            } else {
                songsNotAvailable(accessToken, BASE_URL, tempPlaylist);
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
async function getSongID(accessToken, num, tempPlaylist) {

    // base URL
    const BASE_URL = 'https://api.spotify.com/v1/search?';

    // check for which button is pressed
    // if button 1
    // check for input of a song's name and search it
    if (num == 1) {

        searchSongsByKeywords(accessToken, BASE_URL);

    // otherwise
    // search random songs
    } else if (num == 3) {

        // first of all, find out if there is a playlist in a user's account
        // if not, search songs with random keywords
        // otherwise, search songs randomly on his / her playlist
        getUserPlaylists(accessToken, BASE_URL, tempPlaylist);
    }
}

// GET SPOTIFY TOKEN NUMBER
async function getToken(num) {

    // create an empty array for a temporary playlist
    let tempPlaylist = [];

    // get the query string and split it using the = sign as a separator
    const splitted_queryString = location.search.split('=');
    
    // get the access token
    const TOKEN = splitted_queryString[splitted_queryString.length - 1];

    // check for whichever button is clicked
    // and pass the access token to a corresponding function
    if (num == 1)
        await getSongID(TOKEN, num, null);
    else if (num == 2)
        await getUserPlaylists(TOKEN);
    else if (num == 3)
        await getSongID(TOKEN, num, tempPlaylist);
}

// getAPI()
//     .then(() => { console.log(lyricsData.message.body) });