<template>
  <div id="playlist_container">

    <!-- Collected Tracks -->
    <h3>Collected Tracks</h3>
    <div id="collected">
      <div class="songs"></div>
    </div>

    <!-- All Tracks -->
    <h3>All Tracks</h3>
    <div id="all">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Playlist',
  setup() {

  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_playlist';
</style>
