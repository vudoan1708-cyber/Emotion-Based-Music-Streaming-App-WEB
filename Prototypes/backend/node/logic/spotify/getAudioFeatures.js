const fetch = require('node-fetch');

// logic
const sleep = require('../utils/sleep');

module.exports = async function getAudioFeature(data) {
  // get the url
  const BASE_URL = 'https://api.spotify.com/v1/audio-features/?';
  let concatinatedID = '';

  ids.forEach((id, index) => {
    if (index !== ids.length - 1)
      concatinatedID += `${id},`;
    else concatinatedID += `${id}`;
  })
  const FETCH_URL = BASE_URL + 'ids=' + concatinatedID;
  // console.log(FETCH_URL)

  // create options object that includes Authorisation header
  const options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + TOKEN
    }
  };

  // fetch the url with the provided options
  try {

      const request = await fetch(FETCH_URL, options);
      const json = await request.json();
      const audio_features = json.audio_features;

      for (let i = 0; i < audio_features.length; i++) {

        const song_emotion = audio_features[i];

        console.log(song_emotion.valence, song_emotion.energy, valence, arousal);
        // console.log(song_emotion)

        if (i < audio_features.length - 1) {

            if (valence > song_emotion.valence - 0.050 && 
                    valence < song_emotion.valence + 0.050
                && arousal > song_emotion.energy - 0.050 && 
                    arousal < song_emotion.energy + 0.050) {

                        // make a temporary playlist for the mood
                        makeATempPlaylist(accessToken, ids[i], preview_urls[i], titles[i], tempPlaylist, valence, arousal, song_emotion.valence, song_emotion.energy);
            }
        }
        
        else {
          await sleep(500);
          
          getSongID(accessToken, tempPlaylist, valence, arousal);
        }
      }     
      
  } catch(err) {
      errHandling(err);
  }
}