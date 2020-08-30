import Vue from "vue";
import Vuetify from "vuetify/lib";
import de from "vuetify/es5/locale/de";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  theme: {
    dark: false,
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#80a018",
        secondary: "#b25c2d",
        accent: "#80a018"
      }
    }
  },
  lang: {
    locales: { de },
    current: "de"
  }
});
