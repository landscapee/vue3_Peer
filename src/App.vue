<template>
  <div id="app">

    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "App",

  mounted() {
    this.$store.dispatch('globalData/equipmentList')
  }


}
</script>
<style lang="scss">
@import "../src/styles/index";

</style>
<style lang="scss" scoped>
#app {
  height: 100%;
}
</style>
