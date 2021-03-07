const fetch = require('node-fetch');

module.exports = async function getSongs(TOKEN, KEYWORD, TYPE, GENRE, LIMIT) {
  // base URL
  const BASE_URL = 'https://api.spotify.com/v1/search?';

  // search limit
  const lim = LIMIT !== undefined ? LIMIT : 10;

  // market
  const MARKET = 'from_token';

  // update KEYWORD if genre keyword is provided
  const UPDATED_KEYWORD = GENRE !== '' ? `genre:${GENRE}` : KEYWORD;
  // query params
  const QUERY = `${UPDATED_KEYWORD}&type=${TYPE}&market=${MARKET}&limit=${lim}`;

  // get the url
  const FETCH_URL = `${BASE_URL}q=${QUERY}`;

  // create options object that include Authorisation header
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    }
  };

  // fetch the url with provided options
  try {
    const request = await fetch(FETCH_URL, options);
    const json = await request.json();
    
    // extract needed data only
    const ids = [];
    const preview_urls = [];
    const titles = [];
    const external_urls = [];
    const artist_names = [];
    const artist_details = [];
    const album_imgs = [];

    // check if an access token is still valid through JSON response
    if (json.tracks !== undefined) {
      for (let i = 0; i < lim; i++) {
        // handle undefined returned item scenario
        if (json.tracks.items[i] !== undefined) {
          ids.push(json.tracks.items[i].id);
          preview_urls.push(json.tracks.items[i].preview_url);
          titles.push(json.tracks.items[i].name);
          external_urls.push(json.tracks.items[i].external_urls.spotify);
          artist_names.push(json.tracks.items[i].artists[0].name);
          artist_details.push(json.tracks.items[i].artists[0].uri);
          album_imgs.push(json.tracks.items[i].album.images[0]);
        } else continue;
      }
      return { ids, preview_urls, titles, external_urls, 
              artist_names, artist_details, album_imgs, TOKEN };

    } else {
      return null;
    }
  } catch(err) {
    console.warn(err);
    return err;
  }
}
