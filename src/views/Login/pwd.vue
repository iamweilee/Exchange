<template>
  <div class="login">
    <router-link tag="div" to="/register" class="title">注册</router-link>
    <div class="size">
      <p class="size_top">你好！</p>
      <div class="tab">
        <p class="tab_size">欢迎回来</p>
      </div>
    </div>
    <div class="from">
      <div class="inp_group border-1px">
        <input
          type="text"
          placeholder="输入手机号/邮箱账号"
          v-model="loginData.loginName"
        />
      </div>
      <div class="inp_group border-1px">
        <input
          type="password"
          placeholder="输入密码"
          v-model="loginData.loginPwd"
          @keyup.enter="login"
        />
      </div>
      <button class="from_btn" @click="login">登录</button>
      <router-link tag="p" to="/login" class="from_check"
        >验证码登录</router-link
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
            this.$router.push("/");
          }
        });
      }
    },
    ...mapActions(["updatedUserInfo"])
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
