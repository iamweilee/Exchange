<template>
  <div class="fund_list">
    <ScrollV
      pulldown
      pullup
      @pullDown="pullDown"
      @pullUp="pullUp"
      :data="otcData.list"
      v-if="!otcData.total"
    >
      <router-link
        tag="ul"
        class="fund_list_single border-1px"
        v-for="item in 20"
        :to="`/me/fund/${item.status == 1 ? 'detail/' : 'status/'}${item.id}`"
        :key="item.tradeId"
      >
        <li class="left">
          <p class="left_title">
            <span>OTC交易(BEEPAY充币)</span>
            <span :class="statusColor(item.status)">{{
              item.status | statusType(true)
            }}</span>
          </p>
          <p class="left_shops">签约商户</p>
          <p class="left_time">{{ item.createTime | dateFormat }}</p>
        </li>
        <li class="right">
          <p class="big">
            {{ item.status == 1 ? "-" : "+" }}{{ item.coinAmount }}
          </p>
          <p class="small">USDT</p>
        </li>
      </router-link>
    </ScrollV>
    <div v-else class="notData">
      {{ $t("notData") }}
    </div>
  </div>
</template>

<script>
import ScrollV from "components/Scroll";
export default {
  data() {
    return {
      loading: false,
      finished: true,
      isLoading: false,
      otcData: {}
    };
  },
  components: {
    ScrollV
  },
  mounted() {
    this.getList();
    var str = "2019-07-21T03:59:09.000+0000";
    console.log(str.search("9"));
  },
  methods: {
    //设置Color
    statusColor(status) {
      if (status == 1 || status == 2) {
        return "color-green";
      } else if (status == 9 || status == 4) {
        return "color9";
      } else if (status == 3) {
        return "color3";
      }
    },
    statusType(status) {
      switch (status) {
        case "1":
          return "申请中";
        case "2":
          return "申请中";
        case "3":
          return "已成功";
        case "4":
          return "已失效";
        case "9":
          return "已失效";
      }
    },
    //下拉刷新
    pullDown(scroll) {
      setTimeout(() => {
        console.log("到头了");
        scroll.finishPullDown();
      }, 1000);
    },
    //上拉加载
    pullUp(scroll) {
      setTimeout(() => {
        console.log("到底了");
        scroll.finishPullUp();
      }, 1000);
    },
    //获取OTC充值列表
    getList() {
      this.$http({
        url: "/v1/position/otc/record-list",
        data: {
          pageNo: 1,
          pageSize: 20
        },
        method: "get"
      }).then(res => {
        console.log(res);
        if (res.status == this.STATUS) {
          this.otcData = res.data;
        }
      });
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

