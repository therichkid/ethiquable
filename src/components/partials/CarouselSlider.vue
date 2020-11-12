<template>
  <div>
    <LoadingSkeleton type="slider" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getSlides()" />

    <v-carousel hide-delimiters :cycle="true" interval="10000" v-if="!isLoading && !loadingError">
      <v-carousel-item v-for="(slide, i) in slides" :key="i" :src="slide.featuredImage.source" v-bind="slide.linkProps">
        <v-row class="fill-height" justify="center" align="end">
          <v-col cols="12" class="slide-caption">
            <h4 class="text-h4">{{ slide.title }}</h4>
            <span class="text-subtitle-1" v-if="slide.excerpt">{{ slide.excerpt }}</span>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
const LoadingError = () => import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    LoadingError
  },

  data() {
    return {
      slides: []
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.slidesLoading;
    },
    loadingError() {
      return this.$store.state.slidesLoadingError;
    }
  },

  methods: {
    async getSlides() {
      const slidesFetched = this.$store.getters.getFetchedSlides();
      let slides;
      if (slidesFetched[0]) {
        // Already fetched
        slides = slidesFetched[1];
      } else {
        // Not fetched yet
        slides = await this.$store.dispatch("fetchSlides").catch(error => console.error(error));
      }
      slides.forEach(slide => {
        slide.excerpt = this.shared.stripHtml(slide.excerpt);
        if (slide.link) {
          if (slide.link.match(/http|www/i)) {
            // External link
            if (!slide.link.includes("http")) {
              slide.link = `https://${slide.link}`;
            }
            slide.linkProps = {
              href: slide.link,
              target: "_blank",
              rel: "noopener noreferrer"
            };
          } else {
            // Internal link
            slide.linkProps = {
              to: slide.link
            };
          }
        }
      });
      this.slides = slides;
    }
  },

  created() {
    this.getSlides();
  },

  mounted() {}
};
</script>

<style scoped>
.slide-caption {
  padding: 5px 30px;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>