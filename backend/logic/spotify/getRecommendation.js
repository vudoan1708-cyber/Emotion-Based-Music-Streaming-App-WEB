const fetch = require('node-fetch');

module.exports = async function getRecommendation(TOKEN, ID, ARTIST_ID, MIN_VALENCE, MAX_VALENCE, MIN_AROUSAL, MAX_AROUSAL) {
  const seed_tracks = ID;
  const seed_artists = ARTIST_ID;
  const min_valence = MIN_VALENCE;
  const min_arousal = MIN_AROUSAL;
  const max_valence = MAX_VALENCE;
  const max_arousal = MAX_AROUSAL;

  const QUERY = `seed_artists=${seed_artists}&seed_tracks=${seed_tracks}&min_energy=${min_arousal}&max_energy=${max_arousal}&min_valence=${min_valence}&max_valence=${max_valence}`;
  const URL = `https://api.spotify.com/v1/recommendations?${QUERY}`;

  try {

    // create options object that include Authorisation header
    const options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      }
    };

    const response = await fetch(URL, options);
    const json = await response.json();

    // extract needed data only
    const ids = [];
    const preview_urls = [];
    const titles = [];
    const external_urls = [];
    const artist_names = [];
    const artist_details = [];
    const album_imgs = [];
    // console.log(json.tracks);
    // check if an access token is still valid through JSON response
    if (json.tracks !== undefined) {
      for (let i = 0; i < json.tracks.length; i++) {
        if (json.tracks[i].album.images || json.tracks[i].title !== '') {
          ids.push(json.tracks[i].id);
          preview_urls.push(json.tracks[i].preview_url);
          titles.push(json.tracks[i].name);
          external_urls.push(json.tracks[i].external_urls.spotify);
          artist_names.push(json.tracks[i].artists[0].name);
          artist_details.push(json.tracks[i].artists[0].uri);
          album_imgs.push(json.tracks[i].album.images[0]);
        }
      }
      return { ids, preview_urls, titles, external_urls, 
              artist_names, artist_details, album_imgs, TOKEN };

    } else {
      return null;
    }
  } catch (err) {
    return err;
  }
}
