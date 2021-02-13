const fetch = require('node-fetch');

module.exports = async function getSongRepeat(TOKEN, PLAYER_ID, STATE) {
  const URL = `https://api.spotify.com/v1/me/player/repeat?state=${STATE}&device_id=${PLAYER_ID}`;

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
