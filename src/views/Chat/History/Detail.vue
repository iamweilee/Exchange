<template>
  <div class="hdetail">
    <NavBar :title="title" fixed showL @clickLeft="clickLeft" />
    <div class="hdetail_title">
      <div class="left">
        <p>盈亏</p>
        <button>市价买跌</button>
      </div>
      <div class="right">
        <p>-600.00</p>
        <p>-671.17(净盈亏)</p>
      </div>
    </div>
    <div class="hdetail_info">
      <ul class="List">
        <li>
          <p>开仓价</p>
          <p>0.529</p>
        </li>
        <li>
          <p>开仓价</p>
          <p>0.529</p>
        </li>
        <li>
          <p>止损价</p>
          <p>0.529</p>
        </li>
        <li>
          <p>交易量</p>
          <p>1手(35000 个)</p>
        </li>
        <li>
          <p>保证金</p>
          <p>0.529</p>
        </li>
      </ul>
    </div>
    <div class="dotted"></div>
    <div class="hdetail_intord">
      <p>开仓时间&nbsp;:&nbsp;2019/06/29 17:58:24</p>
      <p>平仓时间&nbsp;:&nbsp;2019/06/29 19:01:04</p>
      <p>订单编号&nbsp;:&nbsp;s6u02prl</p>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {
      title: "BTC/USDT (止损平仓)"
    };
  },
  created() {
    if (this.$route.params.id % 2) {
      this.title = "BTC/USDT (止损平仓)";
    } else {
      this.title = "BTC/USDT (止盈平仓)";
    }
  },
  components: {
    NavBar
  },
  methods: {
    clickLeft() {
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~assets/stylus/variable';
.hdetail {
  &_title {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    .left {
      p {
        font-size: 18px;
      }
      button {
        width: 60px;
        height: 18px;
        background-color: $red;
        color: $write;
        border-radius: 9px;
        font-size: 12px;
        margin-top: 6px;
      }
    }
    .right {
      p {
        font-size: 13px;
        text-align: right;
        &:first-child {
          font-size: 22px;
          color: $red;
          margin-bottom: 4px;
        }
      }
    }
  }
  &_info {
    padding: 0 16px;
    margin-bottom: 16px;
    .List {
      width: 100%;
      border-radius: 6px;
      background-color: $bgMain;
      font-size: 15px;
      padding: 0 16px;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64px;
        p {
          &:last-child {
            color: $color6;
          }
        }
      }
    }
  }
  &_intord {
    padding: 16px;
    font-size: 13px;
    color: $color9;
    line-height: 26px;
  }
}
</style>
