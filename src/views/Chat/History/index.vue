<template>
  <div class="history">
    <!-- <NavBar
      :title="tradeType ? $t('chat').historyTitles : $t('chat').historyTitle"
      fixed
      showL
      @clickLeft="clickLeft"
    /> -->
    <div class="history_list" v-if="historyData.list.length">
      <ScrollV
        pulldown
        pullup
        @pullDown="pullDown"
        @pullUp="pullUp"
        :data="historyData.list"
      >
        <router-link
          class="history_single"
          v-for="item in historyData.list"
          :to="`/chat/history/${item.orderNo}`"
          :key="item.orderNo"
        >
          <li class="top">
            <p class="top_l">
              <span class="big">{{ item.targetCoin }}</span>
              <span class="small">{{ item.sourceCoin }}</span>
              <span class="icon">
                <img :src="isBuy(item.position)" alt />
              </span>
              <span class="num"
                >×{{ item.tradeAmount / item.stockRate }}{{ $t("hand") }}</span
              >
            </p>
            <p class="top_btn">
              <span :class="isColor(item.income)">{{ item.income }}</span>
              <button>{{ isStatus(item.status) }}</button>
            </p>
          </li>
          <span class="bot">
            <p class="line-1px">
              <span>{{ item.tradePrice }}</span>
              <span>{{ $t("chat").dealPrice }}</span>
            </p>
            <p class="line-1px">
              <span>{{ item.closePrice }}</span>
              <span>{{ $t("chat").closePrice }}</span>
            </p>
            <p class="line-1px">
              <span>{{
                item.stopLoss
                  | priceFormat(coinPrecision[item.targetCoin].tickSize)
              }}</span>
              <span>{{ $t("chat").lossPrice }}</span>
            </p>
            <p>
              <span>{{
                item.stopProfit
                  | priceFormat(coinPrecision[item.targetCoin].tickSize)
              }}</span>
              <span>{{ $t("chat").profitPrice }}</span>
            </p>
          </span>
        </router-link>
      </ScrollV>
    </div>
    <div v-else class="notData">
      {{ $t("notData") }}
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import iconBuy from "Images/chat/icon_buy.png";
import iconSale from "Images/chat/icon_sale.png";
import ScrollV from "components/Scroll";
import { mapState } from "vuex";
export default {
  data() {
    return {
      coinPrecision: this.$lStore.get("coinPrecision"),
      title: "历史记录（模拟盘）",
      historyData: { list: [] },
      loading: false,
      finished: false,
      isLoading: false,
      pageNo: 1
    };
  },
  computed: {
    ...mapState(["tradeType"])
  },
  components: { NavBar, ScrollV },
  mounted() {
    this.getHistory(this.pageNo);
  },
  methods: {
    clickLeft() {
      this.$router.push("/chat");
    },
    getHistory(pageNo) {
      let url = this.tradeType
        ? "/v1/leverageHis/history"
        : "/v1/mock/history_list";
      this.$http({
        url: url,
        data: { pageNo, pageSize: 10 },
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          if (pageNo != 1) {
            res.data.list = [...this.historyData.list, ...res.data.list];
          }
          this.historyData = res.data;
        }
      });
    },
    isBuy(type) {
      if (type) {
        return iconBuy;
      } else {
        return iconSale;
      }
    },
    isStatus(status) {
      switch (status) {
        case 6:
          return `已${this.$t("chat").cancelOrder}`;
        case 7:
          return `已${this.$t("chat").closeOut}`;
      }
    },
    isColor(num) {
      if (num < 0) {
        return "color-red1";
      } else {
        return "color-green";
      }
    },
    pullDown(scroll) {
      setTimeout(() => {
        this.getHistory(1);
        scroll.finishPullDown();
      }, 300);
    },
    pullUp(scroll) {
      setTimeout(() => {
        if (this.historyData.hasNextPage) {
          this.pageNo = this.pageNo + 1;
          this.getHistory(this.pageNo);
        } else {
          console.log("到底了");
        }
        scroll.finishPullUp();
      }, 300);
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
