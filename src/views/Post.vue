<template>
  <v-container class="post-container">
    <LoadingSkeleton v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getPostBySlug(slug)" />

    <v-row v-if="!isLoading && !loadingError && Object.keys(post).length" align="center">
      <!-- Header -->
      <v-col cols="12">
        <h1 class="text-h4">{{ post.title }}</h1>
      </v-col>

      <!-- Body -->
      <v-col cols="12">
        <v-chip-group>
          <v-chip>
            <v-icon left color="primary">mdi-calendar</v-icon>
            {{ post.date }}
          </v-chip>
          <v-chip>
            <v-icon left color="primary">mdi-account</v-icon>
            {{ post.author }}
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="12" v-html="post.content"></v-col>
      <!-- Social media -->
      <v-col cols="12">
        <SocialMedia :title="post.title" />
      </v-col>

      <!-- Actions -->
      <v-col cols="12">
        <v-btn @click="goBack()">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Zurück</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import SocialMedia from "@/components/partials/SocialMedia";
import LoadingError from "@/components/partials/LoadingError";

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    SocialMedia
  },

  props: {
    slug: String
  },

  data() {
    return {
      post: {}
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.postsLoading;
    },
    loadingError() {
      return this.$store.state.postsLoadingError;
    },
    failedRequests() {
      return this.$store.state.failedRequests;
    }
  },

  watch: {
    post(post) {
      if (!post && !this.failedRequests) {
        this.$router.replace("/404");
      }
    },
    $route() {
      this.getPostBySlug(this.slug);
    }
  },

  methods: {
    async getPostBySlug(slug) {
      const postFetched = this.$store.getters.getFetchedPostBySlug(slug);
      if (postFetched[0]) {
        // Already fetched
        this.post = postFetched[1];
      } else {
        // Not fetched yet
        this.post = await this.$store.dispatch("fetchPostBySlug", slug).catch(error => {
          console.error(error);
        });
      }
      if (this.post) {
        document.title = this.post.title + " - " + document.title;
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getPostBySlug(this.slug);
  }
};
</script>

<style scoped>
* >>> h3,
* >>> h4,
* >>> h5,
* >>> h6 {
  color: var(--v-primary-base);
  text-transform: uppercase;
}
</style>
