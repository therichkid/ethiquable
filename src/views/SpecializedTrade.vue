<template>
  <v-container class="post-container">
    <v-row align="center">
      <!-- Header -->
      <v-col cols="12">
        <h1 class="text-h4">Fachhandel</h1>
      </v-col>

      <!-- Order offline -->
      <v-col cols="12">
        <h2 class="text-h5 mb-2">Bestellung per Fax / Brief / E-Mail</h2>
        <div>
          Senden Sie uns das Bestellformular per Fax / Brief / E-Mail zusammen mit Ihrer Gewerbeanmeldung. Klicken Sie
          auf den Button, um das Formular herunterzuladen.
        </div>
        <div class="trade-button mt-4">
          <v-btn
            block
            tile
            large
            color="secondary"
            :href="publicPath + 'img/bestellformular-fachhandel.pdf'"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bestellformular für Fax & Brief
            <v-spacer></v-spacer>
            <v-icon right>mdi-download</v-icon>
          </v-btn>
        </div>
      </v-col>

      <!-- Order online -->
      <v-col cols="12">
        <h2 class="text-h5 mb-2">Online-Bestellung</h2>
        <div>
          Die Mindestbestellmenge für Frei-Haus-Lieferungen beträgt lediglich 100€.
          <br />
          Wenn Sie schon Ihre Zugangsdaten (Kundennummer und Kennwort) haben, dann tragen Sie diese bitte in das
          Online-Bestellformular ein.
        </div>
        <div class="trade-button mt-4">
          <v-btn
            block
            tile
            large
            color="secondary"
            href="https://www.ethiquablebestellung.de/bestellung/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Zum Online-Bestellformular
            <v-spacer></v-spacer>
            <v-icon right>mdi-open-in-new</v-icon>
          </v-btn>
        </div>

        <!-- Sign-up -->
        <div class="mt-4">
          Sollten Sie noch keine Zugangsdaten haben, tragen Sie Ihren Namen und E-Mail-Adresse hier ein und wir schicken
          sie Ihnen gern.
        </div>
        <v-form v-model="valid">
          <v-text-field label="Name" v-model="name" required></v-text-field>
          <v-text-field label="E-Mail" v-model="email" :rules="emailRules" required></v-text-field>
          <v-checkbox
            label="Ich möchte meine Zugansdaten für die Online-Bestellung bekommen."
            v-model="accessDataAccepted"
          >
          </v-checkbox>
          <v-checkbox v-model="privacyPolicyAccepted" class="mt-0">
            <template v-slot:label>
              <span>Ich stimme der <router-link to="/datenschutz">Datenschutzerklärung</router-link> zu.</span>
            </template>
          </v-checkbox>
          <v-btn
            color="secondary"
            :disabled="!valid || !name || !email || !accessDataAccepted || !privacyPolicyAccepted"
            @click="sendForm"
          >
            Senden
          </v-btn>
          <div class="caption mt-2">
            Diese Website ist durch reCAPTCHA geschützt und es gelten die
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
              >Datenschutzbestimmungen</a
            >
            und
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer"
              >Nutzungsbedingungen</a
            >
            von Google.
          </div>
        </v-form>
      </v-col>

      <!-- Actions -->
      <v-col cols="12">
        <v-btn @click="goBack()">
          <v-icon>mdi-chevron-left</v-icon>
          <span>Zurück</span>
        </v-btn>
      </v-col>
    </v-row>

    <AlertModal :dialog="dialog" :alertType="alertType" :alertMessage="alertMessage" @dialog="dialog = false" />
  </v-container>
</template>

<script>
import api from "@/services/api";
const AlertModal = () => import(/* webpackChunkName: "dialog" */ "@/components/partials/AlertModal");

export default {
  components: {
    AlertModal
  },

  data() {
    return {
      publicPath: process.env.BASE_URL,
      valid: false,
      name: "",
      email: "",
      emailRules: [v => /\S+@\S+\.\S+/.test(v) || !v || "Diese E-Mail ist ungültig!"],
      accessDataAccepted: false,
      privacyPolicyAccepted: false,
      dialog: false,
      alertMessage: "",
      alertType: ""
    };
  },

  methods: {
    async sendForm() {
      const data = {
        fullname: this.name.trim(),
        email: this.email.trim(),
        subject: "Anfrage Zugangsdaten für Fachhandel"
      };
      // Create token for reCAPTCHA
      const token = await this.$recaptcha("login");
      await api
        .postData(data, token, "trade")
        .then(response => {
          this.alertType = "success";
          this.alertMessage = response;
          this.name = "";
          this.email = "";
        })
        .catch(error => {
          this.alertType = "error";
          this.alertMessage = error;
        });
      this.dialog = true;
    }
  }
};
</script>

<style scoped>
.trade-button {
  max-width: 500px;
}
</style>
