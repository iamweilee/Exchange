<template>
  <div class="setting">
    <NavBar title="账户设置" fixed showL @clickLeft="clickLeft" />
    <div class="setting_list">
      <van-cell
        is-link
        to="/me/user"
        :title="$t('meSeting').personalData"
      ></van-cell>
      <van-cell
        is-link
        :title="$t('meSeting').lang"
        :value="lang[0].text"
        @click="showPicker"
      ></van-cell>
      <van-cell is-link :title="$t('meSeting').codePc" value="7wcs3"></van-cell>
      <van-cell
        is-link
        to="/me/setting/about"
        :title="$t('meSeting').about"
      ></van-cell>
      <van-cell is-link :title="$t('meSeting').feedback"></van-cell>
    </div>
    <p class="setting_logout" @click="loginOut">
      {{ $t("meSeting").loginOut }}
    </p>
    <vue-pickers
      :show="show"
      :columns="columns"
      :defaultData="lang"
      :selectData="pickData"
      @cancel="close"
      @confirm="confirmFn"
    ></vue-pickers>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import vuePickers from "components/customPick";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      show: false,
      pickData: {
        data1: [
          { text: "简体中文", value: "zh" },
          { text: "繁體中文", value: "zh_tw" }
        ]
      },
      columns: 1
    };
  },
  computed: {
    ...mapState(["lang"])
  },
  components: {
    NavBar,
    vuePickers
  },

  methods: {
    loginOut() {
      this.$http({ url: "/v1/user/login_out", method: "post" }).then(res => {
        console.log(res);
        if (res.status == this.STATUS) {
          this.$lStore.remove("token");
          this.updatedUserInfo("");
          this.updatedBanlace("");
          this.$router.push("/login");
        }
      });
    },
    showPicker() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    //pick 点击确认按钮
    confirmFn(val) {
      console.log(val);
      let defaultData = [val.select1];
      this.updatedLang(defaultData);
      this.show = false;
    },
    clickLeft() {
      this.$router.push("/me");
    },
    ...mapActions(["updatedUserInfo", "updatedBanlace", "updatedLang"])
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
