import Vue from "vue";
import Router from "vue-router";

import Home from "../views/Home";
import ShopFinder from "../views/ShopFinder";
import Posts from "../views/Posts";
import Post from "../views/Post";
import Page from "../views/Page";
import Product from "../views/Product";
import Products from "../views/Products";
import Producer from "../views/Producer";
import Producers from "../views/Producers";
import Recipes from "../views/Recipes";
import Recipe from "../views/Recipe";
import SpecializedTrade from "../views/SpecializedTrade";
import PageNotFound from "../views/PageNotFound";

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
      title: "Shopfinder",
      description: "Finden Sie einen Laden in Ihrer Nähe, der ETHIQUABLE-Produkte führt."
    }
  },
  {
    path: "/produkt-kategorie/*",
    redirect: route =>
      "/produkt-kategorien/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/produkt-kategorien/:category",
    name: "products",
    component: Products,
    meta: {
      title: "Produkte",
      description: "Hier finden Sie eine Übersicht vom {category}-Sortiment, das wir bei ETHIQUABLE verkaufen."
    },
    props: true
  },
  {
    path: "/produkt/*",
    redirect: route =>
      "/produkte/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/produkte/:slug",
    name: "product",
    component: Product,
    meta: {
      title: "Produkt",
      description: "Alle Infos zum Produkt {slug} von ETHIQUABLE inkl. Infos über Inhaltsstoffe und Herkunft."
    },
    props: true
  },
  {
    path: "/uebersicht-weltkarte",
    redirect: "/produzenten"
  },
  {
    path: "/produzenten",
    name: "producers",
    component: Producers,
    meta: {
      title: "Produzenten",
      description:
        "Entdecken Sie die Produzenten, mit denen wir zusammenarbeiten sowie die Projekte, die wir unterstützen."
    }
  },
  {
    path: "/uebersicht-weltkarte/*",
    redirect: route =>
      "/produzenten/" +
      route.path
        .split("/")
        .filter(path => path)
        .pop()
        .replace(".html", "")
  },
  {
    path: "/produzenten/:slug",
    name: "producer",
    component: Producer,
    meta: {
      title: "Produzent",
      description: "Detaillierte Informationen über den Produzenten {slug} und Projekte, die gefördert werden."
    },
    props: true
  },
  {
    path: "/magazin/page/:page?",
    name: "posts",
    component: Posts,
    meta: {
      title: "Magazin",
      description: "Kleine informative Artikel und Geschichten."
    },
    alias: "/magazin"
  },
  {
    path: "/magazin/:slug",
    name: "post",
    component: Post,
    meta: {
      title: "Magazin",
      description: "Interessante Fakten zum Thema \u201E{slug}\u201C."
    },
    props: true
  },
  { path: "/?wpupg_grid=rezepte", redirect: "/rezepte" },
  {
    path: "/rezepte",
    name: "recipes",
    component: Recipes,
    meta: {
      title: "Rezepte",
      description: "Vielfältige und einfache Rezepte für jede Saison."
    }
  },
  {
    path: "/rezepte/:slug",
    name: "recipe",
    component: Recipe,
    meta: {
      title: "Rezept",
      description: "Alle Zutaten und Zubereitungsschritte zum Rezept {slug}."
    },
    props: true
  },
  { path: "/fachhandel.php", redirect: "/fachhandel" },
  {
    path: "/fachhandel",
    name: "Fachhandel",
    component: SpecializedTrade,
    meta: {
      title: "Fachhandel",
      description: "Sind Sie ein Händler? Bestellen Sie hier."
    }
  },
  {
    path: "/404",
    name: "404",
    component: PageNotFound,
    meta: {
      title: "404"
    }
  },
  // Page redirects
  { path: "/stellenangebote", redirect: "/jobs" },
  { path: "/disclaimer", redirect: "/impressum" },
  {
    path: "/:slug",
    name: "page",
    component: Page,
    meta: {
      description: "Lernen Sie die Genossenschaft ETHIQUABLE und unsere Arbeit kennen."
    },
    props: true
  },
  { path: "*", redirect: "/404" }
];

const router = new Router({
  routes,
  mode: "history",
  base: "/", // process.env.BASE_URL
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // Give the anchor some time to load
      setTimeout(() => {
        const element = document.getElementById(to.hash.replace("#", ""));
        if (element && element.scrollIntoView) {
          element.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }, 1000);
      return { selector: to.hash };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  let title = "";
  if (to.meta.title) {
    title += `${to.meta.title} - `;
  }
  title += "ETHIQUABLE";
  document.title = title;
  let description =
    to.meta.description || "Die Infoseite für Fair Trade- und Bio-Produkte von ETHIQUABLE Deutschland eG.";
  description = description.replace(/\{(.+?)\}/g, (_, param) => {
    const key = param.trim();
    if (to.params[key]) {
      return to.params[key]
        .split("-")
        .map(word => {
          word = word.replace(/ae/g, "\u00e4").replace(/oe/g, "\u00f6").replace(/ue/g, "\u00fc");
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }
    return key;
  });
  document.querySelector('meta[name="description"]').setAttribute("content", description);
  document.querySelector('meta[property="og:description"]').setAttribute("content", description);
  document.querySelector('meta[itemprop="description"]').setAttribute("content", description);
  next();
});

export default router;
