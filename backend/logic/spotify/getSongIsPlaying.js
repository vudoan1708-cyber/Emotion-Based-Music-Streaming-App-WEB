const fetch = require('node-fetch');

module.exports = async function getSongIsPlaying(TOKEN) {
  const URL = `https://api.spotify.com/v1/me/player/currently-playing?market=from_token`;

  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
  };

  try {
    const response = await fetch(URL, options);
    const json = await response.json();
    return json;

  } catch(err) {
    return err;
  }
}
