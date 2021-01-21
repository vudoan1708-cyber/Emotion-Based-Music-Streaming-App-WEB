const getSongs = require('../logic/spotify/getSongs');
const getAudioFeatures = require('../logic/spotify/getAudioFeatures');
const getSongPlay = require('../logic/spotify/getSongPlay');

const getUser = require('../logic/spotify/getUser');

module.exports = (app) => {

  // songs
  app.get('/spotify', async(req, res) => {
    const TOKEN = req.query.token;
    
    try {
      const song_data = await getSongs(TOKEN);

      const feature_data = await getAudioFeatures(song_data);
      res.json(feature_data);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/play', async(req, res) => {
    const TOKEN = req.query.token;
    const PLAYLIST = req.query.playlist.split(',');
    const PLAYER_ID = req.query.player_id;

    try {
      const songPlay = await getSongPlay(TOKEN, PLAYLIST, PLAYER_ID);
      res.json(songPlay);
    } catch(err) {
      res.json(err);
    }
  });

  // users
  app.get('/user', async(req, res) => {
    const TOKEN = req.query.token;
    
    try {
      const user_data = await getUser(TOKEN);

      res.json(user_data);
    } catch(err) {
      res.json(err);
    }
  });
};
