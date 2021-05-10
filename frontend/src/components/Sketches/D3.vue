<!-- eslint-disable max-len -->
<template>
  <div id="detail">
    <div class="board" id="info">
      <div id="stacks">
        <h2 id="header">SONGS</h2>
        <div v-if="start > 0" class="btns" @click="changesongInfoDisplay(-3)">
          <img id="prev" src="@/assets/up.png" />
        </div>
        <div id="song_wrapper">
          <h4 v-for="(song, songKey) in songInfoDisplay.titles"
             :key="songKey"
             :class="isActive === songKey ? 'active' : 'songs'"
             @click="replaySong(songKey)">
            {{ song }} - {{ songInfoDisplay.artists[songKey] }}
          </h4>
        </div>
        <div v-if="end < journey.songs.titles.length - 1" class="btns" @click="changesongInfoDisplay(3)">
          <img id="next" src="@/assets/up.png" />
        </div>
      </div>
    </div>

    <div class="board" id="mood">
      <svg :style="{ width: `${canvas.width}%`, height: `${canvas.height}%` }">
        <g>
          <!-- Container -->
          <rect x="0" y="0" :width="`${canvas.width}%`" :height="`${canvas.height}%`" fill="black"></rect>
          <!-- Date -->
          <text :x="`${canvas.width / 2}%`" :y="`${margin.top - 5}%`" fill="white" font-size="2em" text-anchor="middle">
            <tspan :x="`${canvas.width / 2}%`">{{ journey.date }}</tspan>
            <tspan :x="`${canvas.width / 2}%`" dy="1.5em">at {{ journey.time }}</tspan>
          </text>
          <!-- Title -->
          <text :x="`${canvas.width / 2}%`" :y="`${margin.top + 15}%`" fill="rgba(255, 255, 255, .75)"  text-anchor="middle">My Emotion Journey</text>

          <!-- Add X axis -->
          <svg x="0" :y="`${canvas.height - margin.bottom}%`" :style="{ width: `${canvas.width}%`, height: `${canvas.height}%` }">
            <g ref="xAxisRef"></g>
          </svg>

          <!-- Add Y axis -->
          <svg :x="margin.left" y="0" :style="{ width: `${canvas.width}%`, height: `${canvas.height}%` }">
            <g ref="yAxisRef"></g>
          </svg>

          <!-- Add Scatter Plot -->
          <g v-for="(valence, valenceKey) in journey.songs.mood_scores.valence" :key="valenceKey">
            <line v-if="valenceKey !== journey.songs.mood_scores.valence.length - 1"
                  :x1="`${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`"
                  :y1="`${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%`"
                  :x2="`${canvas.width / 2 * journey.songs.mood_scores.valence[valenceKey + 1] + (50 * (journey.songs.mood_scores.valence[valenceKey + 1] * journey.songs.mood_scores.arousal[valenceKey + 1]))}%`"
                  :y2="`${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey + 1] + (50 * (journey.songs.mood_scores.valence[valenceKey + 1] * journey.songs.mood_scores.arousal[valenceKey + 1])))}%`"
                  style="stroke:rgb(255,255,255); stroke-width:2" />
          </g>

          <g v-for="(valence, valenceKey) in journey.songs.mood_scores.valence" :key="valenceKey">
            <g class="dots"
               @mouseover="highlightDot(true, valenceKey)"
               @mouseout="highlightDot(false, -1)">
              <!-- Big White Circle with Opacity based on Actual Values (Visualise The Value) (Act Like Stroke) -->
              <circle
                :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`,
                          cy: `${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%` }"
                :r="30 * (valence)" fill="white" :fill-opacity="(valence + journey.songs.mood_scores.arousal[valenceKey]) / 2" />
              <!-- Biggest Coloured Circle with Opacity based on Actual Values (Visualise The Value) -->
              <circle
                :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`,
                          cy: `${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%` }"
                :r="25 * (valence)" :fill="colour" :fill-opacity="(valence + journey.songs.mood_scores.arousal[valenceKey]) / 2" />
              <!-- Second Biggest Red Circle with Some Opacity (Make Visualisation Look Good) -->
              <circle
                :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`,
                          cy: `${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%` }"
                :r="25 * (valence)" :fill="colour" :fill-opacity="(valence + journey.songs.mood_scores.arousal[valenceKey]) / 4" />
              <!-- Third Biggest Red Circle without Opacity (Make Visualisation Look Good) -->
              <circle
                :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`,
                          cy: `${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%` }"
                :r="15 * (valence)" :fill="colour" />
              <!-- White Circle at The Center -->
              <circle
                :style="{ cx: `${canvas.width / 2 * valence + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey]))}%`,
                          cy: `${canvas.height / 1.25 - (journey.songs.mood_scores.arousal[valenceKey] + (50 * (valence * journey.songs.mood_scores.arousal[valenceKey])))}%` }"
                :r="10 * (valence)" fill="white" />
            </g>

            <g v-if="songDot.which !== -1"
               class="image">
              <image :href="songDot.image[songDot.which].url"
                     :x="`${canvas.width / 2 - margin.bottom / 2}%`"
                     :y="`${canvas.height - margin.bottom}%`"
                     :height="`${margin.bottom}%`"
                     :width="`${margin.bottom}%`" />

              <!-- Song Title and Artist Name -->
              <text :x="`${canvas.width / 2}%`"
                    :y="`${canvas.height - margin.bottom}%`"
                    fill="white"
                    text-anchor="middle">{{ songDot.title[songDot.which] }} - {{ songDot.artist[songDot.which] }}
              </text>
            </g>
          </g>
        </g>
      </svg>

      <!-- Close Button -->
      <div id="close_btn" @click="closeRecordDetailWindow">
        <h2>X</h2>
      </div>

      <div id="story">
        <div id="story_title"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  onBeforeMount,
  reactive, ref, toRefs, watch,
} from 'vue';

// D3
import {
  select, scaleLinear, axisBottom, axisLeft,
} from 'd3';

// Spotify
import { playSong, checkDuplicates, updatePlaylist } from '@/handlers/spotify';

export default {
  name: 'D3',
  props: {
    emitter: {
      type: Object,
    },
    recordDetails: {
      type: Object,
    },
  },
  setup(props) {
    // using `toRefs` to create a Reactive Reference to the `recordDetails` property of props
    const { which, journey, colour } = toRefs(props.recordDetails);
    // DOM Ref
    const xAxisRef = ref(null);
    const yAxisRef = ref(null);

    const start = ref(0);
    const end = ref(3);

    // const zoomValue = ref(1);

    const isActive = ref(false);

    // Song Display
    const songInfoDisplay = reactive({
      artists: journey.value.songs.artists.slice(start.value, end.value),
      // titles: journey.value.songs.titles.slice(start, end),
      titles: journey.value.songs.titles.slice(start.value, end.value),
    });
    const songDot = reactive({
      onHover: false,
      which: -1,
      artist: journey.value.songs.artists,
      title: journey.value.songs.titles,
      valence: journey.value.songs.mood_scores.valence,
      arousal: journey.value.songs.mood_scores.arousal,
      image: journey.value.songs.spotify.img_urls,
      uris: journey.value.songs.spotify.uris,
    });

    // D3
    // Canvas Width and Height
    const canvas = reactive({
      width: 100,
      height: 100,
    });

    const margin = reactive({
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    });

    // X-Axis
    const axes = reactive({
      x: scaleLinear()
        .domain([0, 1])
        .range([0, canvas.width]),
      y: scaleLinear()
        .domain([0, 1])
        .range([0, canvas.height]),
    });

    function createAxes() {
      select(xAxisRef.value).call(axisBottom(axes.x));
      select(yAxisRef.value).call(axisLeft(axes.y));
    }

    // Close Record Detail Window
    function closeRecordDetailWindow() {
      props.emitter.emit('record_detail_window', false);
    }

    // Change Song Display Via Button Clicks
    function changesongInfoDisplay(num) {
      start.value += num;
      end.value += num;

      songInfoDisplay.artists = journey.value.songs.artists.slice(start.value, end.value);
      // songInfoDisplay.titles = journey.value.songs.titles.slice(start.value, end.value);
      songInfoDisplay.titles = journey.value.songs.titles.slice(start.value, end.value);

      isActive.value += num;
    }

    // Visualisation Interactivity
    // Zooming
    // function zoomMap(e) {
    //   zoomValue.value += (e.wheelDelta / 1000);
    //   console.log(zoomValue.value);
    // }

    // Hovering
    function highlightDot(isHovered, num) {
      songDot.onHover = isHovered;
      songDot.which = num;
    }

    // Play Songs
    async function replaySong(num) {
      isActive.value = num;
      songDot.uris.forEach((uri) => {
        const isDuplicate = checkDuplicates(uri, songDot.uris);

        if (isDuplicate) songDot.uris = updatePlaylist(uri, 'remove', songDot.uris);
      });
      await playSong(0, isActive.value + start.value, songDot.uris);
    }

    onBeforeMount(() => {
      createAxes();
    });

    watch(() => [which, journey], ([key, d]) => {
      which.value = key;
      journey.value = d;
    });

    return {
      canvas,
      margin,
      journey,
      colour,
      axes,
      xAxisRef,
      yAxisRef,
      songInfoDisplay,
      changesongInfoDisplay,
      start,
      end,
      // zoomMap,
      // zoomValue,
      songDot,
      highlightDot,
      isActive,
      replaySong,
      closeRecordDetailWindow,
    };
  },
};
</script>

<style lang="scss" scoped>
#detail {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .board {
    display: inline-block;
    position: relative;
    height: 100%;

    image {
      display: block;
      margin: 0 auto;
    }
  }

  #info {
    width: 20%;
    background-color: white;
    color: black;
    text-align: center;

    #stacks {
      margin: 0;
      position: relative;
      top: 50%;
      transform: translateY(-50%);

      .btns {
        position: relative;
        display: inline-block;
        cursor: pointer;
        transition: .2s filter;

        #next {
          transform: scaleY(-1);
        }

        &:hover {
          filter: invert(50%);
        }
      }

      #header {
        margin: 20px;
      }

      #song_wrapper {
        position: relative;
        width: 100%;
        height: 100%;

        .songs {
          margin: 10px;
          padding: 10px;
          cursor: pointer;
          background-color: white;
          transition: .2s background-color;
          &:hover {
            background-color: rgb(221, 221, 221);
          }
        }

        .active {
          margin: 10px;
          padding: 10px;
          cursor: pointer;
          background-color: rgb(65, 109, 230);
        }
      }
    }
  }

  #mood {
    float: right;
    clear: right;
    width: 80%;

    #close_btn {
      position: absolute;
      right: 0;
      top: 0;
      border-radius: 50%;
      border: 5px dashed white;
      background-color: black;
      color: white;
      padding: 10px;
      z-index: 5;
      cursor: pointer;
      transition: .2s all;

      &:hover {
        border: 5px dashed rgb(173, 173, 173);
        color: rgb(173, 173, 173);
      }
    }
  }
}
</style>
