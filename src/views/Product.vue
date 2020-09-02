<template>
  <v-container>
    <LoadingSkeleton v-if="isLoadingProducts" />
    <LoadingError v-if="loadingErrorProducts" :height="500" @retryAgain="getProductBySlug(slug)" />

    <v-row v-if="!isLoadingProducts && !loadingErrorProducts && product" align="center">
      <!-- Header -->
      <v-col cols="12">
        <h1 class="text-h4">{{ product.name }}</h1>
      </v-col>
    </v-row>

    <!-- Body -->
    <v-row>
      <v-col cols="12" :md="producer && 6">
        <h2 class="text-h5" style="color: var(--v-primary-base);">Was ich esse / trinke</h2>
        <div v-html="product.content"></div>
      </v-col>
      <v-col cols="12" md="6" v-if="producer">
        <h2 class="text-h5" style="color: var(--v-primary-base);">Was ich verteidige</h2>
        <div v-html="producer.content"></div>
      </v-col>
    </v-row>

    <!-- Social media -->
    <v-row>
      <v-col cols="12">
        <SocialMedia :link="'/magazin/' + slug" :title="product.name" />
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
      product: null,
      producer: null
    };
  },

  computed: {
    isLoadingProducts() {
      return this.$store.state.productsLoading;
    },
    loadingErrorProducts() {
      return this.$store.state.productsLoadingError;
    },
    isLoadingProducers() {
      return this.$store.state.producersLoading;
    },
    loadingErrorProducers() {
      return this.$store.state.producersLoadingError;
    },
    failedRequests() {
      return this.$store.state.failedRequests;
    }
  },

  watch: {
    product(product) {
      if (!product && !this.failedRequests) {
        this.$router.push("/404");
      }
    },
    $route() {
      this.getProductBySlug(this.slug);
    }
  },

  methods: {
    async getProductBySlug(slug) {
      const productFetched = this.$store.getters.getFetchedProductBySlug(slug);
      if (productFetched[0]) {
        // Already fetched
        this.product = productFetched[1];
      } else {
        // Not fetched yet
        this.product = await this.$store.dispatch("fetchProductBySlug", slug).catch(error => {
          console.error(error);
        });
      }
      if (this.product) {
        document.title = this.product.name + " - " + document.title;
      }
    },
    async getProducerById(id) {
      if (!id) {
        return;
      }
      const producerFetched = this.$store.getters.getFetchedProducerByParam({ param: "id", value: id });
      if (producerFetched[0]) {
        // Already fetched
        this.producer = producerFetched[1];
      } else {
        // Not fetched yet
        this.producer = await this.$store.dispatch("fetchProducerByParam", { param: "id", value: id }).catch(error => {
          console.error(error);
        });
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  async created() {
    await this.getProductBySlug(this.slug);
    if (this.product && this.product.producerId) {
      await this.getProducerById(this.product.producerId);
    }
  }
};
</script>

<style></style>
