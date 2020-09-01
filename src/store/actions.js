import api from "../services/api";
import formatter from "../services/formatter";

export default {
  fetchPosts(context, { page, groupName }) {
    context.commit("changePostsLoading", true);
    context.commit("changePostsLoadingError", false);
    const path = "wp/v2/posts";
    const params = {
      _embed: true,
      page,
      per_page: 6
    };
    if (groupName) {
      Object.assign(params, {
        "filter[category_name]": groupName
      });
    }
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data, headers } = response;
            const posts = formatter.formatPosts(data);
            if (groupName) {
              context.commit("storePostsPerGroup", {
                posts,
                page,
                groupName
              });
              context.commit("setPostHeadersPerGroup", {
                headers,
                groupName
              });
            } else {
              context.commit("storePosts", { posts, page });
              context.commit("setPostHeaders", headers);
            }
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
          let { data } = response;
          const posts = data;
          resolve(posts);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  fetchEvents(context, { startDate, endDate, onlyMainEvents, groupName }) {
    context.commit("changeEventsLoading", { value: true, onlyMainEvents });
    context.commit("changeEventsLoadingError", {
      value: false,
      onlyMainEvents
    });
    let year, month;
    const path = "wp/v2/events";
    const params = {
      _embed: true,
      per_page: 100
      // "filter[meta_query][relation]": "OR"
    };
    if (startDate) {
      Object.assign(params, {
        "filter[meta_query][0][key]": "event_datum",
        "filter[meta_query][0][value]": startDate,
        "filter[meta_query][0][compare]": ">="
      });
      year = parseInt(startDate.slice(0, 4), 10);
      month = parseInt(startDate.slice(4, 6), 10);
    }
    if (endDate) {
      Object.assign(params, {
        "filter[meta_query][1][key]": "event_datum",
        "filter[meta_query][1][value]": endDate,
        "filter[meta_query][1][compare]": "<"
      });
    }
    if (onlyMainEvents) {
      Object.assign(params, {
        "filter[meta_query][2][key]": "hauptevent",
        "filter[meta_query][2][value]": 1
      });
    }
    if (groupName) {
      Object.assign(params, {
        "filter[category_name]": groupName
      });
    }
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            let { data } = response;
            const events = formatter.formatEvents(data);
            if (year && month && !onlyMainEvents && !groupName) {
              context.commit("storeEvents", { events, year, month });
            } else if (onlyMainEvents) {
              context.commit("storeMainEvents", events);
            } else if (groupName) {
              context.commit("storeEventsPerGroup", { events, groupName });
            }
            context.commit("incrementFailedRequests", 0);
            resolve(events);
          },
          error => {
            context.commit("changeEventsLoadingError", {
              value: true,
              onlyMainEvents
            });
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changeEventsLoading", {
            value: false,
            onlyMainEvents
          });
        });
    });
  },
  fetchEventBySlug(context, slug) {
    context.commit("changeEventsLoading", true);
    context.commit("changeEventsLoadingError", false);
    const path = "wp/v2/events";
    const params = {
      _embed: true,
      slug
    };
    return new Promise((resolve, reject) => {
      api
        .fetchData(path, params)
        .then(
          response => {
            const { data } = response;
            const events = formatter.formatEvents(data);
            context.commit("incrementFailedRequests", 0);
            resolve(events[0]);
          },
          error => {
            context.commit("changeEventsLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changeEventsLoading", false);
        });
    });
  },
  fetchEventsBySearchTerm(context, { search, perPage }) {
    const path = "wp/v2/events";
    const params = {
      search,
      per_page: perPage
    };
    return new Promise((resolve, reject) => {
      api.fetchData(path, params).then(
        response => {
          let { data } = response;
          const posts = data;
          resolve(posts);
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
  fetchFacilities(context) {
    context.commit("changeFacilitiesLoading", true);
    context.commit("changeFacilitiesLoadingError", false);
    const path = "wp/v2/einrichtungen";
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
            const facilities = formatter.formatShops(data);
            context.commit("storeFacilities", facilities);
            context.commit("incrementFailedRequests", 0);
            resolve(facilities);
          },
          error => {
            context.commit("changeFacilitiesLoadingError", true);
            context.commit("incrementFailedRequests", 1);
            reject(error);
          }
        )
        .finally(() => {
          context.commit("changeFacilitiesLoading", false);
        });
    });
  }
};
