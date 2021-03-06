export default function userJourneyObj(x, y, i, j,
  titles, artists, valenceScores, arousalScores,
  uris, imgUrls, date, time) {
  return {
    user: {
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
