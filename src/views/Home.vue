<template>
  <div>
    <v-container>
      <CarouselSlider />

      <Teaser />

      <Posts :page="1" type="home" />
    </v-container>
    <div class="text-center">
      <v-btn large color="secondary" @click="loadMorePosts()" class="mb-2"> Mehr Neuigkeiten </v-btn>
    </div>
  </div>
</template>

<script>
import Posts from "@/components/posts/Posts";
import Teaser from "@/components/partials/Teaser";
import CarouselSlider from "@/components/partials/CarouselSlider";

export default {
  components: {
    Posts,
    Teaser,
    CarouselSlider
  },

  methods: {
    loadMorePosts() {
      this.$router.push("/magazin");
    }
  }
};
</script>

<style></style>
