<template>
  <div class="holdD">
    <NavBar
      :title="$t('chat').DetailTitle"
      fixed
      showL
      @clickLeft="clickLeft"
    />
    <div class="holdD_btn">
      <ScrollH scrollX :data="btnList">
        <div class="holdD_btn_scroll">
          <button
            v-for="item in btnList"
            :key="item.title"
            :class="item.title == resolution && 'active'"
            @click="checkResolution(item.title)"
          >
            {{ item.title }}
          </button>
        </div>
      </ScrollH>
    </div>
    <div class="holdD_kline">
      <div class="holdD_kline_container">
        <Echart />
      </div>
    </div>
    <div class="dotted"></div>
    <div class="holdD_title">
      <div class="holdD_title_top">
        <p>{{ orderDetail.tradeCode }}</p>
        <p>-600</p>
      </div>
      <div class="holdD_title_bot">
        <p>{{ orderDetail.tradeType == 0 ? $t("rise") : $t("fall") }}</p>
        <p>{{ $t("chat").setting }}</p>
      </div>
    </div>
    <div class="holdD_info">
      <ul class="List">
        <li>
          <p>
            <span>{{ $t("chat").lossPrice }}</span>
            <span>{{ orderDetail.stopLoss | priceFormat }}</span>
          </p>
          <p>
            <span>{{ $t("chat").currentPrice }}</span>
            <span>{{ orderDetail.tradePrice | priceFormat }}</span>
          </p>
        </li>
        <li>
          <p>
            <span>{{ $t("chat").profitPrice }}</span>
            <span>{{ orderDetail.stopProfit | priceFormat }}</span>
          </p>
          <p>
            <span>{{ $t("chat").dealPrice }}</span>
            <span>{{ orderDetail.dealPrice | priceFormat }}</span>
          </p>
        </li>
        <li>
          <p>
            <span>{{ $t("chat").leverage }}</span>
            <span>{{ orderDetail.leverage }}</span>
          </p>
          <p>
            <span>{{ $t("chat").deposit }}</span>
            <span>{{ orderDetail.deposit }}</span>
          </p>
        </li>
        <li>
          <p>
            <span>{{ $t("chat").inventoryFree }}</span>
            <span>0.529</span>
          </p>
          <p>
            <span>{{ $t("chat").dealMarket }}</span>
            <span>{{
              (orderDetail.dealPrice * orderDetail.tradeAmount) | priceFormat
            }}</span>
          </p>
        </li>
        <li class="List_bot mt_bot">
          <p>{{ $t("chat").volume }}</p>
          <p>
            {{ orderDetail.tradeAmount / orderDetail.stockRate
            }}{{ $t("hand") }}({{ orderDetail.tradeAmount }}个)
          </p>
        </li>
        <li class="List_bot">
          <p>{{ $t("freeSyn") }}</p>
          <p>{{ orderDetail.poundageAmount | priceFormat }}</p>
        </li>
      </ul>
    </div>
    <div class="dotted"></div>
    <div class="holdD_order">
      <p>{{ $t("chat").dealTime }}：{{ orderDetail.dealTime }}</p>
      <p>{{ $t("chat").orderNo }}：{{ orderDetail.orderNo }}</p>
      <p></p>
    </div>
    <div class="dotted"></div>
    <div class="holdD_night">
      <div class="holdD_night_left">
        <p>{{ $t("night") }}</p>
        <p class="icon_size">
          <img src="~assets/Images/other/icon_night.png" alt />{{
            $t("holdTo")
          }}6:00
        </p>
      </div>
      <van-switch
        v-model="checked"
        active-color="#00A7E0"
        inactive-color="#DEDEDE"
        size="0.5rem"
      />
    </div>
    <div class="holdD_hanle">
      <button>{{ $t("chat").goOrder }}</button>
      <button>{{ $t("chat").closeOut }}</button>
    </div>
  </div>
</template>

<script>
import ScrollH from "components/Scroll/ScrollH";
import NavBar from "components/NavBar";
import Echart from "components/Echart";
export default {
  data() {
    return {
      btnList: [
        { title: "1分" },
        { title: "5分" },
        { title: "15分" },
        { title: "30分" },
        { title: "1时" },
        { title: "1日" },
        { title: "1周" },
        { title: "1月" }
      ],
      resolution: "5分",
      checked: true,
      orderDetail: {}
    };
  },
  mounted() {
    this.getDetail();
  },
  components: {
    NavBar,
    ScrollH,
    Echart
  },
  methods: {
    getDetail() {
      this.$http({
        url: "/v1/leverage/getOrder",
        data: { orderNo: this.$route.params.id },
        method: "get"
      }).then(res => {
        console.log(res);
        if (res.status == this.STATUS) {
          this.orderDetail = res.data;
        }
      });
    },
    checkResolution(resolution) {
      this.resolution = resolution;
    },
    clickLeft() {
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
