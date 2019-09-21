<template>
  <div class="login">
    <div class="title">
      <router-link to="/" tag="p" class="left">{{
        $t("tabNav").home
      }}</router-link>
      <router-link to="/register" tag="p" class="right">{{
        $t("loginReg").reg
      }}</router-link>
    </div>
    <div class="login_wrap">
      <div class="size">
        <p class="size_top">{{ $t("loginReg").niHao }}</p>
        <div class="tab">
          <p class="tab_size">{{ $t("loginReg").welcome }}</p>
        </div>
      </div>
      <div class="from">
        <div class="inp_group border-1px">
          <input
            type="text"
            :placeholder="$t('loginReg').regPlaceholder"
            v-model="loginData.loginName"
            v-debounce="{
              fn: verify,
              method: 'input'
            }"
          />
        </div>
        <div class="inp_group border-1px">
          <input
            type="text"
            :placeholder="$t('loginReg').codePlaceholder"
            v-model="loginData.mobileCode"
            maxlength="6"
            @keyup.enter="login"
            v-debounce="{
              fn: verify,
              method: 'input'
            }"
          />
          <button class="inp_group_right" :disabled="isSend" @click="sendMsg">
            {{ sendBtnText }}
          </button>
        </div>
        <button class="from_btn" :disabled="isClick" @click="login">
          {{ $t("loginReg").login }}
        </button>
        <router-link tag="p" to="/login/pwd" class="from_check">{{
          $t("loginReg").pwdLogin
        }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { isAccount, isCode } from "common/utli";
export default {
  data() {
    return {
      isClick: true, //登录按钮是否可点击
      isSend: false, //发送验证码按钮是否可点击
      sendBtnText: "获取验证码",
      timer: null,
      activeClass: "phone",
      type: this.$route.params.type,
      loginData: {
        loginName: "",
        mobileCode: "",
        emailCode: "",
        type: 1
      }
    };
  },
  mounted() {},
  destroyed() {
    clearInterval(this.timer);
  },
  components: {},
  methods: {
    login() {
      this.loginData.emailCode = this.loginData.mobileCode;
      this.$http({
        url: "/auth/authorize",
        data: this.loginData,
        method: "put",
        pro: true
      }).then(res => {
        if (res.status == this.STATUS) {
          this.$lStore.set("token", res.data.token);
          this.updatedUserInfo(res.data);
          this.getBanlace();
          this.$router.push("/");
        }
      });
    },
    //发送验证
    sendMsg() {
      let _this = this;
      this.sendMsgComm({
        loginName: this.loginData.loginName,
        codeType: 1,
        areaCode: "86",
        fn: _this.$timeSet.bind("regPhone", _this)
      });
    },
    verify() {
      let codeStr, loginNameStr;
      codeStr = isCode(this.loginData.mobileCode);
      loginNameStr = isAccount(this.loginData.loginName);
      codeStr || loginNameStr ? (this.isClick = true) : (this.isClick = false);
    },
    ...mapActions(["updatedUserInfo", "getBanlace", "sendMsgComm"])
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
