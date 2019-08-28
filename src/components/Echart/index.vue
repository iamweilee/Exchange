<template>
  <!--图表内容区域，必须给 ECharts 容器本身指定高度。不然它会使用默认高度-->
  <div class="chart">
    <div id="echarts" style="height: 200px;width:100%"></div>
  </div>
</template>

  <script>
import echarts from "echarts";
import { createOpt, splitData } from "./option";
import { dateFormatUTC } from "common/utli";
import { setInterval, clearInterval } from "timers";
export default {
  props: {
    tradeCode: {
      type: String
    }
  },
  data() {
    return {
      chart: null,
      timer: null,
      optionData: null
    };
  },
  mounted() {
    //初始化 ECharts 实例，不能在created生命周期内初始化，因为那时候DOM还没有渲染，是找不到元素的
    // this.initChart();
    this._initPage();
  },
  destroyed() {
    //组件销毁前先销毁 ECharts 实例
    clearInterval(this.timer);
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    _initPage() {
      let _this = this;
      this.timer = setInterval(() => {
        if (_this.tradeCode) {
          _this.getKLine();
          clearInterval(_this.timer);
        }
      }, 500);
    },
    getKLine() {
      this.$http({
        url: "/v1/kline/findList",
        method: "get",
        data: {
          currency: this.tradeCode,
          base: "USDT",
          openTime: Date.parse(new Date()) / 1000,
          interval: "15m", //resolution
          pageSize: 120
        }
      }).then(res => {
        let lineArr = [];
        lineArr = res.data.map(el => {
          // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
          return [
            dateFormatUTC(el.openTime, "dd hh:mm"),
            el.open,
            el.close,
            el.low,
            el.high,
            el.openTime
          ];
        });
        this.initChart(splitData(lineArr));
      });
    },
    // amount: 91.9370512035309
    // close: 10138.37
    // count: 1214
    // high: 10155.55
    // id: 1566116100
    // kType: "15m"
    // low: 10130.84
    // open: 10147.65
    // pair: "btcusdt"
    // symbol: "BTC/USDT"
    // ts: 1566116911345
    // type: "kline"
    // vol: 932911.769471187
    setKlineData(data) {
      let arr = [data.open, data.close, data.low, data.high, data.ts];
      this.getData(arr);
      //   console.log(arr);
    },
    initChart(data) {
      let option = createOpt(data);
      this.optionData = option;
      // 基于准备好的dom，初始化echarts实例,移动端建议使用 svg模式
      this.chart = echarts.init(
        document.getElementById("echarts")
        //   , null, {
        //     renderer: "svg"
        //   }
      );
      this.chart.setOption(option, true);
      let _this = this;
      //   图标根据窗口大小自动缩放
    //   this.$EventListener.on("TVkline", this.setKlineData);
      window.addEventListener("resize", this.chart.resize);
    },
    getData(data) {
      let allArr = this.optionData.series[0].data,
        arr = allArr[allArr.length - 1];
      var rounded = data[4];
      var lastBarSec = Number(arr[4]) + 15 * 60000;
      //   console.log(rounded, arr[4]);
      if (rounded > lastBarSec) {
        allArr = [...allArr, data];
        console.log(arr);
        this.optionData.series[0].data = [...allArr, data];
      } else {
        if (data[2] < arr[2]) {
          arr[2] = data[2];
        }
        if (data[3] > arr[3]) {
          arr[3] = data[3];
        }
        arr[1] = data[1];
        allArr[allArr.length - 1] = arr;
        this.optionData.series[0].data = 
        console.log(arr, allArr[allArr.length - 1]);
      }
      //   console.log(arr,this.optionData.series[0].data[allArr.length - 1])
      this.chart.setOption(this.optionData, true);
    }
  }
};
</script>

<style scoped lang="stylus"></style>
