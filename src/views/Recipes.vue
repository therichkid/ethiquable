<template>
  <v-container>
    <h1 class="text-h4 mb-2">Rezepte</h1>

    <LoadingSkeleton type="recipes" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getRecipes()" />

    <v-row v-if="!isLoading && !loadingError" :dense="$vuetify.breakpoint.xsOnly">
      <!-- Filter -->
      <v-col cols="12" v-if="categories.length">
        <v-chip-group mandatory show-arrows v-model="activeCategory">
          <v-chip color="primary" :outlined="activeCategory !== 0" :text-color="activeCategory === 0 ? 'white' : null">
            <b>Alle</b>
          </v-chip>
          <v-chip
            v-for="(category, i) in categories"
            :key="i"
            :color="category.backgroundColor"
            :outlined="activeCategory !== i + 1"
            :text-color="activeCategory === i + 1 ? 'white' : null"
            :style="{ textShadow: activeCategory === i + 1 ? category.textShadow : null }"
          >
            <b>{{ category.name }}</b>
          </v-chip>
        </v-chip-group>
      </v-col>

      <!-- Recipes -->
      <v-col cols="6" sm="4" lg="3" v-for="recipe in filteredRecipes" :key="recipe.id" class="d-flex">
        <v-card
          hover
          :to="`/rezepte/${recipe.slug}`"
          class="d-flex flex-column"
          :style="{
            'border-top': `6px solid ${(recipe.category && recipe.category.backgroundColor) || 'var(--v-primary-base)'}`
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
import LoadingError from "@/components/partials/LoadingError";
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
      activeCategory: null
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
      if (this.activeCategory === 0) {
        filteredRecipes = [...this.recipes];
      } else {
        for (const recipe of this.recipes) {
          if (
            recipe.category &&
            this.categories[this.activeCategory - 1] &&
            recipe.category.name === this.categories[this.activeCategory - 1].name
          ) {
            filteredRecipes.push(recipe);
          }
        }
      }
      return filteredRecipes;
    }
  },

  watch: {
    activeCategory(value) {
      this.$store.commit("changeRecipesFilter", { key: "activeCategory", value });
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
  },

  mounted() {
    this.activeCategory = this.$store.state.recipesFilter.activeCategory;
  }
};
</script>

<style></style>
