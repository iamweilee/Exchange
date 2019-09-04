<template>
  <div class="from">
    <div class="inp_group border-1px">
      <input
        type="password"
        v-model="editData.oldLoginPwd"
        placeholder="输入旧密码"
        v-debounce="{
          fn: verify,
          method: 'input'
        }"
      />
    </div>
    <div class="inp_group border-1px">
      <input
        type="password"
        v-model="editData.password"
        placeholder="请设置新密码"
        v-debounce="{
          fn: verify,
          method: 'input'
        }"
      />
    </div>
    <p class="from_tips">* 6 - 20 位数字，字母，下划线组合</p>
    <button
      class="from_btn"
      :disabled="isClick"
      v-debounce="{
        fn: editPwd
      }"
    >
      修改密码
    </button>
  </div>
</template>

<script>
import { isPwd } from "common/TollClass/func";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isClick: true,
      editData: {
        oldLoginPwd: "",
        password: "",
        codeType: 7
      }
    };
  },
  methods: {
    editPwd() {
      if (this.editData.oldLoginPwd != this.editData.password) {
        return this.$toast("两次密码不一致");
      } else {
        let req = {
          oldLoginPwd: this.$md5(this.editData.oldLoginPwd),
          password: this.$md5(this.editData.password),
          codeType: 7
        };
        this.$http({
          url: "/v1/user/update_login_pwd",
          data: req,
          method: "put"
        }).then(res => {
          this.getUserInfo();
        });
      }
    },
    verify() {
      let errStr = isPwd(this.editData.oldLoginPwd),
        errStr1 = isPwd(this.editData.password);
      errStr || errStr1 ? (this.isClick = true) : (this.isClick = false);
    },
    ...mapActions(["getUserInfo"])
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
