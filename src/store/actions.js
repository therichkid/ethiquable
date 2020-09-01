import api from "../services/api";
import formatter from "../services/formatter";

export default {
  fetchPosts(context, page) {
    context.commit("changePostsLoading", true);
    context.commit("changePostsLoadingError", false);
    const path = "wp/v2/posts";
    const params = {
      _embed: true,
      page,
      per_page: 6
    };
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data, headers } = response;
            const posts = formatter.formatPosts(data);
            context.commit("storePosts", { posts, page });
            context.commit("setPostHeaders", headers);
            context.commit("incrementFailedRequests", 0);
            resolve(posts);
          },
          error => {
            context.commit("changePostsLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changePostsLoading", false);
        });
    });
  },
  fetchPostBySlug(context, slug) {
    context.commit("changePostsLoading", true);
    context.commit("changePostsLoadingError", false);
    const path = "wp/v2/posts";
    const params = {
      _embed: true,
      slug
    };
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data } = response;
            const posts = formatter.formatPosts(data);
            context.commit("incrementFailedRequests", 0);
            resolve(posts[0]);
          },
          error => {
            context.commit("changePostsLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changePostsLoading", false);
        });
    });
  },
  fetchPostsBySearchTerm(context, { search, perPage }) {
    const path = "wp/v2/posts";
    const params = {
      search,
      per_page: perPage
    };
    return new Promise((resolve, reject) => {
      api.fetchData(path, params).then(
        response => {
          const { data } = response;
          resolve(data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  fetchPageBySlug(context, slug) {
    context.commit("changePageLoading", true);
    context.commit("changePageLoadingError", false);
    const path = "wp/v2/pages";
    const params = {
      _embed: true,
      slug
    };
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data } = response;
            const page = formatter.formatPage(data);
            context.commit("storePage", { page, slug });
            context.commit("incrementFailedRequests", 0);
            resolve(page);
          },
          error => {
            context.commit("changePageLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changePageLoading", false);
        });
    });
  },
  fetchProducts(context, category) {
    context.commit("changeProductsLoading", true);
    context.commit("changeProductsLoadingError", false);
    const path = "wp/v2/products";
    const params = {
      _embed: true,
      per_page: 100,
      "filter[category_name]": category
    };
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            const { data } = response;
            const products = formatter.formatProducts(data);
            context.commit("storeProductsPerCategory", {
              products,
              category
            });
            context.commit("incrementFailedRequests", 0);
            resolve(products);
          },
          error => {
            context.commit("changeProductsLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changeProductsLoading", false);
        });
    });
  },
  fetchProductBySlug(context, slug) {
    context.commit("changeProductsLoading", true);
    context.commit("changeProductsLoadingError", false);
    const path = "wp/v2/products";
    const params = {
      _embed: true,
      slug
    };
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data } = response;
            const products = formatter.formatProducts(data);
            context.commit("incrementFailedRequests", 0);
            resolve(products[0]);
          },
          error => {
            context.commit("changeProductsLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changeProductsLoading", false);
        });
    });
  },
  fetchProductsBySearchTerm(context, { search, perPage }) {
    const path = "wp/v2/products";
    const params = {
      search,
      per_page: perPage
    };
    return new Promise((resolve, reject) => {
      api.fetchData(path, params).then(
        response => {
          const { data } = response;
          resolve(data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  async fetchShops(context) {
    context.commit("changeShopsLoading", true);
    context.commit("changeShopsLoadingError", false);
    const path = "wp/v2/shops";
    let page = 1;
    const params = {
      _embed: true,
      per_page: 100,
      page
    };
    try {
      const response = await api.fetchData(path, params);
      const { data, headers } = response;
      let shops = formatter.formatShops(data);
      const totalPages = headers["x-wp-totalpages"];
      while (page < totalPages) {
        page++;
        params.page = page;
        const response = await api.fetchData(path, params);
        const { data } = response;
        shops = [...shops, ...formatter.formatShops(data)];
      }
      context.commit("storeShops", shops);
      context.commit("incrementFailedRequests", 0);
      return shops;
    } catch (error) {
      context.commit("changeShopsLoadingError", true);
      context.commit("incrementFailedRequests", 1);
      throw error;
    } finally {
      context.commit("changeShopsLoading", false);
    }
  },
  fetchProducers(context) {
    context.commit("changeProducersLoading", true);
    context.commit("changeProducersLoadingError", false);
    const path = "wp/v2/producers";
    const params = {
      _embed: true,
      per_page: 100
    };
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data } = response;
            const producers = formatter.formatShops(data);
            context.commit("storeProducers", producers);
            context.commit("incrementFailedRequests", 0);
            resolve(producers);
          },
          error => {
            context.commit("changeProducersLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changeProducersLoading", false);
        });
    });
  }
};
