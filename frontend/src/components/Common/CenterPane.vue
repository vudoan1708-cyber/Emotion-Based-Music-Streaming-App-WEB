<template>
  <div v-if="number !== 1" id="center_pane">
    <!-- Search -->
    <Search v-if="number === 2" :emitter="emitterObj" />

    <!-- Records -->
    <Records v-else-if="number === 3" />

    <!-- Portfolio -->
    <Portfolio v-else :emitter="emitterObj" />

    <!-- Search Result Board -->
    <div v-if="number === 2 && searchResults.length !== 0" id="results">
      <div v-for="searchResult in searchResults" :key="searchResult.id"  class="result_details"
        @click="plotTrackOnTheMap(searchResult)">
        <ul>
          <li><img :src="searchResult.album_imgs.url" /></li>
          <li id="track_title"><h3>{{ searchResult.title }}</h3></li>
          <li id="artist_name">{{ searchResult.artist_names }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

import Search from '@/components/Common/Search.vue';
import Portfolio from '@/components/Common/Portfolio.vue';
import Records from '@/components/Common/Records.vue';

export default {
  name: 'CenterPane',
  props: {
    emitter: {
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

    // Number to Trigger The Display of The Center Pane, By Default 0: Homepage
    const number = ref(1);

    // Array to Hold Search Results
    const searchResults = ref([]);

    // Listen to 'search' event
    emitterObj.value.on('search', (results) => {
      // Shallow Copy The Param and Reassign it To The searchResults Array
      searchResults.value = results !== null ? [...results] : [];
    });

    // Listen to 'nav' event
    emitterObj.value.on('nav', (num) => {
      number.value = num;

      // Handle Cases of Navigating Away From The Search Area
      if (number.value !== 2) searchResults.value = [];
    });

    function plotTrackOnTheMap(track) {
      emitterObj.value.emit('plot_via_search', track);
    }

    return {
      emitterObj,
      number,
      searchResults,
      plotTrackOnTheMap,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_center_pane';
</style>
