<template>
  <div class="home">
    <HomeHead />
    <div class="home_wrapper">
      <div class="home_top container">
        <Swipe v-if="bannerList.length" :bannerList="bannerList" />
        <ModulInfo />
        <Notice />
        <Coin :coinList="coinList" />
      </div>
      <Legal />
      <News />
      <Tips />
    </div>
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
import { mapActions } from "vuex";
export default {
  data() {
    return {
      bannerList: [],
      coinPrecision: this.$lStore.get("coinPrecision"),
      coinList: [
        { symbol: "BTC/USDT" },
        { symbol: "ETH/USDT" },
        { symbol: "EOS/USDT" }
      ]
    };
  },

  mounted() {
    this._initPage();
  },
  beforeDestroy() {
    this.$EventListener.off("TVdetail", this.Detail);
    this.$EventListener.fire("SendMsg", {});
  },
  methods: {
    change(val) {
      this.value = val;
    },
    _initPage() {
      this.getBanner();

      this.sendMsg();
      this.$EventListener.on("TVdetail", this.Detail);
      if (this.$lStore.get("token")) {
        this.getBanlace();
      }
    },
    sendMsg() {
      setTimeout(() => {
        this.$EventListener.fire("SendMsg", {
          "btcusdt-ticker": 0,
          "ethusdt-ticker": 0,
          "eosusdt-ticker": 0
        });
      }, 100);
    },
    Detail(data) {
      let List = this.coinList;
      for (let i = 0; i < List.length; i++) {
        if (List[i].symbol == data.symbol) {
          let coinCode = List[i].symbol.replace("/USDT", "");
          data.tickLength = this.coinPrecision[coinCode].tickLength;
          List[i] = data;
          break;
        }
      }
      this.coinList = [...List];
    },
    getBanner() {
      this.$http({
        url: "/v1/banner/",
        method: "get",
        data: { type: 1 }
      }).then(res => {
        if (res.status == this.STATUS) {
          this.bannerList = res.data;
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
    },
    ...mapActions(["getBanlace"])
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

