<template>
  <div class="Phone">
    <NavBar :title="Edit1.title" fixed showL @clickLeft="clickLeft" />
    <div class="Phone_wrap">
      <p class="tips">{{ Edit1.tips }}</p>
      <div class="from">
        <div class="inp_group border-1px">
          <input
            type="text"
            :placeholder="Edit1.tipPhone"
            v-model="phoneData[pageType]"
            v-debounce="{
              fn: verify.bind(arguments, 'edit1'),
              method: 'input'
            }"
          />
        </div>
        <div class="inp_group border-1px">
          <input
            type="text"
            placeholder="输入手机验证码"
            v-model="phoneData[pageType + 'Code']"
            v-debounce="{
              fn: verify.bind(arguments, 'edit1'),
              method: 'input'
            }"
          />
          <button
            class="inp_group_right"
            :disabled="isSend"
            @click="sendMsg('new')"
          >
            {{ sendBtnText }}
          </button>
        </div>
        <button
          :disabled="isClick"
          class="from_btn"
          v-debounce="{
            fn: editPhone.bind(arguments, phoneData)
          }"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "components/NavBar";
import { Edit1 } from "common/staticData";
import extend from "./EditExtends";
export default {
  extends: extend,
  data() {
    return {
      Edit1: Edit1[this.$route.params.type],
      phoneData: this.$lStore.get("phoneData") || { mobile: "", mobileCode: "" }
    };
  },
  mounted() {
    console.log(this.$route);
  },
  methods: {
    clickLeft() {
      this.$router.push(`/me/edit/${this.$route.params.type}`);
    }
  },
  components: { NavBar }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
