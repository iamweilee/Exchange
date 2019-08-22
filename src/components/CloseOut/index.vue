<template>
  <div>
    <van-dialog
      v-model="show"
      :title="`确认${dialogData.title}`"
      show-cancel-button
      :beforeClose="beforeClose"
      class="customDialog"
    >
      <p class="order">{{ $t("chat").orderNo }}{{ dialogData.orderNo }}</p>
      <ul class="hold_dialog" v-if="dialogData.title == '平仓'">
        <li>
          <p>{{ $t("chat").floatProfit }}</p>
          <p>+1.92</p>
        </li>
        <li>
          <p>{{ $t("chat").dealPrice }}</p>
          <p>{{ dialogData.dealPrice }}</p>
        </li>
        <li>
          <p>{{ $t("chat").currentPrice }}</p>
          <p>{{ currentPrice || dialogData.tradePrice }}</p>
        </li>
      </ul>
      <ul class="hold_dialog" v-else>
        <li>
          <p>{{ dialogData.targetCoin }}</p>
          <p>{{ dialogData.tradeAmount }}</p>
        </li>
        <li>
          <p>{{ $t("chat").tradePrice }}</p>
          <p>{{ currentPrice || dialogData.tradePrice }}</p>
        </li>
      </ul>
    </van-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: {
    dialogData: {
      type: Object,
      required: true
    },
    dialogDataNull: {
      type: Function,
      default: () => {
        console.log("nullData");
      }
    },
    currentPrice: {
      type: [Number, String],
      default: 0
    },
    tradeType: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    beforeClose(action, done) {
      if (action == "cancel") {
        this.dialogDataNull();
        done();
      } else {
        let url = "",
          method = "get";
        if (this.tradeType) {
          url =
            this.dialogData.title == "平仓"
              ? "/v1/leverage/eveningUp"
              : "/v1/leverage/cancel";
   
        } else {
          url =
            this.dialogData.title == "平仓"
              ? "/v1/mock/eveningUp"
              : "/v1/mock/cancel";
          
        }

        this.$http({
          url: url,
          data: { orderNo: this.dialogData.orderNo },
          method: "get"
        })
          .then(res => {
            if (res.status == this.STATUS) {
              this.dialogData.cb(done);
              this.getBanlace();
            }
          })
          .catch(err => {
            this.$toast(err.data.message);
            done(false);
          });
      }

      return false;
    },
    ...mapActions(["getBanlace"])
  },
  watch: {
    dialogData(val) {
      console.log(val);
    }
  }
};
</script>