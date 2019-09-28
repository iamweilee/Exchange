<template>
  <div class="hdetail" v-if="orderDetail.id">
    <NavBar
      :title="
        `${orderDetail.tradeCode}（${$t('chat').nowUndo}）`
      "
      fixed
      showL
      @clickLeft="clickLeft"
    />
    <div class="hdetail_wrap">
      <div class="hdetail_title">
        <div class="left">
          <p>{{orderDetail.targetCoin}}</p>
          <button
            :class="!position&&'rise'"
          >{{ tradeHandle(orderDetail.tradeType, orderDetail.position) }}</button>
        </div>
        <div class="right">{{$t('chat').nowUndo}}</div>
      </div>
      <div class="hdetail_info">
        <ul class="List">
          <li>
            <p>{{ $t("chat").dealPrice }}</p>
            <p>{{ orderDetail.dealPrice | priceFormat(coinData.tickLength) }}</p>
          </li>

          <li>
            <p>{{ $t("chat").lossPrice }}</p>
            <p>{{ orderDetail.stopLoss | priceFormat(coinData.tickLength) }}</p>
          </li>
          <li>
            <p>{{ $t("chat").volume }}</p>
            <p>
              {{ orderDetail.tradeAmount / orderDetail.stockRate
              }}{{ $t("hand") }}({{ orderDetail.tradeAmount }}个)
            </p>
          </li>
          <li>
            <p>{{ $t("chat").deposit }}</p>
            <p>{{ orderDetail.deposit }}</p>
          </li>
        </ul>
      </div>
      <div class="dotted"></div>
      <div class="hdetail_intord">
        <p>{{ $t("chat").dealTime }}&nbsp;:&nbsp;{{ orderDetail.dealTime }}</p>
        <p>{{ $t("chat").undoTime }}&nbsp;:&nbsp;{{ orderDetail.updateTime }}</p>
        <p>{{ $t("chat").orderNo }}&nbsp;:&nbsp;{{ orderDetail.orderNo }}</p>
      </div>
    </div>
  </div>
  <NotData v-else />
</template>

<script>
import NotData from "components/NotData";
import NavBar from "components/NavBar";
import { priceFormat } from "common/utli";
import { mapState } from "vuex";
export default {
  data() {
    return {
      orderDetail: {},
      coinPrecision: this.$lStore.get("coinPrecision"),
      coinData: {},
      showSucceed: false,
      succeedData: {}
    };
  },
  mounted() {
    this.getDetail();
  },
  computed: {
    ...mapState(["tradeType"])
  },
  components: {
    NavBar,
    NotData
  },
  methods: {
    getDetail() {
      let url = this.tradeType
        ? "/v1/leverageHis/info"
        : "/v1/mock/order_history_detail";

      this.$http({
        url: url,
        data: { orderNo: this.$route.params.id },
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.coinData = this.coinPrecision[res.data.targetCoin];
          this.orderDetail = res.data;
        }
      });
    },

    tradeHandle(tradeType, position) {
      let text = "";
      if (tradeType) {
        text = "限价";
      } else {
        text = "市价";
      }
      if (position) {
        text += "买跌";
      } else {
        text += "买涨";
      }
      return text;
    },
    isColor(price) {
      if (price > 0) {
        return "color-green";
      } else {
        return "color-red";
      }
    },
    clickLeft() {
      this.$router.push("/chat/history");
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~assets/stylus/variable';
.hdetail {
  background-color: $write;
  &_wrap {
    subScroll();
  }
  &_title {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    .left {
      display: flex;
      align-items: center;
      p {
        font-size: 18px;
        margin-right: 6px;
      }
      button {
        width: 60px;
        height: 18px;
        background-color: $red;
        color: $write;
        border-radius: 9px;
        font-size: 12px;
        &.rise {
          background-color: $green;
        }
      }
    }
    .right {
      font-size: 15px;
      text-align: right;
      color: $color9;
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
