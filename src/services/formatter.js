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
        excerpt: orig.excerpt.rendered,
        content: parseContent(orig.content.rendered),
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
      content: parseContent(orig.content.rendered)
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
        content: parseContent(orig.content.rendered),
        subtitle: orig.acf.subtitle,
        backgroundColor: orig.acf["background-color"],
        shopLink: orig.acf["shop-link"],
        producerIds: orig.acf["producer-ids"],
        producerText: parseContent(orig.acf["producer-text"]),
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
        excerpt: orig.excerpt.rendered,
        content: parseContent(orig.content.rendered),
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
        content: parseContent(orig.content.rendered),
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

const parseContent = str => {
  str = removeEmptyLines(str);
  str = parseEmbeds(str);
  return str;
};

const removeEmptyLines = str => {
  if (!str) {
    return "";
  }
  return str.replace(/<p>&nbsp;<\/p>/g, "");
};

const parseEmbeds = str => {
  const iframeRegExp = /<iframe[^>]+>[\s\S]*?<\/iframe>/g;
  const srcRegExp = /src=["'](.+?)["']/;
  const origs = [];
  const replacements = [];
  let orig;
  while ((orig = iframeRegExp.exec(str)) !== null) {
    let replacement = "";
    const src = orig[0].match(srcRegExp);
    if (src) {
      const url = src[1];
      if (url.includes("youtube") || url.includes("youtu.be")) {
        const id = getYtId(url);
        if (id) {
          replacement = createYtElement(id);
        }
      }
      if (!replacement) {
        replacement = createLinkElement(url);
      }
    }
    origs.push(orig);
    replacements.push(replacement);
  }
  origs.forEach((orig, i) => {
    str = str.replace(orig, replacements[i]);
  });
  return str;
};
const getYtId = url => {
  const regExp = /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#&?]*).*/;
  const id = url.match(regExp);
  return (id && id[1]) || null;
};
const createYtElement = id => {
  return `<a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer" class="yt-wrapper">
  <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="YouTube Video" />
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 721"  xmlns:v="https://vecta.io/nano"><path fill="#fff" d="M407,493l276-143L407,206V493z"/><path opacity=".12" fill="#420000" d="M407,206l242,161.6l34-17.6L407,206z"/><linearGradient id="A" gradientUnits="userSpaceOnUse" x1="512.5" y1="1.3" x2="512.5" y2="719.8"><stop offset="0" stop-color="#e52d27"/><stop offset="1" stop-color="#bf171d"/></linearGradient><path fill="url(#A)" d="M1013 156.3s-10-70.4-40.6-101.4C933.6 14.2 890 14 870.1 11.6 727.1 1.3 512.7 1.3 512.7 1.3h-.4s-214.4 0-357.4 10.3C135 14 91.4 14.2 52.6 54.9 22 85.9 12 156.3 12 156.3S1.8 238.9 1.8 321.6v77.5C1.8 481.8 12 564.4 12 564.4s10 70.4 40.6 101.4c38.9 40.7 89.9 39.4 112.6 43.7 81.7 7.8 347.3 10.3 347.3 10.3s214.6-.3 357.6-10.7c20-2.4 63.5-2.6 102.3-43.3 30.6-31 40.6-101.4 40.6-101.4s10.2-82.7 10.2-165.3v-77.5c0-82.7-10.2-165.3-10.2-165.3zM407 493V206l276 144-276 143z"/></svg>
</a>`;
};
const createLinkElement = url => {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">
  Hier geht es zum externen Inhalt.
</a>`;
};
