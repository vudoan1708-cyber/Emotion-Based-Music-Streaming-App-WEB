// @ts-nocheck
const fetch = require('node-fetch');

module.exports = async function getAudioFeature(data) {

  const TOKEN = data.TOKEN;
  const IDs = data.ids;
  const PREVIEW_URLS = data.preview_urls;
  const TITLES = data.titles;

  const responses = [];
  
  // get the url
  const BASE_URL = 'https://api.spotify.com/v1/audio-features/?';
  let concatinatedID = '';

  IDs.forEach((id, index) => {

    // check the loop comes to the last element of the array
    // if not
    if (index !== IDs.length - 1)

      // concatenate the IDs with a comma after
      concatinatedID += `${id},`;

    // otherwise, add one final ID without comma
    else concatinatedID += `${id}`;
  })
  const FETCH_URL = `${BASE_URL}ids=${concatinatedID}`;
  // console.log(FETCH_URL)

  // create options object that includes Authorisation header
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
    },
  };

  // fetch the url with the provided options
  try {

    const request = await fetch(FETCH_URL, options);
    const json = await request.json();
    const audio_features = json.audio_features;

    // clean up the data from Spotify 
    // and only send what is necessary to the client
    for (let i = 0; i < audio_features.length; i++) {

      // IDs and TITLEs arrays have the same length as audio_features array
      responses.push({
        id: IDs[i],
        title: TITLES[i],
        valence: audio_features[i].valence,
        arousal: audio_features[i].energy,
        access_token: TOKEN,
      });
    }
    return responses;
      
  // catch for any error
  } catch(err) {
      console.warn(err);
      return err;
  }
}
