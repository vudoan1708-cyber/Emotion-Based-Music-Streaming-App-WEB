<template>
  <div id="search_area">
    <!-- Text Input Field -->
    <input ref="searchInputRef" v-model="searchInput" type="text"
      placeholder="Search Artists, Tracks,...">
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';

import { getKeyword, getSongsData } from '@/handlers/spotify';

import { Romanisation } from '@/components/Utils/logic/string';

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

    // Bind The Text Input
    const searchInput = ref(null);

    // Reference The Text Input
    const searchInputRef = ref(null);

    async function analyseResults(KEYWORD) {
      // get songs' valence and arousal data
      const audioFeatures = await getSongsData(Romanisation(KEYWORD), 'track', '');
      // Emitted Obj
      const emitData = {
        KEYWORD,
        audioFeatures,
      };
      emitterObj.value.emit('search', emitData);
    }

    watch(searchInput, (text) => {
      // get keyword for search
      const KEYWORD = getKeyword('by_user', text);
      analyseResults((KEYWORD));
    });

    onMounted(() => {
      searchInputRef.value.focus();
    });

    return {
      searchInput,
      searchInputRef,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_search';
</style>
