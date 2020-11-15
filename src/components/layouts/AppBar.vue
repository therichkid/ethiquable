<template>
  <v-app-bar app dark prominent dense color="primary" src="@/assets/banner.png">
    <v-app-bar-nav-icon
      @click.stop="onMenuToggleClick()"
      class="hidden-lg-and-up"
      aria-label="Menü"
    ></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <router-link to="/">
      <v-img
        src="@/assets/logo.png"
        height="auto"
        width="275"
        alt="ETHIQUABLE-Logo"
        contain
        :style="{ 'margin-top': $vuetify.breakpoint.lgAndUp ? '35px' : '15px' }"
      ></v-img>
    </router-link>

    <v-spacer></v-spacer>

    <SearchBar />

    <v-toolbar-items slot="extension" v-if="$vuetify.breakpoint.lgAndUp" style="margin: 0 auto">
      <template v-for="(item, i) in routerItems">
        <v-btn text light :key="i" v-bind="getToProps(item)" v-if="typeof item.to === 'string'">
          {{ item.title }}
          <v-icon right v-if="item.icon">{{ item.icon }}</v-icon>
        </v-btn>

        <v-menu offset-y open-on-hover :key="i" v-else-if="typeof item.to === 'object'">
          <template v-slot:activator="{ on }">
            <v-btn text light v-on="on">
              {{ item.title }}
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, i) in item.to" :key="i" v-bind="getToProps(item)">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import SearchBar from "@/components/partials/SearchBar";
import { ROUTER_ITEMS } from "@/constants.js";

export default {
  components: {
    SearchBar
  },

  data() {
    return {
      routerItems: ROUTER_ITEMS
    };
  },

  methods: {
    onMenuToggleClick() {
      this.$emit("toggleClicked");
    },
    getToProps(item) {
      if (item.to.includes("http")) {
        return {
          href: item.to,
          target: "_blank"
        };
      } else {
        return {
          to: item.to
        };
      }
    }
  }
};
</script>

<style></style>
