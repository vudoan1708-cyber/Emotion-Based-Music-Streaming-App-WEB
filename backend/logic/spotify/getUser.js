const fetch = require('node-fetch');

module.exports = async function getUser(TOKEN) {

  // get the url
  const URL = 'https://api.spotify.com/v1/me';

  // create options object that includes Authorisation header
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
    },
  };

  // fetch the url with the provided options
  try {
    const request = await fetch(URL, options);
    const json = await request.json();

    const ID = json.id;
    const COUNTRY = json.country;
    const NAME = json.display_name;
    const EMAIL = json.email;
    const IMAGES = json.images;

    return { ID, COUNTRY, NAME, EMAIL, IMAGES };
  } catch (err) {
    console.warn(err);
    return err;
  }
}
