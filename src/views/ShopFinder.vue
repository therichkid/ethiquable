<template>
  <v-container>
    <h1 class="text-h4 mb-2">Shop-Finder</h1>
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getShops()" />

    <v-row dense v-if="!loadingError">
      <!-- Table -->
      <v-col cols="12" sm="5" md="4">
        <v-card>
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <GeolocationSearch @setGeolocation="setCurrentLocationManually($event)" />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="Nach Supermärkten suchen"
                  clearable
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-data-table
            :headers="table.headers"
            :items="filteredShops || []"
            :items-per-page="$vuetify.breakpoint.xsOnly ? 5 : 10"
            :sort-by="table.sortBy"
            :loading="isLoading"
            :mobile-breakpoint="0"
            disable-filtering
            must-sort
            @click:row="setShopToActive"
            style="cursor: pointer"
          >
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Map -->
      <v-col cols="12" sm="7" md="8">
        <ShopFinderMap
          :markers="filteredShops"
          :activeMarker="activeShop"
          :currentLocation="currentLocation"
          :zoom.sync="zoom"
          :center="center"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GeolocationSearch from "@/components/partials/GeolocationSearch";
const ShopFinderMap = () => import(/* webpackChunkName: "map" */ "@/components/maps/ShopFinderMap");
const LoadingError = () => import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");
import L from "leaflet";

export default {
  components: {
    ShopFinderMap,
    GeolocationSearch,
    LoadingError
  },

  data() {
    return {
      shops: [],
      activeShop: null,
      currentLocation: null,
      zoom: 6,
      center: [51.0, 11.0],
      table: {
        headers: [{ text: "Name", value: "name" }],
        sortBy: "name"
      },
      search: null,
      timeout: null
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.shopsLoading;
    },
    loadingError() {
      return this.$store.state.shopsLoadingError;
    },
    filteredShops() {
      const filteredShops = [];
      for (const shop of this.shops) {
        if (this.search && !shop.name.toLowerCase().includes(this.search.toLowerCase())) {
          continue;
        }
        filteredShops.push(shop);
      }
      return filteredShops;
    }
  },

  watch: {
    isLoading(isLoading) {
      if (!isLoading) {
        this.getCurrentLocation();
      }
    }
  },

  methods: {
    async getShops() {
      const shopsFetched = this.$store.getters.getFetchedShops();
      if (shopsFetched[0]) {
        // Already fetched
        this.shops = shopsFetched[1];
      } else {
        // Not fetched yet
        this.shops =
          (await this.$store.dispatch("fetchShops").catch(error => {
            console.error(error);
          })) || [];
      }
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          location => {
            this.currentLocation = {
              center: [location.coords.latitude, location.coords.longitude],
              radius: location.coords.accuracy / 2
            };
            this.addDistanceToShops();
            if (!this.table.headers.filter(header => header.value === "distance").length) {
              this.table.headers.splice(1, 0, {
                text: "Distanz [km]",
                value: "distance",
                align: "right"
              });
            }
            this.center = this.currentLocation.center;
            setTimeout(() => {
              this.zoom = 12;
            }, 1000);
            this.table.sortBy = "distance";
          },
          error => {
            console.error(error);
          }
        );
      }
    },
    addDistanceToShops() {
      for (const shop of this.shops) {
        const loc = this.currentLocation.center;
        shop.distance = parseInt(L.latLng(loc[0], loc[1]).distanceTo(shop.latlng) / 1000);
      }
      // Force trigger an update in the data table
      this.shops = [...this.shops];
    },
    setShopToActive(shop) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.activeShop = shop;
      this.center = shop.latlng;
      if (this.zoom < 12) {
        setTimeout(() => {
          this.zoom = 12;
        }, 1000);
      }
      // Set the activeShop to null after the bouncing animation
      // Else the icon would bounce again after each filter change
      this.timeout = setTimeout(() => {
        this.activeShop = null;
      }, 750 * 5);
    },
    setCurrentLocationManually(latlng) {
      this.currentLocation = {
        center: latlng
      };
      this.addDistanceToShops();
      if (!this.table.headers.filter(header => header.value === "distance").length) {
        this.table.headers.splice(1, 0, {
          text: "Distanz [km]",
          value: "distance"
        });
      }
      this.center = this.currentLocation.center;
      setTimeout(() => {
        this.zoom = 12;
      }, 1000);
      this.table.sortBy = "distance";
    }
  },

  created() {
    this.getShops();
  },

  mounted() {
    if (!this.isLoading) {
      this.getCurrentLocation();
    }
  }
};
</script>

<style></style>
