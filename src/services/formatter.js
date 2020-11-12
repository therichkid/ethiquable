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
        author: orig._embedded.author[0].name,
        excerpt: orig.excerpt.rendered,
        content: orig.content.rendered,
        dateOrig: orig.date.slice(0, 10),
        date: formatDate(null, orig.date),
        categories: addCategories(orig, false),
        featuredImage: addFeaturedImage(orig)
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
      author: orig._embedded.author[0].name,
      content: orig.content.rendered,
      dateOrig: orig.date.slice(0, 10),
      date: formatDate(null, orig.date),
      featuredImage: addFeaturedImage(orig)
    };
    // Add form data
    Object.assign(page, {
      formId: parseInt(orig.acf.formular_id, 10),
      formData: orig.acf.formular_code
    });
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
        excerpt: orig.excerpt.rendered,
        content: orig.content.rendered,
        producerId: orig.acf.producer && orig.acf.producer.length ? orig.acf.producer[0] : null,
        categories: addCategories(orig),
        featuredImage: addFeaturedImage(orig)
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
        name: decodeHtml(orig.title.rendered),
        excerpt: orig.excerpt.rendered,
        content: orig.content.rendered,
        featuredImage: addFeaturedImage(orig),
        country: orig.acf.country,
        ingredient: orig.acf.ingredient
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
        featuredImage: addFeaturedImage(orig, "slide"),
        link: orig.acf.link
      };
      slides.push(slide);
    }
    return slides;
  }
};

// * Helper functions
// Date
const formatDate = (type, date1, date2) => {
  const daysOfWeek = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const monthsOfYear = [
    { short: "Jan.", long: "Januar" },
    { short: "Feb", long: "Februar" },
    { short: "Mär.", long: "März" },
    { short: "Apr.", long: "April" },
    { short: "Mai", long: "Mai" },
    { short: "Jun.", long: "Juni" },
    { short: "Jul.", long: "Juli" },
    { short: "Aug.", long: "August" },
    { short: "Sep.", long: "September" },
    { short: "Okt", long: "Oktober" },
    { short: "Nov.", long: "November" },
    { short: "Dez.", long: "Dezember" }
  ];
  // Expects date format as String as it comes from WordPress DB: YYYY-mm-dd
  const YYYY = parseInt(date1.slice(0, 4), 10);
  const mm1 = parseInt(date1.slice(5, 7), 10) - 1;
  const dd1 = parseInt(date1.slice(8, 10), 10);
  if (!checkDateFormat("split", YYYY, mm1, dd1)) {
    throw "Invalid Date Format detected!";
  }
  let mm2;
  let dd2;
  const parsedDate1 = new Date(YYYY, mm1, dd1);
  let day = daysOfWeek[parsedDate1.getDay()];
  let month = monthsOfYear[mm1].short;
  const formattedDate = `${dd1.toString()}. ${month} ${YYYY}`;
  if (type === "event") {
    if (date2) {
      mm2 = parseInt(date2.slice(5, 7), 10) - 1;
      dd2 = parseInt(date2.slice(8, 10), 10);
      if (!checkDateFormat("split", YYYY, mm2, dd2)) {
        throw "Invalid Date Format detected!";
      }
      const parsedDate2 = new Date(YYYY, mm2, dd2);
      if (parsedDate2 !== parsedDate1) {
        day += ` bis ${daysOfWeek[parsedDate2.getDay()]}`;
        if (mm2 !== mm1) {
          month += ` bis ${monthsOfYear[mm2].short}`;
        }
      }
    }
    if (YYYY !== new Date().getFullYear()) {
      month += ` ${YYYY}`;
    }
    return [formattedDate, dd2 ? `${dd1} - ${dd2}` : dd1.toString(), `${month}, ${day}`];
  } else {
    return formattedDate;
  }
};

// To check if the input is valid (YYYY-mm-dd)
const checkDateFormat = (type, ...input) => {
  let YYYY, mm, dd;
  if (type === "raw") {
    YYYY = parseInt(input[0].slice(0, 4), 10);
    mm = parseInt(input[0].slice(5, 7), 10) - 1;
    dd = parseInt(input[0].slice(8, 10), 10);
  } else if (type === "split") {
    [YYYY, mm, dd] = input;
  }
  if ([YYYY, mm, dd].includes(NaN)) {
    return false;
  } else {
    return true;
  }
};

// Add the address to an event or a Selbsthilfegruppe
const addAddress = input => {
  let str = "";
  if (input.acf.location.address.includes("Deutschland")) {
    str += input.acf.location.address.split(",").slice(0, -1).join(",");
  } else {
    str += input.acf.location.address;
  }
  return str;
};

// Add a featured image to an article or a SHG
const addFeaturedImage = (input, type) => {
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
    // Pick medium large size if it exists
    if (type !== "slide" && featuredImage.media_details.sizes && featuredImage.media_details.sizes.medium_large) {
      obj.source = featuredImage.media_details.sizes.medium_large.source_url;
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

// Add categories to an event, article or group
const addCategories = input => {
  const categories = [];
  if (input._embedded && input._embedded["wp:term"] && input._embedded["wp:term"][0]) {
    const taxonomies = input._embedded["wp:term"][0];
    for (const taxonomy of taxonomies) {
      if (taxonomy.taxonomy === "category" && taxonomy.slug !== "uncategorized") {
        categories.push({
          name: taxonomy.name,
          slug: taxonomy.slug
        });
      }
    }
  }
  return categories;
};

const decodeHtml = str => {
  return str.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });
};
