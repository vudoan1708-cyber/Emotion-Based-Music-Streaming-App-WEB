const getSongs = require('../logic/spotify/getSongs');
const getAudioFeatures = require('../logic/spotify/getAudioFeatures');

module.exports = (app) => {
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
};
