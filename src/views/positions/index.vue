<template>
  <div class="pos">
    <NavBar
      :title="symbol"
      fixed
      showL
      @clickLeft="clickLeft"
      @handleClick="showSelect"
    />
    <van-popup v-model="show" position="top">
      <div class="selectWrap">
        <h2>{{ symbol }}</h2>
        <ul class="selectList">
          <li
            v-for="item in List"
            @click="select(item.symbol)"
            :key="item.symbol"
          >
            <p class="coin">{{ item.symbol }}/USDT</p>
            <p class="price">{{ item.close }}</p>
          </li>
        </ul>
        <button class="selectBtn">切换至实际盘</button>
        <button class="closeBtn" @click="show = false">点击收起</button>
      </div>
    </van-popup>
    <!-- @click="show=!show" -->
    <div class="pos_top">
      <div class="pos_top_t">
        <div class="left color-green">{{ detailData.close | toFixeds(2) }}</div>
        <ul class="right">
          <li>高(24H)&nbsp;&nbsp;{{ detailData.high | toFixeds(2) }}</li>
          <li>低(24H)&nbsp;&nbsp;{{ detailData.low | toFixeds(2) }}</li>
          <li>量(24H)&nbsp;&nbsp;{{ detailData.amount | toFixeds(2) }}</li>
        </ul>
      </div>
      <div class="pos_top_btn">
        <div class="btn_list">
          <button :class="TVInterval == 1 && 'active'" @click="clickBtn(1)">
            1分
          </button>
          <button :class="TVInterval == 5 && 'active'" @click="clickBtn(5)">
            5分
          </button>
          <button :class="TVInterval == 15 && 'active'" @click="clickBtn(15)">
            15分
          </button>
          <button :class="TVInterval == 30 && 'active'" @click="clickBtn(30)">
            30分
          </button>
          <button :class="TVInterval == 60 && 'active'" @click="clickBtn(60)">
            1时
          </button>
          <button @click="clickBtnMore(true)">更多</button>
          <button @click="clickBtnMore(false)">指标</button>
        </div>
        <transition name="moreIndex">
          <div v-if="isShow" class="child_list">
            <div v-show="isOther">
              <button
                :class="TVInterval == '240' && 'active'"
                @click="clickBtn(240)"
              >
                4时
              </button>
              <button
                :class="TVInterval == '1D' && 'active'"
                @click="clickBtn('1D')"
              >
                1天
              </button>
              <button
                :class="TVInterval == '1W' && 'active'"
                @click="clickBtn('1W')"
              >
                1周
              </button>
              <button
                :class="TVInterval == '1M' && 'active'"
                @click="clickBtn('1M')"
              >
                1月
              </button>
            </div>
            <div v-show="!isOther">
              <button
                :class="TVInterval == 'MACD' && 'active'"
                @click="clickIndicator('MACD')"
              >
                MACD
              </button>
              <button
                :class="TVInterval == 'BOLL' && 'active'"
                @click="clickIndicator('BOLL')"
              >
                BOLL
              </button>
              <button
                :class="TVInterval == 'KDJ' && 'active'"
                @click="clickIndicator('KDJ')"
              >
                KDJ
              </button>
              <button
                :class="TVInterval == 'RSI' && 'active'"
                @click="clickIndicator('RSI')"
              >
                RSI
              </button>
              <button
                :class="TVInterval == 'WR' && 'active'"
                @click="clickIndicator('WR')"
              >
                WR
              </button>
              <button
                :class="TVInterval == 'closeOther' && 'active'"
                @click="clickIndicator('closeOther')"
              >
                隐藏
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="k_line">
      <TradingView
        ref="trading"
        :symbol="symbol"
        :interval="TVInterval"
      ></TradingView>
      <!-- <TradingView ref="trading"></TradingView> -->
      <div id="kline_logo"></div>
    </div>
    <div class="pos_wrap">
      <div class="tabs">
        <ul class="tabs_wrap">
          <li
            :class="tabsType == 'Capital' && 'active'"
            @click="tabClick('Capital')"
          >
            <p>资金</p>
          </li>
          <li
            :class="tabsType == 'Intord' && 'active'"
            @click="tabClick('Intord')"
          >
            <p>简介</p>
          </li>
        </ul>
        <div :style="styls" class="tabs_line"></div>
      </div>
      <div class="cont">
        <Capital v-if="tabsType == 'Capital'" />
        <Intord v-if="tabsType == 'Intord'" />
      </div>
    </div>
    <div class="handWrap">
      <button @click="showOrderHandle(1)">
        买跌 {{ (detailData.close * 1.008) | toFixeds(2) }}
      </button>
      <button @click="showOrderHandle(0)">
        买涨 {{ (detailData.close * 0.992) | toFixeds(2) }}
      </button>
    </div>
    <van-popup
      v-model="showOrder"
      position="bottom"
      :overlay-style="{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }"
    >
      <PlaceOrder
        :coinCode="$route.params.coinCode"
        :position="position"
        :cloeModle="cloeModle"
        :closePic="detailData.close"
      />
    </van-popup>
  </div>
</template>

<script>
import NavBar from "components/NavBar/pos";
import Capital from "./Capital";
import Intord from "./Intord";
import PlaceOrder from "./PlaceOrder";
import TradingView from "components/TradingView";
import { klineLastBar } from "components/TradingView/pro/stream";
export default {
  data() {
    return {
      TVInterval: this.$lStore.get("TVInterval") || 5,
      isOther: true,
      isShow: false,
      Indicator: "closeOther",
      show: false,
      symbol: `${this.$route.params.coinCode}/USDT`,
      tabsType: "Capital",
      showOrder: false,
      position: 0, //0买涨，1买跌
      styls: {
        left: 0
      },
      detailData: {},
      Socket: null,
      List: this.$lStore.get("setingData").coinList
    };
  },
  mounted() {
    this._initPage();
  },
  beforeDestroy() {
    this.$EventListener.off("TVdetail", this.renderDetail);
    this.$EventListener.off("TVkline", klineLastBar);
    this.$EventListener.fire("SendMsg", {});
  },
  components: {
    NavBar,
    TradingView,
    Capital,
    Intord,
    PlaceOrder
  },
  methods: {
    _initPage() {
      this.initSocket();
    },
    //显示下单
    showOrderHandle(position) {
      this.showOrder = true;
      this.position = position;
    },
    //关闭下单
    cloeModle() {
      this.showOrder = false;
    },
    //初始化Socket
    initSocket() {
      let datas = this.resolutionSocket(this.TVInterval);
      this.$EventListener.on("TVdetail", this.renderDetail);
      this.$EventListener.fire("SendMsg", datas);
    },
    //更新头部价格成交量
    renderDetail(data) {
      if (data.symbol == this.symbol) {
        this.detailData = data;
      }
      data.symbol = data.symbol.replace("/USDT", "");
      let List = this.List;
      for (let i = 0; i < List.length; i++) {
        if (List[i].symbol == data.symbol) {
          List[i] = data;
          break;
        }
      }
      this.List = [...List];
    },
    //点击tabs
    tabClick(type) {
      let index = 0;
      if (type === "Capital") {
        index = 0;
      } else if (type === "Intord") {
        index = 1;
      }
      this.styls = {
        left: index * 50 + "%"
      };
      this.tabsType = type;
    },
    //选择币种
    select(coinCode) {
      this.symbol = `${coinCode}/USDT`;
    },
    clickLeft() {
      this.$router.push("/");
    },
    //点击TV的分辨率
    clickBtn(resolution) {
      let datas = this.resolutionSocket(resolution);
      this.$lStore.set("TVInterval", resolution);
      this.isShow = false;
      this.TVInterval = resolution;
      this.$refs.trading.clickBtn(resolution);
      this.$EventListener.fire("SendMsg", datas);
    },
    //socket 时间区间格式化
    resolutionSocket(resolution) {
      let type = typeof resolution,
        coinCode = this.$route.params.coinCode.toLowerCase() + "usdt",
        datas = {};
      this.List.forEach(item => {
        datas[`${item.symbol.toLowerCase()}usdt-ticker`] = 0;
      });
      datas[`${coinCode}-depth`] = 0;
      if (type == "number") {
        datas[`${coinCode}-kline-${resolution}m`] = 0;
      } else if (type == "string") {
        if (resolution == "1M") {
          datas[`${coinCode}-kline-${resolution}`] = 0;
        } else {
          datas[`${coinCode}-kline-${resolution.toLowerCase()}`] = 0;
        }
      }
      return datas;
    },
    //显示币种列表
    showSelect() {
      this.show = true;
    },
    //点击打开更多
    clickBtnMore(bol) {
      this.isOther = bol;
      this.isShow = true;
    },
    //选择指标类型
    clickIndicator(type) {
      this.$refs.trading[type]();
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
