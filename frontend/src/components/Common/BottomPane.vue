<template>
  <div id="bottom_pane">

    <!-- The Emotion Map -->
    <div id="map" v-if="appState.stage === 1">
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
    <div id="loading" v-else-if="appState.stage === 2">
      <LoadingBar :tracks="tracks" />
    </div>

    <!-- Playing -->
    <div id="playing" v-else>
      <Playing :appState="appState" :emitter="emitterObj" />
    </div>
  </div>
</template>

<script>
/* eslint-disable object-curly-newline */
import { ref, reactive, watch } from 'vue';
import LoadingBar from '@/components/Common/LoadingBar.vue';
import Playing from '@/components/Common/Playing.vue';

// Algorithm
import { indicestoCoordinates } from '@/components/Utils/logic/algorithm';

// MongoDB
import { insertData } from '@/handlers/mongdb';

// JSON
import userJourneyObj from '@/components/JSON/userJourneyObj';

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
    Playing,
  },
  setup(props) {
    const appState = reactive({
      map: true,
      stage: 1,
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
      ids: [],
      artists: [],
      titles: [],
      valenceScores: [],
      arousalScores: [],
      albumImgs: [],
    });

    // Get User ID
    const userID = ref('');

    // Props
    const emitterObj = ref(props.emitter);

    // Data Obj for userJourney database
    const dataObj = ref({});

    // Listen on the 'map' event
    emitterObj.value.on('map', (map) => {
      mapProperties.coords.x = map.i;
      mapProperties.coords.y = map.j;
      mapProperties.name = map.name;
      appState.map = map.status;

      appState.stage = !appState.map ? 2 : 1;
    });

    // Listen on the 'song_data' event
    emitterObj.value.on('song_data', async (data) => {
      // handle removeAll label
      if (data.song !== undefined) {
        if (!data.beforeLoading && tracks.total < tracks.min) {
          if (data.song.label === 'accepted' || data.song.label === 'accepted_by_user' || data.song.label === 'user_playlist') {
            tracks.total += 1;
            tracks.ids.push(data.song.id);
            tracks.artists.push(data.song.artist_names);
            tracks.titles.push(data.song.title);
            tracks.valenceScores.push(data.song.valence);
            tracks.arousalScores.push(data.song.arousal);
            tracks.albumImgs.push(data.song.album_imgs);
          }
        } else if (data.how === 'finish' && tracks.total >= tracks.min) {
          appState.stage = 3;
          const date = new Date();

          // Re-format the time
          const h = (date.getHours() < 10 ? '0' : '') + date.getHours();
          const m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
          const time = `${h}:${m}`;

          // Use coordinatesToIndices algorithm to convert location values to indices
          const { x, y } = indicestoCoordinates(data.chosenIndices.i, data.chosenIndices.j,
            window.innerWidth, window.innerHeight);

          dataObj.value = userJourneyObj(userID.value, x, y, data.chosenIndices.i,
            data.chosenIndices.j, tracks.titles, tracks.artists, tracks.valenceScores,
            tracks.arousalScores, tracks.ids, tracks.albumImgs, date, time);

          await insertData(dataObj.value, 1);
        }

      // reset the array's length
      } else {
        appState.stage = 2;
        tracks.total = 0;
        tracks.artists = [];
        tracks.titles = [];
      }
    });

    // Get The Minimum Number of Tracks To Fetch
    watch(props.personalisationSettings, (data) => {
      const datum = data[0];
      if (datum.length !== 0 && datum[datum.length - 1].data !== undefined) {
        tracks.min = Number(datum[datum.length - 1].data.user.personalisation.numOfTracks);
        userID.value = datum[datum.length - 1].data.user.id;
      } else {
        // eslint-disable-next-line no-self-assign
        tracks.min = tracks.min;
      }
    });

    return {
      appState,
      mapProperties,
      tracks,
      emitterObj,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_bottom_pane';
</style>
