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
    <van-pull-refresh
      v-model="isLoading"
      class="lever_List"
      v-if="List.length"
      @refresh="pullDown"
    >
      <router-link
        tag="ul"
        class="lever_List_single border-1px"
        v-for="item in List"
        :class="isFall(item.percent) && 'fall'"
        :key="item.symbol"
        :to="`/position/${item.coinCode}`"
      >
        <li class="left">
          <p class="left_top">
            <span class="big">{{ item.coinCode }}</span>
            <span class="small">{{ item.alias }}</span>
            <span class="icon" v-show="item.hot">
              <img src="~assets/Images/lever/icon_hot.png" alt />
            </span>
          </p>
          <p class="left_bot">{{ item.desc }}</p>
        </li>
        <li class="middle">
          <p class="usdt">
            {{ item.close | priceFormat(item.tickSize) }}
          </p>
          <p class="cny">￥{{ item.cny | priceFormat }}</p>
        </li>
        <li class="right">
          <button class="rate">{{ item.percent | toRate }}%</button>
        </li>
      </router-link>
    </van-pull-refresh>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import ScrollV from "components/Scroll";
export default {
  data() {
    return {
      List: [],
      coinPrecision: this.$lStore.get("coinPrecision"),
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
      this.getCoinInfo();
    },
    sendMsg(List) {
      let datas = {};
      List.forEach(item => {
        datas[`${item.pair}-ticker`] = 0;
      });
      this.$EventListener.fire("SendMsg", datas);
    },
    Detail(data) {
      let List = this.List;
      for (let i = List.length - 1; i >= 0; i--) {
        if (List[i].pair == data.pair) {
          List[i].close = data.close;
          List[i].cny = data.cny;
          List[i].percent = data.percent;
          break;
        }
      }
      this.List = [...List];
    },
    getCoinInfo(refresh) {
      this.$http({
        url: "/v1/kline/findQuotationList",
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          let List = res.data;
          for (let i = List.length - 1; i >= 0; i--) {
            let coinCode = List[i].symbol.replace("/USDT", "");
            List[i].coinCode = coinCode;
            List[i].tickSize = this.coinPrecision[coinCode].tickSize;
          }
          this.sendMsg(List);
          this.List = List;
          if (refresh) {
            this.isLoading = false;
            this.$toast({
              message: "刷新成功",
              duration: 300
            });
          }
        }
      });
    },
    isFall(percent) {
      if (percent < 0) {
        return true;
      } else {
        return false;
      }
    },
    pullDown() {
      this.getCoinInfo(true);
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
