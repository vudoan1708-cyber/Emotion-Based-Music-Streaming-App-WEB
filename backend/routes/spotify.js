const getSongs = require('../logic/spotify/getSongs');
const getRecommendation = require('../logic/spotify/getRecommendation');
const getAudioFeatures = require('../logic/spotify/getAudioFeatures');
const getSongPlay = require('../logic/spotify/getSongPlay');
const getSongPause = require('../logic/spotify/getSongPause');
const getSongIsPlaying = require('../logic/spotify/getSongIsPlaying');
const getPlayerInfo = require('../logic/spotify/getPlayerInfo');
const getSongSeek = require('../logic/spotify/getSongSeek');
const getSongShuffle = require('../logic/spotify/getSongShuffle');
const getSongRepeat = require('../logic/spotify/getSongRepeat');
const getNextSong = require('../logic/spotify/getNextSong');
const getPreviousSong = require('../logic/spotify/getPreviousSong');
const getVolume = require('../logic/spotify/getVolume');

const getUser = require('../logic/spotify/getUser');
const getUserPersonalisation = require('../logic/spotify/getUserPersonalisation');
const addSong = require('../logic/spotify/addSong');

module.exports = (app) => {

  // songs
  app.get('/spotify/search', async(req, res) => {
    const TOKEN = req.query.token;
    const KEYWORD = req.query.keyword;
    const TYPE = req.query.search_type;
    const GENRE = req.query.genre;
    const LIMIT = req.query.limit !== 'undefined' ? req.query.limit : undefined;
    
    try {
      const song_data = await getSongs(TOKEN, KEYWORD, TYPE, GENRE, LIMIT);

      const feature_data = song_data.type === undefined ? await getAudioFeatures(song_data) : await getSongs(TOKEN, escape(KEYWORD), TYPE, GENRE, LIMIT);
      res.json(feature_data);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/spotify/recommendation', async(req, res) => {
    const TOKEN = req.query.token;
    const ID = req.query.id;
    const ARTIST_ID = req.query.artist_id;
    const MIN_VALENCE = Number(req.query.min_valence) < 0 ? '0' : req.query.min_valence;
    const MAX_VALENCE = Number(req.query.max_valence) > 1 ? '1' : req.query.max_valence;
    const MIN_AROUSAL = Number(req.query.min_arousal) < 0 ? '0' : req.query.min_arousal;
    const MAX_AROUSAL = Number(req.query.max_arousal) > 1 ? '1' : req.query.max_arousal;

    try {
      const song_data = await getRecommendation(TOKEN, ID, ARTIST_ID, MIN_VALENCE, MAX_VALENCE, MIN_AROUSAL, MAX_AROUSAL);

      const feature_data = await getAudioFeatures(song_data);
      res.json(feature_data);
    } catch(err) {
      res.json(err);
    }
  });

  // player
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
    const POSITION_MS = Number(req.query.position_ms);
    const OFFSET = req.query.offset !== 'undefined' ? Number(req.query.offset) : undefined;

    try {
      await getSongPlay(TOKEN, PLAYLIST, PLAYER_ID, POSITION_MS, OFFSET);
      res.json({
        statusCode: 204,
      });
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

  app.get('/player/seek', async(req, res) => {
    const TOKEN = req.query.token;
    const PLAYER_ID = req.query.player_id;
    const POSITION_MS = req.query.position_ms;

    try {
      const songSeek = await getSongSeek(TOKEN, PLAYER_ID, POSITION_MS);
      res.json(songSeek);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/player/shuffle', async(req, res) => {
    const TOKEN = req.query.token;
    const PLAYER_ID = req.query.player_id;
    const STATE = req.query.state;

    try {
      const songShuffle = await getSongShuffle(TOKEN, PLAYER_ID, STATE);
      res.json(songShuffle);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/player/repeat', async(req, res) => {
    const TOKEN = req.query.token;
    const PLAYER_ID = req.query.player_id;
    const STATE = req.query.state;

    try {
      const songRepeat = await getSongRepeat(TOKEN, PLAYER_ID, STATE);
      res.json(songRepeat);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/player/skip', async(req, res) => {
    const TOKEN = req.query.token;
    const PLAYER_ID = req.query.player_id;
    const HOW = req.query.how;

    try {
      const songSkip = HOW === 'next' ? await getNextSong(TOKEN, PLAYER_ID) : await getPreviousSong(TOKEN, PLAYER_ID);
      res.json(songSkip);
    } catch(err) {
      res.json(err);
    }
  });

  app.get('/player/volume', async(req, res) => {
    const TOKEN = req.query.token;
    const PLAYER_ID = req.query.player_id;
    const PERCENT = req.query.percent;

    try {
      const volume = await getVolume(TOKEN, PLAYER_ID, PERCENT);
      res.json(volume);
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
          : ((personalised_data.message === 'not success' && personalised_data.ids.length > 0) ? await getAudioFeatures(personalised_data)
          : {'message': 'no personalised data'});
      res.json(feature_data);
    } catch(err) {
      res.json(err);
    }
  });
};
