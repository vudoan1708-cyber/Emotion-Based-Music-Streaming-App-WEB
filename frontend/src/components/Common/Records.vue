<template>
  <div id="records_area">
      <div id="records_content">
        <!-- Records Board -->
        <div id="records_board">
          <div v-if="isObjEmpty" id="records_placeholder">
            <!-- Text Placceholder At The Moment -->
            <h2>No Record Yet!!!</h2>
            <p>Please Use The App To Record Your Listening Activity</p>
          </div>

          <!-- User Journey Display -->
          <div v-else id="records_display">
            <!-- Grid System to Display User Journey -->
            <table>
              <thead></thead>
              <tbody>
                <tr v-for="journeyData in userJourneyObj" :key="journeyData">
                  <td v-for="songTitle in journeyData.songs.titles" :key="songTitle">
                    {{ songTitle }}
                  </td>
                  <td v-for="songArtist in journeyData.songs.artists" :key="songArtist">
                    {{ songArtist }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import isEmpty from '@/components/Utils/logic/object';

import { ref, watch } from 'vue';

export default {
  name: 'Records',
  props: {
    userJourney: {
      type: Object,
    },
  },
  setup(props) {
    // Emitter
    // const emitterObj = ref(props.emitter);
    // userJourney
    const userJourneyObj = ref(props.userJourney);
    const isObjEmpty = ref(isEmpty(userJourneyObj.value));

    watch(props.userJourney, (data) => {
      userJourneyObj.value = data;
      isObjEmpty.value = isEmpty(userJourneyObj.value);
    });

    return {
      userJourneyObj,
      isObjEmpty,
    };
  },
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
