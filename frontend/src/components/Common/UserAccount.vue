<template>
  <div id="user_account">
    <ul :class="{ section_active: isActive.val === 1 }" @click="isClicked">

      <!-- User Image -->
      <li id="user_img">
        <img :src="user.img"/>
      </li>

      <!-- User Name -->
      <li id="user_name">
        <h3>{{ user.name }}</h3>
      </li>

      <!-- Drop-down Menu -->
      <li class="dropdown-content">
        <div class="content" @click="showSettings">Settings</div>
        <div class="content" @click="logOut">Log out</div>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import { getUserProfile } from '@/handlers/spotify';
import {
  reactive, onBeforeMount,
} from 'vue';

import { randomCharacters } from '@/components/Utils/logic/random';

// assets
import userDefaultImg from '@/assets/user.png';

export default {
  name: 'UserAccount',
  props: {
    emitter: {
      type: Object,
    },
  },
  setup(props) {
    const user = reactive({
      id: '',
      name: '',
      location: '',
      email: 'no email provided',
      img: userDefaultImg,
    });

    const isActive = reactive({
      val: -1,
    });

    const cursorStyle = reactive({
      style: document.body.parentNode.style.cursor,
    });

    async function getUser() {
      const data = await getUserProfile();

      // re-aasign responded data to the reactive object
      user.id = data.ID === '' ? randomCharacters(10) : data.ID;
      user.name = data.NAME === '' ? 'Anonymous' : data.NAME;
      user.location = data.COUNTRY === '' ? 'Not provided' : data.COUNTRY;
      user.email = data.EMAIL === '' ? 'Not provided' : data.EMAIL;

      // eslint-disable-next-line max-len
      user.img = data.IMAGES.length > 0 ? data.IMAGES[0] : user.img;
    }

    function isClicked() {
      isActive.val = -isActive.val;
    }

    // Log Out
    function logOut() {
      cursorStyle.style = 'wait';
      const PRODUCTION = process.env.NODE_ENV;

      const URL = 'https://accounts.spotify.com/en/logout ';

      // access the log out URL via opening another window with provided sizes
      const spotifyLogoutWindow = window.open(URL, 'Spotify Logout', 'width=10,height=10,top=40,left=40');

      // then close the small window and redirect the system back to the spotify login page
      setTimeout(() => {
        spotifyLogoutWindow.close();
        window.location.href = (PRODUCTION === 'production') ? 'https://muserfly.herokuapp.com/' : 'http://localhost:8080/';
      }, 500);
      cursorStyle.style = 'context-menu';
    }

    // Personalisation
    function showSettings() {
      const data = {
        message: 'open',
        user,
      };

      // subscribe to an event to toggle the personalisation settings
      props.emitter.emit('toggle_settings', data);
    }

    onBeforeMount(async () => {
      await getUser();
    });

    return {
      user,
      isActive,
      isClicked,
      showSettings,
      logOut,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_user_account';
</style>
