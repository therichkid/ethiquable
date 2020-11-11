<template>
  <div>
    <v-container>
      <InfoMessage />

      <h1 class="display-1 mb-2">Neuigkeiten</h1>
      <Posts :page="1" type="home" />
    </v-container>
    <div class="text-center">
      <v-btn large color="primary" @click="loadMorePosts()" class="mb-2"> Mehr Neuigkeiten </v-btn>
    </div>
  </div>
</template>

<script>
import Posts from "@/components/posts/Posts";
import InfoMessage from "@/components/partials/InfoMessage";

export default {
  components: {
    Posts,
    InfoMessage
  },

  methods: {
    loadMorePosts() {
      this.$router.push("/magazin");
    }
  }
};
</script>

<style></style>
