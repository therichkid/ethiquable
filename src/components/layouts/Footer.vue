<template>
  <v-footer dark color="primary">
    <v-container>
      <!-- Top seals -->
      <v-row>
        <v-col cols="12" class="text-center">
          <span v-for="(item, i) in seals" :key="i">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <a :href="item.link" target="_blank" rel="noopener noreferrer" v-on="on">
                  <img height="80" width="auto" :src="item.img" :alt="item.label" class="mx-3" />
                </a>
              </template>
              <span>{{ item.label }}</span>
            </v-tooltip>
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <span>Alle unsere Produkte entsprechen der EG-Öko-Verordnung (Öko-Kontrollstelle DE-ÖKO-006)</span>
        </v-col>
      </v-row>

      <!-- Center -->
      <v-row no-gutters align="center" justify="space-around">
        <!-- Left -->
        <v-col cols="12" sm="5" lg="4">
          <v-card-title :class="$vuetify.breakpoint.xsOnly && 'justify-center'">Bleiben Sie im Kontakt!</v-card-title>
          <v-card-text>
            <!-- Social media -->
            <div class="d-flex mb-5" :class="$vuetify.breakpoint.xsOnly && 'justify-center'">
              <span v-for="(item, i) in networks" :key="i">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      large
                      v-on="on"
                      :href="item.link"
                      target="_blank"
                      rel="nofollow"
                      class="mx-1 white--text"
                      :style="{ backgroundColor: item.color }"
                      :aria-label="`Auf ${item.label} folgen`"
                    >
                      <v-icon large>mdi-{{ item.name }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ item.label }}</span>
                </v-tooltip>
              </span>
            </div>
            <!-- Contact -->
            <div class="align-center mb-2" v-for="(item, i) in contact" :key="i">
              <v-icon color="secondary" class="icon">{{ item.icon }}</v-icon>
              <span class="body-2 text link" v-html="item.text"></span>
            </div>
          </v-card-text>

          <!-- Partners -->
          <v-card-title :class="$vuetify.breakpoint.xsOnly && 'justify-center'">Unsere EU-Partner:</v-card-title>
          <v-card-text>
            <div class="d-flex" :class="$vuetify.breakpoint.xsOnly && 'justify-center'">
              <span v-for="(item, i) in partners" :key="i">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <a :href="item.link" target="_blank" rel="noopener noreferrer" v-on="on">
                      <img height="44" width="auto" :src="item.img" :alt="item.label" class="mx-1" />
                    </a>
                  </template>
                  <span>{{ item.label }}</span>
                </v-tooltip>
              </span>
            </div>
          </v-card-text>
        </v-col>

        <!-- Right -->
        <v-col cols="12" sm="5" lg="4">
          <!-- Contact form -->
          <v-card-title :class="$vuetify.breakpoint.xsOnly && 'justify-center'">Haben Sie eine Frage?</v-card-title>
          <v-card-text>
            <v-form v-model="valid">
              <v-text-field solo light hide-details label="Name" v-model="name" class="mb-2"></v-text-field>
              <v-text-field
                type="email"
                solo
                light
                hide-details="auto"
                label="E-Mail"
                v-model="email"
                :rules="emailRules"
                required
                class="mb-2"
              ></v-text-field>
              <v-textarea
                solo
                light
                hide-details
                auto-grow
                rows="5"
                label="Ihre Nachricht"
                v-model="message"
                required
                class="mb-2"
              ></v-textarea>
              <v-checkbox v-model="privacyPolicyAccepted">
                <template v-slot:label>
                  <span>Ich stimme der <router-link to="/datenschutz">Datenschutzerklärung</router-link> zu.</span>
                </template>
              </v-checkbox>
              <v-text-field label="HP" v-model="hp" v-show="false"></v-text-field>
              <v-btn
                class="secondary"
                :disabled="!valid || !email || !message || !privacyPolicyAccepted"
                :loading="isPosting"
                @click="postForm"
                >Senden</v-btn
              >
            </v-form>
          </v-card-text>
        </v-col>
      </v-row>

      <!-- Bottom links and copyright -->
      <v-row>
        <v-col cols="12">
          <div style="display: flex; justify-content: center">
            <a href="https://www.rzille.de" target="_blank" rel="noopener noreferrer" style="text-decoration: none">
              <div
                style="
                  background-color: #242424;
                  border: 2px solid #363636;
                  border-radius: 4px;
                  padding: 8px;
                  display: flex;
                  align-items: center;
                "
              >
                <img src="https://www.rzille.de/img/favicon.png" alt="Thrive Media Logo" width="32" height="32" />
                <div style="margin-left: 8px; display: flex; flex-direction: column; align-items: center">
                  <span style="font-size: 12px; color: #b5b5b5">Webseite erstellt von</span>
                  <span style="font-size: 16px; color: #009688; font-weight: 700">Thrive Media</span>
                </div>
              </div>
            </a>
          </div>
        </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" sm="6" class="text-center text-sm-left">
          <v-btn v-for="(item, i) in menu" :key="i" text :to="item.to">
            {{ item.name }}
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6" class="text-center text-sm-right">
          &copy; {{ new Date().getFullYear() }} &minus;
          <strong>ETHIQUABLE Deutschland e.G.</strong>
        </v-col>
      </v-row>

      <AlertModal :dialog="dialog" :alertType="alertType" :alertMessage="alertMessage" @dialog="dialog = false" />
    </v-container>
  </v-footer>
</template>

<script>
import api from "@/services/api";
import AlertModal from "@/components/partials/AlertModal";

export default {
  components: {
    AlertModal
  },

  data() {
    return {
      valid: false,
      name: "",
      email: "",
      emailRules: [v => /\S+@\S+\.\S+/.test(v) || !v || "Diese E-Mail ist ungültig!"],
      message: "",
      privacyPolicyAccepted: false,
      hp: "",
      isPosting: false,
      initTime: 0,
      dialog: false,
      alertMessage: "",
      alertType: "",
      contact: [
        {
          icon: "mdi-map-marker",
          text: `ETHIQUABLE Deutschland eG
          <br>Wipperstraße 10
          <br>D-12055 Berlin`
        },
        {
          icon: "mdi-phone",
          text: "<a href='tel:+493030605545'>+49 (0)30 – 30 60 55 45</a>"
        },
        {
          icon: "mdi-email",
          text: "<a href='mailto:info@ethiquable.de'>info@ethiquable.de"
        }
      ],
      seals: [
        {
          label: "Fair Band",
          img: require("@/assets/logos/fairband.png"),
          link: "https://www.fair-band.de/"
        },
        {
          label: "Weltladen-Lieferant",
          img: require("@/assets/logos/weltladen.jpg"),
          link: "https://www.weltladen.de/#die-anerkannten-weltladen-lieferanten-menu-3886"
        },
        {
          label: "SPP",
          img: require("@/assets/logos/spp.png"),
          link: "http://spp.coop/?lang=en"
        },
        {
          label: "Bio-Siegel",
          img: require("@/assets/logos/bio.jpg"),
          link: "https://www.oekolandbau.de/bio-siegel/"
        },
        {
          label: "Fairtrade",
          img: require("@/assets/logos/fairtrade.png"),
          link: "https://www.fairtrade-deutschland.de/"
        }
      ],
      networks: [
        {
          name: "facebook",
          label: "Facebook",
          color: "#4267b2",
          link: "https://www.facebook.com/ethiquable.deutschland"
        },
        {
          name: "twitter",
          label: "Twitter",
          color: "#1da1f2",
          link: "https://twitter.com/ethiquable_de"
        },
        {
          name: "youtube",
          label: "YouTube",
          color: "#ff0000",
          link: "https://www.youtube.com/channel/UCP1uRLbhQLUxYvDPgmR4InA"
        },
        {
          name: "instagram",
          label: "Instagram",
          color: "#bc2a8d",
          link: "https://www.instagram.com/ethiquable_deutschland/"
        }
      ],
      partners: [
        {
          label: "ETHIQUABLE Frankreich",
          img: require("@/assets/logos/france.png"),
          link: "https://www.ethiquable.coop/"
        },
        {
          label: "ETHIQUABLE BeNeLux",
          img: require("@/assets/logos/belgium.png"),
          link: "http://www.ethiquable.be/"
        },
        {
          label: "ideas Comercio Justo",
          img: require("@/assets/logos/spain.png"),
          link: "https://ideas.coop/"
        }
      ],
      menu: [
        {
          name: "Presse",
          to: "/presse"
        },
        {
          name: "Händler-Login",
          to: "/fachhandel"
        },
        {
          name: "Datenschutz",
          to: "/datenschutz"
        },
        {
          name: "Impressum",
          to: "/impressum"
        }
      ]
    };
  },

  methods: {
    async postForm() {
      this.isPosting = true;
      const data = {
        fullname: this.name.trim(),
        email: this.email.trim(),
        subject: "Ich habe eine Frage / Anregung",
        message: this.message,
        _timer: Date.now() - this.initTime
      };
      // Honeypot
      if (this.hp && this.hp.length) {
        data._hp = this.hp;
      }
      await api
        .postData("contact", data)
        .then(response => {
          this.alertType = "success";
          this.alertMessage = response;
          this.name = "";
          this.email = "";
          this.message = "";
        })
        .catch(error => {
          this.alertType = "error";
          this.alertMessage = error;
        })
        .finally(() => {
          this.isPosting = false;
          this.dialog = true;
        });
    }
  },

  mounted() {
    this.initTime = Date.now();
  }
};
</script>

<style scoped>
.icon {
  float: left;
  margin-top: -3px;
}
.text {
  display: block;
  padding-left: 60px;
}
.link >>> a,
a {
  color: white !important;
}
</style>
