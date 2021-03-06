<template>
  <v-container>
    <h1 class="text-h4 mb-2">Produzenten</h1>
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getProducers()" />

    <v-row dense v-if="!loadingError">
      <!-- Filter -->
      <v-col
        cols="12"
        sm="6"
        lg="4"
        :class="$vuetify.breakpoint.smAndUp && 'sticky-filter'"
        :style="{ top: $vuetify.breakpoint.lgAndUp ? '150px' : '100px' }"
      >
        <v-card class="my-1">
          <v-card-text>
            <v-row no-gutters>
              <ProducersMap :selectedCountry="selectedCountry" @countrySelected="onMapSelect($event)" />
              <v-col cols="12">
                <v-select
                  :items="filteredCountries"
                  item-text="text"
                  item-value="value"
                  v-model="selectedCountry"
                  label="Herkunftsland"
                  clearable
                  hide-details
                  :loading="isLoading"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="filteredIngredients"
                  v-model="selectedIngredient"
                  label="Zutat aus Genossenschaft"
                  clearable
                  hide-details
                  :loading="isLoading"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-alert
          dismissible
          icon="mdi-lightbulb-on"
          color="#ffc107"
          border="top"
          colored-border
          elevation="2"
          class="mt-2 mb-1"
          v-model="isInfoShown"
        >
          Verfeinere die Ergebnisse mit der Karte und dem Filter.
        </v-alert>
      </v-col>

      <!-- Producers -->
      <v-col cols="12" sm="6" lg="8">
        <LoadingSkeleton type="producers" v-if="isLoading" />

        <v-row v-if="!isLoading && !loadingError && filteredProducers.length" dense>
          <v-col cols="6" md="4" lg="3" v-for="producer in filteredProducers" :key="producer.id" class="d-flex">
            <v-card
              hover
              :to="`/produzenten/${producer.slug}`"
              class="d-flex flex-column"
              :style="`border-top: 6px solid ${producer.color}`"
            >
              <v-img
                :src="producer.featuredImage.source"
                :alt="producer.featuredImage.title"
                max-height="150"
                style="border-radius: 0"
              >
              </v-img>
              <v-card-title class="pt-0">
                <h3 class="text-subtitle-2" style="word-wrap: break-word; hyphens: auto">
                  {{ producer.name }}
                </h3>
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <NoContentYet type="search" v-if="!isLoading && !loadingError && !filteredProducers.length" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import NoContentYet from "@/components/partials/NoContentYet";
const ProducersMap = () => import(/* webpackChunkName: "map" */ "@/components/maps/ProducersMap");
import LoadingError from "@/components/partials/LoadingError";

export default {
  components: {
    LoadingSkeleton,
    NoContentYet,
    ProducersMap,
    LoadingError
  },

  data() {
    return {
      producers: [],
      countries: [],
      countryMap: {},
      ingredients: [],
      selectedCountry: null,
      selectedIngredient: null,
      isInfoShown: true
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.producersLoading;
    },
    loadingError() {
      return this.$store.state.producersLoadingError;
    },
    filteredProducers() {
      const filteredProducers = [];
      for (const producer of this.producers) {
        if (this.selectedCountry && producer.country !== this.selectedCountry) {
          continue;
        }
        if (this.selectedIngredient) {
          if (!producer.ingredient.includes(this.selectedIngredient)) {
            continue;
          }
        }
        filteredProducers.push(producer);
      }
      if (this.isInfoShown && filteredProducers.length < this.producers.length) {
        this.dismissInfo();
      }
      return filteredProducers.sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }));
    },
    filteredCountries() {
      let countries = [];
      if (!this.selectedIngredient) {
        countries = [...this.countries];
      } else {
        for (const producer of this.producers) {
          if (producer.ingredient && producer.ingredient.includes(this.selectedIngredient)) {
            const orig = this.countries.find(country => country.value === producer.country);
            if (orig && !countries.includes(orig)) {
              countries.push(orig);
            }
          }
        }
      }
      return countries.sort((a, b) => a.text.localeCompare(b.text, "de", { sensitivity: "base" }));
    },
    filteredIngredients() {
      let ingredients = [];
      if (!this.selectedCountry) {
        ingredients = [...this.ingredients];
      } else {
        for (const producer of this.producers) {
          if (!producer.ingredient) {
            continue;
          }
          if (producer.country === this.selectedCountry) {
            producer.ingredient.split(",").forEach(item => {
              const ingredient = item.trim();
              if (!ingredients.includes(ingredient)) {
                ingredients.push(ingredient);
              }
            });
          }
        }
      }
      return ingredients.sort((a, b) => a.localeCompare(b, "de", { sensitivity: "base" }));
    }
  },

  watch: {
    selectedCountry(value) {
      this.$store.commit("changeProducersFilter", { key: "country", value });
    },
    selectedIngredient(value) {
      this.$store.commit("changeProducersFilter", { key: "ingredient", value });
    },
    isInfoShown(value) {
      this.$store.commit("changeProducersFilter", { key: "infoDismissed", value: !value });
    }
  },

  methods: {
    async getProducers() {
      const producersFetched = this.$store.getters.getFetchedProducers();
      if (producersFetched[0]) {
        // Already fetched
        this.producers = producersFetched[1];
      } else {
        // Not fetched yet
        this.producers =
          (await this.$store.dispatch("fetchProducers").catch(error => {
            console.error(error);
          })) || [];
      }
      // Add colors
      this.producers.forEach(producer => {
        if (this.countryMap[producer.country] && this.countryMap[producer.country].color) {
          producer.color = this.countryMap[producer.country].color;
        } else {
          producer.color = "var(--v-primary-base)";
        }
      });
      this.addFilterData();
    },
    addFilterData() {
      const countries = [];
      const ingredients = [];
      for (const producer of this.producers) {
        if (producer.country && !countries.filter(country => country.value === producer.country).length) {
          countries.push({
            text: (this.countryMap[producer.country] && this.countryMap[producer.country].label) || producer.country,
            value: producer.country
          });
        }
        if (producer.ingredient) {
          producer.ingredient.split(",").forEach(item => {
            const ingredient = item.trim();
            if (!ingredients.includes(ingredient)) {
              ingredients.push(ingredient);
            }
          });
        }
      }
      this.countries = countries;
      this.ingredients = ingredients;
    },
    dismissInfo() {
      this.isInfoShown = false;
    },
    onMapSelect(country) {
      this.selectedIngredient = null;
      this.selectedCountry = country;
    }
  },

  created() {
    this.countryMap = this.shared.createCountryMap("key", ["label", "color"]);
    this.getProducers();
  },

  mounted() {
    const { country, ingredient, infoDismissed } = this.$store.state.producersFilter;
    this.selectedCountry = country;
    this.selectedIngredient = ingredient;
    this.isInfoShown = !infoDismissed;
  }
};
</script>

<style scoped>
.sticky-filter {
  align-self: flex-start;
  position: sticky;
  top: 0;
}
* >>> .v-alert__wrapper > i {
  align-self: center;
}
</style>
