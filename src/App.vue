<template>
  <v-app>
    <NavigationDrawer ref="drawer" />

    <AppBar @toggleClicked="onToggleEmit()" />

    <v-main>
      <v-container fluid class="main-container">
        <router-view />
      </v-container>
      <Footer />
    </v-main>

    <FAB />

    <CookieAlert />
  </v-app>
</template>

<script>
import NavigationDrawer from "@/components/layouts/NavigationDrawer";
import AppBar from "@/components/layouts/AppBar";
import Footer from "@/components/layouts/Footer";
import FAB from "@/components/partials/FAB";
import CookieAlert from "@/components/partials/CookieAlert";

export default {
  components: { NavigationDrawer, AppBar, Footer, FAB, CookieAlert },

  methods: {
    onToggleEmit() {
      this.$refs.drawer.drawer = !this.$refs.drawer.drawer;
    }
  },

  mounted() {
    // Workaround to disable ripple effect on touchmove
    window.addEventListener(
      "touchmove",
      () => {
        document.body.classList.add("hide-ripple");
      },
      { passive: true }
    );
    window.addEventListener("touchend", () => {
      setTimeout(() => {
        document.body.classList.remove("hide-ripple");
      }, 50);
    });
  }
};
</script>

<style>
h1,
h2 {
  color: var(--v-primary-base);
  text-transform: uppercase;
}
.main-container {
  max-width: 1200px;
  min-height: 60vh;
}
.grecaptcha-badge {
  display: none;
}
.post-container {
  max-width: 750px;
  line-height: 1.8;
  word-wrap: break-word;
  hyphens: auto;
}
.post-container p {
  text-align: justify;
}
.v-card__title {
  word-wrap: break-word;
}
.v-banner__wrapper {
  border-bottom: none !important;
}
.hide-ripple .v-ripple__container {
  display: none;
}
/* WP classes */
/* Inherited via v-html so they need a global style to be attached */
[class*="wp-image"],
.wp-caption {
  height: auto;
  max-width: 100%;
}
.wp-caption p {
  font-size: 14px;
  font-style: italic;
}
.alignleft {
  float: left;
  margin: 0 10px 0 0;
  max-width: 100%;
}
.aligncenter {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}
.alignright {
  float: right;
  margin: 0 0 0 10px;
  max-width: 100%;
}
.alignnone {
  margin: 0;
  max-width: 100%;
}
@media screen and (max-width: 599px) {
  .alignright,
  .alignleft {
    float: none;
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }
}
.tablepress {
  width: 100%;
  display: table;
  overflow-x: auto;
  overflow-y: hidden;
}
.tablepress th {
  font-size: unset !important;
}
iframe {
  max-width: 100%;
}
/* ETHIQUABLE classes */
table.ethiquable-table {
  width: 100%;
  max-width: 500px;
  border-collapse: separate;
  border-spacing: 0;
}
table.ethiquable-table tr > th {
  color: #fff;
  background-color: var(--v-primary-base);
}
table.ethiquable-table > *:first-child > tr:first-child > th,
table.ethiquable-table > *:first-child > tr:first-child > td {
  border-top: 1px solid #7a7a7a;
}
table.ethiquable-table tr > th,
table.ethiquable-table tr > td {
  border-bottom: 1px solid #7a7a7a;
  padding: 5px 10px;
}
table.ethiquable-table tr > th:first-child,
table.ethiquable-table tr > td:first-child {
  border-left: 1px solid #7a7a7a;
}
table.ethiquable-table tr > th:last-child,
table.ethiquable-table tr > td:last-child {
  border-right: 1px solid #7a7a7a;
}
table.ethiquable-table > *:first-child > tr:first-child > th:first-child,
table.ethiquable-table > *:first-child > tr:first-child > td:first-child {
  border-top-left-radius: 10px;
}
table.ethiquable-table > *:first-child > tr:first-child > th:last-child,
table.ethiquable-table > *:first-child > tr:first-child > td:last-child {
  border-top-right-radius: 10px;
}
table.ethiquable-table tr:last-child > td:first-child {
  border-bottom-left-radius: 10px;
}
table.ethiquable-table tr:last-child > td:last-child {
  border-bottom-right-radius: 10px;
}
.ethiquable-grid {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}
.ethiquable-grid > * {
  min-width: 0;
  margin: 2px;
}
.post-container .ethiquable-layout > .right {
  border: 1px solid rgba(0, 0, 0, 0.12);
  padding: 8px;
  text-align: center;
}
@media screen and (min-width: 768px) {
  .post-container .ethiquable-layout {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }
  .post-container .ethiquable-layout > .left {
    margin-right: 8px;
    padding-right: 8px;
  }
  .post-container .ethiquable-layout > .right {
    margin-left: 8px;
    padding-left: 8px;
  }
  .post-container .ethiquable-layout > .right {
    flex-shrink: 1;
    min-width: 250px;
  }
}
/* Remove certain areas when printing the document */
@media print {
  nav,
  header,
  footer,
  img,
  iframe,
  .v-btn--fab,
  .v-tooltip__content {
    display: none !important;
  }
  main {
    padding: 0 !important;
  }
}
</style>
