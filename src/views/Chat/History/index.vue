<template>
  <div class="history">
    <NavBar
      :title="$t('chat').historyTitle"
      fixed
      showL
      @clickLeft="clickLeft"
    />
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      v-if="historyList.length"
    >
      <router-link
        class="history_single"
        v-for="item in historyList"
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
            <span>{{ item.stopLoss }}</span>
            <span>{{ $t("chat").lossPrice }}</span>
          </p>
          <p>
            <span>{{ item.stopProfit }}</span>
            <span>{{ $t("chat").profitPrice }}</span>
          </p>
        </span>
      </router-link>
    </van-pull-refresh>
    <!-- <div class="not_data">没有更多数据</div> -->
    <div v-else class="notData">
      {{ $t("notData") }}
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import iconBuy from "Images/chat/icon_buy.png";
import iconSale from "Images/chat/icon_sale.png";
import { mapState } from "vuex";
export default {
  data() {
    return {
      title: "历史记录（模拟盘）",
      historyList: [],
      loading: false,
      finished: false,
      isLoading: false
    };
  },
  computed: {
    ...mapState(["tradeType"])
  },
  components: { NavBar },
  mounted() {
    this.getHistory();
  },
  methods: {
    clickLeft() {
      this.$router.push("/chat");
    },
    getHistory() {
      // /v1/leverageHis/history?pageNo=1&pageSize=10
      let url = this.tradeType ? "/v1/leverageHis/history" : "/v1/mock/history_list";
      this.$http({
        url: url,
        data: { pageNo: 1, pageSize: 10 },
        method: "get"
      }).then(res => {
        console.log(res);
        if (res.status == this.STATUS) {
          this.historyList = res.data.list;
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
    onLoad() {
      setTimeout(() => {
        this.loading = false;
        this.finished = true;
        this.$toast("异步更新数据");
      }, 500);
    },
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.finished = false;
        this.$toast("刷新成功");
      }, 500);
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
