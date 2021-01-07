<template>
  <div id="left_pane">
    <LogOut />
  </div>
</template>

<script>
import LogOut from '@/components/Common/LogOut.vue';

export default {
  name: 'LeftPane',
  components: {
    LogOut,
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_left_pane.scss';
</style>
