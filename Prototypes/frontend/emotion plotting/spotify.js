import getUserEmotion from './emotion.js';

let user_emotion = null,
    song_emotion = null;

let songCollected = false;

// ERROR HANDLING
function errHandling(err) {
    console.log(err);

    if (err === 'NO ACTIVE DEVICE') {
        window.open('https://open.spotify.com/');
    }
}


let preview_urls = [], 
    titles = [];

// MAKE A TEMPORARY PLAYLIST OF SONGS FOR THE CUURENT MOOD
function makeATempPlaylist(accessToken, id, preview_url, title, tempPlaylist) {

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
                    getSongID(accessToken, tempPlaylist);

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
                        getSongID(accessToken, tempPlaylist);

                        break;
                    }
                }
            }

        // if the array's length reaches the limit
        } else {
            
            // Play a track using our new device ID
            // playSong(accessToken, tempPlaylist);
            songCollected = true;
            console.log(tempPlaylist);
            export default { user_emotion, song_emotion, songCollected };
        }

    // if the array is empty
    } else {
    
        // append the song's id to the array
        tempPlaylist.push(id);
        
        preview_urls.push(preview_url);

        titles.push(title);

        // redo the workflow
        getSongID(accessToken, tempPlaylist);
    }
}


// GET AUDIO FEATURE THROUGH A PROVIDED ID OF A SONG
async function getAudioFeature(id, preview_url, title, accessToken, available, search, tempPlaylist, valence, arousal) {
    
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
        song_emotion = await request.json();
        console.log(song_emotion.valence.toFixed(3), song_emotion.energy.toFixed(3));
        // console.log(song_emotion)

        // check if a user's playlist is empty and the workflow of find songs is random
        // or, if a user's playlist is available but a searched keyword is not found
        if (!available && !search || available && !search) {

            // CATEGORISING DIFFERENT EMOTION VALUES
            // happy
            if (valence > song_emotion.valence.toFixed(2) - 0.15 || valence < song_emotion.valence.toFixed(2) + 0.15
                && arousal > song_emotion.energy.toFixed(2) - 0.15 || arousal < song_emotion.energy.toFixed(2) + 0.15)

                // make a temporary playlist for the mood
                makeATempPlaylist(accessToken, id, preview_url, title, tempPlaylist);

            // otherwise
            // redo the workflow, from getting a song's id,
            // as an access token has been taken since the initialisation
            else getSongID(accessToken, tempPlaylist);

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
// async function redirectToAuth(status, message) {
//     console.log(status, message)

//     // fetch an endpoint from the server side to get an uri
//     // to reload the authorisation page
//     const requestAuth = await fetch('/reload/');
//     const AUTH_URI = await requestAuth.json();
//     location.href = AUTH_URI;
// }

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

// GET A RANDOM CHARACTER
function getRandomCharacter() {

    // a list of characters that can be chosen
    const char = 'abcdefghijklmnopqrstuvwxyz';

    // get random character from the string
    const randomChar = char.charAt(Math.floor(Math.random() * char.length));

    return randomChar;
}

// NO SONGS AVAILABLE IN USERS' PLAYLIST
async function songsNotAvailable(accessToken, BASE_URL, tempPlaylist, valence, arousal) {

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
        getAudioFeature(id, preview_url, title, accessToken, false, false, tempPlaylist, valence, arousal);
    } catch(err) {
        errHandling(err);
    }
}

// GET USER PROFILE
async function getUserPlaylists(accessToken, BASE_URL, tempPlaylist, valence, arousal) {

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
        
            // get a random number
            const random_item = Math.floor(Math.random() * playlists.items.length);

            // find all tracks from a random playlist
            const tracks = playlists.items[random_item].tracks.href;
            
            songsNotAvailable(accessToken, BASE_URL, tempPlaylist, valence, arousal);

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
async function getSongID(accessToken, tempPlaylist, valence, arousal) {

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
    getUserPlaylists(accessToken, BASE_URL, tempPlaylist, valence, arousal);
}


// GET A USER'S EMOTION FROM EMOTION.JS FILE
async function getEmotion() {

    // if detecting is yet to be true
    if (!songCollected) {
        setTimeout(getEmotion, 1000);
    } else {

        // convert a string from  object to a number that represents a user's emotion
        user_emotion = await getUserEmotion();
        console.log(user_emotion.valence, user_emotion.arousal)

        // create an empty array for a temporary playlist
        let tempPlaylist = [];

        const TOKEN = '';

        // start getting a song's id
        await getSongID(TOKEN, tempPlaylist, user_emotion.valence, user_emotion.arousal);
    }
}
getEmotion();
// getAPI()
//     .then(() => { console.log(lyricsData.message.body) });