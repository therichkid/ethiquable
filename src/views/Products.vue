<template>
  <v-container>
    <h1 class="display-1 mb-2" style="word-wrap: break-word" v-html="formattedCategory"></h1>

    <LoadingSkeleton type="products" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getProducts(category)" />

    <v-row v-if="!isLoading && !loadingError && products.length" no-gutters align="baseline">
      <v-col v-for="product in products" :key="product.id" v-bind="breakpointProps">
        <v-card
          flat
          hover
          tile
          :to="`/produkte/${product.slug}`"
          class="my-2"
          style="border-bottom: 6px solid var(--v-secondary-base)"
        >
          <v-spacer></v-spacer>
          <v-img :src="product.featuredImage.source" :alt="product.featuredImage.title" v-bind="imageProps"></v-img>
        </v-card>
      </v-col>
    </v-row>

    <NoContentYet v-if="!isLoading && !loadingError && !products.length" />
  </v-container>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import NoContentYet from "@/components/partials/NoContentYet";
const LoadingError = () => import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    NoContentYet,
    LoadingError
  },

  props: {
    category: String
  },

  data() {
    return {
      products: [],
      breakpointProps: {},
      imageProps: {}
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
      return this.shared.capitalize(
        this.category.replace(/ae/g, "\u00e4").replace(/oe/g, "\u00f6").replace(/ue/g, "\u00fc")
      );
    }
  },

  watch: {
    $route() {
      this.getProducts();
      this.addProps();
    }
  },

  methods: {
    async getProducts() {
      let products = [];
      const productsFetched = this.$store.getters.getFetchedProductsPerCategory(this.category);
      if (productsFetched[0]) {
        // Already fetched
        products = productsFetched[1];
      } else {
        // Not fetched yet
        products = await this.$store.dispatch("fetchProducts", this.category).catch(error => {
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
    },
    addProps() {
      if (["kaffee", "schokolade", "oel"].includes(this.category)) {
        this.breakpointProps = {
          cols: 6,
          sm: 4,
          md: 3,
          lg: 2
        };
        this.imageProps = {
          maxHeight: 400,
          aspectRatio: 9 / 16
        };
      } else {
        this.breakpointProps = {
          cols: 6,
          sm: 4,
          lg: 3
        };
        this.imageProps = {
          maxHeight: 300,
          contain: true
        };
      }
    }
  },

  created() {
    this.getProducts();
  },

  mounted() {
    this.addProps();
  }
};
</script>

<style></style>
