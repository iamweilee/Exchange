<template>
  <van-popup v-model="show" position="bottom">
    <div class="withdraw">
      <div class="withdraw_title">
        <p class="withdraw_title_l">提币USDT</p>
        <p class="withdraw_title_r">
          <span>单价：</span>
          <span class="size">≈{{ buyRate }}</span>
        </p>
      </div>
      <div class="withdraw_scroll">
        <div class="withdraw_from">
          <div class="withdraw_from_single">
            <p class="label">账户余额：</p>
            <p>{{ usableBalance | priceFormat }}USDT</p>
          </div>
          <div class="withdraw_from_inp">
            <p class="withdraw_from_inp_left">提币数量：</p>
            <input
              class="withdraw_from_inp_middle"
              type="text"
              placeholder="最小可售20 USDT"
            />
            <p class="withdraw_from_inp_right">全部提出</p>
          </div>
          <div class="withdraw_from_deal" @click="isCheckBox = !isCheckBox">
            <p class="checkbox">
              <img
                v-show="isCheckBox"
                src="~assets/Images/other/icon_check.png"
                alt
              />
            </p>
            <p>
              您可以消耗
              <span class="color-blue">200.00CNC</span>
              ，实现30分钟内提币到账！
            </p>
          </div>
          <div class="withdraw_from_single bank">
            <p class="label">收款账户：</p>
            <div class="bankList">
              <van-collapse v-model="bankKey" accordion>
                <van-collapse-item name="bankList" v-if="bankList.length">
                  <template slot="title">
                    <p>{{ currentBank.bankName }}</p>
                    <p>{{ currentBank.bankAccount }}</p>
                  </template>
                  <div
                    class="bankSingle"
                    v-for="item in bankList"
                    :key="item.id"
                    @click="checkBankHandle(item)"
                  >
                    <div class="bankSingle_left">
                      <p>
                        {{ item.bankName }}
                      </p>
                      <p>
                        {{ item.bankAccount }}
                      </p>
                    </div>
                    <van-icon
                      color="#00a7e0"
                      size="0.32rem"
                      v-show="item.id == currentBank.id"
                      name="success"
                    />
                  </div>
                </van-collapse-item>
              </van-collapse>
            </div>
          </div>
        </div>
        <div class="withdraw_tips">
          <h2>注意事项</h2>
          <p><span>1、</span>工作日提币24小时内到账，节假日顺延到工作日；</p>
          <p>
            <span>2、</span
            >未交易用户提币将收取一定手续费，手续费将从到账金额中扣除。
          </p>
        </div>
      </div>
      <div class="withdraw_btn">
        <button @click="withdrawPost" :disabled="isDisabled">出售</button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import NavBar from "components/NavBar";
import radio from "Images/other/icon_radio.png";
import radios from "Images/other/icon_radios.png";
import { radioList } from "common/staticData";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      buyRate: 7,
      currentBank: {},
      bankKey: "",
      radioList: radioList,
      radio: radio,
      radios: radios,
      checkRdio: 1,
      isCheckBox: true,
      show: false,
      inpVal: 1000,
      numList: [2000, 1000, 500, 100, 50, "other"],
      otcId: 1,
      bankList: [],
      isDisabled: false
    };
  },
  computed: {
    ...mapGetters(["usableBalance"])
  },
  mounted() {
    this._initPage();
  },
  components: {
    NavBar
  },
  methods: {
    //初始化函数
    _initPage() {
      this.getBankList();
    },

    //显示充值弹窗
    showSelf(item) {
      this.show = true;
      this.otcId = item.id;
      this.buyRate = item.buyRate;
    },
    //选择数量按钮
    checkNum(num) {
      if (num == "other") {
        this.inpFocus();
      } else {
        this.inpVal = num;
      }
    },
    //自动聚焦数量点击其他
    inpFocus() {
      this.$refs.inpVal.focus();
    },
    verify(type) {
      this.inpVal = this.inpVal.replace(/[^\d]/g, "");
      if (
        this.inpVal < this.otcDetail.sellMinAmount ||
        this.inpVal > this.otcDetail.sellMaxAmount
      ) {
        this.isDisabled = true;
      }
    },
    //是否可以点击充值按钮
    isClick() {
      if (
        this.inpVal < this.otcDetail.sellMinAmount ||
        this.inpVal > this.otcDetail.sellMaxAmount
      ) {
        this.isDisabled = true;
      }
    },
    //选择银行卡列表
    checkBankHandle(item) {
      if (item.id !== this.currentBank.id) {
        this.bankKey = "";
        this.currentBank = item;
      } else {
        return;
      }
    },
    //选择支付方式
    changeRadio(type) {
      this.checkRdio = type;
    },
    //充值接口
    withdrawPost() {
      this.$http({
        url: "/v1/position/otc/draw-record-add",
        data: {
          coinAmount: this.inpVal,
          otcId: this.otcId,
          userCardId: this.currentBank.id,
          userName: "廉亚龙"
        },
        method: "post"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.getBanlace();
          this.$router.push(`/me/fund/detail/${res.data.id}`);
        }
      });
    },
    //获取银行卡列表
    getBankList() {
      this.$http({ url: "/v1/user/card/list", method: "get" }).then(res => {
        if (res.status == this.STATUS) {
          this.currentBank = res.data[0];
          this.bankList = res.data;
        }
      });
    },

    clickLeft() {
      this.$router.push("/otc");
    },
    ...mapActions(["getBanlace"])
  }
};
</script>

<style lang="stylus">
@import './style';
</style>
