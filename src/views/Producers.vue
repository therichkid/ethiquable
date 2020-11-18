<template>
  <v-container>
    <h1 class="display-1 mb-2">Produzenten</h1>
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getProducers()" />

    <v-row dense v-if="!loadingError">
      <!-- Filter -->
      <v-col cols="12" sm="6" lg="4">
        <v-card class="mt-1">
          <v-card-text>
            <v-row no-gutters>
              <ProducersMap :selectedCountry="selectedCountry" @countrySelected="selectedCountry = $event" />
              <v-col cols="12">
                <v-select
                  :items="countries"
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
                  :items="ingredients"
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
          <v-col cols="12" v-if="limitProducerLength && !selectedCountry && !selectedIngredient">
            <v-banner
              icon="mdi-lightbulb-on"
              icon-color="#ffc107"
              rounded
              :single-line="$vuetify.breakpoint.lgAndUp"
              elevation="2"
              style="border-top: 6px solid #ffc107"
            >
              Verfeinere die Ergebnisse mit der Karte und dem Filter.
              <template v-slot:actions>
                <v-btn text @click="showAllProducers()">
                  Alle anzeigen
                  <v-icon right>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
            </v-banner>
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
const LoadingError = () => import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

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
      limitProducerLength: true
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.producersLoading;
    },
    loadingError() {
      return this.$store.state.producersLoadingError;
    },
    maxShownProducers() {
      if (this.$vuetify.breakpoint.lgAndUp) {
        return 12;
      } else if (this.$vuetify.breakpoint.md) {
        return 9;
      }
      return 6;
    },
    filteredProducers() {
      const filteredProducers = [];
      for (const producer of this.producers) {
        if (this.selectedCountry && producer.country !== this.selectedCountry) {
          continue;
        }
        if (this.selectedIngredient) {
          const ingredients = (producer.ingredient && producer.ingredient.split(",")) || [];
          let hasIngredient = false;
          for (const ingredient of ingredients) {
            if (ingredient.trim() === this.selectedIngredient) {
              hasIngredient = true;
            }
          }
          if (!hasIngredient) {
            continue;
          }
        }
        filteredProducers.push(producer);
      }
      filteredProducers.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
      if (this.limitProducerLength && filteredProducers.length > this.maxShownProducers) {
        filteredProducers.splice(this.maxShownProducers);
      }
      return filteredProducers;
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
      this.countries = countries.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
      this.ingredients = ingredients.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    },
    showAllProducers() {
      this.limitProducerLength = false;
      sessionStorage.setItem("showAllProducers", "true");
    }
  },

  created() {
    this.countryMap = this.shared.createCountryMap("key", ["label", "color"]);
    this.getProducers();
  },

  mounted() {
    if (sessionStorage.getItem("showAllProducers") === "true") {
      this.limitProducerLength = false;
    }
  }
};
</script>

<style></style>
