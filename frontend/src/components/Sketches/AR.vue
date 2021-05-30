<template>
  <!-- TODO: AR.js -->
  <div id="ar_frame">
    <div id="ar_placeholder">Please Wait!!! Still In Development</div>
  </div>
</template>

<script>
export default {

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
