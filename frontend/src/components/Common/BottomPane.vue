<template>
  <div id="bottom_pane">

    <!-- The Emotion Map -->
    <div id="map" v-if="appState.map">
      <div class="map_info" id="land_name">
        <h1>{{mapProperties.name}}</h1>
      </div>
      <div class="map_info" id="coordinates">
        <div id="display">
          <img class="map_detail" id="coord_img" src="@/assets/coordinates.png"/>
          <h5 class="map_detail">{{mapProperties.coords.x}}, {{mapProperties.coords.y}}</h5>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div id="loading" v-else>
      <LoadingBar />
    </div>
  </div>
</template>

<script>
/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import { reactive, getCurrentInstance } from 'vue';
import LoadingBar from '@/components/Common/LoadingBar.vue';

export default {
  name: 'BottomPane',
  components: {
    LoadingBar,
  },
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
      name: 'Regions on The Map',
      img: '',
    });

    // subscribe on the 'map' event
    emitter.on('map', (map) => {
      mapProperties.coords.x = map.i;
      mapProperties.coords.y = map.j;
      mapProperties.name = map.name;
      appState.map = map.status;
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
