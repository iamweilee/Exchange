<template>
  <div class="home">
    <div class="home_top container">
      <HomeHead />
      <Swipe :bannerList="bannerList" />
      <ModulInfo />
      <Notice />
      <Coin />
    </div>
    <Legal />
    <News />
    <Tips />
  </div>
</template>

<script>
import bannerImg from "Images/home/banner.png";
import HomeHead from "components/Home/HomeHead";
import Swipe from "components/Home/Swipe";
import ModulInfo from "components/Home/ModulInfo";
import Notice from "components/Home/Notice";
import Coin from "components/Home/Coin";
import Legal from "components/Home/Legal";
import News from "components/Home/News";
import Tips from "components/Tips";
export default {
  data() {
    return {
      bannerList: []
    };
  },

  created() {
    this.getInviteList();
    this.getBanner();
    this.getSetting();
  },
  mounted() {},
  methods: {
    getBanner() {
      this.$http({
        url: "/v1/banner/",
        method: "get",
        data: { type: 1 }
      }).then(res => {
        if (res.status == 200) {
          res.data.map(item => {
            item.picPath = bannerImg;
          });
          this.bannerList = res.data;
        }
      });
    },
    getSetting() {
      this.$http({
        url: "/v1/leverage/baseinfo",
        method: "post"
      }).then(res => {
        console.log(res);
      });
    },
    getInviteList() {
      this.$http({
        url: "/user_recommend_detail/childlist",
        data: { pageNo: 1, pageSize: 20 },
        method: "get"
      }).then(res => {
        console.log(res.data);
      });
    }
  },
  components: {
    HomeHead,
    Swipe,
    ModulInfo,
    Notice,
    Coin,
    Legal,
    News,
    Tips
  }
};
</script>
<style lang='stylus'>
@import './style';
</style>

