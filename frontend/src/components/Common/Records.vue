<template>
  <div id="records_area">
      <div id="records_content">
        <!-- Records Board -->
        <article id="records_board">
          <section v-if="isObjEmpty" id="records_placeholder">
            <!-- Text Placceholder At The Moment -->
            <h2>No Record Yet!!!</h2>
            <p>Please Use The App To Record Your Listening Activity</p>
          </section>

          <!-- User Journey Display -->
          <section v-else id="records_display">
            <!-- Grid System to Display User Journey -->
            <div class="records_details"
              v-for="(score, scoreKey) in moodScores" :key="scoreKey">
              <div class="records_score"
                v-for="(valence, valenceKey) in score.valence" :key="valenceKey">
                <p>{{ valence }} {{ score.arousal[valenceKey] }}</p>
              </div>
            </div>
          </section>
        </article>
      </div>
    </div>
</template>

<script>
import isEmpty from '@/components/Utils/logic/object';

import { onMounted, ref, watch } from 'vue';

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

    // Extract Affective Scores
    const moodScores = ref([]);

    function updateAffectiveScore() {
      for (let i = 0; i < userJourneyObj.value.length; i += 1) {
        const mood = userJourneyObj.value[i].songs.mood_scores;

        // Get the Mood Scores
        moodScores.value.push(mood);
      }
      console.log(moodScores.value);
    }

    onMounted(() => {
      updateAffectiveScore();
    });

    watch(props.userJourney, (data) => {
      userJourneyObj.value = data;
      isObjEmpty.value = isEmpty(userJourneyObj.value);

      updateAffectiveScore();
    });

    return {
      userJourneyObj,
      moodScores,
      isObjEmpty,
    };
  },
};
</script>

<style scoped lang="scss">
#records_area {
  width: 100%;
  height: 100%;
  color: rgb(0, 0, 0);

  #records_content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    position: relative;
    text-align: center;

    #records_placeholder {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    #records_display {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-gap: 20px;
      margin: 20px;

      .records_details {
        margin: 20px;
        background-color: rgb(199, 199, 199);
      }
    }
  }
}
</style>
