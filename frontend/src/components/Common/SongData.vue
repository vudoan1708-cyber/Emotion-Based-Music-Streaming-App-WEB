<template>
  <div id="song_data"
    v-if="songInfo.title !== ''"
    :style="{ top: (songInfo.attr.y - 175) + 'px', left: songInfo.attr.x + 'px' }">
    <div id="song_data_container">
      <img draggable="false" @dragstart="false" :src="songInfo.img_url" />
      <h3>{{ songInfo.title }}</h3>
      <p>{{ songInfo.valence }}</p>
      <p>{{ songInfo.arousal }}</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  name: 'SongData',
  props: {
    emitter: {
      type: Object,
    },
  },
  setup(props) {
    const emitterObj = ref(props.emitter);

    // Song Related Info
    const songInfo = reactive({
      attr: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      title: '',
      img_url: '',
      valence: 0,
      arousal: 0,
    });

    // Listen on 'song_on_hover' event
    emitterObj.value.on('song_on_hover', (song) => {
      if (song !== null) {
        songInfo.attr.x = song.x;
        songInfo.attr.y = song.y;
        songInfo.title = song.title;
        songInfo.img_url = song.album_imgs.url;
        songInfo.valence = song.valence;
        songInfo.arousal = song.arousal;
      }
    });

    return {
      songInfo,
    };
  },
};
</script>

<style scoped lang="scss">
#song_data {
  position: absolute;
  transform: translateX(-50%);
  padding: 5px;
  border-radius: 5px;
  background-color: rgba(58, 102, 80, 0.75);
  z-index: 1;
  font-size: 0.75rem;
  color: rgb(172, 172, 172);
  width: 100px;
  cursor: context-menu;

  img {
    width: 100%;
    opacity: 0.75;
  }
}
</style>
