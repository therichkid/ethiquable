<template>
  <v-container>
    <h1 class="text-h5 mb-2">Produzenten</h1>
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getProducers()" />

    <v-row dense v-if="!loadingError">
      <!-- Table -->
      <v-col cols="12" sm="5" md="4">
        <v-card>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="Nach Produzenten suchen"
                  clearable
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="countries"
                  item-text="text"
                  item-value="value"
                  v-model="selectedCountry"
                  label="Herkunftsland"
                  clearable
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="ingredients"
                  v-model="selectedIngredient"
                  label="Zutat aus Genossenschaft"
                  clearable
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-btn>Filter zurücksetzen</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Map -->
      <v-col cols="12" sm="7" md="8">
        <ShopFinderMap :markers="[]" :activeMarker="null" :currentLocation="null" :zoom="zoom" :center="center" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ShopFinderMap from "@/components/maps/ShopFinderMap";
const LoadingError = () => import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    ShopFinderMap,
    LoadingError
  },

  data() {
    return {
      producers: [],
      countries: [],
      countryLabels: {
        bolivia: "Bolivien",
        china: "China",
        ecuador: "Ecuador",
        "el-salvador": "El Salvador",
        "ivory-coast": "Elfenbeinküste",
        haiti: "Haiti",
        honduras: "Honduras",
        india: "Indien",
        congo: "Kongo",
        mexico: "Mexiko",
        nicaragua: "Nicaragua",
        paraguay: "Paraguay",
        peru: "Peru",
        "south-africa": "Südafrika",
        thailand: "Thailand",
        tunesia: "Tunesien",
        vietnam: "Vietnam"
      },
      ingredients: [],
      search: null,
      selectedCountry: null,
      selectedIngredient: null,
      zoom: 6,
      center: [51.0, 11.0]
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
        if (this.search && !producer.name.toLowerCase().includes(this.search.toLowerCase())) {
          continue;
        }
        filteredProducers.push(producer);
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
      this.addFilterData();
    },

    addFilterData() {
      for (const producer of this.producers) {
        if (producer.country && !this.countries.filter(country => country.value === producer.country).length) {
          this.countries.push({
            text: this.countryLabels[producer.country] || producer.country,
            value: producer.country
          });
        }
        if (!this.ingredients.includes(producer.ingredient)) {
          this.ingredients.push(producer.ingredient);
        }
      }
    }
  },

  created() {
    this.getProducers();
  }
};
</script>

<style></style>
