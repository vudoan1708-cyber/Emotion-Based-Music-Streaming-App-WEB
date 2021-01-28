<template>
  <div id="bottom_pane">

    <!-- The Emotion Map -->
    <div id="map" v-if="appState.map">
      <div class="map_info" id="land_name">
        <h1>{{mapProperties.name}}</h1>
      </div>
      <div class="map_info" id="coordinates">
        <div id="display">
          <img class="map_detail" id="coord_img" src="@/assets/coordinates.png"/>
          <h5 class="map_detail">{{mapProperties.coords.x}}, {{mapProperties.coords.y}}</h5>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div id="loading" v-else>
      <LoadingBar :tracks="tracks" />
    </div>
  </div>
</template>

<script>
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import { ref, reactive, getCurrentInstance } from 'vue';
import LoadingBar from '@/components/Common/LoadingBar.vue';

export default {
  name: 'BottomPane',
  components: {
    LoadingBar,
  },
  setup() {
    // instantiate the app's current instance to get global properties
    // registered in the main.js file
    const app = getCurrentInstance();
    const emitter = app.appContext.config.globalProperties.$emitter;

    const appState = reactive({
      map: true,
    });

    const mapProperties = reactive({
      coords: {
        x: 0,
        y: 0,
      },
      name: 'Regions on The Map',
      img: '',
    });

    const tracks = reactive({
      total: 0,
      artists: [],
      titles: [],
    });

    // subscribe on the 'map' event
    emitter.on('map', (map) => {
      mapProperties.coords.x = map.i;
      mapProperties.coords.y = map.j;
      mapProperties.name = map.name;
      appState.map = map.status;
    });

    // subscribe to the 'song_data' event
    emitter.on('song_data', (data) => {
      // handle removeAll label
      if (data.song !== undefined) {
        if (!data.beforeLoading && tracks.total < 5) {
          if (data.song.label === 'accepted' || data.song.label === 'accepted_by_user' || data.song.label === 'user_playlist') {
            tracks.total += 1;
            tracks.artists.push(data.song.artist_names);
            tracks.titles.push(data.song.title);
          }
        }

      // reset the array's length
      } else {
        tracks.total = 0;
        tracks.artists = [];
        tracks.titles = [];
      }
    });

    return {
      appState,
      mapProperties,
      tracks,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_bottom_pane';
</style>
