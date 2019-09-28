<template>
  <div class="hold">
    <div v-if="entrustIng.length">
      <router-link
        class="hold_single"
        tag="ul"
        v-for="item in entrustIng"
        :key="item.orderNo"
        :to="`/chat/hold/limit/${item.orderNo}`"
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
            <button @click.stop="closeOut(item)">
              {{ $t("chat").cancelOrder }}
            </button>
          </p>
        </li>
        <li class="bot">
          <p>
            <span>{{ item.tradePrice }}</span>
            <span>{{ $t("chat").tradePrice }}</span>
          </p>
          <p>
            <span>{{ coinPrice[item.targetCoin] }}</span>
            <span>{{ $t("chat").currentPrice }}</span>
          </p>
          <p>
            <span>{{ item.stopLoss }}</span>
            <span>{{ $t("chat").lossPrice }}</span>
          </p>
          <p>
            <span>{{ item.stopProfit }}</span>
            <span>{{ $t("chat").profitPrice }}</span>
          </p>
        </li>
      </router-link>
    </div>
    <NotData v-else />
  </div>
</template>

<script>
import { distinct } from "common/utli";
import NotData from "components/NotData";
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
      entrustIng: [],
      coinPrice: {}
    };
  },
  mounted() {
    this._initPage();
  },
  components: {
    NotData
  },
  methods: {
    _initPage() {
      this.getEntrustIng();
      this.$EventListener.on("TVdetail", this.Detail);
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
    //获取持仓单
    getEntrustIng() {
      let url = this.tradeType
        ? "/v1/leverage/entrustIng"
        : "/v1/mock/entrust_list";
      this.$http({
        url: url,
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.entrustIng = res.data;
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
          console.log(arr, obj);
          this.sendMsg(arr);
        }
      });
    },
    closeOut(item) {
      item.title = "撤单";
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
      this.getEntrustIng();
      done();
    },

    isColor(num) {
      if (num % 2) {
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
