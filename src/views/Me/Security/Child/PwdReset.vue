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
    <p class="from_tips">* 6 - 20 位数字，字母，下划线组合</p>
    <button
      class="from_btn"
      v-debounce="{
        fn: resetPwd
      }"
      :disabled="isClick"
    >
      重置密码
    </button>
  </div>
</template>

<script>
import { isAccount, isPwd, isCode } from "common/TollClass/func";
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
  destroyed() {
    clearInterval(this.timer);
  },
  components: {},
  methods: {
    resetPwd() {
      let resetData = JSON.parse(JSON.stringify(this.resetData));
      resetData.password = this.$md5(resetData.password);
      this.$http({
        url: "/auth/find_pwd",
        data: resetData,
        method: "put"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.loginOut();
        }
      });
    },
    verify() {
      let codeStr = isCode(this.resetData.vertifyCode),
        loginNameStr = isAccount(this.resetData.loginName),
        pwdStr = isPwd(this.resetData.password);
      codeStr || loginNameStr || pwdStr
        ? (this.isClick = true)
        : (this.isClick = false);
    },
    loginOut() {
      this.$http({ url: "/v1/user/login_out", method: "post" })
        .then(res => {
          if (res.status == this.STATUS) {
            this.$lStore.remove("token");
            this.updatedUserInfo("");
            this.updatedBanlace("");
            this.$router.push("/login");
          }
        })
        .catch(err => {
          this.$lStore.remove("token");
          this.updatedUserInfo("");
          this.updatedBanlace("");
          this.$router.push("/login");
        });
    },
    //发送验证
    sendMsg() {
      let _this = this;
      this.sendMsgComm({
        loginName: this.resetData.loginName,
        codeType: 3,
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
