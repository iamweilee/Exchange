<template>
  <div class="holdD">
    <NavBar title="持仓详情" fixed showL @clickLeft="clickLeft" />
    <div class="holdD_btn">
      <ScrollH scrollX :data="btnList">
        <div class="holdD_btn_scroll">
          <button
            v-for="item in btnList"
            :key="item.title"
            :class="item.title == resolution&&'active'"
            @click="checkResolution(item.title)"
          >{{item.title}}</button>
        </div>
      </ScrollH>
    </div>
    <div class="holdD_kline">
      <div class="holdD_kline_container">
          <Echart/>
      </div>
    </div>
    <div class="dotted"></div>
    <div class="holdD_title">
      <div class="holdD_title_top">
        <p>BTC/USDT</p>
        <p>-600</p>
      </div>
      <div class="holdD_title_bot">
        <p>涨</p>
        <p>设置止盈止损</p>
      </div>
    </div>
    <div class="holdD_info">
      <ul class="List">
        <li>
          <p>
            <span>止损价</span>
            <span>0.529</span>
          </p>
          <p>
            <span>当前价</span>
            <span>0.529</span>
          </p>
        </li>
        <li>
          <p>
            <span>止盈价</span>
            <span>0.529</span>
          </p>
          <p>
            <span>开仓价</span>
            <span>0.529</span>
          </p>
        </li>
        <li>
          <p>
            <span>杠杆倍数</span>
            <span>0.529</span>
          </p>
          <p>
            <span>保证金</span>
            <span>0.529</span>
          </p>
        </li>
        <li>
          <p>
            <span>库存费</span>
            <span>0.529</span>
          </p>
          <p>
            <span>开仓市值</span>
            <span>0.529</span>
          </p>
        </li>
        <li class="List_bot mt_bot">
          <p>交易量</p>
          <p>1手(1个)</p>
        </li>
        <li class="List_bot">
          <p>综合交易费</p>
          <p>12.886</p>
        </li>
      </ul>
    </div>
    <div class="dotted"></div>
    <div class="holdD_order">
      <p>开仓时间：2019/06/29 17:22:52</p>
      <p>订单编号：bicaiderechargecode</p>
      <p></p>
    </div>
    <div class="dotted"></div>
    <div class="holdD_night">
      <div class="holdD_night_left">
        <p>持仓过夜</p>
        <p class="icon_size">
          <img src="~assets/Images/other/icon_night.png" alt />持仓到6:00
        </p>
      </div>
      <van-switch
        v-model="checked"
        active-color="#00A7E0"
        inactive-color="#DEDEDE"
        size="0.5rem"
      />
    </div>
    <div class="holdD_hanle">
      <button>追单</button>
      <button>平仓</button>
    </div>
  </div>
</template>

<script>
import ScrollH from "components/Scroll/ScrollH";
import NavBar from "components/NavBar";
import Echart from "components/Echart";
export default {
  data() {
    this.btnList = [
      { title: "1分" },
      { title: "5分" },
      { title: "15分" },
      { title: "30分" },
      { title: "1时" },
      { title: "1日" },
      { title: "1周" },
      { title: "1月" }
    ];

    return {
      resolution: "5分",
      checked: true
    };
  },
  mounted() {},
  components: {
    NavBar,
    ScrollH,
    Echart
  },
  methods: {
    checkResolution(resolution) {
      this.resolution = resolution;
    },
    clickLeft() {
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
