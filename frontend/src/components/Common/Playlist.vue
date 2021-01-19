<template>
  <div id="playlist_container">

    <!-- Collected Tracks -->
    <h3>Collected Tracks</h3>
    <div ref="collectedTracks" id="collected" style="min-height: 30%;">
      <div class="songs">
        <div class="tracks" v-for="data in acceptedSongData" :key="data.id">
          <img :src="data.album_imgs.url"
                :style="{ width: data.album_imgs.width, height: data.album_imgs.height }"/>
          <div class="song_detail">
            <h5>{{ data.title }}</h5>
            <h6>{{ data.artist_names }}</h6>
            <p>Valence {{ data.valence }} | Arousal {{ data.arousal }}</p>
          </div>
      </div>
      </div>
    </div>

    <!-- All Tracks -->
    <h3>All Tracks</h3>
    <div ref="allTracks" id="all" style="min-height: 40%;">
      <div class="tracks" v-for="data in songData" :key="data.id">
        <img :src="data.album_imgs.url"
              :style="{ width: data.album_imgs.width, height: data.album_imgs.height }"/>
        <div class="song_detail">
          <h5>{{ data.title }}</h5>
          <h6>{{ data.artist_names }}</h6>
          <p>Valence {{ data.valence }} | Arousal {{ data.arousal }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';

export default {
  name: 'Playlist',
  setup() {
    const collectedTracks = ref(null);
    const allTracks = ref(null);

    // instantiate the app's current instance to get global properties
    // registered in the main.js file
    const app = getCurrentInstance();
    const emitter = app.appContext.config.globalProperties.$emitter;

    const songData = ref([]);
    const acceptedSongData = ref([]);

    // subscribe to the 'song_data' event
    emitter.on('song_data', (data) => {
      // if a new song is added
      if (data.how === 'add') {
        // push received data to the array
        songData.value.push(data.song);
        if (allTracks.value.style.minHeight === '40%') allTracks.value.style.minHeight = '';

        // handle collected tracks
        if (data.song.label === 'accepted') {
          acceptedSongData.value.push(data.song);
          if (collectedTracks.value.style.minHeight === '30%') collectedTracks.value.style.minHeight = '';
        }

      // if a song is removed
      } else if (data.how === 'remove') {
        for (let i = acceptedSongData.value.length - 1; i >= 0; i -= 1) {
          // check for removing songs
          if (data.song.id === acceptedSongData.value[i].id) acceptedSongData.value.splice(i, 1);
        }

      // if all songs are removed
      } else {
        // reset
        collectedTracks.value.style.minHeight = '30%';
        acceptedSongData.value = [...data.playlist];
      }
    });

    return {
      collectedTracks,
      allTracks,
      songData,
      acceptedSongData,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_playlist';
</style>
