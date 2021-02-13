const getSongs = require('../logic/spotify/getSongs');
const getRecommendation = require('../logic/spotify/getRecommendation');
const getAudioFeatures = require('../logic/spotify/getAudioFeatures');
const getSongPlay = require('../logic/spotify/getSongPlay');
const getSongPause = require('../logic/spotify/getSongPause');
const getSongIsPlaying = require('../logic/spotify/getSongIsPlaying');
const getPlayerInfo = require('../logic/spotify/getPlayerInfo');

const getUser = require('../logic/spotify/getUser');
const getUserPersonalisation = require('../logic/spotify/getUserPersonalisation');
const addSong = require('../logic/spotify/addSong');

module.exports = (app) => {

  // songs
  app.get('/spotify/search', async(req, res) => {
    const TOKEN = req.query.token;
    const KEYWORD = req.query.keyword;
    const TYPE = req.query.search_type;
    
    try {
      const song_data = await getSongs(TOKEN, KEYWORD, TYPE);

      const feature_data = song_data.type === undefined ? await getAudioFeatures(song_data) : await getSongs(TOKEN, escape(KEYWORD), TYPE);
      res.json(feature_data);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/spotify/recommendation', async(req, res) => {
    const TOKEN = req.query.token;
    const ID = req.query.id;
    const ARTIST_ID = req.query.artist_id;
    const MIN_VALENCE = req.query.min_valence;
    const MAX_VALENCE = req.query.max_valence;
    const MIN_AROUSAL = req.query.min_arousal;
    const MAX_AROUSAL = req.query.max_arousal;

    try {
      const song_data = await getRecommendation(TOKEN, ID, ARTIST_ID, MIN_VALENCE, MAX_VALENCE, MIN_AROUSAL, MAX_AROUSAL);

      const feature_data = await getAudioFeatures(song_data);
      res.json(feature_data);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/player/is-playing', async(req, res) => {
    const TOKEN = req.query.token;

    try {
      const songPlay = await getSongIsPlaying(TOKEN);
      res.json(songPlay);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/player/play', async(req, res) => {
    const TOKEN = req.query.token;
    const PLAYLIST = req.query.playlist.split(',');
    const PLAYER_ID = req.query.player_id;
    const POSITION_MS = req.query.position_ms;
    const OFFSET = req.query.offset;

    try {
      const songPlay = await getSongPlay(TOKEN, PLAYLIST, PLAYER_ID, POSITION_MS, OFFSET);
      res.json(songPlay);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/player/pause', async(req, res) => {
    const TOKEN = req.query.token;
    const PLAYER_ID = req.query.player_id;

    try {
      const songPause = await getSongPause(TOKEN, PLAYER_ID);
      res.json(songPause);
    } catch(err) {
      res.json(err);
    }
  });

  // add new song to the end of a playlist
  app.get('/player/queue', async(req, res) => {
    const TOKEN = req.query.token;
    const URI = req.query.uri;
    const PLAYER_ID = req.query.player_id;

    try {
      const addedSong = await addSong(TOKEN, URI, PLAYER_ID);
      res.json(addedSong);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/player/info', async(req, res) => {
    const TOKEN = req.query.token;
    const PLAYER_ID = req.query.player_id;

    try {
      const playerInfo = await getPlayerInfo(TOKEN, PLAYER_ID);
      res.json(playerInfo);
    } catch(err) {
      res.json(err);
    }
  });

  // users
  app.get('/user/detail', async(req, res) => {
    const TOKEN = req.query.token;
    
    try {
      const user_data = await getUser(TOKEN);

      res.json(user_data);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/user/personalisation', async(req, res) => {
    const TOKEN = req.query.token;
    const TYPE = req.query.type;
    const OFFSET = req.query.offset;
    
    try {
      const personalised_data = await getUserPersonalisation(TOKEN, TYPE, OFFSET);

      const feature_data = personalised_data.message === 'success'
          ? await getAudioFeatures(personalised_data)
          : {'message': 'no personalised data'};
      res.json(feature_data);
    } catch(err) {
      res.json(err);
    }
  });
};
