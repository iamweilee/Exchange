<template>
  <div class="hold">
    <div class="hold_wrap" v-if="List.length">
      <router-link
        class="hold_single"
        tag="ul"
        v-for="item in List"
        :key="item.orderNo"
        :to="`/chat/hold/${item.orderNo}`"
      >
        <li class="top">
          <p class="top_l">
            <span class="big">{{ item.targetCoin }}</span>
            <span class="small">{{ item.sourceCoin }}</span>
            <span class="icon" :class="item.position ? 'fall' : 'rise'">
              {{ isBuy(item.position) }}
            </span>
            <span class="num"
              >×{{ item.tradeAmount / item.stockRate }}{{ $t("hand") }}</span
            >
          </p>
          <p class="top_btn">
            <span
              :class="isColor(earnings(item, coinPrice[item.targetCoin]))"
              >{{ earnings(item, coinPrice[item.targetCoin]) }}</span
            >
            <button @click.stop="closeOut(item)">
              {{ $t("chat").closeOut }}
            </button>
          </p>
        </li>
        <li class="bot">
          <p>
            <span>{{ item.tradePrice }}</span>
            <span>{{ $t("chat").dealPrice }}</span>
          </p>
          <p>
            <span>{{ coinPrice[item.targetCoin] }}</span>
            <span>{{ $t("chat").currentPrice }}</span>
          </p>
          <p>
            <span>{{
              item.stopLoss
                | priceFormat(coinPrecision[item.targetCoin].tickSize)
            }}</span>
            <span>{{ $t("chat").lossPrice }}</span>
          </p>
          <p>
            <span>{{
              item.stopProfit
                | priceFormat(coinPrecision[item.targetCoin].tickSize)
            }}</span>
            <span>{{ $t("chat").profitPrice }}</span>
          </p>
        </li>
      </router-link>
    </div>
    <div v-else class="notData">
      {{ $t("notData") }}
    </div>
  </div>
</template>

<script>
import iconBuy from "Images/chat/icon_buy.png";
import iconSale from "Images/chat/icon_sale.png";
import { distinct, priceFormat } from "common/utli";
export default {
  props: {
    showDialog: {
      type: Function,
      required: true
    },
    tradeType: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      coinPrecision: this.$lStore.get("coinPrecision"),
      List: [],
      coinPrice: {}
    };
  },
  mounted() {
    this._initPage();
  },
  destroyed() {
    this.$EventListener.fire("SendMsg", {});
  },
  methods: {
    _initPage() {
      console.log(this.coinPrecision);
      this.getHoldList();
    },
    sendMsg(coinArr) {
      let datas = {};
      coinArr.forEach(item => {
        datas[`${item.toLowerCase()}usdt-ticker`] = 0;
      });
      this.$EventListener.fire("SendMsg", datas);
    },
    Detail(data) {
      data.symbol = data.symbol.replace("/USDT", "");
      if (this.coinPrice[data.symbol]) {
        this.coinPrice[data.symbol] = data.close;
      }
    },
    //收益计算
    /* 买涨 持仓量*行情价-持仓量*成交价
    买跌 持仓量*成交价-持仓量*行情价 */
    earnings(item, currentPrice) {
      let earning = 0;
      if (item.position == 1) {
        //买跌
        earning =
          item.tradeAmount * item.tradePrice - item.tradeAmount * currentPrice;
      } else {
        //买涨
        earning =
          item.tradeAmount * currentPrice - item.tradeAmount * item.tradePrice;
      }
      return priceFormat(earning);
    },
    //获取持仓单
    getHoldList() {
      let url = this.tradeType ? "/v1/leverage/holdList" : "/v1/mock/hold_list";
      this.$http({
        url: url,
        data: { tradeType: 0 },
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.List = res.data;
          let arr = [],
            obj = {};
          for (let i = 0; i < res.data.length; i++) {
            arr.push(res.data[i].targetCoin);
          }
          arr = distinct(arr);
          for (let j = 0; j < arr.length; j++) {
            obj[arr[j]] = "--";
          }
          this.coinPrice = obj;
          this.sendMsg(arr);
        }
      });
    },
    closeOut(item) {
      item.title = "平仓";
      this.showDialog(item);
    },
    isBuy(type) {
      if (type) {
        return "跌";
      } else {
        return "涨";
      }
    },
    refresh(done) {
      this.getHoldList();
      done();
    },
    isColor(num) {
      if (num < 0) {
        return "color-red1";
      } else {
        return "color-green";
      }
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
