<template>
  <div class="forget">
    <NavBar title="忘记密码" showL fixed @clickLeft="clickLeft" />

    <div class="from">
      <div class="inp_group border-1px">
        <input
          v-debounce="{
          fn: verify,
          method: 'input'
        }"
          v-model="resetData.loginName"
          type="text"
          placeholder="输入手机号/邮箱账号"
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
        <button class="inp_group_right" :disabled="isSend" @click="sendMsg">{{ sendBtnText }}</button>
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
      <button class="from_btn" v-debounce="{
        fn: resetPwd
      }" :disabled="isClick">确定</button>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import { isAccount, isPwd, isCode } from "common/utli";
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
        codeType: 7
      }
    };
  },
  destroyed() {
    clearInterval(this.timer);
  },
  components: { NavBar },
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
          this.clickLeft();
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
    //发送验证
    sendMsg() {
      let _this = this;
      this.sendMsgComm({
        loginName: this.resetData.loginName,
        codeType: 7,
        fn: _this.$timeSet.bind("edit", _this)
      });
    },
    clickLeft() {
      this.$router.push("/login/pwd");
    },
    ...mapActions(["sendMsgComm"])
  }
};
</script>

<style scoped lang="stylus">
@import '~assets/stylus/variable.styl';
.forget {
  .from {
    background-color: $write;
    padding: 14px 28px;
    subScroll();
    .inp_group {
      border-1px($color12, 100%);
      height: 72px;
      font-size: 16px;
      margin-bottom: 1px;
      padding-left: 2px;
      input {
        width: 100%;
        height: 100%;
        border: none;
        placeholderColor($color9);
        font-size: 18px;
        &:disabled {
          background-color: transparent;
          cursor: not-allowed;
        }
      }
      &_right {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        line-height: 64px;
        padding: 6px;
        color: $color6;
        font-size: 14px;
        border: none;
        background: transparent;
        &:disabled {
          color: $blue;
        }
      }
    }
    &_btn {
      margin-top: 50px;
      width: 319px;
      height: 44px;
      background-color: $btnBg;
      background-size: 100% 100%;
      border: none;
      color: $write;
      font-size: 16px;
      line-height: 44px;
      border-radius: 4px;
      &:disabled {
        background-color: $disBtn;
      }
    }
    &_tips {
      padding-top: 10px;
      color: $blue;
      font-size: 14px;
    }
  }
}
</style>
