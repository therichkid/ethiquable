import Vuex from "vuex";
import Vue from "vue";

import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: {},
    postsLoading: false,
    postsLoadingError: false,
    failedRequests: 0,
    totalPosts: 0,
    totalPostPages: 0,
    pages: {},
    pageLoading: false,
    pageLoadingError: false,
    productsPerCategory: {},
    productsById: {},
    nonExistingCategoryPages: [],
    productsLoading: false,
    productsLoadingError: false,
    shops: [],
    shopsLoading: false,
    shopsLoadingError: false,
    producers: [],
    producersById: {},
    producersLoading: false,
    producersLoadingError: false,
    producersFilter: {
      country: "",
      ingredient: "",
      infoDismissed: false
    },
    slides: [],
    slidesLoading: false,
    slidesLoadingError: false,
    recipes: [],
    recipesById: {},
    nonExistingRecipePage: false,
    recipesLoading: false,
    recipesLoadingError: false,
    recipesFilter: {
      activeCategory: 0
    }
  },

  getters,
  mutations,
  actions
});
