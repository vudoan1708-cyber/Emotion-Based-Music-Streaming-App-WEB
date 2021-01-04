<template>
  <div id="login">
    <div id="bg">
    </div>
    <div id="button">

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
import { createBGStars, drawGalaxyBG, moveGalaxyBG } from '@/components/Utils/p5/bg';

import { onMounted } from 'vue';

export default {
  name: 'LogIn',
  setup() {

    // binded function to a button
    async function login() {
      LoginHandlers();
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
      login,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_login';
</style>
