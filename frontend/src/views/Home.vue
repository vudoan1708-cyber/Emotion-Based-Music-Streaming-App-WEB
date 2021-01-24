<template>
  <div id="home">
    <SketchP5 :personalisationSettings="personalisationSettings" />
    <TopPane />
    <LeftPane />
    <BottomPane />
    <RightPane :personalisationSettings="personalisationSettings" />
  </div>
</template>

<script>
import { ref, onBeforeMount } from 'vue';

import SketchP5 from '@/components/Sketches/SketchP5.vue';
import TopPane from '@/components/Common/TopPane.vue';
import BottomPane from '@/components/Common/BottomPane.vue';
import LeftPane from '@/components/Common/LeftPane.vue';
import RightPane from '@/components/Common/RightPane.vue';

import { getUserProfile, getUserPersonalisation } from '@/handlers/spotify';
import { getAllData } from '@/handlers/mongdb';

import hashURL from '@/components/Utils/logic/hashURL';

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
    // Then, send this down to other children components
    // to visualise and configure variables' default values
    async function getPersonalisationData() {
      try {
        // get all data from the database
        const dataResponse = await getAllData();
        // get user data from spotify
        const userData = await getUserProfile();

        if (dataResponse.length > 0) {
          // loop backwards to get the latest data
          for (let i = dataResponse.length - 1; i >= 0; i -= 1) {
            // compare and validate user via user's id
            if (dataResponse[i].settings_data.user.id === userData.ID) {
              // eslint-disable-next-line max-len
              const { muserfly, spotify } = dataResponse[i].settings_data.last_checked;

              // if it's just the personalisation button is checked
              if (muserfly) {
                // if spotify button is also checked
                if (spotify) checkSettings(0);
                else personalisationSettings.value.push({ muserfly });
              }

              break;
            }
          }
        }
      } catch (err) {
        personalisationSettings.value.push((err));
      }
    }

    onBeforeMount(async () => {
      await getPersonalisationData();
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
