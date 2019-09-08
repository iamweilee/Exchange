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
          <p class="inpVal"><van-icon name="plus"></van-icon> 新建地址</p>
          <p class="select_btn"><van-icon name="arrow"></van-icon></p>
        </div>
      </div>
      <div class="from_single border">
        <p class="label">提币数量：</p>
        <input
          type="text"
          class="inp"
          v-model="inpVal"
          placeholder="最小提币单位为300USDT"
        />
      </div>
      <div class="from_single">
        <p class="label">提币手续费：</p>
        <p class="inp">{{ inpVal ? inpVal * 0.05 : "" }}</p>
      </div>
      <div class="from_single">
        <p class="label">实际到账数：</p>
        <p class="inp">{{ inpVal ? inpVal * 0.95 : "" }}</p>
      </div>
      <div class="from_single  border">
        <p class="label">短信验证码：</p>
        <input type="text" class="inp" />
        <button class="sendMsg" :disabled="isSend" @click="sendMsg">
          {{ sendBtnText }}
        </button>
      </div>
    </div>
    <button class="okBtn" @click="getAddress">确定提币</button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      inpVal: 0,
      isSend: false, //发送验证码按钮是否可点击
      sendBtnText: "获取验证码",
      timer: null
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  mounted() {
    // this.getAddress();
  },
  methods: {
    getAddress() {
      this.$http({
        url: "/v1/position/draw",
        method: "post",
        data: {
          coinCode: "USDT",
        //   drawAdd: "1KM3y5DxRNVj9LhG9crdcxm4L6QXGN1TpZ",me
          drawAdd: "1DdXF2uBepRbW647kiZKp33xQej8oHbo3q",
          drawAmount: 5,
          validateType: "0"
        }
      }).then(res => {
        console.log(res);
      });
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
      this.$router.push("/withdraw/address");
    },
    ...mapActions(["sendMsgComm"])
  }
};
</script>
