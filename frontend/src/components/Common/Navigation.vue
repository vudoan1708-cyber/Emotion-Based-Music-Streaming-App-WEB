<template>
  <div id="nav">
    <ul>
      <li>
        <div class="home">
          <img src="#"/>
        </div>
        <div class="home">
          <p>Home</p>
        </div>
      </li>
      <li>
        <div class="search">
          <img src="#"/>
        </div>
        <div class="search">
          <p>Search</p>
        </div>
      </li>
      <li>
        <div class="records">
          <img src="#"/>
        </div>
        <div class="records">
          <p>Records</p>
        </div>
        </li>
    </ul>
  </div>
</template>

<script>
export default {

};
</script>

<style scoped lang="scss">
#nav {
  position: relative;
  width: 100%;
  text-align: center;

  ul {
    display: block;

    li {
      margin-bottom: 20px;
      cursor: pointer;
      text-align: left;
      color: rgb(82, 82, 82);

      .home {
        display: inline-block;
        margin: 10px;
      }

      .search,
      .records {
        @extend .home;
      }

      &:hover {
        color: rgb(145, 145, 145);
      }
    }
  }
}
</style>
