<template>
  <div id="nav">
    <ul>
      <!-- Home -->
      <li :class="{ 'home': homeElement }" @click="onClickNav(1)">
        <div class="nav_el">
          <img src="@/assets/homepage.png"/>
        </div>
        <div class="nav_el">
          <p>Home</p>
        </div>
      </li>

      <!-- Search -->
      <li :class="{ 'search': searchElement }" @click="onClickNav(2)">
        <div class="nav_el">
          <img src="@/assets/search.png"/>
        </div>
        <div class="nav_el">
          <p>Search</p>
        </div>
      </li>

      <!-- Records -->
      <li :class="{ 'records': recordsElement }" @click="onClickNav(3)">
        <div class="nav_el">
          <img src="@/assets/records.png"/>
        </div>
        <div class="nav_el">
          <p>Records</p>
        </div>
      </li>

      <!-- Portfolio -->
      <li :class="{ 'portfolio': portfolioElement }" @click="onClickNav(4)">
        <div class="nav_el">
          <img src="@/assets/portfolio.png"/>
        </div>
        <div class="nav_el">
          <p>Portfolio</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Navigation',
  props: {
    emitter: {
      type: Object,
    },
  },
  setup(props) {
    // Emitter
    const emitterObj = ref(props.emitter);

    // set active state for elements
    const homeElement = ref(true);
    const searchElement = ref(false);
    const recordsElement = ref(false);
    const portfolioElement = ref(false);

    const whichElements = ref([homeElement, searchElement, recordsElement, portfolioElement]);

    // Listen on 'nav' event
    emitterObj.value.on('nav', (num) => {
      for (let i = 0; i < whichElements.value.length; i += 1) {
        if (i === num - 1) {
          whichElements.value[i].value = true;
        } else {
          whichElements.value[i].value = false;
        }
      }
    });

    // when a nav button is clicked
    function onClickNav(num) {
      for (let i = 0; i < whichElements.value.length; i += 1) {
        if (i === num - 1) {
          whichElements.value[i].value = true;
          // Emit A Number Representing a Clicked Element
          emitterObj.value.emit('nav', num);
        } else {
          whichElements.value[i].value = false;
        }
      }
    }

    return {
      homeElement,
      searchElement,
      recordsElement,
      portfolioElement,
      onClickNav,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/sass/Unique/_nav.scss';
</style>
