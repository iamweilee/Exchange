<template>
  <div class="page1">
    <NavBar title="活动页面" fixed showL @clickLeft="clickLeft"></NavBar>
    <h1>活动页面</h1>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {};
  },
  components: {
    NavBar
  },
  methods: {
    clickLeft() {
      this.$router.back(-1);
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
