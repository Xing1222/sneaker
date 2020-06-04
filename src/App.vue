<template>
  <div id="app">
    <router-view class="all" />
    <!-- <el-backtop target="#app" :bottom="100" :visibility-height="200" /> -->
  </div>
</template>
<script>
export default {
  mounted() { }
}
</script>
<style lang="scss">
@import "@/sass/base.scss"; // global css
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fdfdfd;
  // padding: 20px 45px;
}
// ::-webkit-scrollbar {
//   width: 0px;
// }
</style>
