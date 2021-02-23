<template>
  <div id="login" v-if="!isLoggedIn.value">
    <div id="bg">
    </div>

    <div id="button">
      <div id="welcome">
        <h3>Welcome to Muserfly</h3><br />
        <p>As this music streaming app has a pretty unique interface,
         we recommend you go through instructions before actually using it<br /></p>
        <input ref="instructionCheckbox" class="checkforInstructions"
          type="checkbox" name="instructions" id="instructions">
        <label class="checkforInstructions" for="instructions">Please check the box if you'd like
          to go through the instructions</label>
      </div>
      <div id="loginBtn" @click="login">
        <div class="wrapper" id="header"><h4>CONNECT</h4></div>
        <div class="wrapper" id="spotify_logo"><img src="@/assets/spotify.png"/></div>
      </div>
    </div>
  </div>
</template>

<script>
// @ts-nocheck
/* eslint-disable padded-blocks */
/* eslint-disable no-param-reassign */
/* eslint-disable no-new */
/* eslint-disable new-cap */

import p5 from 'p5';

// handler for spotify authorisation flow
import { LoginHandlers } from '@/handlers/spotify';

// Ultilities
import { createBGStars, drawGalaxyBG, moveGalaxyBG } from '@/components/Utils/p5/galaxyVisualisation';

import { onMounted, ref } from 'vue';

export default {
  name: 'LogIn',
  setup() {

    const isLoggedIn = ref(false);
    const instructionCheckbox = ref(null);

    // Bind the function to a button
    async function login() {
      isLoggedIn.value = true;
      LoginHandlers(instructionCheckbox.value.checked);
    }

    const sketch = (p) => {
      // disables FES
      // eslint-disable-next-line no-param-reassign
      p.disableFriendlyErrors = true;

      const width = window.innerWidth;
      const height = window.innerHeight;

      const galaxy = [];

      const stars = Array(360);

      p.setup = () => {
        p.createCanvas(width, height).parent('bg');

        // make bg
        createBGStars(width, height, stars, galaxy, p);
      };
      p.draw = () => {
        p.background(10);
        drawGalaxyBG(galaxy, p);
        moveGalaxyBG(galaxy, p.mouseX, width);
      };
    };

    onMounted(() => {
      new p5(sketch);
    });

    return {
      isLoggedIn,
      login,
      instructionCheckbox,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_login';
</style>
