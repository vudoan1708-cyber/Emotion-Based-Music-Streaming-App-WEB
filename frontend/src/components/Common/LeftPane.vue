<template>
  <div id="left_pane">
    <Logo />
    <Navigation />
    <LogOut />
  </div>
</template>

<script>
import Logo from '@/components/Common/Logo.vue';
import Navigation from '@/components/Common/Navigation.vue';
import LogOut from '@/components/Common/LogOut.vue';

export default {
  name: 'LeftPane',
  components: {
    Logo,
    Navigation,
    LogOut,
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_left_pane.scss';
</style>
