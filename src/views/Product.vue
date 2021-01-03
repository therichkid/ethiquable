<template>
  <v-container>
    <LoadingSkeleton v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getProductAndProducers()" />

    <v-row v-if="!isLoading && !loadingError && Object.keys(product).length" :style="productStyle">
      <!-- Header -->
      <v-col cols="12" class="header-container">
        <div class="header-triangle"></div>
        <div
          class="header-rectangle"
          style="background-color: var(--product-bg-color-primary)"
          :style="{ height: rectangleHeight + 'px' }"
        ></div>
        <div class="header-content px-5">
          <v-img
            :src="product.featuredImage.source"
            :alt="product.featuredImage.title"
            v-bind="productImageProps"
          ></v-img>
          <div class="px-5" style="flex-grow: 1" ref="headerText">
            <h1
              class="text-h5 text-sm-h4 white--text"
              style="text-shadow: var(--product-text-shadow); word-wrap: anywhere"
            >
              {{ product.name }}
            </h1>
            <h2
              class="text-subtitle-2 white--text"
              style="text-shadow: var(--product-text-shadow)"
              v-if="product.subtitle"
            >
              <i>{{ product.subtitle }}</i>
            </h2>
          </div>
          <v-img
            :src="product.decorationImage.source"
            :alt="product.decorationImage.title"
            max-height="150"
            max-width="150"
            contain
            v-if="$vuetify.breakpoint.mdAndUp && product.decorationImage"
          ></v-img>
        </div>
      </v-col>

      <!-- Body -->
      <!-- Left column -->
      <v-col cols="12" :md="(product.producerText || producers.length) && 6">
        <!-- Seals -->
        <div class="mt-4 mb-2" v-if="product.seals && product.seals.length">
          <template v-for="(item, i) in product.seals">
            <v-tooltip bottom :key="i" v-if="item !== 'vegan' && sealMap[item]">
              <template v-slot:activator="{ on }">
                <router-link :to="`/die-siegel#${item}`">
                  <img
                    height="60"
                    width="auto"
                    :src="sealMap[item].img"
                    :alt="sealMap[item].label"
                    v-on="on"
                    :class="i > 0 ? 'mx-2' : 'mr-2'"
                  />
                </router-link>
              </template>
              <span>Mehr Infos zum {{ sealMap[item].label }}-Siegel</span>
            </v-tooltip>
            <div :key="i" v-else-if="item === 'vegan'"><b>Dieses Produkt ist vegan.</b></div>
          </template>
        </div>

        <!-- Product content -->
        <div v-html="product.content" class="product-content mt-4"></div>

        <!-- Recipe -->
        <v-card
          hover
          :to="{ path: `/rezepte/${recipe.slug}`, query: { id: recipe.id } }"
          class="mt-4 mb-2"
          style="border-top: 6px solid var(--product-bg-color-primary); max-width: 600px"
          v-if="recipe"
        >
          <div class="d-flex">
            <v-avatar class="ma-3" :size="$vuetify.breakpoint.smAndUp ? 150 : 100" tile>
              <v-img :src="recipe.featuredImage.source" :alt="recipe.featuredImage.title"></v-img>
            </v-avatar>
            <div class="d-flex flex-column flex-grow-1">
              <v-card-text>
                <div class="text-subtitle-2">Rezeptidee:</div>
                <div class="text-h6 text-sm-h5" style="word-wrap: break-word">{{ recipe.title }}</div>
                <RecipeProps :recipe="recipe" class="pt-2" />
              </v-card-text>
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-icon>mdi-chevron-right</v-icon>
              </v-card-actions>
            </div>
          </div>
        </v-card>

        <!-- Shop link -->
        <div class="pt-4" style="max-width: 600px" v-if="product.shopLink">
          <v-btn
            block
            tile
            large
            :href="product.shopLink"
            target="_blank"
            rel="nofollow"
            dark
            style="background-color: var(--product-bg-color-secondary); text-shadow: var(--product-text-shadow)"
          >
            Im E-Shop kaufen
            <v-spacer></v-spacer>
            <v-icon right>mdi-open-in-new</v-icon>
          </v-btn>
        </div>
      </v-col>

      <!-- Right column -->
      <v-col cols="12" md="6" v-if="product.producerText || producers.length">
        <h2 class="text-h4 mt-4 mb-2">Das will ich</h2>
        <!-- Producer text -->
        <v-row no-gutters v-if="product.producerText">
          <v-col cols="12">
            <div v-html="product.producerText"></div>
            <v-divider class="mt-4 mb-2" v-if="producers.length"></v-divider>
          </v-col>
        </v-row>

        <!-- Producers -->
        <template v-if="producers.length">
          <v-row no-gutters v-for="(producer, i) in producers" :key="i">
            <v-col cols="12">
              <v-card
                hover
                :to="{ path: `/produzenten/${producer.slug}`, query: { id: producer.id } }"
                class="mt-4 mb-2"
                style="border-top: 6px solid var(--product-bg-color-primary)"
              >
                <div class="d-flex">
                  <v-avatar class="ma-3" :size="$vuetify.breakpoint.smAndUp ? 150 : 100" tile>
                    <v-img :src="producer.featuredImage.source" :alt="producer.featuredImage.title"></v-img>
                  </v-avatar>
                  <div class="d-flex flex-column flex-grow-1">
                    <v-card-text>
                      <div class="text-subtitle-2">Produzent:</div>
                      <div class="text-h6 text-sm-h5" style="word-wrap: break-word">{{ producer.name }}</div>
                      <div v-html="producer.excerpt"></div>
                    </v-card-text>
                    <v-spacer></v-spacer>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-card-actions>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>

    <!-- Social media -->
    <v-row>
      <v-col cols="12">
        <SocialMedia :title="product.name" />
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
import RecipeProps from "@/components/partials/RecipeProps";

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    SocialMedia,
    RecipeProps
  },

  props: {
    slug: String
  },

  data() {
    return {
      product: {},
      producers: [],
      recipe: null,
      productImageProps: {},
      currentWindowWidth: 0,
      rectangleHeight: 100,
      sealMap: {
        bio: {
          label: "Bio",
          img: require("@/assets/logos/bio.jpg")
        },
        fairtrade: {
          label: "Fairtrade",
          img: require("@/assets/logos/fairtrade.png")
        },
        spp: {
          label: "SPP",
          img: require("@/assets/logos/spp.png")
        }
      },
      timeout: null
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.productsLoading;
    },
    loadingError() {
      return this.$store.state.productsLoadingError;
    },
    failedRequests() {
      return this.$store.state.failedRequests;
    },
    productStyle() {
      return {
        "--product-bg-color-primary": (this.product && this.product.backgroundColor) || "var(--v-primary-base)",
        "--product-bg-color-secondary": (this.product && this.product.backgroundColor) || "var(--v-secondary-base)",
        "--product-text-shadow":
          this.product && this.product.backgroundColor && this.shared.isLightColor(this.product.backgroundColor)
            ? "1px 1px 2px #000"
            : "none"
      };
    }
  },

  watch: {
    product(product) {
      if (!product && !this.failedRequests) {
        this.$router.replace("/404");
      }
    },
    $route() {
      this.getProductAndProducers();
    }
  },

  methods: {
    async getProduct(slug) {
      let productFetched = [false, null];
      // Try first with id
      if (this.$route.query.id) {
        const id = parseInt(this.$route.query.id, 10);
        productFetched = this.$store.getters.getFetchedProductByParam({ param: "id", value: id });
        // Remove query from url
        window.history.replaceState({}, null, this.$route.path);
      }
      // Then try with slug
      if (!productFetched[0]) {
        productFetched = this.$store.getters.getFetchedProductByParam({ param: "slug", value: slug });
      }
      if (productFetched[0]) {
        // Already fetched
        this.product = productFetched[1];
      } else {
        // Not fetched yet
        this.product = await this.$store.dispatch("fetchProductBySlug", slug).catch(error => console.error(error));
      }
      if (this.product) {
        document.title = this.product.name + " - " + document.title;
      }
    },
    async getProducersById(ids) {
      const producers = [];
      const idsToFetch = [];
      for (const id of ids) {
        const producerFetched = this.$store.getters.getFetchedProducerByParam({ param: "id", value: id });
        if (producerFetched[0]) {
          // Already fetched
          producers.push(producerFetched[1]);
        } else {
          // Not fetched yet
          idsToFetch.push(id);
        }
      }
      if (idsToFetch.length) {
        const fetchedProducers =
          (await this.$store.dispatch("fetchProducersById", idsToFetch).catch(error => console.error(error))) || [];
        producers.push(...fetchedProducers);
      }
      producers.forEach(producer => {
        const excerpt = this.shared.shortenTextLength(producer.excerpt, 150);
        this.producers.push({ ...producer, excerpt });
      });
    },
    async getRecipeById(id) {
      const recipeFetched = this.$store.getters.getFetchedRecipeByParam({ param: "id", value: id });
      if (recipeFetched[0]) {
        // Already fetched
        this.recipe = recipeFetched[1];
      } else {
        // Not fetched yet
        this.recipe = await this.$store.dispatch("fetchRecipeById", id).catch(error => console.error(error));
      }
    },
    async getProductAndProducers() {
      await this.getProduct(this.slug);
      if (!this.product) {
        return;
      }
      const category =
        this.product.categories && this.product.categories.length ? this.product.categories[0].slug : null;
      this.addProps(category);
      // Wait a short time until the title is rendered -> mobile chrome fix
      setTimeout(() => {
        this.calcRectangleHeight();
        this.currentWindowWidth = window.innerWidth;
      }, 10);
      // Initialize producers
      this.producers = [];
      if (this.product.producerIds && this.product.producerIds.length) {
        await this.getProducersById(this.product.producerIds);
      }
      if (this.product.recipeId) {
        await this.getRecipeById(this.product.recipeId);
      }
    },
    addProps(category) {
      const size = window.innerWidth < 600 ? 125 : 250; // Can't use vuetify breakpoint here as it is updated too late
      if (["kaffee", "schokolade", "oel"].includes(category)) {
        const calcWidth = (9 / 16) * size;
        this.productImageProps = {
          height: size,
          width: calcWidth,
          maxWidth: calcWidth
        };
      } else {
        this.productImageProps = {
          maxHeight: size,
          maxWidth: size,
          contain: true
        };
      }
    },
    calcRectangleHeight() {
      if (this.$refs.headerText) {
        this.rectangleHeight = this.$refs.headerText.clientHeight + 40;
      }
    },
    resizeHandler() {
      if (window.innerWidth !== this.currentWindowWidth) {
        this.addProps();
        // Wait a tiny bit until the DOM is updated and the ref is returning the correct height
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.calcRectangleHeight();
        }, 250);
      }
      this.currentWindowWidth = window.innerWidth;
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getProductAndProducers();
  },

  mounted() {
    window.addEventListener("resize", this.resizeHandler);
  },

  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
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
.header-container {
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
}
.header-triangle {
  position: absolute;
  width: calc(100% - 24px);
  height: 100%;
  background-image: linear-gradient(to right bottom, #e6e6e6 0%, #fefefe 50%, transparent 50%);
  z-index: 0;
}
.header-rectangle {
  position: absolute;
  width: calc(100% - 24px);
  background-color: #d5d5d5;
  z-index: 1;
}
.header-content {
  position: absolute;
  width: 100%;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
}
.product-content >>> table.ethiquable-table tr > th {
  background-color: var(--product-bg-color-primary);
  text-shadow: var(--product-text-shadow);
}
.product-content >>> table.ethiquable-table tr > td:last-child {
  text-align: right;
}
</style>
