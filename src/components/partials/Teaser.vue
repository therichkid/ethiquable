<template>
  <div v-if="teaser" class="text-center">
    <h2 class="my-5" :class="teaser.length < 100 ? 'text-h4' : 'text-h5'" style="color: var(--v-secondary-base)">
      <span class="pr-2">&#171;</span>{{ teaser }}<span class="pl-2">&#187;</span>
    </h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teaser: null,
      defaultTeaser: "Herzlich Willkommen bei ETHIQUABLE Deutschland eG!"
    };
  },

  methods: {
    async getTeaser() {
      const page = await this.$store.dispatch("fetchPageBySlug", "teaser").catch(error => {
        console.error(error);
      });
      this.teaser = (page && page.teaser) || this.defaultTeaser;
    }
  },

  created() {
    this.getTeaser();
  }
};
</script>

<style></style>
