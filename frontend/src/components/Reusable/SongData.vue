<template>
  <div ref="songInfoRef" v-if="songInfo.title !== undefined && songInfo.isDisplayed"
    class="song_data"
    :style="{ top: (songInfo.attr.y - songInfo.yOffsetDisplay) + 'px',
              left: songInfo.attr.x + 'px',
              zIndex: songInfo.zIndexVal }">
    <div class="song_data_container">
      <img v-if="songInfo.img_url !== ''" draggable="false" @dragstart="false"
        :src="songInfo.img_url" />
      <h3 v-if="songInfo.title !== ''">{{ songInfo.title }}</h3>
      <p v-if="songInfo.valence !== -1">{{ songInfo.valence }}</p>
      <p v-if="songInfo.arousal !== -1">{{ songInfo.arousal }}</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue';

// Algorithm
// import { ruleOfThree } from '@/components/Utils/logic/algorithm';

export default {
  name: 'SongData',
  props: {
    songX: {
      type: Number,
    },
    songY: {
      type: Number,
    },
    songTitle: {
      type: String,
    },
    songImgURL: {
      type: String,
    },
    songValence: {
      type: Number,
    },
    songArousal: {
      type: Number,
    },
    zoomVal: {
      type: Number,
    },
    mobile: {
      type: Boolean,
    },
  },
  setup(props) {
    // Props
    const isMobile = ref(props.mobile);
    const zoomDegree = ref(props.zoomVal);

    // DOM Ref
    const songInfoRef = ref(null);

    // Song Related Info
    const songInfo = reactive({
      attr: {
        x: props.songX,
        y: props.songY,
      },
      title: props.songTitle,
      img_url: props.songImgURL,
      valence: props.songValence,
      arousal: props.songArousal,
      yOffsetDisplay: 175,
      zIndexVal: 4,
      isDisplayed: true,
    });

    // At The Beginning, The Zoom Degree Will Be 5
    // Therefore, Set Y Offset To 40 Initially
    if (isMobile.value) {
      songInfo.yOffsetDisplay = 40;
      songInfo.zIndexVal = 0;
    }

    function setDisplayPropsBasedOnZoom(z) {
      if (isMobile.value) {
        if (z === 5) songInfo.yOffsetDisplay = 40;
        else if (z === 10) songInfo.yOffsetDisplay = 55;
        else songInfo.yOffsetDisplay = 75;

        // SetTimeout Here To Wait For The SongInfoRef Variable Get Updated With Its Template
        // And Won't Result In A Null Obj
        // setTimeout(() => {
        // Decide Whether The Song Info Should Be Displayed or not Based On Its Top Parameter
        // eslint-disable-next-line max-len
        // const songInfoTopValue = songInfoRef.value ? Number((songInfoRef.value.style.top).split('px')[0]) : undefined;
        // eslint-disable-next-line max-len
        // const songInfoTopPercentage = ruleOfThree(Number(document.body.clientHeight), 100, songInfoTopValue);

        // if (songInfoTopPercentage !== undefined) {
        //   if (songInfoTopPercentage > 20 && songInfoTopPercentage < 65) {
        //     songInfo.isDisplayed = true;
        //   } else songInfo.isDisplayed = false;
        // } else songInfo.isDisplayed = true;
        // }, 250);
      }
    }

    watch(() => [
      props.songX, props.songY, props.songTitle, props.songImgURL,
      props.songValence, props.songArousal, props.zoomVal, props.mobile,
    ],
    ([
      songX, songY, songTitle, songImgURL,
      songValence, songArousal, zoom, mobile,
    ]) => {
      songInfo.attr.x = songX;
      songInfo.attr.y = songY;
      songInfo.title = songTitle;
      songInfo.img_url = songImgURL;
      songInfo.valence = songValence;
      songInfo.arousal = songArousal;

      zoomDegree.value = zoom;
      isMobile.value = mobile;

      setDisplayPropsBasedOnZoom(zoomDegree.value);
    });

    return {
      songInfo,
      zoomDegree,
      isMobile,
      songInfoRef,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_song_data';
</style>
