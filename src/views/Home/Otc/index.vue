<template>
  <div class="otc">
    <NavBar :title="title" fixed showL @clickLeft="clickLeft" />
    <div class="otc_wrapper">
      <transition :name="transitionName">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar/Switch";
import { mapState } from "vuex";
export default {
  data() {
    return {
      transitionName: "slide-left",
      title: [
        { title: "OTC交易", url: "/otc", left: 0 },
        { title: "钱包转账", url: "/otc/wallet", left: 1 }
      ]
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  components: { NavBar },
  created() {
    // this.getAddress();
  },
  methods: {
    getAddr() {
      this.$http({
        url: "/v1/user/wallet_address_other",
        data: { userId: this.userInfo.userId, coinCode: "USDT" },
        method: "get"
      }).then(res => {
        console.log(res);
      });
    },
    //充币地址
    getAddress() {
      this.$http({
        url: "/v1/user/wallet_address",
        data: { userId: this.userInfo.userId, coinType: "USDT" },
        method: "post"
      }).then(res => {
        console.log(res);
      });
    },
    clickLeft() {
      this.$router.push("/");
    }
  },
  watch: {
    $route(to, from) {
      const toIndex = to.meta.id;
      const fromIndex = from.meta.id;
      this.transitionName = toIndex < fromIndex ? "slide-right" : "slide-left";
    }
  }
};
</script>

<style lang="stylus">
@import './style';
</style>
