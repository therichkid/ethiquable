<template>
  <div style="position: absolute; top: 0; right: 16px;">
    <v-menu v-if="!isHidden" v-model="isOpen" offset-y max-height="75%">
      <template v-slot:activator="scope">
        <v-text-field
          @click="scope.value = true"
          @keydown="scope.value = true"
          v-model="model"
          :loading="isLoading"
          placeholder="Nach Neuigkeiten & Produkten suchen"
          solo
          hide-details
          autofocus
          :light="!$vuetify.theme.dark"
          prepend-inner-icon="mdi-magnify"
          append-icon="mdi-close"
          @click:append="toggleSearchBar"
          style="width: 55vw; max-width: 600px;"
        ></v-text-field>
      </template>
      <v-list>
        <v-subheader>
          Neuigkeiten
          <v-spacer></v-spacer>
          <v-switch dense v-model="includePosts"></v-switch>
        </v-subheader>
        <v-list-item v-for="post in items.posts" :key="post.id" :to="`/magazin/${post.slug}`">
          <v-list-item-content>
            <v-list-item-title v-html="post.title.rendered"></v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>{{ formatDate(post, "post") }}</v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-divider></v-divider>
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
      </v-list>
    </v-menu>
    <v-btn icon text v-if="isHidden" @click.stop="toggleSearchBar()" aria-label="Suche öffnen">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: { posts: [], products: [] },
      isLoading: false,
      isHidden: true,
      isOpen: false,
      model: null,
      includePosts: true,
      includeProducts: true,
      timeout: null,
      isInit: false
    };
  },

  watch: {
    model(value) {
      this.search(value);
    },
    includePosts() {
      this.search(this.model);
    },
    includeProducts() {
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
      const perPage = this.includePosts && this.includeProducts ? 5 : 10;
      const fetchPosts = this.includePosts
        ? this.$store.dispatch("fetchPostsBySearchTerm", { search: value, perPage })
        : [];
      const fetchProducts = this.includeProducts
        ? this.$store.dispatch("fetchProductsBySearchTerm", { search: value, perPage })
        : [];
      const [posts, products] = await Promise.all([fetchPosts, fetchProducts])
        .catch(error => console.error(error))
        .finally(() => {
          this.isLoading = false;
        });
      // Re-open menu on mobile...
      // ...if there are search results now but none before
      const cond1 = (posts.length || products.length) && !this.items.posts.length && !this.items.products.length;
      // ...or if there were search results before but none now
      const cond2 = (this.items.posts.length || this.items.products.length) && !posts.length && !products.length;
      if (this.$vuetify.breakpoint.smAndDown && (cond1 || cond2)) {
        this.isOpen = false;
      }
      setTimeout(() => {
        this.isOpen = true;
      });
      this.items.posts = posts;
      this.items.products = products;
    },
    formatDate(item) {
      const date = item.date;
      return date.slice(8, 10) + "." + date.slice(5, 7) + "." + date.slice(2, 4);
    }
  }
};
</script>

<style></style>
