<template>
  <div class="hold">
    <div class="hold_wrap" v-if="List.length">
      <router-link
        class="hold_single"
        tag="ul"
        v-for="(item, index) in List"
        :key="item.orderNo"
        :to="`/chat/hold/${index}`"
      >
        <li class="top">
          <p class="top_l">
            <span class="big">{{ item.targetCoin }}</span>
            <span class="small">{{ item.sourceCoin }}</span>
            <span class="icon">
              <img :src="isBuy(index)" alt />
            </span>
            <span class="num">×{{ item.tradeAmount / item.stockRate }}手</span>
          </p>
          <p class="top_btn">
            <span :class="isColor(index)">-18.76</span>
            <button @click.stop="closeOut(item)">平仓</button>
          </p>
        </li>
        <li class="bot">
          <p>
            <span>{{ item.dealPrice }}</span>
            <span>开仓价</span>
          </p>
          <p>
            <span>{{ coinPrice[item.targetCoin] }}</span>
            <span>当前价</span>
          </p>
          <p>
            <span>{{ item.stopLoss }}</span>
            <span>止损价</span>
          </p>
          <p>
            <span>{{ item.stopProfit }}</span>
            <span>止盈价</span>
          </p>
        </li>
      </router-link>
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
    }
  },
  data() {
    return {
      List: [],
      coinPrice: {}
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
    _initPage() {
      this.getHoldList();
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
    getHoldList() {
      this.$http({
        url: "/v1/leverage/holdList",
        data: { position: 0, tradeType: 0 },
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
      if (type % 3) {
        return iconBuy;
      } else {
        return iconSale;
      }
    },
    refresh(done) {
      console.log("refresh");
      this.$http({
        url: "/v1/leverage/eveningUp",
        data: { orderNo: "1111111" },
        method: "get"
      })
        .then(res => {
          done();
          console.log(res);
        })
        .catch(err => {
          this.$toast(err.data.message);
          done(false);
        });
      //   setTimeout(() => {
      //     done();
      //   }, 1000);
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
