<template>
  <div id="records_area">
      <div id="records_content">
        <!-- Records Board -->
        <div id="records_board">
          <div id="records_placeholder">
            <!-- Text Placceholder At The Moment -->
            <h2>No Record Yet!!!</h2>
            <p>Please Enter The Visualisation To Record Your Listening Activity</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {

};
</script>

<style scoped lang="scss">
#records_area {
  width: 100%;
  height: 100%;
  color: rgb(122, 122, 122);

  #records_content {
    text-align: center;

    #records_placeholder {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
