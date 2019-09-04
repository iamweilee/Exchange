<template>
  <div class="customSelect">
    <div class="customSelect_inp" ref="select" @click="showSel">
      <input disabled :value="value.text" />
      <img
        :class="show && 'rotate'"
        src="~assets/Images/pos/icon_down.png"
        alt
      />
    </div>
    <transition name="fade">
      <ul class="customSelect_list" v-if="show">
        <li
          v-for="item in values"
          :key="item.value"
          :class="item.value == value.value && 'active'"
          @click="checkSel($event, item)"
        >
          {{ item.text }}
        </li>
        <p class="jiao"></p>
      </ul>
    </transition>
  </div>
</template>

<script>
import { addEvent, removeEvent, stopEvent } from "common/utli";
import { debuglog } from "util";
export default {
  props: {
    values: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object
    }
  },
  data() {
    return {
      show: false
    };
  },
  mounted() {},
  methods: {
    checkSel(e, value) {
      if (value != this.value) {
        this.$emit("input", value);
        this.hideSel(e);
      }
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
.customSelect {
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
      &:disabled {
        color: $write;
        -webkit-text-fill-color: $write;
        -webkit-opacity: 1;
        opacity: 1;
      }
    }
    img {
      width: 18px;
      margin-left: 4px;
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -9px;
      transform: rotate(0);
      transition: all 0.4s ease-out;
      &.rotate {
        transform: rotate(-180deg);
      }
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
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
    height: 0;
  }
}
</style>
