<template>
  <div id="user_account">
    <ul>

      <!-- User Image -->
      <li id="user_img">
        <img :src="user.img"/>
      </li>

      <!-- User Name -->
      <li id="user_name">
        <h3>{{ user.name }}</h3>
      </li>
    </ul>
  </div>
</template>

<script>
import { getUserProfile } from '@/handlers/spotify';
import { reactive, onBeforeMount } from 'vue';

export default {
  name: 'UserAccount',
  setup() {
    const user = reactive({
      name: '',
      email: 'no email provided',
      img: '#',
    });

    async function getUser() {
      const data = await getUserProfile();

      // re-aasign responded data to the reactive object
      user.name = data.NAME;
      user.img = data.IMAGES[0] ? data.IMAGES.length > 0 : user.img;
    }
    onBeforeMount(async () => {
      getUser();
    });

    return {
      user,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_user_account';
</style>
