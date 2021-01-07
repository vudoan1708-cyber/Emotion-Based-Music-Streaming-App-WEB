<template>

  <router-view/>
</template>

<script>
import { onMounted } from 'vue';

export default {
  setup() {
    onMounted(() => {
      window.onSpotifyPlayerAPIReady = () => {};
    });
  },
};
</script>

<style lang="scss">
@import './sass/Shared/main';
</style>
