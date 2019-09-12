<template>
  <div class="address">
    <NavBar title="新建地址" fixed showL @clickLeft="clickLeft" />
    <div class="address_wrap">
      <div class="from">
        <div class="from_single">
          <p class="label">*提币地址：</p>
          <p class="inp">
            <input
              type="text"
              v-model="req.drawAdd"
              placeholder="请输入地址,最多输入100个字符"
              v-debounce="{
                fn: verify,
                method: 'input'
              }"
            />
          </p>
        </div>
        <div class="from_single">
          <p class="label">地址标签：</p>
          <div class="inp">
            <input type="text" v-model="req.remarks" placeholder="15个字以内" />
            <p class="inp_tips">（备注(地址名称)，选填）</p>
          </div>
        </div>
        <div class="from_select" @click="isCheckBox = !isCheckBox">
          <p class="checkbox">
            <img
              v-show="isCheckBox"
              src="~assets/Images/other/icon_check.png"
              alt
            />
          </p>
          <p class="size">
            本人承诺已确认新增USDT提币地址，并确保提币地址正确无误
          </p>
        </div>
      </div>
      <button class="okBtn" :disabled="isClick" @click="addAddress">
        确定
      </button>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import { isAddress } from "common/utli";
export default {
  data() {
    return {
      isCheckBox: true,
      isClick: true,
      req: {
        coinCode: "USDT",
        drawAdd: "",
        remarks: "",
        codeType: 10
      }
    };
  },
  components: {
    NavBar
  },
  mounted() {},
  methods: {
    //   14bnX9hnvLpEhJjaWHtr392jQsu8SEwGv5
    addAddress() {
      this.$http({
        url: "/v1/user/add_draw_address",
        data: this.req,
        method: "post"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.$router.push("/withdraw/list");
        }
      });
    },
    verify() {
      let addressStr;
      addressStr = isAddress(this.req.drawAdd);
      addressStr ? (this.isClick = true) : (this.isClick = false);
    },
    clickLeft() {
      this.$router.push("/withdraw/wallet");
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
