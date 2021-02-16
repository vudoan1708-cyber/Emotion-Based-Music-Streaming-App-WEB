const fetch = require('node-fetch');

module.exports = async function getNextSong(TOKEN, PLAYER_ID) {
  const URL = `https://api.spotify.com/v1/me/player/next?device_id=${PLAYER_ID}`;

  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
  }

  try {
    const request = await fetch(URL, options);
    const response = await request.json();
    return response;
  } catch (err) {
    return err;
  }
}
