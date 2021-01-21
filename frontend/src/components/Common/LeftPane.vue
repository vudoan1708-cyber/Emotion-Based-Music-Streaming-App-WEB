<template>
  <div id="left_pane">
    <Logo />
    <Navigation />
  </div>
</template>

<script>
import Logo from '@/components/Common/Logo.vue';
import Navigation from '@/components/Common/Navigation.vue';

export default {
  name: 'LeftPane',
  components: {
    Logo,
    Navigation,
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_left_pane.scss';
</style>
