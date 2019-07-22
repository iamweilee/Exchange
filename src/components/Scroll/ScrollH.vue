<!-- 选择就诊人/选择就诊人提示/添加就诊人前后/选中就诊人/预约提交成功 -->
<template>
  <div class="scrollH" ref="personWrap">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
    });
  },
  components: {},
  methods: {
    _initScroll() {
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
    }
  }
};
</script>
<style lang='stylus' scoped>
.scrollH {
  width: 100%;
  overflow: hidden;
}
</style>