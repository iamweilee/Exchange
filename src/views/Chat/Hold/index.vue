<template>
  <div class="hold">
    <router-link
      class="hold_single"
      tag="ul"
      v-for="(item, index) in List"
      :key="index"
      :to="`/chat/hold/${index}`"
    >
      <li class="top">
        <p class="top_l">
          <span class="big">ETH</span>
          <span class="small">USDT</span>
          <span class="icon">
            <img :src="isBuy(index)" alt />
          </span>
          <span class="num">×1手</span>
        </p>
        <p class="top_btn">
          <span :class="isColor(index)">-18.76</span>
          <button @click.stop="closeOut">平仓</button>
        </p>
      </li>
      <li class="bot">
        <p>
          <span>5.7605</span>
          <span>开仓价</span>
        </p>
        <p>
          <span>--</span>
          <span>当前价</span>
        </p>
        <p>
          <span>5.6605</span>
          <span>止损价</span>
        </p>
        <p>
          <span>6.0002</span>
          <span>止盈价</span>
        </p>
      </li>
    </router-link>
  </div>
</template>

<script>
import iconBuy from "Images/chat/icon_buy.png";
import iconSale from "Images/chat/icon_sale.png";
export default {
  props: {
    showDialog: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      List: new Array(10)
    };
  },
  created() {
    this.getList();
  },
  components: {},
  methods: {
    //获取持仓单
    getList() {
      this.$http({
        url: "/v1/leverage/hold",
        data: { position: 0, tradeType: 0 },
        method: "get"
      }).then(res => {
        console.log(res.data);
      });
    },
    closeOut() {
      this.showDialog({
        title: "平仓"
      });
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
