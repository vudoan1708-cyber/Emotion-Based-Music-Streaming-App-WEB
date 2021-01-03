<template>
  <div id="settings">

    <!-- Icon -->
    <div id="settings_img" @click="showSettingsBoard">
      <img src="@/assets/settings.png"/>
    </div>

    <!-- Settings Board -->
    <div id="board">
    </div>
  </div>
</template>

<script>

/* eslint-disable padded-blocks */
export default {
  name: 'Settings',
  setup() {

    function showSettingsBoard() {
      // eslint-disable-next-line no-console
      console.log('clicked');
    }

    return {
      showSettingsBoard,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_settings.scss';
</style>
