<template>
  <div class="coin">
    <router-link
      tag="ul"
      class="coin_single"
      v-for="item in coinList"
      :to="`/position/${item.symbol.split('/')[0]}`"
      :key="item.symbol"
      :class="isColor(item.percent)"
    >
      <li class="trade">{{ item.symbol }}</li>
      <li class="dollar">{{ item.close | priceFormat(item.tickSize) }}</li>
      <li class="rate">{{ item.percent | toRate }}%</li>
      <li class="cny">￥{{ item.cny | priceFormat }}</li>
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
    return {};
  },

  methods: {
    isColor(pric) {
      if (pric > 0) {
        return "green";
      } else {
        return "red";
      }
    }
  }
};
</script>

