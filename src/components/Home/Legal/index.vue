<template>
  <div class="legal container">
    <router-link to="/otc" tag="div" class="legal_left">
      <h2>
        <span>{{ $t("home").legal }}</span>
        <span class="color-blue">{{ $t("home").deal }}</span>
      </h2>
      <p class="size">{{ $t("home").legalIntrord }}</p>
      <p class="legal_btn">
        {{ $t("home").recharge }}
        <img src="~assets/Images/home/btn_more.png" alt />
      </p>
    </router-link>
    <div class="legal_right">
      <img src="~assets/Images/home/Bitmap.png" alt />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  methods: {}
};
</script>
