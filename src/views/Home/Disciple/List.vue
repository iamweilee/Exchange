<template>
  <div class="list">
    <NavBar title="我的徒弟" fixed showL hideBorder @clickLeft="clickLeft" />
    <div class="list_title">
      <ul class="List">
        <li>用户名（徒弟）</li>
        <li>总收益（USDT）</li>
      </ul>
    </div>
    <van-pull-refresh
      v-model="isLoading"
      class="list_wrap"
      v-if="disciple.list.length"
      @refresh="pullDown"
    >
      <van-list
        v-model="loading"
        :finished="!disciple.hasNextPage"
        :offset="80"
        @load="pullUp"
        :immediate-check="false"
      >
        <ul class="single">
          <li
            v-for="item in disciple.list"
            :key="item.userId"
            class="border-1px"
          >
            <p>{{ item.loginName }}</p>
            <p>{{ item.amount | priceFormat }}</p>
          </li>
        </ul>
      </van-list>
    </van-pull-refresh>
    <div v-else class="notData">
      {{ $t("notData") }}
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {
      disciple: { list: [] },
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
    this.getDisciple();
  },
  methods: {
    //徒弟列表
    getDisciple(initReq) {
      initReq = initReq || { pageNo: 1 };
      this.$http({
        url: "/user_recommend_detail/childList",
        data: {
          pageNo: 1,
          pageSize: 10
        },
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          if (initReq.pageNo != 1) {
            res.data.list = [...this.disciple.list, ...res.data.list];
          }
          this.disciple = res.data;
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
      this.getDisciple({ pageNo: 1, refresh: true });
    },
    pullUp() {
      this.getHistory({ pageNo: this.pageNo + 1 });
    },
    clickLeft(){
        this.$router.push('/disciple')
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
