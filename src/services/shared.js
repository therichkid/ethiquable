import { COLORS, COUNTRY_NAMES } from "@/constants";

export default {
  capitalize: input => {
    const output = [];
    input = input.split(" ");
    for (const word of input) {
      output.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
    return output.join(" ");
  },

  getCurrentDate: delimiter => {
    if (!delimiter) {
      delimiter = "";
    }
    const currentDate = new Date();
    const mm = currentDate.getMonth() + 1;
    const dd = currentDate.getDate();
    return [currentDate.getFullYear(), (mm > 9 ? "" : "0") + mm, (dd > 9 ? "" : "0") + dd].join(delimiter);
  },
  splitDate: (date, hasDelimiter) => {
    let year, month, day;
    if (hasDelimiter) {
      year = parseInt(date.slice(0, 4), 10);
      month = parseInt(date.slice(5, 7), 10);
      day = parseInt(date.slice(8), 10);
    } else {
      year = parseInt(date.slice(0, 4), 10);
      month = parseInt(date.slice(4, 6), 10);
      day = parseInt(date.slice(6), 10);
    }
    return [year, month, day];
  },

  stripHtml: str => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.body.textContent || "";
  },

  shortenTextLength: (str, number) => {
    const shortened = str.slice(0, number).split(" ").slice(0, -1).join(" ");
    return shortened.length < str.length ? shortened + " [&hellip;]" : shortened;
  },

  createCountryMap: (key, values) => {
    const map = {};
    for (const item of COUNTRY_NAMES) {
      if (item[key]) {
        const inner = (map[item[key]] = {});
        values.forEach(value => {
          if (value === "color") {
            inner.color = addCountryColor(item);
          } else {
            inner[value] = item[value];
          }
        });
      }
    }
    return map;
  },

  isLightColor: hexColor => {
    const c = hexColor.substring(1); // Strip #
    const rgb = parseInt(c, 16); // Convert to decimal
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (luma <= 150) {
      // Is dark
      return false;
    } else {
      // Is light
      return true;
    }
  }
};

const assignedContinents = [];
const addCountryColor = country => {
  if (country.continent) {
    const idx = assignedContinents.indexOf(country.continent);
    if (idx > -1 && COLORS[idx]) {
      return COLORS[idx];
    } else if (idx === -1 && COLORS[assignedContinents.length]) {
      const color = COLORS[assignedContinents.length];
      assignedContinents.push(country.continent);
      return color;
    }
  }
  return null;
};
