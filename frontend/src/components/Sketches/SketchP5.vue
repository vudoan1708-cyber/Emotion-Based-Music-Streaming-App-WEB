<template>

  <!-- p5 canvas -->
  <div class="d-flex justify-content-center" id="p5Canvas">
  </div>

  <!-- map cover -->
  <div id="map_cover" v-if="mapProperties.status">
    <ul>
      <li id="top_left" style="opacity: 1;" @click=instantiateMap(1) ref="angryBtn">Aggressive</li>
      <li id="top_right" style="opacity: 1;" @click=instantiateMap(2) ref="happyBtn">Exciting</li>
      <li id="bottom_left" style="opacity: 1;" @click=instantiateMap(3) ref="sadBtn">Sad</li>
      <li id="bottom_right" style="opacity: 1;" @click=instantiateMap(4) ref="calmBtn">Calm</li>
    </ul>
  </div>

  <!-- Song Info On The Map -->
  <SongData :emitter="emitterObj" />

  <!-- Instructions -->
  <transition name="fade">
    <Notifications :emitter="emitterObj" v-if="isInstructionsShown" />
  </transition>
</template>

<script>
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */

import {
  onMounted, reactive, ref, watch,
} from 'vue';

import p5 from 'p5';
import io from 'socket.io-client';

// Utilities
import mapRegions from '@/components/Utils/p5/mapRegions';
import { createBGStars, drawGalaxyBG } from '@/components/Utils/p5/galaxyVisualisation';
import { createMap, drawMap, posOnMap } from '@/components/Utils/p5/emotionMapVisualisation';
import { songDots, drawSongDots } from '@/components/Utils/p5/songVisualisation';
import { createNewNeighbours, createHistoricalNeighbours, drawNeighbours } from '@/components/Utils/p5/neighboursVisualisation';

import { indicesToMood, moodToIndices, coordinatesToIndices } from '@/components/Utils/logic/algorithm';
import hashURL from '@/components/Utils/logic/hashURL';

import changeMap from '@/components/Utils/dom/changeMap';

import {
  handlingSongsData, removeATempPlaylist,
  showUserPlaylist, playSong, findSongViaID,
} from '@/handlers/spotify';

// Vue Component
import SongData from '@/components/Common/SongData.vue';

import Notifications from '@/components/Reusable/Notifications.vue';

export default {
  name: 'SketchP5',
  props: {
    personalisationSettings: {
      type: Object,
    },
    emitter: {
      type: Object,
    },
  },
  components: {
    SongData,
    Notifications,
  },
  setup(props) {
    // indices on map
    const mapProperties = reactive({
      i: 0,
      j: 0,
      name: 'Regions on The Map',
      status: true,
    });

    // triggering event to open the map
    const showMap = reactive({
      index: 0,
    });

    // Draggable Location on The Emotion Map
    // Set Default to True,, because the welcoming screen is the Homepage
    const isDraggable = ref(true);

    // When mouseReleased event is Triggered, The System Searches for Song
    const isDragging = ref(false);

    // Allow User To Choose Their Locations on The Map Without Acc Opening It
    // And Only Via Search
    const isSearched = ref(false);

    // Get User Settings
    const userSettingsData = ref([]);

    // PROPS
    const emitterObj = ref(props.emitter);

    // DOM
    const angryBtn = ref(null);
    const happyBtn = ref(null);
    const sadBtn = ref(null);
    const calmBtn = ref(null);

    // Delay Time To Display The Instruction Board
    const isInstructionsShown = ref(false);
    // setTimeout for deplaying the instruction to be displayed
    setTimeout(() => {
      const allowInstructionDisplayed = (hashURL(window.location.href, 1) === 'true');
      isInstructionsShown.value = allowInstructionDisplayed;
    }, 1200);

    // P5
    let starDots = [];
    let p5Obj = null;
    const width = window.innerWidth;
    const height = window.innerHeight;

    function emitMapEvent(state) {
      // socket.io-like package (mitt) for emitting and listening to events
      // between COMPONENTS
      if (state === 'close') emitterObj.value.off('map', mapProperties);
      else emitterObj.value.emit('map', mapProperties);
    }

    // Listen on the 'nav' event
    emitterObj.value.on('nav', (num) => {
      if (num === 1) isDraggable.value = true;
      else isDraggable.value = false;
    });

    // Listen on the 'instructions' event
    emitterObj.value.on('instructions', (isClose) => {
      if (isClose) isInstructionsShown.value = false;
    });

    // listen to click event from the dom elements
    function instantiateMap(num) {
      showMap.index = changeMap(num, showMap.index, angryBtn.value, happyBtn.value, sadBtn.value, calmBtn.value);
    }

    const sketch = (p) => {
      p5Obj = p;
      // disables FES
      // eslint-disable-next-line no-param-reassign
      p.disableFriendlyErrors = true;

      let history = [];

      const galaxy = [];
      const chosenPoints = [];

      const stars = Array(160);

      let isClicked = false;

      let socket = null;

      // in one machine, only two types of data emit from this socket connection
      // 1: HISTORICAL DATA (when first open the app)
      // 2: NEW DATA (when other users choose a coordinates closely to others)
      function userDataEmit(curentData) {
        // check if it is the first HISTORICAL data emit
        // because a HISTORICAL data emit is in a form of an array (not undefined)
        // this condition statement is to store the historical data to a global variable
        if (curentData.length !== undefined) {
          // check if a user is not the first connection to the system
          // because first users don't need historical data
          if (curentData.length !== 0) {
            // shallow copy the data and assign it to a global array
            history = [...curentData];
          }

        // check if it is a current event
        } else {
          // receive the NEW data broadcasted by OTHER USERS
          // and push it to neighbours array
          createNewNeighbours(curentData, chosenPoints, width, height);
        }
      }

      function getSocket() {
        // handling production and development mode
        const PRODUCTION = process.env.NODE_ENV;

        const URL = (PRODUCTION === 'production') ? '' : 'http://localhost:5000';
        socket = io.connect(URL);

        socket.on('connect', () => {
          console.log('Connect to SocketIO successfully');
        });

        socket.on('click', userDataEmit);

        socket.on('error', (err) => {
          console.log(err);
        });
      }

      function locationChosen(i, j, how, trackObj) {
        // Either, a click event, drag and drop events, or a search is accepted
        if (starDots[i][j].onHover() || isSearched.value || isDragging.value) {
          // mapping algorithm to get the valence and arousal values by getting the percentage of an index to the max value
          const { valence, arousal } = indicesToMood(i, j, starDots);

          isClicked = true;
          // Reassign The Array Variable Like This For Repeated Searches, Instead Of Array Push
          chosenPoints[0] = i;
          chosenPoints[1] = j;

          // Refresh The Collected Playlist
          chosenPoints.length !== 0 ? removeATempPlaylist(emitterObj.value) : undefined;

          // send data to the server via socket
          const data = {
            i,
            j,
            size: starDots[i][j].size,
          };
          socket.emit('click', data);

          // manipulate data to be sent to another component file
          mapProperties.status = false;

          // wait for 1.5 sec before closing an event on map positions
          setTimeout(() => { emitMapEvent('close'); }, 1500);

          // HISTORICAL USERS
          // use the history array available globally after collecting it the first time
          // and push it t0 neighbours array as well
          createHistoricalNeighbours(history, chosenPoints, width, height);

          // get songs data from Spotify via the server
          handlingSongsData(Number(valence.toFixed(3)), Number(arousal.toFixed(3)), how, trackObj, userSettingsData.value, starDots, chosenPoints, width, height, p, emitterObj.value);
        }
      }

      // Listen on the 'plot_via_search' event
      emitterObj.value.on('plot_via_search', (track) => {
        // Switch The Variable To True In Order To Allow Opening Up The Zone of The Accepted
        isSearched.value = true;

        // Get Indices of The Searched Tracks Via Its Mood Values
        const trackMood = moodToIndices(track.valence, track.arousal, starDots);
        locationChosen(trackMood.i, trackMood.j, 'search', track);

        // Get The Regions Values
        let region = null;
        for (let i = 0; i < starDots.length; i += 1) {
          for (let j = 0; j < starDots[i].length; j += 1) {
            region = mapRegions(trackMood.i, trackMood.j, i, starDots);
          }
        }
        // Show The Map, Only Applicable When The Map Is Not Shown Yet
        showMap.index === 0 ? instantiateMap(region) : showMap.index = region;

        // Tell The Navigation Bar To Switch Back To The Homepage After A Song Track Is Chosen
        emitterObj.value.emit('nav', (1));
      });

      p.setup = () => {
        p.createCanvas(width, height).parent('p5Canvas');
        p.frameRate(15);
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
        mapProperties.i = typeof (mood.valence) === 'number' ? (mood.valence).toFixed(3) : NaN;
        mapProperties.j = typeof (mood.arousal) === 'number' ? (mood.arousal).toFixed(3) : NaN;
        mapProperties.status ? emitMapEvent('open') : undefined;

        if (showMap.index !== 0) {
          // For Performances Reason, Hide All Song Dots And Neighbours
          // All The Map-Related Visualisation Elements Will Always Be Drawn When Homepage is Visited
          if (isDraggable.value) {
            // The Emotion Map
            drawMap(width, height, isClicked, starDots, chosenPoints, showMap.index, mapProperties, emitterObj.value, p);

            // Song Dots
            drawSongDots(starDots, chosenPoints, emitterObj.value);

            // Neighbours
            drawNeighbours(p);
          }
        }
      };

      p.mousePressed = async () => {
        // only clickable when the emotion map is shown
        if (showMap.index !== 0) {
          if (mapProperties.status) {
            const mouseIndices = coordinatesToIndices(p.mouseX, p.mouseY, width, height);

            for (let i = 0; i < starDots.length; i += 1) {
              for (let j = 0; j < starDots[i].length; j += 1) {
                const region = mapRegions(mouseIndices.i, mouseIndices.j, i, starDots);

                // to prevent click event happens globally for all regions
                // on clickable on one selected region
                if (region === 1 && showMap.index === 1) {
                  locationChosen(i, j, 'random', null);
                } else if (region === 2 && showMap.index === 2) {
                  locationChosen(i, j, 'random', null);
                } else if (region === 3 && showMap.index === 3) {
                  locationChosen(i, j, 'random', null);
                } else if (region === 4 && showMap.index === 4) {
                  locationChosen(i, j, 'random', null);
                }
              }
            }
          } else {
            for (let i = 0; i < songDots.length; i += 1) {
              if (songDots[i].onHover()) {
                const offsetTrack = findSongViaID(songDots[i].id);
                await playSong(0, offsetTrack);
              }
            }
          }
        }
      };

      p.mouseReleased = () => {
        if (isDragging.value) {
          locationChosen(chosenPoints[0], chosenPoints[1], 'random', null);
          isDragging.value = false;
        }
      };

      p.mouseDragged = () => {
        // only draggable when the emotion map is shown, and only when a user is on Homepage section
        if (showMap.index !== 0) {
          if (isDraggable.value) {
            // to get affective values
            /// start by translating coordinates values to indices
            const indices = coordinatesToIndices(p.mouseX, p.mouseY, width, height);

            // constrain the dragable areas
            if (indices.i >= 0 && indices.i < starDots[starDots.length - 1][0].i) {
              if (indices.j >= 0 && indices.j < starDots[0][starDots[0].length - 1].j) {
                removeATempPlaylist(emitterObj.value);

                // convert the mapping algorithm to indices
                // move the chosen point to other locations
                const { i, j } = coordinatesToIndices(p.mouseX, p.mouseY, width, height);
                chosenPoints[0] = i;
                chosenPoints[1] = j;

                // Reassign showMap index to change colour of region based on the chosen point's location
                showMap.index = mapRegions(chosenPoints[0], chosenPoints[1], chosenPoints[0], starDots);

                // Trigger isDragging to true to search for song when mouse is released
                isDragging.value = true;
              }
            }
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(width, height);
      };
    };

    function searchUserPersonalisedPlaylist(datum) {
      const {
        // eslint-disable-next-line camelcase
        title, valence, arousal, id, album_imgs, artist_details, artist_names, external_urls,
      } = datum;
      showUserPlaylist(title, valence, arousal, id,
        album_imgs, artist_details, artist_names, external_urls,
        starDots, width, height, p5Obj, emitterObj.value);
    }

    watch(props.personalisationSettings, (data) => {
      data.forEach((datum, index) => {
        if (index !== 0 && datum.message !== 'no personalised data') {
          datum.forEach((d) => {
            searchUserPersonalisedPlaylist(d);
          });
        } else {
          userSettingsData.value = datum;
        }
      });
    });

    onMounted(() => {
      // eslint-disable-next-line no-new
      new p5(sketch);
    });

    return {
      emitterObj,
      songDots,
      angryBtn,
      happyBtn,
      sadBtn,
      calmBtn,
      instantiateMap,
      isInstructionsShown,
      mapProperties,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_sketch';
@import '@/sass/Unique/_map_cover';
</style>
