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

      <!-- Diary Display -->
      <div id="story" v-if="diary.collapsible === 1">
        <!-- Update Button -->
        <div class="update_btn" v-if="!diary.updateContent || !diary.updateTitle" @click="updateDiary('update')">
          <img src="@/assets/pen.png" />
        </div>
        <!-- Accept Button -->
        <div class="update_btn" v-else @click="updateDiary('acceptChanges')">
          <img src="@/assets/okay.png" />
        </div>

        <div id="diary_wrapper">
          <div id="story_title">
            <h2 v-if="!diary.updateTitle">{{ diary.title }}</h2>
            <!-- Update Title -->
            <div v-else class="diary_update" id="title_update">
              <textarea class="input_fields" id="title" name="diary" v-model="diary.title" ></textarea>
            </div>
          </div>

          <!-- TODO: Update Content In The Diary -->

          <div id="story_content">
            <p  v-if="!diary.updateContent">{{ diary.content }}</p>

            <!-- Update Content -->
            <div v-else class="diary_update" id="content_update">
              <textarea class="input_fields" id="content" name="diary" v-model="diary.content" ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Collapse Button -->
      <div id="collapse_btn" style="left: 50%; transform: translate(-50%, -50%);" ref="collapsibleRef" @click="collapseStoryWindow">
        <h2 v-if="diary.collapsible === 1">&#8883;</h2>
        <h2 v-else>&#8882;</h2>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reactive, ref, toRefs, watch,
} from 'vue';

// Spotify
// import { playSong, checkDuplicates, findSongViaID } from '@/handlers/spotify';
import { playSong } from '@/handlers/spotify';

// MongoDB
import { updateData } from '@/handlers/mongdb';

// JSON
import userJourneyObj from '@/components/JSON/userJourneyObj';

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
    const {
      which, journey, colour, databaseID,
    } = toRefs(props.recordDetails);
    // DOM Ref
    const collapsibleRef = ref(null);

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

    // Diary Story Display variables
    const diary = reactive({
      collapsible: 1,
      title: journey.value.user.diary.title,
      content: journey.value.user.diary.content,
      oldTitle: journey.value.user.diary.title,
      oldContent: journey.value.user.diary.content,
      updateTitle: false,
      updateContent: false,
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

    // Close Record Detail Window
    function closeRecordDetailWindow() {
      if (diary.updateTitle && diary.updateContent) {
        // Exit out of the update area via this way will reset the editted content
        diary.title = diary.oldTitle;
        diary.content = diary.oldContent;
      }
      props.emitter.emit('record_detail_window', false);
    }

    // Collapse The Story Window
    function collapseStoryWindow() {
      diary.collapsible = -diary.collapsible;

      if (diary.collapsible === 1) {
        // Push The Button back to the left
        collapsibleRef.value.style.right = '';
        collapsibleRef.value.style.left = '50%';
        collapsibleRef.value.style.transform = 'translate(-50%, -50%)';
      } else {
        // Push The Button back to the right
        collapsibleRef.value.style.right = 0;
        collapsibleRef.value.style.left = '';
        collapsibleRef.value.style.transform = 'translate(0, -50%)';
      }

      if (diary.updateTitle && diary.updateContent) {
        // Reset the update area
        diary.updateContent = false;
        diary.updateTitle = false;

        // Exit out of the update area via this way will reset the editted content
        diary.title = diary.oldTitle;
        diary.content = diary.oldContent;
      }
    }

    // Update Diary
    async function updateDiary(action) {
      if (action === 'update') {
        diary.updateTitle = true;
        diary.updateContent = true;
      } else if (action === 'acceptChanges') {
        diary.updateTitle = false;
        diary.updateContent = false;

        const dataObj = userJourneyObj(journey.value.user.id,
          journey.value.user.position.x, journey.value.user.position.y,
          journey.value.user.indices.i, journey.value.user.indices.j,
          diary.title, diary.content,
          journey.value.songs.titles, journey.value.songs.artists,
          journey.value.songs.mood_scores.valence,
          journey.value.songs.mood_scores.arousal,
          journey.value.songs.spotify.uris,
          journey.value.songs.spotify.img_urls,
          journey.value.date, journey.value.time);

        // Update user journey database
        await updateData(databaseID.value, dataObj, 1);
        const emittedObj = {
          data: {
            data: dataObj,
            _id: databaseID.value,
          },
          index: which.value,
          status: 'updateDiary',
        };
        props.emitter.emit('user_journey', emittedObj);
      }
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

      let offset = isActive.value + start.value;
      // const isDuplicate = checkDuplicates(songDot.uris[offset], songDot.uris);

      // if (isDuplicate) offset = findSongViaID(songDot.uris[offset], songDot.uris);
      for (let i = songDot.uris.length - 1; i >= 0; i -= 1) {
        // If there is any duplicate songs
        // The system will play the first song it finds matched, BACKWARDS
        if (songDot.uris[i] === songDot.uris[offset]) {
          offset = i;
          break;
        }
      }
      await playSong(0, offset, songDot.uris);
    }

    watch(() => [which, journey], ([key, d]) => {
      which.value = key;
      journey.value = d;
    });

    watch(() => [diary.title, diary.content], ([t, c]) => {
      diary.title = t;
      diary.content = c;
    });

    return {
      canvas,
      margin,
      journey,
      colour,
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
      diary,
      collapseStoryWindow,
      collapsibleRef,
      updateDiary,
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

    #collapse_btn {
      position: absolute;
      top: 50%;
      background-color: rgba(12, 12, 12, 0.95);
      padding: 20px;
      border: 1px solid rgb(184, 184, 184);
      cursor: pointer;
      transition: .2s all;

      &:hover {
        border: 5px solid rgb(173, 173, 173);
        background-color: rgba(0, 0, 0, 0.95);
      }
    }

    #story {
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 100%;
      background-color: rgba(12, 12, 12, 0.95);
      padding: 20px;

      .update_btn {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10%;
        background-color: rgb(160, 160, 160);
        padding: 5px;
        border-radius: 10px;
        cursor: pointer;
        transition: .2s all;

        img {
          width: 100%;
          filter: invert(0);
        }

        &:hover {
          background-color: rgb(0, 0, 0);

          img {
            filter: invert(100%);
          }
        }
      }

      #diary_wrapper {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        #story_title,
        #story_content {
          margin: 10px;
          padding: 10px;
          color: rgb(199, 199, 199);

          .diary_update {
            position: relative;
            width: 100%;

            textarea {
              width: 100%;
              font-weight: 900;
              border-radius: 5px;
              outline: none;
              padding: 5px 20px;
              word-wrap: break-word;
            }
          }
        }
      }
    }
  }
}
</style>
