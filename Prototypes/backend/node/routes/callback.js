const request = require('request');
const querystring = require('querystring');

module.exports = (app) => {
  const stateKey = process.env.STATE_KEY;
  const redirect_uri = process.env.REDIRECT_URI;
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
  
    // options instance
    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      // post request to the client after the redirecting
      request.post(authOptions, (error, response, body) => {
        if (!error && res.statusCode === 200) {
          const access_token = body.access_token,
                refresh_token = body.refresh_token;

          let uri = 'http://localhost:3000';

          const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };

          // we can also pass the token to the browser to make requests from there
          res.redirect(uri + '?access_token=' + access_token);
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      })
    }
  });
};