<template>
  <div ref="boardRef" id="board">

    <!-- Display User Detail -->
    <div id="closeBtn" @click="closeSettings"><h3>X</h3></div>
    <ul id="user_detail">
      <li id="name">
        <h4 class="content">Display Name</h4>
        <p class="content">{{ userDetail.name }}</p>
      </li>
      <li id="id">
        <h4 class="content">User ID</h4>
        <p class="content">{{ userDetail.id }}</p>
      </li>
      <li id="location">
        <h4 class="content">Location</h4>
        <p class="content">{{ userDetail.location }}</p>
      </li>
      <li id="email">
        <h4 class="content">Email</h4>
        <p class="content">{{ userDetail.email }}</p>
      </li>
    </ul>

    <hr>

    <!-- Personalisation Settings -->
    <div id="settings_section">

      <!-- Checkboxes -->
      <div class="checkboxes">
        <div class="titles">
          <h3>Personalisation</h3>
        </div>
        <div class="check_fields">
          <input type="checkbox" ref="personalisationBtn"
                  @click="toggleCheckbox">
          <span class="checkmark"></span>
        </div>

        <div class="titles" :class="{ blur: isBlur }">
          <h4>Allow Muserfly to Access Your Spotify Playlists</h4>
        </div>
        <div class="check_fields" :class="{ blur: isBlur }">
          <input type="checkbox" ref="spotifyBtn">
          <span class="checkmark"></span>
        </div>
      </div>

      <!-- Inputs Fields -->
      <div id="input_fields" :class="{ blur: isBlur }">
        <p><em>Anything else you would like to manually add in?</em></p>

        <!-- Minimum of Songs -->
        <div class="fields" id="minSongNum">
          <label>Minimum Number of Tracks to Play</label><br />
          <input ref="tracksField" type="number" placeholder="5"
                  :value="numOfTracksValue">
        </div>

        <!-- Artists -->
        <div class="fields" id="artists">
          <label>Artists</label><br />
          <input ref="artistsField" type="text" placeholder="Artist full names"
                  :value="artistsValue">
        </div>

        <!-- Themes -->
        <div class="fields" id="themes">
          <label>Themes</label><br />
          <input ref="themesField" type="text" placeholder="Love, Family,..."
                  :value="themesValue">
        </div>

        <!-- Genres -->
        <div class="fields" id="genres">
          <label>Genres</label><br />
          <select ref="genresField" name="genres" id="genres">
            <option v-for="option in options" :key="option">
              {{ option }}
            </option>
          </select>
          <!-- <input ref="genresField" type="text" placeholder="Rap, Pop,..."
                  :value="genresValue"> -->
        </div>

        <!-- Market -->
        <div class="fields" id="countries">
          <label>Market</label><br />
          <input ref="marketField" type="text" placeholder="Country's ISO-2 code"
                  :value="marketValue">
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div ref="btnPosition" class="btnStyling">
      <div class="decidingBtns" id="save" @click="saveSettings">Save</div>
      <div class="decidingBtns" id="reset" @click="resetSettings">Reset</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-expressions */

import {
  ref, watch,
} from 'vue';

// MongoDB
import { insertData, updateData } from '@/handlers/mongdb';

// JSON
import settingsObj from '@/components/JSON/settingsObj';

export default {
  name: 'SettingBoard',
  props: {
    personalisationSettings: {
      type: Object,
    },
    emitter: {
      type: Object,
    },
  },
  setup(props) {
    const boardRef = ref(null);
    const btnPosition = ref(null);

    // Buttons - related variables
    const personalisationBtn = ref(null);
    const spotifyBtn = ref(null);
    const isBlur = ref(true);

    // Input Fields
    const tracksField = ref(null);
    const artistsField = ref(null);
    const themesField = ref(null);
    const marketField = ref(null);
    const genresField = ref(null);

    const artistsValue = ref('');
    const marketValue = ref('from_token');
    const numOfTracksValue = ref('5');
    const themesValue = ref('');

    // Options
    const options = ref(['', 'Acoustic', 'Alt-Rock', 'Anime', 'Classical / Instrumental', 'EDM', 'Hip Hop', 'K-pop', 'Metal', 'Pop', 'Rock-n-roll', 'Soundtracks']);

    // Save Personalised Settings
    const personalisedData = ref(null);

    // Keep Track of A Button Previous State Before Toggling Checkboxes Are Performed
    const btnSavedStates = ref({});

    // User Detail on the board
    const userDetail = ref({});

    // Data Obj to POST to the MongoDB database
    const dataObj = ref({});
    const dataID = ref('');

    function toggleBlurSettings() {
      const { selectedIndex } = genresField.value;

      personalisationBtn.value.checked === true
        ? isBlur.value = false
        : (isBlur.value = true, spotifyBtn.value.checked = false,
        /* reset the input fields */
        artistsValue.value = '',
        marketValue.value = 'from_token',
        numOfTracksValue.value = '5',
        themesValue.value = '',
        genresField.value.options[selectedIndex].text = '');
    }

    // Close The Settings Board
    function closeSettings() {
      boardRef.value.style.display = 'none';

      // Reset Buttons' State Back to The Original
      personalisationBtn.value.checked = btnSavedStates.value.muserfly;
      spotifyBtn.value.checked = btnSavedStates.value.spotify;

      toggleBlurSettings();
    }

    async function saveSettings() {
      boardRef.value.style.display = 'none';
      // Update data obj to be sent to the database
      const { selectedIndex } = genresField.value;
      dataObj.value = settingsObj(userDetail,
        tracksField.value.value, artistsField.value.value,
        themesField.value.value, marketField.value.value,
        genresField.value.options[selectedIndex].text,
        personalisationBtn.value.checked, spotifyBtn.value.checked);

      // Insert data to MongDB Here
      props.personalisationSettings.length === 0
        ? await insertData(dataObj.value, 0)
        : await updateData(dataID.value, dataObj.value, 0);

      // Refresh the entire document
      document.location.reload();
    }

    function resetSettings() {
      // Reset All The Text Fields
    }

    // Toggle Checkbox
    function toggleCheckbox() {
      // Check if the checkbox is checked
      toggleBlurSettings();
    }

    function defaultPersonalisedValues(artists, market, numOfTracks, themes, genre) {
      artistsValue.value = artists !== '' ? artists : artistsValue.value;
      marketValue.value = market !== '' ? market : 'from_market';
      numOfTracksValue.value = numOfTracks !== 0 ? numOfTracks : 5;
      themesValue.value = themes !== '' ? themes : themesValue.value;

      options.value.forEach((option) => {
        if (genre === option) {
          genresField.value.value = option;
        }
      });
    }

    props.emitter.on('toggle_settings', (data) => {
      boardRef.value.style.display = 'block';

      userDetail.value.id = data.user.id;
      userDetail.value.name = data.user.name;
      userDetail.value.location = data.user.location;
      userDetail.value.email = data.user.email;

      if (personalisedData.value !== null) {
        personalisedData.value.forEach((datum, i) => {
          // Get The Checkboxes Latest Settings
          if (i === 0) {
            // Check for The Correct User
            if (datum.data.user.id === userDetail.value.id) {
              const { muserfly, spotify } = datum.data.last_checked;
              personalisationBtn.value.checked = muserfly;
              spotifyBtn.value.checked = spotify;

              // Update dataID
              // eslint-disable-next-line no-underscore-dangle
              dataID.value = datum._id;

              // Replace Default Settings With The Data
              const {
                artists, market, numOfTracks, themes, genre,
              } = datum.data.user.personalisation;
              defaultPersonalisedValues(artists, market, numOfTracks, themes, genre);
            }
          }
        });
      }

      // Saved A Record of A Change in Buttons' State
      btnSavedStates.value = {
        muserfly: personalisationBtn.value.checked,
        spotify: spotifyBtn.value.checked,
      };

      toggleBlurSettings();
    });

    // watch constantly any updates comming from the parent components
    // if this was put in onMounted, data would flowed too slow to get there in time
    watch(props.personalisationSettings, (data) => {
      personalisedData.value = data;
    });

    return {
      boardRef,
      userDetail,
      closeSettings,
      btnPosition,
      saveSettings,
      resetSettings,
      personalisationBtn,
      spotifyBtn,
      isBlur,
      toggleCheckbox,
      numOfTracksValue,
      artistsValue,
      themesValue,
      marketValue,

      tracksField,
      artistsField,
      themesField,
      marketField,
      genresField,
      options,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_settings_board';
</style>
