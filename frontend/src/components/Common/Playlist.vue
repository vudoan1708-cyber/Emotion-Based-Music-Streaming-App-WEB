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
      // push received data to the array
      songData.value.push(data);
      if (allTracks.value.style.minHeight === '40%') allTracks.value.style.minHeight = '';

      // handle collected tracks
      if (data.label === 'accepted') {
        acceptedSongData.value.push(data);
        if (collectedTracks.value.style.minHeight === '30%') collectedTracks.value.style.minHeight = '';
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
