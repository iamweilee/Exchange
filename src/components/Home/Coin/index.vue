<template>
  <div class="coin">
    <router-link
      tag="ul"
      class="coin_single"
      v-for="item in coinList"
      :to="`/position/${item.symbol.split('/')[0]}`"
      :key="item.symbol"
    >
      <li class="trade">{{ item.symbol }}</li>
      <li class="dollar" :class="isColor(item)">{{ item.close }}</li>
      <li class="rate" :class="isColor(item)">
        {{ item == 2 ? "-" : "+" }}52%
      </li>
      <li class="cny">￥52100</li>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    coinList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      List: [
        { symbol: "BTC/USDT" },
        { symbol: "ETH/USDT" },
        { symbol: "EOS/USDT" }
      ]
    };
  },

  methods: {
    isColor(pric) {
      if (pric == 2) {
        return "color-red";
      } else {
        return "color-green";
      }
    }
  }
};
</script>

