<!-- 选择就诊人/选择就诊人提示/添加就诊人前后/选中就诊人/预约提交成功 -->
<template>
  <div class="scroll" ref="personWrap">
    <ul class="person-list" ref="personTab">
      <li class="person-item">1</li>
      <li class="person-item">2</li>
      <li class="person-item">3</li>
      <li class="person-item">4</li>
      <li class="person-item">5</li>
    </ul>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "ReserveInfo",
  data() {
    return {};
  },
  created() {
    this.$nextTick(() => {
      this.personScroll();
    });
  },
  components: {},
  methods: {
    // 选择就诊人横向滚动
    personScroll() {
      // 默认有六个就诊人
      let width = 6 * 120;
      this.$refs.personTab.style.width = width + "px";
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.personWrap, {
            startX: 0,
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: "vertical"
          });
        } else {
          this.scroll.refresh();
        }
      });
    }
  }
};
</script>
<style lang='stylus' scoped>
.person-wrap {
  overflow: hidden;
  .person-list {
    .person-item {
      display: inline-block;
      height: 50px;
      width: 120px;
      margin-right: 10px;
      border: 1px solid #ccc;
    }
  }
}
</style>