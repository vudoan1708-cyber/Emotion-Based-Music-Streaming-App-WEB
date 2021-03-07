export default function userJourneyObj(id, x, y, i, j,
  titles, artists, valenceScores, arousalScores,
  uris, imgUrls, date, time) {
  return {
    user: {
      id,
      position: {
        x,
        y,
      },
      indices: {
        i,
        j,
      },
    },
    // Arrays
    songs: {
      titles,
      artists,
      mood_scores: {
        valence: valenceScores,
        arousal: arousalScores,
      },
      spotify: {
        uris,
        img_urls: imgUrls,
      },
    },
    //
    date,
    time,
  };
}
