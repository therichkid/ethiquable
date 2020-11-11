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

  // Post requests with reCAPTCHA check
  async postData(data, token, id) {
    // Get the path when reCAPTCHA is successful
    const path = await verify(token, id);
    if (path) {
      await cf7PostRequest(data, path).catch(error => {
        throw error;
      });
      return "Ihr Formular wurde erfolgreich versendet. Vielen Dank!";
    } else {
      throw "Unbekannter Fehler.";
    }
  }
};

// Verify if the user is human
const verify = async (token, id) => {
  const response = await axios
    .post("/includes/verify.php", {
      token,
      id
    })
    .catch(error => {
      console.error(error);
      // Somehow catching the error message from the php file is not working...
      throw "reCAPTCHA-Prüfung war nicht erfolgreich. Bitte versuchen Sie es noch einmal.";
    });
  return response.data;
};

// CF7
const cf7PostRequest = async (data, restParam) => {
  const bodyFormData = new FormData();
  for (const key in data) {
    bodyFormData.set(key, data[key]);
  }
  const response = await wpInstance.post(restParam, bodyFormData).catch(error => {
    throw error;
  });
  // console.log("Post CF7 Data Successful", response);
  if (response.data.status === "mail_sent") {
    // Success
    return null;
  } else {
    // Error handling CF7
    throw response;
  }
};
