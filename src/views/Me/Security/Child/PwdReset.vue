<template>
  <div class="from">
    <div class="inp_group border-1px">
      <input
        v-debounce="{
          fn: verify,
          method: 'input'
        }"
        v-model="resetData.loginName"
        type="text"
        placeholder="请输入手机号"
      />
    </div>
    <div class="inp_group border-1px">
      <input
        v-debounce="{
          fn: verify,
          method: 'input'
        }"
        v-model="resetData.vertifyCode"
        type="text"
        placeholder="输入验证码"
      />
      <button class="inp_group_right" :disabled="isSend" @click="sendMsg">
        {{ sendBtnText }}
      </button>
    </div>
    <div class="inp_group border-1px">
      <input
        v-debounce="{
          fn: verify,
          method: 'input'
        }"
        v-model="resetData.password"
        type="password"
        placeholder="请设置新密码"
      />
    </div>
    <p class="from_tips">* 6 - 16 位字母和数字组成</p>
    <button
      class="from_btn"
      v-debounce="{
        fn: resetPwd
      }"
      :disabled="isClick"
    >
      登录
    </button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isClick: true,
      isSend: false, //发送验证码按钮是否可点击
      sendBtnText: "获取验证码",
      timer: null,
      resetData: {
        vertifyCode: "",
        password: "",
        loginName: this.$store.state.userInfo.loginName,
        codeType: 3
      }
    };
  },
  components: {},
  methods: {
    resetPwd() {
      console.log(this.resetData);
      let resetData = JSON.parse(JSON.stringify(this.resetData));
      resetData.password = this.$md5(resetData.password);
      this.$http({
        url: "/auth/find_pwd",
        data: resetData,
        method: "put"
      }).then(res => {
        console.log(res);
        this.getUserInfo();
      });
    },
    verify() {
      this.resetData.vertifyCode.trim() && this.resetData.loginName.trim()
        ? (this.isClick = false)
        : (this.isClick = true);
    },
    //发送验证
    sendMsg() {
      let _this = this;
      this.sendMsgComm({
        loginName: this.emailPhone,
        codeType: 7,
        fn: _this.$timeSet.bind("edit", _this)
      });
    },
    ...mapActions(["sendMsgComm"])
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
