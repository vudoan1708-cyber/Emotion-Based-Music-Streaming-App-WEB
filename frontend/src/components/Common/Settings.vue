<template>
  <div id="settings">

    <!-- Icon -->
    <div id="settings_img" @click="showSettingsBoard">
      <img src="@/assets/settings.png"/>
    </div>

    <!-- Text Animation -->
    <div id="settings_text_anim">
      <h3>Settings</h3>
    </div>

    <!-- Settings Board -->
    <div id="board">
    </div>
  </div>
</template>

<script>
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
