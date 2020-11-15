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
  }
};
