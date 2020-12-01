<template>
  <div style="position: absolute; top: 12px; right: 16px">
    <v-menu v-if="!isHidden" v-model="isOpen" offset-y max-height="75%">
      <template v-slot:activator="scope">
        <v-text-field
          @click="scope.value = true"
          @keydown="scope.value = true"
          v-model="model"
          :loading="isLoading"
          placeholder="Nach Produkten & Rezepten suchen"
          solo
          hide-details
          autofocus
          light
          prepend-inner-icon="mdi-magnify"
          append-icon="mdi-close"
          @click:append="toggleSearchBar"
          style="width: 55vw; max-width: 600px"
        ></v-text-field>
      </template>
      <v-list>
        <v-subheader>
          Produkte
          <v-spacer></v-spacer>
          <v-switch dense v-model="includeProducts"></v-switch>
        </v-subheader>
        <v-list-item v-for="product in items.products" :key="product.id" :to="`/produkte/${product.slug}`">
          <v-list-item-content>
            <v-list-item-title v-html="product.title.rendered"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-subheader>
          Rezepte
          <v-spacer></v-spacer>
          <v-switch dense v-model="includeRecipes"></v-switch>
        </v-subheader>
        <v-list-item v-for="recipe in items.recipes" :key="recipe.id" :to="`/rezepte/${recipe.slug}`">
          <v-list-item-content>
            <v-list-item-title v-html="recipe.title.rendered"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>
    </v-menu>
    <v-btn
      icon
      text
      v-else
      @click.stop="toggleSearchBar()"
      :style="{ textShadow: $vuetify.breakpoint.mdAndDown ? '1px 1px 2px black' : 'none' }"
      aria-label="Suche öffnen"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: { recipes: [], products: [] },
      isLoading: false,
      isHidden: true,
      isOpen: false,
      model: null,
      includeProducts: true,
      includeRecipes: true,
      timeout: null,
      isInit: false
    };
  },

  watch: {
    model(value) {
      this.search(value);
    },
    includeProducts() {
      this.search(this.model);
    },
    includeRecipes() {
      this.search(this.model);
    }
  },

  methods: {
    toggleSearchBar() {
      this.isHidden = !this.isHidden;
      if (this.isHidden) {
        this.model = null;
      } else {
        // Already present search results on first open
        if (!this.isInit) {
          this.search();
          this.isInit = true;
        }
      }
    },
    async search(value) {
      if (this.isLoading) {
        // Delay request with simple debounce
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.search(value);
        }, 150);
        return;
      }
      this.isLoading = true;
      const perPage = this.includeProducts && this.includeRecipes ? 5 : 10;
      const fetchProducts = this.includeProducts
        ? this.$store.dispatch("fetchProductsBySearchTerm", { search: value, perPage })
        : [];
      const fetchRecipes = this.includeRecipes
        ? this.$store.dispatch("fetchRecipesBySearchTerm", { search: value, perPage })
        : [];
      const [products, recipes] = await Promise.all([fetchProducts, fetchRecipes])
        .catch(error => console.error(error))
        .finally(() => {
          this.isLoading = false;
        });
      // Re-open menu on mobile...
      // ...if there are search results now but none before
      const cond1 = (products.length || recipes.length) && !this.items.products.length && !this.items.recipes.length;
      // ...or if there were search results before but none now
      const cond2 = (this.items.products.length || this.items.recipes.length) && !products.length && !recipes.length;
      if (this.$vuetify.breakpoint.smAndDown && (cond1 || cond2)) {
        this.isOpen = false;
      }
      setTimeout(() => {
        this.isOpen = true;
      });
      this.items.products = products;
      this.items.recipes = recipes;
    }
  }
};
</script>

<style></style>
