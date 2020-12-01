<template>
  <div class="d-flex flex-row" v-if="recipeProps.length">
    <v-tooltip bottom v-for="(prop, i) in recipeProps" :key="i">
      <template v-slot:activator="{ on }">
        <div class="d-flex flex-column align-center" style="width: 33%" v-on="on">
          <v-icon large :color="color || null">{{ prop.icon }}</v-icon>
          <span>{{ prop.value }}</span>
        </div>
      </template>
      <span>{{ prop.label }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    recipe: Object,
    color: String
  },

  data() {
    return {
      recipeProps: []
    };
  },

  methods: {
    addProps() {
      const props = [];
      if (this.recipe.effort && this.recipe.effort.total) {
        props.push({ label: "Zeitaufwand", value: `${this.recipe.effort.total} Min.`, icon: "mdi-clock-outline" });
      }
      if (this.recipe.difficulty) {
        props.push({ label: "Schwierigkeit", value: this.recipe.difficulty, icon: "mdi-chef-hat" });
      }
      if (this.recipe.recipeType) {
        let icon;
        if (this.recipe.recipeType.toLowerCase() === "vegan") {
          icon = "mdi-leaf";
        } else if (this.recipe.recipeType.toLowerCase() === "vegetarisch") {
          icon = "mdi-carrot";
        }
        props.push({ label: "Rezeptart", value: this.recipe.recipeType, icon });
      }
      this.recipeProps = props;
    }
  },

  mounted() {
    this.addProps();
  }
};
</script>

<style></style>
