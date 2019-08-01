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
      loginData: { loginName: "", mobileCode: "", emailCode: "", type: 1 }
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
    //获取验证码
    getCode() {
      this.$http({
        url: "/auth/send_sms_all",
        data: { codeType: 1, loginName: this.loginData.loginName },
        method: "post"
      }).then(res => {
        console.log(res);
      });
    },
    //发送验证
    sendMsg() {
      this.isSend = true;
      let _this = this,
        num = 10;
      this.getCode();
      _this.timer = setInterval(() => {
        num--;
        if (num <= 0) {
          clearInterval(_this.timer);
          this.isSend = false;
          this.sendBtnText = "获取验证码";
        } else {
          this.sendBtnText = num + "S后重新获取";
        }
      }, 1000);
      this.sendBtnText = num + "S后重新获取";
    },
    ...mapActions(["updatedUserInfo", "getBanlace"])
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
