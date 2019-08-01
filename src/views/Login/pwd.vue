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
          type="password"
          :placeholder="$t('loginReg').pwdPlaceholder"
          v-model="loginData.loginPwd"
          @keyup.enter="login"
        />
      </div>
      <button class="from_btn" @click="login">{{ $t("loginReg").login }}</button>
      <router-link tag="p" to="/login" class="from_check"
        >{{ $t("loginReg").codeLogin }}</router-link
      >
    </div>
  </div>
</template>

<script>
import { isAccount, isPwd } from "common/TollClass/func";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isClick: false, //登录按钮是否可点击
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
      let err = isAccount(this.loginData.loginName),
        err1 = isPwd(this.loginData.loginPwd),
        req = {
          loginName: this.loginData.loginName,
          loginPwd: this.$md5(this.loginData.loginPwd),
          type: 0
        };
      if (err) {
        this.$toast(err);
      } else if (err1) {
        this.$toast(err);
      } else {
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
      }
    },
    ...mapActions(["updatedUserInfo", "getBanlace"])
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
