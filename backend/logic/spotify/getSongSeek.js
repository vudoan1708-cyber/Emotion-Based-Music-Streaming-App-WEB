const fetch = require('node-fetch');

module.exports = async function getSongSeek(TOKEN, PLAYER_ID, POSITION_MS) {
  const URL = `https://api.spotify.com/v1/me/player/seek?position_ms=${POSITION_MS}&device_id=${PLAYER_ID}`;

  const options = {
    method: 'PUT',
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
  } catch (err) {
    return err;
  }
}
