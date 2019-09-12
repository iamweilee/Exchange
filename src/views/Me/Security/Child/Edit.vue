<template>
  <div class="Phone">
    <NavBar
      :title="isMobile() ? Edit.title : Edit.title1"
      fixed
      showL
      @clickLeft="clickLeft"
    />
    <div class="Phone_wrap">
      <p v-if="isMobile()" class="tips">{{ Edit.tips }}</p>
      <div class="from">
        <div class="inp_group border-1px">
          <input
            type="text"
            :placeholder="Edit.tipPhone"
            :disabled="isMobile()"
            v-model="emailPhone"
            v-debounce="{
              fn: verify.bind(arguments, 'edit'),
              method: 'input'
            }"
          />
        </div>
        <div class="inp_group border-1px">
          <input
            type="text"
            placeholder="输入验证码"
            v-debounce="{
              fn: verify.bind(arguments, 'edit'),
              method: 'input'
            }"
            v-model="emailPhoneCode"
          />
          <button class="inp_group_right" :disabled="isSend" @click="sendMsg">
            {{ sendBtnText }}
          </button>
        </div>
        <button
          class="from_btn"
          v-debounce="{
            fn: step
          }"
          :disabled="isClick"
        >
          {{ isMobile() ? "下一步" : "确定" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import { Edit } from "common/staticData";
import extend from "./EditExtends";
export default {
  extends: extend,
  data() {
    return {
      Edit: Edit[this.$route.params.type],
      emailPhone: this.$store.state.userInfo[this.$route.params.type],
      emailPhoneCode: ""
    };
  },
  components: { NavBar },
  methods: {
    //下一步或者绑定手机或者邮箱
    step() {
      if (this.isMobile()) {
        let phoneData = {
          oldMobile: this.emailPhone,
          oldMobileCode: this.emailPhoneCode,
          mobile: "",
          mobileCode: "",
          codeType: 5,
          type: 0
        };
        if (this.isEmailPhone()) {
          phoneData = {
            oldMobile: this.emailPhone,
            oldMobileCode: this.emailPhoneCode,
            mobile: "",
            mobileCode: "",
            codeType: 5,
            type: 0
          };
        } else {
          phoneData = {
            oldEmail: this.emailPhone,
            oldEmailCode: this.emailPhoneCode,
            email: "",
            emailCode: "",
            codeType: 6,
            type: 1
          };
        }
        this.$lStore.set("phoneData", phoneData);
        this.$router.push(`/me/edit1/${this.pageType}`);
      } else {
        this.bindPhoneEmail();
      }
    },
    //判断是email 还是 phone
    isEmailPhone() {
      if (this.pageType == "mobile") {
        return true;
      } else if (this.pageType == "email") {
        return false;
      }
    },

    //判断是否未绑定
    isMobile() {
      if (this.userInfo[this.pageType]) {
        return true;
      } else {
        return false;
      }
    },
    //绑定  手机号||邮箱
    bindPhoneEmail() {
      let req = {};
      if (this.isEmailPhone()) {
        req = {
          codeType: 5,
          type: 0,
          mobile: this.emailPhone,
          mobileCode: this.emailPhoneCode
        };
      } else {
        req = {
          codeType: 6,
          type: 1,
          email: this.emailPhone,
          emailCode: this.emailPhoneCode
        };
      }
      this.editPhone(req, true);
    },

    clickLeft() {
      this.$router.push("/me/security");
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
