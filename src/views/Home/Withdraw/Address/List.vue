<template>
  <div class="siteList">
    <NavBar title="提币地址" fixed showL @clickLeft="clickLeft" />
    <div class="siteList_wrap">
      <van-radio-group v-model="radio">
        <div
          class="single"
          v-for="item in addList"
          :key="item.drawAdd"
          @click="changeAddress(item)"
        >
          <van-radio checked-color="#00A7E0" :name="item.drawAdd" />
          <ul>
            <li>提币地址：{{ item.drawAdd }}</li>
            <li>地址名称：{{ item.remarks }}</li>
          </ul>
          <button @click.stop="deletAdd(item.drawAdd)" class="delet">
            删除
          </button>
        </div>
      </van-radio-group>
    </div>
    <button @click="toAddress" class="newBtn">新建地址</button>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
export default {
  data() {
    return {
      radio: "1",
      addList: []
    };
  },
  components: {
    NavBar
  },
  mounted() {
    this.getAddressList();
  },
  methods: {
    getAddressList() {
      this.$http({ url: "/v1/user/draw_address/USDT", method: "get" }).then(
        res => {
          if (res.status == this.STATUS) {
            this.addList = res.data;
            if (this.$lStore.get("drawSite")) {
              this.radio = this.$lStore.get("drawSite").drawAdd;
            } else {
              this.radio = res.data[0].drawAdd;
              this.$lStore.set("drawSite", res.data[0]);
            }
          }
        }
      );
    },
    deletAdd(drawAdd) {
      if (this.$lStore.get("drawSite").drawAdd == drawAdd) {
        this.$lStore.remove("drawSite");
      }
      this.$http({
        url: "/v1/user/delete_draw_address",
        data: { coinCode: "USDT", drawAdd: drawAdd },
        method: "delete"
      }).then(res => {
        if (res.status == this.STATUS) {
          this.getAddressList();
        }
      });
    },
    changeAddress(item) {
      if (item.drawAdd == this.$lStore.get("drawSite").drawAdd) {
        return;
      } else {
        this.$lStore.set("drawSite", item);
        this.$router.push("/withdraw/wallet");
      }
    },
    toAddress() {
      this.$router.push("/withdraw/address");
    },
    clickLeft() {
      this.$router.push("/withdraw/wallet");
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
