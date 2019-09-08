<template>
  <div class="capital">
    <ul class="capital_title">
      <li class="type">买盘</li>
      <li class="num">数量</li>
      <li class="price">价格(USDT)</li>
      <li class="num">数量</li>
      <li class="type">卖盘</li>
    </ul>
    .
    <div class="capital_list" v-if="List.length">
      <ul class="capital_single" v-for="(item, index) in List" :key="index">
        <li class="type">{{ index + 1 }}</li>
        <li class="num">
          {{ item.bidsNum | priceFormat(coinPrecision.stepSize) }}
        </li>
        <li class="price">
          <p>{{ item.bidsPrice | priceFormat(coinPrecision.tickLength) }}</p>
          <p>{{ item.asksPrice | priceFormat(coinPrecision.tickLength) }}</p>
        </li>
        <li class="num">
          {{ item.asksNum | priceFormat(coinPrecision.stepSize) }}
        </li>
        <li class="type">{{ index + 1 }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    coinPrecision: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      List: []
    };
  },
  mounted() {
    this._initPage();
  },
  beforeDestroy() {
    this.$EventListener.off("TVdepth", this.rederDepth);
  },
  components: {},
  methods: {
    _initPage() {
      this.$EventListener.on("TVdepth", this.rederDepth);
      console.log(this.coinPrecision, "6666666666666");
    },
    rederDepth(data) {
      let bids = data.bids,
        asks = data.asks,
        List = [];
      for (let i = 0; i < bids.length; i++) {
        let Obj = {};
        Obj.bidsPrice = bids[i][0];
        Obj.bidsNum = bids[i][1];
        Obj.asksPrice = asks[i][0];
        Obj.asksNum = asks[i][1];
        Obj.key = "bidsasks" + i;
        List.unshift(Obj);
      }
      this.List = List;
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
