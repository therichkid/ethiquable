<template>
  <l-popup>
    <h3 class="text-h5 mb-2">{{ marker.name }}</h3>
    <!-- Address -->
    <div class="align-center mb-2">
      <v-icon class="icon">mdi-map-marker</v-icon>
      <span style="color: rgba(0, 0, 0, 0.6)" class="body-2 text">{{ marker.address }}</span>
    </div>
  </l-popup>
</template>

<script>
import { LPopup } from "vue2-leaflet";

export default {
  components: {
    LPopup
  },

  props: {
    marker: Object
  }
};
</script>

<style scoped>
.icon {
  float: left;
}
.text {
  display: block;
  padding-left: 30px;
}
</style>
