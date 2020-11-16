<template>
  <div id="map">
    <l-map :zoom.sync="zoom" :center="center" ref="map">
      <l-tile-layer :url="tileProvider.url" :attribution="tileProvider.attribution"></l-tile-layer>
      <l-geo-json :geojson="countries" :options="geojsonOptions" />
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";
import countries from "@/assets/map/countries.geo.json"; // Created from https://geojson-maps.ash.ms/

export default {
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  },

  props: {
    selectedCountry: String
  },

  data() {
    return {
      tileProvider: {
        url: "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      },
      zoom: 1,
      center: [0, 0],
      countries,
      geojsonOptions: {
        color: "var(--v-primary-base)",
        opacity: 0.75,
        fillOpacity: 0.25,
        weight: 2,
        onEachFeature: (feature, layer) => {
          const key = this.countryNamesMap[feature.properties.admin];
          // Save a reference to each layer
          if (key) {
            this.geojsonRefMap[key] = layer;
          }
          // Initialze a click handler
          layer.on("click", () => {
            const bounds = layer.getBounds();
            this.$refs.map.mapObject.fitBounds(bounds, { padding: [30, 30] });
            // Notify parent
            if (key) {
              this.$emit("countrySelected", key);
            }
          });
        }
      },
      geojsonRefMap: {},
      countryNamesMap: {}
    };
  },

  methods: {
    zoomToSelectedCountry(country) {
      const layer = this.geojsonRefMap[country];
      if (layer) {
        const bounds = layer.getBounds();
        this.$refs.map.mapObject.fitBounds(bounds, { padding: [30, 30] });
      }
    }
  },

  watch: {
    selectedCountry(country) {
      if (country) {
        this.zoomToSelectedCountry(country);
      } else {
        this.zoom = 1;
        this.center = [0, 0];
      }
    }
  },

  created() {
    this.countryNamesMap = this.shared.createCountryNamesMap("admin", "key");
  }
};
</script>

<style scoped>
#map {
  height: 350px;
  width: 100%;
}
.vue2leaflet-map {
  z-index: 0;
}
</style>
