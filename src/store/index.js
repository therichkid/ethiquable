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
    slides: [],
    slidesLoading: false,
    slidesLoadingError: false,
    recipes: [],
    recipesById: {},
    recipesLoading: false,
    recipesLoadingError: false
  },

  getters,
  mutations,
  actions
});
