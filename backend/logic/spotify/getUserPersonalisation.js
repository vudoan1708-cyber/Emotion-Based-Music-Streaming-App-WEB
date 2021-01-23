const fetch = require('node-fetch');

module.exports = async function getUserPersonalisation(TOKEN, type, offset) {

  // get the url
  const URL = `https://api.spotify.com/v1/me/top/${type}?limit=20&offset=${offset}`;

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

    // extract needed data only
    const ids = [];
    const preview_urls = [];
    const titles = [];
    const external_urls = [];
    const artist_names = [];
    const artist_details = [];
    const album_imgs = [];

    let nextURL = null;

    // check if an access token is still valid through JSON response
    if (json.items.length !== 0) {
      nextURL = json.next;
      const items = json.items;

      for (let i = 0; i < items.length; i++) {
        ids.push(items[i].id);
        preview_urls.push(items[i].preview_url);
        titles.push(items[i].name);
        external_urls.push(items[i].album.external_urls.spotify);
        artist_names.push(items[i].album.artists[0].name);
        artist_details.push(items[i].artists[0].uri);
        album_imgs.push(items[i].album.images[0]);
      }
    }

    return { ids, preview_urls, titles, external_urls, 
              artist_names, artist_details, album_imgs, nextURL, TOKEN };
  } catch (err) {
    console.warn(err);
    return err;
  }
}
