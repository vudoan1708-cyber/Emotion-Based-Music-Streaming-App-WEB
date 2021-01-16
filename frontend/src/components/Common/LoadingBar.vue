<template>
  <div id="bar_styling">
    <div id="bar_container">
      <div ref="progressBar" id="bar">
        <!-- <img src="#"/> -->
      </div>
  </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';

export default {
  name: 'LoadingBar',
  setup() {
    // instantiate the app's current instance to get global properties
    // registered in the main.js file
    const app = getCurrentInstance();
    const emitter = app.appContext.config.globalProperties.$emitter;

    const progressBar = ref(null);
    const barWidth = ref(0);

    onMounted(() => {
      // subscribe to the 'song_data' event
      emitter.on('playlist', (data) => {
        if (progressBar.value.style.width !== '100%') {
          barWidth.value = (data.length / 5) * 100;
          progressBar.value.style.width = `${barWidth.value}%`;
        }
      });
    });
    return {
      progressBar,
    };
  },
};
</script>

<style scoped lang="scss">
#bar_styling {
  position: absolute;
  left: 50%;
  top: 25%;
  transform: translateX(-50%);
  width: 50%;

  #bar_container {
  width: 100%;
  background-color: rgb(87, 87, 87);
  border-radius: 20px;

    #bar {
      margin: 0;
      width: 0%;
      height: 30px;
      overflow-x: hidden;
      background-color: rgb(112, 194, 130);
      border-radius: 20px;

      img {
        width: 100%;
      }
    }
  }
}
</style>
