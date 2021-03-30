<!-- eslint-disable max-len -->
<template>
  <div id="detail">
    <svg :style="{ width: `${canvas.width}%`, height: `${canvas.height}%` }">
        <g class="board">
          <text :x="`${canvas.width / 2}%`" :y="`${canvas.height / 2}%`" fill="white">Hello</text>
          <rect :x="`${canvas.width / 2}%`" :y="`${canvas.height / 2}%`" fill="blue"></rect>
        </g>
    </svg>
  </div>
</template>

<script>
import {
  reactive, toRefs, watch,
} from 'vue';

// D3
// import { scaleLinear } from 'd3';

export default {
  name: 'D3',
  props: {
    recordDetails: {
      type: Object,
    },
  },
  setup(props) {
    // using `toRefs` to create a Reactive Reference to the `recordDetails` property of props
    const { which, journey } = toRefs(props.recordDetails);
    console.log(which.value, journey.value);

    // D3
    // Canvas Width and Height
    const canvas = reactive({
      width: 100,
      height: 100,
    });

    watch(() => [which, journey], ([key, d]) => {
      which.value = key;
      journey.value = d;
    });

    return {
      canvas,
      journey,
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
