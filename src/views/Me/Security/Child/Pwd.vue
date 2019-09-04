<template>
  <div class="Pwd">
    <NavBar :title="title" fixed showL @clickLeft="clickLeft" />
    <div class="Phone_wrap">
      <p class="tab_bar">
        <router-link to="/me/pwd">修改密码</router-link>
        <router-link to="/me/pwd/reset">重置密码</router-link>
      </p>
      <router-view />
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {
      transitionName: "slide-left",
      title: "修改密码"
    };
  },
  components: { NavBar },
  mounted() {
    if (this.$route.name == "PwdReset") {
      this.title = "重置密码";
    } else {
      this.title = "修改密码";
    }
  },
  methods: {
    clickLeft() {
      this.$router.push("/me/security");
    }
  },
  watch: {
    $route(to, from) {
      let toName = to.name;
      if (toName == "PwdReset") {
        this.title = "重置密码";
      } else {
        this.title = "修改密码";
      }
      //   const toIndex = to.meta.id;
      //   const fromIndex = from.meta.id;
      //   this.transitionName = toIndex < fromIndex ? "slide-right" : "slide-left";
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
