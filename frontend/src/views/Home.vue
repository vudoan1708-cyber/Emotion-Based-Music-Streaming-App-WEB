<template>
  <div id="home">
    <SketchP5 />
    <TopPane />
    <RightPane />
    <BottomPane />
  </div>
</template>

<script>
import SketchP5 from '@/components/Sketches/SketchP5.vue';
import TopPane from '@/components/Common/TopPane.vue';
import BottomPane from '@/components/Common/BottomPane.vue';
import RightPane from '@/components/Common/RightPane.vue';

export default {
  name: 'Home',
  components: {
    SketchP5,
    TopPane,
    BottomPane,
    RightPane,
  },
  setup() {
    return {

    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_home';
</style>
