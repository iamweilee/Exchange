<template>
  <div class="pos">
    <NavBar
      :title="`${symbol}${tradeType ? '' : `(${$t('real')})`}`"
      fixed
      showL
      showR
      right="持仓"
      @clickLeft="clickLeft"
      @clickRight="clickRight"
      @handleClick="showSelect"
    />
    <van-popup v-model="show" position="top" @close="closeSelect">
      <div class="selectWrap">
        <h2>{{ `${symbol}${tradeType ? "" : `(${$t("real")})`}` }}</h2>
        <ul class="selectList">
          <li
            v-for="item in List"
            @click="select(item.symbol)"
            :key="item.symbol"
            :class="coinCode == item.symbol && 'active'"
          >
            <p class="coin">{{ item.symbol }}/USDT</p>
            <p class="price">
              {{
                item.close | priceFormat(coinPrecision[item.symbol].tickLength)
              }}
            </p>
          </li>
        </ul>
        <button class="selectBtn" @click="setTradeType(!tradeType)">
          {{ $t(isMock(tradeType)) }}
        </button>
        <button class="closeBtn" @click="closeSelect">
          {{ $t("pos").clickHide }}
        </button>
      </div>
    </van-popup>
    <!-- @click="show=!show" -->
    <div class="pos_wrapper">
      <div class="pos_top" v-if="detailData.close">
        <div class="pos_top_t">
          <div class="left">
            <div class="color-green">
              {{
                detailData.close | priceFormat(coinPrecision[coinCode].tickLength)
              }}
            </div>
            <div class="small">
              <p>{{ detailData.diff }}</p>
              <p>{{ detailData.percent | priceFormat }}%</p>
            </div>
          </div>
          <ul class="right">
            <li>
              {{ $t("pos").high }}(24H)&nbsp;&nbsp;{{
                detailData.high | priceFormat(coinPrecision[coinCode].tickLength)
              }}
            </li>
            <li>
              {{ $t("pos").low }}(24H)&nbsp;&nbsp;{{
                detailData.low | priceFormat(coinPrecision[coinCode].tickLength)
              }}
            </li>
            <li>
              {{ $t("pos").amount }}(24H)&nbsp;&nbsp;{{
                parseInt(detailData.amount)
              }}
            </li>
          </ul>
        </div>
        <div class="pos_top_btn">
          <div class="btn_list">
            <button :class="TVInterval == 1 && 'active'" @click="clickBtn(1)">
              1{{ $t("pos").minute }}
            </button>
            <button :class="TVInterval == 5 && 'active'" @click="clickBtn(5)">
              5{{ $t("pos").minute }}
            </button>
            <button :class="TVInterval == 15 && 'active'" @click="clickBtn(15)">
              15{{ $t("pos").minute }}
            </button>
            <button :class="TVInterval == 30 && 'active'" @click="clickBtn(30)">
              30{{ $t("pos").minute }}
            </button>
            <button :class="TVInterval == 60 && 'active'" @click="clickBtn(60)">
              1{{ $t("pos").hour }}
            </button>
            <button @click="clickBtnMore(true)">{{ $t("more") }}</button>
            <button @click="clickBtnMore(false)">
              {{ $t("pos").indicator }}
            </button>
          </div>
          <transition name="moreIndex">
            <div v-if="isShow" class="child_list">
              <div v-show="isOther">
                <button
                  :class="TVInterval == '240' && 'active'"
                  @click="clickBtn(240)"
                >
                  4{{ $t("pos").hour }}
                </button>
                <button
                  :class="TVInterval == '1D' && 'active'"
                  @click="clickBtn('1D')"
                >
                  1{{ $t("pos").day }}
                </button>
                <button
                  :class="TVInterval == '1W' && 'active'"
                  @click="clickBtn('1W')"
                >
                  1{{ $t("pos").week }}
                </button>
                <button
                  :class="TVInterval == '1M' && 'active'"
                  @click="clickBtn('1M')"
                >
                  1{{ $t("pos").month }}
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
                  {{ $t("pos").hide }}
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
              <p>{{ $t("pos").fund }}</p>
            </li>
            <li
              :class="tabsType == 'Intord' && 'active'"
              @click="tabClick('Intord')"
            >
              <p>{{ $t("pos").intord }}</p>
            </li>
          </ul>
          <div :style="styls" class="tabs_line"></div>
        </div>
        <div class="cont">
          <Capital
            v-if="tabsType == 'Capital'"
            :coinPrecision="coinPrecision[coinCode]"
          />
          <Intord v-if="tabsType == 'Intord'" :intordData="intordData" />
        </div>
      </div>
    </div>
    <!-- <van-popup v-model="showOrder" position="bottom" :overlay="false"> -->
    <PlaceOrder
      v-if="showOrder"
      :coinCode="$route.params.coinCode"
      :position="position"
      :cloeModle="cloeModle"
      :closePic="detailData.close"
      :succeedOrder="succeedOrder"
      :coinData="coinPrecision[coinCode]"
    />
    <div class="handWrap">
      <button @click="showOrderHandle(1)">
        {{ $t("pos").buyFall }}
        {{
          (detailData.close * 1.0003)
            | priceFormat(coinPrecision[coinCode].tickLength)
        }}
      </button>
      <button @click="showOrderHandle(0)">
        {{ $t("pos").buyRise }}
        {{
          (detailData.close * 0.9997)
            | priceFormat(coinPrecision[coinCode].tickLength)
        }}
      </button>
    </div>
    <!-- </van-popup> -->
    <van-dialog
      closeOnClickOverlay
      v-model="showSucceed"
      :title="$t('orderSucc')"
      :beforeClose="beforeClose"
      :confirmButtonText="$t('seeOrder')"
      class="customDialog"
    >
      <ul class="hold_dialog">
        <li>
          <p>{{ succeedData.targetCoin }}</p>
          <p>{{ succeedData.tradeAmount }}</p>
        </li>
        <li>
          <p>{{ $t("chat").dealPrice }}</p>
          <p>{{ succeedData.tradePrice }}</p>
        </li>
      </ul>
    </van-dialog>
  </div>
</template>

<script>
import NavBar from "components/NavBar/pos";
import Capital from "./Capital";
import Intord from "./Intord";
import PlaceOrder from "./PlaceOrder";
import TradingView from "components/TradingView";
import { klineLastBar } from "components/TradingView/pro/stream";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      TVInterval: this.$lStore.get("TVInterval") || 15,
      coinPrecision: this.$lStore.get("coinPrecision"),
      isOther: true,
      isShow: false,
      Indicator: "closeOther",
      show: false,
      symbol: `${this.$route.params.coinCode}/USDT`,
      coinCode: this.$route.params.coinCode,
      intordData: {},
      tabsType: "Capital",
      showOrder: false,
      position: 0, //0买涨，1买跌
      styls: {
        left: 0
      },
      detailData: {},
      Socket: null,
      List: this.$lStore.get("setingData").coinList,
      showSucceed: false,
      succeedData: {}
    };
  },
  computed: {
    ...mapState(["tradeType"])
  },
  mounted() {
    this._initPage();
  },
  beforeDestroy() {
    document.body.style = "";
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
      document.body.style.backgroundColor = "#1B212D";

      if (!this.$lStore.get("desc")[this.$route.params.coinCode]) {
        this.intordData = this.$lStore.get("desc")["BTC"];
      } else {
        this.intordData = this.$lStore.get("desc")[this.$route.params.coinCode];
      }
      this.coinCode = this.$route.params.coinCode;
      this.initSocket();
    },
    beforeClose(action, done) {
      if (action == "confirm") {
        let path = this.succeedData.tradeType == 1 ? "/chat/list" : "/chat";
        this.$router.push(path);
      } else {
        done();
      }
    },
    succeedOrder(req) {
      this.succeedData = req;
      this.showSucceed = true;
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
      this.$router.push(`/position/${coinCode}`);
      this.symbol = `${coinCode}/USDT`;
      this._initPage();
    },
    clickLeft() {
      this.$router.push("/lever");
    },
    clickRight() {
      this.$router.push("/chat");
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
    resolutionSocket(resolution, isAllCoin) {
      let type = typeof resolution,
        coinCode = this.$route.params.coinCode.toLowerCase() + "usdt",
        datas = {};
      if (isAllCoin) {
        this.List.forEach(item => {
          datas[`${item.symbol.toLowerCase()}usdt-ticker`] = 0;
        });
      } else {
        datas[`${coinCode}-ticker`] = 0;
      }
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
      let datas = this.resolutionSocket(this.TVInterval, true);
      this.$EventListener.fire("SendMsg", datas);
    },
    //隐藏币种列表
    closeSelect() {
      this.show = false;
      let datas = this.resolutionSocket(this.TVInterval);
      this.$EventListener.fire("SendMsg", datas);
    },
    //点击打开更多
    clickBtnMore(bol) {
      this.isOther = bol;
      this.isShow = true;
    },
    //选择指标类型
    clickIndicator(type) {
      this.$refs.trading[type]();
    },
    isMock(tradeType) {
      if (tradeType) {
        return "cutReal";
      } else {
        return "cutFake";
      }
    },
    ...mapActions(["setTradeType"])
  }
};
</script>
<style scoped lang="stylus">
@import './style';
</style>
