<!-- eslint-disable max-len -->
<template>
  <div id="detail">
    <svg :style="{ width: `${canvas.width}%`, height: `${canvas.height}%` }">
        <g class="board">
          <!-- Container -->
          <rect x="0" y="0" :width="`${canvas.width}%`" :height="`${canvas.height}%`" fill="black"></rect>
          <!-- Date -->
          <text :x="`${canvas.width / 2}%`" :y="`${margin.top}%`" fill="white" font-size="2em" text-anchor="middle">{{ journey.date }}</text>
          <!-- Title -->
          <text :x="`${canvas.width / 2}%`" :y="`${margin.top + 15}%`" fill="rgba(255, 255, 255, .75)"  text-anchor="middle">My Emotion Journey</text>

          <!-- Add X axis -->
          <svg x="0" :y="`${canvas.height - margin.bottom}%`" :style="{ width: `${canvas.width}%`, height: `${canvas.height}%` }">
            <g ref="xAxisRef"></g>
          </svg>

          <!-- Add Y axis -->
          <svg :x="margin.left" y="0" :style="{ width: `${canvas.width}%`, height: `${canvas.height}%` }">
            <g ref="yAxisRef"></g>
          </svg>

          <!-- Add Scatter Plot -->
          <g>
            <!-- Big White Circle with Opacity based on Actual Values (Visualise The Value) (Act Like Stroke) -->
            <circle v-for="(valence, valenceKey) in journey.songs.mood_scores.valence" :key="valenceKey"
              :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`,
                        cy: `${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%` }"
              :r="30 * (valence)" fill="white" :fill-opacity="(valence + journey.songs.mood_scores.arousal[valenceKey]) / 2" />
            <g v-for="(valence, valenceKey) in journey.songs.mood_scores.valence" :key="valenceKey">
              <line v-if="valenceKey !== journey.songs.mood_scores.valence.length - 1"
                    :x1="`${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`"
                    :y1="`${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%`"
                    :x2="`${canvas.width / 2 * journey.songs.mood_scores.valence[valenceKey + 1] + (50 * (journey.songs.mood_scores.valence[valenceKey + 1] * journey.songs.mood_scores.arousal[valenceKey + 1]))}%`"
                    :y2="`${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey + 1] + (50 * (journey.songs.mood_scores.valence[valenceKey + 1] * journey.songs.mood_scores.arousal[valenceKey + 1])))}%`"
                    style="stroke:rgb(255,255,255); stroke-width:2" />
            </g>
            <!-- Biggest Coloured Circle with Opacity based on Actual Values (Visualise The Value) -->
            <circle v-for="(valence, valenceKey) in journey.songs.mood_scores.valence" :key="valenceKey"
              :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`,
                        cy: `${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%` }"
              :r="25 * (valence)" :fill="colour" :fill-opacity="(valence + journey.songs.mood_scores.arousal[valenceKey]) / 2" />
            <!-- Second Biggest Red Circle with Some Opacity (Make Visualisation Look Good) -->
            <circle v-for="(valence, valenceKey) in journey.songs.mood_scores.valence" :key="valenceKey"
              :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`,
                        cy: `${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%` }"
              :r="25 * (valence)" :fill="colour" :fill-opacity="(valence + journey.songs.mood_scores.arousal[valenceKey]) / 4" />
            <!-- Third Biggest Red Circle without Opacity (Make Visualisation Look Good) -->
            <circle v-for="(valence, valenceKey) in journey.songs.mood_scores.valence" :key="valenceKey"
              :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`,
                        cy: `${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%` }"
              :r="15 * (valence)" :fill="colour" />
            <!-- White Circle at The Center -->
            <circle v-for="(valence, valenceKey) in journey.songs.mood_scores.valence" :key="valenceKey"
              :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`,
                        cy: `${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%` }"
              :r="10 * (valence)" fill="white" />
          </g>
        </g>
    </svg>
  </div>
</template>

<script>
import {
  onBeforeMount,
  reactive, ref, toRefs, watch,
} from 'vue';

// D3
import {
  select, scaleLinear, axisBottom, axisLeft,
} from 'd3';

export default {
  name: 'D3',
  props: {
    recordDetails: {
      type: Object,
    },
  },
  setup(props) {
    // using `toRefs` to create a Reactive Reference to the `recordDetails` property of props
    const { which, journey, colour } = toRefs(props.recordDetails);

    // DOM Ref
    const xAxisRef = ref(null);
    const yAxisRef = ref(null);

    // D3
    // Canvas Width and Height
    const canvas = reactive({
      width: 100,
      height: 100,
    });

    const margin = reactive({
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    });

    // X-Axis
    const axes = reactive({
      x: scaleLinear()
        .domain([0, 1])
        .range([0, canvas.width]),
      y: scaleLinear()
        .domain([0, 1])
        .range([0, canvas.height]),
    });

    function createAxes() {
      select(xAxisRef.value).call(axisBottom(axes.x));
      select(yAxisRef.value).call(axisLeft(axes.y));
    }

    onBeforeMount(() => {
      createAxes();
    });

    watch(() => [which, journey], ([key, d]) => {
      which.value = key;
      journey.value = d;
    });

    return {
      canvas,
      margin,
      journey,
      colour,
      axes,
      xAxisRef,
      yAxisRef,
    };
  },
};
</script>

<style lang="scss" scoped>
#detail {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
