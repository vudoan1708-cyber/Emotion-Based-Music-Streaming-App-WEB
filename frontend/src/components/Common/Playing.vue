<template>
  <div id="playing_container"
    @mousemove="duringSeek"
    @mouseup="endSeek">

    <!-- Play Button -->
    <div @click="togglePlayPause" id="playing_button">
      <img draggable="false" @dragstart="false" :src="images" />
    </div>

    <!-- Playing Progress Bar -->
    <div id="playing_progress_bar"
      @mousedown="initSeek">
      <div id="playing_progress_container">
        <div ref="playingProgressRef" id="bar"></div>
      </div>
    </div>

    <!-- Songs -->
    <div id="play_song_details">
      <h2>{{ songPlay.title }}</h2>
      <h5>{{ songPlay.artists }}</h5>
    </div>

    <!-- Player Settings (Shuffle Play, Repeat,...) -->
    <div id="playing_settings">
      <!-- Shuffle Mode -->
      <div class="playing_mode" :class="{ 'shuffle_hightlight': isChosen === 1 }" id="shuffle">
        <img src="@/assets/shuffle.png" />
      </div>

      <!-- Repeat Mode -->
      <div class="playing_mode" :class="{ 'repeat_hightlight': isChosen === 2 }" id="repeat">
        <img src="@/assets/repeat.png" />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watchEffect } from 'vue';

import {
  pauseSong, playSong, getSongIsPlaying, seekSongPosition,
} from '@/handlers/spotify';

import Play from '@/assets/play.png';
import Pause from '@/assets/pause.png';

export default {
  name: 'Playing',
  props: {
    appState: {
      type: Object,
    },
  },
  setup(props) {
    // images
    const images = ref(Play);

    // Song Play
    const songPlay = reactive({
      isPlaying: {},
      progress_ms: 0,
      duration_ms: 0,
      offset: 0,
      artists: '',
      title: '',
    });

    // Progress Seeker
    const seeker = reactive({
      isDragged: false,
      pos: {
        x: 0,
        percentage: 0,
      },
    });

    // References
    const playingProgressRef = ref(null);
    // Player Mode (Shuffle, Repeat)
    const isChosen = ref(null);

    function togglePlayPause() {
      if (images.value === Play) {
        images.value = Pause;
        pauseSong();
      } else {
        images.value = Play;
        songPlay.offset = songPlay.isPlaying.offset;
        playSong(songPlay.progress_ms, songPlay.offset);
      }
    }

    async function liveUpdatePlayerBar() {
      if (images.value === Play && !seeker.isDragged) {
        songPlay.isPlaying = await getSongIsPlaying();
        if (songPlay.isPlaying.response !== undefined) {
          songPlay.progress_ms = songPlay.isPlaying.response.progress_ms;
          songPlay.duration_ms = songPlay.isPlaying.response.item.duration_ms;
          // eslint-disable-next-line max-len
          playingProgressRef.value.style.width = `${(songPlay.progress_ms / songPlay.duration_ms) * 100}%`;

          songPlay.artists = songPlay.isPlaying.response.item.artists[0].name;
          songPlay.title = songPlay.isPlaying.response.item.name;
        } else {
          songPlay.progress_ms = 0;
        }
        setTimeout(liveUpdatePlayerBar, 1000);
      }
    }

    // Progress Bar
    function initSeek(e) {
      seeker.isDragged = true;
      seeker.pos.x = e.clientX;
    }

    function duringSeek(e) {
      if (seeker.isDragged) {
        seeker.pos.x = e.clientX;

        // Update Newly Seeked Position
        playingProgressRef.value.style.width = `${seeker.percentage}%`;
      }
    }

    function endSeek() {
      seeker.isDragged = false;

      // Update Newly Seeked Position
      playingProgressRef.value.style.width = `${seeker.percentage}%`;

      // Find Current Seek Position
      const currentSeekPos = (seeker.percentage / 100) * songPlay.duration_ms;

      seekSongPosition(Math.floor(currentSeekPos));
    }

    watchEffect(() => {
      if (props.appState.stage === 3) {
        liveUpdatePlayerBar();
      }

      seeker.percentage = (seeker.pos.x / window.innerWidth) * 100;
    });

    return {
      togglePlayPause,
      images,
      songPlay,
      playingProgressRef,
      initSeek,
      duringSeek,
      endSeek,
      isChosen,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_playing';
</style>
