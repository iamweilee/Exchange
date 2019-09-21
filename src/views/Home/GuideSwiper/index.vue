<template>
  <div class="guidPage">
    <div class="back_left">
      <van-icon class="back_icon" @click="clickLeft" name="arrow-left" />
      <p>{{ title }}</p>
    </div>
    <!-- <NavBar title="热门活动" hideBorder fixed showL @clickLeft="clickLeft"></NavBar> -->
    <div class="guideSwiper">
      <div class="custom-indicator">
        <p class="title">STEP</p>
        <p class="num">{{ current + 1 }}</p>
      </div>
      <van-swipe
        ref="swiper"
        @change="onChange"
        :show-indicators="false"
        :loop="false"
      >
        <van-swipe-item v-for="item in swiperList" :key="item.id">
          <div class="guideSwiper_item">
            <img :src="item.pic" alt />
          </div>
        </van-swipe-item>
      </van-swipe>
      <div class="lrBtn">
        <p @click="left">
          <img src="~assets/Images/guide/left.png" alt />
        </p>
        <p @click="right">
          <img src="~assets/Images/guide/right.png" alt />
        </p>
      </div>
    </div>
    <div class="guidPage_intord">
      {{ botText }}
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import { log } from "util";
export default {
  data() {
    return {
      current: 0,
      swiperList: [],
      botText: "",
      title: ""
    };
  },
  components: { NavBar },
  mounted() {
    let type = this.$route.params.type;
    this.typeShowImg(type);
  },
  methods: {
    onChange(index) {
      this.current = index;
      //   this.$toast(index);
    },
    clickLeft() {
      this.$router.back();
    },
    left() {
      this.$refs.swiper.swipeTo(this.current - 1);
    },
    right() {
      this.$refs.swiper.swipeTo(this.current + 1);
    },
    typeShowImg(type) {
      switch (Number(type)) {
        case 1:
          this.title = "系统操作指南";
          this.swiperList = [
            {
              pic: require("../../../assets/Images/guide/k_line/1.png"),
              id: 1
            },
            { pic: require("../../../assets/Images/guide/k_line/2.png"), id: 2 }
          ];
          this.botText =
            "进入首页后，点击头像，会出现登录界面，再点击右上角“注册”按钮，输入手机号或邮箱验证码进行注册，即可";
          return;
        case 2:
          this.title = "快捷开户";
          this.swiperList = [
            {
              pic: require("../../../assets/Images/guide/shortcat/1.png"),
              id: 1
            },
            {
              pic: require("../../../assets/Images/guide/shortcat/2.png"),
              id: 2
            },
            {
              pic: require("../../../assets/Images/guide/shortcat/3.png"),
              id: 3
            }
          ];
          this.botText =
            "进入首页后，点击头像，会出现登录界面，再点击右上角“注册”按钮，输入手机号或邮箱验证码进行注册，即可";
          return;
        case 3:
          this.title = "K线指标设置";
          this.swiperList = [
            {
              pic: require("../../../assets/Images/guide/k_line/1.png"),
              id: 1
            },
            { pic: require("../../../assets/Images/guide/k_line/2.png"), id: 2 }
          ];
          this.botText =
            "点击进入行业页面，点击“指标”，MACD、KDJ、RSI等指标，可以查看相应参数，点击“隐藏”，指标会隐藏。同时点击1分、5分、1时，可以选择查看相应时间段指标。";
          return;
        case 4:
          this.title = "杠杆交易操作";
          this.swiperList = [
            {
              pic: require("../../../assets/Images/guide/lever/1.png"),
              id: 1
            },
            {
              pic: require("../../../assets/Images/guide/lever/2.png"),
              id: 2
            },
            {
              pic: require("../../../assets/Images/guide/lever/3.png"),
              id: 3
            }
          ];
          this.botText =
            "点击底部按钮“杠杆”，同时选择要操作的数字货币，进入详细操作界面，可进行止盈止损、持仓过夜、追单、平仓等操作";
          return;
        case 5:
          this.title = "账户充值/提币";
          this.swiperList = [
            {
              pic: require("../../../assets/Images/guide/draw_reg/1.png"),
              id: 1
            },
            {
              pic: require("../../../assets/Images/guide/draw_reg/2.png"),
              id: 2
            },
            {
              pic: require("../../../assets/Images/guide/draw_reg/3.png"),
              id: 3
            },
            {
              pic: require("../../../assets/Images/guide/draw_reg/4.png"),
              id: 4
            },
            {
              pic: require("../../../assets/Images/guide/draw_reg/5.png"),
              id: 5
            },
            {
              pic: require("../../../assets/Images/guide/draw_reg/6.png"),
              id: 6
            }
          ];
          this.botText =
            "点击底部“我的”，再点击“立即充币”，可选择“OTC交易”和“钱包转账交易”OTC交易为了防止洗钱，根据法律规定，OTC交易必须完成实名认证并绑定银行卡，才能进一步交易钱包转账交易钱包转账交易是指将USDT等数字货币转到平台的充值地址（请注意非本币种转入后将造成数字货币的丢失）提币钱包提币钱先确认提币地址的正确，提币手续费为5%USDT/笔";
          return;
        case 6:
          this.title = "推广赚钱";
          this.swiperList = [
            {
              pic: require("../../../assets/Images/guide/generalize/1.png"),
              id: 1
            },
            {
              pic: require("../../../assets/Images/guide/generalize/2.png"),
              id: 2
            },
            {
              pic: require("../../../assets/Images/guide/generalize/3.png"),
              id: 3
            }
          ];
          this.botText =
            "首页点击“我的徒弟”即可进入推广赚钱页面，一旦收徒，您将获得徒弟交易手续费15%的永久分成";
          return;
      }
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
