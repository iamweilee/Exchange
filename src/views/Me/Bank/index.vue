<template>
  <div class="bank">
    <NavBar title="银行卡管理" fixed showL @clickLeft="clickLeft" />
    <div class="bank_list">
      <div class="single" v-for="item in bankList" :key="item.id">
        <div class="single_l">
          <img :src="bankImg(item.type)" alt="" />
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
        <button @click="unbind(item.id)" class="unbind">解绑</button>
      </div>
    </div>
    <div class="addBtn">
      <p @click="toAddBank">
        <van-icon class="plus_icon" name="plus" />添加银行卡
      </p>
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
  mounted() {
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
    bankImg(type) {
      return require(`../../../assets/Images/bank/${type}.png`);
    },
    //解绑银行卡
    unbind(id) {
      let _this = this;
      this.$dialog
        .confirm({
          message: "确定解绑此张银行卡?",
          confirmButtonColor: "#2d9ef5"
        })
        .then(() => {
          _this
            .$http({
              url: "/v1/user/card/remove",
              method: "post",
              data: { id: id }
            })
            .then(res => {
              if (res.status == _this.STATUS) {
                _this.$toast("解绑成功");
                _this.getBankList();
              }
            });
        })
        .catch(() => {
          console.log("11111");
          // on cancel
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
