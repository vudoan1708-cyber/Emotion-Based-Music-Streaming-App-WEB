<template>
  <div id="bottom_pane">

    <!-- The Emotion Map -->
    <div id="map" v-if="appState.map">
      <div class="map_info" id="land_name">
        <h1>{{mapProperties.name}}</h1>
      </div>
      <div class="map_info" id="coordinates">
        <div id="display">
          <img id="coord_img" src="@/assets/coordinates.png"/>
          <h5>{{mapProperties.coords.x}}, {{mapProperties.coords.y}}</h5>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div id="loading" v-else>Loading Bar Here</div>
  </div>
</template>

<script>
/* eslint-disable object-curly-newline */

import { reactive, watchEffect, getCurrentInstance } from 'vue';
/* eslint-disable no-unused-vars */

export default {
  name: 'BottomPane',
  setup() {
    // instantiate the app's current instance to get global properties
    // registered in the main.js file
    const app = getCurrentInstance();
    const emitter = app.appContext.config.globalProperties.$emitter;

    const appState = reactive({
      map: true,
    });

    const mapProperties = reactive({
      coords: {
        x: 0,
        y: 0,
      },
      name: 'Land of Happiness',
      img: '',
    });

    // watch(() => [mapProperties.coords.x, mapProperties.coords.y], ([x, y]) => {
    //   // eslint-disable-next-line no-console
    //   console.log(x, y);
    // });
    watchEffect(() => {
      emitter.on('map', (map) => {
        mapProperties.coords.x = map.i;
        mapProperties.coords.y = map.j;
        appState.map = map.status;
      });
    });

    return {
      appState,
      mapProperties,
    };
  },
};
</script>

<style scoped lang="scss">
  @import '@/sass/Unique/_bottom_pane';
</style>
