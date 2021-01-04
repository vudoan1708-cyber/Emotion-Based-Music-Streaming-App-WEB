<template>
  <div id="right_pane">
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

</style>
