<template>
  <div id="home">
    <AR v-if="ARMode" />
    <SketchP5 v-if="!ARMode" :personalisationSettings="personalisationSettings"
              :emitter="emitter" :mobile="mobile" />
    <TopPane v-if="!ARMode" :mobile="mobile" />
    <LeftPane :emitter="emitter" :mobile="mobile" />
    <BottomPane :personalisationSettings="personalisationSettings"
                :emitter="emitter" :mobile="mobile" />
    <RightPane :personalisationSettings="personalisationSettings"
              :emitter="emitter" :mobile="mobile" />
    <CenterPane :userJourney="userJourney" :emitter="emitter" />
  </div>
</template>

<script>
import { ref, onBeforeMount, getCurrentInstance } from 'vue';

// Common Components
import AR from '@/components/Sketches/AR.vue';
import SketchP5 from '@/components/Sketches/SketchP5.vue';
import TopPane from '@/components/Common/TopPane.vue';
import BottomPane from '@/components/Common/BottomPane.vue';
import LeftPane from '@/components/Common/LeftPane.vue';
import RightPane from '@/components/Common/RightPane.vue';
import CenterPane from '@/components/Common/CenterPane.vue';

// Handlers
import { getUserProfile, getUserPersonalisation } from '@/handlers/spotify';
import { insertData, getAllData } from '@/handlers/mongdb';

// JSON
import settingsObj from '@/components/JSON/settingsObj';

// Logic
import hashURL from '@/components/Utils/logic/hashURL';
import isMobile from '@/components/Utils/logic/mobile';

export default {
  name: 'Home',
  components: {
    AR,
    SketchP5,
    TopPane,
    BottomPane,
    LeftPane,
    RightPane,
    CenterPane,
  },
  setup() {
    /* eslint-disable max-len */
    // instantiate the app's current instance to get global properties
    // registered in the main.js file
    const app = getCurrentInstance();
    const emitter = app.appContext.config.globalProperties.$emitter;

    // Mobile Detection
    const mobile = isMobile();

    const personalisationSettings = ref([]);
    const prevURL = ref('');

    // User Journey Data
    const userJourney = ref([]);

    // Invent User Detail if there is none for new user
    const userDetail = ref({});

    const ARMode = ref(false);

    // Listen on the 'ar' event to enter the AR mode
    emitter.on('ar', (isToggled) => {
      ARMode.value = isToggled;
    });

    // Listen on the 'user_journey' event
    // Because Center Pane or Other Children Component Cannot Receive Any Data
    // Unless They Are Available
    emitter.on('user_journey', async (journey) => {
      const journeyData = journey.data;
      // Check For New User (Empty userJourney Object)
      if (userJourney.value.length > 0) {
        // After inserting data to database,
        // the system will updates any song which was left out from the collection
        if (journey.status === 'updateSong') {
          // eslint-disable-next-line max-len
          // Check for duplicate diary content
          // eslint-disable-next-line max-len
          if (userJourney.value[journey.index].data.user.diary.title !== journeyData.data.user.diary.title
          && userJourney.value[journey.index].data.user.diary.content !== journeyData.data.user.diary.content) {
            userJourney.value.unshift(journeyData);
          } else {
            for (let i = userJourney.value.length - 1; i >= 0; i -= 1) {
              if (i === journey.index) {
                // Replace the old one to a new one
                userJourney.value.splice(journey.index, 1, journeyData);
                break;
              }
            }
          }
        } else if (journey.status === 'updateDiary') {
          // If a diary content is changed, replace the old one to a new one
          // eslint-disable-next-line max-len
          if (userJourney.value[journey.index].data.user.diary.title !== journeyData.data.user.diary.title
          || userJourney.value[journey.index].data.user.diary.content !== journeyData.data.user.diary.content) {
            for (let i = userJourney.value.length - 1; i >= 0; i -= 1) {
              if (i === journey.index) {
                userJourney.value.splice(journey.index, 1, journeyData);
                break;
              }
            }
          }
        }

      // If New User is Using The App
      } else {
        userJourney.value.unshift(journeyData);
      }
    });

    // Talk to MongDB to GET back data about user listening journey / habit
    // Then, send this down to other children components
    // to visualise and configure variables' default values
    async function getUserJourney() {
      // Clean up the array
      userJourney.value = [];
      // get all user journey database
      const dataResponse = await getAllData(1);
      // get user data from spotify
      const userData = await getUserProfile();
      if (dataResponse.length > 0) {
        // loop backwards to get the latest data
        for (let i = dataResponse.length - 1; i >= 0; i -= 1) {
          // compare and validate user via user's id
          if (dataResponse[i].data.user.id === userData.ID) {
            // Get User Journey Data
            userJourney.value.push(dataResponse[i]);
          }
        }
      }
    }

    async function checkSettings(num) {
      // if 'Allow Spotify to Recommend' button is checked, when click save,
      // it will search for personalisation API from Spotify
      // eslint-disable-next-line no-unused-expressions
      personalisationSettings.value.push(await getUserPersonalisation('tracks', num));

      // always get the latest array for next API search processes
      // eslint-disable-next-line max-len
      const nextURL = personalisationSettings.value[1].message !== 'no personalised data'
        ? personalisationSettings.value[1][personalisationSettings.value.length - 1].nextURL
        : null;

      // Keep Track of URLs
      prevURL.value = prevURL.value !== nextURL ? nextURL : null;

      if (nextURL !== null && nextURL !== undefined
        && prevURL.value !== null && prevURL.value !== undefined) {
        const OFFSET = hashURL(nextURL, 2);
        checkSettings(OFFSET);
      }
    }

    // Add Default Settings Values For New User
    async function addDefaultSettings(userData) {
      userDetail.value.id = userData.ID;
      userDetail.value.name = userData.NAME;
      userDetail.value.location = userData.COUNTRY;
      userDetail.value.email = userData.EMAIL;
      const dataObj = settingsObj(userDetail,
        '5', '',
        '', 'from_token',
        '', false, false);
      await insertData(dataObj, 0);
    }

    // Talk to MongDB to GET back data about personalisation settings
    // Then, send this down to other children components
    // to visualise and configure variables' default values
    async function getPersonalisationData() {
      try {
        // get all data from the personalisation database
        const dataResponse = await getAllData(0);
        // get user data from spotify
        const userData = await getUserProfile();
        if (dataResponse.length > 0) {
          // loop backwards to get the latest data
          for (let i = dataResponse.length - 1; i >= 0; i -= 1) {
            // compare and validate user via user's id
            if (dataResponse[i].data.user.id === userData.ID) {
              // eslint-disable-next-line max-len
              const { muserfly, spotify } = dataResponse[i].data.last_checked;

              // Append Settings Config to the Array
              personalisationSettings.value.push(dataResponse[i]);

              // if it's just the personalisation button is checked
              if (muserfly) {
                // if spotify button is also checked
                if (spotify) checkSettings(0);
              }

              break;
            // If The Usernames Don't Match With What's In The Database (new user)
            } else if (dataResponse[i].data.user.id !== userData.ID) {
              // Check till the end of the loop
              if (i === 0) {
                // Add default settings for them
                addDefaultSettings(userData);
                // Call The Function Again to Retreived The Recently Added Data
                // eslint-disable-next-line no-await-in-loop
                await getPersonalisationData();
                break;
              }
            }
          }

        // If there is no user yet
        } else {
          // The 1st user gets a default settings
          addDefaultSettings(userData);
          // Call The Function Again to Retreived The Recently Added Data
          await getPersonalisationData();
        }
      } catch (err) {
        personalisationSettings.value.push((err));
      }
    }

    onBeforeMount(async () => {
      await getPersonalisationData();
      await getUserJourney();
    });

    return {
      personalisationSettings,
      userJourney,
      emitter,
      mobile,
      ARMode,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_home';
</style>
