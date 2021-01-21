<template>
  <div id="right_pane">

    <!-- User Account -->
    <UserAccount />

    <!-- Playlist Display -->
    <Playlist />

    <!-- Settings Board -->
    <SettingsBoard />
  </div>
</template>

<script>
import Playlist from '@/components/Common/Playlist.vue';
import UserAccount from '@/components/Common/UserAccount.vue';
import SettingsBoard from '@/components/Common/SettingsBoard.vue';

export default {
  name: 'RightPane',
  components: {
    SettingsBoard,
    Playlist,
    UserAccount,
  },
  setup() {
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_right_pane';
</style>
