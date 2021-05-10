<!-- eslint-disable max-len -->
<template>
  <div id="records_area">
    <div v-if="!recordDetails.isOpen" id="records_content">
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
            <div id="dates_carousel">
              <span><p>Today</p></span>
            </div>
          </div>

          <!-- Grid System to Display User Journey -->
          <!-- 1 Group of Reading -->
          <div class="records_wrapper" v-for="(score, scoreKey) in moodScores" :key="scoreKey">

            <div class="records_details" @click="viewRecordDetail(scoreKey)">
              <svg :style="{ width: `${canvas.width}%`, height: `${canvas.height}%` }">
                <g class="records_score"
                  transform="scale(1, 1)">
                  <!-- Individual Score within 1 Reading -->
                  <!-- :cy = - (parameter) to reverse the axis -->
                  <circle v-for="(valence, valenceKey) in score.valence" :key="valenceKey"
                    :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * score.arousal[valenceKey]))}%`,
                              cy: `${canvas.height / 1.25 - (score.arousal[valenceKey] + (50 * (valence * score.arousal[valenceKey])))}%` }"
                    :r="50 * (valence)" fill="white" :fill-opacity="score.arousal[valenceKey]" />
                  <!-- :cy = canvas.height / 4 - (parameter) to reverse the axis -->
                  <circle v-for="(valence, valenceKey) in score.valence" :key="valenceKey"
                    :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * score.arousal[valenceKey]))}%`,
                              cy: `${canvas.height / 1.25 - (score.arousal[valenceKey] + (50 * (valence * score.arousal[valenceKey])))}%` }"
                    :r="25 * (valence)" :fill="colours[scoreKey]" :fill-opacity="valence" />

                  <text x="15" y="40" text-anchor="start" :fill="colours[scoreKey]">{{ texts[scoreKey] }}</text>
                  <text x="15" y="40" text-anchor="start" :fill="colours[scoreKey]">{{ texts[scoreKey] }}</text>
                   <!-- ({{ times[scoreKey] }}) -->
                </g>
              </svg>
            </div>

            <h2 class="diary_title">{{ diary.titles[scoreKey] }}</h2>
          </div>
        </section>
      </article>
    </div>

    <!-- Show 1 Card in Detail -->
    <div v-else id="record_detail">
      <D3 :emitter="emitterObj" :recordDetails="recordDetails" />
    </div>
  </div>
</template>

<script>
import {
  onMounted, reactive, ref, watch,
} from 'vue';

import isEmpty from '@/components/Utils/logic/object';

// D3 Module
import { extent, scaleQuantize } from 'd3';

// Sketch
import D3 from '@/components/Sketches/D3.vue';

export default {
  name: 'Records',
  props: {
    emitter: {
      type: Object,
    },
    userJourney: {
      type: Object,
    },
  },
  components: {
    D3,
  },
  setup(props) {
    // Emitter
    const emitterObj = ref(props.emitter);
    // userJourney
    const userJourneyObj = ref(props.userJourney);
    const isObjEmpty = ref(isEmpty(userJourneyObj.value));

    // D3
    // Canvas Width and Height
    const canvas = reactive({
      width: 100,
      height: 100,
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

    // Display Diary Title and Content
    const diary = reactive({
      titles: [],
      contents: [],
    });

    // Show A General View of All Record Cards
    function updateAffectiveScore() {
      moodScores.value = [];
      for (let i = 0; i < userJourneyObj.value.length; i += 1) {
        const mood = userJourneyObj.value[i].songs.mood_scores;

        // Get the Date Values
        dates.value.push(userJourneyObj.value[i].date);
        times.value.push(userJourneyObj.value[i].time);

        // Get the Diary Data
        diary.titles.push(userJourneyObj.value[i].user.diary.title);
        diary.contents.push(userJourneyObj.value[i].user.diary.content);

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

    // Emotion Detail and Other Metadata for Record Display
    const recordDetails = reactive({
      isOpen: false,
      which: 0,
      journey: null,
      colour: null,
    });

    // Listen on 'record_detail_window' event to detect record detail window being closed
    emitterObj.value.on('record_detail_window', (val) => {
      recordDetails.isOpen = val;
    });

    // View Record Detail after Choosing a Record Card
    function viewRecordDetail(key) {
      if (!recordDetails.isOpen) {
        recordDetails.isOpen = true;
        recordDetails.which = key;
        recordDetails.journey = userJourneyObj.value[recordDetails.which];
        recordDetails.colour = colours.value[recordDetails.which];
      }
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
      emitterObj,
      userJourneyObj,
      moodScores,
      isObjEmpty,
      canvas,
      colours,
      texts,
      dates,
      times,
      viewRecordDetail,
      recordDetails,
      diary,
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

    #records_board {
      position: relative;
      width: 100%;
      height: 100%;

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
        gap: 20px;

        #headers {
          grid-area: myArea;
          width: 100%;
          text-align: center;
          padding: 15px;
          background-color: rgb(51, 51, 51);
          color: rgb(173, 173, 173);
        }

        .records_wrapper {
          position: relative;
        }

        .diary_title {
          margin: 20px;
          padding: 10px;
          background-color: rgb(15, 15, 15);
        }

        .records_details {
          position: relative;
          bottom: 0;
          margin: 20px;
          border-radius: 10px;
          border: 2px solid rgb(138, 138, 138);
          box-shadow: inset 0 0 1000px rgb(138, 138, 138);
          background-color: rgba(80, 80, 80, 0.25);
          cursor: pointer;
          transition: .25s all;

          svg {
            width: 100%;
          }

          &:hover {
            box-shadow: inset 0 0 10px rgb(138, 138, 138);
          }
        }
      }
    }
  }

  #record_detail {
    @extend #records_area;
  }
}
</style>
