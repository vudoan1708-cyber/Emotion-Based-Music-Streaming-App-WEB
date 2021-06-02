<template>
  <!-- Not Homepage (The Emotion Map), Not The Right Pane Mobile Display
  Nor The Instruction on Mobile -->
  <div v-if="number !== 1 && number !== 5 && number !== 6" id="center_pane">
    <!-- Search -->
    <Search v-if="number === 2" :emitter="emitterObj" />

    <!-- Records -->
    <Records v-else-if="number === 3" :emitter="emitterObj" :userJourney="userJourneyObj" />

    <!-- Portfolio -->
    <Portfolio v-else-if="number === 4" :emitter="emitterObj" />

    <!-- Search Result Board -->
    <section v-if="number === 2 && searchResults.length !== 0" id="results">
      <ul v-for="(searchResult, searchKey) in searchResults" :key="searchKey"
        class="result_details" @click="plotTrackOnTheMap(searchResult)">
        <li><img v-if="searchResult.error === undefined"
          :src="searchResult.album_imgs.url" />
          <!-- Valence & Arousal Values When On Hover -->
          <div class="v-a">
            <div class="track_moods">
              <div v-if="searchResult.error === undefined">
                <b>Valence: {{ searchResult.valence }}</b>
              </div>
              <div v-if="searchResult.error === undefined">
                <b>Arousal: {{ searchResult.arousal }}</b>
              </div>
            </div>
          </div>
        </li>
        <li v-if="searchResult.error === undefined"
          id="track_title"><h3>{{ searchResult.title }}</h3>
        </li>
        <li v-if="searchResult.error === undefined"
          id="artist_name">{{ searchResult.artist_names }}
        </li>
      </ul>
    </section>
    <div v-else-if="number === 2 && searchResults.length === 0 && searchKeywords !== ''"
      id="no_results">
      <h3>No Results Found For "{{ searchKeywords }}"</h3>
    </div>

    <section v-if="number === 2 && searchResults.length !== 0" id="next_back_button">
      <h3 v-if="searchPage > 1" id="back_button" class="center_nav_button"
        @click="navigateThroughPages(-1)">&lt;</h3>
      <h2 class="center_nav_button">{{ searchPage }}</h2>
      <h3 id="next_button" class="center_nav_button"
        @click="navigateThroughPages(1)">&gt;</h3>
    </section>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

import { getSongsData } from '@/handlers/spotify';

import Search from '@/components/Common/Search.vue';
import Portfolio from '@/components/Common/Portfolio.vue';
import Records from '@/components/Common/Records.vue';

export default {
  name: 'CenterPane',
  props: {
    emitter: {
      type: Object,
    },
    userJourney: {
      type: Object,
    },
  },
  components: {
    Search,
    Portfolio,
    Records,
  },
  setup(props) {
    // Emitter
    const emitterObj = ref(props.emitter);
    // User Journey
    const userJourneyObj = ref(props.userJourney);

    // Number to Trigger The Display of The Center Pane, By Default 0: Homepage
    const number = ref(1);

    // Array to Hold Search Results
    const searchResults = ref([]);
    // String to Hold Searched Keyword
    const searchKeywords = ref('');
    // Search Pages
    const searchPage = ref(1);

    // Listen to 'search' event
    emitterObj.value.on('search', (results) => {
      // Shallow Copy The Param and Reassign it To The searchResults Array
      searchResults.value = results.audioFeatures !== null ? [...results.audioFeatures] : [];
      // Reassign The String
      searchKeywords.value = results.KEYWORD;
      searchPage.value = (searchKeywords.value === '' || searchResults.value === [])
        ? 1
        : searchPage.value;
    });

    // Listen to 'nav' event
    emitterObj.value.on('nav', (num) => {
      number.value = num;

      // Handle Cases of Navigating Away From The Search Area
      if (number.value !== 2) {
        // Reset All The Search-Related Variables
        searchResults.value = [];
        searchKeywords.value = '';
        searchPage.value = 1;
      }
    });

    // Triggered on Mouse Click Event
    function plotTrackOnTheMap(track) {
      emitterObj.value.emit('plot_via_search', track);
    }

    async function navigateThroughPages(num) {
      if (searchPage.value > 0) {
        searchPage.value += num;
        const audioFeatures = await getSongsData(searchKeywords.value, 'track', searchPage.value * 10);
        // Emitted Obj
        const emitData = {
          KEYWORD: searchKeywords.value,
          audioFeatures,
        };
        emitterObj.value.emit('search', emitData);
      }
    }

    watch(() => props.userJourney, (data) => {
      userJourneyObj.value = data;
    });

    return {
      emitterObj,
      userJourneyObj,
      number,
      searchResults,
      searchKeywords,
      plotTrackOnTheMap,
      searchPage,
      navigateThroughPages,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_center_pane';
</style>
