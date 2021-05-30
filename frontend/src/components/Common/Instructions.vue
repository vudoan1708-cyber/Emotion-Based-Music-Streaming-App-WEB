<template>
  <div id="notification">
    <div ref="notificationWrapperRef" id="wrapper">
      <h2>{{ instructions.header }}</h2><br v-if="instructions.stage !== 0" />
      <div class="handbookImg">
        <img :src="instructions.img" v-if="instructions.stage === 0" />
      </div>
      <div class="conditionalDiv"
        v-if="instructions.stage !== 0  && instructions.contents.length !== 0">
        <h3 v-for="header in instructions.subHeaders" :key="header">{{ header }}
          <br v-if="instructions.subHeaders.length !== 0" />
        </h3>
        <div class="handbookImg">
          <img :src="instructions.img" v-if="instructions.stage < 5" />
        </div>
        <br v-if="instructions.contents.length !== 0" />

        <p v-for="content in instructions.contents" :key="content">{{ content }}</p>
        <br v-if="instructions.contents.length !== 0" />
      </div>
      <!-- Button -->
      <div id="btn_wrapper">
        <div class="notification_btn" @click="changeInstructionStage(-1)">
          <h4>{{ instructions.buttons[0] }}</h4>
        </div>
        <div class="notification_btn" @click="changeInstructionStage(1)">
          <h4>{{ instructions.buttons[1] }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';

// Images
import Logo from '@/assets/logo/logo.png';
import VA from '@/assets/imgs/instructions_v_a.png';
import PlaylistSection from '@/assets/imgs/instructions_playlists.png';
import NavigationSection from '@/assets/imgs/instructions_nav.png';
import SettingsSection from '@/assets/imgs/instructions_settings.png';

export default {
  name: 'Instructions',
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
      img: Logo,
      header: 'Muserfly Handbook',
      subHeaders: [],
      contents: [],
      buttons: ['Close', 'Next'],
    });

    // References
    const notificationWrapperRef = ref(null);

    function changeInstructionStage(step) {
      instructions.stage += step;
      instructions.img = '';
      instructions.subHeaders = [];
      instructions.contents = [];

      // Dynamically Change The Wrapper's Styling
      notificationWrapperRef.value.style.height = '90%';
      notificationWrapperRef.value.style.overflowY = 'scroll';

      if (instructions.stage === 1) {
        instructions.img = VA;
        instructions.header = 'The Emotion Map Section';
        instructions.subHeaders[0] = '* Valence: on the x-axis, is the positive or negative affectivity (from unpleasant to pleasant: 0 - 1)';
        instructions.subHeaders[1] = '* Arousal: on the y-axis, is the measures of the activation in terms of energy (from boring to energetic: 0 - 1)';

        // Content
        instructions.contents[0] = '1. Choose a mood that you prefer, then you will be introduced to an emotion map which is made of colourful star dots (locations).';
        instructions.contents[1] = '2. Each of these dots represents 2 affective scores: Valence and Arousal. You can start a song collection process by clicking on any dot on the screen.';
        instructions.contents[2] = '3. Once the collection is finished. Collected song tracks will be played immediately.';
        instructions.contents[3] = '4. If you have accidentally chosen the wrong location on the map. You can still drag the chosen point to a more preferable location, and the system will start the song collection process again.';
        instructions.buttons[0] = 'Previous';
        instructions.buttons[1] = 'Next';
      } else if (instructions.stage === 2) {
        instructions.img = PlaylistSection;
        instructions.header = 'Playlist Section';
        instructions.subHeaders[0] = '* The Zone of The Accepted (The Zone): A green zone which is created after a location on the emotion map is chosen, is used to collect any fetched songs with marginally different afffective scores to a chosen point';
        instructions.subHeaders[1] = '* Collected Tracks: A section where tracks that are inside The Zone are displayed';
        instructions.subHeaders[2] = '* All Tracks: A section where all tracks that are inside and outside The Zone are displayed';

        // Content
        instructions.contents[0] = '1. A song outside of the Zone can be included as one of the collected tracks by dragging it from the All Tracks section into the Collected Tracks section';
        instructions.contents[1] = '2. After dropping a desired track into the section, a corresponding dot on the map will turn yellow, which indicates a song is chosen by users and not by the system';
        instructions.buttons[0] = 'Previous';
        instructions.buttons[1] = 'Next';
      } else if (instructions.stage === 3) {
        instructions.img = NavigationSection;
        instructions.header = 'Navigation Section';
        instructions.subHeaders[0] = '* Homepage: A section where the emotion map resides';
        instructions.subHeaders[1] = '* Search: A section which is used for searching songs';
        instructions.subHeaders[2] = '* Records: A section where listening habits of a user is stored (Not Yet Implemented)';
        instructions.subHeaders[3] = '* Portfolio: A section which creates a playground for amateur artists to get started on their music journey (Not Yet Implemented)';

        // Content
        instructions.contents[0] = '1. When there is a song you like listening to, you can do a search. Once, a searched song is selected, any related song / artist will be searched for and plotted on the map';
        instructions.contents[1] = '2. When you want to go back to the past, reminisce about the days, the years where different songs bring you different feelings, you can go to the records section';
        instructions.buttons[0] = 'Previous';
        instructions.buttons[1] = 'Next';
      } else if (instructions.stage === 4) {
        instructions.img = SettingsSection;
        instructions.header = 'Settings Section';
        instructions.subHeaders[0] = '* Minimum Number of Tracks to Play: A section where you can choose how many songs should be collected and played';
        instructions.subHeaders[1] = '* Artists: A section where you will define any artist you like listening to (Not Yet Implemented)';
        instructions.subHeaders[2] = '* Themes: A section where you will define any any keyword you would like the system to search for you (Not Yet Implemented)';
        instructions.subHeaders[3] = '* Genre: A section where you will define a genre you would like to listen to';

        instructions.contents[0] = 'You can choose number of tracks you would like to listen to by filling in a number in the Minimum Number of Tracks to Play section';
        instructions.contents[1] = 'For the next 3 fields: Artists, Themes, Genres. This is tricky, since you need to define the correct artist name with their music genre if you want to define more than one field';
        instructions.contents[2] = 'But for the system to perform a clean search, we would suggest you to define just 1 of those fields';
        instructions.buttons[0] = 'Previous';
        instructions.buttons[1] = 'Next';
      } else if (instructions.stage === 5) {
        instructions.buttons[0] = 'Previous';
        instructions.buttons[1] = 'Finish';
        instructions.header = 'Hooray!!!';
        instructions.contents[0] = 'You are ready to use the app. Have fun';
        notificationWrapperRef.value.style.height = '';
        notificationWrapperRef.value.style.overflowY = '';
      } else if (instructions.stage === 0) {
        instructions.buttons[0] = 'Close';
        instructions.img = Logo;
        instructions.header = 'Muserfly Handbook';
        notificationWrapperRef.value.style.height = '';
        notificationWrapperRef.value.style.overflowY = '';
      } else {
        // Send back to the SketchP5 component a signal saying the instructions process is finished
        props.emitter.emit('instructions', true);

        notificationWrapperRef.value.style.height = '';
        notificationWrapperRef.value.style.overflowY = '';
      }
    }

    return {
      instructions,
      changeInstructionStage,
      notificationWrapperRef,
    };
  },
};
</script>

<style scoped lang="scss">
#notification {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  z-index: 5;

  #wrapper {
    /* reset the width of the div to fit the inner content
    with inline-block display */
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 15px;
    border-radius: 5px;
    background-color: rgb(63, 63, 63);
    color: white;

    .handbookImg {
      margin: 10px;
    }
    h3, p {
      text-align: left;
      line-height: 1.5;
    }
    p {
      color: rgb(223, 223, 223);
    }

    #btn_wrapper {
      display: flex;
      justify-content: space-around;
      .notification_btn {
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
}
</style>
