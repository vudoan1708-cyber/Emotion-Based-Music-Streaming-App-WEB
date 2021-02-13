const fetch = require('node-fetch');

module.exports = async function getSongPause(TOKEN, PLAYER_ID) {
  const URL = `https://api.spotify.com/v1/me/player/pause?${PLAYER_ID}`;
  const options = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
  };

  try {
    const request = await fetch(URL, options);
    const response = await request.json();
    return response;
  } catch(err) {
    return err;
  }
}
