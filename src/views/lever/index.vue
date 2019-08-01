<template>
  <div class="lever">
    <NavBar :title="$t('tabNav').lever" fixed hideBorder />

    <div class="lever_title">
      <ul class="List">
        <li>{{ $t("lever").title1 }}</li>
        <li>{{ $t("lever").title2 }}</li>
        <li>{{ $t("lever").title3 }}</li>
      </ul>
    </div>
    <div class="lever_List">
      <ScrollV pulldown pullup @pullDown="pullDown" @pullUp="pullUp">
        <router-link
          tag="ul"
          class="lever_List_single border-1px"
          v-for="(item, index) in List"
          :class="index % 2 && 'fall'"
          :key="item.symbol"
          :to="`/position/${item.symbol}`"
        >
          <li class="left">
            <p class="left_top">
              <span class="big">{{ item.symbol }}</span>
              <span class="small">比特币</span>
              <span class="icon" v-show="!(index % 3)">
                <img src="~assets/Images/lever/icon_hot.png" alt />
              </span>
            </p>
            <p class="left_bot">行情稳，可操盘</p>
          </li>
          <li class="middle">
            <p class="usdt">{{ item.close }}</p>
            <p class="cny">￥{{ item.cny | priceFormat }}</p>
          </li>
          <li class="right">
            <button class="rate">+{{ item.percent | priceFormat }}%</button>
          </li>
        </router-link>
      </ScrollV>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import ScrollV from "components/Scroll";
import { connect } from "net";
export default {
  data() {
    return {
      List: this.$lStore.get("setingData").coinList,
      loading: false,
      finished: false,
      isLoading: false
    };
  },
  components: {
    NavBar,
    ScrollV
  },
  mounted() {
    this._initPage();
  },
  beforeDestroy() {
    this.$EventListener.off("TVdetail", this.Detail);
    this.$EventListener.fire("SendMsg", {});
  },
  methods: {
    _initPage() {
      this.$EventListener.on("TVdetail", this.Detail);
      this.sendMsg();
      this.getCoinInfo1();
      this.getCoinInfo();
    },
    sendMsg() {
      let datas = {};
      this.List.forEach(item => {
        datas[`${item.symbol.toLowerCase()}usdt-ticker`] = 0;
      });
      this.$EventListener.fire("SendMsg", datas);
    },
    Detail(data) {
      data.symbol = data.symbol.replace("/USDT", "");
      let List = this.List;
      for (let i = 0; i < List.length; i++) {
        if (List[i].symbol == data.symbol) {
          List[i] = data;
          break;
        }
      }
      this.List = [...List];
    },
    getCoinInfo() {
      this.$http({
        url: "/tradeInfo/allTradeInfo",
        method: "get"
      }).then();
    },
    getCoinInfo1() {
      this.$http({
        url: "/tradeInfo/getByCoinCode",
        data: { coinCode: "USDT" },
        method: "get"
      }).then();
    },
    pullDown(scroll) {
      setTimeout(() => {
        this.$toast({
          message: "刷新成功",
          duration: 500
        });
        scroll.finishPullDown();
      }, 1000);
    },
    pullUp(scroll) {
      let arr = list;
      setTimeout(() => {
        console.log("到底了");
        scroll.finishPullUp();
      }, 1000);
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
