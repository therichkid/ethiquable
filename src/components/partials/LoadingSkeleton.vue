<template>
  <!-- Posts -->
  <v-row v-if="type === 'posts'">
    <v-col v-for="i in amount" :key="i" cols="12" sm="6">
      <v-skeleton-loader type="image, article, actions"></v-skeleton-loader>
    </v-col>
  </v-row>

  <!-- Products -->
  <v-row v-else-if="type === 'products'">
    <v-col v-for="i in amount" :key="i" cols="6" sm="3">
      <v-skeleton-loader type="card"></v-skeleton-loader>
    </v-col>
  </v-row>

  <!-- Post, page -->
  <v-row v-else>
    <v-col cols="12">
      <v-skeleton-loader type="article, image, list-item-three-line, actions"></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    type: String
  },

  computed: {
    amount() {
      if (this.$vuetify.breakpoint.xsOnly) {
        return 4;
      } else {
        return 8;
      }
    }
  }
};
</script>

<style></style>
