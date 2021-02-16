const fetch = require('node-fetch');

module.exports = async function getVolumn(TOKEN, PLAYER_ID, PERCENT) {
  const URL = `https://api.spotify.com/v1/me/player/volume?volume_percent=${PERCENT}&device_id=${PLAYER_ID}`;
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
