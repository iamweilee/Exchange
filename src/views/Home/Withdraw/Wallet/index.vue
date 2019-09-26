<template>
  <div class="wallet">
    <div class="wallet_tip">
      <van-icon name="warning-o" color="#F93c34" size="0.24rem" />
      温馨提示：申请提币之前请您确认提币地址是否正确，交易一旦发送到区块链网络便不可撤回，USDT当日最多可提3次。
    </div>
    <div class="wallet_from">
      <div class="from_single">
        <p class="label">提币地址：</p>
        <div class="cont" @click="toAddress">
          <div class="inpVal" v-if="drawSite.drawAdd">
            <p>{{ drawSite.drawAdd }}</p>
            <p>{{ drawSite.remarks }}</p>
          </div>
          <p class="inpVal" v-else>
            <van-icon name="plus"></van-icon
            >{{ addList.length ? "选择" : "新建" }}地址
          </p>
          <p class="select_btn"><van-icon name="arrow"></van-icon></p>
        </div>
      </div>
      <div class="from_single border">
        <p class="label">提币数量：</p>
        <input
          type="text"
          class="inp"
          v-model="inpVal"
          v-debounce="{
            fn: verify,
            method: 'input'
          }"
          placeholder="最小提币单位为300USDT"
        />
      </div>
      <div class="from_single">
        <p class="label">提币手续费：</p>
        <p class="inp">{{ freeNum(inpVal) }}</p>
      </div>
      <div class="from_single">
        <p class="label">实际到账数：</p>
        <p class="inp">{{ freeNum(inpVal, "free") }}</p>
      </div>
      <div class="from_single  border">
        <p class="label">短信验证码：</p>
        <input
          type="text"
          class="inp"
          v-model="msgCode"
          v-debounce="{
            fn: verify,
            method: 'input'
          }"
        />
        <button class="sendMsg" :disabled="isSend" @click="sendMsg">
          {{ sendBtnText }}
        </button>
      </div>
    </div>
    <button class="okBtn" :disabled="isClick" @click="getAddress">
      确定提币
    </button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { priceFormat } from "common/utli";
import { isCode, isNum } from "common/TollClass/func";
export default {
  data() {
    return {
      msgCode: "",
      inpVal: 0,
      isSend: false, //发送验证码按钮是否可点击
      sendBtnText: "获取验证码",
      timer: null,
      isClick: true,
      addList: [],
      drawSite: this.$lStore.get("drawSite") || {}
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  mounted() {
    this.getAddressList();
  },
  methods: {
    getAddressList() {
      this.$http({ url: "/v1/user/draw_address/USDT", method: "get" }).then(
        res => {
          if (res.status == this.STATUS) {
            this.addList = res.data;
          }
        }
      );
    },
    getAddress() {
      if (this.drawSite) {
        this.$http({
          url: "/v1/position/draw",
          method: "post",
          data: {
            validateType: 0,
            checkType: 11,
            mobile: this.userInfo.mobile,
            coinCode: "USDT",
            drawAdd: this.drawSite.drawAdd, //me
            drawAmount: Number(this.inpVal),
            mark: "提现到钱包",
            validatePwd: this.msgCode,
            tradePwd: "123456"
          }
        }).then(res => {
          if (res.status == this.STATUS) {
            // this.$toast("提币申请成功");
            let _this = this;
            this.$dialog
              .confirm({
                message: "提币申请成功",
                confirmButtonText: "查看订单",
                cancelButtonText: "继续提币"
              })
              .then(() => {
                _this.$router.push("/me/fund/wallet/draw");
                // on confirm
              })
              .catch(() => {
                // on cancel
                this.inpVal = 0;
                this.msgCode = "";
              });
          }
        });
      } else {
        this.$toast("请选择提币地址");
      }
    },
    verify() {
      let errCode = isCode(this.msgCode),
        errInp = isNum(this.inpVal);
      errCode || errInp ? (this.isClick = true) : (this.isClick = false);
    },
    freeNum(num, type) {
      num = Number(num);
      if (!num) {
        return;
      } else {
        console.log(num);
        if (type) {
          return priceFormat(num * 0.05);
        } else {
          return priceFormat(num * 0.95);
        }
      }
    },
    //发送验证
    sendMsg() {
      console.log(1);
      let _this = this;
      this.sendMsgComm({
        loginName: this.userInfo.mobile,
        codeType: 11,
        areaCode: "86",
        fn: _this.$timeSet.bind("withdraw", _this)
      });
    },
    toAddress() {
      if (this.addList.length) {
        this.$router.push("/withdraw/list");
      } else {
        this.$router.push("/withdraw/address");
      }
    },
    ...mapActions(["sendMsgComm"])
  }
};
</script>
