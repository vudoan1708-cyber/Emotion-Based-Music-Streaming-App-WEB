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
import { reactive, watch } from 'vue';
import LoadingBar from '@/components/Common/LoadingBar.vue';

export default {
  name: 'BottomPane',
  props: {
    personalisationSettings: {
      type: Object,
    },
    emitter: {
      type: Object,
    },
  },
  components: {
    LoadingBar,
  },
  setup(props) {
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
      min: 5,
      artists: [],
      titles: [],
    });

    // subscribe on the 'map' event
    props.emitter.on('map', (map) => {
      mapProperties.coords.x = map.i;
      mapProperties.coords.y = map.j;
      mapProperties.name = map.name;
      appState.map = map.status;
    });

    // Listen on the 'song_data' event
    props.emitter.on('song_data', (data) => {
      // handle removeAll label
      if (data.song !== undefined) {
        if (!data.beforeLoading && tracks.total < tracks.min) {
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

    watch(props.personalisationSettings, (data) => {
      const datum = data[0];
      tracks.min = (datum.length !== 0 && datum[datum.length - 1].settings_data !== undefined)
        ? datum[datum.length - 1].settings_data.user.personalisation.numOfTracks
        : tracks.min;
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
