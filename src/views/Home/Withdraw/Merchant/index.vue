<template>
  <div class="merchant">
    <div class="merchant_title">
      <p>已为您甄选优质商家！</p>
      <p class="link" @click="showCustomDialog">什么是OTC？</p>
    </div>
    <div class="merchant_single">
      <div
        class="single"
        v-for="item in otcData.list"
        :key="item.id"
        @click="toRecharge(item)"
      >
        <div class="single_t">
          <div class="single_t_l">
            <p class="name">{{ item.userName }}</p>
            <div class="single_t_l_b">
              <p>{{ item.successService }}笔交易</p>
              <p class="line-1px">
                {{
                  ((item.successService * 100) /
                    (item.successService + item.failService))
                    | priceFormat
                }}%成交量
              </p>
            </div>
          </div>
          <div class="single_t_r">
            <button>{{ item.authType ? "已认证" : "未认证" }}</button>
          </div>
        </div>
        <div class="single_m">
          <div class="single_m_l">
            <p>
              限额：&nbsp;单笔{{ item.buyMinAmount }}-{{
                item.buyMaxAmount
              }}&nbsp;USDT
            </p>
            <p class="tips">{{ item.accountDesc }}</p>
          </div>
          <div class="single_m_r">
            <p>单价：</p>
            <p class="price">≈{{ item.buyRate }}</p>
          </div>
        </div>
        <div class="single_b">
          <div class="single_b_l">
            <p>支持：</p>
            <p class="icon">
              <img src="~assets/Images/Otc/icon_bank.png" alt />
              网银
            </p>
            <p class="icon">
              <img src="~assets/Images/Otc/icon_phone.png" alt />
              手机
            </p>
          </div>
          <div class="single_b_r">
            <button>出售</button>
          </div>
        </div>
      </div>
    </div>
    <customDialog ref="customDialog" ButtonText="知道了">
      <p>
        OTC交易为场外交易，平台与商户签约，用户可通过平台与商户签约商户自由进行数字货币资产与法币买卖。
      </p>
      <p>如买方以法币（人民币）购买出售方提供的数字资产，如USDT</p>
    </customDialog>
    <Withdraw ref="Withdraw" />
  </div>
</template>

<script>
import Withdraw from "components/Withdraw";
import customDialog from "components/customDialog";
import extendsCom from "@/extendsCom";
export default {
  extends: extendsCom,
  data() {
    return {
      otcData: {},
      showOtc: false
    };
  },
  mounted() {
    this._initPage();
  },
  components: {
    Withdraw,
    customDialog
  },
  methods: {
    _initPage() {
      this.getOtcList();
    },
    getOtcList() {
      this.$http({
        url: "/v1/position/otc/info-list",
        data: { pageNo: 1, pageSize: 20 },
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.otcData = res.data;
        }
      });
    },
    //跳转到充值页面
    toRecharge(item) {
      this.$refs.Withdraw.showSelf(item);
      //   this.$router.push("/recharge");
    }
  }
};
</script>
