<template>
  <v-navigation-drawer v-model="drawer" app disable-resize-watcher width="300">
    <v-list nav dense shaped>
      <template v-for="(item, i) in routerItems">
        <v-list-item :key="i" v-bind="getToProps(item)" v-if="typeof item.to === 'string'">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-list-group :prepend-icon="item.icon" :key="i" v-else-if="typeof item.to === 'object'">
          <template v-slot:activator>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>
          <v-list-item v-for="(item, i) in item.to" :key="i" v-bind="getToProps(item)">
            <v-list-item-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { ROUTER_ITEMS } from "@/constants";

export default {
  data() {
    return {
      drawer: false,
      routerItems: ROUTER_ITEMS
    };
  },

  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    }
  },

  watch: {
    isMobile(value) {
      if (!value) {
        this.drawer = false;
      }
    }
  },

  methods: {
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
