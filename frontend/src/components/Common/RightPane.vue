<template>
  <div id="right_pane">

    <!-- User Account -->
    <UserAccount />

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
import UserAccount from '@/components/Common/UserAccount.vue';

export default {
  name: 'RightPane',
  setup() {
    return {
      Playlist,
      Settings,
      UserAccount,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_right_pane';
</style>
