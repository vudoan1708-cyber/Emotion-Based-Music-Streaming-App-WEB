<template>
  <div id="playlist_container" @mousemove="duringDrag">

    <!-- Collected Tracks -->
    <h3>Collected Tracks: {{ acceptedSongData.length }}</h3>
    <div ref="collectedTracksStyling" id="collected" style="min-height: 30%;"
                @mouseup="endDrag('collected')"
                @mouseover="onMouseOverCollected(true)"
                @mouseout="onMouseOverCollected(false)">
      <div class="tracks" v-for="data in acceptedSongData" :key="data.id">
        <img v-if="data.album_imgs" :src="data.album_imgs.url"
              :style="{ width: data.album_imgs.width, height: data.album_imgs.height }"
              draggable="false" @dragstart="false" />
        <div class="song_detail">
          <h5>{{ data.title }}</h5>
          <h6>{{ data.artist_names }}</h6>
          <p>Valence {{ data.valence }} | Arousal {{ data.arousal }}</p>
        </div>
      </div>
    </div>

    <!-- All Tracks -->
    <h3>All Tracks: {{ allSongData.length }}</h3>
    <div ref="allTracksStyling" id="all" style="min-height: 40%;"
              @mouseup="endDrag('all')">
      <div class="tracks tracks_all_info" v-for="data in allSongData" :key="data.id"
              @mousedown="initDrag($event, data.id)">
        <img v-if="data.album_imgs" :src="data.album_imgs.url"
              :style="{ width: data.album_imgs.width, height: data.album_imgs.height }"
              draggable="false" @dragstart="false" />
        <div class="song_detail">
          <h5>{{ data.title }}</h5>
          <h6>{{ data.artist_names }}</h6>
          <p>Valence {{ data.valence }} | Arousal {{ data.arousal }}</p>
        </div>
      </div>

      <div :class="{ draggable: draggableElement.isDragged }"
        :style="{ top: draggableElement.attributes.pos.y + 'px',
                  left: draggableElement.attributes.pos.x + 'px' }">
        <img v-if="draggableElement.isDragged"
              :src="draggableElement.metadata.album_imgs.url" />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-lonely-if */
import { getUserProfile, updatePlaylist, addSongToQueue } from '@/handlers/spotify';

// Algorithm
import { indicestoCoordinates } from '@/components/Utils/logic/algorithm';

// MongoDB
import { getAllData, updateData } from '@/handlers/mongdb';

// JSON
import userJourneyObj from '@/components/JSON/userJourneyObj';

import {
  ref, reactive, watch,
} from 'vue';

export default {
  name: 'Playlist',
  props: {
    emitter: {
      type: Object,
    },
  },
  setup(props) {
    const allTracksStyling = ref(null);
    const collectedTracksStyling = ref(null);

    const allSongData = ref([]);
    const acceptedSongData = ref([]);
    const personalisedTracks = ref([]);

    const isPlayerActive = ref(false);

    const dateData = ref('');
    const timeData = ref('');

    // Data Obj to POST to the MongoDB database
    const dataObj = ref({});
    const dataID = ref('');
    const userData = ref('');

    const draggableElement = reactive({
      attributes: {
        pos: {
          x: 0,
          y: 0,
        },
      },
      indexNum: -1,
      isDragged: false,
      metadata: '',
    });

    const tracks = reactive({
      chosenIndices: {
        i: 0,
        j: 0,
      },
      ids: [],
      artists: [],
      titles: [],
      valenceScores: [],
      arousalScores: [],
      albumImgs: [],
    });

    // Talk to MongDB to GET back data about user listening journey / habit
    // Then, send this down to other children components
    // to visualise and configure variables' default values
    async function getUserJourney() {
      // get all user journey database
      const dataResponse = await getAllData(1);
      // get user data from spotify
      userData.value = await getUserProfile();
      if (dataResponse.length > 0) {
        // loop backwards to get the latest data
        for (let i = dataResponse.length - 1; i >= 0; i -= 1) {
          // compare and validate user via user's id
          if (dataResponse[i].data.user.id === userData.value.ID) {
            // Get Date and Time
            if (i === dataResponse.length - 1) {
              // Get The Data ID
              // eslint-disable-next-line no-underscore-dangle
              dataID.value = dataResponse[i]._id;
              dateData.value = dataResponse[i].data.date;
              timeData.value = dataResponse[i].data.time;
            }
          }
        }
      }
    }

    async function userJourneyDatabasePreparation(data) {
      acceptedSongData.value.forEach((song) => {
        tracks.ids.push(song.id);
        tracks.artists.push(song.artist_names);
        tracks.titles.push(song.title);
        tracks.valenceScores.push(song.valence);
        tracks.arousalScores.push(song.arousal);
        tracks.albumImgs.push(song.album_imgs);
      });
      if (data.how === 'finish') {
        tracks.chosenIndices.i = data.chosenIndices.i;
        tracks.chosenIndices.j = data.chosenIndices.j;
        // Use coordinatesToIndices algorithm to convert location values to indices
        const { x, y } = indicestoCoordinates(tracks.chosenIndices.i, tracks.chosenIndices.j,
          window.innerWidth, window.innerHeight);
        dataObj.value = userJourneyObj(userData.value.ID, x, y, tracks.chosenIndices.i,
          tracks.chosenIndices.j, tracks.titles, tracks.artists, tracks.valenceScores,
          tracks.arousalScores, tracks.ids, tracks.albumImgs, dateData.value, timeData.value);
      }
    }

    // subscribe to the 'song_data' event
    props.emitter.on('song_data', async (data) => {
      if (!data.beforeLoading) {
        // if a new song is added
        if (data.how === 'add') {
          // handle collected tracks, by the system or by the user
          if (data.song.label === 'accepted' || data.song.label === 'accepted_by_user') {
            acceptedSongData.value.push(data.song);
            // if (isPlayerActive.value) {
            //   // Prepare data for updating user journey database
            //   userJourneyDatabasePreparation(data);
            //   // Update user journey database
            //   await updateData(dataID.value, dataObj.value, 1);
            // }
            if (collectedTracksStyling.value.style.minHeight === '30%') collectedTracksStyling.value.style.minHeight = '';
          } else {
            // eslint-disable-next-line no-unused-expressions
            allSongData.value.length === 0
              ? allSongData.value = personalisedTracks.value
              : undefined;
            // push received data to the array
            allSongData.value.push(data.song);
            if (allTracksStyling.value.style.minHeight === '40%') allTracksStyling.value.style.minHeight = '';
          }

        // if a song is removed
        } else if (data.how === 'remove') {
          for (let i = acceptedSongData.value.length - 1; i >= 0; i -= 1) {
            // check for removing songs
            if (data.song.id === acceptedSongData.value[i].id) acceptedSongData.value.splice(i, 1);
          }

        // if all songs are removed
        } else if (data.how === 'removeAll') {
          // reset
          collectedTracksStyling.value.style.minHeight = '30%';
          acceptedSongData.value = [...data.playlist];
          tracks.ids = [];
          tracks.artists = [];
          tracks.titles = [];
          tracks.valenceScores = [];
          tracks.arousalScores = [];
          tracks.albumImgs = [];

        // if the song collection is finished
        } else if (data.how === 'finish') {
          setTimeout(async () => {
            await getUserJourney();
            // Prepare data for updating user journey database
            await userJourneyDatabasePreparation(data);
            // Update user journey database
            await updateData(dataID.value, dataObj.value, 1);
            props.emitter.emit('user_journey', dataObj.value);
          }, 1000);
        }
      } else {
        personalisedTracks.value.push(data.song);
      }
    });

    // Init Dragging Elements
    function initDrag(e, id) {
      draggableElement.isDragged = true;
      draggableElement.attributes.pos.x = e.clientX;
      draggableElement.attributes.pos.y = e.clientY;
      // Loop Through All Tracks Array
      for (let i = allSongData.value.length - 1; i >= 0; i -= 1) {
        const s = allSongData.value[i];
        // If It Finds The Matched Song IDs
        if (s.id === id) {
          // Reassigns Its Metadata To draggableElement Var
          draggableElement.metadata = s;
          // Reassign Its Index to draggableElement Var
          draggableElement.indexNum = i;
          // Delete The Element From The allSongData Array
          allSongData.value.splice(draggableElement.indexNum, 1);
        }
      }
    }

    function onMouseOverCollected(isOn) {
      // Watch if Dragged Element is On Collected Tracks Area
      if (isOn) {
        collectedTracksStyling.value.style.filter = (draggableElement.isDragged && draggableElement.metadata !== '') ? 'drop-shadow(0px 0px 10px gray)' : '';
      } else {
        collectedTracksStyling.value.style.filter = '';
      }
    }

    // During Dragging
    function duringDrag(e) {
      // If An Element is Dragged
      if (draggableElement.isDragged) {
        draggableElement.attributes.pos.x = e.clientX;
        draggableElement.attributes.pos.y = e.clientY;
      }
    }

    // Drop Elements via Mouse Up
    function endDrag(where) {
      // If The Song Is Dropped At The Original Place
      if (where === 'all') {
        // If The Song Was Found Before The Mouseup Event
        if (draggableElement.metadata !== '') {
          // Handle Error When Mouse Up Event Is Subscribed When There is no Songs Yet
          if (allSongData.value.length !== 0) {
            // Put The Song Back To Its Original Place
            allSongData.value.splice(draggableElement.indexNum, 0, draggableElement.metadata);
          }
        }
      // If The Song Is Dropped on The Collected Area
      } else {
        // If The Song Was Found Before The Mouseup Event
        if (draggableElement.metadata !== '') {
          // Update The Playlist and Visualisation Via This Function
          draggableElement.metadata.label = 'accepted_by_user';
          updatePlaylist(draggableElement.metadata, 'add', props.emitter);

          // Trigger Watch Function to Add Songs To The Player's Queue
          isPlayerActive.value = true;
        // Otherwise
        } else {
          if (draggableElement.indexNum !== -1) {
            // Put The Song Back To Its Original Place
            allSongData.value.splice(draggableElement.indexNum, 0, draggableElement.metadata);
          }
        }
      }

      // Then Reset Its Properties
      draggableElement.attributes.pos = {
        x: 0,
        y: 0,
      };
      draggableElement.indexNum = -1;
      draggableElement.isDragged = false;
    }

    async function awaitToAddSong(isActive) {
      if (isActive) {
        // Add New Song To The Player's Queue,
        // Only Applicable When The Playlist Is Playing
        await addSongToQueue(draggableElement.metadata.id);
        isPlayerActive.value = false;
        draggableElement.metadata = '';
      }
    }

    // Watch Function cannot wait for a response from an execution on ASYNC/AWAIT
    watch((isPlayerActive), (isActive) => {
      awaitToAddSong(isActive);
    });

    return {
      collectedTracksStyling,
      allTracksStyling,
      allSongData,
      acceptedSongData,
      initDrag,
      onMouseOverCollected,
      duringDrag,
      endDrag,
      draggableElement,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_playlist';
</style>
