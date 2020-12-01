<template>
  <v-container>
    <h1 class="text-h4 mb-2" style="word-wrap: break-word" v-html="formattedCategory"></h1>

    <LoadingSkeleton type="products" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getProducts(category)" />

    <v-row v-if="categoryPage">
      <v-col cols="12" v-html="categoryPage.content" class="pb-0"></v-col>
    </v-row>

    <v-row v-if="!isLoading && !loadingError && products.length" no-gutters>
      <v-col v-for="product in products" :key="product.id" v-bind="breakpointProps" class="d-flex">
        <v-card
          flat
          hover
          tile
          :to="`/produkte/${product.slug}`"
          class="d-flex flex-column my-2"
          style="border-bottom: 6px solid var(--v-secondary-base); width: 100%"
        >
          <v-spacer></v-spacer>
          <v-img :src="product.featuredImage.source" :alt="product.featuredImage.title" v-bind="imageProps">
            <v-chip-group class="mt-1 ml-3" v-if="product.isNew">
              <v-chip color="#ffc107" text-color="white" small style="text-shadow: 1px 1px 2px black">
                <b>NEU</b>
              </v-chip>
            </v-chip-group>
          </v-img>
        </v-card>
      </v-col>
    </v-row>

    <NoContentYet v-if="!isLoading && !loadingError && !products.length" />
  </v-container>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import NoContentYet from "@/components/partials/NoContentYet";
import LoadingError from "@/components/partials/LoadingError";

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
      categoryPage: null,
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
      this.getCategoryPage();
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
        products =
          (await this.$store.dispatch("fetchProducts", this.category).catch(error => {
            console.error(error);
          })) || [];
      }
      this.products = products.sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }));
      if (this.formattedCategory) {
        document.title = this.formattedCategory + " - " + document.title;
      }
    },
    async getCategoryPage() {
      const slug = this.category;
      if (this.$store.state.nonExistingCategoryPages.includes(slug)) {
        return;
      }
      const pageFetched = this.$store.getters.getFetchedPageBySlug(slug);
      if (pageFetched[0]) {
        // Already fetched
        this.categoryPage = pageFetched[1];
      } else {
        // Not fetched yet
        this.categoryPage = await this.$store.dispatch("fetchPageBySlug", slug).catch(error => {
          console.error(error);
        });
      }
      if (!this.categoryPage) {
        // Add to store to not try to fetch this page again in this session
        this.$store.state.nonExistingCategoryPages.push(slug);
      }
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
    this.getCategoryPage();
  },

  mounted() {
    this.addProps();
  }
};
</script>

<style></style>
