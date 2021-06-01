<!-- eslint-disable max-len -->
<template>

  <!-- p5 canvas -->
  <div class="d-flex justify-content-center" id="p5Canvas">
  </div>

  <!-- map cover -->
  <div id="map_cover" v-if="mapProperties.status && !isZoomable">
    <ul>
      <li id="top_left" style="opacity: 1;" @click=instantiateMap(1) ref="angryBtn">Aggressive</li>
      <li id="top_right" style="opacity: 1;" @click=instantiateMap(2) ref="happyBtn">Exciting</li>
      <li id="bottom_left" style="opacity: 1;" @click=instantiateMap(3) ref="sadBtn">Sad</li>
      <li id="bottom_right" style="opacity: 1;" @click=instantiateMap(4) ref="calmBtn">Calm</li>
    </ul>
  </div>

  <!-- layer of emotion intensities -->
  <div id="map_layers" v-if="mapProperties.status && !isZoomable">
    <div id="corners">
      <!-- Aggressive -->
      <ul id="angryCorner" v-if="showMap.index === 1">
        <li class="angryLayer angryBorderL low left_corner" style="opacity: 1;">Low Zone</li>
        <li class="angryLayer angryBorderM medium left_corner" style="opacity: 1;">Medium Zone</li>
        <li class="angryLayer angryBorderH high left_corner" style="opacity: 1;">Extreme Zone</li>
      </ul>

      <!-- Exciting -->
      <ul id="excitingCorner" v-else-if="showMap.index === 2">
        <li class="excitingLayer excitingBorderL low right_corner" style="opacity: 1;">Low Zone</li>
        <li class="excitingLayer excitingBorderM medium right_corner" style="opacity: 1;">Medium Zone</li>
        <li class="excitingLayer excitingBorderH high right_corner" style="opacity: 1;">Extreme Zone</li>
      </ul>

      <!-- Sad -->
      <ul id="sadCorner" v-else-if="showMap.index === 3">
        <li class="sadLayer sadBorderL low left_corner" style="opacity: 1;">Low Zone</li>
        <li class="sadLayer sadBorderM medium left_corner" style="opacity: 1;">Medium Zone</li>
        <li class="sadLayer sadBorderH high left_corner" style="opacity: 1;">Extreme Zone</li>
      </ul>

      <!-- Calm -->
      <ul id="calmCorner" v-else-if="showMap.index === 4">
        <li class="calmLayer calmL low right_corner" style="opacity: 1;">Low Zone</li>
        <li class="calmLayer calmM medium right_corner" style="opacity: 1;">Medium Zone</li>
        <li class="calmLayer calmH high right_corner" style="opacity: 1;">Extreme Zone</li>
      </ul>
    </div>
  </div>

  <!-- Song Info On The Map -->
  <SongData :emitter="emitterObj" />

  <!-- Instructions -->
  <transition name="fade">
    <Instructions :emitter="emitterObj" v-if="isInstructionsShown" />
  </transition>

  <!-- Diary -->
  <transition name="fade">
    <Diary :emitter="emitterObj" :diary="diary" v-if="diary.isShown" />
  </transition>

  <!-- Map Zoom -->
  <transition name="fade" v-if="isMobile && isZoomable">
    <div id="map_zoom_btns">
      <div class="zoom_btn" id="zoomIn" @click="mapZooming(5)">+</div>
      <div class="zoom_btn" id="zoomOut" @click="mapZooming(-5)">-</div>
    </div>
  </transition>

  <!-- Button to Enter AR mode -->
  <transition name="fade">
    <div id="button_AR" @click="enterARMode">
      <img src="@/assets/icons/ar.png"/>
    </div>
  </transition>
</template>

<script>
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */

import {
  onMounted, reactive, ref, watch,
} from 'vue';

import p5 from 'p5';
// import io from 'socket.io-client';

// Utilities
import mapRegions from '@/components/Utils/p5/mapRegions';
import { createBGStars, drawGalaxyBG } from '@/components/Utils/p5/galaxyVisualisation';
import {
  createMap, drawMap, posOnMap, mapConstraintVisualisation,
} from '@/components/Utils/p5/emotionMapVisualisation';
import { songDots, drawSongDots, checkSongDotsSize } from '@/components/Utils/p5/songVisualisation';
// import { createNewNeighbours, createHistoricalNeighbours, drawNeighbours } from '@/components/Utils/p5/neighboursVisualisation';

import {
  indicesToMood, moodToIndices,
  coordinatesToIndices, indicestoCoordinates, zoom,
  VECTORS, updateVectors, storeVectors, checkVectorsArrayLength,
} from '@/components/Utils/logic/algorithm';

// Logic
import hashURL from '@/components/Utils/logic/hashURL';

// DOM
import changeMap from '@/components/Utils/dom/changeMap';

import {
  handlingSongsData, removeATempPlaylist,
  showUserPlaylist, playSong, findSongViaID,
  // updateMapValues,
} from '@/handlers/spotify';

// Vue Components
import SongData from '@/components/Reusable/SongData.vue';

import Instructions from '@/components/Common/Instructions.vue';

import Diary from '@/components/Common/Diary.vue';

export default {
  name: 'SketchP5',
  props: {
    personalisationSettings: {
      type: Object,
    },
    emitter: {
      type: Object,
    },
    mobile: {
      type: Boolean,
    },
  },
  components: {
    SongData,
    Instructions,
    Diary,
  },
  setup(props) {
    // Properties on The Map
    const mapProperties = reactive({
      i: 0,
      j: 0,
      name: 'Regions on The Map',
      status: true,
      usePlayerUntraditionally: {
        showPlayer: false,
        elements: null,
        offset: -1,
      },
    });

    // triggering event to open the map
    const showMap = reactive({
      index: 0,
    });

    // Draggable Location on The Emotion Map
    // Set Default to True, because the welcoming screen is the Homepage
    // const isDraggable = ref(true);

    // When mouseReleased event is Triggered, The System Searches for Song
    const isClickable = ref(true);

    // Allow User To Choose Their Locations on The Map Without Acc Opening It
    // And Only Via Search
    const isSearched = ref(false);

    // Get User Settings
    const userSettingsData = ref([]);

    // PROPS
    const emitterObj = ref(props.emitter);
    const isMobile = ref(props.mobile);

    // DOM
    const angryBtn = ref(null);
    const happyBtn = ref(null);
    const sadBtn = ref(null);
    const calmBtn = ref(null);

    // Diary-related vaiables
    const diary = reactive({
      isShown: false,
      title: 'No Title',
      content: 'No Content',
    });

    // Keep Track of Mouse Positions for Map Panning
    const prevMousePos = reactive({
      x: NaN,
      y: NaN,
      touchPos: {
        x: NaN,
        y: NaN,
      },
    });

    // To Track Mouse Click Event Inbound or Outbound
    const clickOutBound = ref(false);
    // Check If The Map is Pan-able & Zoomable Based on The Outbound Variable
    const isMapPannable = ref(false);
    const isZoomable = ref(false);
    const mapWasPanned = ref(false);

    // Keep Track of Zoom Times (can be negative, to apply the same zoom value to newly created song dots)
    const zoomVal = ref(0);
    const panningVal = ref({
      x: 0,
      y: 0,
    });

    // Delay Time To Display The Instruction Board
    const isInstructionsShown = ref(false);
    // setTimeout for deplaying the instruction to be displayed
    setTimeout(() => {
      const allowInstructionDisplayed = (hashURL(window.location.href, 2) === 'true');
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
      if (num === 1) isClickable.value = true;
      else isClickable.value = false;
    });

    // Listen on the 'instructions' event
    emitterObj.value.on('instructions', (isFinished) => {
      if (isFinished) isInstructionsShown.value = false;
    });

    // listen to click event from the dom elements
    function instantiateMap(num) {
      showMap.index = changeMap(num, showMap.index, angryBtn.value, happyBtn.value, sadBtn.value, calmBtn.value);
      // If The Used Device is Mobile / Tablet and The User Has Their Spotify Playlist Plotted On The Map Already
      if (checkSongDotsSize() > 0 && isMobile.value) {
        // Allow Them To Use The Zoom Feature
        isZoomable.value = true;
      }
    }

    const sketch = (p) => {
      p5Obj = p;
      // disables FES
      // eslint-disable-next-line no-param-reassign
      p.disableFriendlyErrors = true;

      // let history = [];

      const galaxy = [];

      const chosenPoints = [];

      const stars = Array(160);

      let isClicked = false;

      // let socket = null;

      // in one machine, only two types of data emit from this socket connection
      // 1: HISTORICAL DATA (when first open the app)
      // 2: NEW DATA (when other users choose a coordinates closely to others)
      // function userDataEmit(curentData) {
      //   // check if it is the first HISTORICAL data emit
      //   // because a HISTORICAL data emit is in a form of an array (not undefined)
      //   // this condition statement is to store the historical data to a global variable
      //   if (curentData.length !== undefined) {
      //     // check if a user is not the first connection to the system
      //     // because first users don't need historical data
      //     if (curentData.length !== 0) {
      //       // shallow copy the data and assign it to a global array
      //       history = [...curentData];
      //     }

      //   // check if it is a current event
      //   } else {
      //     // receive the NEW data broadcasted by OTHER USERS
      //     // and push it to neighbours array
      //     createNewNeighbours(curentData, chosenPoints, width, height);
      //   }
      // }

      // function getSocket() {
      //   // handling production and development mode
      //   const PRODUCTION = process.env.NODE_ENV;

      //   const URL = (PRODUCTION === 'production') ? '' : 'http://localhost:5000';
      //   socket = io.connect(URL);

      //   socket.on('connect', () => {
      //     console.log('Connect to SocketIO successfully');
      //   });

      //   socket.on('click', userDataEmit);

      //   socket.on('error', (err) => {
      //     console.log(err);
      //   });
      // }

      function locationChosen(i, j, how, trackObj, counter, transition) {
        if (counter === 0 || counter === undefined) {
          // Either, a click events (on song dots), or a search is accepted
          if (isSearched.value || isClickable.value) {
            // mapping algorithm to get the valence and arousal values by getting the percentage of an index to the max value
            const { valence, arousal } = indicesToMood(i, j, starDots);

            isClicked = true;
            // Reassign The Array Variable Like This For Repeated Searches, Instead Of Array Push
            chosenPoints[0] = i;
            chosenPoints[1] = j;

            // Refresh The Collected Playlist
            chosenPoints.length !== 0 ? removeATempPlaylist(emitterObj.value) : undefined;

            // send data to the server via socket
            // const data = {
            //   i,
            //   j,
            //   size: starDots[i][j].size,
            // };
            // socket.emit('click', data);

            // Allow Map Zooming
            isZoomable.value = true;

            // manipulate data to be sent to another component file
            mapProperties.status = false;

            // wait for 1.5 sec before closing an event on map positions
            setTimeout(() => { emitMapEvent('close'); }, 1500);

            // HISTORICAL USERS
            // use the history array available globally after collecting it the first time
            // and push it t0 neighbours array as well
            // createHistoricalNeighbours(history, chosenPoints, width, height);

            // get songs data from Spotify via the server
            handlingSongsData(Number(valence.toFixed(3)), Number(arousal.toFixed(3)), how, trackObj, userSettingsData.value, starDots, chosenPoints, width, height, p, emitterObj.value, transition);
          }
        }
      }

      // Listen on the 'diary' event
      // To know when the song collection process finishes,
      // The show the diary
      emitterObj.value.on('show_diary', (data) => {
        // Constrain the diary section to only show once, when the browser that runs the app is sill active
        if (data.how === 'finish' && data.transition !== 'transition') {
          diary.isShown = true;
        }
      });

      // Listen on the 'user_journey' event
      // To know when a diary is created,
      // And exit the section
      emitterObj.value.on('user_journey', () => {
        diary.isShown = false;
      });

      // Listen on the 'plot_via_search' event
      emitterObj.value.on('plot_via_search', (track) => {
        // Switch The Variable To True In Order To Allow Opening Up The Zone of The Accepted
        isSearched.value = true;

        // Get Indices of The Searched Tracks Via Its Mood Values
        const trackMood = moodToIndices(track.valence, track.arousal, starDots);
        // Get Coordinates of The Searched Tracks Via Its Indices
        const trackCoord = indicestoCoordinates(trackMood.i, trackMood.j, width, height);
        mapProperties.status
          ? locationChosen(trackMood.i, trackMood.j, 'search', track, 0)
          : locationChosen(trackMood.i, trackMood.j, 'search', track, 0, 'transition');

        // Get The Regions Values
        let region = null;
        for (let i = 0; i < starDots.length; i += 1) {
          for (let j = 0; j < starDots[i].length; j += 1) {
            region = mapRegions(trackCoord.x, trackCoord.y, width, height);
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
        // getSocket();

        // make bg
        createBGStars(width, height, stars, galaxy, p);

        // make emotion map
        starDots = createMap(width, height, starDots, p);

        // draw map constraints
        // mapConstraintVisualisation(width, height, starDots, p);
      };
      p.draw = () => {
        p.background(10);
        drawGalaxyBG(galaxy, p);

        // draw map constraints
        if (clickOutBound.value && isClickable.value) mapConstraintVisualisation(width, height, starDots, p);

        // Keep Track of Affective Values on The Emotion Map
        const mood = posOnMap(width, height, starDots, p.mouseX, p.mouseY);
        // eslint-disable-next-line valid-typeof
        mapProperties.i = typeof (mood.valence) === 'number' ? (mood.valence).toFixed(3) : NaN;
        mapProperties.j = typeof (mood.arousal) === 'number' ? (mood.arousal).toFixed(3) : NaN;

        // Only Run This Line if User is At The Homepage
        if (isClickable.value) mapProperties.status ? emitMapEvent('open') : undefined;

        if (showMap.index !== 0) {
          // For Performances Reason, Hide All Song Dots And Neighbours
          // All The Map-Related Visualisation Elements Will Always Be Drawn When Homepage is Visited
          if (isClickable.value) {
            // The Emotion Map
            drawMap(isClicked, starDots, chosenPoints, p);

            // Song Dots
            drawSongDots(starDots, chosenPoints, emitterObj.value);

            // Neighbours
            // drawNeighbours(p);
          }
        }
      };

      async function onScreenRegister() {
        // Record the mouse positions
        prevMousePos.x = p.mouseX;
        prevMousePos.y = p.mouseY;

        let track = null;
        let searchType = 'random';
        let counter = 0;

        // Allow Map Panning
        isMapPannable.value = true;
        // only clickable when the emotion map is shown and the screen is showing the homepage
        if (showMap.index !== 0 && isClickable.value && !diary.isShown) {
          const songIndices = {
            i: null,
            j: null,
          };
          const mouseIndices = coordinatesToIndices(p.mouseX, p.mouseY, width, height);
          const mood = posOnMap(width, height, starDots, p.mouseX, p.mouseY);
          if (mapProperties.status && typeof (mood.valence) === 'number' && typeof (mood.arousal) === 'number') {
            // for (let i = 0; i < starDots.length; i += 1) {
            //   for (let j = 0; j < starDots[i].length; j += 1) {
            const region = mapRegions(p.mouseX, p.mouseY, width, height);
            if (userSettingsData.value.length !== 0 && userSettingsData.value[userSettingsData.value.length - 1] !== undefined) {
              if (userSettingsData.value[userSettingsData.value.length - 1].data.last_checked.spotify) {
                for (let k = 0; k < songDots.length; k += 1) {
                  if (songDots[k].onHover()) {
                    track = songDots[k];
                    const { songIndexI, songIndexJ } = songDots[k].findSongOriginalIndices(width, height);
                    songIndices.i = songIndexI;
                    songIndices.j = songIndexJ;
                  }
                }
              } else track = null;
            }
            searchType = track === null ? 'random' : 'search';
            // to prevent click event happens globally for all regions
            // on clickable on one selected region
            if (region === 1 && showMap.index === 1 && !isZoomable.value) {
              locationChosen(mouseIndices.i, mouseIndices.j, searchType, track, counter);
            } else if (region === 2 && showMap.index === 2 && !isZoomable.value) {
              locationChosen(mouseIndices.i, mouseIndices.j, searchType, track, counter);
            } else if (region === 3 && showMap.index === 3 && !isZoomable.value) {
              locationChosen(mouseIndices.i, mouseIndices.j, searchType, track, counter);
            } else if (region === 4 && showMap.index === 4 && !isZoomable.value) {
              locationChosen(mouseIndices.i, mouseIndices.j, searchType, track, counter);

            // FOR MOBILE ONLY
            } else if (isMobile.value && isZoomable.value && !mapWasPanned.value) {
              // In Case of The After Effects of Either or Both The Zoom and Panning Features Applied to The Map
              if (songIndices.i !== null && songIndices.j !== null) {
                // Search For Song Indices instead of Mouse's Based on It's Original Location
                locationChosen(songIndices.i, songIndices.j, searchType, track, counter);
              // If User Doesn't Choose A Song But instead Chooses An Emotion Region
              } else if (zoomVal.value !== 0 || panningVal.value.x !== 0 || panningVal.value.y !== 0) {
                const roi = {
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                };

                let OFFSET_ZOOM = {
                  x: 0,
                  y: 0,
                };
                const ZOOM_STEPS = 5;
                if (zoomVal.value > 0) {
                  for (let z = 0; z < zoomVal.value / ZOOM_STEPS; z += 1) {
                    OFFSET_ZOOM = zoom(ZOOM_STEPS, roi, p.mouseX, p.mouseY, p, true);
                  }
                }

                // Invert The Panning Values
                panningVal.value.x = -panningVal.value.x;
                panningVal.value.y = -panningVal.value.y;

                const generatedX = p.mouseX + OFFSET_ZOOM.x + panningVal.value.x;
                const generatedY = p.mouseY + OFFSET_ZOOM.y + panningVal.value.y;

                const offsetMouseIndices = coordinatesToIndices(generatedX, generatedY, width, height);
                locationChosen(offsetMouseIndices.i, offsetMouseIndices.j, searchType, track, counter);
              } else if (zoomVal.value === 0) {
                locationChosen(mouseIndices.i, mouseIndices.j, searchType, track, counter);
              }
            }

            counter += 1;
            // isChangeable.value = true;
            //   }
            // }
          } else if (!mapProperties.status) {
            for (let k = 0; k < songDots.length; k += 1) {
              // If click on a song dot on the map
              if (songDots[k].onHover()) {
                const offsetTrack = findSongViaID(songDots[k].id);
                if (offsetTrack !== -1) {
                  // const isplaying = await playSong(0, offsetTrack);
                  // console.log(isplaying);
                  await playSong(0, offsetTrack);
                  // If a Song is Chosen on The Map
                  // Remove The Player That Was Shown Untraditionally By Removing Songs That Was Fed To It From The Records section
                  mapProperties.usePlayerUntraditionally.showPlayer = true;
                  emitterObj.value.emit('map', mapProperties);
                } else {
                  track = songDots[k];
                  searchType = track === null ? 'random' : 'search';
                  const { songIndexI, songIndexJ } = songDots[k].findSongOriginalIndices(width, height);
                  locationChosen(songIndexI, songIndexJ, searchType, track, counter, 'transition');
                  counter += 1;
                }
                break;
              }
            }
          } else if (typeof (mood.valence) !== 'number' && typeof (mood.arousal) !== 'number') {
            // Restrict Map Panning
            isMapPannable.value = false;
            // Show The Map Constraints Very Briefly
            setTimeout(() => {
              clickOutBound.value = true;
            }, 100);
            setTimeout(() => {
              clickOutBound.value = false;
            }, 1000);
          }
        }

        mapWasPanned.value = false;
      }

      // Mouse Distance
      function calculateMouseVectorDistance(px, py, cx, cy) {
        // if the sign is -, mouse moving to the left and likewise
        const dx = cx - px;
        const dy = cy - py;
        return { dx, dy };
      }

      p.mousePressed = () => {
        if (!isMobile.value) {
          onScreenRegister();
        }
      };

      p.touchEnded = () => {
        if (isMobile.value && isClickable.value) {
          if (mapWasPanned.value) {
            // Change The Chosen Point positions too
            // to Update The Zone
            const { dx, dy } = calculateMouseVectorDistance(prevMousePos.touchPos.x, prevMousePos.touchPos.y, p.mouseX, p.mouseY);
            panningVal.value.x = dx;
            panningVal.value.y = dy;

            // Only Store 2 Vectors
            // DO NOT USE VUE REF OBJECT AS A NORMAL JAVASCRIPT VARIABLE BECAUSE IT WILL MESS UP ITS REACTIVITY
            storeVectors(panningVal.value.x, panningVal.value.y);
            // Check The Length of The VECTORS variable
            if (checkVectorsArrayLength() === 2) {
              const { newDX, newDY } = updateVectors(VECTORS[0], VECTORS[1]);
              panningVal.value.x = newDX;
              panningVal.value.y = newDY;
              storeVectors(panningVal.value.x, panningVal.value.y);
            }
            onScreenRegister();
            // updateMapValues(zoomVal.value, panningVal.value.x, panningVal.value.y);
          } else if (!mapWasPanned.value) {
            onScreenRegister();
            if (!mapProperties.status) {
              for (let i = 0; i < songDots.length; i += 1) {
                songDots[i].reset();
              }
            }
            zoomVal.value = 0;
            panningVal.value.x = 0;
            panningVal.value.y = 0;
          }
        }
      };

      p.touchStarted = () => {
        // Allow Map Panning
        isMapPannable.value = true;
        // Record the mouse positions
        prevMousePos.x = p.mouseX;
        prevMousePos.y = p.mouseY;

        if (showMap.index !== 0) {
          prevMousePos.touchPos.x = p.mouseX;
          prevMousePos.touchPos.y = p.mouseY;
        }
      };

      // MAP PANNING
      p.touchMoved = (e) => {
        if (isMobile.value) {
          mapWasPanned.value = true;
          // If User is at The Homepage
          // If There Are Some Song Dots on The Map
          // If The Diary Section is not Displayed
          // If The Click Position is Inbound
          // If The Used Device is Mobiile
          // Then, The Map Is Pan-able
          if (isClickable.value && songDots.length > 0 && !diary.isShown && isMapPannable.value) {
            for (let i = 0; i < songDots.length; i += 1) {
              // Calculate the distance between the previous and the latest touch positions
              const { dx, dy } = e.touches.length === 1 ? calculateMouseVectorDistance(prevMousePos.x, prevMousePos.y, p.mouseX, p.mouseY) : undefined;
              songDots[i].panning(dx, dy);
            }

            // Update the mouse positions
            prevMousePos.x = p.mouseX;
            prevMousePos.y = p.mouseY;
          }
        }
      };

      // CURRENTLY NOT FULLY IMPLEMENTED
      // p.mouseWheel = (event) => {
      //   if (isClickable.value) {
      //     for (let i = 0; i < songDots.length; i += 1) {
      //       if (i !== 0) {
      //         // if (songDots[i].onHover()) songDots[i].zoom(event.delta / 100, p.mouseX, p.mouseY, songDots[i - 1]);
      //         songDots[i].zoom(event.delta / 100, p.mouseX, p.mouseY);
      //       }
      //     }
      //   }
      // };

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

    // MAP ZOOMING
    const zoomLevel = {
      min: 0,
      max: 20,
    };
    function mapZooming(zoomFactor) {
      if (isClickable.value) {
        zoomVal.value += zoomFactor;
        if (zoomVal.value >= zoomLevel.min && zoomVal.value <= zoomLevel.max) {
          // For The Next Generations of Song Dots
          // updateMapValues(zoomVal.value, panningVal.value.x, panningVal.value.y);
          // console.log(event.delta, zoomFactor);
          for (let i = 0; i < songDots.length; i += 1) {
            songDots[i].zoom(zoomFactor, zoomVal.value);
          }
        } else zoomVal.value -= zoomFactor;
      }
    }

    // AR MODE
    function enterARMode() {
      // Subscribe to the 'ar' event
      emitterObj.value.emit('ar', true);
    }

    watch(props.personalisationSettings, (data) => {
      data.forEach((datum, index) => {
        if (index !== 0 && datum.message !== 'no personalised data') {
          datum.forEach((d) => {
            searchUserPersonalisedPlaylist(d);
          });
        } else if (index === 0) {
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
      showMap,
      diary,
      mapZooming,
      enterARMode,
      isZoomable,
      isMobile,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_sketch';
@import '@/sass/Unique/_map_cover';
</style>
