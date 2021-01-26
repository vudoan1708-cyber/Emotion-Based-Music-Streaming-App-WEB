const fetch = require('node-fetch');

module.exports = async function addSong(TOKEN, URI, PLAYER_ID) {
  const URL = `https://api.spotify.com/v1/me/player/queue?uri=${URI}&device_id=${PLAYER_ID}`;

  // create options object that include Authorisation header
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
  };

  // fetch the url with provided options
  try {
    const request = await fetch(URL, options);
    const json = await request.json();
    return json;
  } catch(err) {
    return err
  }
}
