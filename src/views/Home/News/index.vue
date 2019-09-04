<template>
  <div class="flash">
    <NavBar title="行业快讯" hideBorder fixed showL @clickLeft="clickLeft" />
    <div class="flash_wrap">
      <div class="flash_list" v-for="item in newsData" :key="item.id">
        <p class="flash_list_title">{{ item.createdAt[0] }} 今日</p>
        <ul class="List">
          <li class="List_single">
            <h2 class="List_single_title">{{ item.title }}</h2>
            <p class="List_single_content">
              {{ item.content }}
            </p>
            <p class="List_single_handle">
              <span class="left">{{ item.createdAt[1] }}</span>
              <a class="right">
                <span @click="goodBab(item)">
                  <img src="~assets/Images/News/zan.png" alt />
                  {{ item.good }}
                </span>
                <!-- <span
                v-debounce="{
                  fn: goodBab.bind('bad', item, 'bad')
                }"
              >
                <img src="~assets/Images/News/not_cai.png" alt />
                {{ item.bad }}
              </span> -->
              </a>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import { control } from "common/utli";
export default {
  data() {
    return {
      newsData: []
    };
  },
  mounted() {
    this._initPage();
  },
  components: {
    NavBar
  },
  methods: {
    _initPage() {
      this.getMessage();
    },
    getMessage() {
      this.$http({
        url: "/v1/platMessage/",
        method: "get",
        data: { type: 2, pageSize: 20, pageNo: 1 }
      }).then(res => {
        if (res.status == this.STATUS) {
          res.data.list.forEach(item => {
            item.createdAt = item.createdAt.split(" ");
          });
          this.newsData = res.data.list;
        }
      });
    },
    goodBab(item, type) {
      let req = {
        messageId: item.id
      };
      req.type = 0;
      req.optionType = item.myOption == 0 ? 1 : 0;
      this.$http({
        url: "/v1/platMessage/click",
        method: "get",
        data: req
      }).then(res => {
        if (res.status == this.STATUS) {
          this.getMessage();
        }
      });
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
