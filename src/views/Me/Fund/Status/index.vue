<template>
  <div class="status">
    <NavBar title="订单状态" fixed showL @clickLeft="clickLeft" />
    <div class="status_wrap">
      <ul class="status_top">
        <li>
          <h2>订单信息</h2>
          <p>{{ detail.status | statusType }}</p>
        </li>
        <li>
          <p>付款金额</p>
          <p>
            <span class="big">{{ detail.rmbValue | priceFormat }}</span>
            <span>CNY</span>
          </p>
        </li>
        <li>
          <p>单价</p>
          <p>
            <span class="color6">{{ detail.rmbRate }}</span>
            <span>CNY</span>
          </p>
        </li>
        <li>
          <p>数量</p>
          <p>
            <span class="color6">{{ detail.coinAmount }}</span>
            <span>USDT</span>
          </p>
        </li>
      </ul>
      <div class="custom_bot_bg"></div>
      <ul class="status_bot">
        <li>
          <p>支付方式</p>
          <p>银行卡</p>
        </li>
        <li>
          <p>付款人姓名</p>
          <p>{{ detail.userName }}</p>
        </li>
        <li>
          <p>下单时间</p>
          <p>{{ detail.createTime | dateFormat }}</p>
        </li>
        <li>
          <p>订单号</p>
          <p>{{ detail.tradeId }}</p>
        </li>
      </ul>
    </div>
    <div class="status_btn">
      <button @click="toService">联系客服</button>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {
      detail: {}
    };
  },
  components: {
    NavBar
  },
  mounted() {
    this._initPage();
  },
  methods: {
    _initPage() {
      this.getDetail();
    },
    //获取详情信息
    getDetail() {
      this.$http({
        url: `/v1/position/otc/record-info/${this.$route.params.id}`
      }).then(res => {
        if (res.status == this.STATUS) {
          this.detail = res.data;
        }
      });
    },
    clickLeft() {
      this.$router.push("/me/fund");
    },
    toService() {
      this.$router.push("/service");
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~assets/stylus/variable';
.status {
  background-color: $write;
  height: 100%;
  &_wrap {
    subScroll(46px, 92px);
  }
  &_top {
    padding: 0 16px;
    height: 162px;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 36px;
      font-size: 15px;
      h2 {
        padding: 20px 0 12px 0;
        font-size: 18px;
      }
      p {
        &:first-child {
          color: $color6;
        }
        &:last-child {
          color: $color9;
          span {
            &:last-child {
              margin-left: 10px;
            }
          }
          .big {
            font-size: 22px;
            color: $red;
          }
        }
      }
    }
  }
  &_bot {
    padding: 16px;
    li {
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        color: $color6;
        font-size: 15px;
        &:last-child {
          color: $color3;
        }
      }
    }
  }
  &_btn {
    padding: 16px 16px 32px 16px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    button {
      width: 100%;
      height: 44px;
      background: url('../../../../assets/Images/regLogin/bg_btn.png') no-repeat center / cover;
      border: none;
      color: #fff;
      font-size: 18px;
    }
  }
}
</style>

