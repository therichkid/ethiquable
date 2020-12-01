<template>
  <v-container>
    <h1 class="text-h4 mb-2">Rezepte</h1>

    <LoadingSkeleton type="recipes" v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getRecipes()" />

    <v-row v-if="recipePage">
      <v-col cols="12" v-html="recipePage.content"></v-col>
    </v-row>

    <v-row v-if="!isLoading && !loadingError" :dense="$vuetify.breakpoint.xsOnly">
      <!-- Filter -->
      <v-col cols="12" v-if="categories.length">
        <v-chip-group mandatory column v-model="activeCategory">
          <v-chip color="primary" :outlined="activeCategory !== 0" :text-color="activeCategory === 0 ? 'white' : null">
            <b>Alle</b>
          </v-chip>
          <v-chip
            color="secondary"
            :outlined="activeCategory !== 1"
            :text-color="activeCategory === 1 ? 'white' : null"
          >
            <b>Vegan</b>
          </v-chip>
          <v-chip
            v-for="(category, i) in categories"
            :key="i"
            :color="category.backgroundColor"
            :outlined="activeCategory !== i + 2"
            :text-color="activeCategory === i + 2 ? 'white' : null"
            :style="{ textShadow: activeCategory === i + 2 ? category.textShadow : null }"
          >
            <b>{{ category.name }}</b>
          </v-chip>
        </v-chip-group>
      </v-col>

      <!-- Recipes -->
      <v-col cols="12" sm="6" md="4" lg="3" v-for="recipe in filteredRecipes" :key="recipe.id" class="d-flex">
        <v-card
          hover
          :to="`/rezepte/${recipe.slug}`"
          class="d-flex flex-column"
          style="width: 100%"
          :style="{
            'border-top': `6px solid ${(recipe.category && recipe.category.backgroundColor) || 'var(--v-primary-base)'}`
          }"
        >
          <v-img
            :src="recipe.featuredImage.source"
            :alt="recipe.featuredImage.title"
            height="225"
            style="border-radius: 0"
          >
            <v-chip-group class="mt-1 ml-3" v-if="recipe.isNew">
              <v-chip color="#ffc107" text-color="white" small style="text-shadow: 1px 1px 2px black">
                <b>NEU</b>
              </v-chip>
            </v-chip-group>
          </v-img>
          <v-chip-group class="px-3" v-if="recipe.category && activeCategory === 0">
            <v-chip :color="recipe.category.backgroundColor" outlined small>
              <b>{{ recipe.category.name }}</b>
            </v-chip>
          </v-chip-group>
          <v-card-title class="pt-0">
            <h3 class="text-subtitle-1 text-sm-h6" style="word-wrap: break-word; hyphens: auto">
              {{ recipe.title }}
            </h3>
          </v-card-title>
          <v-card-text class="pb-2">
            <RecipeProps :recipe="recipe" />
          </v-card-text>
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
import RecipeProps from "@/components/partials/RecipeProps";
import { COLORS } from "@/constants";

export default {
  components: {
    LoadingSkeleton,
    NoContentYet,
    LoadingError,
    RecipeProps
  },

  data() {
    return {
      recipes: [],
      recipePage: null,
      categories: [{ name: "Vorspeise" }, { name: "Hauptgericht" }, { name: "Dessert" }, { name: "Getränk" }],
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
      } else if (this.activeCategory === 1) {
        for (const recipe of this.recipes) {
          if (recipe.recipeType && recipe.recipeType.toLowerCase() === "vegan") {
            filteredRecipes.push(recipe);
          }
        }
      } else {
        for (const recipe of this.recipes) {
          if (
            recipe.category &&
            this.categories[this.activeCategory - 2] &&
            recipe.category.name === this.categories[this.activeCategory - 2].name
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
    async getRecipePage() {
      const slug = "rezepte";
      if (this.$store.state.nonExistingRecipePage) {
        return;
      }
      const pageFetched = this.$store.getters.getFetchedPageBySlug(slug);
      if (pageFetched[0]) {
        // Already fetched
        this.recipePage = pageFetched[1];
      } else {
        // Not fetched yet
        this.recipePage = await this.$store.dispatch("fetchPageBySlug", slug).catch(error => {
          console.error(error);
        });
      }
      if (!this.recipePage) {
        // Add to store to not try to fetch this page again in this session
        this.$store.state.nonExistingRecipePage = true;
      }
    },
    createCategories() {
      const colors = [...COLORS].reverse();
      // Add colors to the default categories
      this.categories.forEach((category, i) => {
        category.backgroundColor = colors[i] || "var(--v-primary-base)";
        category.textShadow = colors[i] && this.shared.isLightColor(colors[i]) ? "1px 1px 2px #000" : "none";
      });
      const newCategories = [];
      for (const recipe of this.recipes) {
        if (!recipe.categories || !recipe.categories.length) {
          continue;
        }
        const category = recipe.categories[0];
        const filtered = [...this.categories, ...newCategories].filter(item => item.name === category.name);
        const existingProps = filtered && filtered.length && filtered[0];
        if (!existingProps) {
          const color = colors[this.categories.length + newCategories.length];
          const newProps = {
            name: category.name,
            backgroundColor: color || "var(--v-primary-base)",
            textShadow: color && this.shared.isLightColor(color) ? "1px 1px 2px #000" : "none"
          };
          recipe.category = newProps;
          newCategories.push(newProps);
        } else {
          recipe.category = existingProps;
        }
      }
      this.categories = [
        ...this.categories,
        ...newCategories.sort((a, b) => a.name.localeCompare(b.name, "de", { sensitivity: "base" }))
      ];
    }
  },

  async created() {
    await this.getRecipes();
    this.getRecipePage();
    this.createCategories();
  },

  mounted() {
    this.activeCategory = this.$store.state.recipesFilter.activeCategory;
  }
};
</script>

<style></style>
