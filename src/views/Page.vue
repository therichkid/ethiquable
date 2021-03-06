<template>
  <v-container class="post-container">
    <LoadingSkeleton v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getPageBySlug(slug)" />

    <v-row v-if="!isLoading && !loadingError && Object.keys(page).length" align="center">
      <!-- Header -->
      <v-col cols="12">
        <h1 class="text-h4">{{ page.title }}</h1>
      </v-col>

      <!-- Body -->
      <v-col cols="12" v-html="page.content"></v-col>
      <!-- Social media -->
      <v-col cols="12">
        <SocialMedia :title="page.title" />
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
      page: {}
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.pageLoading;
    },
    loadingError() {
      return this.$store.state.pageLoadingError;
    },
    failedRequests() {
      return this.$store.state.failedRequests;
    }
  },

  watch: {
    page(page) {
      if (!page && !this.failedRequests) {
        this.$router.replace("/404");
      }
    },
    $route() {
      this.getPageBySlug(this.slug);
    }
  },

  methods: {
    async getPageBySlug(slug) {
      const pageFetched = this.$store.getters.getFetchedPageBySlug(slug);
      if (pageFetched[0]) {
        // Already fetched
        this.page = pageFetched[1];
      } else {
        // Not fetched yet
        this.page = await this.$store.dispatch("fetchPageBySlug", slug).catch(error => {
          console.error(error);
        });
      }
      if (this.page) {
        document.title = this.page.title + " - " + document.title;
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getPageBySlug(this.slug);
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
