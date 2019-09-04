<template>
  <div class="hdetail">
    <NavBar
      :title="
        `${orderDetail.tradeCode}${
          orderDetail.position == 1 ? $t('stopLoss') : $t('stopProfit')
        }`
      "
      fixed
      showL
      @clickLeft="clickLeft"
    />
    <div class="hdetail_wrap">
      <div class="hdetail_title">
        <div class="left">
          <p>{{ $t("chat").profit }}</p>
          <button>
            {{ tradeHandle(orderDetail.tradeType, orderDetail.position) }}
          </button>
        </div>
        <div class="right">
          <p :class="isColor(orderDetail.income)">{{ orderDetail.income }}</p>
          <p>{{ orderDetail.income }}({{ $t("chat").netProfit }})</p>
        </div>
      </div>
      <div class="hdetail_info">
        <ul class="List">
          <li>
            <p>{{ $t("chat").dealPrice }}</p>
            <p>{{ orderDetail.dealPrice | priceFormat(tickSize) }}</p>
          </li>
          <li>
            <p>{{ $t("chat").closePrice }}</p>
            <p>{{ orderDetail.closePrice | priceFormat(tickSize) }}</p>
          </li>
          <li>
            <p>{{ $t("chat").lossPrice }}</p>
            <p>{{ orderDetail.stopLoss | priceFormat(tickSize) }}</p>
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
        <p>
          {{ $t("chat").dealTime }}&nbsp;:&nbsp;{{ orderDetail.createTime }}
        </p>
        <p>
          {{ $t("chat").closeTime }}&nbsp;:&nbsp;{{ orderDetail.closeTime }}
        </p>
        <p>{{ $t("chat").orderNo }}&nbsp;:&nbsp;{{ orderDetail.orderNo }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import { mapState } from "vuex";
export default {
  data() {
    return {
      orderDetail: {},
      coinPrecision: this.$lStore.get("coinPrecision"),
      tickSize: 2
    };
  },
  mounted() {
    this.getDetail();
  },
  computed: {
    ...mapState(["tradeType"])
  },
  components: {
    NavBar
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
          this.tickSize = this.coinPrecision[res.data.targetCoin].tickSize;
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
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~assets/stylus/variable';
.hdetail {
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
