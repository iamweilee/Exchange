<template>
  <div class="phone">
    <div class="inp_group border-1px">
      <p class="inp_group_left" @click="show = !show">
        <span>{{ defaultData[0].value }}</span>
        <img src="~Images/regLogin/icon_tel.png" alt />
      </p>
      <input
        type="text"
        class="pl"
        :placeholder="$t('loginReg').phonePlaceholder"
        v-model="fromData.phone"
      />
    </div>
    <div class="inp_group border-1px">
      <input
        type="text"
        :placeholder="$t('loginReg').codePlaceholder"
        v-model="fromData.code"
      />
      <button class="inp_group_right" :disabled="isSend" @click="sendMsg">
        {{ sendBtnText }}
      </button>
    </div>
    <vue-pickers
      :show="show"
      :columns="columns"
      :defaultData="defaultData"
      :selectData="pickData"
      @cancel="close"
      @confirm="confirmFn"
    ></vue-pickers>
  </div>
</template>

<script>
import country from "common/country.json";
import vuePickers from "components/customPick";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isSend: false, //发送验证码按钮是否可点击
      sendBtnText: "获取验证码",
      timer: null,
      fromData: {
        phone: "",
        code: "123456"
      },
      defaultData: [{ text: "86(中国)", value: "86" }],
      pickData: {},
      columns: 1,
      show: false
    };
  },
  mounted() {
    let arr = country.map(item => {
      return { text: item.code + "(" + item.country + ")", value: item.code };
    });
    let obj = {
      data1: arr
    };
    this.pickData = obj;
  },
  destroyed() {
    clearInterval(this.timer);
  },
  components: { vuePickers },
  methods: {
    close() {
      this.show = false;
    },
    //pick 点击确认按钮
    confirmFn(val) {
      this.defaultData = [val.select1];
      this.show = false;
    },
    //发送验证
    sendMsg() {
      let _this = this;
      this.sendMsgComm({
        loginName: this.fromData.phone,
        codeType: 2,
        areaCode: this.defaultData.value,
        fn: _this.$timeSet.bind("regPhone", _this)
      });
    },
    ...mapActions(["sendMsgComm"])
  }
};
</script>

<style scoped lang="stylus">
@import '~assets/stylus/variable.styl';
.phone {
  width: 100%;
  .inp_group {
    border-1px($color12, 100%);
    height: 72px;
    font-size: 16px;
    margin-bottom: 1px;
    padding-left: 2px;
    width: 100%;
    input {
      width: 100%;
      height: 100%;
      border: none;
      placeholderColor($color9);
      font-size: 18px;
      &.pl {
        padding-left: 50px;
      }
    }
    &_left {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      width: 50px;
      span {
        color: $color6;
        font-size: 18px;
      }
      img {
        margin-left: 6px;
        width: 6px;
      }
    }
    &_right {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      line-height: 64px;
      padding: 6px;
      color: $color6;
      font-size: 14px;
      border: none;
      background: transparent;
      &:disabled {
        color: $blue;
      }
    }
  }
}
</style>
