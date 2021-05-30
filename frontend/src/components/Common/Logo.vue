<template>
  <div id="logo" v-if="!isMobile">

    <!-- Logo Image -->
    <div>
      <img src="@/assets/logo/logo.png"/>
    </div>

    <!-- Title -->
    <div>
      <h2>Muserfly</h2>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Logo',
  props: {
    mobile: {
      type: Boolean,
    },
  },
  setup(props) {
    const isMobile = ref(props.mobile);
    return {
      isMobile,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_logo';
</style>
