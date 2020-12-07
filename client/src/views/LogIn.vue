<template>
  <div class="login">
    <!-- <img id="logo" src="../assets/logo.png" alt="Vue logo"> -->
    <button class="loginBtn" @click="login">Login</button>
  </div>
</template>

<script>
/* eslint-disable padded-blocks */

// handler for spotify authorisation flow
import LoginHandlers from '@/handlers/spotify';

export default {
  name: 'LogIn',
  setup() {

    // binded function to a button
    async function login() {
      LoginHandlers();
    }
    return {
      login,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_login';
</style>
