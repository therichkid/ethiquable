<template>
  <div>
    <LoadingSkeleton type="slider" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getSlides()" />

    <v-hover v-slot:default="{ hover }" v-if="!isLoading && !loadingError && slides && slides.length">
      <v-carousel hide-delimiters :cycle="!hover" interval="10000" :height="$vuetify.breakpoint.smAndUp ? 500 : 250">
        <v-carousel-item
          v-for="(slide, i) in slides"
          :key="i"
          :src="slide.featuredImage.source"
          v-bind="slide.linkProps"
        >
          <v-container class="fill-height align-end">
            <v-row>
              <v-col cols="12" class="slide-caption">
                <h3 class="text-h4">{{ slide.title }}</h3>
                <span class="text-subtitle-1" v-if="slide.excerpt">{{ slide.excerpt }}</span>
              </v-col>
            </v-row>
          </v-container>
        </v-carousel-item>
      </v-carousel>
    </v-hover>
  </div>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import LoadingError from "@/components/partials/LoadingError";

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
        slides = (await this.$store.dispatch("fetchSlides").catch(error => console.error(error))) || [];
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
  }
};
</script>

<style scoped>
.slide-caption {
  padding: 10px 30px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
}
</style>
