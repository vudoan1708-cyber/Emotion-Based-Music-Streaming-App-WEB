<template>
  <!-- Loading Bar -->
  <div id="bar_styling">
    <div id="bar_container">
      <div ref="progressBar" id="bar">
      </div>
    </div>

    <!-- Info -->
    <div id="loading_info">
      <div id="percentage">
        <h2>{{ barWidth }}%</h2>
      </div>

      <div class="song_detail" id="title_detail">
        <h3>{{ song.title }}</h3>
      </div>
      <div class="song_detail" id="artist_detail">{{ song.artist }}</div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watchEffect } from 'vue';

export default {
  name: 'LoadingBar',
  props: {
    tracks: {
      type: Object,
    },
  },
  setup(props) {
    const progressBar = ref(null);
    const barWidth = ref(0);
    const song = reactive({
      title: '',
      artist: '',
    });

    function updateLoadingBar(data) {
      if (progressBar.value !== null && progressBar.value.style.width !== '100%') {
        barWidth.value = (data.total / 5) * 100;
        progressBar.value.style.width = `${barWidth.value}%`;
      }

      // get songs' details
      if (data.total !== 0) {
        for (let i = 0; i < data.total; i += 1) {
          song.title = data.titles[i];
          song.artist = data.artists[i];
        }
      } else {
        song.title = '';
        song.artist = '';
      }
    }

    watchEffect(() => {
      updateLoadingBar(props.tracks);
    });

    return {
      progressBar,
      barWidth,
      song,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_loading_bar';
</style>
