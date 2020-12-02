<template>
  <!-- navigation -->
  <div id="nav">
  </div>

  <!-- background -->
  <StarryBackground />
  <router-view/>
</template>

<script>
import StarryBackground from './components/StarryBackground.vue';

export default {
  setup() {
    return {
      StarryBackground,
    };
  },
};
</script>

<style lang="scss">
@import './sass/Shared/main';
</style>
