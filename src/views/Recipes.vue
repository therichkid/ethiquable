<template>
  <v-container>
    <h1 class="text-h4 mb-2">Rezepte</h1>

    <LoadingSkeleton type="recipes" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getRecipes()" />

    <v-row v-if="!isLoading && !loadingError" :dense="$vuetify.breakpoint.xsOnly">
      <!-- Filter -->
      <v-col cols="12" sm="8">
        <v-chip-group multiple mandatory active-class="active-chip" v-model="activeCategories">
          <v-chip
            v-for="category in categories"
            :key="category.name"
            :color="category.backgroundColor"
            text-color="white"
            style="opacity: 0.25"
            :style="{ textShadow: category.textShadow }"
          >
            {{ category.name }}
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="12" sm="4" style="display: inline-flex; justify-content: end; align-items: center">
        <v-label>Sortierung:</v-label>
        <v-btn-toggle mandatory dense class="ml-2" v-model="sort">
          <v-btn>Datum</v-btn>
          <v-btn>Name</v-btn>
        </v-btn-toggle>
      </v-col>

      <!-- Recipes -->
      <v-col cols="6" sm="4" lg="3" v-for="recipe in filteredRecipes" :key="recipe.id" class="d-flex">
        <v-card
          hover
          :to="`/rezepte/${recipe.slug}`"
          class="d-flex flex-column"
          :style="{
            'border-top': `8px solid ${(recipe.category && recipe.category.backgroundColor) || 'var(--v-primary-base)'}`
          }"
        >
          <v-img
            :src="recipe.featuredImage.source"
            :alt="recipe.featuredImage.title"
            max-height="200"
            style="border-radius: 0"
          >
          </v-img>
          <v-chip-group class="px-3" v-if="recipe.isNew || recipe.category">
            <v-chip color="#ffc107" text-color="white" small style="text-shadow: 1px 1px 2px black" v-if="recipe.isNew">
              <b>NEU</b>
            </v-chip>
            <v-chip
              :color="recipe.category.backgroundColor"
              text-color="white"
              small
              :style="{ textShadow: recipe.category.textShadow }"
              v-if="recipe.category"
            >
              {{ recipe.category.name }}
            </v-chip>
          </v-chip-group>
          <v-card-title class="pt-0">
            <h3 class="text-subtitle-2" style="word-wrap: break-word; hyphens: auto">
              {{ recipe.title }}
            </h3>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-icon>mdi-chevron-right</v-icon>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <NoContentYet type="search" v-if="!isLoading && !loadingError && !filteredRecipes.length" />
  </v-container>
</template>

<script>
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import NoContentYet from "@/components/partials/NoContentYet";
const LoadingError = () => import(/* webpackChunkName: "dialog" */ "@/components/partials/LoadingError");
import { COLORS } from "@/constants";

export default {
  components: {
    LoadingSkeleton,
    NoContentYet,
    LoadingError
  },

  data() {
    return {
      recipes: [],
      categories: [],
      activeCategories: [],
      allCategoriesSelected: false,
      sort: 0
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.recipesLoading;
    },
    loadingError() {
      return this.$store.state.recipesLoadingError;
    },
    filteredRecipes() {
      let filteredRecipes = [];
      if (this.activeCategories.length === this.categories.length) {
        filteredRecipes = [...this.recipes];
      } else if (!this.activeCategories.length) {
        filteredRecipes = [];
      } else {
        for (const recipe of this.recipes) {
          for (const i of this.activeCategories) {
            if (recipe.category && recipe.category.name === this.categories[i].name) {
              filteredRecipes.push(recipe);
            }
          }
        }
      }
      if (this.sort === 1) {
        // Sort by name
        filteredRecipes = filteredRecipes.sort((a, b) => a.title.localeCompare(b.title, "de", { sensitivity: "base" }));
      }
      return filteredRecipes;
    }
  },

  watch: {
    activeCategories(value) {
      if (value.length === this.categories.length) {
        this.allCategoriesSelected = true;
      } else if (value.length === this.categories.length - 1 && this.allCategoriesSelected) {
        // All categories were previously selected
        // User clicks on one category -> only set this category to active
        const numArr = [...Array(this.categories.length).keys()]; // [0, 1, 2, ...]
        this.activeCategories = numArr.filter(num => !this.activeCategories.includes(num));
        this.allCategoriesSelected = false;
      } else {
        this.allCategoriesSelected = false;
      }
    }
  },

  methods: {
    async getRecipes() {
      const recipesFetched = this.$store.getters.getFetchedRecipes();
      if (recipesFetched[0]) {
        // Already fetched
        this.recipes = recipesFetched[1];
      } else {
        // Not fetched yet
        this.recipes =
          (await this.$store.dispatch("fetchRecipes").catch(error => {
            console.error(error);
          })) || [];
      }
    },

    createCategories() {
      const categories = [];
      const colors = [...COLORS].reverse();
      for (const recipe of this.recipes) {
        if (!recipe.categories || !recipe.categories.length) {
          continue;
        }
        const category = recipe.categories[0];
        const filtered = categories.filter(item => item.name === category.name);
        const existingProps = filtered && filtered.length && filtered[0];
        if (!existingProps) {
          const color = colors[categories.length];
          const newProps = {
            name: category.name,
            backgroundColor: color || "var(--v-primary-base)",
            textShadow: color && this.shared.isLightColor(color) ? "1px 1px 2px #000" : "none"
          };
          recipe.category = newProps;
          categories.push(newProps);
          this.activeCategories.push(categories.length - 1);
        } else {
          recipe.category = existingProps;
        }
      }
      this.categories = categories.sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }));
    }
  },

  async created() {
    await this.getRecipes();
    this.createCategories();
  }
};
</script>

<style scoped>
.active-chip {
  opacity: 1 !important;
}
</style>
