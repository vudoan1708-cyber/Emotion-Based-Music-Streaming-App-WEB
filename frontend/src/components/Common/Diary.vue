<template>
  <div id="diary_container">
    <div id="diary">
      <form @submit.prevent="saveDiary">
        <section id="diary_header">
          <h2>Today's Diary</h2>
        </section>

        <!-- Title -->
        <section>
          <label>Title</label>
          <input class="input_fields" id="title" name="diary" type="text" v-model="title" />
        </section>

        <!-- Content -->
        <section>
          <label>Content</label>
          <textarea class="input_fields" id="content" name="diary" placeholder="Your Message"
                    rows="10" v-model="content"></textarea>
        </section>

        <!-- Save -->
        <section>
          <input id="save_btn" type="submit" value="Save A New Diary" />
        </section>
      </form>
    </div>

    <!-- Loading -->
    <div id="loading" ref="loadingRef" style="display: none;">
      <div id="icon">
        <img :src="Loading" />
      </div>
      <div id="text">
        <h2>Please Wait!!!</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, toRefs, watch } from 'vue';

// Util
import isEmpty from '@/components/Utils/logic/object';

import { getUserProfile } from '@/handlers/spotify';

// MongoDB
import { getAllData, updateData } from '@/handlers/mongdb';

// JSON
import userJourneyObj from '@/components/JSON/userJourneyObj';

// GIF
import Loading from '@/assets/loading.gif';

export default {
  name: 'Diary',
  props: {
    emitter: {
      type: Object,
    },
    diary: {
      type: Object,
    },
  },
  setup(props) {
    // using `toRefs` to create a Reactive Reference to the `diary` property of props
    const { title, content } = toRefs(props.diary);

    // Ref
    const loadingRef = ref(null);

    const dataID = ref('');

    // Talk to MongDB to GET back data about user listening journey / habit
    // Then, send this down to other children components
    // to visualise and configure variables' default values
    async function getUserJourney() {
      // Data Obj to UPDATE to the MongoDB database
      let dataObj = null;
      // get all user journey database
      const dataResponse = await getAllData(1);
      // get user data from spotify
      const userData = await getUserProfile();
      if (isEmpty(userData)) getUserJourney();
      else if (dataResponse.length > 0) {
        // loop backwards to get the latest data
        for (let i = dataResponse.length - 1; i >= 0; i -= 1) {
          // compare and validate user via user's id
          if (dataResponse[i].data.user.id === userData.ID) {
            // Get The Data ID
            // eslint-disable-next-line no-underscore-dangle
            dataID.value = dataResponse[i]._id;
            dataObj = userJourneyObj(userData.ID,
              dataResponse[i].data.user.position.x, dataResponse[i].data.user.position.y,
              dataResponse[i].data.user.indices.i, dataResponse[i].data.user.indices.j,
              title.value, content.value,
              dataResponse[i].data.songs.titles, dataResponse[i].data.songs.artists,
              dataResponse[i].data.songs.mood_scores.valence,
              dataResponse[i].data.songs.mood_scores.arousal,
              dataResponse[i].data.songs.spotify.uris,
              dataResponse[i].data.songs.spotify.img_urls,
              dataResponse[i].data.date, dataResponse[i].data.time);
            break;
          }
        }
        // Update user journey database
        await updateData(dataID.value, dataObj, 1);

        const emittedObj = {
          data: {
            data: dataObj,
            _id: dataID.value,
          },
          index: 0,
          status: 'updateSong',
        };
        props.emitter.emit('user_journey', emittedObj);
        loadingRef.value.style.display = 'none';
      }
    }

    async function saveDiary() {
      loadingRef.value.style.display = 'block';
      await getUserJourney();
    }

    watch([title, content], ([t, c]) => {
      title.value = t;
      content.value = c;
    });

    return {
      title,
      content,
      saveDiary,
      loadingRef,
      Loading,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/sass/Unique/_diary.scss';
</style>
