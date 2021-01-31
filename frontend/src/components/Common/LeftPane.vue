<template>
  <div id="left_pane">
    <Logo />
    <Navigation :emitter="emitterObj" />
    <MapKey />
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
  },
  components: {
    Logo,
    Navigation,
    MapKey,
  },
  setup(props) {
    const emitterObj = ref(props.emitter);
    return {
      emitterObj,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_left_pane.scss';
</style>
