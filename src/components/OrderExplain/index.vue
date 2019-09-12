<template>
  <van-popup
    v-model="isShow"
    position="right"
    class="popup"
    :style="{ height: '100%', width: '100%' }"
  >
    <p class="popup_close" @click="closeExplain">
      <van-icon name="cross" />
    </p>
    <div class="popup_wrap">
      <div class="popup_item">
        <div class="title">
          <img src="~assets/Images/disciple/icon_4.png" alt />常见保证金问题
        </div>
        <ul>
          <li>
            1.何为固定保证金交易
            <p>
              保证金是投资者放在自己开设的交易合约中的资金（承担风险的资金），用来弥补或者部分弥补可能遭受的亏损。保证金交易充分利用了杠杆投资的原理，即用较少的资金实现获取较大收益的可能性。如购买一个BTC，合约价值为6800
              USDT，投资者选择固额保证金交易，即可用200USDT成交1个BTC。固额保证金，三个档位，保证金越小风险越大，投资者谨慎选择！
            </p>
          </li>
          <li>
            2.保证金模式下强制平仓的情况
            <p>
              一是亏损费用超出保证金的90%；二是用户没有设置【持仓过夜】,在次日05:53前会被系统强制平仓；三是账户资金不足以支付递延费。
            </p>
          </li>
        </ul>
      </div>
      <div class="popup_item">
        <div class="title">
          <img src="~assets/Images/disciple/icon_4.png" alt />下单方式
        </div>

        <ul>
          <li>
            1.市价：
            <p>以当前价成交，默认止盈止损点设置为占用保证金的80%。</p>
          </li>
          <li>
            2.挂单：
            <p>
              是用户设定期望价格，当价格走势达到用户预期价格则成交，如规定时间内未达到预期价格，则挂单失败。
            </p>
          </li>
        </ul>
      </div>
      <div class="popup_item">
        <div class="title">
          <img src="~assets/Images/disciple/icon_4.png" alt />介绍
        </div>

        <div class="intro">
          <div>
            交易品种
            <span>比特币(BTCUSDT)</span>
          </div>
          <div>交易时间<span>周一至周日06:05-次日05:55</span></div>
          <div>
            最小交易量<span>1 <em>个</em></span>
          </div>
          <div>
            最大交易量<span>8 <em>个</em></span>
          </div>
          <div>交易综合费<span>（交易量*开仓价-占用保证金）*0.004</span></div>
          <div>库存费<span>每笔交易综合费的30%</span></div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    };
  },

  methods: {
    showExplain() {
      this.isShow = true;
    },
    closeExplain() {
      this.isShow = false;
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
