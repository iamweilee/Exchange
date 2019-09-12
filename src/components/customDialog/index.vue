<template>
  <van-dialog
    v-model="isShow"
    :title="titleText"
    :confirmButtonText="ButtonText"
    confirmButtonColor="#2d9ef5"
    class="customDialog"
  >
    <slot></slot>
  </van-dialog>
</template>

<script>
export default {
  props: {
    ButtonText: {
      type: String,
      default: "确定"
    },
    titleText: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isShow: false
    };
  },

  methods: {
    showDialog() {
      this.isShow = true;
    }
  }
};
</script>
