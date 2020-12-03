<template>
  <!-- navigation -->
  <div id="nav">
  </div>

  <!-- background -->
  <StarryBackground />
  <router-view/>
</template>

<script>
import { onMounted } from 'vue';

import StarryBackground from './components/StarryBackground.vue';
// import InitialisePlayer from './components/InitialisePlayer.vue';

export default {
  setup() {
    onMounted(() => {
      window.onSpotifyPlayerAPIReady = () => {};
    });
    return {
      StarryBackground,
    };
  },
};
</script>

<style lang="scss">
@import './sass/Shared/main';
</style>
