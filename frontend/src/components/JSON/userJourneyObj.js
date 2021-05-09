export default function userJourneyObj(id, x, y, i, j, title, content,
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
      diary: {
        title,
        content,
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
