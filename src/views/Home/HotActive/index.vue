<template>
  <div class="hot">
    <NavBar title="热门活动" fixed showL @clickLeft="clickLeft" />
    <div class="hot_list">
      <router-link
        v-for="item in hotData.list"
        :key="item.id"
        class="hot_list_single"
        to="/active_page"
      >
        <img src="~assets/Images/home/banner.png" alt />
      </router-link>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {
      hotData: {}
    };
  },
  mounted() {
    this._initPage();
  },
  components: {
    NavBar
  },
  methods: {
    _initPage() {
      this.getMessage();
    },
    getMessage() {
      this.$http({
        url: "/v1/platMessage/",
        method: "get",
        data: { type: 3, pageSize: 20, pageNo: 1 }
      }).then(res => {
        if (res.status == this.STATUS) {
          this.hotData = res.data;
        }
      });
    },
    clickLeft() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
