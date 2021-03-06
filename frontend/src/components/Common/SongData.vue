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
        songInfo.img_url = song.album_imgs ? song.album_imgs.url : '#';
        songInfo.valence = song.valence;
        songInfo.arousal = song.arousal;
      } else {
        songInfo.title = '';
      }
    });

    return {
      songInfo,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_song_data';
</style>
