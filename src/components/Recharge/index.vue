<template>
  <van-popup v-model="show" position="bottom">
    <div class="recharge">
      <div class="recharge_title">
        <p class="recharge_title_l">充值USDT</p>
        <p class="recharge_title_r">
          <span>单价：</span>
          <span class="size">≈{{ otcDetail.buyRate }}</span>
        </p>
      </div>
      <div class="recharge_scroll">
        <div class="recharge_cont">
          <p class="recharge_cont_title">购买数量(USDT):</p>
          <div class="List">
            <button
              v-for="item in numList"
              @click="checkNum(item)"
              :class="inpVal == item && 'active'"
              :key="item"
            >
              {{ item == "other" ? "其他" : item }}
            </button>
          </div>
        </div>
        <div class="recharge_num" @click="inpFocus">
          <input
            class="inp"
            type="text"
            ref="inpVal"
            placeholder="请输入金额(最少20)"
            v-model="inpVal"
            v-debounce="{
              fn: verify.bind(arguments),
              method: 'input'
            }"
          />
          <p class="recharge_num_r">
            <span>约需：</span>
            <span class="color-red"
              >￥{{ (inpVal * otcDetail.buyRate) | priceFormat }}</span
            >
          </p>
        </div>
        <div class="recharge_from" v-if="bankList.length">
          <div class="recharge_from_single">
            <p class="label">付款人姓名：</p>
            <input
              type="text"
              :value="currentBank.userName"
              placeholder="请输入付款人姓名"
              readonly
            />
          </div>
          <div class="recharge_from_single radioGroup">
            <p class="label">支付方式：</p>
            <ul>
              <li @click="changeRadio(1)">
                <p>
                  <img v-if="checkRdio == 1" :src="radios" alt />
                  <img v-else :src="radio" alt />
                </p>
                <p>银行卡</p>
              </li>
              <li @click="changeRadio(2)">
                <p>
                  <img v-if="checkRdio == 2" :src="radios" alt />
                  <img v-else :src="radio" alt />
                </p>
                <p>支付宝</p>
              </li>
            </ul>
          </div>
          <div class="recharge_from_single bank">
            <p class="label">银行卡号：</p>
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
          <div class="recharge_from_deal" @click="isCheckBox = !isCheckBox">
            <p class="checkbox">
              <img
                v-show="isCheckBox"
                src="~assets/Images/other/icon_check.png"
                alt
              />
            </p>
            <p>已阅读并同意&nbsp;</p>
            <p class="color-blue" @click.stop="toIntrod()">《OTC交易协议》</p>
          </div>
        </div>
        <div class="recharge_add" v-else>
          <button @click="toAddBank">
            <van-icon class="plus_icon" name="plus" /> 添加银行卡
          </button>
        </div>
        <div class="recharge_tips">
          <h2>注意事项</h2>
          <p>
            <span>1、</span>为了保证资金顺利到账，请务必在转账时输入转账附言
          </p>
          <p>
            <span>2、</span
            >请按照填写的姓名、付款金额、转账方式进行付款方可快速到账、否则资金将无法及时到账
          </p>
          <p>
            <span>3、</span
            >如果您的转账5分钟内未能到账，请您联系客服处理；订单的有效时间为20分钟，如您已转账但订单失效，请您联系客服处理
          </p>
        </div>
      </div>
      <div class="recharge_btn">
        <button @click="recharge" :disabled="isDisabled">确定</button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import NavBar from "components/NavBar";
import radio from "Images/other/icon_radio.png";
import radios from "Images/other/icon_radios.png";
import { radioList } from "common/staticData";
export default {
  data() {
    return {
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
      otcDetail: {},
      bankList: [],
      isDisabled: false
    };
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
      this.isClick();
    },

    //显示充值弹窗
    showSelf(item) {
      let _this = this;
      if (this.bankList.length) {
        this.show = true;
        this.otcDetail = item;
      } else {
        this.$dialog
          .confirm({
            title: "提示",
            message: "请先绑定银行卡",
            confirmButtonText: "去绑定",
            confirmButtonColor: "#2d9ef5"
          })
          .then(() => {
            _this.$router.push("/me/bank/add");
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    toAddBank() {
      this.$router.push("/me/bank/add");
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
    verify() {
      this.inpVal = this.inpVal.replace(/[^\d]/g, "");
      this.isClick(this.inpVal);
    },
    
    //是否可以点击充值按钮
    isClick(inpVal) {
      if (
        inpVal < this.otcDetail.sellMinAmount ||
        inpVal > this.otcDetail.sellMaxAmount
      ) {
        this.isDisabled = true;
        this.$toast("充值数量不符");
      } else {
        this.isDisabled = false;
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
    recharge() {
      if (this.currentBank.id) {
        this.$http({
          url: "/v1/position/otc/recharge-record-add",
          data: {
            coinAmount: this.inpVal,
            otcId: this.otcDetail.id,
            userCardId: this.currentBank.id,
            userName: "廉亚龙"
          },
          method: "post"
        }).then(res => {
          if (res.status == this.STATUS) {
            this.$router.push(`/me/fund/detail/${res.data.id}`);
            //   this.show = false;
          }
        });
      } else {
        this.$toast("请添加银行卡！");
      }
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
    //点击OTC协议
    toIntrod() {
      this.$router.push("/intord/otc_intord");
    },
    clickLeft() {
      this.$router.push("/otc");
    }
  }
};
</script>

<style lang="stylus">
@import './style';
</style>
