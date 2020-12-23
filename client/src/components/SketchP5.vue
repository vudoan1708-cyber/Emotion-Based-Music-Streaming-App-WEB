<template>
  <div class="d-flex justify-content-center" id="p5Canvas">
  </div>
</template>

<script>
import { onMounted } from 'vue';

import p5 from 'p5';

// Utilities
import { createBGStars, drawGalaxyBG } from '@/components/Utils/p5/bg';
import { createMap, drawMap } from '@/components/Utils/p5/emotionMap';

export default {
  name: 'SketchP5',
  setup() {
    /* eslint-disable no-console */
    /* eslint-disable padded-blocks */
    /* eslint-disable no-trailing-spaces */
    /* eslint-disable-next-line linebreak-style */
    /* eslint-disable no-multiple-empty-lines */
    /* eslint-disable semi */
    /* eslint-disable indent */
    /* eslint-disable no-unused-vars */
    /* eslint-disable max-len */
    /* eslint-disable no-param-reassign */
    /* eslint-disable no-new */
    /* eslint-disable no-plusplus */
    /* eslint-disable new-cap */

    const sketch = (p) => {
      // disables FES
      // eslint-disable-next-line no-param-reassign
      p.disableFriendlyErrors = true;

      const width = window.innerWidth;
      const height = window.innerHeight;

      let starDots = [];
      const galaxy = [];
      const chosenPoints = [];

      const stars = Array(360);

      const showMap = false;
      let isClicked = false;

      p.setup = () => {
        p.createCanvas(width, height).parent('p5Canvas');
        p.background(0);

        // make bg
        createBGStars(width, height, stars, galaxy, p);

        // make emotion map
        starDots = createMap(width, height, starDots, p);
      };
      p.draw = () => {
        p.background(10);
        drawGalaxyBG(galaxy, p);
        drawMap(width, height, isClicked, starDots, chosenPoints, p);
        // p.text('hello world!', 50, 100);
      };

      p.mousePressed = () => {

        // only clickable when the emotion map is shown
        // if (showMap) {
          for (let i = 0; i < starDots.length; i++) {
            for (let j = 0; j < starDots[i].length; j++) {
        
              if (starDots[i][j].onHover()) {
                console.log(i / starDots.length, 1 - j / starDots[i].length);
                isClicked = true;
                chosenPoints.push(i, j);
              }
            }
          }
        // }
      }

    };

    onMounted(() => {
      new p5(sketch);
    });
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_bg';
</style>
