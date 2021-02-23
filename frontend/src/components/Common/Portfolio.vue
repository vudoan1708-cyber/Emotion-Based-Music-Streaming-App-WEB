<template>
  <div id="portfolio_area">
    <!-- Portfolio Board -->
    <div id="portfolio_board">
      <!-- Upload Files -->
      <div id="upload_area">
        <div id="upload_placeholder" @drop="dropFile" @dragenter.prevent @dragover.prevent>
          <h2>{{ uploadTitle }}</h2>
        </div>

        <div id="upload_input">
          <label for="audioFile">Or Choose Your Audio File</label><br />

          <input type="file"
                id="audioFile" name="audioFile"
                accept="audio/*"
                @change="handleFiles($event.target.files)">
        </div>
      </div>

      <!-- Upload Types -->
      <div id="upload_type">
        <div class="upload_options">
          <label class="upload_option_title" for="public">Public</label>
          <input type="radio" id="public" name="upload_type" value="public">
        </div>
        <div class="upload_options">
          <label class="upload_option_title" for="personal">Personal</label>
          <input type="radio" id="personal" name="upload_type" value="personal" checked="checked">
        </div>
      </div>
      <!-- Next -->
      <div @click="proceedUploadStep" :class="{ next_btn_enable: isEnabled }" id="next_btn">
        <h4>NEXT</h4>
      </div>

      <hr />

      <!-- Portfolio Display -->
      <div id="portfolio_display">
        <h2>My Portfolio</h2>
        <div id="portfolio_wrapper">
          <!-- Buttons -->
          <div class="portfolio_btn" >Public</div>
          <div class="portfolio_btn" >Personal</div>
          <!-- Content -->
        </div>

        <!-- Text Placeholder At The Moment -->
        <div id="portfolio_text_placeholder">
          <h2>You Haven't Created Your Portfolio Yet!!!</h2>
          <p>Start creating one by <em>Uploading Your Tracks</em> to the above section</p>
        </div>
      </div>
    </div>
  </div>
  <div v-if="audioUploading" id="audioDownloadProgress">
    <progress id="file" :value="uploadProgress" max="100"> {{ uploadProgress }} </progress>
  </div>

  <!-- Error Handler -->
  <Error v-if="errorMsg !== ''" :emitter="emitterObj" :errorMsg="errorMsg" />
</template>

<script>
import { ref } from 'vue';

import Error from '@/components/Reusable/Error.vue';

export default {
  name: 'Portfolio',
  props: {
    emitter: {
      type: Object,
    },
  },
  components: {
    Error,
  },
  setup(props) {
    // Emitter
    const emitterObj = ref(props.emitter);

    const uploadProgress = ref(0);
    const audioUploading = ref(false);

    // Upload Title
    const uploadTitle = ref('Drag Your Audio File Here');

    // Error
    const errorMsg = ref('');

    // Class Binding
    const isEnabled = ref(false);

    // Listen on the 'close_error'
    emitterObj.value.on('close_error', (isClosed) => {
      errorMsg.value = isClosed ? '' : undefined;
    });

    function uploadFile(file) {
      const reader = new FileReader();

      // Read The Audio File Into Raw Data (base64)
      reader.readAsDataURL(file);

      reader.onloadstart = (data) => {
        uploadProgress.value = (data.loaded * 100) / data.total;
        audioUploading.value = true;
      };

      // On Progress of Uploading
      reader.onprogress = (data) => {
        uploadProgress.value = (data.loaded * 100) / data.total;
      };

      // Preview The Audio
      reader.onloadend = () => {
        // Create HTML Audio Tag
        const audioPreview = document.createElement('audio');
        // Put The base64 Audio Data To Its Src
        audioPreview.src = reader.result;
        // Turn On Autoplay
        audioPreview.autoplay = true;
        // Load The Audio Data In The System
        audioPreview.load();
        // Play
        audioPreview.play();
        setTimeout(() => {
          audioUploading.value = false;
          // Use Regex To Remove File Extensions and Show The Text on The Screen
          uploadTitle.value = `Done uploading ${file.name.replace(/\.[^/.]+$/, '')}`;
          // Enable Next Button
          isEnabled.value = true;
        }, 1000);
      };

      // Error Handling When Uploading
      reader.onerror = () => {
        // eslint-disable-next-line no-alert
        alert(`Failed to read file!\n\n${reader.error}`);
        reader.abort();
      };

      // Upload To The Database
    }

    function errorHandling() {
      errorMsg.value = 'Only Audio File Formats Such As MP3, WAV, OGG, MPEG,... Are Allowed';
    }

    function handleFiles(files) {
      // Loop Through The FileList Object And Execute The Next Function
      [...files].forEach((file) => {
        // eslint-disable-next-line no-unused-expressions
        (file.type === 'audio/mpeg' || file.type === 'audio/wav' || file.type === 'audio/ogg' || file.type === 'audio/x-m4a') ? uploadFile(file) : errorHandling();
      });
    }

    function dropFile(e) {
      e.preventDefault();

      // Get The Data File Transfer
      const { files } = e.dataTransfer;

      handleFiles(files);
    }

    // When Click Next Button
    function proceedUploadStep() {

    }

    return {
      emitterObj,
      dropFile,
      handleFiles,
      audioUploading,
      uploadProgress,
      uploadTitle,
      errorMsg,
      isEnabled,
      proceedUploadStep,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_portfolio';
</style>
