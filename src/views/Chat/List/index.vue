<template>
  <div class="hold">
    <div v-if="entrustIng.length">
      <router-link
        class="hold_single"
        tag="ul"
        v-for="(item, index) in entrustIng"
        :key="item.orderNo"
        :to="`/chat/hold/${item.orderNo}`"
      >
        <li class="top">
          <p class="top_l">
            <span class="big">{{ item.targetCoin }}</span>
            <span class="small">{{ item.sourceCoin }}</span>
            <span class="icon">
              <img :src="isBuy(index)" alt />
            </span>
            <span class="num"
              >×{{ item.tradeAmount / item.stockRate }}{{ $t("hand") }}</span
            >
          </p>
          <p class="top_btn">
            <span :class="isColor(index)">-18.76</span>
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
    <div v-else class="notData">
      {{ $t("notData") }}
    </div>
  </div>
</template>

<script>
import iconBuy from "Images/chat/icon_buy.png";
import iconSale from "Images/chat/icon_sale.png";
import { distinct } from "common/utli";
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
      if (type % 3) {
        return iconBuy;
      } else {
        return iconSale;
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
