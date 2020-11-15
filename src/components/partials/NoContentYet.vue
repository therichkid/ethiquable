<template>
  <div>
    <v-img src="@/assets/sleeping_cat.svg" contain height="100px" class="my-5" alt="Schlafende Katze"></v-img>
    <v-row justify="center">
      <span class="grey--text" v-if="type === 'search'">Keine Ergebnisse für diese Suche.</span>
      <span class="grey--text" v-else>Hier ist es noch leer.</span>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    type: String
  }
};
</script>

<style></style>
