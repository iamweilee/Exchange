<template>
  <div class="swipe">
    <Swiper
      class="swipe-wrap"
      :autoPlay="true"
      :showIndicator="true"
      interval="5000"
      duration="500"
      v-if="bannerList.length"
    >
      <Slide v-for="item in bannerList" :key="item.id">
        <router-link tag="p" :to="item.url">
          <img :src="item.picPath" :alt="item.name" />
        </router-link>
      </Slide>
    </Swiper>
  </div>
</template>

<script>
import { Swiper, Slide } from "components/customSwiper";

export default {
  props: {
    bannerList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      List: new Array(6)
    };
  },
  components: {
    Swiper,
    Slide
  },
  mounted() {
    console.log(this.bannerList);
  },
  methods: {
    hanleSwipe() {
      console.log("666666");
    }
  }
};
</script>