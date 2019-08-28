<template>
  <div class="login">
    <router-link tag="div" to="/register" class="title">{{
      $t("loginReg").reg
    }}</router-link>
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
        />
      </div>
      <div class="inp_group border-1px">
        <input
          type="text"
          :placeholder="$t('loginReg').codePlaceholder"
          v-model="loginData.mobileCode"
          @keyup.enter="login"
        />
        <button class="inp_group_right" :disabled="isSend" @click="sendMsg">
          {{ sendBtnText }}
        </button>
      </div>
      <button class="from_btn" @click="login">
        {{ $t("loginReg").login }}
      </button>
      <router-link tag="p" to="/login/pwd" class="from_check">{{
        $t("loginReg").pwdLogin
      }}</router-link>
    </div>
  </div>
</template>

<script>
import { setInterval, clearInterval } from "timers";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isClick: false, //登录按钮是否可点击
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

    ...mapActions(["updatedUserInfo", "getBanlace", "sendMsgComm"])
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
