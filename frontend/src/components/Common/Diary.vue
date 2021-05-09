<template>
  <div id="diary_container">
    <div id="diary">
      <form>
        <section id="diary_header">
          <h2>Today's Diary</h2>
        </section>

        <!-- Title -->
        <section>
          <label>Title</label>
          <input class="input_fields" id="title" name="diary" type="text" :value="title" />
        </section>

        <!-- Content -->
        <section>
          <label>Content</label>
          <textarea class="input_fields" id="content" name="diary" placeholder="Your Message"
                    rows="10" v-model="content"></textarea>
        </section>

        <!-- Save -->
        <section>
          <input id="save_btn" type="submit" value="Save" />
        </section>
      </form>
    </div>
  </div>
</template>

<script>
import { toRefs, watch } from 'vue';

export default {
  name: 'Diary',
  props: {
    diary: {
      type: Object,
    },
  },
  setup(props) {
    // Props
    // using `toRefs` to create a Reactive Reference to the `diary` property of props
    const { title, content } = toRefs(props.diary);

    watch(content, (val) => {
      content.value = val;
    });

    return {
      title,
      content,
    };
  },
};
</script>

<style lang="scss" scoped>
#diary_container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;

  #diary {
    position: relative;
    color: snow;
    background-color: #6cf1a3f1;
    border-radius: 10px;
    text-align: left;

    #diary_header {
      text-align: center;
      background-color: rgb(50, 50, 50);
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      margin: 0;
      padding: 10px;
    }

    section {
      margin: 20px;
      text-align: center;

      label {
        width: 100%;
        float: left;
        text-align: left;
        background-color: rgb(88, 88, 88);
        color: rgb(192, 192, 192);
        padding: 5px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      .input_fields {
        width: 100%;
      }

      #save_btn {
        padding: 15px 40px;
        margin-bottom: 5px;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        background-color: rgb(50, 50, 50);
        cursor: pointer;
        transition: .2s background-color;

        &:hover {
          background-color: rgb(12, 12, 12);
        }
      }
    }
  }
}
</style>
