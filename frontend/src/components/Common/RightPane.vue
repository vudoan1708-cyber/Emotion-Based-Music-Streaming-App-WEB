<template>
  <div id="right_pane">

    <!-- Playlist Display -->
    <Playlist />

    <!-- Settings Board -->
    <div id="board">
    </div>
  </div>
  <Settings />
</template>

<script>
import Settings from '@/components/Common/Settings.vue';
import Playlist from '@/components/Common/Playlist.vue';

export default {
  name: 'RightPane',
  setup() {
    return {
      Playlist,
      Settings,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_right_pane';
</style>
