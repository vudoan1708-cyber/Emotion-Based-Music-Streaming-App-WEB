<template>
  <div id="logOut">

    <ul>
      <!-- Icon -->
      <li id="text_anim"><h3>Log Out</h3></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LogOut',
  setup() {
    function logOut() {
      const URL = 'https://accounts.spotify.com/en/logout ';

      // access the log out URL via opening another window with provided sizes
      const spotifyLogoutWindow = window.open(URL, 'Spotify Logout', 'width=700,height=500,top=40,left=40');

      // then close the small window and redirect the system back to the spotify login page
      setTimeout(() => {
        spotifyLogoutWindow.close();
        window.location.href = 'http://localhost:8080/';
      }, 500);
    }

    return {
      logOut,
    };
  },
};
</script>

<style scoped lang="sass">
@import '@/sass/Unique/_logout';
</style>
