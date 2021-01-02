<template>
  <div class="d-flex justify-content-center" id="p5Canvas">
  </div>
</template>

<script>
// @ts-nocheck
import { onMounted } from 'vue';

import p5 from 'p5';
import io from 'socket.io-client';

// Utilities
import { createBGStars, drawGalaxyBG } from '@/components/Utils/p5/bg';
import { createMap, drawMap } from '@/components/Utils/p5/emotionMap';
import { drawSongDots } from '@/components/Utils/p5/songVisualisation';
import { createNewNeighbours, createHistoricalNeighbours, drawNeighbours } from '@/components/Utils/p5/neighboursVisualisation';

import { indicesToMood, coordinatesToIndices } from '@/components/Utils/logic/algorithm';

import { handlingSongsData, removeATempPlaylist } from '@/handlers/spotify';

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
    /* eslint-disable camelcase */

    const sketch = (p) => {
      // disables FES
      // eslint-disable-next-line no-param-reassign
      p.disableFriendlyErrors = true;

      const width = window.innerWidth;
      const height = window.innerHeight;

      let starDots = [];
      let history = [];

      const galaxy = [];
      const chosenPoints = [];

      const stars = Array(360);

      const showMap = false;
      let isClicked = false;

      let socket = null;

      // in one machine, only two types of data emit from this socket connection
      // 1: HISTORICAL DATA (when first open the app)
      // 2: NEW DATA (when other users choose a coordinates closely to others)
      function userDataEmit(curent_data) {
        // check if it is the first HISTORICAL data emit
        // because a HISTORICAL data emit is in a form of an array (not undefined)
        // this condition statement is to store the historical data to a global variable
        if (curent_data.length !== undefined) {
          // check if a user is not the first connection to the system
          // because first users don't need historical data
          if (curent_data.length !== 0) {
            // shallow copy the data and assign it to a global array
            history = [...curent_data];
            console.log(history);
          }

        // check if it is a current event
        } else {
          // receive the NEW data broadcasted by OTHER USERS
          // and push it to neighbours array
          createNewNeighbours(curent_data, chosenPoints, width, height);
        }
        console.log(`Other User Data: ${curent_data.i}, ${curent_data.j}`);
        // console.log(`My Data: ${chosenPoints[0]}, ${chosenPoints[1]}`);
      }

      function getSocket() {
        // handling production and development mode
        const PRODUCTION = process.env.NODE_ENV;

        const URL = (PRODUCTION === 'production') ? '' : 'http://localhost:5000';
        socket = io.connect(URL);

        socket.on('connect', () => {
          console.log('Successfully Connected');
        });

        socket.on('click', userDataEmit);

        socket.on('error', (err) => {
          console.log(err);
        });
      }

      p.setup = () => {
        p.createCanvas(width, height).parent('p5Canvas');
        p.ellipseMode(p.CENTER);
        p.rectMode(p.CENTER);

        // socket.io
        getSocket();

        // make bg
        createBGStars(width, height, stars, galaxy, p);

        // make emotion map
        starDots = createMap(width, height, starDots, p);
      };
      p.draw = () => {
        p.background(10);
        drawGalaxyBG(galaxy, p);

        // The Emotion Map
        drawMap(width, height, isClicked, starDots, chosenPoints, p);

        // Song Dots
        drawSongDots(starDots, chosenPoints, width, height, p5);

        // Neighbours
        drawNeighbours(p);
      };

      p.mousePressed = () => {

        // only clickable when the emotion map is shown
        for (let i = 0; i < starDots.length; i++) {
          for (let j = 0; j < starDots[i].length; j++) {

            if (starDots[i][j].onHover()) {
              console.log(i / starDots.length, 1 - j / starDots[i].length);
              console.log(i, j);

              // mapping algorithm to get the valence and arousal values by getting the percentage of an index to the max value
              const mood = indicesToMood(i, j, starDots);

              isClicked = true;
              chosenPoints.push(i, j);

              // send data to the server via socket
              const data = {
                i,
                j,
                size: starDots[i][j].size,
              }
              socket.emit('click', data);

              // HISTORICAL USERS
              // use the history array available globally after collecting it the first time
              // and push it t0 neighbours array as well
              createHistoricalNeighbours(history, chosenPoints, width, height);

              // get songs data from Spotify via the server
              handlingSongsData(Number(mood.valence.toFixed(3)), Number(mood.arousal.toFixed(3)), starDots, chosenPoints, width, height, p);
            }
          }
        }
      }

      p.mouseDragged = () => {

        removeATempPlaylist();

        // convert the mapping algorithm to indices
        // move the chosen point to other locations
        const indices = coordinatesToIndices(width, height, p);
        chosenPoints[0] = indices.i;
        chosenPoints[1] = indices.j;
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
