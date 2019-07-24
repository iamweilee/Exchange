<template>
  <div class="header">
    <div class="group" @click="toLogin(userInfo)">
      <p class="group_avatar">
        <img :src="userInfo.portrait | avatarFun" alt />
      </p>

      <div v-if="userInfo" class="group_login">
        <p class="balance">
          {{ usableBalance | priceFormat }}USDT
          <img
            class="balance_icon"
            src="~assets/Images/home/icon_more_unsel.png"
            alt
          />
        </p>
        <p class="balance_bot">模拟盘</p>
      </div>
      <p v-else class="group_notLogin">{{ $t("notLogin") }}</p>
    </div>
    <router-link tag="div" to="/service" class="right">
      <img src="~assets/Images/home/icon_server.png" alt />
      <p class="right_size">{{ $t("server") }}</p>
    </router-link>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["userInfo"]),
    ...mapGetters(["usableBalance"])
  },
  methods: {
    toLogin(userInfo) {
      if (userInfo) {
        this.$router.push("/me");
      } else {
        this.$router.push("/login");
      }
    }
  }
};
</script>