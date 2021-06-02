<template>
  <div v-if="songInfo.title !== undefined" class="song_data"
    :style="{ top: (songInfo.attr.y - songInfo.yOffsetDisplay) + 'px',
              left: songInfo.attr.x + 'px',
              zIndex: songInfo.zIndexVal }">
    <div class="song_data_container">
      <img draggable="false" @dragstart="false" :src="songInfo.img_url" />
      <h3>{{ songInfo.title }}</h3>
      <p>{{ songInfo.valence }}</p>
      <p>{{ songInfo.arousal }}</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue';

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
    mobile: {
      type: Boolean,
    },
  },
  setup(props) {
    // Props
    const isMobile = ref(props.mobile);

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
    });

    if (isMobile.value) {
      songInfo.yOffsetDisplay = 75;
      songInfo.zIndexVal = 0;
    }

    watch(() => [
      props.songX, props.songY, props.songTitle, props.songImgURL,
      props.songValence, props.songArousal, props.mobile,
    ],
    ([
      songX, songY, songTitle, songImgURL,
      songValence, songArousal, mobile,
    ]) => {
      songInfo.attr.x = songX;
      songInfo.attr.y = songY;
      songInfo.title = songTitle;
      songInfo.img_url = songImgURL;
      songInfo.valence = songValence;
      songInfo.arousal = songArousal;

      isMobile.value = mobile;
    });

    return {
      songInfo,
      isMobile,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_song_data';
</style>
