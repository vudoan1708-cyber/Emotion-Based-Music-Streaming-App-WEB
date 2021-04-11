<template>
  <div id="map_key">
    <div id="key_content">
      <!-- Keys -->
      <ul v-if="isShown" id="keys">
        <!-- Your Playlists -->
        <li>
          <img class="key_sections" src="@/assets/Map_YourPlaylists.png" />
          <label class="key_sections" >Your Spotify Playlist</label>
        </li>
        <!-- Other Tracks -->
        <!-- Aggressive -->
        <li>
          <img class="key_sections" src="@/assets/Map_A.png" />
          <label class="key_sections" >Aggressive</label>
        </li>
        <!-- Exciting -->
        <li>
          <img class="key_sections" src="@/assets/Map_E.png" />
          <label class="key_sections" >Exciting</label>
        </li>
        <!-- Sad -->
        <li>
          <img class="key_sections" src="@/assets/Map_S.png" />
          <label class="key_sections" >Sad</label>
        </li>
        <!-- Calm -->
        <li>
          <img class="key_sections" src="@/assets/Map_C.png" />
          <label class="key_sections" >Calm</label>
        </li>
        <!-- Chosen Tracks By Users -->
        <li>
          <img class="key_sections" src="@/assets/Map_Chosen.png" />
          <label class="key_sections" >Chosen by User</label>
        </li>
        <!-- Collected Tracks -->
        <li>
          <img class="key_sections" src="@/assets/Map_CollectedSongDot.png" />
          <label class="key_sections" >Collected Tracks</label>
        </li>
        <!-- Neighbours -->
        <!-- <li>
          <img class="key_sections" src="@/assets/Map_NeighbourDot.png" />
          <label  class="key_sections">Your Neighbours</label>
        </li> -->
      </ul>
    </div>

    <!-- Show/Hide Button -->
    <div @click="isShown = !isShown" ref="toggleKeyBtn" id="toggle_map_key">
      <h3>{{ arrow }}</h3>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';

export default {
  name: 'MapKey',
  setup() {
    const isShown = ref(true);
    const arrow = ref('v');

    // Reference
    const toggleKeyBtn = ref(null);

    function restyleBtn(s) {
      if (s) {
        arrow.value = 'v';
        toggleKeyBtn.value.style.top = 0;
        toggleKeyBtn.value.style.bottom = '';
      } else {
        arrow.value = 'Map Keys';
        toggleKeyBtn.value.style.top = '';
        toggleKeyBtn.value.style.bottom = 0;
      }
    }

    watch(isShown, (s) => {
      restyleBtn(s);
    });

    onMounted(() => {
      restyleBtn(isShown.value);
    });

    return {
      isShown,
      arrow,
      toggleKeyBtn,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_map_key';
</style>
