<template>
  <div id="left_pane">
    <Logo />
    <Navigation :emitter="emitterObj" />
  </div>
</template>

<script>
import Logo from '@/components/Common/Logo.vue';
import Navigation from '@/components/Common/Navigation.vue';
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
