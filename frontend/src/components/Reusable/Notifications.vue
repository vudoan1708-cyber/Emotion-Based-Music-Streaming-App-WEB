<template>
  <div id="notification">
    <div id="wrapper">
      <h3>{{ instructions.header }}</h3><br v-if="instructions.stage !== 0" />
      <div v-if="instructions.stage !== 0">
        <p v-for="content in instructions.contents" :key="content">{{ content }}<br /></p>
      </div>
      <!-- Button -->
      <div id="notification_btn" @click="changeInstructionStage()">
        <h4>{{ instructions.button }}</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  name: 'Notifications',
  props: {
    emitter: {
      type: Object,
    },
  },
  setup(props) {
    // Instructions
    const instructions = reactive({
      isShown: false,
      stage: 0,
      header: 'Welcome to Muserfly',
      contents: [''],
      button: 'Next',
    });

    function changeInstructionStage() {
      instructions.stage += 1;
      if (instructions.stage === 1) {
        instructions.header = 'Valence & Arousal';
        instructions.contents[0] = 'Valence: on the x-axis, is the positive or negative affectivity (from unpleasant to pleasant: 0 - 1)';
        instructions.contents[1] = 'Arousal: on the y-axis, is the measures of the activation in terms of energy (from boring to energetic: 0 - 1)';
      } else if (instructions.stage === 2) {
        instructions.header = 'Playlist Section';
        instructions.content = '';
      } else if (instructions.stage === 3) {
        instructions.header = 'Navigation Section';
        instructions.content = '';
      } else if (instructions.stage === 4) {
        instructions.header = 'Settings Section';
        instructions.content = '';
      } else if (instructions.stage === 5) {
        instructions.button = 'Finish';
        instructions.header = 'Hooray!!!';
        instructions.content = 'You are ready to go';
      } else {
        // Send back to the parent component a signal saying the instructions process is finished
        props.emitter.emit('instructions', true);
      }
    }

    return {
      instructions,
      changeInstructionStage,
    };
  },
};
</script>

<style scoped lang="scss">
#notification {
  position: absolute;
  top:  0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;

  #wrapper {
    /* reset the width of the div to fit the inner content
    with inline-block display */
    display: inline-block;
    position: relative;
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: rgb(63, 63, 63);
    color: white;

    p {
      text-align: left;
    }

    #notification_btn {
      display: inline-block;
      border-radius: 5px;
      background-color: rgb(75, 131, 78);
      margin-top: 20px;
      padding: 10px;
      cursor: pointer;

      &:hover {
        background-color: rgb(115, 185, 118);
      }
    }
  }
}
</style>
