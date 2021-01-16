const querystring = require('querystring');

module.exports = (app) => {
  const SCOPE = 'user-read-private user-read-email user-modify-playback-state user-read-playback-state playlist-modify-public playlist-modify-private user-top-read streaming';

  const auth = () => Math.random().toString(36).slice(5, 11).toUpperCase()

  app.get('/login', (req, res) => {

    // get the randomly created string
    const AUTH_ID = auth();

    // create a querystring for Spotify oauth endpoint with required params
    const QUERY = querystring.stringify({
      response_type: 'code',
      scope: SCOPE,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      redirect_uri: process.env.REDIRECT_URI,
      state: AUTH_ID,
      show_dialog: true,
    });

    // set cookie for authenticating correct redirecting
    res.cookie(process.env.STATE_KEY, AUTH_ID);

    // redirect the page carrying the payload created above
    res.redirect('https://accounts.spotify.com/authorize?' + QUERY);
  });
};