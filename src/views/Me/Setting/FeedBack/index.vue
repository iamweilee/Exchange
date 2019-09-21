<template>
  <div class="feedback">
    <NavBar
      title="意见反馈"
      showL
      @clickLeft="clickLeft"
      @clickRight="clickRight"
    >
      <p slot="right" class="right_text">提交</p>
    </NavBar>
    <div class="feedback_top border-1px">
      <van-cell-group>
        <van-field
          v-model="message"
          type="textarea"
          placeholder="请在这里写下您对我们的意见，我们将不断进步，为您做的更好！"
          rows="1"
          :border="false"
          :autosize="{ minHeight: 160 }"
        />
      </van-cell-group>
      <div class="uploader_wrap">
        <van-uploader :after-read="onRead" v-model="fileList" multiple />
      </div>
    </div>
    <div class="feedback_inp border-1px">
      <p class="label">联系方式</p>
      <input type="text" placeholder="手机/邮箱" />
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {
      message: "",
      fileList: []
    };
  },
  components: {
    NavBar
  },
  methods: {
    onRead(file) {
      let _FormData = new FormData();
      _FormData.append("file", file.file);
      _FormData.append("type", "portrait");
      console.log(file, this.fileList);
    },
    clickRight() {
      console.log("right");
    },
    clickLeft() {
      this.$router.push("/me/setting");
    }
  }
};
</script>

<style lang="stylus">
@import './style';
</style>
