<template>
  <div class="board">
    <NavBar title="留言板" showL @clickLeft="clickLeft" @clickRight="addBoard">
      <p slot="right" class="right_text">提交</p>
    </NavBar>
    <div class="board_top">
      <van-cell-group>
        <van-field
          v-model="content"
          type="textarea"
          placeholder="点击留言..."
          rows="1"
          :autosize="{ minHeight: 160 }"
        />
      </van-cell-group>
    </div>
    <div class="board_wrap">
      <van-pull-refresh
        v-model="isLoading"
        class="List"
        v-if="boardData.list.length"
        @refresh="pullDown"
      >
        <van-list
          v-model="loading"
          :finished="!boardData.hasNextPage"
          :offset="80"
          finished-text="没有更多了"
          @load="pullUp"
          :immediate-check="false"
        >
          <ul class="single" v-for="item in boardData.list" :key="item.id">
            <li class="single_left">
              <!-- <img
              v-show="!(index % 2)"
              src="~assets/Images/MsgBoard/other.png"
            /> -->
              <img src="~assets/Images/MsgBoard/me.png" />
            </li>
            <li class="single_right">
              <p class="top">
                <span class="title">{{ item.senderName }}</span>
                <span class="time">{{ item.createTime }}</span>
              </p>
              <p class="user">
                <img src="~assets/Images/MsgBoard/user.png" />
                {{ item.senderName }}
              </p>
              <p class="content">
                {{ item.content }}
              </p>
            </li>
            <li class="solve" v-show="item.status">
              <img src="~assets/Images/MsgBoard/solve.png" alt="" />
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {
      content: "",
      boardData: { list: [] },
      loading: false,
      finished: false,
      isLoading: false,
      pageNo: 1
    };
  },
  components: {
    NavBar
  },
  mounted() {
    this.getBoard();
  },
  methods: {
    addBoard() {
      // /v1/leaveMessageBoard/add
      this.$http({
        url: "/v1/leaveMessageBoard/add",
        data: { content: this.content },
        method: "post"
      }).then(res => {
        console.log(res);
        if (res.status == this.STATUS) {
          this.content = "";
          this.getBoard();
        }
      });
    },
    //     {
    //   "status": 200,
    //   "timestamp": 1568864126761,
    //   "data": {
    //     "total": 3,
    //     "pages": 1,
    //     "hasNextPage": false,
    //     "list": [
    //       {
    //         "id": 13,
    //         "content": "a",  //留言内容
    //         "senderName": "小****", //留言人昵称
    //         "senderPortrait": "http://images.asiabitmex.com/portrait/2019/9/12/5c7ed467de3141ef9c742e70b8b85376.jpg", //留言人头像
    //         "status": false, //回复状态：true 已回复 false 待回复
    //         "replierName": null, //回复人昵称
    //         "replierPortrait": null, //回复人头像
    //         "replyContent": null, //回复内容
    //         "replyTime": null, //回复时间
    //         "createTime": "2019-09-18 19:33:44" //留言时间
    //       }
    //       ]
    //   }
    // }
    getBoard(initReq) {
      initReq = initReq || { pageNo: 1 };
      this.$http({
        url: "/v1/leaveMessageBoard/list",
        data: { pageNo: initReq.pageNo, pageSize: 10 },
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          if (initReq.pageNo != 1) {
            res.data.list = [...this.boardData.list, ...res.data.list];
          }
          this.boardData = res.data;
          this.pageNo = initReq.pageNo;
          this.loading = false;
          if (initReq.refresh) {
            this.isLoading = false;
            this.$toast({
              message: "刷新成功",
              duration: 300
            });
          }
        }
      });
    },
    pullDown(scroll) {
      this.getBoard({ pageNo: 1, refresh: true });
    },
    pullUp() {
      this.getBoard({ pageNo: this.pageNo + 1 });
    },
    clickLeft() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
