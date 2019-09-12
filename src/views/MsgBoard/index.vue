<template>
  <div class="board">
    <NavBar title="留言板" showL @clickLeft="clickLeft">
      <p slot="right" class="right_text">提交</p>
    </NavBar>
    <div class="board_top">
      <van-cell-group>
        <van-field
          v-model="message"
          type="textarea"
          placeholder="点击留言..."
          rows="1"
          :autosize="{ minHeight: 160 }"
        />
      </van-cell-group>
    </div>
    <div class="board_wrap">
      <div class="List">
        <ul class="single" v-for="(item, index) in List" :key="index">
          <li class="single_left">
            <img
              v-show="!(index % 2)"
              src="~assets/Images/MsgBoard/other.png"
            />
            <img v-show="index % 2" src="~assets/Images/MsgBoard/me.png" />
          </li>
          <li class="single_right">
            <p class="top">
              <span class="title">标题</span>
              <span class="time">11:31 AM</span>
            </p>
            <p class="user">
              <img src="~assets/Images/MsgBoard/user.png" />
              用户名
            </p>
            <p class="content">
              分开来的，个，。tmtym.付款了大家是否考虑是解放路口登记卡萨肯定撒开机了都赛欧都按时
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {
      List: new Array(10)
    };
  },
  components: {
    NavBar
  },
  methods: {
    clickLeft() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
