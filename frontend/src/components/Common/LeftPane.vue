<template>
  <div id="left_pane">
    <Logo :mobile="isMobile" />
    <Navigation :emitter="emitterObj" />
    <MapKey v-if="!isMobile" />
  </div>
</template>

<script>
import Logo from '@/components/Common/Logo.vue';
import Navigation from '@/components/Common/Navigation.vue';
import MapKey from '@/components/Common/MapKey.vue';

import { ref } from 'vue';

export default {
  name: 'LeftPane',
  props: {
    emitter: {
      type: Object,
    },
    mobile: {
      type: Boolean,
    },
  },
  components: {
    Logo,
    Navigation,
    MapKey,
  },
  setup(props) {
    // Props
    const emitterObj = ref(props.emitter);
    const isMobile = ref(props.mobile);
    return {
      emitterObj,
      isMobile,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_left_pane.scss';
</style>
