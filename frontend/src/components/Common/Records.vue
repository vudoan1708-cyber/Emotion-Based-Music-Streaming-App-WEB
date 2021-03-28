<!-- eslint-disable max-len -->
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
            <div id="headers">
              <h2>Summary</h2><br />
              <span><p>Today</p></span>
            </div>

            <!-- Grid System to Display User Journey -->
            <!-- 1 Group of Reading -->
            <div class="records_wrapper" v-for="(score, scoreKey) in moodScores" :key="scoreKey">
              <h2 class="dates">{{ times[scoreKey] }}</h2>

              <div class="records_details">
                <svg :width="canvas.width"
                    :height="canvas.height">
                  <g class="records_score"
                    :transform="`translate(${canvas.width / 2}, ${canvas.height / 2})`">
                    <!-- Individual Score within 1 Reading -->
                    <circle v-for="(valence, valenceKey) in score.valence" :key="valenceKey"
                      :cx="(50 * (valenceKey) + (10 * (valence * score.arousal[valenceKey])) * 2) - canvas.width / 2"
                      :cy="25 * score.arousal[valenceKey] - (10 * (valence * score.arousal[valenceKey])) * 2"
                      :r="10 * (valence * score.arousal[valenceKey])" :fill="colours[scoreKey]" :fill-opacity="score.arousal[valenceKey]"
                      stroke-width="2" stroke="black" />
                    <circle v-for="(valence, valenceKey) in score.valence" :key="valenceKey"
                      :cx="(50 * (valenceKey) + (10 * (valence * score.arousal[valenceKey])) * 2) - canvas.width / 2"
                      :cy="25 * score.arousal[valenceKey] - (10 * (valence * score.arousal[valenceKey])) * 2"
                      :r="20 * (valence * score.arousal[valenceKey])" :fill="colours[scoreKey]" :fill-opacity="valence" />
                      <text x="0" y="-40" text-anchor="middle" :fill="colours[scoreKey]">{{ texts[scoreKey] }}</text>
                  </g>
                </svg>
              </div>
            </div>

            <!-- Show 1 Card in Detail -->
          </section>
        </article>
      </div>
    </div>
</template>

<script>
import {
  onMounted, reactive, ref, watch,
} from 'vue';

import isEmpty from '@/components/Utils/logic/object';

import { extent, scaleQuantize } from 'd3';

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

    // D3
    // Canvas Width and Height
    const canvas = reactive({
      width: window.innerWidth / 5,
      height: window.innerHeight / 5,
    });

    // Extract Affective Scores
    const moodScores = ref([]);
    const averageMoodScores = ref([]);

    // Colours and Texts
    const colourDomain = ref(null);
    const colour = ref(null);
    const text = ref(null);

    const colours = ref([]);
    const texts = ref([]);

    // Dates and Times
    const dates = ref([]);
    const times = ref([]);

    function updateAffectiveScore() {
      moodScores.value = [];
      for (let i = 0; i < userJourneyObj.value.length; i += 1) {
        const mood = userJourneyObj.value[i].songs.mood_scores;

        // Get the Date Values
        dates.value.push(userJourneyObj.value[i].date);
        times.value.push(userJourneyObj.value[i].time);

        // Get the Mood Scores
        moodScores.value.push(mood);

        let moodPerReading = 0;
        for (let j = 0; j < mood.valence.length; j += 1) {
          const valence = mood.valence[j];
          const arousal = mood.arousal[j];
          moodPerReading = valence + arousal;
        }

        moodPerReading /= mood.valence.length;
        averageMoodScores.value.push(moodPerReading);
      }

      // Get The Min and Max Value from The averageMoodScores variables for the Colour Domain
      // d3.extent() returns an array
      colourDomain.value = extent(averageMoodScores.value, (d) => d);

      // Construct a Quatize Scale to Produce Mood Positiveness Based on The Colour Domain
      // Colours (Red, Yellow, Green)
      // Texts (Negative, Neutral, Positive)
      colour.value = scaleQuantize().domain(colourDomain.value).range(['#EF423E', '#EFEF3E', '#6AEF3E']);
      text.value = scaleQuantize().domain(colourDomain.value).range(['Negative', 'Neutral', 'Positive']);

      // Get Individual Score for Text and Colour
      averageMoodScores.value.forEach((score) => {
        colours.value.push(colour.value(score));
        texts.value.push(text.value(score));
      });
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
      canvas,
      colours,
      texts,
      dates,
      times,
    };
  },
};
</script>

<style scoped lang="scss">
#records_area {
  width: 100%;
  height: 100%;
  color: rgb(128, 128, 128);

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
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-areas: 'myArea myArea';
      grid-gap: 20px;
      margin: 20px;

      #headers {
        grid-area: myArea;
        width: 100%;
        text-align: center;
        padding: 5px;
        background-color: rgb(32, 32, 32);
      }

      .dates {
        margin: 20px;
        padding: 10px;
        background-color: rgb(15, 15, 15);
      }

      .records_details {
        position: relative;
        margin: 20px;
        border-radius: 10px;
        border: 2px solid rgb(138, 138, 138);
        box-shadow: inset 0 0 1000px rgb(138, 138, 138);
        background-color: rgba(80, 80, 80, 0.25);
        cursor: pointer;
        transition: .25s all;

        &:hover {
        box-shadow: inset 0 0 10px rgb(138, 138, 138);
        }
      }
    }
  }
}
</style>
