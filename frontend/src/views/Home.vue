<template>
  <div id="home">
    <SketchP5 :personalisationSettings="personalisationSettings"/>
    <TopPane />
    <LeftPane />
    <BottomPane />
    <RightPane :personalisationSettings="personalisationSettings"/>
  </div>
</template>

<script>
import SketchP5 from '@/components/Sketches/SketchP5.vue';
import TopPane from '@/components/Common/TopPane.vue';
import BottomPane from '@/components/Common/BottomPane.vue';
import LeftPane from '@/components/Common/LeftPane.vue';
import RightPane from '@/components/Common/RightPane.vue';

import { getUserPersonalisation } from '@/handlers/spotify';
import hashURL from '@/components/Utils/logic/hashURL';

import { ref, onBeforeMount } from 'vue';

export default {
  name: 'Home',
  components: {
    SketchP5,
    TopPane,
    BottomPane,
    LeftPane,
    RightPane,
  },
  setup() {
    const personalisationSettings = ref([]);

    async function checkSettings(num) {
      // if 'Allow Spotify to Recommend' button is checked, when click save,
      // it will search for personalisation API from Spotify
      // eslint-disable-next-line no-unused-expressions
      personalisationSettings.value.push(await getUserPersonalisation('tracks', num));

      // always get the latest array for next API search processes
      const { nextURL } = personalisationSettings.value[personalisationSettings.value.length - 1];

      if (nextURL !== null) {
        const OFFSET = hashURL(nextURL);
        checkSettings(OFFSET);
      }
    }

    // Talk to MongDB to GET back data about personalisation settings
    // Then, if it is set to true, send this down
    // Otherwise, don't
    async function getPersonalisationData() {
      if ('there is data from database') {
        // Check Settings
        checkSettings(0);
      } else {
        // Do Nothing Here
      }
    }

    onBeforeMount(() => {
      getPersonalisationData();
    });

    return {
      personalisationSettings,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_home';
</style>
