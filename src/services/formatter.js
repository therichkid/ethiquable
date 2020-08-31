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
        author: orig.acf.abweichender_autor || orig._embedded.author[0].name,
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

  // * Events
  formatEvents: input => {
    const events = [];
    for (const orig of input) {
      if (!orig.acf || !Object.keys(orig.acf.adresse).length) {
        throw "Formatting of Events went wrong, please check if ACF-Plugin is enabled and all Events are valid!";
      }
      const event = {
        id: orig.id,
        slug: orig.slug,
        title: decodeHtml(orig.title.rendered),
        content: orig.content.rendered,
        link: orig.link,
        startDate: orig.acf.event_datum,
        endDate: orig.acf.event_datum !== orig.acf.event_datum_ende ? orig.acf.event_datum_ende : null,
        startTime: orig.acf.zeit_von,
        endTime: orig.acf.zeit_bis,
        featured: !!orig.acf.hauptevent,
        registration: !!orig.acf.anmeldung,
        address: addAddress(orig),
        groups: addCategories(orig, true),
        featuredImage: orig.acf.hauptevent ? addFeaturedImage(orig) : null
      };
      // Format the date
      [event.dateFormatted, event.dayFormatted, event.monthFormatted] = formatDate(
        "event",
        event.startDate,
        event.endDate
      );
      // Props for the Vuetify calendar
      Object.assign(event, {
        name: event.title,
        start: event.startDate + " " + event.startTime
      });
      // Add the event end date
      if (event.endDate && !event.endTime) {
        event.end = event.endDate;
      } else if (event.endDate && event.endTime) {
        event.end = event.endDate + " " + event.endTime;
      } else if (!event.endDate && event.endTime) {
        event.end = event.startDate + " " + event.endTime;
      }
      // Add form data
      Object.assign(event, {
        formId: parseInt(orig.acf.formular_id, 10),
        formData: orig.acf.formular_code
      });
      events.push(event);
    }
    // Sort events by date
    events.sort((a, b) => {
      return parseInt(a.startDate.replace(/-/g, "")) - parseInt(b.startDate.replace(/-/g, ""));
    });
    return events;
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
      author: orig.acf.abweichender_autor || orig._embedded.author[0].name,
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
    // Add info message specific fields
    if (page.slug === "info-meldung") {
      const typeRemap = {
        Primär: "primary",
        Sekundär: "secondary",
        Erfolg: "success",
        Info: "info"
      };
      Object.assign(page, {
        type: typeRemap[orig.acf.typ] || "primary",
        teaser: orig.acf.teaser,
        link: orig.acf.link,
        buttonText: orig.acf["button-text"]
      });
    }
    return page;
  },

  // * SHGs
  formatShops: input => {
    const shops = [];
    for (const orig of input) {
      if (!orig.acf.location.lat) {
        console.log("Richard: no latlng", orig);
      }
      const group = {
        id: orig.id,
        name: decodeHtml(orig.title.rendered),
        address: addAddress(orig),
        latlng: [orig.acf.location.lat, orig.acf.location.lng]
      };
      shops.push(group);
    }
    return shops;
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
const addFeaturedImage = input => {
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
    if (featuredImage.media_details.sizes && featuredImage.media_details.sizes.medium_large) {
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
const addCategories = (input, onlyGroups) => {
  const categories = [];
  if (input._embedded && input._embedded["wp:term"] && input._embedded["wp:term"][0]) {
    const taxonomies = input._embedded["wp:term"][0];
    for (const taxonomy of taxonomies) {
      if (taxonomy.taxonomy === "category" && !["uncategorized", "selbsthilfegruppen"].includes(taxonomy.slug)) {
        if ((onlyGroups && taxonomy.link.includes("selbsthilfegruppen")) || !onlyGroups) {
          categories.push({
            name: taxonomy.name,
            slug: taxonomy.slug,
            type: taxonomy.link.includes("selbsthilfegruppen") ? "shg" : ""
          });
        }
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
