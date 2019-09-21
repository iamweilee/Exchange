<template>
  <div class="register">
    <div class="title">
      <router-link to="/" tag="p" class="left">{{
        $t("tabNav").home
      }}</router-link>
      <router-link to="/login" tag="p" class="right">{{
        $t("loginReg").login
      }}</router-link>
    </div>
    <div class="register_wrap">
      <div class="size">
        <p class="size_top">{{ $t("loginReg").niHao }}</p>
        <div class="tab">
          <p class="tab_size">{{ $t("loginReg").welcomeJoin }}</p>
          <p class="tab_bar">
            <router-link to="/register">{{
              $t("loginReg").phoneReg
            }}</router-link>
            <router-link to="/register/email">{{
              $t("loginReg").emailReg
            }}</router-link>
          </p>
        </div>
      </div>
      <div class="from">
        <div class="from_wrap">
          <!-- <transition :name="transitionName"> -->
          <router-view ref="from" />
          <!-- </transition> -->
        </div>
        <div class="from_p">
          <button class="from_btn" :disabled="isClick" @click="subMit">
            {{ $t("loginReg").reg }}
          </button>
          <div class="agreement">
            <span>{{ $t("loginReg").regDeal }}</span>
            <router-link to="/intord/protocol" class="color-blue">{{
              $t("loginReg").Deal
            }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { isEmail, isPwd, isCode, isNum, random } from "common/utli";
export default {
  data() {
    return {
      isClick: false, //登录按钮是否可点击
      //   transitionName: "slide-left",
      type: this.$route.name
    };
  },
  mounted() {
    // console.log(this.$md5("123456"));
    // this.register();
  },
  components: {},
  methods: {
    //选择注册方式
    checkType(type) {
      this.activeClass = type;
      this.$router.push(`/register${type}`);
    },
    subMit() {
      let regData = this.$refs.from.fromData,
        Name = this.$route.name,
        req = {
          loginPwd: regData.pwd
        },
        errPwd = isPwd(regData.pwd),
        errCode = isCode(regData.code);
      if (Name == "Phone") {
        let errPhone = isNum(regData.phone, "手机号输入有误");
        req = {
          mobileCode: regData.code,
          loginName: regData.phone,
          type: 0
        };
        if (errPhone) {
          this.$toast(errPhone);
          return;
        }
      } else if (Name == "Email") {
        let errEmail = isEmail(regData.email);
        req = {
          emailCode: regData.code,
          loginName: regData.email,
          type: 1
        };
        if (errEmail) {
          this.$toast(errEmail);
          return;
        }
      }
      if (errCode) {
        this.$toast(errCode);
        return;
      } else if (errPwd) {
        this.$toast(errPwd);
        return;
      } else {
        req.loginPwd = this.$md5(regData.pwd);
        // req.userCode = "7m95t";
        // console.log(req);
        this.register(req);
      }
    },
    register(req) {
      this.$http({
        url: "/auth/register",
        method: "post",
        data: req,
        pro: true
      }).then(res => {
        let data = res.data;
        if (res.status == this.STATUS) {
          this.$toast("恭喜你注册成功");
          this.$lStore.set("token", res.data.token);
          this.setAvatar();
          this.getBanlace();
          this.$router.push("/");
        }
      });
    },
    setAvatar() {
      this.$http({
        url: "/v1/user/portrait",
        method: "post",
        data: { portrait: `/avatar/avatar${random(1, 8)}.png` }
      }).then(res => {
        if (res.status == this.STATUS) {
          this.getUserInfo();
        }
      });
    },
    ...mapActions(["getUserInfo", "getBanlace"])
  },
  watch: {
    $route(to, from) {
      let toName = to.name;
      //   const toIndex = to.meta.id;
      //   const fromIndex = from.meta.id;
      this.type = toName;
      //   this.transitionName = toIndex < fromIndex ? "slide-right" : "slide-left";
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~assets/stylus/variable.styl';
.register {
  background-color: $write;
  .title {
    padding: 32px 28px 11px 28px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    color: $blue;
    margin-bottom: 20px;
    p {
      cursor: pointer;
    }
  }
  &_wrap {
    subScroll(80px);
    .size {
      color: $color3;
      padding: 0 28px;
      &_top {
        font-size: 30px;
        margin-bottom: 8px;
      }
      .tab {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &_size {
          font-size: 24px;
        }
        &_bar {
          a {
            font-size: 14px;
            color: $color6;
            transition: color 0.3s linear;
            extend-click();
            &.router-link-exact-active {
              color: $blue;
            }
            &:first-child {
              margin-right: 12px;
            }
          }
        }
      }
    }
    .from {
      padding: 14px 0;
      &_wrap {
        height: 220px;
        width: 100%;
      }
      &_p {
        padding: 0 28px;
      }
      &_btn {
        margin-top: 50px;
        width: 319px;
        height: 44px;
        background: url('../../assets/Images/regLogin/bg_btn.png') no-repeat center;
        background-size: 100% 100%;
        border: none;
        color: $write;
        font-size: 16px;
        line-height: 44px;
        &:disabled {
          color: rgba(255, 255, 255, 0.6);
        }
      }
      &_check {
        margin-top: 18px;
        font-size: 14px;
        color: $blue;
      }
      .agreement {
        margin-top: 18px;
        text-align: center;
        font-size: 14px;
        color: $color6;
      }
    }
  }
}
</style>
