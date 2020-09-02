import Vue from "vue";
import Router from "vue-router";

import Home from "../views/Home";
import Posts from "../views/Posts";
import Post from "../views/Post";
import Page from "../views/Page";
import Product from "../views/Product";
import Products from "../views/Products";
import PageNotFound from "../views/PageNotFound";

// Chunks
const ShopFinder = () => import(/* webpackChunkName: "map" */ "../views/ShopFinder");

Vue.use(Router);

// TODO: use alias array for redirects after updating vue-router to v4

const routes = [
  { path: "/*.html", redirect: "/*" },
  { path: "/home", redirect: "/" },
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "Home"
    }
  },
  {
    path: "/shopfinder",
    name: "shopfinder",
    component: ShopFinder,
    meta: {
      title: "Shopfinder"
    }
  },
  {
    path: "/produkt-kategorie/*",
    redirect: route => "/produkt-kategorie/" + route.path.split("/").pop().replace(".html", "")
  },
  {
    path: "/produkt-kategorien/:category",
    name: "products",
    component: Products,
    meta: {
      title: "Produkte"
    },
    props: true
  },
  {
    path: "/produkte/:slug",
    name: "product",
    component: Product,
    meta: {
      title: "Produkt"
    },
    props: true
  },
  // {
  //   path: "/uebersicht-weltkarte",
  //   redirect: "/produzenten"
  // },
  // {
  //   path: "/produzenten",
  //   name: "producers",
  //   component: Producers,
  //   meta: {
  //     title: "Produzenten"
  //   }
  // },
  // {
  //   path: "/uebersicht-weltkarte/*",
  //   redirect: route => "/produzenten/" + route.path.split("/").pop().replace(".html", "")
  // },
  // {
  //   path: "/produzenten/:slug",
  //   name: "producer",
  //   component: Producer,
  //   meta: {
  //     title: "Produzent"
  //   }
  // },
  {
    path: "/magazin/page/:page?",
    name: "posts",
    component: Posts,
    meta: {
      title: "Magazin"
    },
    alias: "/magazin"
  },
  {
    path: "/magazin/:slug",
    name: "post",
    component: Post,
    meta: {
      title: "Magazin"
    },
    props: true
  },
  // { path: "/?wpupg_grid=rezepte", redirect: "/rezepte" },
  // {
  //   path: "/rezepte",
  //   name: "recipes",
  //   component: Recipes,
  //   meta: {
  //     title: "Rezepte"
  //   }
  // },
  // {
  //   path: "/rezepte/:slug",
  //   name: "recipe",
  //   component: Recipe,
  //   meta: {
  //     title: "Rezept"
  //   },
  //   props: true
  // },
  {
    path: "/404",
    name: "404",
    component: PageNotFound,
    meta: {
      title: "404"
    }
  },
  // Page redirects
  { path: "/unser-ansatz", redirect: "/fair-trade" },
  { path: "/stellenangebote", redirect: "/jobs" },
  { path: "/disclaimer", redirect: "/impressum" },
  {
    path: "/:slug",
    name: "page",
    component: Page,
    props: true
  },
  { path: "*", redirect: "/404" }
];

const router = new Router({
  routes,
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  let title = "";
  if (to.meta.title) {
    title += `${to.meta.title} - `;
  }
  title += "ETHIQUABLE";
  document.title = title;
  next();
});

export default router;
