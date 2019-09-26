<template>
  <div class="disciple">
    <div class="disciple_top">
      <div class="title">
        <p class="tips">我的邀请码</p>
        <p class="price">{{ userInfo.userCode }}</p>
      </div>
      <div class="wrap">
        <div class="wrap_top">
          <div class="wrap_top_l">
            <p class="avatar">
              <img :src="userInfo.portrait" alt />
            </p>
            <div class="msg_group">
              <p class="name">{{userInfo.nickName}}</p>
              <p class="icon">
                <img src="~assets/Images/disciple/icon_master.png" alt />
              </p>
            </div>
          </div>
          <button class="btn_apprentice">立即收徒</button>
        </div>
        <div class="wrap_info">
          <router-link tag="div" to="/disciple/list" class="wrap_info_single">
            <p>{{ disData.childCount }}</p>
            <p>我的徒弟</p>
          </router-link>
          <div class="wrap_info_single line-1px">
            <p>{{ disData.childAmount }}</p>
            <p>累计收入（USDT）</p>
          </div>
        </div>
      </div>
      <div class="banner">
        <img src="~assets/Images/disciple/banner.png" alt />
      </div>
      <div class="back_left">
        <van-icon class="back_icon" @click="clickLeft" name="arrow-left" />
      </div>
    </div>
    <div class="disciple_wrap">
      <p class="disciple_wrap_title">
        <img src="~assets/Images/disciple/icon_1.png" alt />人脉变钱脉
      </p>
      <div class="code_wrap">
        <img :src="userInfo.qrCodePath" alt />
        <button>长按保存推广图片</button>
      </div>
      <p class="disciple_wrap_title">
        <img src="~assets/Images/disciple/icon_2.png" alt />收徒说明
      </p>
      <div class="explain">
        <div class="explain_top">
          <div class="bg1">
            <div class="bg1_left">
              <p>一次带徒&nbsp;两级下线</p>
              <p>永久分成&nbsp;终身受益</p>
            </div>
            <div class="bg1_right">
              规则
              <img src="~assets/Images/disciple/icon_3.png" alt />
            </div>
          </div>
          <div class="bg2">
            <div class="bg2_left">
              <p>累计收徒获得佣金</p>
              <p>{{ disData.childAmount }}</p>
            </div>
            <button class="bg2_btn">师傅</button>
          </div>
        </div>
        <ul class="explain_introd">
          <li>
            <img src="~assets/Images/disciple/icon_4.png" alt />
            当其他用户使用您的推荐二维码注册成功后，他就成为您的永久徒弟。
          </li>
          <li>
            <img src="~assets/Images/disciple/icon_4.png" alt />
            您可获得一级徒弟总交易手续费15%的USDT分红。
          </li>

          <li>
            <img src="~assets/Images/disciple/icon_4.png" alt />
            收徒佣金每天凌晨6点将结算到您的账户。
          </li>
          <li>
            <img src="~assets/Images/disciple/icon_4.png" alt />
            收徒佣金分成是永久分成，一次带徒，终生受益，快去收徒吧。
          </li>
        </ul>
        <ul class="explain_rule">
          <li>例如：</li>
          <li>A是师傅，他带了一个徒弟B。</li>
          <li>
            在某日，B的交易手续费是100USDT，则A当天可以收到的提成是：
          </li>
          <li>A收益=100USDT*15%=15USDT</li>
        </ul>
        <ul class="explain_table">
          <li class="title">
            <p>级别</p>
            <p>分成比例</p>
          </li>
          <li class="row">
            <p>一级徒弟</p>
            <p>获得其交易总佣金的15%</p>
          </li>
          <!-- <li class="row">
            <p>二级徒弟</p>
            <p>获得其交易总佣金的5%</p>
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      disData: {}
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },

  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$http({
        url: "/user_recommend_detail/childDetailStatistics",
        method: "get"
      }).then(res => {
        console.log(res);
        this.disData = res.data;
      });
    },

    clickLeft() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
