<template>
  <div class="order">
    <ul class="order_title">
      <li class="order_title_l">
        <img src="~assets/Images/pos/icon_explain.png" alt />
      </li>
      <li class="order_title_m">{{ title }}下单</li>
      <li class="order_title_r" @click="cloeModle">
        <img src="~assets/Images/pos/icon_close.png" alt />
      </li>
    </ul>
    <div class="order_scroll">
      <div class="order_handle">
        <p
          class="order_handle_l"
          v-debounce="{
            fn: Specialty
          }"
        >
          切换至专业版
          <img src="~assets/Images/pos/icon_zy.png" alt />
        </p>
        <div class="order_handle_r">
          <Select v-model="value" :values="values"></Select>
        </div>
      </div>
      <div class="order_form">
        <div class="from_single" v-if="isMarket()">
          <div class="from_single_label">
            <p>挂单价格</p>
            <p>价格≥{{ orderPic(1) }}&nbsp;或&nbsp;价格≤{{ orderPic(0) }}</p>
          </div>
          <div class="from_single_cont">
            <div class="box" @click="allCustom = true">
              <input type="number" v-model="inpPrice" />
              <img class="minus" src="~assets/Images/pos/icon_minus.png" alt />
              <img class="add" src="~assets/Images/pos/icon_add.png" alt />
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
                v-for="item in handList"
                :key="item"
                :class="item == checkHand && 'active'"
                @click="handClick(item, 'checkHand')"
              >
                {{ item }}手
              </button>
            </div>
          </div>
        </div>
        <div class="from_single">
          <div class="from_single_label">
            <p>保证金(USDT)</p>
            <p>
              可用&nbsp;{{ usableBalance | priceFormat }}&nbsp;USDT，杠杆约{{
                orderData.leverage
              }}X
            </p>
          </div>
          <div class="from_single_cont">
            <div class="hand cash">
              <button
                v-for="item in cashList"
                :key="item"
                :class="item == checkCash && 'active'"
                @click="handClick(item, 'checkCash')"
              >
                {{ item * checkHand }}
              </button>
            </div>
          </div>
        </div>

        <div class="from_single" v-if="isSpecialty()">
          <div class="from_single_label big">
            <div class="left">
              {{ $t("stopProfit") + $t("stopLoss") }}
            </div>
            <p>
              <van-switch
                v-model="isLoss"
                active-color="#2D9FFE"
                inactive-color="#DEDEDE"
                size="0.5rem"
              />
            </p>
          </div>
          <div class="from_single_cont" v-show="isLoss">
            <div class="from_single_cont_single">
              <div class="left">{{$t('chat').lossPrice}}</div>
              <div class="box small">
                <input
                  type="text"
                  :value="
                    ((checkCash * checkHand * 0.8) / valRate + closePic)
                      | toFixeds
                  "
                />
                <img
                  class="minus"
                  src="~assets/Images/pos/icon_minus.png"
                  alt
                />
                <img class="add" src="~assets/Images/pos/icon_add.png" alt />
                <p class="box-size">
                  ≥<em>{{ (closePic * 1.002) | toFixeds }}</em>
                  预计亏损约
                  <em>{{ checkCash * checkHand * 0.8 }}</em>
                </p>
              </div>
            </div>
            <div class="from_single_cont_single">
              <div class="left">{{$t('chat').profitPrice}}</div>
              <div class="box small">
                <input
                  type="text"
                  :value="
                    (closePic - (checkCash * checkHand * 0.8) / valRate)
                      | toFixeds
                  "
                />
                <img
                  class="minus"
                  src="~assets/Images/pos/icon_minus.png"
                  alt
                />
                <img class="add" src="~assets/Images/pos/icon_add.png" alt />
                <p class="box-size">
                  ≤<em>{{ (closePic * 0.998) | toFixeds }}</em>
                  预计盈利约
                  <em>{{ checkCash * checkHand * 0.8 }}</em>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="from_single" v-if="isSpecialty()">
          <div class="from_single_label big">
            <div class="left">
              {{$t("night")}}
              <p class="icon_size">
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
              {{ orderData.poundageAmount }}（已优惠0）<img
                :class="freeShow && 'rotate'"
                src="~assets/Images/pos/icon_down.png"
                alt
              />
            </p>
          </div>
          <div class="from_single_free" v-show="freeShow">
            <p>原价</p>
            <p>
              {{ orderData.poundageAmount }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="submit_btn">
      <button :class="position && 'active'" @click="placeOrder(closePic)">
        <!-- <button :class="position && 'active'" @click="showSucceed = true"> -->
        {{ this.btnText() }}{{ inpPrice }}
      </button>
    </div>
  </div>
</template>

<script>
import Select from "components/Select";
import { mapState, mapGetters } from "vuex";
import { toFixeds } from "common/utli";
export default {
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
    cloeModle: {
      type: Function,
      default: () => {
        console.log("close");
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
      inpPrice: 0,
      checkHand: 2, //选择手数
      valRate: 1, //手数比
      checkCash: 200, //保证金
      handList: this.$lStore.get("setingData").nums,
      cashList: [],
      values: [{ text: "市价", value: 0 }, { text: "挂单", value: 1 }],
      value: { text: "市价", value: 0 },
      freeShow: false, //点击保证金
      isNight: false, //是否过夜
      isLoss: false, //是否设置盈损
      title: "快捷",
      allCustom: false,
      orderData: {}
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    ...mapGetters(["usableBalance"])
  },
  mounted() {
    this._initPage();
  },
  components: { Select },
  methods: {
    _initPage() {
      let setingData = this.$lStore.get("setingData");
      this.cashList = setingData[this.coinCode].poundageArray;
      this.checkCash = setingData[this.coinCode].poundageArray[0];
      this.valRate = setingData[this.coinCode].valRate;
      this.inpPrice = toFixeds(this.closePic * 1.0006);
      this.initData(this.closePic);
    },
    initData(closePic) {
      let req = {
        isDelay: 0, //是否过夜 0否 1是
        position: this.position, //交易方向0-涨 1-跌
        poundageAmount: 0, //手续费
        sourceCoin: "USDT", //交易货币
        targetCoin: this.coinCode, //目标货币
        tradeCode: `${this.coinCode}/USDT`, //交易对
        tradeType: this.value.value, //0-市价 1-限价
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
      //委托价
      req.tradePrice = req.tradeType
        ? this.inpPrice
        : toFixeds(closePic * 1.0006);
      //杠杆倍数
      req.leverage = toFixeds((closePic * this.valRate) / this.checkCash);
      //手续费
      req.poundageAmount = toFixeds(
        (closePic * req.tradeAmount - req.deposit) * 0.003
      );
      let priceCom = 0;
      //限价
      if (req.tradeType == 1) {
        priceCom = this.inpPrice;
      } else {
        //市价
        priceCom = closePic;
      }
      //止盈
      req.stopProfit = toFixeds(priceCom - (0.8 * req.deposit) / this.valRate);
      //止损
      req.stopLoss = toFixeds(priceCom + (0.8 * req.deposit) / this.valRate);

      this.orderData = req;
      return req;
    },
    btnText() {
      switch (this.position) {
        case 0:
          return `${this.value.text}买涨 `;
        case 1:
          return `${this.value.text}买跌 `;
      }
    },
    //下单函数
    placeOrder(closePic) {
      let req = this.initData(closePic);
      //   console.log(JSON.stringify(req));
      let url =
        this.value.value == 1
          ? "/v1/leverage/limited/submit"
          : "/v1/leverage/market/submit";
      this.$http({
        url: url,
        data: req,
        method: "post"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.succeedOrder(req);
        }
        console.log(res);
      });
    },
    //获取socket数据
    detail(data) {
      //   console.log(data);
    },
    //判断  市价  挂单
    isMarket() {
      switch (this.value.text) {
        case "挂单":
          return true;
        case "市价":
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
    },
    // 下单价格限制
    orderPic(position) {
      if (position) {
        return toFixeds(this.closePic * 1.0006);
      } else {
        return toFixeds(this.closePic * 0.9994);
      }
    },
    handClick(item, type) {
      this[type] = item;
    }
  },
  watch: {
    closePic(val) {
      this.initData(val);
      if (!this.allCustom) {
        console.log(val);
        this.inpPrice = toFixeds(val * 1.0006);
      }
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
