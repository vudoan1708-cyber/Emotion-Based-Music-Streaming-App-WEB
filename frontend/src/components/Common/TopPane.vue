<template>
  <div id="title">
    <!-- Logo Image -->
    <div id="mobile_logo" v-if="isMobile">
      <img src="@/assets/logo.png"/>
    </div>

    <h1>Emotion Map</h1>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'TopPane',
  props: {
    mobile: {
      type: Boolean,
    },
  },
  setup(props) {
    const isMobile = ref(props.mobile);

    return {
      isMobile,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_top_pane';
</style>
