<template>
  <div class="capital">
    <ul class="capital_title">
      <li class="type">买盘</li>
      <li class="num">数量</li>
      <li class="price">价格(USDT)</li>
      <li class="num">数量</li>
      <li class="type">卖盘</li>
    </ul>.
    <div class="capital_list" v-if="List.length">
      <ul class="capital_single" v-for="(item,index) in List" :key="index">
        <li class="type">{{6-index}}</li>
        <li class="num">{{item.bidsNum|toFixeds(4)}}</li>
        <li class="price">
          <p>{{item.bidsPrice|toFixeds}}</p>
          <p>{{item.asksPrice|toFixeds}}</p>
        </li>
        <li class="num">{{item.asksNum|toFixeds(4)}}</li>
        <li class="type">{{6-index}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      List: []
    };
  },
  created() {
    this._initPage();
  },
  destroyed() {
    this.$EventListener.off("TVdepth", this.rederDepth);
  },
  components: {},
  methods: {
    _initPage() {
      this.$EventListener.on("TVdepth", this.rederDepth);
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
        List.push(Obj);
      }
      this.List = List;
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
