import axios from "axios";

// TODO: enable https
const wpInstance = axios.create({
  baseURL: "http://admin.ethiquable.de/wp-json/",
  timeout: 7500
});
const osmInstance = axios.create({
  baseURL: "https://nominatim.openstreetmap.org/",
  timeout: 7500
});

export default {
  async fetchData(path, params) {
    const response = await wpInstance.get(path, { params }).catch(error => {
      throw error;
    });
    return { data: response.data, headers: response.headers };
  },

  async fetchOsmData(params) {
    const response = await osmInstance.get("search", { params }).catch(error => {
      throw error;
    });
    return { data: response.data, headers: response.headers };
  },

  async postData(type, data) {
    const response = await axios
      .post("/wp-content/themes/ethiquable/dist/includes/submit.php", { type, data })
      .catch(error => {
        if (typeof error === "string") {
          // Validation errors
          throw error;
        } else {
          console.error(error);
          throw defaultErrorMessage;
        }
      });
    const { success, message } = handleResponse(response);
    if (success) {
      return message;
    } else {
      throw message;
    }
  }
};

const defaultErrorMessage = "Leider ist etwas schiefgegangen. Bitte versuchen Sie es später noch einmal.";

const handleResponse = response => {
  if (response.data.status === "mail_sent") {
    return {
      success: true,
      message: "Ihr Formular wurde erfolgreich versendet. Vielen Dank!"
    };
  } else {
    console.error(response);
    return {
      success: false,
      message: response.data.message || defaultErrorMessage
    };
  }
};
