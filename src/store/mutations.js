export default {
  changePostsLoading(state, value) {
    state.postsLoading = value;
  },
  changePostsLoadingError(state, value) {
    state.postsLoadingError = value;
  },
  storePosts(state, { posts, page }) {
    state.posts[page] = posts;
  },
  incrementFailedRequests(state, num) {
    if (!num) {
      state.failedRequests = 0;
    } else {
      state.failedRequests += 1;
    }
  },
  setPostHeaders(state, headers) {
    state.totalPosts = parseInt(headers["x-wp-total"], 10);
    state.totalPostPages = parseInt(headers["x-wp-totalpages"], 10);
  },
  changePageLoading(state, value) {
    state.pageLoading = value;
  },
  changePageLoadingError(state, value) {
    state.pageLoadingError = value;
  },
  storePage(state, { page, slug }) {
    state.pages[slug] = page;
  },
  changeProductsLoading(state, value) {
    state.productsLoading = value;
  },
  changeProductsLoadingError(state, value) {
    state.productsLoadingError = value;
  },
  storeProductsPerCategory(state, { products, category }) {
    if (!state.productsPerCategory[category]) {
      state.productsPerCategory[category] = {};
    }
    state.productsPerCategory[category] = products;
  },
  storeProductsById(state, products) {
    for (const product of products) {
      if (!state.productsById[product.id]) {
        state.productsById[product.id] = product;
      }
    }
  },
  changeShopsLoading(state, value) {
    state.shopsLoading = value;
  },
  changeShopsLoadingError(state, value) {
    state.shopsLoadingError = value;
  },
  storeShops(state, shops) {
    state.shops = shops;
  },
  changeProducersLoading(state, value) {
    state.producersLoading = value;
  },
  changeProducersLoadingError(state, value) {
    state.producersLoadingError = value;
  },
  storeProducers(state, producers) {
    state.producers = producers;
  },
  storeProducersById(state, producers) {
    for (const producer of producers) {
      if (!state.producersById[producer.id]) {
        state.producersById[producer.id] = producer;
      }
    }
  },
  changeProducersFilter(state, { key, value }) {
    state.producersFilter[key] = value;
  },
  changeSlidesLoading(state, value) {
    state.slidesLoading = value;
  },
  changeSlidesLoadingError(state, value) {
    state.slidesLoadingError = value;
  },
  storeSlides(state, slides) {
    state.slides = slides;
  },
  changeRecipesLoading(state, value) {
    state.recipesLoading = value;
  },
  changeRecipesLoadingError(state, value) {
    state.recipesLoadingError = value;
  },
  storeRecipes(state, recipes) {
    state.recipes = recipes;
  },
  storeRecipeById(state, recipe) {
    if (!state.recipesById[recipe.id]) {
      state.recipesById[recipe.id] = recipe;
    }
  },
  changeRecipesFilter(state, { key, value }) {
    state.recipesFilter[key] = value;
  }
};
