<template>
  <div id="app">
    <div class="main">
      <!-- <transition :name="transitionName"> -->
      <router-view class="main_wrapper" />
      <!-- </transition> -->
    </div>
    <router-view name="mainfooter"></router-view>
  </div>
</template>
<script>
import Footer from "components/Footer";
import { mapActions, mapMutations } from "vuex";
import WBT from "common/TollClass/socket";
export default {
  data() {
    return {
      Socket: null
      //   transitionName: "slide-left"
    };
  },
  mounted() {
    this._initPage();
  },
  components: {
    Footer
  },
  methods: {
    _initPage() {
      this.initSocket();
      this.getSetting();
      if (this.$lStore.get("token") && !this.$lStore.get("balance")) {
        this.getBanlace();
      }
      if (!this.$lStore.get("desc")) {
        this.getCoinDesc();
      }
      //   this.getSymbolOffset();
    },
    //初始化Socket
    initSocket() {
      let allSocket = new WBT({ url: "TVsocket" });
      allSocket.initWs();
      this.$EventListener.on("SendMsg", this.SendMsg);
      this.Socket = allSocket;
      this.getInfo();
    },
    SendMsg(datas) {
      setTimeout(() => {
        this.Socket.Send(JSON.stringify(datas));
      });
    },
    getCoinDesc() {
      this.$http({ url: "/coin/get_coin_desc", method: "get" }).then(res => {
        console.log(res);
        let desc = {};
        res.data.map(item => {
          console.log(item);
          let obj = {};
          desc[item.coinCode] = item;
        });
        console.log(desc);
        this.$lStore.set("desc", desc);
      });
    },
    getSetting() {
      if (this.$lStore.get("setingData")) return;
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
            let obj = {};
            obj.symbol = item.coinCode;
            info.coinList.push(obj);
            info[item.coinCode] = {
              poundageArray: item.poundageArray,
              valRate: item.valRate
            };
          });
          this.$lStore.set("setingData", info);
        }
      });
    },

    getSymbolOffset(List) {
      this.$http({
        url: "/v1/leverage/symbolOffset",
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          let Obj = res.data,
            coinPrecision = {};
          List.map(item => {
            let coinCode = item.tradeCode.replace("/USDT", "");
            item.tickSize = item.tickSize.toString().split(".")[1].length;
            item.stepSize = item.stepSize.toString().split(".")[1].length;
            item.minPrice = item.minPrice.toString().split(".")[1].length;
            item.minQty = item.minQty.toString().split(".")[1].length;
            item.stockNum = item.stockNum.split(",");
            item.depositLevel = item.depositLevel.split(",");
            item.offset = Obj[coinCode];
            coinPrecision[coinCode] = item;
          });
          this.$lStore.set("coinPrecision", coinPrecision);
        }
      });
    },
    //获取币种详情
    getInfo() {
      this.$http({
        url: "/tradeInfo/allTradeInfo",
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          let List = res.data[0].USDT;
          this.getSymbolOffset(List);
        }
      });
    },

    ...mapActions(["getBanlace"])
  },

  watch: {
    // $route(to, from) {
    //   let toName = to.name;
    //   const toIndex = to.meta.id;
    //   const fromIndex = from.meta.id;
    //   this.transitionName = toIndex < fromIndex ? "slide-right" : "slide-left";
    // }
  }
};
</script>

<style lang="stylus">
#app {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  .main {
    &_wrapper {
      width: 100%;
    }
  }
}
</style>
