<template>
  <v-container>
    <h1 class="display-1 mb-2">Magazin</h1>
    <Posts :page="page" @postPagesInit="postPages = $event" />
    <div class="text-center" v-if="postPages">
      <v-pagination v-model="page" :length="postPages" @input="changePage()"></v-pagination>
    </div>
  </v-container>
</template>

<script>
import Posts from "@/components/posts/Posts";

export default {
  components: {
    Posts
  },

  data() {
    return {
      page: parseInt(this.$route.params.page, 10) || 1,
      postPages: 0
    };
  },

  watch: {
    $route() {
      this.page = parseInt(this.$route.params.page, 10) || 1;
    }
  },

  methods: {
    changePage() {
      this.$router.push(`/${this.routerPage}/page/${this.page}`);
    }
  }
};
</script>

<style></style>
