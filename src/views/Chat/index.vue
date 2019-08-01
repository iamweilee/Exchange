<template>
  <div class="chat">
    <NavBar :title="$t('chat').title" fixed />
    <div class="chat_wrap">
      <div class="chat_wrap_top">
        <div class="card">
          <div class="card_size">
            <p>USDT</p>
            <p>{{ balance.enableAmount | priceFormat }}</p>
          </div>
          <router-link tag="p" to="/otc" class="card_btn">
            <button>{{ $t("chat").rechargeBtn }}</button>
          </router-link>
        </div>
        <ul class="list">
          <li>
            <p>{{ $t("chat").current }}</p>
            <p>{{ balance.currentAmount | priceFormat }}</p>
          </li>
          <li>
            <p>{{ $t("chat").frozen }}</p>
            <p>{{ balance.frozenAmount | priceFormat }}</p>
          </li>
          <li>
            <p>{{ $t("chat").total }}</p>
            <p>{{ balance.enableAmount | priceFormat }}</p>
          </li>
        </ul>
      </div>
      <div class="chat_wrap_info">
        <div class="tabs">
          <ul class="tabs_wrap">
            <router-link to="/chat" tag="li">
              <p @click="tabClick(0)">{{ $t("chat").hold }}</p>
            </router-link>
            <router-link to="/chat/list" tag="li">
              <p @click="tabClick(1)">{{ $t("chat").list }}</p>
            </router-link>
            <router-link to="/chat/history" tag="li">
              <p>{{ $t("chat").history }}</p>
            </router-link>
          </ul>
          <div :style="styls" class="tabs_line"></div>
        </div>
        <div class="cont">
          <transition :name="transitionName">
            <router-view ref="child" :showDialog="showDialog" />
          </transition>
        </div>
      </div>
    </div>
    <van-dialog
      v-model="show"
      :title="`确认${dialogData.title}`"
      show-cancel-button
      :beforeClose="beforeClose"
      class="customDialog"
    >
      <p class="order">{{ $t("chat").orderNo }}{{ dialogData.orderNo }}</p>
      <ul class="hold_dialog" v-if="dialogData.title == '平仓'">
        <li>
          <p>{{ $t("chat").floatProfit }}</p>
          <p>+1.92</p>
        </li>
        <li>
          <p>{{ $t("chat").dealPrice }}</p>
          <p>{{ dialogData.dealPrice }}</p>
        </li>
        <li>
          <p>{{ $t("chat").currentPrice }}</p>
          <p>{{ dialogData.tradePrice }}</p>
        </li>
      </ul>
      <ul class="hold_dialog" v-else>
        <li>
          <p>{{ dialogData.targetCoin }}</p>
          <p>{{ dialogData.tradeAmount }}</p>
        </li>
        <li>
          <p>{{ $t("chat").tradePrice }}</p>
          <p>{{ dialogData.tradePrice }}</p>
        </li>
      </ul>
    </van-dialog>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import { mapState } from "vuex";
export default {
  data() {
    return {
      active: 0,
      styls: { left: 0 },
      transitionName: "slide-left",
      show: false,
      dialogData: {}
    };
  },
  computed: {
    ...mapState(["balance"])
  },
  mounted() {
    this._initPage();
  },
  components: { NavBar },
  methods: {
    showDialog(data) {
      this.dialogData = data;
      this.show = true;
      console.log(data);
    },
    _initPage() {
      if (this.$route.name == "ChatList") {
        this.tabClick(1);
      }
    },
    tabClick(index) {
      this.styls = {
        left: index * 33 + "%"
      };
    },
    beforeClose(action, done) {
      if (action == "cancel") {
        done();
      } else {
        let url =
          this.dialogData.title == "平仓"
            ? "/v1/leverage/eveningUp"
            : "/v1/leverage/cancel";
        this.$http({
          url: url,
          data: { orderNo: this.dialogData.orderNo },
          method: "get"
        })
          .then(res => {
            if (res.status == this.STATUS) {
              this.$refs.child.refresh(done);
            }
          })
          .catch(err => {
            this.$toast(err.data.message);
            done(false);
          });
      }

      return false;
    }
  },
  watch: {
    $route(to, from) {
      let toName = to.name;
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
