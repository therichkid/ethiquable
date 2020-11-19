<template>
  <v-container class="post-container" style="max-width: 100%">
    <LoadingSkeleton v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getProducer(slug)" />

    <v-row v-if="!isLoading && !loadingError && Object.keys(producer).length" align="center">
      <!-- Header -->
      <v-col cols="12">
        <h1 class="text-h4">{{ producer.name }}</h1>
      </v-col>

      <!-- Body -->
      <v-col cols="12" v-html="producer.content"></v-col>
      <!-- Social media -->
      <v-col cols="12">
        <SocialMedia :title="producer.name" />
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
const LoadingError = () => import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

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
      producer: {}
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.producersLoading;
    },
    loadingError() {
      return this.$store.state.producersLoadingError;
    },
    failedRequests() {
      return this.$store.state.failedRequests;
    }
  },

  watch: {
    producer(producer) {
      if (!producer && !this.failedRequests) {
        this.$router.push("/404");
      }
    },
    $route() {
      this.getProducer(this.slug);
    }
  },

  methods: {
    async getProducer(slug) {
      let producerFetched = [false, null];
      // Try first with id
      if (this.$route.query.id) {
        const id = parseInt(this.$route.query.id, 10);
        producerFetched = this.$store.getters.getFetchedProducerByParam({ param: "id", value: id });
        // Remove query from url
        window.history.replaceState({}, null, this.$route.path);
      }
      // Then try with slug
      if (!producerFetched[0]) {
        producerFetched = this.$store.getters.getFetchedProducerByParam({ param: "slug", value: slug });
      }
      if (producerFetched[0]) {
        // Already fetched
        this.producer = producerFetched[1];
      } else {
        // Not fetched yet
        this.producer = await this.$store.dispatch("fetchProducerBySlug", slug).catch(error => {
          console.error(error);
        });
      }
      if (this.producer) {
        document.title = this.producer.name + " - " + document.title;
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getProducer(this.slug);
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
