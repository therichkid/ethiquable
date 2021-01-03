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
      <v-col cols="12" class="image-wrapper">
        <div class="mx-auto pa-3 elevation-2" style="width: max-content; max-width: 100%">
          <v-img
            :src="recipe.featuredImage.source"
            :alt="recipe.featuredImage.title"
            contain
            max-width="500px"
            height="auto"
          ></v-img>
        </div>
      </v-col>

      <v-col cols="12">
        <RecipeProps :recipe="recipe" color="primary" />
      </v-col>

      <!-- Teaser -->
      <v-col cols="12" v-if="teaser">
        <div v-html="teaser" style="font-weight: 700"></div>
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
                    <span v-html="ingredient.quantity"></span>
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
      <v-chip-group v-if="efforts.length" column class="mx-2">
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
import frac from "frac";
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import SocialMedia from "@/components/partials/SocialMedia";
import LoadingError from "@/components/partials/LoadingError";
import RecipeProps from "@/components/partials/RecipeProps";

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    SocialMedia,
    RecipeProps
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
      const ingredients = [];
      for (const ingredient of this.recipe.ingredients) {
        ingredients.push({
          ...ingredient,
          quantity: ingredient.quantity ? this.calcQuantity(ingredient.quantity) : ""
        });
      }
      return ingredients;
    }
  },

  watch: {
    recipe(recipe) {
      if (!recipe && !this.failedRequests) {
        this.$router.replace("/404");
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
        this.teaser = this.shared.stripHtml(this.recipe.content.slice(0, idx));
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
    calcQuantity(quantity) {
      const portionsFrac = this.portions && this.recipe.portions ? this.portions / this.recipe.portions : 1;
      const [quot, num, den] = frac(portionsFrac * quantity, 9, true);
      let str = "";
      if (quot) {
        str += quot;
      }
      if (num && den) {
        str += ` <sup>${num}</sup>&frasl;<sub>${den}</sub>`;
      }
      return str;
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
@media print {
  .image-wrapper {
    display: none;
  }
}
</style>
