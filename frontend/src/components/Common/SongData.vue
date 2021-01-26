<template>
  <div class="song_data_container"
      v-for="data in songData"
        :key="data.id"
        :style="{ top: (data.y - 20) + 'px', left: data.x + 'px' }">
    <h3>{{data.title}}</h3>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';

export default {
  name: 'SongData',
  setup() {
    // instantiate the app's current instance to get global properties
    // registered in the main.js file
    const app = getCurrentInstance();
    const emitter = app.appContext.config.globalProperties.$emitter;

    const songData = ref([]);

    // subscribe to the 'song_data' event
    emitter.on('song_data', (data) => {
      // push received data to the array
      songData.value.push(data);
    });

    return {
      songData,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_song_data';
</style>
