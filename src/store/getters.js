export default {
  getFetchedPosts: state => page => {
    const posts = state.posts[page];
    return posts && posts.length ? [true, posts] : [false, null];
  },
  getFetchedPostBySlug: state => slug => {
    for (const page in state.posts) {
      for (const post of state.posts[page]) {
        if (post.slug === slug) {
          return [true, post];
        }
      }
    }
    return [false, null];
  },
  getFetchedPageBySlug: state => slug => {
    const page = state.pages[slug];
    if (page) {
      return [true, page];
    }
    return [false, null];
  },
  getFetchedProductsPerCategory: state => category => {
    const products = state.productsPerCategory[category];
    return products && products.length ? [true, products] : [false, null];
  },
  getFetchedProductBySlug: state => slug => {
    for (const products of Object.values(state.productsPerCategory)) {
      for (const product of products) {
        if (product.slug === slug) {
          return [true, product];
        }
      }
    }
    return [false, null];
  },
  getFetchedShops: state => () => {
    const shops = state.shops;
    return shops && shops.length ? [true, shops] : [false, null];
  },
  getFetchedProducers: state => () => {
    const producers = state.producers;
    return producers && producers.length ? [true, producers] : [false, null];
  },
  getFetchedProducerByParam: state => (param, value) => {
    for (const producer of state.producers) {
      if (producer[param] === value) {
        return [true, producer];
      }
    }
    return [false, null];
  },
  getFetchedSlides: state => () => {
    const slides = state.slides;
    return slides && slides.length ? [true, slides] : [false, null];
  }
};
