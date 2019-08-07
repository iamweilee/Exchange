<template>
  <!--图表内容区域，必须给 ECharts 容器本身指定高度。不然它会使用默认高度-->
  <div class="chart">
    <div id="echarts" style="height: 200px;width:100%"></div>
  </div>
</template>

  <script>
import echarts from "echarts";
import option from "./option";

export default {
  name: "quotation",
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    //初始化 ECharts 实例，不能在created生命周期内初始化，因为那时候DOM还没有渲染，是找不到元素的
    this.initChart();
  },
  beforeDestroy() {
    //组件销毁前先销毁 ECharts 实例
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      // 基于准备好的dom，初始化echarts实例,移动端建议使用 svg模式
      this.chart = echarts.init(
        document.getElementById("echarts")
        //   , null, {
        //     renderer: "svg"
        //   }
      );
      this.chart.setOption(option, true);
      let _this = this;
    //   setInterval(() => {
    //     let arr = option.series[0].data;
    //     arr[arr.length - 1][0] -= 1;
    //     // option.series[0].data.slice(-1)[0] -= 2;
    //     console.log(arr[arr.length - 1][0]);
    //     _this.chart.setOption(option, true);
    //   }, 2000);
      //图标根据窗口大小自动缩放
      // window.addEventListener("resize", this.chart.resize);
    }
  }
};
</script>

<style scoped lang="stylus"></style>
