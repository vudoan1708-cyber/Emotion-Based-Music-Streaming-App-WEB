<template>
  <div id="playlist_container">

    <!-- Collected Tracks -->
    <h3>Collected Tracks</h3>
    <div ref="collectedTracksStyling" id="collected" style="min-height: 30%;"
                @mouseup="endDrag('collected')">
      <div class="songs">
        <div class="tracks" v-for="data in acceptedSongData" :key="data.id">
          <img :src="data.album_imgs.url"
                :style="{ width: data.album_imgs.width, height: data.album_imgs.height }"
                draggable="false" @dragstart="false" />
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
    <div ref="allTracksStyling" id="all" style="min-height: 40%;"
              @mouseup="endDrag('all')">
      <div class="tracks" v-for="data in allSongData" :key="data.id"
              @mousedown="initDrag(data.id)">
        <img :src="data.album_imgs.url"
              :style="{ width: data.album_imgs.width, height: data.album_imgs.height }"
              draggable="false" @dragstart="false" />
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
import { ref, reactive, getCurrentInstance } from 'vue';

export default {
  name: 'Playlist',
  setup() {
    const allTracksStyling = ref(null);
    const collectedTracksStyling = ref(null);

    // instantiate the app's current instance to get global properties
    // registered in the main.js file
    const app = getCurrentInstance();
    const emitter = app.appContext.config.globalProperties.$emitter;

    const allSongData = ref([]);
    const acceptedSongData = ref([]);

    const draggableElement = reactive({
      metadata: '',
      prop: {
        opacity: '100%',
      },
    });

    // subscribe to the 'song_data' event
    emitter.on('song_data', (data) => {
      // if a new song is added
      if (data.how === 'add') {
        // push received data to the array
        allSongData.value.push(data.song);
        if (allTracksStyling.value.style.minHeight === '40%') allTracksStyling.value.style.minHeight = '';

        // handle collected tracks
        if (data.song.label === 'accepted') {
          acceptedSongData.value.push(data.song);
          if (collectedTracksStyling.value.style.minHeight === '30%') collectedTracksStyling.value.style.minHeight = '';
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
        collectedTracksStyling.value.style.minHeight = '30%';
        acceptedSongData.value = [...data.playlist];
      }
    });

    // Init Dragging Elements
    function initDrag(id) {
      // Loop Through All Tracks Array
      allSongData.value.forEach((s) => {
        // If It Finds The Matched Song IDs, Reassigns Its Metadata To Another Var
        if (s.id === id) draggableElement.metadata = s;
      });
    }

    // Drop Elements via Mouse Up
    function endDrag(where) {
      if (where === 'all') {
        console.log('SAME PLACE');

      // If The Song Is Dropped on The Collected Area
      } else {
        console.log(draggableElement.metadata);
        if (draggableElement.metadata !== '') {
          // Push Its Metadata To The acceptedSongData Var
          acceptedSongData.value.push(draggableElement.metadata);
        } else console.log('FAILED TO MOVE');
      }

      // Then Reset Its Properties
      draggableElement.isDragged = false;
      draggableElement.metadata = '';
    }

    return {
      collectedTracksStyling,
      allTracksStyling,
      allSongData,
      acceptedSongData,
      initDrag,
      endDrag,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_playlist';
</style>
