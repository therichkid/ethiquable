export default {
  changeFontSize(state, action) {
    if (action && state.fontSize) {
      state.fontSize += action;
    } else {
      state.fontSize = 16;
    }
  },
  changePostsLoading(state, value) {
    state.postsLoading = value;
  },
  changePostsLoadingError(state, value) {
    state.postsLoadingError = value;
  },
  storePosts(state, { posts, page }) {
    state.posts[page] = posts;
  },
  storePostsPerGroup(state, { posts, page, groupName }) {
    if (!state.postsPerGroup[groupName]) {
      state.postsPerGroup[groupName] = {};
    }
    state.postsPerGroup[groupName][page] = posts;
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
  setPostHeadersPerGroup(state, { headers, groupName }) {
    state.totalPostPagesPerGroup[groupName] = parseInt(headers["x-wp-totalpages"], 10);
  },
  changeEventsLoading(state, { value, onlyMainEvents }) {
    if (onlyMainEvents) {
      state.mainEventsLoading = value;
    } else {
      state.eventsLoading = value;
    }
  },
  changeEventsLoadingError(state, { value, onlyMainEvents }) {
    if (onlyMainEvents) {
      state.mainEventsLoadingError = value;
    } else {
      state.eventsLoadingError = value;
    }
  },
  storeEvents(state, { events, year, month }) {
    if (!state.events[year]) {
      state.events[year] = {};
    }
    state.events[year][month] = [...events];
  },
  storeMainEvents(state, events) {
    state.mainEvents = [...events];
  },
  storeEventsPerGroup(state, { events, groupName }) {
    if (!state.eventsPerGroup[groupName]) {
      state.eventsPerGroup[groupName] = {};
    }
    state.eventsPerGroup[groupName] = events;
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
  changeShopsLoading(state, value) {
    state.shopsLoading = value;
  },
  changeShopsLoadingError(state, value) {
    state.shopsLoadingError = value;
  },
  storeShops(state, shops) {
    state.shops = shops;
  },
  changeFacilitiesLoading(state, value) {
    state.facilitiesLoading = value;
  },
  changeFacilitiesLoadingError(state, value) {
    state.facilitiesLoadingError = value;
  },
  storeFacilities(state, facilities) {
    state.facilities = facilities;
  },
  changeCalendarType(state, view) {
    state.calendarView = view;
  },
  changeCalendarFocus(state, focus) {
    state.calendarFocus = focus;
  },
  changeRegion(state, region) {
    state.region = region;
  }
};
