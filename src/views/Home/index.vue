<template>
  <div class="home">
    <div class="home_top container">
      <HomeHead />
      <Swipe v-if="bannerList.length" :bannerList="bannerList" />
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
import { dateFormat } from "common/utli";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      bannerList: [],
      values: ["BTC", "ETH", "EOS"],
      value: "BTC"
    };
  },

  created() {
    this._initPage();
  },
  methods: {
    change(val) {
      console.log(val);
      this.value = val;
    },
    _initPage() {
      this.getBanner();
      this.getSetting();
      this.getInfo();
      console.log(dateFormat(new Date(), "MM-dd w"));
    },

    getBanner() {
      this.$http({
        url: "/v1/banner/",
        method: "get",
        data: { type: 1 }
      }).then(res => {
        if (res.status == this.STATUS) {
          res.data.map(item => {
            item.picPath = bannerImg;
          });
          this.bannerList = res.data;
        }
      });
    },
    getInfo() {
      this.$http({
        url: "/tradeInfo/allTradeInfo",
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
        }
      });
    },
    getSetting() {
      //   if (this.$lStore.get("setingData")) return;
      this.$http({
        url: "/v1/leverage/baseinfo",
        method: "post"
      }).then(res => {
        if (res.status == this.STATUS) {
          let info = {
            coinList: [],
            stopRate: res.data.stopRate,
            stopRateOffset: res.data.stopRateOffset,
            nums: res.data.nums
          };
          res.data.coinInfo.map(item => {
            info.coinList.push(item.coinCode);
            info[item.coinCode] = {
              poundageArray: item.poundageArray,
              valRate: item.valRate
            };
          });
          console.log(info)
          this.$lStore.set("setingData", info);
        }
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

