<template>
  <div class="fund_list">
    <ScrollV pulldown @pullDown="pullDown" v-if="List.length">
      <ul class="fund_list_single border-1px">
        <li class="left">
          <p class="left_title">
            <span>OTC交易(BEEPAY充币)</span>
            <span :class="statusColor()">进行中</span>
          </p>
          <p class="left_shops">签约商户</p>
          <p class="left_time">05-30 14:37:10</p>
        </li>
        <li class="right">+4000</li>
      </ul>
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
      List: []
    };
  },
  components: {
    ScrollV
  },
  methods: {
    statusColor(status) {
      if (status == 1) {
        return "color9";
      } else if (status == 2) {
        return "color3";
      } else {
        return "color-green";
      }
    },
    pullDown(scroll) {
      setTimeout(() => {
        console.log("到头了");
        scroll.finishPullDown();
      }, 1000);
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

