const fetch = require('node-fetch');

const randomCharacters = require('../utils/randomCharacters');
const randomInt = require('../utils/randomNumbers');

module.exports = async function getSongs(TOKEN) {
  // base URL
  const BASE_URL = 'https://api.spotify.com/v1/search?';

  // search limit
  const lim = 10;

  // random character
  const randomChar = randomCharacters(randomInt(2, 3));

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
          'Authorization': 'Bearer ' + TOKEN
      }
  };

  // fetch the url with provided options
  try {
      const request = await fetch(FETCH_URL, options);
      const json = await request.json();
      
      // get the song's id
      const ids = [];
      const preview_urls = [];
      const titles = [];

      // check if an access token is still valid through JSON response
      if (json.tracks !== undefined) {
        for (let i = 0; i < lim; i++) {
            ids.push(json.tracks.items[i].id);
            preview_urls.push(json.tracks.items[i].preview_url);
            titles.push(json.tracks.items[i].name);
        }
        return {ids, preview_urls, titles, TOKEN};

      } else {
        return null;
      }
  } catch(err) {
      console.warn(err);
      return err;
  }
}
