<template>
  <div id="right_pane">

    <!-- User Account -->
    <UserAccount />

    <!-- Playlist Display -->
    <Playlist />

    <!-- Settings Board -->
    <SettingsBoard :personalisationSettings="settings" />
  </div>
</template>

<script>
import Playlist from '@/components/Common/Playlist.vue';
import UserAccount from '@/components/Common/UserAccount.vue';
import SettingsBoard from '@/components/Common/SettingsBoard.vue';
import { ref, watch } from 'vue';

export default {
  name: 'RightPane',
  props: {
    personalisationSettings: {
      type: Object,
    },
  },
  components: {
    SettingsBoard,
    Playlist,
    UserAccount,
  },
  setup(props) {
    const settings = ref(props.personalisationSettings);

    watch(() => props.personalisationSettings, (data) => {
      settings.value = data;
      console.log(settings.value);
    });

    return {
      settings,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_right_pane';
</style>
