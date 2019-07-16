<template>
  <div class="fund_list">
    <ScrollV
      pulldown
      pullup
      @pullDown="pullDown"
      @pullUp="pullUp"
      :data="otcData.list"
      v-if="otcData.total"
    >
      <router-link
        tag="ul"
        class="fund_list_single border-1px"
        v-for="item in otcData.list"
        :to="
          `/me/fund/${item.status == 1 ? 'detail/' : 'status/'}${item.tradeId}`
        "
        :key="item.tradeId"
      >
        <li class="left">
          <p class="left_title">
            <span>OTC交易(BEEPAY充币)</span>
            <span :class="statusColor(item.status)">{{
              statusText(item.status)
            }}</span>
          </p>
          <p class="left_shops">签约商户</p>
          <p class="left_time">05-30 14:37:10</p>
        </li>
        <li class="right">
            <p class="big">+4000</p>
            <p class="small">USDT</p>
        </li>
      </router-link>
    </ScrollV>
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
  created() {
    this.getList();
  },
  methods: {
    //设置Color
    statusColor(status) {
      if (status == 1) {
        return "color-green";
      } else if (status == 2) {
        return "color9";
      } else if (status == 3) {
        return "color3";
      }
    },
    //状态分辨
    statusText(status) {
      if (status == 1) {
        return "申请中"; //"进行中";
      } else if (status == 3) {
        return "otc确认通过"; //"已失效";
      } else if (status == 4) {
        return "otc确认不通过"; //"已失效";
      } else if (status == 9) {
        return "已撤";
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
      let list = [1, 2, 3];

      setTimeout(() => {
        this.List = [...this.List, ...list];
        console.log("到底了");
        scroll.finishPullUp();
      }, 1000);
    },
    //获取OTC充值列表
    getList() {
      this.$http({
        url: "/v1/position/otc/recharge-record-list",
        data: { pageNo: 1, pageSize: 20 },
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

