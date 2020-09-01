<template>
  <v-container>
    <h1 class="display-1 mb-2" style="word-wrap: break-word;" v-html="formattedCategory"></h1>

    <LoadingSkeleton type="posts" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getProducts(category)" />

    <v-row v-if="!isLoading && !loadingError && products.length" no-gutters align="baseline">
      <v-col cols="6" sm="4" lg="3" v-for="product in products" :key="product.id">
        <v-card
          flat
          hover
          tile
          :to="`/produkte/${product.slug}`"
          class="my-2"
          style="border-bottom: 6px solid var(--v-secondary-base);"
        >
          <v-spacer></v-spacer>
          <v-img
            :src="product.featuredImage.source"
            :alt="product.featuredImage.title"
            max-height="300"
            contain
          ></v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
const LoadingError = () => import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");
export default {
  components: {
    LoadingSkeleton,
    LoadingError
  },

  props: {
    category: String
  },

  data() {
    return {
      products: []
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.productsLoading;
    },
    loadingError() {
      return this.$store.state.productsLoadingError;
    },
    formattedCategory() {
      if (this.category === "oel") {
        return "Öl";
      } else {
        return this.shared.capitalize(this.category);
      }
    }
  },

  watch: {
    $route() {
      this.getProducts(this.category);
    }
  },

  methods: {
    async getProducts(category) {
      let products = [];
      const productsFetched = this.$store.getters.getFetchedProductsPerCategory(category);
      if (productsFetched[0]) {
        // Already fetched
        products = productsFetched[1];
      } else {
        // Not fetched yet
        products = await this.$store.dispatch("fetchProducts", category).catch(error => {
          console.error(error);
        });
      }
      this.products = products.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }
  },
  created() {
    this.getProducts(this.category);
  }
};
</script>

<style></style>
