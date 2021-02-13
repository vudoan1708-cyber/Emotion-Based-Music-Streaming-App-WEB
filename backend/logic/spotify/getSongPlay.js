const fetch = require('node-fetch');

module.exports = async function getSongPlay(TOKEN, PLAYLIST, PLAYER_ID, POSITION_MS, OFFSET) {
  const data = {
    'uris': PLAYLIST,
    'play': true,
    'offset': {
      'position': OFFSET,
    },
    'position_ms': POSITION_MS,
  };

  const URL = `https://api.spotify.com/v1/me/player/play?device_id=${PLAYER_ID}`;

  const options = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(URL, options);
    const json = await response.json();
    return json;

  } catch(err) {
    return err;
  }
}
