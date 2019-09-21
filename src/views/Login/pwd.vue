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
            type="password"
            :placeholder="$t('loginReg').pwdPlaceholder"
            v-model="loginData.loginPwd"
            @keyup.enter="login"
            v-debounce="{
              fn: verify,
              method: 'input'
            }"
          />
        </div>
        <button :disabled="isClick" class="from_btn" @click="login">
          {{ $t("loginReg").login }}
        </button>
        <router-link tag="p" to="/login" class="from_check">{{
          $t("loginReg").codeLogin
        }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { isAccount, isPwd } from "common/utli";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isClick: true, //登录按钮是否可点击
      isSend: false, //发送验证码按钮是否可点击
      sendBtnText: "获取验证码",
      timer: null,
      activeClass: "phone",
      loginData: {
        loginName: "",
        loginPwd: ""
      }
    };
  },
  mounted() {},
  components: {},
  methods: {
    login() {
      let req = {
        loginName: this.loginData.loginName,
        loginPwd: this.$md5(this.loginData.loginPwd),
        type: 0
      };
      this.$http({
        url: "/auth/authorize",
        data: req,
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
    verify() {
      let pwdStr, loginNameStr;
      pwdStr = isPwd(this.loginData.loginPwd);
      loginNameStr = isAccount(this.loginData.loginName);
      pwdStr || loginNameStr ? (this.isClick = true) : (this.isClick = false);
    },
    ...mapActions(["updatedUserInfo", "getBanlace"])
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
