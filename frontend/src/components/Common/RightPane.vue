<template>
  <div id="right_pane">

    <!-- User Account -->
    <UserAccount :emitter="emitterObj" />

    <!-- Playlist Display -->
    <Playlist :emitter="emitterObj" />

    <!-- Settings Board -->
    <SettingsBoard :personalisationSettings="settings" :emitter="emitterObj" />
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
    emitter: {
      type: Object,
    },
  },
  components: {
    SettingsBoard,
    Playlist,
    UserAccount,
  },
  setup(props) {
    const emitterObj = ref(props.emitter);
    const settings = ref(props.personalisationSettings);

    watch(() => props.personalisationSettings, (data) => {
      settings.value = data;
    });

    return {
      settings,
      emitterObj,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_right_pane';
</style>
