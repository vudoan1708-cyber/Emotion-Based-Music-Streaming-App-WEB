<template>
  <div id="playlist_container" @mousemove="duringDrag">

    <!-- Collected Tracks -->
    <h3>Collected Tracks: {{ acceptedSongData.length }}</h3>
    <div ref="collectedTracksStyling" id="collected" style="min-height: 30%;"
                @mouseup="endDrag('collected')">
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

    <!-- All Tracks -->
    <h3>All Tracks: {{ allSongData.length }}</h3>
    <div ref="allTracksStyling" id="all" style="min-height: 40%;"
              @mouseup="endDrag('all')">
      <div class="tracks" v-for="data in allSongData" :key="data.id"
              @mousedown="initDrag($event, data.id)">
        <img :src="data.album_imgs.url"
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
import { updatePlaylist, addSongToQueue } from '@/handlers/spotify';

import {
  ref, reactive, getCurrentInstance, watch,
} from 'vue';

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
    const personalisedTracks = ref([]);

    const isPlayerActive = ref(false);

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

    // subscribe to the 'song_data' event
    emitter.on('song_data', (data) => {
      if (!data.beforeLoading) {
        // if a new song is added
        if (data.how === 'add') {
          // handle collected tracks, by the system or by the user
          if (data.song.label === 'accepted' || data.song.label === 'accepted_by_user') {
            acceptedSongData.value.push(data.song);
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
        } else {
          // reset
          collectedTracksStyling.value.style.minHeight = '30%';
          acceptedSongData.value = [...data.playlist];
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
        // Put The Song Back To Its Original Place
        allSongData.value.splice(draggableElement.indexNum, 0, draggableElement.metadata);
      // If The Song Is Dropped on The Collected Area
      } else {
        // If The Song Was Found Before The Mouseup Event
        if (draggableElement.metadata !== '') {
          // Update The Playlist and Visualisation Via This Function
          draggableElement.metadata.label = 'accepted_by_user';
          updatePlaylist(draggableElement.metadata, 'add', emitter);

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
      }
    }

    // Watch Function cannot wait for a response from an execution on ASYNC/AWAIT
    watch(isPlayerActive, (isActive) => {
      awaitToAddSong(isActive);
    });

    return {
      collectedTracksStyling,
      allTracksStyling,
      allSongData,
      acceptedSongData,
      initDrag,
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
