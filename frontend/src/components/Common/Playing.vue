<template>
  <div id="playing_container"
    @mousemove="duringSeek"
    @mouseup="endSeek">

    <!-- Play Button -->
    <div @click="togglePlayPause" id="playing_button">
      <img draggable="false" @dragstart="false" :src="images" />
    </div>

    <!-- Skip Songs Buttons -->
    <div id="skip_buttons">
      <img draggable="false" @dragstart="false" @click="skipSong('previous')" :src="Previous" />
      <img draggable="false" @dragstart="false" @click="skipSong('next')" :src="Next" />
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
      <h5 @click="searchViaClick">{{ songPlay.artists }}</h5>
    </div>

    <!-- Player Settings (Shuffle Play, Repeat,...) -->
    <div id="playing_settings">
      <!-- Shuffle Mode -->
      <div class="playing_mode" :class="{ 'shuffle_hightlight': isChosen === 1 }" id="shuffle"
        @click="togglePlayerModes(1)">
        <img src="@/assets/shuffle.png" />
      </div>

      <!-- Repeat Mode -->
      <div class="playing_mode" :class="{ 'repeat_hightlight': isChosen === -1 }" id="repeat"
        @click="togglePlayerModes(-1)">
        <img src="@/assets/repeat.png" />
        <div v-if="currentRepeatState !== 'off'" id="modes">
          <h5 v-if="currentRepeatState === 'track'">1</h5>
          <h5 v-else-if="currentRepeatState === 'context'">All</h5>
        </div>
      </div>

      <!-- Volume -->
      <div id="volume">
        <input ref="volumeRef" type="range" min="1" max="100" value="100"
          @change="setVolume" />
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, watchEffect } from 'vue';

import {
  pauseSong, playSong, getSongIsPlaying,
  seekSongPosition, shuffleSong, repeatSong,
  getSongsData, changeVolume, skipSong,
} from '@/handlers/spotify';

import { Romanisation } from '@/components/Utils/logic/string';

import isEmpty from '@/components/Utils/logic/object';

import Play from '@/assets/play.png';
import Pause from '@/assets/pause.png';
import Next from '@/assets/next.png';
import Previous from '@/assets/previous.png';

export default {
  name: 'Playing',
  props: {
    appState: {
      type: Object,
    },
    mapProperties: {
      type: Object,
    },
    emitter: {
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

    // Player
    const player = reactive({
      showPlayer: props.mapProperties.usePlayerUntraditionally.showPlayer,
      elements: props.mapProperties.usePlayerUntraditionally.elements,
      offset: props.mapProperties.usePlayerUntraditionally.offset,
    });

    // Progress Seeker
    const seeker = reactive({
      isDragged: false,
      pos: {
        x: 0,
        percentage: 0,
      },
    });

    // Player Modes
    const repeatCounter = ref(0);
    const shuffleCounter = ref(0);
    // track: repeat the current track
    // context: repeat the current context
    // off: repeat off
    const repeatStates = ref(['track', 'context', 'off']);
    const currentRepeatState = ref('');

    // References
    const playingProgressRef = ref(null);
    // Player Mode (Shuffle, Repeat)
    const isChosen = ref(null);
    // Volume
    const volumeRef = ref(null);

    // Props
    const emitterObj = ref(props.emitter);

    // Toggle Play / Pause Features
    function togglePlayPause() {
      if (images.value === Play) {
        images.value = Pause;
        pauseSong();
      } else {
        images.value = Play;
        songPlay.offset = songPlay.isPlaying.offset;
        if (player.showPlayer && !isEmpty(player.elements)) {
          songPlay.offset = player.offset;
          playSong(songPlay.progress_ms, songPlay.offset, player.elements);
        } else playSong(songPlay.progress_ms, songPlay.offset);
      }
    }
    // via spacebar
    // document.body.onkeyup = (e) => {
    //   // 'Spacebar' for IE
    //   if (e.keyCode === 32 || e.key === ' ' || e.key === 'Spacebar') {
    //     togglePlayPause();
    //   }
    // };

    // Update the progress bar
    async function liveUpdatePlayerBar() {
      if (images.value === Play && !seeker.isDragged) {
        songPlay.isPlaying = await getSongIsPlaying();
        if (songPlay.isPlaying.response !== undefined
          && songPlay.isPlaying.response.item !== undefined) {
          songPlay.progress_ms = songPlay.isPlaying.response.progress_ms;
          songPlay.duration_ms = songPlay.isPlaying.response.item.duration_ms;

          if (playingProgressRef.value !== null) {
            playingProgressRef.value.style.width = `${(songPlay.progress_ms / songPlay.duration_ms) * 100}%`;
          }

          // Artists and Titles
          songPlay.artists = songPlay.isPlaying.response.item.artists[0].name;
          songPlay.title = songPlay.isPlaying.response.item.name;

          // If No Song Is Playing Anymore, Stop The Loop, and Change The Player to Pause
          setTimeout(async () => {
            songPlay.isPlaying = await getSongIsPlaying();
            if (!songPlay.isPlaying.response.is_playing
              && images.value === Play) images.value = Pause;
          }, 1200);
        } else {
          // console.log('SOMETHING IS WRONG HERE');
          // Only Handle The Error Case At The Beginning of The Song Play, Not During
          // Checking Empty Strings and Empty Object Will Help With That
          // eslint-disable-next-line no-lonely-if
          if (songPlay.artists === ''
            && songPlay.title === ''
            && isEmpty(songPlay.isPlaying)) {
            // If There is an Error, Play The First Song in The Playlist Anyway
            playSong(0);
          } else playSong(songPlay.progress_ms, songPlay.offset);
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
      if (seeker.isDragged) {
        seeker.isDragged = false;

        // Update Newly Seeked Position
        playingProgressRef.value.style.width = `${seeker.percentage}%`;

        // Find Current Seek Position
        const currentSeekPos = (seeker.percentage / 100) * songPlay.duration_ms;

        seekSongPosition(Math.floor(currentSeekPos));
      }
    }

    function togglePlayerModes(num) {
      // Shuffle Mode
      if (num === 1) {
        // Toggle On/Off
        shuffleCounter.value += 1;
        // Reset The Repeat Mode
        repeatCounter.value = 0;
        // Turn Off Current Repeat State
        currentRepeatState.value = 'off';
        // Highlight The Shuffle Mode
        if (shuffleCounter.value % 2 === 0) {
          isChosen.value = 0;
          // Trigger A Func To Call The Shuffle API
          shuffleSong(false);
        } else {
          isChosen.value = num;
          // Trigger A Func To Call The Shuffle API
          shuffleSong(true);
        }

      // Repeat Mode
      } else {
        // Reset The Shuffle Mode
        shuffleCounter.value = 0;
        // Assign Current Repeat State
        currentRepeatState.value = repeatStates.value[repeatCounter.value];
        // Trigger A Func To Call The Repeat API
        repeatSong(currentRepeatState.value);
        // eslint-disable-next-line no-lonely-if
        if (repeatCounter.value < 2) {
          repeatCounter.value += 1;
          isChosen.value = num;
        } else {
          repeatCounter.value = 0;
          isChosen.value = 0;
        }
      }
    }

    // Click To Search
    async function searchViaClick() {
      // get songs' valence and arousal data
      const audioFeatures = await getSongsData(Romanisation(songPlay.artists), 'track', '');
      // Emitted Obj
      const emitData = {
        KEYWORD: songPlay.artists,
        audioFeatures,
      };
      emitterObj.value.emit('search', emitData);

      // Emit A Number 2 Representing The Search Nav Element
      emitterObj.value.emit('nav', 2);
    }

    // Set Volume
    async function setVolume() {
      await changeVolume(volumeRef.value.value);
    }

    watchEffect(() => {
      if (props.appState.stage === 3) {
        liveUpdatePlayerBar();
      }

      // Update song position by users
      seeker.percentage = (seeker.pos.x / window.innerWidth) * 100;

      // Update Player if Player is forced to show untraditionally
      player.showPlayer = props.mapProperties.usePlayerUntraditionally.showPlayer;
      player.elements = props.mapProperties.usePlayerUntraditionally.elements;
      player.offset = props.mapProperties.usePlayerUntraditionally.offset;
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
      togglePlayerModes,
      currentRepeatState,
      searchViaClick,
      volumeRef,
      setVolume,
      Next,
      Previous,
      skipSong,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_playing';
</style>
