<template>
  <div class="sys" v-if="listData.total">
    <ul
      class="sys_single border-1px"
      v-for="item in listData.list"
      :key="item.id"
    >
      <li class="top">
        <p class="top_roud" :class="item.status == 1 ? 'gray' : 'red'"></p>
        <p class="top_title">{{ item.title }}</p>
        <p class="top_time">{{ item.createTime }}</p>
      </li>
      <li class="cont">{{ item.content }}</li>
    </ul>
  </div>
  <NotData v-else />
</template>

<script>
import NotData from "components/NotData";
export default {
  data() {
    return {
      listData: { }
    };
  },
  mounted() {
    this.getSysData();
  },
  beforeDestroy() {
    this.readAll();
  },
  components: { NotData },
  methods: {
    getSysData() {
      this.$http({
        url: "/v1/system/msg/list",
        data: { pageNo: 1, pageSize: 20 },
        method: "get"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.listData = res.data;
        }
      });
    },
    readAll() {
      this.$http({
        url: "/v1/system/msg/read_all",
        method: "put"
      });
    }
  }
};
</script>
