<template>
  <div class="holdD">
    <NavBar
      :title="$t('chat').DetailTitle"
      fixed
      showL
      @clickLeft="clickLeft"
    />
    <div class="holdD_wrap">
      <div class="holdD_btn">
        <ScrollH scrollX :data="btnList">
          <div class="holdD_btn_scroll">
            <button
              v-for="item in btnList"
              :key="item.title"
              :class="item.title == resolution && 'active'"
              @click="checkResolution(item.title)"
            >
              {{ item.title }}
            </button>
          </div>
        </ScrollH>
      </div>
      <div class="holdD_kline">
        <div class="holdD_kline_container">
          <Echart ref="echart" :tradeCode="orderDetail.targetCoin" />
        </div>
      </div>
      <div class="dotted"></div>
      <div class="holdD_title">
        <div class="holdD_title_top">
          <p>{{ orderDetail.tradeCode }}</p>
          <p :class="isColor(earnings(orderDetail, socketData.close))">
            {{ earnings(orderDetail, socketData.close) }}
          </p>
        </div>
        <div class="holdD_title_bot">
          <p>{{ orderDetail.tradeType == 0 ? $t("rise") : $t("fall") }}</p>
          <p @click="showProfitLoss = !showProfitLoss">
            {{ $t("chat").setting }}
          </p>
        </div>
      </div>
      <div class="holdD_info">
        <ul class="List">
          <li>
            <p>
              <span>{{ $t("chat").lossPrice }}</span>
              <span>{{ orderDetail.stopLoss | priceFormat(tickSize) }}</span>
            </p>
            <p>
              <span>{{ $t("chat").currentPrice }}</span>
              <span>{{ socketData.close | priceFormat(tickSize) }}</span>
            </p>
          </li>
          <li>
            <p>
              <span>{{ $t("chat").profitPrice }}</span>
              <span>{{ orderDetail.stopProfit | priceFormat(tickSize) }}</span>
            </p>
            <p>
              <span>{{ $t("chat").dealPrice }}</span>
              <span>{{ orderDetail.dealPrice | priceFormat(tickSize) }}</span>
            </p>
          </li>
          <li>
            <p>
              <span>{{ $t("chat").leverage }}</span>
              <span>{{ orderDetail.leverage }}</span>
            </p>
            <p>
              <span>{{ $t("chat").deposit }}</span>
              <span>{{ orderDetail.deposit }}</span>
            </p>
          </li>
          <li>
            <p>
              <span>{{ $t("chat").inventoryFree }}</span>
              <span>0.529</span>
            </p>
            <p>
              <span>{{ $t("chat").dealMarket }}</span>
              <span>{{
                (orderDetail.dealPrice * orderDetail.tradeAmount) | priceFormat
              }}</span>
            </p>
          </li>
          <li class="List_bot mt_bot">
            <p>{{ $t("chat").volume }}</p>
            <p>
              {{ orderDetail.tradeAmount / orderDetail.stockRate
              }}{{ $t("hand") }}({{ orderDetail.tradeAmount }}个)
            </p>
          </li>
          <li class="List_bot">
            <p>{{ $t("freeSyn") }}</p>
            <p>{{ orderDetail.poundageAmount | priceFormat }}</p>
          </li>
        </ul>
      </div>
      <div class="dotted"></div>
      <div class="holdD_order">
        <p>{{ $t("chat").dealTime }}：{{ orderDetail.dealTime }}</p>
        <p>{{ $t("chat").orderNo }}：{{ orderDetail.orderNo }}</p>
        <p></p>
      </div>
      <div class="dotted"></div>
      <div class="holdD_night">
        <div class="holdD_night_left">
          <p>{{ $t("night") }}</p>
          <p class="icon_size">
            <img src="~assets/Images/other/icon_night.png" alt />{{
              $t("holdTo")
            }}6:00
          </p>
        </div>
        <van-switch
          v-model="checked"
          active-color="#00A7E0"
          inactive-color="#DEDEDE"
          size="0.5rem"
        />
      </div>
    </div>
    <div class="holdD_hanle">
      <button>{{ $t("chat").goOrder }}</button>
      <button @click="showDialog">{{ $t("chat").closeOut }}</button>
    </div>
    <van-dialog
      class="customDialog lossProfit"
      v-model="showProfitLoss"
      show-cancel-button
      :beforeClose="profitLossHandle"
    >
      <div class="lossProfit_row">
        <div class="title">
          <p>{{ orderDetail.targetCoin }}</p>
          <p>{{ orderDetail.tradeType == 0 ? $t("rise") : $t("fall") }}</p>
          <p>{{ orderDetail.tradeAmount }}个</p>
        </div>
      </div>
      <div class="lossProfit_row">
        <p class="label">{{ $t("chat").dealPrice }}</p>
        <p>{{ orderDetail.dealPrice | priceFormat(tickSize) }}</p>
      </div>
      <div class="lossProfit_row">
        <p class="label">{{ $t("chat").currentPrice }}</p>
        <p>{{ socketData.close | priceFormat(tickSize) }}</p>
      </div>

      <div class="lossProfit_row">
        <p class="label">{{ $t("chat").lossPrice }}</p>
        <div class="lossProfit_single">
          <div class="box">
            <input type="text" v-model="lossPrice" />
            <img class="minus" src="~assets/Images/pos/icon_minus.png" alt />
            <img class="add" src="~assets/Images/pos/icon_add.png" alt />
            <p class="box-size" @click.stop>
              ≥<em>{{ (socketData.close * 1.002) | priceFormat(tickSize) }}</em>
              预计亏损约
              <em>80</em>
            </p>
          </div>
        </div>
      </div>
      <div class="lossProfit_row">
        <p class="label">{{ $t("chat").profitPrice }}</p>
        <div class="lossProfit_single">
          <div class="box">
            <input type="text" v-model="profitPrice" />
            <img class="minus" src="~assets/Images/pos/icon_minus.png" alt />
            <img class="add" src="~assets/Images/pos/icon_add.png" alt />
            <p class="box-size" @click.stop>
              ≤<em>{{ (socketData.close * 0.998) | priceFormat(tickSize) }}</em>
              预计盈利约
              <em>80</em>
            </p>
          </div>
        </div>
      </div>
    </van-dialog>
    <CloseOut
      ref="CloseOut"
      :dialogDataNull="dialogDataNull"
      :tradeType="tradeType"
      :dialogData="orderDetail"
    />
  </div>
</template>

<script>
import ScrollH from "components/Scroll/ScrollH";
import NavBar from "components/NavBar";
import Echart from "components/Echart";
import CloseOut from "components/CloseOut";
import { priceFormat } from "common/utli";
import { mapState } from "vuex";
export default {
  data() {
    return {
      btnList: [
        { title: "1分" },
        { title: "5分" },
        { title: "15分" },
        { title: "30分" },
        { title: "1时" },
        { title: "1日" },
        { title: "1周" },
        { title: "1月" }
      ],
      resolution: "5分",
      checked: true,
      orderDetail: {},
      tickSize: 2,
      socketData: {},
      showProfitLoss: false,
      profitPrice: 0,
      lossPrice: 0
    };
  },
  computed: {
    ...mapState(["tradeType"])
  },
  mounted() {
    this._initPage();
  },
  destroyed() {
    this.$EventListener.fire("TVdetail", this.Detail);
    this.$EventListener.fire("SendMsg", {});
  },
  components: {
    NavBar,
    ScrollH,
    Echart,
    CloseOut
  },
  methods: {
    _initPage() {
      this.$EventListener.on("TVdetail", this.Detail);
      this.getDetail();
    },
    dialogDataNull() {
      this.orderDetail = {};
    },
    showDialog(data) {
      this.$refs.CloseOut.show = true;
    },
    getDetail() {
      let url = this.tradeType
        ? "/v1/leverage/getOrder"
        : "/v1/mock/order_detail";
      this.$http({
        url: url,
        data: { orderNo: this.$route.params.id },
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          if (res.data.tradeType == 0) {
            res.data.title = "平仓";
          } else {
            res.data.title = "撤单";
          }
          res.data.cb = this.toHisDetail;
          this.orderDetail = res.data;
          let datas = {},
            tickSize = this.$lStore.get("coinPrecision")[res.data.targetCoin]
              .tickSize;
          this.tickSize = tickSize;
          datas[`${res.data.targetCoin.toLowerCase()}usdt-ticker`] = 0;
          datas[`${res.data.targetCoin.toLowerCase()}usdt-kline-15m`] = 0;
          this.profitPrice = priceFormat(res.data.stopProfit, tickSize);
          this.lossPrice = priceFormat(res.data.stopLoss, tickSize);
          this.$EventListener.fire("SendMsg", datas);
        }
      });
    },
    Detail(data) {
      this.socketData = data;
      //   this.$refs.echart.getData(data);
    },
    //收益计算
    /* 买涨 持仓量*行情价-持仓量*成交价
    买跌 持仓量*成交价-持仓量*行情价 */
    earnings(item, currentPrice) {
      let earning = 0;
      if (item.position == 1) {
        //买跌
        earning =
          item.tradeAmount * item.tradePrice - item.tradeAmount * currentPrice;
      } else {
        //买涨
        earning =
          item.tradeAmount * currentPrice - item.tradeAmount * item.tradePrice;
      }
      return priceFormat(earning);
    },
    profitLossHandle(action, done) {
      if (action == "cancel") {
        done();
      }
    },
    checkResolution(resolution) {
      this.resolution = resolution;
    },
    toHisDetail() {
      this.$router.push(`/chat/history/${this.$route.params.id}`);
    },
    clickLeft() {
      this.$router.back();
    },
    isColor(num) {
      if (num < 0) {
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
