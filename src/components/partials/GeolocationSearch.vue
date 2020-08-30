<template>
  <v-menu offset-y max-height="75%">
    <template v-slot:activator="scope">
      <v-text-field
        @click="scope.value = true"
        @keydown="scope.value = true"
        v-model="locationSearch"
        :loading="isLoading"
        label="Ihren Standort suchen"
        prepend-inner-icon="mdi-magnify"
        clearable
        hide-details
      ></v-text-field>
    </template>
    <v-list>
      <v-subheader v-if="!isLoading && !locations.length">
        <span v-if="!locationSearch">Tippen Sie Ort oder PLZ ein</span>
        <span v-else>Keine Ergebnisse gefunden</span>
      </v-subheader>
      <v-list-item
        v-for="location in locations"
        :key="location.place_id"
        @click="setGeolocation(location)"
      >
        <v-list-item-content>
          <v-list-item-title v-html="location.display_name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import api from "@/services/api";

export default {
  data() {
    return {
      locations: [],
      locationSearch: null,
      isLoading: false,
      timeout: null
    };
  },

  watch: {
    locationSearch(value) {
      this.search(value);
    }
  },

  methods: {
    async search(value) {
      if (this.isLoading) {
        // Delay request with simple debounce
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.search(value);
        }, 150);
        return;
      }
      if (!value) {
        this.locations = [];
        return;
      }
      let params = { format: "json", country: "germany" };
      if (parseInt(value, 10) == value) {
        params.postalcode = value;
      } else {
        params.city = value;
      }
      this.isLoading = true;
      try {
        const response = await api.fetchOsmData(params);
        this.locations = response.data;
      } catch (error) {
        this.locations = [];
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },

    setGeolocation(location) {
      if (location && location.lat && location.lon) {
        const latlng = [location.lat, location.lon];
        this.$emit("setGeolocation", latlng);
      }
    }
  }
};
</script>

<style></style>
