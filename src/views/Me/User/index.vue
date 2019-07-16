<template>
  <div class="user">
    <NavBar title="个人资料" fixed showL @clickLeft="clickLeft" />
    <div class="user_info">
      <van-cell is-link title="头像">
        <van-uploader :after-read="onRead">
          <p class="right_img">
            <img :src="userInfo.portrait" alt />
          </p>
        </van-uploader>
      </van-cell>
      <van-cell
        is-link
        title="昵称"
        :value="userInfo.nickName"
        @click="showDialog"
      ></van-cell>
    </div>
    <van-dialog
      v-model="show"
      title="修改昵称"
      class="customDialog"
      confirmButtonText="修改"
      :beforeClose="editUserName"
      confirmButtonColor="#2d9ef5"
    >
      <div class="inputGroup">
        <input type="text" v-model="nickName" />
      </div>
    </van-dialog>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      show: false,
      nickName: ""
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  created() {
    this.getUserInfo();
  },
  components: { NavBar },
  methods: {
    change(e) {
      console.log(e);
    },
    editUserName(action, done) {
      this.$http({
        url: "/v1/user/update_nick_name",
        data: {
          nickName: this.nickName,
          userId: this.userInfo.userId
        },
        method: "put"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.getUserInfo();
          done();
        }
      });
    },
    //显示修改dialog
    showDialog() {
      this.nickName = this.userInfo.nickName;
      this.show = true;
    },

    onRead(file) {
      let _FormData = new FormData();
      _FormData.append("file", file.file);
      _FormData.append("type", "portrait");
      this.$http({
        url: "/v1/upload",
        method: "post",
        data: _FormData,
        baseApi: "upload"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.setAvatar(res.data.relativePath);
        }
      });
    },
    setAvatar(url) {
      this.$http({
        url: "/v1/user/portrait",
        method: "post",
        data: { portrait: url }
      }).then(res => {
        if (res.status == this.STATUS) {
          this.getUserInfo();
        }
      });
    },

    clickLeft() {
      this.$router.back(-1);
    },
    ...mapActions(["getUserInfo"])
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
