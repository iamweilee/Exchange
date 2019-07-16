<template>
  <div class="selectWrap">
    <div class="selectWrap_inp" ref="select" @click="showSel">
      <input readonly :value="value" />
      <img src="~assets/Images/pos/icon_down.png" alt />
    </div>
    <transition name="fade">
      <ul class="selectWrap_list" v-if="show">
        <li
          v-for="item in values"
          :key="item"
          :class="item == value && 'active'"
          @click="checkSel($event, item)"
        >
          {{ item }}
        </li>
        <p class="jiao"></p>
      </ul>
    </transition>
  </div>
</template>

<script>
import { addEvent, removeEvent, stopEvent } from "common/utli";
export default {
  props: {
    values: {
      type: Array,
      default: () => []
    },
    value: {}
  },
  data() {
    return {
      show: false
    };
  },
  mounted() {},
  methods: {
    checkSel(e, value) {
      this.$emit("input", value);
      this.hideSel(e);
    },
    showSel(e) {
      this.show = true;
      addEvent(document, "click", this.hideSel);
    },
    hideSel(e) {
      let ref = this.$refs.select;
      if (ref && ref.contains(e.target)) {
        stopEvent(e);
        return;
      }
      this.show = false;
      removeEvent(document, "click", this.hideSel);
    }
  }
};
</script>

<style scoped lang="stylus">
.selectWrap {
  width: 100%;
  height: 100%;
  font-size: 14px;
  &_inp {
    width: 100%;
    height: 100%;
    position: relative;
    input {
      width: 100%;
      height: 100%;
      border: none;
      font-size: 14px;
      background-color: transparent;
    }
    img {
      width: 18px;
      margin-left: 4px;
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -9px;
    }
  }
  &_list {
    width: calc(100% + 8px);
    height: 60px;
    padding: 4px;
    border-radius: 2px;
    background-color: #1b212d;
    position: relative;
    left: -4px;
    z-index: 2;
    li {
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ba0ac;
      &.active {
        color: #fff;
      }
    }
    .jiao {
      position: absolute;
      left: 50%;
      bottom: 100%;
      margin-left: -10px;
      border: 6px solid transparent;
      border-bottom-color: #1b212d;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
    height: 0;
  }
}
</style>
