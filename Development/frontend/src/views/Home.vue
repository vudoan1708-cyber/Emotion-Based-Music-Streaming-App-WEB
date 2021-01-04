<template>
  <div id="home">
    <SketchP5 />
    <RightPane />
    <BottomPane />
  </div>
</template>

<script>
import SketchP5 from '@/components/Sketches/SketchP5.vue';
import BottomPane from '@/components/Common/BottomPane.vue';
import RightPane from '@/components/Common/RightPane.vue';

export default {
  name: 'Home',
  setup() {
    return {
      SketchP5,
      BottomPane,
      RightPane,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_home';
</style>
