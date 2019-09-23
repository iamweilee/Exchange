<template>
  <div class="service">
    <NavBar title="联系客服" hideBorder fixed showL @clickLeft="clickLeft" />
    <div class="service_wrap">
      <ScrollV scrollToEndFlag pulldown @pullDown="pullDown" :data="List">
        <p class="time">22:35</p>
        <div class="msg">
          <div class="msg_l">
            <img src="~assets/Images/avatar.jpg" alt />
          </div>
          <div class="msg_r">
            <p class="tips">您是不是要咨询以下问题</p>
            <a @click="comClick(1)">1、忘记密码怎么办？</a>
            <a @click="comClick(2)">
              2、杠杆交易下单有哪些方式？
            </a>
            <a @click="comClick(3)">
              3、交易手续费怎么收取？
            </a>
            <a @click="comClick(4)">
              4、保证金交易是什么意思？
            </a>
          </div>
        </div>
        <div
          class="msg"
          v-for="(item, index) in List"
          :key="item + index"
          :class="item.type !== 'system_msg' && 'self'"
        >
          <div class="msg_l">
            <img src="~assets/Images/avatar.jpg" alt />
          </div>
          <div class="msg_r">
            <p v-for="(text, index) in item.list" :key="index">{{ text }}</p>
          </div>
        </div>
      </ScrollV>
    </div>
    <div class="service_send" v-show="false">
      <div class="inp">
        <input
          type="text"
          v-model="inpVal"
          @keyup.enter="sendMsg(inpVal)"
          placeholder="开发中"
        />
        <p class="icon">
          <img src="~assets/Images/emoticon.png" alt />
        </p>
      </div>
      <button @click="sendMsg(inpVal)">发送</button>
    </div>
    <div class="board">
      <van-button color="#00A7E0" icon="chat-o" @click="toBoard"
        >去留言</van-button
      >
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import ScrollV from "components/Scroll";
export default {
  data() {
    return {
      isLoading: false,
      List: [],
      inpVal: ""
    };
  },
  components: {
    NavBar,
    ScrollV
  },
  mounted() {},
  methods: {
    comClick(question) {
      let List = this.List,
        obj = {},
        obj1 = {};
      switch (Number(question)) {
        case 1:
          obj = { type: "self", list: ["忘记密码怎么办？"] };
          obj1 = {
            type: "system_msg",
            list: [
              "忘记登录密码时，您可以在登录页面进行“忘记密码”操作，按照系统提示输入验证码，重置密码即可。"
            ]
          };
          break;
        case 2:
          obj = { type: "self", list: ["杠杆交易下单有哪些方式？"] };
          obj1 = {
            type: "system_msg",
            list: [
              "1、市价：以当前价立即成交，可设置止盈止损点及是否持仓过夜。",
              "2、挂单：是按投资者期望的价格下单但并未立即成交，仅当满足条件后才成交，可设置截止时间（指用户希望在某一时间内挂单按期望价格成交，若规定时间内未成交，则挂单取消）、止盈止损点及是否持仓过夜。"
            ]
          };
          break;
        case 3:
          obj = { type: "self", list: ["交易手续费怎么收取？"] };
          obj1 = {
            type: "system_msg",
            list: [
              "1、交易手续费=（交易量*开仓价-占用保证金）*费率",
              "2、交易手续费只在下单时收取一次，其余操作都不再收取。"
            ]
          };
          break;
        case 4:
          obj = { type: "self", list: ["保证金交易是什么意思？"] };
          obj1 = {
            type: "system_msg",
            list: [
              "1、保证金是投资者放在自己开设的交易合约中的资金（承担风险的资金），用来弥补或者部分弥补可能遭受的亏损。保证金交易充分利用了杠杆投资的原理，即用较少的资金实现获取较大收益的可能性。固额保证金，三个档位，保证金越小风险越大，投资者谨慎选择！",
              "2、如购买一个BTC，合约价值为6000USDT，投资者选择10倍的杠杆保证金交易，即可用600USDT成交一个BTC。"
            ]
          };
          break;
      }
      List = [...List, obj, obj1];
      this.List = List;
    },
    toBoard() {
      this.$router.push("/msg_board");
    },
    //发送消息
    sendMsg(val) {
      if (val.trim()) {
        let List = this.List;
        List = [...List, val];
        this.List = List;
        this.inpVal = "";
      } else {
        this.$toast("聊天内容不能为空！");
      }
    },
    pullDown(scroll) {
      setTimeout(() => {
        console.log("到头了");
        scroll.finishPullDown();
      }, 1000);
    },
    clickLeft() {
      this.$router.back();
    },
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        this.$toast({
          message: "刷新成功",
          duration: 500
        });
      }, 500);
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
