<template>
  <!-- TODO: AR.js -->
  <div id="ar_frame">
    <div v-if="!showCamera" id="ar_placeholder">Please Wait!!! Still In Development</div>
    <!-- <div v-else>
      <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
        <a-marker preset="hiro">
            <a-box position='0 0.5 0' material='color: yellow;'></a-box>
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>
    </div> -->
    <div v-else id="ar_placeholder">Beta Version is Out</div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AR',
  setup() {
    const showCamera = ref(false);
    return {
      showCamera,
    };
  },
};
</script>

<style lang="scss" scoped>
#ar_frame {
  position: absolute;
  top: 0;
  left: 205px;
  width: calc(80% - 205px);
  height: 82%;
  background-color: white;
  z-index: 100;

  #ar_placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
  }
}

/* Responsive Text */
@media screen and (max-width: 770px) {
  #ar_frame {
    left: 0 !important;
    width: 100% !important;
    height: 75% !important;
  }
}
@media screen and (max-width: 600px) {
  #ar_frame {
    left: 0 !important;
    width: 100% !important;
    height: 75% !important;
  }
}
@media screen and (max-width: 469px) {
  #ar_frame {
    left: 0 !important;
    width: 100% !important;
    height: 75% !important;
  }
}
</style>
