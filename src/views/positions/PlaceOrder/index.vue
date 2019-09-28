<template>
  <div class="order">
    <ul class="order_title">
      <li class="order_title_l" @click="showExplain">
        <img src="~assets/Images/pos/icon_explain.png" alt />
      </li>
      <li class="order_title_m">{{ title }}下单</li>
      <li class="order_title_r" @click="cloeModle">
        <img src="~assets/Images/pos/icon_close.png" alt />
      </li>
    </ul>
    <div class="order_scroll">
      <div class="order_handle">
        <p class="order_handle_l" v-debounce="{
            fn: Specialty
          }">
          切换至{{ isSpecialty() ? "快捷" : "专业" }}版
          <img src="~assets/Images/pos/icon_zy.png" alt />
        </p>
        <div class="order_handle_r">
          <!-- <Select
            v-model="value"
            :values="values"
            @input="changeSelect"
          ></Select>-->
        </div>
      </div>
      <div class="btnType">
        <button :class="!orderType && 'active'" @click="orderTypeHandle(0)">市价</button>
        <button :class="orderType && 'active'" @click="orderTypeHandle(1)">挂单</button>
      </div>
      <div class="order_form">
        <div class="from_single" v-if="isMarket()">
          <div class="from_single_label">
            <p>挂单价格</p>
            <p>价格≥{{ orderPic(1) }}&nbsp;或&nbsp;价格≤{{ orderPic(0) }}</p>
          </div>
          <div class="from_single_cont">
            <div class="box" @click="allCustom = true">
              <input type="number" v-model="inpPrice" @input="changeTradePrice" />
              <img
                class="minus"
                @click="minus('inpPrice')"
                src="~assets/Images/pos/icon_minus.png"
                alt
              />
              <img class="add" @click="add('inpPrice')" src="~assets/Images/pos/icon_add.png" alt />
            </div>
          </div>
        </div>
        <div class="from_single">
          <div class="from_single_label">
            <p>手数</p>
            <p>价值{{ orderData.tradeAmount }}个{{ coinCode }}</p>
          </div>
          <div class="from_single_cont">
            <div class="hand">
              <button
                v-for="item in coinDetail[coinCode].stockNum"
                :key="item"
                :class="item == checkHand && 'active'"
                @click="handClick(item, 'checkHand')"
              >{{ item }}手</button>
            </div>
          </div>
        </div>
        <div class="from_single">
          <div class="from_single_label">
            <p>保证金(USDT)</p>
            <p>
              可用&nbsp;{{ usableBalance | priceFormat(3) }}&nbsp;USDT，杠杆约{{
              orderData.leverage
              }}X
            </p>
          </div>
          <div class="from_single_cont">
            <div class="hand cash">
              <button
                v-for="item in coinDetail[coinCode].depositLevel"
                :key="item"
                :class="item == checkCash && 'active'"
                @click="handClick(item, 'checkCash')"
              >{{ item * checkHand }}</button>
            </div>
          </div>
        </div>

        <div class="from_single" v-if="isSpecialty()">
          <div class="from_single_label big">
            <div class="left">{{ $t("stopProfit") + $t("stopLoss") }}</div>
            <p>
              <van-switch
                v-model="isLossProfit"
                active-color="#2D9FFE"
                inactive-color="#DEDEDE"
                @change="changeSwitch"
                size="0.5rem"
              />
            </p>
          </div>
          <div class="from_single_cont" v-show="isLossProfit">
            <div class="from_single_cont_single">
              <div class="left">{{ $t("chat").lossPrice }}</div>
              <div class="box small" @click="isLoss = true">
                <input type="text" v-model="inpLoss" />
                <img
                  class="minus"
                  src="~assets/Images/pos/icon_minus.png"
                  v-debounce="{
                    fn: minus.bind('click', 'inpLoss')
                  }"
                />
                <img
                  class="add"
                  v-debounce="{
                    fn: add.bind('click', 'inpLoss')
                  }"
                  src="~assets/Images/pos/icon_add.png"
                />
                <p class="box-size" @click.stop>
                  ≥
                  <em>{{ astrict(inpPrice) }}</em>
                  预计亏损约
                  <em>
                    {{
                    exLossProfit(inpPrice, inpLoss, orderData.tradeAmount)
                    }}
                  </em>
                </p>
              </div>
            </div>
            <div class="from_single_cont_single">
              <div class="left">{{ $t("chat").profitPrice }}</div>
              <div class="box small" @click="isProfit = true">
                <input type="text" v-model="inpProfit" />
                <img
                  class="minus"
                  src="~assets/Images/pos/icon_minus.png"
                  v-debounce="{
                    fn: minus.bind('click', 'inpProfit')
                  }"
                />
                <img
                  class="add"
                  v-debounce="{
                    fn: add.bind('click', 'inpProfit')
                  }"
                  src="~assets/Images/pos/icon_add.png"
                />
                <p class="box-size" @click.stop>
                  ≤
                  <em>{{ astrict(inpPrice, true) }}</em>
                  预计盈利约
                  <em>
                    {{
                    exLossProfit(inpPrice, inpProfit, orderData.tradeAmount)
                    }}
                  </em>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="from_single" v-if="isSpecialty()">
          <div class="from_single_label big">
            <div class="left">
              {{ $t("night") }}
              <p class="icon_size" @click="showCustomDialog">
                <img src="~assets/Images/other/icon_night.png" alt />持仓到6:00
              </p>
            </div>
            <p>
              <van-switch
                v-model="isNight"
                active-color="#2D9FFE"
                inactive-color="#DEDEDE"
                size="0.5rem"
              />
            </p>
          </div>
        </div>
        <div class="from_single">
          <div class="from_single_label big" @click="freeShow = !freeShow">
            <p>交易综合费</p>
            <p class="selectSingle">
              {{ orderData.poundageAmount }}（已优惠0）
              <img :class="freeShow && 'rotate'" src="~assets/Images/pos/icon_down.png" alt />
            </p>
          </div>
          <div class="from_single_free" v-show="freeShow">
            <p>原价</p>
            <p>{{ orderData.poundageAmount }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="submit_btn">
      <button :class="position && 'active'" @click="placeOrder(inpPrice)">
        <!-- <button :class="position && 'active'" @click="showSucceed = true"> -->
        {{ subBtnText }}{{ inpPrice }}
      </button>
    </div>
    <OrderExplain ref="OrderExplain" />
    <customDialog ref="customDialog" :titleText="$t('night')">
      <p>选择开启后，该笔订单可持仓过夜，但会收取一定的库存费，库存费=交易综合费*30%*持仓过夜天数；如用户不需要持仓过夜可取消设置，设置时间为【07:00:00—次日05:53:00】。</p>
      <p>如未开启，则该笔订单在次日05:53:00前会被系统强制平仓。</p>
    </customDialog>
  </div>
</template>

<script>
// import Select from "components/Select";
import OrderExplain from "components/OrderExplain";
import customDialog from "components/customDialog";
import { mapState, mapGetters, mapActions } from "vuex";
import { priceFormat } from "common/utli";
import ScrollV from "components/Scroll";
import extendsCom from "@/extendsCom";
import decimal from "common/decimal";
export default {
  extends: extendsCom,
  props: {
    closePic: {
      type: [String, Number],
      default: 0
    },
    coinCode: {
      type: String,
      required: true
    },
    position: {
      type: [String, Number],
      required: true
    },
    coinData: {
      type: Object,
      required: true
    },
    cloeModle: {
      type: Function,
      default: () => {
        console.log("cloeModle");
      }
    },
    succeedOrder: {
      type: Function,
      default: () => {
        console.log("success");
      }
    }
  },
  data() {
    return {
      inpPrice: 0, //下单价格
      inpLoss: 0, //止损价格
      inpProfit: 0, //止盈价格
      checkHand: 2, //选择手数
      valRate: 1, //手数比
      checkCash: 200, //保证金
      coinDetail: this.$lStore.get("coinPrecision"),
      cashList: [],
      orderType: 0, //0 市价  1  挂单
      freeShow: false, //点击保证金
      isNight: false, //是否过夜
      isLossProfit: false, //是否设置盈损
      title: "快捷",
      subBtnText: "",
      allCustom: false, //是否自己填入下单价格
      isProfit: false, //是否自己填入止盈价格
      isLoss: false, //是否自己填入止损价格
      orderData: {},
      coinPrecision: 2
    };
  },
  computed: {
    ...mapState(["userInfo", "tradeType"]),
    ...mapGetters(["usableBalance"])
  },
  mounted() {
    this._initPage();
  },
  components: {
    // Select,
    ScrollV,
    OrderExplain,
    customDialog
  },
  methods: {
    _initPage() {
      let setingData = this.$lStore.get("setingData");
      this.coinPrecision = this.coinData.tickLength;
      this.cashList = setingData[this.coinCode].poundageArray;
      this.checkCash = setingData[this.coinCode].poundageArray[0];
      this.valRate = setingData[this.coinCode].valRate;
      this.orderTypeHandle(null);
      this.resetData();
    },
    changeSwitch(check) {
      let req = this.orderData;
      if (check) {
        if (this.position == 1) {
          //跌
          if (this.isLoss) {
            this.inpLoss = priceFormat(
              Number(req.tradePrice) +
                Number((req.deposit * 0.8) / req.tradeAmount),
              this.coinPrecision
            );
          }
          if (this.isProfit) {
            this.inpProfit = priceFormat(
              req.tradePrice - (req.deposit * 0.8) / req.tradeAmount,
              this.coinPrecision
            );
          }
        } else {
          //涨
          if (this.isLoss) {
            this.inpLoss = priceFormat(
              req.tradePrice - (req.deposit * 0.8) / req.tradeAmount,
              this.coinPrecision
            );
          }
          if (this.isProfit) {
            this.inpProfit = priceFormat(
              Number(req.tradePrice) +
                Number((req.deposit * 0.8) / req.tradeAmount),
              this.coinPrecision
            );
          }
        }
      }
    },
    //页面显示数据
    DomData(tradePrice) {
      let req = {};
      //下单价格
      req.tradePrice = tradePrice;
      //保证金
      req.deposit = this.checkHand * this.checkCash;
      //委托量
      req.tradeAmount = this.checkHand * this.valRate;
      //杠杆倍数
      req.leverage = priceFormat((tradePrice * this.valRate) / this.checkCash);
      //手续费
      req.poundageAmount = priceFormat(
        (tradePrice * req.tradeAmount - req.deposit) * 0.003
      );
      //止盈止损函数
      let lossProfit = this.fullStop(req);
      this.inpLoss = lossProfit.inpLoss;
      this.inpProfit = lossProfit.inpProfit;
      this.orderData = req;
    },
    //页面显示预计盈亏
    exLossProfit(tradePrice, price) {
      //下单价与止盈止损的差值
      let chazhi = Math.abs(tradePrice - price);
      return priceFormat(chazhi * this.orderData.tradeAmount);
    },
    orderTypeHandle(type) {
      if (type != this.orderType) {
        let text = type ? "挂单" : "市价";
        switch (this.position) {
          case 0:
            text = `${text}买涨 `;
            break;
          case 1:
            text = `${text}买跌 `;
            break;
        }
        this.orderType = type ? type : 0;
        this.subBtnText = text;
      }
    },
    add(key) {
      this[key] = priceFormat(
        decimal.accAdd(Number(this[key]), this.coinData.tickSize),
        this.coinPrecision
      );
      if (key == "inpPrice") {
        this.DomData(this[key]);
      }
    },
    minus(key) {
      this[key] = priceFormat(
        decimal.accSubtr(Number(this[key]), this.coinData.tickSize),
        this.coinPrecision
      );
      if (key == "inpPrice") {
        this.DomData(this[key]);
      }
    },
    //页面显示止盈止损价
    fullStop(req) {
      let inpLoss, inpProfit;
      console.log(this.isLossProfit);
      if (this.position == 1) {
        //跌
        if (!this.isLoss) {
          inpLoss = priceFormat(
            Number(req.tradePrice) +
              Number((req.deposit * 0.8) / req.tradeAmount),
            this.coinPrecision
          );
        } else {
          inpLoss = this.inpLoss;
        }
        if (!this.isProfit) {
          inpProfit = priceFormat(
            req.tradePrice - (req.deposit * 0.8) / req.tradeAmount,
            this.coinPrecision
          );
        } else {
          inpProfit = this.inpProfit;
        }
      } else {
        //涨
        if (!this.isLoss) {
          inpLoss = priceFormat(
            req.tradePrice - (req.deposit * 0.8) / req.tradeAmount,
            this.coinPrecision
          );
        } else {
          inpLoss = this.inpLoss;
        }
        if (!this.isProfit) {
          inpProfit = priceFormat(
            Number(req.tradePrice) +
              Number((req.deposit * 0.8) / req.tradeAmount),
            this.coinPrecision
          );
        } else {
          inpProfit = this.inpProfit;
        }
      }
      return { inpLoss, inpProfit };
    },
    // 页面显示下单价格限制
    orderPic(position) {
      if (position) {
        return priceFormat(
          this.closePic + this.coinData.offset,
          this.coinPrecision
        );
      } else {
        return priceFormat(
          this.closePic - this.coinData.offset,
          this.coinPrecision
        );
      }
    },
    // 止盈止损限制值
    astrict(price, type) {
      if (this.position) {
        if (type) {
          return priceFormat(
            Number(price) - Number(this.coinData.offset) * 2,
            this.coinPrecision
          );
        } else {
          return priceFormat(
            Number(price) + Number(this.coinData.offset),
            this.coinPrecision
          );
        }
      } else {
        if (type) {
          return priceFormat(
            Number(price) + Number(this.coinData.offset),
            this.coinPrecision
          );
        } else {
          return priceFormat(
            Number(price) - Number(this.coinData.offset) * 2,
            this.coinPrecision
          );
        }
      }
    },
    //下单函数
    placeOrder(tradePrice) {
      let req = this.placeOrderData(tradePrice),
        url = "";
      if (this.tradeType) {
        url =
          this.orderType == 1
            ? "/v1/leverage/limited/submit"
            : "/v1/leverage/market/submit";
      } else {
        url =
          this.orderType == 1
            ? "/v1/mock/limit_trade"
            : "/v1/mock/market_trade";
      }

      this.$http({
        url: url,
        data: req,
        method: "post"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.succeedOrder(req);
          this.getBanlace();
        }
      });
    },
    //获取socket数据
    detail(data) {
      //   console.log(data);
    },
    //判断  市价  挂单
    isMarket() {
      let orderType = this.orderType + "";
      switch (orderType) {
        case "1":
          return true;
        case "0":
          return false;
      }
    },
    //判断类型 快捷  专业
    isSpecialty() {
      switch (this.title) {
        case "专业":
          return true;
        case "快捷":
          return false;
      }
    },
    //选择快捷还是专业
    Specialty() {
      this.title = this.title == "快捷" ? "专业" : "快捷";
      this.resetData();
    },
    //点击手数&保证金
    handClick(item, type) {
      this[type] = item;
      this.DomData(this.inpPrice);
    },
    //监听下单输入框
    changeTradePrice(val) {
      this.DomData(this.inpPrice);
    },
    //下单数据二次计算
    placeOrderData(tradePrice) {
      let req = {
        position: this.position, //交易方向0-涨 1-跌
        poundageAmount: 0, //手续费
        sourceCoin: "USDT", //交易货币
        targetCoin: this.coinCode, //目标货币
        tradeCode: `${this.coinCode}/USDT`, //交易对
        tradeType: this.orderType, //0-市价 1-限价
        userId: this.userInfo.userId
      };
      //是否过夜 0否 1是
      req.isDelay = this.isNight ? 1 : 0;
      //手数比例
      req.stockRate = this.valRate;
      //保证金
      req.deposit = this.checkHand * this.checkCash;
      //委托量
      req.tradeAmount = this.checkHand * this.valRate;
      //下单价格
      req.tradePrice = Number(tradePrice);
      //杠杆倍数
      req.leverage = Number(
        priceFormat((tradePrice * this.valRate) / this.checkCash)
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
    //下单按钮数字
    btnText() {
      let text = this.tradeType ? "市价" : "挂单";
      switch (this.position) {
        case 0:
          return `${text}买涨 `;
        case 1:
          return `${text}买跌 `;
      }
    },
    changeSelect(val) {
      this.resetData();
    },
    //切换 数据格式化
    resetData() {
      let tradePrice = this.initTradePrice(this.closePic);
      this.freeShow = false; //点击保证金
      this.isNight = false; //是否过夜
      this.isLossProfit = false; //是否设置盈损
      this.allCustom = false; //是否自己填入下单价格
      this.isProfit = false; //是否自己填入止盈价格
      this.isLoss = false; //是否自己填入止损价格
      this.inpPrice = tradePrice;
      this.DomData(tradePrice);
    },
    //initTradePrice 初始化下单价
    initTradePrice(tradePrice) {
      if (this.orderType == 1) {
        tradePrice =
          this.position == 1
            ? tradePrice + this.coinData.offset
            : tradePrice - this.coinData.offset;
      } else {
        tradePrice =
          this.position == 1 ? tradePrice * 1.0003 : tradePrice * 0.9997;
      }
      return priceFormat(tradePrice, this.coinPrecision);
    },
    ...mapActions(["getBanlace"])
  },
  watch: {
    closePic(val) {
      if (!this.allCustom) {
        let tradePrice = this.initTradePrice(val);
        this.inpPrice = tradePrice;
        this.DomData(tradePrice);
      }
    },
    $route(to) {
      this._initPage();
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
