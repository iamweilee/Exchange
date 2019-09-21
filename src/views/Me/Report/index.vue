<template>
  <div class="report">
    <NavBar title="投资报表" fixed showL @clickLeft="clickLeft" />
    <div class="report_wrap" v-if="reportData.successUpCount">
      <div class="report_wrap_top">
        <div class="single">
          <p class="single_big color-blue">
            <span>{{ reportData.totalIncomeRate }}</span>
            <span>%</span>
          </p>
          <p class="single_small">总收益</p>
        </div>
        <div class="single line-1px">
          <p class="single_big red">
            <span>{{ reportData.totalAccuracyRate }}</span>
            <span>%</span>
          </p>
          <p class="single_small">总准确率</p>
        </div>
      </div>
      <div class="report_wrap_info">
        <h2 class="title">数据统计</h2>
        <ul class="single">
          <li>
            <p>{{ reportData.totalAccuracyRate }}%</p>
            <p>准确率</p>
          </li>
          <li>
            <p>{{ reportData.maxOpenAmount }}</p>
            <p>最大开仓</p>
          </li>
          <li>
            <p>{{ reportData.totalCloseAmount }}</p>
            <p>总平仓交易</p>
          </li>
        </ul>
        <ul class="single">
          <li>
            <p>{{ reportData.totalInCount }}笔</p>
            <p>盈利订单</p>
          </li>
          <li>
            <p>{{ reportData.totalOutCount }}笔</p>
            <p>亏损订单</p>
          </li>
          <li>
            <p>{{ reportData.averagePositionTime }}</p>
            <p>平均持仓时间</p>
          </li>
        </ul>
        <ul class="single">
          <li>
            <p>{{ reportData.successUpCount }}笔</p>
            <p>成功交易</p>
          </li>
          <li>
            <p>{{ reportData.successDownCount }}笔</p>
            <p>成功买跌</p>
          </li>
          <li>
            <p>{{ reportData.totalIncomeRate }}%</p>
            <p>收益率</p>
          </li>
        </ul>
      </div>
      <div class="report_wrap_chat">
        <h2 class="title">历史交易品种</h2>
        <div class="report_wrap_chat_top">
          <div class="left">
            <ve-ring
              :data="chartData"
              :legend-visible="false"
              :tooltip-visible="false"
              :width="width"
              :height="width"
              :settings="chartSettings"
              :colors="colors"
            ></ve-ring>
          </div>

          <ul class="right">
            <li v-for="(item, i) in chartData.rows" :key="item.coinCode">
              <p class="icon" :style="{ borderColor: colors[i] }"></p>
              <p class="coin">{{ item.coinCode }}</p>
              <p class="defCoin">USDT</p>
              <p class="ratio" :style="{ color: colors[i] }">
                {{ item.rate }}%
              </p>
            </li>
          </ul>
        </div>
        <ul class="report_wrap_chat_list">
          <li v-for="item in reportData.details" :key="item.coinCode">
            <p>{{ item.coinCode }}</p>
            <p>买跌{{ item.sellCount }}笔</p>
            <p>买涨{{ item.buyCount }}笔</p>
          </li>
        </ul>
      </div>
    </div>
    <NotData v-else />
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import VeRing from "v-charts/lib/ring.common";
import NotData from "components/NotData";
export default {
  data() {
    return {
      colors: [
        "#ff5562",
        "#9d7efe",
        "#54d0fd",
        "#ffb40f",
        "#E066FF",
        "#C0FF3E"
      ],
      chartData: {
        columns: ["coinCode", "rate"],
        rows: [
          { coin: "ETH", ratio: 48 },
          { coin: "BTC", ratio: 28 },
          { coin: "EOS", ratio: 13 },
          { coin: "XRP", ratio: 6 }
        ]
      },
      chartSettings: {
        radius: [30, 70],
        offsetY: 80,
        label: {
          normal: {
            show: false,
            position: "center"
          },
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            borderWidth: 2,
            borderColor: "#fff"
          }
        },

        hoverAnimation: false
      },
      width: "160px",
      reportData: {}
    };
  },
  components: { NavBar, VeRing, NotData },
  mounted() {
    this._initPage();
  },
  beforeDestroy() {
    this.$removeEvent(window, "resize", this.resetWH);
  },
  methods: {
    _initPage() {
      this.resetWH();
      this.getReport();
      this.$addEvent(window, "resize", this.resetWH);
    },
    getReport() {
      this.$http({ url: "/v1/leverage/statistics", methd: "get" }).then(res => {
        if (res.status == this.STATUS) {
          this.reportData = res.data;
          this.chartData = {
            columns: ["coinCode", "rate"],
            rows: res.data.details
          };
        }
      });
    },
    resetWH() {
      let ratio = document.documentElement.clientWidth / 750;
      let radius = parseInt(320 * ratio) / 2;
      this.width = parseInt(320 * ratio) + "px";
      this.chartSettings.radius = [radius / 2, radius];
      this.chartSettings.offsetY = radius;
    },
    clickLeft() {
      this.$router.push("/me");
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
.Chart {
  padding: 20px;
  box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  margin: 50px 0;
}
</style>
