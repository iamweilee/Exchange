<template>
  <div class="intord">
    <ul class="intord_list">
      <li class="title">
        <p class="big">{{ intordData.coinFullName }}</p>
        <!-- <p class="small">{{ intordData.coinCode }}</p> -->
      </li>
      <li>
        <p class="label">发行时间</p>
        <p class="val">{{ intordData.fxsj }}</p>
      </li>
      <li>
        <p class="label">发行总量</p>
        <p class="val">{{ intordData.fxzl }}</p>
      </li>
      <li>
        <p class="label">流通总量</p>
        <p class="val">{{ intordData.ltzl }}</p>
      </li>
      <li>
        <p class="label">众筹价格</p>
        <p class="val">{{ intordData.zzjj }}</p>
      </li>
      <li>
        <p class="label">区块查询</p>
        <p
          class="val"
          v-clipboard:copy="intordData.qkcx"
          v-clipboard:success="onSuccess.bind('title', '区块查询')"
          v-clipboard:error="onError"
        >
          {{ intordData.qkcx }}
        </p>
      </li>
      <li>
        <p class="label">白皮书</p>
        <p
          class="val"
          v-clipboard:copy="intordData.bps"
          v-clipboard:success="onSuccess.bind('title', '白皮书')"
          v-clipboard:error="onError"
        >
          {{ intordData.bps }}
        </p>
      </li>
      <li>
        <p class="label">官网</p>
        <p
          class="val"
          v-clipboard:copy="intordData.gw"
          v-clipboard:success="onSuccess.bind('title', '官网')"
          v-clipboard:error="onError"
        >
          {{ intordData.gw }}
        </p>
      </li>
      <li class="letter">
        <p class="label">币种介绍</p>
        <p class="intord_val">
          {{ intordData.bzjs }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    intordData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    onSuccess(title) {
      this.$toast(`${title}复制成功`);
    },
    onError() {
      this.$toast("浏览器不支持复制");
    }
  }
};
</script>

<style scoped lang="stylus">
@import './style';
</style>
