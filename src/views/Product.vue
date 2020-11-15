<template>
  <v-container>
    <LoadingSkeleton v-if="isLoadingProducts" />
    <LoadingError v-else-if="loadingErrorProducts" :height="500" @retryAgain="getProductBySlug(slug)" />

    <v-row v-else-if="!isLoadingProducts && !loadingErrorProducts && Object.keys(product).length">
      <!-- Header -->
      <v-col cols="12" class="header-container">
        <div class="header-triangle"></div>
        <div
          class="header-rectangle"
          :style="{
            height: rectangleHeight + 'px',
            backgroundColor: product.backgroundColor || 'var(--v-primary-base)'
          }"
        ></div>
        <div class="header-content px-5">
          <v-img
            :src="product.featuredImage.source"
            :alt="product.featuredImage.title"
            v-bind="productImageProps"
          ></v-img>
          <div class="px-5" style="flex-grow: 1" ref="headerText">
            <h1 class="text-h4">{{ product.name }}</h1>
            <h2 class="text-subtitle-2" v-if="product.subtitle">
              <i>{{ product.subtitle }}</i>
            </h2>
          </div>
          <v-img
            :src="categoryImage.source"
            :alt="categoryImage.title"
            max-height="150"
            max-width="150"
            contain
            v-if="$vuetify.breakpoint.mdAndUp && categoryImage"
          ></v-img>
        </div>
      </v-col>
    </v-row>

    <!-- Body -->
    <v-row>
      <!-- Left column -->
      <v-col cols="12" :md="Object.keys(producer).length && 6">
        <!-- Seals -->
        <div class="mt-4 mb-2" v-if="product.seals && product.seals.length">
          <template v-for="(item, i) in product.seals">
            <v-tooltip bottom :key="i" v-if="item !== 'vegan' && sealMap[item]">
              <template v-slot:activator="{ on }">
                <router-link to="/die-siegel">
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
              <span>Mehr Infos zu unseren Siegeln</span>
            </v-tooltip>
            <div :key="i" v-else-if="item === 'vegan'"><b>Dieses Produkt ist vegan.</b></div>
          </template>
        </div>

        <!-- Shop link -->
        <div class="mt-4 mb-2" style="max-width: 500px" v-if="product.shopLink">
          <v-btn
            block
            tile
            large
            :href="product.shopLink"
            target="_blank"
            rel="nofollow"
            color="primary"
            class="white--text"
          >
            Im E-Shop kaufen
            <v-spacer></v-spacer>
            <v-icon right>mdi-open-in-new</v-icon>
          </v-btn>
        </div>

        <!-- Product content -->
        <h2 class="text-h4 mt-4 mb-2" style="color: var(--v-primary-base)">Was ich esse / trinke</h2>
        <div v-html="product.content"></div>
        <v-btn to="/does-not-exist">Weiterlesen</v-btn>
      </v-col>

      <!-- Right column -->
      <v-col cols="12" md="6" v-if="Object.keys(producer).length">
        <!-- Producer -->
        <h2 class="text-h4 mt-4 mb-2" style="color: var(--v-primary-base)">Was ich verteidige</h2>
        <div v-html="producer.content"></div>
      </v-col>
    </v-row>

    <!-- Social media -->
    <v-row>
      <v-col cols="12">
        <SocialMedia :link="'/produkte/' + slug" :title="product.name" />
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
      product: {},
      producer: {},
      productImageProps: {},
      categoryImage: null,
      categoryImageFilenames: {
        kaffee: "kaffee.png",
        tee: "tee.png",
        kakao: "kakao.png",
        schokolade: "schokolade.png"
      },
      currentWindowWidth: 0,
      rectangleHeight: 100,
      sealMap: {
        bio: {
          label: "Bio-Siegel",
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
      }
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
      this.getProductAndProducer();
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
        this.producer =
          (await this.$store.dispatch("fetchProducerById", id).catch(error => {
            console.error(error);
          })) || {};
      }
    },
    async getProductAndProducer() {
      await this.getProductBySlug(this.slug);
      if (!this.product) {
        return;
      }
      const category =
        this.product.categories && this.product.categories.length ? this.product.categories[0].slug : null;
      this.addProps(category);
      this.addCategoryImage(category);
      // Wait a short time until the title is rendered -> mobile chrome fix
      setTimeout(() => {
        this.calcRectangleHeight();
        this.currentWindowWidth = window.innerWidth;
      }, 10);
      if (this.product && this.product.producerId) {
        await this.getProducerById(this.product.producerId);
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
    addCategoryImage(category) {
      const filename = this.categoryImageFilenames[category];
      if (filename) {
        this.categoryImage = {
          title: `Bild für die Kategorie ${category}`,
          source: require(`@/assets/categories/${filename}`)
        };
      } else {
        this.categoryImage = null;
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
        this.calcRectangleHeight();
      }
      this.currentWindowWidth = window.innerWidth;
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getProductAndProducer();
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
.header-container {
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
}
.header-triangle {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right bottom, #e6e6e6 0%, #fefefe 50%, transparent 50%);
  z-index: 0;
}
.header-rectangle {
  position: absolute;
  width: 100%;
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
</style>
