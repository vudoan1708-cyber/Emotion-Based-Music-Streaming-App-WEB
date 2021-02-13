<template>
  <div id="playing_container">

    <!-- Play Button -->
    <div @click="togglePlayPause" id="playing_button">
      <img :src="images" />
    </div>

    <!-- Playing Progress Bar -->
    <div id="playing_progress_bar"></div>

    <!-- Songs -->
    <div id="play_song_details"></div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';

import { pauseSong, playSong, getSongIsPlaying } from '@/handlers/spotify';

import Play from '@/assets/play.png';
import Pause from '@/assets/pause.png';

export default {
  name: 'Playing',
  setup() {
    // images
    const images = ref(Play);

    // Song Play
    const songPlay = reactive({
      isPlaying: false,
      type: 'track',
      progress_ms: 0,
      offset: 0,
    });

    async function togglePlayPause() {
      if (images.value === Play) {
        images.value = Pause;
        pauseSong();
      } else {
        images.value = Play;

        const songIsPlaying = await getSongIsPlaying();
        songPlay.progress_ms = songIsPlaying.response.progress_ms;
        songPlay.offset = songIsPlaying.offset;
        playSong(songPlay.progress_ms, songPlay.offset);
      }
    }

    return {
      togglePlayPause,
      images,
    };
  },
};
</script>

<style scoped lang="scss">
#playing_container {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 50%;
  z-index: 3;

  #playing_button {
    position: relative;
    width: 10%;
    margin-left: 10px;
    cursor: pointer;

    img {
      width: 100%;
      filter: invert(100%);
    }

    &:hover {
      width: 12%;
    }
  }
}
</style>
