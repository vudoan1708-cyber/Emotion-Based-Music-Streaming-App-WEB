<template>
  <div id="search_area">
    <!-- Text Input Field -->
    <input v-model="searchInput" type="text" placeholder="Search">
  </div>
</template>

<script>
import { ref, watch } from 'vue';

import { getKeyword, getSongsData } from '@/handlers/spotify';

export default {
  name: 'Search',
  props: {
    emitter: {
      type: Object,
    },
  },
  setup(props) {
    // eslint-disable-next-line no-unused-vars
    const emitterObj = ref(props.emitter);

    // Reference The Text Input
    const searchInput = ref(null);

    async function analyseResults(KEYWORD) {
      // get songs' valence and arousal data
      const audioFeatures = await getSongsData(KEYWORD);
      emitterObj.value.emit('search', audioFeatures);
    }

    watch(searchInput, (text) => {
      // get keyword for search
      const KEYWORD = getKeyword('by_user', text);
      analyseResults(KEYWORD);
    });

    return {
      searchInput,
    };
  },
};
</script>

<style scoped lang="scss">
#search_area {
  position: relative;
  margin: 40px;

  input[type=text] {
    width: 40%;
    font-size: 1.5rem;
    border-radius: 5px;
  }
}
</style>
