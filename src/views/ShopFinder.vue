<template>
  <v-container>
    <h1 class="display-1 mb-2">Shop-Finder</h1>
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getShops()" />
    <Map v-if="!loadingError" :groups="shops || []" type="shopfinder" />
  </v-container>
</template>

<script>
import Map from "@/components/maps/Map";
const LoadingError = () =>
  import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    Map,
    LoadingError
  },

  data() {
    return {
      shops: []
    };
  },

  computed: {
    loadingError() {
      return this.$store.state.groupsLoadingError;
    }
  },

  methods: {
    async getShops() {
      const shopsFetched = this.$store.getters.getFetchedGroups();
      if (shopsFetched[0]) {
        // Already fetched
        this.shops = shopsFetched[1];
      } else {
        // Not fetched yet
        this.shops = await this.$store.dispatch("fetchGroups").catch(error => {
          console.error(error);
        });
      }
    }
  },

  created() {
    this.getShops();
  }
};
</script>

<style></style>
