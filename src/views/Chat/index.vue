<template>
  <div class="chat">
    <NavBar :title="`${$t('chat').title}${tradeType ? '' : $t('reals')}`">
    </NavBar>
    <div class="chat_wrap">
      <div class="chat_wrap_top">
        <div class="card" :class="!tradeType && 'card_mock'">
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
              <p @click="tabClick(2)">{{ $t("chat").history }}</p>
            </router-link>
          </ul>
          <div :style="styls" class="tabs_line"></div>
        </div>
        <div class="cont">
          <router-view
            ref="child"
            :tradeType="tradeType"
            :showDialog="showDialog"
          />
        </div>
      </div>
    </div>

    <!-- 平仓和撤单弹窗 -->
    <CloseOut
      ref="CloseOut"
      :dialogDataNull="dialogDataNull"
      :dialogData="dialogData"
      :currentPrice="currentPrice"
      :tradeType="tradeType"
      :earnings="earnings(dialogData, currentPrice)"
    />
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import CloseOut from "components/CloseOut";
import { mapState, mapActions } from "vuex";
import { priceFormat } from "common/utli";
export default {
  data() {
    return {
      active: 0,
      styls: { left: 0 },
      dialogData: {},
      currentPrice: 0
    };
  },
  computed: {
    ...mapState(["balance", "tradeType"])
  },
  mounted() {
    this._initPage();
  },
  destroyed() {
    this.$EventListener.off("TVdetail", this.Detail);
  },
  components: { NavBar, CloseOut },
  methods: {
    showDialog(data) {
      data.cb = this.$refs.child.refresh;
      this.dialogData = data;
      this.$refs.CloseOut.show = true;
    },
    dialogDataNull() {
      this.dialogData = {};
    },
    _initPage() {
      this.$EventListener.on("TVdetail", this.Detail);
      let pathName = this.$route.name;
      if (pathName == "ChatList") {
        this.tabClick(1);
      } else if (pathName == "ChatHistory") {
        this.tabClick(2);
      }
      this.getBanlace();
    },
    Detail(data) {
      if (this.dialogData.tradeCode == data.symbol) {
        this.currentPrice = data.close;
      }
      if (this.$refs.child.Detail) {
        this.$refs.child.Detail(data);
      }
    },
    tabClick(index) {
      this.styls = {
        left: index * 33 + "%"
      };
    },
    //收益计算
    /* 买涨 持仓量*行情价-持仓量*成交价
    买跌 持仓量*成交价-持仓量*行情价 */
    earnings(item, currentPrice) {
      let earning = 0;
      if (item.position == 1) {
        //买跌
        earning =
          item.tradeAmount * item.tradePrice - item.tradeAmount * currentPrice;
      } else {
        //买涨
        earning =
          item.tradeAmount * currentPrice - item.tradeAmount * item.tradePrice;
      }
      if (earning < 0) {
        return priceFormat(earning);
      } else {
        return "+" + priceFormat(earning);
      }
    },
    ...mapActions(["getBanlace"])
  }
  //   watch: {
  //     $route(to, from) {
  //       let toName = to.name;
  //       const toIndex = to.meta.id;
  //       const fromIndex = from.meta.id;
  //       this.transitionName = toIndex < fromIndex ? "slide-right" : "slide-left";
  //     }
  //   }
};
</script>

<style lang="stylus">
@import './style';
</style>
