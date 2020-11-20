<template>
  <v-container class="post-container">
    <LoadingSkeleton v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getRecipe(slug)" />

    <v-row v-if="!isLoading && !loadingError && Object.keys(recipe).length" align="center">
      <!-- Title -->
      <v-col cols="12">
        <h1 class="text-h4">{{ recipe.title }}</h1>
      </v-col>

      <!-- Image -->
      <v-col cols="12">
        <v-img :src="recipe.featuredImage.source" :alt="recipe.featuredImage.title" contain max-height="350px"></v-img>
      </v-col>

      <!-- Teaser -->
      <v-col cols="12">
        <div v-html="teaser" v-if="teaser"></div>
      </v-col>

      <!-- Ingredients -->
      <v-col cols="12" v-if="recipe.portions || recipe.ingredients">
        <h3 class="text-h5 mb-2">Zutaten</h3>
        <v-card class="mb-2">
          <v-card-text v-if="recipe.portions">
            <v-text-field
              type="number"
              label="Anzahl"
              hide-details
              suffix="Portionen"
              min="1"
              class="mx-auto"
              style="max-width: 300px"
              v-model="portions"
            ></v-text-field>
          </v-card-text>
          <v-simple-table style="width: 100%" v-if="recipe.ingredients">
            <template v-slot:default>
              <tbody>
                <tr v-for="ingredient in ingredients" :key="ingredient.name">
                  <td class="text-right">
                    {{ ingredient.quantity > 0 ? ingredient.quantity : "" }}
                    {{ ingredient.unit && ` ${ingredient.unit}` }}
                  </td>
                  <td>
                    <a
                      :href="ingredient['shop-link']"
                      target="_blank"
                      rel="noopener noreferrer"
                      v-if="ingredient['shop-link']"
                    >
                      {{ ingredient.name }}
                      <v-icon color="primary" small style="margin-top: -2px">mdi-open-in-new</v-icon>
                    </a>
                    <span v-else>{{ ingredient.name }}</span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>

      <!-- Effort -->
      <v-chip-group v-if="efforts.length" class="mx-2">
        <v-chip v-for="effort in efforts" :key="effort.name">
          <v-icon left color="primary">mdi-clock-outline</v-icon>
          {{ effort.name }}: {{ effort.time }} Min.
        </v-chip>
      </v-chip-group>

      <!-- Instructions -->
      <v-col cols="12" v-if="instructions">
        <h3 class="text-h5 mb-2">Zubereitung</h3>
        <div v-html="instructions"></div>
      </v-col>

      <!-- Social media -->
      <v-col cols="12">
        <SocialMedia :title="recipe.title" />
      </v-col>

      <!-- Actions -->
      <v-col cols="12">
        <v-btn @click="goBack()">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Zurück</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import SocialMedia from "@/components/partials/SocialMedia";
const LoadingError = () => import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    SocialMedia
  },

  props: {
    slug: String
  },

  data() {
    return {
      recipe: {},
      teaser: null,
      instructions: null,
      portions: 0,
      efforts: [],
      effortLabels: {
        preparation: "Vorbereitung",
        cooking: "Zubereitung",
        total: "Gesamt"
      }
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.recipesLoading;
    },
    loadingError() {
      return this.$store.state.recipesLoadingError;
    },
    failedRequests() {
      return this.$store.state.failedRequests;
    },
    ingredients() {
      const origPortions = this.recipe.portions;
      if (!this.portions || this.portions === origPortions) {
        return this.recipe.ingredients;
      }
      const calcIngredients = [];
      for (const ingredient of this.recipe.ingredients) {
        calcIngredients.push({
          ...ingredient,
          quantity: ingredient.quantity
            ? Math.round((this.portions / origPortions) * ingredient.quantity * 1000) / 1000
            : 0
        });
      }
      console.log("Ing", calcIngredients);
      return calcIngredients;
    }
  },

  watch: {
    recipe(recipe) {
      if (!recipe && !this.failedRequests) {
        this.$router.push("/404");
      }
    },
    $route() {
      this.getRecipe(this.slug);
    }
  },

  methods: {
    async getRecipe(slug) {
      let recipeFetched = [false, null];
      // Try first with id
      if (this.$route.query.id) {
        const id = parseInt(this.$route.query.id, 10);
        recipeFetched = this.$store.getters.getFetchedRecipeByParam({ param: "id", value: id });
        // Remove query from url
        window.history.replaceState({}, null, this.$route.path);
      }
      // Then try with slug
      if (!recipeFetched[0]) {
        recipeFetched = this.$store.getters.getFetchedRecipeByParam({ param: "slug", value: slug });
      }
      if (recipeFetched[0]) {
        // Already fetched
        this.recipe = recipeFetched[1];
      } else {
        // Not fetched yet
        this.recipe = await this.$store.dispatch("fetchRecipeBySlug", slug).catch(error => {
          console.error(error);
        });
      }
      if (this.recipe) {
        this.createTextBlocks();
        this.addEffort();
        this.portions = this.recipe.portions;
        document.title = this.recipe.title + " - " + document.title;
      }
    },
    createTextBlocks() {
      // Look for first occurence of <ol...> or <ul...>
      // Everthing before will be the teaser
      // Everything afterwards will be the instructions
      if (!this.recipe.content) {
        return;
      }
      const idx = this.recipe.content.search(/<ol|<ul/);
      if (idx > -1) {
        this.teaser = this.recipe.content.slice(0, idx);
        this.instructions = this.recipe.content.slice(idx);
      } else {
        this.teaser = null;
        this.instructions = this.recipe.content;
      }
    },
    addEffort() {
      this.efforts = [];
      Object.keys(this.recipe.effort).forEach(key => {
        const name = this.effortLabels[key] || key;
        const time = this.recipe.effort[key];
        if (time) {
          this.efforts.push({ name, time });
        }
      });
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getRecipe(this.slug);
  }
};
</script>

<style scoped>
* >>> h3,
* >>> h4,
* >>> h5,
* >>> h6 {
  color: var(--v-primary-base);
  text-transform: uppercase;
}
</style>