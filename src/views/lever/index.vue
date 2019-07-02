<template>
  <div class="lever">
    <NavBar title="杠杆" fixed hideBorder />

    <div class="lever_title">
      <ul class="List">
        <li>交易品种</li>
        <li>价格</li>
        <li>涨跌幅</li>
      </ul>
    </div>
    <div class="lever_List">
      <ScrollV pulldown pullup @pullDown="pullDown" @pullUp="pullUp" :data="List">
        <ul
          class="lever_List_single border-1px"
          v-for="(item,index) in List"
          :class="index%2&&'fall'"
          :key="index"
        >
          <li class="left">
            <p class="left_top">
              <span class="big">BTC</span>
              <span class="small">比特币</span>
              <span class="icon" v-show="!(index%3)">
                <img src="~assets/Images/lever/icon_hot.png" alt />
              </span>
            </p>
            <p class="left_bot">行情稳，可操盘</p>
          </li>
          <li class="middle">
            <p class="usdt">5800.67</p>
            <p class="cny">￥39058.88</p>
          </li>
          <li class="right">
            <button class="rate">+2.88%</button>
          </li>
        </ul>
      </ScrollV>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import ScrollV from "components/Scroll";
export default {
  data() {
    return {
      List: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ],
      loading: false,
      finished: false,
      isLoading: false
    };
  },
  components: {
    NavBar,
    ScrollV
  },
  methods: {
    pullDown(scroll) {
      setTimeout(() => {
        this.List = [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20
        ];
        this.$toast({
          message: "刷新成功",
          duration: 500
        });
        scroll.finishPullDown();
      }, 1000);
    },
    pullUp(scroll) {
      let arr = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ];
      setTimeout(() => {
        this.List = [...this.List, ...arr];
        console.log("到底了");
        scroll.finishPullUp();
      }, 1000);
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
