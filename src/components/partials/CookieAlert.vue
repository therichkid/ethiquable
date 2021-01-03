<template>
  <div class="cookie-consent pa-2 pa-md-5" v-if="!hasAcceptedCookies">
    <v-card outlined class="cookie-consent-card">
      <v-card-text class="pb-0">
        <span>
          Mit der Nutzung dieser Webseite erklären Sie sich damit einverstanden, dass wir technisch notwendige Cookies
          verwenden.
        </span>
        <router-link to="/datenschutz">Weiterlesen</router-link>.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="acceptCookies()" color="success">Akzeptieren </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasAcceptedCookies: false
    };
  },

  methods: {
    acceptCookies() {
      this.hasAcceptedCookies = true;
      localStorage.setItem("cookiesAccepted", true);
    }
  },

  mounted() {
    if (localStorage.getItem("cookiesAccepted") === "true") {
      this.hasAcceptedCookies = true;
    }
  }
};
</script>

<style scoped>
.cookie-consent {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 5;
}
.cookie-consent-card {
  max-width: 600px;
  pointer-events: auto;
}
</style>
