<template>
  <div id="home">
    <SketchP5 />
    <Settings />
    <BottomPane />
  </div>
</template>

<script>
import SketchP5 from '@/components/Sketches/SketchP5.vue';
import BottomPane from '@/components/Common/BottomPane.vue';
import Settings from '@/components/Common/Settings.vue';

export default {
  name: 'Home',
  setup() {
    return {
      SketchP5,
      BottomPane,
      Settings,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_home';
</style>
