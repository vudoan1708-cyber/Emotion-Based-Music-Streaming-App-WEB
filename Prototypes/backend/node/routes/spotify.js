const getSongs = require('../logic/spotify/getSongs');
const getAudioFeatures = require('../logic/spotify/getAudioFeatures');

module.exports = (app) => {
  app.get('/spotify', async(req, res) => {
    const TOKEN = req.query.token;
    
    // console.log(TOKEN)
    const song_data = await getSongs(TOKEN);
    console.log(song_data);
    res.json(song_data);

    // const feature_data = await getAudioFeatures(song_data);
    // console.log(feature_data);
    // res.json(feature_data);
  });
};
