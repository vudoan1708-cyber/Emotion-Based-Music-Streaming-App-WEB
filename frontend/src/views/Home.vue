<template>
  <div id="home">
    <SketchP5 />
  </div>
</template>

<script>
// @ts-nocheck
import SketchP5 from '@/components/Common/SketchP5.vue';

export default {
  name: 'Home',
  setup() {
    return {
      SketchP5,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_home';
</style>
