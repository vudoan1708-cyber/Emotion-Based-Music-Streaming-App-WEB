<template>
  <div id="center_pane">
    <!-- Search -->
    <Search />

    <!-- Records -->
    <div id="records_area"></div>

    <!-- Portfolio -->
    <div id="portfolio_area"></div>
  </div>
</template>

<script>
import Search from '@/components/Common/Search.vue';

export default {
  name: 'CenterPane',
  components: {
    Search,
  },
};
</script>

<style scoped lang="scss">

</style>
