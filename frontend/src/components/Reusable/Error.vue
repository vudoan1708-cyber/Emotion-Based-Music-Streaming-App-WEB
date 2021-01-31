<template>
  <div id="error">
    <!-- Error File Input -->
    <div id="file_input_err">
      <h1>Wrong File Input!!!</h1>
      <p>{{ msg }}</p>
    </div>

    <!-- Proceed Button -->
    <div id="proceed" @click="closeErrorBoard">
      <p>Got It</p>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'Error',
  props: {
    errorMsg: {
      type: String,
    },
    emitter: {
      type: Object,
    },
  },
  setup(props) {
    // Emitter
    const emitterObj = ref(props.emitter);
    // Error Message
    const msg = ref(props.errorMsg);

    function closeErrorBoard() {
      // Subscribe to 'close_error' event
      emitterObj.value.emit('close_error', true);
    }

    watch(msg, (data) => {
      msg.value = data;
    });
    return {
      msg,
      closeErrorBoard,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_error';
</style>
