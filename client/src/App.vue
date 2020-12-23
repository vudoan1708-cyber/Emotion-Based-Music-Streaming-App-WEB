<template>
  <!-- navigation -->
  <div id="nav">
  </div>

  <!-- <SketchP5 /> -->
  <router-view/>
</template>

<script>
import { onMounted } from 'vue';
// import SketchP5 from '@/components/SketchP5.vue';

// import InitialisePlayer from './components/InitialisePlayer.vue';

export default {
  setup() {
    onMounted(() => {
      window.onSpotifyPlayerAPIReady = () => {};
    });
    // return {
    //   SketchP5,
    // };
  },
};
</script>

<style lang="scss">
@import './sass/Shared/main';
</style>
