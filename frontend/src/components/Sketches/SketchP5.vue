<template>

  <!-- p5 canvas -->
  <div class="d-flex justify-content-center" id="p5Canvas">
  </div>

  <!-- map cover -->
  <div id="map_cover" v-if="map_properties.status">
    <ul>
      <li id="top_left" style="opacity: 1;" @click=instantiateMap(1) ref="angryBtn">Aggressive</li>
      <li id="top_right" style="opacity: 1;" @click=instantiateMap(2) ref="happyBtn">Exciting</li>
      <li id="bottom_left" style="opacity: 1;" @click=instantiateMap(3) ref="sadBtn">Sad</li>
      <li id="bottom_right" style="opacity: 1;" @click=instantiateMap(4) ref="calmBtn">Calm</li>
    </ul>
  </div>

  <!-- song data -->
  <SongData />

</template>

<script>
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
/* eslint-disable vue/no-mutating-props */

import {
 onMounted, reactive, ref, getCurrentInstance,
} from 'vue';

import p5 from 'p5';
import io from 'socket.io-client';

// Utilities
import { createBGStars, drawGalaxyBG } from '@/components/Utils/p5/bg';
import { createMap, drawMap, posOnMap } from '@/components/Utils/p5/emotionMap';
import { drawSongDots } from '@/components/Utils/p5/songVisualisation';
import { createNewNeighbours, createHistoricalNeighbours, drawNeighbours } from '@/components/Utils/p5/neighboursVisualisation';

import { indicesToMood, coordinatesToIndices } from '@/components/Utils/logic/algorithm';
import changeMap from '@/components/Utils/dom/changeMap';

import { handlingSongsData, removeATempPlaylist } from '@/handlers/spotify';

// Vue component
import SongData from '@/components/Common/SongData.vue';

export default {
  name: 'SketchP5',
  setup() {

    // instantiate the app's current instance to get global properties
    // registered in the main.js file
    const app = getCurrentInstance();
    const emitter = app.appContext.config.globalProperties.$emitter;

    // indices on map
    const map_properties = reactive({
      i: 0,
      j: 0,
      img: '#',
      name: '',
      status: true,
    });

    // triggering event to open the map
    const showMap = reactive({
      index: 0,
    });

    // DOM
    const angryBtn = ref(null);
    const happyBtn = ref(null);
    const sadBtn = ref(null);
    const calmBtn = ref(null);

    function emitEvent() {
      // socket.io-like package (mitt) for emitting and listening to events
      // between COMPONENTS
      emitter.emit('map', map_properties);
    }

    // listen to click event from the dom elements
    function instantiateMap(num) {
      showMap.index = changeMap(num, showMap.index, angryBtn.value, happyBtn.value, sadBtn.value, calmBtn.value);
    }

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

      const stars = Array(160);

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

        // Keep Track of Affective Values on The Emotion Map
        const mood = posOnMap(width, height, starDots, p);
        // eslint-disable-next-line valid-typeof
        map_properties.i = typeof (mood.valence) === 'number' ? (mood.valence).toFixed(3) : NaN;
        map_properties.j = typeof (mood.arousal) === 'number' ? (mood.arousal).toFixed(3) : NaN;
        emitEvent();

        if (showMap.index !== 0) {

          // The Emotion Map
          drawMap(width, height, isClicked, starDots, chosenPoints, showMap.index, p);

          // Song Dots
          drawSongDots(starDots, chosenPoints, emitter);

          // Neighbours
          drawNeighbours(p);
        }
      };

      p.mousePressed = () => {

        // only clickable when the emotion map is shown
        if (showMap.index !== 0) {
          for (let i = 0; i < starDots.length; i++) {
            for (let j = 0; j < starDots[i].length; j++) {

              if (starDots[i][j].onHover()) {
                console.log(i / starDots.length, 1 - j / starDots[i].length);
                console.log(i, j);

                // mapping algorithm to get the valence and arousal values by getting the percentage of an index to the max value
                const { valence, arousal } = indicesToMood(i, j, starDots);

                isClicked = true;
                chosenPoints.push(i, j);

                // send data to the server via socket
                const data = {
                  i,
                  j,
                  size: starDots[i][j].size,
                }
                socket.emit('click', data);

                // manipulate data to be sent to another component file
                map_properties.status = false;

                // HISTORICAL USERS
                // use the history array available globally after collecting it the first time
                // and push it t0 neighbours array as well
                createHistoricalNeighbours(history, chosenPoints, width, height);

                // get songs data from Spotify via the server
                handlingSongsData(Number(valence.toFixed(3)), Number(arousal.toFixed(3)), starDots, chosenPoints, width, height, p, emitter);
              }
            }
          }
        }
      }

      p.mouseDragged = () => {

        // only draggable when the emotion map is shown
        if (showMap.index !== 0) {
          removeATempPlaylist(emitter);

          // convert the mapping algorithm to indices
          // move the chosen point to other locations
          const { i, j } = coordinatesToIndices(p.mouseX, p.mouseY, width, height);
          chosenPoints[0] = i;
          chosenPoints[1] = j;
        }
      }

      p.windowResized = () => {
        p.resizeCanvas(width, height);
      }
    };

    onMounted(() => {
      new p5(sketch);
    });

    return {
      angryBtn,
      happyBtn,
      sadBtn,
      calmBtn,
      instantiateMap,
      map_properties,
      SongData,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_sketch';
@import '@/sass/Unique/_map_cover';
</style>
