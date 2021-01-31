<template>
  <div id="portfolio_area">
    <!-- Portfolio Board -->
    <div id="portfolio_board">
      <!-- Upload Files -->
      <div id="upload_area">
        <div id="upload_placeholder" @drop="dropFile" @dragenter.prevent @dragover.prevent>
          <h2>Drag Your File Here</h2>
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

      <!-- Portfolio Display -->
      <div id="portfolio_display">
        <div id="portfolio_wrapper">
          <!-- Content -->
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

    // Error
    const errorMsg = ref('');

    // Listen on the 'close_error'
    emitterObj.value.on('close_error', (isClosed) => {
      errorMsg.value = isClosed ? '' : undefined;
    });

    function uploadFile(file) {
      const reader = new FileReader();

      // Read The Audio File Into Raw Data (base64)
      reader.readAsDataURL(file);

      reader.onloadstart = (data) => {
        uploadProgress.value = data.loaded;
        audioUploading.value = true;
      };

      // On Progress of Uploading
      reader.onprogress = (data) => {
        uploadProgress.value = data.loaded;
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
        file.type === 'audio/mpeg' ? uploadFile(file) : errorHandling();
      });
    }

    function dropFile(e) {
      e.preventDefault();

      // Get The Data File Transfer
      const { files } = e.dataTransfer;

      handleFiles(files);
    }

    return {
      emitterObj,
      dropFile,
      handleFiles,
      audioUploading,
      uploadProgress,
      errorMsg,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_portfolio';
</style>
