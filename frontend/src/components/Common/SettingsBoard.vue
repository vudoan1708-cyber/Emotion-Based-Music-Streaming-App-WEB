<template>
  <div ref="boardRef" id="board">

    <!-- Display User Detail -->
    <div id="closeBtn" @click="closeSettings"><h3>X</h3></div>
    <ul id="user_detail">
      <li id="name">
        <h4 class="content">Display Name</h4>
        <p class="content">{{ userDetail.name }}</p>
      </li>
      <li id="location">
        <h4 class="content">Location</h4>
        <p class="content">{{ userDetail.location }}</p>
      </li>
      <li id="email">
        <h4 class="content">Email</h4>
        <p class="content">{{ userDetail.email }}</p>
      </li>
    </ul>

    <hr>
    <!-- Personalisation Settings -->
    <div></div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';

export default {
  name: 'SettingBoard',
  setup() {
    // instantiate the app's current instance to get global properties
    // registered in the main.js file
    const app = getCurrentInstance();
    const emitter = app.appContext.config.globalProperties.$emitter;

    const boardRef = ref(null);
    const userDetail = ref({});

    emitter.on('toggle_settings', (data) => {
      boardRef.value.style.display = 'block';

      userDetail.value.name = data.user.name;
      userDetail.value.location = data.user.location;
      userDetail.value.email = data.user.email;
    });

    // Close The Settings Board
    function closeSettings() {
      boardRef.value.style.display = 'none';
    }

    return {
      boardRef,
      userDetail,
      closeSettings,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_settings';
</style>
