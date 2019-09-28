<template>
  <div class="holdD">
    <NavBar :title="$t('chat').DetailTitle" fixed showL @clickLeft="clickLeft" />
    <div class="holdD_wrap">
      <div class="holdD_btn">
        <ScrollH scrollX :data="btnList">
          <div class="holdD_btn_scroll">
            <button
              v-for="item in btnList"
              :key="item.title"
              :class="item.title == resolution && 'active'"
              @click="checkResolution(item.title)"
            >{{ item.title }}</button>
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
          <p class="coinCode">{{ orderDetail.tradeCode }}</p>
           <p
            class="rise"
            :class="orderDetail.position && 'fall'"
          >{{ orderDetail.position ? $t("fall") : $t("rise") }}</p>
        </div>
        <div class="holdD_title_bot">截止时间：{{orderDetail.usefulTime}}</div>
      </div>
      <div class="holdD_info">
        <ul class="List">
          <li>
            <p>
              <span>{{ $t("chat").lossPrice }}</span>
              <span>
                {{
                orderDetail.stopLoss | priceFormat(coinData.tickLength)
                }}
              </span>
            </p>
            <p>
              <span>{{ $t("chat").currentPrice }}</span>
              <span>
                {{
                socketData.close | priceFormat(coinData.tickLength)
                }}
              </span>
            </p>
          </li>
          <li>
            <p>
              <span>{{ $t("chat").profitPrice }}</span>
              <span>
                {{
                orderDetail.stopProfit | priceFormat(coinData.tickLength)
                }}
              </span>
            </p>
            <p>
              <span>{{ $t("chat").tradePrice }}</span>
              <span>
                {{
                orderDetail.tradePrice | priceFormat(coinData.tickLength)
                }}
              </span>
            </p>
          </li>
          <li class="List_bot mt_bot">
            <p>{{ $t("chat").volume }}</p>
            <p>
              {{ orderDetail.tradeAmount / orderDetail.stockRate
              }}{{ $t("hand") }}({{ orderDetail.tradeAmount }}个)
            </p>
          </li>
        </ul>
      </div>
      <div class="dotted"></div>
      <div class="holdD_order">
        <p>{{ $t("chat").dealTime }}：{{ orderDetail.createTime }}</p>
        <p>{{ $t("chat").orderNo }}：{{ orderDetail.orderNo }}</p>
        <p></p>
      </div>
      <div class="dotted"></div>
      <div class="holdD_night">
        <div class="holdD_night_left">
          <p>{{ $t("night") }}</p>
          <p class="icon_size" @click="showCustomDialog">
            <img src="~assets/Images/other/icon_night.png" alt />
            {{
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
      <button @click="showProfitLoss = !showProfitLoss">{{ $t("chat").setting }}</button>
      <button @click="showDialog">{{ $t("chat").cancelOrder }}</button>
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
        <p>{{ orderDetail.dealPrice | priceFormat(coinData.tickLength) }}</p>
      </div>
      <div class="lossProfit_row">
        <p class="label">{{ $t("chat").currentPrice }}</p>
        <p>{{ socketData.close | priceFormat(coinData.tickLength) }}</p>
      </div>

      <div class="lossProfit_row">
        <p class="label">{{ $t("chat").lossPrice }}</p>
        <div class="lossProfit_single">
          <div class="box">
            <input type="text" v-model="lossPrice" />
            <!-- v-debounce="{
                fn: minus.bind('click', 'lossPrice')
            }"-->
            <img
              class="minus"
              src="~assets/Images/pos/icon_minus.png"
              v-debounce="{
                fn: minus.bind('click', 'lossPrice')
              }"
            />
            <!-- v-debounce="{
                fn: add.bind('click', 'lossPrice')
            }"-->
            <img
              class="add"
              v-debounce="{
                fn: add.bind('click', 'lossPrice')
              }"
              src="~assets/Images/pos/icon_add.png"
            />
            <p class="box-size" @click.stop>
              ≥
              <em>
                {{
                (socketData.close * 1.002) | priceFormat(coinData.tickLength)
                }}
              </em>
              预计亏损约
              <em>
                {{
                exLossProfit(
                orderDetail.dealPrice,
                lossPrice,
                orderDetail.tradeAmount
                )
                }}
              </em>
            </p>
          </div>
        </div>
      </div>
      <div class="lossProfit_row">
        <p class="label">{{ $t("chat").profitPrice }}</p>
        <div class="lossProfit_single">
          <div class="box">
            <input type="text" v-model="profitPrice" />
            <img
              class="minus"
              src="~assets/Images/pos/icon_minus.png"
              v-debounce="{
                fn: minus.bind('click', 'profitPrice')
              }"
            />
            <img
              class="add"
              v-debounce="{
                fn: add.bind('click', 'profitPrice')
              }"
              src="~assets/Images/pos/icon_add.png"
            />
            <p class="box-size" @click.stop>
              ≤
              <em>
                {{
                (socketData.close * 0.998) | priceFormat(coinData.tickLength)
                }}
              </em>
              预计盈利约
              <em>
                {{
                exLossProfit(
                orderDetail.dealPrice,
                profitPrice,
                orderDetail.tradeAmount
                )
                }}
              </em>
            </p>
          </div>
        </div>
      </div>
    </van-dialog>
    <van-dialog
      closeOnClickOverlay
      v-model="showSucceed"
      :title="$t('orderSucc')"
      :beforeClose="beforeClose"
      :confirmButtonText="$t('seeOrder')"
      class="customDialog"
    >
      <ul class="hold_dialog">
        <li>
          <p>{{ succeedData.targetCoin }}</p>
          <p>{{ succeedData.tradeAmount }}</p>
        </li>
        <li>
          <p>{{ $t("chat").dealPrice }}</p>
          <p>{{ succeedData.tradePrice }}</p>
        </li>
      </ul>
    </van-dialog>
    <CloseOut
      ref="CloseOut"
      :tradeType="tradeType"
      :earnings="earnings(orderDetail, socketData.close)"
      :dialogData="orderDetail"
    />
    <customDialog ref="customDialog" :titleText="$t('night')">
      <p>选择开启后，该笔订单可持仓过夜，但会收取一定的库存费，库存费=交易综合费*30%*持仓过夜天数；如用户不需要持仓过夜可取消设置，设置时间为【07:00:00—次日05:53:00】。</p>
      <p>如未开启，则该笔订单在次日05:53:00前会被系统强制平仓。</p>
    </customDialog>
  </div>
</template>

<script>
import ScrollH from "components/Scroll/ScrollH";
import NavBar from "components/NavBar";
import Echart from "components/Echart";
import CloseOut from "components/CloseOut";
import customDialog from "components/customDialog";
import decimal from "common/decimal";
import extendsCom from "@/extendsCom";
import { priceFormat } from "common/utli";
import { mapState, mapActions } from "vuex";
export default {
  extends: extendsCom,
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
      coinData: {},
      socketData: {},
      showProfitLoss: false,
      profitPrice: 0,
      lossPrice: 0,
      showSucceed: false,
      succeedData: {}
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
    CloseOut,
    customDialog
  },
  methods: {
    _initPage() {
      this.$EventListener.on("TVdetail", this.Detail);
      this.getDetail();
    },

    showDialog(data) {
      this.$refs.CloseOut.show = true;
      //   v1/leverage/updateProfitAndLoss?orderNo=xxx&profit=xxx&loss=xxx
    },
    //获取订单详情
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
            coinData = this.$lStore.get("coinPrecision")[res.data.targetCoin];
          this.coinData = coinData;
          datas[`${res.data.targetCoin.toLowerCase()}usdt-ticker`] = 0;
          datas[`${res.data.targetCoin.toLowerCase()}usdt-kline-15m`] = 0;
          this.profitPrice = priceFormat(
            res.data.stopProfit,
            coinData.tickLength
          );
          this.lossPrice = priceFormat(res.data.stopLoss, coinData.tickLength);
          this.$EventListener.fire("SendMsg", datas);
        }
      });
    },
    Detail(data) {
      this.socketData = data;
      //   this.$refs.echart.getData(data);
    },
    //下单函数
    placeOrder(req) {
      let url = "";
      console.log(req);
      if (this.tradeType) {
        url =
          req.tradeType == 1
            ? "/v1/leverage/limited/submit"
            : "/v1/leverage/market/submit";
      } else {
        url =
          req.tradeType == 1 ? "/v1/mock/limit_trade" : "/v1/mock/market_trade";
      }

      this.$http({
        url: url,
        data: req,
        method: "post"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.succeedData = req;
          this.showSucceed = true;
          this.getBanlace();
        }
        // console.log(res);
      });
    },
    //下单数据二次计算
    placeOrderData(tradePrice) {
      console.log(tradePrice);
      tradePrice = this.initTradePrice(tradePrice);
      let orderDetail = this.orderDetail;
      let req = {
        position: orderDetail.position, //交易方向0-涨 1-跌
        poundageAmount: 0, //手续费
        sourceCoin: "USDT", //交易货币
        targetCoin: orderDetail.targetCoin, //目标货币
        tradeCode: `${orderDetail.targetCoin}/USDT`, //交易对
        tradeType: orderDetail.tradeType, //0-市价 1-限价
        userId: orderDetail.userId,
        //是否过夜 0否 1是
        isDelay: orderDetail.isDelay,
        //手数比例
        stockRate: orderDetail.stockRate,
        //保证金
        deposit: orderDetail.deposit,
        //委托量
        tradeAmount: orderDetail.tradeAmount
      };
      //下单价格
      req.tradePrice = Number(tradePrice);
      //杠杆倍数
      req.leverage = Number(
        priceFormat((tradePrice * req.tradeAmount) / req.deposit)
      );
      //手续费
      req.poundageAmount = Number(
        priceFormat((tradePrice * req.tradeAmount - req.deposit) * 0.003)
      );
      let lossProfit = this.fullStop(req);
      //止盈
      req.stopProfit = Number(lossProfit.inpProfit);
      //止损
      req.stopLoss = Number(lossProfit.inpLoss);
      return req;
    },
    //页面显示止盈止损价
    fullStop(req) {
      let inpLoss, inpProfit;
      if (req.position == 1) {
        //跌
        inpLoss = priceFormat(
          Number(req.tradePrice) +
            Number((req.deposit * 0.8) / req.tradeAmount),
          this.coinData.tickLength
        );
        inpProfit = priceFormat(
          req.tradePrice - (req.deposit * 0.8) / req.tradeAmount,
          this.coinData.tickLength
        );
      } else {
        //涨
        inpLoss = priceFormat(
          req.tradePrice - (req.deposit * 0.8) / req.tradeAmount,
          this.coinData.tickLength
        );

        inpProfit = priceFormat(
          Number(req.tradePrice) +
            Number((req.deposit * 0.8) / req.tradeAmount),
          this.coinData.tickLength
        );
      }
      return { inpLoss, inpProfit };
    },
    //页面显示预计盈亏
    exLossProfit(tradePrice, price, tradeAmount) {
      //下单价与止盈止损的差值
      let chazhi = Math.abs(tradePrice - price);
      return priceFormat(chazhi * tradeAmount);
    },
    //initTradePrice 初始化下单价
    initTradePrice(tradePrice) {
      let orderDetail = this.orderDetail;
      // console.log(orderDetai);
      if (orderDetail.tradeType == 1) {
        tradePrice =
          orderDetail.position == 1
            ? tradePrice + this.coinData.offset
            : tradePrice - this.coinData.offset;
      } else {
        tradePrice =
          orderDetail.position == 1 ? tradePrice * 1.0003 : tradePrice * 0.9997;
      }
      return priceFormat(tradePrice, this.coinData.tickLength);
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
      if (earning < 0) {
        return priceFormat(earning);
      } else {
        return "+" + priceFormat(earning);
      }
    },
    beforeClose(action, done) {
      if (action == "confirm") {
        let path = this.succeedData.tradeType == 1 ? "/chat/list" : "/chat";
        this.$router.push(path);
      } else {
        done();
      }
    },
    add(key) {
      this[key] = priceFormat(
        decimal.accAdd(Number(this[key]), this.coinData.tickSize),
        this.coinData.tickLength
      );
    },
    minus(key) {
      this[key] = priceFormat(
        decimal.accSubtr(Number(this[key]), this.coinData.tickSize),
        this.coinData.tickLength
      );
    },
    profitLossHandle(action, done) {
      if (action == "cancel") {
        done();
      } else {
        this.updateProfitAndLoss(done);
        console.log(action);
      }
    },
    updateProfitAndLoss() {
      this.$http({
        url: `/v1/leverage/updateProfitAndLoss?orderNo=${this.orderDetail.orderNo}&profit=${this.profitPrice}&loss=${this.lossPrice}`,
        // data: {
        //   orderNo: this.orderDetail.orderNo,
        //   profit: this.profitPrice,
        //   loss: this.lossPrice
        // },
        method: "put"
      }).then(res => {
        if (res.status == this.STATUS) {
          done();
        }
      });
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
    },
    ...mapActions(["getBanlace"])
  }
};
</script>

<style scoped lang="stylus">
@import './limit';
</style>
