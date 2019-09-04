<template>
  <div class="phone">
    <div class="inp_group border-1px">
      <input
        type="text"
        :placeholder="$t('loginReg').emailPlaceholder"
        v-model="fromData.email"
      />
    </div>
    <div class="inp_group border-1px">
      <input
        type="text"
        :placeholder="$t('loginReg').codePlaceholder"
        v-model="fromData.code"
      />
      <button class="inp_group_right" :disabled="isSend" @click="sendMsg">
        {{ sendBtnText }}
      </button>
    </div>
    <div class="inp_group border-1px">
      <input
        type="password"
        placeholder="输入账户密码"
        v-model="fromData.pwd"
      />
      <p class="inp_tips">* 6 - 20 位数字，字母，下划线组合</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { isEmail } from "common/TollClass/func";
export default {
  data() {
    return {
      isSend: false, //发送验证码按钮是否可点击
      sendBtnText: "获取验证码",
      timer: null,
      fromData: {
        email: "",
        code: "",
        pwd: ""
      }
    };
  },
  destroyed() {
    clearInterval(this.timer);
  },
  components: {},
  methods: {
    //发送验证
    sendMsg() {
      let _this = this,
        errEmail = isEmail(_this.fromData.email);
      if (errEmail) {
        this.$toast(errEmail);
        return;
      }
      this.sendMsgComm({
        loginName: _this.fromData.email,
        codeType: 2,
        fn: _this.$timeSet.bind("regEmail", _this)
      });
    },
    ...mapActions(["sendMsgComm"])
  }
};
</script>

<style scoped lang="stylus">
@import '~assets/stylus/variable.styl';
.phone {
  width: 100%;
  padding: 0 28px;
  .inp_group {
    border-1px($color12, 100%);
    height: 72px;
    font-size: 16px;
    margin-bottom: 1px;
    padding-left: 2px;
    width: 100%;
    input {
      width: 100%;
      height: 100%;
      border: none;
      placeholderColor($color9);
      font-size: 18px;
      &.pl {
        padding-left: 50px;
      }
    }
    &_left {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: 50px;
      span {
        color: $color6;
        font-size: 18px;
      }
      img {
        margin-left: 6px;
        width: 6px;
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
}
</style>
