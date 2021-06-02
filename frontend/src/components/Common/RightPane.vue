<template>
  <!-- Right Pane Display Button (ONLY AVAILABLE IN MOBILE MODE) -->
  <div class="collapsible_btn" id="right_pane_display_button"
      v-if="isMobile && displayVal === 'none'" @click="toggleRightPane('block')">
    <h2>&#8882;</h2>
  </div>

  <div id="right_pane" :style="{ display: displayVal }">

    <!-- User Account -->
    <UserAccount :emitter="emitterObj" />

    <!-- Playlist Display -->
    <Playlist :mobile="isMobile" :emitter="emitterObj" />

    <!-- Right Pane Close Button (ONLY AVAILABLE IN MOBILE MODE) -->
    <div class="collapsible_btn" id="right_pane_close_button"
        v-if="isMobile && displayVal === 'block'" @click="toggleRightPane('none')">
      <h2>&#8883;</h2>
    </div>

    <!-- Settings Board -->
    <SettingsBoard :personalisationSettings="settings" :emitter="emitterObj" />
  </div>
</template>

<script>
import Playlist from '@/components/Common/Playlist.vue';
import UserAccount from '@/components/Common/UserAccount.vue';
import SettingsBoard from '@/components/Common/SettingsBoard.vue';
import { onBeforeMount, ref, watch } from 'vue';

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
    // Props
    const emitterObj = ref(props.emitter);
    const settings = ref(props.personalisationSettings);
    const isMobile = ref(props.mobile);

    // Dynamic Styling
    const displayVal = ref('block');

    // Mobile Responsiveness Design
    function onMobileResize() {
      if (isMobile.value) {
        displayVal.value = 'none';
      }
    }

    // Mobile ONLY
    function toggleRightPane(mode) {
      if (isMobile.value) {
        displayVal.value = mode;

        if (displayVal.value === 'block') {
          emitterObj.value.emit('nav', 5);
        } else emitterObj.value.emit('nav', 1);
      }
    }

    watch(props.personalisationSettings, (s) => {
      settings.value = s;
    });

    onBeforeMount(() => {
      onMobileResize();
    });

    return {
      settings,
      emitterObj,
      isMobile,
      displayVal,
      toggleRightPane,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_right_pane';
</style>
