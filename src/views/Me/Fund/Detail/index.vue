<template>
  <div class="detail">
    <NavBar
      title="订单详情"
      fixed
      showL
      showR
      @clickLeft="clickLeft"
      @clickRight="clickRight"
    >
      <div slot="right" class="nav_right">客服</div>
    </NavBar>
    <div class="detail_wrap">
      <div class="detail_top">
        <div class="detail_titel">
          <h2>付款信息</h2>
          <p>
            <span>订单号:</span>
            <span>{{ detail.tradeId }}</span>
          </p>
        </div>
        <div class="detail_card">
          <ul class="cardTop">
            <li class="cardTop_left">
              <p>付款金额</p>
              <p class="big">￥{{ detail.rmbValue | priceFormat }}CNY</p>
            </li>
            <li class="cardTop_right">
              <p>{{ downTime }}</p>
              <p>{{ detail.status | statusType }}</p>
            </li>
          </ul>
          <ul class="cardBot">
            <li class="cardBot_left">
              <p>单价：{{ detail.rmbRate }}CNY/USDT</p>
              <p>数量：{{ detail.coinAmount }}USDT</p>
              <p>付款方式：网上银行</p>
            </li>
            <li class="cardBot_right">
              <p>付款姓名：{{ detail.userName }}</p>
              <p>{{ detail.createTime | dateFormat }}</p>
            </li>
          </ul>
        </div>
        <p class="card_tips">
          本订单有效时间为30分钟，您需在20分钟内完成付款并点击我已付款，否则订单自动取消
        </p>
      </div>
      <div class="custom_bot_bg"></div>
      <div class="detail_bot">
        <h2>转账信息</h2>
        <ul class="detail_bot_info">
          <li>
            <p>收款人姓名</p>
            <p
              v-clipboard:copy="detail.otcUserName"
              v-clipboard:success="onSuccess"
              v-clipboard:error="onError"
            >
              {{ detail.otcUserName }}
              <button class="copy">复制</button>
            </p>
          </li>
          <li>
            <p>农业银行</p>
            <p
              v-clipboard:copy="detail.otcBankAccount"
              v-clipboard:success="onSuccess"
              v-clipboard:error="onError"
            >
              {{ detail.otcBankAccount }}
              <button class="copy">复制</button>
            </p>
          </li>
        </ul>
      </div>
      <p class="detail_tips">支付宝转账时请备注您的姓名，否则无法到账</p>
    </div>
    <div class="detail_btn">
      <button
        class="cancel"
        v-debounce="{
          fn: cancelOrder
        }"
      >
        取消订单
      </button>
      <button
        v-if="detail.type == '0'"
        v-debounce="{
          fn: accountPaid
        }"
      >
        我已付款
      </button>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import { numTime, formatSeconds } from "common/utli";
export default {
  data() {
    return {
      detail: {},
      downTime: "",
      Timer: null
    };
  },
  components: {
    NavBar
  },
  mounted() {
    console.log(this.$route);
    this._initPage();
  },
  methods: {
    _initPage() {
      this.getDetail();
    },
    test() {
      return new Date("2018-12-28");
    },
    //我已付款
    accountPaid() {
      this.$http({
        url: `/v1/position/otc/recharge-user-confirm/${this.$route.params.id}`,
        method: "put"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.detail.status = "2";
        }
      });
    },
    //获取详情信息
    getDetail() {
      this.$http({
        url: `/v1/position/otc/record-info/${this.$route.params.id}`,
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.detail = res.data;
          this.timeEnd(res.data.updateTime);
        }
      });
    },
    //取消订单
    cancelOrder() {
      let url =
        this.detail.type == "0"
          ? "recharge-record-cancel"
          : "draw-record-cancel";

      this.$http({
        url: `/v1/position/otc/${url}/${this.$route.params.id}`,
        method: "put"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.$router.push(`/me/fund/status/${this.$route.params.id}`);
        }
      });
    },
    //倒计时
    timeEnd(creatDate) {
      let endDate = new Date(creatDate).getTime() + 1000 * 60 * 20;
      this.Timer = setInterval(() => {
        let newDate = new Date().getTime();
        if (endDate - newDate > 0) {
          let Time = formatSeconds(endDate - newDate);
          this.downTime = Time;
        } else {
          clearTimeout(this.Timer);
          this.$router.push(`/me/fund/status/${this.$route.params.id}`);
        }
      }, 1000);
    },
    clickLeft() {
      this.$router.back();
    },
    clickRight() {
      this.$router.push("/service");
    },
    onSuccess() {
      this.$toast("复制成功");
    },
    onError() {
      this.$toast("浏览器不支持复制");
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
