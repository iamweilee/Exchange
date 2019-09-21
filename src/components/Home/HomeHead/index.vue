<template>
  <div class="header">
    <div class="group" @click="toLogin(userInfo)">
      <p class="group_avatar">
        <img :src="userInfo.portrait" alt />
      </p>

      <div v-if="userInfo" class="group_login">
        <p class="balance" @click.stop="show = true">
          {{ usableBalance | priceFormat }}USDT
          <img
            class="balance_icon"
            src="~assets/Images/home/icon_more_unsel.png"
            alt
          />
        </p>
        <p class="balance_bot" v-if="!tradeType" @click.stop="mockCheck">
          {{ $t("real") }}
        </p>
      </div>
      <p v-else class="group_notLogin">{{ $t("home").notLogin }}</p>
    </div>
    <router-link tag="div" to="/service" class="right">
      <img src="~assets/Images/home/icon_server.png" alt />
      <p class="right_size">{{ $t("home").server }}</p>
    </router-link>
    <van-popup v-model="show" position="bottom">
      <div class="mock_select">
        <button class="big_btn" @click="mockCheck">
          {{ $t(isMock(tradeType)) }}
        </button>
        <button class="big_btn" @click="close">
          {{ $t("cancel") }}
        </button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      show: false
    };
  },
  computed: {
    ...mapState(["userInfo", "tradeType"]),
    ...mapGetters(["usableBalance"])
  },

  methods: {
    mockCheck() {
      this.setTradeType(!this.tradeType);
      this.close();
    },
    close() {
      this.show = false;
    },
    toLogin(userInfo) {
      if (userInfo) {
        this.$router.push("/me");
      } else {
        this.$router.push("/login");
      }
    },
    isMock(tradeType) {
      if (tradeType) {
        return "cutReal";
      } else {
        return "cutFake";
      }
    },
    ...mapActions(["setTradeType"])
  }
};
</script>