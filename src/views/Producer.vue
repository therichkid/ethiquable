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

      <!-- Products -->
      <v-col cols="12" v-if="products && products.length">
        <h2 class="text-h4 mb-2">Die Produkte</h2>
        <v-row class="mt-4" dense>
          <v-col class="d-flex" v-for="product in products" :key="product.id" cols="3" md="2">
            <v-card
              hover
              :to="{ path: `/produkte/${product.slug}`, query: { id: product.id } }"
              class="d-flex flex-column"
              style="border-bottom: 6px solid var(--v-secondary-base); width: 100%"
            >
              <v-spacer></v-spacer>
              <v-img
                :src="product.featuredImage.source"
                :alt="product.featuredImage.title"
                max-height="200"
                contain
              ></v-img>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-icon>mdi-chevron-right</v-icon>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

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
      producer: {},
      products: []
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
      this.getProducerAndProducts();
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
    async getProductsById(ids) {
      const products = [];
      const idsToFetch = [];
      for (const id of ids) {
        const productFetched = this.$store.getters.getFetchedProductByParam({ param: "id", value: id });
        if (productFetched[0]) {
          // Already fetched
          products.push(productFetched[1]);
        } else {
          // Not fetched yet
          idsToFetch.push(id);
        }
      }
      if (idsToFetch.length) {
        const fetchedProducts =
          (await this.$store.dispatch("fetchProductsById", idsToFetch).catch(error => console.error(error))) || [];
        products.push(...fetchedProducts);
      }
      this.products = products;
    },
    async getProducerAndProducts() {
      await this.getProducer(this.slug);
      if (!this.producer) {
        return;
      }
      this.products = [];
      if (this.producer.productIds && this.producer.productIds.length) {
        await this.getProductsById(this.producer.productIds);
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getProducerAndProducts();
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
