<template>
  <div id="right_pane">
    <!-- Settings Board -->
    <div id="board">
    </div>
  </div>
  <Settings />
</template>

<script>
import Settings from '@/components/Common/Settings.vue';

export default {
  name: 'RightPane',
  setup() {
    return {
      Settings,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_right_pane';
</style>
