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
#playlist_container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  margin: 10px;
  color: rgb(185, 185, 185);
  text-align: left;

  #collected {
    margin: 10px;
    min-height: 40%;
    background-color: black;
    overflow-y: scroll;
  }

  #all {
    margin: 10px;
    min-height: 40%;
    background-color: black;
    overflow-y: scroll;
  }
}
</style>
