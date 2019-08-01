<template>
  <div class="news">
    <router-link to="/news" tag="div" class="news_top">
      <div class="news_top_left">
        <h2>
          <span>{{ $t("home").guid }}</span>
          <span class="color-blue">{{ $t("home").news }}</span>
        </h2>
        <p class="size">{{ $t("home").guidIntord }}</p>
      </div>
      <div class="news_top_right">
        <img src="~assets/Images/home/img_news.png" alt />
      </div>
    </router-link>
    <div class="news_bot">
      <router-link class="news_bot_single" tag="div" to="/asked/lever_list">
        <div class="left">
          <h3>{{ $t("home").lever }}</h3>
          <p>{{ $t("home").leverHow }}</p>
        </div>
        <img class="right_icon" src="~assets/Images/home/icon_caozuo.png" alt />
      </router-link>
      <router-link tag="div" to="/asked/open_account" class="news_bot_single">
        <div class="left">
          <h3>{{ $t("home").howOpen }}</h3>
          <p>{{ $t("home").experHow }}</p>
        </div>
        <img
          class="right_icon"
          src="~assets/Images/home/icons_newUser.png"
          alt
        />
      </router-link>
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

