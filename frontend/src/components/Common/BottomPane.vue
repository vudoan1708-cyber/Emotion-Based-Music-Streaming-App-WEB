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
      <Playing :appState="appState" :mapProperties="mapProperties"
                :emitter="emitterObj" :mobile="isMobile" />
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
    mobile: {
      type: Boolean,
    },
  },
  components: {
    LoadingBar,
    Playing,
  },
  setup(props) {
    // Props
    const emitterObj = ref(props.emitter);
    const isMobile = ref(props.mobile);

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
      usePlayerUntraditionally: {
        showPlayer: true,
        elements: null,
        offset: 0,
      },
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

    // Data Obj for userJourney database
    const dataObj = ref({});

    // Listen on the 'map' event
    emitterObj.value.on('map', (map) => {
      // Check if A User Listens To A Playlist Via The Map
      // Or The Records Section
      if (!map.usePlayerUntraditionally.showPlayer) {
        mapProperties.coords.x = map.i;
        mapProperties.coords.y = map.j;
        mapProperties.name = map.name;
        appState.map = map.status;

        appState.stage = !appState.map ? 2 : 1;
      } else {
        // User is Playing Music from The Records section (D3.vue componnt)
        appState.stage = 3;
        mapProperties.usePlayerUntraditionally.showPlayer = map.usePlayerUntraditionally.showPlayer;
        mapProperties.usePlayerUntraditionally.elements = map.usePlayerUntraditionally.elements;
        mapProperties.usePlayerUntraditionally.offset = map.usePlayerUntraditionally.offset;
      }
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
          // Show the player
          appState.stage = 3;
          // Disable Player Properties That Is Displayed Via The Records Section
          mapProperties.usePlayerUntraditionally.showPlayer = false;
          mapProperties.usePlayerUntraditionally.elements = null;
          mapProperties.usePlayerUntraditionally.offset = 0;
          // If listeners just start listening to music using the emotion map
          // (transition will be null or undefined)
          if (data.transition !== 'transition') {
            const date = new Date();

            // Re-format the time
            const h = (date.getHours() < 10 ? '0' : '') + date.getHours();
            const m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
            const time = `${h}:${m}`;

            // Use coordinatesToIndices algorithm to convert location values to indices
            const { x, y } = indicestoCoordinates(data.chosenIndices.i, data.chosenIndices.j,
              window.innerWidth, window.innerHeight);
            dataObj.value = userJourneyObj(userID.value, x, y, data.chosenIndices.i,
              data.chosenIndices.j, 'No Title', 'No Content', tracks.titles, tracks.artists, tracks.valenceScores,
              tracks.arousalScores, tracks.ids, tracks.albumImgs, date, time);

            await insertData(dataObj.value, 1);

          // otherwise, if the emotion map is already used (transition is valid)
          // (meaning listeners are constantly using the app to keep listening to more songs)
          // This can be acheived either via selecting a song dot on the emotion map
          // or searching for songs
          }
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
    watch(props.personalisationSettings, (settingsData) => {
      if (settingsData.length > 0 && settingsData[0].data !== undefined) {
        tracks.min = Number(settingsData[0].data.user.personalisation.numOfTracks);
        userID.value = settingsData[0].data.user.id;
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
      isMobile,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_bottom_pane';
</style>
