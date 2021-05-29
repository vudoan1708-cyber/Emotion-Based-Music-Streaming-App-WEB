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
    mobile: {
      type: Boolean,
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
    const isMobile = ref(props.mobile);

    watch(props.personalisationSettings, (s) => {
      settings.value = s;
    });

    return {
      settings,
      emitterObj,
      isMobile,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_right_pane';
</style>
