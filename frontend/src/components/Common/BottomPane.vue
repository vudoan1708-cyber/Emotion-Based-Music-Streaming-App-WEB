<template>
  <div id="bottom_pane">

    <!-- The Emotion Map -->
    <div id="map" v-if="appState.map">
      <div class="map_info" id="land_name">
        <h2>{{mapProperties.land}}</h2>
      </div>
      <div class="map_info" id="coordinates">
        <div class="display" id="coord_img">
          <img src="@/assets/coordinates.png"/>
        </div>

        <div class="display">
          <h5>{{mapProperties.coords.x}}, {{mapProperties.coords.y}}</h5>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div id="loading" v-else></div>
  </div>
</template>

<script>

import { reactive, watch, computed } from 'vue';
/* eslint-disable no-unused-vars */

export default {
  name: 'BottomPane',
  setup() {
    const appState = reactive({
      map: true,
      loading: false,
    });

    const mapProperties = reactive({
      coords: {
        x: 0,
        y: 0,
      },
      land: 'Land of Happiness',
      img: '',
    });

    computed(() => {
      mapProperties.coords.x += 1;
    });

    watch(() => [mapProperties.coords.x, mapProperties.coords.y], ([x, y]) => {
      console.log(x, y);
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
