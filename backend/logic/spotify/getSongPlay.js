const fetch = require('node-fetch');

module.exports = async function getSongPlay(TOKEN, PLAYLIST, PLAYER_ID, POSITION_MS, OFFSET) {
  const data = OFFSET !== undefined 
  ? {
    'uris': PLAYLIST,
    'play': true,
    /* offset track position can only work when
        there's no duplicate to the start track in the uris field */
    'offset': {
      'position': OFFSET,
    },
    'position_ms': POSITION_MS,
  }
  : {
    'uris': PLAYLIST,
    'play': true,
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
