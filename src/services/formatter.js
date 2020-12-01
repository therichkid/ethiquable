export default {
  // * Posts
  formatPosts: input => {
    if (!Array.isArray(input)) {
      input = [input];
    }
    const posts = [];
    for (const orig of input) {
      const article = {
        id: orig.id,
        slug: orig.slug,
        title: decodeHtml(orig.title.rendered),
        author: orig.acf["different-author"] || orig._embedded.author[0].name,
        excerpt: orig.excerpt.rendered,
        content: orig.content.rendered,
        dateOrig: orig.date.slice(0, 10),
        date: formatDate(orig.date),
        featuredImage: addFeaturedImage(orig, "medium_large")
      };
      posts.push(article);
    }
    return posts;
  },

  // * Page
  formatPage: input => {
    if (!input.length) {
      return null;
    }
    const orig = input[0];
    const page = {
      id: orig.id,
      slug: orig.slug,
      title: decodeHtml(orig.title.rendered),
      content: orig.content.rendered
    };
    // Add teaser specific fields
    if (page.slug === "teaser") {
      Object.assign(page, {
        teaser: orig.acf.teaser,
        link: orig.acf.link
      });
    }
    return page;
  },

  // * Products
  formatProducts: input => {
    if (!Array.isArray(input)) {
      input = [input];
    }
    const products = [];
    for (const orig of input) {
      const product = {
        id: orig.id,
        slug: orig.slug,
        name: decodeHtml(orig.title.rendered),
        content: orig.content.rendered,
        subtitle: orig.acf.subtitle,
        backgroundColor: orig.acf["background-color"],
        shopLink: orig.acf["shop-link"],
        producerIds: orig.acf["producer-ids"],
        producerText: orig.acf["producer-text"],
        recipeId: orig.acf["recipe-id"],
        seals: orig.acf["seals"],
        categories: addCategories(orig),
        featuredImage: addFeaturedImage(orig, "medium_large"),
        decorationImage: addAcfImage(orig.acf["decoration-image"], "medium"),
        isNew: checkIfNew(orig.date)
      };
      products.push(product);
    }
    return products;
  },

  // * Shops
  formatShops: input => {
    const shops = [];
    for (const orig of input) {
      const shop = {
        id: orig.id,
        name: decodeHtml(orig.title.rendered),
        address: addAddress(orig),
        latlng: [orig.acf.location.lat, orig.acf.location.lng]
      };
      shops.push(shop);
    }
    return shops;
  },

  // * Producers
  formatProducers: input => {
    const producers = [];
    for (const orig of input) {
      const producer = {
        id: orig.id,
        slug: orig.slug,
        name: decodeHtml(orig.title.rendered),
        content: orig.content.rendered,
        featuredImage: addFeaturedImage(orig, "medium"),
        country: orig.acf.country,
        ingredient: orig.acf.ingredient,
        productIds: orig.acf["product-ids"]
      };
      producers.push(producer);
    }
    return producers;
  },

  // * Slides
  formatSlides: input => {
    const slides = [];
    for (const orig of input) {
      const slide = {
        id: orig.id,
        title: decodeHtml(orig.title.rendered),
        excerpt: orig.excerpt.rendered,
        featuredImage: addFeaturedImage(orig, "full"),
        link: orig.acf.link
      };
      slides.push(slide);
    }
    return slides;
  },

  // * Recipes
  formatRecipes: input => {
    if (!Array.isArray(input)) {
      input = [input];
    }
    const recipes = [];
    for (const orig of input) {
      const recipe = {
        id: orig.id,
        slug: orig.slug,
        title: decodeHtml(orig.title.rendered),
        content: orig.content.rendered,
        categories: addCategories(orig),
        featuredImage: addFeaturedImage(orig, "medium_large"),
        ingredients: addIngredients(orig),
        portions: orig.acf.portions ? parseInt(orig.acf.portions, 10) : null,
        effort: addEffort(orig),
        difficulty: orig.acf.difficulty,
        recipeType: orig.acf["recipe-type"],
        isNew: checkIfNew(orig.date)
      };
      recipes.push(recipe);
    }
    return recipes;
  }
};

// * Helper functions
// Date
const formatDate = date => {
  if (Intl.DateTimeFormat) {
    return Intl.DateTimeFormat("de-DE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
  }
  return date;
};
// Check if post date is not older than one month
const checkIfNew = date => {
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const oneMonth = 30 * 24 * 60 * 60 * 1000;
  return now - time < oneMonth;
};

// Add the address to a shop
const addAddress = input => {
  let str = "";
  if (input.acf.location.address.includes("Deutschland")) {
    str += input.acf.location.address.split(",").slice(0, -1).join(",");
  } else {
    str += input.acf.location.address;
  }
  return str;
};

// Add a featured image
// Available sizes: thumbnail, medium, medium_large, large, full
const addFeaturedImage = (input, size) => {
  const obj = {};
  if (
    input._embedded &&
    input._embedded["wp:featuredmedia"] &&
    input._embedded["wp:featuredmedia"][0] &&
    input._embedded["wp:featuredmedia"][0].code !== "rest_forbidden" &&
    input._embedded["wp:featuredmedia"][0].code !== "rest_post_invalid_id"
  ) {
    const featuredImage = input._embedded["wp:featuredmedia"][0];
    obj.title = featuredImage.title.rendered;
    if (size && featuredImage.media_details.sizes && featuredImage.media_details.sizes[size]) {
      obj.source = featuredImage.media_details.sizes[size].source_url;
    } else {
      obj.source = featuredImage.source_url;
    }
  } else {
    // Set a placeholder
    obj.title = "Placeholder Image";
    obj.source = require("../assets/placeholder.jpg");
  }
  return obj;
};

const addAcfImage = (prop, size) => {
  if (!prop) {
    return null;
  }
  // Expect image object, fall back to url
  const obj = {};
  if (size && prop.sizes && prop.sizes[size]) {
    obj.source = prop.sizes[size];
  } else {
    obj.source = prop.url || prop;
  }
  obj.title = prop.title;
  return obj;
};

// Add categories to a product or a recipe
const addCategories = input => {
  const categories = [];
  if (input._embedded && input._embedded["wp:term"] && input._embedded["wp:term"][0]) {
    const taxonomies = input._embedded["wp:term"][0];
    for (const taxonomy of taxonomies) {
      if (taxonomy.taxonomy === "category" && !["uncategorized", "produkt", "rezept"].includes(taxonomy.slug)) {
        categories.push({
          name: taxonomy.name,
          slug: taxonomy.slug
        });
      }
    }
  }
  return categories;
};

// Recipe formatters
const addIngredients = input => {
  const ingredients = [];
  if (input.acf.ingredients && input.acf.ingredients.length) {
    input.acf.ingredients.forEach(ingredient => {
      ingredients.push({
        ...ingredient,
        quantity: ingredient.quantity ? parseFloat(ingredient.quantity) : null
      });
    });
  }
  return ingredients;
};
const addEffort = input => {
  const orig = input.acf.effort;
  const formatted = {};
  if (orig) {
    Object.keys(orig).forEach(item => {
      formatted[item] = orig[item] ? parseInt(orig[item], 10) : null;
    });
  }
  return formatted;
};

const decodeHtml = str => {
  return str.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });
};
