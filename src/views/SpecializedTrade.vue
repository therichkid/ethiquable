<template>
  <v-container class="post-container">
    <LoadingSkeleton v-if="isLoading" />
    <LoadingError v-if="loadingError" :height="500" @retryAgain="getPage()" />

    <v-row v-if="!isLoading && !loadingError && Object.keys(page).length" align="center">
      <!-- Header -->
      <v-col cols="12">
        <h1 class="text-h4">{{ page.title }}</h1>
      </v-col>

      <!-- Body -->
      <v-col cols="12" v-html="page.content" class="wp-content pb-0"></v-col>

      <!-- Form -->
      <v-col cols="12" class="pt-0">
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
import LoadingSkeleton from "@/components/partials/LoadingSkeleton";
import LoadingError from "@/components/partials/LoadingError";
import AlertModal from "@/components/partials/AlertModal";

export default {
  components: {
    LoadingSkeleton,
    LoadingError,
    AlertModal
  },

  data() {
    return {
      page: {},
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

  computed: {
    isLoading() {
      return this.$store.state.pageLoading;
    },
    loadingError() {
      return this.$store.state.pageLoadingError;
    },
    failedRequests() {
      return this.$store.state.failedRequests;
    }
  },

  watch: {
    page(page) {
      if (!page && !this.failedRequests) {
        this.$router.push("/404");
      }
    }
  },

  methods: {
    async getPage() {
      const slug = "fachhandel";
      const pageFetched = this.$store.getters.getFetchedPageBySlug(slug);
      if (pageFetched[0]) {
        // Already fetched
        this.page = pageFetched[1];
      } else {
        // Not fetched yet
        this.page = await this.$store.dispatch("fetchPageBySlug", slug).catch(error => {
          console.error(error);
        });
      }
      if (this.page) {
        document.title = this.page.title + " - " + document.title;
      }
    },
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
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  },

  created() {
    this.getPage();
  }
};
</script>

<style scoped>
* >>> h3,
* >>> h4,
* >>> h5,
* >>> h6 {
  color: var(--v-primary-base);
  text-transform: uppercase;
}
.wp-content >>> a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  height: 44px;
  padding: 0 20px;
  background-color: var(--v-secondary-base);
  color: #fff !important;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1.25px;
  text-decoration: none;
  text-transform: uppercase;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
}
.wp-content >>> a > i {
  font-size: 18px;
}
</style>
