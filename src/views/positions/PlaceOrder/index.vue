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
            <p>
              价格≥{{ orderPic(1) | toFixeds }}&nbsp;或&nbsp;价格≤{{
                orderPic(0) | toFixeds
              }}
            </p>
          </div>
          <div class="from_single_cont">
            <div class="box" @click="allCustom = true">
              <input type="number" :value="inpPrice | toFixeds" />
              <img class="minus" src="~assets/Images/pos/icon_minus.png" alt />
              <img class="add" src="~assets/Images/pos/icon_add.png" alt />
            </div>
          </div>
        </div>
        <div class="from_single">
          <div class="from_single_label">
            <p>手数</p>
            <p>价值{{ checkHand * valRate }}个{{ coinCode }}</p>
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
                ((closePic * valRate) / checkCash) | toFixeds
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
              止盈止损
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
              <div class="left">止损价</div>
              <div class="box small">
                <input
                  type="text"
                  :value="
                    ((checkCash * checkHand * 0.8) / valRate +
                      closePic * 1.0008)
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
                  ≥<em>{{
                    ((checkCash * checkHand * 0.8) / valRate +
                      closePic * 1.0008)
                      | toFixeds
                  }}</em>
                  预计亏损约
                  <em>{{ checkCash * checkHand * 0.8 }}</em>
                </p>
              </div>
            </div>
            <div class="from_single_cont_single">
              <div class="left">止盈价</div>
              <div class="box small">
                <input
                  type="text"
                  :value="
                    (closePic * 1.0008 -
                      (checkCash * checkHand * 0.8) / valRate)
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
                  ≤<em>{{
                    (closePic * 1.0008 -
                      (checkCash * checkHand * 0.8) / valRate)
                      | toFixeds
                  }}</em>
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
              持仓过夜
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
              7.10（已优惠）<img
                :class="freeShow && 'rotate'"
                src="~assets/Images/pos/icon_down.png"
                alt
              />
            </p>
          </div>
          <div class="from_single_free" v-show="freeShow">
            <p>原价</p>
            <p>7.10</p>
          </div>
        </div>
      </div>
    </div>
    <div class="submit_btn">
      <button :class="position && 'active'" @click="placeOrder(closePic)">
        {{ this.btnText() }}{{ closePic }}
      </button>
    </div>
  </div>
</template>

<script>
import Select from "components/Select";
import { mapState, mapGetters } from "vuex";
import { toFixeds } from "common/utli";
import { setTimeout } from "timers";
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
    }
  },
  data() {
    return {
      inpPrice: 0,
      checkHand: 2,
      valRate: 1,
      checkCash: 200,
      handList: this.$lStore.get("setingData").nums,
      cashList: [],
      values: ["市价", "挂单"],
      value: "挂单",
      freeShow: false,
      isNight: false,
      isLoss: false,
      title: "快捷",
      allCustom: false
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
      this.inpPrice = this.closePic;
    },
    btnText() {
      switch (this.position) {
        case 0:
          return `${this.value}买涨 `;
        case 1:
          return `${this.value}买跌 `;
      }
    },
    //下单函数
    placeOrder(closePic) {
      console.log(closePic);
      let req = {
        //   dealAmount: 12,//成交量
        //   dealPrice: 198,//成交价
        deposit: this.checkHand * this.checkCash, //保证金
        isDelay: 0, //是否过夜 0否 1是
        // leverage: 19, //杠杆倍数
        position: 0, //交易方向0-涨 1-跌
        poundageAmount: 18.4, //手续费
        //   matUserId: 1,//垫资账户id
        sourceCoin: "USDT", //交易货币
        stockRate: this.valRate, //手数比例
        // stopLoss: 190, //止损
        // stopProfit: 206, //止盈
        targetCoin: this.coinCode, //目标货币
        tradeAmount: this.checkHand * this.valRate, //委托量
        // tradePrice: 198, //委托价
        tradeCode: `${this.coinCode}/USDT`, //交易对
        tradeType: 0, //0-市价 1-限价
        userId: this.userInfo.userId
      };
      //   ((closePic * checkHand * valRate) / (checkCash * checkHand))

      req.leverage = toFixeds((closePic * this.valRate) / this.checkCash, 4);
      //   req.poundageAmount = toFixeds(0.8 * 10 + closePic);
      req.tradePrice = toFixeds(closePic * 1.008, 4);
      //止盈
      req.stopProfit = toFixeds(
        closePic + (0.8 * this.checkCash * this.checkHand) / this.valRate,
        4
      );
      //止损
      req.stopLoss = toFixeds(
        closePic - (0.8 * this.checkCash * this.checkHand) / this.valRate,
        4
      );

      console.log(req);
        this.$http({
          url: "/v1/leverage/market/submit",
          data: req,
          method: "post"
        }).then(res => {
          console.log(res);
        });
    },
    //获取socket数据
    detail(data) {
      //   console.log(data);
    },
    //判断  市价  挂单
    isMarket() {
      switch (this.value) {
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
        return this.closePic * 1.008;
      } else {
        return this.closePic * 0.992;
      }
    },
    handClick(item, type) {
      this[type] = item;
    }
  },
  watch: {
    closePic(val) {
      if (!this.allCustom) {
        this.inpPrice = val;
      }
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
