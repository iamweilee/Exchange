<template>
  <div class="fund_list">
    <ScrollV pulldown @pullDown="pullDown" v-if="listData.total">
      <ul
        class="fund_list_single border-1px"
        v-for="item in listData.list"
        :key="item.tradeId"
      >
        <li class="left">
          <p class="left_title">
            <span>{{ title }}</span>
            <span v-if="routeType == 'draw'" :class="statusColor()">{{
              isStatus(item.coinDrawStatus)
            }}</span>
          </p>
          <p class="left_shops">
            钱包地址: <span>{{ item.drawAdd }}</span>
          </p>
          <p class="left_time">
            {{ routeType == "draw" ? item.drawTime : item.createTime }}
          </p>
        </li>
        <li class="right">
          <p class="big">{{ amount(item) }}</p>
          <p class="small">{{ item.coinCode }}</p>
        </li>
      </ul>
    </ScrollV>
    <NotData v-else />
    <!-- <div v-else class="notData">
      {{ $t("notData") }}
    </div> -->
  </div>
</template>

<script>
import NotData from "components/NotData";
import ScrollV from "components/Scroll";
export default {
  data() {
    return {
      loading: false,
      finished: true,
      isLoading: false,
      listData: {},
      routeType: this.$route.params.type,
      title: "钱包"
    };
  },
  components: {
    ScrollV,
    NotData
  },
  mounted() {
    this._initPage();
  },
  methods: {
    _initPage() {
      this.routeType = this.$route.params.type;
      this.listData = {};
      if (this.routeType == "recharge") {
        this.getRechargeList();
        this.title = "钱包充值";
      } else if (this.routeType == "draw") {
        this.getDrawList();
        this.title = "钱包提现";
      }
    },
    //数量
    amount(item) {
      if (this.routeType == "recharge") {
        return "+" + item.amount;
      } else if (this.routeType == "draw") {
        return "-" + (item.drawAmount + item.poundageAmount);
      }
    },
    // 钱包地址提现申请
    getDrawList() {
      this.$http({
        url: "/v1/position/draw_list",
        data: {
          pageNo: 1,
          pageSize: 20
        },
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.listData = res.data;
        }
      });
    },
    // 钱包地址充值明细
    getRechargeList() {
      this.$http({
        url: "/v1/trade/detail/drawlist",
        data: {
          pageNo: 1,
          pageSize: 20,
          handleType: 10010010
        },
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.listData = res.data;
        }
      });
    },
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
    },
    isStatus(status) {
      switch (status) {
        case 10030005:
          return "待初审";
        case 10030010:
          return "待复审";
        case 10030015:
          return "待出币";
        case 10030020:
          return "出币中";
        case 10030025:
          return "出币成功";
        case 10030030:
          return "出币失败";
        case 10030035:
          return "已驳回";
      }
    }
    //   **
    //  * 提现状态：待初审
    //  */
    // Integer DRAW_STATUS_DCH = 10030005;

    // /**
    //  * 提现状态：待复审
    //  */
    // Integer DRAW_STATUS_DFS = 10030010;

    // /**
    //  * 提现状态：待出币
    //  */
    // Integer DRAW_STATUS_DCB = 10030015;

    // /**
    //  * 出币中
    //  */
    // Integer DRAW_STATUS_CBZ = 10030020;

    // /**
    //  * 提现状态：出币成功
    //  */
    // Integer DRAW_STATUS_CBCG = 10030025;

    // /**
    //  * 提现状态：出币失败
    //  */
    // Integer DRAW_STATUS_CBSB = 10030030;

    // /**
    //  * 提现状态：已驳回
    //  */
    // Integer DRAW_STATUS_YBH = 10030035;

    //   AccountDetailController
    //    /v1/trade/detail/list   和  /v1/trade/detail/drawlist
    //    都可以   钱包地址充值明细  handletype传10010020
    // CoinPositionOtcController
    // /v1/position/otc/record-list    otc冲提现 列表
    // CoinDrawController
    // /v1/position/draw_list  钱包地址提现申请
  },
  watch: {
    $route(to) {
      this._initPage();
    }
  }
};
</script>

