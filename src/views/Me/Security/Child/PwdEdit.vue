<template>
  <div class="from">
    <div class="inp_group border-1px">
      <input
        type="password"
        v-model="editData.oldLoginPwd"
        placeholder="输入旧密码"
      />
    </div>
    <div class="inp_group border-1px">
      <input
        type="password"
        v-model="editData.password"
        placeholder="请设置新密码"
      />
    </div>
    <p class="from_tips">* 6 - 16 位字母和数字组成</p>
    <button class="from_btn" @click="editPwd">登录</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isClick: false,
      editData: {
        oldLoginPwd: "",
        password: "",
        codeType: 7
      }
    };
  },
  components: {},
  methods: {
    editPwd() {
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
        console.log(res);
        this.getUserInfo()
      });
    },
    ...mapActions(["getUserInfo"])
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
