<template>
  <div class="customNotData">
    <img :src="selectImg(status)" alt="notData" />
    <p>暂无数据</p>
  </div>
</template>

<script>
import Img from "Images/notData.png";
import Img1 from "Images/notSignal.png";
import Img2 from "Images/404.png";
export default {
  props: {
    status: {
      type: String,
      default: "notData"
    }
  },
  methods: {
    selectImg(status) {
      switch (status) {
        case "signal": //信号
          return Img1;
        case "404Page": //404页面
          return Img2;
        default:
          //没有数据
          return Img;
      }
    }
  }
};
</script>

<style scoped lang="stylus">
.customNotData {
  width: 100%;
  text-align: center;
  padding-top: 22px;
  img {
    width: 205px;
  }
  p {
    font-size: 16px;
    padding-top: 20px;
    color: #999;
  }
}
</style>
