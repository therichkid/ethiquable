<template>
  <div id="map">
    <l-map :zoom="zoom" :center="center" v-on:update:zoom="updateZoom($event)">
      <l-tile-layer :url="tileProvider.url" :attribution="tileProvider.attribution"></l-tile-layer>
      <l-geo-json :geojson="germany" :options="geojsonOptions" />
      <l-marker-cluster :options="{ maxClusterRadius: 15 }">
        <l-marker v-for="marker in markers" :key="marker.id" :lat-lng="marker.latlng">
          <l-icon :icon-size="[40, 40]" :icon-anchor="[20, 40]" :popup-anchor="[0, -30]">
            <div :class="{ bounce: marker === activeMarker }">
              <img :src="getMarkerIcon(marker.name)" :alt="marker.name" height="40px" width="40px" />
            </div>
          </l-icon>
          <MapPopup :marker="marker" />
        </l-marker>
      </l-marker-cluster>
      <div v-if="currentLocation">
        <l-circle
          :lat-lng="currentLocation.center"
          :radius="currentLocation.radius"
          color="#ea4335"
          :zIndexOffset="-100"
        />
        <l-marker :lat-lng="currentLocation.center" :zIndexOffset="100">
          <l-icon :icon-size="[50, 50]" :icon-anchor="[25, 50]" :popup-anchor="[0, -40]">
            <img
              src="https://cdn.mapmarker.io/api/v1/font-awesome/v5/pin?icon=fa-circle-solid&size=50&background=ea4335&voffset=-1"
              alt="You are here"
              height="50px"
              width="50px"
            />
          </l-icon>
          <l-popup>
            <h3 class="headline">Ihr Standort!</h3>
          </l-popup>
        </l-marker>
      </div>
    </l-map>
  </div>
</template>

<script>
import MapPopup from "@/components/partials/MapPopup";
import { LMap, LTileLayer, LGeoJson, LMarker, LIcon, LPopup, LCircle } from "vue2-leaflet";
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";
import germany from "@/assets/map/germany.geo.json";

export default {
  components: {
    MapPopup,
    LMap,
    LTileLayer,
    LGeoJson,
    LMarker,
    LIcon,
    LPopup,
    LCircle,
    "l-marker-cluster": Vue2LeafletMarkerCluster
  },

  props: {
    markers: Array,
    activeMarker: Object,
    currentLocation: Object,
    zoom: Number,
    center: Array
  },

  data() {
    return {
      tileProvider: {
        url: "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
      },
      germany,
      geojsonOptions: {
        color: "var(--v-primary-base)",
        opacity: 0.75,
        fillOpacity: 0.25,
        weight: 2
      }
    };
  },

  methods: {
    getMarkerIcon(name) {
      const brands = {
        combi: {
          background: "004e99",
          color: "db001a"
        },
        edeka: {
          background: "f7de00",
          color: "0276b9"
        },
        familia: {
          background: "db0019",
          color: "f7e600"
        },
        globus: {
          background: "00a64d",
          color: "ed7e1e"
        },
        konsum: {
          background: "009fe3",
          color: "e30613"
        },
        rewe: {
          background: "c6071d",
          color: "fff"
        }
      };
      let background, color;
      for (const key in brands) {
        if (
          name.toLowerCase().includes(key) ||
          (key === "edeka" && (name.toLowerCase().includes("e center") || name.toLowerCase().includes("e aktiv")))
        ) {
          background = brands[key].background;
          color = brands[key].color;
        }
      }
      if (!background) {
        background = "b25c2d";
      }
      if (!color) {
        color = "fff";
      }
      const text = name.charAt(0).toUpperCase();
      return `https://cdn.mapmarker.io/api/v1/font-awesome/v5/pin?text=${text}&size=40&background=${background}&color=${color}&hoffset=-1`;
    },
    updateZoom(event) {
      this.$emit("update:zoom", event);
    }
  }
};
</script>

<style scoped>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

#map {
  height: 800px;
  width: 100%;
}
.vue2leaflet-map {
  z-index: 0;
}
@keyframes bounce {
  0% {
    transform: scale(1, 1) translate(0px, 0px);
  }
  30% {
    transform: scale(1, 0.8) translate(0px, 10px);
  }
  75% {
    transform: scale(1, 1.1) translate(0px, -25px);
  }
  100% {
    transform: scale(1, 1) translate(0px, 0px);
  }
}
.bounce {
  animation: bounce 0.75s 5;
}
</style>
