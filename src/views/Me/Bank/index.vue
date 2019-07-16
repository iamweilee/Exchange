<template>
  <div class="bank">
    <NavBar title="银行卡管理" fixed showL @clickLeft="clickLeft" />
    <div class="bank_list">
      <div class="single" v-for="item in bankList" :key="item.id">
        <div class="single_l">
          <img src="~assets/Images/avatar.jpg" alt="" />
          <div class="right">
            <p class="right_title">{{ item.bankName }}</p>
            <p>储蓄卡</p>
            <div class="right_bot">
              <p>****</p>
              <p>****</p>
              <p>****</p>
              <p>{{ item.bankAccount }}</p>
            </div>
          </div>
        </div>
        <button @click="unbind(item.id)" class="unbind">解綁</button>
      </div>
    </div>
    <div class="addBtn">
      <button @click="toAddBank">
        <van-icon class="plus_icon" name="plus" />添加银行卡
      </button>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {
      bankList: []
    };
  },
  components: {
    NavBar
  },
  created() {
    this._initPage();
  },
  methods: {
    _initPage() {
      this.getBankList();
    },
    //获取银行卡列表
    getBankList() {
      this.$http({ url: "/v1/user/card/list", method: "get" }).then(res => {
        res.data.forEach(item => {
          let str = item.bankAccount;
          item.bankAccount = str.substring(str.length - 4);
        });
        console.log(res.data);
        this.bankList = res.data;
      });
    },
    //解绑银行卡
    unbind(id) {
      this.$http({
        url: "/v1/user/card/remove",
        method: "post",
        data: { id: id }
      }).then(res => {
        if (res.status == this.STATUS) {
          this.$toast("解绑成功");
          this.getBankList();
        }
      });
    },
    toAddBank() {
      this.$router.push("/me/bank/add");
    },
    clickLeft() {
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
