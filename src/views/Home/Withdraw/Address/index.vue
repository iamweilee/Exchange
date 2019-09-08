<template>
  <div class="address">
    <NavBar title="新建地址" fixed showL @clickLeft="clickLeft" />
    <div class="address_wrap">
      <div class="from">
        <div class="from_single">
          <p class="label">*提币地址：</p>
          <p class="inp">
            <input type="text" placeholder="请输入地址,最多输入100个字符" />
          </p>
        </div>
        <div class="from_single">
          <p class="label">地址标签：</p>
          <div class="inp">
            <input type="text" placeholder="15个字以内" />
            <p class="inp_tips">（用于标记地址，选填）</p>
          </div>
        </div>
        <div class="from_select"  @click="isCheckBox = !isCheckBox">
          <p class="checkbox">
            <img
              v-show="isCheckBox"
              src="~assets/Images/other/icon_check.png"
              alt
            />
          </p>
          <p class="size">本人承诺已确认新增USDT提币地址，并确保提币地址正确无误</p>
          
        </div>
      </div>
      <button class="okBtn">确定</button>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {
      isCheckBox: true
    };
  },
  components: {
    NavBar
  },
  methods: {
    clickLeft() {
      this.$router.push("/withdraw/wallet");
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
