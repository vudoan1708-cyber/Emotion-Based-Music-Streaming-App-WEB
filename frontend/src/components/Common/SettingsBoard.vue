<template>
  <div ref="boardRef" id="board">

    <!-- Display User Detail -->
    <div id="closeBtn" @click="closeSettings"><h3>X</h3></div>
    <ul id="user_detail">
      <li id="name">
        <h4 class="content">Display Name</h4>
        <p class="content">{{ userDetail.name }}</p>
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
          <h4>Allow Spotify to Recommend</h4>
        </div>
        <div class="check_fields" :class="{ blur: isBlur }">
          <input type="checkbox" ref="spotifyBtn">
          <span class="checkmark"></span>
        </div>
      </div>

      <!-- Inputs Fields -->
      <div id="input_fields" :class="{ blur: isBlur }">
        <p><em>Anything else you would like to manually add in?</em></p>

        <!-- Artists -->
        <div class="fields" id="artists">
          <label>Artists</label><br />
          <input ref="artistsField" type="text" placeholder="Artist full names">
        </div>

        <!-- Themes -->
        <div class="fields" id="themes">
          <label>Themes</label><br />
          <input ref="themesField" type="text" placeholder="Love, Family,...">
        </div>

        <!-- Genres -->
        <div class="fields" id="genres">
          <label>Genres</label><br />
          <input ref="genresField" type="text" placeholder="Rap, Pop,...">
        </div>

        <!-- Countries -->
        <div class="fields" id="countries">
          <label>Countries</label><br />
          <input ref="countriesField" type="text" placeholder="Country's full names">
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
  ref, watch, getCurrentInstance,
} from 'vue';
import { insertData } from '@/handlers/mongdb';

export default {
  name: 'SettingBoard',
  props: {
    personalisationSettings: {
      type: Object,
    },
  },
  setup(props) {
    // instantiate the app's current instance to get global properties
    // registered in the main.js file
    const app = getCurrentInstance();
    const emitter = app.appContext.config.globalProperties.$emitter;

    const boardRef = ref(null);
    const btnPosition = ref(null);

    // Buttons - related variables
    const personalisationBtn = ref(null);
    const spotifyBtn = ref(null);
    const isBlur = ref(true);

    // User Detail on the board
    const userDetail = ref({});

    // Data Obj to POST to the MongoDB database
    const dataObj = ref({});

    // const textFieldInputs = ref([]);

    emitter.on('toggle_settings', (data) => {
      boardRef.value.style.display = 'block';

      userDetail.value.id = data.user.id;
      userDetail.value.name = data.user.name;
      userDetail.value.location = data.user.location;
      userDetail.value.email = data.user.email;
    });

    // Close The Settings Board
    function closeSettings() {
      boardRef.value.style.display = 'none';
    }

    async function saveSettings() {
      // Update data obj to be sent to the database
      dataObj.value = {
        user: {
          id: userDetail.value.id,
          name: userDetail.value.name,
          location: userDetail.value.location,
          email: userDetail.value.email,
        },
        last_checked: {
          muserfly: personalisationBtn.value.checked,
          spotify: spotifyBtn.value.checked,
        },
      };

      // Insert data to MongDB Here
      insertData(dataObj.value);
    }

    function resetSettings() {
      // Reset All The Text Fields
    }

    // Toggle Checkbox
    function toggleCheckbox() {
      // Check if the checkbox is checked
      personalisationBtn.value.checked === true
        ? isBlur.value = false
        : (isBlur.value = true, spotifyBtn.value.checked = false);
    }

    // watch constantly any updates comming from the parent components
    // if this was put in onMounted, data would flowed too slow to get there in time
    watch(props.personalisationSettings, (data) => {
      data.forEach((d) => {
        // if just a muserfly personalisation checkbox was checked
        if (d.muserfly) personalisationBtn.value.checked = true;
        // otherwise, if both were checked
        else if (d.TOKEN) {
          personalisationBtn.value.checked = true;
          spotifyBtn.value.checked = true;
        }
      });
      personalisationBtn.value.checked === true
        ? isBlur.value = false
        : (isBlur.value = true, spotifyBtn.value.checked = false);
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
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_settings';
</style>
