<template>
  <div class="sys">
    <ul
      class="sys_single border-1px"
      v-for="item in noticData.list"
      :key="item.id"
    >
      <li class="top">
        <p class="top_roud"></p>
        <p class="top_title">『系统公告』</p>
        <p class="top_time">{{ item.createdAt[0] }}</p>
      </li>
      <li class="cont">
        {{ item.content }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      noticData: {}
    };
  },
  components: {},
  mounted() {
    this._initPage();
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
          this.noticData = res.data;
        }
      });
    }
  }
};
</script>
