<template>
  <div v-if="number !== 1" id="center_pane">
    <!-- Search -->
    <Search v-if="number === 2" :emitter="emitterObj" />

    <!-- Records -->
    <div v-else-if="number === 3" id="records_area"></div>

    <!-- Portfolio -->
    <div v-else id="portfolio_area"></div>

    <!-- Result Board -->
    <div v-if="number === 2 && searchResults.length !== 0" id="results">
      <div v-for="searchResult in searchResults" :key="searchResult.id"  class="result_details">
        <ul>
          <li><img :src="searchResult.album_imgs.url" /></li>
          <li>{{ searchResult.artist_names }}</li>
          <li>{{ searchResult.title }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

import Search from '@/components/Common/Search.vue';

export default {
  name: 'CenterPane',
  props: {
    emitter: {
      type: Object,
    },
  },
  components: {
    Search,
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
    return {
      emitterObj,
      number,
      searchResults,
    };
  },
};
</script>

<style scoped lang="scss">
#center_pane {
  position: absolute;
  top: 0;
  left: 200px;
  width: 67%;
  height: 82%;
  background: rgba(0, 0, 0, 0.84);
  z-index: 4;
  text-align: left;

  #results {
    margin: 40px;
    position: absolute;
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    grid-gap: 10px;
    .result_details {
      li {
        list-style: none;
        width: 75%;
        img {
          width: 100%;
        }
      }
    }
  }
}
</style>
