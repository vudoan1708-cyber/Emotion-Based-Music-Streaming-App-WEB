<template>
  <div id="home">
    <SketchP5 />
    <TopPane />
    <LeftPane />
    <BottomPane />
    <RightPane />
  </div>
</template>

<script>
import SketchP5 from '@/components/Sketches/SketchP5.vue';
import TopPane from '@/components/Common/TopPane.vue';
import BottomPane from '@/components/Common/BottomPane.vue';
import LeftPane from '@/components/Common/LeftPane.vue';
import RightPane from '@/components/Common/RightPane.vue';

export default {
  name: 'Home',
  components: {
    SketchP5,
    TopPane,
    BottomPane,
    LeftPane,
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
